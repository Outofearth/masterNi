'use client';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/components/ThemeProvider';
import { HEXAGRAMS } from '@/lib/nihai';
import type { Hexagram } from '@/lib/nihai';
import {
  useTianjiColors,
  useSyncBodyBackground,
} from '../_colors';
import TianjiFadeIn from '../TianjiFadeIn';

/**
 * 易经 64 卦浏览页
 *
 * 布局：
 *   1. Hero（标题 + 简介 + 上卦过滤）
 *   2. 8x8 卦象网格（桌面）/ 4x16（移动）
 *   3. 网格说明
 */

// 八卦名称与符号（用于过滤）
const BAGUA = [
  { name: '乾', symbol: '☰', desc: '天' },
  { name: '兑', symbol: '☱', desc: '泽' },
  { name: '离', symbol: '☲', desc: '火' },
  { name: '震', symbol: '☳', desc: '雷' },
  { name: '巽', symbol: '☴', desc: '风' },
  { name: '坎', symbol: '☵', desc: '水' },
  { name: '艮', symbol: '☶', desc: '山' },
  { name: '坤', symbol: '☷', desc: '地' },
] as const;

type BaguaName = (typeof BAGUA)[number]['name'];

export default function YijingPage() {
  const { theme } = useTheme();
  const c = useTianjiColors(theme);
  useSyncBodyBackground(c.bgBase);

  // 过滤状态：null 表示不过滤
  const [filterUpper, setFilterUpper] = useState<BaguaName | null>(null);
  const [filterLower, setFilterLower] = useState<BaguaName | null>(null);

  const filtered: Hexagram[] = useMemo(() => {
    return HEXAGRAMS.filter(h => {
      if (filterUpper && h.upper !== filterUpper) return false;
      if (filterLower && h.lower !== filterLower) return false;
      return true;
    });
  }, [filterUpper, filterLower]);

  const clearFilter = () => { setFilterUpper(null); setFilterLower(null); };

  return (
    <div style={{ background: c.bgBase, transition: 'background 0.35s ease' }} className="overflow-x-hidden">

      {/* ══ HERO ══════════════════════════════════════ */}
      <section className="relative px-6 pt-12 pb-10 lg:pt-16 lg:pb-12">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full"
            style={{ background: `radial-gradient(ellipse, ${c.glowTint} 0%, transparent 70%)` }} />
        </div>

        <div className="relative mx-auto" style={{ maxWidth: '1280px' }}>
          <TianjiFadeIn>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${c.goldLine})` }} />
              <span className="text-[11px] tracking-[0.45em]" style={{ color: c.tagText }}>
                Yi Jing 64 · 象数派
              </span>
              <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${c.goldLine})` }} />
            </div>
          </TianjiFadeIn>

          <TianjiFadeIn delay={0.1}>
            <h1 className="grad-text font-bold leading-none text-center mb-4 tracking-tight"
              style={{ fontSize: 'clamp(48px, 8vw, 96px)', letterSpacing: '0.07em' }}>
              易经 64 卦
            </h1>
          </TianjiFadeIn>

          <TianjiFadeIn delay={0.2}>
            <p className="text-base md:text-lg tracking-[0.15em] mb-3 text-center" style={{ color: c.textSecond, fontWeight: 500 }}>
              乾☰ · 兑☱ · 离☲ · 震☳ · 巽☴ · 坎☵ · 艮☶ · 坤☷
            </p>
          </TianjiFadeIn>

          <TianjiFadeIn delay={0.3}>
            <p className="text-sm max-w-2xl mx-auto leading-relaxed mb-8 text-center" style={{ color: c.textMuted }}>
              倪师以《断易天机》为底本，自创图示法讲解六十四卦。
              <br className="hidden md:block" />点击任意卦象查看卦辞、倪师解读与断事要诀。
            </p>
          </TianjiFadeIn>

          {/* 数据条 */}
          <TianjiFadeIn delay={0.4}>
            <div className="flex justify-center gap-6 text-xs tracking-wider mb-8" style={{ color: c.textSecond }}>
              <span>共 <span style={{ color: c.goldSolid, fontWeight: 600 }}>{HEXAGRAMS.length}</span> 卦</span>
              <span style={{ color: c.textFaint }}>·</span>
              <span>上卦 <span style={{ color: c.goldSolid, fontWeight: 600 }}>8</span> 类</span>
              <span style={{ color: c.textFaint }}>·</span>
              <span>下卦 <span style={{ color: c.goldSolid, fontWeight: 600 }}>8</span> 类</span>
            </div>
          </TianjiFadeIn>
        </div>
      </section>

      {/* ══ 过滤器 ══════════════════════════════════════ */}
      <section className="relative px-6 pb-8">
        <div className="mx-auto" style={{ maxWidth: '1280px' }}>
          <TianjiFadeIn>
            <div className="rounded-2xl p-6"
              style={{
                background: c.cardBg,
                border: `1px solid ${c.cardBorder}`,
                boxShadow: c.featureShadow,
              }}>
              {/* 上卦 */}
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="text-[10px] tracking-[0.25em] uppercase whitespace-nowrap"
                  style={{ color: c.tagText, minWidth: '64px' }}>
                  上卦
                </span>
                {BAGUA.map(b => {
                  const active = filterUpper === b.name;
                  return (
                    <button key={b.name}
                      type="button"
                      onClick={() => setFilterUpper(active ? null : b.name)}
                      aria-pressed={active}
                      className="px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer flex items-center gap-1.5"
                      style={{
                        border: `1px solid ${active ? c.goldSolid : c.featureBord}`,
                        background: active ? c.glowTint : 'transparent',
                        color: active ? c.goldSolid : c.textSecond,
                        fontWeight: active ? 600 : 400,
                      }}>
                      <span className="text-base">{b.symbol}</span>
                      <span className="text-xs">{b.name}</span>
                    </button>
                  );
                })}
              </div>
              {/* 下卦 */}
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="text-[10px] tracking-[0.25em] uppercase whitespace-nowrap"
                  style={{ color: c.tagText, minWidth: '64px' }}>
                  下卦
                </span>
                {BAGUA.map(b => {
                  const active = filterLower === b.name;
                  return (
                    <button key={b.name}
                      type="button"
                      onClick={() => setFilterLower(active ? null : b.name)}
                      aria-pressed={active}
                      className="px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer flex items-center gap-1.5"
                      style={{
                        border: `1px solid ${active ? c.goldSolid : c.featureBord}`,
                        background: active ? c.glowTint : 'transparent',
                        color: active ? c.goldSolid : c.textSecond,
                        fontWeight: active ? 600 : 400,
                      }}>
                      <span className="text-base">{b.symbol}</span>
                      <span className="text-xs">{b.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* 状态条 */}
              <div className="flex items-center justify-between pt-3"
                style={{ borderTop: `1px solid ${c.featureBord}` }}>
                <span className="text-[11px] tracking-wider" style={{ color: c.textMuted }}>
                  显示 <span style={{ color: c.goldSolid, fontWeight: 600 }}>{filtered.length}</span> 卦
                  {filterUpper && ` · 上卦 ${filterUpper}`}
                  {filterLower && ` · 下卦 ${filterLower}`}
                </span>
                {(filterUpper || filterLower) && (
                  <button type="button" onClick={clearFilter}
                    className="text-[11px] tracking-wider cursor-pointer transition-colors"
                    style={{ color: c.goldSolid }}>
                    清除过滤 ×
                  </button>
                )}
              </div>
            </div>
          </TianjiFadeIn>
        </div>
      </section>

      {/* ══ 64 卦网格 ══════════════════════════════════════ */}
      <section className="relative px-6 pb-16">
        <div className="mx-auto" style={{ maxWidth: '1280px' }}>
          {filtered.length === 0 ? (
            <TianjiFadeIn>
              <div className="text-center py-20" style={{ color: c.textMuted }}>
                当前过滤条件下无结果
              </div>
            </TianjiFadeIn>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 sm:gap-3">
              {filtered.map((h, i) => (
                <HexagramCard key={h.number} hex={h} index={i} colors={c} />
              ))}
            </div>
          )}

          {/* 说明 */}
          <TianjiFadeIn delay={0.2}>
            <div className="mt-12 text-center max-w-2xl mx-auto">
              <p className="text-xs leading-relaxed" style={{ color: c.textMuted }}>
                六十四卦由上下两个三爻经卦叠合而成，每卦对应一种自然/人事情境。
                倪师讲解时注重象数结合，先观卦象、后解卦辞，再以图示法帮助断事。
              </p>
            </div>
          </TianjiFadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6" style={{ borderTop: `1px solid ${c.featureBord}` }}>
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-[10px] tracking-wider" style={{ color: c.textFaint }}>
            易经 64 卦 · 基于倪海夏《天纪》象数派体系整理 · 仅供参考
          </p>
        </div>
      </footer>
    </div>
  );
}

// ─── 单卦卡片 ──────────────────────────────────────
function HexagramCard({
  hex, index, colors: c,
}: {
  hex: Hexagram; index: number; colors: ReturnType<typeof useTianjiColors>;
}) {
  return (
    <Link href={`/tianji/yijing/${hex.number}`}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: Math.min(0.02 * index, 1), duration: 0.4 }}
        whileHover={{ y: -2, scale: 1.03 }}
        className="aspect-square rounded-xl p-2 flex flex-col items-center justify-center text-center cursor-pointer transition-colors duration-200"
        style={{
          background: c.featureBg,
          border: `1px solid ${c.featureBord}`,
        }}
      >
        {/* 卦序号 */}
        <div className="text-[8px] tracking-wider mb-1"
          style={{ color: c.textMuted, fontFamily: 'var(--font-mono)' }}>
          {String(hex.number).padStart(2, '0')}
        </div>
        {/* 卦名 */}
        <div className="text-lg sm:text-xl font-bold tracking-wider mb-0.5"
          style={{ color: c.goldSolid, fontFamily: 'var(--font-serif)' }}>
          {hex.name}
        </div>
        {/* 卦象 */}
        <div className="text-[8px] sm:text-[9px] tracking-wider leading-tight px-1 truncate w-full"
          style={{ color: c.textSecond }} title={hex.composition}>
          {hex.composition}
        </div>
      </motion.div>
    </Link>
  );
}