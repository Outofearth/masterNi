/**
 * POST /api/interpret
 * body: { chart, messages: [{role, content}] }
 * 响应：SSE 流，data: {"delta":{"text":"..."}} … data: [DONE]
 *
 * 行为：
 *  1. 从 chart.birthInfo 检索 51.8 万样本命中同命盘的 13 主题倪海厦解读；
 *  2. 命中 → 以样本语料作为 few-shot/grounding 交给 LLM 回答；未命中 → 只给排盘结构摘要；
 *  3. 未配置 Key / LLM 调用失败 → 自动降级：直接流式返回样本解读全文（离线兜底）；
 *  4. 请求头 x-offline: 1 可强制走离线兜底（纯本地样本检索，不调用大模型）。
 */

import { NextRequest } from 'next/server';
import { extractBirth, findSample, topicsToText, chartDigest, clip } from '../_lib/sampleStore';
import { streamChat, readLlmConfig, type ChatMsg } from '../_lib/llm';
import { textChunks } from '../_lib/sse';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const enc = new TextEncoder();

function sseEvent(delta: string): Uint8Array {
  return enc.encode(`data: ${JSON.stringify({ delta: { text: delta } })}\n\n`);
}

const DONE = enc.encode('data: [DONE]\n\n');

const FALLBACK_NOTE = '\n\n—— 以上为命盘样本库检索到的倪海厦体系基线解读（AI 在线服务不可用时的离线兜底）。';

export async function POST(req: NextRequest) {
  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: '请求体不是合法 JSON' }), { status: 400 });
  }

  const chart = payload?.chart;
  const messages: { role?: string; content?: unknown }[] = Array.isArray(payload?.messages)
    ? payload.messages
    : [];
  const birth = extractBirth(chart);
  const lastUser = [...messages].reverse().find(m => m.role === 'user')?.content;
  const question = typeof lastUser === 'string' ? clip(lastUser.trim(), 2000) : '';
  const offline = req.headers.get('x-offline') === '1';

  const history: ChatMsg[] = messages
    .filter((m): m is ChatMsg => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-12)
    .map(m => ({ role: m.role as ChatMsg['role'], content: clip(m.content as string, 2000) }));

  const found = birth ? await findSample(birth) : null;
  const corpus = found ? topicsToText(found.record.topics) : '';
  const digest = chartDigest(chart);

  const write = (controller: ReadableStreamDefaultController<Uint8Array>, s: string) => {
    if (s) controller.enqueue(sseEvent(s));
  };

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const finish = () => { controller.enqueue(DONE); controller.close(); };

      const sysParts: string[] = [
        '你是"王多鱼AI"紫微斗数平台（metisziwei.com）的 AI 命理师，口径严格遵循倪海厦《天纪》体系'
          + '（纳音五行局起盘、三方四正联动、对宫借星、大限四化用宫干、宫干自化、疾厄结合子午流注）。'
          + '语气专业、温和、结构清晰（可用【小标题】分段），避免宿命论绝对化表述。'
          + '不要使用三合派/飞星派等其他流派的术语。',
      ];
      if (found && corpus) {
        sysParts.push(
          '该命盘在倪海厦体系下有现成的 13 主题离线权威解读（来自紫微斗数开源样本数据集 v3.0，'
          + '来源 https://github.com/Renhuai123/ziwei-doushu）。你的回答必须与此口径保持一致，'
          + '可引用、归纳、展开，但不得与之自相矛盾：\n\n' + corpus,
        );
      } else {
        sysParts.push('该出生时间不在样本库（1924–1983 全覆盖）内，仅有排盘结构，请据结构谨慎作答：\n' + digest);
      }
      const systemMsg: ChatMsg = { role: 'system', content: sysParts.join('\n\n') };
      const userMsg: ChatMsg = {
        role: 'user',
        content: question || '请结合我的命盘，给出一次完整的倪海厦体系解读。',
      };

      // ── 离线模式：只做样本检索 ──
      if (offline) {
        if (found && corpus) {
          write(controller, `【样本基线解读 · 离线模式】（命中：${birth?.year}-${birth?.month}-${birth?.day} 时辰${birth?.hour} ${birth?.gender === 'female' ? '女' : '男'}）\n\n`);
          for await (const c of textChunks(corpus)) write(controller, c);
          write(controller, FALLBACK_NOTE);
        } else {
          write(controller, `未在样本库命中该命盘（数据覆盖 1924–1983）。以下为排盘结构摘要：\n\n${digest}\n\n`
            + '配置 AI API Key 可获得深度解读；或使用 ziwei-samples-toolkit 的检索工具查看同命盘样本。');
        }
        finish();
        return;
      }

      // ── 在线模式 ──
      const cfg = readLlmConfig();
      if (!cfg.enabled) {
        if (found && corpus) {
          for await (const c of textChunks(corpus)) write(controller, c);
          write(controller, FALLBACK_NOTE);
        } else {
          write(controller, `未配置 AI（缺 API Key），且该命盘未命中样本库。排盘结构如下：\n\n${digest}\n\n`
            + '请在 .env.local 填入 DEEPSEEK_API_KEY 后重试。');
        }
        finish();
        return;
      }

      try {
        await streamChat({
          messages: [systemMsg, ...history, userMsg],
          temperature: 0.7,
          maxTokens: 2048,
          onText: (d) => write(controller, d),
        });
      } catch (err) {
        write(controller, err instanceof Error ? err.message : String(err));
        if (found && corpus) {
          write(controller, '\n\n（AI 在线服务暂不可用，以下为样本库基线解读）\n\n');
          for await (const c of textChunks(corpus)) write(controller, c);
          write(controller, FALLBACK_NOTE);
        }
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
