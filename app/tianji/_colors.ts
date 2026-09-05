'use client';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { useTheme, type Theme } from '@/components/ThemeProvider';

/**
 * 天纪页统一色彩 token（与首页 design language 同源）
 *
 * 不抽到全局 lib：这是天纪模块局部 helper，避免影响其他模块。
 * 复用首页的核心 token：bgBase、cardBg、cardBorder、cardShadow、goldSolid、
 * goldLine、textPrimary/textSecond/textMuted/textFaint、featureBg/featureBord。
 */

export type TianjiColors = ReturnType<typeof useTianjiColors>;

export function useTianjiColors(theme: Theme) {
  const d = theme === 'dark';
  return {
    isDark: d,
    // 背景
    bgBase:        d ? '#020810'                                : '#f5efe0',
    bgAlt:         d ? 'rgba(255,255,255,0.02)'                : 'rgba(255,255,255,0.4)',
    // 导航/边框
    navBorder:     d ? 'rgba(255,255,255,0.05)'                : 'rgba(160,120,30,0.15)',
    // 金色系
    goldSolid:     d ? '#d4a843'                               : '#8b6410',
    goldLight:     d ? '#e8c060'                               : '#9a6a10',
    goldLine:      d ? 'rgba(212,168,67,0.4)'                  : 'rgba(140,100,20,0.4)',
    tagText:       d ? 'rgba(212,168,67,0.6)'                  : 'rgba(120,80,10,0.65)',
    goldGrad:      d ? 'linear-gradient(160deg,#c8993a 0%,#f0d070 40%,#c8993a 70%,#f0c755 100%)'
                      : 'linear-gradient(160deg,#6a4206 0%,#9a6a10 40%,#6a4206 70%,#885010 100%)',
    // 文字
    textPrimary:   d ? '#e8eef6'                               : '#1a1d24',
    textSecond:    d ? '#b8c6df'                               : '#3a3f4a',
    textMuted:     d ? '#9db0d0'                               : '#5a6275',
    textFaint:     d ? 'rgba(240,246,255,0.56)'                : '#9da4b3',
    // 卡片
    cardBg:        d ? 'rgba(255,255,255,0.05)'                : 'rgba(255,255,255,0.88)',
    cardBorder:    d ? 'rgba(255,255,255,0.10)'                : 'rgba(200,160,60,0.25)',
    cardShadow:    d ? '0 4px 32px rgba(0,0,0,0.5)'            : '0 4px 24px rgba(140,100,20,0.12)',
    featureBg:     d ? 'rgba(255,255,255,0.04)'                : 'rgba(255,255,255,0.75)',
    featureBord:   d ? 'rgba(255,255,255,0.08)'                : 'rgba(200,160,60,0.2)',
    featureShadow: d ? '0 4px 16px rgba(0,0,0,0.4)'            : '0 4px 16px rgba(140,100,20,0.08)',
    // 装饰光晕
    glowTint:      d ? 'rgba(212,168,67,0.07)'                 : 'rgba(180,140,40,0.06)',
    glowBlue:      d ? 'rgba(40,80,160,0.12)'                  : 'rgba(58,90,130,0.06)',
    // CTA
    ctaBg:         d ? 'linear-gradient(135deg,#b8892a,#f0d070,#b8892a)'
                      : 'linear-gradient(135deg,#6a4206,#9a6810,#6a4206)',
    ctaText:       d ? '#08080a'                               : '#f8f3e8',
    // 状态
    statusActive:  d ? 'rgba(96,165,250,0.5)'                  : 'rgba(58,90,130,0.5)',
    statusPreview: d ? 'rgba(212,168,67,0.5)'                  : 'rgba(140,100,20,0.5)',
    statusComing:  d ? 'rgba(255,255,255,0.15)'                : 'rgba(0,0,0,0.18)',
  };
}

/**
 * 把当前背景同步到 body 根，避免 fixed nav 透出主题色差。
 */
export function useSyncBodyBackground(bgBase: string) {
  useLayoutEffect(() => {
    document.documentElement.style.background = bgBase;
    document.body.style.background = bgBase;
    return () => {
      document.documentElement.style.background = '';
      document.body.style.background = '';
    };
  }, [bgBase]);
}

/**
 * 抑制 hydration 警告的 SSR 占位：useTheme 在客户端挂载前默认 dark，
 * 天纪页如果在 SSR 时输出 light 样式会触发 hydration mismatch。
 * mount 前必须保持与默认 dark 一致的样式。
 */
export function useIsMounted() {
  const ref = useRef(false);
  useEffect(() => { ref.current = true; }, []);
  return ref.current;
}