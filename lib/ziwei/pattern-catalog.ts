/**
 * 紫微斗数静态格局档案库（前台化用）
 *
 * 数据来源：lib/ziwei/patterns.ts 中的 detect 函数（仅静态信息，不依赖运行时）
 * 设计目的：让 app/knowledge/pattern/ 路由可纯静态枚举所有格局（无需 GraphQL/计算）
 *
 * 与 detectPatterns() 的关系：
 *  - 本文件：所有格局的"通用知识"（分类/含义/条件/出处）
 *  - patterns.ts detectPatterns()：本盘实际触发情况（运行时）
 */

export type PatternCategory = '上格' | '中格' | '助力格' | '基础格' | '凶格';
export type PatternLevel = 'excellent' | 'good' | 'neutral' | 'caution';

export interface PatternEntry {
  /** 路由友好 ID（拼音） */
  id: string;
  /** 格局名 */
  name: string;
  /** 分类 */
  category: PatternCategory;
  /** 吉凶等级（运行时可能因破格降级） */
  level: PatternLevel;
  /** 一句话摘要（用于卡片概览） */
  summary: string;
  /** 完整释义（古籍+倪师融合） */
  description: string;
  /** 触发条件（静态汇总） */
  condition: string;
  /** 涉及宫位（可选） */
  palaces?: string[];
  /** 古籍出处 */
  source: string;
  /** 关键标签（用于前端筛选/搜索） */
  tags: string[];
}

