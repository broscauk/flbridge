#!/usr/bin/env python3
"""check_site.py — headless check of the product page.

Opens index.html in Chromium (Playwright; falls back to the Edge channel), fails on any console
error or uncaught exception, switches both languages, and drives the interactive demo through
the paths a visitor takes: pick a module via Ctrl+F, turn a macro, link it by touch, open the
Matrix, settings (scale, accent, macro position), the MODULES panel (download, install all),
About, presets. Screenshots land in `_check/` next to this script's parent (gitignored).

    python tools/check_site.py            # local file://
    python tools/check_site.py http://localhost:8000/
"""
import os
import sys
import time

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

from playwright.sync_api import sync_playwright  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(HERE)
OUT = os.path.join(SITE, "_check")
os.makedirs(OUT, exist_ok=True)

errors: list[str] = []
checks: list[tuple[str, bool, str]] = []


def check(name: str, ok: bool, detail: str = "") -> None:
    checks.append((name, ok, detail))
    print(("OK   " if ok else "FAIL ") + name + (f" — {detail}" if detail else ""))


def shot(page, name: str) -> None:
    page.screenshot(path=os.path.join(OUT, name + ".png"), full_page=False)


def in_bounds(page, sel: str) -> tuple[bool, str]:
    """Is the popover `sel` inside the demo block (and inside the viewport horizontally)?"""
    r = page.evaluate(
        "(sel) => { const b = document.querySelector(sel).getBoundingClientRect(); const w = document.querySelector('.demo-wrap').getBoundingClientRect();"
        " return { l: Math.round(b.left - w.left), t: Math.round(b.top - w.top), r: Math.round(w.right - b.right), btm: Math.round(w.bottom - b.bottom), side: document.querySelector(sel).dataset.side || '', vw: innerWidth, vr: Math.round(b.right) }; }",
        sel,
    )
    ok = r["l"] >= 0 and r["t"] >= 0 and r["r"] >= -1 and r["vr"] <= r["vw"]
    return ok, f"side={r['side']} left={r['l']} top={r['t']} right-gap={r['r']} bottom-gap={r['btm']}"


