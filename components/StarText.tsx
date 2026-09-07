/**
 * A4-3 · StarText —— 古籍正文 → 关键词反查
 *
 * 把一段文本中出现的 14 主星名自动识别为可点击链接，
 * 直达 /library/keyword/{星名}（该星在全部古籍中的出处列表）。
 *
 * 注：知识库详情页 /knowledge/[star]/[topic] 因上游 STAR_DB 置空而全量 404，
 *     故此处不指向知识库，改指确定有内容的关键词反查页。
 *
 * 说明：
 *  - 纯渲染、无 hooks、无 'use client'，server / client component 均可引用
 *  - 正则在模块级预编译一次；String.split 不消费 lastIndex，可安全复用
 */

import Link from 'next/link';
import { STAR_TO_SLUG } from '@/lib/seo/knowledge';

/** 按长度降序，保证长名优先匹配（主星均为 2 字，此处为将来扩展留口） */
const STAR_PATTERN = new RegExp(
  `(${Object.keys(STAR_TO_SLUG)
    .sort((a, b) => b.length - a.length)
    .join('|')})`,
  'g',
);

export default function StarText({ text }: { text: string }) {
  if (!text) return null;

  // 带捕获组的 split：命中项会作为独立元素保留在数组中
  const parts = text.split(STAR_PATTERN);

  return (
    <>
      {parts.map((part, i) => {
        if (!STAR_TO_SLUG[part]) return <span key={i}>{part}</span>;
        return (
          <Link
            key={i}
            href={`/library/keyword/${encodeURIComponent(part)}`}
            title={`查「${part}」在古籍中的全部出处`}
            aria-label={`查「${part}」在古籍中的全部出处`}
            style={{
              color: 'var(--ac)',
              textDecoration: 'none',
              borderBottom: '1px dashed rgba(184,146,42,0.55)',
              fontWeight: 600,
            }}
          >
            {part}
          </Link>
        );
      })}
    </>
  );
}
