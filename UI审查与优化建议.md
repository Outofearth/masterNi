# 紫微命盘 Web · UI 审查与优化建议

> 审查对象：`T:\紫薇语料\ziwei-doushu`（Next.js 16 App Router + React 19 + Tailwind 3 + framer-motion）
> 审查方式：源码审查（设计 token、组件、主题系统、可访问性、响应式）
> 审查日期：2026-09-04
> 结论先行：**骨架优秀（已有双主题 token + 统一工具类 + 响应式工作台），但命盘核心工作台存在 1 个 P0 功能性缺陷 + 若干一致性/可访问性问题。**

---

## 一、总体结论与优先级

| 优先级 | 问题 | 影响 | 修复工作量 |
|---|---|---|---|
| 🔴 P0 | 命盘工作台引用**从未定义的 `--t-*` CSS 变量**，未接入双主题系统 | 主题切换（暗/亮）对命盘核心区失效，配色靠继承"侥幸显示" | 小（补别名） |
| 🟠 P1 | 四化语义色 **3 套并存**（token 深版 / ChartSummary·TimeNav 亮版 / PalaceCell·ChartBoard Tailwind 版） | 同一"化禄/权/科/忌"在命盘、图例、导航、摘要里颜色互不一致 | 中 |
| 🟠 P1 | 命盘宫格/星名为 `<div onClick>` **伪按钮**，无 `role`/`tabindex`/`aria-label`/键盘事件 | 键盘不可达、屏幕阅读器无语义 | 中 |
| 🟡 P2 | 对比度不足：`--ac` 金 `#B8922A`、紫色大限 `purple-500` 在浅底；`--tx-3` 灰用于 ≤10px 小字 | 低于 WCAG AA 4.5:1（正文） | 小 |
| 🟡 P2 | 响应式断点不统一（`chart-workspace` 768 / `ziwei-workspace` 1099），命盘移动端信息密度过高 | 布局割裂、窄屏可读性差 | 小 |
| 🟡 P2 | canvas/分享卡/公告/开场大量内联十六进制调色板（古风金棕）与 token 重复但未引用 | 维护成本、改主题需多处同步 | 小 |

---

## 二、🔴 P0：命盘配色链路断在"未定义变量"上

### 证据

`globals.css` 实际定义的变量（节选）：
```css
:root{
  --bg-0:#FAFAF9; --bg-1:#F4F3EF; --bg-2:#ECEAE4;
  --tx-0:#0D0D0B; --tx-1:#1A1A18; --tx-2:#4A4A45; --tx-3:#8A8A82;
  --ac:#B8922A; --ac-dim:#7A5F1A;
  --bdr:rgba(0,0,0,.07); --bdr-med:rgba(0,0,0,.11);
  --lu:#2D7A4A; --quan:#1A56A8; --ke:#8A7018; --ji:#A83228;
}
[data-theme="dark"]{ /* 以上均有暗色覆盖值，但同样没有 --t-* */ }
```
**全文件没有任何 `--t-*` 定义。** 但命盘代码大量引用：

- `components/ChartBoard.tsx:107,110,122,123,132,156,161,162,165` → `var(--t-bg)` / `var(--t-border)` / `var(--t-faint)` / `var(--t-gold)`
- `components/PalaceCell.tsx:76-84,100,111,124,129` → `var(--t-bg)` / `var(--t-faint)`
- `app/chart/page.tsx:50-56` → `var(--t-border)` / `var(--t-text)` / `var(--t-faint)`

### 根因
作者脑中命名 `--t-bg/--t-border/--t-faint/--t-gold/--t-text/--t-text2`，但 `globals.css` 落地时命名为 `--bg-*`/`--bdr`/`--tx-3`/`--ac`/`--tx-*`，**两边未对齐，且漏了一组 `--t-*` 别名**。命盘区的金色装饰、弱化文字、格子背景实际全部无效，依赖 `inherit` 侥幸可见——一旦切到 light 主题，命盘既不跟随 token 也不跟随主题。

### 修复（推荐方案 A：最小改动、集中管理）
在 `globals.css` 的 `:root` 与 `[data-theme="dark"]` 各补一组别名，让命盘代码无需改动即接入现有 token：

```css
/* = 在 :root 末尾追加 = */
--t-bg:      var(--bg-0);
--t-border:  var(--bdr);
--t-faint:   var(--tx-3);
--t-text:    var(--tx-1);
--t-text2:   var(--tx-2);
--t-gold:    var(--ac);

/* = 在 [data-theme="dark"] 末尾追加（暗色对应值） = */
--t-bg:      #020810;
--t-border:  rgba(255,255,255,0.07);
--t-faint:   #6a7a96;
--t-text:    #dce4f0;
--t-text2:   #9db0d0;
--t-gold:    #d4a843;
```

