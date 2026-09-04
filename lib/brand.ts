// 古风金棕品牌调色板 —— 分享卡 / 公告等一次性品牌资产的单一来源。
// 与 app/globals.css 的 --ac(#B8922A) 同源，集中管理避免与 token 漂移。
// 注意：分享卡是刻意自包含的"米金印刷卡"视觉，不随 App 主题变化，故独立维护。

export const BRAND = {
  gold:      '#b8922a', // 主金（= --ac）
  goldLight: '#d4a948', // 金高光（渐变起笔）
  goldDeep:  '#8b6a14', // 深金（命宫强调）
  goldSoft:  '#a89b7c', // 哑光金（次要文字）
  cinnabar:  '#c45a2d', // 朱砂红（四化 / 强调）
  ink:       '#3d2f10', // 深棕墨（主文字）
  inkSoft:   '#6b5d3f', // 中棕（次文字）
  inkWarm:   '#5b4c2e', // 暖棕（高亮文字）
  cream:     '#fbf6e8', // 米底（预览区背景）
  cardTop:   '#fef9eb', // 分享卡渐变·上
  cardMid:   '#f7e8c4', // 分享卡渐变·中
  cardBot:   '#efd8a0', // 分享卡渐变·下
} as const;

/** 基于主金 --ac 的半透明 tint，alpha ∈ [0,1]，集中派生避免散落 rgba(184,146,42,…) */
export const goldTint = (alpha: number): string => `rgba(184,146,42,${alpha})`;
