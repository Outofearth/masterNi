/**
 * /knowledge — 知识库主页
 *
 * 列出 14 主星，每星可检索其在古籍中的全部出处。
 *
 * 注意：/knowledge/[star]/[topic] 详情页所依赖的论断内容库 STAR_DB
 * 被上游（原作者）有意置空，当前生成 0 条静态路由（全量 404）。
 * 因此本页链接统一指向确定有内容的「古籍关键词反查页」/library/keyword/{星名}。
 * 待 STAR_DB 补齐后，可再把链接切回知识库详情页。
 */

import Link from 'next/link';
import { ALL_STARS, STAR_BRIEF_SEO } from '@/lib/seo/knowledge';

export const metadata = {
  title: '紫微斗数知识库 · 十四主星 · 倪海夏正宗体系',
  description: '基于倪海夏《天纪》体系与古籍《紫微斗数全集》《骨髓赋》编纂的紫微斗数知识库。逐星检索十四主星在古籍原文中的全部出处。',
  keywords: ['紫微斗数', '倪海夏', '倪海厦紫微斗数', '紫微斗数全集', '紫微斗数全书', '14 主星', '12 宫位'],
};

const CHIP_STYLE = {
  fontSize: '11px',
  padding: '4px 10px',
  background: 'rgba(184,146,42,0.06)',
  border: '1px solid rgba(184,146,42,0.15)',
  borderRadius: '999px',
  color: 'var(--tx-2)',
  textDecoration: 'none',
} as const;

export default function KnowledgeHomePage() {
  const STAR_DESCRIPTIONS_QUICK = STAR_BRIEF_SEO;

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
      {/* 顶栏 */}
      <div className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(184,146,42,0.15)', background: 'var(--bg-page)' }}>
        <Link href="/" style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.3em', textDecoration: 'none' }}>
          ← 首页
        </Link>
        <div style={{ fontSize: '12px', color: 'var(--tx-3)', letterSpacing: '0.2em' }}>
          倪师方法论 · 知识库
        </div>
        <Link href="/library" style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.2em', textDecoration: 'none' }}>
          古籍 →
        </Link>
      </div>

      {/* Hero */}
      <div className="text-center px-6 py-14">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div style={{ height: '1px', width: '48px', background: 'linear-gradient(to right, transparent, rgba(184,146,42,0.4))' }} />
          <span style={{ fontSize: '11px', color: 'var(--ac)', letterSpacing: '0.4em' }}>KNOWLEDGE BASE</span>
          <div style={{ height: '1px', width: '48px', background: 'linear-gradient(to left, transparent, rgba(184,146,42,0.4))' }} />
        </div>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, color: 'var(--tx-0)', letterSpacing: '0.15em', marginBottom: '12px' }}>
          紫微斗数知识库
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--tx-2)', letterSpacing: '0.08em', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
          十四主星 · 逐星检索古籍原文与全部出处<br />
          基于倪海夏《天纪》体系整理 · 内容持续补充中
        </p>
      </div>

      {/* 14 主星卡片 */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        <div style={{ fontSize: '11px', color: 'var(--tx-3)', letterSpacing: '0.3em', textAlign: 'center', marginBottom: '24px' }}>
          十四主星
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {ALL_STARS.map(star => (
            <Link
              key={star}
              href={`/library/keyword/${encodeURIComponent(star)}`}
              title={`查${star}星在古籍中的全部出处`}
              style={{
                display: 'block',
                padding: '14px 10px',
                background: 'var(--bg-card)',
                border: '1px solid rgba(184,146,42,0.2)',
                borderRadius: '10px',
                textDecoration: 'none',
                textAlign: 'center',
                transition: 'all 0.2s',
              }}
              className="hover:shadow-md hover:border-amber-400"
            >
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--tx-0)', letterSpacing: '0.15em' }}>
                {star}
              </div>
            </Link>
          ))}
        </div>

        {/* 详细列表（每个主星 + 简介 + 古籍入口） */}
        <div className="mt-14 space-y-4">
          {ALL_STARS.map(star => (
            <div key={star} style={{
              background: 'var(--bg-card)',
              border: '1px solid rgba(184,146,42,0.18)',
              borderRadius: '12px',
              padding: '18px 22px',
            }}>
              <div className="flex items-baseline gap-3 mb-2">
                <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--tx-0)', letterSpacing: '0.1em' }}>
                  {star}星
                </span>
                <span style={{ fontSize: '11px', color: 'var(--tx-3)', letterSpacing: '0.15em' }}>
                  ZI WEI · 14 STARS
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--tx-2)', lineHeight: 1.7, marginBottom: '12px' }}>
                {STAR_DESCRIPTIONS_QUICK[star] || ''}
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/library/keyword/${encodeURIComponent(star)}`}
                  style={CHIP_STYLE}
                  aria-label={`查${star}星在古籍中的全部出处`}
                >
                  📜 {star} · 古籍出处 →
                </Link>
                <Link
                  href={`/library/search?q=${encodeURIComponent(star)}`}
                  style={CHIP_STYLE}
                  aria-label={`在古籍库中全文检索${star}星`}
                >
                  全文检索「{star}」→
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
