'use client';

/**
 * 搜索结果页（客户端版）
 *
 * 为什么是客户端组件：静态导出（GitHub Pages）下页面必须预渲染，
 * 而读取 searchParams 的服务端页面会被判定为动态渲染、无法导出。
 * 古籍数据层只有 ~56KB，整体带到客户端成本很低，因此把搜索改为浏览器侧执行。
 */

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { searchClassics, getParagraphById } from '@/lib/classics';
import SiteFooter from '@/components/SiteFooter';

export default function SearchClient() {
  const sp = useSearchParams();
  const q = (sp.get('q') ?? '').trim();
  const hits = q ? searchClassics(q, 50) : [];

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
      <div className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(184,146,42,0.15)', background: 'var(--bg-page)' }}>
        <Link href="/library" style={{ fontSize: '14px', color: 'var(--ac-text)', letterSpacing: '0.3em', textDecoration: 'none' }}>
          ← 古籍库
        </Link>
        <div style={{ fontSize: '14px', color: 'var(--tx-3)', letterSpacing: '0.2em' }}>
          搜索结果
        </div>
        <Link href="/" style={{ fontSize: '14px', color: 'var(--ac-text)', letterSpacing: '0.2em', textDecoration: 'none' }}>
          首页 →
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <div style={{ fontSize: '15px', color: 'var(--tx-3)', letterSpacing: '0.15em', marginBottom: '4px' }}>
            搜索关键词
          </div>
          <h1 style={{ fontSize: 'clamp(22px, 3.5vw, 32px)', fontWeight: 700, color: 'var(--tx-0)', letterSpacing: '0.1em' }}>
            「{q || '（空）'}」
          </h1>
          <div style={{ fontSize: '14px', color: 'var(--tx-3)', marginTop: '8px' }}>
            共找到 <strong style={{ color: 'var(--ac-text)' }}>{hits.length}</strong> 条古籍原文匹配
          </div>
        </div>

        {hits.length === 0 ? (
          <div style={{
            background: 'var(--bg-card)',
            padding: '40px 20px',
            borderRadius: '12px',
            textAlign: 'center',
            color: 'var(--tx-2)',
            border: '1px solid rgba(184,146,42,0.15)',
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>📜</div>
            {q ? (
              <>
                <div style={{ fontSize: '16px', marginBottom: '6px' }}>暂未在已收录古籍中找到这个关键词</div>
                <div style={{ fontSize: '13px', color: 'var(--tx-3)', lineHeight: 1.7 }}>
                  我们持续补充内容中。可尝试搜索：<br />
                  <span style={{ color: 'var(--ac-text)' }}>七杀朝斗 / 双禄朝垣 / 化忌 / 紫微 / 命宫 / 机月同梁</span>
                </div>
              </>
            ) : (
              <div style={{ fontSize: '15px' }}>请输入要搜索的关键词</div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {hits.map((hit, i) => {
              const ctx = getParagraphById(hit.paragraphId);
              const chapterIdx = ctx?.chapterIdx ?? 0;
              return (
                <Link
                  key={i}
                  href={`/library/${hit.bookSlug}/${chapterIdx}#${hit.paragraphId}`}
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
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '13px',
                    color: 'var(--tx-3)',
                    marginBottom: '8px',
                    letterSpacing: '0.1em',
                  }}>
                    <span style={{ color: 'var(--ac-text)', fontWeight: 600 }}>《{hit.bookTitle}》</span>
                    <span style={{ opacity: 0.5 }}>·</span>
                    <span>{hit.chapterTitle}</span>
                  </div>
                  <div
                    style={{
                      fontSize: '16px',
                      color: 'var(--tx-0)',
                      lineHeight: 1.9,
                      letterSpacing: '0.02em',
                    }}
                    dangerouslySetInnerHTML={{ __html: hit.snippet }}
                  />
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        mark { background: rgba(184,146,42,0.3); color: var(--ac-strong); padding: 0 2px; border-radius: 2px; font-weight: 600; }
      `}</style>
      <SiteFooter />
    </div>
  );
}
