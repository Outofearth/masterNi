# 紫微斗数 · 倪海厦体系排盘与学习平台

基于**倪海厦先生《天纪》**体系的紫微斗数排盘 + 学习平台。除排盘引擎外，还包含三纪（天纪 / 地纪 / 人纪）内容模块、古籍原文库、命盘知识图谱，以及一套可运行的测试与 CI。

- 上游仓库：<https://github.com/Renhuai123/ziwei-doushu>
- 本仓库（`origin`）：<https://github.com/Outofearth/masterNi>

---

## 快速开始

```bash
git clone https://github.com/Outofearth/masterNi.git
cd masterNi

npm install
npm run dev          # http://localhost:3000
```

常用脚本：

| 命令 | 作用 |
|---|---|
| `npm run dev` | 开发服务器 |
| `npm run build` | 生产构建 |
| `npm run typecheck` | TypeScript 类型检查（`tsc --noEmit`） |
| `npm test` | 单元测试（Vitest） |
| `npm run test:watch` | 单元测试 watch 模式 |

> AI 解读相关接口（`/api/interpret`、`/api/heming`、`/api/tianji-chat`）需要自备 LLM Key，见 `.env.example`。
> 未配置时排盘、古籍、知识库、三纪内容等**离线功能不受影响**。

---

## 功能地图

### 排盘工作台 `/chart`

| 能力 | 说明 |
|---|---|
| 排盘 | 输入出生年月日时（支持真太阳时校正、晚子时按次日排盘） |
| 视图切换 | 本命 / 大限 / 流年（`TimeNav`） |
| 宫位交互 | 点宫位看三方四正，点主星看**星曜静态速查**，点四化看飞化分析 |
| AI 解读 | 右侧对话区流式解读，附「延伸查阅」跨模块链接 |
| 命盘速览 | 命格总览 / 本命四化 / 格局识别 / **大限详解** / 相似名人比对 |
| 星曜速查 | `StarDetailPanel` 静态解读（不消耗提问次数），需要再一键交给 AI |
| 一键分享 | 生成链接，打开即自动回填表单 |
| 排盘历史 | 本地留存最近 10 条，按「年月日 + 性别 + 时辰」去重 |
| 导出 | PDF / PNG 报告 |

> 星曜速查的交互逻辑是**静态优先**：先给零消耗的星曜档案，用户觉得不够再点「让 AI 深度解读」。

### 三纪内容

| 模块 | 路由 | 内容 |
|---|---|---|
| **天纪** | `/tianji` | 紫微斗数、堪舆、卜卦、面相、测字；易经 64 卦浏览与起卦 |
| **地纪** | `/diji` | 廿四山向（24 山，含天元/地元/人元龙、纳音、阳宅阴宅）、地理五诀（龙穴砂水向） |
| **人纪** | `/renji` | 伤寒论 32 方（六经分组）、金匮要略 40 方（篇章分组） |

### 紫微图谱 `/knowledge`

14 主星 × 13 宫位 = **182 个落地页**。

内容采取**聚合渲染**：星曜档案、古籍原文、宫位论断、关联格局、倪师语录，全部取自项目内已有真实资料。**无资料的宫位会诚实标注，不做编造。**

### 古籍库 `/library`

| 古籍 | 段落数 |
|---|---|
| 紫微斗数全集 | 29 |
| 紫微斗数全书 | 17 |
| 骨髓赋 | 29 |

支持**关键词反查**（54 个关键词倒排索引）：从词云进入 → 列出全部出处段落 → 跳回原文锚点。正文中出现的 14 主星名会自动识别为可点链接。

### 合婚 `/heming`

双人出生信息 → 双方命盘 → AI 合盘分析；并在双方起盘后展示**关键宫位对比表**（命宫 / 夫妻宫 / 福德宫 / 财帛宫 / 官禄宫 的主星与四化并排对比，同星标注「共鸣」）。

> 对比表只呈现客观排盘结果，**不做吉凶评分**。评分所需的权重与阈值目前没有可依据的规则，已列入待办。

---

## 项目结构

```
app/                    28 个页面路由（App Router）
  chart/                排盘工作台
  heming/               合婚
  knowledge/            紫微图谱（[star]/[topic] 182 页 SSG）
  library/              古籍库 + 关键词反查
  tianji/ diji/ renji/  三纪内容
  api/                  AI 相关接口
components/             UI 组件
lib/
  ziwei/                排盘内核：算法 / 四化 / 格局 / 古籍索引 / 名人 / 历史
  classics/             古籍原文与关键词倒排索引
  nihai/                倪师语料与对话记忆
  renji/ diji/          人纪、地纪数据
  seo/                  SEO 落地页数据
docs/
  ni-tianji-zjds/       倪师天纪讲义（15 集，cleaned/ 为正式引用源）
  TODO.md               待办清单（不进 git）
tools/                  文档提取 / 切分脚本
tests/                  单元测试 + e2e
```

---

## 数据模块清单

