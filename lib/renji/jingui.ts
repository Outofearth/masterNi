/**
 * 《金匮要略》核心方剂库
 *
 * 数据来源：《金匮要略》（东汉·张仲景，公版）摘要
 * 倪海厦《人纪》讲解之方剂精选
 *
 * 分类：杂病 → 痉湿暍 / 百合狐惑阴阳毒 / 血痹虚劳 / 肺痿肺痈 / 五脏风寒积聚 / 胸痹心痛 / 腹满寒疝 / 痰饮咳嗽 / 消渴小便不利 / 水气 / 黄疸 / 惊悸吐衄下血 / 呕吐哕下利 / 疮痈肠痈浸淫 / 趺蹶手指臂肿 / 妇人妊娠 / 妇人产后 / 妇人杂病
 */

export interface JinguiFormula {
  no: number;
  name: string;
  /** 所属篇章 */
  chapter: string;
  /** 主治 */
  indication: string;
  /** 主症 */
  symptoms: string;
  /** 君药 */
  king: string;
  /** 组成 */
  composition: string;
  /** 倪师要点 */
  niNote: string;
  /** 现代应用 */
  modern?: string;
}

export const JINGUI_FORMULAS: JinguiFormula[] = [
  // ─── 杂病方（痉湿暍） ───
  { no: 1, name: '栝楼桂枝汤', chapter: '痉湿暍', indication: '柔痉', symptoms: '发热汗出、不恶寒、身体强几几然、脉沉迟', king: '栝楼根', composition: '栝楼根 + 桂枝 + 芍药 + 甘草 + 生姜 + 大枣', niNote: '柔痉津液不足者', modern: '抽搐、强直' },
  { no: 2, name: '葛根汤', chapter: '痉湿暅', indication: '刚痉', symptoms: '无汗、小便少、气上冲胸、口噤不得语', king: '葛根', composition: '葛根 + 麻黄 + 桂枝 + 芍药 + 甘草 + 生姜 + 大枣', niNote: '刚痉无汗，须发汗', modern: '颈椎病' },

  // ─── 百合狐惑阴阳毒 ───
  { no: 3, name: '百合地黄汤', chapter: '百合狐惑', indication: '百合病', symptoms: '意欲食复不能食、欲卧不能卧、欲行不能行', king: '百合', composition: '百合 + 生地黄', niNote: '倪师：百合病为心肺阴虚', modern: '神经衰弱、更年期' },
  { no: 4, name: '甘草泻心汤', chapter: '狐惑', indication: '狐惑病', symptoms: '默默欲眠、目不得闭、卧起不安、蚀于喉为惑、蚀于阴为狐', king: '甘草', composition: '甘草 + 黄芩 + 黄连 + 干姜 + 半夏 + 大枣', niNote: '狐惑病为湿热虫毒', modern: '白塞病、口腔溃疡' },

  // ─── 血痹虚劳 ───
  { no: 5, name: '黄芪桂枝五物汤', chapter: '血痹', indication: '血痹', symptoms: '身体不仁、如风痹状', king: '黄芪', composition: '黄芪 + 桂枝 + 芍药 + 生姜 + 大枣', niNote: '血痹肌肤不仁，益气养血', modern: '麻木、中风后遗症' },
  { no: 6, name: '肾气丸', chapter: '虚劳', indication: '肾阳虚', symptoms: '腰痛脚软、下半身常有冷感、小便不利或反多、夜尿频繁', king: '附子、桂枝', composition: '干地黄 + 山药 + 山茱萸 + 泽泻 + 茯苓 + 牡丹皮 + 桂枝 + 附子', niNote: '倪师：补肾阳之祖方', modern: '慢性肾炎、糖尿病、夜尿' },
  { no: 7, name: '薯蓣丸', chapter: '虚劳', indication: '虚劳诸不足', symptoms: '风气百疾', king: '薯蓣（山药）', composition: '薯蓣 + 当归 + 桂枝 + 曲 + 干地黄 + 豆黄卷 + 甘草 + 人参 + 川芎 + 芍药 + 白术 + 麦门冬 + 杏仁 + 柴胡 + 桔梗 + 茯苓 + 阿胶 + 干姜 + 白蔹 + 防风 + 大枣', niNote: '倪师：补虚调中，治一切虚劳', modern: '体虚、慢性病' },
  { no: 8, name: '酸枣仁汤', chapter: '虚劳', indication: '虚劳虚烦不得眠', symptoms: '虚劳虚烦不得眠', king: '酸枣仁', composition: '酸枣仁 + 甘草 + 知母 + 茯苓 + 川芎', niNote: '倪师：肝血不足失眠之方', modern: '失眠' },

  // ─── 肺痿肺痈 ───
  { no: 9, name: '甘草干姜汤', chapter: '肺痿', indication: '肺中冷', symptoms: '吐涎沫、不咳不渴、遗尿小便数', king: '甘草、干姜', composition: '甘草 + 干姜', niNote: '温肺复气', modern: '寒饮咳喘' },
  { no: 10, name: '葶苈大枣泻肺汤', chapter: '肺痈', indication: '肺痈', symptoms: '喘不得卧', king: '葶苈子', composition: '葶苈子 + 大枣', niNote: '泻肺水', modern: '胸腔积液' },

  // ─── 胸痹心痛 ───
  { no: 11, name: '栝楼薤白白酒汤', chapter: '胸痹', indication: '胸痹', symptoms: '胸背痛、短气、寸口脉沉而迟、关上小紧数', king: '栝楼', composition: '栝楼实 + 薤白 + 白酒', niNote: '倪师：胸阳不振之方', modern: '冠心病、心绞痛' },
  { no: 12, name: '栝楼薤白半夏汤', chapter: '胸痹', indication: '胸痹不得卧', symptoms: '心痛彻背', king: '栝楼、半夏', composition: '栝楼实 + 薤白 + 半夏 + 白酒', niNote: '痰浊壅盛', modern: '心绞痛' },
  { no: 13, name: '乌头赤石脂丸', chapter: '心痛', indication: '心痛彻背', symptoms: '心痛彻背、背痛彻心', king: '乌头', composition: '蜀椒 + 附子 + 干姜 + 赤石脂 + 乌头', niNote: '倪师：心阳衰微、寒凝心脉', modern: '心绞痛' },

  // ─── 腹满寒疝 ───
  { no: 14, name: '厚朴七物汤', chapter: '腹满', indication: '病腹满', symptoms: '腹满、发热十日、脉浮而数、饮食如故', king: '厚朴', composition: '厚朴 + 甘草 + 大黄 + 大枣 + 枳实 + 桂枝 + 生姜', niNote: '表里两解', modern: '消化不良' },
  { no: 15, name: '附子粳米汤', chapter: '腹满', indication: '腹中寒气', symptoms: '腹中切痛、胸胁逆满、呕吐', king: '附子', composition: '附子 + 半夏 + 甘草 + 大枣 + 粳米', niNote: '温中散寒', modern: '胃寒痛' },
  { no: 16, name: '大建中汤', chapter: '腹满', indication: '心胸中大寒痛', symptoms: '呕不能饮食、腹中寒、上冲皮起、出现有头足、上下痛不可触近', king: '蜀椒、干姜', composition: '蜀椒 + 干姜 + 人参 + 饴糖', niNote: '倪师：建中者，温建中脏', modern: '虚寒腹痛' },
  { no: 17, name: '大乌头煎', chapter: '寒疝', indication: '寒疝', symptoms: '脉弦紧、恶寒不欲食、绕脐痛、发作有时、手足厥冷', king: '乌头', composition: '乌头（蜜煎）', niNote: '破积散寒', modern: '寒疝腹痛' },

  // ─── 痰饮咳嗽 ───
  { no: 18, name: '苓桂术甘汤', chapter: '痰饮', indication: '痰饮', symptoms: '心下有痰饮、胸胁支满、目眩', king: '茯苓', composition: '茯苓 + 桂枝 + 白术 + 甘草', niNote: '倪师：温阳化饮、健脾利湿', modern: '眩晕、心悸、慢性心衰' },
  { no: 19, name: '甘遂半夏汤', chapter: '痰饮', indication: '留饮', symptoms: '脉伏、欲自利、利反快、虽利心下续坚满', king: '甘遂', composition: '甘遂 + 半夏 + 芍药 + 甘草', niNote: '因势利导', modern: '腹水' },
  { no: 20, name: '小半夏汤', chapter: '痰饮', indication: '呕家', symptoms: '呕家本渴、渴者为欲解、今反不渴、心下有支饮', king: '半夏', composition: '半夏 + 生姜', niNote: '倪师：止呕祖方', modern: '呕吐' },

  // ─── 消渴小便不利 ───
  { no: 21, name: '五苓散', chapter: '消渴', indication: '小便不利', symptoms: '脉浮、小便不利、微热消渴', king: '茯苓', composition: '猪苓 + 茯苓 + 白术 + 泽泻 + 桂枝', niNote: '气化利水', modern: '水肿' },
  { no: 22, name: '文蛤散', chapter: '消渴', indication: '渴欲饮水不止', symptoms: '渴欲饮水不止', king: '文蛤', composition: '文蛤', niNote: '清热生津', modern: '消渴' },

  // ─── 水气 ───
  { no: 23, name: '越婢汤', chapter: '水气', indication: '风水', symptoms: '一身悉肿、脉浮、不渴、续自汗出、无大热', king: '麻黄、石膏', composition: '麻黄 + 石膏 + 生姜 + 甘草 + 大枣', niNote: '倪师：风水主方，发汗行水', modern: '急性肾炎、风水' },
  { no: 24, name: '防己黄芪汤', chapter: '水气', indication: '风水表虚', symptoms: '脉浮、身重、汗出恶风', king: '黄芪、防己', composition: '防己 + 黄芪 + 白术 + 甘草 + 生姜 + 大枣', niNote: '益气利水', modern: '慢性肾炎、肥胖' },

  // ─── 黄疸 ───
  { no: 25, name: '茵陈蒿汤', chapter: '黄疸', indication: '湿热黄疸', symptoms: '寒热不食、食即头眩、心胸不安、久久发黄', king: '茵陈', composition: '茵陈 + 栀子 + 大黄', niNote: '倪师：阳黄主方', modern: '黄疸型肝炎' },
  { no: 26, name: '硝石矾石散', chapter: '黄疸', indication: '女劳疸', symptoms: '膀胱急、少腹满、身尽黄、额上黑、足下热', king: '硝石、矾石', composition: '硝石 + 矾石（大麦粥汁和服）', niNote: '祛瘀逐浊', modern: '慢性肝病' },

  // ─── 惊悸吐衄下血 ───
  { no: 27, name: '桂枝加龙骨牡蛎汤', chapter: '惊悸', indication: '虚劳失精', symptoms: '男子失精、女子梦交', king: '龙骨、牡蛎', composition: '桂枝汤 + 龙骨 + 牡蛎', niNote: '倪师：交通心肾、安神定志', modern: '失眠、遗精' },
  { no: 28, name: '黄土汤', chapter: '下血', indication: '脾阳虚出血', symptoms: '下血、先便后血', king: '灶心黄土', composition: '甘草 + 干地黄 + 白术 + 附子 + 阿胶 + 黄芩 + 灶心黄土', niNote: '温脾摄血', modern: '慢性出血' },

  // ─── 呕吐哕下利 ───
  { no: 29, name: '大半夏汤', chapter: '呕吐', indication: '胃反呕吐', symptoms: '朝食暮吐、暮食朝吐', king: '半夏', composition: '半夏 + 人参 + 白蜜', niNote: '和胃降逆', modern: '呕吐' },
  { no: 30, name: '大黄甘草汤', chapter: '呕吐', indication: '食已即吐', symptoms: '食已即吐', king: '大黄', composition: '大黄 + 甘草', niNote: '泻热通便', modern: '呕吐' },

  // ─── 疮痈肠痈浸淫 ───
  { no: 31, name: '大黄牡丹汤', chapter: '肠痈', indication: '肠痈（急性阑尾炎）', symptoms: '少腹肿痞、按之痛如淋、小便自调、时时发热、自汗出、复恶寒', king: '大黄、桃仁', composition: '大黄 + 牡丹皮 + 桃仁 + 瓜子 + 芒硝', niNote: '倪师：肠痈急性期主方', modern: '阑尾炎' },
  { no: 32, name: '薏苡附子败酱散', chapter: '肠痈', indication: '肠痈脓成', symptoms: '身无热、肌肤甲错、腹皮急、按之濡', king: '薏苡仁', composition: '薏苡仁 + 附子 + 败酱草', niNote: '排脓消肿', modern: '慢性阑尾炎' },

  // ─── 妇人妊娠 ───
  { no: 33, name: '桂枝茯苓丸', chapter: '妊娠', indication: '妊娠癥病', symptoms: '妇人宿有癥病、经断未及三月、得漏下不止、胎动在脐上', king: '桃仁、丹皮', composition: '桂枝 + 茯苓 + 牡丹皮 + 桃仁 + 芍药', niNote: '倪师：化瘀消癥，妇科圣方', modern: '子宫肌瘤、卵巢囊肿' },
  { no: 34, name: '胶艾汤', chapter: '妊娠', indication: '妊娠腹痛下血', symptoms: '胞阻', king: '阿胶、艾叶', composition: '川芎 + 阿胶 + 甘草 + 艾叶 + 当归 + 芍药 + 干地黄', niNote: '养血止血', modern: '先兆流产' },
  { no: 35, name: '当归散', chapter: '妊娠', indication: '妊娠养胎', symptoms: '妇人妊娠', king: '当归、黄芩', composition: '当归 + 黄芩 + 芍药 + 川芎 + 白术', niNote: '倪师：养胎常方', modern: '妊娠调理' },

  // ─── 妇人产后 ───
  { no: 36, name: '小柴胡汤', chapter: '产后', indication: '产后郁冒', symptoms: '产妇喜汗出者、亡津液、胃中燥、大便难', king: '柴胡', composition: '柴胡 + 黄芩 + 人参 + 半夏 + 甘草 + 生姜 + 大枣', niNote: '和解少阳', modern: '产后调理' },
  { no: 37, name: '当归生姜羊肉汤', chapter: '产后', indication: '产后腹痛', symptoms: '腹中㽲痛', king: '当归', composition: '当归 + 生姜 + 羊肉', niNote: '倪师：产后补虚养血名方', modern: '产后体虚、贫血' },

  // ─── 妇人杂病 ───
  { no: 38, name: '温经汤', chapter: '妇人杂病', indication: '妇人虚寒瘀血', symptoms: '妇人年五十所、病下利数十日不止、暮即发热、少腹里急、腹满、手掌烦热、唇口干燥', king: '吴茱萸、当归', composition: '吴茱萸 + 当归 + 川芎 + 芍药 + 人参 + 桂枝 + 阿胶 + 牡丹皮 + 生姜 + 甘草 + 半夏 + 麦门冬', niNote: '倪师：温经养血、化瘀调经', modern: '更年期、月经不调' },
  { no: 39, name: '甘麦大枣汤', chapter: '妇人杂病', indication: '妇人脏躁', symptoms: '喜悲伤欲哭、象如神灵所作、数欠伸', king: '小麦', composition: '甘草 + 小麦 + 大枣', niNote: '倪师：养心安神、和中缓急', modern: '更年期、抑郁' },
  { no: 40, name: '半夏厚朴汤', chapter: '妇人杂病', indication: '妇人咽中如有炙脔', symptoms: '咽中如有炙脔', king: '半夏', composition: '半夏 + 厚朴 + 茯苓 + 生姜 + 紫苏叶', niNote: '倪师：梅核气主方', modern: '咽炎、癔症' },
];

/** 按篇章分组 */
export function jinguiGroupByChapter() {
  const groups: Record<string, JinguiFormula[]> = {};
  for (const f of JINGUI_FORMULAS) {
    if (!groups[f.chapter]) groups[f.chapter] = [];
    groups[f.chapter].push(f);
  }
  return groups;
}