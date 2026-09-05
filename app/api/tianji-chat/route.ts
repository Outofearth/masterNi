/**
 * POST /api/tianji-chat
 * body: { context: TianjiContext, messages: [{role, content}] }
 * 响应：SSE 流，data: {"delta":{"text":"..."}} … data: [DONE]
 *
 * 行为：
 *  1. 用 context（卦象 / 模块 / 通用）构建倪师天纪体系 system prompt；
 *  2. 已配置 LLM → 流式调用；
 *  3. 未配置 Key / 调用失败 → 自动降级：流式返回该卦/模块的原始数据摘要（离线兜底）；
 *  4. 请求头 x-offline: 1 可强制走离线兜底。
 */

import { NextRequest } from 'next/server';
import { streamChat, readLlmConfig, type ChatMsg } from '../_lib/llm';
import { textChunks } from '../_lib/sse';
import {
  buildTianjiSystemPrompt,
  contextDigest,
  type TianjiContext,
} from '@/lib/nihai/chat';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const enc = new TextEncoder();

function sseEvent(delta: string): Uint8Array {
  return enc.encode(`data: ${JSON.stringify({ delta: { text: delta } })}\n\n`);
}

const DONE = enc.encode('data: [DONE]\n\n');

const OFFLINE_NOTE = '\n\n—— 以上为《天纪》资料库原文（AI 在线服务不可用时的离线兜底）。';

/** 简易裁剪，避免超长 context */
function clip(s: string, n = 2000): string {
  return s.length > n ? s.slice(0, n) + '…' : s;
}

export async function POST(req: NextRequest) {
  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: '请求体不是合法 JSON' }), { status: 400 });
  }

  const context: TianjiContext = payload?.context ?? { type: 'general' };
  const messages: { role?: string; content?: unknown }[] = Array.isArray(payload?.messages)
    ? payload.messages
    : [];
  const offline = req.headers.get('x-offline') === '1';

  const lastUser = [...messages].reverse().find(m => m.role === 'user')?.content;
  const question = typeof lastUser === 'string' ? clip(lastUser.trim(), 2000) : '';

  const history: ChatMsg[] = messages
    .filter((m): m is ChatMsg => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-12)
    .map(m => ({ role: m.role as ChatMsg['role'], content: clip(m.content as string, 2000) }));

  const systemPrompt = buildTianjiSystemPrompt(context);
  const digest = contextDigest(context);

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const write = (s: string) => { if (s) controller.enqueue(sseEvent(s)); };
      const finish = () => { controller.enqueue(DONE); controller.close(); };

      // ── 离线模式：直接给资料原文 ──
      if (offline) {
        write(`【《天纪》资料库 · 离线模式】\n\n`);
        for await (const c of textChunks(digest)) write(c);
        write(OFFLINE_NOTE);
        finish();
        return;
      }

      // ── 在线模式 ──
      const cfg = readLlmConfig();
      if (!cfg.enabled) {
        write(`未配置 AI（缺 API Key），以下为该${context.type === 'hexagram' ? '卦' : context.type === 'module' ? '模块' : '体系'}的资料原文：\n\n`);
        for await (const c of textChunks(digest)) write(c);
        write(OFFLINE_NOTE);
        finish();
        return;
      }

      const systemMsg: ChatMsg = { role: 'system', content: systemPrompt };
      const userMsg: ChatMsg = {
        role: 'user',
        content: question || '请结合当前内容，给出一次完整的倪海厦《天纪》体系解读。',
      };

      try {
        await streamChat({
          messages: [systemMsg, ...history, userMsg],
          temperature: 0.7,
          maxTokens: 2048,
          onText: (d) => write(d),
        });
      } catch (err) {
        write(err instanceof Error ? err.message : String(err));
        write('\n\n（AI 在线服务暂不可用，以下为《天纪》资料原文）\n\n');
        for await (const c of textChunks(digest)) write(c);
        write(OFFLINE_NOTE);
      } finally {
        finish();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
