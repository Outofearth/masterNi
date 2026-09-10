/**
 * 全站统一搜索索引
 *
 * 聚合所有资料库，提供一致化的 searchAll(query) 接口。
 * 搜索覆盖：
 - 紫微 14 主星（lib/ziwei/constants.ts）
 - 紫微名人（lib/ziwei/famous.ts）
 - 64 卦（lib/nihai/tianji.ts HEXAGRAMS）
 - 倪师语录（lib/nihai/tianji.ts TIANJI_QUOTES）
 - 堪舆条目（lib/nihai/tianji.ts FENGSHUI_ENTRIES）
 - 天纪 DVD（lib/nihai/tianji.ts TIANJI_EPISODES）
 - 天纪模块（lib/nihai/tianji.ts TIANJI_MODULES）
 - 人纪模块（lib/nihai/renji.ts RENJI_MODULES）
 - 人纪针灸经验（ACU_EXPERIENCES）
 - 人纪阴阳九针（TRANS_NEEDLING）
 - 人纪汉唐方剂（HANTANG_FORMULAS）
 - 人纪经方（CLASSIC_FORMULAS）
 - 地纪模块（lib/nihai/diji.ts DIJI_MODULES）
 - 古籍三本（lib/classics）
 */

import { STAR_DESCRIPTIONS } from '@/lib/ziwei/constants';
import { FAMOUS_PERSONS } from '@/lib/ziwei/famous';
import {
  HEXAGRAMS,
  TIANJI_QUOTES,
  FENGSHUI_ENTRIES,
  TIANJI_EPISODES,
  TIANJI_MODULES,
} from '@/lib/nihai/tianji';
import {
  RENJI_MODULES,
  ACU_EXPERIENCES,
  TRANS_NEEDLING,
  HANTANG_FORMULAS,
  CLASSIC_FORMULAS,
} from '@/lib/nihai/renji';
import { DIJI_MODULES } from '@/lib/nihai/diji';
import { ALL_BOOKS } from '@/lib/classics';

export type HitCategory =
  | '主星'
  | '名人'
  | '卦象'
  | '语录'
  | '堪舆'
  | 'DVD'
  | '天纪模块'
  | '人纪模块'
  | '针灸'
  | '阴阳九针'
  | '汉唐方剂'
  | '经方'
  | '地纪模块'
  | '古籍';

export interface SearchHit {
  category: HitCategory;
  title: string;
  /** 命中片段 */
  snippet: string;
  /** 跳转链接 */
  href: string;
  /** 命中分（用于排序） */
  score: number;
}

/* ─── 内置索引 ─── */

interface IndexedItem {
  cat: HitCategory;
  title: string;
  body: string;
  href: string;
  weight: number;
}

