/**
 * 廿四山向详解 · 地纪数据
 *
 * 堪舆"坐向"以廿四山为度：八天干（甲丙丁庚壬为阳、乙丁辛癸为阴）
 * + 十二地支 + 四维卦（乾坤艮巽），共 24 山。
 *
 * 每山以地盘正针为基准，分地元龙（地支为主）、天元龙（天干为主）、人元龙（卦位为主），
 * 主龙（坐山所属龙）、宾龙（朝向所属龙）之别；龙、水、向三者同元一气为最吉。
 *
 * 数据来源：公版《地理五诀》《罗经透解》《沈氏玄空学》摘要
 */

export interface Mountain {
  /** 山名（如 壬、子、癸） */
  name: string;
  /** 汉字索引（同向同时共八位） */
  index: number;
  /** 经度度数（0-360，正北 0/360） */
  degree: number;
  /** 天元/地元/人元 龙 */
  dragon: '天元龙' | '地元龙' | '人元龙';
  /** 阴阳属性 */
  yinYang: '阳' | '阴';
  /** 五行归属 */
  element: '木' | '火' | '土' | '金' | '水';
  /** 纳音五行 */
  nayinElement: string;
  /** 主星对照 */
  starNote: string;
  /** 阳宅吉凶要诀 */
  yangZhai: string;
  /** 阴宅（葬）要诀 */
  yinZhai: string;
  /** 主龙（水法同元）*/
  mainDragon: string;
}

