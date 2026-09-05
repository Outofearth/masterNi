'use client';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTheme } from '@/components/ThemeProvider';
import { HEXAGRAMS } from '@/lib/nihai';
import {
  useTianjiColors,
  useSyncBodyBackground,
} from '../../_colors';
import TianjiFadeIn from '../../TianjiFadeIn';

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
                className="text-[10px] tracking-[0.25em] inline-flex items-center gap-1"
                style={{ color: c.tagText }}>
                ← 64 卦
              </Link>
              <span style={{ color: c.textFaint }}>·</span>
              <span className="text-[10px] tracking-[0.25em]"
                style={{ color: c.tagText, fontFamily: 'var(--font-mono)' }}>
                第 {String(hex.number).padStart(2, '0')} 卦 / 64
              </span>
            </div>
          </TianjiFadeIn>

          <TianjiFadeIn delay={0.1}>
            <h1 className="grad-text font-bold leading-none text-center mb-2 tracking-tight"
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
                <span className="text-[10px] tracking-widest" style={{ color: c.textMuted }}>上</span>
                <span className="text-2xl">{BAGUA_SYMBOL[hex.upper]}</span>
                <span style={{ fontFamily: 'var(--font-serif)' }}>{hex.upper}</span>
              </span>
              <span style={{ color: c.textFaint }}>·</span>
              <span className="flex items-center gap-1.5">
                <span className="text-2xl">{BAGUA_SYMBOL[hex.lower]}</span>
                <span style={{ fontFamily: 'var(--font-serif)' }}>{hex.lower}</span>
                <span className="text-[10px] tracking-widest" style={{ color: c.textMuted }}>下</span>
              </span>
            </div>
          </TianjiFadeIn>
        </div>
      </section>

      {/* ══ 内容主体 ══════════════════════════════════════ */}
      <section className="relative px-6 pb-12">
        <div className="mx-auto" style={{ maxWidth: '960px' }}>
          <div className="space-y-4">
            {/* 卦辞要点 */}
            <TianjiFadeIn delay={0.1}>
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
                  <span className="text-[10px] tracking-[0.4em] uppercase" style={{ color: c.tagText }}>
                    卦辞 · Meaning
                  </span>
                </div>
                <p className="text-base lg:text-lg leading-relaxed"
                  style={{ color: c.textPrimary, fontFamily: 'var(--font-serif)' }}>
                  {hex.meaning}
                </p>
              </motion.div>
            </TianjiFadeIn>

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
                  <span className="text-[10px] tracking-[0.4em] uppercase" style={{ color: c.goldSolid }}>
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
                  <span className="text-[10px] tracking-[0.4em] uppercase" style={{ color: c.tagText }}>
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
                <div className="text-[10px] tracking-[0.25em] mb-1" style={{ color: c.tagText }}>
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
                <div className="text-[10px] tracking-[0.25em] mb-1" style={{ color: c.tagText }}>
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

      {/* Footer */}
      <footer className="py-10 px-6" style={{ borderTop: `1px solid ${c.featureBord}` }}>
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-[10px] tracking-wider" style={{ color: c.textFaint }}>
            易经 64 卦 · 基于倪海夏《天纪》象数派体系整理 · 仅供学习参考
          </p>
        </div>
      </footer>
    </div>
  );
}