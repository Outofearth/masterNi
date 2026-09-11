'use client';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import CrossLinks from '@/components/CrossLinks';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/components/ThemeProvider';
import TianjiChatPanel from '@/components/TianjiChatPanel';
import { HEXAGRAMS } from '@/lib/nihai';
import { getHexClassicSource } from '@/lib/yijing/classic-sources';
import {
  useTianjiColors,
  useSyncBodyBackground,
} from '../../_colors';
import TianjiFadeIn from '../../TianjiFadeIn';
import SiteFooter from '@/components/SiteFooter';

/**
 * 单卦详情页
 *
 * /tianji/yijing/[id]
 *
 * 渲染内容：
 *   - Hero：卦名 + 卦象 + 上下卦 + 卦序
 *   - 卦辞要点
 *   - 倪师解读
 *   - 断事要诀
 *   - 上一卦/下一卦导航
 */

// 八卦符号辅助
const BAGUA_SYMBOL: Record<string, string> = {
  乾: '☰', 兑: '☱', 离: '☲', 震: '☳',
  巽: '☴', 坎: '☵', 艮: '☶', 坤: '☷',
};

export default function HexagramDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { theme } = useTheme();
  const c = useTianjiColors(theme);
  useSyncBodyBackground(c.bgBase);

  const idNum = Number(params.id);
  const idx = HEXAGRAMS.findIndex(h => h.number === idNum);
  const hex = idx >= 0 ? HEXAGRAMS[idx] : null;
  const prev = idx > 0 ? HEXAGRAMS[idx - 1] : null;
  const next = idx >= 0 && idx < HEXAGRAMS.length - 1 ? HEXAGRAMS[idx + 1] : null;

  // AI 解读上下文：切卦时重建（useMemo 保证引用稳定，避免重复清空对话）
  const chatContext = useMemo(
    () => (hex ? { type: 'hexagram' as const, data: hex } : { type: 'general' as const }),
    [hex],
  );

  // B11 · 古籍对照：64 卦引证锚点
  const classicSrc = useMemo(() => (hex ? getHexClassicSource(hex.number) : undefined), [hex]);

  if (!hex) {
    return (
      <div className="px-6 py-32 text-center" style={{ color: c.textMuted }}>
        <p className="mb-4">未找到此卦（id = {params.id}）</p>
        <Link href="/tianji/yijing" className="text-sm tracking-wider"
          style={{ color: c.goldSolid }}>
          ← 返回 64 卦
        </Link>
      </div>
    );
  }

  return (
    <div style={{ background: c.bgBase, transition: 'background 0.35s ease' }} className="overflow-x-hidden">

      {/* ══ HERO ══════════════════════════════════════ */}
      <section className="relative px-6 pt-12 pb-10 lg:pt-16 lg:pb-12">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full"
            style={{ background: `radial-gradient(ellipse, ${c.glowTint} 0%, transparent 70%)` }} />
        </div>

        <div className="relative mx-auto" style={{ maxWidth: '960px' }}>
          <TianjiFadeIn>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Link href="/tianji/yijing"
                className="text-[12px] tracking-[0.25em] inline-flex items-center gap-1"
                style={{ color: c.tagText }}>
                ← 64 卦
              </Link>
              <span style={{ color: c.textFaint }}>·</span>
              <span className="text-[12px] tracking-[0.25em]"
                style={{ color: c.tagText, fontFamily: 'var(--font-mono)' }}>
                第 {String(hex.number).padStart(2, '0')} 卦 / 64
              </span>
            </div>
          </TianjiFadeIn>

          <TianjiFadeIn delay={0.1} className="text-center">
            <h1 className="grad-text font-bold leading-none mb-2 tracking-tight"
              style={{
                fontSize: 'clamp(80px, 14vw, 180px)',
                letterSpacing: '0.05em',
                fontFamily: 'var(--font-serif)',
              }}>
              {hex.name}
            </h1>
          </TianjiFadeIn>

          <TianjiFadeIn delay={0.2}>
            <p className="text-base md:text-lg tracking-[0.15em] mb-3 text-center" style={{ color: c.textSecond, fontWeight: 500 }}>
              {hex.composition}
            </p>
          </TianjiFadeIn>

          <TianjiFadeIn delay={0.3}>
            {/* 上下卦标注 */}
            <div className="flex items-center justify-center gap-4 mb-2 text-xl tracking-wider"
              style={{ color: c.goldSolid }}>
              <span className="flex items-center gap-1.5">
                <span className="text-[12px] tracking-widest" style={{ color: c.textMuted }}>上</span>
                <span className="text-2xl">{BAGUA_SYMBOL[hex.upper]}</span>
                <span style={{ fontFamily: 'var(--font-serif)' }}>{hex.upper}</span>
              </span>
              <span style={{ color: c.textFaint }}>·</span>
              <span className="flex items-center gap-1.5">
                <span className="text-2xl">{BAGUA_SYMBOL[hex.lower]}</span>
                <span style={{ fontFamily: 'var(--font-serif)' }}>{hex.lower}</span>
                <span className="text-[12px] tracking-widest" style={{ color: c.textMuted }}>下</span>
              </span>
            </div>
          </TianjiFadeIn>
        </div>
      </section>

      {/* ══ 内容主体 ══════════════════════════════════════ */}
      <section className="relative px-6 pb-12">
        <div className="mx-auto" style={{ maxWidth: '960px' }}>
          <div className="space-y-4">
            {/* 卦辞要点 · 古籍出处 */}
            <TianjiFadeIn delay={0.1}>
              <motion.div
                whileHover={{ y: -2 }} transition={{ duration: 0.1 }}
                className="rounded-2xl p-6 lg:p-8"
                style={{
                  background: c.cardBg,
                  border: `1px solid ${c.cardBorder}`,
                  boxShadow: c.featureShadow,
                }}>
                <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-px w-6" style={{ background: c.goldLine }} />
                    <span className="text-[12px] tracking-[0.4em] uppercase" style={{ color: c.tagText }}>
                      卦辞 · Meaning
                    </span>
                  </div>
                  {classicSrc && (
                    <span
                      title={classicSrc.classicalExcerpt}
                      className="text-[12px] px-2 py-1 rounded-full"
                      style={{
                        color: c.goldSolid,
                        background: c.featureBg,
                        border: `1px solid ${c.goldLine}`,
                        letterSpacing: '0.15em',
                        fontFamily: 'var(--font-serif)',
                      }}
                    >
                      {classicSrc.classicalReference}
                    </span>
                  )}
                </div>
                <p className="text-base lg:text-lg leading-relaxed mb-4"
                  style={{ color: c.textPrimary, fontFamily: 'var(--font-serif)' }}>
                  {hex.meaning}
                </p>
                {classicSrc?.classicalExcerpt && (
                  <p className="text-xs leading-relaxed mb-3"
                    style={{ color: c.textMuted, fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
                    原文摘录：「{classicSrc.classicalExcerpt}」
                  </p>
                )}
                <div className="flex items-center gap-2 flex-wrap pt-3"
                  style={{ borderTop: `1px dashed ${c.cardBorder}` }}>
                  <span className="text-[12px] tracking-[0.2em]" style={{ color: c.tagText }}>
                    古籍引证
                  </span>
                  <Link
                    href={`/library/search?q=${encodeURIComponent(classicSrc?.libraryQuery ?? hex.name)}`}
                    className="text-[13px] tracking-wider inline-flex items-center gap-1 hover:underline"
                    style={{ color: c.goldSolid }}
                    aria-label={`在古籍库中检索 ${hex.name} 卦相关章节`}
                  >
                    在《周易》《紫微斗数全集》《骨髓赋》中检索 →
                  </Link>
                </div>
              </motion.div>
            </TianjiFadeIn>

            {/* B11 · 古籍原文 vs 倪师解读 · 双栏对照 */}
            {classicSrc && (
              <TianjiFadeIn delay={0.15}>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="rounded-2xl p-6 lg:p-8"
                  style={{
                    background: c.featureBg,
                    border: `1px solid ${c.goldLine}`,
                    boxShadow: c.featureShadow,
                  }}
                  aria-label={`${hex.name}卦古籍原文与倪师解读对照`}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="h-px w-6" style={{ background: c.goldSolid }} />
                    <span className="text-[12px] tracking-[0.4em] uppercase" style={{ color: c.goldSolid }}>
                      古籍原文 · 倪师解读 对照
                    </span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* 古籍原文列 */}
                    <div
                      className="rounded-xl p-4 lg:p-5"
                      style={{
                        background: c.bgBase,
                        border: `1px solid ${c.cardBorder}`,
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span aria-hidden="true" style={{ fontSize: 16 }}>📜</span>
                        <span className="text-[12px] tracking-[0.3em]" style={{ color: c.tagText }}>
                          古籍原文
                        </span>
                      </div>
                      <p className="text-[12px] tracking-wider mb-2"
                        style={{ color: c.goldSolid, fontFamily: 'var(--font-serif)' }}>
                        {classicSrc.classicalReference}
                      </p>
                      <p className="text-sm lg:text-base leading-relaxed"
                        style={{ color: c.textPrimary, fontFamily: 'var(--font-serif)' }}>
                        「{classicSrc.classicalExcerpt}」
                      </p>
                      <p className="text-xs mt-3 leading-relaxed"
                        style={{ color: c.textMuted }}>
                        即《{classicSrc.classicalReference.replace(/^《|》$/g, '')}》开篇所立卦辞要旨。
                      </p>
                    </div>
                    {/* 倪师解读列 */}
                    <div
                      className="rounded-xl p-4 lg:p-5"
                      style={{
                        background: c.bgBase,
                        border: `1px solid ${c.goldLine}`,
                        boxShadow: `inset 0 0 0 1px ${c.goldLine}`,
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span aria-hidden="true" style={{ fontSize: 16 }}>🪶</span>
                        <span className="text-[12px] tracking-[0.3em]" style={{ color: c.goldSolid }}>
                          倪师解读
                        </span>
                      </div>
                      <p className="text-[12px] tracking-wider mb-2"
                        style={{ color: c.tagText, fontFamily: 'var(--font-serif)' }}>
                        倪海厦《天纪》易经象数派
                      </p>
                      <p className="text-sm lg:text-base leading-relaxed"
                        style={{ color: c.textPrimary }}>
                        {hex.niInterpretation}
                      </p>
                      <p className="text-xs mt-3 leading-relaxed"
                        style={{ color: c.textMuted }}>
                        {classicSrc.niashiCorePoint}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </TianjiFadeIn>
            )}

            {/* 倪师解读 */}
            <TianjiFadeIn delay={0.2}>
              <motion.div
                whileHover={{ y: -2 }} transition={{ duration: 0.1 }}
                className="rounded-2xl p-6 lg:p-8"
                style={{
                  background: c.featureBg,
                  border: `1px solid ${c.goldLine}`,
                  boxShadow: c.featureShadow,
                }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px w-6" style={{ background: c.goldSolid }} />
                  <span className="text-[12px] tracking-[0.4em] uppercase" style={{ color: c.goldSolid }}>
                    倪师解读 · Ni Interpretation
                  </span>
                </div>
                <p className="text-base leading-relaxed" style={{ color: c.textPrimary }}>
                  {hex.niInterpretation}
                </p>
              </motion.div>
            </TianjiFadeIn>

            {/* 断事要诀 */}
            <TianjiFadeIn delay={0.3}>
              <motion.div
                whileHover={{ y: -2 }} transition={{ duration: 0.1 }}
                className="rounded-2xl p-6 lg:p-8"
                style={{
                  background: c.cardBg,
                  border: `1px solid ${c.cardBorder}`,
                  boxShadow: c.featureShadow,
                }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px w-6" style={{ background: c.goldLine }} />
                  <span className="text-[12px] tracking-[0.4em] uppercase" style={{ color: c.tagText }}>
                    断事要诀 · Divination
                  </span>
                </div>
                <p className="text-sm lg:text-base leading-relaxed" style={{ color: c.textSecond }}>
                  {hex.divination}
                </p>
              </motion.div>
            </TianjiFadeIn>
          </div>
        </div>
      </section>

      {/* ══ AI 解读 ══════════════════════════════════════ */}
      <section className="relative px-6 py-12" style={{ background: c.bgAlt }}>
        <div className="mx-auto" style={{ maxWidth: '960px' }}>
          <div className="mb-5 text-center">
            <div className="text-[12px] tracking-[0.3em] mb-1" style={{ color: c.tagText }}>
              AI · 问卦
            </div>
            <h2 className="text-lg font-medium tracking-wider"
              style={{ color: c.textPrimary, fontFamily: 'var(--font-serif)' }}>
              就这一卦提问
            </h2>
          </div>
          <TianjiChatPanel
            context={chatContext}
            title={`AI 解卦 · 第 ${hex.number} 卦「${hex.name}」`}
            subtitle="倪海厦《天纪》象数派口径 · 结合卦象卦辞作答"
            height={520}
          />
        </div>
      </section>

      {/* ══ 上下卦导航 ══════════════════════════════════════ */}
      <section className="relative px-6 py-12" style={{ background: c.bgAlt }}>
        <div className="mx-auto" style={{ maxWidth: '960px' }}>
          <div className="flex items-center justify-between gap-4">
            {prev ? (
              <Link href={`/tianji/yijing/${prev.number}`}
                className="flex-1 rounded-xl p-5 transition-all duration-200 group"
                style={{
                  background: c.featureBg,
                  border: `1px solid ${c.featureBord}`,
                }}>
                <div className="text-[12px] tracking-[0.25em] mb-1" style={{ color: c.tagText }}>
                  ← 上一卦
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-bold tracking-wider"
                    style={{ color: c.goldSolid, fontFamily: 'var(--font-serif)' }}>
                    {prev.name}
                  </div>
                  <div className="text-xs" style={{ color: c.textMuted }}>
                    {prev.composition}
                  </div>
                </div>
              </Link>
            ) : <div className="flex-1" />}

            <button type="button"
              onClick={() => router.push('/tianji/yijing')}
              className="px-4 py-3 rounded-full text-xs tracking-[0.2em] cursor-pointer transition-colors"
              style={{
                border: `1px solid ${c.goldLine}`,
                color: c.goldSolid,
                background: 'transparent',
              }}>
              返回 64 卦
            </button>

            {next ? (
              <Link href={`/tianji/yijing/${next.number}`}
                className="flex-1 rounded-xl p-5 text-right transition-all duration-200"
                style={{
                  background: c.featureBg,
                  border: `1px solid ${c.featureBord}`,
                }}>
                <div className="text-[12px] tracking-[0.25em] mb-1" style={{ color: c.tagText }}>
                  下一卦 →
                </div>
                <div className="flex items-center justify-end gap-3">
                  <div className="text-xs" style={{ color: c.textMuted }}>
                    {next.composition}
                  </div>
                  <div className="text-3xl font-bold tracking-wider"
                    style={{ color: c.goldSolid, fontFamily: 'var(--font-serif)' }}>
                    {next.name}
                  </div>
                </div>
              </Link>
            ) : <div className="flex-1" />}
          </div>
        </div>
      </section>

      {/* A4-4 · 延伸阅读 */}
      <section className="relative px-6 pb-4">
        <div className="mx-auto" style={{ maxWidth: '960px' }}>
          <CrossLinks
            links={[
              { href: '/tianji/qigua', label: '起卦实测 →', desc: '就当下疑问亲自占一卦' },
              { href: `/library/search?q=${encodeURIComponent(hex.name)}`, label: `古籍检索「${hex.name}」→`, desc: '在原典库中查找此卦相关原文' },
              { href: '/tianji', label: '天纪总览 →', desc: '倪师天纪体系：紫微 / 易经 / 堪舆 / 面相 / 测字' },
              { href: '/chart', label: '紫微排盘 →', desc: '输入生辰，即时生成命盘' },
            ]}
          />
        </div>
      </section>

      {/* Footer */}
      <SiteFooter note="紫微命盘 · 天纪·易经 · 基于倪海夏《天纪》公开教学讲义整理" />
    </div>
  );
}