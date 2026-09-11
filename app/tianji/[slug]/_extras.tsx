'use client';

/**
 * 天纪子模块差异化定制区块
 *
 * 通用模板（[slug]/page.tsx）负责渲染模块公共结构，
 * 本文件按 slug 提供每个术数各自的「可视化 / 实战工具」区块，
 * 让紫微、堪舆、推命、面相、测字五页不再长得一模一样。
 *
 * 纯 JSX 组件（不导出 hook），避免 TSX 解析歧义。
 */

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { useTianjiColors } from '../_colors';
import { STAR_DESCRIPTIONS } from '@/lib/ziwei/constants';
import { analyzeText, lookupRadicalWuxing } from '@/lib/cezi/dict';
import { FENGSHUI_ENTRIES } from '@/lib/nihai/tianji';

// ─── 通用小部件 ─────────────────────────────────────────

function Block({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  const c = useTianjiColors(theme);

  return (
    <section className="relative px-6 py-12">
      <div className="mx-auto" style={{ maxWidth: '960px' }}>
        <div className="flex items-center gap-3 mb-6 justify-center">
          <div
            className="h-px w-12"
            style={{ background: `linear-gradient(to right, transparent, ${c.goldLine})` }}
          />
          <div className="text-center">
            <span className="text-[12px] tracking-[0.4em] uppercase" style={{ color: c.tagText }}>
              {title}
            </span>
            {subtitle && (
              <div className="text-[12px] mt-1" style={{ color: c.textFaint }}>
                {subtitle}
              </div>
            )}
          </div>
          <div
            className="h-px w-12"
            style={{ background: `linear-gradient(to left, transparent, ${c.goldLine})` }}
          />
        </div>
        {children}
      </div>
    </section>
  );
}

/**
 * 洛书九宫格
 * cells 为行优先 9 项，每项 { label, sub?, tone? }
 */
function NineGrid({
  cells,
  center,
}: {
  cells: { label: string; sub?: string; tone?: 'good' | 'bad' | 'mid' }[];
  center?: string;
}) {
  const { theme } = useTheme();
  const c = useTianjiColors(theme);

  const toneColor = (t?: string) => {
    if (t === 'good') return c.goldSolid;
    if (t === 'bad') return 'var(--state-bad)';
    return c.textMuted;
  };

  return (
    <div className="max-w-sm mx-auto">
      <div className="grid grid-cols-3 gap-1.5">
        {cells.map((cell, i) => (
          <div
            key={i}
            className="aspect-square rounded-lg flex flex-col items-center justify-center p-1 text-center"
            style={{
              background: c.cardBg,
              border: `1px solid ${i === 4 ? c.goldLine : c.cardBorder}`,
            }}
          >
            <span
              className="text-sm font-serif leading-tight"
              style={{ color: toneColor(cell.tone) }}
            >
              {cell.label}
            </span>
            {cell.sub && (
              <span className="text-[11px] mt-0.5" style={{ color: c.textFaint }}>
                {cell.sub}
              </span>
            )}
          </div>
        ))}
      </div>
      {center && (
        <p className="text-[12px] text-center mt-3" style={{ color: c.textFaint }}>
          {center}
        </p>
      )}
    </div>
  );
}

// ─── 1. 紫微斗数 ────────────────────────────────────────
function ZiweiExtra() {
  const { theme } = useTheme();
  const c = useTianjiColors(theme);
  const stars = Object.entries(STAR_DESCRIPTIONS);

  return (
    <>
      {/* 实战入口 */}
      <Block title="实战 · 起命盘" subtitle="学了就要用，排一张自己的盘对照着看">
        <div
          className="rounded-2xl p-6 lg:p-8 text-center"
          style={{
            background: c.cardBg,
            border: `1px solid ${c.goldLine}`,
            boxShadow: c.featureShadow,
          }}
        >
          <p className="text-sm leading-relaxed mb-5" style={{ color: c.textSecond }}>
            紫微斗数重在「安星准确 + 三方四正会照」。
            输入生辰即可排出本命盘，再对照本页讲义逐宫解读。
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/chart"
              className="px-6 py-2.5 rounded-full text-xs tracking-[0.2em] font-medium"
              style={{ background: c.ctaBg, color: c.ctaText }}
            >
              立即起命盘
            </Link>
            <Link
              href="/knowledge"
              className="px-6 py-2.5 rounded-full text-xs tracking-[0.2em]"
              style={{ border: `1px solid ${c.goldLine}`, color: c.goldSolid }}
            >
              星曜知识库
            </Link>
          </div>
        </div>
      </Block>

      {/* 十四主星速览 */}
      <Block title="十四主星速览" subtitle="点击任一颗，进入星曜详解">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {stars.map(([name, info]) => (
            <Link
              key={name}
              href="/knowledge"
              className="rounded-xl p-3 text-center transition-transform hover:scale-[1.03]"
              style={{ background: c.featureBg, border: `1px solid ${c.featureBord}` }}
              aria-label={`${name}星详解`}
            >
              <div className="text-base font-serif mb-1" style={{ color: c.goldSolid }}>
                {name}
              </div>
              <div className="text-[12px]" style={{ color: c.textFaint }}>
                {info.keywords}
              </div>
            </Link>
          ))}
        </div>
      </Block>
    </>
  );
}

// ─── 2. 堪舆（九星派）──────────────────────────────────
const NINE_STARS: { num: number; name: string; trigram: string; element: string; tone: 'good' | 'bad' | 'mid' }[] = [
  { num: 1, name: '贪狼', trigram: '坎', element: '水', tone: 'good' },
  { num: 2, name: '巨门', trigram: '坤', element: '土', tone: 'bad' },
  { num: 3, name: '禄存', trigram: '震', element: '木', tone: 'bad' },
  { num: 4, name: '文曲', trigram: '巽', element: '木', tone: 'good' },
  { num: 5, name: '廉贞', trigram: '中', element: '土', tone: 'bad' },
  { num: 6, name: '武曲', trigram: '乾', element: '金', tone: 'good' },
  { num: 7, name: '破军', trigram: '兑', element: '金', tone: 'bad' },
  { num: 8, name: '左辅', trigram: '艮', element: '土', tone: 'good' },
  { num: 9, name: '右弼', trigram: '离', element: '火', tone: 'good' },
];

/** 洛书飞泊序：行优先 = 4 9 2 / 3 5 7 / 8 1 6 */
const LUOSHU_LAYOUT = [4, 9, 2, 3, 5, 7, 8, 1, 6];

function KanyuExtra() {
  const { theme } = useTheme();
  const c = useTianjiColors(theme);
  const [activeFilter, setActiveFilter] = useState<'all' | 'yangzhai' | 'yinzhai' | 'theory'>('all');
  const [openId, setOpenId] = useState<string | null>(null);

  const cells = LUOSHU_LAYOUT.map(n => {
    const s = NINE_STARS.find(x => x.num === n)!;
    return { label: s.name, sub: `${n}白·${s.trigram}`, tone: s.tone };
  });

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return FENGSHUI_ENTRIES;
    return FENGSHUI_ENTRIES.filter(e => e.category === activeFilter);
  }, [activeFilter]);

  const counts = useMemo(() => ({
    all: FENGSHUI_ENTRIES.length,
    yangzhai: FENGSHUI_ENTRIES.filter(e => e.category === 'yangzhai').length,
    yinzhai: FENGSHUI_ENTRIES.filter(e => e.category === 'yinzhai').length,
    theory: FENGSHUI_ENTRIES.filter(e => e.category === 'theory').length,
  }), []);

  const catLabel = (cat: string) =>
    cat === 'yangzhai' ? '阳宅' : cat === 'yinzhai' ? '阴宅' : '理论';

  return (
    <>
      {/* 九宫图（保留） */}
      <Block title="紫白九星飞泊" subtitle="洛书九宫 · 杨救贫流派">
        <NineGrid
          cells={cells}
          center="一白、六白、八白为三吉星；二黑、五黄为大凶，宜避之。飞泊随元运而转，当运者旺，失运者衰。"
        />
        <div className="max-w-2xl mx-auto mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {NINE_STARS.map(s => (
            <div
              key={s.num}
              className="rounded-lg px-3 py-2 flex items-center justify-between"
              style={c_cardStyle(theme, s.tone)}
            >
              <span className="text-xs" style={{ fontFamily: 'var(--font-serif)' }}>
                {s.num}·{s.name}
              </span>
              <span className="text-[12px]">
                {s.trigram}宫 · {s.element}
              </span>
            </div>
          ))}
        </div>
      </Block>

      {/* B5 · 堪舆条目检索 */}
      <Block title="堪舆条目检索" subtitle={`共 ${FENGSHUI_ENTRIES.length} 条 · 倪师天纪遗稿整理`}>
        {/* 类别过滤器 */}
        <div className="max-w-2xl mx-auto mb-4 flex flex-wrap gap-2">
          {([
            { k: 'all', label: '全部' },
            { k: 'yangzhai', label: '阳宅' },
            { k: 'yinzhai', label: '阴宅' },
            { k: 'theory', label: '理论' },
          ] as { k: typeof activeFilter; label: string }[]).map(t => {
            const on = activeFilter === t.k;
            return (
              <button
                key={t.k}
                type="button"
                onClick={() => setActiveFilter(t.k)}
                aria-pressed={on}
                className="px-3 py-1 rounded-full text-[13px] tracking-wider transition-colors"
                style={{
                  background: on ? c.goldSolid : c.featureBg,
                  border: `1px solid ${on ? c.goldLine : c.featureBord}`,
                  color: on ? '#fff' : c.textSecond,
                }}
              >
                {t.label}
                <span className="ml-1.5 text-[12px]" style={{ color: on ? c.goldSolid : c.textFaint }}>
                  {counts[t.k]}
                </span>
              </button>
            );
          })}
        </div>

        {/* 条目列表 */}
        <div className="max-w-2xl mx-auto space-y-2">
          {filtered.map(e => {
            const on = openId === e.id;
            return (
              <div
                key={e.id}
                className="rounded-xl overflow-hidden transition-all"
                style={{ background: c.featureBg, border: `1px solid ${on ? c.goldLine : c.featureBord}` }}
              >
                <button
                  type="button"
                  onClick={() => setOpenId(on ? null : e.id)}
                  aria-expanded={on}
                  className="w-full text-left px-4 py-3 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-1">
                    <span
                      className="text-[12px] tracking-[0.15em] px-2 py-0.5 rounded"
                      style={{
                        background: c.cardBg,
                        border: `1px solid ${c.featureBord}`,
                        color: catLabel(e.category) === '阳宅'
                          ? c.goldSolid
                          : catLabel(e.category) === '阴宅'
                          ? '#9db0d0'
                          : c.textFaint,
                      }}
                    >
                      {catLabel(e.category)}
                    </span>
                    <span className="text-sm font-serif" style={{ color: c.textPrimary }}>
                      {e.title}
                    </span>
                  </div>
                  <span
                    className="text-[12px] transition-transform shrink-0"
                    style={{
                      color: c.textFaint,
                      transform: on ? 'rotate(90deg)' : 'rotate(0deg)',
                    }}
                  >
                    ▶
                  </span>
                </button>
                {on && (
                  <div
                    className="px-4 pb-4 pt-1 space-y-2"
                    style={{ borderTop: `1px solid ${c.featureBord}` }}
                  >
                    <p className="text-[13px] leading-relaxed" style={{ color: c.textSecond }}>
                      {e.description}
                    </p>
                    <div>
                      <div className="text-[12px] tracking-[0.15em] mb-1.5" style={{ color: c.tagText }}>
                        要点
                      </div>
                      <ul className="space-y-1">
                        {e.keyPoints.map((kp, j) => (
                          <li key={j} className="text-[13px] flex gap-2" style={{ color: c.textSecond }}>
                            <span style={{ color: c.goldSolid }}>·</span>
                            <span>{kp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <p className="text-center text-[13px] py-6" style={{ color: c.textFaint }}>
              该分类暂无条目
            </p>
          )}
        </div>
      </Block>
    </>
  );
}

/** 九星条目底色（依吉凶 + 主题响应） */
function c_cardStyle(theme: 'light' | 'dark', tone: 'good' | 'bad' | 'mid'): React.CSSProperties {
  if (tone === 'good') {
    return theme === 'dark'
      ? { background: 'rgba(212,168,67,0.12)', border: '1px solid rgba(212,168,67,0.30)', color: 'var(--ac-text)' }
      : { background: 'rgba(184,146,42,0.08)', border: '1px solid rgba(184,146,42,0.30)', color: 'var(--ac-text)' };
  }
  if (tone === 'bad') {
    return theme === 'dark'
      ? { background: 'rgba(192,85,77,0.10)', border: '1px solid rgba(192,85,77,0.25)', color: 'var(--state-bad)' }
      : { background: 'rgba(168,60,52,0.06)', border: '1px solid rgba(168,60,52,0.20)', color: 'var(--state-bad)' };
  }
  return theme === 'dark'
    ? { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', color: 'var(--tx-2)' }
    : { background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)', color: '#5a4a35' };
}

// ─── 3. 推命（河洛数理派）───────────────────────────────
function TuimingExtra() {
  const { theme } = useTheme();
  const c = useTianjiColors(theme);

  const cells = LUOSHU_LAYOUT.map(n => ({
    label: String(n),
    sub: n === 5 ? '中' : undefined,
    tone: (n % 2 === 1 ? 'good' : 'mid') as 'good' | 'mid',
  }));

  return (
    <Block title="洛书数理" subtitle="戴九履一，左三右七，二四为肩，六八为足，五居中央">
      <NineGrid
        cells={cells}
        center="纵横斜三数之和皆十五，此河洛数理之根本。倪师推命以数配卦，数以卦显，卦以数成。"
      />
      <div
        className="max-w-2xl mx-auto mt-6 rounded-xl p-5"
        style={{ background: c.featureBg, border: `1px solid ${c.featureBord}` }}
      >
        <div className="text-[12px] tracking-[0.25em] mb-3" style={{ color: c.tagText }}>
          数理要点
        </div>
        <ul className="space-y-1.5">
          {[
            '奇数为阳、偶数为阴；阳数主动，阴数主静',
            '一六共宗（水）、二七同道（火）、三八为朋（木）、四九为友（金）、五十同途（土）',
            '天数二十五、地数三十，合五十五为天地之数',
            '推命以数入卦，卦成而象见，象见而事明',
          ].map((t, i) => (
            <li key={i} className="text-xs flex gap-2" style={{ color: c.textSecond }}>
              <span style={{ color: c.goldSolid }}>·</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </Block>
  );
}

// ─── 4. 面相（神异赋）───────────────────────────────────
const FACE_ZONES = [
  { name: '天庭', range: '15-30 岁', desc: '额主官禄与早年运，宜饱满明润' },
  { name: '眉', range: '31-34 岁', desc: '兄弟宫，主情谊与个性，宜清秀有势' },
  { name: '眼', range: '35-40 岁', desc: '监察官，主心性与决断，宜黑白分明' },
  { name: '鼻', range: '41-50 岁', desc: '财帛宫，主财气与自我，宜梁挺准丰' },
  { name: '颧', range: '权力', desc: '主权力与担当，宜高耸配鼻，不宜孤峰' },
  { name: '人中', range: '51-55 岁', desc: '主子嗣与晚运，宜深长清晰' },
  { name: '口', range: '56-60 岁', desc: '出纳宫，主食禄与言语，宜棱角分明' },
  { name: '地阁', range: '晚年', desc: '主田宅与奴仆，宜方圆厚实' },
];

function MianxiangExtra() {
  const { theme } = useTheme();
  const c = useTianjiColors(theme);
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [step, setStep] = useState<'browse' | 'quiz' | 'report'>('browse');
  const [quizIndex, setQuizIndex] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [report, setReport] = useState<MianxiangReport | null>(null);

  const startQuiz = () => {
    setScores([]);
    setQuizIndex(0);
    setStep('quiz');
  };

  const answer = (value: number) => {
    const next = [...scores, value];
    setScores(next);
    if (quizIndex + 1 < FACE_QUIZ.length) {
      setQuizIndex(quizIndex + 1);
    } else {
      const result = buildReport(next);
      setReport(result);
      setStep('report');
      if (typeof window !== 'undefined') {
        try { window.localStorage.setItem('ziwei_mianxiang_history', JSON.stringify({ at: Date.now(), result })); } catch {}
      }
    }
  };

  const restart = () => {
    setScores([]);
    setQuizIndex(0);
    setReport(null);
    setStep('browse');
  };

  /* ─── 视图 ─── */

  // 浏览模式（原有五官分区）
  if (step === 'browse') {
    return (
      <>
        <Block title="五官分区 · 流年部位" subtitle="神异赋体系 · 上停 / 中停 / 下停">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="flex justify-center">
              <svg viewBox="0 0 200 260" className="w-full max-w-[240px]" role="img" aria-label="面相分区示意图">
                <ellipse cx="100" cy="130" rx="66" ry="92" fill="none" stroke={c.goldLine} strokeWidth="1.5" />
                <line x1="40" y1="93" x2="160" y2="93" stroke={c.featureBord} strokeWidth="1" strokeDasharray="3 3" />
                <line x1="34" y1="165" x2="166" y2="165" stroke={c.featureBord} strokeWidth="1" strokeDasharray="3 3" />
                <text x="170" y="60" fontSize="9" fill={c.textFaint} textAnchor="middle">上停</text>
                <text x="170" y="132" fontSize="9" fill={c.textFaint} textAnchor="middle">中停</text>
                <text x="170" y="205" fontSize="9" fill={c.textFaint} textAnchor="middle">下停</text>
                <path d="M68 108 Q80 100 92 108" fill="none" stroke={c.goldSolid} strokeWidth="2" strokeLinecap="round" />
                <path d="M108 108 Q120 100 132 108" fill="none" stroke={c.goldSolid} strokeWidth="2" strokeLinecap="round" />
                <ellipse cx="80" cy="122" rx="11" ry="5" fill="none" stroke={c.goldSolid} strokeWidth="1.5" />
                <ellipse cx="120" cy="122" rx="11" ry="5" fill="none" stroke={c.goldSolid} strokeWidth="1.5" />
                <path d="M100 128 L100 156 Q100 162 94 162 L106 162" fill="none" stroke={c.goldSolid} strokeWidth="1.5" strokeLinecap="round" />
                <path d="M88 186 Q100 192 112 186" fill="none" stroke={c.goldSolid} strokeWidth="1.5" strokeLinecap="round" />
                <path d="M84 212 Q100 220 116 212" fill="none" stroke={c.goldSolid} strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="space-y-1.5">
              {FACE_ZONES.map(z => {
                const on = activeZone === z.name;
                return (
                  <button
                    key={z.name}
                    type="button"
                    onClick={() => setActiveZone(on ? null : z.name)}
                    aria-expanded={on}
                    className="w-full text-left rounded-lg px-3 py-2 transition-colors"
                    style={{
                      background: on ? c.glowTint : c.featureBg,
                      border: `1px solid ${on ? c.goldLine : c.featureBord}`,
                    }}
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-serif" style={{ color: c.goldSolid }}>{z.name}</span>
                      <span className="text-[12px]" style={{ color: c.textFaint }}>{z.range}</span>
                    </div>
                    {on && (
                      <p className="text-[12px] mt-1 leading-relaxed" style={{ color: c.textSecond }}>{z.desc}</p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={startQuiz}
              className="px-6 py-2.5 rounded-full text-xs tracking-[0.2em] font-medium transition-all"
              style={{ background: c.ctaBg, color: c.ctaText }}
            >
              开始 21 题面相自测 →
            </button>
            <p className="text-[12px] mt-2" style={{ color: c.textFaint }}>
              根据倪师《神相》要诀，从神气形色四维度自评，得面相报告。
            </p>
          </div>
        </Block>
      </>
    );
  }

  // 自测模式
  if (step === 'quiz') {
    const q = FACE_QUIZ[quizIndex];
    const progress = Math.round(((quizIndex) / FACE_QUIZ.length) * 100);
    return (
      <Block title={`面相自测 · 第 ${quizIndex + 1} / ${FACE_QUIZ.length} 题`} subtitle={q.dim}>
        <div className="max-w-2xl mx-auto">
          {/* 进度条 */}
          <div className="mb-6 h-1 rounded-full overflow-hidden" style={{ background: c.featureBord }}>
            <div
              className="h-full"
              style={{ width: `${progress}%`, background: c.goldSolid, transition: 'width 0.3s' }}
            />
          </div>
          <p className="text-sm leading-loose mb-6" style={{ color: c.textPrimary, fontFamily: 'var(--font-serif)' }}>
            {q.q}
          </p>
          <div className="space-y-2">
            {q.options.map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => answer(opt.score)}
                className="w-full text-left rounded-lg px-4 py-3 transition-all"
                style={{
                  background: c.cardBg,
                  border: `1px solid ${c.cardBorder}`,
                  color: c.textSecond,
                }}
              >
                <span className="text-[13px] leading-relaxed">{opt.text}</span>
              </button>
            ))}
          </div>
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={restart}
              className="text-[12px] tracking-wider"
              style={{ color: c.textFaint }}
            >
              放弃返回
            </button>
          </div>
        </div>
      </Block>
    );
  }

  // 报告模式
  if (step === 'report' && report) {
    const levelColor = (lvl: string) => {
      if (lvl.includes('上')) return 'var(--cat-renji)';
      if (lvl.includes('中')) return '#d4a843';
      return 'var(--state-bad)';
    };
    return (
      <>
        <Block title="面相报告" subtitle={`总评分 ${report.totalScore} / ${FACE_QUIZ.length * 4} · 综合：${report.overallLevel}`}>
          <div className="max-w-3xl mx-auto space-y-4">
            {/* 维度分 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {report.dimScores.map((d, i) => (
                <div
                  key={i}
                  className="rounded-lg px-3 py-3 text-center"
                  style={{
                    background: c.cardBg,
                    border: `1px solid ${levelColor(d.level) === 'var(--cat-renji)' ? c.goldLine : c.cardBorder}`,
                  }}
                >
                  <div className="text-[12px] mb-1" style={{ color: c.textFaint }}>{d.dim}</div>
                  <div className="text-xl font-serif" style={{ color: levelColor(d.level) }}>{d.score}</div>
                  <div className="text-[12px] mt-1" style={{ color: levelColor(d.level) }}>{d.level}</div>
                </div>
              ))}
            </div>

            {/* 总体解读 */}
            <div
              className="rounded-xl p-5"
              style={{ background: c.featureBg, border: `1px solid ${c.goldLine}` }}
            >
              <div className="text-[12px] tracking-[0.2em] mb-2" style={{ color: c.tagText }}>综合解读</div>
              <p className="text-sm leading-loose" style={{ color: c.textPrimary, fontFamily: 'var(--font-serif)' }}>
                {report.summary}
              </p>
            </div>

            {/* 各维度详细解读 */}
            <div className="space-y-2">
              <div className="text-[12px] tracking-[0.2em]" style={{ color: c.tagText }}>维度解读</div>
              {report.dimScores.map((d, i) => (
                <details
                  key={i}
                  className="rounded-lg px-4 py-3"
                  style={{ background: c.cardBg, border: `1px solid ${c.cardBorder}` }}
                >
                  <summary className="cursor-pointer flex items-center justify-between" style={{ color: c.textPrimary }}>
                    <span className="text-xs font-serif">{d.dim}</span>
                    <span className="text-[12px]" style={{ color: levelColor(d.level) }}>{d.score} 分 · {d.level}</span>
                  </summary>
                  <p className="text-[13px] mt-2 leading-loose" style={{ color: c.textSecond }}>
                    {d.detail}
                  </p>
                </details>
              ))}
            </div>

            {/* 倪师精要 */}
            <div
              className="rounded-xl p-4"
              style={{ background: c.featureBg, border: `1px solid ${c.goldLine}` }}
            >
              <div className="text-[12px] tracking-[0.2em] mb-2" style={{ color: c.tagText }}>倪师《神相》精要</div>
              <p className="text-[13px] leading-loose" style={{ color: c.textSecond, fontFamily: 'var(--font-serif)' }}>
                {report.niNote}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={restart}
                className="px-5 py-2 rounded-full text-xs tracking-wider transition-all"
                style={{ background: c.ctaBg, color: c.ctaText }}
              >
                再测一次
              </button>
              <button
                type="button"
                onClick={() => { if (typeof window !== 'undefined') window.print(); }}
                className="px-5 py-2 rounded-full text-xs tracking-wider transition-all"
                style={{ background: 'transparent', color: c.goldSolid, border: `1px solid ${c.goldLine}` }}
              >
                打印报告
              </button>
            </div>
          </div>
        </Block>
      </>
    );
  }

  return null;
}

/* ─── 面相自测题库 ─── */

interface QuizOption {
  text: string;
  score: number; // 0=最差, 4=最好
}

interface QuizQuestion {
  dim: string; // 神/气/形/色/眉/鼻/口/声
  q: string;
  options: QuizOption[];
}

const FACE_QUIZ: QuizQuestion[] = [
  // 神（眼神）
  { dim: '神·眼神', q: '看自己的眼睛（镜中/照片），眼神给人的感觉是？', options: [
    { text: '暗淡无神，目光散漫', score: 0 },
    { text: '略带倦意，偶有失神', score: 1 },
    { text: '平和淡然，不露锋芒', score: 2 },
    { text: '清澈有神，光彩内敛', score: 3 },
    { text: '炯炯有神，神完气足', score: 4 },
  ]},
  { dim: '神·眼神', q: '与人对谈时，你的眼神习惯是？', options: [
    { text: '频繁游移，不敢正视', score: 0 },
    { text: '偶有飘忽', score: 1 },
    { text: '平视为主', score: 2 },
    { text: '注视对方，但知进退', score: 3 },
    { text: '目光坚定，但不压迫', score: 4 },
  ]},
  { dim: '神·眼神', q: '早晨起床后，眼神通常需要多久恢复清亮？', options: [
    { text: '整个上午都疲态', score: 0 },
    { text: '约一小时', score: 1 },
    { text: '半小时内', score: 2 },
    { text: '十几分钟', score: 3 },
    { text: '起床即清亮', score: 4 },
  ]},

  // 气（气色）
  { dim: '气·气色', q: '你的面色日常是？（以不化妆时为准）', options: [
    { text: '晦暗或苍白', score: 0 },
    { text: '略暗，气色不均', score: 1 },
    { text: '一般，无特色', score: 2 },
    { text: '红黄隐隐，明润含蓄', score: 3 },
    { text: '明润含华，红黄隐隐', score: 4 },
  ]},
  { dim: '气·气色', q: '嘴唇颜色常是？', options: [
    { text: '紫暗或苍白', score: 0 },
    { text: '淡而少血色', score: 1 },
    { text: '淡红', score: 2 },
    { text: '红润有泽', score: 3 },
    { text: '桃红明润', score: 4 },
  ]},
  { dim: '气·气色', q: '皮肤（含手）触感如何？', options: [
    { text: '粗糙干涩', score: 0 },
    { text: '偏干', score: 1 },
    { text: '一般', score: 2 },
    { text: '温润', score: 3 },
    { text: '温润如玉，柔而有泽', score: 4 },
  ]},

  // 形（形格）
  { dim: '形·形格', q: '你的面部整体轮廓是？', options: [
    { text: '明显歪斜或不对称', score: 0 },
    { text: '略有不对称', score: 1 },
    { text: '基本端正', score: 2 },
    { text: '端正饱满', score: 3 },
    { text: '骨肉停匀，格局分明', score: 4 },
  ]},
  { dim: '形·形格', q: '额头（上停）的形态？', options: [
    { text: '凹陷窄小，发际不齐', score: 0 },
    { text: '略窄', score: 1 },
    { text: '中等', score: 2 },
    { text: '饱满圆润', score: 3 },
    { text: '饱满光润，少年得志之相', score: 4 },
  ]},
  { dim: '形·形格', q: '颧骨与脸颊（中停）的形态？', options: [
    { text: '削瘦无肉', score: 0 },
    { text: '肉少骨显', score: 1 },
    { text: '中等', score: 2 },
    { text: '骨肉相称', score: 3 },
    { text: '骨肉停匀，中年有权', score: 4 },
  ]},

  // 眉
  { dim: '眉', q: '你的眉毛是？', options: [
    { text: '散乱逆生或残缺', score: 0 },
    { text: '较乱，杂眉多', score: 1 },
    { text: '一般', score: 2 },
    { text: '清秀有型', score: 3 },
    { text: '清秀长扬，眉毛光彩', score: 4 },
  ]},
  { dim: '眉', q: '眉间距（两眉之间距离）？', options: [
    { text: '极窄（眉心紧锁）', score: 0 },
    { text: '偏窄', score: 1 },
    { text: '中等（一指宽）', score: 2 },
    { text: '适中', score: 3 },
    { text: '开阔有势', score: 4 },
  ]},
  { dim: '眉', q: '眉毛的浓淡？', options: [
    { text: '极淡似无', score: 0 },
    { text: '偏淡', score: 1 },
    { text: '中等', score: 2 },
    { text: '浓淡适中', score: 3 },
    { text: '浓淡适宜，光润有彩', score: 4 },
  ]},

  // 鼻
  { dim: '鼻', q: '鼻梁的形态？', options: [
    { text: '塌陷或弯曲', score: 0 },
    { text: '偏低', score: 1 },
    { text: '中等', score: 2 },
    { text: '挺直', score: 3 },
    { text: '挺直丰隆，准头圆润', score: 4 },
  ]},
  { dim: '鼻', q: '鼻翼（准头）状态？', options: [
    { text: '薄削或露孔', score: 0 },
    { text: '偏薄', score: 1 },
    { text: '中等', score: 2 },
    { text: '丰隆有肉', score: 3 },
    { text: '丰隆有肉，含蓄不露', score: 4 },
  ]},
  { dim: '鼻', q: '山根（鼻梁与眉心之间）？', options: [
    { text: '凹陷断裂', score: 0 },
    { text: '偏低', score: 1 },
    { text: '中等', score: 2 },
    { text: '丰满', score: 3 },
    { text: '丰满光润，少年根基稳固', score: 4 },
  ]},

  // 口
  { dim: '口', q: '嘴型轮廓？', options: [
    { text: '歪斜、唇薄', score: 0 },
    { text: '唇薄', score: 1 },
    { text: '中等', score: 2 },
    { text: '轮廓清晰', score: 3 },
    { text: '轮廓分明，唇色红润', score: 4 },
  ]},
  { dim: '口', q: '牙齿是否整齐？', options: [
    { text: '明显不齐', score: 0 },
    { text: '略不齐', score: 1 },
    { text: '一般', score: 2 },
    { text: '整齐', score: 3 },
    { text: '整齐洁白', score: 4 },
  ]},
  { dim: '口', q: '说话时的语速、语调？', options: [
    { text: '急躁含混', score: 0 },
    { text: '略急', score: 1 },
    { text: '一般', score: 2 },
    { text: '清晰平稳', score: 3 },
    { text: '清晰朗润', score: 4 },
  ]},

  // 兼（综合）
  { dim: '兼·整体', q: '他人对你的第一印象多是？', options: [
    { text: '憔悴/疲惫', score: 0 },
    { text: '普通', score: 1 },
    { text: '中规中矩', score: 2 },
    { text: '有亲和力', score: 3 },
    { text: '端正有气度，亲和而敬', score: 4 },
  ]},
  { dim: '兼·整体', q: '你的下停（地阁·下巴）？', options: [
    { text: '削瘦兜不住', score: 0 },
    { text: '偏瘦', score: 1 },
    { text: '中等', score: 2 },
    { text: '方圆有肉', score: 3 },
    { text: '方圆饱满，晚年有禄', score: 4 },
  ]},
  { dim: '兼·整体', q: '颈项（脖子）状态？', options: [
    { text: '细弱歪斜', score: 0 },
    { text: '偏细', score: 1 },
    { text: '中等', score: 2 },
    { text: '粗壮适中', score: 3 },
    { text: '粗壮挺直', score: 4 },
  ]},
];

interface DimScore {
  dim: string;
  score: number;
  level: '上等' | '中等' | '下等';
  detail: string;
}

interface MianxiangReport {
  totalScore: number;
  overallLevel: string;
  dimScores: DimScore[];
  summary: string;
  niNote: string;
}

function buildReport(scores: number[]): MianxiangReport {
  const dimMap = new Map<string, number[]>();
  for (let i = 0; i < FACE_QUIZ.length; i++) {
    const q = FACE_QUIZ[i];
    if (!dimMap.has(q.dim)) dimMap.set(q.dim, []);
    dimMap.get(q.dim)!.push(scores[i] ?? 0);
  }

  const dimScores: DimScore[] = [];
  let total = 0;

  const dimNameMap: Record<string, string> = {
    '神·眼神': '神',
    '气·气色': '气',
    '形·形格': '形',
    '眉': '眉',
    '鼻': '鼻',
    '口': '口',
    '兼·整体': '兼',
  };

  const dimDetailMap: Record<string, string> = {
    '神·眼神': '神为相之主。眼神清亮则心明志定，神完气足则事业可期；暗淡失神则宜修心养性。',
    '气·气色': '气为相之辅。气色明润则脏腑安和，气色晦暗则气血有亏。',
    '形·形格': '形为相之体。骨肉停匀、五官端正者，多主一生平稳。',
    '眉': '眉为情志。眉清目秀主聪慧仁厚，散乱逆生主性情不定。',
    '鼻': '鼻为财帛。鼻梁丰隆主中年有禄，准头有肉主进财有度。',
    '口': '口为食禄。唇红齿白主福禄双全，唇薄齿乱主口福稍逊。',
    '兼·整体': '兼看三停、颈项、整体气象。三停相称为上相。',
  };

  for (const [dim, arr] of dimMap.entries()) {
    const sum = arr.reduce((a, b) => a + b, 0);
    const max = arr.length * 4;
    const avgRatio = sum / max;
    total += sum;
    const level: '上等' | '中等' | '下等' =
      avgRatio >= 0.7 ? '上等' : avgRatio >= 0.4 ? '中等' : '下等';
    dimScores.push({
      dim: dimNameMap[dim] ?? dim,
      score: sum,
      level,
      detail: dimDetailMap[dim] ?? '',
    });
  }

  const totalMax = FACE_QUIZ.length * 4;
  const overallRatio = total / totalMax;
  const overallLevel =
    overallRatio >= 0.7 ? '上相' :
    overallRatio >= 0.5 ? '中相' :
    '需修';

  const summary = overallRatio >= 0.7
    ? '神完气足，形色相宜，诸主格局相称，一生多福泽康宁。'
    : overallRatio >= 0.5
    ? '神气形色中等偏上，宜修心养性以培福德，可向更高格局进益。'
    : '神气形色有亏，宜先养气血、端品行；相随心转，修身可改之。';

  const niNote = '倪师曰：「相由心生，相随心转。」骨骼是先天之基，气色乃当下之心。先天美者不可骄，先天有缺者可由后天德行培补。神气足则命运宽，形色佳则家道昌。';

  return {
    totalScore: total,
    overallLevel,
    dimScores,
    summary,
    niNote,
  };
}

// ─── 5. 测字（字理断法）─────────────────────────────────
const RADICAL_MEANINGS = [
  { r: '木', m: '生发、条达，主事业起步、有生机' },
  { r: '火', m: '炎上、急进，主事态迅速、易冲' },
  { r: '土', m: '厚重、迟滞，主缓慢守成、宜稳' },
  { r: '金', m: '刚锐、肃杀，主决断、亦主刑伤' },
  { r: '水', m: '润下、流动，主变动、智谋' },
  { r: '人', m: '有人助，亦看人之离合' },
  { r: '心', m: '心思、忧虑，主心绪不宁' },
  { r: '口', m: '口舌、是非，亦主食禄' },
];

const CEZI_FA = [
  { t: '观形', d: '看字形之肥瘦长短，字正则事正，字斜则事偏' },
  { t: '察色', d: '看落笔之浓淡枯润，墨润者事顺，墨枯者事艰' },
  { t: '辨音', d: '谐音取象，如「梨」谐「离」，「枣」谐「早」' },
  { t: '拆解', d: '分字为部件，上下为阴阳，左右为宾主' },
  { t: '配卦', d: '以字数或笔画起卦，卦成而象见' },
];

function CeziExtra() {
  const { theme } = useTheme();
  const c = useTianjiColors(theme);
  const [text, setText] = useState('');

  const chars = [...text.trim()].filter(ch => ch.trim()).slice(0, 6);
  const analysis = analyzeText(text);

  // 五行色映射
  const wxColor = (wx: '金' | '木' | '水' | '火' | '土') => {
    const map = {
      金: '#d4a843',
      木: 'var(--cat-renji)',
      水: '#3a6b8c',
      火: 'var(--state-bad)',
      土: '#a0826d',
    };
    return map[wx];
  };
  const tendencyColor = (t: '吉' | '平' | '凶' | '随境') => {
    const map = {
      吉: 'var(--cat-renji)',
      平: '#9db0d0',
      凶: 'var(--state-bad)',
      随境: '#d4a843',
    };
    return map[t];
  };

  return (
    <>
      {/* 试测一字 */}
      <Block title="试测一字" subtitle="写下一字，先看结构，再取象断之">
        <div className="max-w-md mx-auto">
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value.slice(0, 6))}
            placeholder="输入 1-6 个字（按字查笔画 / 五行 / 偏旁 / 读音 / 吉凶）"
            aria-label="输入要测的字"
            className="w-full px-4 py-3 rounded-xl text-center text-lg outline-none"
            style={{
              background: c.cardBg,
              border: `1px solid ${c.goldLine}`,
              color: c.textPrimary,
              fontFamily: 'var(--font-serif)',
            }}
          />

          {/* 五行统计 */}
          {chars.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[12px]">
              {(['金', '木', '水', '火', '土'] as const).map(wx => {
                const n = analysis.wuxingCount[wx];
                if (n === 0) return null;
                return (
                  <span
                    key={wx}
                    className="px-2 py-1 rounded-md tracking-wider"
                    style={{
                      background: `${wxColor(wx)}22`,
                      border: `1px solid ${wxColor(wx)}66`,
                      color: wxColor(wx),
                    }}
                  >
                    {wx}·{n}
                  </span>
                );
              })}
              {analysis.tendencyCount.吉 > 0 && (
                <span className="px-2 py-1 rounded-md" style={{ background: 'var(--cat-renji)22', color: 'var(--cat-renji)', border: '1px solid var(--cat-renji)55' }}>
                  吉·{analysis.tendencyCount.吉}
                </span>
              )}
              {analysis.tendencyCount.凶 > 0 && (
                <span className="px-2 py-1 rounded-md" style={{ background: '#c0554d22', color: 'var(--state-bad)', border: '1px solid #c0554d55' }}>
                  凶·{analysis.tendencyCount.凶}
                </span>
              )}
            </div>
          )}
        </div>
      </Block>

      {/* 单字解读卡 */}
      {analysis.chars.length > 0 && (
        <Block title="逐字解读" subtitle="按字读解，倪师字理 + 部首取象">
          <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
            {analysis.chars.map((item, i) => (
              <div
                key={i}
                className="rounded-xl p-4"
                style={{
                  background: c.cardBg,
                  border: `1px solid ${item.inDict ? c.cardBorder : c.goldLine}`,
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl shrink-0"
                    style={{
                      background: c.featureBg,
                      border: `1px solid ${c.goldLine}`,
                      color: c.goldSolid,
                      fontFamily: 'var(--font-serif)',
                    }}
                  >
                    {item.ch}
                  </div>
                  <div className="flex-1 min-w-0">
                    {!item.inDict ? (
                      <p className="text-[13px] leading-relaxed" style={{ color: c.textFaint }}>
                        「{item.ch}」暂未收录。可按偏旁+笔画自行断之，或作部首拆解取象。
                      </p>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span
                            className="text-[12px] px-1.5 py-0.5 rounded tracking-wider"
                            style={{
                              background: `${wxColor(item.wuxing!)}22`,
                              color: wxColor(item.wuxing!),
                              border: `1px solid ${wxColor(item.wuxing!)}55`,
                            }}
                          >
                            五行·{item.wuxing}
                          </span>
                          <span
                            className="text-[12px] px-1.5 py-0.5 rounded tracking-wider"
                            style={{
                              background: `${tendencyColor(item.char!.tendency)}22`,
                              color: tendencyColor(item.char!.tendency),
                              border: `1px solid ${tendencyColor(item.char!.tendency)}55`,
                            }}
                          >
                            {item.char!.tendency}
                          </span>
                          <span className="text-[12px]" style={{ color: c.textFaint }}>
                            笔画 {item.char!.strokes}
                          </span>
                        </div>
                        <div className="text-[13px] leading-relaxed mb-1" style={{ color: c.textPrimary }}>
                          {item.char!.meaning}
                        </div>
                        <div className="flex items-center gap-2 text-[12px]" style={{ color: c.textMuted }}>
                          <span>部首 {item.radical}</span>
                          {lookupRadicalWuxing(item.radical) && (
                            <span style={{ color: wxColor(lookupRadicalWuxing(item.radical)!.wx) }}>
                              ·{lookupRadicalWuxing(item.radical)!.wx}
                            </span>
                          )}
                          <span>·</span>
                          <span style={{ fontFamily: 'monospace' }}>{item.char!.pinyin}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 倪师注解集 */}
          {analysis.niNotes.length > 0 && (
            <div className="max-w-3xl mx-auto mt-6">
              <div className="text-[12px] tracking-[0.2em] mb-2" style={{ color: c.tagText }}>
                倪师字理精要
              </div>
              <div className="space-y-2">
                {analysis.niNotes.map((n, i) => (
                  <div
                    key={i}
                    className="rounded-lg px-4 py-3 text-[13px] leading-relaxed"
                    style={{
                      background: c.featureBg,
                      border: `1px solid ${c.goldLine}`,
                      color: c.textSecond,
                    }}
                  >
                    <span className="text-base mr-2 font-serif" style={{ color: c.goldSolid }}>
                      {n.ch}
                    </span>
                    {n.note}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 总断 */}
          {analysis.charCount > 0 && (
            <div className="max-w-3xl mx-auto mt-6 pt-4" style={{ borderTop: `1px solid ${c.featureBord}` }}>
              <p className="text-[13px] leading-loose" style={{ color: c.textSecond }}>
                共 <span style={{ color: c.goldSolid }}>{analysis.charCount}</span> 字，
                总笔画 <span style={{ color: c.goldSolid }}>{analysis.totalStrokes}</span>。
                {analysis.charCount % 2 === 1 ? '奇数为阳，事态主动、宜进。' : '偶数为阴，事态主静、宜守。'}
                {' '}五行分布：
                <span style={{ color: wxColor('金') }}>金{analysis.wuxingCount.金}</span>·
                <span style={{ color: wxColor('木') }}>木{analysis.wuxingCount.木}</span>·
                <span style={{ color: wxColor('水') }}>水{analysis.wuxingCount.水}</span>·
                <span style={{ color: wxColor('火') }}>火{analysis.wuxingCount.火}</span>·
                <span style={{ color: wxColor('土') }}>土{analysis.wuxingCount.土}</span>。
                {analysis.tendencyCount.凶 > analysis.tendencyCount.吉 && (
                  <span style={{ color: tendencyColor('凶') }}>凶多于吉，宜慎之。</span>
                )}
                {analysis.tendencyCount.吉 > analysis.tendencyCount.凶 && analysis.tendencyCount.吉 > 0 && (
                  <span style={{ color: tendencyColor('吉') }}>吉多于凶，可行。</span>
                )}
              </p>
            </div>
          )}
        </Block>
      )}

      {/* 偏旁取象速查（保留原表） */}
      <Block title="偏旁取象速查" subtitle="一字入手，先看其偏旁属何五行">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl mx-auto">
          {RADICAL_MEANINGS.map(x => (
            <div
              key={x.r}
              className="rounded-lg px-3 py-2 flex items-start gap-3"
              style={{ background: c.featureBg, border: `1px solid ${c.featureBord}` }}
            >
              <span
                className="text-base font-serif w-6 text-center shrink-0"
                style={{ color: c.goldSolid }}
              >
                {x.r}
              </span>
              <span className="text-[13px] leading-relaxed" style={{ color: c.textSecond }}>
                {x.m}
              </span>
            </div>
          ))}
        </div>
      </Block>

      {/* 五法 */}
      <Block title="测字五法" subtitle="倪师字理断法要诀">
        <div className="max-w-2xl mx-auto space-y-2">
          {CEZI_FA.map(f => (
            <div
              key={f.t}
              className="rounded-lg px-4 py-3 flex items-start gap-3"
              style={{ background: c.cardBg, border: `1px solid ${c.cardBorder}` }}
            >
              <span className="text-xs font-serif w-8 shrink-0" style={{ color: c.goldSolid }}>
                {f.t}
              </span>
              <span className="text-[13px] leading-relaxed" style={{ color: c.textSecond }}>
                {f.d}
              </span>
            </div>
          ))}
        </div>
      </Block>
    </>
  );
}

// ─── 分发 ───────────────────────────────────────────────
export default function ModuleExtra({ slug }: { slug: string }) {
  switch (slug) {
    case 'ziwei': return <ZiweiExtra />;
    case 'kanyu': return <KanyuExtra />;
    case 'tuiming': return <TuimingExtra />;
    case 'mianxiang': return <MianxiangExtra />;
    case 'cezi': return <CeziExtra />;
    default: return null;
  }
}
