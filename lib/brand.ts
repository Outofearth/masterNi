// 古风金棕品牌调色板 —— 分享卡 / 公告等一次性品牌资产的单一来源。
// 与 app/globals.css 的 --ac(#B8922A) 同源，集中管理避免与 token 漂移。
// 注意：分享卡是刻意自包含的"米金印刷卡"视觉，不随 App 主题变化，故独立维护。
//
// 【职责边界·2026-09-11 设计系统统一后】
//   · 运行时 UI（页面/组件）的金色唯一来源 = globals.css 的 --ac / --ac-text / --ac-strong
//   · brand.ts 只服务「自包含品牌资产」：分享卡、导出图、公告插画等不随主题变化的印刷视觉
//   · cream #fbf6e8 与 globals.css --bg-0 同值，改动需同步两处
//
// 【装饰档 vs 文字档·2026-09-11 补】
//   品牌资产里当**文字**用的颜色，必须对米底 cream(#fbf6e8) ≥ WCAG AA 4.5:1。
//   gold / goldLight / goldSoft 这类装饰金压米底只有 2.2–2.9:1，**只能做底/描边，不能做文字**。
//   文字请用下方「文字档」：
//     goldText     #805c0e  cream 5.6:1（= 浅色 --ac-text 同值）
//     cinnabarText #9c3f1c  cream 6.2:1 / 橙 banner #ffe1c0 5.3:1
//     onGold       #1A1A18  压 BRAND.gold 5.96:1（同 globals.css .btn-accent 的深字方案）
//   次要文字用 inkSoft（cream 5.96:1），不要用 goldSoft。

export const BRAND = {
  // ── 装饰档：底色 / 描边 / 渐变，不建议作文字 ──
  gold:      '#b8922a', // 主金（= --ac）
  goldLight: '#d4a948', // 金高光（渐变起笔）
  goldSoft:  '#a89b7c', // 哑光金——仅装饰；作文字对 cream 只有 2.55:1
  cinnabar:  '#c45a2d', // 朱砂红（四化 / 强调）
  cardTop:   '#fef9eb', // 分享卡渐变·上
  cardMid:   '#f7e8c4', // 分享卡渐变·中
  cardBot:   '#efd8a0', // 分享卡渐变·下

  // ── 文字档：米底上的文字，均 ≥4.5:1 ──
  goldText:     '#805c0e', // 金色文字（cream 5.6:1）
  cinnabarText: '#9c3f1c', // 朱砂文字（cream 6.2:1）
  onGold:       '#1A1A18', // 压金底的深字（对 BRAND.gold 5.96:1）
  goldDeep:     '#8b6a14', // 深金（命宫强调；cream 4.66:1，余量偏薄）
  ink:          '#3d2f10', // 深棕墨（主文字，cream ≈13:1）
  inkSoft:      '#6b5d3f', // 中棕（次文字，cream 5.96:1）
  inkWarm:      '#5b4c2e', // 暖棕（高亮文字）

  cream:     '#fbf6e8', // 米底（预览区背景）
} as const;

/** 基于主金 --ac 的半透明 tint，alpha ∈ [0,1]，集中派生避免散落 rgba(184,146,42,…) */
export const goldTint = (alpha: number): string => `rgba(184,146,42,${alpha})`;
