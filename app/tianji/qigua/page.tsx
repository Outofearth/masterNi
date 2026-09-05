'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/components/ThemeProvider';
import { useTianjiColors, useSyncBodyBackground } from '@/app/tianji/_colors';
import TianjiFadeIn from '@/app/tianji/TianjiFadeIn';
import QiguaCoin from '@/components/QiguaCoin';
import QiguaForm from '@/components/QiguaForm';
import QiguaResult from '@/components/QiguaResult';
import TianjiChatPanel from '@/components/TianjiChatPanel';
import {
  type DivinationResult,
  type DivinationMeta,
  hexagramSummary,
  castByCoin,
  castByTime,
  castByNumber,
} from '@/lib/qigua/core';
import type { TianjiContext } from '@/lib/nihai/chat';

const TABS = [
  { key: 'coin', label: '铜钱起卦', desc: '摇六次 · 观阴阳' },
  { key: 'time', label: '时间起卦', desc: '年月日时 · 心动则占' },
  { key: 'number', label: '数字起卦', desc: '两数成象 · 随心而取' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

const STORAGE_KEY = 'ziwei-qigua-history-v1';
const MAX_HISTORY = 20;

interface HistoryItem {
  at: number;
  methodLabel: string;
  hexName: string;
  summary: string;
  /** 起卦参数，用于点击后原样重算 */
  meta: DivinationMeta;
  /** 当时填写的所占之事 */
  question?: string;
}

/** 依据历史参数重新起同一卦 */
function replayMeta(meta: DivinationMeta): DivinationResult | null {
  switch (meta.method) {
    case 'coin': return castByCoin(meta.yangCounts);
    case 'time': return castByTime(meta.year, meta.month, meta.day, meta.hour);
    case 'number': return castByNumber(meta.a, meta.b);
    default: return null;
  }
}

/** 历史参数的人类可读描述 */
function metaText(meta: DivinationMeta): string {
  switch (meta.method) {
    case 'coin':
      return `铜钱 [${meta.yangCounts.join(' ')}]`;
    case 'time':
      return `${meta.year}年${meta.month}月${meta.day}日 ${meta.hour}时`;
    case 'number':
      return `数字 ${meta.a} · ${meta.b}`;
    default:
      return '';
  }
}

export default function QiguaPage() {
  const { theme } = useTheme();
  const c = useTianjiColors(theme);
  useSyncBodyBackground(c.bgBase);

  const [active, setActive] = useState<TabKey>('coin');
  const [result, setResult] = useState<DivinationResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // 历史抽屉
  const [drawerOpen, setDrawerOpen] = useState(false);

  // AI 解读
  const [aiOpen, setAiOpen] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');
  const aiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // 旧版本历史没有 meta 字段，过滤掉以免重算失败
        setHistory(Array.isArray(parsed) ? parsed.filter((h: HistoryItem) => !!h?.meta) : []);
      }
    } catch {
      // ignore
    }
  }, []);

  const persist = useCallback((next: HistoryItem[]) => {
    setHistory(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  function handleResult(r: DivinationResult) {
    setResult(r);
    setAiOpen(false);
    setAiQuestion('');
    const item: HistoryItem = {
      at: Date.now(),
      methodLabel: r.methodLabel,
      hexName: r.hexagram?.name ?? '未知',
      summary: hexagramSummary(r.hexagram),
      meta: r.meta,
    };
    persist([item, ...history].slice(0, MAX_HISTORY));
  }

  /** 点击历史条目：原样重算并载入 */
  function handleReplay(item: HistoryItem) {
    const r = replayMeta(item.meta);
    if (!r) return;
    setResult(r);
    setAiOpen(false);
    setAiQuestion(item.question ?? '');
    setDrawerOpen(false);
    // 切到对应方法 Tab，便于"再起一卦"
    setActive(item.meta.method);
    setTimeout(() => {
      document.getElementById('qigua-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }

  function handleClearHistory() {
    persist([]);
    setDrawerOpen(false);
  }

  function handleRemove(at: number) {
    persist(history.filter(h => h.at !== at));
  }

  /** 点「问天纪」：打开 AI 面板并滚过去 */
  function handleAskAi(question: string) {
    // 把问题回填到当前最新一条历史，便于下次重看
    if (history.length) {
      const next = [...history];
      next[0] = { ...next[0], question };
      persist(next);
    }
    setAiQuestion(question);
    setAiOpen(true);
    setTimeout(() => {
      aiRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  const aiContext: TianjiContext = useMemo(() => {
    if (!result) return { type: 'general' };
    return {
      type: 'divination',
      data: {
        question: aiQuestion || undefined,
        methodLabel: result.methodLabel,
        ben: result.hexagram,
        changed: result.changedHexagram,
        hu: result.huHexagram,
        changingLines: result.changingLines,
      },
    };
  }, [result, aiQuestion]);

  const methodNode = useMemo(() => {
    switch (active) {
      case 'coin': return <QiguaCoin onResult={handleResult} key="coin" />;
      case 'time': return <QiguaForm mode="time" onResult={handleResult} key="time" />;
      case 'number': return <QiguaForm mode="number" onResult={handleResult} key="number" />;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                  onClick={() => { setActive(t.key); setResult(null); setAiOpen(false); }}
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

        {/* 历史入口 */}
        {mounted && history.length > 0 && (
          <div className="relative z-10 mt-5">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="px-4 py-1.5 rounded-full text-[10px] tracking-[0.2em] transition-colors"
              style={{ border: `1px solid ${c.goldLine}`, color: c.goldSolid }}
              aria-label="查看起卦历史"
            >
              起卦历史 · {history.length}
            </button>
          </div>
        )}
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
            id="qigua-result"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <QiguaResult result={result} onAskAi={handleAskAi} />
          </motion.section>
        )}
      </AnimatePresence>

      {/* AI 解读区 */}
      <AnimatePresence>
        {result && aiOpen && (
          <motion.section
            ref={aiRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="px-4 sm:px-6 mt-4"
          >
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs tracking-[0.3em]" style={{ color: c.textMuted }}>
                  AI 断卦
                </h3>
                <button
                  type="button"
                  onClick={() => setAiOpen(false)}
                  className="text-[10px] tracking-[0.2em]"
                  style={{ color: c.textFaint }}
                  aria-label="收起 AI 断卦"
                >
                  收起
                </button>
              </div>
              <TianjiChatPanel
                context={aiContext}
                title="问天纪 · 断此卦"
                subtitle={
                  result.hexagram
                    ? `${result.hexagram.name}卦${aiQuestion ? ' · ' + aiQuestion : ''}`
                    : undefined
                }
                height={560}
              />
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* 历史抽屉 */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-40"
              style={{ background: 'rgba(0,0,0,0.45)' }}
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm overflow-y-auto"
              style={{ background: c.bgBase, borderLeft: `1px solid ${c.cardBorder}` }}
              role="dialog"
              aria-label="起卦历史"
            >
              <div
                className="sticky top-0 px-5 py-4 flex items-center justify-between"
                style={{ background: c.bgBase, borderBottom: `1px solid ${c.navBorder}` }}
              >
                <h2 className="text-sm font-serif tracking-wider" style={{ color: c.goldSolid }}>
                  起卦历史
                </h2>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="text-lg leading-none px-2"
                  style={{ color: c.textMuted }}
                  aria-label="关闭历史"
                >
                  ×
                </button>
              </div>

              <div className="p-4 space-y-2">
                {history.length === 0 && (
                  <p className="text-xs text-center py-8" style={{ color: c.textFaint }}>
                    暂无起卦记录
                  </p>
                )}
                {history.map(h => (
                  <div
                    key={h.at}
                    className="rounded-lg p-3"
                    style={{ background: c.cardBg, border: `1px solid ${c.cardBorder}` }}
                  >
                    <button
                      type="button"
                      onClick={() => handleReplay(h)}
                      className="w-full text-left"
                      aria-label={`重新载入 ${h.hexName} 卦`}
                    >
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-serif" style={{ color: c.textPrimary }}>
                          {h.hexName}
                        </span>
                        <span className="text-[10px]" style={{ color: c.textMuted }}>
                          {h.methodLabel}
                        </span>
                        <span className="flex-1" />
                        <span className="text-[9px]" style={{ color: c.textFaint }}>
                          {new Date(h.at).toLocaleString('zh-CN', {
                            month: 'numeric', day: 'numeric',
                            hour: '2-digit', minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-[10px] mt-1" style={{ color: c.textFaint }}>
                        {metaText(h.meta)}
                        {h.question ? ` · ${h.question}` : ''}
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(h.at)}
                      className="text-[9px] mt-1.5"
                      style={{ color: c.textFaint }}
                      aria-label="删除这条记录"
                    >
                      删除
                    </button>
                  </div>
                ))}
              </div>

              {history.length > 0 && (
                <div className="p-4">
                  <button
                    type="button"
                    onClick={handleClearHistory}
                    className="w-full py-2 rounded-lg text-[10px] tracking-[0.2em]"
                    style={{ border: `1px solid ${c.cardBorder}`, color: c.textMuted }}
                  >
                    清空历史
                  </button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
