'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/components/ThemeProvider';
import { useTianjiColors } from '@/app/tianji/_colors';
import { castByTime, castByNumber, type DivinationResult } from '@/lib/qigua/core';

interface Props {
  mode: 'time' | 'number';
  onResult: (r: DivinationResult) => void;
}

function nowInputs() {
  const d = new Date();
  return {
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    day: d.getDate(),
    hour: d.getHours(),
  };
}

export default function QiguaForm({ mode, onResult }: Props) {
  const { theme } = useTheme();
  const c = useTianjiColors(theme);

  const [time, setTime] = useState(nowInputs());
  const [nums, setNums] = useState({ a: 1, b: 1 });
  const [error, setError] = useState('');

  function handleTimeSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const { year, month, day, hour } = time;
    if ([year, month, day, hour].some(v => Number.isNaN(v))) {
      setError('请输入合法的公历时间');
      return;
    }
    const r = castByTime(year, month, day, hour);
    onResult(r);
  }

  function handleNumberSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (nums.a <= 0 || nums.b <= 0) {
      setError('请输入两个正整数');
      return;
    }
    const r = castByNumber(nums.a, nums.b);
    onResult(r);
  }

  const inputBase: React.CSSProperties = {
    background: c.cardBg,
    border: `1px solid ${c.cardBorder}`,
    color: c.textPrimary,
  };

  const labelBase: React.CSSProperties = {
    color: c.textMuted,
  };

  return (
    <div className="w-full max-w-xl mx-auto" style={{ color: c.textPrimary }}>
      {mode === 'time' ? (
        <form onSubmit={handleTimeSubmit} className="space-y-4">
          <p className="text-center text-xs mb-4" style={{ color: c.textMuted }}>
            以当前心念所想时间为基准，自动取上卦、下卦与动爻
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { key: 'year', label: '年', max: 9999 },
              { key: 'month', label: '月', max: 12 },
              { key: 'day', label: '日', max: 31 },
              { key: 'hour', label: '时', max: 23 },
            ].map((f) => (
              <div key={f.key} className="flex flex-col gap-1">
                <label className="text-[10px] tracking-wider" style={labelBase}>
                  {f.label}
                </label>
                <input
                  type="number"
                  value={String((time as any)[f.key])}
                  onChange={(e) => {
                    const v = parseInt(e.target.value || '0', 10);
                    setTime(prev => ({ ...prev, [f.key]: v }));
                  }}
                  min={f.key === 'year' ? 1900 : 0}
                  max={f.max}
                  required
                  className="rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--ac)]"
                  style={inputBase}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="flex-1 py-2.5 rounded-lg text-xs tracking-[0.2em] font-medium"
              style={{ background: c.ctaBg, color: c.ctaText }}
            >
              时间起卦
            </motion.button>
            <button
              type="button"
              onClick={() => setTime(nowInputs())}
              className="px-4 py-2.5 rounded-lg text-[11px]"
              style={{ border: `1px solid ${c.cardBorder}`, color: c.textMuted }}
            >
              重置为现在
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleNumberSubmit} className="space-y-4">
          <p className="text-center text-xs mb-4" style={{ color: c.textMuted }}>
            默念所问之事，输入两个心中自然浮现的正整数
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'a', label: '上卦数' },
              { key: 'b', label: '下卦数' },
            ].map((f) => (
              <div key={f.key} className="flex flex-col gap-1">
                <label className="text-[10px] tracking-wider" style={labelBase}>
                  {f.label}
                </label>
                <input
                  type="number"
                  value={String((nums as any)[f.key])}
                  onChange={(e) => {
                    const v = parseInt(e.target.value || '0', 10);
                    setNums(prev => ({ ...prev, [f.key]: v }));
                  }}
                  min={1}
                  required
                  className="rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--ac)]"
                  style={inputBase}
                />
              </div>
            ))}
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full py-2.5 rounded-lg text-xs tracking-[0.2em] font-medium"
            style={{ background: c.ctaBg, color: c.ctaText }}
          >
            数字起卦
          </motion.button>
        </form>
      )}

      {error && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-center text-[11px]"
          style={{ color: '#c45c48' }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
