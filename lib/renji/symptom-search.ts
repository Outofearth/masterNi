/**
 * 人纪 · 症状 → 穴位 检索引擎
 *
 * 背景：ACU_EXPERIENCES 原始检索是 `condition.includes(q)` 整串子串匹配，
 * 口语词（胃疼 / 睡不着 / 拉肚子 / 肩膀痛 / 偏头痛）几乎全部零命中。
 *
 * 本模块只做「检索层增强」，不修改原始病症数据：
 *   1. 别名表：口语 → 数据术语（双向，纯同义映射，不新增医学结论）
 *   2. 打分排序：精确 > 包含 > 别名 > 分类 > 穴位 > 字面重叠
 *   3. 兜底：零结果时返回字面最接近的条目（fuzzy=true），不再给死胡同
 */

import { ACU_EXPERIENCES } from '@/lib/nihai/renji';
import type { AcuExperience } from '@/lib/nihai/types';

export type { AcuExperience };

/** 命中方式（用于 UI 标注「为什么这条被找出来」） */
export type MatchReason = 'exact' | 'contains' | 'alias' | 'category' | 'acupoint' | 'partial' | 'fuzzy';

export interface SymptomHit {
  item: AcuExperience;
  score: number;
  reason: MatchReason;
  /** 命中的别名词（若有），用于 UI 提示「已按「XX」理解」 */
  viaAlias?: string;
}

export interface SymptomSearchResult {
  hits: SymptomHit[];
  /** 匹配总数（截断前） */
  total: number;
  /** 是否走了兜底模糊匹配 */
  fuzzy: boolean;
  /** 归一化后的查询词（别名展开后） */
  normalized: string;
  /** 别名提示（用户口语词 → 库内术语） */
  aliasNote?: string;
}

/**
 * 口语 → 库内术语 别名表
 *
 * 只做同义/统称 → 具体条目名的映射，不做任何病机推断或疗效断言。
 * 库内确实没有收录的（如高血压、糖尿病、头晕）不在此表 —— 空就是空，不编造。
 */
const SYMPTOM_ALIASES: Record<string, string[]> = {
  // 心系
  心脏病: ['冠心病', '心脏痛', '心绞痛', '心律不齐', '心脏肥大', '真心痛'],
  心脏病发作: ['真心痛', '心绞痛'],
  心悸心慌: ['心悸', '心律不齐'],
  心慌: ['心悸', '心律不齐'],
  // 消化
  胃疼: ['胃病胃痛'],
  胃痛: ['胃病胃痛'],
  胃不舒服: ['胃病胃痛', '胃酸过多', '消化不良'],
  胃胀: ['腹胀', '胃病胃痛'],
  拉肚子: ['腹泻'],
  拉稀: ['腹泻'],
  肚痛: ['腹痛'],
  肚子痛: ['腹痛'],
  排便困难: ['便秘'],
  大便不通: ['便秘'],
  反胃: ['恶心反胃', '呕吐'],
  恶心: ['恶心反胃', '呕吐'],
  吐: ['呕吐'],
  // 呼吸
  喘: ['气喘'],
  哮喘: ['气喘'],
  咳: ['咳嗽'],
  有痰: ['多痰'],
  鼻塞: ['鼻子不通'],
  鼻炎: ['鼻子不通'],
  失声: ['喉哑失声'],
  哑: ['喉哑失声'],
  // 泌尿 / 肾
  频尿: ['尿频'],
  尿不出来: ['小便不利'],
  小便痛: ['小便痛'],
  肾亏: ['肾虚'],
  // 妇科
  月经不调: ['月经过少', '月经过多', '痛经', '崩漏'],
  经痛: ['痛经'],
  白带: ['赤白带下'],
  带下: ['赤白带下'],
  怀不上: ['不孕症'],
  不孕: ['不孕症'],
  乳房痛: ['乳房疼痛', '乳房肿胀', '乳腺小叶增生'],
  乳腺增生: ['乳腺小叶增生'],
  // 神志 / 神经
  睡不着: ['失眠'],
  失眠多梦: ['失眠'],
  不寐: ['失眠'],
  羊癫疯: ['癫痫'],
  中风偏瘫: ['半身不遂', '中风中经络'],
  偏瘫: ['半身不遂'],
  半身瘫痪: ['半身不遂'],
  老年痴呆: ['痴呆'],
  // 骨伤
  肩周炎: ['五十肩'],
  肩膀痛: ['肩膀酸痛', '五十肩', '肩拉伤'],
  肩痛: ['肩膀酸痛', '五十肩'],
  脖子痛: ['颈椎病', '落枕', '头项强重'],
  颈部僵硬: ['头项强重', '颈椎病'],
  落枕脖子痛: ['落枕'],
  腰酸: ['腰痛'],
  腰痛腰酸: ['腰痛'],
  闪腰: ['腰痛'],
  脚踝扭伤: ['脚扭伤'],
  扭伤: ['脚扭伤'],
  关节痛: ['膝痛', '网球肘', '五十肩', '坐骨神经痛'],
  膝盖痛: ['膝痛'],
  腿痛: ['坐骨神经痛', '膝痛'],
  // 头面五官
  偏头痛: ['头痛（偏头）'],
  前额痛: ['头痛（前额）'],
  后脑勺痛: ['头痛（后脑）'],
  头顶痛: ['头痛（头顶）'],
  牙疼: ['牙痛'],
  面瘫嘴歪: ['面瘫'],
  口眼歪斜: ['面瘫'],
  耳聋: ['耳鸣'],
  // 其他
  发烧感冒: ['发烧', '感冒'],
  着凉: ['感冒'],
  出汗多: ['盗汗'],
  晚上出汗: ['盗汗'],
  皮肤瘙痒: ['皮肤痒'],
  痒: ['皮肤痒'],
  想戒烟: ['戒烟'],
};

