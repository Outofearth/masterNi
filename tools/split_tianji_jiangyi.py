"""split_tianji_jiangyi.py — 把连续讲义按 14 集切分，清洗废字符，输出结构化目录。

用法：python split_tianji_jiangyi.py <input.txt> <output_dir>

输出结构：
  <output_dir>/
    README.md                          来源说明
    index.json                         索引（含每集标题/字符/含主星）
    raw/                               原始讲义（无清洗副本）
      ep02-quanji-01-shier-gong.md
      ep03-quanji-02-xingchen.md
      ...
    cleaned/                           清洗后讲义
      ep02-...md
      ...
"""
import re
import json
import sys
from pathlib import Path


# 显式集标题模式：「天纪第N集------主题」
RE_TITLE = re.compile(r"^天纪第(\d+)集[-—]+(.+?)$")
# PUA 字符（U+E000-U+F8FF）
RE_PUA = re.compile(r"[\ue000-\uf8ff]")
# 多个连续空行
RE_BLANK_LINES = re.compile(r"\n{3,}")
# 制表符
RE_TAB = re.compile(r"\t+")
# 行尾空白
RE_TRAIL = re.compile(r"[ \t]+$", re.MULTILINE)
# 行首序号（如「1.」 「2.」 「3.」）
RE_NUM_PREFIX = re.compile(r"^(\d+)\. ")

# 14 主星
STARS = ["紫微", "天机", "太阳", "武曲", "天同", "廉贞", "天府", "太阴",
         "贪狼", "巨门", "天相", "天梁", "七杀", "破军"]


def clean_text_minimal(s: str) -> str:
    """最小清洗：仅合并多余空行 + 去 tab，保留 PUA 字符（用于 raw/ 对照）。"""
    s = RE_TAB.sub("", s)
    s = RE_BLANK_LINES.sub("\n\n", s)
    return s.strip() + "\n"


def clean_text(s: str) -> str:
    """完全清洗：去 PUA、tab、合并空行、去行尾空白（用于 cleaned/ 正式版）。"""
    s = RE_PUA.sub("", s)
    s = RE_TAB.sub("", s)
    s = RE_TRAIL.sub("", s)
    s = RE_BLANK_LINES.sub("\n\n", s)
    return s.strip() + "\n"


def split_by_titles(raw: str):
    """按显式「天纪第N集」标题切分，返回 [(episode, title, body), ...]"""
    lines = raw.split("\n")
    segments = []  # (start_idx, episode, title)
    for i, ln in enumerate(lines):
        m = RE_TITLE.match(ln.strip())
        if m:
            ep = int(m.group(1))
            title = m.group(2).strip()
            segments.append((i, ep, title))

    # 第 1 行（i=0）也是「天纪第2集」标题 → 第一个段起点是 0
    # 但我们 segments[0] 起点 = 标题所在行
    # 实际希望：body 从标题下一行开始
    out = []
    for idx, (start, ep, title) in enumerate(segments):
        end = segments[idx + 1][0] if idx + 1 < len(segments) else len(lines)
        body = "\n".join(lines[start:end])  # 包含标题
        out.append((ep, title, body))
    return out


def detect_part(title: str, ep: int, prev_title: str | None) -> str:
    """推断是上/下/单集（仅第 8 集拆上下）。"""
    if ep == 8:
        # 同集出现两次：第一个「上」、第二个「下」
        return "上"  # 由调用方根据顺序二次修正
    return ""


def detect_stars(text: str) -> list[str]:
    return [s for s in STARS if s in text]


def slugify_zh(title: str) -> str:
    """中文标题 → 文件名片段（保留中文，取前 12 字符 + 拼音？这里直接中文）。"""
    safe = re.sub(r"[^\w\u4e00-\u9fff]+", "-", title).strip("-")
    return safe[:30]


def build_filename(ep: int, pinyin_idx: str, title: str) -> str:
    """文件名：ep{02}-quanji-{NN}-{slug}.md"""
    return f"ep{ep:02d}-quanji-{pinyin_idx}-{slugify_zh(title)}.md"


# 紫微斗数 N → 拼音编号（讲义里就是「紫微斗数1」「紫微斗数2」...）
PINYIN_IDX = {
    2: "01", 3: "02", 4: "03", 5: "04", 6: "05", 7: "06", 8: "07",
    9: "08", 10: "09", 11: "10", 12: "11", 13: "12", 14: "13", 15: "14",
}


