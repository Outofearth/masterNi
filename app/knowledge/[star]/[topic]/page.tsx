/**
 * /knowledge/[star]/[topic] — SEO 落地页（B 方案 · 聚合渲染）
 *
 * 14 主星 × 13 topic = 182 个独立 URL。
 * 内容来自项目已有真实资料（星曜档案 / 古籍原文 / 宫位论断 / 格局 / 倪师语录），
 * 零编造；无专门论断的宫位诚实提示，不伪造。
 *
 * SEO 要点：
 *  - title 含主关键词（如"紫微入命宫·倪海夏体系详解"）
 *  - description 用星曜通性
 *  - JSON-LD Article 结构化数据
 *  - 内链：同主星其他 12 宫 + 同宫其他 13 主星
 *  - generateStaticParams 静态生成，零运行时开销
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import CrossLinks from '@/components/CrossLinks';
import SiteFooter from '@/components/SiteFooter';
import type { TopicKey } from '@/lib/ziwei/db-analysis';
import {
  ALL_STARS,
  ALL_TOPICS,
  getKnowledge,
  getAllKnowledgeRoutes,
  STAR_TO_SLUG,
  SLUG_TO_STAR,
} from '@/lib/seo/knowledge';

export const dynamicParams = false;

export async function generateStaticParams() {
  const routes = getAllKnowledgeRoutes();
  return routes.map(r => ({ star: r.slug, topic: r.topic }));
}

export async function generateMetadata({ params }: { params: Promise<{ star: string; topic: string }> }) {
  const { star: slug, topic } = await params;
  const star = SLUG_TO_STAR[slug];
  if (!star) return {};
  const data = getKnowledge(star, topic as TopicKey);

  const title = `${star}入${data.palaceName}宫 · ${data.topicLabel} · 倪海夏体系详解`;
  const description = data.profile.brief
    || `${star}入${data.palaceName}宫的紫微斗数解读 — 基于倪海夏《天纪》体系与古籍《紫微斗数全集》《骨髓赋》。`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://wdyziweidoushu666.com/knowledge/${slug}/${topic}`,
    },
    alternates: {
      canonical: `https://wdyziweidoushu666.com/knowledge/${slug}/${topic}`,
    },
    keywords: [
      '紫微斗数', '倪海夏', star, data.palaceName, data.topicLabel,
      `${star}${data.palaceName}`, `${star}入${data.palaceName}`,
      `紫微斗数 ${star}`, '倪海厦紫微斗数', '紫微斗数全集',
    ],
  };
}

export default async function KnowledgePage({ params }: { params: Promise<{ star: string; topic: string }> }) {
  const { star: slug, topic } = await params;
  const star = SLUG_TO_STAR[slug];
  if (!star) notFound();
  const data = getKnowledge(star, topic as TopicKey);

  const { profile, fuqi, classics, classicsInPalace, patterns, niQuotes } = data;
  const isLove = topic === 'love';
  const hasPalaceClassics = classicsInPalace.length > 0;

  // 同主星其他 topic / 同 topic 其他主星（全量内链）
  const otherTopicsForStar = ALL_TOPICS.filter(t => t !== topic);
  const otherStarsForTopic = ALL_STARS.filter(s => s !== star);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${star}入${data.palaceName}宫 · ${data.topicLabel}`,
    description: profile.brief,
    author: { '@type': 'Organization', name: '紫微研究 · 倪海夏正宗' },
    publisher: {
      '@type': 'Organization',
      name: '紫微研究',
      url: 'https://wdyziweidoushu666.com',
    },
    datePublished: '2026-04-28',
    dateModified: '2026-09-07',
    mainEntityOfPage: `https://wdyziweidoushu666.com/knowledge/${slug}/${topic}`,
    articleSection: '紫微斗数 · 倪海夏体系',
    keywords: [`紫微斗数`, star, data.palaceName, data.topicLabel].join(', '),
  };

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* 顶栏 */}
      <div className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(184,146,42,0.15)', background: 'var(--bg-page)' }}>
        <Link href="/" style={{ fontSize: '14px', color: 'var(--ac-text)', letterSpacing: '0.3em', textDecoration: 'none' }}>
          ← 首页
        </Link>
        <div style={{ fontSize: '14px', color: 'var(--tx-3)', letterSpacing: '0.2em' }}>
          倪师方法论 · 知识库
        </div>
        <Link href="/chart" style={{ fontSize: '14px', color: 'var(--ac-text)', letterSpacing: '0.2em', textDecoration: 'none' }}>
          起盘 →
        </Link>
      </div>

      <article className="max-w-3xl mx-auto px-6 py-12">
        {/* 面包屑 */}
        <nav style={{ fontSize: 'var(--fs-caption)', color: 'var(--tx-3)', letterSpacing: '0.1em', marginBottom: '16px' }}>
          <Link href="/" style={{ color: 'var(--tx-3)', textDecoration: 'none' }}>首页</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <Link href="/knowledge" style={{ color: 'var(--tx-3)', textDecoration: 'none' }}>知识库</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span>{star}</span>
          <span style={{ margin: '0 8px' }}>·</span>
          <span style={{ color: 'var(--ac-text)' }}>{data.palaceName}宫</span>
        </nav>

        {/* 标题区 */}
        <header style={{ marginBottom: '28px' }}>
          <div style={{ fontSize: '13px', color: 'var(--tx-3)', letterSpacing: '0.25em', marginBottom: '8px' }}>
            {data.topicLabel} · 倪海夏体系详解
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 700, color: 'var(--tx-0)', letterSpacing: '0.1em', lineHeight: 1.2 }}>
            {star}入{data.palaceName}宫
          </h1>
          {profile.brief && (
            <p style={{ fontSize: '15px', color: 'var(--tx-2)', marginTop: '14px', lineHeight: 1.8 }}>
              {profile.brief}
            </p>
          )}
        </header>

        {/* 星曜档案（五行 / 性质 / 关键词） */}
        <Section title="星曜档案">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <ArchiveChip label="五行" value={profile.element || '—'} />
            <ArchiveChip label="星性" value={profile.nature || '—'} />
            <ArchiveChip label="关键词" value={profile.keywords || '—'} wide />
          </div>
        </Section>

        {/* 宫位论断 */}
        {isLove && fuqi ? (
          <Section title="宫位论断 · 夫妻宫" gradient>
            {fuqi.summary && (
              <p style={{ fontSize: '16px', color: 'var(--tx-0)', lineHeight: 1.9, fontWeight: 500, marginBottom: '14px' }}>
                {fuqi.summary}
              </p>
            )}
            {fuqi.good && (
              <InsightRow tone="good" label="吉象">{fuqi.good}</InsightRow>
            )}
            {fuqi.bad && (
              <InsightRow tone="bad" label="凶象">{fuqi.bad}</InsightRow>
            )}
            {fuqi.spouse_traits && (
              <InsightRow tone="plain" label="配偶特质">{fuqi.spouse_traits}</InsightRow>
            )}
            {fuqi.timing && (
              <InsightRow tone="plain" label="婚期建议">{fuqi.timing}</InsightRow>
            )}
            {fuqi.ni_quote && (
              <div style={{ marginTop: '14px', padding: '12px 14px', background: 'rgba(184,146,42,0.06)', borderRadius: '8px', borderLeft: '3px solid var(--ac)' }}>
                <div style={{ fontSize: '13px', color: 'var(--ac-text)', letterSpacing: '0.2em', marginBottom: '6px' }}>倪师原话</div>
                <p style={{ fontSize: '15px', color: 'var(--tx-1)', lineHeight: 1.8, margin: 0 }}>{fuqi.ni_quote}</p>
              </div>
            )}
          </Section>
        ) : hasPalaceClassics ? (
          <Section title={`宫位原文 · ${data.palaceName}宫`} gradient>
            <div style={{ fontSize: '14px', color: 'var(--tx-3)', marginBottom: '10px' }}>
              古籍中「{star}」与「{data.palaceName}」共现的原文段落：
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {classicsInPalace.map((p, i) => (
                <ClassicQuote key={i} ctx={p} />
              ))}
            </div>
          </Section>
        ) : (
          <Section title={`宫位论断 · ${data.palaceName}宫`}>
            <p style={{ fontSize: '15px', color: 'var(--tx-2)', lineHeight: 1.9, margin: 0 }}>
              古籍原典中暂未收录「{star}入{data.palaceName}宫」的专门段落，此处不擅自编造论断。
              可先参考本页的星曜通性与下方古籍原文，或前往
              <Link href={`/library/search?q=${encodeURIComponent(star)}`} style={{ color: 'var(--ac-text)', textDecoration: 'none' }}>古籍全文检索「{star}」→</Link>。
            </p>
          </Section>
        )}

        {/* 古籍原文（该星全部出处） */}
        {classics.length > 0 && (
          <Section title={`古籍原文 · 共 ${classics.length} 段`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {classics.slice(0, 8).map((p, i) => (
                <ClassicQuote key={i} ctx={p} />
              ))}
            </div>
            {classics.length > 8 && (
              <div style={{ fontSize: '14px', color: 'var(--ac-text)', marginTop: '10px' }}>
                <Link href={`/library/keyword/${encodeURIComponent(star)}`} style={{ color: 'var(--ac-text)', textDecoration: 'none' }}>
                  查看全部 {classics.length} 段出处 →
                </Link>
              </div>
            )}
          </Section>
        )}

        {/* 关联格局 */}
        {patterns.length > 0 && (
          <Section title={`关联格局 · ${patterns.length} 个`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {patterns.slice(0, 6).map((p) => (
                <div key={p.id} style={{ padding: '10px 0', borderBottom: '1px solid rgba(184,146,42,0.1)' }}>
                  <Link href={`/knowledge/pattern/${p.id}`} style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ac-text)', textDecoration: 'none', letterSpacing: '0.05em' }}>
                    {p.name}
                  </Link>
                  <span style={{ fontSize: '13px', color: 'var(--tx-3)', marginLeft: '8px' }}>{p.category} · {p.source}</span>
                  <p style={{ fontSize: '14px', color: 'var(--tx-2)', lineHeight: 1.7, margin: '6px 0 0' }}>{p.summary}</p>
                </div>
              ))}
            </div>
            {patterns.length > 6 && (
              <div style={{ fontSize: '14px', color: 'var(--ac-text)', marginTop: '10px' }}>
                <Link href="/knowledge/pattern" style={{ color: 'var(--ac-text)', textDecoration: 'none' }}>
                  查看全部格局 →
                </Link>
              </div>
            )}
          </Section>
        )}

        {/* 倪师语录 */}
        {niQuotes.length > 0 && (
          <Section title="倪师语录">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {niQuotes.map((q, i) => (
                <div key={i} style={{ fontSize: '15px', color: 'var(--tx-1)', lineHeight: 1.8, paddingLeft: '14px', borderLeft: '2px solid rgba(184,146,42,0.35)' }}>
                  {q.text}
                  <span style={{ fontSize: '13px', color: 'var(--tx-3)', marginLeft: '8px' }}>· {q.topic}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* CTA */}
        <div style={{
          margin: '40px 0 30px',
          padding: '24px',
          background: 'linear-gradient(135deg, rgba(212,169,72,0.15) 0%, rgba(184,146,42,0.06) 100%)',
          borderRadius: '14px',
          border: '1px solid rgba(184,146,42,0.3)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '16px', color: 'var(--tx-0)', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '6px' }}>
            想看你自己命盘的{data.topicLabel}？
          </div>
          <div style={{ fontSize: '14px', color: 'var(--tx-2)', marginBottom: '16px' }}>
            输入生辰起盘 · 倪师正宗解读 · AI 答疑伴学
          </div>
          <Link href="/chart" style={{
            display: 'inline-block',
            padding: '12px 28px',
            background: 'linear-gradient(135deg, #d4a948 0%, #b8922a 100%)',
            color: 'white',
            borderRadius: '999px',
            fontSize: '16px',
            fontWeight: 600,
            letterSpacing: '0.15em',
            textDecoration: 'none',
            boxShadow: '0 4px 12px rgba(184,146,42,0.3)',
          }}>
            立即起盘 →
          </Link>
        </div>

        {/* 内链：同主星其他 topic */}
        <Section title={`${star}星的其他宫位解读`} minimal>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {otherTopicsForStar.map(t => {
              const d = getKnowledge(star, t);
              return (
                <Link
                  key={t}
                  href={`/knowledge/${slug}/${t}`}
                  style={{
                    fontSize: '14px',
                    padding: '6px 12px',
                    background: 'var(--bg-card)',
                    border: '1px solid rgba(184,146,42,0.25)',
                    borderRadius: '999px',
                    color: 'var(--tx-2)',
                    textDecoration: 'none',
                  }}
                >
                  {star}入{d.palaceName}
                </Link>
              );
            })}
          </div>
        </Section>

        {/* 内链：同 topic 其他主星 */}
        <Section title={`其他主星入${data.palaceName}宫的解读`} minimal>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {otherStarsForTopic.slice(0, 13).map(s => (
              <Link
                key={s}
                href={`/knowledge/${STAR_TO_SLUG[s]}/${topic}`}
                style={{
                  fontSize: '14px',
                  padding: '6px 12px',
                  background: 'var(--bg-card)',
                  border: '1px solid rgba(184,146,42,0.25)',
                  borderRadius: '999px',
                  color: 'var(--tx-2)',
                  textDecoration: 'none',
                }}
              >
                {s}入{data.palaceName}
              </Link>
            ))}
          </div>
        </Section>

        {/* A4-4 · 延伸阅读 */}
        <div style={{ marginTop: '20px' }}>
          <CrossLinks
            links={[
              { href: `/library/search?q=${encodeURIComponent(star)}`, label: `古籍检索「${star}」→`, desc: '在原典库中查找此星相关原文' },
              { href: '/chart', label: '排盘实测 →', desc: '输入生辰，看此星落入何宫' },
              { href: '/knowledge/pattern', label: '格局速查 →', desc: '杀破狼 / 机月同梁等经典格局' },
              { href: '/tianji', label: '天纪总览 →', desc: '倪师天纪：易经 · 堪舆 · 面相 · 测字' },
            ]}
          />
        </div>
      </article>

      {/* 页脚 */}
      <SiteFooter
        note="紫微研究 · 基于倪海夏正宗体系"
        className="max-w-3xl mx-auto px-6"
      />
    </div>
  );
}

function ArchiveChip({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <div style={{
      padding: '8px 14px',
      background: 'rgba(184,146,42,0.05)',
      border: '1px solid rgba(184,146,42,0.18)',
      borderRadius: '8px',
      flex: wide ? '1 1 100%' : '1 1 auto',
    }}>
      <div style={{ fontSize: '13px', color: 'var(--tx-3)', letterSpacing: '0.15em', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '15px', color: 'var(--tx-0)', fontWeight: 500 }}>{value}</div>
    </div>
  );
}

function InsightRow({ tone, label, children }: { tone: 'good' | 'bad' | 'plain'; label: string; children: React.ReactNode }) {
  const toneColor = tone === 'good' ? '#2e7d32' : tone === 'bad' ? '#c62828' : 'var(--tx-3)';
  return (
    <div style={{ marginBottom: '8px' }}>
      <span style={{ fontSize: '13px', color: toneColor, letterSpacing: '0.15em', marginRight: '8px', fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: '15px', color: 'var(--tx-0)', lineHeight: 1.8 }}>{children}</span>
    </div>
  );
}

function ClassicQuote({ ctx }: { ctx: { paragraphText: string; bookSlug: string; chapterIdx: number; paragraphId: string; chapterTitle: string; book: { title: string } } }) {
  return (
    <div style={{ padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid rgba(184,146,42,0.12)', borderRadius: '8px' }}>
      <p style={{ fontSize: '15px', color: 'var(--tx-1)', lineHeight: 1.9, margin: 0 }}>{ctx.paragraphText}</p>
      <Link
        href={`/library/${ctx.bookSlug}/${ctx.chapterIdx}#${ctx.paragraphId}`}
        style={{ fontSize: '13px', color: 'var(--ac-text)', textDecoration: 'none', letterSpacing: '0.05em' }}
      >
        {ctx.book.title} · {ctx.chapterTitle} →
      </Link>
    </div>
  );
}

function Section({ title, children, gradient, minimal }: { title: string; children: React.ReactNode; gradient?: boolean; minimal?: boolean }) {
  return (
    <section style={{ marginBottom: minimal ? '24px' : '32px' }}>
      <h2 style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '15px',
        color: 'var(--ac-text)',
        fontWeight: 600,
        letterSpacing: '0.2em',
        marginBottom: '12px',
      }}>
        <span style={{ width: '4px', height: '14px', background: 'var(--ac)', borderRadius: '2px' }} />
        {title}
      </h2>
      <div style={{
        background: gradient
          ? 'linear-gradient(135deg, rgba(212,169,72,0.12) 0%, rgba(184,146,42,0.04) 100%)'
          : 'white',
        border: '1px solid rgba(184,146,42,0.15)',
        borderRadius: '10px',
        padding: minimal ? '14px 18px' : '20px 22px',
      }}>
        {children}
      </div>
    </section>
  );
}
