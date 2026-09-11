import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

const BASE_URL = SITE_URL;

// 静态导出（GitHub Pages）要求 Metadata Route 显式声明静态：
// 否则 output:'export' 下报 "export const dynamic = 'force-static' ... not configured"。
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/preview-versions/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
