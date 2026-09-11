/** @type {import('next').NextConfig} */
//
// 双轨部署（2026-09-11）
//   ① 默认 / 完整版：不设任何 output，保留 app/api 下的服务端路由（AI 解读 / 合婚 / 问天纪）。
//   ② 静态版（GitHub Pages）：NEXT_STATIC_EXPORT=1 时打开 output:'export'。
//      静态站点无法承载 API 路由，故由 scripts/export-static.mjs 在构建期间
//      **临时**把 app/api 移出再还原 —— 默认构建与本地 dev 完全不受影响。
const isStaticExport = process.env.NEXT_STATIC_EXPORT === '1';

const nextConfig = {
  transpilePackages: ['lunar-javascript'],
  ...(isStaticExport
    ? {
        output: 'export',
        // 静态托管没有 Next 图片优化服务，必须关闭优化，否则构建报错
        images: { unoptimized: true },
        // 让每个路由产出 <dir>/index.html：GitHub Pages 对 /privacy 这类
        // 无扩展名路径才能正确命中（否则只会生成 privacy.html 而 404）
        trailingSlash: true,
      }
    : {}),
};

module.exports = nextConfig;
