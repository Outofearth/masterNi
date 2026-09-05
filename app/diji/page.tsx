'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTheme } from '@/components/ThemeProvider';
import { useTianjiColors } from '../tianji/_colors';
import { DIJI_MODULES, DIJI_STATS } from '@/lib/nihai/diji';
import { DIJI_QUOTES } from '@/lib/nihai/diji-quotes';
import TianjiFadeIn from '../tianji/TianjiFadeIn';
import GlobalSearch from '@/components/GlobalSearch';

/**
 * /diji 地纪总览
 *
 * 数据全部来自 lib/nihai/diji.ts + dijis-quotes.ts，零内容创作。
 * 子模块详情路由：/diji/[slug]
 */
export default function DijiPage() {
  const { theme } = useTheme();
  const c = useTianjiColors(theme);

  return (
    <main className="min-h-screen">
      {/* 顶部 nav */}
      <nav
        className="sticky top-0 z-40 backdrop-blur-md"
        style={{
          background: theme === 'dark' ? 'rgba(2,8,16,0.78)' : 'rgba(245,239,224,0.78)',
          borderBottom: `1px solid ${c.featureBord}`,
        }}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-4 min-0">
            <Link href="/" className="text-sm font-medium tracking-wider shrink-0" style={{ color: c.goldSolid }}>
              ← 首页
            </Link>
            <span className="text-sm tracking-widest font-serif" style={{ color: c.textPrimary }}>
              地纪
            </span>
            <span className="text-[10px] tracking-[0.2em]" style={{ color: c.textFaint }}>
              DI JI · 地脉承志
            </span>
          </div>
          <GlobalSearch variant="full" />
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-16 pb-10">
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
              倪海厦 · 三大遗著之第二
            </div>
            <h1
              className="text-4xl md:text-5xl font-serif tracking-widest leading-tight mb-4"
              style={{ color: c.textPrimary }}
            >
              地纪
            </h1>
            <p
              className="text-base md:text-lg leading-relaxed max-w-2xl mx-auto"
              style={{ color: c.textSecond }}
            >
              承天文以察地理，汇堪舆以解人间。
              <br />
              倪师未竟之宏愿，后辈薪火以传承。
            </p>
            <div className="flex items-center justify-center gap-6 mt-6 text-[10px] tracking-widest" style={{ color: c.textFaint }}>
              <span>{DIJI_STATS.totalModules} 模块</span>
              <span>·</span>
              <span>{DIJI_STATS.totalChapters} 章</span>
            </div>
          </div>
        </TianjiFadeIn>
      </section>

      {/* 三模块卡片 */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <TianjiFadeIn delay={0.1}>
          <div className="mb-6">
            <div className="text-[10px] tracking-[0.3em] mb-2" style={{ color: c.tagText }}>
              三大主题
            </div>
            <h3 className="text-2xl font-serif tracking-wider" style={{ color: c.textPrimary }}>
              地纪构成
            </h3>
          </div>
        </TianjiFadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DIJI_MODULES.map((m, i) => (
            <TianjiFadeIn key={m.id} delay={0.05 * (i + 1)}>
              <Link href={`/diji/${m.slug}`} className="block h-full">
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
                      border: `1px solid ${c.goldLine}`,
                      color: c.goldSolid,
                      fontFamily: 'var(--font-serif)',
                    }}
                  >
                    {m.icon}
                  </div>
                  <div className="text-[10px] tracking-[0.2em] mb-1" style={{ color: c.tagText }}>
                    {m.subtitle}
                  </div>
                  <h4 className="text-lg font-serif tracking-wider mb-2" style={{ color: c.textPrimary }}>
                    {m.name}
                  </h4>
                  <p className="text-[11px] leading-relaxed line-clamp-3" style={{ color: c.textSecond }}>
                    {m.description}
                  </p>
                  <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: `1px solid ${c.featureBord}` }}>
                    <span className="text-[9px] tracking-[0.2em]" style={{ color: c.textFaint }}>
                      {m.chapters.length} 章 ·{' '}
                      <span style={{ color: m.status === 'active' ? c.goldSolid : c.textFaint }}>
                        {m.status === 'active' ? '已上线' : m.status === 'preview' ? '试读' : '筹备'}
                      </span>
                    </span>
                    <span className="text-[10px]" style={{ color: c.goldSolid }}>
                      查看 →
                    </span>
                  </div>
                </motion.div>
              </Link>
            </TianjiFadeIn>
          ))}
        </div>
      </section>

      {/* 倪师地纪语录 */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <TianjiFadeIn delay={0.2}>
          <div className="mb-6">
            <div className="text-[10px] tracking-[0.3em] mb-2" style={{ color: c.tagText }}>
              地纪心法
            </div>
            <h3 className="text-2xl font-serif tracking-wider" style={{ color: c.textPrimary }}>
              倪师地纪语录
            </h3>
          </div>
        </TianjiFadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {DIJI_QUOTES.slice(0, 6).map((q, i) => (
            <TianjiFadeIn key={i} delay={0.05 * (i % 4)}>
              <div
                className="rounded-xl px-5 py-4"
                style={{
                  background: c.featureBg,
                  border: `1px solid ${c.featureBord}`,
                }}
              >
                <div className="text-[10px] tracking-[0.25em] mb-2" style={{ color: c.goldSolid }}>
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
        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
          <Link href="/tianji" className="tracking-wider hover:underline" style={{ color: c.textSecond }}>
            ← 天纪
          </Link>
          <span style={{ color: c.textFaint }}>·</span>
          <Link href="/renji" className="tracking-wider hover:underline" style={{ color: c.textSecond }}>
            人纪 →
          </Link>
        </div>
      </footer>
    </main>
  );
}