/**
 * 古籍原典查询库 · 主页
 *
 * 列出所有收录古籍 + 全局搜索入口
 */

import Link from 'next/link';
import { ALL_BOOKS, TOTAL_PARAGRAPHS } from '@/lib/classics';
import { getKeywordCloud, getLibrarySnapshot } from '@/lib/classics/keywords';
import LibrarySearch from './LibrarySearch';
import SiteFooter from '@/components/SiteFooter';

export const metadata = {
  title: '倪师方法论 · 古籍原典库 · 紫微斗数全集 / 全书 / 骨髓赋',
  description: '紫微斗数权威古籍全文检索：《紫微斗数全集》《紫微斗数全书》《骨髓赋》倪海夏《天纪》引证来源',
};

export default function LibraryHomePage() {
  const snapshot = getLibrarySnapshot();
  const cloud = getKeywordCloud().slice(0, 28); // top 28 关键词

  // 按 category 分桶展示
  const cloudByCat = {
    主星: cloud.filter(k => k.category === '主星').slice(0, 8),
    宫位: cloud.filter(k => k.category === '宫位').slice(0, 6),
    四化: cloud.filter(k => k.category === '四化'),
    格局: cloud.filter(k => k.category === '格局').slice(0, 6),
    术语: cloud.filter(k => k.category === '术语').slice(0, 6),
  };

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
      {/* 顶栏 */}
      <div className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(184,146,42,0.15)', background: 'var(--bg-page)' }}>
        <Link href="/" style={{ fontSize: '14px', color: 'var(--ac-text)', letterSpacing: '0.3em', textDecoration: 'none' }}>
          ← 返回首页
        </Link>
        <div style={{ fontSize: '14px', color: 'var(--tx-3)', letterSpacing: '0.3em' }}>
          古籍原典库 · CLASSICS
        </div>
        <Link href="/chart" style={{ fontSize: '14px', color: 'var(--ac-text)', letterSpacing: '0.2em', textDecoration: 'none' }}>
          起盘 →
        </Link>
      </div>

      {/* Hero */}
      <div className="text-center px-6 py-16">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div style={{ height: '1px', width: '48px', background: 'linear-gradient(to right, transparent, rgba(184,146,42,0.4))' }} />
          <span style={{ fontSize: '13px', color: 'var(--ac-text)', letterSpacing: '0.4em' }}>NI HAI XIA · CURRICULUM</span>
          <div style={{ height: '1px', width: '48px', background: 'linear-gradient(to left, transparent, rgba(184,146,42,0.4))' }} />
        </div>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, color: 'var(--tx-0)', letterSpacing: '0.15em', marginBottom: '12px' }}>
          倪师方法论 · 古籍原典库
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--tx-2)', letterSpacing: '0.1em', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
          紫微斗数权威古籍全文检索<br />
          收录 <strong style={{ color: 'var(--ac-text)' }}>{snapshot.bookCount}</strong> 部古籍 · <strong style={{ color: 'var(--ac-text)' }}>{snapshot.chapterCount}</strong> 章节 · <strong style={{ color: 'var(--ac-text)' }}>{snapshot.paragraphCount}</strong> 段精华
        </p>
      </div>

      {/* 搜索 */}
      <div className="max-w-2xl mx-auto px-6 mb-12">
        <LibrarySearch />
      </div>

      {/* 关键词热度词云 */}
      <div className="max-w-5xl mx-auto px-6 pb-12">
        <div className="flex items-center gap-3 mb-5">
          <div style={{ height: '1px', width: '32px', background: 'var(--ac)' }} />
          <span style={{ fontSize: '13px', color: 'var(--ac-text)', letterSpacing: '0.4em', fontWeight: 600 }}>
            关键词热度 · CLASSIC KEYWORDS
          </span>
          <div style={{ height: '1px', flex: 1, background: 'rgba(184,146,42,0.15)' }} />
        </div>
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid rgba(184,146,42,0.18)',
          borderRadius: '14px',
          padding: '24px 28px',
        }}>
          {Object.entries(cloudByCat).map(([cat, list]) => list.length > 0 ? (
            <div key={cat} className="mb-4 last:mb-0">
              <div style={{
                fontSize: '12px',
                color: 'var(--ac-dim)',
                letterSpacing: '0.3em',
                fontWeight: 600,
                marginBottom: '8px',
              }}>
                {cat}
              </div>
              <div className="flex flex-wrap gap-2">
                {list.map(k => (
                  <Link
                    key={k.text}
                    href={`/library/keyword/${encodeURIComponent(k.text)}`}
                    title={`${k.brief} · 全集 ${k.count} 次`}
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
                      fontWeight: k.count > 20 ? 600 : 400,
                      letterSpacing: '0.05em',
                    }}
                    className="hover:!bg-[rgba(184,146,42,0.15)] transition-colors"
                  >
                    {k.text}
                    <span style={{
                      fontSize: '12px',
                      color: 'var(--ac-dim)',
                      marginLeft: '2px',
                    }}>
                      {k.count}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ) : null)}
          <div style={{
            marginTop: '14px',
            paddingTop: '14px',
            borderTop: '1px dashed rgba(184,146,42,0.15)',
            fontSize: '13px',
            color: 'var(--tx-3)',
            lineHeight: 1.7,
          }}>
            字号大小反映该词在全部古籍中的提及次数。点击任一关键词，查看其所在的所有原文段落。
          </div>
        </div>
      </div>

      {/* 古籍列表 */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ALL_BOOKS.map(book => (
            <Link
              key={book.slug}
              href={`/library/${book.slug}`}
              style={{
                display: 'block',
                background: 'var(--bg-card)',
                border: '1px solid rgba(184,146,42,0.2)',
                borderRadius: '14px',
                padding: '24px',
                textDecoration: 'none',
                transition: 'all 0.2s',
                boxShadow: '0 2px 8px rgba(184,146,42,0.06)',
              }}
              className="hover:shadow-lg"
            >
              <div style={{ fontSize: '13px', color: 'var(--tx-3)', letterSpacing: '0.2em', marginBottom: '6px' }}>
                {book.dynasty} · {book.author.split(' ')[0]}
              </div>
              <div style={{ fontSize: '20px', fontWeight: 600, color: 'var(--tx-0)', marginBottom: '10px', letterSpacing: '0.1em' }}>
                《{book.title}》
              </div>
              <div style={{ fontSize: '14px', color: 'var(--tx-2)', lineHeight: 1.7, marginBottom: '14px' }}>
                {book.intro}
              </div>
              <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: 'var(--tx-3)' }}>
                <span>{book.chapters.length} 章节</span>
                <span style={{ color: 'rgba(184,146,42,0.4)' }}>·</span>
                <span>{book.chapters.reduce((s, c) => s + c.paragraphs.length, 0)} 段精华</span>
              </div>
              <div style={{
                display: 'inline-flex',
                marginTop: '14px',
                fontSize: '13px',
                color: 'var(--ac-text)',
                letterSpacing: '0.15em',
                fontWeight: 500,
              }}>
                进入查阅 →
              </div>
            </Link>
          ))}
        </div>

        {/* 底部说明 */}
        <div style={{ marginTop: '60px', padding: '24px', background: 'rgba(184,146,42,0.05)', borderRadius: '10px', textAlign: 'center' }}>
          <div style={{ fontSize: '13px', color: 'var(--ac-dim)', fontWeight: 600, letterSpacing: '0.15em', marginBottom: '8px' }}>
            关于本库
          </div>
          <div style={{ fontSize: '14px', color: 'var(--tx-2)', lineHeight: 1.8, maxWidth: '600px', margin: '0 auto' }}>
            所收录古籍均为公版（明代刊本）。<br />
            内容持续完善，未来将补全《紫微斗数全集》全本与倪海夏《天纪》引证目录。<br />
            如发现任何错误请联系我们。
          </div>
        </div>
      <SiteFooter />
      </div>
    </div>
  );
}
