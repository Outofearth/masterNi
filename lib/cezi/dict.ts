/**
 * 测字词典 · CEZI_DICT
 *
 * 提供常用字的：笔画 / 五行 / 部首 / 拼音 / 字义 / 吉凶倾向
 *
 * 覆盖思路：
 - 部首代表字（约 40）：覆盖常见偏旁取象
 - 姓名常用字（约 60）：姓名/字号最常测
 - 五行代表字（约 30）：金木水火土各 6
 - 吉凶倾向字（约 25）：吉/平/凶各若干
 - 行业意象字（约 25）：医/法/财/学/...
 *
 * 扩展方式：在 CEZI_CHARS 加新条目即可，无需改其它代码。
 * 查不到的字会显示「未收录」并提示用户自测五行/偏旁。
 */

export type Wuxing = '金' | '木' | '水' | '火' | '土';

export type Tendency = '吉' | '平' | '凶' | '随境';

export interface CeziChar {
  /** 汉字 */
  ch: string;
  /** 笔画数（康熙/通行笔画） */
  strokes: number;
  /** 五行（按字形/字义综合判定） */
  wuxing: Wuxing;
  /** 部首 */
  radical: string;
  /** 拼音（声调标数字 1-4） */
  pinyin: string;
  /** 字义（简） */
  meaning: string;
  /** 吉凶倾向 */
  tendency: Tendency;
  /** 倪师字理要点（可选） */
  niNote?: string;
}

/* ─────────── 部首 → 五行映射（核心表）─────────── */
/**
 * 部首五行判定原则（按字形 + 字义双重判定）：
 * - 金：金字旁、钅、刂、几、石、玉、贝、皿
 * - 木：木、艹、禾、米、竹、朩、本
 * - 水：水、氵、冫、雨、泉、永
 * - 火：火、灬、日、曰、丙、炎、灯
 * - 土：土、士、圭、垂、地、城
 */
export const RADICAL_WUXING: Record<string, { wx: Wuxing; why: string }> = {
  // 金
  金: { wx: '金', why: '金者刚利，主肃杀、决断' },
  钅: { wx: '金', why: '金字旁，五行属金' },
  刂: { wx: '金', why: '刀旁，五行属金' },
  石: { wx: '金', why: '石乃金之母，五行属金' },
  玉: { wx: '金', why: '玉者石之美者，属金' },
  贝: { wx: '金', why: '贝主财货，属金' },
  皿: { wx: '金', why: '器皿之形，属金' },
  // 木
  木: { wx: '木', why: '木主生发条达' },
  艹: { wx: '木', why: '草字头，五行属木' },
  禾: { wx: '木', why: '禾者木之成，属木' },
  米: { wx: '木', why: '米者禾之实，属木' },
  竹: { wx: '木', why: '竹者木之秀，属木' },
  朩: { wx: '木', why: '木字旁，属木' },
  // 水
  水: { wx: '水', why: '水主润下、流通' },
  氵: { wx: '水', why: '三点水，五行属水' },
  冫: { wx: '水', why: '两点水/冰旁，五行属水' },
  雨: { wx: '水', why: '雨者水之降，属水' },
  // 火
  火: { wx: '火', why: '火主炎上、光明' },
  灬: { wx: '火', why: '四点底，五行属火' },
  日: { wx: '火', why: '日者火之精，属火' },
  曰: { wx: '火', why: '曰字形近日，属火' },
  丙: { wx: '火', why: '丙为火之阳，属火' },
  // 土
  土: { wx: '土', why: '土主稼穑、化育' },
  士: { wx: '土', why: '士者土之成，属土' },
  山: { wx: '土', why: '山者土之积，属土' },
  田: { wx: '土', why: '田者土之成，属土' },
};

/* ─────────── 主体词典构造 ─────────── */

/**
 * Builder 工具：把 [部首, 数组] 转成 Record<ch, CeziChar>
 */
function charMap(radical: string, list: Omit<CeziChar, 'radical'>[]): Record<string, CeziChar> {
  const out: Record<string, CeziChar> = {};
  for (const item of list) {
    if (out[item.ch]) continue; // 同字去重，保留首个
    out[item.ch] = { ...item, radical };
  }
  return out;
}

