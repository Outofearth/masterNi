'use client';
import { motion } from 'framer-motion';
import type { Palace, Star } from '@/lib/ziwei/types';
import { STEMS, BRANCHES } from '@/lib/ziwei/constants';
import clsx from 'clsx';

interface PalaceCellProps {
  palace: Palace;
  onClick?: () => void;
  onStarClick?: (star: Star) => void;
  isSelected?: boolean;
  isSanFang?: boolean;
  delay?: number;
  /** 叠加四化：星名 → 四化类型（'禄'/'权'/'科'/'忌'） */
  overlayStarSiHua?: Record<string, string>;
  /** 叠加标签：'年'（流年）或 '限'（大限） */
  overlayLabel?: string;
  /** 点击叠加四化 badge 回调 */
  onSiHuaClick?: (starName: string, siHua: string) => void;
}

const SIHUA_STYLES: Record<string, string> = {
  '禄': 'sihua-lu',
  '权': 'sihua-quan',
  '科': 'sihua-ke',
  '忌': 'sihua-ji',
};

const SiHuaBadge = ({
  siHua,
  overlay,
  label,
  onClick,
}: {
  siHua: string;
  overlay?: boolean;
  label?: string;
  onClick?: (e: React.SyntheticEvent) => void;
}) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center text-[9px] px-1.5 rounded-full border leading-none py-0.5 font-bold ml-1 flex-shrink-0',
        SIHUA_STYLES[siHua],
        overlay && 'border-dashed opacity-80',
        onClick && 'cursor-pointer hover:opacity-100',
      )}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `查看化${siHua}详情` : undefined}
      onKeyDown={onClick ? (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(e); }
      } : undefined}
      onClick={onClick}
    >
      {overlay && label && <span className="mr-px opacity-70">{label}</span>}
      {siHua}
    </span>
  );
};

export default function PalaceCell({
  palace, onClick, onStarClick, isSelected, isSanFang, delay = 0,
  overlayStarSiHua, overlayLabel, onSiHuaClick,
}: PalaceCellProps) {
  const { branch, stem, name, stars, daXianAge, isCurrentDaXian, isMingGong, isShenGong } = palace;
  const ganzhi = `${STEMS[stem]}${BRANCHES[branch]}`;

  const majorStars = stars.filter(s => s.type === 'major');
  const luckyStars = stars.filter(s => s.type === 'lucky');
  const shaStars = stars.filter(s => s.type === 'sha');

  const cellLabel = `${name}宫${stars.length ? '：' + stars.map(s => s.name).join('、') : ''}`;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.(); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay, ease: 'easeOut' }}
      role="button"
      tabIndex={0}
      aria-label={cellLabel}
      onKeyDown={handleKeyDown}
      onClick={onClick}
      className="relative flex flex-col p-2 cursor-pointer transition-all duration-200 h-full"
      style={{
        minHeight: '104px',
        background: isCurrentDaXian
          ? 'var(--da-xian-bg)'
          : isSelected
          ? 'var(--sel-bg)'
          : isSanFang
          ? 'var(--sel-bg)'
          : isMingGong
          ? 'var(--ac-bg)'
          : 'var(--t-bg)',
        boxShadow: isCurrentDaXian
          ? 'inset 3px 0 0 var(--da-xian-bdr)'
          : isSelected
          ? 'inset 0 0 0 1.5px var(--sel-bdr)'
          : isSanFang
          ? 'inset 0 0 0 1px var(--sel-bdr)'
          : 'none',
      }}
    >
      {/* 大限年龄 */}
      {daXianAge && (
        <div
          className="absolute top-1.5 right-1.5 text-[10px] font-mono tabular-nums"
          style={{ color: isCurrentDaXian ? 'var(--da-xian)' : 'var(--t-faint)' }}
        >
          {daXianAge[0]}–{daXianAge[1]}
        </div>
      )}

      {/* 宫名行 */}
      <div className="flex items-center gap-1 mb-1 pr-10">
        <span
          className="text-[12px] font-medium tracking-wide"
          style={{ color: isMingGong ? 'var(--ming)' : isShenGong ? 'var(--shen)' : 'var(--t-faint)' }}
        >
          {name}
        </span>
        {isMingGong && (
          <span className="text-[9px] font-medium border px-0.5 rounded leading-tight" style={{ color: 'var(--ming)', borderColor: 'var(--bdr-med)' }}>命</span>
        )}
        {isShenGong && (
          <span className="text-[9px] font-medium border px-0.5 rounded leading-tight" style={{ color: 'var(--shen)', borderColor: 'var(--bdr-med)' }}>身</span>
        )}
      </div>

      {/* 干支 */}
      <div className="text-[10px] font-mono mb-1.5" style={{ color: 'var(--t-faint)' }}>{ganzhi}</div>

      {/* 主星 */}
      <div className="flex flex-col gap-1 flex-1">
        {majorStars.length === 0 && (
          <span className="text-[11px] italic" style={{ color: 'var(--t-faint)' }}>空宫</span>
        )}
        {majorStars.map((star) => {
          const overlaySiHua = overlayStarSiHua?.[star.name];
          return (
              <div
                key={star.name}
                role="button"
                tabIndex={0}
                aria-label={`查看${star.name}星详情`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault(); e.stopPropagation(); onStarClick?.(star);
                  }
                }}
                className="flex items-center"
                onClick={e => { e.stopPropagation(); onStarClick?.(star); }}
              >
              <span
                className="text-[15px] leading-tight font-bold tracking-tight cursor-pointer hover:brightness-125 transition-all"
                style={{ color: star.brightness === 'bright' ? 'var(--star-major-bright)' : star.brightness === 'dim' ? 'var(--star-major-dim)' : 'var(--star-major)' }}
              >
                {star.name}
              </span>
              {star.siHua && <SiHuaBadge siHua={star.siHua} />}
              {overlaySiHua && (
                <SiHuaBadge
                  siHua={overlaySiHua}
                  overlay
                  label={overlayLabel}
                  onClick={e => {
                    e.stopPropagation();
                    onSiHuaClick?.(star.name, overlaySiHua);
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* 吉星 */}
      {luckyStars.length > 0 && (
        <div className="flex flex-wrap gap-x-1.5 mt-1">
          {luckyStars.map(s => {
            const overlaySiHua = overlayStarSiHua?.[s.name];
            return (
              <span key={s.name} className="inline-flex items-center text-[10px] leading-tight" style={{ color: 'var(--lucky)' }}>
                {s.name}
                {s.siHua && <SiHuaBadge siHua={s.siHua} />}
                {overlaySiHua && (
                  <SiHuaBadge
                    siHua={overlaySiHua}
                    overlay
                    label={overlayLabel}
                    onClick={e => {
                      e.stopPropagation();
                      onSiHuaClick?.(s.name, overlaySiHua);
                    }}
                  />
                )}
              </span>
            );
          })}
        </div>
      )}

      {/* 煞星 */}
      {shaStars.length > 0 && (
        <div className="flex flex-wrap gap-x-1.5">
          {shaStars.map(s => (
            <span key={s.name} className="text-[10px] leading-tight" style={{ color: 'var(--sha)' }}>
              {s.name}{s.siHua && <SiHuaBadge siHua={s.siHua} />}
            </span>
          ))}
        </div>
      )}

    </motion.div>
  );
}
