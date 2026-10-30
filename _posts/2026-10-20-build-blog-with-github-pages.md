---
title: 用 GitHub Pages 搭建个人博客
description: 从零开始，十分钟把一个 Jekyll 博客部署到 GitHub Pages，并配置自定义域名与评论。
tags: [GitHub Pages, Jekyll, 教程]
pinned: true
---

GitHub Pages 是 GitHub 提供的免费静态网站托管服务。对个人博客来说，它几乎是零成本、零运维的最优解：写 Markdown，`git push`，几十秒后网站就更新了。

## 准备工作

你需要：

- 一个 GitHub 账号
- 本地安装好 Git 和 Ruby（3.0 以上）
- 一个顺手的编辑器

> [!NOTE]
> 如果只想在线写作，不装任何本地环境也可以：直接在 GitHub 网页上新建、编辑 `_posts/` 下的文件即可。

## 第一步：创建仓库

新建一个名为 `<用户名>.github.io` 的公开仓库，把本主题的全部文件推送上去：

```bash
git clone https://github.com/<用户名>/<用户名>.github.io.git
cd <用户名>.github.io
# 把主题文件复制进来后
git add .
git commit -m "init: github style blog"
git push origin main
```

## 第二步：开启 Pages

进入仓库的 **Settings → Pages**，在 *Build and deployment* 中把 **Source** 设为 **GitHub Actions**。本主题自带 `.github/workflows/pages.yml`，推送后会自动构建并发布。

| 部署方式 | 优点 | 缺点 |
| --- | --- | --- |
| GitHub Actions | 可用任意 Jekyll 版本与插件 | 需要一个工作流文件 |
| 从分支部署 | 零配置 | 只能用白名单插件 |

## 第三步：本地预览

```bash
bundle install
bundle exec jekyll serve --livereload
```

打开 `http://localhost:4000`，修改文件后浏览器会自动刷新。

> [!TIP]
> 按键盘上的 <kbd>/</kbd> 可以随时聚焦顶部搜索框。

## 第四步：写第一篇文章

在 `_posts/` 目录新建文件，文件名格式为 `YYYY-MM-DD-英文标题.md`：

```yaml
---
title: 我的第一篇文章
description: 一句话摘要，会显示在列表和搜索结果里
tags: [随笔]
pinned: false   # 设为 true 会出现在首页「置顶」
---

正文从这里开始……
```

## 进阶：自定义域名

1. 在仓库根目录新建 `CNAME` 文件，内容写你的域名，例如 `blog.example.com`
2. 在域名服务商处添加一条 `CNAME` 记录，指向 `<用户名>.github.io`
3. 回到 **Settings → Pages**，勾选 **Enforce HTTPS**

> [!WARNING]
> DNS 生效可能需要几分钟到几小时，期间访问出现证书错误是正常的。

## 进阶：开启评论

本主题内置 [giscus](https://giscus.app)，评论数据存放在仓库的 Discussions 里：

- [x] 在仓库设置中开启 Discussions
- [x] 安装 giscus App 并授权该仓库
- [ ] 在 giscus 官网生成参数，填入 `_config.yml` 的 `giscus` 部分

完成后，每篇文章底部就会出现评论区，并且会跟随站点的深浅色主题。
