#!/usr/bin/env python3
"""make_modules_data.py — snapshot of the module manifest for the product site.

The site fetches `manifest.json` live from github.com/broscauk/flbridge-modules, but it must
not depend on that fetch: a visitor behind a proxy, or GitHub having a bad day, should still
see the catalogue. This script turns the locally packed manifest (`design/flbridge/dist/modules/`)
or a URL into `modules-data.js`, keeping only the fields the page shows.

    python tools/make_modules_data.py                 # from ../flbridge/dist/modules/manifest.json
    python tools/make_modules_data.py path/or/url     # from any manifest
"""
import json
import os
import sys
import urllib.request

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(HERE)
DEFAULT = os.path.join(SITE, "..", "flbridge", "dist", "modules", "manifest.json")
FIELDS = ("id", "kind", "name", "size", "unpacked", "files")


def load(src: str) -> dict:
    if src.startswith("http://") or src.startswith("https://"):
        with urllib.request.urlopen(src, timeout=30) as r:
            return json.load(r)
    with open(src, encoding="utf-8") as fh:
        return json.load(fh)


def main() -> int:
    src = sys.argv[1] if len(sys.argv) > 1 else DEFAULT
    m = load(src)
    rows = [{k: p[k] for k in FIELDS} for p in m["plugins"]]
    out = {
        "generated": m.get("generated"),
        "source": m.get("source"),
        "base": m.get("base"),
        "manifest": m.get("manifest"),
        "plugins": rows,
    }
    text = (
        "// Snapshot of https://github.com/broscauk/flbridge-modules manifest.json "
        f"({m.get('generated')}).\n"
        "// Offline fallback; the page refreshes it live from the repository.\n"
        "window.FLB_MODULES = " + json.dumps(out, ensure_ascii=False, separators=(",", ":")) + ";\n"
    )
    dst = os.path.join(SITE, "modules-data.js")
    with open(dst, "w", encoding="utf-8", newline="\n") as fh:
        fh.write(text)
    zipped = sum(p["size"] for p in rows)
    print(f"{dst}: {len(rows)} modules, {zipped / 1048576:.1f} MB zipped, {len(text)} bytes")
    return 0


if __name__ == "__main__":
    sys.exit(main())
