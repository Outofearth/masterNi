'use client';

/**
 * 命盘分享卡 — 12 宫命盘缩略图 + 关键信息（680×420，适合朋友圈 / 微信缩略）
 *
 * ── 2026-09-11 重写要点 ────────────────────────────────────────
 * 1) 消除留白：右栏原来用 justify-content:space-between 撑开，只放了 3 个信息块，
 *    在 420px 高度里拉出大片空白。现在改为「命宫主星 / 本命四化 / 高亮句 /
 *    当前大限 / 品牌落款」固定间距排布，并把本命四化这个高信息量区块补进来填实。
 * 2) 字号：原卡内大量 7–10px 小字（最小 7px，缩略图上几乎不可读）。阶梯整体上抬 ——
 *    宫名 11、地支 10、主星 13、中心区 11–15、正文 12–13，最小不再低于 10px。
 * 3) 对比度：原先用 goldSoft(#a89b7c) / goldDeep 当文字，压米金渐变底只有
 *    1.96–3.60:1，远低于 WCAG AA。现全部换到 brand.ts 的「文字档」：
 *      goldText #805c0e（≈5.6:1）/ inkSoft #6b5d3f（≈5.96:1）/ ink #3d2f10（≈13:1）
 *    gold / goldLight / goldSoft 只保留在底色与描边上。
 * 4) 站点信息：原来硬编 wdyziweidoushu666.com（旧域名，散落各处必然漂移），
 *    现统一取 lib/site.ts 的 SITE_HOST 单一来源。
 *
 * 注意：本卡是「自包含品牌资产」，刻意不随 App 明暗主题变化 ——
 * 卡内一律用 BRAND 常量，禁止使用 var(--...)（否则截图会被当前主题污染）。
 */

import type { ZiweiChart } from '@/lib/ziwei/types';
import { BRAND, goldTint } from '@/lib/brand';
import { SITE_HOST, SITE_NAME } from '@/lib/site';

const BRANCH_NAMES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 紫微斗数 12 宫地支布局（按"地支盘"标准排列，固定）
// 寅卯辰巳 → 上行
// 丑    午
// 子    未
// 亥戌酉申 → 下行
const ZHIWEI_LAYOUT: Array<{ branch: number; row: number; col: number }> = [
  { branch: 2,  row: 0, col: 0 }, // 寅
  { branch: 3,  row: 0, col: 1 }, // 卯
  { branch: 4,  row: 0, col: 2 }, // 辰
  { branch: 5,  row: 0, col: 3 }, // 巳
  { branch: 1,  row: 1, col: 0 }, // 丑
  { branch: 6,  row: 1, col: 3 }, // 午
  { branch: 0,  row: 2, col: 0 }, // 子
  { branch: 7,  row: 2, col: 3 }, // 未
  { branch: 11, row: 3, col: 0 }, // 亥
  { branch: 10, row: 3, col: 1 }, // 戌
  { branch: 9,  row: 3, col: 2 }, // 酉
  { branch: 8,  row: 3, col: 3 }, // 申
];

interface ShareCardProps {
  chart: ZiweiChart;
  birth: {
    year: string;
    month: string;
    day: string;
    hour: string;
    minute: string;
    gender: 'male' | 'female';
    city?: string;
    /** 已格式化好的时间文本（如「08:00」或「子时」）；缺省时回落到 hour:minute */
    hourText?: string;
  };
  highlight?: string;
}

/** 四化展示顺序 */
const SIHUA_ORDER = ['禄', '权', '科', '忌'] as const;

