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


class Font:
    def __init__(self, fid):
        path = os.path.join(FONT_DIR, fid + ".woff2")
        if not os.path.exists(path):
            sys.exit("Unknown font %r. Fonts: %s" % (fid, ", ".join(list_fonts())))
        self.f = TTFont(path)
        self.gs = self.f.getGlyphSet()
        self.cmap = self.f.getBestCmap()
        self.upm = self.f["head"].unitsPerEm
        os2 = self.f["OS/2"]
        self.cap = getattr(os2, "sCapHeight", 0) or self._height("H")
        self.xh = getattr(os2, "sxHeight", 0) or self._height("x")
        self.kern = self._load_kern()

    def _height(self, ch):
        g = self.cmap.get(ord(ch))
        if not g:
            return self.upm * 0.7
        bp = BoundsPen(self.gs)
        self.gs[g].draw(bp)
        return bp.bounds[3] if bp.bounds else self.upm * 0.7

    def _load_kern(self):
        pairs, classes = {}, []
        if "GPOS" not in self.f:
            return pairs, classes
        t = self.f["GPOS"].table
        if not t.FeatureList or not t.LookupList:
            return pairs, classes
        idx = set()
        for fr in t.FeatureList.FeatureRecord:
            if fr.FeatureTag == "kern":
                idx.update(fr.Feature.LookupListIndex)
        for li in sorted(idx):
            lk = t.LookupList.Lookup[li]
            for st in lk.SubTable:
                if lk.LookupType == 9:
                    st = st.ExtSubTable
                if getattr(st, "LookupType", 2) != 2 and lk.LookupType != 9:
                    continue
                if not hasattr(st, "Format") or not hasattr(st, "Coverage"):
                    continue
                cov = st.Coverage.glyphs
                if st.Format == 1:
                    for i, first in enumerate(cov):
                        for rec in st.PairSet[i].PairValueRecord:
                            v = getattr(rec.Value1, "XAdvance", 0) if rec.Value1 else 0
                            if v and (first, rec.SecondGlyph) not in pairs:
                                pairs[(first, rec.SecondGlyph)] = v
                elif st.Format == 2:
                    classes.append((set(cov), st.ClassDef1.classDefs, st.ClassDef2.classDefs, st.Class1Record))
        return pairs, classes

    def sidebearings(self, ch):
        g = self.cmap.get(ord(ch))
        if not g:
            return (self.upm * 0.06, self.upm * 0.06)
        adv, lsb = self.f["hmtx"][g]
        bp = BoundsPen(self.gs)
        self.gs[g].draw(bp)
        if not bp.bounds:
            return (lsb, lsb)
        return (bp.bounds[0], adv - bp.bounds[2])

    def kerning(self, a, b):
        pairs, classes = self.kern
        if (a, b) in pairs:
            return pairs[(a, b)]
        for cov, c1, c2, recs in classes:
            if a in cov:
                r = recs[c1.get(a, 0)].Class2Record[c2.get(b, 0)]
                v = getattr(r.Value1, "XAdvance", 0) if r.Value1 else 0
                if v:
                    return v
        return 0


# ---------------------------------------------------------------- wordmark

def apply_case(text, case):
    return {"lower": text.lower(), "upper": text.upper(), "title": " ".join(w[:1].upper() + w[1:].lower() for w in text.split(" "))}.get(case, text)

