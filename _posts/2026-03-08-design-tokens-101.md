---
title: CSS 设计令牌入门
description: 用 CSS 自定义属性管理颜色、间距与圆角，一套变量同时支持浅色和深色主题。
tags: [CSS, 设计系统]
---

设计令牌（Design Tokens）就是给设计决策起名字：不写 `#0969da`，而写 `--accent`。这样做最大的好处是，换主题时只需要换一组变量。

## 定义令牌

```css
:root {
  --bg: #ffffff;
  --fg: #1f2328;
  --accent: #0969da;
  --radius: 6px;
}

:root[data-theme="dark"] {
  --bg: #0d1117;
  --fg: #e6edf3;
  --accent: #4493f8;
}
```

## 使用令牌

```css
.btn {
  color: var(--fg);
  border-radius: var(--radius);
}

.btn:hover {
  border-color: var(--accent);
}
```

## 跟随系统主题

```css
@media (prefers-color-scheme: dark) {
  :root[data-theme="auto"] {
    --bg: #0d1117;
  }
}
```

> [!IMPORTANT]
> 深色主题不是把浅色反相。背景、边框、文字都要重新挑选，并逐一检查对比度。

## 语义化命名

| 不推荐 | 推荐 | 原因 |
| --- | --- | --- |
| `--blue` | `--accent` | 换了品牌色名字就不对了 |
| `--gray-600` | `--fg-muted` | 表达用途而不是外观 |
