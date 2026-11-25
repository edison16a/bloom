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


def main():
    ap = argparse.ArgumentParser()
    for k in ("set", "kind", "cont", "style", "type", "case", "weight", "track", "custom", "family", "source", "category", "brand"):
        ap.add_argument("--" + k)
    ap.add_argument("--craft", type=int, default=0)
    ap.add_argument("--simple", type=int, default=5)
    ap.add_argument("--n", type=int, default=40)
    ap.add_argument("--seed", type=int, default=0)
    ap.add_argument("--out", default=os.path.join(ROOT, "out", "_refs", "refs.png"))
    a = ap.parse_args()
    rows = [r for r in csv.DictReader(open(os.path.join(ROOT, "research", "logos.csv"))) if r["labeled"]]

    def norm(x):
        return "".join(ch for ch in x.lower() if ch.isalnum())

    terms = [norm(b) for b in (a.brand or "").split(",") if norm(b)]
    exact = {t for t in terms if any(t in (norm(r["brand"]), norm(r["key"])) for r in rows)}

    def brand_ok(r):  # an exact brand name wins over a substring ("chime" is Chime, not Amazon Chime)
        names = (norm(r["brand"]), norm(r["key"]))
        return any(t in names if t in exact else t in names[0] for t in terms)

    def light(hx):
        hx = (hx or "").lstrip("#")
        return len(hx) == 6 and sum(int(hx[i:i + 2], 16) for i in (0, 2, 4)) > 3 * 225

    def ok(r):
        is_word = bool(r["l_type"])
        if a.set == "word" and not is_word or a.set == "mark" and is_word:
            return False
        for k in ("kind", "cont", "style", "type", "case", "weight", "track", "custom"):
            v = getattr(a, k)
            if v and r["l_" + k] not in v.split(","):
                return False
        if a.family and r["brand_family"] not in a.family.split(","):
            return False
        if a.source and r["source"] not in a.source.split(","):
            return False
        if a.category and a.category.lower() not in r["category"].lower():
            return False
        if a.brand and not brand_ok(r):
            return False
        if int(r["l_craft"] or 0) < a.craft or int(r["l_simple"] or 5) > a.simple:
            return False
        return os.path.exists(os.path.join(ROOT, "research", "cache", r["file"]))

    hits = [r for r in rows if ok(r)]
    if not hits:
        sys.exit("No matches (or the cache is missing: python3 -I scripts/collect_logos.py --skip-wd)")
    random.Random(a.seed).shuffle(hits)
    hits.sort(key=lambda r: light(r["dominant_hex"]))  # stable: a dark or colored variant before a white one
    seen, uniq = set(), []
    for r in hits:  # one logo per brand
        if r["key"] not in seen:
            seen.add(r["key"])
            uniq.append(r)
    if len(uniq) < a.n:
        print("note: only %d brands match these filters (asked for %d); loosen a filter to see more" % (len(uniq), a.n))
    if terms:
        missing = [t for t in terms if not any(t in (norm(r["brand"]), norm(r["key"])) or t in norm(r["brand"]) for r in uniq)]
        if missing:
            print("note: no logo found for: " + ", ".join(missing))
        partial = [t for t in terms if t not in exact and t not in missing]
        if partial:
            print("note: no brand named exactly %s; showing names that contain it" % ", ".join(partial))
    hits = uniq[:a.n]
    word = a.set == "word" or sum(1 for r in hits if r["l_type"]) > len(hits) / 2
    cols, tile, img, width = (5, 120, 70, 1600) if word else (8, 140, 96, 1500)
    cells = []
    for r in hits:
        blob = open(os.path.join(ROOT, "research", "cache", r["file"]), "rb").read()
        cells.append('<div class=c%s><img src="data:%s;base64,%s"><b>%s</b></div>' % (" style=background:#2A2A2C" if light(r["dominant_hex"]) else "", sniff(blob) or "image/png", base64.b64encode(blob).decode(), r["brand"][:28]))
        print("%-28s %-5s kind=%-2s craft=%s simple=%s %s %s %s %s" % (r["brand"][:28], r["source"], r["l_kind"], r["l_craft"], r["l_simple"],
                                                                     r["l_type"], r["l_case"], r["l_track"], r["brand_hex"]))
    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
    tmp = tempfile.mkdtemp(prefix="refs-")
    try:
        page = os.path.join(tmp, "p.html")
        open(page, "w").write(PAGE % (width, cols, tile, img, "".join(cells)))
        h = ((len(hits) + cols - 1) // cols) * (tile + 8) + 16
        subprocess.run([find_chrome(), "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
                        "--user-data-dir=" + os.path.join(tmp, "prof"), "--window-size=%d,%d" % (width, h),
                        "--screenshot=" + os.path.abspath(a.out), "file://" + page], capture_output=True, timeout=120)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    print(a.out)


if __name__ == "__main__":
    main()
