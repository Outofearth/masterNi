"""extract_doc_text.py — 从倪师 .doc 讲义（OLE2 / WordDocument 流）按 FIB 头提取纯文本。

用法：python extract_doc_text.py <input.doc> <output.txt>
"""
import sys
import struct
import olefile


def extract(path: str) -> str:
    ole = olefile.OleFileIO(path)
    wd = ole.openstream("WordDocument").read()
    ole.close()

    # 校验 FIB 魔数
    w_ident = struct.unpack("<H", wd[0:2])[0]
    if w_ident != 0xA5EC:
        raise ValueError(f"非 Word 文档（wIdent={hex(w_ident)}）")

    # FIBBase 偏移 0x18 = fcMin，0x1C = fcMac（经验位置，本文档验证通过）
    fc_min = struct.unpack("<I", wd[0x18:0x1C])[0]
    fc_mac = struct.unpack("<I", wd[0x1C:0x20])[0]
    if not (0 < fc_min < fc_mac <= len(wd)):
        raise ValueError(f"fcMin/fcMac 越界: {fc_min}/{fc_mac}, stream={len(wd)}")

    raw = wd[fc_min:fc_mac]
    # Word 文本流以 UTF-16 LE 存储
    text = raw.decode("utf-16-le", errors="replace")

    # 处理 Word 文本流中的特殊控制字符
    # 0x0D = 段落结束, 0x07 = 单元格结尾, 0x0B = 单元格, 0x0C = 分页
    # 0x13/0x14/0x15 = 字段三件套, 0x1E-0x1F = 不可见字符
    table = {
        "\r": "\n",          # 段落结束 → 换行
        "\x07": "",           # 单元格结束
        "\x0B": "\n",         # 单元格内换行
        "\x0C": "\n\n",       # 分页符
        "\x13": "【字段】",   # 字段开始
        "\x14": "|",
        "\x15": "【/字段】",
        "\x1E": "",           # 不可分空格
        "\x1F": "",           # 可选连字符
    }
    for k, v in table.items():
        text = text.replace(k, v)

    # 合并多余空行
    while "\n\n\n" in text:
        text = text.replace("\n\n\n", "\n\n")
    # 去行尾空白
    lines = [ln.rstrip() for ln in text.split("\n")]
    return "\n".join(lines).strip() + "\n"


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("用法: python extract_doc_text.py <input.doc> <output.txt>")
        sys.exit(1)
    out = extract(sys.argv[1])
    with open(sys.argv[2], "w", encoding="utf-8") as f:
        f.write(out)
    print(f"已写出: {sys.argv[2]} ({len(out)} 字符, {out.count(chr(10))} 行)")
