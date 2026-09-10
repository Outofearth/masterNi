'use client';

/**
 * 症状 → 穴位 检索器（人纪通用组件）
 *
 * 挂在 /renji 总览与 /renji/zhenjiu 子模块页。
 * 相比旧版改进：
 *   - 接 lib/renji/symptom-search 打分检索（口语词可命中，见单测 66 例）
 *   - 展示真实数据条数（不再硬编码 215）
 *   - 热门症状 / 分类 快捷入口
 *   - 显示 note 补充说明（旧版丢失）
 *   - 零结果时给兜底相近项 + 明确「库内暂未收录」提示
 *   - 支持 ?symptom=xxx 深链（配合全站搜索跳转）
 */

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import { useTianjiColors } from '@/app/tianji/_colors';
import {
  searchSymptoms,
  HOT_SYMPTOMS,
  SYMPTOM_CATEGORIES,
  SYMPTOM_TOTAL,
  type MatchReason,
} from '@/lib/renji/symptom-search';

const REASON_LABEL: Record<MatchReason, string> = {
  exact: '精确',
  contains: '病名',
  alias: '别名',
  category: '分类',
  acupoint: '穴位',
  partial: '近似',
  fuzzy: '相近',
};

const REASON_COLOR: Record<MatchReason, string> = {
  exact: '#b8922a',
  contains: '#b8922a',
  alias: '#5b8c5a',
  category: '#5b8c5a',
  acupoint: '#5b8c5a',
  partial: '#8b8275',
  fuzzy: '#8b8275',
};

interface Props {
  /** 初始关键词（深链或页面指定） */
  defaultQuery?: string;
  /** 单次展示上限，超出显示「展开全部」 */
  pageSize?: number;
}

export default function SymptomSearch(props: Props) {
  // useSearchParams 在静态预渲染页面需要 Suspense 边界，这里自包含包裹
  return (
    <Suspense fallback={null}>
      <SymptomSearchInner {...props} />
    </Suspense>
  );
}

