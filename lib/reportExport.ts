/**
 * PDF 报告导出（客户端工具）
 *
 * 用法：点击按钮 → 打开一个隐藏 iframe，渲染一份「打印友好」的报告 HTML，
 * 调用浏览器打印（对话框里选"另存为 PDF"即可导出成 PDF 文件）。
 *
 * 设计要点：
 *  - 报告正文用中文宋体系字体（Source Han Serif / Noto Serif / 宋体-简 / SimSun），
 *    粗细 ≥ 400（无细体），适合打印与长时间阅读；
 *  - 报告字号放大（正文 15px、小标题 17px、表格 14px）；
 *  - 不依赖第三方 PDF 库与网络字体，任何浏览器离线可用。
 */

import type { ZiweiChart } from '@/lib/ziwei/types';

const GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

export interface ReportSection {
  heading?: string;
  html: string;
}

export interface ReportMsg {
  role: 'user' | 'assistant';
  content: string;
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** 轻量 markdown 转 HTML：**【小节】**→h3、**加粗**→strong，其余为段落 */
export function mdToHtml(text: string): string {
  if (!text) return '';
  const inline = (s: string) => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  const out: string[] = [];
  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim();
    if (!line) continue;
    const head = line.match(/^\*\*【(.+?)】\*\*$/);
    if (head) {
      out.push(`<h3 class="sec">【${esc(head[1])}】</h3>`);
      continue;
    }
    const bullet = line.match(/^[-•*]\s+(.*)$/);
    if (bullet) {
      out.push(`<p class="li">${inline(bullet[1])}</p>`);
      continue;
    }
    out.push(`<p>${inline(line)}</p>`);
  }
  return out.join('\n');
}

function starText(stars: unknown[] | undefined): string {
  const list = stars ?? [];
  const majors = list.filter((s: any) => s.type === 'major') as any[];
  const others = list.filter((s: any) => s.type !== 'major') as any[];
  const main = majors.length
    ? majors.map((s) => `${s.name}${s.siHua ? ` · 化${s.siHua}` : ''}`).join('　')
    : '（空宫）';
  const minor = others.length ? others.map((s: any) => s.name).join('、') : '';
  return main + (minor ? `<div class="minor">辅杂曜：${esc(minor)}</div>` : '');
}

/** 命盘区块 → 报告用 HTML */
export function chartSectionHtml(chart: any, label?: string): string {
  if (!chart) return '<p class="muted">暂无命盘数据</p>';
  const birth = chart.birthInfo;
  const p = chart.palaces ?? [];

  const meta: string[] = [];
  if (birth) {
    const who = `${birth.year}-${String(birth.month).padStart(2, '0')}-${String(birth.day).padStart(2, '0')}`;
    meta.push(`公历生日 ${who} · ${ZHI[birth.hour] ?? birth.hour}时 · ${birth.gender === 'female' ? '女' : '男'}`);
    if (birth.longitude) meta.push(`出生地经度 ${birth.longitude}°E`);
  }
  meta.push(`五行局 ${chart.wuxingJuName ?? chart.wuxingJu ?? ''}`);
  const ming = Number.isInteger(chart.mingGongBranch) ? ZHI[chart.mingGongBranch] : '';
  const shen = Number.isInteger(chart.shenGongBranch) ? ZHI[chart.shenGongBranch] : '';
  if (ming) meta.push(`命宫在${ming} · 身宫在${shen}`);
  const liunian = chart.daXians?.[chart.currentDaXianIndex];
  if (liunian) meta.push(`当前大限 ${liunian.startAge}–${liunian.endAge}岁 · ${liunian.palaceName ?? ''}`);

  const rows = (p as any[]).map((pal) => {
    const gz = `${GAN[pal.stem] ?? ''}${ZHI[pal.branch] ?? ''}`;
    const ages = Array.isArray(pal.daXianAge) ? (pal.daXianAge as [number, number]).join('–') : '';
    return `<tr>
      <td class="c">${esc(pal.name ?? '')}<span class="gz">${gz}</span></td>
      <td>${starText(pal.stars)}</td>
      <td class="c">${ages || '—'}</td>
    </tr>`;
  }).join('\n');

  const daxianRows = (chart.daXians ?? []).map((d: any) => {
    const sh = d.siHua
      ? ['lu', 'quan', 'ke', 'ji']
          .map(k => (d.siHua[k] ? `${k === 'lu' ? '禄' : k === 'quan' ? '权' : k === 'ke' ? '科' : '忌'}：${d.siHua[k]}` : ''))
          .filter(Boolean)
          .join('　')
      : '';
    return `<tr><td class="c">${d.startAge}–${d.endAge} 岁</td><td>${esc(d.palaceName ?? '')}${d.stemName ? `（${esc(d.stemName)}干）` : ''}</td><td>${esc(sh) || '—'}</td></tr>`;
  }).join('\n');

  const h = [`<div class="sec-box">`, `<h2>${label ? esc(label) : '排盘详情'}</h2>`,
    `<p class="meta">${meta.map(esc).join('　·　')}</p>`];
  if (rows) {
    h.push(`<table class="palace">
      <thead><tr><th style="width:16%">宫位</th><th>星曜（主星 · 化曜；辅杂曜）</th><th style="width:14%">大限年龄</th></tr></thead>
      <tbody>${rows}</tbody></table>`);
  }
  if (daxianRows) {
    h.push(`<h3 class="sec">大限走势</h3>`,
      `<table class="daxian"><thead><tr><th style="width:22%">年龄段</th><th style="width:30%">所行宫位</th><th>宫干四化</th></tr></thead><tbody>${daxianRows}</tbody></table>`);
  }
  h.push('</div>');
  return h.join('\n');
}

