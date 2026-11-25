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

