/**
 * 天纪 AI 对话记忆层
 *
 * 用 localStorage 持久化用户的对话历史，
 * 重新打开页面 / 切换模块时仍能保留上下文。
 *
 * 设计：
 *  - 一个 contextKey（如 "hex-1"、"module-zhenjiu"、"general"）对应一段对话
 *  - 每段对话最多保留 N 条消息（默认 30 条）
 *  - 同时保存"用户偏好"：上次选择的对话风格 / 关注领域 / 多视角开关
 *  - 离线/隐私优先：所有数据仅写本地，永不外传
 */

const PREFIX = 'tianji-chat:';
const MAX_MESSAGES = 30;

export interface StoredMessage {
  role: 'user' | 'assistant';
  content: string;
  /** 时间戳 (epoch ms) */
  ts: number;
}

export interface UserPrefs {
  /** 偏好的解读风格 */
  style: 'classic' | 'clinical' | 'poetic';
  /** 多视角分析开关（一次给多种可能性） */
  multiPerspective: boolean;
  /** 关注的领域（用于偏好排序） */
  focusAreas: string[];
}

const DEFAULT_PREFS: UserPrefs = {
  style: 'classic',
  multiPerspective: false,
  focusAreas: [],
};

/** context 转 key —— 用于 localStorage 命名空间 */
export function contextToKey(ctx: { type: string; data?: unknown }): string {
  if (ctx.type === 'hexagram' && ctx.data && typeof ctx.data === 'object' && 'number' in ctx.data) {
    return `hex-${(ctx.data as { number: unknown }).number}`;
  }
  if (ctx.type === 'module' && ctx.data && typeof ctx.data === 'object' && 'slug' in ctx.data) {
    return `module-${(ctx.data as { slug: unknown }).slug}`;
  }
  if (ctx.type === 'divination') return 'qigua';
  return 'general';
}

/** 加载某段对话历史 */
export function loadHistory(key: string): StoredMessage[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr.slice(-MAX_MESSAGES);
  } catch {
    return [];
  }
}

/** 保存对话历史（自动截断到 MAX_MESSAGES） */
export function saveHistory(key: string, messages: StoredMessage[]): void {
  if (typeof window === 'undefined') return;
  try {
    const trimmed = messages.slice(-MAX_MESSAGES);
    window.localStorage.setItem(PREFIX + key, JSON.stringify(trimmed));
  } catch { /* quota / 隐私模式可能写入失败，吞掉 */ }
}

/** 清空某段对话 */
export function clearHistory(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch {}
}

/** 列举所有已存储的对话 key —— 用于"对话历史"侧栏 */
export function listAllKeys(): { key: string; count: number; lastTs: number }[] {
  if (typeof window === 'undefined') return [];
  const out: { key: string; count: number; lastTs: number }[] = [];
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (!k || !k.startsWith(PREFIX)) continue;
      const raw = window.localStorage.getItem(k);
      if (!raw) continue;
      const arr = JSON.parse(raw) as StoredMessage[];
      const last = arr.length > 0 ? arr[arr.length - 1].ts : 0;
      out.push({ key: k.slice(PREFIX.length), count: arr.length, lastTs: last });
    }
  } catch {}
  return out.sort((a, b) => b.lastTs - a.lastTs);
}

/** 加载用户偏好 */
export function loadPrefs(): UserPrefs {
  if (typeof window === 'undefined') return DEFAULT_PREFS;
  try {
    const raw = window.localStorage.getItem(PREFIX + 'prefs');
    if (!raw) return DEFAULT_PREFS;
    return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREFS;
  }
}

/** 保存用户偏好 */
export function savePrefs(prefs: UserPrefs): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(PREFIX + 'prefs', JSON.stringify(prefs));
  } catch {}
}

/** 把对话历史压缩成摘要（送入 system prompt） */
export function summarizeHistory(messages: StoredMessage[], maxLen = 800): string {
  if (messages.length === 0) return '';
  // 取最近 6 条 + 极简摘要
  const tail = messages.slice(-6);
  const text = tail
    .map(m => `${m.role === 'user' ? '问' : '答'}：${m.content.slice(0, 200)}`)
    .join('\n');
  return text.length > maxLen ? text.slice(-maxLen) : text;
}