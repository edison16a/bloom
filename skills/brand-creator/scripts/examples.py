"""Pull real reference logos from the research set and render them as one contact sheet to look at.

    python3 -I scripts/examples.py --set word --craft 5 --case lower --n 40 --out out/acme/ref-words.png
    python3 -I scripts/examples.py --set mark --kind G --craft 5 --family orange --n 40 --out out/acme/ref-marks.png
    python3 -I scripts/examples.py --brand stripe,linear,vercel,anthropic,nvidia --out out/acme/ref-named.png

Filters (all optional, comma lists allowed): --set word|mark, --kind G,LI,LM,P,C,R,D,N,X, --cont, --style,
--craft (minimum), --simple (maximum), --type, --case, --weight, --track, --custom, --family (main color),
--source si,gb,svgl,yc,wd, --category (substring), --brand (substring of brand name).
Prints the matching rows (brand, labels, main color) and writes the PNG. Logos are trademarks of their owners
and are used only as private design reference; they are rendered from research/cache, which is not in git.
If the cache is missing, run: python3 -I scripts/collect_logos.py --skip-wd
"""
import argparse, base64, csv, os, random, shutil, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "scripts"))
from analyze_logos import find_chrome, sniff  # noqa: E402

PAGE = """<!doctype html><meta charset=utf-8><style>
body{margin:0;background:#fff;font:13px/1.2 -apple-system,Helvetica,sans-serif;width:%dpx}
.g{display:grid;grid-template-columns:repeat(%d,1fr);gap:8px;padding:8px}
.c{box-sizing:border-box;background:#F1F1EF;height:%dpx;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:10px;border-radius:10px}
.c img{max-width:90%%;max-height:%dpx;object-fit:contain}.c b{color:#555;font-weight:600;text-align:center}
</style><div class=g>%s</div>"""

