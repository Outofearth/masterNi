import { DIJI_MODULES } from '@/lib/nihai/diji';
import DijiDetailPage from './_client';

/**
 * 静态导出需要一个 server 层来声明 generateStaticParams：
 * 页面本体是 'use client'（内部用 useParams 取 slug），而客户端组件不允许导出
 * generateStaticParams，所以这里保留一个极薄的 server 包装。
 * 完整版 / 本地 dev 下行为与改动前一致（只是多了一层透传）。
 */
export function generateStaticParams() {
  return DIJI_MODULES.map((m) => ({ slug: m.slug }));
}

export default function Page() {
  return <DijiDetailPage />;
}
