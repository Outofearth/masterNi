import { TIANJI_MODULES } from '@/lib/nihai';
import ModuleDetailPage from './_client';

/**
 * server 层仅用于声明 generateStaticParams（页面本体是 'use client'）。
 * 注意：/tianji/yijing、/tianji/qigua 是独立静态路由，优先级高于本动态段。
 */
export function generateStaticParams() {
  return TIANJI_MODULES.map((m) => ({ slug: m.slug }));
}

export default function Page() {
  return <ModuleDetailPage />;
}
