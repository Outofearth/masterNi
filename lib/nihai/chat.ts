/**
 * 天纪 AI 解读 —— 上下文类型 / 提示词构建 / 预设问题
 *
 * 前后端共用：
 *   - 前端 TianjiChatPanel 组装 TianjiContext 传给 /api/tianji-chat
 *   - 后端 route.ts 用 buildTianjiSystemPrompt 生成 system prompt
 */

import type { Hexagram, NiModule } from './types';

// ─── 上下文类型 ───────────────────────────────────────────
export type TianjiContext =
  | { type: 'hexagram'; data: Hexagram }
  | { type: 'module'; data: NiModule }
  | { type: 'general' };

// ─── 天纪体系系统提示词 ───────────────────────────────────
const TIANJI_PERSONA = [
  '你是"紫微命盘"（metisziwei.com）平台的 AI 术数讲师，专精倪海厦《天纪》体系。',
  '',
  '【学派口径 —— 必须严格遵守】',
  '· 紫微斗数 → 三合派（倪师：「飞星飞来飞去太复杂，不搞这个，毕竟大道至简」）',
  '· 易经 → 象数派（重象、数、理，以卦象断事，不用义理空谈）',
  '· 风水/堪舆 → 九星派（杨救贫流派）',
  '· 推命 → 河洛数理派',
  '· 面相 → 神异赋体系',
  '· 测字 → 字理断法',
  '',
  '【倪师核心主张】',
  '· 命宫为本、三方为用：命宫主星定格局，三方（财帛/官禄/迁移）定用武之地',
  '· 对宫借星：宫位为空必须借对宫星曜论断',
  '· 四化才是命运的手：不看四化，命盘只解了一半',
  '· 大限十年：人生分 12 个大限，每限 10 年，知大限才能把握当下',
  '· 诸术互通：紫微、易经、风水、面相本是一体，可交叉印证',
].join('\n');

const STYLE_RULES = [
  '',
  '【回答风格】',
  '· 专业、温和、结构清晰，可用【小标题】分段',
  '· 引用卦辞/原文时先给原文，再用白话解释',
  '· 避免宿命论绝对化表述（不用"一定""必然"，改用"倾向""需注意"）',
  '· 给出可执行的建议，而非只描述吉凶',
  '· 不使用三合派以外的流派术语（如飞星派自化、四化飞星等）',
  '· 回答控制在 600 字以内，重点突出',
].join('\n');

// ─── 构建 system prompt ───────────────────────────────────
export function buildTianjiSystemPrompt(ctx: TianjiContext): string {
  const parts = [TIANJI_PERSONA];

  if (ctx.type === 'hexagram') {
    const h = ctx.data;
    parts.push(
      '',
      '【当前卦象 —— 用户正在看的这一卦】',
      `· 卦序：第 ${h.number} 卦`,
      `· 卦名：${h.name}`,
      `· 卦象：${h.composition}（上${h.upper}下${h.lower}）`,
      `· 卦辞：${h.meaning}`,
      `· 倪师解读：${h.niInterpretation}`,
      `· 断事要诀：${h.divination}`,
      '',
      '用户提问如有具体事项（问事业、问感情、问财运等），请结合本卦的卦象、卦辞与倪师断事要诀作答，'
        + '并说明上卦下卦的取象关系如何映射到所问之事。' ,
    );
  } else if (ctx.type === 'module') {
    const m = ctx.data;
    const chapterTitles = (m.chapters ?? []).map(ch => `  ${ch.order}. ${ch.title} —— ${ch.subtitle ?? ''}`).join('\n');
    parts.push(
      '',
      '【当前学习模块 —— 用户正在看的这一模块】',
      `· 模块名：${m.name}（${m.nameEn ?? ''}）`,
      `· 副标题：${m.subtitle ?? ''}`,
      `· 学派：${m.school ?? '—'}`,
      `· 课时：${m.lessons ?? '—'}`,
      `· 简介：${m.description ?? ''}`,
      m.details?.length ? `· 要点：\n${m.details.map(d => '  - ' + d).join('\n')}` : '',
      chapterTitles ? `· 章节：\n${chapterTitles}` : '',
      '',
      '用户可能想了解这一模块讲什么、怎么学、与其它模块/诸术如何贯通。请据此作答。',
    );
  } else {
    parts.push(
      '',
      '【当前位置】用户在天纪总览页，未指定具体卦象或模块。',
      '可就天纪整体体系（紫微斗数 / 易经 64 卦 / 堪舆 / 推命 / 面相 / 测字）任一主题作答，'
        + '也可帮助用户判断该从哪个子模块入手。',
    );
  }

  parts.push(STYLE_RULES);
  return parts.filter(p => p !== undefined && p !== '').join('\n');
}

// ─── 上下文摘要（离线降级时直接展示给用户）────────────────
export function contextDigest(ctx: TianjiContext): string {
  if (ctx.type === 'hexagram') {
    const h = ctx.data;
    return [
      `【第 ${h.number} 卦 · ${h.name}】`,
      `卦象：${h.composition}（上${h.upper}下${h.lower}）`,
      '',
      `卦辞：${h.meaning}`,
      '',
      `倪师解读：${h.niInterpretation}`,
      '',
      `断事要诀：${h.divination}`,
    ].join('\n');
  }
  if (ctx.type === 'module') {
    const m = ctx.data;
    return [
      `【${m.name}】${m.subtitle ? ' · ' + m.subtitle : ''}`,
      m.school ? `学派：${m.school}` : '',
      m.lessons ? `课时：${m.lessons}` : '',
      '',
      m.description ?? '',
      '',
      ...(m.details ?? []).map(d => '· ' + d),
      '',
      ...(m.chapters ?? []).map(ch => `${ch.order}. ${ch.title}${ch.subtitle ? ' —— ' + ch.subtitle : ''}`),
    ].filter(Boolean).join('\n');
  }
  return '天纪 · 倪海厦天文术数体系：紫微斗数（三合派）、易经 64 卦（象数派）、堪舆（九星派）、推命（河洛数理派）、面相、测字。';
}

// ─── 预设问题（随上下文变化）────────────────────────────
export function presetQuestionsFor(ctx: TianjiContext): string[] {
  if (ctx.type === 'hexagram') {
    const name = ctx.data.name;
    return [
      `第 ${ctx.data.number} 卦「${name}」的核心含义是什么？`,
      `用这一卦问事业，该怎么看？`,
      `用这一卦问感情，该怎么看？`,
      `这一卦的上下卦取象如何映射到具体事情？`,
      `这一卦在当前时机下，行动上有什么建议？`,
      `倪师对这一卦的断事要诀该怎么理解？`,
    ];
  }
  if (ctx.type === 'module') {
    const name = ctx.data.name;
    return [
      `${name}这一模块主要讲什么？`,
      `学习${name}应该按什么路径入门？`,
      `${name}和其它术数（紫微/易经/风水）如何贯通？`,
      `${name}在倪师体系中处于什么位置？`,
      `${name}有哪些必须掌握的核心要点？`,
      `${name}的实际应用场景有哪些？`,
    ];
  }
  return [
    '天纪体系包含哪几个部分？它们之间什么关系？',
    '我想学紫微斗数，该从哪里开始？',
    '倪师说的"命宫为本，三方为用"是什么意思？',
    '易经 64 卦该怎么入门？',
    '四化星为什么说是"命运的手"？',
    '天纪和地纪、人纪是什么关系？',
  ];
}
