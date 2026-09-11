'use client';

/**
 * 全站统一搜索面板
 *
 * 触发按钮（搜索图标）位于 SiteHeader 顶栏。
 * 点击触发弹全屏遮罩，浮动居中面板；输入即搜索，按类别分组展示。
 *
 * 数据源：@/lib/search/index.searchAll()
 */

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import { searchAll, groupByCategory, type SearchHit, type HitCategory } from '@/lib/search/index';

interface Props {
  /** 搜索按钮显示模式 */
  variant?: 'icon' | 'full';
}

const CAT_ORDER: HitCategory[] = [
  '主星', '卦象', '天纪模块', '人纪模块', '地纪模块',
  '堪舆', '汉唐方剂', '经方', '针灸', '阴阳九针',
  'DVD', '语录', '名人', '古籍',
];

// 分类色走语义 token（自动双主题；浅色下均 ≥4.5:1，此前静态 hex 在浅色下拉里对比不足）
const CAT_COLOR: Record<HitCategory, string> = {
  '主星': 'var(--ac-text)',
  '卦象': 'var(--ac-text)',
  '天纪模块': 'var(--ac-text)',
  '人纪模块': 'var(--state-good)',
  '地纪模块': 'var(--cat-earth)',
  '堪舆': 'var(--cat-earth)',
  '汉唐方剂': 'var(--state-good)',
  '经方': 'var(--state-good)',
  '针灸': 'var(--state-good)',
  '阴阳九针': 'var(--state-good)',
  'DVD': 'var(--cat-muted)',
  '语录': 'var(--cat-muted)',
  '名人': 'var(--cat-muted)',
  '古籍': 'var(--cat-muted)',
};

export default function GlobalSearch({ variant = 'icon' }: Props) {
  const { theme } = useTheme();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const hits = useMemo(() => searchAll(query, 50), [query]);
  const grouped = useMemo(() => groupByCategory(hits), [hits]);

  /* ─── 主题色 ─── */
  const isDark = theme === 'dark';
  const bg = isDark ? 'rgba(15,20,30,0.96)' : 'rgba(248,243,232,0.98)';
  const text = isDark ? '#e7d8b8' : '#2a2014';
  const textMuted = isDark ? '#8b8275' : '#6b5d4f';
  const cardBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.6)';
  const cardBorder = isDark ? 'rgba(212,168,67,0.18)' : 'rgba(184,146,42,0.25)';
  const goldSolid = isDark ? '#d4a843' : '#8b6410';
  const accent = 'var(--ac-text)';

  /* ─── 快捷键 Cmd+K / Ctrl+K ─── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(o => !o);
      } else if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    setQuery('');
    router.push(href);
  };

  return (
    <>
      {/* 触发按钮 */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="打开全站搜索"
        className="flex items-center gap-2 transition-colors"
        style={
          variant === 'full'
            ? {
                padding: '6px 12px',
                borderRadius: 999,
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                color: textMuted,
                fontSize: 14,
                minWidth: 200,
              }
            : {
                padding: 8,
                borderRadius: 999,
                background: 'transparent',
                color: textMuted,
              }
        }
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        {variant === 'full' && <span>搜索 14 主星 / 64 卦 / 300+ 资料…</span>}
      </button>

      {/* 弹层 */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="全站搜索"
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl overflow-hidden"
            style={{
              background: bg,
              border: `1px solid ${cardBorder}`,
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* 输入框 */}
            <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: `1px solid ${cardBorder}` }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={goldSolid} strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="搜索：紫微 14 主星 · 64 卦 · 堪舆 · 人纪针灸 · 汉唐方 · 古籍…"
                aria-label="搜索关键词"
                autoFocus
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ color: text, fontFamily: 'var(--font-serif)' }}
              />
              <kbd className="text-[12px] px-1.5 py-0.5 rounded" style={{ background: cardBg, color: textMuted, border: `1px solid ${cardBorder}` }}>
                Esc
              </kbd>
            </div>

            {/* 结果 */}
            <div className="max-h-[60vh] overflow-y-auto">
              {query.trim() === '' && (
                <div className="px-5 py-12 text-center">
                  <p className="text-xs tracking-wider" style={{ color: textMuted }}>
                    输入关键词开始检索
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                    {['紫微', '贪狼', '乾', '堪舆', '针灸', '白带丸', '命宫'].map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setQuery(s)}
                        className="px-3 py-1 rounded-full text-[12px]"
                        style={{
                          background: cardBg,
                          border: `1px solid ${cardBorder}`,
                          color: textMuted,
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {query.trim() !== '' && hits.length === 0 && (
                <div className="px-5 py-12 text-center">
                  <p className="text-xs" style={{ color: textMuted }}>
                    没有命中「<span style={{ color: accent }}>{query}</span>」的资料。
                  </p>
                  <p className="text-[12px] mt-2" style={{ color: textMuted }}>
                    试试：卦名（乾/履/谦）、主星（紫微/贪狼/七杀）、穴位（合谷/足三里）、方剂（桂枝汤/白带丸）
                  </p>
                </div>
              )}

              {hits.length > 0 && (
                <div className="py-2">
                  {CAT_ORDER.filter(cat => grouped[cat] && grouped[cat]!.length > 0).map(cat => (
                    <div key={cat} className="mb-3">
                      <div className="px-5 py-1.5 text-[12px] tracking-[0.2em] flex items-center justify-between"
                        style={{ color: CAT_COLOR[cat] }}>
                        <span>{cat}</span>
                        <span style={{ color: textMuted }}>{grouped[cat]!.length} 条</span>
                      </div>
                      {grouped[cat]!.slice(0, 5).map((hit, i) => (
                        <HitRow key={`${cat}-${i}`} hit={hit} onClick={() => go(hit.href)} cardBg={cardBg} cardBorder={cardBorder} text={text} textMuted={textMuted} accent={accent} />
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 底部 */}
            <div className="px-5 py-2 flex items-center justify-between text-[12px]" style={{ color: textMuted, borderTop: `1px solid ${cardBorder}` }}>
              <span>共 {hits.length} 条结果</span>
              <span>Cmd/Ctrl+K · Esc 关闭</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function HitRow({ hit, onClick, cardBg, cardBorder, text, textMuted, accent }: {
  hit: SearchHit;
  onClick: () => void;
  cardBg: string;
  cardBorder: string;
  text: string;
  textMuted: string;
  accent: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left flex items-start gap-3 px-5 py-2 transition-colors hover:opacity-80"
      style={{ background: 'transparent' }}
    >
      <span className="text-[12px] mt-0.5 px-1.5 py-0.5 rounded shrink-0" style={{
        background: cardBg, color: textMuted, border: `1px solid ${cardBorder}`,
      }}>
        {hit.category}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-serif truncate" style={{ color: text }}>{hit.title}</div>
        <div className="text-[12px] truncate mt-0.5" style={{ color: textMuted }}>{hit.snippet}</div>
      </div>
      <span className="text-[12px] mt-1" style={{ color: textMuted }}>→</span>
    </button>
  );
}