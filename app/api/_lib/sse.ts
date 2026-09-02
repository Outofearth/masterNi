/**
 * SSE 输出工具
 * 前端约定（ChatPanel / InsightPanel / heming 页）：以行分隔的
 *   data: {"delta":{"text":"..."}}
 *   data: [DONE]
 */

const enc = new TextEncoder();

function sseEvent(delta: string): Uint8Array {
  return enc.encode(`data: ${JSON.stringify({ delta: { text: delta } })}\n\n`);
}

const DONE = enc.encode('data: [DONE]\n\n');

/** 把异步文本生成器包装为 SSE Response */
export function sseResponse(gen: AsyncGenerator<string>): Response {
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const delta of gen) {
          if (delta) controller.enqueue(sseEvent(delta));
        }
      } catch (err) {
        controller.enqueue(sseEvent(`（服务异常：${err instanceof Error ? err.message : String(err)}）`));
      } finally {
        controller.enqueue(DONE);
        controller.close();
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

/** 异步生成器辅助：把一次性文本转成小段流（模拟打字效果） */
export async function* textChunks(text: string, chunkSize = 24): AsyncGenerator<string> {
  const chars = Array.from(text);
  for (let i = 0; i < chars.length; i += chunkSize) {
    yield chars.slice(i, i + chunkSize).join('');
  }
}
