'use client';

/**
 * 全站顶栏（唯一导航实现）
 *
 * 包含：Logo / 主导航（8 项）/ 搜索 / 主题切换 / 移动端汉堡菜单
 * 在 app/layout.tsx 集成到所有页面。
 *
 * 设计约定（P0/P1 统一后）：
 * - 所有颜色走 globals.css 语义 token，不再内联硬编 hex → 自动双主题、无金色漂移
 * - 导航文字用 --tx-2（≈8:1），hover / active 用 --ac-text，均达 WCAG AA
 * - 导航字号 13px（辅助文字下限，不用 12px 以下）
 */

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import GlobalSearch from './GlobalSearch';

// 三纪（天纪/地纪/人纪）此前只有「天纪」在导航里，地纪、人纪只能从首页进、
// 深层页面回不去。这里补全为平铺 8 项，保证任何页面都能直达。
const LINKS: { href: string; label: string }[] = [
  { href: '/', label: '首页' },
  { href: '/chart', label: '起命盘' },
  { href: '/heming', label: '合婚' },
  { href: '/tianji', label: '天纪' },
  { href: '/diji', label: '地纪' },
  { href: '/renji', label: '人纪' },
  { href: '/knowledge', label: '紫微图谱' },
  { href: '/library', label: '古籍' },
];

export default function SiteHeader() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // 全部引用语义 token：浅暖米 / 暗墨蓝由 CSS 变量自动切换
  const bg = 'color-mix(in srgb, var(--bg-0) 88%, transparent)';
  const text = 'var(--tx-1)';
  const textMuted = 'var(--tx-2)';
  const border = 'var(--bdr-med)';

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/');

  return (
    <header
      className="site-header sticky top-0 z-40 backdrop-blur-md"
      style={{
        background: bg,
        borderBottom: `1px solid ${border}`,
      }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 flex items-center gap-2 sm:gap-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0"
          style={{ color: text }}
          aria-label="返回首页"
        >
          <span
            className="text-base font-serif tracking-widest"
            style={{ color: 'var(--ac-text)' }}
          >
            紫微
          </span>
          <span
            className="text-[13px] hidden sm:inline tracking-[0.2em]"
            style={{ color: 'var(--tx-3)' }}
          >
            倪海夏正宗
          </span>
        </Link>

        {/* 桌面导航 */}
        <nav className="hidden md:flex items-center gap-1 flex-1" aria-label="主导航">
          {LINKS.map(l => {
            const active = isActive(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? 'page' : undefined}
                className="px-3 py-1.5 rounded-full text-[15px] tracking-wider transition-colors"
                style={{
                  color: active ? 'var(--ac-text)' : textMuted,
                  fontWeight: active ? 500 : 400,
                  background: active ? 'var(--ac-bg)' : 'transparent',
                }}
                onMouseEnter={e => {
                  if (!active) e.currentTarget.style.color = 'var(--ac-strong)';
                }}
                onMouseLeave={e => {
                  if (!active) e.currentTarget.style.color = textMuted;
                }}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* 移动端菜单按钮 */}
        <button
          type="button"
          onClick={() => setMenuOpen(o => !o)}
          className="md:hidden p-2 -ml-1"
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
        <div className="flex items-center gap-1.5 ml-auto md:ml-0">
          <div className="hidden sm:block">
            <GlobalSearch variant="full" />
          </div>
          <div className="sm:hidden">
            <GlobalSearch variant="icon" />
          </div>
          <button
            type="button"
            onClick={toggle}
            aria-label={isDark ? '切换到浅色主题' : '切换到深色主题'}
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
          style={{ borderColor: border, background: 'var(--bg-0)' }}
          aria-label="移动端导航"
        >
          <div className="max-w-7xl mx-auto px-3 py-2 grid grid-cols-2 gap-1">
            {LINKS.map(l => {
              const active = isActive(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={active ? 'page' : undefined}
                  className="py-2.5 px-2 text-[15px] rounded-lg"
                  style={{
                    color: active ? 'var(--ac-text)' : text,
                    background: active ? 'var(--ac-bg)' : 'transparent',
                    fontWeight: active ? 500 : 400,
                  }}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
