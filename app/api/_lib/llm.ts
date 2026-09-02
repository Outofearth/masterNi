/**
 * LLM 客户端（OpenAI 兼容协议 · SSE 流式）
 * 配置沿用仓库 .env.example 约定：
 *   AI_PROVIDER=deepseek | mimo | 其他
 *   DEEPSEEK_API_KEY / MIMO_API_KEY / AI_API_KEY
 *   DEEPSEEK_BASE_URL / MIMO_BASE_URL / AI_BASE_URL
 *   DEEPSEEK_MODEL / MIMO_MODEL / AI_MODEL
 */

export interface LlmConfig {
  enabled: boolean;
  label: string;
  baseUrl: string;
  apiKey: string;
  model: string;
}

function pick(...vals: Array<string | undefined>): string {
  for (const v of vals) {
    if (v && v.trim()) return v.trim();
  }
  return '';
}

export function readLlmConfig(): LlmConfig {
  const provider = (process.env.AI_PROVIDER ?? 'deepseek').trim().toLowerCase();
  const env = process.env;

  let baseUrl = '';
  let apiKey = '';
  let model = '';
  let label = provider;

  if (provider === 'deepseek') {
    apiKey = pick(env.DEEPSEEK_API_KEY, env.AI_API_KEY);
    baseUrl = pick(env.DEEPSEEK_BASE_URL, 'https://api.deepseek.com');
    model = pick(env.DEEPSEEK_MODEL, env.AI_MODEL, 'deepseek-chat');
  } else if (provider === 'mimo') {
    apiKey = pick(env.MIMO_API_KEY, env.AI_API_KEY);
    baseUrl = pick(env.MIMO_BASE_URL, env.AI_BASE_URL, '');
    model = pick(env.MIMO_MODEL, env.AI_MODEL, 'mimo-chat');
  } else {
    apiKey = pick(env.AI_API_KEY, env.DEEPSEEK_API_KEY);
    baseUrl = pick(env.AI_BASE_URL, env.DEEPSEEK_BASE_URL, '');
    model = pick(env.AI_MODEL, env.DEEPSEEK_MODEL, 'deepseek-chat');
    label = pick(env.AI_PROVIDER, 'custom');
  }

  baseUrl = baseUrl.replace(/\/+$/, '');
  const enabled = !!(apiKey && baseUrl && model);
  return { enabled, label, baseUrl, apiKey, model };
}

export interface ChatMsg { role: 'system' | 'user' | 'assistant'; content: string }

/**
 * 流式调用 chat completions。逐段回调 onText；返回累计文本。
 * 失败（网络 / 鉴权 / 非 2xx）会抛出异常，由调用方决定降级。
 */
export async function streamChat(opts: {
  messages: ChatMsg[];
  temperature?: number;
  maxTokens?: number;
  signal?: AbortSignal;
  onText: (delta: string) => void;
}): Promise<string> {
  const cfg = readLlmConfig();
  if (!cfg.enabled) throw new Error('LLM 未配置（缺 API Key / BaseURL / Model）');

  const url = `${cfg.baseUrl}/chat/completions`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cfg.apiKey}`,
    },
    body: JSON.stringify({
      model: cfg.model,
      messages: opts.messages,
      stream: true,
      temperature: opts.temperature ?? 0.6,
      max_tokens: opts.maxTokens ?? 2048,
    }),
    signal: opts.signal,
  });

  if (!res.ok || !res.body) {
    const detail = await res.text().catch(() => '');
    throw new Error(`LLM ${url} 返回 ${res.status} ${detail.slice(0, 300)}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let full = '';
  let done = false;

  while (!done) {
    const { value, done: readerDone } = await reader.read();
    if (readerDone) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';
    for (const raw of lines) {
      const line = raw.trim();
      if (!line.startsWith('data:')) continue;
      const data = line.slice(5).trim();
      if (data === '[DONE]') { done = true; break; }
      try {
        const json = JSON.parse(data);
        const delta: string | undefined = json?.choices?.[0]?.delta?.content;
        if (delta) {
          full += delta;
          opts.onText(delta);
        }
      } catch { /* 忽略非 JSON 行 */ }
    }
  }
  return full;
}