/**
 * 扁平合并多张 charMap
 */
function mergeCharMaps(...maps: Record<string, CeziChar>[]): Record<string, CeziChar> {
  const out: Record<string, CeziChar> = {};
  for (const m of maps) {
    for (const [ch, v] of Object.entries(m)) {
      if (!out[ch]) out[ch] = v;
    }
  }
  return out;
}

/** 部首代表字 */
const MAP_JIN = charMap('金', [
  { ch: '金', strokes: 8, wuxing: '金', pinyin: 'jin1', meaning: '金之本字，主财富、决断', tendency: '吉', niNote: '金者刚毅，主财与义' },
  { ch: '钢', strokes: 16, wuxing: '金', pinyin: 'gang1', meaning: '刚毅坚强', tendency: '吉' },
  { ch: '铭', strokes: 14, wuxing: '金', pinyin: 'ming2', meaning: '刻于心，永不忘', tendency: '吉', niNote: '铭字金声配，有立言之象' },
  { ch: '钱', strokes: 16, wuxing: '金', pinyin: 'qian2', meaning: '财货之属', tendency: '随境' },
  { ch: '鑫', strokes: 24, wuxing: '金', pinyin: 'xin1', meaning: '金多金盛，财富累积', tendency: '吉' },
]);
const MAP_DAO = charMap('刂', [
  { ch: '利', strokes: 7, wuxing: '金', pinyin: 'li4', meaning: '锋利、顺利', tendency: '吉' },
  { ch: '刚', strokes: 7, wuxing: '金', pinyin: 'gang1', meaning: '刚强不屈', tendency: '吉' },
  { ch: '剑', strokes: 9, wuxing: '金', pinyin: 'jian4', meaning: '兵器之利', tendency: '随境' },
]);
const MAP_MU = charMap('木', [
  { ch: '木', strokes: 4, wuxing: '木', pinyin: 'mu4', meaning: '木之本字，主生发', tendency: '平' },
  { ch: '林', strokes: 8, wuxing: '木', pinyin: 'lin2', meaning: '双木成林', tendency: '吉', niNote: '林者木之聚，主同类相聚' },
  { ch: '森', strokes: 12, wuxing: '木', pinyin: 'sen1', meaning: '众木成森', tendency: '吉' },
  { ch: '栋', strokes: 12, wuxing: '木', pinyin: 'dong4', meaning: '栋梁之材', tendency: '吉', niNote: '栋字主承担大任' },
  { ch: '柏', strokes: 9, wuxing: '木', pinyin: 'bai3', meaning: '松柏常青', tendency: '吉' },
  { ch: '梅', strokes: 11, wuxing: '木', pinyin: 'mei2', meaning: '梅花傲雪', tendency: '吉', niNote: '梅字五行属木，先春而开，主先声夺人' },
]);
const MAP_CAO = charMap('艹', [
  { ch: '草', strokes: 9, wuxing: '木', pinyin: 'cao3', meaning: '草木之总称', tendency: '平' },
  { ch: '花', strokes: 7, wuxing: '木', pinyin: 'hua1', meaning: '草木之秀', tendency: '吉' },
  { ch: '茶', strokes: 9, wuxing: '木', pinyin: 'cha2', meaning: '茶者南方之嘉木', tendency: '吉' },
  { ch: '茂', strokes: 9, wuxing: '木', pinyin: 'mao4', meaning: '草木丰盛', tendency: '吉' },
  { ch: '艺', strokes: 4, wuxing: '木', pinyin: 'yi4', meaning: '才能、技艺', tendency: '吉' },
  { ch: '荣', strokes: 9, wuxing: '木', pinyin: 'rong2', meaning: '草木繁茂、光荣', tendency: '吉' },
]);
const MAP_SHUI = charMap('氵', [
  { ch: '水', strokes: 4, wuxing: '水', pinyin: 'shui3', meaning: '水之本字', tendency: '平' },
  { ch: '江', strokes: 6, wuxing: '水', pinyin: 'jiang1', meaning: '大江大河', tendency: '吉' },
  { ch: '海', strokes: 10, wuxing: '水', pinyin: 'hai3', meaning: '海纳百川', tendency: '吉', niNote: '海字水旁配，每主度量、胸怀' },
  { ch: '河', strokes: 8, wuxing: '水', pinyin: 'he2', meaning: '河流', tendency: '平' },
  { ch: '湖', strokes: 12, wuxing: '水', pinyin: 'hu2', meaning: '湖泊', tendency: '平' },
  { ch: '清', strokes: 11, wuxing: '水', pinyin: 'qing1', meaning: '清朗、洁净', tendency: '吉', niNote: '清字三点水配，主心明、品正' },
  { ch: '洁', strokes: 9, wuxing: '水', pinyin: 'jie2', meaning: '洁净', tendency: '吉' },
  { ch: '深', strokes: 11, wuxing: '水', pinyin: 'shen1', meaning: '水深、深刻', tendency: '吉' },
  { ch: '汉', strokes: 5, wuxing: '水', pinyin: 'han4', meaning: '汉水、汉族', tendency: '吉' },
]);
const MAP_BING = charMap('冫', [
  { ch: '冰', strokes: 6, wuxing: '水', pinyin: 'bing1', meaning: '冰寒', tendency: '平' },
  { ch: '寒', strokes: 12, wuxing: '水', pinyin: 'han2', meaning: '寒冷', tendency: '凶' },
  { ch: '凉', strokes: 10, wuxing: '水', pinyin: 'liang2', meaning: '清凉', tendency: '平' },
]);
const MAP_HUO = charMap('火', [
  { ch: '火', strokes: 4, wuxing: '火', pinyin: 'huo3', meaning: '火之本字', tendency: '随境' },
  { ch: '炎', strokes: 8, wuxing: '火', pinyin: 'yan2', meaning: '火势旺盛', tendency: '吉' },
  { ch: '焱', strokes: 12, wuxing: '火', pinyin: 'yan4', meaning: '火花、火势', tendency: '吉' },
  { ch: '煜', strokes: 13, wuxing: '火', pinyin: 'yu4', meaning: '光耀', tendency: '吉' },
  { ch: '熙', strokes: 13, wuxing: '火', pinyin: 'xi1', meaning: '光明、兴盛', tendency: '吉' },
  { ch: '灿', strokes: 17, wuxing: '火', pinyin: 'can4', meaning: '光彩鲜明', tendency: '吉' },
]);
const MAP_HUO4 = charMap('灬', [
  { ch: '炜', strokes: 13, wuxing: '火', pinyin: 'wei3', meaning: '光明', tendency: '吉' },
  { ch: '烈', strokes: 10, wuxing: '火', pinyin: 'lie4', meaning: '猛烈、壮烈', tendency: '随境' },
  { ch: '热', strokes: 13, wuxing: '火', pinyin: 're4', meaning: '热烈', tendency: '吉' },
  { ch: '照', strokes: 13, wuxing: '火', pinyin: 'zhao4', meaning: '照耀', tendency: '吉' },
  { ch: '辉', strokes: 15, wuxing: '火', pinyin: 'hui1', meaning: '光辉、荣耀', tendency: '吉' },
]);
const MAP_RI = charMap('日', [
  { ch: '日', strokes: 4, wuxing: '火', pinyin: 'ri4', meaning: '太阳', tendency: '吉' },
  { ch: '明', strokes: 8, wuxing: '火', pinyin: 'ming2', meaning: '日月为明', tendency: '吉', niNote: '明字日配月，主聪明、显达' },
  { ch: '昌', strokes: 8, wuxing: '火', pinyin: 'chang1', meaning: '双日曰昌', tendency: '吉', niNote: '昌字两日，主兴盛' },
  { ch: '星', strokes: 9, wuxing: '火', pinyin: 'xing1', meaning: '星辰', tendency: '吉' },
  { ch: '晨', strokes: 11, wuxing: '火', pinyin: 'chen2', meaning: '清晨', tendency: '吉' },
  { ch: '旺', strokes: 8, wuxing: '火', pinyin: 'wang4', meaning: '兴旺', tendency: '吉' },
  { ch: '昭', strokes: 9, wuxing: '火', pinyin: 'zhao1', meaning: '昭明', tendency: '吉' },
  { ch: '晓', strokes: 16, wuxing: '火', pinyin: 'xiao3', meaning: '破晓', tendency: '吉' },
  { ch: '晴', strokes: 12, wuxing: '火', pinyin: 'qing2', meaning: '晴天', tendency: '吉' },
]);
const MAP_YUE = charMap('月', [
  { ch: '月', strokes: 4, wuxing: '水', pinyin: 'yue4', meaning: '月亮', tendency: '吉' },
  { ch: '朗', strokes: 10, wuxing: '火', pinyin: 'lang3', meaning: '明亮', tendency: '吉' },
  { ch: '期', strokes: 12, wuxing: '木', pinyin: 'qi1', meaning: '日期、期望', tendency: '吉' },
  { ch: '朋', strokes: 8, wuxing: '水', pinyin: 'peng2', meaning: '双月为朋', tendency: '吉' },
]);
const MAP_TU = charMap('土', [
  { ch: '土', strokes: 3, wuxing: '土', pinyin: 'tu3', meaning: '土之本字', tendency: '平' },
  { ch: '地', strokes: 6, wuxing: '土', pinyin: 'di4', meaning: '大地', tendency: '吉' },
  { ch: '城', strokes: 9, wuxing: '土', pinyin: 'cheng2', meaning: '城池', tendency: '吉' },
  { ch: '坤', strokes: 8, wuxing: '土', pinyin: 'kun1', meaning: '大地之母', tendency: '吉', niNote: '坤字主柔顺、承载' },
  { ch: '基', strokes: 11, wuxing: '土', pinyin: 'ji1', meaning: '根基', tendency: '吉' },
  { ch: '堂', strokes: 11, wuxing: '土', pinyin: 'tang2', meaning: '厅堂', tendency: '吉' },
]);
const MAP_REN = charMap('人', [
  { ch: '人', strokes: 2, wuxing: '金', pinyin: 'ren2', meaning: '人字本义', tendency: '平' },
  { ch: '仁', strokes: 4, wuxing: '金', pinyin: 'ren2', meaning: '仁者爱人', tendency: '吉', niNote: '仁者，二人之合，主和合' },
  { ch: '伟', strokes: 6, wuxing: '土', pinyin: 'wei3', meaning: '伟大', tendency: '吉', niNote: '伟字主大器晚成' },
  { ch: '佳', strokes: 8, wuxing: '木', pinyin: 'jia1', meaning: '美好', tendency: '吉' },
  { ch: '杰', strokes: 8, wuxing: '木', pinyin: 'jie2', meaning: '杰出', tendency: '吉' },
  { ch: '俊', strokes: 9, wuxing: '火', pinyin: 'jun4', meaning: '俊秀', tendency: '吉' },
  { ch: '儒', strokes: 16, wuxing: '金', pinyin: 'ru2', meaning: '儒家、儒雅', tendency: '吉' },
  { ch: '倩', strokes: 10, wuxing: '金', pinyin: 'qian4', meaning: '美好', tendency: '吉' },
  { ch: '仪', strokes: 15, wuxing: '木', pinyin: 'yi2', meaning: '仪表', tendency: '吉' },
]);
const MAP_REN2 = charMap('亻', [
  { ch: '信', strokes: 9, wuxing: '金', pinyin: 'xin4', meaning: '诚信', tendency: '吉' },
  { ch: '健', strokes: 11, wuxing: '木', pinyin: 'jian4', meaning: '健康', tendency: '吉' },
  { ch: '修', strokes: 10, wuxing: '金', pinyin: 'xiu1', meaning: '修行', tendency: '吉' },
]);
const MAP_NV = charMap('女', [
  { ch: '女', strokes: 3, wuxing: '木', pinyin: 'nv3', meaning: '女子', tendency: '平' },
  { ch: '好', strokes: 6, wuxing: '木', pinyin: 'hao3', meaning: '美好', tendency: '吉' },
  { ch: '妙', strokes: 7, wuxing: '水', pinyin: 'miao4', meaning: '美妙', tendency: '吉' },
  { ch: '娟', strokes: 10, wuxing: '木', pinyin: 'juan1', meaning: '秀丽', tendency: '吉' },
  { ch: '婉', strokes: 11, wuxing: '土', pinyin: 'wan3', meaning: '温婉', tendency: '吉' },
  { ch: '婷', strokes: 12, wuxing: '火', pinyin: 'ting2', meaning: '亭亭玉立', tendency: '吉' },
  { ch: '媛', strokes: 13, wuxing: '火', pinyin: 'yuan4', meaning: '名媛', tendency: '吉' },
  { ch: '媚', strokes: 12, wuxing: '水', pinyin: 'mei4', meaning: '妩媚', tendency: '随境' },
  { ch: '娇', strokes: 15, wuxing: '木', pinyin: 'jiao1', meaning: '娇美', tendency: '平' },
]);
const MAP_XIN = charMap('心', [
  { ch: '心', strokes: 4, wuxing: '金', pinyin: 'xin1', meaning: '心之本字', tendency: '平' },
  { ch: '思', strokes: 9, wuxing: '金', pinyin: 'si1', meaning: '思念、思想', tendency: '平' },
  { ch: '念', strokes: 8, wuxing: '火', pinyin: 'nian4', meaning: '思念', tendency: '平' },
  { ch: '慧', strokes: 15, wuxing: '水', pinyin: 'hui4', meaning: '智慧', tendency: '吉', niNote: '慧字心配彗，主心明如镜' },
]);
const MAP_TE = charMap('忄', [
  { ch: '恭', strokes: 10, wuxing: '木', pinyin: 'gong1', meaning: '恭敬', tendency: '吉' },
  { ch: '恒', strokes: 9, wuxing: '水', pinyin: 'heng2', meaning: '恒久', tendency: '吉' },
  { ch: '悦', strokes: 11, wuxing: '土', pinyin: 'yue4', meaning: '喜悦', tendency: '吉' },
  { ch: '恺', strokes: 12, wuxing: '火', pinyin: 'kai3', meaning: '快乐', tendency: '吉' },
  { ch: '慎', strokes: 10, wuxing: '金', pinyin: 'shen4', meaning: '谨慎', tendency: '吉' },
]);
const MAP_KOU = charMap('口', [
  { ch: '口', strokes: 3, wuxing: '土', pinyin: 'kou3', meaning: '口字本义', tendency: '平' },
  { ch: '吉', strokes: 6, wuxing: '木', pinyin: 'ji2', meaning: '吉祥', tendency: '吉', niNote: '吉字口配士，主吉利' },
  { ch: '和', strokes: 8, wuxing: '水', pinyin: 'he2', meaning: '和谐', tendency: '吉' },
  { ch: '哲', strokes: 10, wuxing: '火', pinyin: 'zhe2', meaning: '智慧', tendency: '吉' },
  { ch: '嘉', strokes: 14, wuxing: '木', pinyin: 'jia1', meaning: '美好、赞许', tendency: '吉' },
  { ch: '咏', strokes: 8, wuxing: '土', pinyin: 'yong3', meaning: '吟咏', tendency: '吉' },
]);
const MAP_TIAN = charMap('田', [
  { ch: '田', strokes: 5, wuxing: '火', pinyin: 'tian2', meaning: '田地', tendency: '吉' },
  { ch: '男', strokes: 7, wuxing: '火', pinyin: 'nan2', meaning: '男子', tendency: '吉' },
  { ch: '界', strokes: 9, wuxing: '木', pinyin: 'jie4', meaning: '边界', tendency: '平' },
  { ch: '画', strokes: 8, wuxing: '木', pinyin: 'hua4', meaning: '绘画', tendency: '吉' },
  { ch: '留', strokes: 10, wuxing: '火', pinyin: 'liu2', meaning: '停留', tendency: '平' },
]);
const MAP_SHAN = charMap('山', [
  { ch: '山', strokes: 3, wuxing: '土', pinyin: 'shan1', meaning: '山岳', tendency: '吉' },
  { ch: '峰', strokes: 10, wuxing: '水', pinyin: 'feng1', meaning: '山峰', tendency: '吉' },
  { ch: '峻', strokes: 10, wuxing: '金', pinyin: 'jun4', meaning: '高峻', tendency: '吉' },
  { ch: '岚', strokes: 12, wuxing: '土', pinyin: 'lan2', meaning: '山岚', tendency: '吉' },
  { ch: '岩', strokes: 8, wuxing: '土', pinyin: 'yan2', meaning: '岩石', tendency: '平' },
]);
const MAP_WANG = charMap('王', [
  { ch: '王', strokes: 4, wuxing: '土', pinyin: 'wang2', meaning: '王者', tendency: '吉' },
  { ch: '珏', strokes: 10, wuxing: '火', pinyin: 'jue2', meaning: '合璧之玉', tendency: '吉' },
  { ch: '玟', strokes: 9, wuxing: '水', pinyin: 'min2', meaning: '美玉', tendency: '吉' },
]);