/** 廿四山向数据表（按正针 360 度，每 15 度一山） */
export const TWENTY_FOUR_MOUNTAINS: Mountain[] = [
  // 北方（坎卦 壬子癸）
  { name: '壬', index: 1, degree: 337.5, dragon: '天元龙', yinYang: '阳', element: '水', nayinElement: '水', starNote: '辅星·贪狼', yangZhai: '壬山向宜坐高、靠山有水、来龙长远，主旺丁旺财。', yinZhai: '壬水先天在申，后天在坤，水口宜出此方为吉。', mainDragon: '坎龙' },
  { name: '子', index: 2, degree: 352.5, dragon: '地元龙', yinYang: '阳', element: '水', nayinElement: '水', starNote: '正坎卦', yangZhai: '子山午向为正南正北，正针正位，宜端正大气，最忌歪斜。', yinZhai: '子午正向，传统正针，葬法以端正为贵。', mainDragon: '坎龙' },
  { name: '癸', index: 3, degree: 7.5, dragon: '人元龙', yinYang: '阴', element: '水', nayinElement: '水', starNote: '辅星·破军', yangZhai: '癸山丁向宜水出巽方，主旺文昌、利学业。', yinZhai: '癸龙为水龙，水宜屈曲来朝，最忌直射。', mainDragon: '坎龙' },
  // 东北（艮卦 艮寅甲）
  { name: '艮', index: 4, degree: 22.5, dragon: '天元龙', yinYang: '阳', element: '土', nayinElement: '土', starNote: '少男·止', yangZhai: '艮山为东北高大，主丁财两旺。', yinZhai: '艮龙为山龙，宜山势绵延，不可孤露。', mainDragon: '艮龙' },
  { name: '寅', index: 5, degree: 37.5, dragon: '地元龙', yinYang: '阳', element: '木', nayinElement: '木', starNote: '辅星·巨门', yangZhai: '寅山申向，宜近有山、远有水。', yinZhai: '寅为虎，主猛，宜藏风聚气。', mainDragon: '艮龙' },
  { name: '甲', index: 6, degree: 52.5, dragon: '人元龙', yinYang: '阳', element: '木', nayinElement: '木', starNote: '辅星·廉贞', yangZhai: '甲方为东方木，宜林木茂盛。', yinZhai: '甲木主文，宜文昌方位高起。', mainDragon: '艮龙' },
  // 东方（震卦 卯乙辰）
  { name: '卯', index: 7, degree: 67.5, dragon: '天元龙', yinYang: '阴', element: '木', nayinElement: '木', starNote: '正震卦', yangZhai: '卯山酉向，正东正西，宜开阔明亮。', yinZhai: '卯木主生长，葬法宜朝阳。', mainDragon: '震龙' },
  { name: '乙', index: 8, degree: 82.5, dragon: '地元龙', yinYang: '阴', element: '木', nayinElement: '木', starNote: '辅星·禄存', yangZhai: '乙方为东南，宜林木秀美。', yinZhai: '乙为阴木，宜柔顺回环。', mainDragon: '震龙' },
  { name: '辰', index: 9, degree: 97.5, dragon: '人元龙', yinYang: '阳', element: '土', nayinElement: '土', starNote: '辅星·文曲', yangZhai: '辰山为东南偏南，宜蓄水。', yinZhai: '辰为水库，宜水聚汪洋。', mainDragon: '震龙' },
  // 东南（巽卦 巽巳丙）
  { name: '巽', index: 10, degree: 112.5, dragon: '天元龙', yinYang: '阴', element: '木', nayinElement: '木', starNote: '长女·入', yangZhai: '巽方为文昌位，宜高起秀丽。', yinZhai: '巽龙宜清秀蜿蜒。', mainDragon: '巽龙' },
  { name: '巳', index: 11, degree: 127.5, dragon: '地元龙', yinYang: '阳', element: '火', nayinElement: '火', starNote: '辅星·武曲', yangZhai: '巳方为东南偏南，宜火气旺盛。', yinZhai: '巳火主文明，宜文笔峰起。', mainDragon: '巽龙' },
  { name: '丙', index: 12, degree: 142.5, dragon: '人元龙', yinYang: '阳', element: '火', nayinElement: '火', starNote: '辅星·廉贞', yangZhai: '丙方为南方，宜向阳高爽。', yinZhai: '丙为太阳，宜朝案端正。', mainDragon: '巽龙' },
  // 南方（离卦 午丁未）
  { name: '午', index: 13, degree: 157.5, dragon: '天元龙', yinYang: '阳', element: '火', nayinElement: '火', starNote: '正离卦', yangZhai: '午山子向，宜南北通透。', yinZhai: '午火主文明，宜端正朝阳。', mainDragon: '离龙' },
  { name: '丁', index: 14, degree: 172.5, dragon: '地元龙', yinYang: '阴', element: '火', nayinElement: '火', starNote: '辅星·巨门', yangZhai: '丁山为正南稍偏，宜明堂开阔。', yinZhai: '丁火主柔，宜文峰秀丽。', mainDragon: '离龙' },
  { name: '未', index: 15, degree: 187.5, dragon: '人元龙', yinYang: '阴', element: '土', nayinElement: '土', starNote: '辅星·贪狼', yangZhai: '未方为西南，宜林木旺盛。', yinZhai: '未为木库，宜山势回环。', mainDragon: '离龙' },
  // 西南（坤卦 坤申庚）
  { name: '坤', index: 16, degree: 202.5, dragon: '天元龙', yinYang: '阴', element: '土', nayinElement: '土', starNote: '母亲·顺', yangZhai: '坤方为西南，宜平坦开阔。', yinZhai: '坤龙为地，宜浑厚饱满。', mainDragon: '坤龙' },
  { name: '申', index: 17, degree: 217.5, dragon: '地元龙', yinYang: '阳', element: '金', nayinElement: '金', starNote: '辅星·破军', yangZhai: '申方为西南偏西，宜山势高耸。', yinZhai: '申金主肃杀，宜藏锋。', mainDragon: '坤龙' },
  { name: '庚', index: 18, degree: 232.5, dragon: '人元龙', yinYang: '阳', element: '金', nayinElement: '金', starNote: '辅星·武曲', yangZhai: '庚方为西方，宜刚毅分明。', yinZhai: '庚金主刚，宜开阔。', mainDragon: '坤龙' },
  // 西方（兑卦 酉辛戌）
  { name: '酉', index: 19, degree: 247.5, dragon: '天元龙', yinYang: '阴', element: '金', nayinElement: '金', starNote: '正兑卦', yangZhai: '酉山卯向，正西正东，宜开阔低平。', yinZhai: '酉金主收敛，宜内收。', mainDragon: '兑龙' },
  { name: '辛', index: 20, degree: 262.5, dragon: '地元龙', yinYang: '阴', element: '金', nayinElement: '金', starNote: '辅星·文曲', yangZhai: '辛方为正西稍北，宜柔顺。', yinZhai: '辛为阴金，宜婉转。', mainDragon: '兑龙' },
  { name: '戌', index: 21, degree: 277.5, dragon: '人元龙', yinYang: '阳', element: '土', nayinElement: '土', starNote: '辅星·左辅', yangZhai: '戌方为西北，宜山势敦厚。', yinZhai: '戌为火库，宜藏聚。', mainDragon: '兑龙' },
  // 西北（乾卦 乾亥壬）
  { name: '乾', index: 22, degree: 292.5, dragon: '天元龙', yinYang: '阳', element: '金', nayinElement: '金', starNote: '父亲·健', yangZhai: '乾方为西北，宜高大刚健。', yinZhai: '乾龙为天龙，宜威严耸拔。', mainDragon: '乾龙' },
  { name: '亥', index: 23, degree: 307.5, dragon: '地元龙', yinYang: '阴', element: '水', nayinElement: '水', starNote: '辅星·右弼', yangZhai: '亥方为西北偏北，宜水气充盈。', yinZhai: '亥水主聚，宜汪洋。', mainDragon: '乾龙' },
  { name: '壬', index: 24, degree: 322.5, dragon: '人元龙', yinYang: '阳', element: '水', nayinElement: '水', starNote: '辅星·贪狼', yangZhai: '壬与北乾交界，宜稳重浑厚。', yinZhai: '壬水主智，宜清远。', mainDragon: '乾龙' },
];