export default function ShareCardCanvas({ chart, birth, highlight }: ShareCardProps) {
  const mingPalace = chart.palaces.find(p => p.branch === chart.mingGongBranch);
  const mingMajorStars = mingPalace?.stars.filter(s => s.type === 'major').map(s => s.name) ?? [];
  const mingStarStr = mingMajorStars.length > 0 ? mingMajorStars.join('·') : '空宫';
  const mingBranchName = BRANCH_NAMES[chart.mingGongBranch] || '';
  const shenBranchName = BRANCH_NAMES[chart.shenGongBranch] || '';
  const dx = chart.daXians?.[chart.currentDaXianIndex];

  const timeText = birth.hourText
    || (birth.hour !== ''
      ? `${String(birth.hour).padStart(2, '0')}:${String(birth.minute).padStart(2, '0')}`
      : '');

  const dateText = [
    birth.year && `${birth.year}年`,
    birth.month && `${birth.month}月`,
    birth.day && `${birth.day}日`,
    timeText,
  ].filter(Boolean).join('');

  // 本命四化：按 禄→权→科→忌 排，取星名（命盘最核心的四个信息点）
  const siHuaList: { label: string; star: string }[] = [];
  for (const key of SIHUA_ORDER) {
    for (const palace of chart.palaces) {
      const hit = palace.stars.find(s => s.siHua === key);
      if (hit) { siHuaList.push({ label: key, star: hit.name }); break; }
    }
  }

  // 把每个宫位组织成 12 个格子，按布局画
  const cells = ZHIWEI_LAYOUT.map(slot => {
    const palace = chart.palaces.find(p => p.branch === slot.branch);
    const majors = palace?.stars.filter(s => s.type === 'major') ?? [];
    const isMing = palace?.branch === chart.mingGongBranch;
    const isShen = palace?.branch === chart.shenGongBranch;
    return { ...slot, palace, majors, isMing, isShen };
  });

  return (
    <div id="share-card" style={{
      width: '680px',
      height: '420px',
      background: `linear-gradient(135deg, ${BRAND.cardTop} 0%, ${BRAND.cardMid} 60%, ${BRAND.cardBot} 100%)`,
      padding: '18px 26px 16px',
      fontFamily: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Microsoft JhengHei", sans-serif',
      position: 'relative',
      boxSizing: 'border-box',
      borderRadius: '14px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* 装饰光晕（纯装饰，不承载信息） */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '-60px', left: '-60px',
        width: '180px', height: '180px', borderRadius: '50%',
        background: `radial-gradient(circle, ${goldTint(0.18)} 0%, transparent 70%)`,
      }} />
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: '-50px', right: '-50px',
        width: '160px', height: '160px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(196,90,45,0.12) 0%, transparent 70%)',
      }} />

      {/* ── 顶部：品牌 + 出生信息 ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '12px', position: 'relative', zIndex: 1,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
            background: `linear-gradient(135deg, ${BRAND.goldLight} 0%, ${BRAND.gold} 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: BRAND.onGold, fontSize: '17px', fontWeight: 700,
          }}>紫</div>
          <div>
            <div style={{ fontSize: '17px', color: BRAND.ink, fontWeight: 700, letterSpacing: '0.1em', lineHeight: 1.25 }}>
              紫微斗数命盘
            </div>
            <div style={{ fontSize: '11px', color: BRAND.inkSoft, letterSpacing: '0.12em', marginTop: '1px' }}>
              倪海厦《天纪》体系 · {SITE_NAME}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px' }}>
          <div style={{ fontSize: '12px', color: BRAND.ink, letterSpacing: '0.03em', fontWeight: 500 }}>
            {dateText || '—'}
            <span style={{ margin: '0 5px', color: BRAND.gold }}>·</span>
            {birth.gender === 'male' ? '男命' : '女命'}
          </div>
          {birth.city && (
            <div style={{ fontSize: '11px', color: BRAND.inkSoft, letterSpacing: '0.06em' }}>
              {birth.city}
            </div>
          )}
        </div>
      </div>

      {/* ── 主体：左 12 宫格子 + 右关键信息 ── */}
      <div style={{ display: 'flex', gap: '18px', flex: 1, position: 'relative', zIndex: 1, minHeight: 0 }}>

        {/* 左：12 宫缩略命盘 */}
        <div style={{
          width: '300px',
          alignSelf: 'center',
          aspectRatio: '1 / 1',
          background: 'rgba(255,255,255,0.5)',
          border: `1px solid ${goldTint(0.3)}`,
          borderRadius: '8px',
          padding: '6px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridTemplateRows: 'repeat(4, 1fr)',
          gap: '3px',
          boxSizing: 'border-box',
        }}>
          {cells.map((cell, i) => {
            // 中央 4 个格子（row 1-2, col 1-2）合并为中心说明区
            if ((cell.row === 1 || cell.row === 2) && (cell.col === 1 || cell.col === 2)) return null;
            return (
              <div key={i} style={{
                gridRow: cell.row + 1,
                gridColumn: cell.col + 1,
                background: cell.isMing ? goldTint(0.18) : 'rgba(255,255,255,0.62)',
                border: cell.isMing
                  ? `1.5px solid ${BRAND.gold}`
                  : `0.5px solid ${goldTint(0.22)}`,
                borderRadius: '4px',
                padding: '4px 5px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* 宫名 + 地支 */}
                <div style={{
                  fontSize: '11px',
                  color: cell.isMing ? BRAND.goldText : BRAND.inkSoft,
                  letterSpacing: '0.03em',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  lineHeight: 1.15,
                }}>
                  <span style={{ fontWeight: cell.isMing ? 700 : 500 }}>
                    {cell.palace?.name || ''}
                    {cell.isShen ? '·身' : ''}
                  </span>
                  <span style={{ fontSize: '10px', color: BRAND.inkSoft }}>{BRANCH_NAMES[cell.branch]}</span>
                </div>
                {/* 主星 */}
                <div style={{
                  marginTop: '1px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1px',
                  flex: 1,
                  justifyContent: 'center',
                }}>
                  {cell.majors.length > 0 ? cell.majors.slice(0, 2).map((s, j) => (
                    <div key={j} style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: cell.isMing ? BRAND.goldText : BRAND.ink,
                      letterSpacing: '0.01em',
                      lineHeight: 1.15,
                      whiteSpace: 'nowrap',
                    }}>
                      {s.name}
                      {s.siHua ? (
                        <span style={{ fontSize: '10px', color: BRAND.cinnabarText, marginLeft: '2px' }}>{s.siHua}</span>
                      ) : ''}
                    </div>
                  )) : (
                    <div style={{ fontSize: '11px', color: BRAND.inkSoft }}>空宫</div>
                  )}
                </div>
              </div>
            );
          })}

          {/* 中央说明区（占据 4 个格子）*/}
          <div style={{
            gridRow: '2 / 4',
            gridColumn: '2 / 4',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: goldTint(0.07),
            border: `0.5px dashed ${goldTint(0.35)}`,
            borderRadius: '4px',
            padding: '6px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '15px', color: BRAND.ink, fontWeight: 700, letterSpacing: '0.1em', lineHeight: 1.2 }}>
              紫微斗数
            </div>
            <div style={{
              fontSize: '11px', color: BRAND.goldText, letterSpacing: '0.05em',
              marginTop: '5px', lineHeight: 1.65,
            }}>
              命宫 {mingBranchName} · 身宫 {shenBranchName}
              <br />
              {chart.wuxingJuName}
            </div>
          </div>
        </div>

        {/* 右：关键信息（固定间距，不再用 space-between 拉出空白） */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>

          {/* ① 命宫主星 */}
          <div style={{ fontSize: '12px', color: BRAND.goldText, letterSpacing: '0.16em', marginBottom: '2px' }}>
            命宫 · {mingBranchName}宫
          </div>
          <div style={{
            fontSize: mingStarStr.length > 4 ? '36px' : '44px',
            fontWeight: 800,
            color: BRAND.ink,
            letterSpacing: '0.02em',
            lineHeight: 1.05,
            marginBottom: '9px',
          }}>
            {mingStarStr}
          </div>

          {/* ② 本命四化 */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '5px',
            paddingBottom: '9px', marginBottom: '9px',
            borderBottom: `1px solid ${goldTint(0.28)}`,
          }}>
            {siHuaList.length > 0 ? siHuaList.map(({ label, star }) => (
              <span key={label} style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                fontSize: '12px', lineHeight: 1.4,
                padding: '3px 7px', borderRadius: '5px',
                background: 'rgba(255,255,255,0.62)',
                border: `1px solid ${goldTint(0.3)}`,
                color: BRAND.ink,
              }}>
                <span style={{ color: BRAND.cinnabarText, fontWeight: 700 }}>化{label}</span>
                {star}
              </span>
            )) : (
              <span style={{ fontSize: '12px', color: BRAND.inkSoft }}>本命无四化</span>
            )}
          </div>

          {/* ③ 高亮句（可选） */}
          {highlight && (
            <div style={{
              fontSize: '13px',
              color: BRAND.inkWarm,
              fontWeight: 500,
              padding: '7px 10px',
              background: 'rgba(255,255,255,0.55)',
              borderLeft: `3px solid ${BRAND.gold}`,
              borderRadius: '4px',
              letterSpacing: '0.02em',
              lineHeight: 1.5,
              marginBottom: '9px',
            }}>{highlight}</div>
          )}

          {/* ④ 当前大限 */}
          {dx && (
            <div style={{ fontSize: '12px', color: BRAND.ink, letterSpacing: '0.02em', lineHeight: 1.5 }}>
              <span style={{ color: BRAND.inkSoft }}>当前大限　</span>
              <span style={{ fontWeight: 600 }}>{dx.startAge}–{dx.endAge} 岁 · {dx.palaceName}</span>
            </div>
          )}

          {/* ⑤ 品牌落款（贴底，把剩余空间收干净） */}
          <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
            <div style={{
              padding: '9px 12px',
              background: 'linear-gradient(135deg, rgba(212,169,72,0.20) 0%, rgba(184,146,42,0.08) 100%)',
              border: `1px solid ${goldTint(0.32)}`,
              borderRadius: '6px',
            }}>
              <div style={{ fontSize: '13px', color: BRAND.ink, fontWeight: 600, letterSpacing: '0.06em', lineHeight: 1.45 }}>
                紫微为门 · 天地人为路
              </div>
              <div style={{
                fontSize: '11px', color: BRAND.goldText, fontWeight: 500,
                letterSpacing: '0.04em', lineHeight: 1.5, marginTop: '2px',
              }}>
                {SITE_NAME} · {SITE_HOST}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** 截图工具：把上面的 div 转成 PNG dataURL */
export async function captureShareCard(): Promise<string | null> {
  try {
    const html2canvas = (await import('html2canvas')).default;
    const node = document.getElementById('share-card');
    if (!node) return null;
    const canvas = await html2canvas(node, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
      logging: false,
    });
    return canvas.toDataURL('image/png');
  } catch (e) {
    console.error('captureShareCard failed', e);
    return null;
  }
}

export function downloadDataURL(dataURL: string, filename: string) {
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
