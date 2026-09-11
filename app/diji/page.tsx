'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTheme } from '@/components/ThemeProvider';
import { useTianjiColors } from '../tianji/_colors';
import { DIJI_MODULES, DIJI_STATS } from '@/lib/nihai/diji';
import { DIJI_QUOTES } from '@/lib/nihai/diji-quotes';
import TianjiFadeIn from '../tianji/TianjiFadeIn';
import NihaiHero from '@/components/NihaiHero';
import StatusBadge from '@/components/StatusBadge';
import SiteFooter from '@/components/SiteFooter';

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
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-16 pb-10">
        <NihaiHero
          badge="Di Ji · 下知地理"
          title="地纪"
          subtitle="堪舆 · 国家地理志 · 遗稿后学"
          description={
            <>
              倪海厦三大遗著之二 —— 承天文以察地理，汇堪舆以解人间。
              <br />
              倪师未竟之宏愿，后辈薪火以传承。
            </>
          }
        >
          <TianjiFadeIn delay={0.4} className="text-center">
            <div className="flex items-center justify-center gap-6 text-[12px] tracking-widest" style={{ color: c.textFaint }}>
              <span>{DIJI_STATS.totalModules} 模块</span>
              <span>·</span>
              <span>{DIJI_STATS.totalChapters} 章</span>
            </div>
          </TianjiFadeIn>
        </NihaiHero>
      </section>

      {/* 三模块卡片 */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <TianjiFadeIn delay={0.1}>
          <div className="mb-6">
            <div className="text-[12px] tracking-[0.3em] mb-2" style={{ color: c.tagText }}>
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
                  <div className="text-[12px] tracking-[0.2em] mb-1" style={{ color: c.tagText }}>
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
                      {m.chapters.length} 章 ·{' '}
                      <span style={{ color: m.status === 'active' ? c.goldSolid : c.textFaint }}>
                        <StatusBadge status={m.status} />
                      </span>
                    </span>
                    <span className="text-[12px]" style={{ color: c.goldSolid }}>
                      查看 →
                    </span>
                  </div>
                </motion.div>
              </Link>
            </TianjiFadeIn>
          ))}
        </div>
      </section>

      {/* 扩展阅读：廿四山向 + 地理五诀 */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <TianjiFadeIn delay={0.18}>
          <div className="mb-6">
            <div className="text-[12px] tracking-[0.3em] mb-2" style={{ color: c.tagText }}>
              扩展阅读
            </div>
            <h3 className="text-2xl font-serif tracking-wider" style={{ color: c.textPrimary }}>
              堪舆基础工具
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/diji/mountains" className="block group">
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.15 }}
                className="rounded-xl p-6 h-full"
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
                    罗
                  </div>
                  <div className="flex-1">
                    <div className="text-[12px] tracking-[0.2em] mb-1" style={{ color: c.tagText }}>
                      罗经正针
                    </div>
                    <h4 className="text-lg font-serif tracking-wider mb-2 group-hover:underline" style={{ color: c.textPrimary }}>
                      廿四山向
                    </h4>
                    <p className="text-[13px] leading-relaxed" style={{ color: c.textSecond }}>
                      壬子癸、艮寅甲、卯乙辰、巽巳丙、午丁未、坤申庚、酉辛戌、乾亥壬
                      —— 八宫二十四山，分天元地元人元龙，详列阴阳五行、阳宅阴宅吉凶。
                    </p>
                  </div>
                </div>
              </motion.div>
            </Link>

            <Link href="/diji/wujue" className="block group">
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.15 }}
                className="rounded-xl p-6 h-full"
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
                    五
                  </div>
                  <div className="flex-1">
                    <div className="text-[12px] tracking-[0.2em] mb-1" style={{ color: c.tagText }}>
                      地理五诀
                    </div>
                    <h4 className="text-lg font-serif tracking-wider mb-2 group-hover:underline" style={{ color: c.textPrimary }}>
                      龙穴砂水向
                    </h4>
                    <p className="text-[13px] leading-relaxed" style={{ color: c.textSecond }}>
                      寻龙点穴、察砂观水、立向定向 —— 五大要素相辅相成，缺一不可。
                      详列各要素吉象、凶象与倪师心法。
                    </p>
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>
        </TianjiFadeIn>
      </section>

      {/* 倪师地纪语录 */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <TianjiFadeIn delay={0.2}>
          <div className="mb-6">
            <div className="text-[12px] tracking-[0.3em] mb-2" style={{ color: c.tagText }}>
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
                <div className="text-[12px] tracking-[0.25em] mb-2" style={{ color: c.goldSolid }}>
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
          <Link href="/tianji" className="tracking-wider hover:underline" style={{ color: c.textSecond }}>
            ← 天纪
          </Link>
          <span style={{ color: c.textFaint }}>·</span>
          <Link href="/renji" className="tracking-wider hover:underline" style={{ color: c.textSecond }}>
            人纪 →
          </Link>
        </div>
              <SiteFooter compact as="div" />
      </footer>
    </main>
  );
}