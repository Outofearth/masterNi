// SectionEyebrow —— 「金线标签行」唯一来源
//
// 【背景·2026-09-11】原先这段「金线 + 小字标签」在 8+ 个文件里手写重复，
// 金线宽度散成 4 档（w-12×22 / w-6×7 / w-8×3 / w-16×2，首页自身混用 3 档），
// 文字色也各写各的（c.tagText / c.goldSolid+opacity / var(--ac-text) / 硬编 rgba）。
// 抽成本组件后收敛为：
//   · center（默认）—— 左右对称渐变金线，线宽统一 48px（= 原 w-12 / 48px 内联档）
//   · left           —— 左单实线，线宽统一 24px（= 原 w-6 档）
//   · divider        —— 左侧变体 + 尾部 flex-1 延伸细线（章节标签样式）
//   · tone="bright"  —— 深色底（如首页哲学暗带）上的亮金，不随主题 token 变化
//
// 颜色一律走设计 token（--ac / --ac-bdr / --ac-text / --tx-3），不再散落 rgba；
// 文字金统一用 --ac-text（浅色 5.3:1 / 暗色 8.4:1，满足 WCAG AA）。
//
// 用法：
//   <SectionEyebrow className="mb-6">Ni Haixia · Philosophy</SectionEyebrow>
//   <SectionEyebrow align="left" className="mb-4">关键词</SectionEyebrow>
//   <SectionEyebrow tone="bright" className="mb-8">命 · 运 · 观</SectionEyebrow>
//   <SectionEyebrow subtitle="共 12 条" className="mb-5">课程章节</SectionEyebrow>

import React from 'react';

export type SectionEyebrowAlign = 'center' | 'left';
export type SectionEyebrowTone = 'theme' | 'bright';

export interface SectionEyebrowProps {
  /** 标签文字 */
  children: React.ReactNode;
  /** 可选的第二行小字（居中置于两金线之间，复刻 tianji 章节标题样式） */
  subtitle?: React.ReactNode;
  /** 布局：center = 对称金线（默认）；left = 左单金线 */
  align?: SectionEyebrowAlign;
  /** 配色：theme = 跟随主题 token（默认）；bright = 固定深底亮金 */
  tone?: SectionEyebrowTone;
  /** 追加尾部延伸细线（仅 align="left" 生效） */
  divider?: boolean;
  /** 标签字号，默认 12 */
  size?: number;
  /** 标签字距，默认 '0.4em' */
  tracking?: string;
  /** 标签字重，默认 400 */
  weight?: number;
  /** 标签颜色覆盖（仅在语义需要时使用，如次要链接块用 --tx-3）；默认走 --ac-text */
  textColor?: string;
  /** 根节点附加 class（间距 mb-* 等） */
  className?: string;
  style?: React.CSSProperties;
}

// 单一来源：线 / 字颜色按 tone 二选一，全部指向设计 token
const LINE_SOFT: Record<SectionEyebrowTone, string> = {
  theme: 'var(--ac-bdr)',
  bright: 'rgba(212,168,67,0.45)',
};
const LINE_SOLID: Record<SectionEyebrowTone, string> = {
  theme: 'var(--ac)',
  bright: 'rgba(212,168,67,0.9)',
};
const LINE_TAIL: Record<SectionEyebrowTone, string> = {
  theme: 'var(--bdr)',
  bright: 'rgba(212,168,67,0.15)',
};
const TEXT_COLOR: Record<SectionEyebrowTone, string> = {
  theme: 'var(--ac-text)',
  bright: 'rgba(232,192,96,0.82)',
};
const SUB_COLOR: Record<SectionEyebrowTone, string> = {
  theme: 'var(--tx-3)',
  bright: 'rgba(240,246,255,0.5)',
};

/** 统一线宽：center 档 48px、left 档 24px —— 原 4 档宽度的收敛点 */
const CENTER_LINE_W = 48;
const LEFT_LINE_W = 24;

export default function SectionEyebrow({
  children,
  subtitle,
  align = 'center',
  tone = 'theme',
  divider = false,
  size = 12,
  tracking = '0.4em',
  weight = 400,
  textColor,
  className = '',
  style,
}: SectionEyebrowProps) {
  const labelStyle: React.CSSProperties = {
    fontSize: `${size}px`,
    letterSpacing: tracking,
    fontWeight: weight,
    textTransform: 'uppercase',
    color: textColor ?? TEXT_COLOR[tone],
    whiteSpace: 'nowrap',
  };

  const label = (
    <span style={labelStyle}>{children}</span>
  );

  if (align === 'left') {
    return (
      <div className={`flex items-center gap-3 ${className}`} style={style}>
        <span
          aria-hidden="true"
          style={{ height: '1px', width: `${LEFT_LINE_W}px`, flexShrink: 0, background: LINE_SOLID[tone] }}
        />
        {subtitle ? (
          <div>
            {label}
            <div style={{ fontSize: '12px', marginTop: '4px', color: SUB_COLOR[tone] }}>{subtitle}</div>
          </div>
        ) : label}
        {divider && (
          <span
            aria-hidden="true"
            style={{ height: '1px', flex: 1, background: LINE_TAIL[tone] }}
          />
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} style={style}>
      <span
        aria-hidden="true"
        style={{
          height: '1px',
          width: `${CENTER_LINE_W}px`,
          flexShrink: 0,
          background: `linear-gradient(to right, transparent, ${LINE_SOFT[tone]})`,
        }}
      />
      {subtitle ? (
        <div className="text-center">
          {label}
          <div style={{ fontSize: '12px', marginTop: '4px', color: SUB_COLOR[tone] }}>{subtitle}</div>
        </div>
      ) : label}
      <span
        aria-hidden="true"
        style={{
          height: '1px',
          width: `${CENTER_LINE_W}px`,
          flexShrink: 0,
          background: `linear-gradient(to left, transparent, ${LINE_SOFT[tone]})`,
        }}
      />
    </div>
  );
}
