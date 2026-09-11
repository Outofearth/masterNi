'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import BirthForm from '@/components/BirthForm';
import type { BirthFormState } from '@/components/BirthForm';
import ChartBoard from '@/components/ChartBoard';
import InsightPanel, { type SelectedSiHua, type SelectedStar } from '@/components/InsightPanel';
import ChartSummary from '@/components/ChartSummary';
import StarDetailPanel from '@/components/StarDetailPanel';
import ShareModal from '@/components/ShareModal';
import ThemeToggle from '@/components/ThemeToggle';
import ExportReportButton from '@/components/ExportReportButton';
import { generateChart } from '@/lib/ziwei/algorithm';
import { formToSearchParams, searchParamsToForm } from '@/lib/ziwei/share';
import { useHistory } from '@/lib/ziwei/history';
import type { BirthInfo, ZiweiChart, Palace, Star } from '@/lib/ziwei/types';
import SiteFooter from '@/components/SiteFooter';

/**
 * 命盘页 —— 开源版「排盘引擎 Demo」
 *
 * 这是一个最小可运行示例：用本仓库的排盘引擎 generateChart() 配合基础 UI
 * 组件，渲染一张完整紫微命盘 + 基础解读，并支持本命 / 大限 / 流年切换。
 *
 * 说明：线上商业版的完整交互界面（重设计的新 UI、AI 流式解读、合盘、分享
 * 卡片等）不在开源范围内；但排盘内核——安星算法、四化、格局识别、古籍库——
 * 完全开放（见 lib/ziwei/*），可自由二次开发出你自己的界面。
 *
 * 接线清单（2026-09 补全）：
 *  · A1/A4 命盘速览（ChartSummary：命格总览 / 本命四化 / 格局识别 / 大限运程 / 名人比对）
 *  · A2    一键分享（ShareModal + formToSearchParams，链接可直接回填表单）
 *  · A3    星曜静态速查（StarDetailPanel，点主星先看静态解读，需要再问 AI）
 *  · C8    排盘历史（useHistory，本地留存最近 10 条）
 */