function SymptomSearchInner({ defaultQuery = '', pageSize = 8 }: Props) {
  const { theme } = useTheme();
  const c = useTianjiColors(theme);

  const [symptom, setSymptom] = useState(defaultQuery);
  const [expanded, setExpanded] = useState(false);
  const searchParams = useSearchParams();

  // 支持 /renji/zhenjiu?symptom=失眠 深链（全站搜索点针灸结果跳入）
  useEffect(() => {
    const q = searchParams?.get('symptom');
    if (q) setSymptom(q);
  }, [searchParams]);

  const result = useMemo(() => searchSymptoms(symptom, 50), [symptom]);
  const shown = expanded ? result.hits : result.hits.slice(0, pageSize);

  const pick = (word: string) => {
    setSymptom(word);
    setExpanded(false);
  };

  return (
    <div
      className="rounded-2xl p-6 md:p-8"
      style={{
        background: c.featureBg,
        border: `1px solid ${c.goldLine}`,
      }}
    >
      <div className="text-[10px] tracking-[0.3em] mb-2" style={{ color: c.goldSolid }}>
        症状 · 穴位 检索
      </div>
      <h2 className="text-xl font-serif tracking-wider mb-1" style={{ color: c.textPrimary }}>
        输入症状 / 穴位 / 部位，查倪师临床取穴
      </h2>
      <p className="text-[11px] mb-4" style={{ color: c.textMuted }}>
        数据源：ACU_EXPERIENCES 共 {SYMPTOM_TOTAL} 条 · 支持口语说法（如「睡不着」「拉肚子」「肩膀痛」）
      </p>

      {/* 输入 */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          value={symptom}
          onChange={e => {
            setSymptom(e.target.value.slice(0, 20));
            setExpanded(false);
          }}
          placeholder="如：失眠 · 心脏病 · 胃疼 · 偏头痛 · 合谷 · 足三里"
          aria-label="输入症状或穴位"
          className="flex-1 px-4 py-3 rounded-xl outline-none text-sm"
          style={{
            background: c.cardBg,
            border: `1px solid ${c.featureBord}`,
            color: c.textPrimary,
            fontFamily: 'var(--font-serif)',
          }}
        />
        {symptom && (
          <button
            type="button"
            onClick={() => {
              setSymptom('');
              setExpanded(false);
            }}
            className="px-4 py-2 rounded-xl text-[11px] tracking-wider"
            style={{
              background: 'transparent',
              border: `1px solid ${c.featureBord}`,
              color: c.textMuted,
            }}
          >
            清除
          </button>
        )}
      </div>

      {/* 快捷入口 */}
      <div className="mb-5 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] tracking-widest shrink-0" style={{ color: c.textFaint }}>
            常见
          </span>
          {HOT_SYMPTOMS.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => pick(s)}
              className="px-2.5 py-1 rounded-full text-[10px] tracking-wider transition-colors"
              style={{
                background: symptom === s ? c.goldSolid : c.cardBg,
                border: `1px solid ${symptom === s ? c.goldSolid : c.featureBord}`,
                color: symptom === s ? '#fff' : c.textMuted,
              }}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] tracking-widest shrink-0" style={{ color: c.textFaint }}>
            分科
          </span>
          {SYMPTOM_CATEGORIES.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => pick(cat)}
              className="px-2.5 py-1 rounded-full text-[10px] tracking-wider transition-colors"
              style={{
                background: symptom === cat ? '#5b8c5a' : c.cardBg,
                border: `1px solid ${symptom === cat ? '#5b8c5a' : c.featureBord}`,
                color: symptom === cat ? '#fff' : c.textMuted,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 结果 */}
      {symptom && (
        <div className="space-y-2">
          {result.total === 0 ? (
            <div className="rounded-lg px-4 py-5 text-center" style={{ background: c.cardBg, border: `1px solid ${c.featureBord}` }}>
              <p className="text-[11px] leading-relaxed" style={{ color: c.textSecond }}>
                库内暂未收录「{symptom}」的取穴方案。
              </p>
              <p className="text-[10px] mt-1.5" style={{ color: c.textFaint }}>
                当前收录 {SYMPTOM_TOTAL} 条倪师临床经验，试试上面的常见症状或分科浏览。
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <p className="text-[10px] tracking-widest" style={{ color: c.textFaint }}>
                  找到 {result.total} 条
                  {result.fuzzy && '（库内无精确匹配，以下为字面最接近）'}
                </p>
                {result.aliasNote && (
                  <span
                    className="text-[10px] px-2 py-0.5 rounded"
                    style={{
                      background: c.cardBg,
                      border: `1px solid ${c.featureBord}`,
                      color: '#5b8c5a',
                    }}
                  >
                    {result.aliasNote}
                  </span>
                )}
              </div>

              {shown.map(hit => (
                <div
                  key={hit.item.id}
                  className="rounded-lg px-4 py-3"
                  style={{
                    background: c.cardBg,
                    border: `1px solid ${c.featureBord}`,
                  }}
                >
                  <div className="flex items-baseline justify-between gap-3 mb-1.5">
                    <span className="text-sm font-serif" style={{ color: c.textPrimary }}>
                      {hit.item.condition}
                    </span>
                    <span className="flex items-center gap-1.5 shrink-0">
                      <span
                        className="text-[9px] tracking-widest px-2 py-0.5 rounded"
                        style={{
                          background: c.featureBg,
                          border: `1px solid ${c.featureBord}`,
                          color: '#5b8c5a',
                        }}
                      >
                        {hit.item.category}
                      </span>
                      <span
                        className="text-[9px] tracking-widest px-1.5 py-0.5 rounded"
                        style={{ color: REASON_COLOR[hit.reason] }}
                        title={`匹配方式：${REASON_LABEL[hit.reason]}`}
                      >
                        {REASON_LABEL[hit.reason]}
                      </span>
                    </span>
                  </div>
                  <div className="text-[11px]" style={{ color: c.textSecond }}>
                    <span style={{ color: c.goldSolid }}>取穴：</span>
                    {hit.item.acupoints}
                  </div>
                  {hit.item.note && (
                    <div className="text-[10px] mt-1.5 leading-relaxed" style={{ color: '#5b8c5a' }}>
                      ※ {hit.item.note}
                    </div>
                  )}
                </div>
              ))}

              {!expanded && result.hits.length > pageSize && (
                <button
                  type="button"
                  onClick={() => setExpanded(true)}
                  className="w-full py-2 rounded-lg text-[11px] tracking-wider"
                  style={{
                    background: 'transparent',
                    border: `1px dashed ${c.featureBord}`,
                    color: c.textMuted,
                  }}
                >
                  展开剩余 {result.hits.length - pageSize} 条
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
