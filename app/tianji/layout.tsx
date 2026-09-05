'use client';
import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';
import ThemeToggle from '@/components/ThemeToggle';

// ─── 天纪页共享顶部导航 ─────────────────────────────
// 固定顶栏：左侧 logo（可回首页），右侧天纪板块链接 + 立即起盘 + 主题切换。
// 主题感知：浅色 = 米黄底；深色 = 深空底，与首页 nav 同款无色差。
function TianjiNav() {
  const { theme } = useTheme();
  const d = theme === 'dark';
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4 gap-2"
      style={{
        background: d ? '#020810' : '#f5efe0',
        transition: 'background 0.35s ease',
      }}
    >
      <Link
        href="/"
        className="text-[11px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] font-medium transition-colors duration-300 flex-shrink-0"
        style={{ color: d ? '#d4a843' : '#8b6410' }}
      >
        紫微命盘 · 天纪
      </Link>
      <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
        <Link
          href="/tianji"
          className="text-[11px] sm:text-xs px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full transition-all duration-300"
          style={{
            border: `1px solid ${d ? 'rgba(212,168,67,0.3)' : 'rgba(140,100,20,0.35)'}`,
            color: d ? '#d4a843' : '#8b6410',
          }}
        >
          天纪首页
        </Link>
        <Link
          href="/chart"
          className="text-[11px] sm:text-xs px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full transition-all duration-300"
          style={{
            border: `1px solid ${d ? 'rgba(212,168,67,0.4)' : 'rgba(140,100,20,0.35)'}`,
            color: d ? '#d4a843' : '#8b6410',
          }}
        >
          立即起盘
        </Link>
        <ThemeToggle />
      </div>
    </nav>
  );
}

// ─── 天纪页根 layout ─────────────────────────────
// 与首页 design language 一致：theme-aware 背景、pt 给 nav 让位、最小宽度适配。
export default function TianjiLayout({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const d = theme === 'dark';
  return (
    <div
      style={{
        background: d ? '#020810' : '#f5efe0',
        transition: 'background 0.35s ease',
        minHeight: '100vh',
      }}
      className="overflow-x-hidden"
    >
      <TianjiNav />
      <main style={{ paddingTop: 64 }}>{children}</main>
    </div>
  );
}