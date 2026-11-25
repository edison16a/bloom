"""Render design candidates or a finished brand board to PNG so the agent can look at them.

    python3 -I scripts/preview.py --candidates out/acme/candidates.json     -> out/acme/candidates.png
    python3 -I scripts/preview.py --board out/acme/brand-board.html          -> out/acme/board.png (light theme;
                                                                            --theme dark for the dark one)

candidates.json:
{
  "name": "Acme",
  "colors": {"primary": "#FF5A1F", "accent": "#FFB800", "ink": "#111214", "paper": "#FFFFFF"},
  "wordmarks": [ {"font": "inter-800", "case": "lower", "tracking": -0.04, "accent_chars": [], "custom_glyphs": {}}, ... ],
  "symbols":   [ "<svg body with {P} {A} {I} tokens>", ... ],
  "lockups":   [ {"symbol": 0, "wordmark": 2}, ... ]          (optional: pairs to see together)
}

    python3 -I scripts/preview.py --options out/acme/options.json           -> out/acme/options.png and options.html

options.json (finished directions for the user to choose from before the kit is built):
{
  "name": "Acme",
  "colors": {"primary": "#FF5A1F", "accent": "#FFB800", "ink": "#111214", "paper": "#FFFFFF"},
  "options": [ {"label": "Lens R", "why": "One sentence.", "symbol": {"svg": "..."},
                "wordmark": {"font": "inter-800", "case": "upper", "tracking": 0.02},
                "colors": {"primary": "#1F4BFF"}, "colors_name": "Sentinel Blue", "lockup": {"cap_ratio": 0.66}}, ... ]
}
An option may carry "number" to set the number shown on its card (for a second sheet that continues at 6).
Each option shows its horizontal logo in color, the reverse on ink, the app icon, the one color symbol, and 32
and 16 px sizes. "colors" in an option overrides the shared colors.

The candidates sheet shows every wordmark (numbered W1, W2 ...), every symbol (S1, S2 ...) in color, in one
color, white on the primary color as an app icon, and at 32 and 16 px, then any requested lockups.
"""
import argparse, json, os, re, shutil, subprocess, sys, tempfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build_brand as B  # noqa: E402

CSS = """body{margin:0;background:#F4F4F2;font:14px/1.4 -apple-system,Helvetica,Arial,sans-serif;color:#222;width:1600px}
h2{font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#777;margin:22px 24px 10px}
.g{display:grid;gap:10px;padding:0 24px}.w{grid-template-columns:repeat(3,1fr)}.s{grid-template-columns:repeat(3,1fr)}.l{grid-template-columns:repeat(2,1fr)}
.c{background:#fff;border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:8px}
.c b{font:12px Menlo,monospace;color:#C00}.c i{font-style:normal;color:#777;font-size:12px}
.t{height:110px;display:flex;align-items:center;justify-content:center}.t svg{max-width:90%;max-height:70px}
.row{display:flex;align-items:center;gap:14px;justify-content:center}.row>div{display:flex;align-items:center;justify-content:center}
"""


MEASURE = "<script>addEventListener('load',()=>setTimeout(()=>{document.title='H'+Math.ceil(Math.max(...[...document.querySelectorAll('*')].map(e=>e.scrollHeight)))},300))</script>"


def chrome_shot(page_html, out_png, width, height=None, fragment=""):
    """Screenshot an HTML page at full height. height=None measures the page first so nothing is cut off."""
    chrome = B.find_chrome()
    if not chrome:
        sys.exit("Chrome not found. Set CHROME=/path/to/chrome")
    tmp = tempfile.mkdtemp(prefix="prev-")
    try:
        page = os.path.join(tmp, "p.html")
        open(page, "w").write(page_html)
        base = [chrome, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
                "--user-data-dir=" + os.path.join(tmp, "prof"), "--virtual-time-budget=8000"]
        url = "file://" + page + fragment
        if height is None:
            open(page, "w").write(page_html + MEASURE)
            dom = subprocess.run(base + ["--window-size=%d,800" % width, "--dump-dom", url], capture_output=True, text=True, timeout=180).stdout
            m = re.search(r"<title>H(\d+)</title>", dom)
            height = min(int(m.group(1)) + 8, 16000) if m else 5200
            open(page, "w").write(page_html)
        subprocess.run(base + ["--window-size=%d,%d" % (width, height), "--screenshot=" + out_png, url], capture_output=True, timeout=180)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    print(out_png)


