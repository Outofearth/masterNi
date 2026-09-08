/**
 * SEO 知识页 — 数据 helper
 *
 * 14 主星 × 13 topic = 182 个独立 SEO URL。
 *
 * 原实现依赖 lib/ziwei/db-analysis.ts 的 STAR_DB 论断内容库，但该库被
 * 上游有意置空，导致 182 个落地页全部 404、sitemap 0 条。
 *
 * 现改为「聚合数据源」（B 方案）：每个星×宫位组合从项目已有真实资料聚合
 * （星曜档案 / 古籍原文 / 宫位论断 / 格局 / 倪师语录），零编造，恢复全量
 * 182 条静态路由。
 */

import type { TopicKey } from '@/lib/ziwei/db-analysis';
import { TOPIC_PALACE_NAME, TOPIC_LABEL } from '@/lib/ziwei/db-analysis';
import { getStarAggregate } from '@/lib/ziwei/star-aggregate';
import type { StarProfile, FuqiInsight } from '@/lib/ziwei/star-aggregate';
import type { KeywordContext } from '@/lib/classics/keywords';
import type { PatternEntry } from '@/lib/ziwei/pattern-catalog';

// 向后兼容：列表页/详情页仍从本文件导入星曜通性
export { STAR_BRIEF_SEO } from '@/lib/ziwei/star-aggregate';

export const ALL_STARS = [
  '紫微', '天机', '太阳', '武曲', '天同', '廉贞', '天府',
  '太阴', '贪狼', '巨门', '天相', '天梁', '七杀', '破军',
];

// 主星名 ↔ 拼音 slug 映射（URL 用 slug，避免中文 URL 在 Vercel/CDN 上的边界问题）
export const STAR_TO_SLUG: Record<string, string> = {
  '紫微': 'ziwei',
  '天机': 'tianji',
  '太阳': 'taiyang',
  '武曲': 'wuqu',
  '天同': 'tiantong',
  '廉贞': 'lianzhen',
  '天府': 'tianfu',
  '太阴': 'taiyin',
  '贪狼': 'tanlang',
  '巨门': 'jumen',
  '天相': 'tianxiang',
  '天梁': 'tianliang',
  '七杀': 'qisha',
  '破军': 'pojun',
};

export const SLUG_TO_STAR: Record<string, string> = Object.fromEntries(
  Object.entries(STAR_TO_SLUG).map(([k, v]) => [v, k])
);

export const ALL_TOPICS: TopicKey[] = [
  'overview', 'personality', 'love', 'career', 'wealth', 'health',
  'family', 'children', 'move', 'friends', 'home', 'spirit', 'parents',
];

export interface KnowledgeData {
  star: string;
  topic: TopicKey;
  topicLabel: string;
  palaceName: string;
  profile: StarProfile;
  fuqi: FuqiInsight | null;
  classics: KeywordContext[];
  classicsInPalace: KeywordContext[];
  patterns: PatternEntry[];
  niQuotes: { text: string; topic: string }[];
  exists: boolean;
}

export function getKnowledge(star: string, topic: TopicKey): KnowledgeData {
  const agg = getStarAggregate(star, topic);
  return {
    star,
    topic,
    topicLabel: TOPIC_LABEL[topic],
    palaceName: TOPIC_PALACE_NAME[topic],
    profile: agg.profile,
    fuqi: agg.fuqi,
    classics: agg.classics,
    classicsInPalace: agg.classicsInPalace,
    patterns: agg.patterns,
    niQuotes: agg.niQuotes,
    exists: true,
  };
}

/** 生成所有 14×13 组合（用于 generateStaticParams / sitemap） */
export function getAllKnowledgeRoutes() {
  const routes: { star: string; slug: string; topic: TopicKey }[] = [];
  for (const star of ALL_STARS) {
    for (const topic of ALL_TOPICS) {
      routes.push({ star, slug: STAR_TO_SLUG[star], topic });
    }
  }
  return routes;
}
