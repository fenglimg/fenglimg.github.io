# fenglimg 的博客

一个支持两种风格切换的 Jekyll 博客主题：

- **Bento**（默认）：便当盒卡片网格，视觉规范来自 [StyleKit · Bento Grid](https://www.stylekit.top/zh/styles/bento-grid)
- **GitHub**：仿 GitHub 界面，视觉规范来自 [StyleKit · GitHub Style](https://www.stylekit.top/zh/styles/github-style)

访客点顶栏的画笔按钮即可切换，选择会被记住；网址后加 `?style=github` 或 `?style=bento` 可以直接指定。默认风格在 `_config.yml` 的 `default_style` 里改。

### 风格切换的原理

每个页面在构建时同时生成两套结构（`_includes/bento/` 与 `_includes/gh/`）。`_includes/head.html` 在首帧前根据访客的选择只加载对应的样式表（`bento.css` / `github.css`），`main.js` 加载后移除另一套结构，因此页面里始终只有一份内容。

## 特性

- **Bento 首页**：大小不一的卡片拼成一页（个人资料、最新文章、数据统计、写作热力图、最近文章、语录、正在做、标签云……）
- **卡片像 iOS 小组件**：悬停上浮、微放大、阴影扩散，图标独立变色
- **网格自动补齐**：归档页、标签页根据数量自动计算卡片尺寸，4 列网格不留空洞
- **文章页**：渐变标题卡 + 日期/阅读时长小卡，悬浮目录，代码一键复制
- **提示块**：`> [!NOTE]`、`[!TIP]`、`[!IMPORTANT]`、`[!WARNING]`、`[!CAUTION]`
- **站内全文搜索**（按 <kbd>/</kbd> 快速聚焦）、归档筛选、RSS、SEO、giscus 评论
- **浅色 / 深色 / 跟随系统** 三种主题；尊重「减少动态效果」系统设置
- 无前端依赖；渐变色均选用深色阶，白字对比度满足 WCAG AA

## 快速开始

1. 把本目录的全部文件推送到名为 `<用户名>.github.io` 的仓库
2. 在仓库 **Settings → Pages** 中，**Source** 选 **Deploy from a branch**，分支选 `main`、目录选 `/ (root)`，保存
3. 等待约 1 分钟，访问 `https://<用户名>.github.io`

主题已按 GitHub Pages 内置的 Jekyll 3.10（`github-pages` gem）验证过，不需要 Actions 工作流。

本地预览：

```bash
bundle install
bundle exec jekyll serve --livereload
```

## 个性化

| 要改的内容 | 位置 |
| --- | --- |
| 站点标题、作者信息、头像 | `_config.yml` |
| 首页「正在做」「语录」卡片 | `_config.yml` 的 `now`、`quote` |
| 首页卡片排列 | `_includes/bento/views/home.html`、`_includes/gh/views/home.html` |
| 关于页 | `about.md` |
| 顶部导航 | `_config.yml` 的 `nav` |
| 评论 | `_config.yml` 的 `giscus` |
| 颜色等设计令牌 | `assets/css/bento.css`、`assets/css/github.css` 顶部 `:root` |

## 写文章

在 `_posts/` 下新建 `YYYY-MM-DD-slug.md`：

```yaml
---
title: 文章标题
description: 一句话摘要（可选）
tags: [标签1, 标签2]
pinned: true     # 可选，优先出现在首页「精选」卡片
updated: 2026-11-01   # 可选，显示更新时间
tone: 2          # 可选，标题卡渐变色 0–3，不填按日期自动轮换
---
```

## 许可

图标来自 [Primer Octicons](https://github.com/primer/octicons)（MIT）。