/** 对话/解读记录区块 → 报告用 HTML */
export function conversationSectionHtml(messages: ReportMsg[], label = 'AI 解读与对话记录'): string {
  if (!messages.length) return '<p class="muted">暂无解读对话记录</p>';
  const blocks = messages.map((m) => {
    if (m.role === 'user') {
      return `<div class="qa q"><div class="who">问</div><div class="body">${esc(m.content)}</div></div>`;
    }
    return `<div class="qa a"><div class="who">AI 解盘</div><div class="body">${mdToHtml(m.content)}</div></div>`;
  });
  return `<div class="sec-box"><h2>${esc(label)}</h2>${blocks.join('\n')}</div>`;
}

const REPORT_CSS = `
* { box-sizing: border-box; }
body {
  margin: 0; padding: 0; color: #222;
  background: #fff;
  /* 打印/阅读用中文宋体系，避免细体字 */
  font-family: 'Source Han Serif SC', 'Noto Serif CJK SC', 'Noto Serif SC', 'Songti SC', 'SimSun', '宋体', Georgia, serif;
  font-size: 15px; font-weight: 400; line-height: 1.95;
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
}
.report { max-width: 860px; margin: 0 auto; padding: 40px 44px 64px; }
.report h1 { font-size: 26px; font-weight: 700; letter-spacing: .08em; margin: 0 0 6px; text-align: center; }
.report .subtitle { text-align: center; color: #777; font-size: 13px; margin: 0 0 26px; }
h2 { font-size: 19px; font-weight: 600; color: #6b4a10; margin: 0 0 10px; }
h3.sec { font-size: 17px; font-weight: 600; color: #6b4a10; margin: 18px 0 8px; }
p { margin: 8px 0; }
p.meta { color: #444; }
p.li { margin: 4px 0 4px 18px; position: relative; }
p.li::before { content: '·'; position: absolute; left: -14px; }
strong { font-weight: 600; color: #111; }
table { width: 100%; border-collapse: collapse; margin: 10px 0 18px; font-size: 14px; line-height: 1.7; }
th, td { border: 1px solid #cfc4ac; padding: 7px 10px; vertical-align: top; text-align: left; }
th { background: #f4ecdc; font-weight: 600; }
td.c { text-align: center; }
td .gz { color: #8a6d3b; font-size: 12px; margin-left: 4px; white-space: nowrap; }
td .minor { color: #5a5a5a; font-size: 12px; margin-top: 2px; }
.sec-box { margin-bottom: 26px; }
.qa { display: flex; gap: 12px; margin: 14px 0; }
.qa .who { flex: 0 0 64px; text-align: center; font-size: 14px; font-weight: 600; padding-top: 10px; }
.qa.q .who { color: #9a6210; }
.qa.a .who { color: #6b4a10; }
.qa .body { flex: 1; min-width: 0; }
.qa.q .body { background: #faf3e3; border: 1px solid #e7d9bd; border-radius: 8px; padding: 10px 14px; }
.qa.a .body { border-left: 3px solid #b8922a; padding-left: 14px; }
.muted { color: #999; }
.footer { margin-top: 40px; padding-top: 14px; border-top: 1px solid #ddd; color: #888; font-size: 12px; text-align: center; }
@page { margin: 16mm 15mm; }
@media print { body { font-size: 15px; } .report { padding: 0; } }
`;

export interface ExportPdfOptions {
  reportTitle: string;
  subtitle?: string;
  sections: ReportSection[];
  footer?: string;
}

/** 渲染报告并触发浏览器打印（选"另存为 PDF"即导出文件） */
export function exportPdfReport(opts: ExportPdfOptions): void {
  const sectionsHtml = opts.sections
    .map(s => s.html)
    .join('\n');

  const html = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<title>${esc(opts.reportTitle)}</title>
<style>${REPORT_CSS}</style>
</head>
<body>
<div class="report">
  <h1>${esc(opts.reportTitle)}</h1>
  <p class="subtitle">${esc(opts.subtitle ?? `生成时间：${new Date().toLocaleString('zh-CN', { hour12: false })}`)}</p>
  ${sectionsHtml}
  <div class="footer">${esc(opts.footer ?? '本报告由紫微斗数开源排盘系统生成 · 仅供传统文化研究参考')}</div>
</div>
</body>
</html>`;

  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument;
  if (!doc) {
    iframe.remove();
    return;
  }
  doc.open();
  doc.write(html);
  doc.close();

  const win = iframe.contentWindow;
  const tryPrint = () => {
    try {
      win?.focus();
      win?.print();
    } catch {
      /* ignore */
    }
  };
  // 等排版稳定后再唤起打印；60s 后清理 iframe
  setTimeout(tryPrint, 350);
  setTimeout(() => iframe.remove(), 120000);
}

/** 便捷入口：命盘 + 对话记录 → 导出 PDF */
export function exportChartPdf(chart: ZiweiChart, messages: ReportMsg[], title = '紫微斗数 · AI 解盘报告'): void {
  const visible = messages.filter(m =>
    m.role === 'assistant' || (m.role === 'user' && (m as any).hidden !== true),
  );
  const sections: ReportSection[] = [{ heading: '排盘详情', html: chartSectionHtml(chart, '排盘详情') }];
  if (visible.length) sections.push({ html: conversationSectionHtml(visible) });
  exportPdfReport({
    reportTitle: title,
    sections,
    footer: '数据口径：倪海厦《天纪》体系 · 本报告由紫微斗数开源排盘系统生成，仅供传统文化研究参考',
  });
}