/** 按卦宫分组（4 山一宫） */
export interface MountainGroup {
  gua: string;
  /** 卦位描述 */
  position: string;
  mountains: Mountain[];
  /** 宫位五行 */
  element: string;
  /** 宫位主神 */
  godNote: string;
}

export const MOUNTAIN_GROUPS: MountainGroup[] = [
  {
    gua: '坎',
    position: '正北 · 劳卦',
    mountains: TWENTY_FOUR_MOUNTAINS.filter(m => m.mainDragon === '坎龙'),
    element: '水',
    godNote: '中男 · 劳 · 智慧',
    },
  {
    gua: '艮',
    position: '东北 · 止卦',
    mountains: TWENTY_FOUR_MOUNTAINS.filter(m => m.mainDragon === '艮龙'),
    element: '土',
    godNote: '少男 · 止 · 笃实',
    },
  {
    gua: '震',
    position: '正东 · 动卦',
    mountains: TWENTY_FOUR_MOUNTAINS.filter(m => m.mainDragon === '震龙'),
    element: '木',
    godNote: '长男 · 动 · 决断',
    },
  {
    gua: '巽',
    position: '东南 · 入卦',
    mountains: TWENTY_FOUR_MOUNTAINS.filter(m => m.mainDragon === '巽龙'),
    element: '木',
    godNote: '长女 · 入 · 文昌',
    },
  {
    gua: '离',
    position: '正南 · 丽卦',
    mountains: TWENTY_FOUR_MOUNTAINS.filter(m => m.mainDragon === '离龙'),
    element: '火',
    godNote: '中女 · 丽 · 文明',
    },
  {
    gua: '坤',
    position: '西南 · 顺卦',
    mountains: TWENTY_FOUR_MOUNTAINS.filter(m => m.mainDragon === '坤龙'),
    element: '土',
    godNote: '母亲 · 顺 · 包容',
    },
  {
    gua: '兑',
    position: '正西 · 悦卦',
    mountains: TWENTY_FOUR_MOUNTAINS.filter(m => m.mainDragon === '兑龙'),
    element: '金',
    godNote: '少女 · 悦 · 口才',
    },
  {
    gua: '乾',
    position: '西北 · 健卦',
    mountains: TWENTY_FOUR_MOUNTAINS.filter(m => m.mainDragon === '乾龙'),
    element: '金',
    godNote: '父亲 · 健 · 刚健',
    },
];

/** 地理五诀 · 核心五要素 */
export interface FiveElement {
  key: '龙' | '穴' | '砂' | '水' | '向';
  name: string;
  /** 释义 */
  meaning: string;
  /** 要诀 */
  keyPoints: string[];
  /** 吉象 */
  lucky: string;
  /** 凶象 */
  unlucky: string;
  /** 倪师要点 */
  niNote: string;
}

