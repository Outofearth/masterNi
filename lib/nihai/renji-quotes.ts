/**
 * 人纪语录 · 倪师医学心法
 */

export interface RenjiQuote {
  text: string;
  topic: string;
}

export const RENJI_QUOTES: RenjiQuote[] = [
  {
    text: '中医不是慢郎中——急症找中医，快得很',
    topic: '中医定位',
  },
  {
    text: '一针、二灸、三用药——针灸最快，方剂次之',
    topic: '治疗次第',
  },
  {
    text: '不懂经络穴位，无法真正理解中医',
    topic: '学习路径',
  },
  {
    text: '西医治的是人的病，中医治的是生病的人',
    topic: '中西医观',
  },
  {
    text: '针不能灸之所及，药不能针之所长',
    topic: '治疗次第',
  },
  {
    text: '所有癌症的治疗，第一步就是让病人能吃能睡能拉',
    topic: '治癌心法',
  },
  {
    text: '心脏管到小肠是中医的基本常识',
    topic: '脏腑关系',
  },
  {
    text: '肝主疏泄——疏泄好了，气血就通畅',
    topic: '脏腑功能',
  },
  {
    text: '中医的脾不等于西医的脾脏——脾主运化，主肌肉',
    topic: '中医概念',
  },
  {
    text: '肾藏精，主生殖，主骨生髓',
    topic: '脏腑功能',
  },
  {
    text: '肺主气，司呼吸，主皮毛',
    topic: '脏腑功能',
  },
  {
    text: '上工治未病——中医最高的境界是不让人生病',
    topic: '中医境界',
  },
];