/** 热门症状（UI 快捷 chips，全部取自库内已有条目） */
export const HOT_SYMPTOMS = [
  '失眠', '头痛', '咳嗽', '腰痛', '便秘', '痛经',
  '耳鸣', '面瘫', '五十肩', '颈椎病', '胃病胃痛', '痔疮',
] as const;

/** 全部分类（库内真实存在的 category，按数据顺序去重） */
export const SYMPTOM_CATEGORIES: string[] = Array.from(
  new Set(ACU_EXPERIENCES.map(a => a.category)),
);

/** 库内真实条数（UI 展示用，杜绝硬编码虚标） */
export const SYMPTOM_TOTAL = ACU_EXPERIENCES.length;

/** 生成字符串的 2-gram 集合（中文无空格，按字切分） */
function bigrams(s: string): Set<string> {
  const out = new Set<string>();
  const t = s.trim();
  if (t.length === 1) {
    out.add(t);
    return out;
  }
  for (let i = 0; i < t.length - 1; i++) out.add(t.slice(i, i + 2));
  return out;
}

/** 两个字符串的字面相似度：0~1 */
function similarity(a: string, b: string): number {
  if (!a || !b) return 0;
  if (a === b) return 1;
  if (a.includes(b) || b.includes(a)) return 0.85;
  const A = bigrams(a);
  const B = bigrams(b);
  if (A.size === 0 || B.size === 0) {
    // 单字查询：退化为字符包含判断
    return b.includes(a) ? 0.6 : 0;
  }
  let inter = 0;
  for (const g of A) if (B.has(g)) inter++;
  return inter / Math.min(A.size, B.size);
}

/**
 * 症状检索主入口
 *
 * @param raw   用户输入
 * @param limit 返回条数上限（默认 20）
 */
export function searchSymptoms(raw: string, limit = 20): SymptomSearchResult {
  const q = raw.trim();
  if (!q) return { hits: [], total: 0, fuzzy: false, normalized: '' };

  const aliasTargets = SYMPTOM_ALIASES[q] ?? [];

  const scored: SymptomHit[] = [];

  for (const item of ACU_EXPERIENCES) {
    const cond = item.condition;
    let score = 0;
    let reason: MatchReason = 'partial';
    let viaAlias: string | undefined;

    // 1. 病名精确 / 包含
    if (cond === q) {
      score = 100;
      reason = 'exact';
    } else if (cond.includes(q)) {
      score = 80;
      reason = 'contains';
      // 前缀命中更靠前
      if (cond.startsWith(q)) score += 10;
    }

    // 2. 别名命中
    if (score === 0 && aliasTargets.length > 0) {
      if (aliasTargets.includes(cond)) {
        score = 70;
        reason = 'alias';
        viaAlias = q;
      } else if (aliasTargets.some(t => cond.includes(t))) {
        score = 60;
        reason = 'alias';
        viaAlias = q;
      }
    }

    // 3. 分类命中
    if (score === 0 && item.category.includes(q)) {
      score = 45;
      reason = 'category';
    }

    // 4. 穴位命中（支持「合谷」「足三里」反查症状）
    if (score === 0 && item.acupoints.includes(q)) {
      score = 40;
      reason = 'acupoint';
    }

    // 5. 字面部分重叠（程度较弱，但聊胜于无）
    if (score === 0) {
      const sim = similarity(q, cond);
      if (sim >= 0.5) {
        score = Math.round(sim * 35);
        reason = 'partial';
      } else if (item.category && similarity(q, item.category) >= 0.9) {
        score = 20;
        reason = 'partial';
      }
    }

    if (score > 0) scored.push({ item, score, reason, viaAlias });
  }

  // 排序：分数降序 → 病名短者优先 → id 稳定序
  scored.sort(
    (a, b) =>
      b.score - a.score ||
      a.item.condition.length - b.item.condition.length ||
      a.item.id - b.item.id,
  );

  if (scored.length > 0) {
    return {
      hits: scored.slice(0, limit),
      total: scored.length,
      fuzzy: false,
      normalized: q,
      aliasNote: aliasTargets.length > 0 ? `已按「${aliasTargets.slice(0, 3).join('、')}」理解` : undefined,
    };
  }

  // ─── 兜底：字面最接近的 N 条 ───
  const fuzzyPool = ACU_EXPERIENCES.map(item => {
    const sCond = similarity(q, item.condition);
    const sCate = item.category ? similarity(q, item.category) : 0;
    return {
      item,
      score: Math.max(sCond, sCate * 0.8),
      reason: 'fuzzy' as MatchReason,
    };
  })
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score || a.item.id - b.item.id)
    .slice(0, 5);

  return {
    hits: fuzzyPool,
    total: fuzzyPool.length,
    fuzzy: true,
    normalized: q,
  };
}

/** 按分类取症状（UI 分类浏览） */
export function symptomsByCategory(category: string): AcuExperience[] {
  return ACU_EXPERIENCES.filter(a => a.category === category);
}

/** 已有别名数量（自检用） */
export const ALIAS_COUNT = Object.keys(SYMPTOM_ALIASES).length;
