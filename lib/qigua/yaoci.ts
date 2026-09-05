/**
 * 动爻 / 变卦 / 互卦 解读引擎
 *
 * 倪师解卦思路：
 *   本卦看当下之象 → 动爻看变化之机 → 变卦看事之结果 → 互卦看事之内在
 *
 * 说明：
 *   本项目未收录《周易》384 爻辞原文，故采用「爻位时义 + 卦象取象 + 动变之理」
 *   三合一的方式合成断语，符合倪师「善易者不占」「取象比类」的讲法，
 *   而非简单套用固定爻辞。
 */

import type { Hexagram } from '../nihai/types';
import type { Yao, DivinationResult } from './core';

// ─── 六爻时位通义 ──────────────────────────────────────
export interface YaoPosition {
  pos: number;
  name: string;
  /** 爻位象征 */
  symbol: string;
  /** 事情阶段 */
  phase: string;
  /** 爻位通性（源自《系辞》「二多誉、三多凶、四多惧、五多功」） */
  nature: string;
  /** 处此位之要义 */
  advice: string;
}

export const YAO_POSITIONS: YaoPosition[] = [
  {
    pos: 1,
    name: '初爻',
    symbol: '根基',
    phase: '事之始',
    nature: '潜藏勿用',
    advice: '初始阶段，力量未充，宜蓄养待时，不宜轻举妄动',
  },
  {
    pos: 2,
    name: '二爻',
    symbol: '内中',
    phase: '事之进',
    nature: '多誉得中',
    advice: '居内卦之中，与五爻相应，得中正之道，宜稳步推进',
  },
  {
    pos: 3,
    name: '三爻',
    symbol: '下极',
    phase: '事之危',
    nature: '多凶过刚',
    advice: '处下卦之极，进退两难之地，宜戒慎恐惧，不可冒进',
  },
  {
    pos: 4,
    name: '四爻',
    symbol: '近君',
    phase: '事之慎',
    nature: '多惧承刚',
    advice: '近五爻君位，伴君如伴虎，宜柔顺谨慎，不可锋芒太露',
  },
  {
    pos: 5,
    name: '五爻',
    symbol: '君位',
    phase: '事之成',
    nature: '多功得尊',
    advice: '居上卦之中，阳刚中正，为全卦之主，宜担当决断',
  },
  {
    pos: 6,
    name: '上爻',
    symbol: '终极',
    phase: '事之终',
    nature: '多亢知返',
    advice: '处卦之尽头，物极必反，宜知止收敛，功成身退',
  },
];

/** 取得某爻位通义 */
export function getYaoPosition(pos: number): YaoPosition {
  return YAO_POSITIONS[Math.max(0, Math.min(5, pos - 1))];
}

// ─── 得位 / 得中 判准 ──────────────────────────────────
/**
 * 得位：阳爻居奇位（初、三、五），阴爻居偶位（二、四、上）
 * 反之则为「失位」（不当位）
 */
export function isDeWei(pos: number, type: 'yang' | 'yin'): boolean {
  const isOdd = pos % 2 === 1;
  return type === 'yang' ? isOdd : !isOdd;
}

/** 得中：二爻、五爻分居上下卦之中 */
export function isDeZhong(pos: number): boolean {
  return pos === 2 || pos === 5;
}

// ─── 单爻解读 ──────────────────────────────────────────
export interface YaoReading {
  pos: number;
  title: string;
  symbol: string;
  nature: string;
  /** 得位 / 失位 */
  deweiText: string;
  /** 是否得位 */
  dewei: boolean;
  /** 是否得中 */
  dezhong: boolean;
  /** 是否动爻 */
  isChanging: boolean;
  /** 爻性描述 */
  yaoNature: string;
  /** 合成断语 */
  reading: string;
}

/** 合成单爻解读 */
export function buildYaoReading(hex: Hexagram, pos: number, yao: Yao): YaoReading {
  const p = getYaoPosition(pos);
  const dewei = isDeWei(pos, yao.type);
  const dezhong = isDeZhong(pos);
  const yaoNature = yao.type === 'yang' ? '阳刚' : '阴柔';

  // 得位断语
  let deweiText: string;
  if (dewei && dezhong) deweiText = '得位得中';
  else if (dewei) deweiText = '得位';
  else if (dezhong) deweiText = '失位得中';
  else deweiText = '失位';

  // 变化之理（老阳 9 阳极生阴，老阴 6 阴极生阳）
  let changeText: string;
  if (!yao.isChanging) {
    changeText = '静爻守常，此位暂无变动之机。';
  } else if (yao.value === 9) {
    changeText = '老阳发动，阳极生阴，刚太过则折，宜收敛锋芒、以柔济之。';
  } else {
    changeText = '老阴发动，阴极生阳，柔极则刚生，宜把握时机、由守转攻。';
  }

  const reading =
    `${p.name}处${hex.name}卦之${p.symbol}，${p.phase}。` +
    `以${yaoNature}居此，${deweiText}；${p.nature}，${p.advice}。` +
    changeText;

  return {
    pos,
    title: `${p.name} · ${p.symbol}`,
    symbol: p.symbol,
    nature: p.nature,
    deweiText,
    dewei,
    dezhong,
    isChanging: yao.isChanging,
    yaoNature,
    reading,
  };
}

