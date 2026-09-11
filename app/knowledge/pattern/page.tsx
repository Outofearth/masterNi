/**
 * /knowledge/pattern — 紫微格局词典总览
 * 39 条经典格局按"上/中/助力/基础/凶"五类浏览
 */

'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  PATTERN_CATALOG,
  PATTERN_CATEGORIES,
  PATTERN_LEVELS,
  LEVEL_LABEL,
  LEVEL_COLOR,
  CATEGORY_LABEL,
  searchPatterns,
  groupPatternsByCategory,
  type PatternEntry,
  type PatternCategory,
  type PatternLevel,
} from '@/lib/ziwei/pattern-catalog';
import SiteFooter from '@/components/SiteFooter';

export default function PatternKnowledgePage() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<PatternCategory | 'all'>('all');
  const [activeLevel, setActiveLevel] = useState<PatternLevel | 'all'>('all');

  const filtered = useMemo(() => {
    let list = searchPatterns(query);
    if (activeCategory !== 'all') list = list.filter(p => p.category === activeCategory);
    if (activeLevel !== 'all') list = list.filter(p => p.level === activeLevel);
    return list;
  }, [query, activeCategory, activeLevel]);

  const grouped = useMemo(() => groupPatternsByCategory(filtered), [filtered]);
  const total = filtered.length;

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
      {/* Top bar */}
      <div className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(184,146,42,0.15)', background: 'var(--bg-page)' }}>
        <Link href="/knowledge" style={{ fontSize: '14px', color: 'var(--ac-text)', letterSpacing: '0.3em', textDecoration: 'none' }}>
          ← 知识库
        </Link>
        <div style={{ fontSize: '14px', color: 'var(--tx-3)', letterSpacing: '0.2em' }}>
          紫微斗数格局词典
        </div>
        <Link href="/library" style={{ fontSize: '14px', color: 'var(--ac-text)', letterSpacing: '0.2em', textDecoration: 'none' }}>
          古籍 →
        </Link>
      </div>

      {/* Hero */}
      <section className="text-center px-6 py-12">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div style={{ height: '1px', width: '48px', background: 'linear-gradient(to right, transparent, rgba(184,146,42,0.4))' }} />
          <span style={{ fontSize: '13px', color: 'var(--ac-text)', letterSpacing: '0.4em' }}>PATTERN LIBRARY</span>
          <div style={{ height: '1px', width: '48px', background: 'linear-gradient(to left, transparent, rgba(184,146,42,0.4))' }} />
        </div>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, color: 'var(--tx-0)', letterSpacing: '0.15em', marginBottom: '10px' }}>
          紫微格局词典
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--tx-2)', letterSpacing: '0.06em', maxWidth: 660, margin: '0 auto', lineHeight: 1.7 }}>
          收录 <strong style={{ color: 'var(--ac-text)' }}>{PATTERN_CATALOG.length}</strong> 条经典格局，分上/中/助力/基础/凶 五大类<br />
          每条注明触发条件、影响、吉凶出处；含倪师《天纪》立场
        </p>
      </section>

      {/* Filters */}
      <section className="max-w-5xl mx-auto px-6 pb-6">
        <div className="grid gap-3 sm:grid-cols-3 mb-4">
          {/* Search */}
          <div className="sm:col-span-1">
            <label style={{ fontSize: '13px', color: 'var(--tx-3)', letterSpacing: '0.2em', display: 'block', marginBottom: 4 }}>
              关键词检索
            </label>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="格局名 / 标签 / 释义关键字"
              style={{
                width: '100%',
                background: 'var(--bg-card)',
                color: 'var(--tx-0)',
                border: '1px solid rgba(184,146,42,0.3)',
                borderRadius: 8,
                padding: '8px 12px',
                fontSize: 14,
                outline: 'none',
              }}
            />
          </div>

          {/* Category filter */}
          <div>
            <label style={{ fontSize: '13px', color: 'var(--tx-3)', letterSpacing: '0.2em', display: 'block', marginBottom: 4 }}>
              分类
            </label>
            <div className="flex flex-wrap gap-1">
              <PillBtn active={activeCategory === 'all'} onClick={() => setActiveCategory('all')}>
                全部
              </PillBtn>
              {PATTERN_CATEGORIES.map(c => (
                <PillBtn key={c} active={activeCategory === c} onClick={() => setActiveCategory(c)}>
                  {c}
                </PillBtn>
              ))}
            </div>
          </div>

          {/* Level filter */}
          <div>
            <label style={{ fontSize: '13px', color: 'var(--tx-3)', letterSpacing: '0.2em', display: 'block', marginBottom: 4 }}>
              吉凶
            </label>
            <div className="flex flex-wrap gap-1">
              <PillBtn active={activeLevel === 'all'} onClick={() => setActiveLevel('all')}>
                全部
              </PillBtn>
              {PATTERN_LEVELS.map(l => (
                <PillBtn key={l} active={activeLevel === l} onClick={() => setActiveLevel(l)}>
                  {LEVEL_LABEL[l]}
                </PillBtn>
              ))}
            </div>
          </div>
        </div>

        {/* count */}
        <div style={{ fontSize: '13px', color: 'var(--tx-3)', letterSpacing: '0.2em' }}>
          命中 <span style={{ color: 'var(--ac-text)', fontWeight: 600 }}>{total}</span> / {PATTERN_CATALOG.length} 条
        </div>
      </section>

      {/* Cards grouped */}
      <section className="max-w-5xl mx-auto px-6 pb-20 space-y-10">
        {total === 0 && (
          <div className="text-center py-20" style={{ fontSize: 16, color: 'var(--tx-3)' }}>
            未匹配到任何格局 — 试试其他关键词或分类。
          </div>
        )}

        {PATTERN_CATEGORIES.map(cat => {
          const list = grouped[cat];
          if (!list || list.length === 0) return null;
          return (
            <div key={cat}>
              <div className="flex items-baseline gap-3 mb-4">
                <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--tx-0)', letterSpacing: '0.1em' }}>
                  {CATEGORY_LABEL[cat]}
                </h2>
                <span style={{ fontSize: '13px', color: 'var(--tx-3)', letterSpacing: '0.15em' }}>
                  共 {list.length} 条
                </span>
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, rgba(184,146,42,0.35), transparent)' }} />
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {list.map(p => <PatternCard key={p.id} p={p} />)}
              </div>
            </div>
          );
        })}
      <SiteFooter />
      </section>
    </div>
  );
}

