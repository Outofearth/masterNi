'use client';
import { motion } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';

export type TabKey = 'ziwei' | 'tianji' | 'diji' | 'renji';

export interface HomeTabDef {
  key: TabKey;
  name: string;
  en: string;
  icon: string;
  href?: string;
  status: 'live' | 'soon';
  readyNote: string;
  soonNote: string;
}

export const HOME_TABS: HomeTabDef[] = [
  {
    key: 'ziwei', name: '紫微', en: 'Zi Wei', icon: '◉',
    href: '/chart', status: 'live',
    readyNote: '当前',
    soonNote: '',
  },
  {
    key: 'tianji', name: '天纪', en: 'Tian Ji', icon: '⊙',
    href: '/tianji', status: 'live',
    readyNote: '已上线',
    soonNote: '',
  },
  {
    key: 'diji', name: '地纪', en: 'Di Ji', icon: '⊞',
    status: 'soon',
    readyNote: '',
    soonNote: '地纪模块筹备中：国家地理志 · 堪舆理论 · 遗稿研读 · 数据在整理中',
  },
  {
    key: 'renji', name: '人纪', en: 'Ren Ji', icon: '⊕',
    status: 'soon',
    readyNote: '',
    soonNote: '人纪模块筹备中：内经 · 伤寒 · 金匮 · 针灸，数据梳理中',
  },
];

export function getTabByPath(path: string | null): TabKey {
  if (!path) return 'ziwei';
  if (path.startsWith('/tianji')) return 'tianji';
  return 'ziwei';
}

function useTabColors(theme: 'dark' | 'light') {
  const d = theme === 'dark';
  return {
    goldSolid:  d ? '#d4a843'                : '#8b6410',
    goldLine:   d ? 'rgba(212,168,67,0.4)'   : 'rgba(140,100,20,0.4)',
    goldSoft:   d ? 'rgba(212,168,67,0.7)'   : 'rgba(140,100,20,0.7)',
    goldFaint:  d ? 'rgba(212,168,67,0.18)'  : 'rgba(140,100,20,0.18)',
    textMuted:  d ? '#9db0d0'                : '#5a6275',
    textSecond: d ? '#b8c6df'                : '#3a3f4a',
    textFaint:  d ? 'rgba(240,246,255,0.56)' : '#9da4b3',
    pillBorder: d ? 'rgba(255,255,255,0.05)' : 'rgba(160,120,30,0.15)',
    pillBg:     d ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.55)',
    toastBg:    d ? 'rgba(20,30,50,0.92)'    : 'rgba(252,248,236,0.96)',
    toastBorder:d ? 'rgba(212,168,67,0.45)'  : 'rgba(140,100,20,0.4)',
    toastText:  d ? '#e8eef6'                : '#1a1d24',
  };
}

interface Props {
  variant: 'nav' | 'hero';
  active: TabKey;
  onActive: (k: TabKey) => void;
  onSoon: (msg: string) => void;
}

export default function HomeTabs({ variant, active, onActive, onSoon }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme();

  const isHero = variant === 'hero';

  function handleClick(tab: HomeTabDef) {
    if (tab.status === 'soon') {
      onSoon(tab.soonNote);
      return;
    }
    onActive(tab.key);
    if (tab.key === 'ziwei') {
      if (pathname !== '/') router.push('/');
      return;
    }
    if (tab.href) router.push(tab.href);
  }

  function handleKeyDown(e: React.KeyboardEvent, tab: HomeTabDef) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(tab);
      return;
    }
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const idx = HOME_TABS.findIndex(t => t.key === active);
      const len = HOME_TABS.length;
      const nextIdx = e.key === 'ArrowRight' ? (idx + 1) % len : (idx - 1 + len) % len;
      const t = HOME_TABS[nextIdx];
      const btn = document.getElementById(`hometab-${t.key}`);
      btn?.focus();
      if (t.status === 'live') onActive(t.key);
    }
  }

  const containerCls = isHero
    ? 'flex items-center gap-1 sm:gap-1.5 p-1 rounded-full'
    : 'flex items-center gap-0.5 sm:gap-1';

  const containerStyle: React.CSSProperties = isHero
    ? {
        background: useTabColors(theme).pillBg,
        border: `1px solid ${useTabColors(theme).pillBorder}`,
        backdropFilter: 'blur(8px)',
      }
    : {};

  return (
    <div
      role="tablist"
      aria-label="三纪模块导航"
      aria-orientation="horizontal"
      className={containerCls}
      style={containerStyle}
    >
      {HOME_TABS.map(tab => {
        const c = useTabColors(theme);
        const isActive = tab.key === active;
        const isSoon = tab.status === 'soon';
        return (
          <button
            key={tab.key}
            id={`hometab-${tab.key}`}
            role="tab"
            aria-selected={isActive}
            aria-controls={`hometab-panel-${tab.key}`}
            aria-disabled={isSoon}
            tabIndex={isActive ? 0 : -1}
            onClick={() => handleClick(tab)}
            onKeyDown={(e) => handleKeyDown(e, tab)}
            title={isSoon ? tab.soonNote : (tab.readyNote || undefined)}
            className={[
              'relative outline-none transition-colors duration-200',
              isHero
                ? 'px-2.5 sm:px-3.5 py-1.5 rounded-full'
                : 'px-1.5 sm:px-2.5 py-1 rounded-md',
              'flex items-center gap-1 sm:gap-1.5',
              'group focus-visible:ring-2 focus-visible:ring-offset-1',
            ].join(' ')}
            style={{
              color: isActive
                ? c.goldSolid
                : isSoon
                  ? c.textFaint
                  : c.textMuted,
              cursor: isSoon ? 'help' : 'pointer',
              background: isActive && isHero ? c.goldFaint : 'transparent',
              transitionProperty: 'color, background',
              transitionDuration: '0.2s',
            }}
          >
            {isActive && (
              <motion.span
                layoutId={`hometab-indicator-${variant}`}
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  border: `1px solid ${c.goldLine}`,
                  boxShadow: `0 0 12px ${c.goldSoft}`,
                }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                aria-hidden="true"
              />
            )}

            <span
              aria-hidden="true"
              className={isHero ? 'text-base sm:text-lg leading-none' : 'text-xs sm:text-sm leading-none'}
              style={{
                color: isActive ? c.goldSolid : isSoon ? c.textFaint : c.textMuted,
                transition: 'color 0.2s',
              }}
            >
              {tab.icon}
            </span>

            <span
              className={isHero
                ? 'text-xs sm:text-sm tracking-wider font-medium'
                : 'text-[11px] sm:text-xs tracking-wide'
              }
            >
              {tab.name}
            </span>

            {isHero && (
              <span
                className="hidden sm:inline text-[9px] tracking-[0.2em] uppercase"
                style={{
                  color: isActive ? c.goldSoft : c.textFaint,
                }}
              >
                {tab.en}
              </span>
            )}

            {isHero && isActive && tab.readyNote && (
              <motion.span
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                className="ml-0.5 hidden lg:inline-block text-[9px] px-1.5 py-0.5 rounded-full"
                style={{
                  background: c.goldFaint,
                  color: c.goldSolid,
                  border: `1px solid ${c.goldLine}`,
                }}
              >
                {tab.readyNote}
              </motion.span>
            )}

            {isHero && isSoon && (
              <span
                className="ml-0.5 hidden lg:inline-block text-[9px] px-1.5 py-0.5 rounded-full"
                style={{
                  background: 'transparent',
                  color: c.textFaint,
                  border: `1px dashed ${c.textFaint}`,
                }}
                aria-hidden="true"
              >
                筹备中
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}