/**
 * /knowledge/pattern/[id] — 单格局详情
 * 触发条件 / 完整释义 / 涉及宫位 / 古籍出处 / 关联命宫检测
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  PATTERN_CATALOG,
  findPattern,
  LEVEL_LABEL,
  LEVEL_COLOR,
  CATEGORY_LABEL,
} from '@/lib/ziwei/pattern-catalog';
import SiteFooter from '@/components/SiteFooter';

export async function generateStaticParams() {
  return PATTERN_CATALOG.map(p => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = findPattern(id);
  if (!p) return { title: '格局 · 紫微斗数词典' };
  return {
    title: `${p.name} · ${LEVEL_LABEL[p.level]} · 紫微斗数格局词典`,
    description: p.summary,
    keywords: ['紫微斗数', p.name, ...p.tags, p.source],
  };
}

export default async function PatternDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pattern = findPattern(id);
  if (!pattern) notFound();

  // 同分类邻居
  const sameCategory = PATTERN_CATALOG
    .filter(p => p.category === pattern.category && p.id !== pattern.id)
    .slice(0, 6);

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
      {/* Top bar */}
      <div className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(184,146,42,0.15)', background: 'var(--bg-page)' }}>
        <Link href="/knowledge/pattern" style={{ fontSize: '14px', color: 'var(--ac-text)', letterSpacing: '0.3em', textDecoration: 'none' }}>
          ← 全部格局
        </Link>
        <div style={{ fontSize: '14px', color: 'var(--tx-3)', letterSpacing: '0.2em' }}>
          {pattern.category}
        </div>
        <Link href="/chart" style={{ fontSize: '14px', color: 'var(--ac-text)', letterSpacing: '0.2em', textDecoration: 'none' }}>
          起盘 →
        </Link>
      </div>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 py-10 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span style={{
            fontSize: 12,
            padding: '2px 8px',
            borderRadius: 999,
            border: `1px solid ${LEVEL_COLOR[pattern.level]}55`,
            color: LEVEL_COLOR[pattern.level],
            background: `${LEVEL_COLOR[pattern.level]}15`,
            letterSpacing: '0.15em',
          }}>{LEVEL_LABEL[pattern.level]}</span>
          <span style={{
            fontSize: 12,
            padding: '2px 8px',
            borderRadius: 999,
            border: '1px solid rgba(184,146,42,0.25)',
            color: 'var(--tx-3)',
            letterSpacing: '0.15em',
          }}>{CATEGORY_LABEL[pattern.category]}</span>
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 700, color: 'var(--tx-0)', letterSpacing: '0.15em', marginBottom: 8 }}>
          {pattern.name}
        </h1>
        <p style={{ fontSize: 16, color: 'var(--tx-2)', lineHeight: 1.7, maxWidth: 600, margin: '0 auto' }}>
          {pattern.summary}
        </p>
      </section>

      {/* 内容卡片 */}
      <section className="max-w-3xl mx-auto px-6 pb-10 space-y-4">
        {/* 触发条件 */}
        <Block title="触发条件" icon="⚙">
          <p style={{ fontSize: 15, color: 'var(--tx-1)', lineHeight: 1.8 }}>{pattern.condition}</p>
          {pattern.palaces && pattern.palaces.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {pattern.palaces.map(p => (
                <span key={p} style={{
                  fontSize: 12,
                  padding: '3px 8px',
                  borderRadius: 6,
                  border: '1px solid rgba(184,146,42,0.3)',
                  color: 'var(--ac-text)',
                  background: 'rgba(184,146,42,0.06)',
                  letterSpacing: '0.1em',
                }}>{p}</span>
              ))}
            </div>
          )}
        </Block>

        {/* 完整释义 */}
        <Block title="格局释义" icon="📜">
          <p style={{ fontSize: 15, color: 'var(--tx-1)', lineHeight: 1.85 }}>
            {pattern.description}
          </p>
        </Block>

        {/* 古籍出处 */}
        <Block title="古籍出处" icon="📖">
          <p style={{ fontSize: 15, color: 'var(--tx-1)', lineHeight: 1.8, fontStyle: 'italic' }}>
            {pattern.source}
          </p>
        </Block>

        {/* 关键标签 */}
        <Block title="关键词标签" icon="🏷">
          <div className="flex flex-wrap gap-2">
            {pattern.tags.map(t => (
              <span key={t} style={{
                fontSize: 13,
                padding: '3px 10px',
                borderRadius: 999,
                border: '1px solid rgba(184,146,42,0.25)',
                color: 'var(--tx-2)',
                letterSpacing: '0.1em',
              }}>{t}</span>
            ))}
          </div>
        </Block>

        {/* 操作提示 */}
        <div className="grid sm:grid-cols-2 gap-3 pt-4">
          <ActionLink
            href="/chart"
            title="在命盘中识别"
            desc="起盘后系统将自动检测本格局是否在本盘触发。"
          />
          <ActionLink
            href="/knowledge"
            title="返回知识库"
            desc="查看 14 主星 × 13 宫位的完整论断。"
          />
        </div>
      </section>

      {/* 同类邻居 */}
      {sameCategory.length > 0 && (
        <section className="max-w-3xl mx-auto px-6 pb-20">
          <div className="flex items-baseline gap-3 mb-3">
            <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--tx-0)', letterSpacing: '0.15em' }}>
              同类格局
            </h2>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, rgba(184,146,42,0.35), transparent)' }} />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sameCategory.map(p => (
              <Link
                key={p.id}
                href={`/knowledge/pattern/${p.id}`}
                style={{
                  display: 'block',
                  background: 'var(--bg-card)',
                  border: '1px solid rgba(184,146,42,0.18)',
                  borderRadius: 10,
                  padding: '12px 14px',
                  textDecoration: 'none',
                }}
                className="hover:border-amber-400"
              >
                <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--tx-0)', marginBottom: 4 }}>{p.name}</div>
                <div style={{ fontSize: 13, color: 'var(--tx-2)', lineHeight: 1.5 }}>{p.summary}</div>
              </Link>
            ))}
          </div>
      <SiteFooter />
        </section>
      )}
    </div>
  );
}

function Block({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid rgba(184,146,42,0.18)',
      borderRadius: 12,
      padding: '16px 20px',
    }}>
      <div className="flex items-center gap-2 mb-2">
        <span style={{ fontSize: 16 }}>{icon}</span>
        <span style={{ fontSize: 13, color: 'var(--tx-3)', letterSpacing: '0.25em' }}>{title.toUpperCase()}</span>
      </div>
      {children}
    </div>
  );
}

function ActionLink({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link
      href={href}
      style={{
        display: 'block',
        background: 'var(--bg-card)',
        border: '1px solid rgba(184,146,42,0.25)',
        borderRadius: 10,
        padding: '14px 18px',
        textDecoration: 'none',
        transition: 'all 0.2s',
      }}
      className="hover:border-amber-400 hover:shadow-sm"
    >
      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ac-text)', letterSpacing: '0.15em', marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 13, color: 'var(--tx-2)', lineHeight: 1.6 }}>{desc}</div>
    </Link>
  );
}
