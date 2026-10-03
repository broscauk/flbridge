"""publish.py — push this folder to the GitHub Pages repository.

The site lives inside the private wiki repo; GitHub Pages serves it from the public repository
`broscauk/flbridge` (https://broscauk.github.io/flbridge/). This script clones (or updates) that
repository in a scratch folder, mirrors the site into it — everything here except `_check/`,
`__pycache__/` and this folder's scratch files — commits and pushes. Credentials come from Git
Credential Manager, the same as any other push.

    python tools/publish.py                      # commit message = "site: YYYY-MM-DD HH:MM"
    python tools/publish.py "v2: compact layout"  # custom message
    python tools/publish.py --dry-run              # mirror + diff, no commit

Requires git in PATH and push rights to the repository. Does not touch the wiki repo.
"""
import os
import shutil
import subprocess
import sys
import tempfile
import time

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

REPO = "https://github.com/broscauk/flbridge.git"
BRANCH = "main"
SITE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WORK = os.path.join(tempfile.gettempdir(), "flbridge-pages")
SKIP_DIRS = {"_check", "__pycache__", ".git"}
SKIP_FILES = {"modules-README.md"}  # belongs to the flbridge-modules repository, not the site


def git(*args, cwd=WORK, check=True):
    r = subprocess.run(["git", *args], cwd=cwd, text=True, capture_output=True, encoding="utf-8", errors="replace")
    if check and r.returncode:
        raise SystemExit(f"git {' '.join(args)} failed:\n{r.stdout}{r.stderr}")
    return r.stdout.strip()


def mirror():
    for name in os.listdir(WORK):
        if name == ".git":
            continue
        p = os.path.join(WORK, name)
        shutil.rmtree(p) if os.path.isdir(p) else os.remove(p)
    for root, dirs, files in os.walk(SITE):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        rel = os.path.relpath(root, SITE)
        dst = WORK if rel == "." else os.path.join(WORK, rel)
        os.makedirs(dst, exist_ok=True)
        for f in files:
            if rel == "." and f in SKIP_FILES:
                continue
            shutil.copy2(os.path.join(root, f), os.path.join(dst, f))


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    dry = "--dry-run" in sys.argv
    msg = args[0] if args else "site: " + time.strftime("%Y-%m-%d %H:%M")

    if os.path.isdir(os.path.join(WORK, ".git")):
        git("fetch", "origin")
    else:
        shutil.rmtree(WORK, ignore_errors=True)
        os.makedirs(WORK)
        git("init", "-b", BRANCH)
        git("remote", "add", "origin", REPO)
        git("fetch", "origin")
    # An empty (just created) repository has no remote branch yet — then start from scratch.
    if git("ls-remote", "--heads", "origin", BRANCH):
        git("checkout", "-B", BRANCH, f"origin/{BRANCH}")
    else:
        git("checkout", "-B", BRANCH)
    mirror()
    git("add", "-A")
    status = git("status", "--porcelain")
    if not status:
        print("nothing to publish — the repository already matches this folder")
        return 0
    print(status)
    if dry:
        print("dry run — not committing")
        return 0
    git("commit", "-m", msg)
    git("push", "origin", BRANCH)
    print("pushed:", git("rev-parse", "--short", "HEAD"), "→", REPO)
    print("Pages will rebuild in about a minute: https://broscauk.github.io/flbridge/")
    return 0


if __name__ == "__main__":
    sys.exit(main())
