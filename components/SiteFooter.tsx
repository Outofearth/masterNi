'use client';

/**
 * 全站统一页脚（P3）
 *
 * 此前 14 个页面各自实现 footer，措辞与字号（10px / 11px 混用）都不一致，
 * 且地纪/人纪完全没有免责声明（人纪涉及医学内容，这点尤其要紧）。
 *
 * 分工：
 *   · 本组件 = 全站统一的免责声明 + 版权 + 条款链接
 *   · 地纪/人纪页面原有的「← 天纪 · 人纪 →」模块间导航属增值功能，保留在页面上，下方追加本组件
 */

import Link from 'next/link';

interface Props {
  /** 模块专属说明，如「天纪模块 · 基于倪海厦《天纪》公开教学讲义整理」 */
  note?: string;
  /** 紧凑模式：不显示条款链接（用于底部已有模块导航的页面） */
  compact?: boolean;
  /** 渲染标签：页面已有 <footer> 包裹时传 'div'，避免 footer 嵌套（HTML5 不允许） */
  as?: 'footer' | 'div';
  className?: string;
}

export default function SiteFooter({
  note,
  compact = false,
  as = 'footer',
  className = '',
}: Props) {
  const fs = 'var(--fs-caption)'; // 12px，符合字号阶梯「辅助 ≥12」
  const Tag = as === 'div' ? 'div' : 'footer';

  return (
    <Tag
      className={className}
      style={{
        // compact 总是嵌在页面已有 <footer> 内，不再重复画分隔线
        borderTop: compact ? 'none' : '1px solid var(--bdr)',
        padding: compact ? '18px 16px 30px' : '28px 24px 36px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          maxWidth: 720,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        {note && (
          <p style={{ fontSize: fs, color: 'var(--tx-3)', letterSpacing: '0.05em', margin: 0 }}>
            {note}
          </p>
        )}
        <p style={{ fontSize: fs, color: 'var(--tx-3)', letterSpacing: '0.05em', margin: 0 }}>
          紫微命盘 · 基于倪海厦正宗体系 · 仅供参考，命运掌握在自己手中
        </p>
        <p
          style={{
            fontSize: fs,
            color: 'var(--tx-3)',
            lineHeight: 1.7,
            opacity: 0.85,
            margin: 0,
          }}
        >
          本平台基于中国传统文化研究，仅提供学习参考。不构成任何医疗、投资、法律或重大决策建议。
        </p>
        {!compact && (
          <p style={{ fontSize: fs, color: 'var(--tx-3)', margin: 0 }}>
            <Link href="/terms" style={{ color: 'inherit', textDecoration: 'underline' }}>
              服务条款
            </Link>
            {' · '}
            <Link href="/privacy" style={{ color: 'inherit', textDecoration: 'underline' }}>
              隐私政策
            </Link>
          </p>
        )}
      </div>
    </Tag>
  );
}