export const FIVE_ELEMENTS: FiveElement[] = [
  {
    key: '龙',
    name: '龙脉',
    meaning: '来龙（山势）之起伏形态，决定生气之源。',
    keyPoints: [
      '龙要活泼：起伏蜿蜒，忌僵直粗笨',
      '龙要端正：左右对称，忌偏斜反弓',
      '龙要长远：发脉绵远，忌短促逼压',
      '龙要秀丽：气韵灵动，忌粗顽崩破',
    ],
    lucky: '五星（正体金星、圆体金星、扁体金星、尖体金星、方体金星）为主，辅以木星、水星、土星。',
    unlucky: '反弓、扛尸、断颈、过峡无情、孤峰独耸。',
    niNote: '倪海夏《天纪》：寻龙先看势，势不真则穴不的。',
    },
  {
    key: '穴',
    name: '穴场',
    meaning: '结穴之所，即堪舆所定的"气聚之处"。',
    keyPoints: [
      '阴阳交媾：背阴抱阳',
      '藏风聚气：四周有护',
      '界水明白：内堂水聚',
      '立向得宜：龙穴向水四者配合',
    ],
    lucky: '窝（开口）、钳（双臂）、乳（突出）、突（凸起）四象分明，堂气团聚。',
    unlucky: '漏（气散）、陷（气沉）、冲（气冲）、射（气射）。',
    niNote: '穴者，气之凝也；气凝之处，草木生之、禽兽聚之、人居之则旺。',
    },
  {
    key: '砂',
    name: '砂环',
    meaning: '穴场四周护山、朝山、乐山、案山之总称。',
    keyPoints: [
      '青龙白虎：左右护卫',
      '案山朝山：前朝后靠',
      '乐山：穴后镇压',
      '下手：水流出口处的山',
    ],
    lucky: '青龍蜿蜒，白虎驯伏，朱雀翔舞，玄武垂头，四神相应。',
    unlucky: '青龙反走、白虎衔尸、玄武拒尸、朱雀噪乱。',
    niNote: '砂以向穴为尊，合向者贵，反向者贱。',
    },
  {
    key: '水',
    name: '水流',
    meaning: '水法贯穿阴宅阳宅之吉凶，决定财丁之得失。',
    keyPoints: [
      '水之来：曲折悠扬',
      '水之去：屈曲而去',
      '水之抱：环抱有情',
      '水之朝：朝来有情',
    ],
    lucky: '九曲朝堂、玉带环腰、金城水聚。',
    unlucky: '直射（箭射）、反跳（反弓）、斜飞（斜走）、冲撞（冲心）。',
    niNote: '未看山先看水，有山无水休寻地。',
    },
  {
    key: '向',
    name: '朝向',
    meaning: '立向即定罗经之针度，定二十四山之方向。',
    keyPoints: [
      '龙向水三者同元一气',
      '天元龙立天元向、纳天元水',
      '地元龙立地元向、纳地元水',
      '人元龙立人元向、纳人元水',
    ],
    lucky: '龙、水、向三者同元一气为最上格。',
    unlucky: '龙水不同元、卦气混乱。',
    niNote: '立向不慎，全盘皆输。',
    },
];

/** 堪舆重要概念词表 */
export const CONCEPT_GLOSSARY = [
  { word: '三元九运', brief: '上元一百年三运（一、二、三）、中元三运（四、五、六）、下元三运（七、八、九），每运二十年。' },
  { word: '天元龙', brief: '天干所属之龙：乾坤艮巽为四阳卦之天元。' },
  { word: '地元龙', brief: '地支所属之龙。' },
  { word: '人元龙', brief: '八卦爻位所属之龙。' },
  { word: '龙水同元', brief: '龙与水同属一元（天元/地元/人元），最吉。' },
  { word: '零神正神', brief: '玄空大卦之用神，零神方宜水，正神方宜山。' },
  { word: '城门诀', brief: '穴前水去口名"城门"，要在我生方或同元方为吉。' },
  { word: '挨星', brief: '玄空飞星之核心，依运星与山向飞布九星于九宫。' },
];