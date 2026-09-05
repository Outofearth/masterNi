/**
 * 易经六十四卦 · 古籍出处与对照锚点
 *
 * 与 lib/nihai/tianji.ts HEXAGRAMS 1:1 对应（number 0..63 / 1..64）
 * 每条注明「古籍出处」+ 「library 检索 slug」+ 「古籍/倪师核心论点提示」
 *
 * 设计目的：
 *   - 让六十四卦详情页可挂「古籍原文 vs 倪师解读」双栏对照
 *   - 让跳到 /library/search 时自动带 query
 */

export interface HexagramClassicSource {
  /** 卦序（与 HEXAGRAMS.number 一致） */
  number: number;
  /** 卦名（与 HEXAGRAMS.name 一致） */
  name: string;
  /** 出处《周易·{卦名}卦》及篇章 */
  classicalReference: string;
  /** 卦辞或核心经文摘要（古籍原文） */
  classicalExcerpt: string;
  /** 倪师讲解要点 */
  niashiCorePoint: string;
  /** 跳到 /library/search 时的查询关键字（不含《易经》者以卦名+主题词查询） */
  libraryQuery: string;
}

export const HEXAGRAM_CLASSIC_SOURCES: HexagramClassicSource[] = [
  { number: 1,  name: '乾',  classicalReference: '《周易·乾卦第一》', classicalExcerpt: '元，亨，利，贞', niashiCorePoint: '乾为天，纯阳刚健，君子以自强不息', libraryQuery: '乾 天 自强' },
  { number: 2,  name: '坤',  classicalReference: '《周易·坤卦第二》', classicalExcerpt: '元，亨，利牝马之贞', niashiCorePoint: '坤为地，纯阴柔顺，君子以厚德载物', libraryQuery: '坤 地 厚德' },
  { number: 3,  name: '屯',  classicalReference: '《周易·屯卦第三》', classicalExcerpt: '元亨利贞，勿用有攸往', niashiCorePoint: '水雷屯，万物初生之难，宜守', libraryQuery: '屯 初生 创业' },
  { number: 4,  name: '蒙',  classicalReference: '《周易·蒙卦第四》', classicalExcerpt: '亨，匪我求童蒙，童蒙求我', niashiCorePoint: '山水蒙，启蒙教育之卦', libraryQuery: '蒙 启蒙 教育' },
  { number: 5,  name: '需',  classicalReference: '《周易·需卦第五》', classicalExcerpt: '有孚，光亨贞吉，利涉大川', niashiCorePoint: '水天需，等待时机之象', libraryQuery: '需 等待 时机' },
  { number: 6,  name: '讼',  classicalReference: '《周易·讼卦第六》', classicalExcerpt: '有孚窒惕，中吉终凶', niashiCorePoint: '天水讼，争讼之卦，宜和解', libraryQuery: '讼 争讼 和解' },
  { number: 7,  name: '师',  classicalReference: '《周易·师卦第七》', classicalExcerpt: '贞丈人吉，无咎', niashiCorePoint: '地水师，统兵之卦，需正义之师', libraryQuery: '师 统兵 名分' },
  { number: 8,  name: '比',  classicalReference: '《周易·比卦第八》', classicalExcerpt: '吉，原筮元永贞', niashiCorePoint: '水地比，团结亲辅之象', libraryQuery: '比 亲辅 合作' },
  { number: 9,  name: '小畜', classicalReference: '《周易·小畜卦第九》', classicalExcerpt: '亨，密云不雨，自我西郊', niashiCorePoint: '风天小畜，小有所蓄', libraryQuery: '小畜 积蓄' },
  { number: 10, name: '履',  classicalReference: '《周易·履卦第十》', classicalExcerpt: '履虎尾，不咥人，亨', niashiCorePoint: '天泽履，礼让履虎尾', libraryQuery: '履 礼 虎尾' },
  { number: 11, name: '泰',  classicalReference: '《周易·泰卦第十一》', classicalExcerpt: '小往大来，吉亨', niashiCorePoint: '地天泰，阴阳交泰之象', libraryQuery: '泰 交泰 太平' },
  { number: 12, name: '否',  classicalReference: '《周易·否卦第十二》', classicalExcerpt: '否之匪人，不利君子贞', niashiCorePoint: '天地否，阴阳闭塞', libraryQuery: '否 闭塞 转机' },
  { number: 13, name: '同人', classicalReference: '《周易·同人卦第十三》', classicalExcerpt: '同人于野，亨', niashiCorePoint: '天火同人，和同聚合', libraryQuery: '同人 同心 合作' },
  { number: 14, name: '大有', classicalReference: '《周易·大有卦第十四》', classicalExcerpt: '元亨', niashiCorePoint: '火天大有，盛大富有', libraryQuery: '大有 富有' },
  { number: 15, name: '谦',  classicalReference: '《周易·谦卦第十五》', classicalExcerpt: '亨，君子有终', niashiCorePoint: '地山谦，六爻皆吉之卦', libraryQuery: '谦 谦逊 终吉' },
  { number: 16, name: '豫',  classicalReference: '《周易·豫卦第十六》', classicalExcerpt: '利建侯行师', niashiCorePoint: '雷地豫，顺势而动', libraryQuery: '豫 顺势' },
  { number: 17, name: '随',  classicalReference: '《周易·随卦第十七》', classicalExcerpt: '元亨利贞，无咎', niashiCorePoint: '泽雷随，随顺时机', libraryQuery: '随 顺时' },
  { number: 18, name: '蛊', classicalReference: '《周易·蛊卦第十八》', classicalExcerpt: '元亨，利涉大川', niashiCorePoint: '山风蛊，整顿弊乱', libraryQuery: '蛊 整治' },
  { number: 19, name: '临', classicalReference: '《周易·临卦第十九》', classicalExcerpt: '元亨利贞，至于八月有凶', niashiCorePoint: '地泽临，居高位临下', libraryQuery: '临 临下' },
  { number: 20, name: '观', classicalReference: '《周易·观卦第二十》', classicalExcerpt: '盥而不荐', niashiCorePoint: '风地观，仰观俯察', libraryQuery: '观 观察 仰观' },
  { number: 21, name: '噬嗑', classicalReference: '《周易·噬嗑卦第二十一》', classicalExcerpt: '亨，利用狱', niashiCorePoint: '火雷噬嗑，除阻去隔', libraryQuery: '噬嗑 阻隔' },
  { number: 22, name: '贲', classicalReference: '《周易·贲卦第二十二》', classicalExcerpt: '亨，小利有所往', niashiCorePoint: '山火贲，文饰之卦', libraryQuery: '贲 文饰' },
  { number: 23, name: '剥', classicalReference: '《周易·剥卦第二十三》', classicalExcerpt: '不利有攸往', niashiCorePoint: '山地剥，阴剥阳之象', libraryQuery: '剥 剥落 转复' },
  { number: 24, name: '复', classicalReference: '《周易·复卦第二十四》', classicalExcerpt: '亨，出入无疾', niashiCorePoint: '地雷复，一阳来复', libraryQuery: '复 一阳 来复' },
  { number: 25, name: '无妄', classicalReference: '《周易·无妄卦第二十五》', classicalExcerpt: '元亨利贞', niashiCorePoint: '天雷无妄，至诚无妄', libraryQuery: '无妄 至诚' },
  { number: 26, name: '大畜', classicalReference: '《周易·大畜卦第二十六》', classicalExcerpt: '利贞，不家食吉，利涉大川', niashiCorePoint: '山天大畜，畜德养贤', libraryQuery: '大畜 蓄养' },
  { number: 27, name: '颐', classicalReference: '《周易·颐卦第二十七》', classicalExcerpt: '贞吉，观颐', niashiCorePoint: '山雷颐，养身养德', libraryQuery: '颐 养身 养德' },
  { number: 28, name: '大过', classicalReference: '《周易·大过卦第二十八》', classicalExcerpt: '栋桡，利有攸往', niashiCorePoint: '泽风大过，非常之时', libraryQuery: '大过 非常' },
  { number: 29, name: '坎',  classicalReference: '《周易·坎卦第二十九》', classicalExcerpt: '习坎，有孚，维心亨', niashiCorePoint: '坎为水，重险之象', libraryQuery: '坎 重险 诚信' },
  { number: 30, name: '离',  classicalReference: '《周易·离卦第三十》', classicalExcerpt: '利贞，亨', niashiCorePoint: '离为火，附丽光明', libraryQuery: '离 光明 依附' },
  { number: 31, name: '咸',  classicalReference: '《周易·咸卦第三十一》', classicalExcerpt: '亨，利贞，取女吉', niashiCorePoint: '泽山咸，感应之始', libraryQuery: '咸 感应' },
  { number: 32, name: '恒',  classicalReference: '《周易·恒卦第三十二》', classicalExcerpt: '亨，无咎，利贞', niashiCorePoint: '雷风恒，恒久之道', libraryQuery: '恒 恒久' },
  { number: 33, name: '遁', classicalReference: '《周易·遁卦第三十三》', classicalExcerpt: '亨，小利贞', niashiCorePoint: '天山遁，退避之卦', libraryQuery: '遁 退避' },
  { number: 34, name: '大壮', classicalReference: '《周易·大壮卦第三十四》', classicalExcerpt: '利贞', niashiCorePoint: '雷天大壮，阳气壮盛', libraryQuery: '大壮 阳盛' },
  { number: 35, name: '晋',  classicalReference: '《周易·晋卦第三十五》', classicalExcerpt: '康侯用锡马蕃庶', niashiCorePoint: '火地晋，明进而上升', libraryQuery: '晋 晋升' },
  { number: 36, name: '明夷', classicalReference: '《周易·明夷卦第三十六》', classicalExcerpt: '利艰贞', niashiCorePoint: '地火明夷，明入地中', libraryQuery: '明夷 韬晦' },
  { number: 37, name: '家人', classicalReference: '《周易·家人卦第三十七》', classicalExcerpt: '利女贞', niashiCorePoint: '风火家人，治家之道', libraryQuery: '家人 治家' },
  { number: 38, name: '睽',  classicalReference: '《周易·睽卦第三十八》', classicalExcerpt: '小事吉', niashiCorePoint: '火泽睽，求同存异', libraryQuery: '睽 异中求同' },
  { number: 39, name: '蹇',  classicalReference: '《周易·蹇卦第三十九》', classicalExcerpt: '利西南，不利东北', niashiCorePoint: '水山蹇，险阻在前', libraryQuery: '蹇 险阻' },
  { number: 40, name: '解',  classicalReference: '《周易·解卦第四十》', classicalExcerpt: '利西南', niashiCorePoint: '雷水解，缓解险难', libraryQuery: '解 缓解' },
  { number: 41, name: '损',  classicalReference: '《周易·损卦第四十一》', classicalExcerpt: '有孚，元吉', niashiCorePoint: '山泽损，损下益上', libraryQuery: '损 减损 增益' },
  { number: 42, name: '益',  classicalReference: '《周易·益卦第四十二》', classicalExcerpt: '利有攸往，利涉大川', niashiCorePoint: '风雷益，损上益下', libraryQuery: '益 增益' },
  { number: 43, name: '夬',  classicalReference: '《周易·夬卦第四十三》', classicalExcerpt: '扬于王庭', niashiCorePoint: '泽天夬，决断之卦', libraryQuery: '夬 决断' },
  { number: 44, name: '姤',  classicalReference: '《周易·姤卦第四十四》', classicalExcerpt: '女壮，勿用取女', niashiCorePoint: '天风姤，阴生阳衰', libraryQuery: '姤 阴长' },
  { number: 45, name: '萃',  classicalReference: '《周易·萃卦第四十五》', classicalExcerpt: '亨，王假有庙', niashiCorePoint: '泽地萃，聚合之象', libraryQuery: '萃 聚合' },
  { number: 46, name: '升',  classicalReference: '《周易·升卦第四十六》', classicalExcerpt: '元亨，用见大人', niashiCorePoint: '地风升，柔顺上升', libraryQuery: '升 上升' },
  { number: 47, name: '困',  classicalReference: '《周易·困卦第四十七》', classicalExcerpt: '亨，贞，大人吉', niashiCorePoint: '泽水困，困而能通', libraryQuery: '困 困顿 通达' },
  { number: 48, name: '井',  classicalReference: '《周易·井卦第四十八》', classicalExcerpt: '改邑不改井', niashiCorePoint: '水风井，井养而不穷', libraryQuery: '井 井养' },
  { number: 49, name: '革',  classicalReference: '《周易·革卦第四十九》', classicalExcerpt: '己日乃孚', niashiCorePoint: '泽火革，变革之卦', libraryQuery: '革 变革' },
  { number: 50, name: '鼎', classicalReference: '《周易·鼎卦第五十》', classicalExcerpt: '元吉，亨', niashiCorePoint: '火风鼎，稳定鼎新', libraryQuery: '鼎 鼎新 稳定' },
  { number: 51, name: '震', classicalReference: '《周易·震卦第五十一》', classicalExcerpt: '亨，震来虩虩', niashiCorePoint: '震为雷，震惊之象', libraryQuery: '震 雷 震惊' },
  { number: 52, name: '艮',  classicalReference: '《周易·艮卦第五十二》', classicalExcerpt: '艮其背，不获其身', niashiCorePoint: '艮为山，止定之象', libraryQuery: '艮 止定' },
  { number: 53, name: '渐',  classicalReference: '《周易·渐卦第五十三》', classicalExcerpt: '女归吉，利贞', niashiCorePoint: '风山渐，循序而进', libraryQuery: '渐 渐进' },
  { number: 54, name: '归妹', classicalReference: '《周易·归妹卦第五十四》', classicalExcerpt: '征凶，无攸利', niashiCorePoint: '雷泽归妹，婚姻之卦', libraryQuery: '归妹 婚姻' },
  { number: 55, name: '丰',  classicalReference: '《周易·丰卦第五十五》', classicalExcerpt: '亨，王假之', niashiCorePoint: '雷火丰，盛大丰盛', libraryQuery: '丰 盛大' },
  { number: 56, name: '旅',  classicalReference: '《周易·旅卦第五十六》', classicalExcerpt: '小亨，旅贞吉', niashiCorePoint: '火山旅，旅居之卦', libraryQuery: '旅 行旅' },
  { number: 57, name: '巽',  classicalReference: '《周易·巽卦第五十七》', classicalExcerpt: '小亨，利有攸往', niashiCorePoint: '巽为风，顺入之卦', libraryQuery: '巽 顺入' },
  { number: 58, name: '兑',  classicalReference: '《周易·兑卦第五十八》', classicalExcerpt: '亨，利贞', niashiCorePoint: '兑为泽，喜悦之卦', libraryQuery: '兑 喜悦' },
  { number: 59, name: '涣',  classicalReference: '《周易·涣卦第五十九》', classicalExcerpt: '亨，王假有庙', niashiCorePoint: '风水涣，散难归聚', libraryQuery: '涣 散聚' },
  { number: 60, name: '节',  classicalReference: '《周易·节卦第六十》', classicalExcerpt: '亨，苦节不可贞', niashiCorePoint: '水泽节，节制之卦', libraryQuery: '节 节制' },
  { number: 61, name: '中孚', classicalReference: '《周易·中孚卦第六十一》', classicalExcerpt: '豚鱼吉，利涉大川', niashiCorePoint: '风泽中孚，心中诚信', libraryQuery: '中孚 诚信' },
  { number: 62, name: '小过', classicalReference: '《周易·小过卦第六十二》', classicalExcerpt: '亨，利贞', niashiCorePoint: '雷山小过，小有过越', libraryQuery: '小过 过越' },
  { number: 63, name: '既济', classicalReference: '《周易·既济卦第六十三》', classicalExcerpt: '亨小，利贞', niashiCorePoint: '水火既济，事已成就', libraryQuery: '既济 成就' },
  { number: 64, name: '未济', classicalReference: '《周易·未济卦第六十四》', classicalExcerpt: '亨', niashiCorePoint: '火水未济，事未成就', libraryQuery: '未济 未成' },
];

/** 按 number 取单卦古籍出处 */
export function getHexClassicSource(num: number): HexagramClassicSource | undefined {
  return HEXAGRAM_CLASSIC_SOURCES.find(h => h.number === num);
}
