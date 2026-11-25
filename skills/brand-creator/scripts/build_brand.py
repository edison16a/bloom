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


def set_wordmark(wm, symbol_cache):
    """Outline the wordmark. Coordinates: baseline at y=0, cap height = 100 units."""
    font = Font(wm["font"])
    text = apply_case(wm.get("text") or wm["_name"], wm.get("case", "as-is"))
    k = 100.0 / font.cap
    track = float(wm.get("tracking", 0)) * font.upm  # tracking is in em
    custom = {int(i): g for i, g in (wm.get("custom_glyphs") or {}).items()}
    accent = set(int(i) for i in (wm.get("accent_chars") or []))
    x, prev, parts, bx0, by0, bx1, by1 = 0.0, None, [], 1e9, 1e9, -1e9, -1e9
    for i, ch in enumerate(text):
        if ch == " ":
            sp = font.cmap.get(32)
            x += (font.f["hmtx"][sp][0] if sp else font.upm * 0.25) + track
            prev = None
            continue
        if i in custom:
            # custom glyph: drawn in a box "w" wide (default 100) by 100 tall, scaled so 100 = cap (or x) height;
            # spaced with the side bearings of H so it sits in the word like a real letter
            cg = custom[i]
            h = 100.0 if cg.get("height", "cap") == "cap" else font.xh * k
            s_ = h / 100.0
            bw = float(cg.get("w", 100))
            lsb, rsb = font.sidebearings("H")
            gx = x * k + lsb * k
            body = token_fill(cg["svg"], "{T%d}" % i)
            parts.append({"i": i, "svg": '<g transform="translate(%s %s) scale(%s)">%s</g>' % (
                fnum(gx), fnum(-h), fnum(s_), body), "accent": i in accent, "custom": True})
            bx0, bx1 = min(bx0, gx), max(bx1, gx + bw * s_)
            by0, by1 = min(by0, -h), max(by1, 0)
            x += (lsb + rsb) + bw * s_ / k + track
            prev = None
            continue
        g = font.cmap.get(ord(ch))
        if not g:
            sys.exit("Font %s has no glyph for %r" % (wm["font"], ch))
        if prev:
            x += font.kerning(prev, g)
        pen = SVGPathPen(font.gs, ntos=fnum)
        tp = TransformPen(pen, (k, 0, 0, -k, x * k, 0))
        font.gs[g].draw(tp)
        bp = BoundsPen(font.gs)
        font.gs[g].draw(TransformPen(bp, (k, 0, 0, -k, x * k, 0)))
        d = pen.getCommands()
        if d:
            parts.append({"i": i, "d": d, "accent": i in accent})
        if bp.bounds:
            bx0, by0 = min(bx0, bp.bounds[0]), min(by0, bp.bounds[1])
            bx1, by1 = max(bx1, bp.bounds[2]), max(by1, bp.bounds[3])
        x += font.f["hmtx"][g][0] + track
        prev = g
    has_tall = any(c.isupper() or c.isdigit() or c in "bdfhklt" for c in text) or bool(custom)
    zone_top = -100.0 if has_tall else -font.xh * k
    return {"parts": parts, "bbox": (bx0, by0, bx1, by1), "zone_top": zone_top, "text": text, "font": wm["font"]}


def wordmark_body(wmo, word, accent):
    out = []
    for p in wmo["parts"]:
        col = accent if p["accent"] else word
        if p.get("custom"):
            out.append(p["svg"].replace("{T%d}" % p["i"], col))
        else:
            out.append('<path fill="%s" d="%s"/>' % (col, p["d"]))
    return "".join(out)


# ---------------------------------------------------------------- symbol

def token_fill(svg, single=None):
    """Symbols use {P} primary, {A} accent, {I} ink. single replaces all three with one token."""
    if single:
        for t in ("{P}", "{A}", "{I}"):
            svg = svg.replace(t, single)
    return svg


BAD = re.compile(r"<\s*(script|text|image|foreignObject|linearGradient|radialGradient|filter|style)\b|url\(\s*['\"]?http|xlink:href\s*=\s*['\"]?http|\son\w+\s*=", re.I)


