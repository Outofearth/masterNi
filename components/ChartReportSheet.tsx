'use client';

import { forwardRef } from 'react';
import type { ZiweiChart } from '@/lib/ziwei/types';
import { BRANCHES, STEMS } from '@/lib/ziwei/constants';
import ChartBoard from './ChartBoard';
import ChartSummary from './ChartSummary';
import { SITE_NAME, SITE_FULL_NAME, SITE_HOST } from '@/lib/site';

interface ChartReportSheetProps {
  chart: ZiweiChart;
}

/**
 * 「报告纸张」—— 与 app 界面完全分离的一份报告 DOM。
 * 由父级渲染到一棵 height:0 + overflow:hidden 的宿主里（屏幕不可见、不占位），
 * 既用于 html2canvas 抓图（导出 PNG），也用于「单独打这一张」的打印路径
 * （body 加 .report-mode，CSS 把整张 app 隐藏、只显示这份纸张）。
 *
 * 设计要点：
 *  · 700px 固定宽 —— 与 app 内命盘同宽，PNG/PDF 排版一致；A4 内容宽 ≈688px，
 *    打印时会轻微重排（无明显差异）。
 *  · 自身携带 token（与 globals.css 的 .report-palette 共享）：保证不论 app 当前
 *    是暗色还是亮色，纸张永远是米底深字的「文档版式」。
 *  · 命盘用 ChartBoard plain=true：去掉「本命/大限/流年」时间轴与交互提示，
 *    这两样在纸上既点不动也看不懂，留着只会让报告显得没做完。
 */
const ChartReportSheet = forwardRef<HTMLDivElement, ChartReportSheetProps>(function ChartReportSheet({ chart }, innerRef) {
  const b = chart.birthInfo;
  const l = chart.lunarInfo;
  const hourBranch = BRANCHES[b.hour] ?? '';
  const hourZhi = hourBranch;
  const hourZhiChinese = hourBranch; // 已为中文
  const lunarStr = `${l.lunarYear}年${l.isLeapMonth ? '闰' : ''}${Math.abs(l.lunarMonth)}月${l.lunarDay}日`;
  const ganzhiYear = `${STEMS[l.yearStem]}${BRANCHES[l.yearBranch]}年`;
  const mingZhi = BRANCHES[chart.mingGongBranch];
  const shenZhi = BRANCHES[chart.shenGongBranch];
  const dx = chart.daXians[chart.currentDaXianIndex];

  return (
    <div ref={innerRef} className="report-sheet" aria-hidden="true">
      <div className="report-sheet-inner">
        <header className="report-sheet-head">
          <div className="report-sheet-brand">{SITE_FULL_NAME}</div>
          <h1 className="report-sheet-title">紫微斗数命盘报告</h1>
          <div className="report-sheet-meta">
            <span>{b.name ? `${b.name}·` : ''}{b.gender === 'male' ? '男' : '女'}</span>
            <span>公历 {b.year}年{b.month}月{b.day}日 {hourZhiChinese}时</span>
            <span>农历 {lunarStr}（{ganzhiYear}）</span>
            <span>命宫 {mingZhi} · 身宫 {shenZhi}</span>
            <span>{chart.wuxingJuName}</span>
            {dx && <span>当前大限 {dx.startAge}–{dx.endAge}岁 · {dx.palaceName}</span>}
          </div>
        </header>

        <section className="report-section report-sheet-board">
          <h2 className="report-h2">一、紫微命盘</h2>
          <ChartBoard chart={chart} plain />
        </section>

        <section className="report-section report-sheet-summary">
          <h2 className="report-h2">二、命盘速览</h2>
          <ChartSummary chart={chart} />
        </section>

        <footer className="report-sheet-foot">
          <span>{SITE_NAME} · {SITE_HOST}</span>
          <span>本文由《天纪》体系排盘引擎生成，仅供学习参考，不构成任何医疗、投资或法律建议。</span>
        </footer>
      </div>
    </div>
  );
});

export default ChartReportSheet;