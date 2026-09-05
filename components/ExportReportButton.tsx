'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { downloadAsPng, printReport } from '@/lib/export/pdf-report';

interface Props {
  /** 抓图/打印的目标 DOM 节点 ref */
  targetRef: React.RefObject<HTMLElement | null>;
  /** 文件名（不含后缀） */
  filename: string;
  /** 打印对话框的标题 */
  printTitle: string;
  /** 主题色（古风金） */
  gold?: string;
  textColor?: string;
  borderColor?: string;
}

/**
 * B13 通用导出按钮
 *   · 导出 PNG：html2canvas 抓图 → 自动下载
 *   · 打印 / 另存 PDF：浏览器原生 print，配合 globals.css @media print 样式
 */
export default function ExportReportButton({
  targetRef,
  filename,
  printTitle,
  gold = '#b8922a',
  textColor = '#1a1a1a',
  borderColor = '#d4c89a',
}: Props) {
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
    if (!targetRef.current || busy) return;
    setBusy('png');
    setOpen(false);
    try {
      await downloadAsPng(targetRef.current, `${filename}.png`, {
        scale: 2,
        bgColor: '#f5efe0',
      });
    } catch (e) {
      // eslint-disable-next-line no-alert
      alert(`导出 PNG 失败：${e instanceof Error ? e.message : String(e)}\n请尝试「另存 PDF」`);
    } finally {
      setBusy(null);
    }
  }

  function handlePdf() {
    if (!targetRef.current || busy) return;
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
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] tracking-[0.2em] transition-all disabled:opacity-50"
        style={{
          border: `1px solid ${borderColor}`,
          color: textColor,
          background: 'transparent',
        }}
        aria-label="导出报告"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span style={{ color: gold }}>⤓</span>
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
              background: '#faf5e8',
              border: `1px solid ${borderColor}`,
              boxShadow: '0 8px 24px rgba(184,146,42,0.15)',
            }}
          >
            <button
              type="button"
              role="menuitem"
              onClick={handlePng}
              className="w-full text-left px-3 py-2.5 text-[11px] hover:bg-[rgba(184,146,42,0.08)] transition-colors"
              style={{ color: textColor }}
            >
              <div className="flex items-center gap-2">
                <span style={{ color: gold }}>▢</span>
                <div>
                  <div className="font-medium">导出 PNG</div>
                  <div className="text-[9px] opacity-60 mt-0.5">高清图片，可直接分享</div>
                </div>
              </div>
            </button>
            <div className="h-px" style={{ background: borderColor, opacity: 0.5 }} />
            <button
              type="button"
              role="menuitem"
              onClick={handlePdf}
              className="w-full text-left px-3 py-2.5 text-[11px] hover:bg-[rgba(184,146,42,0.08)] transition-colors"
              style={{ color: textColor }}
            >
              <div className="flex items-center gap-2">
                <span style={{ color: gold }}>⎙</span>
                <div>
                  <div className="font-medium">另存 PDF</div>
                  <div className="text-[9px] opacity-60 mt-0.5">打印对话框 → 选「另存为 PDF」</div>
                </div>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}