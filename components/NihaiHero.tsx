'use client';

import type { ReactNode } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { useTianjiColors } from '@/app/tianji/_colors';
import TianjiFadeIn from '@/app/tianji/TianjiFadeIn';

/**
 * 倪海厦「三纪」（天纪 / 地纪 / 人纪）统一 Hero 标题组
 *
 * 为什么抽这个组件：此前三个总览页的 Hero 各写各的，导致风格割裂 ——
 *   · /tianji 用 grad-text 大号渐变标题，但漏挂 .grad-text-dark|light
 *     → background-image:none + 文字全透明 = 标题占位却完全不可见；
 *     且 text-center 落在 display:inline-block 的元素上（对自己无效）→ 贴左对齐。
 *   · /diji /renji 用 48px 纯色标题 + 胶囊标签 → 与天纪不是一套语言。
 * 三页现在共用本组件，标题组只有这一处实现，不会再各写各的。
 *
 * 配色走 useTianjiColors（与首页同源），渐变大字依赖 globals.css 的 .grad-text。
 * 注意：h1 是 inline-block，居中必须靠外层容器的 text-align —— 组件内部已用
 * TianjiFadeIn 的 className="text-center" 兜住，不要再把 text-center 写回 h1 上。
 */
export interface NihaiHeroProps {
  /** 顶部标签行，如「Tian Ji · 上知天文」 */
  badge: string;
  /** 主标题（渐变衬线大字） */
  title: string;
  /** 副标题（模块 / 关键词串） */
  subtitle?: string;
  /** 说明段落 */
  description?: ReactNode;
  /** 主标题字号，默认 clamp(56px, 9vw, 124px) */
  titleSize?: string;
  /** 标签行之前的内容（面包屑 / 图标等） */
  above?: ReactNode;
  /** 说明段之后的内容（数据条 / CTA 等） */
  children?: ReactNode;
}

export default function NihaiHero({
  badge,
  title,
  subtitle,
  description,
  titleSize = 'clamp(56px, 9vw, 124px)',
  above,
  children,
}: NihaiHeroProps) {
  const { theme } = useTheme();
  const c = useTianjiColors(theme);

  return (
    <>
      {above}

      {/* 标签行：金线 + 小字 */}
      <TianjiFadeIn className="text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${c.goldLine})` }} />
          <span className="text-[13px] tracking-[0.45em]" style={{ color: c.tagText }}>
            {badge}
          </span>
          <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${c.goldLine})` }} />
        </div>
      </TianjiFadeIn>

      {/* 主标题 */}
      <TianjiFadeIn delay={0.1} className="text-center">
        <h1
          className="grad-text font-bold leading-none mb-6 tracking-tight"
          style={{ fontSize: titleSize, letterSpacing: '0.07em' }}
        >
          {title}
        </h1>
      </TianjiFadeIn>

      {/* 副标题 */}
      {subtitle && (
        <TianjiFadeIn delay={0.2} className="text-center">
          <p className="text-base md:text-lg tracking-[0.18em] mb-3" style={{ color: c.textSecond, fontWeight: 500 }}>
            {subtitle}
          </p>
        </TianjiFadeIn>
      )}

      {/* 说明段 */}
      {description && (
        <TianjiFadeIn delay={0.3} className="text-center">
          <p className="text-sm max-w-2xl mx-auto leading-relaxed mb-10" style={{ color: c.textMuted }}>
            {description}
          </p>
        </TianjiFadeIn>
      )}

      {children}
    </>
  );
}
