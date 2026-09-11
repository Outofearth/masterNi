/**
 * 双轨部署 · AI 能力守卫
 *
 * 静态版（GitHub Pages）没有服务端，app/api 下的 AI 路由不存在。
 * 直接用 fetch 打过去会命中文档服务器的 404（返回 HTML），
 * 各家面板只能弹一句「解读失败，请稍后重试」，用户看不懂原因。
 *
 * 这里提供一个构建期常量 + 统一文案：静态版构建时 NEXT_PUBLIC_STATIC_EXPORT=1，
 * AI 相关入口在请求前先拦下，改成把「为什么不可用、去哪儿用」讲清楚的提示。
 *
 * 注意：NEXT_PUBLIC_* 会在构建时内联，完整版 / 本地 dev 下该值为 undefined → false，
 * 行为与改动前完全一致。
 */

export const IS_STATIC_EXPORT = process.env.NEXT_PUBLIC_STATIC_EXPORT === '1';

export const AI_UNAVAILABLE_NOTICE =
  '本站线上为纯静态版本（GitHub Pages），没有可运行的服务端，因此 AI 能力在此不可用。\n\n' +
  '排盘、十四主星、古籍原典、天纪 / 地纪 / 人纪内容都不受影响，可正常浏览。\n' +
  '如需使用 AI 解读、合婚分析与「问天纪」，请在本地运行本项目后使用完整版。';
