'use client';

import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import { useTianjiColors } from '../../tianji/_colors';
import { DIJI_MODULES } from '@/lib/nihai/diji';
import TianjiFadeIn from '../../tianji/TianjiFadeIn';
import StatusBadge from '@/components/StatusBadge';
import SiteFooter from '@/components/SiteFooter';

/**
 * /diji/[slug] 地纪子模块详情
 */
export default function DijiDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const module = DIJI_MODULES.find(m => m.slug === slug);
  if (!module) notFound();

  const { theme } = useTheme();
  const c = useTianjiColors(theme);

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 pt-12 pb-8">
        <TianjiFadeIn>
          <div className="flex items-start gap-5 mb-6">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl shrink-0"
              style={{
                background: c.featureBg,
                border: `1px solid ${c.goldLine}`,
                color: c.goldSolid,
                fontFamily: 'var(--font-serif)',
              }}
            >
              {module.icon}
            </div>
            <div className="flex-1">
              <div className="text-[12px] tracking-[0.3em] mb-2" style={{ color: c.tagText }}>
                {module.subtitle}
              </div>
              <h1 className="grad-text text-3xl font-bold tracking-wider mb-2">
                {module.name}
              </h1>
              <p className="text-sm leading-relaxed" style={{ color: c.textSecond }}>
                {module.description}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span
                  className="text-[12px] tracking-widest px-2 py-0.5 rounded"
                  style={{
                    background: c.featureBg,
                    border: `1px solid ${c.featureBord}`,
                    color: c.textMuted,
                  }}
                >
                  {module.nameEn}
                </span>
                {module.school && (
                  <span
                    className="text-[12px] tracking-widest px-2 py-0.5 rounded"
                    style={{
                      background: c.featureBg,
                      border: `1px solid ${c.featureBord}`,
                      color: c.goldSolid,
                    }}
                  >
                    {module.school}
                  </span>
                )}
                <span
                  className="text-[12px] tracking-widest px-2 py-0.5 rounded"
                  style={{
                    background: c.featureBg,
                    border: `1px solid ${c.featureBord}`,
                    color: module.status === 'active' ? c.goldSolid : c.textFaint,
                  }}
                >
                  <StatusBadge status={module.status} />
                </span>
              </div>
            </div>
          </div>
        </TianjiFadeIn>
      </section>

      {/* 详细说明 */}
      <section className="max-w-4xl mx-auto px-4 pb-8">
        <TianjiFadeIn delay={0.05}>
          <div className="rounded-xl p-6" style={{ background: c.cardBg, border: `1px solid ${c.featureBord}` }}>
            <div className="text-[12px] tracking-[0.3em] mb-3" style={{ color: c.tagText }}>
              模块详解
            </div>
            <ul className="space-y-2">
              {module.details.map((d, i) => (
                <li key={i} className="text-[13px] flex gap-2 leading-relaxed" style={{ color: c.textSecond }}>
                  <span className="shrink-0" style={{ color: c.goldSolid }}>·</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </TianjiFadeIn>
      </section>

      {/* 关键词 */}
      {module.keywords.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 pb-8">
          <TianjiFadeIn delay={0.08}>
            <div className="flex flex-wrap gap-2">
              {module.keywords.map((kw, i) => (
                <span
                  key={i}
                  className="text-[12px] tracking-widest px-2 py-1 rounded-full"
                  style={{
                    background: c.featureBg,
                    border: `1px solid ${c.featureBord}`,
                    color: c.textMuted,
                  }}
                >
                  #{kw}
                </span>
              ))}
            </div>
          </TianjiFadeIn>
        </section>
      )}

      {/* 章节 */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <TianjiFadeIn delay={0.1}>
          <div className="mb-6">
            <div className="text-[12px] tracking-[0.3em] mb-2" style={{ color: c.tagText }}>
              章节目录
            </div>
            <h3 className="text-2xl font-serif tracking-wider" style={{ color: c.textPrimary }}>
              本模块共 {module.chapters.length} 章
            </h3>
          </div>
        </TianjiFadeIn>

        <div className="space-y-3">
          {module.chapters.map((ch, i) => (
            <TianjiFadeIn key={ch.id} delay={0.05 * (i + 1)}>
              <details
                className="rounded-xl overflow-hidden group"
                style={{ background: c.featureBg, border: `1px solid ${c.featureBord}` }}
              >
                <summary
                  className="cursor-pointer px-5 py-4 flex items-center gap-3 list-none"
                  style={{ listStyle: 'none' }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[13px] font-serif shrink-0"
                    style={{
                      background: c.cardBg,
                      border: `1px solid ${c.goldLine}`,
                      color: c.goldSolid,
                    }}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-[12px] tracking-[0.2em] mb-0.5" style={{ color: c.tagText }}>
                      {ch.subtitle}
                    </div>
                    <div className="text-sm font-serif" style={{ color: c.textPrimary }}>
                      {ch.title}
                    </div>
                  </div>
                  <span
                    className="text-[12px] transition-transform group-open:rotate-90"
                    style={{ color: c.textFaint }}
                  >
                    ▶
                  </span>
                </summary>
                <div
                  className="px-5 pb-5 pt-2 space-y-3"
                  style={{ borderTop: `1px solid ${c.featureBord}` }}
                >
                  <p className="text-[13px] leading-relaxed" style={{ color: c.textSecond }}>
                    {ch.description}
                  </p>
                  {ch.keyPoints.length > 0 && (
                    <div>
                      <div className="text-[12px] tracking-[0.15em] mb-2" style={{ color: c.tagText }}>
                        要点
                      </div>
                      <ul className="space-y-1.5">
                        {ch.keyPoints.map((kp, j) => (
                          <li key={j} className="text-[13px] flex gap-2 leading-relaxed" style={{ color: c.textSecond }}>
                            <span className="shrink-0" style={{ color: c.goldSolid }}>·</span>
                            <span>{kp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {ch.quotes && ch.quotes.length > 0 && (
                    <div
                      className="rounded-lg px-4 py-3"
                      style={{
                        background: c.cardBg,
                        border: `1px solid ${c.featureBord}`,
                      }}
                    >
                      <div className="text-[12px] tracking-[0.2em] mb-2" style={{ color: c.goldSolid }}>
                        倪师原话
                      </div>
                      {ch.quotes.map((q, k) => (
                        <p
                          key={k}
                          className="text-[13px] font-serif leading-relaxed"
                          style={{ color: c.textPrimary }}
                        >
                          「{q}」
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </details>
            </TianjiFadeIn>
          ))}
        </div>
      </section>

      {/* 参考 */}
      {module.references.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 pb-8">
          <TianjiFadeIn delay={0.2}>
            <div className="text-[12px] tracking-[0.3em] mb-3" style={{ color: c.tagText }}>
              参考资料
            </div>
            <ul className="space-y-1">
              {module.references.map((r, i) => (
                <li key={i} className="text-[13px]" style={{ color: c.textSecond }}>
                  · {r}
                </li>
              ))}
            </ul>
          </TianjiFadeIn>
        </section>
      )}

      {/* 返回 */}
      <footer className="max-w-4xl mx-auto px-4 pb-10 pt-6" style={{ borderTop: `1px solid ${c.featureBord}` }}>
        <Link href="/diji" className="inline-block text-[13px] tracking-wider hover:underline" style={{ color: c.goldSolid }}>
          ← 返回地纪总览
        </Link>
              <SiteFooter compact as="div" />
      </footer>
    </main>
  );
}