/** 精选字（带 niNote，独立部首） */
const MAP_FEATURED = mergeCharMaps(
  // 部首字
  charMap('艹', [
    { ch: '华', strokes: 6, wuxing: '水', pinyin: 'hua2', meaning: '华丽、中华', tendency: '吉' },
  ]),
  charMap('人', [
    { ch: '明', strokes: 8, wuxing: '火', pinyin: 'ming2', meaning: '日月为明，主显达', tendency: '吉', niNote: '明字日配月，主聪明、显达' },
    { ch: '丽', strokes: 7, wuxing: '火', pinyin: 'li4', meaning: '美丽', tendency: '吉' },
    { ch: '静', strokes: 14, wuxing: '金', pinyin: 'jing4', meaning: '宁静', tendency: '吉', niNote: '静字主心静则身安' },
    { ch: '雅', strokes: 12, wuxing: '木', pinyin: 'ya3', meaning: '高雅', tendency: '吉' },
    { ch: '琳', strokes: 13, wuxing: '木', pinyin: 'lin2', meaning: '美玉', tendency: '吉' },
    { ch: '强', strokes: 11, wuxing: '木', pinyin: 'qiang2', meaning: '强大', tendency: '吉' },
    { ch: '平', strokes: 5, wuxing: '水', pinyin: 'ping2', meaning: '平安', tendency: '吉' },
    { ch: '安', strokes: 6, wuxing: '土', pinyin: 'an1', meaning: '安宁', tendency: '吉', niNote: '安字女配宀，主女正家安' },
    { ch: '福', strokes: 13, wuxing: '水', pinyin: 'fu2', meaning: '福禄', tendency: '吉', niNote: '福字主福报，宜修身以承' },
    { ch: '贵', strokes: 10, wuxing: '木', pinyin: 'gui4', meaning: '尊贵', tendency: '吉' },
    { ch: '寿', strokes: 7, wuxing: '金', pinyin: 'shou4', meaning: '长寿', tendency: '吉' },
    { ch: '禄', strokes: 13, wuxing: '火', pinyin: 'lu4', meaning: '福禄', tendency: '吉' },
    { ch: '喜', strokes: 12, wuxing: '水', pinyin: 'xi3', meaning: '喜庆', tendency: '吉' },
    { ch: '财', strokes: 9, wuxing: '金', pinyin: 'cai2', meaning: '财富', tendency: '随境' },
    { ch: '聪', strokes: 17, wuxing: '金', pinyin: 'cong1', meaning: '聪明', tendency: '吉' },
    { ch: '志', strokes: 6, wuxing: '火', pinyin: 'zhi4', meaning: '志向', tendency: '吉' },
    { ch: '勇', strokes: 9, wuxing: '土', pinyin: 'yong3', meaning: '勇敢', tendency: '吉' },
    { ch: '义', strokes: 3, wuxing: '木', pinyin: 'yi4', meaning: '义气', tendency: '吉' },
    { ch: '礼', strokes: 5, wuxing: '火', pinyin: 'li3', meaning: '礼节', tendency: '吉' },
    { ch: '智', strokes: 12, wuxing: '火', pinyin: 'zhi4', meaning: '智慧', tendency: '吉' },
    { ch: '德', strokes: 15, wuxing: '火', pinyin: 'de2', meaning: '道德', tendency: '吉', niNote: '德者得也，有德者有得' },
  ]),
  // 吉/平/凶代表字（独立列）
  charMap('凵', [
    { ch: '凶', strokes: 6, wuxing: '水', pinyin: 'xiong1', meaning: '凶险', tendency: '凶' },
    { ch: '祥', strokes: 11, wuxing: '金', pinyin: 'xiang2', meaning: '吉祥', tendency: '吉' },
    { ch: '灾', strokes: 7, wuxing: '水', pinyin: 'zai1', meaning: '灾患', tendency: '凶' },
    { ch: '病', strokes: 5, wuxing: '木', pinyin: 'bing4', meaning: '疾病', tendency: '凶' },
    { ch: '死', strokes: 6, wuxing: '土', pinyin: 'si3', meaning: '死亡', tendency: '凶' },
    { ch: '伤', strokes: 6, wuxing: '土', pinyin: 'shang1', meaning: '伤害', tendency: '凶' },
    { ch: '衰', strokes: 10, wuxing: '金', pinyin: 'shuai1', meaning: '衰败', tendency: '凶' },
    { ch: '败', strokes: 8, wuxing: '水', pinyin: 'bai4', meaning: '失败', tendency: '凶' },
  ]),
  // 行业意象字
  charMap('匚', [
    { ch: '医', strokes: 7, wuxing: '土', pinyin: 'yi1', meaning: '医道', tendency: '吉', niNote: '医字主济世活人' },
    { ch: '药', strokes: 9, wuxing: '木', pinyin: 'yao4', meaning: '药草', tendency: '吉' },
    { ch: '法', strokes: 8, wuxing: '水', pinyin: 'fa3', meaning: '法则、方法', tendency: '吉' },
    { ch: '商', strokes: 11, wuxing: '金', pinyin: 'shang1', meaning: '经商', tendency: '随境' },
    { ch: '学', strokes: 16, wuxing: '水', pinyin: 'xue2', meaning: '学问', tendency: '吉' },
    { ch: '文', strokes: 4, wuxing: '水', pinyin: 'wen2', meaning: '文采', tendency: '吉' },
    { ch: '武', strokes: 8, wuxing: '水', pinyin: 'wu3', meaning: '武力', tendency: '随境' },
    { ch: '政', strokes: 9, wuxing: '火', pinyin: 'zheng4', meaning: '政治', tendency: '吉' },
    { ch: '工', strokes: 3, wuxing: '金', pinyin: 'gong1', meaning: '工匠', tendency: '平' },
    { ch: '农', strokes: 6, wuxing: '木', pinyin: 'nong2', meaning: '农业', tendency: '平' },
    { ch: '科', strokes: 9, wuxing: '木', pinyin: 'ke1', meaning: '科学', tendency: '吉' },
    { ch: '技', strokes: 7, wuxing: '木', pinyin: 'ji4', meaning: '技术', tendency: '吉' },
    { ch: '道', strokes: 12, wuxing: '火', pinyin: 'dao4', meaning: '道理、修道', tendency: '吉', niNote: '道字主方向与方法' },
    { ch: '佛', strokes: 8, wuxing: '水', pinyin: 'fo2', meaning: '佛家', tendency: '吉' },
    { ch: '禅', strokes: 12, wuxing: '金', pinyin: 'chan2', meaning: '禅定', tendency: '吉' },
  ]),
  // 易测常用
  charMap('亠', [
    { ch: '问', strokes: 7, wuxing: '金', pinyin: 'wen4', meaning: '询问', tendency: '平' },
    { ch: '卜', strokes: 2, wuxing: '水', pinyin: 'bu3', meaning: '占卜', tendency: '平' },
    { ch: '卦', strokes: 8, wuxing: '木', pinyin: 'gua4', meaning: '卦象', tendency: '平' },
    { ch: '运', strokes: 11, wuxing: '水', pinyin: 'yun4', meaning: '运气', tendency: '随境' },
    { ch: '命', strokes: 8, wuxing: '金', pinyin: 'ming4', meaning: '命运', tendency: '平' },
    { ch: '天', strokes: 4, wuxing: '火', pinyin: 'tian1', meaning: '天也', tendency: '吉' },
    { ch: '顺', strokes: 12, wuxing: '金', pinyin: 'shun4', meaning: '顺达', tendency: '吉' },
  ])
);

