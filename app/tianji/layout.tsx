'use client';

/**
 * 天纪页根 layout
 *
 * P0 设计系统统一后：顶部导航全站由 SiteHeader 提供（见 app/layout.tsx），
 * 此处不再自带 fixed nav —— 原先与 SiteHeader 双层叠压（fixed + sticky），
 * 且切到其它页面时顶栏会突变，是「两套导航」问题的根源之一。
 *
 * 背景统一走全局 token --bg-0（暖米阶梯起点），不再硬编 #f5efe0 / #020810。
 */
export default function TianjiLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: 'var(--bg-0)',
        transition: 'background 0.35s ease',
        minHeight: '100vh',
      }}
      className="overflow-x-hidden"
    >
      <main>{children}</main>
    </div>
  );
}