def run(url: str) -> int:
    with sync_playwright() as p:
        try:
            browser = p.chromium.launch()
        except Exception:
            browser = p.chromium.launch(channel="msedge")
        page = browser.new_page(viewport={"width": 1366, "height": 900}, device_scale_factor=1)
        page.on("console", lambda m: errors.append(f"console.{m.type}: {m.text}") if m.type == "error" else None)
        page.on("pageerror", lambda e: errors.append(f"pageerror: {e}"))
        # The machine running this may have a Russian browser locale, so pin the start language.
        page.goto(url + ("&" if "?" in url else "?") + "lang=en", wait_until="load")
        page.wait_for_timeout(600)

        # --- language -------------------------------------------------------------------
        check("html lang=en with ?lang=en", page.evaluate("document.documentElement.lang") == "en")
        h1_en = page.inner_text("h1")
        check("EN h1", "your" in h1_en, h1_en.replace("\n", " "))
        page.click('.lang button[data-lang="ru"]')
        page.wait_for_timeout(100)
        h1_ru = page.inner_text("h1")
        check("RU switch changes h1", h1_en != h1_ru and "DAW" in h1_ru, h1_ru.replace("\n", " "))
        check("RU persisted in localStorage", page.evaluate("localStorage.getItem('flb-lang')") == "ru")
        n_faq = page.locator("[data-faq] details").count()
        n_feat = page.locator("[data-features] .feature").count()
        n_gal = page.locator("[data-gallery] figure").count()
        check("generated blocks (ru)", n_faq >= 10 and n_feat >= 12 and n_gal >= 10, f"faq {n_faq}, features {n_feat}, gallery {n_gal}")
        shot(page, "ru-top")
        page.click('.lang button[data-lang="en"]')
        page.wait_for_timeout(100)
        check("EN back", page.inner_text("h1") == h1_en)
        shot(page, "en-top")

        # --- images ---------------------------------------------------------------------
        broken = page.evaluate("Array.from(document.images).filter(i => i.getAttribute('src') && i.complete && i.naturalWidth === 0).map(i => i.getAttribute('src'))")
        check("all images load", not broken, ", ".join(broken))

        # --- modules table --------------------------------------------------------------
        rows = page.locator("[data-modules-body] tr").count()
        check("modules table has 140 rows", rows == 140, str(rows))
        page.fill("[data-modules-search]", "reeverb")
        page.wait_for_timeout(50)
        check("modules filter", page.locator("[data-modules-body] tr").count() == 2, page.inner_text("[data-modules-count]"))
        page.fill("[data-modules-search]", "")
        page.click('.seg [data-kind="generator"]')
        check("generator filter", page.locator("[data-modules-body] tr").count() == 51)
        page.click('.seg [data-kind="all"]')
        page.wait_for_timeout(2500)
        src = page.inner_text("[data-modules-source]")
        print("     manifest source:", src)

        # --- "coming soon" buttons ------------------------------------------------------
        soon = page.locator("a.is-soon").count()
        check("placeholders disabled (buy/donate/downloads)", soon == 4, str(soon))

        # --- demo -----------------------------------------------------------------------
        page.locator("#demo").scroll_into_view_if_needed()
        page.wait_for_timeout(300)
        demo = page.locator("#demo-root")
        check("demo rendered", demo.locator(".flb-header").count() == 1)
        check("demo empty slot", "pick a module" in demo.locator(".flb-cell .val").first.inner_text())
        shot(page, "demo-empty")

        demo.locator('.flb-cell[data-open="search"]').click()
        page.wait_for_timeout(100)
        check("search palette opens", demo.locator(".flb-search").count() == 1)
        page.keyboard.type("soft")
        page.wait_for_timeout(100)
        rows_s = demo.locator(".flb-row").count()
        check("palette filters", rows_s == 1, f"{rows_s} rows for 'soft'")
        shot(page, "demo-search")
        page.keyboard.press("Enter")
        page.wait_for_timeout(1200)
        slot = demo.locator('.flb-cell[data-open="search"] .val').inner_text()
        check("module picked and live", slot == "Fruity Soft Clipper" and demo.locator(".flb-dot.live").count() == 1, slot)
        check("faux module window shown", demo.locator(".flb-faux .fk").count() == 2)
        page.wait_for_timeout(1500)
        peak = demo.locator('[data-m="peak"]').inner_text()
        check("meter runs", "dB" in peak, peak)
        shot(page, "demo-live")

        # install row: an uninstalled module downloads, then loads
        demo.locator('.flb-cell[data-open="search"]').click()
        page.keyboard.type("spreader")
        page.wait_for_timeout(100)
        check("uninstalled module shows install tag", demo.locator(".flb-row .tag.inst").count() == 1)
        page.keyboard.press("Enter")
        page.wait_for_timeout(300)
        check("download starts in the row", demo.locator("[data-prog]").count() >= 1)
        page.wait_for_timeout(3500)
        slot = demo.locator('.flb-cell[data-open="search"] .val').inner_text()
        check("downloaded module loaded", slot == "Spreader", slot)

        # refused module
        demo.locator('.flb-cell[data-open="search"]').click()
        page.keyboard.type("mobile")
        page.wait_for_timeout(100)
        check("refused module tagged", demo.locator(".flb-row .tag.bad").count() == 1)
        page.keyboard.press("Escape")

        # macro: drag, learn, matrix
        demo.locator('.flb-cell[data-open="search"]').click()
        page.keyboard.type("soft")
        page.keyboard.press("Enter")
        page.wait_for_timeout(1200)
        dial = demo.locator('[data-dial="1"]')
        box = dial.bounding_box()
        page.mouse.move(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2)
        page.mouse.down()
        page.mouse.move(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2 - 60, steps=8)
        page.mouse.up()
        pct = demo.locator('.flb-knob[data-macro="1"] .pct').inner_text()
        check("macro knob drags", pct != "25 %", pct)
        demo.locator('[data-learn="0"]').click()
        page.wait_for_timeout(50)
        check("learn armed", demo.locator(".flb-knob.learning").count() == 1)
        demo.locator('[data-fk="Threshold"]').click()
        page.wait_for_timeout(100)
        check("link created", demo.locator('.flb-knob[data-macro="0"] .link:not(.none)').count() == 1)
        demo.locator('[data-tab="matrix"]').click()
        page.wait_for_timeout(100)
        check("matrix lists the link", demo.locator(".flb-matrix tbody tr").count() == 1 and "Threshold" in demo.locator(".flb-matrix tbody").inner_text())
        shot(page, "demo-matrix")
        demo.locator('[data-tab="module"]').click()

        # A / B
        demo.locator('[data-toggle="autogain"]').click()
        check("A toggles auto gain off", "auto gain off" in demo.locator(".flb-status .msg").inner_text())
        demo.locator('[data-toggle="autogain"]').click()
        demo.locator('[data-toggle="bypass"]').click()
        check("B bypass", demo.locator('[data-toggle="bypass"].on').count() == 1)
        demo.locator('[data-toggle="bypass"]').click()

        # presets
        demo.locator('[data-preset-step="1"]').click()
        demo.locator('[data-open="presets"]').click()
        page.wait_for_timeout(100)
        check("preset list opens", demo.locator(".flb-row").count() >= 3)
        page.keyboard.press("Escape")
        demo.locator("[data-save-preset]").click()
        page.wait_for_timeout(100)
        check("save preset toasts", demo.locator(".flb-toast").count() == 1)
        page.wait_for_timeout(1900)

        # settings
        demo.locator('[data-open="settings"]').click()
        page.wait_for_timeout(100)
        demo.locator('[data-set="scale"][data-v="125"]').click()
        page.wait_for_timeout(100)
        k = page.evaluate("getComputedStyle(document.querySelector('#demo-root')).getPropertyValue('--k').trim()")
        check("scale 125 applied", k == "1.25", k)
        demo.locator('[data-set="accent"][data-v="4"]').click()
        acc = page.evaluate("document.querySelector('#demo-root').style.getPropertyValue('--acc')")
        check("accent Ice applied", acc.lower() == "#38bdf8", acc)
        demo.locator('[data-set="macros"][data-v="side"]').click()
        check("macro position side", page.evaluate("document.querySelector('#demo-root').dataset.macros") == "side")
        shot(page, "demo-settings")
        demo.locator('[data-set="macros"][data-v="top"]').click()
        demo.locator('[data-set="scale"][data-v="100"]').click()
        demo.locator('[data-set="accent"][data-v="0"]').click()
        page.keyboard.press("Escape")

        # modules panel
        demo.locator('[data-open="modules"]').click()
        page.wait_for_timeout(100)
        n_rows = demo.locator(".flb-modrow").count()
        check("modules panel lists effects", n_rows == 89, str(n_rows))
        check("install N missing chip", demo.locator("[data-installall]").count() == 1, demo.locator("[data-installall]").inner_text())
        demo.locator("[data-dl]").first.click()
        page.wait_for_timeout(200)
        check("download button shows progress", demo.locator(".flb-modrow [data-prog]").count() >= 1)
        shot(page, "demo-modules")
        page.wait_for_timeout(3200)
        page.fill("[data-modsearch]", "soft")
        page.wait_for_timeout(100)
        check("modules filter", demo.locator(".flb-modrow").count() == 1)
        demo.locator(".flb-modrow").first.hover()
        page.wait_for_timeout(100)
        check("installed row shows reinstall/remove on hover", demo.locator(".flb-modrow [data-remove]").count() == 1)
        page.keyboard.press("Escape")

        # about
        demo.locator("[data-about]").click()
        page.wait_for_timeout(100)
        check("about panel", "version 1.0.0" in demo.locator(".flb-about").inner_text())
        shot(page, "demo-about")
        page.keyboard.press("Escape")

        # --- hints ----------------------------------------------------------------------
        demo.locator(".flb-logo").hover()
        page.wait_for_timeout(500)
        hint = page.locator(".flb-hint")
        check("hint appears on hover", hint.count() == 1 and hint.is_visible() and "Mark" in hint.inner_text(), hint.inner_text().replace("\n", " ")[:60] if hint.count() else "")
        check("hint inside the demo block", *in_bounds(page, ".flb-hint"))
        page.mouse.move(5, 5)
        page.wait_for_timeout(100)
        check("hint hides on leave", not hint.is_visible())
        page.click('.lang button[data-lang="ru"]')
        page.wait_for_timeout(100)
        demo.locator('[data-toggle="autogain"]').hover()
        page.wait_for_timeout(500)
        check("hint translated (ru)", hint.is_visible() and "автогромкость" in hint.inner_text(), hint.inner_text().replace("\n", " ")[:60])
        page.mouse.move(5, 5)
        page.click('.lang button[data-lang="en"]')
        page.wait_for_timeout(100)
        titles = page.evaluate("Array.from(document.querySelectorAll('#demo-root [title]')).length")
        check("no native title tooltips left in the frame", titles == 0, str(titles))

        # --- guided tour ----------------------------------------------------------------
        toc = page.locator("[data-tour-toc] li").count()
        check("tour toc lists 18 steps", toc == 18, str(toc))
        page.click("[data-tour-start]")
        page.wait_for_timeout(700)
        card = page.locator(".flb-tour")
        check("tour card shown at step 1", card.is_visible() and "1 / 18" in card.inner_text() and "plugin frame" in card.inner_text())
        check("tour reset the demo", "pick a module" in demo.locator('.flb-cell[data-open="search"] .val').inner_text())
        check("target highlighted", demo.locator(".tour-hl").count() >= 1)
        check("toc marks current", page.locator("[data-tour-toc] li.cur").count() == 1)
        page.click("[data-tour-next]")
        page.wait_for_timeout(200)
        check("step 2 targets the slot", demo.locator('.flb-cell[data-open="search"].tour-hl').count() == 1)
        page.click("[data-tour-next]")
        page.wait_for_timeout(200)
        check("step 3 opens the palette with 'soft'", demo.locator(".flb-search").count() == 1 and demo.locator(".flb-search").input_value() == "soft")
        check("card beside the tall palette, in bounds", *in_bounds(page, ".flb-tour"))
        page.click("[data-tour-next]")
        page.wait_for_timeout(1500)
        check("step 4 loads Soft Clipper", "4 / 18" in card.inner_text() and demo.locator(".flb-dot.live").count() == 1, card.inner_text()[:12])
        shot(page, "tour-module")
        page.keyboard.press("ArrowRight")
        page.wait_for_timeout(200)
        check("→ key advances (outside inputs)", "5 / 18" in card.inner_text() and demo.locator(".flb-meter.tour-hl").count() == 1, card.inner_text()[:12])
        page.keyboard.press("ArrowLeft")
        page.keyboard.press("ArrowLeft")
        page.wait_for_timeout(200)
        check("back reopens the palette", "3 / 18" in card.inner_text() and demo.locator(".flb-search").count() == 1)
        page.click('[data-tour-goto="learn"]')
        page.wait_for_timeout(1500)
        check("jump to 'learn' links Macro 1 → Threshold", "10 / 18" in card.inner_text() and demo.locator('.flb-faux .fk.linked[data-fk="Threshold"]').count() == 1, card.inner_text()[:12])
        shot(page, "tour-learn")
        page.click("[data-tour-next]")
        page.wait_for_timeout(200)
        check("matrix step shows the link", demo.locator(".flb-matrix tbody tr").count() == 1)
        page.click('[data-tour-goto="accent"]')
        page.wait_for_timeout(300)
        acc = page.evaluate("document.querySelector('#demo-root').style.getPropertyValue('--acc')")
        check("accent step recolours to Ice", acc.lower() == "#38bdf8" and demo.locator(".flb-swatches.tour-hl").count() == 1, acc)
        shot(page, "tour-accent")
        page.click('[data-tour-goto="installall"]')
        page.wait_for_timeout(300)
        check("installall step targets the chip", demo.locator("[data-installall].tour-hl").count() == 1)
        check("card in bounds at the modules panel", *in_bounds(page, ".flb-tour"))
        page.click('[data-tour-goto="status"]')
        page.wait_for_timeout(300)
        check("card in bounds at the status line", *in_bounds(page, ".flb-tour"))
        page.click('[data-tour-goto="installall"]')
        page.wait_for_timeout(300)
        page.click('.lang button[data-lang="ru"]')
        page.wait_for_timeout(100)
        check("tour card translated (ru)", "16 / 18" in card.inner_text() and "недостающее" in card.inner_text(), card.inner_text()[:40])
        check("toc translated (ru)", "Это рама плагина" in page.locator("[data-tour-toc]").inner_text())
        page.click('.lang button[data-lang="en"]')
        page.click('[data-tour-goto="done"]')
        page.wait_for_timeout(300)
        check("last step offers Finish", "Finish" in page.locator("[data-tour-next]").inner_text())
        page.click("[data-tour-next]")
        page.wait_for_timeout(100)
        check("finish closes the tour", not card.is_visible() and demo.locator(".tour-hl").count() == 0)
        page.click("[data-demo-reset]")
        page.wait_for_timeout(100)
        check("reset demo clears the slot and accent", "pick a module" in demo.locator('.flb-cell[data-open="search"] .val').inner_text() and page.evaluate("document.querySelector('#demo-root').style.getPropertyValue('--acc')").lower() == "#f2542d")

        # --- page interactivity ---------------------------------------------------------
        see = page.locator("[data-features] .see").count()
        check("features link to the demo", see >= 10, str(see))
        page.evaluate("window.scrollTo(0, 0)")
        page.locator("#features").scroll_into_view_if_needed()
        page.wait_for_timeout(200)
        page.locator('[data-features] [data-tour-go="autogain"]').first.click()
        page.wait_for_timeout(900)
        check("'see it in the demo' starts the tour at that step", card.is_visible() and "6 / 18" in card.inner_text(), card.inner_text()[:12])
        page.keyboard.press("Escape")
        page.wait_for_timeout(100)
        check("Escape closes the tour", not card.is_visible())
        page.evaluate("window.scrollTo(0, 0)")
        page.wait_for_timeout(1400)
        stat = page.locator(".stats b").first.evaluate("b => b.firstChild.textContent")
        check("hero counter reached its value", stat == "88", stat)
        revealed = page.evaluate("document.querySelectorAll('.reveal.in').length")
        total_reveal = page.evaluate("document.querySelectorAll('.reveal').length")
        check("scroll-reveal marks visible blocks", revealed > 0 and total_reveal > revealed, f"{revealed} of {total_reveal}")
        page.locator("#faq").scroll_into_view_if_needed()
        page.wait_for_timeout(500)
        check("scrollspy lights the FAQ link", page.locator('.nav a.active[href="#faq"]').count() == 1)
        page.locator("[data-gallery] figure").first.click()
        page.wait_for_timeout(100)
        cap0 = page.inner_text(".lightbox-cap")
        page.keyboard.press("ArrowRight")
        cap1 = page.inner_text(".lightbox-cap")
        check("lightbox arrows step through", cap0.startswith("1 /") and cap1.startswith("2 /"), f"{cap0[:5]} → {cap1[:5]}")
        page.keyboard.press("Escape")
        page.context.grant_permissions(["clipboard-read", "clipboard-write"])
        page.locator("[data-copy]").click()
        page.wait_for_timeout(100)
        check("copy address toasts", page.locator("[data-page-toast]").is_visible() and "copied" in page.inner_text("[data-page-toast]"))
        clip = page.evaluate("navigator.clipboard.readText()")
        check("clipboard holds the address", clip == "broscaproducer+flbridge@gmail.com", clip)

        # mobile layout
        page.set_viewport_size({"width": 390, "height": 844})
        page.wait_for_timeout(400)
        page.locator("#demo").scroll_into_view_if_needed()
        page.wait_for_timeout(300)
        tr = page.evaluate("document.querySelector('#demo-root').style.transform")
        check("demo scales down on mobile", tr.startswith("scale("), tr)
        shot(page, "mobile-demo")
        page.click("[data-tour-start]")
        page.wait_for_timeout(900)
        check("mobile: tour card in bounds (step 1)", *in_bounds(page, ".flb-tour"))
        page.click('[data-tour-goto="palette"]')
        page.wait_for_timeout(400)
        check("mobile: tour card in bounds (palette)", *in_bounds(page, ".flb-tour"))
        page.click('[data-tour-goto="learn"]')
        page.wait_for_timeout(1500)
        check("mobile: tour card in bounds (learn)", *in_bounds(page, ".flb-tour"))
        shot(page, "mobile-tour")
        page.keyboard.press("Escape")
        page.wait_for_timeout(100)
        page.evaluate("window.scrollTo(0,0)")
        page.click("[data-burger]")
        check("burger opens nav", page.locator(".nav.open").count() == 1)
        shot(page, "mobile-top")

        browser.close()

    print()
    for e in errors:
        print("ERROR", e)
    failed = [c for c in checks if not c[1]]
    print(f"\nchecks: {len(checks) - len(failed)}/{len(checks)} ok, console/page errors: {len(errors)}")
    return 1 if failed or errors else 0


if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "file:///" + os.path.join(SITE, "index.html").replace(os.sep, "/")
    sys.exit(run(target))
