'use client';

/**
 * /diji/mountains 廿四山向详解
 *
 * 数据来源：lib/diji/mountains.ts
 */

import Link from 'next/link';
import CrossLinks from '@/components/CrossLinks';
import { useState, useMemo } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { useTianjiColors } from '../../tianji/_colors';
import {
  TWENTY_FOUR_MOUNTAINS,
  MOUNTAIN_GROUPS,
  CONCEPT_GLOSSARY,
  type Mountain,
} from '@/lib/diji/mountains';
import TianjiFadeIn from '../../tianji/TianjiFadeIn';
import GlobalSearch from '@/components/GlobalSearch';

export default function MountainsPage() {
  const { theme } = useTheme();
  const c = useTianjiColors(theme);
  const [selected, setSelected] = useState<Mountain | null>(null);
  const [dragonFilter, setDragonFilter] = useState<'all' | '天元龙' | '地元龙' | '人元龙'>('all');

  const filtered = useMemo(
    () =>
      dragonFilter === 'all'
        ? TWENTY_FOUR_MOUNTAINS
        : TWENTY_FOUR_MOUNTAINS.filter(m => m.dragon === dragonFilter),
    [dragonFilter],
  );

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
            <Link href="/diji" className="text-sm font-medium tracking-wider shrink-0" style={{ color: c.goldSolid }}>
              ← 地纪
            </Link>
            <span className="text-sm tracking-widest font-serif truncate" style={{ color: c.textPrimary }}>
              廿四山向
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
              堪舆基础 · 罗经正针
            </div>
            <h1 className="text-4xl md:text-5xl font-serif tracking-widest leading-tight mb-4" style={{ color: c.textPrimary }}>
              廿四山向
            </h1>
            <p className="text-base leading-relaxed max-w-2xl mx-auto" style={{ color: c.textSecond }}>
              罗经三百六十度，每十五度为一山，廿四山以定阴阳、辨五行、分三元。
              <br />
              龙、穴、砂、水、向，五者皆以此为度。
            </p>
          </div>
        </TianjiFadeIn>
      </section>

      {/* 龙分类过滤 */}
      <section className="max-w-5xl mx-auto px-4 pb-4">
        <TianjiFadeIn delay={0.05}>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {(['all', '天元龙', '地元龙', '人元龙'] as const).map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => setDragonFilter(opt)}
                className="px-4 py-1.5 rounded-full text-[11px] tracking-wider transition-colors"
                style={{
                  background: dragonFilter === opt ? c.goldSolid : c.featureBg,
                  color: dragonFilter === opt ? '#fff' : c.textMuted,
                  border: `1px solid ${dragonFilter === opt ? c.goldSolid : c.featureBord}`,
                }}
              >
                {opt === 'all' ? '全部' : opt}
              </button>
            ))}
          </div>
        </TianjiFadeIn>
      </section>

      {/* 罗盘主视图 */}
      <section className="max-w-5xl mx-auto px-4 pb-10">
        <TianjiFadeIn delay={0.1}>
          <div
            className="rounded-2xl p-6"
            style={{ background: c.cardBg, border: `1px solid ${c.featureBord}` }}
          >
            <div className="text-[10px] tracking-[0.3em] mb-4" style={{ color: c.tagText }}>
              罗盘分布 · 共 {filtered.length} 山
            </div>
            <div className="grid grid-cols-6 md:grid-cols-8 gap-2">
              {filtered.map(m => {
                const isSelected = selected?.name === m.name && selected?.index === m.index;
                return (
                  <button
                    key={`${m.name}-${m.index}`}
                    type="button"
                    onClick={() => setSelected(isSelected ? null : m)}
                    className="relative rounded-lg py-3 px-2 transition-all hover:scale-105"
                    style={{
                      background: isSelected ? c.goldSolid : c.featureBg,
                      color: isSelected ? '#fff' : c.textPrimary,
                      border: `1px solid ${isSelected ? c.goldSolid : c.goldLine}`,
                      boxShadow: isSelected ? `0 4px 12px ${c.goldSolid}55` : 'none',
                    }}
                  >
                    <div className="text-lg font-serif">{m.name}</div>
                    <div className="text-[9px] tracking-widest mt-1" style={{
                      color: isSelected ? 'rgba(255,255,255,0.85)' : c.textFaint,
                    }}>
                      {m.element} · {m.yinYang}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </TianjiFadeIn>
      </section>

      {/* 选中详情 */}
      {selected && (
        <section className="max-w-5xl mx-auto px-4 pb-10">
          <TianjiFadeIn>
            <div
              className="rounded-2xl p-6 lg:p-8"
              style={{
                background: c.cardBg,
                border: `1px solid ${c.goldLine}`,
                boxShadow: `0 4px 24px ${c.goldSolid}15`,
              }}
            >
              <div className="flex items-start gap-5 mb-5">
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl font-serif shrink-0"
                  style={{
                    background: c.goldSolid,
                    color: '#fff',
                  }}
                >
                  {selected.name}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="text-[10px] tracking-[0.3em]" style={{ color: c.tagText }}>
                      第 {selected.index} 山 · {selected.degree}°
                    </div>
                  </div>
                  <h3 className="text-2xl font-serif tracking-wider mb-2" style={{ color: c.textPrimary }}>
                    {selected.dragon} · {selected.element} · {selected.yinYang}
                  </h3>
                  <p className="text-[11px] tracking-widest" style={{ color: c.goldSolid }}>
                    {selected.starNote}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-lg p-4" style={{ background: c.featureBg, border: `1px solid ${c.featureBord}` }}>
                  <div className="text-[10px] tracking-[0.2em] mb-2" style={{ color: c.tagText }}>
                    阳宅宜忌
                  </div>
                  <p className="text-[11px] leading-relaxed font-serif" style={{ color: c.textPrimary }}>
                    {selected.yangZhai}
                  </p>
                </div>
                <div className="rounded-lg p-4" style={{ background: c.featureBg, border: `1px solid ${c.featureBord}` }}>
                  <div className="text-[10px] tracking-[0.2em] mb-2" style={{ color: c.tagText }}>
                    阴宅葬法
                  </div>
                  <p className="text-[11px] leading-relaxed font-serif" style={{ color: c.textPrimary }}>
                    {selected.yinZhai}
                  </p>
                </div>
              </div>

              <div className="mt-4 text-[10px] tracking-[0.15em] flex items-center gap-3 flex-wrap" style={{ color: c.textFaint }}>
                <span>纳音：{selected.nayinElement}</span>
                <span>·</span>
                <span>主龙：{selected.mainDragon}</span>
              </div>
            </div>
          </TianjiFadeIn>
        </section>
      )}

      {/* 八宫分组 */}
      <section className="max-w-5xl mx-auto px-4 pb-10">
        <TianjiFadeIn delay={0.15}>
          <div className="mb-6">
            <div className="text-[10px] tracking-[0.3em] mb-2" style={{ color: c.tagText }}>
              八宫分野
            </div>
            <h3 className="text-2xl font-serif tracking-wider" style={{ color: c.textPrimary }}>
              八卦方位 · 每宫三山
            </h3>
          </div>
        </TianjiFadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOUNTAIN_GROUPS.map((g, i) => (
            <TianjiFadeIn key={g.gua} delay={0.05 * (i + 1)}>
              <div
                className="rounded-xl p-5"
                style={{ background: c.cardBg, border: `1px solid ${c.featureBord}` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center font-serif"
                    style={{
                      background: c.featureBg,
                      border: `1px solid ${c.goldLine}`,
                      color: c.goldSolid,
                    }}
                  >
                    {g.gua}
                  </div>
                  <div>
                    <div className="text-[10px] tracking-[0.2em]" style={{ color: c.tagText }}>
                      {g.position}
                    </div>
                    <div className="text-[11px] tracking-wider" style={{ color: c.goldSolid }}>
                      {g.godNote}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {g.mountains.map(m => (
                    <button
                      key={`${m.name}-${m.index}`}
                      type="button"
                      onClick={() => setSelected(m)}
                      className="px-3 py-1 rounded-full text-[11px] font-serif transition-colors"
                      style={{
                        background: c.featureBg,
                        border: `1px solid ${c.featureBord}`,
                        color: c.textPrimary,
                      }}
                    >
                      {m.name}
                      <span style={{ color: c.textFaint, fontSize: '9px', marginLeft: '4px' }}>
                        {m.degree}°
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </TianjiFadeIn>
          ))}
        </div>
      </section>

      {/* 概念词表 */}
      <section className="max-w-5xl mx-auto px-4 pb-12">
        <TianjiFadeIn delay={0.2}>
          <div className="mb-6">
            <div className="text-[10px] tracking-[0.3em] mb-2" style={{ color: c.tagText }}>
              堪舆术语
            </div>
            <h3 className="text-2xl font-serif tracking-wider" style={{ color: c.textPrimary }}>
              核心概念 · {CONCEPT_GLOSSARY.length} 条
            </h3>
          </div>
          <div
            className="rounded-xl p-5"
            style={{ background: c.featureBg, border: `1px solid ${c.featureBord}` }}
          >
            <ul className="space-y-3">
              {CONCEPT_GLOSSARY.map((g, i) => (
                <li key={i} className="text-[11px] leading-relaxed" style={{ color: c.textSecond }}>
                  <span style={{ color: c.goldSolid, fontWeight: 600 }}>{g.word}</span>
                  <span style={{ color: c.textFaint }}> · </span>
                  <span>{g.brief}</span>
                </li>
              ))}
            </ul>
          </div>
        </TianjiFadeIn>
      </section>

      {/* A4-4 · 延伸阅读 */}
      <div className="max-w-5xl mx-auto px-4">
        <CrossLinks
          links={[
            { href: '/diji/wujue', label: '地理五诀 →', desc: '龙穴砂水向，堪舆实操五大要素' },
            { href: '/knowledge', label: '紫微知识库 →', desc: '14 主星 × 13 宫位完整论断' },
            { href: '/library', label: '古籍原典库 →', desc: '紫微斗数全集 · 骨髓赋等原文' },
            { href: '/chart', label: '排盘实测 →', desc: '输入生辰，即时生成命盘' },
          ]}
        />
      </div>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-4 pb-10 pt-6" style={{ borderTop: `1px solid ${c.featureBord}` }}>
        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
          <Link href="/diji" className="tracking-wider hover:underline" style={{ color: c.textSecond }}>
            ← 地纪总览
          </Link>
          <span style={{ color: c.textFaint }}>·</span>
          <Link href="/diji/wujue" className="tracking-wider hover:underline" style={{ color: c.goldSolid }}>
            地理五诀 →
          </Link>
        </div>
      </footer>
    </main>
  );
}