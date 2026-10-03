"""geometry.py — quick layout numbers for the v2 page (no assertions, just prints).

Prints page width/height, header height, hero height, each section head's title/lead
geometry (two-column heads must not overlap), gallery column count, the frame's width and the
scroll-progress variable; writes `_check/v2-full-{w}.png` and `_check/v2-top-{w}.png`.

    python tools/geometry.py                      # local file://
    python tools/geometry.py http://localhost:8000/
"""
import json
import os
import sys

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
from playwright.sync_api import sync_playwright  # noqa: E402

SITE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(SITE, "_check")
os.makedirs(OUT, exist_ok=True)
url = sys.argv[1] if len(sys.argv) > 1 else "file:///" + os.path.join(SITE, "index.html").replace("\\", "/")
url += ("&" if "?" in url else "?") + "lang=en"

JS = """() => {
  const q = s => document.querySelector(s).getBoundingClientRect();
  const heads = [...document.querySelectorAll('.section-head')].map(h => {
    const t = h.querySelector('h2').getBoundingClientRect(); const l = h.querySelector('.section-lead');
    const lr = l ? l.getBoundingClientRect() : null;
    return { id: h.parentElement.id, h2r: Math.round(t.right), leadL: lr ? Math.round(lr.left) : null,
             h2b: Math.round(t.bottom), leadB: lr ? Math.round(lr.bottom) : null };
  });
  return { sw: document.documentElement.scrollWidth, sh: document.documentElement.scrollHeight, top: q('.top').height,
    hero: Math.round(q('.hero').height), heads,
    gal: getComputedStyle(document.querySelector('.gallery')).gridTemplateColumns.split(' ').length,
    demoW: Math.round(q('#demo-root').width), stageW: document.querySelector('[data-demo-stage]').clientWidth,
    demoTr: document.querySelector('#demo-root').style.transform };
}"""

with sync_playwright() as p:
    b = p.chromium.launch()
    for w, h in [(1366, 900), (390, 844)]:
        pg = b.new_page(viewport={"width": w, "height": h})
        pg.goto(url, wait_until="load")
        pg.wait_for_timeout(600)
        print(w, json.dumps(pg.evaluate(JS)))
        pg.evaluate("scrollTo(0, document.body.scrollHeight / 2)")
        pg.wait_for_timeout(250)
        print("  --scroll at half:", pg.evaluate("getComputedStyle(document.querySelector('.top')).getPropertyValue('--scroll')"))
        pg.evaluate("scrollTo(0, 0)")
        pg.wait_for_timeout(250)
        pg.screenshot(path=os.path.join(OUT, "v2-full-%d.png" % w), full_page=True)
        pg.screenshot(path=os.path.join(OUT, "v2-top-%d.png" % w), full_page=False)
    b.close()
