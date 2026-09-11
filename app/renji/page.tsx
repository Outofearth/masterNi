'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTheme } from '@/components/ThemeProvider';
import { useTianjiColors } from '../tianji/_colors';
import { RENJI_MODULES, RENJI_STATS } from '@/lib/nihai/renji';
import { RENJI_QUOTES } from '@/lib/nihai/renji-quotes';
import TianjiFadeIn from '../tianji/TianjiFadeIn';
import NihaiHero from '@/components/NihaiHero';
import SymptomSearch from '@/components/renji/SymptomSearch';
import SiteFooter from '@/components/SiteFooter';

/**
 * /renji 人纪总览
 *
 * 核心功能：症状 → 穴位 检索（数据 ACU_EXPERIENCES，条数取实际长度不硬编码）
 * 5 模块卡片 · 学习顺序提示 · 倪师人纪语录
 */
export default function RenjiPage() {
  const { theme } = useTheme();
  const c = useTianjiColors(theme);

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-16 pb-10">
        <NihaiHero
          badge="Ren Ji · 中知人事"
          title="人纪"
          subtitle="针灸大成 · 黄帝内经 · 神农本草经 · 伤寒论 · 金匮要略"
          description={
            <>
              倪海厦三大遗著之三 —— 承天文以疗人身，汇医道以济苍生。
              <br />
              针灸、内经、本草、伤寒、金匮，五经一贯。
            </>
          }
        >
          <TianjiFadeIn delay={0.4} className="text-center">
            <div className="flex items-center justify-center gap-6 text-[12px] tracking-widest flex-wrap" style={{ color: c.textFaint }}>
              <span>{RENJI_STATS.totalModules} 模块</span>
              <span>·</span>
              <span>{RENJI_STATS.totalLessons}</span>
              <span>·</span>
              <span>针灸经验 {RENJI_STATS.acuExperienceCount}</span>
              <span>·</span>
              <span>汉唐方 {RENJI_STATS.hantangFormulaCount}</span>
              <span>·</span>
              <span>经方 {RENJI_STATS.classicFormulaCount}</span>
            </div>
          </TianjiFadeIn>
        </NihaiHero>
      </section>

      {/* 症状 → 穴位 检索 */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <TianjiFadeIn delay={0.05}>
          <SymptomSearch />
        </TianjiFadeIn>
      </section>

      {/* 学习顺序 */}
      <section className="max-w-6xl mx-auto px-4 pb-8">
        <TianjiFadeIn delay={0.1}>
          <div className="text-[12px] tracking-[0.3em] mb-2" style={{ color: c.tagText }}>
            倪师指定学习顺序
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[13px]" style={{ color: c.textSecond }}>
            {RENJI_STATS.learningOrder.map((s, i) => (
              <span key={s} className="flex items-center gap-2">
                <span
                  className="px-2 py-1 rounded-full"
                  style={{
                    background: c.featureBg,
                    border: `1px solid ${c.goldLine}`,
                    color: c.goldSolid,
                  }}
                >
                  {i + 1}. {s}
                </span>
                {i < RENJI_STATS.learningOrder.length - 1 && (
                  <span style={{ color: c.textFaint }}>→</span>
                )}
              </span>
            ))}
          </div>
        </TianjiFadeIn>
      </section>

      {/* 5 模块卡片 */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <TianjiFadeIn delay={0.15}>
          <div className="mb-6">
            <div className="text-[12px] tracking-[0.3em] mb-2" style={{ color: c.tagText }}>
              五大模块
            </div>
            <h3 className="text-2xl font-serif tracking-wider" style={{ color: c.textPrimary }}>
              人纪构成
            </h3>
          </div>
        </TianjiFadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {RENJI_MODULES.map((m, i) => (
            <TianjiFadeIn key={m.id} delay={0.05 * (i + 1)}>
              <Link href={`/renji/${m.slug}`} className="block h-full">
                <motion.div
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.15 }}
                  className="rounded-xl p-6 h-full"
                  style={{
                    background: c.cardBg,
                    border: `1px solid ${c.featureBord}`,
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-xl mb-4"
                    style={{
                      background: c.featureBg,
                      border: `1px solid var(--cat-renji)`,
                      color: 'var(--cat-renji)',
                      fontFamily: 'var(--font-serif)',
                    }}
                  >
                    {m.icon}
                  </div>
                  <div className="text-[12px] tracking-[0.2em] mb-1" style={{ color: 'var(--cat-renji)' }}>
                    {m.subtitle}
                  </div>
                  <h4 className="text-lg font-serif tracking-wider mb-2" style={{ color: c.textPrimary }}>
                    {m.name}
                  </h4>
                  <p className="text-[13px] leading-relaxed line-clamp-3" style={{ color: c.textSecond }}>
                    {m.description}
                  </p>
                  <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: `1px solid ${c.featureBord}` }}>
                    <span className="text-[12px] tracking-[0.2em]" style={{ color: c.textFaint }}>
                      {m.lessons ?? `${m.chapters.length} 章`}
                    </span>
                    <span className="text-[12px]" style={{ color: 'var(--cat-renji)' }}>
                      查看 →
                    </span>
                  </div>
                </motion.div>
              </Link>
            </TianjiFadeIn>
          ))}
        </div>
      </section>

      {/* 方剂库入口 */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <TianjiFadeIn delay={0.18}>
          <div className="mb-6">
            <div className="text-[12px] tracking-[0.3em] mb-2" style={{ color: c.tagText }}>
              方剂速查
            </div>
            <h3 className="text-2xl font-serif tracking-wider" style={{ color: c.textPrimary }}>
              仲景经方库
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/renji/shanghan" className="block group">
              <div
                className="rounded-xl p-6 h-full transition-transform hover:scale-[1.01]"
                style={{
                  background: c.cardBg,
                  border: `1px solid ${c.featureBord}`,
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl font-serif shrink-0"
                    style={{
                      background: c.goldSolid,
                      color: '#fff',
                    }}
                  >
                    伤
                  </div>
                  <div className="flex-1">
                    <div className="text-[12px] tracking-[0.2em] mb-1" style={{ color: c.tagText }}>
                      六经辨证
                    </div>
                    <h4 className="text-lg font-serif tracking-wider mb-2 group-hover:underline" style={{ color: c.textPrimary }}>
                      《伤寒论》方剂
                    </h4>
                    <p className="text-[13px] leading-relaxed" style={{ color: c.textSecond }}>
                      32 张核心方剂，按太阳/阳明/少阳/太阴/少阴/厥阴六经分组。
                      含主治、君药、组成、倪师要点与现代应用。
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/renji/jingui" className="block group">
              <div
                className="rounded-xl p-6 h-full transition-transform hover:scale-[1.01]"
                style={{
                  background: c.cardBg,
                  border: `1px solid ${c.featureBord}`,
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl font-serif shrink-0"
                    style={{
                      background: c.goldSolid,
                      color: '#fff',
                    }}
                  >
                    金
                  </div>
                  <div className="flex-1">
                    <div className="text-[12px] tracking-[0.2em] mb-1" style={{ color: c.tagText }}>
                      杂病论
                    </div>
                    <h4 className="text-lg font-serif tracking-wider mb-2 group-hover:underline" style={{ color: c.textPrimary }}>
                      《金匮要略》方剂
                    </h4>
                    <p className="text-[13px] leading-relaxed" style={{ color: c.textSecond }}>
                      40 张核心方剂，按篇章分组：痉湿暍、虚劳、胸痹、痰饮、黄疸、妇人妊娠产后等。
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </TianjiFadeIn>
      </section>

      {/* 倪师人纪语录 */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <TianjiFadeIn delay={0.2}>
          <div className="mb-6">
            <div className="text-[12px] tracking-[0.3em] mb-2" style={{ color: c.tagText }}>
              人纪心法
            </div>
            <h3 className="text-2xl font-serif tracking-wider" style={{ color: c.textPrimary }}>
              倪师人纪语录
            </h3>
          </div>
        </TianjiFadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {RENJI_QUOTES.slice(0, 8).map((q, i) => (
            <TianjiFadeIn key={i} delay={0.03 * (i % 4)}>
              <div
                className="rounded-xl px-5 py-4"
                style={{
                  background: c.featureBg,
                  border: `1px solid ${c.featureBord}`,
                }}
              >
                <div className="text-[12px] tracking-[0.25em] mb-2" style={{ color: 'var(--cat-renji)' }}>
                  「{q.topic}」
                </div>
                <p className="text-sm font-serif leading-relaxed" style={{ color: c.textPrimary }}>
                  {q.text}
                </p>
              </div>
            </TianjiFadeIn>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 pb-10 pt-6" style={{ borderTop: `1px solid ${c.featureBord}` }}>
        <div className="flex flex-wrap items-center justify-center gap-4 text-[13px]">
          <Link href="/diji" className="tracking-wider hover:underline" style={{ color: c.textSecond }}>
            ← 地纪
          </Link>
          <span style={{ color: c.textFaint }}>·</span>
          <Link href="/tianji" className="tracking-wider hover:underline" style={{ color: c.textSecond }}>
            天纪 →
          </Link>
        </div>
              <SiteFooter compact as="div" />
      </footer>
    </main>
  );
}