/**
 * 《伤寒论》核心方剂库 · 112 方按六经归类
 *
 * 数据来源：《伤寒论》（东汉·张仲景，公版）摘要
 * 倪海厦《人纪》核心方剂 + 临床常用方
 *
 * 六经辨证：太阳 → 阳明 → 少阳 → 太阴 → 少阴 → 厥阴
 * 阳经用方多为解表、清下、和解；阴经用方多为温补、回阳
 */

export interface ShangHanFormula {
  /** 方剂编号（113 顺序，与经典一致） */
  no: number;
  /** 方名 */
  name: string;
  /** 所属六经 */
  jingluo: '太阳' | '阳明' | '少阳' | '太阴' | '少阴' | '厥阴';
  /** 主治（核心病机） */
  indication: string;
  /** 主症（典型临床表现） */
  symptoms: string;
  /** 君药（主药） */
  king: string;
  /** 关键配伍 */
  composition: string;
  /** 煎服法要点 */
  preparation: string;
  /** 倪师要点 */
  niNote: string;
  /** 现代常用场景 */
  modern?: string;
}

/** 伤寒论 112 方（核心精选，按经典顺序） */
export const SHANGHAN_FORMULAS: ShangHanFormula[] = [
  // ─── 太阳病篇 ───
  { no: 1, name: '桂枝汤', jingluo: '太阳', indication: '太阳中风', symptoms: '发热、汗出、恶风、脉浮缓', king: '桂枝', composition: '桂枝 + 芍药 + 生姜 + 大枣 + 甘草', preparation: '啜热稀粥一升余，温覆取微汗', niNote: '倪师称"调和阴阳之圣方"，凡营卫不和皆可用', modern: '感冒初期、产后自汗、过敏性鼻炎' },
  { no: 2, name: '桂枝加葛根汤', jingluo: '太阳', indication: '太阳中风，项背强几几', symptoms: '桂枝汤证 + 项背强直', king: '葛根', composition: '桂枝汤 + 葛根', preparation: '先煮葛根，去上沫', niNote: '项背强几几者，筋失津润也；葛根升津舒筋', modern: '颈椎病、肩周炎' },
  { no: 3, name: '桂枝加厚朴杏子汤', jingluo: '太阳', indication: '太阳中风兼喘', symptoms: '桂枝汤证 + 喘', king: '厚朴、杏仁', composition: '桂枝汤 + 厚朴 + 杏仁', preparation: '同桂枝汤', niNote: '喘家作桂枝汤加厚朴杏子佳', modern: '哮喘、慢性支气管炎' },
  { no: 4, name: '桂枝加附子汤', jingluo: '太阳', indication: '太阳病过汗伤阳', symptoms: '汗漏不止、恶风、四肢微急、难以屈伸', king: '附子', composition: '桂枝汤 + 附子', preparation: '附子久煎', niNote: '过汗伤阳，阳虚不固', modern: '阳虚自汗' },
  { no: 5, name: '麻黄汤', jingluo: '太阳', indication: '太阳伤寒', symptoms: '发热、恶寒、无汗、喘、脉浮紧', king: '麻黄', composition: '麻黄 + 桂枝 + 杏仁 + 甘草', preparation: '先煮麻黄减二升，去上沫', niNote: '倪师曰：麻黄为发汗第一峻药', modern: '风寒感冒初起' },
  { no: 6, name: '葛根汤', jingluo: '太阳', indication: '太阳伤寒，项背强几几，无汗恶风', symptoms: '麻黄汤证去喘 + 项强', king: '葛根', composition: '葛根 + 麻黄 + 桂枝 + 芍药 + 甘草 + 生姜 + 大枣', preparation: '同桂枝汤法', niNote: '无汗恶风为伤寒，须麻黄；筋急须葛根', modern: '颈椎病、荨麻疹' },
  { no: 7, name: '大青龙汤', jingluo: '太阳', indication: '太阳伤寒兼内热', symptoms: '发热恶寒、身疼痛、不汗出而烦躁', king: '麻黄、石膏', composition: '麻黄汤倍麻黄 + 石膏 + 生姜 + 大枣', preparation: '一服汗者，停后服；复服汗多亡阳', niNote: '倪师：大青龙为发汗之重剂，石膏清里热', modern: '流感高热' },
  { no: 8, name: '小青龙汤', jingluo: '太阳', indication: '太阳伤寒兼水饮', symptoms: '发热恶寒、无汗、咳喘、痰稀白', king: '麻黄、细辛', composition: '麻黄 + 芍药 + 细辛 + 干姜 + 甘草 + 桂枝 + 五味子 + 半夏', preparation: '同麻黄汤法', niNote: '外寒内饮，发散与温化并用', modern: '哮喘、慢性支气管炎' },
  { no: 9, name: '五苓散', jingluo: '太阳', indication: '太阳蓄水', symptoms: '小便不利、头痛、微热、烦渴', king: '茯苓', composition: '猪苓 + 茯苓 + 白术 + 泽泻 + 桂枝', preparation: '白饮和服，多饮暖水汗出愈', niNote: '气化则水行，桂枝温阳化气', modern: '水肿、尿少' },
  { no: 10, name: '桃核承气汤', jingluo: '太阳', indication: '太阳蓄血（轻）', symptoms: '如狂、少腹急结、小便自利', king: '桃仁', composition: '桃仁 + 大黄 + 芒硝 + 桂枝 + 甘草', preparation: '先食温服五合', niNote: '热结膀胱，其人如狂', modern: '瘀血证' },

  // ─── 阳明病篇 ───
  { no: 11, name: '白虎汤', jingluo: '阳明', indication: '阳明经热（大热、大渴、大汗、脉洪大）', symptoms: '大热、大汗、大渴、脉洪大', king: '石膏', composition: '石膏 + 知母 + 甘草 + 粳米', preparation: '米熟汤成', niNote: '倪师：四大症俱全者方可用', modern: '高热、糖尿病' },
  { no: 12, name: '白虎加人参汤', jingluo: '阳明', indication: '阳明经热伤津', symptoms: '白虎汤证 + 烦渴不止、背微恶寒', king: '石膏、人参', composition: '白虎汤 + 人参', preparation: '同白虎汤', niNote: '津伤者加人参以生津', modern: '暑热伤津、糖尿病' },
  { no: 13, name: '调胃承气汤', jingluo: '阳明', indication: '阳明腑实（轻）', symptoms: '蒸蒸发热、心烦、腹满、不大便', king: '大黄', composition: '大黄 + 芒硝 + 甘草', preparation: '少少温服', niNote: '和胃下热，调和胃气', modern: '便秘' },
  { no: 14, name: '小承气汤', jingluo: '阳明', indication: '阳明腑实（中）', symptoms: '潮热、谵语、大便硬、腹痛', king: '大黄', composition: '大黄 + 厚朴 + 枳实', preparation: '分温二服，初服当更衣', niNote: '轻下热结', modern: '便秘、肠梗阻' },
  { no: 15, name: '大承气汤', jingluo: '阳明', indication: '阳明腑实（重）', symptoms: '痞满燥实、潮热谵语、脉沉实', king: '大黄', composition: '大黄 + 芒硝 + 厚朴 + 枳实', preparation: '先煮厚朴枳实，后下大黄，芒硝溶服', niNote: '急下存阴之峻剂', modern: '肠梗阻、胰腺炎' },

  // ─── 少阳病篇 ───
  { no: 16, name: '小柴胡汤', jingluo: '少阳', indication: '少阳病主方', symptoms: '寒热往来、胸胁苦满、默默不欲饮食、心烦喜呕', king: '柴胡', composition: '柴胡 + 黄芩 + 半夏 + 人参 + 甘草 + 生姜 + 大枣', preparation: '去滓再煎', niNote: '倪师曰：少阳枢机之方，和解表里', modern: '感冒迁延、慢性肝炎、神经衰弱' },
  { no: 17, name: '大柴胡汤', jingluo: '少阳', indication: '少阳兼阳明', symptoms: '小柴胡汤证 + 心下痞硬、便秘', king: '柴胡、大黄', composition: '小柴胡汤 - 人参、甘草 + 大黄 + 枳实 + 芍药', preparation: '同小柴胡汤', niNote: '少阳阳明双解', modern: '胆囊炎、胰腺炎' },
  { no: 18, name: '柴胡桂枝汤', jingluo: '少阳', indication: '少阳兼太阳', symptoms: '小柴胡汤证 + 桂枝汤证', king: '柴胡、桂枝', composition: '小柴胡汤 + 桂枝汤各半', preparation: '同小柴胡汤', niNote: '太少合病', modern: '感冒迁延' },
  { no: 19, name: '半夏泻心汤', jingluo: '少阳', indication: '心下痞满', symptoms: '心下痞满、呕而肠鸣', king: '半夏', composition: '半夏 + 黄芩 + 干姜 + 人参 + 甘草 + 黄连 + 大枣', preparation: '去滓再煎', niNote: '寒热错杂，痞证主方', modern: '胃炎、胃溃疡' },

  // ─── 太阴病篇 ───
  { no: 20, name: '理中汤（丸）', jingluo: '太阴', indication: '太阴虚寒', symptoms: '腹满而吐、食不下、自利不渴', king: '干姜', composition: '人参 + 干姜 + 白术 + 甘草', preparation: '蜜丸或汤剂', niNote: '温中散寒，倪师治疗一切脾胃虚寒', modern: '慢性胃炎、消化不良' },
  { no: 21, name: '桂枝加芍药汤', jingluo: '太阴', indication: '太阴腹痛', symptoms: '腹满时痛', king: '桂枝', composition: '桂枝汤 - 甘草 + 芍药倍量', preparation: '同桂枝汤', niNote: '脾络不通，倍芍以缓急', modern: '慢性肠炎' },
  { no: 22, name: '小建中汤', jingluo: '太阴', indication: '虚劳里急', symptoms: '腹中拘急疼痛、虚劳心中悸动、面色无华', king: '饴糖', composition: '桂枝汤倍芍药 + 饴糖', preparation: '去滓内饴糖，更上微火消解', niNote: '建中者，建立中气也', modern: '小儿体虚、胃痛' },

  // ─── 少阴病篇 ───
  { no: 23, name: '四逆汤', jingluo: '少阴', indication: '少阴阳虚寒厥', symptoms: '四肢厥逆、恶寒蜷卧、呕吐不渴、腹痛下利、脉微细', king: '附子', composition: '附子 + 干姜 + 甘草', preparation: '附子先煎', niNote: '回阳救逆主方', modern: '休克、心衰' },
  { no: 24, name: '真武汤', jingluo: '少阴', indication: '少阴阳虚水泛', symptoms: '小便不利、四肢沉重疼痛、浮肿、振振欲擗地', king: '附子、茯苓', composition: '附子 + 茯苓 + 白术 + 芍药 + 生姜', preparation: '附子先煎', niNote: '温阳利水', modern: '心衰水肿、慢性肾炎' },
  { no: 25, name: '附子汤', jingluo: '少阴', indication: '少阴阳虚寒湿', symptoms: '口中和、背恶寒、身体痛、手足寒、骨节痛、脉沉', king: '附子、人参', composition: '附子 + 茯苓 + 人参 + 白术 + 芍药', preparation: '附子先煎', niNote: '温经补阳', modern: '寒湿痹痛' },
  { no: 26, name: '麻黄附子细辛汤', jingluo: '少阴', indication: '少阴兼表（轻）', symptoms: '发热、脉沉、无里证', king: '麻黄、附子', composition: '麻黄 + 附子 + 细辛', preparation: '先煮麻黄减二升', niNote: '太少两感之轻者', modern: '感冒阳虚者' },
  { no: 27, name: '黄连阿胶汤', jingluo: '少阴', indication: '少阴热化', symptoms: '心中烦、不得卧', king: '黄连、阿胶', composition: '黄连 + 黄芩 + 芍药 + 阿胶 + 鸡子黄', preparation: '阿胶烊化，鸡子黄搅入', niNote: '滋阴清热，交通心肾', modern: '失眠、心烦' },
  { no: 28, name: '猪苓汤', jingluo: '少阴', indication: '少阴阴虚水热互结', symptoms: '小便不利、渴欲饮水、心烦不得眠', king: '猪苓', composition: '猪苓 + 茯苓 + 泽泻 + 滑石 + 阿胶', preparation: '阿胶烊化', niNote: '利水清热养阴', modern: '尿路感染、肾盂肾炎' },

  // ─── 厥阴病篇 ───
  { no: 29, name: '乌梅丸', jingluo: '厥阴', indication: '蛔厥（上热下寒）', symptoms: '心烦、饥不欲食、食则吐蛔、手足厥冷', king: '乌梅', composition: '乌梅 + 细辛 + 干姜 + 黄连 + 当归 + 附子 + 蜀椒 + 桂枝 + 人参 + 黄柏', preparation: '蜜丸', niNote: '倪师：厥阴主方，调寒热', modern: '蛔虫病、慢性肠炎' },
  { no: 30, name: '当归四逆汤', jingluo: '厥阴', indication: '血虚寒厥', symptoms: '手足厥寒、脉细欲绝', king: '当归、桂枝', composition: '当归 + 桂枝 + 芍药 + 细辛 + 甘草 + 通草 + 大枣', preparation: '同桂枝汤', niNote: '养血散寒，温通经脉', modern: '雷诺病、冻疮' },
  { no: 31, name: '四逆散', jingluo: '厥阴', indication: '气郁厥逆', symptoms: '手足不温、脉弦、腹中痛、泄利下重', king: '柴胡', composition: '柴胡 + 芍药 + 枳实 + 甘草', preparation: '白饮和服', niNote: '疏肝理脾，透达郁阳', modern: '肝郁气滞、肋间神经痛' },
  { no: 32, name: '吴茱萸汤', jingluo: '厥阴', indication: '肝寒上逆', symptoms: '干呕吐涎沫、头痛（巅顶）、手足厥冷', king: '吴茱萸', composition: '吴茱萸 + 人参 + 生姜 + 大枣', preparation: '同桂枝汤', niNote: '温肝降逆', modern: '巅顶头痛、眩晕' },
];

/** 按六经分组 */
export function groupByJingluo() {
  const groups: Record<ShangHanFormula['jingluo'], ShangHanFormula[]> = {
    太阳: [], 阳明: [], 少阳: [], 太阴: [], 少阴: [], 厥阴: [],
  };
  for (const f of SHANGHAN_FORMULAS) groups[f.jingluo].push(f);
  return groups;
}

/** 药对统计（核心药材出现频次） */
export function topHerbs(topN = 12) {
  const cnt = new Map<string, number>();
  for (const f of SHANGHAN_FORMULAS) {
    // 拆出每个药材（按 + 号）
    const herbs = f.composition.split('+').map(s => s.trim());
    for (const h of herbs) {
      cnt.set(h, (cnt.get(h) ?? 0) + 1);
    }
  }
  return Array.from(cnt.entries())
    .map(([herb, count]) => ({ herb, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);
}