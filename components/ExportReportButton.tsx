'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { downloadAsPng, printReport, printSheet } from '@/lib/export/pdf-report';
import { BRAND } from '@/lib/brand';

interface Props {
  /** 抓图/打印的目标 DOM 节点 ref（默认沿用 app 内节点） */
  targetRef: React.RefObject<HTMLElement | null>;
  /**
   * 专用「报告纸张」ref（由父级渲染一份完整的报告 DOM 时传入）。
   * 传入后：
   *  · PNG 抓此 ref（避开 app 的 overflow:auto/固定高度导致的缺内容问题）
   *  · 另存 PDF 走「report-mode」打印路径，只打这份纸张（隐藏整个 app）
   * 不传则保持旧行为（PNG 抓 targetRef，PDF 走 body.print-mode 全局打印）。
   */
  sheetRef?: React.RefObject<HTMLElement | null>;
  /** 文件名（不含后缀） */
  filename: string;
  /** 打印对话框的标题 */
  printTitle: string;
  /** 主题色（古风金） */
  /** 强调色（默认跟随 size：panel 用面板金，sm 用文字金） */
  gold?: string;
  textColor?: string;
  borderColor?: string;
  /**
   * 触发器尺寸：
   *   · 'sm'    默认，导航栏/工具条里的紧凑款（text-13 · px-3 · py-1.5）
   *   · 'panel' 与面板内其它按钮同款（text-14 · px-2.5 · py-1.5），
   *             用于「AI 解读 / 命盘速览」面板头部，与 ShareButton 视觉重量对齐
   */
  size?: 'sm' | 'panel';
}

/**
 * B13 通用导出按钮
 *   · 导出 PNG：html2canvas 抓图 → 自动下载
 *   · 打印 / 另存 PDF：浏览器原生 print，配合 globals.css @media print 样式
 *
 * 颜色约定（P0-2）：默认值全部走语义 token / brand.ts，不再硬编 hex。
 * 此前默认 textColor=#1a1a1a 在暗色主题下几乎不可读，改为 --tx-1 随主题自适应。
 */
export default function ExportReportButton({
  targetRef,
  sheetRef,
  filename,
  printTitle,
  gold,
  textColor,
  borderColor,
  size = 'sm',
}: Props) {
  const panel = size === 'panel';
  // panel 尺寸与 ShareButton / InsightPanel 的导出按钮同款（金底金框金字）；
  // sm 尺寸沿用原工具条样式（透明底 + 文字色边框），避免影响其它调用点。
  const fg = textColor ?? (panel ? 'var(--t-gold)' : 'var(--tx-1)');
  const bd = borderColor ?? (panel ? 'rgba(212,168,67,0.28)' : 'var(--bdr-med)');
  const bg = panel ? 'rgba(212,168,67,0.12)' : 'transparent';
  const iconColor = gold ?? (panel ? 'currentColor' : 'var(--ac-text)');
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<'png' | 'pdf' | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // 点外面收起下拉
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  async function handlePng() {
    if (busy) return;
    const node = sheetRef?.current ?? targetRef.current;
    if (!node) return;
    setBusy('png');
    setOpen(false);
    try {
      await downloadAsPng(node, `${filename}.png`, {
        // 抓图前等字体就绪，避免 CJK 在第一次画图时缺字回退到方块
        scale: 2,
        // html2canvas 不接受 CSS 变量，用 brand.ts 米底（= --bg-0 同值）
        bgColor: BRAND.cream,
      });
    } catch (e) {
      // eslint-disable-next-line no-alert
      alert(`导出 PNG 失败：${e instanceof Error ? e.message : String(e)}\n请尝试「另存 PDF」`);
    } finally {
      setBusy(null);
    }
  }

  function handlePdf() {
    if (busy) return;
    if (sheetRef?.current) {
      // 报告纸张模式：单独打这一份 DOM（app 全隐藏），版式干净、margin 受控
      setBusy('pdf');
      setOpen(false);
      try {
        printSheet(printTitle);
      } finally {
        setTimeout(() => setBusy(null), 1000);
      }
      return;
    }
    if (!targetRef.current) return;
    setBusy('pdf');
    setOpen(false);
    try {
      printReport(targetRef.current, printTitle);
    } finally {
      // afterprint 事件会自动清掉 busy；保险起见 1s 后兜底
      setTimeout(() => setBusy(null), 1000);
    }
  }

  return (
    <div ref={wrapRef} className="relative inline-block export-btn-row">
      <motion.button
        type="button"
        onClick={() => setOpen(o => !o)}
        disabled={busy !== null}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.97 }}
        className={
          size === 'panel'
            ? 'flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[14px] font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed'
            : 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] tracking-[0.2em] transition-all disabled:opacity-50'
        }
        style={{
          border: `1px solid ${bd}`,
          color: fg,
          background: bg,
        }}
        aria-label="导出报告"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span style={{ color: iconColor }}>{panel ? (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        ) : '⤓'}</span>
        <span>{busy === 'png' ? '生成 PNG…' : busy === 'pdf' ? '准备打印…' : '导出报告'}</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            role="menu"
            className="absolute right-0 mt-1.5 w-52 rounded-lg overflow-hidden z-30"
            style={{
              background: 'var(--bg-card)',
              border: `1px solid ${bd}`,
              boxShadow: '0 8px 24px rgba(184,146,42,0.15)',
            }}
          >
            <button
              type="button"
              role="menuitem"
              onClick={handlePng}
              className="w-full text-left px-3 py-2.5 text-[13px] hover:bg-[rgba(184,146,42,0.08)] transition-colors"
              style={{ color: fg }}
            >
              <div className="flex items-center gap-2">
                <span style={{ color: iconColor }}>▢</span>
                <div>
                  <div className="font-medium">导出 PNG</div>
                  <div className="text-[12px] opacity-60 mt-0.5">高清图片，可直接分享</div>
                </div>
              </div>
            </button>
            <div className="h-px" style={{ background: bd, opacity: 0.5 }} />
            <button
              type="button"
              role="menuitem"
              onClick={handlePdf}
              className="w-full text-left px-3 py-2.5 text-[13px] hover:bg-[rgba(184,146,42,0.08)] transition-colors"
              style={{ color: fg }}
            >
              <div className="flex items-center gap-2">
                <span style={{ color: iconColor }}>⎙</span>
                <div>
                  <div className="font-medium">另存 PDF</div>
                  <div className="text-[12px] opacity-60 mt-0.5">打印对话框 → 选「另存为 PDF」</div>
                </div>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}