def candidates(path):
    c = json.load(open(path))
    name, col = c["name"], c["colors"]
    sc = B.schemes(col)
    html = ["<style>%s</style>" % CSS]
    wmos = []
    if c.get("wordmarks"):
        html.append("<h2>Wordmarks</h2><div class='g w'>")
        for i, wm in enumerate(c["wordmarks"]):
            wmo = B.set_wordmark(dict(wm, _name=name), {})
            wmos.append(wmo)
            tpl, vb = B.comp_wordmark(wmo)
            svg = B.svg_doc(B.paint(tpl, sc["color"]), vb)
            fam = B.list_fonts().get(wm["font"], {}).get("family", wm["font"])
            html.append("<div class=c><b>W%d</b><div class=t>%s</div><i>%s %s, %s, tracking %s</i></div>" % (
                i + 1, svg, fam, wm["font"].rsplit("-", 1)[-1], wm.get("case", "as-is"), wm.get("tracking", 0)))
        html.append("</div>")
    syms = []
    if c.get("symbols"):
        raw = []
        for i, s in enumerate(c["symbols"]):
            B.check_symbol(s, "symbol %d" % (i + 1))
            raw.append(B.Uniq.ids(s))
        syms = B.normalize_symbols(raw)
        html.append("<h2>Symbols</h2><div class='g s'>")
        for i, s in enumerate(syms):
            tpl, vb = B.comp_symbol(s)
            col_svg = B.svg_doc(B.paint(tpl, sc["color"]), vb)
            mono = B.svg_doc(B.paint(tpl, sc["black"]), vb)
            app = B.svg_doc(B.paint(B.comp_appicon(s, 0.2)[0], dict(sc["on-primary"], **{"{BG}": col["primary"]})), (0, 0, 100, 100), 0)
            html.append("<div class=c><b>S%d</b><div class=row><div style='width:96px;height:96px'>%s</div><div style='width:96px;height:96px'>%s</div>"
                        "<div style='width:72px;height:72px'>%s</div><div style='width:32px;height:32px'>%s</div><div style='width:16px;height:16px'>%s</div></div></div>" % (
                            i + 1, col_svg.replace("<svg ", "<svg style='width:100%;height:100%' "), mono.replace("<svg ", "<svg style='width:100%;height:100%' "),
                            app.replace("<svg ", "<svg style='width:100%;height:100%' "), app.replace("<svg ", "<svg style='width:100%;height:100%' "),
                            mono.replace("<svg ", "<svg style='width:100%;height:100%' ")))
        html.append("</div>")
    if c.get("lockups") and syms and wmos:
        html.append("<h2>Lockups</h2><div class='g l'>")
        for lk in c["lockups"]:
            s, w = syms[lk["symbol"]], wmos[lk["wordmark"]]
            tpl, vb = B.comp_horizontal(s, w, lk)
            html.append("<div class=c><b>S%d + W%d</b><div class=t style='height:150px'>%s</div></div>" % (
                lk["symbol"] + 1, lk["wordmark"] + 1, B.svg_doc(B.paint(tpl, sc["color"]), vb)))
        html.append("</div>")
    out = os.path.splitext(path)[0] + ".png"
    chrome_shot("<!doctype html><meta charset=utf-8>" + "".join(html), out, 1600)


OPT_CSS = """body{margin:0;background:#F4F4F2;font:15px/1.45 -apple-system,Helvetica,Arial,sans-serif;color:#1A1A1C;width:1600px}
header{padding:32px 32px 8px}header h1{margin:0;font-size:26px}header p{margin:6px 0 0;color:#666}
.o{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;padding:20px 32px 32px}
.k{background:#fff;border-radius:18px;padding:22px;display:flex;flex-direction:column;gap:16px}
.h{display:flex;align-items:baseline;gap:12px}.n{background:#1A1A1C;color:#fff;border-radius:999px;font-weight:700;
min-width:34px;height:34px;display:flex;align-items:center;justify-content:center;font-size:16px}
.h b{font-size:18px}.hero{height:170px;border-radius:12px;background:#FAFAF8;display:flex;align-items:center;justify-content:center}
.hero svg{max-width:78%;max-height:84px}.strip{display:grid;grid-template-columns:2fr 1fr 1fr;gap:10px}
.tile{height:110px;border-radius:12px;display:flex;align-items:center;justify-content:center;gap:16px}
.tile svg{max-width:80%;max-height:46px}.sw{display:flex;gap:8px;align-items:center;color:#666;font-size:13px}
.sw span{width:18px;height:18px;border-radius:6px;display:inline-block;border:1px solid #0001}.why{color:#444}
"""