> 方案 B（不推荐）：把代码里所有 `var(--t-*)` 逐一替换为 `var(--bg-*)`/`var(--bdr)`/`var(--tx-*)`/`var(--ac)`。改动散、易漏。

**影响**：修复后命盘立即随主题切换，配色正式接入设计系统。

---

## 三、🟠 P1：四化语义色应当只有"一套"

同一个"化禄/化权/化科/化忌"目前在 4 个地方用了 3 种实现：

| 位置 | 禄 | 权 | 科 | 忌 |
|---|---|---|---|---|
| `tailwind.config.ts` / `globals.css`（token） | `--lu #2D7A4A` | `--quan #1A56A8` | `--ke #8A7018` | `--ji #A83228` |
| `ChartSummary.tsx:127-130` / `TimeNav.tsx:34-37` | `#4ade80` | `#60a5fa` | `#facc15` | `#f87171` |
| `PalaceCell.tsx:22-27` / `ChartBoard.tsx:271-278` | `emerald-400/500` | `blue-400/500` | `yellow-400/500` | `red-400/500` |

而 `globals.css` 里设计的 `--lu/--quan/--ke/--ji` 与配套的 `.badge-lu/quan/ke/ji` **几乎没被命盘使用**。

### 建议
1. 保留 `--lu/--quan/--ke/--ji` 作为唯一事实来源，并**按背景明暗派生亮版**，利用双主题切换：
   ```css
   :root{ --lu:#1f6b3e; --lu-strong:#2D7A4A; --lu-on-dark:#4ade80; /* 同理 quan/ke/ji */ }
   [data-theme="dark"]{ --lu:#4ade80; --lu-strong:#6ee7a0; --lu-on-dark:#4ade80; }
   ```
2. `PalaceCell` / `ChartBoard` 图例 / `TimeNav` / `ChartSummary` 全部改为引用 token（命盘格子在暗底用 `-on-dark` 亮版，浅色摘要卡用标准版），删除散落的 Tailwind 色与硬编码。

### 附带：两个"无 token 的语义色"也应收编
- 当前大限：`purple-500` `#a855f7`（`PalaceCell` / `ChartBoard` 中心区）——设计系统无紫色，建议新增 `--da-xian`（紫金调）或改用金/青区分。
- 三方四正连线 + 选中高亮：`rgba(37,99,235,…)`（blue-600，`PalaceCell` / `ChartBoard`）——建议新增 `--sel`（选中）token，与四化蓝区分。

---

## 四、🟠 P1：命盘可访问性（键盘 + 读屏）

命盘是核心交互，但：

- `PalaceCell.tsx:68` `<motion.div onClick={onClick}>` —— 无 `role="button"`、`tabIndex={0}`、`onKeyDown`（Enter/Space）、`aria-label`（应朗读"命宫·紫微·天相"）。
- 星名点击 `PalaceCell.tsx:134`、四化徽章点击同理。
- 三方四正 SVG 连线（`ChartBoard.tsx:203`）是纯装饰，应加 `aria-hidden="true"`。

### 修复片段（宫格）
```tsx
<motion.div
  role="button" tabIndex={0}
  aria-label={`${name}宫${stars.map(s=>s.name).join('、')}`}
  onClick={onClick}
  onKeyDown={(e)=>{ if(e.key==='Enter'||e.key===' '){e.preventDefault();onClick?.();} }}
  className="..."
>
```

---

## 五、🟡 P2：对比度（WCAG AA）

- `--ac` 金 `#B8922A` 在 `--bg-0` `#FAFAF9` 上 ≈ **2.9:1**（<4.5）→ 金色**仅可用于大字/装饰/描边**，正文金字不合格（`.grad-text-light` 用于标题尚可，但 `var(--t-gold)` 若落到小字需警惕）。
- `--tx-3` `#8A8A82` 在浅底 ≈ **3.5:1** → 仅达"大字号(≥18px 或 14px 粗)"阈值；现用于 9–10px 宫名/干支/图例（如 `PalaceCell.tsx:111,124`），**小字不合格**。建议弱化文字降到 `#6b6b63` 左右，或仅用于 ≥14px。
- 暗色下 `--tx-3` `#6a7a96` 在 `#020810` 上对比度充足，无需改。

---

## 六、🟡 P2：响应式断点 & 信息密度

| 布局类 | 切单列断点 |
|---|---|
| `.chart-workspace`（globals.css:331） | `767px` |
| `.ziwei-workspace-grid`（globals.css:499） | `1099px` |

断点不统一，维护易错。**建议统一为单一断点（如 `1024px`）** 管理双栏↔单栏。

