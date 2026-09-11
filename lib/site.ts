/**
 * 站点身份单一来源
 *
 * 为什么单独抽一个文件：此前域名散落在 layout.tsx / robots.ts / sitemap.ts /
 * knowledge 结构化数据 / 分享卡 共 7 处硬编，站名又有「紫微命盘」「紫微研究」
 * 「王多鱼AI」三种叫法 —— 改一次要翻七处，且必然漏（分享卡上那块错误域名就是
 * 这么来的）。凡涉及对外网址/站名，一律从这里取。
 *
 * ⚠️ 换域名只改 SITE_URL 一处。
 */

/** 线上站点根地址（GitHub Pages + CNAME：masterni.anker26.us.ci） */
export const SITE_URL = 'https://masterni.anker26.us.ci';

/** 站点短名（导航、页脚、分享卡角标） */
export const SITE_NAME = '紫微研究';

/** 站点全称（SEO 标题、报告抬头） */
export const SITE_FULL_NAME = '紫微研究 · 倪海厦紫微斗数';

/** 只取主机名的展示形式（分享卡、报告页脚这类不方便带协议的地方） */
export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, '');
