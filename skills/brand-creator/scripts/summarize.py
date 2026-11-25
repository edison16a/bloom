"""Join catalog, pixel metrics and vision labels into research/logos.csv and write research/patterns.md.

    python3 -I scripts/summarize.py          (from the repo root)

Groups compared in the tables:
  all        every labeled logo
  craft 4+   logos the labelers rated 4 or 5 for professional quality (the target)
  craft 1-2  logos rated 1 or 2 (what to avoid)
  YC         Y Combinator companies that reached Series A or later, went public, were acquired, or are YC top companies
"""
import colorsys, csv, glob, json, os, statistics as st
from collections import Counter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
R = os.path.join(ROOT, "research")


def hsl(hexv):
    h = hexv.lstrip("#")
    r, g, b = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    H, L, S = colorsys.rgb_to_hls(r, g, b)
    return H * 360, S, L