命盘格子 `min-height` 90px（桌面）→ 74px（<768）→ 68px（<360），格子内字号 8–13px，**移动端信息极密、易误触**。建议：
- 窄屏主星字号下限 ≥11px，宫名 ≥10px；
- 或命盘在窄屏改为"横向滚动/可缩放"而非无限压缩字号；
- 触摸目标：星名/宫格点击区 ≥44px 高（当前 68–74px 勉强，但内部小星名点击区太小）。

---

## 七、🟡 P2：canvas / 分享卡 / 公告 / 开场 的硬编码调色板

`ShareCardCanvas.tsx`、`ShareModal.tsx`、`AnnouncementModal.tsx`、`ScrollIntro.tsx` 充斥内联十六进制（古风金棕 `#b8922a/#3d2f10/#a89b7c/#8b6a14/#c45a2d`）。其中 `#b8922a` 正是 `--ac`，但写死未引用。

- 截图类（html2canvas）确实需要具体色，建议在 `lib/` 抽出**单一调色板常量**（`BRAND.GOLD='#b8922a'` 等），全项目引用，避免与 token 漂移。
- 非截图类（AnnouncementModal/ScrollIntro）尽量改用 CSS 变量/工具类。

---

## 八、落地清单与修复状态（2026-09-04 已全部应用）

| # | 项 | 状态 | 改动文件 |
|---|---|---|---|
| 1 | **[P0] 补 `--t-*` 别名接入双主题** | ✅ 已修复 | `app/globals.css` |
| 2 | **[P1] 统一四化色为一套主题感知 token**（+ 大限紫 `--da-xian` / 选中蓝 `--sel` / 吉凶 `--state-good`·`--state-bad`） | ✅ 已修复 | `globals.css` + `ChartBoard`/`PalaceCell`/`ChartSummary`/`TimeNav`/`StarDetailPanel` |
| 3 | **[P1] 命盘可访问性**（宫格/星名/四化徽章 `role/tabIndex/aria-label/键盘`；三方四正 SVG `aria-hidden`） | ✅ 已修复 | `PalaceCell.tsx` + `ChartBoard.tsx` |
| 4 | **[P2] 对比度**（浅色 `--t-faint` 由 `#8A8A82`→`#6b6b63`；浅色 `--t-gold` 用更深 `--ac-dim`） | ✅ 已修复 | `globals.css` |
| 5 | **[P2] 响应式断点** | ⚠️ 有意保留 | 见下方说明 |
| 6 | **[P2] 抽出分享卡/公告调色板常量** | ✅ 已修复 | 新增 `lib/brand.ts` + `ShareCardCanvas.tsx` + `ShareModal.tsx` |

### 关键修复说明

**P0 范围比初判更大**：首轮 grep 只命中 `--t-bg/border/faint/gold/text/text2` 共 6 个；全面 grep 后发现命盘工作台实际引用 **10 个未定义 `--t-*` 变量**（`--t-bg/--t-surface/--t-card/--t-border/--t-border-acc/--t-faint/--t-text/--t-text1/--t-text2/--t-gold`），贯穿 `ChartBoard`/`PalaceCell`/`ChartSummary`/`TimeNav`/`InsightPanel`/`ChatPanel`/`StarDetailPanel`/`FamousPersonCard`/`PatternsCard` 与 `app/chart/page.tsx`。原代码因 `inherit` 侥幸显示、切到亮色主题即崩。已在 `:root` 与 `[data-theme="dark"]` 各补完整别名，整条工作台主题正式生效。

**四化/强调色做成主题感知**：命盘默认暗色，原 `emerald-400/blue-400/#4ade80/purple-400` 等亮色是为暗底调的；一旦随主题切到浅底会对比度崩坏。故四化（禄权科忌）、大限（紫）、选中/三方四正（蓝）、吉凶状态全部改为 token——暗色用亮版（保持既有观感），浅色用深版（修复对比度）。另补 `.sihua-lu/quan/ke/ji` 工具类与 `.card-glass`/`.card-inner`（此前从未定义，导致摘要面板无表面样式）。

**P2 #5 断点保留决策**：`.chart-workspace`(767px) 与 `.ziwei-workspace-grid`(1099px) 服务不同布局（命盘折叠 / AI 双栏折叠）。强行统一到 1024 会让命盘过早折成单列且压缩宫格信息密度（回归风险），故保留原断点。命盘窄屏字号（主星 13px / 宫名 10px）已≥报告建议下限，未再下压。

**P2 #7 调色板**：分享卡/弹窗是刻意自包含的古风金棕品牌资产（不随 App 主题变化）。新增 `lib/brand.ts` 单一来源（`BRAND.GOLD` 等 + `goldTint(alpha)`），`ShareCardCanvas`/`ShareModal` 全部引用，避免与 `--ac` 漂移；公告/开场为一次性品牌弹窗，留作品牌资产不再强行并入 token。

### 验证
- `tsc --noEmit`：0 错误。
- `next build`：通过该次改动未引入编译/类型错误。
