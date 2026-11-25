"""Render contact sheets of logos for vision labeling: research/cache/sheets/<set>_<n>.png plus a manifest.

    python3 -I scripts/make_sheets.py            (from the repo root, after analyze_logos.py)

Each sheet shows 40 logos (8 by 5) on light gray tiles, each tile captioned with its catalog id.
Two sets: "word" (wordmarks and full logos, wide) and "mark" (icons, symbols and raster logos).
"""
import base64, csv, json, os, shutil, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(ROOT, "research", "cache")
OUT = os.path.join(CACHE, "sheets")
PER, COLS = 40, 8
sys.path.insert(0, os.path.join(ROOT, "scripts"))
from analyze_logos import find_chrome, sniff  # noqa: E402

PAGE = """<!doctype html><meta charset=utf-8><style>
body{margin:0;background:#fff;font:15px/1 Menlo,monospace;width:%dpx}
.g{display:grid;grid-template-columns:repeat(%d,1fr);gap:6px;padding:6px}
.c{box-sizing:border-box;background:#EDEDED;height:%dpx;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:8px;border-radius:6px}
.c img{max-width:92%%;max-height:%dpx;object-fit:contain}.c b{color:#C00;font-size:15px}
</style><div class=g>%s</div>"""

