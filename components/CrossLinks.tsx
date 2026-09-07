/**
 * A4-4 · CrossLinks —— 统一「延伸阅读」跨模块导航卡
 *
 * 用途：在任一模块页面底部挂载，指向其它模块的入口，
 * 让 knowledge ↔ library ↔ chart ↔ tianji ↔ diji ↔ renji 之间双向可达，
 * 避免用户读完一页就到尽头。
 *
 * 设计：
 *  - 纯渲染、无 hooks，server / client component 均可引用
 *  - 全部走 CSS 变量，自动跟随浅/深主题
 */

import Link from 'next/link';

export interface CrossLink {
  /** 目标路由，如 '/knowledge/ziwei/overview' */
  href: string;
  /** 链接主标题 */
  label: string;
  /** 可选副标题（一句话说明点进去能看到什么） */
  desc?: string;
  /** 是否新窗口打开，默认 false */
  external?: boolean;
}

export default function CrossLinks({
  title = '延伸阅读',
  links,
}: {
  title?: string;
  links: CrossLink[];
}) {
  if (!links || links.length === 0) return null;

  return (
    <section
      aria-label={title}
      style={{
        marginTop: '28px',
        padding: '18px 20px',
        background: 'var(--bg-card)',
        border: '1px solid rgba(184,146,42,0.18)',
        borderRadius: '12px',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '12px',
      }}>
        <div style={{ height: '1px', width: '20px', background: 'rgba(184,146,42,0.5)' }} />
        <span style={{ fontSize: '10px', color: 'var(--tx-3)', letterSpacing: '0.25em' }}>
          {title}
        </span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {links.map(l => (
          <Link
            key={l.href + l.label}
            href={l.href}
            {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            aria-label={l.desc ? `${l.label} —— ${l.desc}` : l.label}
            style={{
              display: 'block',
              padding: '8px 14px',
              borderRadius: '10px',
              textDecoration: 'none',
              background: 'rgba(184,146,42,0.06)',
              border: '1px solid rgba(184,146,42,0.2)',
              transition: 'border-color 0.15s, background 0.15s',
            }}
          >
            <div style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--ac)',
              letterSpacing: '0.08em',
            }}>
              {l.label}
            </div>
            {l.desc && (
              <div style={{
                fontSize: '10px',
                color: 'var(--tx-3)',
                marginTop: '2px',
                letterSpacing: '0.04em',
              }}>
                {l.desc}
              </div>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
