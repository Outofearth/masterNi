import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import SiteHeader from '@/components/SiteHeader';
import AnnouncementModal from '@/components/AnnouncementModal';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  title: '紫微命盘 · 倪海夏正宗紫微斗数',
  description: '基于倪海夏正宗紫微斗数体系，AI深度解读您的命盘格局、大限流年、感情事业财富健康全方位解析',
  keywords: '紫微斗数, 倪海夏, 倪海厦, 紫微斗数全集, 紫微斗数全书, 骨髓赋, 命盘, 命理, 14主星, 12宫位',
  metadataBase: new URL('https://wdyziweidoushu666.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: '紫微命盘 · 倪海夏正宗紫微斗数',
    description: '基于倪海夏正宗紫微斗数体系，AI深度解读您的命盘格局、大限流年、感情事业财富健康全方位解析',
    url: 'https://wdyziweidoushu666.com',
    siteName: '紫微研究',
    locale: 'zh_CN',
    type: 'website',
  },
  // 站长平台验证（拿到 verification code 后填入对应字段，重新部署即可）
  verification: {
    // Google Search Console: 在 https://search.google.com/search-console 添加站点后获取
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || undefined,
    // Bing Webmaster Tools: 在 https://www.bing.com/webmasters 添加站点后获取
    other: {
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION || '808FFC6023A2C359B375DD860FEDA856',
      // 百度站长（等执照下来后）
      'baidu-site-verification': process.env.NEXT_PUBLIC_BAIDU_VERIFICATION || '',
      // 360 站长（等执照下来后）
      '360-site-verification': process.env.NEXT_PUBLIC_360_VERIFICATION || '',
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // 服务端固定渲染暗色首帧，与 ThemeProvider 默认值一致，避免 hydration 两端主题不一致；
    // 用户的本地主题偏好由 ThemeProvider 在挂载后读取并切换（见 components/ThemeProvider.tsx）
    <html lang="zh-CN" data-theme="dark" suppressHydrationWarning>
      <body className="min-h-screen">
        <ThemeProvider>
          <SiteHeader />
          {children}
          {/* A5 版本公告：改 AnnouncementModal 里的 ANNOUNCEMENT_VERSION 即可再次弹出 */}
          <AnnouncementModal />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