export const PATTERN_CATALOG: PatternEntry[] = [
  // ──── 上格 ────
  {
    id: 'jun-chen-qing-hui',
    name: '君臣庆会',
    category: '上格',
    level: 'excellent',
    summary: '紫微入命，左辅右弼同会，帝星得贤臣辅佐。',
    description: '紫微入命，左辅右弼同会，帝王得贤臣辅佐，主大富大贵、统御之命。一生贵人不绝，宜走政商高位、跨界领袖之途。',
    condition: '紫微居命宫，左辅、右弼同会（或对照）。',
    palaces: ['命宫'],
    source: '《紫微斗数全书·君臣庆会格》',
    tags: ['紫微', '左辅', '右弼', '帝王', '领导'],
  },
  {
    id: 'zi-fu-tong-gong',
    name: '紫府同宫',
    category: '上格',
    level: 'excellent',
    summary: '紫微、天府同入命宫（寅/申），帝相并临。',
    description: '紫微天府同入命宫，帝相并临，尊贵之命。主品行端正、衣食无忧、有领导才能，宜担任要职。需要左右辅弼来配合方为完整大格。',
    condition: '紫微与天府同入命宫（限寅、申宫）。',
    palaces: ['命宫'],
    source: '《紫微斗数全书·紫府同宫格》',
    tags: ['紫微', '天府', '帝王', '衣食丰足'],
  },
  {
    id: 'fu-xiang-chao-yuan',
    name: '府相朝垣',
    category: '上格',
    level: 'excellent',
    summary: '天府、天相分守命宫三方四正，权印双辉。',
    description: '天府天相分守命宫三方四正，文武并济、权印双辉，主一生衣食丰足、地位崇高。古书云「府相朝垣千钟食禄」，常见于政界、企业管理者。',
    condition: '天府、天相分居命宫三方四正宫位（即命、财、官、迁）。',
    palaces: ['命宫', '财帛', '官禄', '迁移'],
    source: '《紫微斗数全书·府相朝垣》',
    tags: ['天府', '天相', '衣食丰足', '管理者'],
  },
  {
    id: 'yang-liang-chang-lu',
    name: '阳梁昌禄',
    category: '上格',
    level: 'excellent',
    summary: '太阳、天梁、文昌、禄存齐会，科举之星。',
    description: '太阳、天梁、文昌、禄存四星齐会命宫三方，号称「科举之星」，主清贵显达、考运极佳，宜走学术、文教、研究、专业认证之路，一生功名易就。',
    condition: '太阳、天梁、文昌、禄存齐会命宫三方四正。',
    palaces: ['命宫', '财帛', '官禄', '迁移'],
    source: '《紫微斗数全书·阳梁昌禄格》',
    tags: ['太阳', '天梁', '文昌', '禄存', '科举', '学术'],
  },
  {
    id: 'huo-tan-ge',
    name: '火贪格',
    category: '上格',
    level: 'excellent',
    summary: '贪狼遇火星同宫或对照，突发横财。',
    description: '贪狼遇火星同宫或三方会照，主突发横财、突如其来的机遇。古书云「贪狼遇火铃，必发横财」，但来得快去得也快，宜见好就收。',
    condition: '贪狼与火星同宫（铃贪同源，故同名铃贪格时换铃星）。',
    palaces: ['命宫'],
    source: '《紫微斗数骨髓赋》',
    tags: ['贪狼', '火星', '横财', '突发'],
  },
  {
    id: 'ling-tan-ge',
    name: '铃贪格',
    category: '上格',
    level: 'excellent',
    summary: '贪狼遇铃星同宫或对照，突发横财的另一面。',
    description: '贪狼遇铃星同宫或三方会照，主突发横财、机遇速至速离。古书云「贪狼遇火铃，必发横财」，但需见好就收。铃贪较火贪稍缓但同样不稳。',
    condition: '贪狼与铃星同宫（与火贪合称「火贪铃贪」）。',
    palaces: ['命宫'],
    source: '《紫微斗数骨髓赋》',
    tags: ['贪狼', '铃星', '横财'],
  },
  {
    id: 'wu-tan-ge',
    name: '武贪格',
    category: '上格',
    level: 'excellent',
    summary: '武曲、贪狼会命，财星与桃花同辉，三十岁后方发。',
    description: '武曲贪狼会命，财星与桃花欲望星交辉，古书云「武贪不发少年人」——三十岁后方能厚积薄发。主中年以后大富大贵，财源由人脉、应酬、欲望管理而来，适合金融、投机、销售、娱乐业。',
    condition: '武曲、贪狼同入命宫或对照命宫三方。',
    palaces: ['命宫'],
    source: '《紫微斗数骨髓赋》',
    tags: ['武曲', '贪狼', '中年大富', '财与桃花'],
  },
  {
    id: 'sha-po-lang',
    name: '杀破狼',
    category: '上格',
    level: 'good',
    summary: '七杀、破军、贪狼三星会命，开创闯荡之命。',
    description: '七杀、破军、贪狼三星会命，开创闯荡之命格。一生变动多、不甘平凡，宜创业、军警、业务、销售。中年后才能稳定守成，年轻时易因冲动失利。',
    condition: '七杀、破军、贪狼三星会照命宫三方四正。',
    palaces: ['命宫', '财帛', '官禄', '迁移'],
    source: '《紫微斗数全书·杀破狼》',
    tags: ['七杀', '破军', '贪狼', '创业', '军警'],
  },
  {
    id: 'ji-yue-tong-liang',
    name: '机月同梁',
    category: '上格',
    level: 'excellent',
    summary: '天机、太阴、天同、天梁齐入命迁财官，文质彬彬。',
    description: '天机太阴天同天梁四星齐入命迁财官，文质彬彬、聪慧善谋。最适合公职、学术、文艺、医疗、服务等需稳定累积的行业，不宜大冒险大投机。',
    condition: '天机、太阴、天同、天梁四星齐入命迁财官任两宫以上。',
    palaces: ['命宫', '财帛', '官禄', '迁移'],
    source: '《紫微斗数全书·机月同梁格》',
    tags: ['天机', '太阴', '天同', '天梁', '公职', '学术'],
  },

  // ──── 中格 ────
  {
    id: 'lian-xiang-ge',
    name: '廉贞天相格',
    category: '中格',
    level: 'good',
    summary: '廉贞、天相同宫，印绶格局，主秉公处事。',
    description: '廉贞天相同宫，印绶格局，主秉公处事、清廉之名，宜任公职、行政管理、法务、企划。怕见擎羊化忌，则反主官非。',
    condition: '廉贞、天相同宫于命宫或财官。',
    palaces: ['命宫'],
    source: '《紫微斗数全书》',
    tags: ['廉贞', '天相', '印绶', '公职'],
  },
  {
    id: 'wu-qi-sha',
    name: '武曲七杀',
    category: '中格',
    level: 'excellent',
    summary: '武曲、七杀同宫，将星配财星，主果决刚毅。',
    description: '武曲七杀同宫，将星配财星，主果决刚毅、理财能力强，适合金融、军警、创业。但忌见化忌煞星，否则凶险。一生奋斗、积财但操心。',
    condition: '武曲、七杀同入命宫。',
    palaces: ['命宫'],
    source: '《紫微斗数全书》',
    tags: ['武曲', '七杀', '将星', '理财'],
  },
  {
    id: 'tong-liang-ge',
    name: '天同天梁格',
    category: '中格',
    level: 'good',
    summary: '天同、天梁同宫，福星与荫星共会。',
    description: '天同天梁同宫，福星与荫星共会，主宽厚和善、乐于助人，宜医疗、教育、宗教、社会公益。但偏温和保守，难成大富大贵之局。',
    condition: '天同、天梁同入命宫。',
    palaces: ['命宫'],
    source: '《紫微斗数全书》',
    tags: ['天同', '天梁', '福德', '荫庇'],
  },
  {
    id: 'ri-yue-tong-gong',
    name: '日月同宫',
    category: '中格',
    level: 'excellent',
    summary: '太阳、太阴同宫（丑/未），阴阳平衡。',
    description: '太阳太阴于丑宫或未宫同宫，阴阳平衡，文武兼备。主异性缘佳、事业顺遂、名声远播。未宫日月双美尤佳，丑宫力量较平。',
    condition: '太阳、太阴同入丑宫或未宫（限此二宫）。',
    palaces: ['命宫'],
    source: '《紫微斗数全书》',
    tags: ['太阳', '太阴', '阴阳平衡', '未宫尤佳'],
  },
  {
    id: 'ri-yue-jia-ming',
    name: '日月夹命',
    category: '中格',
    level: 'excellent',
    summary: '太阳、太阴分居命宫两侧，光明磊落。',
    description: '太阳太阴分居命宫两侧夹照，光明磊落，一生贵人相助，事业蓬勃。男主官贵，女主旺夫兴家。日月须不落陷方为真夹。',
    condition: '太阳、太阴分居命宫前后两宫（夹）。',
    palaces: ['命宫'],
    source: '《紫微斗数全书·日月夹命》',
    tags: ['太阳', '太阴', '夹命', '光明磊落'],
  },
  {
    id: 'ju-ri-tong-gong',
    name: '巨日同宫',
    category: '中格',
    level: 'excellent',
    summary: '巨门、太阳同寅宫，口才专业立业之命。',
    description: '巨门太阳同寅宫，太阳化解巨门暗曜，主以口才、传媒、外语、专业立业。寅宫为佳，申宫力减。怕巨门化忌则官非。',
    condition: '巨门、太阳同入寅宫（申宫减力）。',
    palaces: ['命宫'],
    source: '《紫微斗数全书·巨日同宫》',
    tags: ['巨门', '太阳', '寅宫', '口才'],
  },
  {
    id: 'shi-zhong-yin-yu',
    name: '石中隐玉',
    category: '中格',
    level: 'excellent',
    summary: '巨门坐命子或午，外表平凡而内蕴才学。',
    description: '巨门坐命子午，外表平凡而内蕴才学。早年默默无闻、中年方显贵气，宜走专业、研究、口才、传媒。需有禄权或文昌相助方能「凿石见玉」。',
    condition: '巨门坐命子宫或午宫。',
    palaces: ['命宫'],
    source: '《紫微斗数骨髓赋·石中隐玉》',
    tags: ['巨门', '子午', '大器晚成'],
  },
  {
    id: 'ming-zhu-chu-hai',
    name: '明珠出海',
    category: '中格',
    level: 'excellent',
    summary: '命未空，对宫丑位日月同辉。',
    description: '命未空宫，对宫丑宫日月同辉拱照，号「明珠出海」。主出生平凡、后天努力出头，宜远赴他乡、学术研究或大公司高位，主大富大贵。',
    condition: '命在未宫，对宫丑宫有太阳、太阴同宫。',
    palaces: ['命宫'],
    source: '《紫微斗数全集·明珠出海》',
    tags: ['未宫空宫', '丑宫日月', '后天努力'],
  },
  {
    id: 'zi-wei-ru-ming',
    name: '紫微入命',
    category: '中格',
    level: 'good',
    summary: '紫微独坐命宫，帝王之星。',
    description: '紫微独坐命宫，帝王之星，自尊心强、有领导魅力。但紫微最忌「在野孤君」——若无左右辅弼相会，反成孤高自傲、易招毁谤。',
    condition: '紫微独坐命宫（无论吉凶配会均触发）。',
    palaces: ['命宫'],
    source: '《紫微斗数全书》',
    tags: ['紫微', '独坐', '帝王', '忌孤君'],
  },

  // ──── 助力格 ────
  {
    id: 'fu-bi-jia-ming',
    name: '辅弼夹命',
    category: '助力格',
    level: 'excellent',
    summary: '左辅、右弼夹命，终身福厚。',
    description: '左辅右弼夹命，一生贵人不断、逢凶化吉。适合走仕途、大企业管理，有贵人提携之命。古书云「左辅右弼，终身福厚」。',
    condition: '左辅、右弼分居命宫前后两宫（夹）。',
    palaces: ['命宫'],
    source: '《紫微斗数全书·辅弼夹命》',
    tags: ['左辅', '右弼', '夹命', '贵人'],
  },
  {
    id: 'chang-qu-jia-ming',
    name: '昌曲夹命',
    category: '助力格',
    level: 'excellent',
    summary: '文昌、文曲夹命，聪明俊秀。',
    description: '文昌文曲夹命宫，主聪明俊秀、文采斐然，宜走文教、学术、艺术、写作。古书云「昌曲夹命主科甲」，最利考运。',
    condition: '文昌、文曲分居命宫前后两宫（夹）。',
    palaces: ['命宫'],
    source: '《紫微斗数全书》',
    tags: ['文昌', '文曲', '夹命', '科甲'],
  },
  {
    id: 'kui-yue-jia-ming',
    name: '魁钺夹命',
    category: '助力格',
    level: 'good',
    summary: '天魁、天钺夹命，男称天乙、女称玉堂。',
    description: '天魁天钺夹命，男称天乙、女称玉堂，一生贵人提携。考试、求职、关键时刻常有意外贵人相助。',
    condition: '天魁、天钺分居命宫前后两宫（夹）。',
    palaces: ['命宫'],
    source: '《紫微斗数全书》',
    tags: ['天魁', '天钺', '夹命', '贵人'],
  },
  {
    id: 'shuang-lu-chao-yuan',
    name: '双禄朝垣',
    category: '助力格',
    level: 'excellent',
    summary: '化禄、禄存同会命宫三方四正，富比陶朱。',
    description: '化禄、禄存同会命宫三方四正，财源涌动、衣食丰足。古书云「双禄朝垣，富比陶朱」，主一生不愁财，多有正财横财兼得。',
    condition: '化禄与禄存同会命宫三方四正。',
    palaces: ['命宫', '财帛', '官禄', '迁移'],
    source: '《紫微斗数全书·双禄朝垣》',
    tags: ['化禄', '禄存', '财源'],
  },
  {
    id: 'san-qi-jia-hui',
    name: '三奇加会',
    category: '助力格',
    level: 'excellent',
    summary: '化禄、化权、化科三吉化齐会，最高级吉格之一。',
    description: '化禄、化权、化科三吉化齐会命宫三方四正，号称「三奇加会」。主一生功名、财富、贵人三全，是紫微斗数最高吉格之一。',
    condition: '化禄、化权、化科三吉化齐会命宫三方四正。',
    palaces: ['命宫', '财帛', '官禄', '迁移'],
    source: '《紫微斗数全书·三奇加会》',
    tags: ['化禄', '化权', '化科', '三奇', '顶级吉格'],
  },

  // ──── 基础格 ────
  {
    id: 'lu-cun-shou-ming',
    name: '禄存守命',
    category: '基础格',
    level: 'good',
    summary: '禄存入命宫或身宫，财星守身。',
    description: '禄存居命宫或身宫，禄星守身，一生有稳定财源与基本福禄。但独坐则「禄逢冲破」，需有化禄或天马同会方为真富贵。',
    condition: '禄存坐守命宫或身宫。',
    palaces: ['命宫', '身宫'],
    source: '《紫微斗数全书·禄存星》',
    tags: ['禄存', '守命', '财源'],
  },
  {
    id: 'tian-ma-ru-ming',
    name: '天马入命',
    category: '基础格',
    level: 'neutral',
    summary: '天马入命或迁，动荡奔波之象。',
    description: '天马入命宫或迁移宫，主一生多动、出国、搬迁、奔波。古书称「天马与禄存同宫为禄马交驰，发财于远」。',
    condition: '天马坐守命宫或迁移宫。',
    palaces: ['命宫', '迁移'],
    source: '《紫微斗数全书·天马星》',
    tags: ['天马', '迁徙', '奔波'],
  },
  {
    id: 'hua-lu-ru-cai',
    name: '化禄入财',
    category: '基础格',
    level: 'good',
    summary: '化禄入财帛宫，财源稳定。',
    description: '某主星化禄入财帛宫，主财源畅通、收入稳定。倪师讲化禄是「正财」象征——该主星代表的能力是你赚钱的主轴。配禄存或天马则财源更广。',
    condition: '任一主星化禄入财帛宫。',
    palaces: ['财帛'],
    source: '《紫微斗数全书·四化论》',
    tags: ['化禄', '财帛宫', '正财'],
  },
  {
    id: 'hua-quan-ru-guan',
    name: '化权入官',
    category: '基础格',
    level: 'good',
    summary: '化权入官禄宫，事业主导权。',
    description: '某主星化权入官禄宫，主事业有主导权、能掌控大局。倪师讲化权是「实权」象征，所在宫位代表你实际掌控的人生面。',
    condition: '任一主星化权入官禄宫。',
    palaces: ['官禄'],
    source: '《紫微斗数全书·四化论》',
    tags: ['化权', '官禄宫', '实权'],
  },
  {
    id: 'hua-ke-ru-ming',
    name: '化科入命',
    category: '基础格',
    level: 'good',
    summary: '化科入命宫或身宫，名声与贵人。',
    description: '某主星化科入命宫或身宫，主名声清亮、考试得利、有贵人照拂。倪师讲化科是「名声/贵人」象征，所在宫位代表你被认可的面向。',
    condition: '任一主星化科入命宫或身宫。',
    palaces: ['命宫', '身宫'],
    source: '《紫微斗数全书·四化论》',
    tags: ['化科', '命宫', '名声'],
  },
  {
    id: 'chang-qu-tong-hui',
    name: '昌曲同会',
    category: '基础格',
    level: 'good',
    summary: '文昌、文曲同会命宫或对照，文思敏捷。',
    description: '文昌、文曲同会或对照命宫，主文学、艺术、考试之命。比「昌曲夹命」轻一等，但仍属文星加会，有助考运与文采。',
    condition: '文昌、文曲同入命宫或会照命宫。',
    palaces: ['命宫'],
    source: '《紫微斗数全书·文星论》',
    tags: ['文昌', '文曲', '文星'],
  },
  {
    id: 'fu-bi-tong-hui',
    name: '辅弼同会',
    category: '基础格',
    level: 'good',
    summary: '左辅、右弼同会命宫，贵人相助。',
    description: '左辅、右弼同会或对照命宫，主一生有贵人相助。比「辅弼夹命」轻一等，但仍主平稳无灾。',
    condition: '左辅、右弼同入命宫或会照命宫。',
    palaces: ['命宫'],
    source: '《紫微斗数全书·辅弼论》',
    tags: ['左辅', '右弼', '贵人'],
  },
  {
    id: 'kui-yue-tong-hui',
    name: '魁钺同会',
    category: '基础格',
    level: 'good',
    summary: '天魁、天钺同会命宫。',
    description: '天魁、天钺同会或对照命宫，主关键时刻有贵人相助。比「魁钺夹命」轻一等，但仍是吉配。',
    condition: '天魁、天钺同入命宫或会照命宫。',
    palaces: ['命宫'],
    source: '《紫微斗数全书·魁钺论》',
    tags: ['天魁', '天钺', '贵人'],
  },
  {
    id: 'ke-quan-shuang-hui',
    name: '科权双会',
    category: '基础格',
    level: 'good',
    summary: '化科、化权同会，名权双美。',
    description: '化科 + 化权 同会三方四正，主名权双美——既有学识/名声（科），又有掌控力（权），宜走「专业权威」路线（如医生、律师、教授、技术骨干），名利双收且根基扎实。',
    condition: '化科、化权同会命宫三方四正。',
    palaces: ['命宫'],
    source: '《紫微斗数全书·四化会照》',
    tags: ['化科', '化权', '名权双美'],
  },

  // ──── 凶格 ────
  {
    id: 'yang-tuo-jia-ji',
    name: '羊陀夹忌',
    category: '凶格',
    level: 'caution',
    summary: '化忌坐命，擎羊、陀罗夹命，败局。',
    description: '化忌坐命，左右擎羊陀罗夹命，古书云「羊陀夹忌为败局」，主一生劳碌奔波、坎坷不顺、身心俱疲。需以德行修养与积极做事化解，凡事谨慎为上。',
    condition: '化忌坐命 + 擎羊、陀罗分居命宫前后两宫。',
    palaces: ['命宫'],
    source: '《紫微斗数骨髓赋·羊陀夹忌》',
    tags: ['擎羊', '陀罗', '化忌', '夹命', '劳碌'],
  },
  {
    id: 'huo-ling-jia-ming',
    name: '火铃夹命',
    category: '凶格',
    level: 'caution',
    summary: '火星、铃星夹命，性急易冲突。',
    description: '火星铃星分居命宫前后两宫夹命，主性急、易冲动、突发意外或纠纷。需培养耐性、避免冲动决策。',
    condition: '火星、铃星分居命宫前后两宫（夹）。',
    palaces: ['命宫'],
    source: '《紫微斗数全书》',
    tags: ['火星', '铃星', '夹命', '冲动'],
  },
  {
    id: 'kong-jie-jia-ming',
    name: '空劫夹命',
    category: '凶格',
    level: 'caution',
    summary: '地空、地劫夹命，财不聚。',
    description: '地空地劫夹命，主财来财去、思想脱俗、易遁入宗教哲学。古书云「空劫夹命，财不聚」。宜技艺、宗教、研究等不重物质之业。',
    condition: '地空、地劫分居命宫前后两宫（夹）。',
    palaces: ['命宫'],
    source: '《紫微斗数全书》',
    tags: ['地空', '地劫', '夹命', '财不聚'],
  },
  {
    id: 'lian-sha-yang',
    name: '廉杀羊',
    category: '凶格',
    level: 'caution',
    summary: '廉贞、七杀、擎羊会照，古书警示之凶格。',
    description: '廉贞、七杀、擎羊三星会照命宫三方，古书警示之凶格。主血光、官非、意外。本命有此格不必惊慌，但流年大限再触发时需特别谨慎驾驶、避免冲突、注意手术风险。',
    condition: '廉贞、七杀、擎羊三星会照三方四正。',
    palaces: ['命宫'],
    source: '《紫微斗数全书·廉杀羊》',
    tags: ['廉贞', '七杀', '擎羊', '血光'],
  },
  {
    id: 'ju-huo-yang',
    name: '巨火羊',
    category: '凶格',
    level: 'caution',
    summary: '巨门、火星、擎羊会照，古书云「终身缢死」。',
    description: '巨门、火星、擎羊三星会照，古书云「巨火羊，终身缢死」——古时凶格。现代理解为：易因口舌、激烈冲突而招大祸。需修身养性、慎言慎行，避免极端情绪。',
    condition: '巨门、火星、擎羊三星会照三方四正。',
    palaces: ['命宫'],
    source: '《紫微斗数骨髓赋·巨火羊》',
    tags: ['巨门', '火星', '擎羊', '口舌祸'],
  },
  {
    id: 'ling-chang-tuo-wu',
    name: '铃昌陀武',
    category: '凶格',
    level: 'caution',
    summary: '铃星、文昌、陀罗、武曲会照，古书警示。',
    description: '铃星、文昌、陀罗、武曲四星齐会，古书云「铃昌陀武，限至投河」——古时大凶格。本命有此组合本身不必恐慌，但流年大限触发时需高度警觉重大决策、情绪起伏、水边活动。',
    condition: '铃星、文昌、陀罗、武曲四星会照三方四正。',
    palaces: ['命宫'],
    source: '《紫微斗数骨髓赋·铃昌陀武》',
    tags: ['铃星', '文昌', '陀罗', '武曲'],
  },
  {
    id: 'ma-tou-dai-jian',
    name: '马头带箭',
    category: '凶格',
    level: 'caution',
    summary: '擎羊于午宫坐命，威镇边疆。',
    description: '擎羊于午宫坐命，号「马头带箭」。古书云「威镇边疆」——主刚毅果决、有冲杀之力，宜军警武职、运动员、外科医师。但同时主危险与意外，需配合杀破狼或贵人方为大格，否则反主血光。',
    condition: '擎羊于午宫坐命。',
    palaces: ['命宫'],
    source: '《紫微斗数骨髓赋·马头带箭》',
    tags: ['擎羊', '午宫', '刚毅', '危险'],
  },
];

