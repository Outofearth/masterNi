'use client';

/**
 * /renji/jingui 《金匮要略》核心方剂库
 *
 * 40 张核心方剂按篇章分组
 */

import Link from 'next/link';
import CrossLinks from '@/components/CrossLinks';
import { useState, useMemo } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { useTianjiColors } from '../../tianji/_colors';
import {
  JINGUI_FORMULAS,
  jinguiGroupByChapter,
  type JinguiFormula,
} from '@/lib/renji/jingui';
import TianjiFadeIn from '../../tianji/TianjiFadeIn';
import GlobalSearch from '@/components/GlobalSearch';

export default function JinguiPage() {
  const { theme } = useTheme();
  const c = useTianjiColors(theme);
  const [chapterFilter, setChapterFilter] = useState<string>('all');
  const [searchQ, setSearchQ] = useState('');
  const [selectedNo, setSelectedNo] = useState<number | null>(null);

  const grouped = jinguiGroupByChapter();
  const chapters = Object.keys(grouped);

  const filtered = useMemo(() => {
    let list = chapterFilter === 'all' ? JINGUI_FORMULAS : JINGUI_FORMULAS.filter(f => f.chapter === chapterFilter);
    if (searchQ.trim()) {
      const q = searchQ.trim();
      // 全字段召回：方名 / 主治 / 主症 / 君药 / 组成 / 倪师要点 / 现代应用
      list = list.filter(f =>
        f.name.includes(q) ||
        f.indication.includes(q) ||
        f.symptoms.includes(q) ||
        f.king.includes(q) ||
        f.composition.includes(q) ||
        f.niNote.includes(q) ||
        (f.modern?.includes(q) ?? false),
      );
    }
    return list;
  }, [chapterFilter, searchQ]);

  const selected = JINGUI_FORMULAS.find(f => f.no === selectedNo) ?? null;

  return (
    <main className="min-h-screen">
      <nav
        className="sticky top-0 z-40 backdrop-blur-md"
        style={{
          background: theme === 'dark' ? 'rgba(2,8,16,0.78)' : 'rgba(245,239,224,0.78)',
          borderBottom: `1px solid ${c.featureBord}`,
        }}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-4 min-0">
            <Link href="/renji" className="text-sm font-medium tracking-wider shrink-0" style={{ color: c.goldSolid }}>
              ← 人纪
            </Link>
            <span className="text-sm tracking-widest font-serif truncate" style={{ color: c.textPrimary }}>
              《金匮要略》方剂
            </span>
          </div>
          <GlobalSearch variant="full" />
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 pt-12 pb-8">
        <TianjiFadeIn>
          <div className="text-center">
            <div
              className="inline-block px-3 py-1 rounded-full text-[10px] tracking-[0.3em] mb-4"
              style={{
                background: c.featureBg,
                border: `1px solid ${c.goldLine}`,
                color: c.goldSolid,
              }}
            >
              汉·张仲景 · 杂病论
            </div>
            <h1 className="text-4xl md:text-5xl font-serif tracking-widest leading-tight mb-4" style={{ color: c.textPrimary }}>
              《金匮要略》方剂
            </h1>
            <p className="text-base leading-relaxed max-w-2xl mx-auto" style={{ color: c.textSecond }}>
              杂病之宗 · 内科妇科外科皆有专方
              <br />
              {chapters.length} 篇 · {JINGUI_FORMULAS.length} 方
            </p>
          </div>
        </TianjiFadeIn>
      </section>

      {/* 篇章过滤 */}
      <section className="max-w-5xl mx-auto px-4 pb-4">
        <TianjiFadeIn delay={0.05}>
          <div className="flex flex-col md:flex-row items-center justify-center gap-3">
            <div className="flex items-center gap-2 flex-wrap justify-center">
            <button
              type="button"
              onClick={() => setChapterFilter('all')}
              className="px-3 py-1.5 rounded-full text-[11px] tracking-wider transition-colors"
              style={{
                background: chapterFilter === 'all' ? c.goldSolid : c.featureBg,
                color: chapterFilter === 'all' ? '#fff' : c.textMuted,
                border: `1px solid ${chapterFilter === 'all' ? c.goldSolid : c.featureBord}`,
              }}
            >
              全部篇章
            </button>
            {chapters.map(ch => (
              <button
                key={ch}
                type="button"
                onClick={() => setChapterFilter(ch)}
                className="px-3 py-1.5 rounded-full text-[11px] tracking-wider transition-colors"
                style={{
                  background: chapterFilter === ch ? c.goldSolid : c.featureBg,
                  color: chapterFilter === ch ? '#fff' : c.textMuted,
                  border: `1px solid ${chapterFilter === ch ? c.goldSolid : c.featureBord}`,
                }}
              >
                {ch}
              </button>
            ))}
            </div>
            <input
              type="text"
              placeholder="搜索方名 / 主治 / 症状…"
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              className="text-[11px] px-3 py-1.5 rounded-full outline-none"
              style={{
                background: c.featureBg,
                border: `1px solid ${c.featureBord}`,
                color: c.textPrimary,
                minWidth: '200px',
              }}
            />
          </div>
        </TianjiFadeIn>
      </section>

      {/* 网格列表 */}
      <section className="max-w-5xl mx-auto px-4 pb-10">
        <TianjiFadeIn delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map(f => (
              <button
                key={f.no}
                type="button"
                onClick={() => setSelectedNo(f.no === selectedNo ? null : f.no)}
                className="rounded-xl p-4 text-left transition-all hover:scale-[1.02]"
                style={{
                  background: selectedNo === f.no ? c.goldSolid : c.cardBg,
                  color: selectedNo === f.no ? '#fff' : c.textPrimary,
                  border: `1px solid ${selectedNo === f.no ? c.goldSolid : c.featureBord}`,
                  boxShadow: selectedNo === f.no ? `0 4px 16px ${c.goldSolid}55` : 'none',
                }}
              >
                <div
                  className="text-[9px] tracking-[0.2em] mb-1"
                  style={{
                    color: selectedNo === f.no ? 'rgba(255,255,255,0.85)' : c.tagText,
                  }}
                >
                  {f.chapter} · 第 {f.no} 方
                </div>
                <div className="text-base font-serif font-medium mb-2">{f.name}</div>
                <div
                  className="text-[10px] leading-relaxed line-clamp-2"
                  style={{
                    color: selectedNo === f.no ? 'rgba(255,255,255,0.85)' : c.textSecond,
                  }}
                >
                  {f.indication}
                </div>
              </button>
            ))}
          </div>
          <div className="mt-3 text-[10px] tracking-widest text-right" style={{ color: c.textFaint }}>
            共 {JINGUI_FORMULAS.length} 方 · 当前显示 {filtered.length} 方
          </div>
        </TianjiFadeIn>
      </section>

      {/* 详情 */}
      {selected && (
        <section className="max-w-5xl mx-auto px-4 pb-10">
          <TianjiFadeIn key={selected.no}>
            <div
              className="rounded-2xl p-6 lg:p-8"
              style={{
                background: c.cardBg,
                border: `1px solid ${c.goldLine}`,
                boxShadow: `0 4px 24px ${c.goldSolid}10`,
              }}
            >
              <div className="flex items-start gap-4 mb-5">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center font-serif shrink-0"
                  style={{
                    background: c.goldSolid,
                    color: '#fff',
                    fontSize: '14px',
                  }}
                >
                  {selected.chapter}
                </div>
                <div className="flex-1">
                  <div className="text-[10px] tracking-[0.3em] mb-1" style={{ color: c.tagText }}>
                    第 {selected.no} 方 · 君药：{selected.king}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-serif tracking-wider" style={{ color: c.textPrimary }}>
                    {selected.name}
                  </h2>
                  <p className="text-[12px] mt-2" style={{ color: c.goldSolid }}>
                    {selected.indication}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-5">
                <div className="rounded-lg p-4" style={{ background: c.featureBg, border: `1px solid ${c.featureBord}` }}>
                  <div className="text-[10px] tracking-[0.2em] mb-2" style={{ color: c.tagText }}>
                    主症
                  </div>
                  <p className="text-[11px] leading-relaxed font-serif" style={{ color: c.textPrimary }}>
                    {selected.symptoms}
                  </p>
                </div>
                <div className="rounded-lg p-4" style={{ background: c.featureBg, border: `1px solid ${c.featureBord}` }}>
                  <div className="text-[10px] tracking-[0.2em] mb-2" style={{ color: c.tagText }}>
                    组成
                  </div>
                  <p className="text-[11px] leading-relaxed font-serif" style={{ color: c.textPrimary }}>
                    {selected.composition}
                  </p>
                </div>
              </div>

              <div
                className="rounded-xl p-5 mb-3"
                style={{
                  background: c.featureBg,
                  border: `1px solid ${c.featureBord}`,
                  borderLeft: `4px solid ${c.goldSolid}`,
                }}
              >
                <div className="text-[10px] tracking-[0.3em] mb-2" style={{ color: c.goldSolid }}>
                  倪师要点
                </div>
                <p className="text-[12px] leading-relaxed font-serif" style={{ color: c.textPrimary }}>
                  {selected.niNote}
                </p>
              </div>

              {selected.modern && (
                <div className="rounded-lg p-4" style={{ background: c.featureBg, border: `1px solid ${c.featureBord}` }}>
                  <div className="text-[10px] tracking-[0.2em] mb-2" style={{ color: c.tagText }}>
                    现代应用
                  </div>
                  <p className="text-[11px] leading-relaxed" style={{ color: c.textSecond }}>
                    {selected.modern}
                  </p>
                </div>
              )}
            </div>
          </TianjiFadeIn>
        </section>
      )}

      {/* A4-4 · 延伸阅读 */}
      <div className="max-w-5xl mx-auto px-4">
        <CrossLinks
          links={[
            { href: '/renji/shanghan', label: '《伤寒论》方剂 →', desc: '32 首六经方，辨证速查' },
            { href: '/library/search?q=金匮', label: '古籍检索「金匮」→', desc: '在原典库中查找相关原文' },
            { href: '/renji', label: '人纪总览 →', desc: '倪师人纪体系全貌' },
            { href: '/diji', label: '地纪 · 堪舆 →', desc: '地理与人文的另一半学问' },
          ]}
        />
      </div>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-4 pb-10 pt-6" style={{ borderTop: `1px solid ${c.featureBord}` }}>
        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
          <Link href="/renji/shanghan" className="tracking-wider hover:underline" style={{ color: c.textSecond }}>
            ← 《伤寒论》方剂
          </Link>
          <span style={{ color: c.textFaint }}>·</span>
          <Link href="/renji" className="tracking-wider hover:underline" style={{ color: c.goldSolid }}>
            人纪总览 →
          </Link>
        </div>
      </footer>
    </main>
  );
}