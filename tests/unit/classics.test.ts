import { describe, it, expect } from 'vitest';
import {
  ALL_BOOKS,
  searchClassics,
  getBookBySlug,
  getChapter,
} from '@/lib/classics';
import {
  getKeywordCloud,
  findParagraphsByKeyword,
  getLibrarySnapshot,
} from '@/lib/classics/keywords';
import { STAR_TO_SLUG, ALL_STARS } from '@/lib/seo/knowledge';

describe('古籍库 · 基础数据', () => {
  it('至少收录 1 本书且每本书都有 slug / 章节', () => {
    expect(ALL_BOOKS.length).toBeGreaterThan(0);
    for (const b of ALL_BOOKS) {
      expect(b.slug).toBeTruthy();
      expect(b.chapters.length).toBeGreaterThan(0);
    }
  });

  it('getBookBySlug 能取回同名书籍', () => {
    for (const b of ALL_BOOKS) {
      expect(getBookBySlug(b.slug)?.slug).toBe(b.slug);
    }
  });

  it('getChapter 对合法索引返回内容，对越界索引返回空', () => {
    const book = ALL_BOOKS[0];
    const r = getChapter(book.slug, 0);
    expect(r).toBeTruthy();
    expect(r!.chapter.paragraphs.length).toBeGreaterThan(0);
    expect(getChapter(book.slug, 9999)).toBeFalsy();
  });
});

describe('古籍库 · 全文检索', () => {
  it('检索主星名有命中', () => {
    const hits = searchClassics('紫微', 20);
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.length).toBeLessThanOrEqual(20);
  });

  it('检索结果指向的书与章节均存在', () => {
    for (const hit of searchClassics('紫微', 10)) {
      expect(getBookBySlug(hit.bookSlug)).toBeTruthy();
      expect(hit.paragraphId).toBeTruthy();
    }
  });

  it('检索无意义词不报错且返回空', () => {
    expect(() => searchClassics('zzzz不存在的词zzzz', 10)).not.toThrow();
    expect(searchClassics('zzzz不存在的词zzzz', 10)).toHaveLength(0);
  });
});

describe('古籍库 · 关键词云（A1）', () => {
  it('词云非空且按热度降序', () => {
    const cloud = getKeywordCloud();
    expect(cloud.length).toBeGreaterThan(0);
    for (let i = 1; i < cloud.length; i++) {
      expect(cloud[i - 1].count).toBeGreaterThanOrEqual(cloud[i].count);
    }
  });

  it('十四主星均能被反查出出处', () => {
    for (const star of ALL_STARS) {
      const ctx = findParagraphsByKeyword(star, 5);
      expect(ctx.length, `主星「${star}」应有古籍出处`).toBeGreaterThan(0);
    }
  });

  it('库快照各项计数为正', () => {
    const snap = getLibrarySnapshot();
    expect(snap.bookCount).toBeGreaterThan(0);
    expect(snap.chapterCount).toBeGreaterThan(0);
    expect(snap.paragraphCount).toBeGreaterThan(0);
  });
});

describe('A4 · 知识库 slug 映射完整性', () => {
  it('14 主星全部有 slug 且唯一', () => {
    expect(ALL_STARS).toHaveLength(14);
    const slugs = ALL_STARS.map(s => STAR_TO_SLUG[s]);
    for (const s of slugs) expect(s).toBeTruthy();
    expect(new Set(slugs).size).toBe(14);
  });
});
