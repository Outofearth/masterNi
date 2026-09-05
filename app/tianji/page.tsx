'use client';
import Link from 'next/link';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/components/ThemeProvider';
import {
  TIANJI_MODULES,
  TIANJI_EPISODES,
  TIANJI_QUOTES,
  TIANJI_STATS,
  HEXAGRAMS,
} from '@/lib/nihai';
import {
  useTianjiColors,
  useSyncBodyBackground,
} from './_colors';
import TianjiFadeIn from './TianjiFadeIn';

/**
 * 天纪总览页
 *
 * 编排顺序：
 *   1. Hero — 主题大字 + 数据条 + 三才定义
 *   2. 6 模块卡片（紫微/易经/堪舆/推命/面相/测字）
 *   3. 24 集 DVD 时间轴（双栏：前半段命学/后半段易经）
 *   4. 易经 64 卦入口卡片（跳转到 /tianji/yijing）
 *   5. 倪师语录精选
 */

export default function TianjiOverviewPage() {
  const { theme } = useTheme();
  const c = useTianjiColors(theme);
  useSyncBodyBackground(c.bgBase);

  // 精选 8 条倪师语录（按主题相关性）
  const featuredQuotes = useMemo(
    () => TIANJI_QUOTES.filter(q =>
        ['紫微斗数', '命学哲理', '堪舆', '易经', '天纪总论'].includes(q.topic)
      ).slice(0, 6),
    []
  );

  return (
    <div style={{ background: c.bgBase, transition: 'background 0.35s ease' }} className="overflow-x-hidden">

      {/* ══ HERO ══════════════════════════════════════ */}
      <section className="relative px-6 pt-12 pb-16 lg:pt-20 lg:pb-24">
        {/* 装饰光晕 */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full"
            style={{ background: `radial-gradient(ellipse, ${c.glowTint} 0%, transparent 70%)` }} />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full"
            style={{ background: `radial-gradient(ellipse, ${c.glowBlue} 0%, transparent 70%)` }} />
        </div>

        <div className="relative mx-auto" style={{ maxWidth: '1280px' }}>
          {/* 标签行 */}
          <TianjiFadeIn>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${c.goldLine})` }} />
              <span className="text-[11px] tracking-[0.45em]" style={{ color: c.tagText }}>
                Tian Ji · 上知天文
              </span>
              <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${c.goldLine})` }} />
            </div>
          </TianjiFadeIn>

          {/* 主标题 */}
          <TianjiFadeIn delay={0.1}>
            <h1
              className="grad-text font-bold leading-none text-center mb-6 tracking-tight"
              style={{
                fontSize: 'clamp(56px, 9vw, 124px)',
                letterSpacing: '0.07em',
              }}
            >
              天纪
            </h1>
          </TianjiFadeIn>

          {/* 副标题 */}
          <TianjiFadeIn delay={0.2}>
            <p className="text-base md:text-lg tracking-[0.18em] mb-3 text-center" style={{ color: c.textSecond, fontWeight: 500 }}>
              紫微斗数 · 易经 · 堪舆 · 推命
            </p>
          </TianjiFadeIn>
          <TianjiFadeIn delay={0.3}>
            <p className="text-sm max-w-2xl mx-auto leading-relaxed mb-10 text-center" style={{ color: c.textMuted }}>
              倪海厦《天纪》24 集课程体系化整理，共 48 小时录像、4 册讲义。
              涵盖紫微斗数、易经 64 卦、风水堪舆、推命面相、测字六大模块。
            </p>
          </TianjiFadeIn>

          {/* 数据条 */}
          <TianjiFadeIn delay={0.4}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mb-12">
              {[
                { value: TIANJI_STATS.videoEpisodes, label: '集 · DVD', sub: '每集 2 小时' },
                { value: TIANJI_STATS.videoHours, label: '小时 · 课程', sub: '完整体系' },
                { value: TIANJI_STATS.totalHexagrams, label: '卦 · 易经', sub: '象数派' },
                { value: TIANJI_STATS.totalModules, label: '模块 · 天纪', sub: '六大学科' },
              ].map((s) => (
                <div key={s.label}
                  className="rounded-xl px-4 py-3 text-center transition-all duration-300"
                  style={{
                    background: c.cardBg,
                    border: `1px solid ${c.cardBorder}`,
                    boxShadow: c.featureShadow,
                  }}
                >
                  <div className="text-2xl lg:text-3xl font-bold tracking-wider"
                    style={{ color: c.goldSolid, fontFamily: 'var(--font-serif)' }}>
                    {s.value}
                  </div>
                  <div className="text-[11px] tracking-[0.2em] mt-1" style={{ color: c.textSecond }}>
                    {s.label}
                  </div>
                  <div className="text-[9px] mt-0.5 tracking-wider" style={{ color: c.textMuted }}>
                    {s.sub}
                  </div>
                </div>
              ))}
            </div>
          </TianjiFadeIn>

          {/* CTA */}
          <TianjiFadeIn delay={0.5}>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/tianji/yijing"
                className="px-8 py-3 font-medium text-sm tracking-[0.2em] rounded-full transition-all duration-300"
                style={{ background: c.ctaBg, color: c.ctaText }}>
                浏览 64 卦 →
              </Link>
              <Link href="/chart"
                className="px-8 py-3 font-medium text-sm tracking-[0.2em] rounded-full transition-all duration-300"
                style={{
                  border: `1px solid ${c.goldLine}`,
                  color: c.goldSolid,
                  background: 'transparent',
                }}>
                立即起紫微盘
              </Link>
            </div>
          </TianjiFadeIn>
        </div>
      </section>

      {/* ══ 三才定义 ══════════════════════════════════ */}
      <section className="relative px-6 py-16" style={{ background: c.bgAlt }}>
        <div className="mx-auto" style={{ maxWidth: '1280px' }}>
          <TianjiFadeIn>
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${c.goldLine})` }} />
                <span className="text-[10px] tracking-[0.4em] uppercase" style={{ color: c.goldSolid, opacity: 0.7 }}>
                  Three Realms
                </span>
                <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${c.goldLine})` }} />
              </div>
              <h2 className="grad-text text-2xl lg:text-3xl font-bold mb-3 tracking-[0.15em]">
                倪海夏 · 三才论
              </h2>
              <p className="text-sm max-w-xl mx-auto leading-relaxed" style={{ color: c.textSecond }}>
                《天纪》课程的核心思想 —— 命 / 相 / 卜 / 山 / 医，五术兼备，
                <br className="hidden md:block" />但所有知识最终指向「上知天文，下知地理，中知人事」。
              </p>
            </div>
          </TianjiFadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                glyph: '天',
                title: '上知天文',
                color: c.goldSolid,
                border: c.goldLine,
                items: ['紫微斗数（命）', '易经六十四卦（卜）', '面相学（相）', '测字术（相）'],
                note: '天文之纪，是本课程主题',
              },
              {
                glyph: '地',
                title: '下知地理',
                color: c.isDark ? 'rgba(96,165,250,0.9)' : '#3a5a82',
                border: c.isDark ? 'rgba(96,165,250,0.3)' : 'rgba(58,90,130,0.25)',
                items: ['堪舆学 · 阳宅', '堪舆学 · 阴宅', '风水与国运', '三吉六秀'],
                note: '《地脉道》讲义内容',
              },
              {
                glyph: '人',
                title: '中知人事',
                color: c.isDark ? 'rgba(120,180,140,0.9)' : '#3a6e4a',
                border: c.isDark ? 'rgba(120,180,140,0.3)' : 'rgba(58,110,74,0.25)',
                items: ['推命学 · 八字', '五形论面相', '命相同参', '格局与断命'],
                note: '人事之纪（人纪有专课）',
              },
            ].map((item, i) => (
              <TianjiFadeIn key={item.glyph} delay={0.1 + i * 0.12}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.1 }}
                  className="rounded-2xl p-6 h-full flex flex-col"
                  style={{
                    background: c.cardBg,
                    border: `1px solid ${item.border}`,
                    boxShadow: c.cardShadow,
                  }}
                >
                  <div className="flex items-start justify-between mb-5">
                    <div className="text-4xl font-bold leading-none" style={{ color: item.color }}>
                      {item.glyph}
                    </div>
                    <div className="text-[10px] tracking-[0.2em] px-2 py-1 rounded-full"
                      style={{ color: c.textMuted, border: `1px solid ${item.border}` }}>
                      {item.note}
                    </div>
                  </div>
                  <div className="text-base font-semibold mb-3 tracking-[0.1em]" style={{ color: item.color }}>
                    {item.title}
                  </div>
                  <div className="h-px mb-4" style={{ background: item.border }} />
                  <ul className="space-y-2 flex-1">
                    {item.items.map((it) => (
                      <li key={it} className="text-xs flex items-center gap-2" style={{ color: c.textSecond }}>
                        <span className="text-[8px]" style={{ color: item.color }}>▸</span>
                        {it}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </TianjiFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 6 模块卡片 ═══════════════════════════════ */}
      <section className="relative px-6 py-16 lg:py-20">
        <div className="mx-auto" style={{ maxWidth: '1280px' }}>
          <TianjiFadeIn>
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${c.goldLine})` }} />
                <span className="text-[10px] tracking-[0.4em] uppercase" style={{ color: c.goldSolid, opacity: 0.7 }}>
                  Six Disciplines
                </span>
                <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${c.goldLine})` }} />
              </div>
              <h2 className="grad-text text-2xl lg:text-3xl font-bold mb-3 tracking-[0.15em]">
                天纪六模块
              </h2>
              <p className="text-sm max-w-xl mx-auto leading-relaxed" style={{ color: c.textSecond }}>
                紫微斗数为基础、易经占卜为方法、堪舆推命面相为延伸。
                点击模块卡片查看完整章节与倪师解读。
              </p>
            </div>
          </TianjiFadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TIANJI_MODULES.map((m, i) => (
              <TianjiFadeIn key={m.id} delay={0.05 + i * 0.08}>
                <Link href={`/tianji/${m.slug}`} className="block h-full">
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.1 }}
                    className="rounded-2xl p-6 h-full flex flex-col"
                    style={{
                      background: c.featureBg,
                      border: `1px solid ${c.featureBord}`,
                      boxShadow: c.featureShadow,
                    }}
                  >
                    {/* 顶行：图标 + 状态标 */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                        style={{
                          background: c.cardBg,
                          border: `1px solid ${c.goldLine}`,
                          color: c.goldSolid,
                        }}>
                        {m.icon}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[9px] tracking-[0.2em] uppercase"
                          style={{
                            color: m.status === 'active' ? c.statusActive :
                                  m.status === 'preview' ? c.statusPreview : c.statusComing,
                          }}>
                          {m.status === 'active' ? '已开放' :
                           m.status === 'preview' ? '预览' : '筹备'}
                        </span>
                        <span className="text-[9px] tracking-[0.15em]" style={{ color: c.textMuted }}>
                          {m.school}
                        </span>
                      </div>
                    </div>

                    {/* 中文 + 英文 */}
                    <div className="mb-3">
                      <div className="text-xl font-bold tracking-[0.1em] mb-0.5" style={{ color: c.textPrimary }}>
                        {m.name}
                      </div>
                      <div className="text-[10px] tracking-wider" style={{ color: c.goldSolid, opacity: 0.7 }}>
                        {m.nameEn}
                      </div>
                    </div>

                    {/* 副标题 */}
                    <div className="text-xs mb-4" style={{ color: c.goldLight }}>
                      {m.subtitle}
                    </div>

                    {/* 描述 */}
                    <p className="text-xs leading-relaxed mb-4 flex-1" style={{ color: c.textSecond }}>
                      {m.description}
                    </p>

                    {/* 章节数 + 进入链接 */}
                    <div className="flex items-center justify-between pt-3"
                      style={{ borderTop: `1px solid ${c.featureBord}` }}>
                      <span className="text-[10px] tracking-wider" style={{ color: c.textMuted }}>
                        {m.chapters.length} 章 · {m.keywords.length} 关键词
                      </span>
                      <span className="text-[10px] tracking-[0.2em]" style={{ color: c.goldSolid }}>
                        进入 →
                      </span>
                    </div>
                  </motion.div>
                </Link>
              </TianjiFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 64 卦入口 ═══════════════════════════════ */}
      <section className="relative px-6 py-16 lg:py-20" style={{ background: c.bgAlt }}>
        <div className="mx-auto" style={{ maxWidth: '1280px' }}>
          <TianjiFadeIn>
            <Link href="/tianji/yijing" className="block">
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.1 }}
                className="rounded-2xl p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 items-center"
                style={{
                  background: c.cardBg,
                  border: `1px solid ${c.cardBorder}`,
                  boxShadow: c.cardShadow,
                }}
              >
                <div>
                  <div className="text-[10px] tracking-[0.4em] uppercase mb-3" style={{ color: c.tagText }}>
                    Yi Jing 64
                  </div>
                  <h3 className="grad-text text-3xl lg:text-4xl font-bold mb-4 tracking-[0.1em]">
                    易经 64 卦
                  </h3>
                  <p className="text-sm leading-relaxed mb-6" style={{ color: c.textSecond }}>
                    以《断易天机》为底本，倪师自创图示法讲解六十四卦。
                    <br />每一卦包含卦辞、倪师解读与断事要诀。
                  </p>
                  <div className="text-sm tracking-[0.2em]" style={{ color: c.goldSolid }}>
                    浏览完整 64 卦 →
                  </div>
                </div>
                {/* 卦象预览：前 16 卦按 4x4 排列 */}
                <div className="grid grid-cols-4 gap-2 max-w-md mx-auto lg:mx-0 lg:ml-auto">
                  {HEXAGRAMS.slice(0, 16).map((h) => (
                    <div key={h.number}
                      className="aspect-square rounded-lg flex flex-col items-center justify-center text-center transition-all duration-200"
                      style={{
                        background: c.featureBg,
                        border: `1px solid ${c.featureBord}`,
                      }}>
                      <div className="text-base font-bold tracking-wider"
                        style={{ color: c.goldSolid, fontFamily: 'var(--font-serif)' }}>
                        {h.name}
                      </div>
                      <div className="text-[8px] mt-0.5" style={{ color: c.textMuted }}>
                        {h.composition}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </Link>
          </TianjiFadeIn>
        </div>
      </section>

      {/* ══ 24 集 DVD 时间轴 ════════════════════════════ */}
      <section className="relative px-6 py-16 lg:py-20">
        <div className="mx-auto" style={{ maxWidth: '1280px' }}>
          <TianjiFadeIn>
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${c.goldLine})` }} />
                <span className="text-[10px] tracking-[0.4em] uppercase" style={{ color: c.goldSolid, opacity: 0.7 }}>
                  24 Episodes
                </span>
                <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${c.goldLine})` }} />
              </div>
              <h2 className="grad-text text-2xl lg:text-3xl font-bold mb-3 tracking-[0.15em]">
                24 集课程结构
              </h2>
              <p className="text-sm max-w-xl mx-auto leading-relaxed" style={{ color: c.textSecond }}>
                每集 2 小时：前一小时讲命学（紫微斗数/面相/推命），后一小时讲易经。
              </p>
            </div>
          </TianjiFadeIn>

          {/* 时间轴 */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {TIANJI_EPISODES.map((ep, i) => (
              <TianjiFadeIn key={ep.dvd} delay={0.02 * (i % 8)}>
                <motion.div
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.1 }}
                  className="rounded-xl p-4 h-full"
                  style={{
                    background: c.featureBg,
                    border: `1px solid ${c.featureBord}`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-base font-bold tracking-wider flex-shrink-0"
                      style={{
                        background: c.cardBg,
                        border: `1px solid ${c.goldLine}`,
                        color: c.goldSolid,
                        fontFamily: 'var(--font-serif)',
                      }}>
                      {ep.dvd}
                    </div>
                    <div className="text-[9px] tracking-[0.2em]" style={{ color: c.textMuted }}>
                      DVD · 第 {ep.dvd} 集
                    </div>
                  </div>
                  <div className="space-y-2 mb-3">
                    <div>
                      <div className="text-[9px] tracking-[0.15em] mb-0.5" style={{ color: c.tagText }}>
                        前半 · 命学
                      </div>
                      <div className="text-xs font-medium leading-relaxed" style={{ color: c.textPrimary }}>
                        {ep.firstHalf}
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] tracking-[0.15em] mb-0.5" style={{ color: c.tagText }}>
                        后半 · 易经
                      </div>
                      <div className="text-xs leading-relaxed" style={{ color: c.textSecond }}>
                        {ep.secondHalf}
                      </div>
                    </div>
                  </div>
                  {ep.highlights.length > 0 && (
                    <ul className="space-y-1 pt-2"
                      style={{ borderTop: `1px solid ${c.featureBord}` }}>
                      {ep.highlights.slice(0, 2).map((h, j) => (
                        <li key={j} className="text-[10px] flex items-start gap-1.5" style={{ color: c.textMuted }}>
                          <span style={{ color: c.goldSolid }}>·</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              </TianjiFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 倪师语录精选 ═════════════════════════════ */}
      <section className="relative px-6 py-16 lg:py-20" style={{ background: c.bgAlt }}>
        <div className="mx-auto" style={{ maxWidth: '1280px' }}>
          <TianjiFadeIn>
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${c.goldLine})` }} />
                <span className="text-[10px] tracking-[0.4em] uppercase" style={{ color: c.goldSolid, opacity: 0.7 }}>
                  Words from Master Ni
                </span>
                <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${c.goldLine})` }} />
              </div>
              <h2 className="grad-text text-2xl lg:text-3xl font-bold mb-3 tracking-[0.15em]">
                倪师语录精选
              </h2>
            </div>
          </TianjiFadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredQuotes.map((q, i) => (
              <TianjiFadeIn key={i} delay={0.05 * (i % 4)}>
                <div className="rounded-xl p-6 h-full"
                  style={{
                    background: c.cardBg,
                    border: `1px solid ${c.cardBorder}`,
                  }}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[9px] tracking-[0.2em] uppercase px-2 py-0.5 rounded-full"
                      style={{
                        color: c.goldSolid,
                        background: 'transparent',
                        border: `1px solid ${c.goldLine}`,
                      }}>
                      {q.topic}
                    </span>
                  </div>
                  <p className="text-base lg:text-lg leading-relaxed"
                    style={{ color: c.textPrimary, fontFamily: 'var(--font-serif)' }}>
                    「{q.text}」
                  </p>
                </div>
              </TianjiFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6" style={{ borderTop: `1px solid ${c.featureBord}` }}>
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-[10px] tracking-wider mb-3" style={{ color: c.textFaint }}>
            紫微命盘 · 天纪模块 · 基于倪海夏《天纪》公开教学讲义整理
          </p>
          <p className="text-[10px] tracking-wider leading-relaxed" style={{ color: c.textFaint, opacity: 0.85 }}>
            本平台基于中国传统文化研究，仅提供学习参考。<br />
            不构成任何医疗、投资、法律或重大决策建议。
          </p>
        </div>
      </footer>
    </div>
  );
}