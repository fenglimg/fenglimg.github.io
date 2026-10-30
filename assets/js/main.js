---
layout: null
---
/* 博客交互脚本（无依赖），Bento 与 GitHub 两种风格共用 */
(function () {
  "use strict";

  var ICONS = {
    link: {% capture i %}{% include icon.html name="link" %}{% endcapture %}{{ i | strip | jsonify }},
    copy: {% capture i %}{% include icon.html name="copy" %}{% endcapture %}{{ i | strip | jsonify }},
    check: {% capture i %}{% include icon.html name="check" %}{% endcapture %}{{ i | strip | jsonify }},
    info: {% capture i %}{% include icon.html name="info" %}{% endcapture %}{{ i | strip | jsonify }},
    bulb: {% capture i %}{% include icon.html name="light-bulb" %}{% endcapture %}{{ i | strip | jsonify }},
    report: {% capture i %}{% include icon.html name="report" %}{% endcapture %}{{ i | strip | jsonify }},
    alert: {% capture i %}{% include icon.html name="alert" %}{% endcapture %}{{ i | strip | jsonify }},
    stop: {% capture i %}{% include icon.html name="stop" %}{% endcapture %}{{ i | strip | jsonify }},
    calendar: {% capture i %}{% include icon.html name="calendar" %}{% endcapture %}{{ i | strip | jsonify }},
    clock: {% capture i %}{% include icon.html name="clock" %}{% endcapture %}{{ i | strip | jsonify }},
    hash: {% capture i %}{% include icon.html name="hash" %}{% endcapture %}{{ i | strip | jsonify }},
    arrow: {% capture i %}{% include icon.html name="arrow-up-right" %}{% endcapture %}{{ i | strip | jsonify }},
    tones: [
      {% capture i %}{% include icon.html name="note" %}{% endcapture %}{{ i | strip | jsonify }},
      {% capture i %}{% include icon.html name="code" %}{% endcapture %}{{ i | strip | jsonify }},
      {% capture i %}{% include icon.html name="sparkle-fill" %}{% endcapture %}{{ i | strip | jsonify }},
      {% capture i %}{% include icon.html name="flame" %}{% endcapture %}{{ i | strip | jsonify }}
    ]
  };

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      /* 剪贴板接口被拒绝（例如嵌入在受限框架里）时退回到选中复制 */
      return navigator.clipboard.writeText(text).catch(function () { return legacyCopy(text); });
    }
    return legacyCopy(text);
  }

  function legacyCopy(text) {
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy") ? resolve() : reject(); } catch (e) { reject(e); }
      document.body.removeChild(ta);
    });
  }

  function flashCopied(btn) {
    var original = btn.innerHTML;
    btn.innerHTML = ICONS.check;
    btn.classList.add("is-copied");
    setTimeout(function () {
      btn.innerHTML = original;
      btn.classList.remove("is-copied");
    }, 1500);
  }

  /* ---------- 风格切换：Bento ⇄ GitHub ---------- */
  function currentStyle() {
    return document.documentElement.getAttribute("data-style") === "github" ? "github" : "bento";
  }

  function initStyle() {
    var active = currentStyle();
    /* 页面里同时有两套结构，移除不用的那套，避免重复的 id 和内容 */
    $$("[data-style-root]").forEach(function (el) {
      if (el.getAttribute("data-style-root") !== active) el.remove();
    });
    $$("[data-style-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        try { localStorage.setItem("style", btn.getAttribute("data-style-toggle")); } catch (e) {}
        var url = new URL(location.href);
        url.searchParams.delete("style");
        location.replace(url.toString());
      });
    });
  }

  /* ---------- 主题切换：跟随系统 → 浅色 → 深色 ---------- */
  var THEMES = ["auto", "light", "dark"];
  var THEME_LABEL = { auto: "跟随系统", light: "浅色", dark: "深色" };

  function giscusTheme(t) {
    return t === "auto" ? "preferred_color_scheme" : t;
  }

  function syncGiscus(t) {
    var frame = $("iframe.giscus-frame");
    if (frame && frame.contentWindow) {
      frame.contentWindow.postMessage({ giscus: { setConfig: { theme: giscusTheme(t) } } }, "https://giscus.app");
    }
  }

  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem("theme", t); } catch (e) {}
    $$("[data-theme-toggle]").forEach(function (btn) {
      var label = "主题：" + THEME_LABEL[t] + "（点击切换）";
      btn.setAttribute("aria-label", label);
      btn.setAttribute("title", label);
    });
    syncGiscus(t);
  }

  function initTheme() {
    var current = document.documentElement.getAttribute("data-theme") || "auto";
    applyTheme(current);
    $$("[data-theme-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var now = document.documentElement.getAttribute("data-theme") || "auto";
        applyTheme(THEMES[(THEMES.indexOf(now) + 1) % THEMES.length]);
      });
    });
    window.addEventListener("message", function (e) {
      if (e.origin === "https://giscus.app") {
        syncGiscus(document.documentElement.getAttribute("data-theme") || "auto");
      }
    });
  }

  /* ---------- 快捷键：按 / 聚焦搜索 ---------- */
  function initShortcuts() {
    document.addEventListener("keydown", function (e) {
      if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey) return;
      var tag = (e.target.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea" || e.target.isContentEditable) return;
      var input = $("[data-search-input]") || $("#header-q");
      if (input && input.offsetParent !== null) {
        e.preventDefault();
        input.focus();
      }
    });
  }

  /* ---------- Markdown 增强 ---------- */
  var ALERTS = {
    NOTE: { cls: "note", label: "说明", icon: "info" },
    TIP: { cls: "tip", label: "提示", icon: "bulb" },
    IMPORTANT: { cls: "important", label: "重要", icon: "report" },
    WARNING: { cls: "warning", label: "警告", icon: "alert" },
    CAUTION: { cls: "caution", label: "注意", icon: "stop" }
  };

  function initAlerts(body) {
    $$("blockquote", body).forEach(function (bq) {
      var first = bq.firstElementChild;
      if (!first || first.tagName !== "P") return;
      var m = first.innerHTML.match(/^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(<br\s*\/?>)?\s*/i);
      if (!m) return;
      var conf = ALERTS[m[1].toUpperCase()];
      first.innerHTML = first.innerHTML.slice(m[0].length);
      if (!first.innerHTML.trim()) first.remove();
      var div = document.createElement("div");
      div.className = "markdown-alert markdown-alert-" + conf.cls;
      div.innerHTML = '<p class="markdown-alert-title">' + ICONS[conf.icon] + conf.label + "</p>";
      while (bq.firstChild) div.appendChild(bq.firstChild);
      bq.replaceWith(div);
    });
  }

  function initAnchors(body) {
    $$("h1[id], h2[id], h3[id], h4[id]", body).forEach(function (h) {
      var a = document.createElement("a");
      a.className = "anchor";
      a.href = "#" + encodeURIComponent(h.id);
      a.setAttribute("aria-label", "链接到本节：" + h.textContent.trim());
      a.innerHTML = ICONS.link;
      h.insertBefore(a, h.firstChild);
    });
  }

  function initCopyButtons(body) {
    $$("div.highlighter-rouge", body).forEach(function (block) {
      var code = $("pre code", block) || $("pre", block);
      if (!code) return;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy-btn";
      btn.setAttribute("aria-label", "复制代码");
      btn.title = "复制代码";
      btn.innerHTML = ICONS.copy;
      btn.addEventListener("click", function () {
        copyText(code.innerText.replace(/\n$/, "")).then(function () { flashCopied(btn); }, function () {});
      });
      block.appendChild(btn);
    });
  }

  function initToc(body) {
    var nav = $("[data-toc]");
    var section = $("[data-toc-section]");
    if (!nav || !section) return;
    var heads = $$("h2[id], h3[id]", body);
    if (heads.length < 2) return;

    var ol = document.createElement("ol");
    var links = heads.map(function (h) {
      var li = document.createElement("li");
      li.className = "toc-" + h.tagName.toLowerCase();
      var a = document.createElement("a");
      a.href = "#" + encodeURIComponent(h.id);
      a.textContent = h.textContent.trim();
      a.title = a.textContent;
      li.appendChild(a);
      ol.appendChild(li);
      return a;
    });
    nav.appendChild(ol);
    section.hidden = false;

    var ticking = false;
    function update() {
      ticking = false;
      var idx = 0;
      for (var i = 0; i < heads.length; i++) {
        if (heads[i].getBoundingClientRect().top <= 96) idx = i;
        else break;
      }
      links.forEach(function (a, i) {
        a.classList.toggle("is-active", i === idx);
        if (i === idx) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  function initBackToTop() {
    $$("[data-back-to-top]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
        var main = $("#main");
        if (main) { main.setAttribute("tabindex", "-1"); main.focus({ preventScroll: true }); }
      });
    });
  }

  /* ---------- 写作热力图 ---------- */
  function pad(n) { return n < 10 ? "0" + n : "" + n; }
  function ymd(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }

  function initContrib() {
    var root = $("[data-contrib]");
    var dataEl = $("#contrib-data");
    if (!root || !dataEl) return;
    var posts = [];
    try { posts = JSON.parse(dataEl.textContent); } catch (e) { return; }

    var byDay = {};
    posts.forEach(function (p) { (byDay[p.d] = byDay[p.d] || []).push(p); });

    /* 每列（一周）的宽度 = 方块 + 间距：Bento 16px，GitHub 13px（data-col）；data-fit 时按卡片宽度决定显示几周 */
    var COL = parseInt(root.getAttribute("data-col"), 10) || 16;
    var weeks = 53;
    if (root.hasAttribute("data-fit") && root.parentElement) {
      weeks = Math.max(8, Math.min(53, Math.floor((root.parentElement.clientWidth - 24 + 4) / COL)));
    }
    var end = new Date();
    end.setHours(0, 0, 0, 0);
    var start = new Date(end);
    start.setDate(start.getDate() - end.getDay() - (weeks - 1) * 7);
    var weeksEl = $("[data-contrib-weeks]");
    if (weeksEl) weeksEl.textContent = weeks;

    var corner = document.createElement("span");
    var months = document.createElement("div");
    months.className = "contrib-months";
    var days = document.createElement("div");
    days.className = "contrib-days";
    ["", "一", "", "三", "", "五", ""].forEach(function (t) {
      var s = document.createElement("span");
      s.textContent = t;
      days.appendChild(s);
    });
    days.setAttribute("aria-hidden", "true");
    months.setAttribute("aria-hidden", "true");
    var cells = document.createElement("div");
    cells.className = "contrib-cells";

    var total = 0;
    var col = 0;
    var lastMonth = -1;
    var lastLabelCol = -10;
    for (var d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (d.getDay() === 0 && d > start) col++;
      if (d.getDay() === 0 && d.getMonth() !== lastMonth) {
        if (col - lastLabelCol >= 3) {
          var m = document.createElement("span");
          m.textContent = (d.getMonth() + 1) + "月";
          m.style.left = col * COL + "px";
          months.appendChild(m);
          lastLabelCol = col;
        }
        lastMonth = d.getMonth();
      }
      var key = ymd(d);
      var list = byDay[key] || [];
      total += list.length;
      var cell;
      if (list.length) {
        cell = document.createElement("a");
        cell.href = list[0].u;
        var names = list.map(function (p) { return "《" + p.t + "》"; }).join("、");
        var label = key + "：发布 " + list.length + " 篇 " + names;
        cell.title = label;
        cell.setAttribute("aria-label", label);
      } else {
        cell = document.createElement("span");
        cell.title = key + "：没有发布";
        cell.setAttribute("aria-hidden", "true");
      }
      cell.className = "contrib-cell";
      cell.setAttribute("data-level", list.length === 0 ? 0 : list.length === 1 ? 2 : list.length === 2 ? 3 : 4);
      cells.appendChild(cell);
    }

    root.appendChild(corner);
    root.appendChild(months);
    root.appendChild(days);
    root.appendChild(cells);

    var totalEl = $("[data-contrib-total]");
    if (totalEl) totalEl.textContent = total;

    var scroller = root.parentElement;
    if (scroller) scroller.scrollLeft = scroller.scrollWidth;
  }

  /* ---------- 归档页筛选 ---------- */
  function initFilter() {
    var scope = $("[data-filter-scope]");
    var input = scope && $("[data-filter-input]", scope);
    if (!input) return;
    var items = $$("[data-filter-item]", scope);
    var groups = $$("[data-filter-group]", scope);
    input.addEventListener("input", function () {
      var q = input.value.trim().toLowerCase();
      var visible = 0;
      items.forEach(function (it) {
        var hit = !q || it.getAttribute("data-filter-text").toLowerCase().indexOf(q) !== -1;
        it.hidden = !hit;
        if (hit) visible++;
      });
      groups.forEach(function (g) {
        g.hidden = !$$("[data-filter-item]", g).some(function (it) { return !it.hidden; });
      });
      scope.classList.toggle("is-filtering-empty", visible === 0);
    });
  }

  function initCopyLinks() {
    $$("[data-copy-link]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        copyText(btn.getAttribute("data-copy-link")).then(function () { flashCopied(btn); }, function () {});
      });
    });
  }

  /* ---------- 站内搜索 ---------- */
  function highlight(text, terms) {
    var html = escapeHtml(text);
    terms.forEach(function (t) {
      if (!t) return;
      var re = new RegExp("(" + escapeHtml(t).replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi");
      html = html.replace(re, "<mark>$1</mark>");
    });
    return html;
  }

  function snippet(content, terms) {
    var lower = content.toLowerCase();
    var pos = -1;
    for (var i = 0; i < terms.length && pos === -1; i++) pos = lower.indexOf(terms[i]);
    if (pos === -1) return content.slice(0, 120);
    var from = Math.max(0, pos - 40);
    return (from > 0 ? "…" : "") + content.slice(from, from + 140) + "…";
  }

  function initSearch() {
    var input = $("[data-search-input]");
    if (!input) return;
    var results = $("[data-search-results]");
    var status = $("[data-search-status]");
    var index = null;

    var params = new URLSearchParams(location.search);
    input.value = params.get("q") || "";

    function render() {
      var q = input.value.trim();
      var url = new URL(location.href);
      if (q) url.searchParams.set("q", q); else url.searchParams.delete("q");
      history.replaceState(null, "", url);

      if (!q) {
        results.innerHTML = "";
        status.textContent = "共 " + index.length + " 篇文章，输入关键词开始搜索。";
        return;
      }
      var terms = q.toLowerCase().split(/\s+/).filter(Boolean);
      var hits = index.map(function (p) {
        var title = p.title.toLowerCase();
        var tags = (p.tags || []).join(" ").toLowerCase();
        var body = (p.content || "").toLowerCase();
        var score = 0;
        for (var i = 0; i < terms.length; i++) {
          var t = terms[i];
          var s = (title.indexOf(t) !== -1 ? 10 : 0) + (tags.indexOf(t) !== -1 ? 5 : 0) + (body.indexOf(t) !== -1 ? 1 : 0);
          if (!s) return null;
          score += s;
        }
        return { p: p, score: score };
      }).filter(Boolean).sort(function (a, b) { return b.score - a.score; });

      status.textContent = hits.length ? "找到 " + hits.length + " 篇相关文章" : "没有找到与“" + q + "”相关的文章";
      results.innerHTML = currentStyle() === "github" ? hits.map(function (h) {
        var p = h.p;
        var tags = (p.tags || []).map(function (t) {
          return '<span class="topic-tag">' + highlight(t, terms) + "</span>";
        }).join("");
        return '<li class="post-item">' +
          '<div class="post-item-head"><h3 class="post-item-title"><a href="' + escapeHtml(p.url) + '">' + highlight(p.title, terms) + "</a></h3></div>" +
          '<p class="post-item-desc">' + highlight(snippet(p.content || p.desc || "", terms), terms) + "</p>" +
          (tags ? '<div class="topic-list">' + tags + "</div>" : "") +
          '<div class="post-item-meta"><span>' + ICONS.calendar + escapeHtml(p.date) + "</span></div>" +
          "</li>";
      }).join("") : hits.map(function (h, i) {
        var p = h.p;
        var tone = i % 4;
        var tags = (p.tags || []).map(function (t) {
          return '<span class="pill">#' + highlight(t, terms) + "</span>";
        }).join("");
        return '<article class="card post-tile is-interactive span-2">' +
          '<div class="card-head"><span class="chip-icon tone-' + tone + '">' + ICONS.tones[tone] + "</span>" +
          '<time class="tile-date">' + escapeHtml(p.date.replace(/-/g, ".")) + "</time></div>" +
          '<h3 class="card-title"><a class="stretched" href="' + escapeHtml(p.url) + '">' + highlight(p.title, terms) + "</a></h3>" +
          '<p class="tile-desc">' + highlight(snippet(p.content || p.desc || "", terms), terms) + "</p>" +
          (tags ? '<div class="pill-list">' + tags + "</div>" : "") +
          '<div class="tile-meta"><span class="card-arrow">' + ICONS.arrow + "</span></div>" +
          "</article>";
      }).join("");
    }

    /* 页面内嵌了索引（离线包）就直接用，否则请求 search.json */
    var inline = $("#search-data");
    var load = inline
      ? Promise.resolve().then(function () { return JSON.parse(inline.textContent); })
      : fetch(input.getAttribute("data-search-index")).then(function (r) { return r.json(); });
    status.textContent = "正在加载索引…";
    load
      .then(function (data) {
        index = data;
        render();
        var timer;
        input.addEventListener("input", function () {
          clearTimeout(timer);
          timer = setTimeout(render, 120);
        });
      })
      .catch(function () { status.textContent = "搜索索引加载失败，请稍后再试。"; });
  }

  /* ---------- 文章内嵌演示：点击封面后才加载 iframe ---------- */
  function initDemoEmbeds() {
    $$("[data-demo-src]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var frame = document.createElement("iframe");
        frame.src = btn.getAttribute("data-demo-src");
        frame.title = btn.getAttribute("data-demo-title") || "交互演示";
        frame.setAttribute("allow", "fullscreen");
        frame.setAttribute("allowfullscreen", "");
        btn.replaceWith(frame);
        frame.focus();
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initStyle();
    initDemoEmbeds();
    initTheme();
    initShortcuts();
    var body = $("[data-post-body]");
    if (body) {
      initAlerts(body);
      initAnchors(body);
      initCopyButtons(body);
      initToc(body);
    }
    initBackToTop();
    initContrib();
    initFilter();
    initCopyLinks();
    initSearch();
  });
})();
