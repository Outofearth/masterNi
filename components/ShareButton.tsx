'use client';

/**
 * 面板内的「分享」按钮
 *
 * 抽这个组件是为了让「AI 解读」与「命盘速览」两个 Tab 的按钮完全同款 ——
 * 尺寸 / 圆角 / 配色与 InsightPanel 的「导出 PDF 报告」按钮一一对应
 * （rounded-lg · px-2.5 · py-1.5 · text-[14px] · 金底金框 · 图标 11px），
 * 两个面板并排放一起时视觉重量一致，不会再出现「一个 Tab 有、另一个没有」。
 */

interface Props {
  onClick: () => void;
  disabled?: boolean;
  /** 按钮文字，默认「分享」 */
  label?: string;
}

export default function ShareButton({ onClick, disabled, label = '分享' }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title="生成分享卡片，或复制可回填出生信息的命盘链接"
      className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[14px] font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      style={{
        background: 'rgba(212,168,67,0.12)',
        border: '1px solid rgba(212,168,67,0.28)',
        color: 'var(--t-gold)',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      <svg
        width="11" height="11" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="10.51" x2="15.42" y2="6.49" />
        <line x1="8.59" y1="13.49" x2="15.42" y2="17.51" />
      </svg>
      {label}
    </button>
  );
}
