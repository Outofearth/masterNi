'use client';
import { motion } from 'framer-motion';
import type { ZiweiChart, Palace } from '@/lib/ziwei/types';

/**
 * 合婚 · 关键宫位对比表（C10）
 *
 * 只呈现排盘结果的客观并排对比：宫位 / 双方主星 / 双方四化 / 是否出现同星共鸣。
 * 不做吉凶打分、不编造论断 —— 定性评分标准见 lib/ziwei/heming-knowledge.ts 的
 * HEMING_SCORE_CRITERIA，但那套标准是文字描述，没有可直接套用的算法，
 * 因此本页不显示分数，评分能力列入 TODO 待命理规则明确后再做。
 */

/** 合婚最相关的宫位（命宫看本质，夫妻宫看婚姻，福德宫看精神契合，财官看现实基础） */
const KEY_PALACES = ['命宫', '夫妻宫', '福德宫', '财帛宫', '官禄宫'] as const;

function findPalace(chart: ZiweiChart, name: string): Palace | undefined {
  return chart.palaces.find(p => p.name === name);
}

function majorStars(p?: Palace): string[] {
  if (!p) return [];
  return p.stars.filter(s => s.type === 'major').map(s => s.name);
}

function siHuaOf(p?: Palace): { star: string; siHua: string }[] {
  if (!p) return [];
  return p.stars.filter(s => s.siHua).map(s => ({ star: s.name, siHua: s.siHua! }));
}

const SIHUA_COLOR: Record<string, { text: string; bg: string; bdr: string }> = {
  '禄': { text: 'var(--lu)', bg: 'var(--lu-bg)', bdr: 'var(--lu-bdr)' },
  '权': { text: 'var(--quan)', bg: 'var(--quan-bg)', bdr: 'var(--quan-bdr)' },
  '科': { text: 'var(--ke)', bg: 'var(--ke-bg)', bdr: 'var(--ke-bdr)' },
  '忌': { text: 'var(--ji)', bg: 'var(--ji-bg)', bdr: 'var(--ji-bdr)' },
};

function StarCell({ stars, siHua }: { stars: string[]; siHua: { star: string; siHua: string }[] }) {
  if (stars.length === 0) {
    return <span style={{ fontSize: 11, color: 'var(--t-faint)' }}>空宫（借对宫）</span>;
  }
  return (
    <span style={{ display: 'inline-flex', flexWrap: 'wrap', gap: 4, alignItems: 'center' }}>
      {stars.map(s => (
        <span key={s} style={{ fontSize: 12, color: 'var(--star-major)', fontWeight: 500 }}>
          {s}
        </span>
      ))}
      {siHua.map(({ star, siHua: sh }) => {
        const c = SIHUA_COLOR[sh] ?? SIHUA_COLOR['禄'];
        return (
          <span
            key={star + sh}
            style={{
              fontSize: 9, padding: '1px 4px', borderRadius: 4,
              color: c.text, background: c.bg, border: `1px solid ${c.bdr}`,
            }}
          >
            {star}化{sh}
          </span>
        );
      })}
    </span>
  );
}

export default function HemingCompareTable({
  chartA,
  chartB,
  nameA = '甲方 A',
  nameB = '乙方 B',
}: {
  chartA: ZiweiChart;
  chartB: ZiweiChart;
  nameA?: string;
  nameB?: string;
}) {
  const rows = KEY_PALACES.map(name => {
    const pa = findPalace(chartA, name);
    const pb = findPalace(chartB, name);
    const sa = majorStars(pa);
    const sb = majorStars(pb);
    // 共鸣：同一宫位出现相同主星
    const resonance = sa.filter(s => sb.includes(s));
    return { name, pa, pb, sa, sb, resonance };
  });

  const totalResonance = rows.reduce((n, r) => n + r.resonance.length, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="card-glass rounded-xl p-4"
    >
      <div
        className="text-[10px] tracking-widest mb-3 flex items-center gap-2 flex-wrap"
        style={{ color: 'var(--t-faint)' }}
      >
        <span style={{ color: 'var(--t-gold)', opacity: 0.6 }}>⇄</span>
        关键宫位对比
        <span className="text-[9px] ml-auto" style={{ color: 'var(--t-faint)', opacity: 0.75 }}>
          同星共鸣 {totalResonance} 处
        </span>
      </div>

      {/* 表头 */}
      <div
        className="grid gap-2 pb-2 mb-2 text-[10px]"
        style={{
          gridTemplateColumns: '64px 1fr 1fr',
          borderBottom: '1px solid var(--t-border)',
          color: 'var(--t-faint)',
        }}
      >
        <div>宫位</div>
        <div>{nameA}</div>
        <div>{nameB}</div>
      </div>

      <div style={{ display: 'grid', gap: 8 }}>
        {rows.map(r => (
          <div
            key={r.name}
            className="grid gap-2 items-center rounded-lg px-2 py-2"
            style={{
              gridTemplateColumns: '64px 1fr 1fr',
              background: r.resonance.length > 0 ? 'rgba(212,168,67,0.05)' : 'transparent',
              border: r.resonance.length > 0 ? '1px solid rgba(212,168,67,0.18)' : '1px solid var(--t-border)',
            }}
          >
            <div className="text-[11px]" style={{ color: 'var(--t-text2)' }}>
              {r.name.replace('宫', '')}
            </div>
            <div><StarCell stars={r.sa} siHua={siHuaOf(r.pa)} /></div>
            <div><StarCell stars={r.sb} siHua={siHuaOf(r.pb)} /></div>
            {r.resonance.length > 0 && (
              <div
                className="text-[9px] col-span-3 -mt-1"
                style={{ color: 'var(--t-gold)', opacity: 0.85 }}
              >
                共鸣 · {r.resonance.join(' / ')}
              </div>
            )}
          </div>
        ))}
      </div>

      <div
        className="text-[9px] mt-3 pt-2"
        style={{
          borderTop: '1px solid var(--t-border)',
          color: 'var(--t-faint)',
          opacity: 0.7,
          lineHeight: 1.6,
        }}
      >
        「共鸣」指双方同一宫位出现相同主星，仅表示星性相近这一客观事实，不代表吉凶。
        本表不做评分 —— 合婚定性标准（五星～一星）见 HEMING_SCORE_CRITERIA，属文字描述无可套用算法，评分能力待命理规则明确后补上。
      </div>
    </motion.div>
  );
}
