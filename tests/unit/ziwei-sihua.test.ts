import { describe, it, expect } from 'vitest';
import {
  getSiHuaByStem,
  getYearStemIndex,
  getYearBranchIndex,
  buildStarSiHuaMap,
} from '@/lib/ziwei/sihua';

describe('四化 · 天干四化表', () => {
  it('十天干每个都恰好产出禄/权/科/忌四化', () => {
    for (let stem = 0; stem < 10; stem++) {
      const map = getSiHuaByStem(stem);
      const keys = Object.keys(map).sort();
      expect(keys).toEqual(['忌', '权', '科', '禄'].sort());
      for (const [sihua, starName] of Object.entries(map)) {
        expect(sihua).toBeTruthy();
        expect(typeof starName).toBe('string');
        expect(starName.length).toBeGreaterThan(0);
      }
    }
  });

  it('四化对应的四颗星互不相同', () => {
    for (let stem = 0; stem < 10; stem++) {
      const map = getSiHuaByStem(stem);
      const stars = Object.values(map);
      expect(new Set(stars).size).toBe(stars.length);
    }
  });

  it('buildStarSiHuaMap 是星名→四化的反向映射，条目数一致', () => {
    for (let stem = 0; stem < 10; stem++) {
      const bySihua = getSiHuaByStem(stem);
      const byStar = buildStarSiHuaMap(stem);
      expect(Object.keys(byStar)).toHaveLength(Object.keys(bySihua).length);
      for (const [sihua, star] of Object.entries(bySihua)) {
        expect(byStar[star]).toBe(sihua);
      }
    }
  });
});

describe('四化 · 干支索引', () => {
  it('天干索引恒在 0-9', () => {
    for (let y = 1900; y <= 2100; y++) {
      const i = getYearStemIndex(y);
      expect(i).toBeGreaterThanOrEqual(0);
      expect(i).toBeLessThanOrEqual(9);
    }
  });

  it('地支索引恒在 0-11', () => {
    for (let y = 1900; y <= 2100; y++) {
      const i = getYearBranchIndex(y);
      expect(i).toBeGreaterThanOrEqual(0);
      expect(i).toBeLessThanOrEqual(11);
    }
  });

  it('天干十年一循环、地支十二年一循环', () => {
    for (let y = 1940; y <= 2060; y += 7) {
      expect(getYearStemIndex(y + 10)).toBe(getYearStemIndex(y));
      expect(getYearBranchIndex(y + 12)).toBe(getYearBranchIndex(y));
    }
  });
});
