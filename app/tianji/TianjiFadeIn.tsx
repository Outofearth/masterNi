'use client';
import { useRef } from 'react';
import { useInView } from 'framer-motion';

/**
 * 滚动入场包装（与首页 FadeIn 同款，但不引入 framer-motion 的 motion 依赖到外层）
 * - 用 useInView 检测 + transition 即可，无需 motion.div
 * - 单独 .tsx 文件，避免 hook + JSX 混用引发的 TSX 解析歧义
 */

interface TianjiFadeInProps {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}

export default function TianjiFadeIn({
  children,
  delay = 0,
  y = 28,
  className = '',
}: TianjiFadeInProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : `translateY(${y}px)`,
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}