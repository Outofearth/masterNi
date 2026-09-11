import { Suspense } from 'react';
import SearchClient from './_client';

export const metadata = {
  title: '搜索 · 古籍原典库',
};

/**
 * server 层负责 metadata + Suspense 边界：
 * useSearchParams() 在预渲染时必须包在 Suspense 内，否则静态导出会报
 * "useSearchParams() should be wrapped in a suspense boundary"。
 */
export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: '120px 24px', textAlign: 'center', color: 'var(--tx-3)', background: 'var(--bg-page)', minHeight: '100vh' }}>
          加载中…
        </div>
      }
    >
      <SearchClient />
    </Suspense>
  );
}