/* ─────────── 组装 CEZI_CHARS ─────────── */

/**
 * 主体词典（按汉字 key 索引）
 * FEATURED 后于部首合并，覆盖同名条目（精选带 niNote 优先）
 */
export const CEZI_CHARS: Record<string, CeziChar> = mergeCharMaps(
  MAP_JIN, MAP_DAO, MAP_MU, MAP_CAO, MAP_SHUI, MAP_BING,
  MAP_HUO, MAP_HUO4, MAP_RI, MAP_YUE, MAP_TU,
  MAP_REN, MAP_REN2, MAP_NV, MAP_XIN, MAP_TE,
  MAP_KOU, MAP_TIAN, MAP_SHAN, MAP_WANG,
  MAP_FEATURED
);

/* ─────────── 查询函数 ─────────── */

export interface CharAnalysis {
  ch: string;
  char: CeziChar | null;
  inDict: boolean;
  /** 该字五行（如有） */
  wuxing: Wuxing | null;
  /** 该字部首 */
  radical: string;
}

export interface TextAnalysis {
  chars: CharAnalysis[];
  /** 未收录字列表 */
  unknown: string[];
  /** 五行统计（金木水火土各出现次数） */
  wuxingCount: Record<Wuxing, number>;
  /** 吉/平/凶字计数 */
  tendencyCount: Record<Tendency, number>;
  /** 总笔画 */
  totalStrokes: number;
  /** 字数（奇/偶影响阴阳判断） */
  charCount: number;
  /** 倪师注解集 */
  niNotes: { ch: string; note: string }[];
}

