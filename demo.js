/*  demo.js — a working model of the FL Bridge frame for the browser.

    What is real here: the layout and metrics of the frame (header 46, cells 56, macro strip 44,
    tabs 30, status 28 at 100 %), the palette, the logo geometry (UiLogo.h, fractions of a square),
    the behaviours — slot/preset cells, Ctrl+F palette with refusal tags and `install` rows,
    macro knobs with learn-by-touch and a Matrix tab, A (auto gain) / B (bypass), settings
    (accent, scale, auto gain mode and limit, macro position, default state), the MODULES panel
    with download/installed/reinstall/remove and `install N missing`, the About panel.

    What is a stand-in: the native FL module window. In the plugin it is Image-Line's own HWND
    drawn by their DLL; here it is a generic panel with the module's name and a few knobs so that
    learn-by-touch has something to touch. The meter runs on a synthetic signal.

    The plugin's interface is English only; so is this model, whatever language the page is in.
*/
(function () {
  "use strict";

  // ------------------------------------------------------------------ logo (UiLogo.h geometry)
  const SWATCHES = [
    ["Coral", "#f2542d"], ["Amber", "#f5a524"], ["Lime", "#a3e635"], ["Mint", "#34d399"],
    ["Ice", "#38bdf8"], ["Indigo", "#818cf8"], ["Orchid", "#e879f9"], ["Ash", "#b8b8c0"],
  ];

  function logoGeometry(S) {
    const baseY = S * 0.74;
    return {
      S, baseY,
      left: [S * 0.18, baseY], right: [S * 0.82, baseY], cx: S * 0.5, cy: baseY,
      rx: S * 0.32, ry: S * 0.46, nodeR: S * 0.09,
      strokeW: Math.max(1, S * 0.085), baseW: Math.max(1, S * 0.05),
      baseLeft: S * 0.04, baseRight: S * 0.96,
    };
  }
  function arcPoint(g, t) {
    const a = Math.PI * (1 - Math.max(0, Math.min(1, t)));
    return [g.cx + g.rx * Math.cos(a), g.cy - g.ry * Math.sin(a)];
  }
  /** SVG markup of the mark. `live` paints the arc in the accent, otherwise muted. */
  function logoSVG(S, opts) {
    const o = Object.assign({ live: false, arc: null, nodes: null, base: null, pulse: false, glow: false }, opts);
    const g = logoGeometry(S);
    const arc = o.arc || (o.live ? "var(--acc, var(--accent))" : "#4a4a55");
    const nodes = o.nodes || (o.live ? "#e9e7e4" : "#8a8a90");
    const base = o.base || "#33333c";
    const glow = o.glow || o.live
      ? `<path d="M${g.left[0]} ${g.left[1]} A${g.rx} ${g.ry} 0 0 1 ${g.right[0]} ${g.right[1]}" fill="none" stroke="${arc}" stroke-opacity=".18" stroke-width="${g.strokeW * 2.8}" stroke-linecap="round"/>`
      : "";
    const pulse = o.pulse
      ? `<circle class="pulse-halo" r="${g.nodeR * 2.2}" fill="#e9e7e4" fill-opacity="0" cx="${g.left[0]}" cy="${g.left[1]}"/><circle class="pulse" r="${g.nodeR * 0.95}" fill="#e9e7e4" fill-opacity="0" cx="${g.left[0]}" cy="${g.left[1]}"/>`
      : "";
    return `<svg viewBox="0 0 ${S} ${S}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="${g.baseLeft}" y="${g.baseY - g.baseW / 2}" width="${g.baseRight - g.baseLeft}" height="${g.baseW}" rx="${g.baseW / 2}" fill="${base}"/>
      ${glow}
      <path class="arc" d="M${g.left[0]} ${g.left[1]} A${g.rx} ${g.ry} 0 0 1 ${g.right[0]} ${g.right[1]}" fill="none" stroke="${arc}" stroke-width="${g.strokeW}" stroke-linecap="round"/>
      <circle cx="${g.left[0]}" cy="${g.left[1]}" r="${g.nodeR}" fill="${nodes}"/>
      <circle cx="${g.right[0]}" cy="${g.right[1]}" r="${g.nodeR}" fill="${nodes}"/>
      ${pulse}
    </svg>`;
  }
  window.FLB_LOGO = { svg: logoSVG, geometry: logoGeometry, arcPoint, SWATCHES };

  // ------------------------------------------------------------------ catalogue
  const REFUSED = { "FL Studio Mobile Rack FX": "hangs", "FL Studio Mobile": "needs FL runtime", "FL Studio Mobile Rack": "needs FL runtime", "Sakura": "hangs on knobs", "Sytrus": "unstable" };
  const DEMO_LOCKED = new Set(["Maximus", "Gross Beat", "Vocodex", "Hardcore", "Pitcher", "Newtone", "Newtime", "Luxeverb", "Transient Processor"]);
  // A machine without FL Studio where a handful of modules were already downloaded.
  const PREINSTALLED = new Set(["Fruity Soft Clipper", "Fruity Fast Dist", "Fruity Reeverb 2", "Fruity Love Philter", "Fruity Parametric EQ 2", "Fruity Limiter", "Fruity Delay 3", "Fruity Compressor", "Gross Beat", "Fruity Chorus", "Fruity Phaser", "Fruity Stereo Enhancer"]);
  const PARAMS = {
    "Fruity Soft Clipper": ["Threshold", "Post gain"],
    "Fruity Fast Dist": ["Pre", "Threshold", "Type", "Mix", "Post"],
    "Fruity Reeverb 2": ["Low cut", "High cut", "Predelay", "Room size", "Diffusion", "Decay", "Damping", "Bass", "Dry", "Wet"],
    "Fruity Love Philter": ["Cutoff", "Reso", "Env", "LFO rate", "LFO amt", "Mix"],
    "Fruity Parametric EQ 2": ["Band 1", "Band 2", "Band 3", "Band 4", "Band 5", "Band 6", "Band 7", "Gain"],
    "Fruity Limiter": ["Gain", "Sat", "Ceiling", "Attack", "Release", "Sustain"],
    "Fruity Delay 3": ["Time", "Feedback", "Stereo", "Smoothing", "Low cut", "High cut", "Dry", "Wet"],
    "Fruity Compressor": ["Threshold", "Ratio", "Gain", "Attack", "Release", "Type"],
    "Gross Beat": ["Time", "Volume", "Smoothing", "Hold", "Mix"],
  };
  const POOL = ["Drive", "Mix", "Tone", "Rate", "Depth", "Feedback", "Low", "High", "Width", "Gain", "Freq", "Q", "Attack", "Release", "Size", "Damp"];
  function paramsFor(name) {
    if (PARAMS[name]) return PARAMS[name];
    let h = 0; for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    const n = 3 + (h % 5); const out = [];
    for (let i = 0; i < n; i++) out.push(POOL[(h + i * 7) % POOL.length]);
    return out;
  }
  function presetsFor(name) {
    let h = 0; for (const c of name) h = (h * 17 + c.charCodeAt(0)) >>> 0;
    const pool = ["Default", "Gentle", "Warm", "Bright", "Crunch", "Wide", "Tight", "Dub", "Vintage", "Pump", "Air", "Deep"];
    const n = 3 + (h % 6); const out = [];
    for (let i = 0; i < n; i++) out.push(pool[(h + i * 5) % pool.length]);
    return out;
  }
  function fmtMB(bytes) { return (bytes / 1048576).toFixed(bytes > 10485760 ? 0 : 1) + " MB"; }
  function esc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

  // ------------------------------------------------------------------ the frame
  class FLBridgeDemo {
    constructor(root) {
      this.root = root;
      const data = (window.FLB_MODULES && window.FLB_MODULES.plugins) || [];
      const effects = data.filter((p) => p.kind === "effect");
      this.catalog = effects.map((p) => ({
        id: p.id, name: p.name, size: p.size, unpacked: p.unpacked,
        installed: PREINSTALLED.has(p.name), refused: REFUSED[p.name] || null, demo: DEMO_LOCKED.has(p.name),
      }));
      if (!this.catalog.length) {
        this.catalog = Object.keys(PARAMS).map((n, i) => ({ id: "effect-" + i, name: n, size: 1e6, unpacked: 2e6, installed: true, refused: null, demo: DEMO_LOCKED.has(n) }));
      }
      this.state = {
        current: -1, loading: null, presetIdx: 0, bypass: false,
        autoGain: { mode: "auto", limit: 12, correction: 0 },
        macros: [1, 2, 3, 4].map((i) => ({ name: "Macro " + i, value: [0.5, 0.25, 0.75, 0.0][i - 1], links: [] })),
        learning: -1, tab: "module", overlay: null, query: "", cursor: 0, modFilter: "all", modQuery: "",
        settings: { accent: 0, scale: 100, macros: "top", previewButton: false, defaultState: null },
        status: { msg: "no plugin picked · output is silent", cls: "", right: "", rightCls: "" },
        faux: {},            // param values of the faux module window
        downloads: new Map(), // id -> progress 0..1
        toast: null,
      };
      this.meter = { l: 0, r: 0, pl: 0, pr: 0, lufs: -70, ghost: -70, clip: false, t: 0 };
      this.pulse = { active: false, start: 0, next: performance.now() + 900 };
      this._bind();
      this.applyTheme();
      this.render();
      this._raf = requestAnimationFrame((t) => this.tick(t));
    }

    // ---------------------------------------------------------------- helpers
    get cur() { return this.state.current >= 0 ? this.catalog[this.state.current] : null; }
    get live() { return !!this.cur && !this.state.loading && !this.cur.refused; }
    setStatus(msg, cls, right, rightCls) {
      this.state.status = { msg, cls: cls || "", right: right || "", rightCls: rightCls || "" };
      const el = this.root.querySelector(".flb-status .msg"); if (el) { el.textContent = msg; el.className = "msg " + (cls || ""); }
      const r = this.root.querySelector(".flb-status .right"); if (r) { r.textContent = right || ""; r.className = "right " + (rightCls || ""); }
    }
    toast(msg) {
      this.state.toast = msg; this.render();
      clearTimeout(this._toastT);
      this._toastT = setTimeout(() => { this.state.toast = null; this.render(); }, 1800);
    }
    applyTheme() {
      const s = this.state.settings;
      this.root.style.setProperty("--acc", SWATCHES[s.accent][1]);
      this.root.style.setProperty("--k", String(s.scale / 100));
      this.root.dataset.macros = s.macros;
    }

    // ---------------------------------------------------------------- actions
    choose(i) {
      const m = this.catalog[i];
      if (!m) return;
      if (m.refused) { this.setStatus(`${m.name} is switched off: ${m.refused}`, "bad"); this.state.overlay = null; this.render(); return; }
      if (!m.installed) { this.download(m.id, true); return; }
      this.state.overlay = null;
      this.state.loading = m.name; this.state.current = i; this.state.presetIdx = 0;
      this.state.macros.forEach((mc) => (mc.links = []));
      this.state.faux = {};
      this.setStatus("loading " + m.name, "");
      this.render();
      clearTimeout(this._loadT);
      this._loadT = setTimeout(() => {
        this.state.loading = null;
        const n = paramsFor(m.name).length;
        this.pulse.next = performance.now() + 900; this.pulse.active = false;
        this.setStatus(`${m.name} · ${n} params · sandbox pid ${4000 + i * 7}`, "", m.demo ? "demo: locked outside FL Studio" : "", m.demo ? "bad" : "");
        this.render();
      }, 450 + Math.random() * 300);
    }
    clearSlot() { this.state.current = -1; this.state.loading = null; this.setStatus("no plugin picked · output is silent"); this.render(); }
    download(id, thenChoose) {
      const m = this.catalog.find((x) => x.id === id);
      if (!m || m.installed || this.state.downloads.has(id)) return;
      this.state.downloads.set(id, 0);
      this.render();
      const total = Math.max(600, Math.min(2600, m.size / 4000));
      const t0 = performance.now();
      const step = () => {
        const p = Math.min(1, (performance.now() - t0) / total);
        this.state.downloads.set(id, p);
        this.root.querySelectorAll(`[data-prog="${id}"]`).forEach((el) => (el.style.width = Math.round(p * 100) + "%"));
        this.root.querySelectorAll(`[data-progtxt="${id}"]`).forEach((el) => (el.textContent = Math.round(p * 100) + " %"));
        if (p < 1) { requestAnimationFrame(step); return; }
        this.state.downloads.delete(id);
        m.installed = true; m.ours = true;
        this.render();
        if (thenChoose) this.choose(this.catalog.indexOf(m));
      };
      requestAnimationFrame(step);
    }
    remove(id) {
      const m = this.catalog.find((x) => x.id === id);
      if (!m) return;
      m.installed = false; m.ours = false;
      if (this.cur === m) this.clearSlot();
      this.render();
    }
    installMissing() {
      this.visibleModules().filter((m) => !m.installed && !this.state.downloads.has(m.id)).forEach((m, i) => setTimeout(() => this.download(m.id), i * 120));
    }
    visibleModules() {
      const q = this.state.modQuery.toLowerCase();
      return this.catalog.filter((m) => (this.state.modFilter === "all" || (this.state.modFilter === "installed") === m.installed) && (!q || m.name.toLowerCase().includes(q)));
    }
    filtered() {
      const q = this.state.query.toLowerCase();
      return this.catalog.map((m, i) => ({ m, i })).filter(({ m }) => !q || m.name.toLowerCase().includes(q));
    }
    link(macroIdx, param) {
      const mc = this.state.macros[macroIdx];
      if (!mc.links.some((l) => l.param === param)) mc.links.push({ param, mode: "uni", min: 0, max: 100, curve: 0 });
      this.state.learning = -1; this.root.classList.remove("learn-on");
      this.setStatus(`${mc.name} → ${param}`, "acc");
      this.render();
    }
    savePreset() {
      const m = this.cur; if (!m) return;
      const name = `My ${presetsFor(m.name)[0]} ${Math.floor(Math.random() * 90 + 10)}`;
      (this._userPresets ||= {})[m.name] = [...(this._userPresets[m.name] || []), name];
      this.state.presetIdx = presetsFor(m.name).length + this._userPresets[m.name].length - 1;
      this.toast(`saved · Documents\\Image-Line\\FL Studio\\Presets\\…\\${m.name}\\${name}.fst`);
    }
    presetList() { const m = this.cur; if (!m) return []; return [...presetsFor(m.name).map((p) => ({ p, factory: true })), ...((this._userPresets && this._userPresets[m.name]) || []).map((p) => ({ p, factory: false }))]; }

    // ---------------------------------------------------------------- meter + logo animation
    tick(t) {
      this._raf = requestAnimationFrame((tt) => this.tick(tt));
      const live = this.live && !this.state.bypass;
      const m = this.meter;
      // Synthetic programme: a 120 BPM pulse with a bit of noise. Macro 1 acts as "drive".
      const beat = (t / 500) % 1;
      const drive = this.state.macros[0].value;
      let dbL = -60, dbR = -60;
      if (live) {
        const env = Math.exp(-beat * 6) * 0.9 + 0.1 + Math.sin(t / 230) * 0.06;
        const raw = -22 + 16 * env + 10 * drive + (Math.random() - 0.5) * 1.5;
        dbL = raw; dbR = raw - 1.2 + Math.sin(t / 700) * 1.5;
      }
      const decay = 26 / 60; // dB per frame at 60 Hz
      m.l = Math.max(dbL, m.l - decay); m.r = Math.max(dbR, m.r - decay);
      m.pl = dbL > m.pl ? dbL : m.pl - 0.08; m.pr = dbR > m.pr ? dbR : m.pr - 0.08;
      const rawL = Math.max(m.l, m.r) - 6; // very rough "loudness"
      m.ghost += (rawL - m.ghost) * 0.05;
      const ag = this.state.autoGain;
      let corr = 0;
      if (live && ag.mode !== "off") {
        const target = -18;
        corr = Math.max(-ag.limit, Math.min(ag.limit, target - m.ghost));
        if (ag.mode === "hold") corr = ag.correction; else ag.correction = corr;
      }
      m.lufs = live ? m.ghost + corr : -70;
      m.clip = live && Math.max(m.l, m.r) + corr > -0.2;
      this._paintMeter(corr);
      // logo pulse: once every 4.2 s for 1.15 s while live (UiLogo.h kRestMs / kSweepMs)
      if (this.live) {
        if (!this.pulse.active && t >= this.pulse.next) { this.pulse.active = true; this.pulse.start = t; }
        if (this.pulse.active) {
          const x = Math.min(1, (t - this.pulse.start) / 1150);
          const tt = x * x * (3 - 2 * x);
          this._paintPulse(tt, Math.min(1, Math.sin(tt * Math.PI) * 1.6));
          if (x >= 1) { this.pulse.active = false; this.pulse.next = t + 4200; this._paintPulse(0, 0); }
        }
      }
    }
    _paintMeter(corr) {
      const root = this.root; const m = this.meter;
      const pct = (db) => Math.max(0, Math.min(100, ((db + 60) / 60) * 100));
      const g = (sel) => root.querySelector(sel);
      const l = g('[data-m="l"]'), r = g('[data-m="r"]');
      if (!l) return;
      l.style.width = pct(m.l + corr) + "%"; r.style.width = pct(m.r + corr) + "%";
      g('[data-m="pl"]').style.left = pct(m.pl + corr) + "%"; g('[data-m="pr"]').style.left = pct(m.pr + corr) + "%";
      const lufs = g('[data-m="lufs"]'); lufs.style.left = pct(m.lufs) + "%"; lufs.style.opacity = m.lufs > -69 ? 1 : 0;
      const ghost = g('[data-m="ghost"]'); const show = this.live && !this.state.bypass && this.state.autoGain.mode !== "off" && Math.abs(corr) > 0.3;
      ghost.style.left = pct(m.ghost) + "%"; ghost.style.opacity = show ? 1 : 0;
      const pk = Math.max(m.pl, m.pr) + corr;
      g('[data-m="peak"]').textContent = pk > -59 ? pk.toFixed(1) + " dB" : "—";
      g('[data-m="lufsn"]').textContent = m.lufs > -69 ? m.lufs.toFixed(1) + " LUFS" : "—";
      g('[data-m="clip"]').classList.toggle("on", m.clip);
      const dot = g(".flb-dot"); if (dot) dot.className = "flb-dot" + (this.live ? " live" : "") + (this.cur && this.cur.refused ? " bad" : "");
    }
    _paintPulse(t, alpha) {
      const svg = this.root.querySelector(".flb-logo svg"); if (!svg) return;
      const g = logoGeometry(30); const [x, y] = arcPoint(g, t);
      const p = svg.querySelector(".pulse"), h = svg.querySelector(".pulse-halo");
      if (!p) return;
      p.setAttribute("cx", x); p.setAttribute("cy", y); p.setAttribute("fill-opacity", alpha);
      h.setAttribute("cx", x); h.setAttribute("cy", y); h.setAttribute("fill-opacity", alpha * 0.35);
    }

    // ---------------------------------------------------------------- rendering
    knobSVG(v, cls) {
      // 270° dial, like MacroKnob: arc from 7 o'clock to 5 o'clock.
      const r = 12, c = 15, start = 135, sweep = 270;
      const pt = (deg) => { const a = (deg * Math.PI) / 180; return [c + r * Math.cos(a), c + r * Math.sin(a)]; };
      const [sx, sy] = pt(start); const [ex, ey] = pt(start + sweep);
      const [vx, vy] = pt(start + sweep * v);
      const large = sweep * v > 180 ? 1 : 0;
      return `<svg viewBox="0 0 30 30" class="${cls || ""}"><path class="track" d="M${sx} ${sy} A${r} ${r} 0 1 1 ${ex} ${ey}" fill="none" stroke-width="2.2" stroke-linecap="round"/>${v > 0.002 ? `<path class="arc" d="M${sx} ${sy} A${r} ${r} 0 ${large} 1 ${vx} ${vy}" fill="none" stroke-width="2.2" stroke-linecap="round"/>` : ""}<circle cx="${vx}" cy="${vy}" r="1.8" fill="#e9e7e4"/></svg>`;
    }
    curveSVG(curve) {
      const pts = [];
      for (let i = 0; i <= 10; i++) { const x = i / 10; const y = curve === 0 ? x : Math.pow(x, Math.exp(curve * 1.4)); pts.push(`${(x * 26 + 1).toFixed(1)},${(13 - y * 12).toFixed(1)}`); }
      return `<svg class="curve" viewBox="0 0 28 14"><path d="M${pts.join(" L")}"/></svg>`;
    }
    icon(name) {
      const I = {
        gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
        fitFrame: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/><rect x="9" y="9" width="6" height="6" rx="1"/></svg>',
        fitModule: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 12h6M12 9v6"/></svg>',
        link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>',
        camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',
      };
      return I[name] || "";
    }

    render() {
      const s = this.state; const m = this.cur;
      const list = this.filtered();
      const keepQuery = s.overlay === "search" ? this.root.querySelector(".flb-search") : null;
      const sel = keepQuery ? [keepQuery.selectionStart, keepQuery.selectionEnd] : null;
      // Re-rendering drops the focused button with the old DOM; without this, Esc after a click
      // in a panel would go to <body> and the panel would not close.
      const hadFocus = this.root.contains(document.activeElement);
      const presets = this.presetList();
      const preset = presets[s.presetIdx] || presets[0];
      const macrosHTML = `<div class="flb-macros">${s.macros.map((mc, i) => `
        <div class="flb-knob ${s.learning === i ? "learning" : ""}" data-macro="${i}">
          <div class="dial ${mc.links.length ? "" : "unlinked"}" data-dial="${i}" data-hint="macro_dial">${this.knobSVG(mc.value, "")}</div>
          <div class="meta" data-learn="${i}" data-hint="macro_learn">
            <div class="name"><span class="link ${mc.links.length ? "" : "none"}">${this.icon("link")}</span><span>${esc(mc.name)}</span></div>
            <div class="pct">${Math.round(mc.value * 100)} %${mc.links.length ? ` · ${mc.links.length}` : ""}</div>
          </div>
        </div>`).join("")}</div>`;

      const moduleArea = (() => {
        if (s.tab === "matrix") {
          const rows = []; s.macros.forEach((mc, mi) => mc.links.forEach((l, li) => rows.push({ mc, mi, l, li })));
          const hue = (i) => `color-mix(in srgb, var(--acc) ${100 - i * 18}%, ${["transparent", "#38bdf8", "#a3e635", "#e879f9"][i]})`;
          return `<div class="flb-matrix"><table><thead><tr><th>macro</th><th>parameter</th><th>mode</th><th>min</th><th>max</th><th>curve</th><th></th></tr></thead><tbody>
            ${rows.length ? rows.map((r) => `<tr><td><span class="sw" style="background:${hue(r.mi)}"></span>${esc(r.mc.name)}</td><td>${esc(r.l.param)}</td><td><span class="mode" data-mode="${r.mi}:${r.li}" data-hint="matrix_mode">${r.l.mode}</span></td><td><span class="drag" data-rng="${r.mi}:${r.li}:min" data-hint="matrix_range">${r.l.min} %</span></td><td><span class="drag" data-rng="${r.mi}:${r.li}:max" data-hint="matrix_range">${r.l.max} %</span></td><td><span class="drag" data-rng="${r.mi}:${r.li}:curve" data-hint="matrix_range">${this.curveSVG(r.l.curve)}</span></td><td><span class="x" data-unlink="${r.mi}:${r.li}" data-hint="matrix_unlink">✕</span></td></tr>`).join("")
              : `<tr><td colspan="7" class="none">no links yet — click a macro label, then a knob in the module window</td></tr>`}
          </tbody></table></div>`;
        }
        if (s.loading) return `<div class="loading"><i></i>loading ${esc(s.loading)}</div>`;
        if (!m) return `<div class="empty">pick a module<br><span class="note">click the EFFECT cell or press <kbd>Ctrl</kbd>+<kbd>F</kbd></span></div>`;
        const params = paramsFor(m.name);
        const linked = new Set(); s.macros.forEach((mc) => mc.links.forEach((l) => linked.add(l.param)));
        return `<div class="flb-faux">
          <div class="bar"><b>${esc(m.name)}</b><span>Image-Line · ${params.length} params · ${preset ? esc(preset.p) : ""}</span></div>
          <div class="knobs">${params.map((p) => { const v = s.faux[p] ?? 0.5; return `<div class="fk ${linked.has(p) ? "linked" : ""}" data-fk="${esc(p)}" data-hint="faux_knob">${this.knobSVG(v, "")}<small>${esc(p)}</small></div>`; }).join("")}</div>
          <div class="stamp"><em>stand-in:</em> in the plugin this area is the module's own window, drawn by Image-Line's DLL</div>
        </div>`;
      })();

      const overlay = (() => {
        if (!s.overlay) return "";
        if (s.overlay === "search") {
          const cur = Math.max(0, Math.min(list.length - 1, s.cursor));
          return `<div class="flb-scrim" data-scrim><div class="flb-box">
            <div class="flb-box-head"><span class="cap">effect</span><span class="num">${list.length} / ${this.catalog.length}</span></div>
            <div class="flb-box-body">
              <input class="flb-search" data-search data-hint="search_input" placeholder="type to filter…" value="${esc(s.query)}" autocomplete="off" spellcheck="false">
              <div class="flb-list" data-list>${list.map(({ m: x, i }, k) => {
                const prog = s.downloads.get(x.id);
                const tag = x.refused ? `<span class="tag bad">${esc(x.refused)}</span>` : prog !== undefined ? `<span class="tag">downloading <span data-progtxt="${x.id}">${Math.round(prog * 100)} %</span><span class="prog"><i data-prog="${x.id}" style="width:${Math.round(prog * 100)}%"></i></span></span>` : !x.installed ? `<span class="tag inst">install · ${fmtMB(x.size)}</span>` : x.demo ? `<span class="tag">demo</span>` : "";
                return `<div class="flb-row ${k === cur ? "cur" : ""} ${x.refused ? "off" : ""}" data-pick="${i}" data-k="${k}"><span>${esc(x.name)}</span>${tag}</div>`;
              }).join("") || `<div class="flb-row off"><span>nothing matches</span></div>`}</div>
              <div class="flb-keys"><span><kbd>↑↓</kbd>move</span><span><kbd>enter</kbd>select</span><span><kbd>esc</kbd>close</span></div>
            </div></div></div>`;
        }
        if (s.overlay === "presets") {
          return `<div class="flb-scrim" data-scrim><div class="flb-box">
            <div class="flb-box-head"><span class="cap">preset</span><span class="num">${presets.length}</span></div>
            <div class="flb-box-body"><div class="flb-list">${presets.map((p, k) => `<div class="flb-row ${k === s.presetIdx ? "cur" : ""}" data-preset="${k}"><span>${esc(p.p)}</span><span class="tag">${p.factory ? "factory" : "user"}</span></div>`).join("")}</div>
            <div class="flb-keys"><span><kbd>esc</kbd>close</span></div></div></div></div>`;
        }
        if (s.overlay === "settings") {
          const st = s.settings; const seg = (name, opts, cur) => `<div class="flb-seg">${opts.map((o) => `<button type="button" data-set="${name}" data-v="${o}" class="${String(o) === String(cur) ? "on" : ""}">${o}</button>`).join("")}</div>`;
          return `<div class="flb-scrim" data-scrim><div class="flb-box">
            <div class="flb-box-head"><span class="cap">settings</span><span class="note">%APPDATA%\\FL Bridge\\ui.json · applies to every open copy</span></div>
            <div class="flb-box-body"><div class="flb-rows">
              <div class="flb-setrow"><span class="cap">accent</span><div class="flb-swatches">${SWATCHES.map((sw, i) => `<button type="button" data-set="accent" data-v="${i}" class="${i === st.accent ? "on" : ""}" style="background:${sw[1]}" title="${sw[0]}"></button>`).join("")}</div></div>
              <div class="flb-setrow"><span class="cap">scale</span>${seg("scale", [100, 125, 150, 175], st.scale)}</div>
              <div class="flb-setrow"><span class="cap">auto gain</span>${seg("agmode", ["off", "auto", "hold"], s.autoGain.mode)}</div>
              <div class="flb-setrow"><span class="cap">gain limit</span>${seg("aglimit", [3, 6, 12, 24], s.autoGain.limit)}</div>
              <div class="flb-setrow"><span class="cap">macro position</span>${seg("macros", ["top", "bottom", "side"], st.macros)}</div>
              <div class="flb-setrow"><span class="cap">preview button</span>${seg("preview", ["off", "on"], st.previewButton ? "on" : "off")}</div>
              <div class="flb-setrow"><span class="cap">default state</span><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><span class="note">${st.defaultState ? esc(st.defaultState) : "none"}</span><button type="button" class="flb-chip framed" data-set="default" data-v="save">save</button><button type="button" class="flb-chip framed" data-set="default" data-v="forget">forget</button></div></div>
              <p class="note">The frame rescales at once; the module window follows when its DLL reloads.</p>
            </div></div></div></div>`;
        }
        if (s.overlay === "about") {
          return `<div class="flb-scrim" data-scrim><div class="flb-box">
            <div class="flb-box-head"><span class="cap">about</span></div>
            <div class="flb-box-body"><div class="flb-about">
              <div class="logo">${logoSVG(56, { live: true })}</div>
              <div>
                <h4>FL BRIDGE</h4>
                <div class="num">version 1.0.0 · built 2026-10-03</div>
                <p>VST3 host for native FL Studio plugins. Runs Image-Line's effects and generators inside any VST3 host.</p>
                <div class="links"><button type="button" class="flb-chip framed" data-ext="https://github.com/broscauk/flbridge-modules">module catalogue on GitHub</button><button type="button" class="flb-chip framed" data-toast="C:\\Program Files\\FL Bridge">program folder</button><button type="button" class="flb-chip framed" data-toast="%LOCALAPPDATA%\\FL Bridge — journal.txt, crash.txt, modules-log.txt">logs</button></div>
                <p>FL Studio and its native plugins are products of Image-Line Software. Modules work under your FL Studio license, without one — in demo mode. FL Bridge is an independent product and is not affiliated with Image-Line.</p>
              </div>
            </div></div></div></div>`;
        }
        if (s.overlay === "modules") {
          const vis = this.visibleModules();
          const missing = vis.filter((x) => !x.installed && !s.downloads.has(x.id));
          const missingBytes = missing.reduce((a, x) => a + x.size, 0);
          const ours = this.catalog.filter((x) => x.installed).reduce((a, x) => a + x.unpacked, 0);
          const busy = s.downloads.size > 0;
          return `<div class="flb-scrim" data-scrim><div class="flb-box wide">
            <div class="flb-box-head"><span class="cap">modules</span><span class="num">${this.catalog.filter((x) => x.installed).length} / ${this.catalog.length} · ${fmtMB(ours)}</span></div>
            <div class="flb-box-body">
              <div class="flb-modhead"><input class="flb-search" data-modsearch placeholder="filter…" value="${esc(s.modQuery)}" autocomplete="off"><div class="flb-seg"><button type="button" data-modfilter="all" class="${s.modFilter === "all" ? "on" : ""}">all</button><button type="button" data-modfilter="installed" class="${s.modFilter === "installed" ? "on" : ""}">installed</button></div></div>
              <div class="flb-list" style="max-height:calc(220px * var(--k))">${vis.map((x) => {
                const prog = s.downloads.get(x.id);
                const st = prog !== undefined ? `<button type="button" class="flb-btn" disabled><i data-prog="${x.id}" style="width:${Math.round(prog * 100)}%"></i><span data-progtxt="${x.id}">${Math.round(prog * 100)} %</span></button>`
                  : x.installed ? `<span class="word">installed</span><span class="cmds"><span data-reinstall="${x.id}">reinstall</span>${x.ours !== false ? `<span data-remove="${x.id}">remove</span>` : ""}</span>`
                  : `<button type="button" class="flb-btn" data-dl="${x.id}" data-hint="download"><span>download</span></button>`;
                return `<div class="flb-modrow"><span>${esc(x.name)}</span><span class="kind">effect</span><span class="sz">${fmtMB(x.size)}</span><span class="st">${st}</span></div>`;
              }).join("") || `<div class="flb-modrow"><span class="note">nothing matches</span></div>`}</div>
              <div class="flb-modfoot">${!busy && missing.length ? `<button type="button" class="flb-chip framed" data-installall data-hint="install_all">install ${missing.length} missing · ${fmtMB(missingBytes)}</button>` : busy ? `<span>downloading ${s.downloads.size}…</span>` : `<span>everything on this list is installed</span>`}<span class="spacer"></span><span>github.com/broscauk/flbridge-modules · sha256 verified</span></div>
            </div></div></div>`;
        }
        return "";
      })();

      const macrosPos = s.settings.macros;
      this.root.innerHTML = `
        <div class="flb-header">
          <div class="flb-logo" data-about data-hint="logo">${logoSVG(30, { live: this.live, pulse: true })}</div>
          <div class="flb-title">FL BRIDGE</div>
          <div class="flb-meter" data-hint="meter">
            <div class="bars">
              <div class="bar"><i data-m="l"></i><b data-m="pl"></b></div>
              <div class="bar"><i data-m="r"></i><b data-m="pr"></b></div>
              <span class="lufs" data-m="lufs"></span><span class="lufs ghost" data-m="ghost"></span>
              <div class="scale">${[-48, -36, -24, -12, 0].map((d) => `<i class="${d === 0 ? "zero" : ""}" style="left:${((d + 60) / 60) * 100}%"></i>`).join("")}</div>
            </div>
            <div class="nums"><b data-m="peak">—</b><span data-m="lufsn">—</span></div>
            <span class="clip" data-m="clip" style="grid-column:1/-1"></span>
          </div>
          <button type="button" class="flb-btn ${s.autoGain.mode !== "off" ? "on" : ""}" data-toggle="autogain" data-hint="autogain">A</button>
          <button type="button" class="flb-btn ${s.bypass ? "on" : ""}" data-toggle="bypass" data-hint="bypass">B</button>
          <button type="button" class="flb-btn" data-open="settings" data-hint="settings">${this.icon("gear")}</button>
          <span class="flb-dot ${this.live ? "live" : ""}" data-hint="dot"></span>
        </div>
        <div class="flb-cells">
          <div class="flb-cell" data-open="search" data-hint="slot">
            <div class="lbl"><span class="cap">effect</span><span class="val ${m ? (this.live ? "live" : "") : "empty"}">${m ? esc(m.name) : "pick a module"}</span></div>
            <div class="side">${m ? `<span class="num">${s.current + 1}/${this.catalog.length}</span>` : ""}<span class="chev"></span></div>
          </div>
          <div class="flb-cell" data-open="presets" data-hint="preset">
            <div class="lbl"><span class="cap">preset</span><span class="val ${preset ? "" : "empty"}">${preset ? esc(preset.p) : "—"}</span></div>
            <div class="side"><button type="button" class="flb-mini" data-preset-step="-1" data-hint="preset_step">◀</button><button type="button" class="flb-mini" data-preset-step="1" data-hint="preset_step">▶</button><button type="button" class="flb-mini" data-save-preset data-hint="preset_save">＋</button></div>
          </div>
        </div>
        ${macrosPos === "top" ? macrosHTML : ""}
        <div class="flb-body">
          ${macrosPos === "side" ? macrosHTML : ""}
          <div>
            <div class="flb-tabs">
              <button type="button" class="flb-chip ${s.tab === "module" ? "on" : ""}" data-tab="module" data-hint="tab_module">module</button>
              <button type="button" class="flb-chip ${s.tab === "matrix" ? "on" : ""}" data-tab="matrix" data-hint="tab_matrix">matrix${s.macros.some((x) => x.links.length) ? ` <span class="bdg">${s.macros.reduce((a, x) => a + x.links.length, 0)}</span>` : ""}</button>
              <span class="spacer"></span>
              ${s.settings.previewButton ? `<button type="button" class="flb-btn" data-toast="PREVIEW SAVED · %APPDATA%\\FL Bridge\\previews\\effects\\${m ? esc(m.name) : "…"}.png" data-hint="preview_btn">${this.icon("camera")}</button>` : ""}
              <button type="button" class="flb-btn" data-toast="frame fitted to the module window" data-hint="fit_frame">${this.icon("fitFrame")}</button>
              <button type="button" class="flb-btn" data-toast="module rescaled to fill the frame (step 5 %)" data-hint="fit_module">${this.icon("fitModule")}</button>
            </div>
            <div class="flb-module">${moduleArea}</div>
          </div>
        </div>
        ${macrosPos === "bottom" ? macrosHTML : ""}
        <div class="flb-status">
          <span class="msg ${s.status.cls}" data-hint="status">${esc(s.status.msg)}</span>
          <span class="right ${s.status.rightCls}">${esc(s.status.right)}</span>
          <button type="button" class="flb-chip framed" data-open="modules" data-hint="modules">modules</button>
        </div>
        ${overlay}
        ${s.toast ? `<div class="flb-toast">${esc(s.toast)}</div>` : ""}`;

      if (s.overlay === "search") {
        const inp = this.root.querySelector("[data-search]"); if (inp) { inp.focus(); if (sel) inp.setSelectionRange(sel[0], sel[1]); }
        const cur = this.root.querySelector(".flb-row.cur"); if (cur) cur.scrollIntoView({ block: "nearest" });
      }
      if (hadFocus && !this.root.contains(document.activeElement)) this.root.focus({ preventScroll: true });
      this._paintMeter(this.state.autoGain.mode !== "off" ? this.state.autoGain.correction : 0);
      // The DOM was just replaced; the tour and the hints re-find their targets on this.
      this.root.dispatchEvent(new CustomEvent("flb-demo-render", { bubbles: true }));
    }

    /** Back to the first-open state (used by the guided tour and the "reset" button). */
    reset() {
      const s = this.state;
      clearTimeout(this._loadT);
      s.current = -1; s.loading = null; s.presetIdx = 0; s.bypass = false;
      s.autoGain = { mode: "auto", limit: 12, correction: 0 };
      s.macros.forEach((mc, i) => { mc.value = [0.5, 0.25, 0.75, 0.0][i]; mc.links = []; });
      s.learning = -1; this.root.classList.remove("learn-on");
      s.tab = "module"; s.overlay = null; s.query = ""; s.cursor = 0; s.modFilter = "all"; s.modQuery = "";
      s.settings = { accent: 0, scale: 100, macros: "top", previewButton: false, defaultState: null };
      s.status = { msg: "no plugin picked · output is silent", cls: "", right: "", rightCls: "" };
      s.faux = {}; s.toast = null;
      this.applyTheme(); this.render();
      window.dispatchEvent(new CustomEvent("flb-demo-theme", { detail: { scale: 100, accent: SWATCHES[0][1] } }));
    }
    /** Pick a module by name; returns false if the catalogue has no such effect. */
    pick(name) {
      const i = this.catalog.findIndex((m) => m.name === name);
      if (i < 0) return false;
      this.choose(i); return true;
    }

    // ---------------------------------------------------------------- events
    _bind() {
      const R = this.root; const s = this.state;
      R.addEventListener("click", (e) => {
        const t = e.target.closest("[data-about],[data-open],[data-toggle],[data-tab],[data-pick],[data-preset],[data-preset-step],[data-save-preset],[data-set],[data-learn],[data-fk],[data-mode],[data-unlink],[data-dl],[data-reinstall],[data-remove],[data-installall],[data-modfilter],[data-ext],[data-toast],[data-scrim]");
        if (!t) return;
        const d = t.dataset;
        if (d.scrim !== undefined && t === e.target) { s.overlay = null; this.render(); return; }
        if (d.about !== undefined) { s.overlay = s.overlay === "about" ? null : "about"; this.render(); return; }
        if (d.open) { if (d.open === "presets" && !this.cur) return; s.overlay = d.open; s.cursor = Math.max(0, s.current); if (d.open === "search") s.query = ""; this.render(); return; }
        if (d.toggle === "autogain") { s.autoGain.mode = s.autoGain.mode === "off" ? "auto" : "off"; this.setStatus(`auto gain ${s.autoGain.mode}`, "acc", s.status.right, s.status.rightCls); this.render(); return; }
        if (d.toggle === "bypass") { s.bypass = !s.bypass; this.setStatus(s.bypass ? "bypassed · latency kept" : (this.cur ? this.cur.name : "no plugin picked"), s.bypass ? "" : ""); this.render(); return; }
        if (d.tab) { s.tab = d.tab; this.render(); return; }
        if (d.pick !== undefined) { this.choose(Number(d.pick)); return; }
        if (d.preset !== undefined) { s.presetIdx = Number(d.preset); s.overlay = null; s.faux = {}; this.render(); return; }
        if (d.presetStep) { const n = this.presetList().length; if (!n) return; s.presetIdx = (s.presetIdx + Number(d.presetStep) + n) % n; s.faux = {}; this.render(); return; }
        if (d.savePreset !== undefined) { this.savePreset(); return; }
        if (d.set) { this._applySetting(d.set, d.v); return; }
        if (d.learn !== undefined) {
          const i = Number(d.learn);
          if (!this.live) { this.toast("pick a module first"); return; }
          s.learning = s.learning === i ? -1 : i; R.classList.toggle("learn-on", s.learning >= 0);
          this.setStatus(s.learning >= 0 ? `${s.macros[i].name}: touch a control in the module window · 15 s` : (this.cur ? this.cur.name : ""), s.learning >= 0 ? "acc" : "");
          this.render(); return;
        }
        if (d.fk) { if (s.learning >= 0) this.link(s.learning, d.fk); return; }
        if (d.mode) { const [mi, li] = d.mode.split(":").map(Number); const l = s.macros[mi].links[li]; l.mode = l.mode === "uni" ? "bi" : "uni"; this.render(); return; }
        if (d.unlink) { const [mi, li] = d.unlink.split(":").map(Number); s.macros[mi].links.splice(li, 1); this.render(); return; }
        if (d.dl) { this.download(d.dl); return; }
        if (d.reinstall) { const x = this.catalog.find((y) => y.id === d.reinstall); x.installed = false; this.download(d.reinstall); return; }
        if (d.remove) { this.remove(d.remove); return; }
        if (d.installall !== undefined) { this.installMissing(); return; }
        if (d.modfilter) { s.modFilter = d.modfilter; this.render(); return; }
        if (d.ext) { window.open(d.ext, "_blank", "noopener"); return; }
        if (d.toast) { this.toast(d.toast); return; }
      });
      R.addEventListener("dblclick", (e) => {
        const dial = e.target.closest("[data-dial]"); if (!dial) return;
        s.macros[Number(dial.dataset.dial)].value = 0; this.render();
      });
      R.addEventListener("input", (e) => {
        if (e.target.matches("[data-search]")) { s.query = e.target.value; s.cursor = 0; this.render(); }
        if (e.target.matches("[data-modsearch]")) { s.modQuery = e.target.value; const pos = e.target.selectionStart; this.render(); const inp = R.querySelector("[data-modsearch]"); if (inp) { inp.focus(); inp.setSelectionRange(pos, pos); } }
      });
      R.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f") { e.preventDefault(); s.overlay = "search"; s.query = ""; s.cursor = Math.max(0, s.current); this.render(); return; }
        if (e.key === "Escape" && s.overlay) { s.overlay = null; this.render(); return; }
        if (e.key === "Escape" && s.learning >= 0) { s.learning = -1; R.classList.remove("learn-on"); this.render(); return; }
        if (s.overlay === "search") {
          const list = this.filtered();
          if (e.key === "ArrowDown") { e.preventDefault(); s.cursor = Math.min(list.length - 1, s.cursor + 1); this.render(); }
          if (e.key === "ArrowUp") { e.preventDefault(); s.cursor = Math.max(0, s.cursor - 1); this.render(); }
          if (e.key === "Enter" && list[s.cursor]) { e.preventDefault(); this.choose(list[s.cursor].i); }
        }
      });
      // knob drags: vertical, Shift = fine, like MacroKnob
      let drag = null;
      R.addEventListener("pointerdown", (e) => {
        const dial = e.target.closest("[data-dial]"); const rng = e.target.closest("[data-rng]"); const fk = e.target.closest("[data-fk]");
        if (dial) { const i = Number(dial.dataset.dial); drag = { kind: "macro", i, y: e.clientY, v: s.macros[i].value }; dial.classList.add("held"); dial.setPointerCapture(e.pointerId); }
        else if (rng) { const [mi, li, key] = rng.dataset.rng.split(":"); const l = s.macros[mi].links[li]; drag = { kind: "rng", l, key, y: e.clientY, v: l[key] }; rng.setPointerCapture(e.pointerId); }
        else if (fk && s.learning < 0 && this.live) { const p = fk.dataset.fk; drag = { kind: "fk", p, y: e.clientY, v: s.faux[p] ?? 0.5, moved: false, el: fk }; fk.setPointerCapture(e.pointerId); }
      });
      R.addEventListener("pointermove", (e) => {
        if (!drag) return;
        const dy = (drag.y - e.clientY) * (e.shiftKey ? 0.25 : 1);
        if (drag.kind === "macro") {
          const v = Math.max(0, Math.min(1, drag.v + dy * 0.006)); s.macros[drag.i].value = v;
          const k = R.querySelector(`.flb-knob[data-macro="${drag.i}"]`); if (k) { k.querySelector(".dial").innerHTML = this.knobSVG(v, ""); k.querySelector(".pct").textContent = `${Math.round(v * 100)} %${s.macros[drag.i].links.length ? ` · ${s.macros[drag.i].links.length}` : ""}`; }
          // drive linked faux knobs
          s.macros[drag.i].links.forEach((l) => { const t = l.mode === "uni" ? l.min + (l.max - l.min) * v : 50 + (v - 0.5) * (l.max - l.min); s.faux[l.param] = Math.max(0, Math.min(1, t / 100)); const el = R.querySelector(`[data-fk="${CSS.escape(l.param)}"] svg`); if (el) el.outerHTML = this.knobSVG(s.faux[l.param], ""); });
        } else if (drag.kind === "rng") {
          if (drag.key === "curve") drag.l.curve = Math.max(-1, Math.min(1, drag.v + dy * 0.01));
          else drag.l[drag.key] = Math.round(Math.max(0, Math.min(100, drag.v + dy * 0.4)));
          this._renderMatrixOnly();
        } else if (drag.kind === "fk") {
          if (Math.abs(dy) > 2) drag.moved = true;
          const v = Math.max(0, Math.min(1, drag.v + dy * 0.006)); s.faux[drag.p] = v;
          const svg = drag.el.querySelector("svg"); if (svg) svg.outerHTML = this.knobSVG(v, "");
        }
      });
      const end = () => { if (!drag) return; const d = drag; drag = null; R.querySelectorAll(".dial.held").forEach((x) => x.classList.remove("held")); if (d.kind === "rng") this.render(); };
      R.addEventListener("pointerup", end); R.addEventListener("pointercancel", end);
    }
    _renderMatrixOnly() {
      // Cheap path for range drags: redraw the matrix table only, keep pointer capture alive.
      const s = this.state; const tbl = this.root.querySelector(".flb-matrix tbody"); if (!tbl) return;
      const rows = []; s.macros.forEach((mc, mi) => mc.links.forEach((l, li) => rows.push({ mc, mi, l, li })));
      rows.forEach((r) => {
        const mn = this.root.querySelector(`[data-rng="${r.mi}:${r.li}:min"]`); if (mn) mn.textContent = r.l.min + " %";
        const mx = this.root.querySelector(`[data-rng="${r.mi}:${r.li}:max"]`); if (mx) mx.textContent = r.l.max + " %";
        const cv = this.root.querySelector(`[data-rng="${r.mi}:${r.li}:curve"]`); if (cv) cv.innerHTML = this.curveSVG(r.l.curve);
      });
    }
    _applySetting(name, v) {
      const s = this.state; const st = s.settings;
      if (name === "accent") st.accent = Number(v);
      if (name === "scale") st.scale = Number(v);
      if (name === "agmode") s.autoGain.mode = v;
      if (name === "aglimit") s.autoGain.limit = Number(v);
      if (name === "macros") st.macros = v;
      if (name === "preview") st.previewButton = v === "on";
      if (name === "default") { if (v === "save") { if (!this.cur) { this.toast("pick a module first"); return; } st.defaultState = `${this.cur.name} · ${new Date().toISOString().slice(0, 10)}`; } else st.defaultState = null; }
      this.applyTheme(); this.render();
      if (name === "scale" || name === "accent") window.dispatchEvent(new CustomEvent("flb-demo-theme", { detail: { scale: st.scale, accent: SWATCHES[st.accent][1] } }));
    }
    destroy() { cancelAnimationFrame(this._raf); }
  }

  window.FLBridgeDemo = FLBridgeDemo;
})();
