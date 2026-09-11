/**
 * /library/keyword/[word] — 关键词反查页
 *
 * 点击首页词云中的某关键词，进入该页查看该词在所有古籍中的出处段落
 */

import Link from 'next/link';
import { findParagraphsByKeyword, KEYWORD_DICT, getKeywordCloud } from '@/lib/classics/keywords';
import { highlightKeyword } from '@/lib/classics/highlight';
import SiteFooter from '@/components/SiteFooter';
import SectionEyebrow from '@/components/SectionEyebrow';

/**
 * 静态导出：把词典里的全部关键词预生成成页面（/library/keyword/<词>）。
 * 词表即 KEYWORD_DICT —— 与词云跳转共用同一来源，不会出现「有链接无页面」。
 */
export function generateStaticParams() {
  return KEYWORD_DICT.map((k) => ({ word: k.text }));
}

export async function generateMetadata({ params }: { params: Promise<{ word: string }> }) {
  const { word } = await params;
  return {
    title: `「${decodeURIComponent(word)}」· 古籍原典反查 · 紫微斗数古籍库`,
    description: `查看 "${decodeURIComponent(word)}" 在所有收录古籍里的所有出处段落。倪海厦《天纪》引证目录`,
  };
}

export default async function KeywordPage({ params }: { params: Promise<{ word: string }> }) {
  const { word: rawWord } = await params;
  const word = decodeURIComponent(rawWord);

  const def = KEYWORD_DICT.find(k => k.text === word);
  const contexts = findParagraphsByKeyword(word, 100);
  const cloud = getKeywordCloud();
  const heat = cloud.find(k => k.text === word);

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
      {/* 顶栏 */}
      <div className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(184,146,42,0.15)', background: 'var(--bg-page)' }}>
        <Link href="/library" style={{ fontSize: '14px', color: 'var(--ac-text)', letterSpacing: '0.3em', textDecoration: 'none' }}>
          ← 古籍库
        </Link>
        <div style={{ fontSize: '14px', color: 'var(--tx-3)', letterSpacing: '0.2em' }}>
          关键词反查
        </div>
        <Link href="/chart" style={{ fontSize: '14px', color: 'var(--ac-text)', letterSpacing: '0.2em', textDecoration: 'none' }}>
          起盘 →
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Hero */}
        <div className="text-center mb-10">
          <div style={{
            display: 'inline-block',
            fontSize: '13px',
            color: 'var(--ac-text)',
            letterSpacing: '0.3em',
            padding: '4px 14px',
            background: 'rgba(184,146,42,0.08)',
            border: '1px solid rgba(184,146,42,0.3)',
            borderRadius: '999px',
            marginBottom: '14px',
          }}>
            {def?.category ?? '关键词'}
          </div>
          <h1 style={{
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: 700,
            color: 'var(--tx-0)',
            letterSpacing: '0.1em',
            marginBottom: '14px',
          }}>
            「{word}」
          </h1>
          {def && (
            <p style={{ fontSize: '16px', color: 'var(--tx-2)', lineHeight: 1.7, maxWidth: '480px', margin: '0 auto' }}>
              {def.brief}
            </p>
          )}
          {heat && (
            <div style={{
              marginTop: '14px',
              fontSize: '14px',
              color: 'var(--tx-3)',
              letterSpacing: '0.15em',
            }}>
              全集共出现 <strong style={{ color: 'var(--ac-text)' }}>{heat.count}</strong> 次 · 涉及 <strong style={{ color: 'var(--ac-text)' }}>{heat.bookCount}</strong> 部古籍
            </div>
          )}
        </div>

        {/* 段落列表 */}
        {contexts.length === 0 ? (
          <div style={{
            background: 'var(--bg-card)',
            padding: '40px 20px',
            borderRadius: '12px',
            textAlign: 'center',
            color: 'var(--tx-2)',
            border: '1px solid rgba(184,146,42,0.15)',
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>📜</div>
            <div style={{ fontSize: '16px' }}>未在已收录古籍中找到此关键词的出处</div>
          </div>
        ) : (
          <>
            <SectionEyebrow align="left" divider size={13} tracking="0.3em" weight={600} className="mb-5">
              共 {contexts.length} 条出处 · 按所属古籍分组
            </SectionEyebrow>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {contexts.map((c, i) => (
                <Link
                  key={`${c.bookSlug}-${c.chapterIdx}-${c.paragraphId}-${i}`}
                  href={`/library/${c.bookSlug}/${c.chapterIdx}#${c.paragraphId}`}
                  style={{
                    display: 'block',
                    background: 'var(--bg-card)',
                    padding: '16px 20px',
                    borderRadius: '10px',
                    border: '1px solid rgba(184,146,42,0.18)',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'border-color 0.15s',
                  }}
                  className="hover:!border-[rgba(184,146,42,0.45)]"
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '13px',
                    color: 'var(--tx-3)',
                    marginBottom: '10px',
                    letterSpacing: '0.1em',
                  }}>
                    <span style={{ color: 'var(--ac-text)', fontWeight: 600 }}>《{c.book.title}》</span>
                    <span style={{ opacity: 0.5 }}>·</span>
                    <span>{c.chapterTitle}</span>
                    <span style={{ opacity: 0.5 }}>·</span>
                    <span style={{ fontFamily: 'var(--font-serif)' }}>第 {c.paragraphId} 段</span>
                  </div>
                  <p style={{
                    fontSize: '16px',
                    color: 'var(--tx-0)',
                    lineHeight: 1.9,
                    letterSpacing: '0.02em',
                  }}
                    dangerouslySetInnerHTML={{ __html: highlightKeyword(c.paragraphText, word) }}
                  />
                </Link>
              ))}
            </div>
          </>
        )}

        {/* 相关关键词推荐 */}
        {heat && cloud.length > 1 && (
          <div style={{ marginTop: '40px' }}>
            <SectionEyebrow align="left" divider size={13} tracking="0.3em" weight={600} className="mb-5">
              相关关键词
            </SectionEyebrow>
            <div className="flex flex-wrap gap-2">
              {cloud.filter(k => k.text !== word && k.category === def?.category).slice(0, 10).map(k => (
                <Link
                  key={k.text}
                  href={`/library/keyword/${encodeURIComponent(k.text)}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '5px 12px',
                    fontSize: '15px',
                    color: 'var(--tx-0)',
                    background: 'rgba(184,146,42,0.06)',
                    border: '1px solid rgba(184,146,42,0.2)',
                    borderRadius: '16px',
                    textDecoration: 'none',
                  }}
                  className="hover:!bg-[rgba(184,146,42,0.15)] transition-colors"
                >
                  {k.text}
                  <span style={{ fontSize: '12px', color: 'var(--ac-dim)', marginLeft: '2px' }}>{k.count}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .keyword-mark { background: rgba(184,146,42,0.3); color: var(--ac-strong); padding: 0 2px; border-radius: 2px; font-weight: 600; }
      `}</style>
      <SiteFooter />
    </div>
  );
}