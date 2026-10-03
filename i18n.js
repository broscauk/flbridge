/*  i18n.js — every word on the page, in English (primary) and Russian.

    Keys are flat strings; arrays hold repeated blocks (features, FAQ, gallery). `app.js` picks the
    dictionary by `?lang=`, then localStorage, then the browser language, and falls back to English.
    The plugin's own interface is English only (by design), so the interactive demo keeps English
    labels in both languages — that is what the user will see in their DAW.
*/
window.FLB_I18N = {
  en: {
    lang_name: "English",
    title: "FL Bridge — FL Studio's native plugins in any VST3 host",
    meta_desc:
      "FL Bridge runs Image-Line's native FL Studio effects and generators — Fruity Soft Clipper, Fast Dist, Reeverb 2, 3x Osc, Harmor — inside Ableton Live and other VST3 hosts on Windows.",

    // navigation
    nav_features: "Features",
    nav_demo: "Live demo",
    nav_products: "Products",
    nav_modules: "Modules",
    nav_gallery: "Screens",
    nav_download: "Download",
    nav_faq: "FAQ",
    nav_buy: "Buy",

    // hero
    hero_kicker: "VST3 host for native FL Studio plugins · Windows x64 · v1.0.0",
    hero_title: "FL Studio's native plugins.<br>In <em>your</em> DAW.",
    hero_lead:
      "Fruity Soft Clipper, Fast Dist, Reeverb 2, Love Philter, Gross Beat, 3x Osc, Harmor — Image-Line never shipped them as VST. FL Bridge hosts the real FL modules inside a VST3 plugin, so they work in Ableton Live and any other VST3 host, with their own windows, presets and sound.",
    hero_cta_download: "Download 1.0.0",
    hero_cta_demo: "Try the interactive demo",
    hero_note:
      "Free to try with the FL Studio demo modules. The FL modules themselves stay licensed by your FL Studio account.",
    stat_effects: "effects run outside FL",
    stat_gens: "generators pass the full sweep",
    stat_modules: "downloadable modules",
    stat_bundle: "plugin to add — not 140",
    demo_hint:
      "A working model of the plugin frame, built for the browser. Take the guided tour — it drives the frame and explains every control — or hover anything for a hint and play. The native FL module window itself is drawn by Image-Line's DLL and is not reproduced here.",

    // products
    products_kicker: "Three plugins, one installer",
    products_title: "What you get",
    products: [
      {
        name: "FL Bridge",
        tag: "VST3 effect",
        text:
          "One effect module at a time. Pick any of the 89 FL effects inside a single plugin; the choice travels with your project. Macros, auto gain, presets, output meter.",
      },
      {
        name: "FL Bridge Inst",
        tag: "VST3 instrument",
        text:
          "Same frame for the 51 FL generators — 3x Osc, Harmor, Harmless, FLEX, Sytrus, Drumaxx, FPC. Takes MIDI, levels output to −18 LUFS, drops samples into samplers that accept them.",
      },
      {
        name: "FL Rack",
        tag: "VST3 modular rack",
        text:
          "Up to 16 FL effects in one window, wired with cables. Parallel branches with automatic latency alignment, a stereo splitter/merger (L / R / Side / Mid), glowing cables that show level. Everything saves with the set.",
      },
    ],
    products_standalone:
      "Each product also ships as a standalone .exe — double-click and hear it, no DAW needed.",

    // features
    features_kicker: "Built from a thousand measurements, not a checklist",
    features_title: "Features",
    features: [
      {
        icon: "catalogue",
        title: "One bundle, the whole catalogue",
        text:
          "Your DAW sees one plugin, not 140. Inside it you pick the module; the selection, its state and the catalogue position (13/89) are saved with the project. Modules that cannot run outside FL are switched off in the list with the reason written next to them — not left as traps.",
      },
      {
        icon: "sandbox",
        title: "Sandboxed: a process per instance",
        text:
          "Every bridge instance hosts its module in its own flbridge-sandbox.exe. A module that crashes or hangs is caught by a watchdog, reloaded from a state snapshot and keeps playing; three deaths in a row and it is switched off. Your DAW and your unsaved project stay alive.",
      },
      {
        icon: "download",
        title: "Module manager with GitHub delivery",
        text:
          "No FL Studio installed? Open MODULES, download any of the 140 modules (343 MB in total) straight from the catalogue — SHA-256 verified before unpacking, resumable on bad networks, with 'install all missing' for the lot. Prefer offline? A 480 MB all-modules installer and a backup CLI installer are included.",
      },
      {
        icon: "macros",
        title: "Four macros, unlimited targets",
        text:
          "Each macro drives as many module parameters as you like — unipolar or bipolar, with min/max and a curve per link. Learn by touch: drag a knob label onto the module window and move the control. A Matrix tab lists every link like a modulation matrix. Place the strip top, bottom or as a side column.",
      },
      {
        icon: "gain",
        title: "Auto gain that never gets louder than the input",
        text:
          "K-weighted loudness per ITU-R BS.1770 drives an output correction with off / auto / hold modes and a 1–24 dB limit. Native generators differ by 30 dB between them; the Inst frame levels them to −18 LUFS. The meter shows where the loudness would be without the correction.",
      },
      {
        icon: "meter",
        title: "A real output meter",
        text:
          "Two channels, instantaneous attack, 26 dB/s release, peak hold, clip lamp, 12 dB grid and LUFS readout — redrawn at display refresh (60 Hz), ballistics computed on the audio thread.",
      },
      {
        icon: "search",
        title: "Quick search with previews",
        text:
          "Click the slot or press Ctrl+F: type a few letters, see matches, arrows and Enter. The picker shows a snapshot of each module's window next to the list — captured automatically the first time you open the module.",
      },
      {
        icon: "presets",
        title: "Factory and your own .fst presets",
        text:
          "Browse the factory presets of each module and save your own. They are written to the same Documents\\Image-Line folder FL Studio uses, so FL sees them too. A preset from a different module is refused by name, never fed to the wrong plugin.",
      },
      {
        icon: "transport",
        title: "Tempo and position in sync",
        text:
          "BPM goes to the module on change; the song position in quarter notes goes every block — so Love Philter's and Gross Beat's LFOs land on the beat, not just at the right rate.",
      },
      {
        icon: "scale",
        title: "Scales — the frame and the module",
        text:
          "100 / 125 / 150 / 175 % in settings or drag the window corner (up to 200 %). The frame redraws as vectors; the FL module window scales too, by the same mechanism FL Studio uses. Eight accent colours; respects Windows' 'show animations' setting.",
      },
      {
        icon: "keyboard",
        title: "Keyboard goes back to the host",
        text:
          "Native FL windows grab the keyboard on the first click. FL Bridge hands it back to the DAW when the cursor leaves the module — Ableton's computer MIDI keyboard keeps working.",
      },
      {
        icon: "journal",
        title: "Diagnostics that name the culprit",
        text:
          "Every load and window show is journaled before the module is called. If something dies, the journal keeps the module name and the step, a crash.txt records the trace, and the module is switched off with the reason on the next start. 'Forget refusals' brings it back.",
      },
      {
        icon: "default",
        title: "Default state for new instances",
        text:
          "Save your favourite module, preset and settings as the default: every new instance opens ready to play. Project state always wins over the default.",
      },
      {
        icon: "installer",
        title: "One 20 MB installer",
        text:
          "Brings the VC++ runtime if the machine lacks it, installs with the DAW open (the busy bundle is moved aside, not deleted), registers an uninstaller. No Python, no cmake, no FL Studio required.",
      },
    ],

    // compatibility
    compat_kicker: "Measured, not assumed",
    compat_title: "Compatibility",
    compat_intro:
      "Every FL module in FL Studio 2025 was driven through load → window → knobs under live audio → state round-trip, each in its own process. Numbers below are from that sweep.",
    compat_rows: [
      ["Effects", "88 of 89 run outside FL. FL Studio Mobile Rack FX hangs by its own design and is switched off."],
      ["Generators", "44 of 51 pass the full windowed sweep clean. FL Studio Mobile (×2), Sakura and Sytrus are refused with the reason shown; samplers need their content."],
      ["Demo-locked modules", "Maximus, Gross Beat, Vocodex and the other premium modules open and sound, but in FL's demo mode unless your FL Studio license unlocks them. FL Bridge does not bypass the lock."],
      ["Hosts", "VST3 (SDK 3.8). Developed and tested daily in Ableton Live 12; pluginval strict level passes. Other VST3 hosts should work and are not individually verified."],
      ["System", "Windows 10/11 x64. 32-bit FL modules (*_x86.dll) are not supported. No macOS version — FL's native modules are Windows DLLs."],
      ["FL Studio", "Optional. With FL installed, modules and their content (impulses, samples) come from it. Without it, the module manager delivers the modules; sampler content is not included."],
    ],

    // modules
    modules_kicker: "Live from the catalogue",
    modules_title: "140 modules, one click away",
    modules_intro:
      "The list below is read from the public <a href=\"https://github.com/broscauk/flbridge-modules\" target=\"_blank\" rel=\"noopener\">flbridge-modules</a> repository — the same manifest the plugin reads. Modules are Image-Line's files; they run under your FL Studio license, or in demo mode without one.",
    modules_search_ph: "Filter modules…",
    modules_all: "all",
    modules_effects: "effects",
    modules_generators: "generators",
    modules_col_name: "Module",
    modules_col_kind: "Kind",
    modules_col_size: "Download",
    modules_col_unpacked: "On disk",
    modules_col_files: "Files",
    modules_count: "{shown} of {total} modules · {size} compressed",
    modules_live: "live manifest · {date}",
    modules_snapshot: "offline snapshot · {date}",
    kind_effect: "effect",
    kind_generator: "generator",

    // gallery
    gallery_kicker: "Screens",
    gallery_title: "The frame, up close",
    gallery_note:
      "Captured from the real plugin by its own screenshot tool. The native FL module window is a separate Windows child window and is not part of these captures.",
    gallery: [
      { src: "frame.png", cap: "The frame at 150 %: mark, output meter, A/B, slot and preset cells, macro strip, module / matrix tabs." },
      { src: "search-list.png", cap: "Quick search (Ctrl+F) with match count and refusal reasons on the right." },
      { src: "picker-preview.png", cap: "Module picker with a window preview of the highlighted module." },
      { src: "modules.png", cap: "MODULES panel: the GitHub catalogue, installed state, filter chips." },
      { src: "modules-missing.png", cap: "A machine without FL Studio: 'install 140 missing · 343 MB' in one click." },
      { src: "settings.png", cap: "Settings: accent, scale, auto gain mode and limit, macro position, default state." },
      { src: "matrix.png", cap: "Matrix tab — every macro → parameter link with mode, range and curve." },
      { src: "macros-side.png", cap: "Macro strip as a side column, for modules that are wide but short." },
      { src: "about.png", cap: "About: version, build date, catalogue, program folder, logs — and the Image-Line notice." },
      { src: "rack.png", cap: "FL Rack: nodes, cables glowing with level, splitter and merger." },
      { src: "rack-palette.png", cap: "FL Rack: adding a node from the palette." },
      { src: "setup.png", cap: "The installer." },
    ],

    // download
    download_kicker: "Get it",
    download_title: "Download",
    dl_main_title: "FL Bridge 1.0.0 — installer",
    dl_main_text: "FL Bridge, FL Bridge Inst, FL Rack (VST3 + standalone), uninstaller, backup module installer. ~20 MB.",
    dl_modules_title: "All modules — offline installer",
    dl_modules_text: "All 140 FL modules in one package, for machines without FL Studio or without internet. ~480 MB. Not needed if FL Studio is installed or you download modules from inside the plugin.",
    dl_catalogue_title: "Module catalogue",
    dl_catalogue_text: "The public manifest and per-module archives the plugin downloads from.",
    dl_button: "Download",
    dl_button_soon: "Coming soon",
    dl_open: "Open on GitHub",
    dl_req_title: "Requirements",
    dl_req:
      "Windows 10/11 x64 · a VST3 host · FL Studio is optional · the installer brings the VC++ 2015–2022 runtime if missing.",
    dl_install_title: "Install in a minute",
    dl_steps: [
      "Run the installer. With admin rights it installs for everyone into Program Files; without, for you only.",
      "Rescan plugins in your DAW (Ableton: Settings → Plug-Ins → Rescan). If the DAW was open during install, restart it.",
      "Add FL Bridge to a track, click the slot (or Ctrl+F) and pick a module. No FL Studio? Click MODULES and download what you need.",
    ],

    // pricing
    buy_kicker: "License",
    buy_title: "Get FL Bridge",
    buy_price: "Price to be announced",
    buy_lead:
      "One license, all three plugins, all updates of 1.x. The FL modules remain Image-Line's and run under your FL Studio license (demo mode without it).",
    buy_items: [
      "FL Bridge, FL Bridge Inst, FL Rack — VST3 and standalone",
      "Module manager with the full 140-module catalogue",
      "Offline all-modules installer",
      "Updates for the 1.x series",
      "Support by e-mail",
    ],
    buy_button: "Buy",
    buy_soon: "Purchase link coming soon",
    donate_title: "Support the project",
    donate_text:
      "FL Bridge is built by one producer who wanted Fruity Soft Clipper in Ableton. If it saved your day, a coffee keeps the measurements going.",
    donate_button: "Donate",
    donate_soon: "Donation link coming soon",

    // faq
    faq_kicker: "Questions",
    faq_title: "FAQ",
    faq: [
      {
        q: "Do I need FL Studio installed?",
        a: "No. If FL Studio is installed, FL Bridge finds its modules there (plus their content — impulses, samples). If not, open MODULES in the plugin and download the modules you want, or run the offline all-modules installer. Without FL Studio, samplers like FPC or DirectWave have no factory content and Fruity Convolver has no impulses.",
      },
      {
        q: "Do I need an FL Studio license?",
        a: "To use the premium modules unlocked, yes — the modules are Image-Line's and check their own license exactly as inside FL Studio. Without a license they run in demo mode. FL Bridge does not bypass, patch or crack anything; it is a host.",
      },
      {
        q: "Is this legal? Where do the modules come from?",
        a: "The modules are the same files FL Studio installs; they remain Image-Line's property and run under your FL Studio license, exactly as inside FL Studio. FL Bridge is a host: it does not bypass, patch or crack anything. FL Bridge is an independent product and is not affiliated with Image-Line.",
      },
      {
        q: "Which DAWs work?",
        a: "Any VST3 host on Windows. FL Bridge is developed and tested in Ableton Live 12 every day and passes pluginval at the strict level. Reaper, Cubase, Studio One, Bitwig and others load VST3 and should work; we have not verified each of them individually — tell us if something misbehaves.",
      },
      {
        q: "macOS? Linux? 32-bit?",
        a: "No. FL's native modules are Windows x64 DLLs; the bridge loads them in-process (inside its sandbox). There is nothing to load on other systems, and 32-bit modules (*_x86.dll) are not supported.",
      },
      {
        q: "Will a crashing FL module take my DAW down?",
        a: "Not in the VST3 plugins: each instance hosts its module in a separate flbridge-sandbox.exe process. A crash or hang is caught by the watchdog, the module reloads from a state snapshot, and after three deaths in a row it is switched off with the reason in the status line. The journal and crash.txt in %LOCALAPPDATA%\\FL Bridge record what happened.",
      },
      {
        q: "Why are some modules greyed out in the list?",
        a: "They cannot run outside FL Studio by their own design (FL Studio Mobile needs FL's managed runtime) or they hang unpredictably in our sweep (Sytrus, Sakura). We would rather tell you than let a plugin freeze your set. The reason is written next to the name.",
      },
      {
        q: "Does it add latency?",
        a: "The bridge itself adds none beyond what the module reports; the reported latency is passed to the host for compensation. In FL Rack, parallel branches are latency-aligned automatically.",
      },
      {
        q: "Can I automate module parameters from the DAW?",
        a: "Yes. Module parameters are exposed as VST3 parameters (a pool of 64 slots in the effect, 1024 in the instrument), plus four macro knobs that can drive any number of parameters — including those beyond the pool. Macros are automatable too.",
      },
      {
        q: "Where are presets stored?",
        a: "Factory presets come from the module's own folder. Your presets are saved as .fst in Documents\\Image-Line\\FL Studio\\Presets\\Plugin presets\\…, the same place FL Studio uses, so both see them.",
      },
      {
        q: "Modules won't download from inside the plugin.",
        a: "Use the backup installer: 'FL Bridge Modules.cmd' in the program folder downloads with curl/.NET from three mirrors, verifies SHA-256 and installs into the same folder. Still no network? Download manifest.json and the .zip files in a browser and run the .cmd with -From <folder>. Send us %LOCALAPPDATA%\\FL Bridge\\modules-log.txt if nothing helps.",
      },
      {
        q: "How do I uninstall?",
        a: "Programs and Features → FL Bridge → Uninstall, or uninstall.exe in the program folder. The modules package has its own uninstaller and never touches the VST3 folder.",
      },
      {
        q: "Does the module window scale on a 4K display?",
        a: "Yes. The frame scales 100–175 % (up to 200 % by dragging the corner), and the FL module window follows via the same scale key FL Studio itself uses. The module applies its scale when its DLL loads, so a module that keeps its DLL resident until the DAW restarts will pick it up on the next session.",
      },
    ],

    // contact
    contact_kicker: "Contact",
    contact_title: "Talk to a human",
    contact_text:
      "Bugs, questions, licensing, a module that misbehaves — write with the module name and the files from %LOCALAPPDATA%\\FL Bridge.",
    contact_button: "broscaproducer+flbridge@gmail.com",

    // legal / footer
    legal_text:
      "FL Studio and its native plugins are products of Image-Line Software. Modules run under the license of your FL Studio account; without it, in demo mode. FL Bridge is an independent product and is not affiliated with Image-Line. VST is a trademark of Steinberg Media Technologies GmbH.",
    footer_made: "Made in Windows, measured in Ableton.",
    footer_version: "FL Bridge 1.0.0",

    // demo-specific help (site text, not plugin text)
    demo_kicker: "Interactive demo",
    demo_title: "Try the frame right here",
    demo_tips: [
      "Click the EFFECT cell or press Ctrl+F to pick a module.",
      "Drag a macro knob up and down; click its label, then click a knob in the module window to link them.",
      "Press A to toggle auto gain, B to bypass, the gear for settings, the mark for About.",
      "MODULES in the footer opens the catalogue with simulated downloads.",
    ],
    demo_side_kicker: "Guided tour",
    demo_side_text: "Eighteen short steps through the frame: what every control does and why it is there. The demo drives itself; you read.",
    demo_hover: "Or just hover any control — every one of them has a hint.",
    demo_reset: "Reset demo",
    tour_start: "Start the tour",
    tour_restart: "Restart the tour",
    tour_next: "Next",
    tour_back: "Back",
    tour_skip: "Close",
    tour_finish: "Finish",
    tour_step: "{n} / {total}",
    feature_see: "See it in the demo",
    hero_shot_badge: "Try it live",
    contact_copy: "Copy address",
    contact_copied: "Address copied",

    // hints over the demo frame: [name, what it does in the plugin]
    demo_hints: {
      logo: ["Mark", "Pulses once in a while when a module is live. Click for About: version, build date, catalogue, program folder, logs."],
      meter: ["Output meter", "Peak per channel with held peaks, a clip lamp, and a LUFS marker. The grey ghost shows where the loudness would be without auto gain."],
      autogain: ["A — auto gain", "K-weighted loudness drives an output correction, so a module never ends up louder than the input. Off / auto / hold and the limit live in settings."],
      bypass: ["B — bypass", "Passes the signal through. The module's reported latency is kept, so the mix stays in time."],
      settings: ["Settings", "Accent colour, scale, auto gain mode and limit, macro strip position, preview button, default state for new instances."],
      dot: ["State", "Grey — the slot is empty. Accent — the module is live. Red — switched off, with the reason in the status line."],
      slot: ["Module slot", "One plugin, 89 effects. Click or press Ctrl+F to pick; the choice and the module's state save with the project."],
      preset: ["Preset", "Click to browse: the module's factory presets and your own .fst files, in the same folder FL Studio uses."],
      preset_step: ["Previous / next preset", "Step through the list without opening it."],
      preset_save: ["Save preset", "Writes an .fst to Documents\\Image-Line\\FL Studio\\Presets\\… — FL Studio finds it there too."],
      macro_dial: ["Macro knob", "Drag up and down; Shift for fine steps; double-click resets. Drives every parameter linked to it."],
      macro_learn: ["Learn by touch", "Click the label, then a control in the module window — linked. The number after the percent is how many parameters the macro drives."],
      tab_module: ["Module", "The module's own window. In the plugin it is drawn by Image-Line's DLL inside the frame."],
      tab_matrix: ["Matrix", "Every macro → parameter link in one table: mode, range, curve. A modulation matrix for the module."],
      fit_frame: ["Fit frame to module", "Resizes the frame around the module's window at its natural size."],
      fit_module: ["Fit module to frame", "Rescales the module window to fill the frame, in 5 % steps, the way FL Studio scales it."],
      preview_btn: ["Snapshot", "Saves a picture of the module window, shown next to the list in the picker."],
      modules: ["Modules", "The GitHub catalogue: download, reinstall, remove, and 'install all missing'. SHA-256 is verified before unpacking."],
      status: ["Status line", "What is loaded, how many parameters, which sandbox process, refusal reasons, learn prompts. Red is a reason worth reading."],
      faux_knob: ["Module control", "A stand-in for a knob in the module's window. Drag it; while a macro is learning, click it to link."],
      search_input: ["Search", "Type a few letters; arrows and Enter. Tags: install — not downloaded yet, demo — locked without an FL license, red — switched off."],
      matrix_mode: ["Mode", "Unipolar: the macro sweeps min → max. Bipolar: it moves around the centre."],
      matrix_range: ["Range and curve", "Drag up and down to set min, max or the curve of this link."],
      matrix_unlink: ["Unlink", "Removes this link. The parameter keeps its current value."],
      install_all: ["Install all missing", "Downloads every module that is not installed — counting the visible rows only, so a filter narrows it."],
      download: ["Download", "Fetches the archive from GitHub, checks SHA-256, unpacks it into FL Bridge's own module folder. Resumes on bad networks."],
    },

    // guided tour: step id → title and text (order and actions live in tour.js)
    tour_steps: {
      welcome: { title: "This is the plugin frame", text: "Exactly what you see in your DAW: a frame around a native FL Studio module. Eighteen short steps — use the buttons or <kbd>←</kbd> <kbd>→</kbd>. The demo drives itself." },
      slot: { title: "One plugin for 89 effects", text: "Your DAW sees a single plugin. Which FL effect it is, you pick here: click the cell or press <kbd>Ctrl</kbd>+<kbd>F</kbd>. The choice travels with the project." },
      palette: { title: "Quick search", text: "Type a few letters. Tags tell you what will happen: <b>install</b> — not downloaded yet, <b>demo</b> — locked outside FL without a license, a red reason — switched off. Enter picks." },
      module: { title: "The module is live", text: "Fruity Soft Clipper is loaded in its own sandbox process: the mark pulses, the meter moves, the state dot turns to the accent. In the plugin this area is the module's own window, drawn by Image-Line's DLL — here a stand-in with its knobs." },
      meter: { title: "Output meter", text: "Two channels, held peaks, clip lamp, LUFS marker — redrawn at display refresh, ballistics computed on the audio thread. The grey ghost marker shows where the loudness would be without auto gain." },
      autogain: { title: "A — auto gain", text: "K-weighted loudness (ITU-R BS.1770) steers an output correction so a module never gets louder than the input. Click A to toggle; mode and limit are in settings." },
      bypass: { title: "B — bypass", text: "Passes the signal through while keeping the module's reported latency, so the rest of the mix stays aligned." },
      preset: { title: "Presets", text: "The module's factory presets and your own. ◀ ▶ step through, + saves an .fst into the same folder FL Studio uses — FL sees it too." },
      macros: { title: "Four macros", text: "Drag up and down (Shift = fine, double-click = reset). Macro 1 is now at 60 %. Each macro drives any number of module parameters, and the macros are automatable from the DAW." },
      learn: { title: "Learn by touch", text: "Click a macro label, then a control in the module window — linked. We just linked Macro 1 to <b>Threshold</b>: the knob is tinted and follows the macro." },
      matrix: { title: "Matrix", text: "Every link in one table: mode (uni / bi), min, max, curve — drag the numbers. Like a modulation matrix. ✕ unlinks." },
      fit: { title: "Frame ↔ module", text: "Two buttons: fit the frame around the module's window, or rescale the module to fill the frame in 5 % steps." },
      settings: { title: "Settings", text: "Accent colour, scale 100–175 %, auto gain mode and limit, macro strip position, preview button, default state for new instances. Saved once, applies to every open copy." },
      accent: { title: "Eight accents, live", text: "We switched the accent to Ice — the whole frame recolours at once. Try scale or macro position: the frame rebuilds as vectors, nothing blurs." },
      modules: { title: "Module manager", text: "No FL Studio installed? This is the GitHub catalogue: download any module, reinstall, remove. SHA-256 verified before unpacking, resumable on bad networks." },
      installall: { title: "Install all missing", text: "One click fetches everything that is not installed — counting the visible rows only, so a filter narrows it to what you need." },
      status: { title: "Status line", text: "Always says what is going on: module, parameter count, sandbox process, refusal reasons, learn prompts, bypass. Red is a reason you should read." },
      done: { title: "It's yours now", text: "Hover any control for a hint, drag, search, break things — this is a model, nothing to lose. The real plugin is a download away." },
    },
  },

  ru: {
    lang_name: "Русский",
    title: "FL Bridge — нативные плагины FL Studio в любом VST3-хосте",
    meta_desc:
      "FL Bridge запускает нативные эффекты и генераторы FL Studio — Fruity Soft Clipper, Fast Dist, Reeverb 2, 3x Osc, Harmor — внутри Ableton Live и других VST3-хостов на Windows.",

    nav_features: "Возможности",
    nav_demo: "Демо",
    nav_products: "Продукты",
    nav_modules: "Модули",
    nav_gallery: "Экраны",
    nav_download: "Скачать",
    nav_faq: "FAQ",
    nav_buy: "Купить",

    hero_kicker: "VST3-хост нативных плагинов FL Studio · Windows x64 · v1.0.0",
    hero_title: "Нативные плагины FL Studio.<br>В <em>вашей</em> DAW.",
    hero_lead:
      "Fruity Soft Clipper, Fast Dist, Reeverb 2, Love Philter, Gross Beat, 3x Osc, Harmor — Image-Line никогда не выпускала их как VST. FL Bridge хостит настоящие модули FL внутри VST3-плагина: они работают в Ableton Live и любом другом VST3-хосте со своими окнами, пресетами и звуком.",
    hero_cta_download: "Скачать 1.0.0",
    hero_cta_demo: "Интерактивное демо",
    hero_note:
      "Можно попробовать бесплатно с демо-модулями FL Studio. Сами модули FL остаются под лицензией вашего аккаунта FL Studio.",
    stat_effects: "эффектов работают вне FL",
    stat_gens: "генераторов проходят полный обход",
    stat_modules: "модулей для загрузки",
    stat_bundle: "плагин в списке DAW — не 140",
    demo_hint:
      "Рабочая модель рамы плагина, собранная для браузера. Пройдите экскурсию — она сама управляет рамой и объясняет каждый элемент — или наводите курсор на что угодно и играйте. Само окно нативного модуля FL рисует DLL Image-Line — здесь оно не воспроизводится. Интерфейс плагина английский, как и в продукте; подсказки — на вашем языке.",

    products_kicker: "Три плагина, один установщик",
    products_title: "Что внутри",
    products: [
      {
        name: "FL Bridge",
        tag: "VST3-эффект",
        text:
          "Один эффект-модуль за раз. Любой из 89 эффектов FL выбирается внутри одного плагина; выбор уезжает в проект. Макросы, автогромкость, пресеты, индикатор выхода.",
      },
      {
        name: "FL Bridge Inst",
        tag: "VST3-инструмент",
        text:
          "Та же рама для 51 генератора FL — 3x Osc, Harmor, Harmless, FLEX, Sytrus, Drumaxx, FPC. Принимает MIDI, равняет выход к −18 LUFS, принимает сэмплы перетаскиванием в сэмплеры, которые их берут.",
      },
      {
        name: "FL Rack",
        tag: "VST3 модульная стойка",
        text:
          "До 16 эффектов FL в одном окне, соединённых кабелями. Параллельные ветки с автоматическим выравниванием задержки, стерео-сплиттер и мерджер (L / R / Side / Mid), провода, светящиеся по уровню. Всё сохраняется с сетом.",
      },
    ],
    products_standalone:
      "Каждый продукт идёт и как standalone .exe — двойной щелчок, и слышно, без DAW.",

    features_kicker: "Собрано из тысячи замеров, а не из чеклиста",
    features_title: "Возможности",
    features: [
      {
        icon: "catalogue",
        title: "Один бандл — весь каталог",
        text:
          "DAW видит один плагин, а не 140. Модуль выбирается внутри; выбор, его состояние и позиция в каталоге (13/89) сохраняются с проектом. Модули, которые не могут работать вне FL, погашены в списке с написанной рядом причиной — а не оставлены ловушкой.",
      },
      {
        icon: "sandbox",
        title: "Песочница: процесс на экземпляр",
        text:
          "Каждый экземпляр моста держит модуль в своём flbridge-sandbox.exe. Упавший или зависший модуль ловит сторож, поднимает из снимка состояния — и он играет дальше; три смерти подряд — выключен. DAW и несохранённый проект живы.",
      },
      {
        icon: "download",
        title: "Менеджер модулей с доставкой из GitHub",
        text:
          "Нет FL Studio? Откройте MODULES и скачайте любой из 140 модулей (343 МБ всего) прямо из каталога — sha256 сверяется до распаковки, докачка на плохой сети, «install all missing» для всех разом. Нужен офлайн? В комплекте установщик всех модулей на 480 МБ и запасной консольный установщик.",
      },
      {
        icon: "macros",
        title: "Четыре макроса, целей без предела",
        text:
          "Каждая ручка ведёт сколько угодно параметров модуля — униполярно или биполярно, с min/max и кривой у каждой связи. Learn по касанию: бросьте подпись ручки на окно модуля и подвигайте контрол. Вкладка Matrix показывает все связи как матрицу модуляции. Полоса — сверху, снизу или колонкой сбоку.",
      },
      {
        icon: "gain",
        title: "Автогромкость, которая не делает громче входа",
        text:
          "K-взвешенная громкость по ITU-R BS.1770 ведёт поправку выхода: режимы off / auto / hold, предел 1–24 дБ. Нативные генераторы отличаются друг от друга на 30 дБ — рама Inst равняет их к −18 LUFS. Метр показывает, где громкость была бы без поправки.",
      },
      {
        icon: "meter",
        title: "Настоящий индикатор выхода",
        text:
          "Два канала, мгновенная атака, спад 26 дБ/с, удержание пиков, лампа перегруза, сетка по 12 дБ и LUFS — перерисовка по частоте дисплея (60 Гц), баллистика считается в аудиопотоке.",
      },
      {
        icon: "search",
        title: "Быстрый поиск с превью",
        text:
          "Щелчок по слоту или Ctrl+F: несколько букв, совпадения, стрелки и Enter. Пикер показывает рядом со списком снимок окна модуля — снятый автоматически при первом открытии.",
      },
      {
        icon: "presets",
        title: "Заводские и свои пресеты .fst",
        text:
          "Листайте заводские пресеты модуля и сохраняйте свои. Они пишутся в ту же папку Documents\\Image-Line, что и у FL Studio, — FL их тоже видит. Пресет от другого модуля отвергается по имени и никогда не скармливается не тому плагину.",
      },
      {
        icon: "transport",
        title: "Темп и позиция в синхроне",
        text:
          "BPM уходит модулю при изменении; позиция в четвертях — каждый блок. Поэтому LFO Love Philter и Gross Beat попадают в долю, а не просто идут с верной скоростью.",
      },
      {
        icon: "scale",
        title: "Масштаб — и рамы, и модуля",
        text:
          "100 / 125 / 150 / 175 % в настройках или тяните угол окна (до 200 %). Рама перерисовывается векторно; окно модуля FL масштабируется тем же механизмом, что в FL Studio. Восемь цветов акцента; уважает системную настройку «показывать анимацию».",
      },
      {
        icon: "keyboard",
        title: "Клавиатура возвращается хосту",
        text:
          "Нативные окна FL забирают клавиатуру по первому клику. FL Bridge отдаёт её DAW, когда курсор уходит с модуля, — компьютерная MIDI-клавиатура Ableton продолжает работать.",
      },
      {
        icon: "journal",
        title: "Диагностика, которая называет виновника",
        text:
          "Каждая загрузка и показ окна журналируются до вызова модуля. Если что-то упало, в журнале остаются имя модуля и шаг, crash.txt — трасса, а модуль при следующем запуске погашен с причиной. «Forget refusals» возвращает его.",
      },
      {
        icon: "default",
        title: "Состояние по умолчанию",
        text:
          "Сохраните любимый модуль, пресет и настройки как дефолт: каждый новый экземпляр открывается готовым играть. Состояние проекта всегда главнее дефолта.",
      },
      {
        icon: "installer",
        title: "Один установщик на 20 МБ",
        text:
          "Привозит VC++ runtime, если его нет, ставится при открытой DAW (занятый бандл отодвигается, а не удаляется), регистрирует удаление. Ни Python, ни cmake, ни FL Studio не нужны.",
      },
    ],

    compat_kicker: "Измерено, а не предположено",
    compat_title: "Совместимость",
    compat_intro:
      "Каждый модуль FL Studio 2025 прогнан по пути загрузка → окно → ручки под живым звуком → состояние туда-обратно, каждый своим процессом. Числа ниже — из этого обхода.",
    compat_rows: [
      ["Эффекты", "88 из 89 работают вне FL. FL Studio Mobile Rack FX виснет по своему устройству и погашен."],
      ["Генераторы", "44 из 51 проходят полный обход с окном чисто. FL Studio Mobile (×2), Sakura и Sytrus отказаны с показанной причиной; сэмплерам нужен их контент."],
      ["Демо-замкнутые модули", "Maximus, Gross Beat, Vocodex и другие премиальные модули открываются и звучат, но в демо-режиме FL, пока лицензия вашей FL Studio их не разблокирует. FL Bridge замок не обходит."],
      ["Хосты", "VST3 (SDK 3.8). Разрабатывается и проверяется каждый день в Ableton Live 12; pluginval на строгом уровне проходит. Другие VST3-хосты должны работать, но по отдельности не проверены."],
      ["Система", "Windows 10/11 x64. 32-битные модули FL (*_x86.dll) не поддерживаются. Версии для macOS нет — нативные модули FL это Windows-DLL."],
      ["FL Studio", "Не обязательна. С установленной FL модули и их контент (импульсы, сэмплы) берутся из неё. Без неё модули доставляет менеджер; контент сэмплеров в раздачу не входит."],
    ],

    modules_kicker: "Живой каталог",
    modules_title: "140 модулей в один щелчок",
    modules_intro:
      "Список ниже читается из открытого репозитория <a href=\"https://github.com/broscauk/flbridge-modules\" target=\"_blank\" rel=\"noopener\">flbridge-modules</a> — того же манифеста, что читает плагин. Модули — файлы Image-Line; работают по лицензии вашей FL Studio, без неё — в демо-режиме.",
    modules_search_ph: "Фильтр модулей…",
    modules_all: "все",
    modules_effects: "эффекты",
    modules_generators: "генераторы",
    modules_col_name: "Модуль",
    modules_col_kind: "Вид",
    modules_col_size: "Загрузка",
    modules_col_unpacked: "На диске",
    modules_col_files: "Файлов",
    modules_count: "{shown} из {total} модулей · {size} в архивах",
    modules_live: "живой манифест · {date}",
    modules_snapshot: "офлайн-снимок · {date}",
    kind_effect: "эффект",
    kind_generator: "генератор",

    gallery_kicker: "Экраны",
    gallery_title: "Рама вблизи",
    gallery_note:
      "Снято с настоящего плагина его собственной снималкой. Окно нативного модуля FL — отдельное дочернее окно Windows, в эти снимки оно не попадает.",
    gallery: [
      { src: "frame.png", cap: "Рама на 150 %: знак, индикатор выхода, A/B, ячейки слота и пресета, полоса макросов, вкладки module / matrix." },
      { src: "search-list.png", cap: "Быстрый поиск (Ctrl+F) со счётом совпадений и причинами отказа справа." },
      { src: "picker-preview.png", cap: "Пикер модулей с превью окна выделенного модуля." },
      { src: "modules.png", cap: "Панель MODULES: каталог GitHub, состояние установки, чипы фильтра." },
      { src: "modules-missing.png", cap: "Машина без FL Studio: «install 140 missing · 343 MB» одним щелчком." },
      { src: "settings.png", cap: "Настройки: акцент, масштаб, режим и предел автогромкости, место макросов, состояние по умолчанию." },
      { src: "matrix.png", cap: "Вкладка Matrix — каждая связь макрос → параметр с режимом, диапазоном и кривой." },
      { src: "macros-side.png", cap: "Полоса макросов колонкой сбоку — для широких, но низких модулей." },
      { src: "about.png", cap: "About: версия, дата сборки, каталог, папка программ, журналы — и уведомление про Image-Line." },
      { src: "rack.png", cap: "FL Rack: узлы, провода, светящиеся по уровню, сплиттер и мерджер." },
      { src: "rack-palette.png", cap: "FL Rack: добавление узла из палитры." },
      { src: "setup.png", cap: "Установщик." },
    ],

    download_kicker: "Забрать",
    download_title: "Скачать",
    dl_main_title: "FL Bridge 1.0.0 — установщик",
    dl_main_text: "FL Bridge, FL Bridge Inst, FL Rack (VST3 + standalone), удаление, запасной установщик модулей. ~20 МБ.",
    dl_modules_title: "Все модули — офлайн-установщик",
    dl_modules_text: "Все 140 модулей FL одним пакетом — для машин без FL Studio или без интернета. ~480 МБ. Не нужен, если FL Studio установлена или вы качаете модули из плагина.",
    dl_catalogue_title: "Каталог модулей",
    dl_catalogue_text: "Открытый манифест и архивы по модулю, откуда качает плагин.",
    dl_button: "Скачать",
    dl_button_soon: "Скоро",
    dl_open: "Открыть на GitHub",
    dl_req_title: "Требования",
    dl_req:
      "Windows 10/11 x64 · VST3-хост · FL Studio не обязательна · установщик привозит VC++ 2015–2022 runtime, если его нет.",
    dl_install_title: "Установка за минуту",
    dl_steps: [
      "Запустите установщик. С правами администратора — для всех в Program Files; без них — только для вас.",
      "Пересканируйте плагины в DAW (Ableton: Settings → Plug-Ins → Rescan). Если DAW была открыта при установке — перезапустите её.",
      "Добавьте FL Bridge на дорожку, щёлкните слот (или Ctrl+F) и выберите модуль. Нет FL Studio? Нажмите MODULES и скачайте нужное.",
    ],

    buy_kicker: "Лицензия",
    buy_title: "Купить FL Bridge",
    buy_price: "Цена будет объявлена",
    buy_lead:
      "Одна лицензия — все три плагина и все обновления 1.x. Модули FL остаются собственностью Image-Line и работают по лицензии вашей FL Studio (без неё — демо-режим).",
    buy_items: [
      "FL Bridge, FL Bridge Inst, FL Rack — VST3 и standalone",
      "Менеджер модулей с полным каталогом на 140 модулей",
      "Офлайн-установщик всех модулей",
      "Обновления серии 1.x",
      "Поддержка по e-mail",
    ],
    buy_button: "Купить",
    buy_soon: "Ссылка на покупку появится позже",
    donate_title: "Поддержать проект",
    donate_text:
      "FL Bridge делает один продюсер, которому захотелось Fruity Soft Clipper в Ableton. Если он спас ваш день — кофе продолжит замеры.",
    donate_button: "Донат",
    donate_soon: "Ссылка на донат появится позже",

    faq_kicker: "Вопросы",
    faq_title: "FAQ",
    faq: [
      {
        q: "Нужна ли установленная FL Studio?",
        a: "Нет. Если FL Studio установлена, FL Bridge берёт модули из неё (вместе с контентом — импульсами, сэмплами). Если нет — откройте MODULES в плагине и скачайте нужные модули или поставьте офлайн-установщик всех модулей. Без FL Studio у сэмплеров вроде FPC и DirectWave нет заводского контента, а у Fruity Convolver — импульсов.",
      },
      {
        q: "Нужна ли лицензия FL Studio?",
        a: "Чтобы премиальные модули работали без замка — да: модули принадлежат Image-Line и проверяют свою лицензию ровно так же, как внутри FL Studio. Без лицензии они работают в демо-режиме. FL Bridge ничего не обходит, не патчит и не ломает — это хост.",
      },
      {
        q: "Это легально? Откуда модули?",
        a: "Модули — те же файлы, что ставит FL Studio; они остаются собственностью Image-Line и работают по вашей лицензии FL Studio ровно так же, как внутри FL. FL Bridge — хост: ничего не обходит, не патчит и не ломает. FL Bridge — независимый продукт и с Image-Line не аффилирован.",
      },
      {
        q: "В каких DAW работает?",
        a: "В любом VST3-хосте на Windows. FL Bridge разрабатывается и проверяется в Ableton Live 12 каждый день и проходит pluginval на строгом уровне. Reaper, Cubase, Studio One, Bitwig и другие грузят VST3 и должны работать; по отдельности мы их не проверяли — напишите, если что-то ведёт себя не так.",
      },
      {
        q: "macOS? Linux? 32 бита?",
        a: "Нет. Нативные модули FL — это Windows-DLL x64; мост загружает их в процесс (внутри своей песочницы). На других системах загружать нечего, а 32-битные модули (*_x86.dll) не поддерживаются.",
      },
      {
        q: "Падающий модуль FL уронит мою DAW?",
        a: "В VST3-плагинах — нет: каждый экземпляр держит модуль в отдельном процессе flbridge-sandbox.exe. Падение или зависание ловит сторож, модуль поднимается из снимка состояния, а после трёх смертей подряд выключается с причиной в строке состояния. Журнал и crash.txt в %LOCALAPPDATA%\\FL Bridge записывают, что случилось.",
      },
      {
        q: "Почему часть модулей серые в списке?",
        a: "Они не могут работать вне FL Studio по своему устройству (FL Studio Mobile требует managed runtime самой FL) или непредсказуемо виснут в нашем обходе (Sytrus, Sakura). Лучше сказать об этом, чем дать плагину заморозить сет. Причина написана рядом с именем.",
      },
      {
        q: "Добавляет ли задержку?",
        a: "Сам мост — нет, сверх того, что сообщает модуль; сообщённая задержка передаётся хосту для компенсации. В FL Rack параллельные ветки выравниваются по задержке автоматически.",
      },
      {
        q: "Можно автоматизировать параметры модуля из DAW?",
        a: "Да. Параметры модуля объявлены как VST3-параметры (пул из 64 слотов у эффекта, 1024 у инструмента), плюс четыре макро-ручки, которые ведут сколько угодно параметров — включая те, что за пулом. Макросы тоже автоматизируются.",
      },
      {
        q: "Где хранятся пресеты?",
        a: "Заводские — в папке самого модуля. Свои сохраняются как .fst в Documents\\Image-Line\\FL Studio\\Presets\\Plugin presets\\… — там же, где у FL Studio, так что видят их обе.",
      },
      {
        q: "Модули не качаются из плагина.",
        a: "Запасной установщик: «FL Bridge Modules.cmd» в папке программ качает через curl/.NET с трёх зеркал, сверяет sha256 и ставит в ту же папку. Сети нет совсем? Скачайте manifest.json и нужные .zip браузером и запустите .cmd с -From <папка>. Если не помогло — пришлите %LOCALAPPDATA%\\FL Bridge\\modules-log.txt.",
      },
      {
        q: "Как удалить?",
        a: "«Программы и компоненты» → FL Bridge → Удалить, либо uninstall.exe в папке программ. У пакета модулей своё удаление, папку VST3 оно не трогает.",
      },
      {
        q: "Окно модуля масштабируется на 4K?",
        a: "Да. Рама масштабируется 100–175 % (до 200 % перетягиванием угла), окно модуля FL следует за ней тем же ключом масштаба, что использует сама FL Studio. Модуль применяет масштаб при загрузке своей DLL, поэтому модуль, держащий DLL до перезапуска DAW, подхватит его в следующей сессии.",
      },
    ],

    contact_kicker: "Контакт",
    contact_title: "Написать человеку",
    contact_text:
      "Баги, вопросы, лицензии, модуль, который ведёт себя странно, — пишите с именем модуля и файлами из %LOCALAPPDATA%\\FL Bridge.",
    contact_button: "broscaproducer+flbridge@gmail.com",

    legal_text:
      "FL Studio и её нативные плагины — продукты Image-Line Software. Модули работают по лицензии вашего аккаунта FL Studio; без неё — в демо-режиме. FL Bridge — независимый продукт и с Image-Line не аффилирован. VST is a trademark of Steinberg Media Technologies GmbH.",
    footer_made: "Сделано в Windows, измерено в Ableton.",
    footer_version: "FL Bridge 1.0.0",

    demo_kicker: "Интерактивное демо",
    demo_title: "Попробуйте раму прямо здесь",
    demo_tips: [
      "Щёлкните ячейку EFFECT или нажмите Ctrl+F, чтобы выбрать модуль.",
      "Тяните ручку макроса вверх-вниз; щёлкните её подпись, затем ручку в окне модуля — связь создана.",
      "A — автогромкость, B — обход, шестерёнка — настройки, знак — About.",
      "MODULES в подвале открывает каталог с имитацией закачки.",
    ],
    demo_side_kicker: "Экскурсия",
    demo_side_text: "Восемнадцать коротких шагов по раме: что делает каждый элемент и зачем он там. Демо управляет собой само, вы читаете.",
    demo_hover: "Или просто наведите курсор на любой элемент — у каждого есть подсказка.",
    demo_reset: "Сбросить демо",
    tour_start: "Начать экскурсию",
    tour_restart: "Начать заново",
    tour_next: "Дальше",
    tour_back: "Назад",
    tour_skip: "Закрыть",
    tour_finish: "Готово",
    tour_step: "{n} / {total}",
    feature_see: "Показать в демо",
    hero_shot_badge: "Попробовать вживую",
    contact_copy: "Скопировать адрес",
    contact_copied: "Адрес скопирован",

    demo_hints: {
      logo: ["Знак", "Изредка пульсирует, пока модуль живой. Щелчок — About: версия, дата сборки, каталог, папка программ, журналы."],
      meter: ["Выходной метр", "Пик по каналам с удержанием, лампа клипа и метка LUFS. Серая тень показывает, где была бы громкость без автогромкости."],
      autogain: ["A — автогромкость", "K-взвешенная громкость ведёт коррекцию выхода: модуль никогда не становится громче входа. Off / auto / hold и лимит — в настройках."],
      bypass: ["B — обход", "Пропускает сигнал мимо модуля. Заявленная модулем задержка сохраняется, чтобы микс не разъехался."],
      settings: ["Настройки", "Цвет акцента, масштаб, режим и лимит автогромкости, положение полосы макросов, кнопка превью, состояние по умолчанию для новых экземпляров."],
      dot: ["Состояние", "Серая — слот пуст. Акцент — модуль живой. Красная — выключен, причина в строке состояния."],
      slot: ["Слот модуля", "Один плагин, 89 эффектов. Щелчок или Ctrl+F — выбрать; выбор и состояние модуля сохраняются с проектом."],
      preset: ["Пресет", "Щелчок — список: заводские пресеты модуля и ваши .fst, в той же папке, что у FL Studio."],
      preset_step: ["Предыдущий / следующий пресет", "Листать список, не открывая его."],
      preset_save: ["Сохранить пресет", "Пишет .fst в Documents\\Image-Line\\FL Studio\\Presets\\… — FL Studio тоже его увидит."],
      macro_dial: ["Ручка макроса", "Тянуть вверх-вниз; Shift — точно; двойной щелчок — сброс. Ведёт все связанные с ней параметры."],
      macro_learn: ["Обучение касанием", "Щёлкните подпись, затем элемент в окне модуля — связь создана. Число после процентов — сколько параметров ведёт макрос."],
      tab_module: ["Модуль", "Собственное окно модуля. В плагине его рисует DLL Image-Line внутри рамы."],
      tab_matrix: ["Матрица", "Все связи макрос → параметр одной таблицей: режим, диапазон, кривая. Матрица модуляции для модуля."],
      fit_frame: ["Рама по модулю", "Подгоняет раму под окно модуля в его естественном размере."],
      fit_module: ["Модуль по раме", "Масштабирует окно модуля на всю раму шагом 5 % — тем же способом, что FL Studio."],
      preview_btn: ["Снимок", "Сохраняет картинку окна модуля — она показывается рядом со списком в пикере."],
      modules: ["Модули", "Каталог с GitHub: скачать, переустановить, удалить, «install all missing». SHA-256 сверяется до распаковки."],
      status: ["Строка состояния", "Что загружено, сколько параметров, какой процесс песочницы, причины отказов, подсказки обучения. Красное стоит прочитать."],
      faux_knob: ["Элемент модуля", "Заменитель ручки в окне модуля. Тяните; пока макрос учится — щёлкните, чтобы связать."],
      search_input: ["Поиск", "Несколько букв; стрелки и Enter. Теги: install — ещё не скачан, demo — заперт без лицензии FL, красное — выключен."],
      matrix_mode: ["Режим", "Униполярный: макрос проходит min → max. Биполярный: ходит вокруг центра."],
      matrix_range: ["Диапазон и кривая", "Тянуть вверх-вниз, чтобы задать min, max или кривую связи."],
      matrix_unlink: ["Разорвать", "Убирает связь. Параметр остаётся на текущем значении."],
      install_all: ["Поставить всё недостающее", "Качает все неустановленные модули — только среди видимых строк, так что фильтр сужает список."],
      download: ["Скачать", "Берёт архив с GitHub, сверяет SHA-256, распаковывает в собственную папку модулей FL Bridge. Докачивает на плохой сети."],
    },

    tour_steps: {
      welcome: { title: "Это рама плагина", text: "Ровно то, что вы видите в DAW: рама вокруг нативного модуля FL Studio. Восемнадцать коротких шагов — кнопки или <kbd>←</kbd> <kbd>→</kbd>. Демо управляет собой само." },
      slot: { title: "Один плагин на 89 эффектов", text: "DAW видит один плагин. Какой это эффект FL — выбираете здесь: щелчок по ячейке или <kbd>Ctrl</kbd>+<kbd>F</kbd>. Выбор едет вместе с проектом." },
      palette: { title: "Быстрый поиск", text: "Несколько букв. Теги говорят, что будет: <b>install</b> — ещё не скачан, <b>demo</b> — заперт вне FL без лицензии, красная причина — выключен. Enter выбирает." },
      module: { title: "Модуль живой", text: "Fruity Soft Clipper загружен в своём процессе-песочнице: знак пульсирует, метр двигается, точка состояния стала акцентной. В плагине эта область — собственное окно модуля, нарисованное DLL Image-Line; здесь — заменитель с его ручками." },
      meter: { title: "Выходной метр", text: "Два канала, удержание пиков, лампа клипа, метка LUFS — перерисовка с частотой экрана, баллистика считается в аудиопотоке. Серая тень — где была бы громкость без автогромкости." },
      autogain: { title: "A — автогромкость", text: "K-взвешенная громкость (ITU-R BS.1770) ведёт коррекцию выхода: модуль никогда не становится громче входа. Щелчок по A включает и выключает; режим и лимит — в настройках." },
      bypass: { title: "B — обход", text: "Пропускает сигнал мимо, сохраняя заявленную модулем задержку, — остальной микс не разъезжается." },
      preset: { title: "Пресеты", text: "Заводские пресеты модуля и ваши. ◀ ▶ листают, + сохраняет .fst в ту же папку, что у FL Studio, — FL его тоже видит." },
      macros: { title: "Четыре макроса", text: "Тянуть вверх-вниз (Shift — точно, двойной щелчок — сброс). Macro 1 сейчас на 60 %. Каждый макрос ведёт сколько угодно параметров модуля, и сами макросы автоматизируются из DAW." },
      learn: { title: "Обучение касанием", text: "Щёлкните подпись макроса, затем элемент в окне модуля — связь создана. Мы только что связали Macro 1 с <b>Threshold</b>: ручка подсвечена и следует за макросом." },
      matrix: { title: "Матрица", text: "Все связи одной таблицей: режим (uni / bi), min, max, кривая — числа тянутся. Как матрица модуляции. ✕ разрывает." },
      fit: { title: "Рама ↔ модуль", text: "Две кнопки: подогнать раму под окно модуля или растянуть модуль на всю раму шагом 5 %." },
      settings: { title: "Настройки", text: "Цвет акцента, масштаб 100–175 %, режим и лимит автогромкости, положение полосы макросов, кнопка превью, состояние по умолчанию для новых экземпляров. Сохраняется один раз для всех открытых копий." },
      accent: { title: "Восемь акцентов, вживую", text: "Мы переключили акцент на Ice — вся рама перекрасилась сразу. Попробуйте масштаб или положение макросов: рама перестраивается векторами, ничего не мылится." },
      modules: { title: "Менеджер модулей", text: "FL Studio не установлена? Это каталог с GitHub: скачать любой модуль, переустановить, удалить. SHA-256 сверяется до распаковки, на плохой сети докачивается." },
      installall: { title: "Поставить всё недостающее", text: "Один щелчок качает всё неустановленное — только среди видимых строк, так что фильтр сужает список до нужного." },
      status: { title: "Строка состояния", text: "Всегда говорит, что происходит: модуль, число параметров, процесс песочницы, причины отказов, подсказки обучения, обход. Красное стоит прочитать." },
      done: { title: "Теперь оно ваше", text: "Наводите на любой элемент — подсказка; тяните, ищите, ломайте — это модель, терять нечего. Настоящий плагин — в одной загрузке отсюда." },
    },
  },
};
