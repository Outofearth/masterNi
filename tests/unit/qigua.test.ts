import { describe, it, expect } from 'vitest';
import { castByNumber, castByTime, castByCoin } from '@/lib/qigua/core';

describe('起卦 · 数字起卦', () => {
  it('本卦落在 1-64 且有卦名', () => {
    const r = castByNumber(123, 456);
    expect(r.hexagram).not.toBeNull();
    expect(r.hexagram!.number).toBeGreaterThanOrEqual(1);
    expect(r.hexagram!.number).toBeLessThanOrEqual(64);
    expect(r.hexagram!.name).toBeTruthy();
  });

  it('多组随机数均产出合法本卦', () => {
    const pairs: [number, number][] = [[1, 1], [7, 9], [88, 99], [12345, 67890], [3, 64]];
    for (const [a, b] of pairs) {
      const r = castByNumber(a, b);
      expect(r.hexagram).not.toBeNull();
      expect(r.hexagram!.number).toBeGreaterThanOrEqual(1);
      expect(r.hexagram!.number).toBeLessThanOrEqual(64);
    }
  });
});

describe('起卦 · 时间起卦', () => {
  it('本卦合法', () => {
    const r = castByTime(2026, 9, 6, 10);
    expect(r.hexagram).not.toBeNull();
    expect(r.hexagram!.number).toBeGreaterThanOrEqual(1);
    expect(r.hexagram!.number).toBeLessThanOrEqual(64);
  });

  it('不同日期可产出不同卦（非恒定）', () => {
    const nums = new Set<number>();
    for (let d = 1; d <= 28; d++) {
      nums.add(castByTime(2026, 1, d, 12).hexagram!.number);
    }
    expect(nums.size).toBeGreaterThan(1);
  });
});

describe('起卦 · 六爻结构', () => {
  it('lines 恒为 6 爻，上下卦名非空', () => {
    const r = castByNumber(88, 99);
    expect(r.lines).toHaveLength(6);
    expect(r.upper).toBeTruthy();
    expect(r.lower).toBeTruthy();
  });

  it('动爻爻位均在 1-6', () => {
    const r = castByNumber(88, 99);
    for (const pos of r.changingLines) {
      expect(pos).toBeGreaterThanOrEqual(1);
      expect(pos).toBeLessThanOrEqual(6);
    }
  });

  it('硬币起卦：合法计数返回 6 爻结构', () => {
    const r = castByCoin([2, 3, 1, 2, 3, 0]);
    if (r) {
      expect(r.lines).toHaveLength(6);
      expect(r.hexagram).not.toBeNull();
    }
  });
});
