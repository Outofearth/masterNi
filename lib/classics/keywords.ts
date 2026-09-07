/**
 * 古籍关键词热度词云
 *
 * 从 ALL_BOOKS 全集中统计预设关键词的出现次数 + 提供按书/按章节的下钻
 *
 * 关键词词典 = 14 主星 + 12 宫位 + 四化 + 常见格局名 + 重要术语
 */

import { ALL_BOOKS, TOTAL_PARAGRAPHS } from './index';
import type { Book } from './types';

export interface KeywordDef {
  /** 关键词（用于匹配的字符串，可为单字/词组） */
  text: string;
  /** 关键词类目（主星/宫位/四化/格局/术语） */
  category: '主星' | '宫位' | '四化' | '格局' | '术语';
  /** 关键词释义（短） */
  brief: string;
}

/** 关键词词典 —— 14 主星 + 12 宫位 + 四化 + 常见格局名 + 重要术语 */
export const KEYWORD_DICT: KeywordDef[] = [
  // 14 主星
  { text: '紫微', category: '主星', brief: '帝座主星 · 尊贵独立' },
  { text: '天府', category: '主星', brief: '南斗令星 · 财库稳重' },
  { text: '太阳', category: '主星', brief: '阳刚主星 · 官贵慷慨' },
  { text: '太阴', category: '主星', brief: '柔美主星 · 财富阴柔' },
  { text: '天机', category: '主星', brief: '智慧主星 · 机变谋略' },
  { text: '天同', category: '主星', brief: '温和主星 · 享福随缘' },
  { text: '天梁', category: '主星', brief: '荫护主星 · 医药长辈' },
  { text: '天相', category: '主星', brief: '辅佐主星 · 行政印绶' },
  { text: '武曲', category: '主星', brief: '财富主星 · 刚毅果断' },
  { text: '贪狼', category: '主星', brief: '欲望主星 · 桃花多才' },
  { text: '巨门', category: '主星', brief: '口舌主星 · 是非善辩' },
  { text: '廉贞', category: '主星', brief: '才艺主星 · 刑囚桃花' },
  { text: '七杀', category: '主星', brief: '将星 · 果决孤克' },
  { text: '破军', category: '主星', brief: '开创主星 · 变动破坏' },

  // 12 宫位
  { text: '命宫', category: '宫位', brief: '一身根本 · 先天格局' },
  { text: '身宫', category: '宫位', brief: '后天归宿 · 一生效力' },
  { text: '兄弟宫', category: '宫位', brief: '兄弟情谊 · 平辈关系' },
  { text: '夫妻宫', category: '宫位', brief: '配偶婚恋 · 感情归宿' },
  { text: '子女宫', category: '宫位', brief: '子女状况 · 晚辈缘' },
  { text: '财帛宫', category: '宫位', brief: '理财能力 · 财富来源' },
  { text: '疾厄宫', category: '宫位', brief: '健康状况 · 体质强弱' },
  { text: '迁移宫', category: '宫位', brief: '外出发展 · 人际广度' },
  { text: '交友宫', category: '宫位', brief: '人际关系 · 朋友质量' },
  { text: '官禄宫', category: '宫位', brief: '事业成就 · 工作状况' },
  { text: '田宅宫', category: '宫位', brief: '家宅产业 · 居住环境' },
  { text: '福德宫', category: '宫位', brief: '精神生活 · 福禄享受' },
  { text: '父母宫', category: '宫位', brief: '父母长辈 · 遗传渊源' },

  // 四化
  { text: '化禄', category: '四化', brief: '财禄所归 · 主吉' },
  { text: '化权', category: '四化', brief: '权柄在握 · 主吉' },
  { text: '化科', category: '四化', brief: '名声显达 · 主吉' },
  { text: '化忌', category: '四化', brief: '执念所聚 · 主凶' },

  // 常见格局
  { text: '杀破狼', category: '格局', brief: '七杀破军贪狼 三方会照' },
  { text: '机月同梁', category: '格局', brief: '天机太阴天同天梁 善营' },
  { text: '紫府同宫', category: '格局', brief: '紫微天府同入命宫' },
  { text: '七杀朝斗', category: '格局', brief: '七杀仰斗 · 大将之格' },
  { text: '双禄朝垣', category: '格局', brief: '禄存化禄双临 · 大富' },
  { text: '三奇加会', category: '格局', brief: '化禄化权化科 三奇同宫' },
  { text: '君臣庆会', category: '格局', brief: '紫微居子午 · 辅弼同宫' },
  { text: '火贵格', category: '格局', brief: '廉贞火铃同宫' },
  { text: '马头带箭', category: '格局', brief: '擎羊在迁移 · 离乡发达' },
  { text: '铃昌陀武', category: '格局', brief: '贪火昌陀武 财官双美' },
  { text: '日月并明', category: '格局', brief: '太阳太阴同宫 · 大贵' },
  { text: '巨日同宫', category: '格局', brief: '巨门太阳对照 · 辩才' },
  { text: '廉贞破军', category: '格局', brief: '廉破同宫 · 乱世英雄' },

  // 重要术语
  { text: '庙旺', category: '术语', brief: '主星入庙 · 吉力增强' },
  { text: '落陷', category: '术语', brief: '主星落陷 · 吉力减弱' },
  { text: '三方四正', category: '术语', brief: '看格局的会照方式' },
  { text: '四化', category: '术语', brief: '化禄权科忌 · 动态吉凶' },
  { text: '大限', category: '术语', brief: '十年一运 · 阶段性运势' },
  { text: '流年', category: '术语', brief: '当年运势 · 短期波动' },
  { text: '小限', category: '术语', brief: '流月流日 · 微观时序' },
  { text: '空宫', category: '术语', brief: '无主星落入的宫位' },
  { text: '飞星', category: '术语', brief: '大限流年四化飞布' },
  { text: '纳音', category: '术语', brief: '五行分金 · 深层格局' },
];