function PillBtn({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontSize: 12,
        padding: '4px 10px',
        borderRadius: 999,
        border: `1px solid ${active ? 'rgba(184,146,42,0.6)' : 'rgba(184,146,42,0.18)'}`,
        background: active ? 'rgba(184,146,42,0.12)' : 'transparent',
        color: active ? 'var(--ac-text)' : 'var(--tx-2)',
        cursor: 'pointer',
        letterSpacing: '0.1em',
      }}
    >
      {children}
    </button>
  );
}

function PatternCard({ p }: { p: PatternEntry }) {
  return (
    <Link
      href={`/knowledge/pattern/${p.id}`}
      style={{
        display: 'block',
        background: 'var(--bg-card)',
        border: '1px solid rgba(184,146,42,0.18)',
        borderRadius: 10,
        padding: '14px 16px',
        textDecoration: 'none',
        transition: 'all 0.2s',
      }}
      className="hover:border-amber-400 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--tx-0)', letterSpacing: '0.1em' }}>
          {p.name}
        </div>
        <div
          style={{
            fontSize: 11,
            padding: '2px 6px',
            borderRadius: 4,
            border: `1px solid ${LEVEL_COLOR[p.level]}55`,
            color: LEVEL_COLOR[p.level],
            background: `${LEVEL_COLOR[p.level]}15`,
            letterSpacing: '0.1em',
            whiteSpace: 'nowrap',
          }}
        >
          {LEVEL_LABEL[p.level]}
        </div>
      </div>
      <div style={{ fontSize: 14, color: 'var(--tx-2)', lineHeight: 1.65, marginBottom: 8 }}>
        {p.summary}
      </div>
      <div className="flex flex-wrap gap-1">
        {p.tags.slice(0, 4).map(t => (
          <span key={t} style={{
            fontSize: 11,
            padding: '2px 6px',
            borderRadius: 4,
            border: '1px solid rgba(184,146,42,0.18)',
            color: 'var(--tx-3)',
            letterSpacing: '0.1em',
          }}>{t}</span>
        ))}
      </div>
      <div style={{ fontSize: 12, color: 'var(--tx-3)', letterSpacing: '0.08em', marginTop: 8, fontStyle: 'italic' }}>
        {p.source}
      </div>
    </Link>
  );
}
