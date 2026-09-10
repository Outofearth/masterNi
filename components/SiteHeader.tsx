'use client';

/**
 * 全站顶栏
 *
 * 包含：Logo / 主导航 / 搜索按钮 / 主题切换
 * 在 app/layout.tsx 集成到所有页面。
 */

import Link from 'next/link';
import { useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import GlobalSearch from './GlobalSearch';

export default function SiteHeader() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';
  const [menuOpen, setMenuOpen] = useState(false);

  const bg = isDark ? 'rgba(10,12,18,0.85)' : 'rgba(248,243,232,0.92)';
  const text = isDark ? '#e7d8b8' : '#2a2014';
  const textMuted = isDark ? '#8b8275' : '#6b5d4f';
  const border = isDark ? 'rgba(212,168,67,0.15)' : 'rgba(184,146,42,0.25)';

  // 三纪（天纪/地纪/人纪）此前只有「天纪」在导航里，地纪、人纪只能从首页进、
  // 深层页面回不去。这里补全为平铺 8 项，保证任何页面都能直达。
  const links: { href: string; label: string }[] = [
    { href: '/', label: '首页' },
    { href: '/chart', label: '起命盘' },
    { href: '/heming', label: '合婚' },
    { href: '/tianji', label: '天纪' },
    { href: '/diji', label: '地纪' },
    { href: '/renji', label: '人纪' },
    { href: '/knowledge', label: '紫微图谱' },
    { href: '/library', label: '古籍' },
  ];

  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-md"
      style={{
        background: bg,
        borderBottom: `1px solid ${border}`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3 sm:gap-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0"
          style={{ color: text }}
          aria-label="返回首页"
        >
          <span className="text-base font-serif tracking-widest" style={{ color: '#d4a843' }}>
            紫微
          </span>
          <span className="text-[10px] hidden sm:inline tracking-[0.2em]" style={{ color: textMuted }}>
            倪海夏正宗
          </span>
        </Link>

        {/* 桌面导航 */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-1.5 rounded-full text-xs tracking-wider transition-colors hover:opacity-80"
              style={{ color: textMuted }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* 移动端菜单按钮 */}
        <button
          type="button"
          onClick={() => setMenuOpen(o => !o)}
          className="md:hidden p-2"
          aria-expanded={menuOpen}
          aria-label="菜单"
          style={{ color: textMuted }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            {menuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>

        {/* 搜索 + 主题切换 */}
        <div className="flex items-center gap-2 ml-auto md:ml-0">
          <div className="hidden sm:block">
            <GlobalSearch variant="full" />
          </div>
          <div className="sm:hidden">
            <GlobalSearch variant="icon" />
          </div>
          <button
            type="button"
            onClick={toggle}
            aria-label="切换主题"
            className="p-2 rounded-full"
            style={{ color: textMuted }}
          >
            {isDark ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* 移动端下拉菜单 */}
      {menuOpen && (
        <nav
          className="md:hidden border-t"
          style={{ borderColor: border, background: bg }}
        >
          <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col gap-1">
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="py-2 px-2 text-sm rounded"
                style={{ color: text }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}