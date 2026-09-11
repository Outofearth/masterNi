import { RENJI_MODULES } from '@/lib/nihai/renji';
import RenjiDetailPage from './_client';

/** server 层仅用于声明 generateStaticParams（页面本体是 'use client'）。 */
export function generateStaticParams() {
  return RENJI_MODULES.map((m) => ({ slug: m.slug }));
}

export default function Page() {
  return <RenjiDetailPage />;
}
