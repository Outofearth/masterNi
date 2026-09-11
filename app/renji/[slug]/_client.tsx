'use client';

import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import { useTianjiColors } from '../../tianji/_colors';
import { RENJI_MODULES, ACU_EXPERIENCES, TRANS_NEEDLING, HANTANG_FORMULAS, CLASSIC_FORMULAS } from '@/lib/nihai/renji';
import TianjiFadeIn from '../../tianji/TianjiFadeIn';
import SymptomSearch from '@/components/renji/SymptomSearch';
import StatusBadge from '@/components/StatusBadge';
import SiteFooter from '@/components/SiteFooter';

/**
 * /renji/[slug] 人纪子模块详情
 *
 * 5 个 slug：zhenjiu / neijing / bencao / shanghan / jingui
 * 按 slug 自动挂接关联数据集：
 * - zhenjiu → ACU_EXPERIENCES + TRANS_NEEDLING（条数取实际长度，不硬编码）
 * - shanghan → HANTANG_FORMULAS
 * - jingui → CLASSIC_FORMULAS
 * - neijing / bencao → 留章节为主
 */
export default function RenjiDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const module = RENJI_MODULES.find(m => m.slug === slug);
  if (!module) notFound();

  const { theme } = useTheme();
  const c = useTianjiColors(theme);

  // 数据集关联
  const relatedData: { label: string; total: number; samples: { key: string; val: string }[] }[] = [];
  if (slug === 'zhenjiu') {
    relatedData.push({
      label: '针灸经验（症状→穴位）',
      total: ACU_EXPERIENCES.length,
      samples: ACU_EXPERIENCES.slice(0, 4).map(a => ({
        key: a.condition,
        val: a.acupoints,
      })),
    });
    relatedData.push({
      label: '阴阳九针',
      total: TRANS_NEEDLING.length,
      samples: TRANS_NEEDLING.slice(0, 3).map(t => ({
        key: t.combo,
        val: t.indication,
      })),
    });
  } else if (slug === 'shanghan') {
    relatedData.push({
      label: '汉唐方剂',
      total: HANTANG_FORMULAS.length,
      samples: HANTANG_FORMULAS.slice(0, 4).map(f => ({
        key: f.name,
        val: `${f.indication} · ${f.ingredients ?? ''}`,
      })),
    });
  } else if (slug === 'jingui') {
    relatedData.push({
      label: '经方（伤寒金匮）',
      total: CLASSIC_FORMULAS.length,
      samples: CLASSIC_FORMULAS.slice(0, 4).map(f => ({
        key: f.name,
        val: `${f.composition} · ${f.indication}`,
      })),
    });
  }

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
                border: `1px solid var(--cat-renji)`,
                color: 'var(--cat-renji)',
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
                {module.lessons && (
                  <span
                    className="text-[12px] tracking-widest px-2 py-0.5 rounded"
                    style={{
                      background: c.featureBg,
                      border: `1px solid ${c.featureBord}`,
                      color: 'var(--cat-renji)',
                    }}
                  >
                    {module.lessons}
                  </span>
                )}
                <span
                  className="text-[12px] tracking-widest px-2 py-0.5 rounded"
                  style={{
                    background: c.featureBg,
                    border: `1px solid ${c.featureBord}`,
                    color: module.status === 'active' ? 'var(--cat-renji)' : c.textFaint,
                  }}
                >
                  <StatusBadge status={module.status} />
                </span>
              </div>
            </div>
          </div>
        </TianjiFadeIn>
      </section>

      {/* 模块详解 */}
      <section className="max-w-4xl mx-auto px-4 pb-8">
        <TianjiFadeIn delay={0.05}>
          <div className="rounded-xl p-6" style={{ background: c.cardBg, border: `1px solid ${c.featureBord}` }}>
            <div className="text-[12px] tracking-[0.3em] mb-3" style={{ color: c.tagText }}>
              模块详解
            </div>
            <ul className="space-y-2">
              {module.details.map((d, i) => (
                <li key={i} className="text-[13px] flex gap-2 leading-relaxed" style={{ color: c.textSecond }}>
                  <span className="shrink-0" style={{ color: 'var(--cat-renji)' }}>·</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </TianjiFadeIn>
      </section>

      {/* 针灸模块：症状 → 穴位 全量检索 */}
      {slug === 'zhenjiu' && (
        <section className="max-w-4xl mx-auto px-4 pb-8">
          <TianjiFadeIn delay={0.06}>
            <SymptomSearch pageSize={6} />
          </TianjiFadeIn>
        </section>
      )}

      {/* 关联数据集 */}
      {relatedData.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 pb-8">
          <TianjiFadeIn delay={0.08}>
            <div className="mb-4">
              <div className="text-[12px] tracking-[0.3em] mb-2" style={{ color: 'var(--cat-renji)' }}>
                关联数据集
              </div>
              <h3 className="text-xl font-serif tracking-wider" style={{ color: c.textPrimary }}>
                配套倪师临床资料
              </h3>
            </div>
            <div className="space-y-3">
              {relatedData.map((d, i) => (
                <div
                  key={i}
                  className="rounded-xl p-5"
                  style={{ background: c.featureBg, border: `1px solid ${c.featureBord}` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-serif" style={{ color: c.textPrimary }}>
                      {d.label}
                    </span>
                    <span
                      className="text-[12px] tracking-widest px-2 py-0.5 rounded"
                      style={{
                        background: c.cardBg,
                        border: `1px solid ${c.featureBord}`,
                        color: 'var(--cat-renji)',
                      }}
                    >
                      {d.total} 条
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    {d.samples.map((s, j) => (
                      <li key={j} className="text-[13px] leading-relaxed" style={{ color: c.textSecond }}>
                        <span className="font-serif" style={{ color: c.goldSolid }}>{s.key}</span>
                        <span style={{ color: c.textFaint }}> · </span>
                        <span>{s.val}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </TianjiFadeIn>
        </section>
      )}

      {/* 关键词 */}
      {module.keywords.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 pb-8">
          <TianjiFadeIn delay={0.1}>
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
      {module.chapters.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 pb-12">
          <TianjiFadeIn delay={0.12}>
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
                        border: `1px solid var(--cat-renji)`,
                        color: 'var(--cat-renji)',
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
                              <span className="shrink-0" style={{ color: 'var(--cat-renji)' }}>·</span>
                              <span>{kp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </details>
              </TianjiFadeIn>
            ))}
          </div>
        </section>
      )}

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

      <footer className="max-w-4xl mx-auto px-4 pb-10 pt-6" style={{ borderTop: `1px solid ${c.featureBord}` }}>
        <Link href="/renji" className="inline-block text-[13px] tracking-wider hover:underline" style={{ color: 'var(--cat-renji)' }}>
          ← 返回人纪总览
        </Link>
              <SiteFooter compact as="div" />
      </footer>
    </main>
  );
}