/**
 * 解析一段文字
 */
export function analyzeText(text: string): TextAnalysis {
  const rawChars = [...text.trim()].filter(ch => ch.trim()).slice(0, 12);
  const chars: CharAnalysis[] = [];
  const unknown: string[] = [];
  const niNotes: { ch: string; note: string }[] = [];

  let totalStrokes = 0;
  const wuxingCount: Record<Wuxing, number> = { 金: 0, 木: 0, 水: 0, 火: 0, 土: 0 };
  const tendencyCount: Record<Tendency, number> = { 吉: 0, 平: 0, 凶: 0, 随境: 0 };

  for (const ch of rawChars) {
    const found = CEZI_CHARS[ch] ?? null;
    if (!found) {
      chars.push({ ch, char: null, inDict: false, wuxing: null, radical: '未明' });
      unknown.push(ch);
      continue;
    }
    chars.push({
      ch,
      char: found,
      inDict: true,
      wuxing: found.wuxing,
      radical: found.radical,
    });
    wuxingCount[found.wuxing]++;
    tendencyCount[found.tendency]++;
    totalStrokes += found.strokes;
    if (found.niNote) niNotes.push({ ch, note: found.niNote });
  }

  return {
    chars,
    unknown,
    wuxingCount,
    tendencyCount,
    totalStrokes,
    charCount: chars.length,
    niNotes,
  };
}

/**
 * 偏旁 → 五行查询
 */
export function lookupRadicalWuxing(radical: string): { wx: Wuxing; why: string } | null {
  return RADICAL_WUXING[radical] ?? null;
}

/**
 * 按五行筛选
 */
export function charsByWuxing(wx: Wuxing): CeziChar[] {
  return Object.values(CEZI_CHARS).filter(c => c.wuxing === wx);
}

/**
 * 按吉凶倾向筛选
 */
export function charsByTendency(t: Tendency): CeziChar[] {
  return Object.values(CEZI_CHARS).filter(c => c.tendency === t);
}

/** 词典元信息 */
export const DICT_META = {
  totalChars: Object.keys(CEZI_CHARS).length,
  totalRadicals: Object.keys(RADICAL_WUXING).length,
  version: '2026-09-05',
  source: '倪海厦字理 + 康熙字典部首 + 通行字义',
};