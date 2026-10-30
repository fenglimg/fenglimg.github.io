---
title: 我的终端工具链 2026
description: 用了几年后留下来的命令行工具：更快的搜索、更好看的 diff、更顺手的 Git。
tags: [工具, Shell]
---

每隔一段时间我都会整理一次自己的终端配置，删掉不用的，留下真正提高效率的。这是 2026 年的版本。

## 搜索：ripgrep + fd

`grep` 和 `find` 足够用，但 [ripgrep](https://github.com/BurntSushi/ripgrep) 和 [fd](https://github.com/sharkdp/fd) 默认会尊重 `.gitignore`，速度也快得多。

```bash
rg "TODO" --type ts        # 只在 TypeScript 文件里搜
fd -e md _posts            # 列出 _posts 下所有 Markdown
```

## Git：delta

[delta](https://github.com/dandavison/delta) 让 `git diff` 有了语法高亮和左右对比：

```ini
[core]
    pager = delta
[delta]
    navigate = true
    side-by-side = true
```

## 跳转：zoxide

记住常去的目录，用 `z blog` 就能直接跳到 `~/code/yourname.github.io`。

## 小结

| 工具 | 替代 | 一句话理由 |
| --- | --- | --- |
| ripgrep | grep | 快，且默认忽略无关文件 |
| fd | find | 语法更短 |
| delta | diff | 好读 |
| zoxide | cd | 少打字 |