/** 批量生成六爻解读（初 → 上） */
export function buildAllYaoReadings(hex: Hexagram, lines: Yao[]): YaoReading[] {
  return lines.map((y, i) => buildYaoReading(hex, i + 1, y));
}

// ─── 变卦 / 互卦 解读 ──────────────────────────────────
export interface RelationReading {
  title: string;
  subtitle: string;
  body: string;
}

/** 变卦解读：看事情结果 / 趋势 */
export function buildChangedReading(
  ben: Hexagram | null,
  changed: Hexagram | null,
  changingLines: number[],
): RelationReading | null {
  if (!ben) return null;

  if (changingLines.length === 0 || !changed || changed.number === ben.number) {
    return {
      title: '变卦 · 无动爻',
      subtitle: '静卦守常',
      body:
        `本卦${ben.name}六爻皆静，无动爻则无变化之机，` +
        `事情暂维持现状，吉凶依${ben.name}卦本义断之：${ben.divination}`,
    };
  }

  const names = ['初', '二', '三', '四', '五', '上'];
  const where = changingLines.map(n => `${names[n - 1]}爻`).join('、');

  return {
    title: `变卦 · ${changed.name}`,
    subtitle: `${where}发动`,
    body:
      `由${ben.name}（${ben.composition}）之${changed.name}（${changed.composition}），` +
      `${where}动而生变。本卦主当下：${ben.divination}；` +
      `变卦主结果：${changed.divination}。倪师断事，看变卦方知吉凶所归。`,
  };
}

/** 互卦解读：看事情内在 / 隐情 */
export function buildHuReading(
  ben: Hexagram | null,
  hu: Hexagram | null,
): RelationReading | null {
  if (!ben || !hu) return null;

  return {
    title: `互卦 · ${hu.name}`,
    subtitle: '事情内在',
    body:
      `互卦${hu.name}（${hu.composition}）由本卦二三四五爻交互而成，` +
      `揭示事情表象之下的真实底蕴：${hu.divination}。` +
      `倪师解卦重互体，盖因本卦为表、互卦为里，表里参看方不失偏。`,
  };
}

// ─── 宜 / 忌 提示 ──────────────────────────────────────
export interface Advice {
  yi: string[];
  ji: string[];
}

/**
 * 依据卦象生成宜忌
 * 判准：从卦的 niInterpretation / divination / meaning 中抓取行动指引关键词，
 *       再结合卦名归入通用宜忌框架。
 */
export function buildAdvice(hex: Hexagram | null): Advice | null {
  if (!hex) return null;

  const text = `${hex.meaning}${hex.niInterpretation}${hex.divination}`;
  const yi: string[] = [];
  const ji: string[] = [];

  // ── 宜 ──
  if (/(亨通|大吉|吉|通达|有利|顺势|宜.*为)/.test(text) && !/不吉|不利|凶/.test(text)) {
    yi.push('乘势而为，此卦气运正盛，宜主动出击');
  }
  if (/等待|待时|守|不宜.*进|勿用/.test(text)) {
    yi.push('耐心守候，待时机动，不宜急于求成');
  }
  if (/合作|亲附|结盟|同人|比/.test(text)) {
    yi.push('寻求助力，结盟合作，借他人之势成事');
  }
  if (/虚心|受教|学|启蒙|问/.test(text)) {
    yi.push('虚心求教，向有经验者请益');
  }
  if (/谨慎|小心|如履|戒/.test(text)) {
    yi.push('步步为营，凡事留三分余地');
  }
  if (/正|贞|守正|名分/.test(text)) {
    yi.push('守持正道，行事须有正当名分');
  }
  if (yi.length === 0) yi.push('静观其变，依卦象本义而行');

  // ── 忌 ──
  if (/不宜.*进|勿用|不可.*动|宜守/.test(text)) {
    ji.push('冒进妄动，条件未熟时强行推进');
  }
  if (/争|讼|斗|不宜争/.test(text)) {
    ji.push('与人争讼，宜和解退让，避正面冲突');
  }
  if (/亢|过|极|终凶/.test(text)) {
    ji.push('过刚易折，忌锋芒太露、贪功冒进');
  }
  if (/闭塞|不顺|否|困/.test(text)) {
    ji.push('强行突破，此际宜守不宜攻');
  }
  if (/小事.*成|力量不足|不足以/.test(text)) {
    ji.push('好高骛远，宜从小处着手、积小成大');
  }
  if (ji.length === 0) ji.push('背卦而行，逆势而动');

  return { yi, ji };
}

// ─── 综合解读（供结果页一次性取用） ─────────────────────
export interface FullReading {
  yaoReadings: YaoReading[];
  changed: RelationReading | null;
  hu: RelationReading | null;
  advice: Advice | null;
}

export function buildFullReading(result: DivinationResult): FullReading {
  const ben = result.hexagram;
  return {
    yaoReadings: ben ? buildAllYaoReadings(ben, result.lines) : [],
    changed: buildChangedReading(ben, result.changedHexagram, result.changingLines),
    hu: buildHuReading(ben, result.huHexagram),
    advice: buildAdvice(ben),
  };
}
