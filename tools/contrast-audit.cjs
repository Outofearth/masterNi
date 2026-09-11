#!/usr/bin/env node
/**
 * contrast-audit.cjs —— 硬编色对比度审计（WCAG 2.1 / AA 4.5:1）
 *
 * 背景：globals.css 的 token 走的是「改 token 就全站生效」，但页面里**直接写死的
 * 颜色**（如 `color: '#888'`）不经过 token，token 审计脚本扫不到 → 盲区。
 * 本脚本专补这块：抓出所有内联硬编色，对双主题底色复算对比度。
 *
 * 用法：
 *   node tools/contrast-audit.cjs            # 只列未达 AA 的
 *   node tools/contrast-audit.cjs --all      # 全量列出（含合格）
 *   node tools/contrast-audit.cjs --root src # 指定扫描根（默认 app + components）
 *
 * ⚠️ 局限（重要）：脚本**不知道元素的真实背景**。以下场景会**误报**，必须人工分类：
 *   · `#fff` 压在实心金底/绿底上（按钮、徽章）        → 实际合格
 *   · 自绘暗底的页面/组件（preview、ScrollIntro）      → 只该用暗底算
 *   · 固定米色的品牌资产（AnnouncementModal、分享卡）  → 不随主题变
 *   切勿按脚本输出直接批量改，会改坏设计。
 */

const fs = require('fs');
const path = require('path');

const LIGHT = '#fbf6e8'; // = globals.css --bg-0（浅）
const DARK = '#020810';  // = globals.css --bg-0（暗）
const THRESHOLD = 4.5;

const lin = c => {
  c /= 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
};

const luminance = hex => {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map(x => x + x).join('');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};

const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (hi + 0.05) / (lo + 0.05);
};

const args = process.argv.slice(2);
const showAll = args.includes('--all');
const rootIdx = args.indexOf('--root');
const roots = rootIdx >= 0 ? [args[rootIdx + 1]] : ['app', 'components'];
const SKIP = ['node_modules', '.next', '.git', '.workbuddy', 'out', 'dist'];

const collect = (dir, acc) => {
  if (!fs.existsSync(dir)) return acc;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (!SKIP.includes(e.name)) collect(p, acc); }
    else if (/\.(tsx|ts|jsx|js|css)$/.test(e.name)) acc.push(p);
  }
  return acc;
};

const files = roots.reduce((acc, r) => collect(r, acc), []);
const rows = [];
let scanned = 0;

for (const f of files) {
  fs.readFileSync(f, 'utf8').split(/\r?\n/).forEach((line, i) => {
    // 只看文字的 color:，不看 background:（底色本就该接近页面底色，比了全是噪音）
    const hits = line.match(/color\s*:\s*['"](#[0-9a-fA-F]{3,6})['"]/g);
    if (!hits) return;
    for (const hit of hits) {
      scanned++;
      const value = hit.match(/#[0-9a-fA-F]{3,6}/)[0];
      const cl = contrast(value, LIGHT);
      const cd = contrast(value, DARK);
      const bad = [];
      if (cl < THRESHOLD) bad.push('light ' + cl.toFixed(2));
      if (cd < THRESHOLD) bad.push('dark ' + cd.toFixed(2));
      if (bad.length || showAll) {
        rows.push({ at: `${f}:${i + 1}`, value, bad: bad.join(' / ') || 'ok' });
      }
    }
  });
}

rows.sort((a, b) => a.at.localeCompare(b.at));
const fails = rows.filter(r => r.bad !== 'ok');

console.log(`scanned ${scanned} inline color values in ${files.length} files`);
console.log(`below AA ${THRESHOLD}:1 -> ${fails.length}\n`);
for (const r of (showAll ? rows : fails)) {
  console.log(`  ${r.value.padEnd(9)} ${r.bad.padEnd(20)} ${r.at}`);
}
console.log('\nNOTE: results are computed against the page background only.');
console.log('Values on solid/own backgrounds (white on gold buttons, dark showcase');
console.log('pages, fixed-cream brand modals) are FALSE POSITIVES - classify by hand.');
