'use client';

/**
 * 状态徽章（P2-10 统一）
 *
 * 此前「已上线 / 试读 / 筹备」在首页时间轴（绿 ✓）、天纪模块卡（文字）、
 * 地纪/人纪模块卡（三元表达式文字）三处各自实现，颜色与文案口径不一。
 * 这里收敛为单一组件，颜色全部走语义 token（--state-good / --ac-text / --tx-3）。
 */

export type ModuleStatus = 'active' | 'preview' | 'coming';

const MAP: Record<ModuleStatus, { label: string; dot: string; color: string }> = {
  active:  { label: '已上线', dot: '✓', color: 'var(--state-good)' },
  preview: { label: '试读',   dot: '◐', color: 'var(--ac-text)' },
  coming:  { label: '筹备',   dot: '◇', color: 'var(--tx-3)' },
};

interface Props {
  /** 模块状态；传入未知值按 coming 兜底 */
  status: ModuleStatus | string;
  /** 覆盖默认文案（如「视频筹备中」） */
  label?: string;
  /** sm = 徽章级 10px；md = 12px */
  size?: 'sm' | 'md';
  /** 是否显示前导符号（✓ / ◐ / ◇） */
  showDot?: boolean;
  className?: string;
}

export default function StatusBadge({
  status,
  label,
  size = 'sm',
  showDot = true,
  className = '',
}: Props) {
  const key = (status === 'active' || status === 'preview' ? status : 'coming') as ModuleStatus;
  const cfg = MAP[key];
  const fontSize = size === 'md' ? 'var(--fs-caption)' : 'var(--fs-badge)';

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontSize,
        letterSpacing: '0.15em',
        padding: size === 'md' ? '3px 10px' : '1px 7px',
        borderRadius: 'var(--r-pill)',
        color: cfg.color,
        background: `color-mix(in srgb, ${cfg.color} 10%, transparent)`,
        border: `1px solid color-mix(in srgb, ${cfg.color} 28%, transparent)`,
        whiteSpace: 'nowrap',
        lineHeight: 1.6,
      }}
    >
      {showDot && <span aria-hidden="true">{cfg.dot}</span>}
      {label ?? cfg.label}
    </span>
  );
}
