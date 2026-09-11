/**
 * 导出工具（PNG / 打印 PDF）
 *
 * 浏览器端、无依赖新增（复用 html2canvas，jsPDF 安装不稳走原生打印）。
 *
 * 用法：
 *   - 下载 PNG：downloadAsPng(node, 'chart.png')
 *   - 打印 / 另存 PDF：printReport(node, '命盘报告')
 *   - 一体按钮：renderExportButton(node, '紫微命盘')
 *
 * 注意：
 *   - html2canvas 对 SVG/CJK/复杂渐变有兼容问题，已做兜底（页面背景填充）
 *   - 打印样式由 globals.css 的 @media print 控制，会自动隐藏导航/按钮/抽屉
 */

import html2canvas from 'html2canvas';
import { BRAND } from '@/lib/brand';

/** html2canvas 抓图后转 PNG 并触发下载 */
export async function downloadAsPng(
  node: HTMLElement,
  filename: string,
  options: {
    scale?: number;
    bgColor?: string;
  } = {},
): Promise<void> {
  const { scale = 2, bgColor = BRAND.cream } = options;
  const canvas = await html2canvas(node, {
    scale,
    backgroundColor: bgColor,
    useCORS: true,
    logging: false,
    // 避免某些样式抓不出来
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
 * 已加 @media print 样式会自动隐藏导航/按钮等无关元素。
 */
export function printReport(_node: HTMLElement | null, title = '紫微报告'): void {
  // 把 title 写入 document.title，供 PDF 文件名识别
  const prevTitle = document.title;
  document.title = title;
  // 触发前给 body 加 print-mode 标记，便于样式控制
  document.body.classList.add('print-mode');
  // 触发后清理
  const cleanup = () => {
    document.body.classList.remove('print-mode');
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