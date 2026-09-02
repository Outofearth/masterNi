/**
 * POST /api/heming
 * body: { chartA, chartB, question? }
 * 响应：SSE 流 data: {"delta":{"text":"..."}} … data: [DONE]
 *
 * 行为与 /api/interpret 相同三档：
 *  在线 LLM（双方样本 13 主题语料作 grounding）→ 失败降级 →
 *  离线合盘文本（双方命宫/夫妻宫结构 + 样本感情语料摘录）。
 * 请求头 x-offline: 1 强制离线。
 */

import { NextRequest } from 'next/server';
import { extractBirth, findSample, topicsToText, clip, palaceStarText } from '../_lib/sampleStore';
import { streamChat, readLlmConfig, type ChatMsg } from '../_lib/llm';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const enc = new TextEncoder();

function sseEvent(delta: string): Uint8Array {
  return enc.encode(`data: ${JSON.stringify({ delta: { text: delta } })}\n\n`);
}
const DONE = enc.encode('data: [DONE]\n\n');

function sideSummary(tag: string, chart: any, topics?: Record<string, string> | null): string {
  const birth = extractBirth(chart);
  const who = birth
    ? `${tag}（${birth.year}-${String(birth.month).padStart(2, '0')}-${String(birth.day).padStart(2, '0')} 时辰${birth.hour} · ${birth.gender === 'female' ? '女' : '男'}）`
    : tag;
  const lines = [
    who,
    `- 命宫：${palaceStarText(chart, '命宫')}`,
    `- 夫妻宫：${palaceStarText(chart, '夫妻')}`,
    `- 官禄宫：${palaceStarText(chart, '官禄')}`,
    `- 财帛宫：${palaceStarText(chart, '财帛')}`,
    `- 疾厄宫：${palaceStarText(chart, '疾厄')}`,
  ];
  if (topics) {
    const love = clip(topics.love ?? '', 900);
    if (love) lines.push(`- 样本感情篇（节选）：${love.replace(/\s+/g, ' ')}`);
  }
  return lines.join('\n');
}

export async function POST(req: NextRequest) {
  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: '请求体不是合法 JSON' }), { status: 400 });
  }
  const chartA = payload?.chartA;
  const chartB = payload?.chartB;
  const question = typeof payload?.question === 'string' ? clip(payload.question.trim(), 2000) : '';
  if (!chartA || !chartB) {
    return new Response(JSON.stringify({ error: '缺少 chartA / chartB' }), { status: 400 });
  }
  const offline = req.headers.get('x-offline') === '1';

  const birthA = extractBirth(chartA);
  const birthB = extractBirth(chartB);
  const [sa, sb] = await Promise.all([birthA ? findSample(birthA) : null, birthB ? findSample(birthB) : null]);
  const topicsA = sa?.record.topics ?? null;
  const topicsB = sb?.record.topics ?? null;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const write = (s: string) => { if (s) controller.enqueue(sseEvent(s)); };
      const finish = () => { controller.enqueue(DONE); controller.close(); };

      const offlineText = () => {
        const parts: string[] = [];
        parts.push(`【合盘分析 · 离线模式】${question ? `\n\n追问：${question}` : ''}\n`);
        parts.push(sideSummary('甲方 A', chartA, topicsA));
        parts.push('');
        parts.push(sideSummary('乙方 B', chartB, topicsB));
        parts.push('');
        parts.push('【初步匹配提示】');
        const f1 = palaceStarText(chartA, '夫妻');
        const f2 = palaceStarText(chartB, '夫妻');
        parts.push(`甲方夫妻宫【${f1}】对乙方命盘的影响、乙方夫妻宫【${f2}】对甲方命盘的影响，`
          + '以及双方命宫星曜的互动，是合盘判断的核心（三方四正 + 宫干四化联动）。');
        parts.push('\n配置 AI API Key 后可获得 LLM 深度合盘分析（缘分匹配度、互补点、矛盾点、相处建议）。');
        return parts.join('\n');
      };

      if (offline) {
        write(offlineText());
        finish();
        return;
      }

      const cfg = readLlmConfig();
      if (!cfg.enabled) {
        write(offlineText());
        finish();
        return;
      }

      const corpusA = topicsA ? topicsToText(topicsA, 12_000) : '';
      const corpusB = topicsB ? topicsToText(topicsB, 12_000) : '';
      const system: ChatMsg = {
        role: 'system',
        content: [
          '你是"王多鱼AI"紫微斗数合盘专家，口径为倪海厦《天纪》体系。'
            + '根据双方命盘做缘分匹配度、感情走向、互补/矛盾点与相处建议的结构化分析（可用【小标题】分段）。'
            + '只使用倪海厦体系论法（三方四正、对宫借星、大限/流年四化用宫干，不用飞星派、三合派术语）。',
          ...(corpusA ? [`甲方样本语料（命中 ${birthA?.year}-${birthA?.month}-${birthA?.day} 时辰${birthA?.hour} ${birthA?.gender}）：\n${corpusA}`] : []),
          ...(corpusB ? [`乙方样本语料（命中 ${birthB?.year}-${birthB?.month}-${birthB?.day} 时辰${birthB?.hour} ${birthB?.gender}）：\n${corpusB}`] : []),
        ].join('\n\n'),
      };
      const user: ChatMsg = {
        role: 'user',
        content: `${sideSummary('甲方', chartA)}\n\n${sideSummary('乙方', chartB)}\n\n问题：${question || '请分析两人的缘分匹配度、感情走向、互补与矛盾点，并给出相处建议。'}`,
      };

      try {
        await streamChat({ messages: [system, user], temperature: 0.7, maxTokens: 2048, onText: write });
      } catch (err) {
        write(`（AI 在线服务暂不可用：${err instanceof Error ? err.message : String(err)}）\n\n`);
        write(offlineText());
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
