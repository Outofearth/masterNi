/**
 * 高亮工具：把字符串中所有出现的 keyword 用 <mark class="keyword-mark"> 包裹
 *
 * 服务端渲染安全：先 HTML 转义，再用全词匹配替换
 * 放在 lib 而非 app/[route]/[param]/_xxx 是为了避开 App Router 对下划线前缀文件的特殊处理
 */

export function highlightKeyword(text: string, keyword: string): string {
  const escaped = escapeHtml(text);
  const kw = escapeHtml(keyword);
  // 转义 keyword 中的正则元字符
  const safeKw = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return escaped.replace(new RegExp(safeKw, 'g'), `<mark class="keyword-mark">${kw}</mark>`);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}