def check_symbol(svg, label):
    if BAD.search(svg):
        sys.exit("%s: no scripts, text, images, gradients, filters or style blocks allowed" % label)


class Uniq:
    n = 0

    @classmethod
    def ids(cls, svg):
        cls.n += 1
        return svg.replace("{U}", "u%d" % cls.n)


# ---------------------------------------------------------------- compositions
# Each composition returns (template_svg_inner, viewbox) where colors are tokens:
#   {S1} symbol primary, {S2} symbol accent, {S3} symbol ink, {W} word, {WA} word accent, {BG} tile background

def comp_symbol(sym):
    return '<g>%s</g>' % sym.replace("{P}", "{S1}").replace("{A}", "{S2}").replace("{I}", "{S3}"), (0, 0, 100, 100)


def comp_wordmark(wmo):
    x0, y0, x1, y1 = wmo["bbox"]
    return wordmark_body(wmo, "{W}", "{WA}"), (x0, y0, x1 - x0, y1 - y0)


def comp_horizontal(sym, wmo, lk):
    H = 100.0
    cap = H * float(lk.get("cap_ratio", 0.66))
    s = cap / 100.0
    gap = H * float(lk.get("gap", 0.24))
    x0, y0, x1, y1 = wmo["bbox"]
    zone_mid = (wmo["zone_top"] / 2.0) * s  # middle of the text zone relative to baseline
    base_y = H / 2.0 - zone_mid
    tx = H + gap - x0 * s
    sym_t = comp_symbol(sym)[0]
    word = '<g transform="translate(%s %s) scale(%s)">%s</g>' % (fnum(tx), fnum(base_y), fnum(s), wordmark_body(wmo, "{W}", "{WA}"))
    top = min(0, base_y + y0 * s)
    bot = max(H, base_y + y1 * s)
    return sym_t + word, (0, top, H + gap + (x1 - x0) * s, bot - top)


def comp_stacked(sym, wmo, lk):
    H = 100.0
    cap = H * float(lk.get("stack_cap_ratio", 0.36))
    s = cap / 100.0
    x0, y0, x1, y1 = wmo["bbox"]
    ww = (x1 - x0) * s
    W = max(H, ww)
    gap = H * float(lk.get("stack_gap", 0.24))
    base_y = H + gap - wmo["zone_top"] * s
    sym_t = '<g transform="translate(%s 0)">%s</g>' % (fnum((W - H) / 2), comp_symbol(sym)[0])
    word = '<g transform="translate(%s %s) scale(%s)">%s</g>' % (fnum((W - ww) / 2 - x0 * s), fnum(base_y), fnum(s), wordmark_body(wmo, "{W}", "{WA}"))
    return sym_t + word, (0, 0, W, base_y + y1 * s)


def comp_appicon(sym, inset):
    r = 22.5
    pad = 100 * float(inset)
    sc = (100 - 2 * pad) / 100
    inner = comp_symbol(sym)[0]
    return ('<rect width="100" height="100" rx="%s" fill="{BG}"/><g transform="translate(%s %s) scale(%s)">%s</g>'
            % (r, fnum(pad), fnum(pad), fnum(sc), inner)), (0, 0, 100, 100)


def svg_doc(inner, vb, pad_ratio=0.02):
    x, y, w, h = vb
    p = max(w, h) * pad_ratio
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="%s %s %s %s" width="%s" height="%s">%s</svg>' % (
        fnum(x - p), fnum(y - p), fnum(w + 2 * p), fnum(h + 2 * p), fnum(w + 2 * p), fnum(h + 2 * p), inner)


def paint(tpl, m):
    for k in ("{S1}", "{S2}", "{S3}", "{WA}", "{W}", "{BG}"):
        tpl = tpl.replace(k, m.get(k, "#000000"))
    return tpl