def options(path):
    """Render a few finished directions side by side so the user can choose one before the full kit is built."""
    c = json.load(open(path))
    name, base_col, opts = c["name"], c.get("colors", {}), c["options"]
    raw = []
    for i, o in enumerate(opts):
        B.check_symbol(o["symbol"]["svg"], "option %d symbol" % (i + 1))
        raw.append(B.Uniq.ids(o["symbol"]["svg"]))
    syms = B.normalize_symbols(raw)
    cards = []
    for i, (o, s) in enumerate(zip(opts, syms)):
        col = dict(base_col, **o.get("colors", {}))
        sc = B.schemes(col)
        wmo = B.set_wordmark(dict(o["wordmark"], _name=name), {})
        tpl, vb = B.comp_horizontal(s, wmo, o.get("lockup", {}))
        hero = B.svg_doc(B.paint(tpl, sc["color"]), vb)
        rev = B.svg_doc(B.paint(tpl, sc["reverse"]), vb)
        on = "#FFFFFF" if B.contrast("#FFFFFF", col["primary"]) >= 2.5 else col.get("ink", "#0E0E10")
        app_m = {k: on for k in ("{S1}", "{S2}", "{S3}", "{W}", "{WA}")} | {"{BG}": col["primary"]}
        app = B.svg_doc(B.paint(B.comp_appicon(s, 0.2)[0], app_m), (0, 0, 100, 100), 0)
        mono = B.svg_doc(B.paint(B.comp_symbol(s)[0], sc["black"]), B.comp_symbol(s)[1])
        fit = "<svg style='width:100%;height:100%' "
        swatches = "".join("<span style='background:%s'></span>%s" % (col[k], col[k]) for k in ("primary", "ink") if k in col)
        cards.append(
            "<div class=k><div class=h><div class=n>%d</div><b>%s</b></div><div class=hero>%s</div>"
            "<div class=strip><div class=tile style='background:%s'>%s</div>"
            "<div class=tile style='background:#FAFAF8'><div style='width:44px;height:44px'>%s</div><div style='width:44px;height:44px'>%s</div></div>"
            "<div class=tile style='background:#FAFAF8'><div style='width:32px;height:32px'>%s</div><div style='width:16px;height:16px'>%s</div></div></div>"
            "<div class=sw>%s %s</div><div class=why>%s</div></div>" % (
                o.get("number", i + 1), o.get("label", "Option %d" % o.get("number", i + 1)), hero, col.get("ink", "#0E0E10"), rev,
                app.replace("<svg ", fit), mono.replace("<svg ", fit), app.replace("<svg ", fit), mono.replace("<svg ", fit),
                swatches, ("&nbsp; " + o["colors_name"]) if o.get("colors_name") else "", o.get("why", "")))
    page = ("<!doctype html><meta charset=utf-8><title>%s options</title><style>%s</style><header><h1>%s: choose a direction</h1>"
            "<p>Reply with the number you like (or mix parts, for example the symbol of 2 with the type of 1). The full kit is built only for your choice.</p></header>"
            "<div class=o>%s</div>") % (name, OPT_CSS, name, "".join(cards))
    base = os.path.splitext(path)[0]
    open(base + ".html", "w").write(page)
    chrome_shot(page, base + ".png", 1600)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--candidates")
    ap.add_argument("--options", help="options.json: 3 to 5 finished directions to show the user before building")
    ap.add_argument("--board")
    ap.add_argument("--height", type=int, help="board screenshot height in px (default: the whole page)")
    ap.add_argument("--theme", choices=("light", "dark", "auto"), default="light", help="board theme (default light)")
    ap.add_argument("--width", type=int, default=1440)
    a = ap.parse_args()
    if a.candidates:
        candidates(a.candidates)
    if a.options:
        options(a.options)
    if a.board:
        out = os.path.join(os.path.dirname(os.path.abspath(a.board)), "board.png")
        frag = "" if a.theme == "auto" else "#" + a.theme
        chrome_shot(open(a.board).read(), out, a.width, a.height, frag)


if __name__ == "__main__":
    main()
