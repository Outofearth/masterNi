/**
 * lib/ziwei/star-aggregate.ts —— 星曜聚合数据层（B 方案）
 *
 * 背景：lib/ziwei/db-analysis.ts 的 STAR_DB 被上游有意置空，导致
 * 182 个 /knowledge/[star]/[topic] 落地页全部 404（0 条静态路由）。
 *
 * 本文件不撰写新论断，而是把项目里已有的真实资料聚合起来，让知识库
 * 从「空壳」变为「可检索、可学习」的聚合页：
 *   - 星曜档案  → STAR_DESCRIPTIONS（五行/性质/关键词）
 *   - 星曜简介  → STAR_BRIEF_SEO（一句通性）
 *   - 古籍原文  → findParagraphsByKeyword（原典出处，含宫位共现）
 *   - 宫位论断  → STAR_IN_FUQI_GU（夫妻宫，14 星全覆盖，含倪师原话）
 *   - 关联格局  → PATTERN_CATALOG（按 tags 过滤）
 *   - 倪师语录  → TIANJI_QUOTES（按星名/主题过滤）
 *
 * 原则：零编造。无料的宫位不伪造论断，只诚实提示「暂缺专门段落」。
 */

import { STAR_DESCRIPTIONS } from './constants';
import { STAR_IN_FUQI_GU } from './heming-knowledge';
import { findParagraphsByKeyword, type KeywordContext } from '@/lib/classics/keywords';
import { PATTERN_CATALOG, type PatternEntry } from './pattern-catalog';
import { TIANJI_QUOTES } from '@/lib/nihai/tianji';
import type { TopicKey } from './db-analysis';

// ── 14 主星一句话通性（原 lib/seo/knowledge.ts 的 STAR_BRIEF_SEO，迁入聚合层） ──
export const STAR_BRIEF_SEO: Record<string, string> = {
  '紫微': '紫微为帝星，主尊贵，化气为尊。落命主有领导气场、宜大平台高位。',
  '天机': '天机为智慧星，主善变机灵，化气为善。落命主聪明机变、宜辅佐策划。',
  '太阳': '太阳为男贵星，主名誉公务，化气为贵。落命主光明磊落、宜公职名声。',
  '武曲': '武曲为财星，主刚毅果决，化气为财。落命主理财能力强、宜实业金融。',
  '天同': '天同为福星，主温和享乐，化气为福。落命主性情温和、有福气。',
  '廉贞': '廉贞为次桃花星，文武兼备，化气为囚。落命主多才多艺、感情丰富。',
  '天府': '天府为南帝守财星，主稳重保守，化气为令。落命主品行端正、善守财库。',
  '太阴': '太阴为月亮富贵星，主田宅富贵，化气为富。落命主感情细腻、女命最吉。',
  '贪狼': '贪狼为桃花欲望星，多才多社交，化气为桃花。落命主多才艺、社交广。',
  '巨门': '巨门为是非口才星，主辩论传媒，化气为暗。落命主口才好、宜律师教师。',
  '天相': '天相为印星辅佐，主忠厚老实，化气为印。落命主品行端正、宜行政法务。',
  '天梁': '天梁为老人星荫星，善逢凶化吉，化气为荫。落命主慈悲善良、宜法律医学。',
  '七杀': '七杀为将星，主孤独果决冒险，化气为肃杀。落命主刚毅果决、宜军警创业。',
  '破军': '破军为破坏创新星，主六亲缘薄，化气为耗。落命主开创变动、宜技术专长。',
};

