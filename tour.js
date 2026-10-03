/*  tour.js — hints and the guided tour over the interactive demo.

    Hints: every control of the frame carries `data-hint="key"` (set in demo.js). Hovering or
    focusing one shows a small card with the control's name and what it does in the plugin, in the
    page language. The plugin itself is English; the hints are the site's voice, so they translate.

    Tour: a fixed sequence of steps. Each step points at an element of the frame, drives the demo
    into the state that shows it (opens the palette, loads a module, links a macro…), highlights the
    target and shows a card with Back / Next. Texts live in i18n.js under `tour_steps`, keyed by
    step id, so the order and the actions stay here and the words stay with the other words.
*/
(function () {
  "use strict";

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  async function untilLive(d, ms) {
    const t0 = performance.now();
    while (!d.live && performance.now() - t0 < (ms || 2500)) await sleep(50);
  }
  async function ensureModule(d, name) {
    if (d.live && d.cur && d.cur.name === name) return;
    d.pick(name); await untilLive(d);
  }
  const MODULE = "Fruity Soft Clipper";

  // Steps: id → how to get the frame there and what to point at. `overlay` and `tab` are applied
  // before `before()`; this keeps each step reachable from either neighbour (Back works).
  const STEPS = [
    { id: "welcome", target: ".flb-header", overlay: null, before: (d) => d.reset() },
    { id: "slot", target: '.flb-cell[data-open="search"]', overlay: null },
    { id: "palette", target: ".flb-box", overlay: "search", before: (d) => { d.state.query = "soft"; d.state.cursor = 0; } },
    { id: "module", target: ".flb-module", overlay: null, tab: "module", before: async (d) => { await ensureModule(d, MODULE); } },
    { id: "meter", target: ".flb-meter", overlay: null },
    { id: "autogain", target: '[data-toggle="autogain"]', overlay: null },
    { id: "bypass", target: '[data-toggle="bypass"]', overlay: null },
    { id: "preset", target: '.flb-cell[data-open="presets"]', overlay: null },
    { id: "macros", target: '.flb-knob[data-macro="0"]', overlay: null, tab: "module", before: (d) => { d.state.macros[0].value = 0.6; } },
    { id: "learn", target: '[data-fk="Threshold"], .flb-knob[data-macro="0"]', overlay: null, tab: "module", before: async (d) => { await ensureModule(d, MODULE); if (!d.state.macros[0].links.some((l) => l.param === "Threshold")) d.link(0, "Threshold"); } },
    { id: "matrix", target: ".flb-module", overlay: null, tab: "matrix" },
    { id: "fit", target: '[data-hint="fit_frame"], [data-hint="fit_module"]', overlay: null, tab: "module" },
    { id: "settings", target: ".flb-box", overlay: "settings" },
    { id: "accent", target: ".flb-swatches", overlay: "settings", before: (d) => { d._applySetting("accent", 4); } },
    { id: "modules", target: ".flb-box", overlay: "modules", before: (d) => { d.state.modQuery = ""; d.state.modFilter = "all"; } },
    { id: "installall", target: "[data-installall], .flb-modfoot", overlay: "modules" },
    { id: "status", target: ".flb-status .msg", overlay: null },
    { id: "done", target: ".flb-header", overlay: null },
  ];

  class FLBTour {
    /** @param {{demo: object, wrap: HTMLElement, getLang: () => string}} o */
    constructor(o) {
      this.demo = o.demo; this.root = o.demo.root; this.wrap = o.wrap; this.getLang = o.getLang;
      this.step = -1; this.active = false; this._busy = false;
      this.wrap.classList.add("has-tour");

      this.hint = document.createElement("div"); this.hint.className = "flb-hint"; this.hint.hidden = true;
      this.card = document.createElement("div"); this.card.className = "flb-tour"; this.card.hidden = true;
      this.card.setAttribute("role", "dialog"); this.card.setAttribute("aria-live", "polite");
      this.wrap.append(this.hint, this.card);

      this._bind();
      this.renderToc();
    }

    // ---------------------------------------------------------------- i18n
    T() { const I = window.FLB_I18N; const l = this.getLang(); return (I && (I[l] || I.en)) || {}; }
    t(key) { const T = this.T(); return T[key] !== undefined ? T[key] : (window.FLB_I18N.en[key] !== undefined ? window.FLB_I18N.en[key] : key); }
    stepText(id) { const all = this.t("tour_steps"); const en = window.FLB_I18N.en.tour_steps; return (all && all[id]) || (en && en[id]) || { title: id, text: "" }; }
    hintText(key) { const all = this.t("demo_hints"); const en = window.FLB_I18N.en.demo_hints; return (all && all[key]) || (en && en[key]) || null; }
    setLang() { this.renderToc(); if (this.active) this.renderCard(); if (!this.hint.hidden && this._hintKey) this.showHint(this._hintEl, this._hintKey, true); }

    // ---------------------------------------------------------------- hints
    _bind() {
      const R = this.root;
      let timer = 0;
      const over = (e) => {
        if (this.active) return;
        const el = e.target.closest("[data-hint]"); if (!el || !R.contains(el)) return;
        if (el === this._hintEl && !this.hint.hidden) return;
        clearTimeout(timer);
        timer = setTimeout(() => this.showHint(el, el.dataset.hint), e.type === "focusin" ? 0 : 320);
      };
      const out = (e) => {
        const to = e.relatedTarget;
        if (this._hintEl && to && this._hintEl.contains(to)) return;
        clearTimeout(timer); this.hideHint();
      };
      R.addEventListener("pointerover", over);
      R.addEventListener("pointerout", out);
      R.addEventListener("focusin", over);
      R.addEventListener("focusout", out);
      R.addEventListener("pointerdown", () => { clearTimeout(timer); this.hideHint(); });
      R.addEventListener("flb-demo-render", () => { this.hideHint(); if (this.active) this.place(); });
      window.addEventListener("flb-demo-theme", () => { if (this.active) requestAnimationFrame(() => this.place()); });
      window.addEventListener("resize", () => { if (this.active) this.place(); });

      this.card.addEventListener("click", (e) => {
        const b = e.target.closest("[data-tour-next],[data-tour-back],[data-tour-skip]"); if (!b) return;
        if (b.hasAttribute("data-tour-next")) this.next();
        else if (b.hasAttribute("data-tour-back")) this.back();
        else this.stop();
      });
      document.addEventListener("keydown", (e) => {
        if (!this.active) return;
        const a = document.activeElement; const typing = a && (a.tagName === "INPUT" || a.tagName === "TEXTAREA");
        if (e.key === "Escape") { this.stop(); return; }
        if (typing) return;
        if (e.key === "ArrowRight") { e.preventDefault(); this.next(); }
        if (e.key === "ArrowLeft") { e.preventDefault(); this.back(); }
      });
      this.wrap.addEventListener("click", (e) => {
        const go = e.target.closest("[data-tour-goto]"); if (go) { this.start(go.dataset.tourGoto); return; }
        if (e.target.closest("[data-tour-start]")) { this.start(); return; }
        if (e.target.closest("[data-demo-reset]")) { this.stop(); this.demo.reset(); }
      });
    }
    showHint(el, key, keepPos) {
      const h = this.hintText(key); if (!h) return;
      this._hintEl = el; this._hintKey = key;
      this.hint.innerHTML = `<b>${esc(h[0])}</b><span>${esc(h[1])}</span>`;
      this.hint.hidden = false;
      this._position(this.hint, [el], 8, keepPos);
    }
    hideHint() { this.hint.hidden = true; this._hintEl = null; this._hintKey = null; }

    // ---------------------------------------------------------------- tour
    targets() {
      const st = STEPS[this.step]; if (!st) return [];
      // Several selectors: the first one that matches anything wins (fallbacks), unless both are
      // meant to be shown — then they are joined with a comma inside one selector.
      const els = Array.from(this.root.querySelectorAll(st.target));
      if (els.length > 1 && st.target.includes(", .flb-modfoot") && els.some((e) => e.hasAttribute("data-installall"))) return els.filter((e) => e.hasAttribute("data-installall"));
      return els;
    }
    async start(id) {
      let i = id ? STEPS.findIndex((s) => s.id === id) : 0;
      if (i < 0) i = 0;
      this.active = true; this.hideHint(); this.root.classList.add("touring");
      this.wrap.scrollIntoView({ behavior: "smooth", block: "start" });
      await this.go(i);
    }
    stop() {
      this.active = false; this.step = -1; this.card.hidden = true; this.root.classList.remove("touring");
      this.root.querySelectorAll(".tour-hl").forEach((e) => e.classList.remove("tour-hl"));
      this.renderToc();
    }
    next() { if (this.step >= STEPS.length - 1) { this.stop(); return; } this.go(this.step + 1); }
    back() { if (this.step > 0) this.go(this.step - 1); }
    async go(i) {
      if (this._busy) return; this._busy = true;
      const st = STEPS[i]; const d = this.demo; const s = d.state;
      this.step = i;
      try {
        if (st.tab) s.tab = st.tab;
        if (st.overlay !== undefined) { s.overlay = st.overlay; if (st.overlay === "search") s.query = s.query || ""; }
        if (st.before) await st.before(d);
        d.render();
      } finally { this._busy = false; }
      if (!this.active || this.step !== i) return;
      this.renderCard(); this.renderToc(); this.place();
    }
    renderCard() {
      const st = STEPS[this.step]; if (!st) return;
      const tx = this.stepText(st.id); const n = this.step + 1; const total = STEPS.length; const last = n === total;
      this.card.innerHTML = `
        <div class="flb-tour-head"><span class="step mono">${this.t("tour_step").replace("{n}", n).replace("{total}", total)}</span><button type="button" class="x" data-tour-skip aria-label="${esc(this.t("tour_skip"))}">×</button></div>
        <h4>${esc(tx.title)}</h4>
        <p>${tx.text}</p>
        <div class="flb-tour-bar"><i style="width:${(n / total) * 100}%"></i></div>
        <div class="flb-tour-foot">
          <button type="button" class="btn btn-ghost btn-sm" data-tour-back ${n === 1 ? "disabled" : ""}>${esc(this.t("tour_back"))}</button>
          <span class="keys mono">← →</span>
          <button type="button" class="btn btn-accent btn-sm" data-tour-next>${esc(last ? this.t("tour_finish") : this.t("tour_next"))}</button>
        </div>
        <i class="arrow"></i>`;
      this.card.hidden = false;
    }
    renderToc() {
      const toc = this.wrap.querySelector("[data-tour-toc]"); if (!toc) return;
      toc.innerHTML = STEPS.map((st, i) => { const tx = this.stepText(st.id); return `<li class="${this.active && i === this.step ? "cur" : ""} ${this.active && i < this.step ? "done" : ""}"><button type="button" data-tour-goto="${st.id}"><span class="n mono">${i + 1}</span><span>${esc(tx.title)}</span></button></li>`; }).join("");
      const start = this.wrap.querySelector("[data-tour-start]");
      if (start) start.textContent = this.t(this.active ? "tour_restart" : "tour_start");
    }
    place() {
      if (!this.active) return;
      const els = this.targets();
      this.root.querySelectorAll(".tour-hl").forEach((e) => { if (!els.includes(e)) e.classList.remove("tour-hl"); });
      els.forEach((e) => e.classList.add("tour-hl"));
      if (!els.length) { this.card.style.top = "0px"; this.card.style.left = "0px"; return; }
      this._position(this.card, els, 14);
      // Bring the target into the viewport if the page scrolled away from it.
      const r = els[0].getBoundingClientRect();
      if (r.top < 70 || r.bottom > innerHeight) els[0].scrollIntoView({ behavior: "smooth", block: "center" });
    }
    _position(box, els, gap, keepPos) {
      const wr = this.wrap.getBoundingClientRect();
      const rs = els.map((e) => e.getBoundingClientRect());
      const r = { left: Math.min(...rs.map((x) => x.left)), right: Math.max(...rs.map((x) => x.right)), top: Math.min(...rs.map((x) => x.top)), bottom: Math.max(...rs.map((x) => x.bottom)) };
      const w = box.offsetWidth, h = box.offsetHeight;
      if (keepPos) return;
      const cx = (r.left + r.right) / 2 - wr.left; const cy = (r.top + r.bottom) / 2 - wr.top;
      const clampX = (x) => Math.max(0, Math.min(wr.width - w, Math.round(x)));
      const clampY = (y) => Math.max(0, Math.min(Math.max(0, wr.height - h), Math.round(y)));
      let side = "bottom", top = r.bottom - wr.top + gap, left = clampX(cx - w / 2);
      const fitsBelow = top + h <= wr.height;
      const fitsAbove = r.top - wr.top - gap - h >= 0;
      if (!fitsBelow && fitsAbove) { side = "top"; top = r.top - wr.top - gap - h; }
      else if (!fitsBelow && !fitsAbove) {
        // Tall target (a panel): sit beside it if there is room, else overlap its bottom edge.
        const rightX = r.right - wr.left + gap, leftX = r.left - wr.left - gap - w;
        if (rightX + w <= wr.width) { side = "right"; left = rightX; top = clampY(r.top - wr.top); }
        else if (leftX >= 0) { side = "left"; left = leftX; top = clampY(r.top - wr.top); }
        else { top = clampY(r.bottom - wr.top - h); }
      }
      box.style.top = Math.round(top) + "px"; box.style.left = left + "px"; box.dataset.side = side;
      box.style.setProperty("--ax", Math.max(14, Math.min(w - 14, cx - left)) + "px");
      box.style.setProperty("--ay", Math.max(14, Math.min(h - 14, cy - top)) + "px");
    }
  }

  FLBTour.STEPS = STEPS;
  window.FLBTour = FLBTour;
})();
