import { describe, it, expect } from 'vitest';
import { generateChart, getLunarInfo } from '@/lib/ziwei/algorithm';
import type { BirthInfo } from '@/lib/ziwei/types';

/** 十四主星（紫微斗数固定 14 颗，每盘各出现一次） */
const MAJOR_STARS = [
  '紫微', '天机', '太阳', '武曲', '天同', '廉贞', '天府',
  '太阴', '贪狼', '巨门', '天相', '天梁', '七杀', '破军',
];

const CASES: BirthInfo[] = [
  { year: 1990, month: 5, day: 15, hour: 3, gender: 'male' },
  { year: 1985, month: 12, day: 31, hour: 11, gender: 'female' },
  { year: 2000, month: 1, day: 1, hour: 0, gender: 'male' },
  { year: 1972, month: 8, day: 8, hour: 7, gender: 'female' },
];

describe('generateChart · 排盘核心不变量', () => {
  it.each(CASES)('$year-$month-$day 时辰$hour：生成 12 宫且地支 0-11 全覆盖', (info) => {
    const chart = generateChart(info);
    expect(chart.palaces).toHaveLength(12);
    const branches = chart.palaces.map(p => p.branch).sort((a, b) => a - b);
    expect(branches).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  });

  it.each(CASES)('$year 盘：主星恰好 14 颗、无重复、均在十四主星内', (info) => {
    const chart = generateChart(info);
    const majors = chart.palaces.flatMap(p =>
      p.stars.filter(s => s.type === 'major').map(s => s.name)
    );
    expect(majors).toHaveLength(14);
    expect(new Set(majors).size).toBe(14);
    for (const name of majors) {
      expect(MAJOR_STARS).toContain(name);
    }
  });

  it.each(CASES)('$year 盘：命宫 / 身宫 / 紫微位 地支均合法', (info) => {
    const chart = generateChart(info);
    for (const v of [chart.mingGongBranch, chart.shenGongBranch, chart.ziweiPos]) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(11);
      expect(Number.isInteger(v)).toBe(true);
    }
  });

  it.each(CASES)('$year 盘：12 段大限，每段起止年龄合法', (info) => {
    const chart = generateChart(info);
    expect(chart.daXians).toHaveLength(12);
    for (const dx of chart.daXians) {
      expect(dx.startAge).toBeGreaterThan(0);
      expect(dx.endAge).toBeGreaterThanOrEqual(dx.startAge);
    }
  });

  it.each(CASES)('$year 盘：五行局为 2-6 且有中文名', (info) => {
    const chart = generateChart(info);
    expect([2, 3, 4, 5, 6]).toContain(chart.wuxingJu);
    expect(chart.wuxingJuName).toBeTruthy();
  });

  it('同一生辰重复排盘结果一致（纯函数、无随机）', () => {
    const a = generateChart(CASES[0]);
    const b = generateChart(CASES[0]);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it('空宫标记与借宫信息自洽', () => {
    const chart = generateChart(CASES[0]);
    for (const p of chart.palaces) {
      const hasMajor = p.stars.some(s => s.type === 'major');
      if (p.isEmpty) {
        expect(hasMajor).toBe(false);
        expect(p.borrowedFromBranch).toBe((p.branch + 6) % 12);
      }
      if (p.oppositeBranch !== undefined) {
        expect(p.oppositeBranch).toBe((p.branch + 6) % 12);
      }
    }
  });
});

describe('getLunarInfo · 公历转农历', () => {
  it('返回字段齐全且取值合法', () => {
    const info = getLunarInfo(1990, 5, 15);
    expect(info.lunarYear).toBeGreaterThan(1900);
    expect(Math.abs(info.lunarMonth)).toBeGreaterThanOrEqual(1);
    expect(Math.abs(info.lunarMonth)).toBeLessThanOrEqual(12);
    expect(info.lunarDay).toBeGreaterThanOrEqual(1);
    expect(info.lunarDay).toBeLessThanOrEqual(30);
    expect(typeof info.isLeapMonth).toBe('boolean');
  });

  it('跨年边界不崩溃（12/31 与 1/1）', () => {
    expect(() => getLunarInfo(1985, 12, 31)).not.toThrow();
    expect(() => getLunarInfo(2000, 1, 1)).not.toThrow();
  });
});
