'use client';

/**
 * /renji/shanghan 《伤寒论》核心方剂库
 *
 * 32 张核心方剂按六经（太阳/阳明/少阳/太阴/少阴/厥阴）展示
 * 倪海厦《人纪》精讲之方
 */

import Link from 'next/link';
import CrossLinks from '@/components/CrossLinks';
import { useState, useMemo } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { useTianjiColors } from '../../tianji/_colors';
import {
  SHANGHAN_FORMULAS,
  groupByJingluo,
  topHerbs,
  type ShangHanFormula,
} from '@/lib/renji/shanghan';
import TianjiFadeIn from '../../tianji/TianjiFadeIn';
import NihaiHero from '@/components/NihaiHero';
import SiteFooter from '@/components/SiteFooter';

const JING_LUO: ShangHanFormula['jingluo'][] = ['太阳', '阳明', '少阳', '太阴', '少阴', '厥阴'];

export default function ShanghanPage() {
  const { theme } = useTheme();
  const c = useTianjiColors(theme);
  const [jingluoFilter, setJingluoFilter] = useState<'all' | ShangHanFormula['jingluo']>('all');
  const [searchQ, setSearchQ] = useState('');
  const [selectedNo, setSelectedNo] = useState<number | null>(null);

  const filtered = useMemo(() => {
    let list = SHANGHAN_FORMULAS;
    if (jingluoFilter !== 'all') list = list.filter(f => f.jingluo === jingluoFilter);
    if (searchQ.trim()) {
      const q = searchQ.trim();
      // 全字段召回：方名 / 主治 / 主症 / 君药 / 组成 / 倪师要点 / 现代应用
      list = list.filter(f =>
        f.name.includes(q) ||
        f.indication.includes(q) ||
        f.symptoms.includes(q) ||
        f.king.includes(q) ||
        f.composition.includes(q) ||
        f.niNote.includes(q) ||
        (f.modern?.includes(q) ?? false) ||
        f.preparation.includes(q),
      );
    }
    return list;
  }, [jingluoFilter, searchQ]);

  const groups = groupByJingluo();
  const herbs = topHerbs(12);
  const selected = filtered.find(f => f.no === selectedNo) ?? null;

  return (
    <main className="min-h-screen">
            {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 pt-12 pb-8">
        <NihaiHero
          badge="汉·张仲景 · 113 方"
          title="《伤寒论》方剂"
          titleSize="clamp(48px, 8vw, 96px)"
          description={
            <>
              按六经辨证 · 太阳 / 阳明 / 少阳 / 太阴 / 少阴 / 厥阴
              <br />
              每一经皆有其主方，君臣佐使各有定法。
            </>
          }
        />
      </section>

      {/* 过滤 */}
      <section className="max-w-5xl mx-auto px-4 pb-4">
        <TianjiFadeIn delay={0.05}>
          <div className="flex flex-col md:flex-row items-center justify-center gap-3">
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {(['all', ...JING_LUO] as const).map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setJingluoFilter(opt)}
                  className="px-3 py-1.5 rounded-full text-[13px] tracking-wider transition-colors"
                  style={{
                    background: jingluoFilter === opt ? c.goldSolid : c.featureBg,
                    color: jingluoFilter === opt ? '#fff' : c.textMuted,
                    border: `1px solid ${jingluoFilter === opt ? c.goldSolid : c.featureBord}`,
                  }}
                >
                  {opt === 'all' ? '全部六经' : `${opt}经`}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="搜索方名 / 主治 / 症状…"
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              className="text-[13px] px-3 py-1.5 rounded-full outline-none"
              style={{
                background: c.featureBg,
                border: `1px solid ${c.featureBord}`,
                color: c.textPrimary,
                minWidth: '200px',
              }}
            />
          </div>
        </TianjiFadeIn>
      </section>

      {/* 方剂表 */}
      <section className="max-w-5xl mx-auto px-4 pb-10">
        <TianjiFadeIn delay={0.1}>
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: c.cardBg, border: `1px solid ${c.featureBord}` }}
          >
            <div
              className="grid grid-cols-12 gap-2 px-4 py-3 text-[12px] tracking-[0.2em]"
              style={{
                background: c.featureBg,
                color: c.tagText,
                borderBottom: `1px solid ${c.featureBord}`,
              }}
            >
              <div className="col-span-1">#</div>
              <div className="col-span-2">方名</div>
              <div className="col-span-1">经</div>
              <div className="col-span-3">主治</div>
              <div className="col-span-2">君药</div>
              <div className="col-span-3">关键</div>
            </div>
            {filtered.length === 0 ? (
              <div className="px-4 py-12 text-center" style={{ color: c.textFaint }}>
                未找到匹配方剂
              </div>
            ) : (
              filtered.map(f => (
                <button
                  key={f.no}
                  type="button"
                  onClick={() => setSelectedNo(f.no === selectedNo ? null : f.no)}
                  className="w-full grid grid-cols-12 gap-2 px-4 py-3 text-left text-[13px] transition-colors hover:!bg-[rgba(184,146,42,0.05)]"
                  style={{
                    borderBottom: `1px solid ${c.featureBord}`,
                    background: selectedNo === f.no ? 'rgba(184,146,42,0.08)' : 'transparent',
                    color: c.textPrimary,
                  }}
                >
                  <div className="col-span-1 font-mono" style={{ color: c.textFaint }}>
                    {f.no}
                  </div>
                  <div className="col-span-2 font-serif font-medium" style={{ color: c.goldSolid }}>
                    {f.name}
                  </div>
                  <div className="col-span-1 text-[12px]">
                    <span
                      className="px-1.5 py-0.5 rounded"
                      style={{
                        background: c.featureBg,
                        border: `1px solid ${c.featureBord}`,
                        color: c.textMuted,
                      }}
                    >
                      {f.jingluo}
                    </span>
                  </div>
                  <div className="col-span-3 truncate" style={{ color: c.textSecond }} title={f.indication}>
                    {f.indication}
                  </div>
                  <div className="col-span-2" style={{ color: c.textSecond }}>
                    {f.king}
                  </div>
                  <div className="col-span-3 truncate" style={{ color: c.textFaint }} title={f.composition}>
                    {f.composition}
                  </div>
                </button>
              ))
            )}
          </div>
          <div className="mt-2 text-[12px] tracking-widest text-right" style={{ color: c.textFaint }}>
            共 {SHANGHAN_FORMULAS.length} 方 · 当前显示 {filtered.length} 方
          </div>
        </TianjiFadeIn>
      </section>

      {/* 详情 */}
      {selected && (
        <section className="max-w-5xl mx-auto px-4 pb-10">
          <TianjiFadeIn key={selected.no}>
            <div
              className="rounded-2xl p-6 lg:p-8"
              style={{
                background: c.cardBg,
                border: `1px solid ${c.goldLine}`,
                boxShadow: `0 4px 24px ${c.goldSolid}10`,
              }}
            >
              <div className="flex items-start gap-4 mb-5">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center font-serif shrink-0"
                  style={{
                    background: c.goldSolid,
                    color: '#fff',
                    fontSize: '18px',
                  }}
                >
                  第 {selected.no}
                </div>
                <div className="flex-1">
                  <div className="text-[12px] tracking-[0.3em] mb-1" style={{ color: c.tagText }}>
                    {selected.jingluo}经 · 君药：{selected.king}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-serif tracking-wider" style={{ color: c.textPrimary }}>
                    {selected.name}
                  </h2>
                  <p className="text-[14px] mt-2" style={{ color: c.goldSolid }}>
                    {selected.indication}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-5">
                <div className="rounded-lg p-4" style={{ background: c.featureBg, border: `1px solid ${c.featureBord}` }}>
                  <div className="text-[12px] tracking-[0.2em] mb-2" style={{ color: c.tagText }}>
                    主症
                  </div>
                  <p className="text-[13px] leading-relaxed font-serif" style={{ color: c.textPrimary }}>
                    {selected.symptoms}
                  </p>
                </div>
                <div className="rounded-lg p-4" style={{ background: c.featureBg, border: `1px solid ${c.featureBord}` }}>
                  <div className="text-[12px] tracking-[0.2em] mb-2" style={{ color: c.tagText }}>
                    组成
                  </div>
                  <p className="text-[13px] leading-relaxed font-serif" style={{ color: c.textPrimary }}>
                    {selected.composition}
                  </p>
                </div>
              </div>

              {selected.preparation && (
                <div className="rounded-lg p-4 mb-5" style={{ background: c.featureBg, border: `1px solid ${c.featureBord}` }}>
                  <div className="text-[12px] tracking-[0.2em] mb-2" style={{ color: c.tagText }}>
                    煎服法
                  </div>
                  <p className="text-[13px] leading-relaxed font-serif" style={{ color: c.textPrimary }}>
                    {selected.preparation}
                  </p>
                </div>
              )}

              <div
                className="rounded-xl p-5 mb-3"
                style={{
                  background: c.featureBg,
                  border: `1px solid ${c.featureBord}`,
                  borderLeft: `4px solid ${c.goldSolid}`,
                }}
              >
                <div className="text-[12px] tracking-[0.3em] mb-2" style={{ color: c.goldSolid }}>
                  倪师要点
                </div>
                <p className="text-[14px] leading-relaxed font-serif" style={{ color: c.textPrimary }}>
                  {selected.niNote}
                </p>
              </div>

              {selected.modern && (
                <div className="rounded-lg p-4" style={{ background: c.featureBg, border: `1px solid ${c.featureBord}` }}>
                  <div className="text-[12px] tracking-[0.2em] mb-2" style={{ color: c.tagText }}>
                    现代应用
                  </div>
                  <p className="text-[13px] leading-relaxed" style={{ color: c.textSecond }}>
                    {selected.modern}
                  </p>
                </div>
              )}
            </div>
          </TianjiFadeIn>
        </section>
      )}

      {/* 高频药材 */}
      <section className="max-w-5xl mx-auto px-4 pb-12">
        <TianjiFadeIn delay={0.15}>
          <div className="mb-6">
            <div className="text-[12px] tracking-[0.3em] mb-2" style={{ color: c.tagText }}>
              药材使用频次
            </div>
            <h3 className="text-2xl font-serif tracking-wider" style={{ color: c.textPrimary }}>
              核心药材 · Top {herbs.length}
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {herbs.map(h => (
              <span
                key={h.herb}
                className="px-3 py-1.5 rounded-full text-[13px]"
                style={{
                  background: c.featureBg,
                  border: `1px solid ${c.featureBord}`,
                  color: c.textPrimary,
                  fontWeight: h.count > 8 ? 600 : 400,
                }}
              >
                {h.herb}
                <span style={{ color: c.goldSolid, marginLeft: '4px', fontSize: '12px' }}>{h.count}</span>
              </span>
            ))}
          </div>
        </TianjiFadeIn>
      </section>

      {/* A4-4 · 延伸阅读 */}
      <div className="max-w-5xl mx-auto px-4">
        <CrossLinks
          links={[
            { href: '/renji/jingui', label: '《金匮要略》方剂 →', desc: '40 首杂病方，按篇章速查' },
            { href: '/library/search?q=伤寒', label: '古籍检索「伤寒」→', desc: '在原典库中查找相关原文' },
            { href: '/renji', label: '人纪总览 →', desc: '倪师人纪体系全貌' },
            { href: '/diji', label: '地纪 · 堪舆 →', desc: '地理与人文的另一半学问' },
          ]}
        />
      </div>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-4 pb-10 pt-6" style={{ borderTop: `1px solid ${c.featureBord}` }}>
        <div className="flex flex-wrap items-center justify-center gap-4 text-[13px]">
          <Link href="/renji" className="tracking-wider hover:underline" style={{ color: c.textSecond }}>
            ← 人纪总览
          </Link>
          <span style={{ color: c.textFaint }}>·</span>
          <Link href="/renji/jingui" className="tracking-wider hover:underline" style={{ color: c.goldSolid }}>
            《金匮要略》方剂 →
          </Link>
        </div>
              <SiteFooter compact as="div" />
      </footer>
    </main>
  );
}