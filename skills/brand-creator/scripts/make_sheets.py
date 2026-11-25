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


def main():
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument("--extra", help="render only logos missing from the existing manifest, with this sheet name prefix")
    a = ap.parse_args()
    rows = list(csv.DictReader(open(os.path.join(ROOT, "research", "metrics.csv"))))
    old_manifest = []
    if a.extra:
        old_manifest = json.load(open(os.path.join(OUT, "manifest.json")))
        have = {i for m in old_manifest for i in m["ids"]}
        rows = [r for r in rows if r["id"] not in have]
    cat = {r["id"]: r for r in csv.DictReader(open(os.path.join(ROOT, "research", "catalog.csv")))}
    word, mark = [], []
    for r in rows:
        if r.get("err"):
            continue
        asp = float(r["bbox_aspect"] or 1)
        if r["kind"] in ("wordmark", "full") or (r["kind"] == "primary" and asp >= 2.2):
            word.append(r["id"])
        else:
            mark.append(r["id"])
    if not a.extra:
        shutil.rmtree(OUT, ignore_errors=True)
        os.makedirs(OUT)
    chrome = find_chrome()
    tmp = tempfile.mkdtemp(prefix="sheets-")
    manifest = []
    pre = (a.extra + "_") if a.extra else ""
    for set_name, ids, tile_h, img_h, width in ((pre + "word", word, 130, 80, 1900), (pre + "mark", mark, 150, 110, 1500)):
        for n in range(0, len(ids), PER):
            chunk = ids[n:n + PER]
            cells = []
            for i in chunk:
                blob = open(os.path.join(CACHE, cat[i]["file"]), "rb").read()
                mime = sniff(blob) or "image/png"
                cells.append('<div class=c><img src="data:%s;base64,%s"><b>%s</b></div>' % (mime, base64.b64encode(blob).decode(), i))
            page = os.path.join(tmp, "p.html")
            open(page, "w").write(PAGE % (width, COLS, tile_h, img_h, "".join(cells)))
            rows_n = (len(chunk) + COLS - 1) // COLS
            h = rows_n * (tile_h + 6) + 12
            png = os.path.join(OUT, "%s_%03d.png" % (set_name, n // PER))
            subprocess.run([chrome, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
                            "--user-data-dir=" + os.path.join(tmp, "prof"), "--window-size=%d,%d" % (width, h),
                            "--screenshot=" + png, "file://" + page], capture_output=True, timeout=120)
            manifest.append({"sheet": os.path.relpath(png, ROOT), "set": "word" if "word" in set_name else "mark", "ids": chunk})
    shutil.rmtree(tmp, ignore_errors=True)
    json.dump(old_manifest + manifest, open(os.path.join(OUT, "manifest.json"), "w"), indent=1)
    print("sheets:", len(manifest), "word logos:", len(word), "marks:", len(mark))


if __name__ == "__main__":
    main()
