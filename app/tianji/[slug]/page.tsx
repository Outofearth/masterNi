'use client';
import Link from 'next/link';
import { redirect, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTheme } from '@/components/ThemeProvider';
import { TIANJI_MODULES } from '@/lib/nihai';
import {
  useTianjiColors,
  useSyncBodyBackground,
} from '../_colors';
import TianjiFadeIn from '../TianjiFadeIn';

/**
 * 天纪子模块详情页
 *
 * /tianji/[slug]
 *
 * 支持的 slug：
 *   - ziwei, kanyu, tuiming, mianxiang, cezi
 *   - yijing 会 redirect 到 /tianji/yijing（专属 64 卦浏览页更合适）
 *
 * 渲染内容：
 *   - Hero（图标 + 中文名 + 副标题 + 学派）
 *   - 描述 + 详细介绍多段
 *   - 章节列表（按 order 排序）
 *   - 关键词 + 参考书目
 */

export default function ModuleDetailPage() {
  const params = useParams<{ slug: string }>();
  const { theme } = useTheme();
  const c = useTianjiColors(theme);
  useSyncBodyBackground(c.bgBase);

  const slug = params.slug;

  // yijing 路由优先（已有专属 64 卦页）
  if (slug === 'yijing') {
    redirect('/tianji/yijing');
  }

  const mod = TIANJI_MODULES.find(m => m.slug === slug);
  if (!mod) {
    return (
      <div className="px-6 py-32 text-center" style={{ color: c.textMuted }}>
        <p className="mb-4">未找到此模块（slug = {slug}）</p>
        <Link href="/tianji" className="text-sm tracking-wider"
          style={{ color: c.goldSolid }}>
          ← 返回天纪首页
        </Link>
      </div>
    );
  }

  const sortedChapters = [...mod.chapters].sort((a, b) => a.order - b.order);

  return (
    <div style={{ background: c.bgBase, transition: 'background 0.35s ease' }} className="overflow-x-hidden">

      {/* ══ HERO ══════════════════════════════════════ */}
      <section className="relative px-6 pt-12 pb-12 lg:pt-16 lg:pb-16">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full"
            style={{ background: `radial-gradient(ellipse, ${c.glowTint} 0%, transparent 70%)` }} />
        </div>

        <div className="relative mx-auto" style={{ maxWidth: '960px' }}>
          <TianjiFadeIn>
            <div className="flex items-center justify-center gap-2 mb-6">
              <Link href="/tianji"
                className="text-[10px] tracking-[0.25em] inline-flex items-center gap-1"
                style={{ color: c.tagText }}>
                ← 天纪
              </Link>
              <span style={{ color: c.textFaint }}>·</span>
              <span className="text-[10px] tracking-[0.25em]" style={{ color: c.tagText }}>
                {mod.nameEn}
              </span>
            </div>
          </TianjiFadeIn>

          <TianjiFadeIn delay={0.1}>
            <div className="flex items-center justify-center mb-4">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
                style={{
                  background: c.cardBg,
                  border: `1px solid ${c.goldLine}`,
                  color: c.goldSolid,
                  boxShadow: c.featureShadow,
                }}>
                {mod.icon}
              </div>
            </div>
          </TianjiFadeIn>

          <TianjiFadeIn delay={0.2}>
            <h1 className="grad-text font-bold leading-none text-center mb-3 tracking-tight"
              style={{
                fontSize: 'clamp(48px, 8vw, 96px)',
                letterSpacing: '0.07em',
                fontFamily: 'var(--font-serif)',
              }}>
              {mod.name}
            </h1>
          </TianjiFadeIn>

          <TianjiFadeIn delay={0.3}>
            <p className="text-base md:text-lg tracking-[0.15em] mb-2 text-center"
              style={{ color: c.textSecond, fontWeight: 500 }}>
              {mod.subtitle}
            </p>
          </TianjiFadeIn>

          {mod.school && (
            <TianjiFadeIn delay={0.4}>
              <p className="text-xs tracking-[0.2em] text-center mb-6"
                style={{ color: c.goldSolid }}>
                ◇ {mod.school}
                {mod.lessons && (
                  <span style={{ color: c.textMuted }}> · {mod.lessons}</span>
                )}
              </p>
            </TianjiFadeIn>
          )}

          <TianjiFadeIn delay={0.5}>
            <p className="text-sm max-w-2xl mx-auto leading-relaxed text-center"
              style={{ color: c.textMuted }}>
              {mod.description}
            </p>
          </TianjiFadeIn>
        </div>
      </section>

      {/* ══ 详细介绍多段 ══════════════════════════════════════ */}
      {mod.details.length > 0 && (
        <section className="relative px-6 py-10" style={{ background: c.bgAlt }}>
          <div className="mx-auto" style={{ maxWidth: '960px' }}>
            <TianjiFadeIn>
              <div className="rounded-2xl p-6 lg:p-10 space-y-5"
                style={{
                  background: c.cardBg,
                  border: `1px solid ${c.cardBorder}`,
                  boxShadow: c.featureShadow,
                }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-px w-6" style={{ background: c.goldLine }} />
                  <span className="text-[10px] tracking-[0.4em] uppercase" style={{ color: c.tagText }}>
                    详细介绍
                  </span>
                </div>
                {mod.details.map((para, i) => (
                  <p key={i} className="text-sm lg:text-base leading-relaxed"
                    style={{ color: c.textSecond, fontFamily: 'var(--font-serif)' }}>
                    {para}
                  </p>
                ))}
                {mod.chapters.find(ch => ch.quotes && ch.quotes.length > 0) && (
                  <div className="pt-5 mt-5"
                    style={{ borderTop: `1px solid ${c.featureBord}` }}>
                    <div className="text-[10px] tracking-[0.25em] uppercase mb-2" style={{ color: c.tagText }}>
                      倪师语录
                    </div>
                    <div className="space-y-2">
                      {mod.chapters
                        .flatMap(ch => ch.quotes ?? [])
                        .slice(0, 3)
                        .map((q, i) => (
                          <p key={i} className="text-sm italic"
                            style={{ color: c.goldSolid, fontFamily: 'var(--font-serif)' }}>
                            「{q}」
                          </p>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </TianjiFadeIn>
          </div>
        </section>
      )}

      {/* ══ 章节列表 ══════════════════════════════════════ */}
      {sortedChapters.length > 0 && (
        <section className="relative px-6 py-12">
          <div className="mx-auto" style={{ maxWidth: '960px' }}>
            <TianjiFadeIn>
              <div className="flex items-center gap-3 mb-6 justify-center">
                <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${c.goldLine})` }} />
                <span className="text-[10px] tracking-[0.4em] uppercase" style={{ color: c.tagText }}>
                  课程章节
                </span>
                <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${c.goldLine})` }} />
              </div>
            </TianjiFadeIn>

            <div className="space-y-3">
              {sortedChapters.map((ch, i) => (
                <TianjiFadeIn key={ch.id} delay={0.05 * (i % 6)}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.1 }}
                    className="rounded-xl p-5 lg:p-6"
                    style={{
                      background: c.featureBg,
                      border: `1px solid ${c.featureBord}`,
                    }}>
                    <div className="flex items-start gap-4">
                      {/* 序号 */}
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-base font-bold tracking-wider"
                        style={{
                          background: c.cardBg,
                          border: `1px solid ${c.goldLine}`,
                          color: c.goldSolid,
                          fontFamily: 'var(--font-serif)',
                        }}>
                        {String(ch.order).padStart(2, '0')}
                      </div>
                      {/* 内容 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                          <h3 className="text-base lg:text-lg font-semibold tracking-[0.05em]"
                            style={{ color: c.textPrimary, fontFamily: 'var(--font-serif)' }}>
                            {ch.title}
                          </h3>
                          {ch.subtitle && (
                            <span className="text-[10px] tracking-wider" style={{ color: c.tagText }}>
                              · {ch.subtitle}
                            </span>
                          )}
                        </div>
                        <p className="text-xs lg:text-sm leading-relaxed mb-3" style={{ color: c.textSecond }}>
                          {ch.description}
                        </p>
                        {ch.keyPoints.length > 0 && (
                          <ul className="space-y-1">
                            {ch.keyPoints.map((kp, j) => (
                              <li key={j} className="text-xs flex items-start gap-1.5"
                                style={{ color: c.textMuted }}>
                                <span style={{ color: c.goldSolid }}>·</span>
                                <span>{kp}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </TianjiFadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ 关键词 + 参考书目 ══════════════════════════════════════ */}
      <section className="relative px-6 py-12" style={{ background: c.bgAlt }}>
        <div className="mx-auto" style={{ maxWidth: '960px' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 关键词 */}
            <TianjiFadeIn>
              <div className="rounded-2xl p-6 h-full"
                style={{
                  background: c.cardBg,
                  border: `1px solid ${c.cardBorder}`,
                }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px w-6" style={{ background: c.goldLine }} />
                  <span className="text-[10px] tracking-[0.4em] uppercase" style={{ color: c.tagText }}>
                    关键词
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {mod.keywords.map(k => (
                    <span key={k}
                      className="text-xs px-3 py-1 rounded-full"
                      style={{
                        color: c.goldSolid,
                        border: `1px solid ${c.goldLine}`,
                        background: 'transparent',
                      }}>
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            </TianjiFadeIn>

            {/* 参考书目 */}
            <TianjiFadeIn delay={0.1}>
              <div className="rounded-2xl p-6 h-full"
                style={{
                  background: c.cardBg,
                  border: `1px solid ${c.cardBorder}`,
                }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px w-6" style={{ background: c.goldLine }} />
                  <span className="text-[10px] tracking-[0.4em] uppercase" style={{ color: c.tagText }}>
                    参考书目
                  </span>
                </div>
                <ul className="space-y-2">
                  {mod.references.map((r, i) => (
                    <li key={i} className="text-sm flex items-center gap-2"
                      style={{ color: c.textSecond }}>
                      <span style={{ color: c.goldSolid }}>·</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TianjiFadeIn>
          </div>
        </div>
      </section>

      {/* ══ 返回导航 ══════════════════════════════════════ */}
      <section className="relative px-6 py-12">
        <div className="mx-auto text-center" style={{ maxWidth: '960px' }}>
          <Link href="/tianji"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs tracking-[0.2em] transition-all duration-200"
            style={{
              border: `1px solid ${c.goldLine}`,
              color: c.goldSolid,
              background: 'transparent',
            }}>
            ← 返回天纪首页
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6" style={{ borderTop: `1px solid ${c.featureBord}` }}>
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-[10px] tracking-wider" style={{ color: c.textFaint }}>
            {mod.name} · 基于倪海夏《天纪》讲义整理 · 仅供学习参考
          </p>
        </div>
      </footer>
    </div>
  );
}