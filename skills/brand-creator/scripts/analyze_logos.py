"""Measure every logo in research/catalog.csv and write research/metrics.csv.

Two passes:
  1. Static SVG parse (Python): gradients, text elements, element and path counts, declared fills.
  2. Pixel pass (headless Chrome): each logo is drawn on a 192 px canvas and measured for ink bounding box
     aspect ratio, ink coverage, color clusters, dominant color, left/right and top/bottom symmetry,
     connected parts and edge complexity.

Run from the brand-creator folder:  python3 -I scripts/analyze_logos.py
Needs Google Chrome or Chromium (set CHROME=/path/to/chrome if it is not found). Stdlib only.
"""
import base64, csv, json, os, re, shutil, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(ROOT, "research", "cache")
CHUNK = 400


def find_chrome():
    for c in [os.environ.get("CHROME", ""), "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
              "/Applications/Chromium.app/Contents/MacOS/Chromium", shutil.which("google-chrome") or "",
              shutil.which("chromium") or "", shutil.which("chromium-browser") or ""]:
        if c and os.path.exists(c):
            return c
    sys.exit("Chrome not found. Set CHROME=/path/to/chrome")

