'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTheme } from '@/components/ThemeProvider';
import { useTianjiColors } from '@/app/tianji/_colors';
import type { DivinationResult, Yao } from '@/lib/qigua/core';
import { changingLinesText } from '@/lib/qigua/core';
import {
  buildFullReading,
  type YaoReading,
  type RelationReading,
  type Advice,
} from '@/lib/qigua/yaoci';
import { useMemo, useState } from 'react';
import { TIANJI_QUOTES } from '@/lib/nihai';

interface Props {
  result: DivinationResult;
  /** 点击「问天纪」时回调，参数为所占之事（可为空） */
  onAskAi?: (question: string) => void;
}

/**
 * B12 · 占卜 → 倪师语录关联
 *
 * 匹配策略（自上而下）：
 *   1. 本卦/变卦/互卦名直接命中 TIANJI_QUOTES.text 中的关键字
 *   2. 命中数量不足时，从 topic 为「易经」「命学哲理」中随机补足
 *   3. 兜底 3 条通用易经语录
 */
function pickRelatedQuotes(hexName: string | null, upper: string, lower: string): string[] {
  if (!hexName && !upper && !lower) return [];

  const QUOTE_POOL = TIANJI_QUOTES.map(q => q.text);
  const seen = new Set<string>();

  const matched: string[] = [];
  // 1. 直接关键词匹配（本卦名/上下卦名 出现在语录文本中）
  for (const txt of QUOTE_POOL) {
    const targets = [hexName, upper, lower].filter(Boolean);
    if (targets.some(t => t && txt.includes(t))) {
      if (!seen.has(txt)) {
        seen.add(txt);
        matched.push(txt);
        if (matched.length >= 4) break;
      }
    }
  }
  // 2. 易经 / 命学哲理 topic 补足
  if (matched.length < 4) {
    for (const q of TIANJI_QUOTES) {
      if (matched.length >= 4) break;
      if ((q.topic === '易经' || q.topic === '命学哲理') && !seen.has(q.text)) {
        seen.add(q.text);
        matched.push(q.text);
      }
    }
  }
  // 3. 兜底
  if (matched.length < 3) {
    const fallbacks = [
      '不疑何卜——只有有疑虑时才占卜',
      '外象一直在变，但精神是一样的',
      '算命就是一个讨论果的哲学',
      '命运可以推算，但心念一转，命数随改',
    ];
    for (const f of fallbacks) {
      if (matched.length >= 4) break;
      if (!seen.has(f)) {
        seen.add(f);
        matched.push(f);
      }
    }
  }
  return matched.slice(0, 4);
}

/** 倪师语录关联条 */
function NiQuoteRow({ quote, accent }: { quote: string; accent?: boolean }) {
  const { theme } = useTheme();
  const c = useTianjiColors(theme);
  return (
    <div
      className="rounded-lg px-4 py-3 mb-2 last:mb-0"
      style={{
        background: accent ? c.glowTint : 'transparent',
        borderLeft: `3px solid ${c.goldSolid}`,
      }}
      role="blockquote"
    >
      <p
        className="text-sm leading-relaxed"
        style={{ color: accent ? c.textPrimary : c.textSecond }}
      >
        {quote}
      </p>
      <p
        className="text-[12px] mt-1.5 tracking-[0.25em] text-right"
        style={{ color: c.textFaint }}
      >
        —— 倪海厦《天纪》
      </p>
    </div>
  );
}

const POS_NAMES = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'];