| 模块 | 条目 | 位置 |
|---|---|---|
| 十四主星排盘 | 12 宫 × 14 主星 + 辅星煞星 | `lib/ziwei/algorithm.ts` |
| 四化系统 | 年干 / 宫干 / 大限 / 流年 / 流月 四化 | `lib/ziwei/sihua.ts` |
| 格局库 | 39 条 | `lib/ziwei/pattern-catalog.ts` |
| 名人命盘 | 11 位 | `lib/ziwei/famous.ts` |
| 合婚知识库 | 14 星 × 6 字段夫妻宫论断 | `lib/ziwei/heming-knowledge.ts` |
| 古籍原文 | 75 段（3 部） | `lib/classics/data/` |
| 关键词索引 | 54 个 | `lib/classics/keywords.ts` |
| 伤寒论方剂 | 32 首 | `lib/renji/shanghan.ts` |
| 金匮要略方剂 | 40 首 | `lib/renji/jingui.ts` |
| 廿四山向 | 24 山 | `lib/diji/mountains.ts` |
| 倪师天纪讲义 | 15 集 / 22,123 字 | `docs/ni-tianji-zjds/cleaned/` |

---

## 倪师天纪讲义

`docs/ni-tianji-zjds/` 收录了倪师《天纪》紫微斗数部分讲义（原 `.doc` 亦备份在 `source/`）：

```
README.md        来源说明
index.json       15 集元数据（标题 / 字数 / 含哪些主星）
raw/             最小清洗版（保留 PUA 字符，供对照）
cleaned/         正式引用源（PUA 字符 0）
source/          .doc 原始文件
```

配套工具（可复用于其他 `.doc` 讲义）：

```bash
python tools/extract_doc_text.py input.doc output.txt        # OLE2 → 纯文本
python tools/split_tianji_jiangyi.py output.txt docs/xxx     # 切集 + 清洗 + 索引
```

---

## 测试与 CI

| 层 | 内容 |
|---|---|
| 单元测试 | Vitest **47 例**：排盘算法 24 / 四化 6 / 起卦 7 / 古籍 10 |
| 类型检查 | `tsc --noEmit` |
| e2e | Playwright 冒烟（13 条路由 + 起盘 / 起卦 / 全站搜索），在 CI 内执行 |
| CI | GitHub Actions：`check`（typecheck + vitest）→ `build` → `e2e` |

```bash
npm run typecheck && npm test
```

---

## 未包含的部分

以下属于平台运营层，不在本仓库范围内：

- AI 解读的 prompt 调教细节与后端业务逻辑
- 用户系统（登录 / 会员 / 支付）
- 部署配置（Vercel / Nginx / Docker / 数据库）

已知待办见 `docs/TODO.md`（本地文件，不进 git），主要包括：

1. **知识库精细化论断** —— 现为聚合渲染，逐格精细化论断需补充资料后启动
2. **流年逐段详解** —— 大限详解已上线；流年缺 `LiuNian` 数据结构与落宫计算
3. **合婚评分算法** —— 现有 `HEMING_SCORE_CRITERIA` 是定性描述，无可直接套用的计算规则

---

## 协议与授权

本仓库分三部分授权，**商用均无障碍**：

| 内容 | 协议 | 说明 |
|---|---|---|
| **代码**（`app/`、`components/`、`lib/` 等） | [MIT License](./LICENSE) | 自由使用，保留 LICENSE 文件即可 |
| **样本数据集**（上游 Releases 中的 51.8 万条 v3.0） | 自由使用 · 要求 attribution | 商用亦可，**须保留数据来源标注**，见下 |
| **古籍原文**（紫微斗数全集 / 全书、骨髓赋等） | Public Domain | 古籍属公有领域，不存在版权 |

### 样本数据集 attribution（如使用上游数据集，必须保留）

> 本项目使用了 **紫微斗数开源样本数据集 v3.0**（518,400 条）
> 来源：https://github.com/Renhuai123/ziwei-doushu
> 作者：王多鱼AI

标注位置任选其一即可：

- **网页 / 产品**：About 页、关于我们、数据来源或页脚，写一行链接
- **AI 模型**：模型卡（Model Card）或数据集卡（Dataset Card）的 `Training Data` 字段
- **学术论文**：参考文献或致谢章节
- **二次发布的数据集**：README 或 metadata 中注明上游来源

### 其他来源说明

- 命理体系与术语源自**倪海厦先生《天纪》**讲授内容
- `docs/ni-tianji-zjds/` 讲义为**个人学习用途**整理，非商业发行品；如涉及权利问题请联系删除
- 排盘实现参考 [iztro](https://github.com/SylarLong/iztro) 与 lunar-javascript

---

## 技术栈

- **框架**：Next.js 16（App Router）
- **语言**：TypeScript
- **UI**：React 19 + Tailwind CSS + CSS Variables 双主题 + Framer Motion
- **测试**：Vitest 5 + Playwright
- **排盘**：自研 `lib/ziwei/*`，参考 iztro / lunar-javascript

---

## 声明

本项目内容用于**传统文化研究与学习**。命理分析结果不构成对现实决策的建议，请理性看待。