def main():
    if len(sys.argv) != 3:
        print("用法: python split_tianji_jiangyi.py <input.txt> <output_dir>")
        sys.exit(1)

    src = Path(sys.argv[1])
    out_dir = Path(sys.argv[2])
    raw_dir = out_dir / "raw"
    clean_dir = out_dir / "cleaned"
    raw_dir.mkdir(parents=True, exist_ok=True)
    clean_dir.mkdir(parents=True, exist_ok=True)

    raw_text = src.read_text(encoding="utf-8")
    segments = split_by_titles(raw_text)

    # 处理第 8 集（上/下）
    chapter_records = []
    ep8_count = 0
    for ep, title, body in segments:
        if ep == 8:
            ep8_count += 1
            part = "上" if ep8_count == 1 else "下"
            full_title = f"{title}（{part}）"
            fname = f"ep08-quanji-07-{part}-{slugify_zh(title)}.md"
        else:
            full_title = title
            fname = build_filename(ep, PINYIN_IDX[ep], title)

        # 写 raw（最小清洗，保留 PUA 作对照）
        (raw_dir / fname).write_text(clean_text_minimal(body), encoding="utf-8")
        # 写 cleaned（完全清洗，作为正式引用源）
        (clean_dir / fname).write_text(clean_text(body), encoding="utf-8")

        clean_body = clean_text(body)
        chapter_records.append({
            "episode": ep,
            "pinyin_index": PINYIN_IDX.get(ep, "?"),
            "title": full_title,
            "filename": fname,
            "char_count": len(clean_body),
            "line_count": clean_body.count("\n") + 1,
            "stars": detect_stars(clean_body),
        })

    # 索引
    index = {
        "source": {
            "title": "倪海厦先生·天纪·紫微斗数讲义",
            "original_file": "【文字记录PDF+补充案例图片】倪师紫微斗数案例资料.doc",
            "format": "Microsoft Word 97-2003 Document (.doc, OLE2)",
            "extracted_by": "tools/extract_doc_text.py",
            "split_by": "tools/split_tianji_jiangyi.py",
            "total_episodes": len(chapter_records),
            "total_chars": sum(r["char_count"] for r in chapter_records),
        },
        "chapters": chapter_records,
    }
    (out_dir / "index.json").write_text(
        json.dumps(index, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    # README
    readme = """# 倪海厦先生·天纪·紫微斗数讲义（结构化整理）

> **来源说明**：本目录收录的讲义内容整理自倪海厦先生天纪系列「紫微斗数」部分（共 14 集，对应讲义编号第 2 集至第 15 集）。原讲义由倪海厦先生讲授，文本整理与排版由本项目作者完成，**仅供个人学习与紫微斗数研究之用**。原讲义内容版权归倪海厦先生及其合法继承人所有。

## 目录结构

```
docs/ni-tianji-zjds/
├── README.md                 本说明
├── index.json                结构化索引（每集标题/字符数/含主星）
├── raw/                      按集切分后的原始讲义（去除 PUA 字符与多余空行）
└── cleaned/                  进一步清洗后的版本（与 raw 同步，作为正式引用源）
```

## 收录范围

| 集数 | 紫微斗数编号 | 主题 | 主星涉及 |
|------|-------------|------|---------|
"""
    for r in chapter_records:
        stars = "、".join(r["stars"]) if r["stars"] else "（基础理论）"
        readme += f"| 第 {r['episode']} 集 | {r['pinyin_index']} | {r['title']} | {stars} |\n"

    readme += f"""

## 技术说明

原 `.doc` 为 Microsoft Word 97-2003 二进制格式（OLE2 容器），文本存储在 `WordDocument` 流的 `fcMin:fcMac` 区间（按 UTF-16 LE 编码）。

| 项 | 值 |
|---|---|
| 原文件大小 | 4,949,284 字节（4.95 MB，含嵌入图片） |
| 文本大小 | 22,235 字符（22 KB） |
| 原文件页数 | 55 |
| 实际收录集数 | {len(chapter_records)} 集（第 2-15 集） |
| 14 主星命中总次数 | {sum(len(r['stars']) for r in chapter_records)} 处 |

## 项目内引用方式

- **星曜档案 / 知识库**（`lib/ziwei/star-aggregate.ts`）：将每集「含主星段」做主题匹配
- **倪师语录**（`lib/nihai/tianji.ts`）：按集切分后逐条加入 `TIANJI_QUOTES`
- **古籍库**（`lib/classics/data/`）：可在 `quanji.ts`（紫微斗数全集）下新增章节归属，标记「来源·倪师天纪讲义·第 N 集」
- **AI 对话**（`/api/tianji-chat`）：作为 `contextType=general` 的兜底知识源

## 版权与免责

- 本项目为**技术性整理**（切分、清洗、检索），不修改讲义原文内容
- 不得用于商业用途；公开仓库收录仅作个人学习备份
- 如版权方要求下架，请联系项目维护者删除本目录
"""
    (out_dir / "README.md").write_text(readme, encoding="utf-8")

    print(f"切分完成：{len(chapter_records)} 集")
    print(f"  原文：{src}")
    print(f"  输出：{out_dir}")
    print(f"  索引：{out_dir / 'index.json'}")
    print(f"  总字符：{index['source']['total_chars']}")


if __name__ == "__main__":
    main()
