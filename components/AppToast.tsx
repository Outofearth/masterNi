'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/components/ThemeProvider';
import { useEffect } from 'react';

// ─── 筹备中 Toast 组件 ─────────────────────────────────────
// - 右下角浮出，3 秒自动消失
// - 金色边框 + 主题感知背景
// - role=status + aria-live=polite 满足屏幕阅读器
//
// 使用方式：父组件维护 [toast, setToast] state，
// <AppToast message={toast} onClose={() => setToast(null)} />
// 3 秒后自动清空（toast=null 时即隐藏）。

interface Props {
  message: string | null;
  onClose: () => void;
  duration?: number;
}

export default function AppToast({ message, onClose, duration = 3000 }: Props) {
  const { theme } = useTheme();
  const d = theme === 'dark';

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [message, duration, onClose]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, x: 24, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 24, transition: { duration: 0.18 } }}
          transition={{ type: 'spring', stiffness: 280, damping: 26 }}
          className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 z-[100] pointer-events-auto"
          style={{ maxWidth: 'min(360px, calc(100vw - 32px))' }}
        >
          <div
            className="relative rounded-xl px-4 py-3 shadow-lg"
            style={{
              background: d ? 'rgba(20,30,50,0.92)'    : 'rgba(252,248,236,0.96)',
              border: `1px solid ${d ? 'rgba(212,168,67,0.45)' : 'rgba(140,100,20,0.4)'}`,
              boxShadow: d
                ? '0 10px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,168,67,0.1)'
                : '0 10px 30px rgba(140,100,20,0.15), 0 0 0 1px rgba(212,168,67,0.08)',
              backdropFilter: 'blur(10px)',
              transition: 'background 0.35s ease',
            }}
          >
            {/* 左侧金色装饰条 */}
            <div
              aria-hidden="true"
              className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full"
              style={{
                background: d
                  ? 'linear-gradient(to bottom, #d4a843, #f0d070)'
                  : 'linear-gradient(to bottom, #8b6410, #d4a843)',
              }}
            />

            {/* 顶部行：标题 + 关闭按钮 */}
            <div className="flex items-start justify-between gap-3 mb-1">
              <div
                className="text-[10px] tracking-[0.3em] font-medium"
                style={{ color: d ? '#d4a843' : '#8b6410' }}
              >
                筹备中 · Coming Soon
              </div>
              <button
                onClick={onClose}
                aria-label="关闭提示"
                className="flex-shrink-0 -mt-0.5 -mr-1 w-5 h-5 flex items-center justify-center rounded-full transition-colors"
                style={{
                  color: d ? 'rgba(180,200,230,0.55)' : 'rgba(90,98,117,0.55)',
                }}
              >
                <span className="text-base leading-none">×</span>
              </button>
            </div>

            {/* 正文 */}
            <div
              className="text-[12px] sm:text-[13px] leading-relaxed pl-0"
              style={{
                color: d ? '#b8c6df' : '#3a3f4a',
                transition: 'color 0.35s ease',
              }}
            >
              {message}
            </div>

            {/* 底部进度条（视觉提示剩余时间） */}
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: duration / 1000, ease: 'linear' }}
              aria-hidden="true"
              className="absolute bottom-0 left-0 h-0.5 rounded-b-xl"
              style={{
                background: d
                  ? 'linear-gradient(to right, #d4a843, #f0d070)'
                  : 'linear-gradient(to right, #8b6410, #d4a843)',
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}