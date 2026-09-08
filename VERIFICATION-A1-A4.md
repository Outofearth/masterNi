# A1 → A2 → A4 → A3 四期验证报告

生成时间：2026-09-07
状态：**本地验证全绿，尚未 commit / push**（等你目检确认）

---

## 一、本地验证结果

| 检查项 | 命令 | 结果 |
| --- | --- | --- |
| TypeScript 类型检查 | `tsc --noEmit` | ✅ exit 0（0 错误） |
| 单元测试 | `vitest run` | ✅ **47 / 47 通过** |
| 生产构建 | `next build` | ✅ exit 0 |
| 路由可达性 | curl 13 条核心路由 | ✅ 全部 200 |
| 死链扫描 | 源码 grep `/knowledge/` | ✅ 无残留 |

---

## 二、A1 内容补强（古籍 / 地纪 / 人纪）

| 新增 | 内容 |
| --- | --- |
| `lib/classics/keywords.ts` | 关键词倒排索引：14 主星 + 12 宫位 + 四化 + 13 格局 + 10 术语 |
| `app/library/keyword/[word]` | 关键词反查页：列出该词在全部古籍中的出处段落（高亮定位） |
| `app/library/page.tsx` | 顶部新增「关键词热度」词云，按主星/宫位/四化/格局/术语分桶 |
| `lib/diji/mountains.ts` + `app/diji/mountains` | 廿四山向：24 山 × 天元地元人元龙 + 八宫分组 + 概念词表 |
| `app/diji/wujue` | 地理五诀：龙穴砂水向 5 要素（要诀 / 吉象 / 凶象 / 倪师要点） |
| `lib/renji/shanghan.ts` + `app/renji/shanghan` | 伤寒论 32 方，按六经分组 + 核心药材 Top12 |
| `lib/renji/jingui.ts` + `app/renji/jingui` | 金匮要略 40 方，按篇章分组 |

## 三、A2 AI 升级

| 新增 / 改动 | 内容 |
| --- | --- |
| `lib/nihai/prompt-templates.ts` | 系统化 Prompt 六段结构：ROLE / PRINCIPLES / STYLE / BOUNDARY / PROCESS / FORMAT |
| `lib/nihai/chat-memory.ts` | localStorage 对话记忆 + 用户偏好（风格 / 多视角 / 关注领域） |
| `lib/nihai/chat.ts` | 新增 `buildTianjiSystemPromptV2()`，支持风格、多视角、历史摘要 |
| `app/api/tianji-chat/route.ts` | 接收 `style` / `multiPerspective`，注入历史摘要 |
| `components/TianjiChatPanel.tsx` | 重写为 v2：设置面板、风格切换、多视角开关、清空 / 复制 |

## 四、A4 跨模块链接打通

**A4-1（关键修复）** — `app/chart/page.tsx` 此前**没有传** `onStarSelect` 和 `onSiHuaClick`，
导致命盘上点主星、点四化徽章**完全没反应**；`InsightPanel` 里早已写好的四化飞化分析逻辑从未被调用。现已全部接线。

**A4-2** — `PalaceCell` 主星名旁加 `↗` 角标（hover 显形），新窗口直达该星的古籍出处。

**A4-3** — 新建 `components/StarText.tsx`：古籍段落正文 / 白话 / 倪师注中的 14 主星名自动变可点链接。

**A4-4** — 新建 `components/CrossLinks.tsx` 统一「延伸阅读」卡，已接入 6 个页面。

## 五、A3 测试加固

| 新增 | 内容 |
| --- | --- |
| `vitest.config.mts` | 测试配置（**必须用 .mts**，.ts 会被 Vite 当 CJS 报 warning） |
| `tests/unit/ziwei-algorithm.test.ts` | 24 例：12 宫 / 地支全覆盖 / 主星恰好 14 颗 / 命宫身宫合法 / 大限 12 段 / 空宫自洽 / 纯函数性 |
| `tests/unit/ziwei-sihua.test.ts` | 6 例：十天干四化表 / 反向映射 / 干支循环 |
| `tests/unit/qigua.test.ts` | 7 例：数字起卦 / 时间起卦 / 六爻结构 / 动爻范围 |
| `tests/unit/classics.test.ts` | 10 例：古籍数据 / 全文检索 / 关键词云 / 主星反查 / slug 完整性 |
| `.github/workflows/ci.yml` | check(typecheck+vitest) → build(next build) + e2e(Playwright) |
| `playwright.config.ts` + `tests/e2e/smoke.spec.ts` | 13 条路由冒烟 + 古籍检索链路 + A4 跨模块导航 |

e2e **设计为在 CI 中运行**（本沙箱 Chromium 已知会 hang，本地不装浏览器）。

---

## 六、⚠️ 已知问题：知识库是空壳（上游有意置空）

`lib/ziwei/db-analysis.ts`：

```ts
export const STAR_DB: Record<string, unknown> = {};
```

文件头注释写明「论断内容库 STAR_DB 置空 —— 因此知识库详情页会生成 0 条静态路由」。

**影响**：
- `/knowledge/[star]/[topic]` 共 182 个 SEO 落地页**全部 404**
- `/sitemap.xml` 中 knowledge 路由数 = **0**
- `/knowledge` 列表页 topic chips 全空

**已按你选的 C 方案处理**：A4 所有知识库链接改指 `/library/keyword/{星名}`（关键词反查页）
与 `/library/search?q={星名}`（全文检索），二者均已验证 200 且有真实内容。

`/knowledge/[star]/[topic]/page.tsx` 中保留的 CrossLinks 代码待 STAR_DB 补齐后自动生效。

**后续可选**：A 方案（撰写 182 段论断填充 STAR_DB）或 B 方案（改造为聚合页）。

---

## 七、待目检 URL（dev server：http://127.0.0.1:3300）

| 页面 | URL | 看什么 |
| --- | --- | --- |
| 命盘 | `/chart` | 起盘后**点主星**、**点四化徽章**，右侧应出现解读 + 「延伸查阅」链接卡 |
| 古籍章节 | `/library/quanji/0` | 正文中带虚线下划线的星名可点 |
| 关键词反查 | `/library/keyword/紫微` | 该星在古籍中的全部出处 |
| 廿四山向 | `/diji/mountains` | 底部「延伸阅读」卡 |
| 地理五诀 | `/diji/wujue` | 底部「延伸阅读」卡 |
| 伤寒论方剂 | `/renji/shanghan` | 底部「延伸阅读」卡 |
| 金匮要略方剂 | `/renji/jingui` | 底部「延伸阅读」卡 |
| 卦象详情 | `/tianji/yijing/1` | 底部「延伸阅读」+ 起卦实测入口 |
| 知识库 | `/knowledge` | 14 主星卡片 → 古籍出处（C 方案后的新链接） |
