/**
 * 样本数据检索（服务端）
 *
 * 在 Next.js 路由里按出生信息检索 51.8 万命盘样本（ziwei-samples-toolkit/samples-out）。
 * 样本根目录解析顺序：
 *   1) 环境变量 SAMPLE_DATA_ROOT
 *   2) ../ziwei-samples-toolkit/samples-out（相对项目根 ziwei-doushu）
 *   3) 本机 Windows 字面路径
 * 找不到样本时返回 null，路由会自动降级（结构摘要 + LLM 兜底）。
 */

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import readline from 'node:readline';

export interface BirthLike {
  year?: number;
  month?: number;
  day?: number;
  hour?: number;
  gender?: 'male' | 'female';
}

export interface SampleRecord {
  birthInfo: BirthLike & { longitude?: number };
  chart: Record<string, any>;
  topics: Record<string, string>;
  system?: string;
}

const TOPIC_ORDER = [
  'overview', 'personality', 'love', 'career', 'wealth', 'health',
  'family', 'children', 'move', 'friends', 'home', 'spirit', 'parents',
];

let cachedRoot: string | null | undefined;

function candidateRoots(): string[] {
  const list = [
    process.env.SAMPLE_DATA_ROOT,
    path.join(process.cwd(), '..', 'ziwei-samples-toolkit', 'samples-out'),
    path.join(process.cwd(), 'samples-out'),
    'T:/紫薇语料/ziwei-samples-toolkit/samples-out',
    'T:\\紫薇语料\\ziwei-samples-toolkit\\samples-out',
  ].filter((p): p is string => !!p);
  return list;
}

/** 返回可用样本根目录，或 null */
export function sampleRoot(): string | null {
  if (cachedRoot !== undefined) return cachedRoot;
  cachedRoot = candidateRoots().find(p => {
    try { return fs.existsSync(p); } catch { return false; }
  }) ?? null;
  return cachedRoot;
}

export function shardPath(root: string, year: number, month: number): string | null {
  const base = path.join(root, `year-${year}`, `${year}-${String(month).padStart(2, '0')}`);
  for (const ext of ['.jsonl.gz', '.jsonl']) {
    const p = base + ext;
    try { if (fs.existsSync(p)) return p; } catch { /* ignore */ }
  }
  return null;
}

async function* readLines(file: string): AsyncGenerator<string> {
  const stream = file.endsWith('.gz')
    ? fs.createReadStream(file).pipe(zlib.createGunzip())
    : fs.createReadStream(file);
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });
  for await (const line of rl) if (line.trim()) yield line;
}

function sameBirth(a: BirthLike | undefined, w: BirthLike): boolean {
  if (!a) return false;
  return a.year === w.year && a.month === w.month && a.day === w.day
    && a.hour === w.hour && a.gender === w.gender;
}

/** 精确命中一条样本；未命中或根目录不可用返回 null */
export async function findSample(
  birth: BirthLike,
): Promise<{ record: SampleRecord; file: string; line: number } | null> {
  const root = sampleRoot();
  if (!root || !birth || birth.year == null || birth.month == null
    || birth.day == null || birth.hour == null || !birth.gender) return null;
  const file = shardPath(root, birth.year, birth.month);
  if (!file) return null;
  let lineNo = 0;
  try {
    for await (const line of readLines(file)) {
      lineNo++;
      try {
        const rec = JSON.parse(line) as SampleRecord;
        if (sameBirth(rec.birthInfo, birth)) return { record: rec, file, line: lineNo };
      } catch { /* skip broken line */ }
    }
  } catch {
    return null;
  }
  return null;
}

/** 把样本 13 主题文本拼成一段（用于 LLM 上下文 / 离线兜底） */
export function topicsToText(topics: Record<string, string> | undefined, maxChars = 26_000): string {
  if (!topics) return '';
  const parts: string[] = [];
  let used = 0;
  for (const k of TOPIC_ORDER) {
    const v = topics[k];
    if (!v) continue;
    const block = `【${k}】\n${v}`;
    if (used + block.length > maxChars) {
      parts.push('（其余主题语料因上下文长度省略）');
      break;
    }
    parts.push(block);
    used += block.length;
  }
  return parts.join('\n\n');
}

/** 截断一段文本到前 N 字符（不切在代理对中间） */
export function clip(text: string, n: number): string {
  if (!text) return '';
  if (text.length <= n) return text;
  return Array.from(text).slice(0, n).join('');
}

/** 提取 chart 里的出生信息（兼容 sample 与本地 ziwei-doushu chart 结构） */
export function extractBirth(chart: any): BirthLike | null {
  const src = chart?.birthInfo ?? chart?.chart?.birthInfo;
  if (!src) return null;
  const num = (v: any) => (typeof v === 'number' ? v : typeof v === 'string' && v !== '' ? Number(v) : Number.NaN);
  const year = num(src.year), month = num(src.month), day = num(src.day), hour = num(src.hour);
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)
    || !Number.isInteger(hour) || (src.gender !== 'male' && src.gender !== 'female')) {
    return null;
  }
  return { year, month, day, hour, gender: src.gender };
}

/** 命盘 → 供 LLM 阅读的结构摘要文本 */
export function chartDigest(chart: any): string {
  if (!chart) return '';
  const l: any[] = chart.palaces ?? [];
  const lines = l.map((p: any) => {
    const majors = (p.stars ?? [])
      .filter((s: any) => s.type === 'major')
      .map((s: any) => {
        let t = s.name;
        if (s.siHua) t += `化${s.siHua}`;
        if (s.brightness) t += `(${s.brightness})`;
        return t;
      });
    const lucky = (p.stars ?? []).filter((s: any) => s.type !== 'major').map((s: any) => s.name).join('、');
    const starText = majors.length ? majors.join(' ') : '空宫(借对宫)';
    return `- ${p.name}：${starText}${lucky ? `（辅：${lucky}）` : ''}`;
  });
  return [
    `五行局：${chart.wuxingJuName ?? ''}；命宫/身宫地支：${chart.mingGongBranch ?? '?'}/${chart.shenGongBranch ?? '?'}`,
    ...lines,
  ].join('\n');
}

/** 某宫位的主星+四化（合盘/展示用） */
export function palaceStarText(chart: any, palaceName: string): string {
  const p = (chart?.palaces ?? []).find((x: any) => x.name === palaceName);
  if (!p) return '—';
  const majors = (p.stars ?? []).filter((s: any) => s.type === 'major');
  if (!majors.length) return '空宫';
  return majors.map((s: any) => s.name + (s.siHua ? `化${s.siHua}` : '')).join('、');
}