// ──── 工具函数 ────
export const PATTERN_CATEGORIES: PatternCategory[] = ['上格', '中格', '助力格', '基础格', '凶格'];
export const PATTERN_LEVELS: PatternLevel[] = ['excellent', 'good', 'neutral', 'caution'];

export const LEVEL_LABEL: Record<PatternLevel, string> = {
  excellent: '上上',
  good: '吉',
  neutral: '中性',
  caution: '凶',
};

export const LEVEL_COLOR: Record<PatternLevel, string> = {
  excellent: '#a8862a',
  good: '#8b6410',
  neutral: '#5a6275',
  caution: '#c43a3a',
};

export const CATEGORY_LABEL: Record<PatternCategory, string> = {
  '上格': '上格（顶级）',
  '中格': '中格（中等）',
  '助力格': '助力格（组合）',
  '基础格': '基础格（常见）',
  '凶格': '凶格（警示）',
};

/** 按 ID 查询单个格局 */
export function findPattern(id: string): PatternEntry | undefined {
  return PATTERN_CATALOG.find(p => p.id === id);
}

/** 按名称模糊查询 */
export function searchPatterns(query: string): PatternEntry[] {
  if (!query) return PATTERN_CATALOG;
  const q = query.trim();
  if (!q) return PATTERN_CATALOG;
  const lower = q.toLowerCase();
  return PATTERN_CATALOG.filter(p =>
    p.name.includes(q)
    || p.tags.some(t => t.includes(q))
    || p.description.includes(q)
    || p.summary.includes(q)
    || p.id.toLowerCase().includes(lower)
  );
}

/** 按分类分组 */
export function groupPatternsByCategory(patterns: PatternEntry[]): Record<PatternCategory, PatternEntry[]> {
  const result: Record<PatternCategory, PatternEntry[]> = {
    '上格': [], '中格': [], '助力格': [], '基础格': [], '凶格': [],
  };
  patterns.forEach(p => { result[p.category].push(p); });
  return result;
}
