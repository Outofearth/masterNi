/**
 * 64 卦起卦算法（纯前端，无网络依赖）
 *
 * 支持三种传统起卦法：
 *   1. 铜钱起卦（3 文钱 6 次，手动记录正/反）
 *   2. 时间起卦（年 + 月 + 日 + 时）
 *   3. 数字起卦（2 个任意正整数）
 *
 * 爻值约定：
 *   6 = 老阴（×，动爻，阴）
 *   7 = 少阳（—，静爻，阳）
 *   8 = 少阴（--，静爻，阴）
 *   9 = 老阳（○，动爻，阳）
 *
 * 八卦先天序（伏羲）：
 *   乾 1，兑 2，离 3，震 4，巽 5，坎 6，艮 7，坤 8
 *
 * 二进制映射（初爻为最低位）：
 *   坤 000 = 0，艮 001 = 1，坎 010 = 2，巽 011 = 3，
 *   震 100 = 4，离 101 = 5，兑 110 = 6，乾 111 = 7
 */

import { HEXAGRAMS } from '../nihai/tianji';
import type { Hexagram } from '../nihai/types';

export type YaoValue = 6 | 7 | 8 | 9;
export type YaoType = 'yang' | 'yin';
export type Method = 'coin' | 'time' | 'number';

export interface Yao {
  value: YaoValue;
  label: string; // 6 老阴 / 7 少阳 / 8 少阴 / 9 老阳
  isChanging: boolean;
  type: YaoType;
}

export interface CoinMeta {
  method: 'coin';
  /** 每次 3 枚铜钱中“背面（阳）”的个数：0~3 */
  yangCounts: number[];
}

export interface TimeMeta {
  method: 'time';
  year: number;
  month: number;
  day: number;
  hour: number;
}

export interface NumberMeta {
  method: 'number';
  a: number;
  b: number;
}

export type DivinationMeta = CoinMeta | TimeMeta | NumberMeta;

export interface DivinationResult {
  lines: Yao[]; // 初爻 → 上爻（数组索引 0 → 5）
  upper: string; // 上卦名
  lower: string; // 下卦名
  hexagram: Hexagram | null; // 本卦
  changingLines: number[]; // 动爻爻位（1-6），从初到上
  changedLines: Yao[]; // 变卦六爻
  changedHexagram: Hexagram | null; // 变卦
  huLines: Yao[]; // 互卦六爻
  huHexagram: Hexagram | null; // 互卦
  meta: DivinationMeta;
  methodLabel: string;
}

// ─── 八卦映射 ───────────────────────────────────────────
const TRIGRAM_NAMES = ['坤', '艮', '坎', '巽', '震', '离', '兑', '乾'] as const;
type TrigramName = (typeof TRIGRAM_NAMES)[number];

/** 卦名 → 三位二进制（初爻低位） */
const TRIGRAM_BITS: Record<TrigramName, [number, number, number]> = {
  坤: [0, 0, 0],
  艮: [1, 0, 0],
  坎: [0, 1, 0],
  巽: [1, 1, 0],
  震: [0, 0, 1],
  离: [1, 0, 1],
  兑: [0, 1, 1],
  乾: [1, 1, 1],
};

/** 卦名 → 先天序数 1~8 */
const TRIGRAM_ORDER: Record<TrigramName, number> = {
  乾: 1, 兑: 2, 离: 3, 震: 4, 巽: 5, 坎: 6, 艮: 7, 坤: 8,
};

/** 三位爻数组（初爻低位） → 卦名 */
function bitsToTrigram(bits: [number, number, number]): TrigramName {
  const idx = bits[0] + bits[1] * 2 + bits[2] * 4;
  return TRIGRAM_NAMES[idx];
}

/** 先天序数 1~8 → 卦名 */
function orderToTrigram(order: number): TrigramName {
  const clamped = ((order - 1) % 8 + 8) % 8 + 1;
  const map: Record<number, TrigramName> = {
    1: '乾', 2: '兑', 3: '离', 4: '震',
    5: '巽', 6: '坎', 7: '艮', 8: '坤',
  };
  return map[clamped];
}

/** 根据爻值构建 Yao 对象 */
function makeYao(value: YaoValue): Yao {
  return {
    value,
    label: value === 6 ? '老阴' : value === 7 ? '少阳' : value === 8 ? '少阴' : '老阳',
    isChanging: value === 6 || value === 9,
    type: value === 7 || value === 9 ? 'yang' : 'yin',
  };
}

/** 将爻值数组转成 Yao 数组 */
function linesFromValues(values: YaoValue[]): Yao[] {
  return values.map(makeYao);
}

/** 从六爻中拆出上卦（4、5、6 爻） */
function getUpperTrigram(lines: Yao[]): TrigramName {
  const bits: [number, number, number] = [
    lines[3].type === 'yang' ? 1 : 0,
    lines[4].type === 'yang' ? 1 : 0,
    lines[5].type === 'yang' ? 1 : 0,
  ];
  return bitsToTrigram(bits);
}

/** 从六爻中拆出下卦（1、2、3 爻） */
function getLowerTrigram(lines: Yao[]): TrigramName {
  const bits: [number, number, number] = [
    lines[0].type === 'yang' ? 1 : 0,
    lines[1].type === 'yang' ? 1 : 0,
    lines[2].type === 'yang' ? 1 : 0,
  ];
  return bitsToTrigram(bits);
}

/** 根据上卦 + 下卦查找本卦 */
function findHexagram(upper: string, lower: string): Hexagram | null {
  return HEXAGRAMS.find(h => h.upper === upper && h.lower === lower) || null;
}

/** 计算变卦（动爻翻转） */
function changeLines(lines: Yao[]): Yao[] {
  return lines.map(y => {
    if (!y.isChanging) return y;
    const newValue: YaoValue = y.value === 9 ? 7 : 8;
    return makeYao(newValue);
  }) as Yao[];
}