const INDEX: IndexedItem[] = (() => {
  const items: IndexedItem[] = [];

  // 紫微 14 主星
  for (const [name, desc] of Object.entries(STAR_DESCRIPTIONS)) {
    items.push({
      cat: '主星',
      title: `${name}（紫微主星）`,
      body: typeof desc === 'string' ? desc : JSON.stringify(desc),
      href: `/knowledge/${encodeURIComponent(name)}`,
      weight: 10,
    });
  }

  // 紫微名人
  for (const p of FAMOUS_PERSONS) {
    items.push({
      cat: '名人',
      title: `${p.name}（${p.category}）`,
      body: `${p.description ?? ''} ${p.notable ?? ''}`,
      href: '/knowledge',
      weight: 6,
    });
  }

  // 64 卦
  for (const h of HEXAGRAMS) {
    items.push({
      cat: '卦象',
      title: `${h.name}（${h.composition}）`,
      body: `${h.meaning ?? ''} ${h.niInterpretation ?? ''} ${h.divination ?? ''}`,
      href: `/tianji/yijing/${h.number}`,
      weight: 10,
    });
  }

  // 倪师语录
  for (const q of TIANJI_QUOTES) {
    items.push({
      cat: '语录',
      title: `${q.topic}·倪师语录`,
      body: q.text,
      href: '/tianji',
      weight: 5,
    });
  }

  // 堪舆条目
  for (const e of FENGSHUI_ENTRIES) {
    items.push({
      cat: '堪舆',
      title: e.title,
      body: `${e.description ?? ''} ${(e.keyPoints ?? []).join(' ')}`,
      href: '/tianji/kanyu',
      weight: 7,
    });
  }

  // 天纪 DVD
  for (const ep of TIANJI_EPISODES) {
    items.push({
      cat: 'DVD',
      title: `天纪 DVD ${ep.dvd} 集`,
      body: `${ep.firstHalf} ${ep.secondHalf} ${(ep.highlights ?? []).join(' ')}`,
      href: '/tianji',
      weight: 4,
    });
  }

  // 天纪模块
  for (const m of TIANJI_MODULES) {
    items.push({
      cat: '天纪模块',
      title: m.name ?? '',
      body: `${m.subtitle ?? ''} ${m.description ?? ''} ${(m.keywords ?? []).join(' ')}`,
      href: `/tianji/${m.slug}`,
      weight: 8,
    });
  }

  // 人纪模块
  for (const m of RENJI_MODULES) {
    items.push({
      cat: '人纪模块',
      title: m.name ?? '',
      body: `${m.subtitle ?? ''} ${m.description ?? ''}`,
      href: `/renji/${m.slug}`,
      weight: 8,
    });
  }

  // 人纪针灸经验
  for (const a of ACU_EXPERIENCES) {
    items.push({
      cat: '针灸',
      title: `${a.condition}（${a.acupoints}）`,
      body: `${a.category ?? ''} ${a.note ?? ''}`,
      // 深链：跳转后自动带入症状关键词并高亮命中
      href: `/renji/zhenjiu?symptom=${encodeURIComponent(a.condition)}`,
      weight: 6,
    });
  }

  // 阴阳九针
  for (const t of TRANS_NEEDLING) {
    items.push({
      cat: '阴阳九针',
      title: `${t.combo}（${t.indication}）`,
      body: `${t.supporting ?? ''} ${t.source ?? ''}`,
      href: '/renji',
      weight: 5,
    });
  }

  // 汉唐方剂
  for (const f of HANTANG_FORMULAS) {
    items.push({
      cat: '汉唐方剂',
      title: f.name ?? '',
      body: `${f.ingredients ?? ''} ${f.indication ?? ''} ${f.theory ?? ''}`,
      href: '/renji',
      weight: 6,
    });
  }

  // 经方
  for (const f of CLASSIC_FORMULAS) {
    items.push({
      cat: '经方',
      title: f.name ?? '',
      body: `${f.composition ?? ''} ${f.indication ?? ''}`,
      href: '/renji',
      weight: 6,
    });
  }

  // 地纪模块
  for (const m of DIJI_MODULES) {
    items.push({
      cat: '地纪模块',
      title: m.name ?? '',
      body: `${m.subtitle ?? ''} ${m.description ?? ''}`,
      href: `/diji/${m.slug}`,
      weight: 8,
    });
  }

  // 古籍三本
  for (const b of ALL_BOOKS) {
    const chapters = b.chapters ?? [];
    for (let ci = 0; ci < chapters.length; ci++) {
      const ch = chapters[ci];
      const paragraphs = ch.paragraphs ?? [];
      for (let pi = 0; pi < paragraphs.length; pi++) {
        const p = paragraphs[pi];
        items.push({
          cat: '古籍',
          title: `${b.title}·${p.id}`,
          body: `${p.text ?? ''} ${p.translation ?? ''} ${p.niNote ?? ''}`,
          href: `/library?book=${b.slug}&chapter=${ci}&para=${pi}`,
          weight: 6,
        });
      }
    }
  }

  return items;
})();

/* ─── 检索 ─── */

function scoreItem(item: IndexedItem, q: string): number {
  if (!q) return 0;
  const lc = q.toLowerCase();
  const titleLc = item.title.toLowerCase();
  const bodyLc = item.body.toLowerCase();

  let s = 0;
  if (titleLc.includes(lc)) s += 50;
  if (titleLc.startsWith(lc)) s += 20;
  if (bodyLc.includes(lc)) s += 10;

  // 字数相近加权
  const wordCount = q.length;
  if (titleLc.length <= wordCount * 3 && titleLc.includes(lc)) s += 15;

  // 长度惩罚（太长 body 命中要扣分）
  if (item.body.length > 1000) s *= 0.7;

  // 权重加成
  s *= item.weight / 6;

  return s;
}

function snippet(body: string, q: string, len = 60): string {
  if (!q) return body.slice(0, len);
  const idx = body.toLowerCase().indexOf(q.toLowerCase());
  if (idx < 0) return body.slice(0, len);
  const start = Math.max(0, idx - 10);
  const end = Math.min(body.length, idx + q.length + len);
  return (start > 0 ? '…' : '') + body.slice(start, end) + (end < body.length ? '…' : '');
}

export function searchAll(query: string, limit = 30): SearchHit[] {
  const q = query.trim();
  if (!q) return [];

  const scored = INDEX
    .map(item => ({ item, score: scoreItem(item, q) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map(({ item, score }) => ({
    category: item.cat,
    title: item.title,
    snippet: snippet(item.body, q),
    href: item.href,
    score: Math.round(score),
  }));
}

/** 按类别分组 */
export function groupByCategory(hits: SearchHit[]): Partial<Record<HitCategory, SearchHit[]>> {
  const out = {} as Partial<Record<HitCategory, SearchHit[]>>;
  for (const h of hits) {
    if (!out[h.category]) out[h.category] = [];
    out[h.category]!.push(h);
  }
  return out;
}

/** 索引统计 */
export const SEARCH_STATS = {
  totalItems: INDEX.length,
  totalCategories: new Set(INDEX.map(i => i.cat)).size,
  version: '2026-09-05',
};