function YaoLine({ yao, index, isChanging }: { yao: Yao; index: number; isChanging: boolean }) {
  const { theme } = useTheme();
  const c = useTianjiColors(theme);

  return (
    <div className="flex items-center gap-3 h-7">
      <span className="text-[12px] w-8 text-right" style={{ color: c.textFaint }}>
        {POS_NAMES[index]}
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
      <span className="text-[12px] w-10" style={{ color: c.textMuted }}>
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
  lines: Yao[];
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
          <span className="text-[12px]" style={{ color: c.textFaint }}>
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
            <p className="text-[12px] mb-1" style={{ color: c.textMuted }}>
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

/** 通用区块容器 */
function Section({
  title,
  subtitle,
  children,
  maxWidth = 'max-w-3xl',
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  const { theme } = useTheme();
  const c = useTianjiColors(theme);

  return (
    <div
      className={`rounded-xl p-5 sm:p-6 mb-6 ${maxWidth} mx-auto`}
      style={{ background: c.featureBg, border: `1px solid ${c.featureBord}` }}
    >
      <div className="flex items-baseline justify-between mb-3 gap-3 flex-wrap">
        <h3 className="text-sm font-serif tracking-wider" style={{ color: c.goldSolid }}>
          {title}
        </h3>
        {subtitle && (
          <span className="text-[12px]" style={{ color: c.textFaint }}>
            {subtitle}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

/** 爻位解读行 */
function YaoReadingRow({ r }: { r: YaoReading }) {
  const { theme } = useTheme();
  const c = useTianjiColors(theme);
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{
        border: `1px solid ${r.isChanging ? c.goldLine : c.cardBorder}`,
        background: r.isChanging ? c.glowTint : 'transparent',
      }}
    >
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-label={`${r.title} 解读`}
        className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors"
      >
        <span className="text-xs font-medium w-10 shrink-0" style={{ color: c.goldSolid }}>
          {r.title.split(' · ')[0]}
        </span>
        <span
          className="text-[12px] px-1.5 py-0.5 rounded shrink-0"
          style={{ border: `1px solid ${c.cardBorder}`, color: c.textMuted }}
        >
          {r.yaoNature}
        </span>
        <span
          className="text-[12px] px-1.5 py-0.5 rounded shrink-0"
          style={{ border: `1px solid ${c.cardBorder}`, color: c.textMuted }}
        >
          {r.deweiText}
        </span>
        {r.isChanging && (
          <span className="text-[12px] px-1.5 py-0.5 rounded shrink-0" style={{ background: c.ctaBg, color: c.ctaText }}>
            动爻
          </span>
        )}
        <span className="flex-1" />
        <span className="text-[12px] shrink-0" style={{ color: c.textFaint }}>
          {open ? '收起' : '展开'}
        </span>
      </button>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="px-3 pb-3"
        >
          <p className="text-xs leading-relaxed" style={{ color: c.textSecond }}>
            {r.reading}
          </p>
        </motion.div>
      )}
    </div>
  );
}

/** 变卦 / 互卦 解读块 */
function RelationBlock({ r, accent }: { r: RelationReading; accent?: boolean }) {
  const { theme } = useTheme();
  const c = useTianjiColors(theme);

  return (
    <Section title={r.title} subtitle={r.subtitle} maxWidth="max-w-3xl">
      <p
        className="text-sm leading-relaxed"
        style={{ color: accent ? c.textPrimary : c.textSecond }}
      >
        {r.body}
      </p>
    </Section>
  );
}

/** 宜忌块 */
function AdviceBlock({ advice }: { advice: Advice }) {
  const { theme } = useTheme();
  const c = useTianjiColors(theme);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 max-w-3xl mx-auto">
      <div
        className="rounded-xl p-5"
        style={{ background: c.featureBg, border: `1px solid ${c.featureBord}` }}
      >
        <h3 className="text-sm font-serif mb-3" style={{ color: c.goldSolid }}>
          宜
        </h3>
        <ul className="space-y-1.5">
          {advice.yi.map((t, i) => (
            <li key={i} className="text-xs leading-relaxed flex gap-2" style={{ color: c.textSecond }}>
              <span style={{ color: c.goldSolid }}>·</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
      <div
        className="rounded-xl p-5"
        style={{ background: c.featureBg, border: `1px solid ${c.featureBord}` }}
      >
        <h3 className="text-sm font-serif mb-3" style={{ color: c.goldSolid }}>
          忌
        </h3>
        <ul className="space-y-1.5">
          {advice.ji.map((t, i) => (
            <li key={i} className="text-xs leading-relaxed flex gap-2" style={{ color: c.textSecond }}>
              <span style={{ color: c.goldSolid }}>·</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function QiguaResult({ result, onAskAi }: Props) {
  const { theme } = useTheme();
  const c = useTianjiColors(theme);

  const hasChanged = result.changingLines.length > 0;
  const reading = useMemo(() => buildFullReading(result), [result]);
  const relatedQuotes = useMemo(
    () => pickRelatedQuotes(result.hexagram?.name ?? null, result.upper, result.lower),
    [result.hexagram?.name, result.upper, result.lower],
  );
  const [question, setQuestion] = useState('');

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

      {/* 所占之事（供 AI 断卦使用） */}
      {onAskAi && (
        <div className="max-w-xl mx-auto mb-8">
          <label
            htmlFor="qigua-question"
            className="block text-[12px] tracking-[0.25em] mb-2 text-center"
            style={{ color: c.textMuted }}
          >
            所占之事（选填 · 写下来断得更准）
          </label>
          <input
            id="qigua-question"
            type="text"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="如：这次换工作是否可行？"
            className="w-full px-4 py-2.5 rounded-lg text-sm text-center outline-none transition-colors"
            style={{
              background: c.cardBg,
              border: `1px solid ${c.cardBorder}`,
              color: c.textPrimary,
            }}
          />
        </div>
      )}

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
        <Section title="倪师断事要诀" subtitle="本卦断语">
          <p className="text-sm leading-relaxed" style={{ color: c.textSecond }}>
            {result.hexagram.divination}
          </p>
        </Section>
      )}

      {/* 变卦 / 互卦 解读 */}
      {reading.changed && <RelationBlock r={reading.changed} accent />}
      {reading.hu && <RelationBlock r={reading.hu} />}

      {/* 六爻逐爻解读 */}
      {reading.yaoReadings.length > 0 && (
        <Section
          title="六爻逐爻解读"
          subtitle={hasChanged ? '动爻已高亮 · 点击展开' : '静卦 · 点击展开'}
        >
          <div className="space-y-2">
            {reading.yaoReadings.map(r => (
              <YaoReadingRow key={r.pos} r={r} />
            ))}
          </div>
        </Section>
      )}

      {/* 宜 / 忌 */}
      {reading.advice && <AdviceBlock advice={reading.advice} />}

      {/* B12 · 倪师语录 · 关联本卦 */}
      {relatedQuotes.length > 0 && (
        <Section title="倪师语录 · 关联本卦" subtitle={`与「${result.hexagram?.name ?? result.upper + result.lower}」相关`}>
          <div>
            {relatedQuotes.map((q, i) => (
              <NiQuoteRow key={i} quote={q} accent={i === 0} />
            ))}
          </div>
        </Section>
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
        {onAskAi && (
          <button
            type="button"
            onClick={() => onAskAi(question.trim())}
            aria-label="用 AI 解读这一卦"
            className="px-6 py-2.5 rounded-full text-xs tracking-[0.2em] font-medium transition-all"
            style={{ background: c.ctaBg, color: c.ctaText }}
          >
            问天纪
          </button>
        )}
        <button
          type="button"
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
