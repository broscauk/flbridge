#!/usr/bin/env python3
"""html_sanity.py — browser-free sanity check of index.html.

Tag balance, internal anchors (`href="#x"`) pointing at an existing id in the markup or in the
JS-generated blocks, and a list of external links to eyeball. Complements `check_site.py`, which
needs Playwright; this one needs nothing.
"""
import os
import re
import sys
from html.parser import HTMLParser

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
SITE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VOID = {"meta", "link", "img", "br", "input", "hr", "source", "path", "circle", "rect", "use",
        "polyline", "line", "wbr"}


class P(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack, self.ids, self.hrefs, self.bad = [], set(), [], []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if "id" in a:
            self.ids.add(a["id"])
        if tag == "a" and a.get("href", "").startswith("#"):
            self.hrefs.append((a["href"], self.getpos()[0]))
        if tag not in VOID:
            self.stack.append((tag, self.getpos()[0]))

    def handle_endtag(self, tag):
        if tag in VOID:
            return
        if not self.stack or self.stack[-1][0] != tag:
            self.bad.append((tag, self.getpos()[0], self.stack[-1] if self.stack else None))
        else:
            self.stack.pop()


def main() -> int:
    html = open(os.path.join(SITE, "index.html"), encoding="utf-8").read()
    js = "".join(open(os.path.join(SITE, f), encoding="utf-8").read() for f in ("app.js", "i18n.js", "demo.js"))
    p = P()
    p.feed(html)
    js_ids = set(re.findall(r'id="([^"]+)"', js))
    missing = [(h, ln) for h, ln in p.hrefs if h != "#" and h[1:] not in p.ids and h[1:] not in js_ids]
    print("mismatched tags:", p.bad or "none")
    print("unclosed at EOF:", p.stack or "none")
    print(f"internal anchors: {len(p.hrefs)}, missing targets: {missing or 'none'}")
    print("external links:")
    for u in sorted(set(re.findall(r'href="(https?://[^"]+)"', html + js))):
        print("  ", u)
    return 1 if p.bad or p.stack or missing else 0


if __name__ == "__main__":
    sys.exit(main())
