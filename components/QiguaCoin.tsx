'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/components/ThemeProvider';
import { useTianjiColors } from '@/app/tianji/_colors';
import { castByCoin, randomCoin, type DivinationResult } from '@/lib/qigua/core';

interface Props {
  onResult: (r: DivinationResult) => void;
}

const YAO_LABELS = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'];
const COIN_LABELS = ['0 背（3 字）', '1 背', '2 背', '3 背'];

export default function QiguaCoin({ onResult }: Props) {
  const { theme } = useTheme();
  const c = useTianjiColors(theme);

  const [counts, setCounts] = useState<number[]>([]);
  const [rolling, setRolling] = useState(false);

  const current = counts.length; // 0..6
  const done = current === 6;

  function addCount(n: number) {
    if (done || rolling) return;
    const next = [...counts, n];
    setCounts(next);
    if (next.length === 6) {
      const r = castByCoin(next);
      if (r) onResult(r);
    }
  }

  function rollOnce() {
    if (done || rolling) return;
    setRolling(true);
    setTimeout(() => {
      addCount(randomCoin());
      setRolling(false);
    }, 420);
  }

  function reset() {
    setCounts([]);
    setRolling(false);
  }

  return (
    <div className="w-full max-w-xl mx-auto" style={{ color: c.textPrimary }}>
      {/* 进度条 */}
      <div className="flex items-center justify-between mb-6">
        {YAO_LABELS.map((label, i) => {
          const state = i < counts.length ? 'done' : i === current ? 'active' : 'pending';
          return (
            <div key={label} className="flex flex-col items-center gap-1.5 flex-1">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium transition-colors duration-300"
                style={{
                  background: state === 'done' ? c.goldSolid : state === 'active' ? 'transparent' : c.featureBg,
                  color: state === 'done' ? '#08080a' : state === 'active' ? c.goldSolid : c.textFaint,
                  border: `1px solid ${state === 'active' ? c.goldLine : 'transparent'}`,
                }}
              >
                {state === 'done' ? '✓' : i + 1}
              </div>
              <span
                className="text-[9px] tracking-wider"
                style={{ color: state === 'active' ? c.goldSolid : c.textMuted }}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* 当前提示 */}
      <AnimatePresence mode="wait">
        {!done && (
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="text-center mb-6"
          >
            <p className="text-lg font-serif mb-1" style={{ color: c.goldSolid }}>
              第 {current + 1} 次摇钱
            </p>
            <p className="text-xs" style={{ color: c.textMuted }}>
              点选 3 枚铜钱中“背面”（阳面）向上的个数
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 选择 / 摇动区 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[0, 1, 2, 3].map((n) => (
          <motion.button
            key={n}
            whileHover={!done && !rolling ? { scale: 1.03 } : {}}
            whileTap={!done && !rolling ? { scale: 0.97 } : {}}
            onClick={() => addCount(n)}
            disabled={done || rolling}
            className="relative rounded-xl px-3 py-5 text-center transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: c.cardBg,
              border: `1px solid ${c.cardBorder}`,
            }}
            aria-label={COIN_LABELS[n]}
          >
            <span
              className="block text-2xl mb-1"
              aria-hidden="true"
              style={{ color: c.goldSolid }}
            >
              {'●'.repeat(n) + '○'.repeat(3 - n)}
            </span>
            <span className="text-[11px]" style={{ color: c.textMuted }}>
              {COIN_LABELS[n]}
            </span>
            {n === 3 && (
              <span
                className="absolute -top-2 -right-2 text-[9px] px-1.5 py-0.5 rounded-full"
                style={{ background: c.goldSolid, color: '#08080a' }}
              >
                老阳
              </span>
            )}
            {n === 0 && (
              <span
                className="absolute -top-2 -right-2 text-[9px] px-1.5 py-0.5 rounded-full"
                style={{ background: c.textSecond, color: c.bgBase }}
              >
                老阴
              </span>
            )}
          </motion.button>
        ))}
      </div>

      {/* 摇一摇快捷 */}
      {!done && (
        <div className="text-center mb-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={rollOnce}
            disabled={rolling}
            className="px-6 py-2 rounded-full text-xs tracking-[0.2em] transition-all"
            style={{
              background: rolling ? c.featureBg : c.glowTint,
              color: c.goldSolid,
              border: `1px solid ${c.goldLine}`,
            }}
          >
            {rolling ? '铜钱摇响中…' : '摇一摇，随机记数'}
          </motion.button>
        </div>
      )}

      {/* 已记录摘要 */}
      {counts.length > 0 && (
        <div
          className="rounded-lg p-4 mb-4"
          style={{ background: c.featureBg, border: `1px solid ${c.featureBord}` }}
        >
          <p className="text-xs mb-2" style={{ color: c.textMuted }}>已记录背面数</p>
          <div className="flex flex-wrap gap-2">
            {counts.map((n, i) => (
              <span
                key={i}
                className="text-[11px] px-2 py-1 rounded-md"
                style={{ background: c.cardBg, color: c.goldSolid, border: `1px solid ${c.cardBorder}` }}
              >
                {YAO_LABELS[i]}：{n} 背
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 重置 */}
      {counts.length > 0 && !done && (
        <button
          onClick={reset}
          className="w-full text-[11px] py-2 rounded-lg transition-colors"
          style={{ color: c.textMuted, border: `1px dashed ${c.featureBord}` }}
        >
          重新起卦
        </button>
      )}
    </div>
  );
}
