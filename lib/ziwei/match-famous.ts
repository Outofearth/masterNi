/**
 * 紫微名人命盘比对
 *
 * 用法：
 *   const matches = matchFamousPersons(userChart, 3);
 *
 * 算法：把每个名人按出生信息排盘，与用户命盘对比命宫/身宫/官禄宫/财帛宫的主星集合。
 * 相似度 = 命宫命中×50 + 身宫命中×30 + 官禄命中×10 + 财帛命中×10
 *
 * 数据：lib/ziwei/famous.ts 的 FAMOUS_PERSONS（11 位）
 */

import { generateChart } from './algorithm';
import { FAMOUS_PERSONS } from './famous';
import type { ZiweiChart } from './types';

export interface FamousMatch {
  id: string;
  name: string;
  description: string;
  category: string;
  notable: string;
  /** 相似度分（0-100） */
  score: number;
  /** 命宫命中（按主星数） */
  mingGongMatched: string[];
  /** 身宫命中 */
  shenGongMatched: string[];
  /** 官禄命中 */
  guanLuMatched: string[];
  /** 财帛命中 */
  caiBoMatched: string[];
}

/** 取某个宫位的主星名集合（仅 major star） */
function mainStarsIn(palace: ZiweiChart['palaces'][0]): string[] {
  return palace.stars
    .filter(s => s.type === 'major')
    .map(s => s.name);
}

/** 找用户命盘某宫名对应的主星 */
function userStarsAt(userChart: ZiweiChart, palaceName: string): string[] {
  const p = userChart.palaces.find(x => x.name === palaceName);
  return p ? mainStarsIn(p) : [];
}

/** 名人命宫主星集合（计算一次缓存） */
const FAMOUS_CHART_CACHE: Map<string, {
  mingGong: string[];
  shenGong: string[];
  guanLu: string[];
  caiBo: string[];
}> = new Map();

function famousStarsCached(id: string) {
  if (FAMOUS_CHART_CACHE.has(id)) return FAMOUS_CHART_CACHE.get(id)!;
  const p = FAMOUS_PERSONS.find(x => x.id === id);
  if (!p) return { mingGong: [], shenGong: [], guanLu: [], caiBo: [] };
  const chart = generateChart({
    year: p.year,
    month: p.month,
    day: p.day,
    hour: p.hour,
    gender: p.gender,
  });
  const stars = {
    mingGong: userStarsAt(chart, '命宫'),
    shenGong: userStarsAt(chart, '身宫'),
    guanLu: userStarsAt(chart, '官禄宫'),
    caiBo: userStarsAt(chart, '财帛宫'),
  };
  FAMOUS_CHART_CACHE.set(id, stars);
  return stars;
}

/** 重置缓存（测试用） */
export function resetFamousCache() {
  FAMOUS_CHART_CACHE.clear();
}

/**
 * 匹配相似名人
 * @param userChart 用户排盘
 * @param topN 取前几名（默认 3）
 */
export function matchFamousPersons(userChart: ZiweiChart, topN = 3): FamousMatch[] {
  const userMing = userStarsAt(userChart, '命宫');
  const userShen = userStarsAt(userChart, '身宫');
  const userGuan = userStarsAt(userChart, '官禄宫');
  const userCai = userStarsAt(userChart, '财帛宫');

  const results: FamousMatch[] = FAMOUS_PERSONS.map(p => {
    const s = famousStarsCached(p.id);

    const mingGongMatched = s.mingGong.filter(x => userMing.includes(x));
    const shenGongMatched = s.shenGong.filter(x => userShen.includes(x));
    const guanLuMatched = s.guanLu.filter(x => userGuan.includes(x));
    const caiBoMatched = s.caiBo.filter(x => userCai.includes(x));

    // 加权得分：命宫50 + 身宫30 + 官禄10 + 财帛10
    const mingPts = userMing.length > 0 ? mingGongMatched.length / userMing.length : 0;
    const shenPts = userShen.length > 0 ? shenGongMatched.length / userShen.length : 0;
    const guanPts = userGuan.length > 0 ? guanLuMatched.length / userGuan.length : 0;
    const caiPts = userCai.length > 0 ? caiBoMatched.length / userCai.length : 0;

    const score = Math.round((mingPts * 50) + (shenPts * 30) + (guanPts * 10) + (caiPts * 10));

    return {
      id: p.id,
      name: p.name,
      description: p.description,
      category: p.category,
      notable: p.notable,
      score,
      mingGongMatched,
      shenGongMatched,
      guanLuMatched,
      caiBoMatched,
    };
  });

  // 按 score 倒序，分数相同时按命宫命中数
  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.mingGongMatched.length - a.mingGongMatched.length;
  });

  return results.slice(0, topN);
}