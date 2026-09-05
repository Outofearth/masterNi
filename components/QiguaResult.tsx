'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTheme } from '@/components/ThemeProvider';
import { useTianjiColors } from '@/app/tianji/_colors';
import type { DivinationResult, Yao } from '@/lib/qigua/core';
import { changingLinesText } from '@/lib/qigua/core';

interface Props {
  result: DivinationResult;
}

function YaoLine({ yao, index, isChanging }: { yao: Yao; index: number; isChanging: boolean }) {
  const { theme } = useTheme();
  const c = useTianjiColors(theme);
  const posNames = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'];

  return (
    <div className="flex items-center gap-3 h-7">
      <span className="text-[10px] w-8 text-right" style={{ color: c.textFaint }}>
        {posNames[index]}
      </span>
      <div className="flex-1 flex items-center justify-center relative">
        {yao.type === 'yang' ? (
          <div
            className="h-1.5 rounded-full w-24 sm:w-32"
            style={{ background: c.goldSolid }}
          />
        ) : (
          <div className="flex items-center justify-center gap-2 w-24 sm:w-32">
            <div className="h-1.5 rounded-full flex-1" style={{ background: c.goldSolid }} />
            <div className="h-1.5 rounded-full flex-1" style={{ background: c.goldSolid }} />
          </div>
        )}
        {isChanging && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -right-5 text-xs"
            style={{ color: yao.value === 9 ? '#e06060' : '#6090d8' }}
          >
            {yao.value === 9 ? '○' : '×'}
          </motion.span>
        )}
      </div>
      <span className="text-[10px] w-10" style={{ color: c.textMuted }}>
        {yao.label}
      </span>
    </div>
  );
}

function HexagramCard({
  title,
  upper,
  lower,
  lines,
  hex,
  changingLines,
  subtitle,
}: {
  title: string;
  upper: string;
  lower: string;
  lines: import('@/lib/qigua/core').Yao[];
  hex: import('@/lib/nihai/types').Hexagram | null;
  changingLines?: number[];
  subtitle?: string;
}) {
  const { theme } = useTheme();
  const c = useTianjiColors(theme);

  return (
    <div
      className="rounded-xl p-4 sm:p-5"
      style={{ background: c.cardBg, border: `1px solid ${c.cardBorder}` }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-serif tracking-wider" style={{ color: c.goldSolid }}>
          {title}
        </h3>
        {subtitle && (
          <span className="text-[9px]" style={{ color: c.textFaint }}>
            {subtitle}
          </span>
        )}
      </div>

      <div className="flex flex-col items-center gap-0.5 mb-4">
        {lines.map((y, i) => (
          <YaoLine
            key={i}
            yao={y}
            index={i}
            isChanging={!!changingLines?.includes(i + 1)}
          />
        ))}
      </div>

      <div className="text-center">
        {hex ? (
          <>
            <p className="font-serif text-lg mb-1" style={{ color: c.textPrimary }}>
              {hex.name}
            </p>
            <p className="text-[10px] mb-1" style={{ color: c.textMuted }}>
              {hex.composition} · {upper}上{lower}下
            </p>
            <p className="text-xs leading-relaxed" style={{ color: c.textSecond }}>
              {hex.niInterpretation}
            </p>
          </>
        ) : (
          <p className="text-xs" style={{ color: c.textFaint }}>
            未查到对应本卦
          </p>
        )}
      </div>
    </div>
  );
}

export default function QiguaResult({ result }: Props) {
  const { theme } = useTheme();
  const c = useTianjiColors(theme);

  const hasChanged = result.changingLines.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-5xl mx-auto px-4 sm:px-6"
      style={{ color: c.textPrimary }}
    >
      {/* 顶部摘要 */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-serif mb-2" style={{ color: c.goldSolid }}>
          {result.hexagram ? `本卦：${result.hexagram.name}` : '本卦未明'}
        </h2>
        <p className="text-xs mb-1" style={{ color: c.textMuted }}>
          {result.methodLabel} · {result.upper}上{result.lower}下
        </p>
        <p className="text-sm" style={{ color: c.textSecond }}>
          {changingLinesText(result.changingLines)}
        </p>
      </div>

      {/* 三卦卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <HexagramCard
          title="本卦"
          upper={result.upper}
          lower={result.lower}
          lines={result.lines}
          hex={result.hexagram}
          changingLines={result.changingLines}
          subtitle="当下之象"
        />
        <HexagramCard
          title="变卦"
          upper={result.changedHexagram ? result.changedHexagram.upper : result.upper}
          lower={result.changedHexagram ? result.changedHexagram.lower : result.lower}
          lines={result.changedLines}
          hex={result.changedHexagram}
          subtitle={hasChanged ? '动爻所变' : '无动爻则同本卦'}
        />
        <HexagramCard
          title="互卦"
          upper={result.huHexagram ? result.huHexagram.upper : result.upper}
          lower={result.huHexagram ? result.huHexagram.lower : result.lower}
          lines={result.huLines}
          hex={result.huHexagram}
          subtitle="事情内在"
        />
      </div>

      {/* 倪师断事要诀 */}
      {result.hexagram && (
        <div
          className="rounded-xl p-5 sm:p-6 mb-8 max-w-3xl mx-auto"
          style={{ background: c.featureBg, border: `1px solid ${c.featureBord}` }}
        >
          <h3 className="text-sm font-serif mb-3" style={{ color: c.goldSolid }}>
            倪师断事要诀
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: c.textSecond }}>
            {result.hexagram.divination}
          </p>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {result.hexagram && (
          <Link
            href={`/tianji/yijing/${result.hexagram.number}`}
            className="px-6 py-2.5 rounded-full text-xs tracking-[0.2em] font-medium transition-all"
            style={{ background: c.ctaBg, color: c.ctaText }}
          >
            查看卦辞详解
          </Link>
        )}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="px-6 py-2.5 rounded-full text-xs tracking-[0.2em] font-medium transition-all"
          style={{ border: `1px solid ${c.goldLine}`, color: c.goldSolid }}
        >
          再起一卦
        </button>
      </div>
    </motion.div>
  );
}
