/**
 * POST /api/generate
 * body: BirthInfo { year, month, day, hour(0-11), gender, longitude? }
 * 响应：ZiweiChart JSON（与前端 lib/ziwei/algorithm.generateChart 同源同参）
 * 用途：合盘页等服务端起盘（开源版此前缺失，前端会拿到 404）。
 */

import { NextRequest } from 'next/server';
import { generateChart } from '@/lib/ziwei/algorithm';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: '请求体不是合法 JSON' }), { status: 400 });
  }

  const num = (v: any) => (typeof v === 'number' ? v : typeof v === 'string' && v !== '' ? Number(v) : Number.NaN);
  const year = num(body?.year), month = num(body?.month), day = num(body?.day), hour = num(body?.hour);
  const gender = body?.gender;
  const longitude = body?.longitude === undefined || body?.longitude === '' ? undefined : Number(body.longitude);

  const okYear = Number.isInteger(year) && year >= 1900 && year <= 2100;
  const okMonth = Number.isInteger(month) && month >= 1 && month <= 12;
  const okDay = Number.isInteger(day) && day >= 1 && day <= 31;
  const okHour = Number.isInteger(hour) && hour >= 0 && hour <= 11;
  const okGender = gender === 'male' || gender === 'female';

  if (!okYear || !okMonth || !okDay || !okHour || !okGender) {
    return new Response(JSON.stringify({
      error: '参数不合法：year/month/day/hour(0-11)/gender(male|female) 必填且范围正确',
    }), { status: 400 });
  }

  try {
    const chart = generateChart({
      year, month, day, hour, gender,
      ...(Number.isFinite(longitude) ? { longitude } : {}),
    });
    return new Response(JSON.stringify(chart), {
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  } catch (err) {
    return new Response(JSON.stringify({
      error: `排盘失败：${err instanceof Error ? err.message : String(err)}`,
    }), { status: 500 });
  }
}
