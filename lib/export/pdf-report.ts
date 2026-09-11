/**
 * 导出工具（PNG / 打印 PDF）
 *
 * 浏览器端、无依赖新增（复用 html2canvas，jsPDF 安装不稳走原生打印）。
 *
 * 用法：
 *   - 下载 PNG：downloadAsPng(node, 'chart.png')
 *   - 打印 / 另存 PDF：printReport(node, '命盘报告')
 *   - 「报告纸张」单独打印：printSheet('紫微命盘报告')（body 加 .report-mode，
 *     全局 CSS 负责隐藏 app、只显示纸张；调用方无需传 node）
 *
 * 注意：
 *   - html2canvas 对 SVG/CJK/复杂渐变有兼容问题，已做兜底（页面背景填充 +
 *     显式 width/height/windowWidth/windowHeight，绕开外层 overflow:auto 把
 *     「下半部分裁掉」的经典坑）。
 *   - 打印样式由 globals.css 的 @media print 控制。
 */

import html2canvas from 'html2canvas';
import { BRAND } from '@/lib/brand';

/**
 * html2canvas 抓图后转 PNG 并触发下载。
 *
 * 关键选项说明：
 *   · width/height = 元素自身 scrollWidth/scrollHeight —— 强制按完整内容渲染，
 *     不被元素 clientWidth/Height（受祖先 overflow 影响）截断。
 *   · windowWidth/windowHeight = 同上 —— html2canvas 内部把克隆出来的元素放进
 *     一个 iframe 渲染，这决定 iframe 大小；如果小于元素本身，下半部分会被裁。
 *   · scrollX/scrollY = 0 —— 元素已用绝对定位 + 0 高宿主固定在文档原点。
 *   · ignoreElements + no-export class —— 跳过按钮、装饰横幅等。
 */
export async function downloadAsPng(
  node: HTMLElement,
  filename: string,
  options: {
    scale?: number;
    bgColor?: string;
  } = {},
): Promise<void> {
  const { scale = 2, bgColor = BRAND.cream } = options;

  // 等字体就绪，避免 CJK 首次抓图缺字回退到方块
  if (typeof document !== 'undefined') {
    try { await document.fonts.ready; } catch { /* ignore */ }
  }

  const w = node.scrollWidth;
  const h = node.scrollHeight;
  const canvas = await html2canvas(node, {
    scale,
    backgroundColor: bgColor,
    useCORS: true,
    logging: false,
    width: w,
    height: h,
    windowWidth: w,
    windowHeight: h,
    scrollX: 0,
    scrollY: 0,
    ignoreElements: (el) => el.classList?.contains('no-export') ?? false,
  });
  const dataUrl = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * 触发浏览器打印：用户在打印对话框里选「另存为 PDF」即可。
 * 旧路径：抓 app 内 DOM 一起打（globals.css 里的 body.print-mode 规则负责藏掉
 * 导航 / 按钮 / Tab，剩命盘 + 速览）。仍被 /tianji/qigua 等页面使用。
 */
export function printReport(_node: HTMLElement | null, title = '紫微报告'): void {
  const prevTitle = document.title;
  document.title = title;
  document.body.classList.add('print-mode');
  const cleanup = () => {
    document.body.classList.remove('print-mode');
    document.title = prevTitle;
    window.removeEventListener('afterprint', cleanup);
  };
  window.addEventListener('afterprint', cleanup);
  window.print();
}

/**
 * 报告纸张打印路径：body 加 .report-mode，globals.css 把整个 app 隐藏、只把
 * `.report-sheet-host`（由父级渲染）变量为静态流并显示纸张内容。
 *
 * 优势：
 *  · 纸张版式与 app 解耦 —— app 怎么改都不影响报告
 *  · @page 边距 + 纸张内 padding 共同保证留白可控
 *  · 可设 break-inside/break-before 让命盘与速览分页、卡片不跨页
 */
export function printSheet(title = '紫微报告'): void {
  const prevTitle = document.title;
  document.title = title;
  document.body.classList.add('print-mode', 'report-mode');
  const cleanup = () => {
    document.body.classList.remove('print-mode', 'report-mode');
    document.title = prevTitle;
    window.removeEventListener('afterprint', cleanup);
  };
  window.addEventListener('afterprint', cleanup);
  window.print();
}

/** 通用导出按钮（PNG + 打印） */
export function buildExportPayload(filename: string, title: string) {
  return { filename, title };
}