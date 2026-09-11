import { HEXAGRAMS } from '@/lib/nihai';
import HexagramDetailPage from './_client';

/** server 层仅用于声明 generateStaticParams（页面本体是 'use client'，用 Number(params.id) 查表）。 */
export function generateStaticParams() {
  return HEXAGRAMS.map((h) => ({ id: String(h.number) }));
}

export default function Page() {
  return <HexagramDetailPage />;
}