/** 关键词热度项（带分类统计） */
export interface KeywordHeat {
  text: string;
  category: KeywordDef['category'];
  brief: string;
  /** 全集出现次数 */
  count: number;
  /** 涉及古籍数 */
  bookCount: number;
}

/** 全关键词热度统计 */
export function getKeywordCloud(): KeywordHeat[] {
  // 预统计每本书的词出现次数（避免重复扫描段落）
  const perBook = new Map<string, Map<string, number>>();

  for (const book of ALL_BOOKS) {
    const text = book.chapters
      .flatMap(c => c.paragraphs.map(p => p.text))
      .join('\n');
    const inner = new Map<string, number>();
    for (const k of KEYWORD_DICT) {
      // 朴素 substring 计数
      let cnt = 0;
      let i = 0;
      while ((i = text.indexOf(k.text, i)) !== -1) {
        cnt++;
        i += k.text.length;
      }
      if (cnt > 0) inner.set(k.text, cnt);
    }
    perBook.set(book.slug, inner);
  }

  // 汇总
  return KEYWORD_DICT
    .map(k => {
      let count = 0;
      let bookCount = 0;
      perBook.forEach((m) => {
        const c = m.get(k.text) ?? 0;
        count += c;
        if (c > 0) bookCount += 1;
      });
      return { text: k.text, category: k.category, brief: k.brief, count, bookCount };
    })
    .filter(x => x.count > 0)
    .sort((a, b) => b.count - a.count);
}

/** 按书分组的关键段落 —— 单书的前 N 个高亮关键词 */
export function getKeywordsForBook(bookSlug: string, topN = 10): KeywordHeat[] {
  const book = ALL_BOOKS.find(b => b.slug === bookSlug);
  if (!book) return [];

  const text = book.chapters
    .flatMap(c => c.paragraphs.map(p => p.text))
    .join('\n');

  return KEYWORD_DICT
    .map(k => {
      let cnt = 0;
      let i = 0;
      while ((i = text.indexOf(k.text, i)) !== -1) {
        cnt++;
        i += k.text.length;
      }
      return { text: k.text, category: k.category, brief: k.brief, count: cnt, bookCount: 1 };
    })
    .filter(x => x.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);
}

/** 给定关键词 → 反查所在段落（精确锚点） */
export interface KeywordContext {
  book: Book;
  bookSlug: string;
  chapterIdx: number;
  chapterTitle: string;
  paragraphId: string;
  paragraphText: string;
}

/** 给关键词找出所在的所有段落（最多 limit 条） */
export function findParagraphsByKeyword(keyword: string, limit = 20): KeywordContext[] {
  const out: KeywordContext[] = [];
  for (const book of ALL_BOOKS) {
    book.chapters.forEach((chapter, chapterIdx) => {
      chapter.paragraphs.forEach(p => {
        if (p.text.indexOf(keyword) >= 0) {
          out.push({
            book,
            bookSlug: book.slug,
            chapterIdx,
            chapterTitle: chapter.title,
            paragraphId: p.id,
            paragraphText: p.text,
          });
        }
      });
    });
    if (out.length >= limit) return out;
  }
  return out;
}

/** 全集统计快照（给 /library 主页头部用） */
export function getLibrarySnapshot() {
  return {
    bookCount: ALL_BOOKS.length,
    chapterCount: ALL_BOOKS.reduce((s, b) => s + b.chapters.length, 0),
    paragraphCount: TOTAL_PARAGRAPHS,
    keywordCount: KEYWORD_DICT.length,
  };
}