/** 计算互卦（234 为下互，345 为上互） */
function makeHuLines(lines: Yao[]): Yao[] {
  // 互卦六爻：上互（原 345）放在上三爻，下互（原 234）放在下三爻
  // 结果数组 [初,二,三,四,五,上] = [原2,原3,原4,原3,原4,原5]
  return [
    lines[1], lines[2], lines[3],
    lines[2], lines[3], lines[4],
  ];
}

/** 用上下卦名 + 动爻构建完整结果 */
function buildResult(
  upper: TrigramName,
  lower: TrigramName,
  rawLines: YaoValue[],
  meta: DivinationMeta,
): DivinationResult {
  const lines = linesFromValues(rawLines);
  const changingLines = lines
    .map((y, i) => (y.isChanging ? i + 1 : 0))
    .filter((n): n is number => n !== 0);

  const changedLines = changeLines(lines);
  const huLines = makeHuLines(lines);

  return {
    lines,
    upper,
    lower,
    hexagram: findHexagram(upper, lower),
    changingLines,
    changedLines,
    changedHexagram: findHexagram(
      getUpperTrigram(changedLines),
      getLowerTrigram(changedLines),
    ),
    huLines,
    huHexagram: findHexagram(
      getUpperTrigram(huLines),
      getLowerTrigram(huLines),
    ),
    meta,
    methodLabel: methodLabel(meta.method),
  };
}

function methodLabel(method: Method): string {
  switch (method) {
    case 'coin': return '铜钱起卦';
    case 'time': return '时间起卦';
    case 'number': return '数字起卦';
  }
}

// ─── 铜钱起卦 ───────────────────────────────────────────
/** 铜钱背面（阳）个数 → 爻值 */
function yangCountToYao(count: number): YaoValue {
  switch (count) {
    case 0: return 6; // 老阴（3 字面）
    case 1: return 8; // 少阴（1 背 2 字）
    case 2: return 7; // 少阳（2 背 1 字）
    case 3: return 9; // 老阳（3 背）
    default: return 7;
  }
}

export function castByCoin(yangCounts: number[]): DivinationResult | null {
  if (yangCounts.length !== 6) return null;
  const raw = yangCounts.map(c => yangCountToYao(c));
  const lines = linesFromValues(raw);
  return buildResult(
    getUpperTrigram(lines),
    getLowerTrigram(lines),
    raw,
    { method: 'coin', yangCounts: [...yangCounts] },
  );
}

// ─── 时间起卦 ───────────────────────────────────────────
export function castByTime(year: number, month: number, day: number, hour: number): DivinationResult {
  const upperOrder = (year + month + day) % 8 || 8;
  const lowerOrder = (year + month + day + hour) % 8 || 8;
  const changing = (year + month + day + hour) % 6 || 6;

  const upper = orderToTrigram(upperOrder);
  const lower = orderToTrigram(lowerOrder);

  const upperBits = TRIGRAM_BITS[upper];
  const lowerBits = TRIGRAM_BITS[lower];

  // 六爻：初→上 = 下卦 bits + 上卦 bits
  const raw: YaoValue[] = [
    lowerBits[0] ? 7 : 8,
    lowerBits[1] ? 7 : 8,
    lowerBits[2] ? 7 : 8,
    upperBits[0] ? 7 : 8,
    upperBits[1] ? 7 : 8,
    upperBits[2] ? 7 : 8,
  ];

  // 设置动爻
  raw[changing - 1] = raw[changing - 1] === 7 ? 9 : 6;

  return buildResult(upper, lower, raw, { method: 'time', year, month, day, hour });
}

// ─── 数字起卦 ───────────────────────────────────────────
export function castByNumber(a: number, b: number): DivinationResult {
  const upperOrder = a % 8 || 8;
  const lowerOrder = b % 8 || 8;
  const changing = (a + b) % 6 || 6;

  const upper = orderToTrigram(upperOrder);
  const lower = orderToTrigram(lowerOrder);

  const upperBits = TRIGRAM_BITS[upper];
  const lowerBits = TRIGRAM_BITS[lower];

  const raw: YaoValue[] = [
    lowerBits[0] ? 7 : 8,
    lowerBits[1] ? 7 : 8,
    lowerBits[2] ? 7 : 8,
    upperBits[0] ? 7 : 8,
    upperBits[1] ? 7 : 8,
    upperBits[2] ? 7 : 8,
  ];

  raw[changing - 1] = raw[changing - 1] === 7 ? 9 : 6;

  return buildResult(upper, lower, raw, { method: 'number', a, b });
}

// ─── SVG / 可视化工具 ───────────────────────────────────
/** 卦象到 brief 说明 */
export function hexagramSummary(h: Hexagram | null): string {
  if (!h) return '卦象未明';
  return `${h.number}. ${h.name} · ${h.composition}：${h.meaning.slice(0, 30)}…`;
}

/** 用中文数字描述动爻 */
export function changingLinesText(lines: number[]): string {
  if (lines.length === 0) return '无动爻';
  const names = ['初', '二', '三', '四', '五', '上'];
  return `动爻：${lines.map(n => `${names[n - 1]}爻`).join('、')}`;
}

/** 随机数工具（铜钱模拟） */
export function randomCoin(): number {
  // 模拟 3 枚铜钱，每枚 P(背面=阳)=0.5
  let yang = 0;
  for (let i = 0; i < 3; i++) if (Math.random() < 0.5) yang++;
  return yang;
}

/** 模拟一卦（调试用） */
export function randomDivination(): DivinationResult {
  const counts = Array.from({ length: 6 }, () => randomCoin());
  return castByCoin(counts)!;
}
