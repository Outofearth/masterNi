'use client';
import { useState } from 'react';
import BirthForm from '@/components/BirthForm';
import ChartBoard from '@/components/ChartBoard';
import InsightPanel from '@/components/InsightPanel';
import ThemeToggle from '@/components/ThemeToggle';
import { generateChart } from '@/lib/ziwei/algorithm';
import type { BirthInfo, ZiweiChart, Palace } from '@/lib/ziwei/types';

/**
 * 命盘页 —— 开源版「排盘引擎 Demo」
 *
 * 这是一个最小可运行示例：用本仓库的排盘引擎 generateChart() 配合基础 UI
 * 组件，渲染一张完整紫微命盘 + 基础解读，并支持本命 / 大限 / 流年切换。
 *
 * 说明：线上商业版的完整交互界面（重设计的新 UI、AI 流式解读、合盘、分享
 * 卡片等）不在开源范围内；但排盘内核——安星算法、四化、格局识别、古籍库——
 * 完全开放（见 lib/ziwei/*），可自由二次开发出你自己的界面。
 */
export default function ChartPage() {
  const [chart, setChart] = useState<ZiweiChart | null>(null);
  const [selectedPalace, setSelectedPalace] = useState<Palace | null>(null);

  // ── 未起盘：展示出生信息表单 ──
  if (!chart) {
    return (
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '48px 20px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>紫微斗数排盘</h1>
        <p style={{ color: '#888', marginBottom: 32, fontSize: 14, lineHeight: 1.7 }}>
          输入出生年月日时，开源排盘引擎即时生成命盘。
          <br />
          （本页为引擎 Demo，完整商业版界面不在开源范围；排盘内核完全开放。）
        </p>
        <BirthForm onSubmit={(info: BirthInfo) => setChart(generateChart(info))} />
      </main>
    );
  }

  // ── 已起盘：单屏工作台 ──
  // 布局规则见 app/globals.css（.ziwei-workspace* / .ziwei-left）：
  // 整页锁定一屏；左命盘超高时自身滚动；右 AI 解读对话在消息区内上下滚动。
  return (
    <div className="ziwei-workspace">
      {/* 顶栏：返回起盘 + 主题切换 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, padding: '2px 4px' }}>
        <button
          type="button"
          onClick={() => { setChart(null); setSelectedPalace(null); }}
          style={{
            padding: '6px 14px', cursor: 'pointer', fontSize: 13,
            border: '1px solid var(--t-border)', borderRadius: 8,
            background: 'transparent', color: 'var(--t-text)',
          }}
        >
          ← 重新起盘
        </button>
        <span className="hidden sm:block" style={{ fontSize: 12, color: 'var(--t-faint)' }}>
          倪海厦体系排盘 · 点击宫位 / 话题 / 输入问题，AI 解读在右侧对话区滚动阅读
        </span>
        <div style={{ marginLeft: 'auto' }}>
          <ThemeToggle />
        </div>
      </div>

      {/* 工作区：左命盘｜右 AI 解读（对话内部滚动） */}
      <div className="ziwei-workspace-grid">
        <div className="ziwei-left">
          <ChartBoard chart={chart} onPalaceSelect={setSelectedPalace} />
        </div>
        <InsightPanel chart={chart} selectedPalace={selectedPalace} />
      </div>
    </div>
  );
}