export default function ChartPage() {
  const [chart, setChart] = useState<ZiweiChart | null>(null);
  const [selectedPalace, setSelectedPalace] = useState<Palace | null>(null);
  // A4-1：主星点选 / 四化飞化点选（此前未接线，点击无反应）
  const [selectedStar, setSelectedStar] = useState<SelectedStar | null>(null);
  const [selectedSiHua, setSelectedSiHua] = useState<SelectedSiHua | null>(null);

  // A3：点星 → 静态速查面板（零 token，先看静态再决定要不要问 AI）
  // palace 必填：ChartBoard 的 onStarSelect 总会给出所在宫位，InsightPanel 也要求非空
  const [detailStar, setDetailStar] = useState<{ star: Star; palace: Palace } | null>(null);

  // A2：分享
  const [formState, setFormState] = useState<BirthFormState | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  // B7：右栏双 Tab —— AI 解读 / 命盘速览
  const [rightTab, setRightTab] = useState<'ai' | 'summary'>('ai');

  // C8：排盘历史
  const { history, save, remove } = useHistory();

  // A2：分享链接落地 —— URL 带参数时自动回填表单（?y=1990&m=1&d=1&h=8&mi=0&g=m…）
  const [initialForm, setInitialForm] = useState<Partial<BirthFormState> | undefined>(undefined);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const qs = window.location.search;
    if (!qs) return;
    const parsed = searchParamsToForm(new URLSearchParams(qs));
    if (parsed) setInitialForm(parsed);
  }, []);

  const boardRef = useRef<HTMLDivElement>(null);

  const handleFormSave = useCallback((data: BirthFormState) => {
    setFormState(data);
  }, []);

  const handleSubmit = useCallback((info: BirthInfo) => {
    setChart(generateChart(info));
    // C8：起盘即入历史（useHistory 内部按 年月日+性别+时辰 去重，上限 10 条）
    if (formState) save(formState);
  }, [formState, save]);

  const openShare = useCallback(() => {
    if (!formState) return;
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    setShareUrl(`${origin}/chart?${formToSearchParams(formState).toString()}`);
    setShareOpen(true);
  }, [formState]);

  // A3：静态面板里点「让 AI 深度解读」→ 关面板 → 切到 AI Tab → 触发解读
  const askAIAboutStar = useCallback(() => {
    if (!detailStar) return;
    setSelectedStar({ star: detailStar.star, palace: detailStar.palace });
    setDetailStar(null);
    setRightTab('ai');
  }, [detailStar]);

  // ── 未起盘：出生信息表单 + 排盘历史 ──
  if (!chart) {
    return (
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '48px 20px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>紫微斗数排盘</h1>
        <p style={{ color: 'var(--tx-3)', marginBottom: 32, fontSize: 16, lineHeight: 1.7 }}>
          输入出生年月日时，开源排盘引擎即时生成命盘。
        </p>
        <BirthForm
          onSubmit={handleSubmit}
          onFormSave={handleFormSave}
          initialData={initialForm}
        />

        {/* C8 排盘历史 */}
        {history.length > 0 && (
          <section style={{ marginTop: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--t-text1)' }}>最近排盘</span>
              <span style={{ fontSize: 13, color: 'var(--t-faint)', marginLeft: 8 }}>
                本地留存 {history.length} / 10 条
              </span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
              {history.map(h => (
                <li
                  key={h.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '10px 12px', borderRadius: 10,
                    border: '1px solid var(--t-border)', background: 'var(--t-card)',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setFormState(h.form);
                      setChart(generateChart(toBirthInfo(h.form)));
                    }}
                    style={{
                      flex: 1, textAlign: 'left', background: 'none', border: 'none',
                      cursor: 'pointer', color: 'var(--t-text1)', fontSize: 15, padding: 0,
                    }}
                    aria-label={`重新排盘：${h.label}`}
                  >
                    {h.label}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(h.id)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--t-faint)', fontSize: 16, lineHeight: 1, padding: '0 4px',
                    }}
                    aria-label={`删除记录：${h.label}`}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
        <SiteFooter />
      </main>
    );
  }

  // ── 已起盘：单屏工作台 ──
  // 布局规则见 app/globals.css（.ziwei-workspace* / .ziwei-left）：
  // 整页锁定一屏；左命盘超高时自身滚动；右 AI 解读对话在消息区内上下滚动。
  return (
    <div className="ziwei-workspace">
      {/* 顶栏：返回起盘 + 分享 + 导出 PDF/PNG + 主题切换 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, padding: '2px 4px' }}>
        <button
          type="button"
          onClick={() => {
            setChart(null);
            setSelectedPalace(null);
            setSelectedStar(null);
            setSelectedSiHua(null);
            setDetailStar(null);
          }}
          style={{
            padding: '6px 14px', cursor: 'pointer', fontSize: 15,
            border: '1px solid var(--t-border)', borderRadius: 8,
            background: 'transparent', color: 'var(--t-text)',
          }}
        >
          ← 重新起盘
        </button>
        <span className="hidden sm:block" style={{ fontSize: 14, color: 'var(--t-faint)' }}>
          倪海厦体系排盘 · 点宫位看三方四正、点主星看星曜速查、点四化看飞化
        </span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* A2 一键分享 */}
          <button
            type="button"
            onClick={openShare}
            style={{
              padding: '6px 14px', cursor: 'pointer', fontSize: 15,
              border: '1px solid rgba(212,168,67,0.35)', borderRadius: 8,
              background: 'rgba(212,168,67,0.10)', color: 'var(--t-gold)',
            }}
            aria-label="分享这张命盘"
          >
            分享
          </button>
          <ExportReportButton
            targetRef={boardRef}
            filename="ziwei-chart"
            printTitle="紫微命盘报告"
          />
          <ThemeToggle />
        </div>
      </div>

      {/* 工作区：左命盘｜右（AI 解读 / 命盘速览） */}
      <div className="ziwei-workspace-grid">
        <div className="ziwei-left">
          <div ref={boardRef} className="export-root">
            <h1 className="export-page-title">紫微斗数命盘报告</h1>
            <ChartBoard
              chart={chart}
              onPalaceSelect={setSelectedPalace}
              onStarSelect={(star: Star, palace: Palace) => setDetailStar({ star, palace })}
              onSiHuaClick={(starName, siHua, view) => setSelectedSiHua({ starName, siHua, view })}
            />
          </div>
          {/* A3 星曜静态速查：点主星后在这里展开 */}
          {detailStar && (
            <div style={{ marginTop: 12 }}>
              <StarDetailPanel
                star={detailStar.star}
                palaceName={detailStar.palace.name}
                onClose={() => setDetailStar(null)}
                onAskAI={askAIAboutStar}
              />
            </div>
          )}
          <SiteFooter compact />
        </div>

        {/* B7 右栏：Tab 切换，两块都保持挂载以保留滚动位置与对话历史 */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, gap: 8 }}>
          <div
            role="tablist"
            aria-label="右侧面板切换"
            style={{
              display: 'flex', gap: 4, flexShrink: 0, padding: 4,
              borderRadius: 10, border: '1px solid var(--t-border)', background: 'var(--t-card)',
            }}
          >
            {([
              { key: 'ai', label: 'AI 解读' },
              { key: 'summary', label: '命盘速览' },
            ] as const).map(t => {
              const active = rightTab === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setRightTab(t.key)}
                  style={{
                    flex: 1, padding: '6px 0', fontSize: 14, cursor: 'pointer',
                    borderRadius: 7, border: 'none',
                    background: active ? 'rgba(212,168,67,0.14)' : 'transparent',
                    color: active ? 'var(--t-gold)' : 'var(--t-faint)',
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          <div style={{ flex: 1, minHeight: 0, display: 'grid' }}>
            <div style={{ display: rightTab === 'ai' ? 'block' : 'none', minHeight: 0, height: '100%' }}>
              <InsightPanel
                chart={chart}
                selectedPalace={selectedPalace}
                selectedStar={selectedStar}
                selectedSiHua={selectedSiHua}
              />
            </div>
            <div
              style={{
                display: rightTab === 'summary' ? 'block' : 'none',
                minHeight: 0, height: '100%', overflowY: 'auto',
              }}
            >
              <ChartSummary chart={chart} />
            </div>
          </div>
        </div>
      </div>

      {/* A2 分享弹层 */}
      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        shareUrl={shareUrl}
        chart={chart}
        birth={{
          year: formState?.year ?? '',
          month: formState?.month ?? '',
          day: formState?.day ?? '',
          hour: formState?.clockHour ?? '',
          minute: formState?.clockMinute ?? '',
          gender: formState?.gender ?? 'male',
          city: formState?.city || formState?.province || undefined,
        }}
      />
    </div>
  );
}

/** 历史记录里的表单回填成 BirthInfo（重新排盘用，与 BirthForm 提交口径一致） */
function toBirthInfo(form: BirthFormState): BirthInfo {
  return {
    year: parseInt(form.year) || 0,
    month: parseInt(form.month) || 0,
    day: parseInt(form.day) || 0,
    hour: form.unknownTime ? 0 : parseInt(form.clockHour) || 0,
    gender: form.gender,
    name: form.name || undefined,
    province: form.province || undefined,
    city: form.city || undefined,
    longitude: form.province ? form.longitude : undefined,
  };
}
