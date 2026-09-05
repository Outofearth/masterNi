'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/components/ThemeProvider';
import { useTianjiColors, useSyncBodyBackground } from '@/app/tianji/_colors';
import TianjiFadeIn from '@/app/tianji/TianjiFadeIn';
import QiguaCoin from '@/components/QiguaCoin';
import QiguaForm from '@/components/QiguaForm';
import QiguaResult from '@/components/QiguaResult';
import { type DivinationResult, hexagramSummary } from '@/lib/qigua/core';

const TABS = [
  { key: 'coin', label: '铜钱起卦', desc: '摇六次 · 观阴阳' },
  { key: 'time', label: '时间起卦', desc: '年月日时 · 心动则占' },
  { key: 'number', label: '数字起卦', desc: '两数成象 · 随心而取' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

const STORAGE_KEY = 'ziwei-qigua-history-v1';

interface HistoryItem {
  at: number;
  methodLabel: string;
  hexName: string;
  summary: string;
}

export default function QiguaPage() {
  const { theme } = useTheme();
  const c = useTianjiColors(theme);
  useSyncBodyBackground(c.bgBase);

  const [active, setActive] = useState<TabKey>('coin');
  const [result, setResult] = useState<DivinationResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  function handleResult(r: DivinationResult) {
    setResult(r);
    const item: HistoryItem = {
      at: Date.now(),
      methodLabel: r.methodLabel,
      hexName: r.hexagram?.name ?? '未知',
      summary: hexagramSummary(r.hexagram),
    };
    const next = [item, ...history].slice(0, 20);
    setHistory(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }

  const methodNode = useMemo(() => {
    switch (active) {
      case 'coin': return <QiguaCoin onResult={handleResult} key="coin" />;
      case 'time': return <QiguaForm mode="time" onResult={handleResult} key="time" />;
      case 'number': return <QiguaForm mode="number" onResult={handleResult} key="number" />;
    }
  }, [active]);

  return (
    <main className="min-h-screen pb-24" style={{ background: c.bgBase }}>
      {/* Hero */}
      <section className="relative pt-28 sm:pt-32 pb-12 px-6 text-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${c.glowTint} 0%, transparent 60%)`,
          }}
        />
        <TianjiFadeIn className="relative z-10">
          <h1
            className="text-3xl sm:text-4xl font-serif tracking-[0.25em] mb-4"
            style={{ color: c.goldSolid }}
          >
            起卦问天
          </h1>
          <p className="text-sm max-w-xl mx-auto mb-6" style={{ color: c.textSecond }}>
            心诚则灵，一事一占。三种传统起卦法，皆在本地运算，无需联网。
          </p>
        </TianjiFadeIn>

        {/* 方法 Tab */}
        <TianjiFadeIn delay={0.15} className="relative z-10">
          <div
            className="inline-flex flex-wrap justify-center gap-2 sm:gap-3 p-1.5 rounded-full mx-auto"
            style={{ background: c.cardBg, border: `1px solid ${c.cardBorder}` }}
            role="tablist"
            aria-label="起卦方法"
          >
            {TABS.map((t) => {
              const selected = t.key === active;
              return (
                <button
                  key={t.key}
                  role="tab"
                  aria-selected={selected}
                  onClick={() => { setActive(t.key); setResult(null); }}
                  className="relative px-4 sm:px-5 py-2 rounded-full text-[11px] sm:text-xs tracking-wider transition-colors"
                  style={{
                    color: selected ? '#08080a' : c.textMuted,
                    background: selected ? c.goldSolid : 'transparent',
                  }}
                >
                  <span className="block">{t.label}</span>
                  <span
                    className="block text-[9px] mt-0.5 opacity-70"
                    style={{ color: selected ? '#08080a' : c.textFaint }}
                  >
                    {t.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </TianjiFadeIn>
      </section>

      {/* 起卦交互区 */}
      <section className="px-4 sm:px-6 mb-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25 }}
            className="max-w-3xl mx-auto"
          >
            <div
              className="rounded-2xl p-5 sm:p-8"
              style={{ background: c.featureBg, border: `1px solid ${c.featureBord}` }}
            >
              {methodNode}
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* 结果区 */}
      <AnimatePresence>
        {result && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <QiguaResult result={result} />
          </motion.section>
        )}
      </AnimatePresence>

      {/* 最近历史 */}
      {mounted && history.length > 0 && (
        <section className="px-6 mt-16 max-w-3xl mx-auto">
          <h3
            className="text-xs tracking-[0.3em] mb-4 text-center"
            style={{ color: c.textMuted }}
          >
            最近起卦
          </h3>
          <div className="grid gap-2">
            {history.map((h, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg px-4 py-3"
                style={{ background: c.cardBg, border: `1px solid ${c.cardBorder}` }}
              >
                <div>
                  <span className="text-sm font-serif" style={{ color: c.textPrimary }}>
                    {h.hexName}
                  </span>
                  <span className="mx-2" style={{ color: c.textFaint }}>·</span>
                  <span className="text-[10px]" style={{ color: c.textMuted }}>
                    {h.methodLabel}
                  </span>
                </div>
                <span className="text-[9px]" style={{ color: c.textFaint }}>
                  {new Date(h.at).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
