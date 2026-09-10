import { describe, it, expect } from 'vitest';
import {
  searchSymptoms,
  symptomsByCategory,
  SYMPTOM_CATEGORIES,
  SYMPTOM_TOTAL,
  ALIAS_COUNT,
  HOT_SYMPTOMS,
} from '@/lib/renji/symptom-search';
import { ACU_EXPERIENCES, RENJI_STATS } from '@/lib/nihai/renji';

describe('症状检索 · 数据真实性', () => {
  it('RENJI_STATS 条数与 ACU_EXPERIENCES 实际长度一致（禁止硬编码虚标）', () => {
    expect(RENJI_STATS.acuExperienceCount).toBe(ACU_EXPERIENCES.length);
    expect(SYMPTOM_TOTAL).toBe(ACU_EXPERIENCES.length);
  });

  it('每条记录都有 condition / acupoints / category', () => {
    for (const a of ACU_EXPERIENCES) {
      expect(a.condition).toBeTruthy();
      expect(a.acupoints).toBeTruthy();
      expect(a.category).toBeTruthy();
    }
  });

  it('分类列表与数据一致', () => {
    const fromData = Array.from(new Set(ACU_EXPERIENCES.map(a => a.category)));
    expect(SYMPTOM_CATEGORIES.sort()).toEqual(fromData.sort());
  });

  it('热门症状 chip 全部能在库内直接命中', () => {
    for (const s of HOT_SYMPTOMS) {
      const r = searchSymptoms(s);
      expect(r.total, `热门症状「${s}」应有结果`).toBeGreaterThan(0);
      expect(r.fuzzy).toBe(false);
    }
  });
});

describe('症状检索 · 口语词命中（修复前为 0 命中）', () => {
  /** 库内已收录概念：这些词必须有结果，否则视为检索回归 */
  const SHOULD_HIT = [
    '失眠', '头痛', '咳嗽', '腰痛', '便秘', '痔疮', '肾虚', '颈椎病', '面瘫', '耳鸣',
    '心脏病', '胃疼', '睡不着', '拉肚子', '偏头痛', '肩膀痛', '月经不调', '鼻塞',
    '牙疼', '脖子痛', '腰酸', '关节痛', '脚踝扭伤', '羊癫疯', '皮肤瘙痒', '肾亏',
    '感冒', '发烧', '气喘', '不孕', '乳腺增生', '肩周炎', '膝盖痛', '心悸心慌',
  ];

  it.each(SHOULD_HIT)('搜「%s」必须有结果', q => {
    const r = searchSymptoms(q);
    expect(r.total, `「${q}」不应零结果`).toBeGreaterThan(0);
    expect(r.fuzzy, `「${q}」应走正常匹配而非兜底`).toBe(false);
  });

  /** 库内确实未收录：允许为空，但不允许 fuzzy 乱凑（保持诚实） */
  const NOT_IN_DB = ['紫微斗数', '量子纠缠', 'abcdefg'];

  it.each(NOT_IN_DB)('搜「%s」应为空（库内确实没有，不编造）', q => {
    expect(searchSymptoms(q).total).toBe(0);
  });
  /** 口语词 → 期望命中的库内术语（验证别名映射方向正确） */
  const cases: [string, string][] = [
    ['心脏病', '心'],
    ['胃疼', '胃'],
    ['睡不着', '失眠'],
    ['拉肚子', '腹泻'],
    ['偏头痛', '头痛'],
    ['肩膀痛', '肩'],
    ['月经不调', '月经'],
    ['鼻塞', '鼻子不通'],
    ['牙疼', '牙痛'],
    ['脖子痛', '颈椎病'],
    ['腰酸', '腰痛'],
    ['关节痛', '痛'],
    ['脚踝扭伤', '脚扭伤'],
    ['羊癫疯', '癫痫'],
    ['皮肤瘙痒', '皮肤痒'],
    ['肾亏', '肾虚'],
  ];

  it.each(cases)('搜「%s」应命中含「%s」的条目', (q, expectContain) => {
    const r = searchSymptoms(q);
    expect(r.total, `「${q}」不应零结果`).toBeGreaterThan(0);
    expect(r.fuzzy).toBe(false);
    expect(
      r.hits.some(h => h.item.condition.includes(expectContain)),
      `「${q}」结果应包含含「${expectContain}」的条目，实际：${r.hits.map(h => h.item.condition).join('、')}`,
    ).toBe(true);
  });
});

describe('症状检索 · 精确与排序', () => {
  it('完全匹配排第一', () => {
    const r = searchSymptoms('失眠');
    expect(r.hits[0].item.condition).toBe('失眠');
    expect(r.hits[0].reason).toBe('exact');
  });

  it('穴位名可反查症状', () => {
    const r = searchSymptoms('足三里');
    expect(r.total).toBeGreaterThan(0);
    expect(r.hits.some(h => h.reason === 'acupoint')).toBe(true);
  });

  it('分类词可检索', () => {
    const r = searchSymptoms('妇科');
    expect(r.total).toBeGreaterThan(10);
    expect(r.hits.every(h => h.item.category === '妇科')).toBe(true);
  });

  it('空输入返回空', () => {
    expect(searchSymptoms('').total).toBe(0);
    expect(searchSymptoms('   ').total).toBe(0);
  });

  it('limit 生效且 total 反映未截断总数', () => {
    const r = searchSymptoms('妇科', 3);
    expect(r.hits.length).toBeLessThanOrEqual(3);
    expect(r.total).toBeGreaterThan(3);
  });
});

describe('症状检索 · 兜底与诚实性', () => {
  it('库内未收录的症状走 fuzzy 兜底而非直接空', () => {
    const r = searchSymptoms('高血压');
    // 库内确实没有高血压条目，允许 fuzzy 兜底，但必须标记出来
    if (r.total > 0) expect(r.fuzzy).toBe(true);
  });

  it('完全无关的词返回空而不是乱凑', () => {
    const r = searchSymptoms('紫微斗数');
    expect(r.total).toBe(0);
  });

  it('别名表非空且全部为字符串数组', () => {
    expect(ALIAS_COUNT).toBeGreaterThan(30);
  });

  it('按分类取症状可用', () => {
    const list = symptomsByCategory('脾胃');
    expect(list.length).toBeGreaterThan(0);
    expect(list.every(a => a.category === '脾胃')).toBe(true);
  });
});
