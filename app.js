/*  app.js — page logic: language, generated blocks, live module catalogue, gallery lightbox,
    the interactive demo. No build step; plain ES2020.
*/
(function () {
  "use strict";

  // ------------------------------------------------------------------ links to fill in later
  // Empty string = "coming soon": the button is shown disabled with the `data-soon` label.
  const LINKS = {
    buy: "",
    donate: "",
    download: "",            // e.g. https://github.com/broscauk/flbridge/releases/latest/download/FL-Bridge-1.0.0-setup.exe
    downloadModules: "",     // e.g. .../FL-Bridge-1.0.0-modules-setup.exe
    modulesRepo: "https://github.com/broscauk/flbridge-modules",
  };
  const FILE_NAMES = { download: "FL-Bridge-1.0.0-setup.exe", downloadModules: "FL-Bridge-1.0.0-modules-setup.exe" };
  const MANIFEST_URLS = [
    "https://cdn.jsdelivr.net/gh/broscauk/flbridge-modules@main/manifest.json",
    "https://raw.githubusercontent.com/broscauk/flbridge-modules/main/manifest.json",
  ];

  const I18N = window.FLB_I18N;
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const fmtMB = (b) => (b / 1048576).toFixed(b > 10485760 ? 0 : 1) + " MB";

  // ------------------------------------------------------------------ language
  function pickLang() {
    const q = new URLSearchParams(location.search).get("lang");
    if (q && I18N[q]) return q;
    const saved = localStorage.getItem("flb-lang");
    if (saved && I18N[saved]) return saved;
    return (navigator.language || "en").toLowerCase().startsWith("ru") ? "ru" : "en";
  }
  let lang = pickLang();
  const T = () => I18N[lang];
  const t = (k) => (T()[k] !== undefined ? T()[k] : I18N.en[k] !== undefined ? I18N.en[k] : k);

  const ICONS = {
    catalogue: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 13h8M8 16h5"/></svg>',
    sandbox: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z"/><path d="M9 12l2 2 4-4"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M7 10l5 5 5-5M4 19h16"/></svg>',
    macros: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="7" cy="8" r="3"/><circle cx="17" cy="16" r="3"/><path d="M7 11v9M17 4v9"/></svg>',
    gain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 12h3l3-7 4 14 3-7h5"/></svg>',
    meter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 20V10M9 20V4M14 20v-8M19 20v-4"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/></svg>',
    presets: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h10l4 4v12H5z"/><path d="M9 4v5h6M9 15h6"/></svg>',
    transport: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/></svg>',
    scale: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 10V4h6M20 14v6h-6M4 4l7 7M20 20l-7-7"/></svg>',
    keyboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="7" width="18" height="10" rx="2"/><path d="M7 11h.01M11 11h.01M15 11h.01M8 14h8"/></svg>',
    journal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h9l4 4v14H6z"/><path d="M9 12h6M9 16h6M9 8h2"/></svg>',
    default: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9L9.5 8z"/></svg>',
    installer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 7v7M9 11l3 3 3-3"/></svg>',
  };

  function applyI18n() {
    document.documentElement.lang = lang;
    document.title = t("title");
    $$("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
    $$("[data-i18n-html]").forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
    $$("[data-i18n-attr]").forEach((el) => {
      el.dataset.i18nAttr.split(";").forEach((pair) => { const [attr, key] = pair.split(":"); el.setAttribute(attr.trim(), t(key.trim())); });
    });
    $$("[data-list]").forEach((el) => { const items = t(el.dataset.list); el.innerHTML = Array.isArray(items) ? items.map((x) => `<li>${esc(x)}</li>`).join("") : ""; });
    $$(".lang button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));

    $("[data-products]").innerHTML = t("products").map((p) => `<article class="card product"><span class="tag">${esc(p.tag)}</span><h3>${esc(p.name)}</h3><p>${esc(p.text)}</p></article>`).join("");
    $("[data-features]").innerHTML = t("features").map((f) => `<article class="feature"><div class="ico">${ICONS[f.icon] || ""}</div><h3>${esc(f.title)}</h3><p>${esc(f.text)}</p>${FEATURE_TOUR[f.icon] ? `<button type="button" class="see" data-tour-go="${FEATURE_TOUR[f.icon]}">${esc(t("feature_see"))}<span aria-hidden="true"> →</span></button>` : ""}</article>`).join("");
    $("[data-compat]").innerHTML = t("compat_rows").map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("");
    $("[data-gallery]").innerHTML = t("gallery").map((g, i) => `<figure data-shot="${i}"><img src="assets/shots/${g.src}" alt="${esc(g.cap)}" loading="lazy"><figcaption>${esc(g.cap)}</figcaption></figure>`).join("");
    $("[data-faq]").innerHTML = t("faq").map((f) => `<details><summary>${esc(f.q)}</summary><div class="answer">${esc(f.a)}</div></details>`).join("");

    // links: real or "coming soon"
    $$("[data-link]").forEach((a) => {
      const key = a.dataset.link; const url = LINKS[key];
      if (url) { a.href = url; a.classList.remove("is-soon"); a.removeAttribute("aria-disabled"); a.textContent = t(a.dataset.i18n); if (key !== "buy" && key !== "donate") { a.target = "_blank"; a.rel = "noopener"; } }
      else { a.href = "#"; a.classList.add("is-soon"); a.setAttribute("aria-disabled", "true"); a.textContent = t(a.dataset.soon || a.dataset.i18n); }
    });
    $$("[data-link-name]").forEach((p) => { p.textContent = FILE_NAMES[p.dataset.linkName] || ""; });
    renderModules();
    if (tour) tour.setLang(lang);
    setupReveal();
  }
  // feature icon → the tour step that shows it live
  const FEATURE_TOUR = { catalogue: "slot", sandbox: "status", download: "modules", macros: "learn", gain: "autogain", meter: "meter", search: "palette", presets: "preset", scale: "settings", journal: "status", default: "settings" };
  document.addEventListener("click", (e) => { const a = e.target.closest("a.is-soon"); if (a) e.preventDefault(); });

  $$(".lang button").forEach((b) => b.addEventListener("click", () => {
    lang = b.dataset.lang; localStorage.setItem("flb-lang", lang);
    const url = new URL(location.href); url.searchParams.set("lang", lang); history.replaceState(null, "", url);
    applyI18n();
  }));

  // ------------------------------------------------------------------ header
  $$("[data-logo]").forEach((el) => { el.innerHTML = window.FLB_LOGO.svg(28, { live: true, arc: "#f2542d" }); });
  const burger = $("[data-burger]"); const nav = $(".nav");
  burger.addEventListener("click", () => { const open = nav.classList.toggle("open"); burger.setAttribute("aria-expanded", String(open)); });
  nav.addEventListener("click", (e) => { if (e.target.tagName === "A") { nav.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); } });

  // ------------------------------------------------------------------ modules catalogue
  let modules = (window.FLB_MODULES && window.FLB_MODULES.plugins) || [];
  let modulesMeta = { live: false, date: (window.FLB_MODULES && window.FLB_MODULES.generated) || "" };
  let kindFilter = "all";
  const search = $("[data-modules-search]");
  search.addEventListener("input", renderModules);
  $$(".seg [data-kind]").forEach((b) => b.addEventListener("click", () => { kindFilter = b.dataset.kind; $$(".seg [data-kind]").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); renderModules(); }));

  function renderModules() {
    const q = search.value.trim().toLowerCase();
    const rows = modules.filter((m) => (kindFilter === "all" || m.kind === kindFilter) && (!q || m.name.toLowerCase().includes(q)));
    $("[data-modules-body]").innerHTML = rows.map((m) => `<tr><td>${esc(m.name)}</td><td><span class="kind ${m.kind}">${esc(t("kind_" + m.kind))}</span></td><td class="num">${fmtMB(m.size)}</td><td class="num">${fmtMB(m.unpacked)}</td><td class="num">${m.files}</td></tr>`).join("");
    const size = rows.reduce((a, m) => a + m.size, 0);
    $("[data-modules-count]").textContent = t("modules_count").replace("{shown}", rows.length).replace("{total}", modules.length).replace("{size}", fmtMB(size));
    $("[data-modules-source]").textContent = t(modulesMeta.live ? "modules_live" : "modules_snapshot").replace("{date}", modulesMeta.date || "");
  }
  async function refreshManifest() {
    for (const url of MANIFEST_URLS) {
      try {
        const ctl = new AbortController(); const tm = setTimeout(() => ctl.abort(), 8000);
        const r = await fetch(url, { signal: ctl.signal, cache: "no-store" }); clearTimeout(tm);
        if (!r.ok) continue;
        const j = await r.json();
        if (!Array.isArray(j.plugins) || !j.plugins.length) continue;
        modules = j.plugins; modulesMeta = { live: true, date: j.generated || "" };
        window.FLB_MODULES = Object.assign({}, window.FLB_MODULES, { plugins: j.plugins, generated: j.generated });
        renderModules();
        return;
      } catch (_) { /* next mirror */ }
    }
  }

  // ------------------------------------------------------------------ gallery lightbox
  const lb = $("[data-lightbox]"); const lbImg = $("img", lb); const lbCap = $(".lightbox-cap", lb);
  let lbIndex = 0;
  const showLb = (i) => {
    const gal = t("gallery"); lbIndex = (i + gal.length) % gal.length; const g = gal[lbIndex];
    lbImg.src = "assets/shots/" + g.src; lbImg.alt = g.cap; lbCap.textContent = `${lbIndex + 1} / ${gal.length} · ${g.cap}`; lb.hidden = false;
  };
  $("[data-gallery]").addEventListener("click", (e) => {
    const fig = e.target.closest("figure[data-shot]"); if (!fig) return;
    showLb(Number(fig.dataset.shot));
  });
  const closeLb = () => { lb.hidden = true; lbImg.src = ""; };
  $("[data-lightbox-close]").addEventListener("click", closeLb);
  $$("[data-lightbox-step]").forEach((b) => b.addEventListener("click", () => showLb(lbIndex + Number(b.dataset.lightboxStep))));
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowRight") showLb(lbIndex + 1);
    if (e.key === "ArrowLeft") showLb(lbIndex - 1);
  });

  // ------------------------------------------------------------------ demo
  const root = $("#demo-root"); const stage = $("[data-demo-stage]");
  let demo = null;
  if (root && window.FLBridgeDemo) {
    demo = new window.FLBridgeDemo(root);
    window.flbDemo = demo; // handy in DevTools and for tools/check_site.py
    // Fit the frame into the stage on narrow screens: the frame has a fixed width (640 × scale).
    const fit = () => {
      const k = Number(getComputedStyle(root).getPropertyValue("--k")) || 1;
      const w = 640 * k; const avail = stage.clientWidth;
      const z = avail < w ? avail / w : 1;
      root.style.transformOrigin = "top left"; root.style.transform = z < 1 ? `scale(${z})` : "";
      stage.style.height = z < 1 ? root.offsetHeight * z + "px" : "";
    };
    new ResizeObserver(fit).observe(stage);
    new ResizeObserver(fit).observe(root);
    window.addEventListener("flb-demo-theme", fit);
    // Keyboard: Ctrl+F reaches the frame once it has been clicked. (Focusing on hover stole the
    // focus back from the palette's input: boundary events fire again when the overlay appears
    // under a resting pointer.)
    root.addEventListener("pointerdown", () => { if (!root.contains(document.activeElement)) root.focus({ preventScroll: true }); });
  }
  let tour = null;
  if (demo && window.FLBTour) {
    tour = new window.FLBTour({ demo, wrap: $(".demo-wrap"), getLang: () => lang });
    window.flbTour = tour;
  }
  // "See it in the demo" (features, hero badge): scroll to the frame and start the tour there.
  document.addEventListener("click", (e) => {
    const go = e.target.closest("[data-tour-go]"); if (!go || !tour) return;
    e.preventDefault(); tour.start(go.dataset.tourGo);
  });

  // ------------------------------------------------------------------ page motion
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Scroll-reveal: blocks fade up as they enter the viewport, staggered among siblings.
  const revealIO = ("IntersectionObserver" in window) && !reduceMotion
    ? new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); revealIO.unobserve(en.target); } }), { rootMargin: "0px 0px -6% 0px", threshold: 0.06 })
    : null;
  function setupReveal() {
    const sel = ".section-head, .card, .feature, .compat > div, .gallery figure, .faq details, .dl-foot > div, .stats li, .demo-side-card, .tour-toc, .modules-tools, .table-wrap";
    $$(sel).forEach((el) => {
      if (el.classList.contains("reveal")) return;
      const sibs = Array.from(el.parentElement.children);
      el.style.setProperty("--d", (sibs.indexOf(el) % 6) * 70 + "ms");
      el.classList.add("reveal");
      if (revealIO) revealIO.observe(el); else el.classList.add("in");
    });
  }

  // Hero numbers count up once when they come into view.
  (function countUp() {
    const bs = $$(".stats b"); if (!bs.length || reduceMotion || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (!en.isIntersecting) return; io.unobserve(en.target);
      const node = en.target.firstChild; const end = parseInt(node && node.textContent, 10); if (!end) return;
      const t0 = performance.now(); const dur = 900 + end * 2;
      const step = (now) => { const x = Math.min(1, (now - t0) / dur); node.textContent = String(Math.round(end * (1 - Math.pow(1 - x, 3)))); if (x < 1) requestAnimationFrame(step); };
      node.textContent = "0"; requestAnimationFrame(step);
    }), { threshold: 0.6 });
    bs.forEach((b) => io.observe(b));
  })();

  // Hero screenshot tilts toward the pointer, with a sheen that follows it.
  (function tilt() {
    const vis = $(".hero-visual"); const card = $(".shot-card");
    if (!vis || !card || reduceMotion || matchMedia("(hover: none)").matches) return;
    vis.addEventListener("pointermove", (e) => {
      const r = vis.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - 0.5; const y = (e.clientY - r.top) / r.height - 0.5;
      card.classList.add("tilting");
      card.style.transform = `perspective(1400px) rotateY(${(x * 10).toFixed(2)}deg) rotateX(${(-y * 8).toFixed(2)}deg)`;
      card.style.setProperty("--mx", ((x + 0.5) * 100).toFixed(1) + "%"); card.style.setProperty("--my", ((y + 0.5) * 100).toFixed(1) + "%");
    });
    vis.addEventListener("pointerleave", () => { card.classList.remove("tilting"); card.style.transform = ""; });
  })();

  // Scroll progress: `--scroll` on the header drives the hairline under it (style.css `.top::after`).
  (function progress() {
    const top = $(".top"); if (!top) return;
    let raf = 0;
    const upd = () => { raf = 0; const max = document.documentElement.scrollHeight - innerHeight; top.style.setProperty("--scroll", max > 0 ? Math.min(1, scrollY / max).toFixed(4) : "0"); };
    addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(upd); }, { passive: true });
    addEventListener("resize", upd); upd();
  })();

  // Scrollspy: the nav link of the section in view is lit.
  (function scrollspy() {
    const links = $$('.nav a[href^="#"]'); if (!links.length || !("IntersectionObserver" in window)) return;
    const byId = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
    const io = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (!en.isIntersecting) return; const a = byId.get(en.target.id); if (!a) return;
      links.forEach((l) => l.classList.toggle("active", l === a));
    }), { rootMargin: "-35% 0px -55% 0px", threshold: 0 });
    byId.forEach((a, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
  })();

  // Copy-to-clipboard with a page toast.
  const pageToast = $("[data-page-toast]"); let toastT = 0;
  function toast(msg) { if (!pageToast) return; pageToast.textContent = msg; pageToast.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => { pageToast.hidden = true; }, 1800); }
  document.addEventListener("click", async (e) => {
    const b = e.target.closest("[data-copy]"); if (!b) return;
    try { await navigator.clipboard.writeText(b.dataset.copy); toast(t("contact_copied")); }
    catch (_) { toast(b.dataset.copy); }
  });

  // ------------------------------------------------------------------ go
  applyI18n();
  refreshManifest();
})();
