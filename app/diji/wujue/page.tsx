'use client';

/**
 * /diji/wujue 地理五诀
 *
 * 龙、穴、砂、水、向 —— 五要素核心
 */

import Link from 'next/link';
import CrossLinks from '@/components/CrossLinks';
import { useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { useTianjiColors } from '../../tianji/_colors';
import { FIVE_ELEMENTS, type FiveElement } from '@/lib/diji/mountains';
import TianjiFadeIn from '../../tianji/TianjiFadeIn';
import NihaiHero from '@/components/NihaiHero';
import SiteFooter from '@/components/SiteFooter';

export default function WujuePage() {
  const { theme } = useTheme();
  const c = useTianjiColors(theme);
  const [active, setActive] = useState<FiveElement['key']>('龙');

  const current = FIVE_ELEMENTS.find(e => e.key === active)!;

  return (
    <main className="min-h-screen">
            {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 pt-12 pb-8">
        <NihaiHero
          badge="堪舆心法 · 清·王道亨"
          title="地理五诀"
          titleSize="clamp(48px, 8vw, 96px)"
          description={
            <>
              龙、穴、砂、水、向 —— 五者合一，方为吉地。
              <br />
              缺一则偏，余一则孤。
            </>
          }
        />
      </section>

      {/* 五字大按钮 */}
      <section className="max-w-5xl mx-auto px-4 pb-6">
        <TianjiFadeIn delay={0.05}>
          <div className="grid grid-cols-5 gap-2 md:gap-3">
            {FIVE_ELEMENTS.map(e => {
              const isActive = e.key === active;
              return (
                <button
                  key={e.key}
                  type="button"
                  onClick={() => setActive(e.key)}
                  className="aspect-square md:aspect-auto md:py-6 rounded-xl flex flex-col items-center justify-center transition-all"
                  style={{
                    background: isActive ? c.goldSolid : c.cardBg,
                    color: isActive ? '#fff' : c.textPrimary,
                    border: `1px solid ${isActive ? c.goldSolid : c.featureBord}`,
                    boxShadow: isActive ? `0 4px 16px ${c.goldSolid}55` : 'none',
                  }}
                >
                  <div className="text-3xl md:text-4xl font-serif">{e.key}</div>
                  <div className="text-[12px] tracking-[0.2em] mt-1 md:mt-2" style={{
                    color: isActive ? 'rgba(255,255,255,0.85)' : c.textMuted,
                  }}>
                    {e.name}
                  </div>
                </button>
              );
            })}
          </div>
        </TianjiFadeIn>
      </section>

      {/* 当前要素详情 */}
      <section className="max-w-5xl mx-auto px-4 pb-10">
        <TianjiFadeIn key={active}>
          <div
            className="rounded-2xl p-6 lg:p-8"
            style={{
              background: c.cardBg,
              border: `1px solid ${c.goldLine}`,
              boxShadow: `0 4px 24px ${c.goldSolid}10`,
            }}
          >
            {/* 标题 */}
            <div className="flex items-start gap-5 mb-6">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-5xl font-serif shrink-0"
                style={{
                  background: c.goldSolid,
                  color: '#fff',
                }}
              >
                {current.key}
              </div>
              <div className="flex-1">
                <div className="text-[12px] tracking-[0.3em] mb-1" style={{ color: c.tagText }}>
                  {current.name}
                </div>
                <h2 className="text-2xl md:text-3xl font-serif tracking-wider" style={{ color: c.textPrimary }}>
                  {current.meaning}
                </h2>
              </div>
            </div>

            {/* 要诀列表 */}
            <div className="mb-6">
              <div className="text-[12px] tracking-[0.3em] mb-3" style={{ color: c.tagText }}>
                要诀
              </div>
              <ul className="space-y-2">
                {current.keyPoints.map((p, i) => (
                  <li
                    key={i}
                    className="text-[14px] flex gap-3 leading-relaxed font-serif"
                    style={{ color: c.textPrimary }}
                  >
                    <span style={{ color: c.goldSolid }} className="shrink-0">·</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 吉凶对照 */}
            <div className="grid md:grid-cols-2 gap-4">
              <div
                className="rounded-xl p-5"
                style={{
                  background: theme === 'dark' ? 'rgba(34,197,94,0.08)' : 'rgba(34,197,94,0.05)',
                  border: `1px solid ${theme === 'dark' ? 'rgba(34,197,94,0.3)' : 'rgba(34,197,94,0.25)'}`,
                }}
              >
                <div className="text-[12px] tracking-[0.3em] mb-2" style={{
                  color: theme === 'dark' ? 'rgba(134,239,172,0.9)' : 'rgba(22,163,74,0.9)',
                }}>
                  吉象
                </div>
                <p className="text-[13px] leading-relaxed font-serif" style={{ color: c.textPrimary }}>
                  {current.lucky}
                </p>
              </div>
              <div
                className="rounded-xl p-5"
                style={{
                  background: theme === 'dark' ? 'rgba(239,68,68,0.08)' : 'rgba(239,68,68,0.05)',
                  border: `1px solid ${theme === 'dark' ? 'rgba(239,68,68,0.3)' : 'rgba(239,68,68,0.25)'}`,
                }}
              >
                <div className="text-[12px] tracking-[0.3em] mb-2" style={{
                  color: theme === 'dark' ? 'rgba(252,165,165,0.9)' : 'rgba(220,38,38,0.9)',
                }}>
                  凶象
                </div>
                <p className="text-[13px] leading-relaxed font-serif" style={{ color: c.textPrimary }}>
                  {current.unlucky}
                </p>
              </div>
            </div>

            {/* 倪师注解 */}
            <div
              className="mt-6 rounded-xl p-5"
              style={{
                background: c.featureBg,
                border: `1px solid ${c.featureBord}`,
                borderLeft: `4px solid ${c.goldSolid}`,
              }}
            >
              <div className="text-[12px] tracking-[0.3em] mb-2" style={{ color: c.goldSolid }}>
                倪师要点
              </div>
              <p className="text-[14px] leading-relaxed font-serif" style={{ color: c.textPrimary }}>
                {current.niNote}
              </p>
            </div>
          </div>
        </TianjiFadeIn>
      </section>

      {/* A4-4 · 延伸阅读 */}
      <div className="max-w-5xl mx-auto px-4">
        <CrossLinks
          links={[
            { href: '/diji/mountains', label: '廿四山向 →', desc: '罗盘 24 山天元地元人元龙详解' },
            { href: '/diji', label: '地纪总览 →', desc: '倪师堪舆体系全貌' },
            { href: '/library', label: '古籍原典库 →', desc: '紫微斗数全集 · 骨髓赋等原文' },
            { href: '/chart', label: '排盘实测 →', desc: '输入生辰，即时生成命盘' },
          ]}
        />
      </div>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-4 pb-10 pt-6" style={{ borderTop: `1px solid ${c.featureBord}` }}>
        <div className="flex flex-wrap items-center justify-center gap-4 text-[13px]">
          <Link href="/diji/mountains" className="tracking-wider hover:underline" style={{ color: c.textSecond }}>
            ← 廿四山向
          </Link>
          <span style={{ color: c.textFaint }}>·</span>
          <Link href="/diji" className="tracking-wider hover:underline" style={{ color: c.goldSolid }}>
            地纪总览 →
          </Link>
        </div>
              <SiteFooter compact as="div" />
      </footer>
    </main>
  );
}