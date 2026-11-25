"""Build a complete brand kit from a brand.json written by the agent.

    python3 -I scripts/build_brand.py --brand out/acme/brand.json            (from the repo root)
    python3 -I scripts/build_brand.py --brand out/acme/brand.json --no-png   (skip PNG rendering)

Writes next to brand.json:
    brand-board.html             one offline page: the recommended logo, every color version, alternatives,
                                 live color pickers and downloads (single files or everything as a zip)
    assets/svg/*.svg             symbol, wordmark, horizontal and stacked lockups, app icon; color, black,
                                 white and reverse versions; all type converted to outlines
    assets/png/*.png             the same at 1024 and 2048 px on a transparent background, plus favicons
    <slug>-brand-kit.zip         everything above

Needs: fontTools with brotli (pip install "fonttools[woff]") for outlining type, and Google Chrome or
Chromium for PNG rendering (set CHROME=/path/to/chrome if it is not found).
"""
import argparse, base64, html, io, json, os, re, shutil, subprocess, sys, tempfile, zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONT_DIR = os.path.join(ROOT, "assets", "fonts")
TEMPLATE = os.path.join(ROOT, "scripts", "brand_board_template.html")

try:
    from fontTools.ttLib import TTFont
    from fontTools.pens.svgPathPen import SVGPathPen
    from fontTools.pens.transformPen import TransformPen
    from fontTools.pens.boundsPen import BoundsPen
except ImportError:
    sys.exit('fontTools is required: pip install "fonttools[woff]"')


def fnum(v):
    s = "%.2f" % v
    s = s.rstrip("0").rstrip(".")
    return "0" if s in ("-0", "") else s


# ---------------------------------------------------------------- fonts

def list_fonts():
    out = {}
    for fn in sorted(os.listdir(FONT_DIR)):
        if fn.endswith(".woff2"):
            fid = fn[:-6]
            fam, _, w = fid.rpartition("-")
            out[fid] = {"id": fid, "family": fam.replace("-", " ").title(), "weight": int(w) if w.isdigit() else 400}
    return out