def contrast(a, b):
    """WCAG contrast ratio of two #RRGGBB colors."""
    def lum(h):
        h = h.lstrip("#")
        v = [int(h[i:i + 2], 16) / 255.0 for i in (0, 2, 4)]
        v = [x / 12.92 if x <= 0.03928 else ((x + 0.055) / 1.055) ** 2.4 for x in v]
        return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]
    la, lb = sorted((lum(a), lum(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)


def schemes(c, sym_mono_on_color="#FFFFFF"):
    P, A, I, paper = c["primary"], c.get("accent") or c["primary"], c.get("ink", "#0B0B0C"), c.get("paper", "#FFFFFF")
    word_acc = c.get("word_accent") or P
    return {
        "color": {"{S1}": P, "{S2}": A, "{S3}": I, "{W}": I, "{WA}": word_acc, "_bg": paper},
        "black": {k: "#000000" for k in ("{S1}", "{S2}", "{S3}", "{W}", "{WA}")} | {"_bg": "#FFFFFF"},
        "white": {k: "#FFFFFF" for k in ("{S1}", "{S2}", "{S3}", "{W}", "{WA}")} | {"_bg": "#111111"},
        "reverse": {"{S1}": P, "{S2}": A, "{S3}": "#FFFFFF", "{W}": "#FFFFFF", "{WA}": word_acc, "_bg": I},
        "on-primary": {k: sym_mono_on_color for k in ("{S1}", "{S2}", "{S3}", "{W}", "{WA}")} | {"_bg": P},
    }


# ---------------------------------------------------------------- PNG rendering

RENDER = r"""<!doctype html><meta charset=utf-8><body><pre id=out></pre><script>
const JOBS=__JOBS__;(async()=>{const out={};for(const j of JOBS){const img=new Image();
img.src='data:image/svg+xml;base64,'+btoa(unescape(encodeURIComponent(j.svg)));await img.decode();
const r=img.naturalWidth/img.naturalHeight;let W,H;if(r>=1){W=j.size;H=Math.max(1,Math.round(j.size/r))}else{H=j.size;W=Math.max(1,Math.round(j.size*r))}
const c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');if(j.bg){g.fillStyle=j.bg;g.fillRect(0,0,W,H)}
g.drawImage(img,0,0,W,H);out[j.name]=c.toDataURL('image/png').split(',')[1]}
document.getElementById('out').textContent=JSON.stringify(out)})();</script>"""


def find_chrome():
    for c in [os.environ.get("CHROME", ""), "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
              "/Applications/Chromium.app/Contents/MacOS/Chromium", shutil.which("google-chrome") or "",
              shutil.which("chromium") or "", shutil.which("chromium-browser") or ""]:
        if c and os.path.exists(c):
            return c
    return None


MEASURE = r"""<!doctype html><meta charset=utf-8><body><pre id=out></pre><script>
const SY=__SY__;(async()=>{const out=[];for(const s of SY){const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="-50 -50 200 200" width="800" height="800">'+s+'</svg>';
const img=new Image();img.src='data:image/svg+xml;base64,'+btoa(unescape(encodeURIComponent(svg)));await img.decode();
const c=document.createElement('canvas');c.width=c.height=800;const g=c.getContext('2d');g.drawImage(img,0,0);const d=g.getImageData(0,0,800,800).data;
let x0=800,y0=800,x1=-1,y1=-1;for(let y=0;y<800;y++)for(let x=0;x<800;x++)if(d[(y*800+x)*4+3]>40){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}
out.push(x1<0?null:[x0/4-50,y0/4-50,(x1+1)/4-50,(y1+1)/4-50])}
document.getElementById('out').textContent=JSON.stringify(out)})();</script>"""


def chrome_eval(page_html, timeout=120):
    chrome = find_chrome()
    if not chrome:
        return None
    tmp = tempfile.mkdtemp(prefix="brand-m-")
    try:
        page = os.path.join(tmp, "m.html")
        open(page, "w").write(page_html)
        p = subprocess.run([chrome, "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
                            "--user-data-dir=" + os.path.join(tmp, "prof"), "--virtual-time-budget=30000",
                            "--dump-dom", "file://" + page], capture_output=True, text=True, timeout=timeout)
        m = re.search(r'<pre id="out">(.*?)</pre>', p.stdout, re.S)
        return json.loads(html.unescape(m.group(1))) if m and m.group(1).strip() else None
    finally:
        shutil.rmtree(tmp, ignore_errors=True)

