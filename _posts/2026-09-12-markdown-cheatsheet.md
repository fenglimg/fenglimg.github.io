---
title: Markdown 写作速查表
description: 这个主题支持的全部 Markdown 语法一览，顺便检验排版效果。
tags: [Markdown, 写作]
pinned: true
---

这篇文章展示了主题对各种 Markdown 元素的渲染效果，写作时可以随时回来翻查。

## 文本样式

**粗体**、*斜体*、~~删除线~~、`行内代码`、<kbd>Ctrl</kbd> + <kbd>C</kbd>，以及一个[普通链接](https://github.com)。

脚注也可以用[^1]。

[^1]: 这是脚注的内容，会显示在文章末尾。

## 列表

- 无序列表项
- 另一项
  - 嵌套项
  - 再一项

1. 有序列表
2. 第二步
3. 第三步

- [x] 已完成的任务
- [ ] 未完成的任务

## 引用与提示块

> 普通引用：简单是可靠的先决条件。—— Edsger W. Dijkstra

> [!NOTE]
> 说明：读者即使快速浏览也应该知道的信息。

> [!TIP]
> 提示：帮助读者把事情做得更好的建议。

> [!IMPORTANT]
> 重要：读者达成目标必须了解的关键信息。

> [!WARNING]
> 警告：需要读者立即注意、以免出问题的内容。

> [!CAUTION]
> 注意：某些操作可能带来的风险或负面后果。

## 代码

```javascript
// 计算阅读时长（中文按每分钟 400 字估算）
export function readingTime(text, speed = 400) {
  const chars = text.replace(/\s/g, "").length;
  return Math.max(1, Math.ceil(chars / speed));
}
```

```python
from dataclasses import dataclass

@dataclass
class Post:
    title: str
    tags: list[str]

    def slug(self) -> str:
        return self.title.lower().replace(" ", "-")
```

```css
:root {
  --accent: #0969da;
  --border: #d0d7de;
}
```

```diff
- color: #8b949e; /* 对比度 3.08:1，不达标 */
+ color: #656d76; /* 对比度 5.25:1，满足 WCAG AA */
```

## 表格

| 令牌 | 浅色 | 深色 | 用途 |
| --- | :---: | :---: | --- |
| `--fg` | `#1f2328` | `#e6edf3` | 正文 |
| `--fg-muted` | `#656d76` | `#8d96a0` | 次要文字 |
| `--accent` | `#0969da` | `#4493f8` | 链接与交互 |
| `--border` | `#d0d7de` | `#30363d` | 边框 |

## 折叠内容

<details>
<summary>点击展开</summary>

折叠区域里也可以写 **Markdown**。

</details>

## 分隔线

---

以上就是全部常用语法。
