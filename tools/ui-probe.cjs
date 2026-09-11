#!/usr/bin/env node
/**
 * UI 取证探针：抓页面 h1 的计算样式 + 截图，用于「标题不可见 / 未居中 / 渐变失效」类问题的
 * 客观验证（肉眼截图会被选中态、主题态干扰，计算样式不会）。
 *
 * 用法（在项目根目录执行）：
 *   node tools/ui-probe.cjs dark /tianji /diji /renji
 *   node tools/ui-probe.cjs light /chart
 *
 * 输出：
 *   · stdout 打印每个路由 h1 的 display / textAlign / backgroundImage / bgClip / 左右边界
 *     —— 判定要点：display:inline-block 时左右边界的中点是否等于父容器中点（否则就是贴左）；
 *        backgroundImage 为 none 且 color 为 rgba(0,0,0,0) 即「标题全透明不可见」。
 *   · PNG 落到 %TEMP%/shots-<theme>/<theme>_<route>.png（可用 OUT_DIR 覆盖）
 *
 * 为什么不用 agent-browser：本机 agent-browser 起 Chromium 会静默 hang。
 * 直接用 playwright + 显式 executablePath 可稳定工作（见下 resolveChromium）——
 * 注意项目里 playwright 的版本与 %LOCALAPPDATA%/ms-playwright 里的浏览器版本常不一致，
 * 不传 executablePath 会报 "Executable doesn't exist"，所以这里自动扫描可用的 chrome.exe。
 */
const fs = require('fs');
const path = require('path');
const os = require('os');

const theme = process.argv[2] || 'dark';
const routes = process.argv.slice(3);
if (routes.length === 0) {
  console.error('用法: node tools/ui-probe.cjs <dark|light> <route...>');
  process.exit(1);
}

const BASE = process.env.BASE_URL || 'http://127.0.0.1:3300';
const OUT = process.env.OUT_DIR || path.join(os.tmpdir(), `shots-${theme}`);
const ANNOUNCEMENT_KEY = 'announcement_seen_2026-09-09'; // 首访弹窗会挡住首屏，需跳过

/** 在 ms-playwright 缓存里找一个可用的 chrome.exe（取版本号最大的一个） */
function resolveChromium() {
  const root = path.join(os.homedir(), 'AppData', 'Local', 'ms-playwright');
  let best = null;
  for (const entry of fs.readdirSync(root)) {
    if (!/^chromium-\d+$/.test(entry)) continue;
    const exe = path.join(root, entry, 'chrome-win64', 'chrome.exe');
    const legacy = path.join(root, entry, 'chrome-win', 'chrome.exe');
    const found = fs.existsSync(exe) ? exe : fs.existsSync(legacy) ? legacy : null;
    if (found && (!best || entry > best.entry)) best = { entry, exe: found };
  }
  return best ? best.exe : undefined; // undefined -> 交给 playwright 默认解析
}

async function main() {
  const { chromium } = require('playwright');
  fs.mkdirSync(OUT, { recursive: true });

  const browser = await chromium.launch({ executablePath: resolveChromium() });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  // 首屏前注入：跳过公告弹窗 + 固定主题（避免 React 首次渲染与随后 setAttribute 打架）
  await ctx.addInitScript((t) => {
    try {
      localStorage.setItem('announcement_seen_2026-09-09', '1');
      localStorage.setItem('theme', t);
    } catch { /* localStorage 可能被禁，忽略 */ }
  }, theme);

  const page = await ctx.newPage();
  for (const route of routes) {
    await page.goto(BASE + route, { waitUntil: 'networkidle' });
    await page.waitForTimeout(900);
    await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);

    const info = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      if (!h1) return null;
      const cs = getComputedStyle(h1);
      const r = h1.getBoundingClientRect();
      const p = h1.parentElement.getBoundingClientRect();
      return {
        text: (h1.textContent || '').trim().slice(0, 16),
        cls: h1.className,
        display: cs.display,
        textAlign: cs.textAlign,
        color: cs.color,
        fill: cs.webkitTextFillColor,
        bgImage: cs.backgroundImage.slice(0, 70),
        bgClip: cs.webkitBackgroundClip || cs.backgroundClip,
        h1: [Math.round(r.left), Math.round(r.right)],
        parent: [Math.round(p.left), Math.round(p.right)],
        parentAlign: getComputedStyle(h1.parentElement).textAlign,
        fontSize: cs.fontSize,
      };
    });

    const flag = !info ? ' (无 h1)'
      : info.bgClip === 'text' && info.bgImage === 'none' ? ' ⚠ 渐变缺失→可能全透明'
      : info.display === 'inline-block' && info.parentAlign !== 'center' && info.textAlign !== 'center' ? ' ⚠ 贴左未居中'
      : '';
    console.log(`\n[${theme}] ${route}${flag}`);
    console.log(JSON.stringify(info));

    const name = `${theme}${route.replace(/\//g, '_') || '_root'}`;
    await page.screenshot({ path: path.join(OUT, `${name}.png`), clip: { x: 0, y: 0, width: 1440, height: 560 } });
  }

  await browser.close();
  console.log('\nshots -> ' + OUT);
}

main().catch((e) => { console.error(e); process.exit(1); });
