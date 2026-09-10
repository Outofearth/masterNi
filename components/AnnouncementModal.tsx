'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 公告版本号——以后想再弹新公告，改这里就行（旧版 key 失效，新版重新弹一次）
const ANNOUNCEMENT_VERSION = '2026-09-09';
const STORAGE_KEY = `announcement_seen_${ANNOUNCEMENT_VERSION}`;

/** 本次更新要点（改版本号时同步更新这里） */
const UPDATES: { tag: string; text: string }[] = [
  {
    tag: '知识库',
    text: '182 个「星曜 × 宫位」页面全部恢复，内容取自古籍原文与倪师讲义；暂无资料的宫位诚实标注，不编造。',
  },
  {
    tag: '讲义入库',
    text: '倪师《天纪》紫微斗数讲义整理入库：15 集切分、清洗、建索引，可作为研究与引用来源。',
  },
  {
    tag: '命盘速览',
    text: '命盘页新增「命盘速览」：命格总览 / 本命四化 / 格局识别 / 大限运程 / 相似名人比对。',
  },
  {
    tag: '星曜速查',
    text: '点主星先看静态解读（不消耗提问次数），想深入再一键交给 AI。',
  },
  {
    tag: '分享与历史',
    text: '支持一键分享命盘链接（打开即回填），并本地留存最近 10 条排盘记录。',
  },
  {
    tag: '导航修正',
    text: '补上「地纪 / 人纪」入口，「起名」更正为实际功能「合婚」。',
  },
];

export default function AnnouncementModal() {
  // 默认不开，client 端 useEffect 检查 localStorage 后立即决定是否弹出。
  // 没看过 → 立即覆盖首页；看过 → 不再弹。
  const [open, setOpen] = useState(false);
  const [decided, setDecided] = useState(false); // hydration 完成标志

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const seen = localStorage.getItem(STORAGE_KEY);
      if (!seen) setOpen(true);
    } catch { /* localStorage 可能被禁，忽略 */ }
    setDecided(true);
  }, []);

  // 公告打开时锁住 body 滚动，防止背后首页可滚
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  const close = () => {
    setOpen(false);
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch { /* skip */ }
  };

  // 用户控制与自由（Nielsen 可用性原则 #3）：ESC 也能关，不必非点按钮
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!decided) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          // 点击遮罩也可关闭（原实现强制点按钮，对回访用户过于强硬）
          onClick={close}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(20,12,2,0.88)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px',
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="版本更新公告"
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(180deg, #fefcf6 0%, #faf3e3 100%)',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '640px',
              maxHeight: 'min(85vh, 760px)',
              overflow: 'hidden',
              boxShadow: '0 24px 80px rgba(60,30,10,0.4), 0 4px 16px rgba(60,30,10,0.2)',
              border: '1px solid rgba(184,146,42,0.25)',
              display: 'flex',
              flexDirection: 'column',
              fontFamily: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
            }}
          >
            {/* 顶部装饰 + 关闭按钮 */}
            <div style={{
              padding: '22px 28px 14px',
              borderBottom: '1px solid rgba(184,146,42,0.15)',
              background: 'linear-gradient(180deg, rgba(184,146,42,0.08) 0%, transparent 100%)',
              flexShrink: 0,
              position: 'relative',
            }}>
              <div style={{ fontSize: '10px', letterSpacing: '0.4em', color: '#b8922a', opacity: 0.7, marginBottom: '6px' }}>
                WHAT&apos;S NEW
              </div>
              <h2 style={{ fontSize: '19px', fontWeight: 700, color: '#3d2f10', letterSpacing: '0.08em', margin: 0 }}>
                本次更新 · {ANNOUNCEMENT_VERSION}
              </h2>
              <button
                onClick={close}
                aria-label="关闭公告"
                style={{
                  position: 'absolute', top: '14px', right: '16px',
                  width: '28px', height: '28px',
                  background: 'rgba(184,146,42,0.08)',
                  border: '1px solid rgba(184,146,42,0.2)',
                  borderRadius: '50%',
                  color: '#7a5e2a', fontSize: '14px',
                  cursor: 'pointer', lineHeight: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >×</button>
            </div>

            {/* 更新概要 banner */}
            <div style={{
              margin: '14px 22px 0',
              padding: '12px 16px',
              background: 'linear-gradient(135deg, #fff5e3 0%, #ffe1c0 100%)',
              border: '1.5px dashed rgba(184,146,42,0.5)',
              borderRadius: '12px',
              flexShrink: 0,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '10px', letterSpacing: '0.3em', color: '#c45a2d', marginBottom: '4px', fontWeight: 600 }}>
                UPDATE · 本次更新
              </div>
              <div style={{ fontSize: '14px', color: '#8b3a1a', fontWeight: 600, lineHeight: 1.6 }}>
                知识库空壳已修复 · 倪师讲义入库 · 命盘页新增三项能力
              </div>
            </div>

            {/* 正文（可滚动）*/}
            <div style={{
              padding: '18px 28px 24px',
              overflowY: 'auto',
              fontSize: '14px',
              lineHeight: 1.85,
              color: '#5a4a30',
              flex: 1,
            }}>
              <p style={{ margin: '0 0 14px' }}>
                这一版主要做了两件事：<strong>把空着的知识库补上</strong>，以及<strong>把写好却没接线的功能挂上去</strong>。
              </p>

              <div style={{ display: 'grid', gap: 10 }}>
                {UPDATES.map(u => (
                  <div key={u.tag} style={{
                    padding: '10px 14px',
                    background: 'rgba(184,146,42,0.06)',
                    borderLeft: '3px solid rgba(184,146,42,0.45)',
                    borderRadius: '0 8px 8px 0',
                  }}>
                    <div style={{
                      fontSize: '11px', letterSpacing: '0.15em', color: '#b8922a',
                      fontWeight: 600, marginBottom: '3px',
                    }}>
                      {u.tag}
                    </div>
                    <div style={{ fontSize: '13px', lineHeight: 1.7, color: '#5a4a30' }}>
                      {u.text}
                    </div>
                  </div>
                ))}
              </div>

              <p style={{
                margin: '16px 0 0',
                padding: '10px 14px',
                background: 'rgba(184,146,42,0.07)',
                borderLeft: '3px solid rgba(184,146,42,0.45)',
                borderRadius: '0 8px 8px 0',
                fontStyle: 'italic',
                color: '#7a5e2a',
              }}>
                内容取自项目已收录的古籍与讲义；暂无资料处一律标注，不做编造。
              </p>
            </div>

            {/* 底部按钮 */}
            <div style={{
              padding: '14px 22px',
              borderTop: '1px solid rgba(184,146,42,0.15)',
              background: 'rgba(184,146,42,0.04)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              flexShrink: 0,
            }}>
              <span style={{ fontSize: '11px', color: '#7a5e2a', opacity: 0.7 }}>
                按 Esc 或点击外部也可关闭 · 仅此一次
              </span>
              <button
                onClick={close}
                style={{
                  padding: '10px 24px',
                  background: 'linear-gradient(135deg, #b8922a 0%, #9a7a20 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '13px',
                  letterSpacing: '0.1em',
                  fontWeight: 500,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(184,146,42,0.3)',
                }}
              >
                我知道了
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