// ── topic → 宫位检索关键词（用于古籍共现过滤，比单字更精确） ──
export const PALACE_KEYWORDS: Record<TopicKey, string[]> = {
  overview:    ['命宫', '命垣', '守命'],
  personality: ['性情', '性格', '命宫'],
  love:        ['夫妻', '妻宫', '配偶', '婚姻'],
  career:      ['官禄', '事业', '仕途'],
  wealth:      ['财帛', '求财', '财富', '财星'],
  health:      ['疾厄', '身体', '病', '健康'],
  family:      ['兄弟', '手足'],
  children:    ['子女', '子息', '儿女'],
  move:        ['迁移', '出外', '出行', '远行'],
  friends:     ['仆役', '交友', '朋友', '部属'],
  home:        ['田宅', '家宅', '房产'],
  spirit:      ['福德', '精神', '心性'],
  parents:     ['父母', '双亲', '亲长'],
};

export interface StarProfile {
  star: string;
  element: string;   // 五行
  nature: string;    // 吉凶性质
  keywords: string;  // 关键词
  brief: string;     // 一句话通性
}

export interface FuqiInsight {
  summary: string;
  good: string;
  bad: string;
  spouse_traits: string;
  timing: string;
  ni_quote?: string;
}

export interface StarAggregate {
  star: string;
  profile: StarProfile;
  fuqi: FuqiInsight | null;          // 夫妻宫论断（仅 love topic 有值）
  classics: KeywordContext[];         // 该星全部古籍原文
  classicsInPalace: KeywordContext[]; // 该星 × 该宫位共现原文
  patterns: PatternEntry[];           // 关联格局
  niQuotes: { text: string; topic: string }[]; // 倪师语录
}

/** 星曜档案（五行/性质/关键词/通性）——14 星全覆盖 */
export function getStarProfile(star: string): StarProfile {
  const d = STAR_DESCRIPTIONS[star] ?? { keywords: '', nature: '', element: '' };
  return {
    star,
    element: d.element,
    nature: d.nature,
    keywords: d.keywords,
    brief: STAR_BRIEF_SEO[star] ?? '',
  };
}

/** 该星在古籍中的全部原文段落 */
export function getStarClassics(star: string, limit = 12): KeywordContext[] {
  return findParagraphsByKeyword(star, limit);
}

/** 该星 × 该宫位在古籍中的共现段落 */
export function getStarClassicsInPalace(star: string, topic: TopicKey): KeywordContext[] {
  const words = PALACE_KEYWORDS[topic] ?? [];
  return getStarClassics(star, 60).filter((p) =>
    words.some((w) => p.paragraphText.includes(w)),
  );
}

/** 关联格局（PATTERN_CATALOG 按 tags 精确过滤） */
export function getStarPatterns(star: string): PatternEntry[] {
  return PATTERN_CATALOG.filter((p) => p.tags.includes(star));
}

/** 夫妻宫论断（STAR_IN_FUQI_GU，14 星全覆盖，含倪师原话） */
export function getStarFuqiInsight(star: string): FuqiInsight | null {
  const v = STAR_IN_FUQI_GU[star];
  if (!v) return null;
  return {
    summary: v.summary,
    good: v.good,
    bad: v.bad,
    spouse_traits: v.spouse_traits,
    timing: v.timing,
    ni_quote: v.ni_quote,
  };
}

/** 倪师语录：先按星名匹配，再补「紫微斗数」通用语录 */
export function getStarNiQuotes(star: string): { text: string; topic: string }[] {
  const direct = TIANJI_QUOTES.filter((q) => q.text.includes(star));
  if (direct.length > 0) return direct;
  // 无星名直接命中时，返回「紫微斗数」主题的通用方法论语录
  return TIANJI_QUOTES.filter((q) => q.topic === '紫微斗数').slice(0, 5);
}

/** 聚合入口：一次性取该星 × 该宫位的全部真实资料 */
export function getStarAggregate(star: string, topic: TopicKey): StarAggregate {
  return {
    star,
    profile: getStarProfile(star),
    fuqi: topic === 'love' ? getStarFuqiInsight(star) : null,
    classics: getStarClassics(star),
    classicsInPalace: getStarClassicsInPalace(star, topic),
    patterns: getStarPatterns(star),
    niQuotes: getStarNiQuotes(star),
  };
}
