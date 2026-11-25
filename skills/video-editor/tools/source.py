#!/usr/bin/env python3
"""Find, download, measure and pick real music, sound effects and footage for an edit. No account, no API key.

  source.py music  --job JOB --mood energetic,propulsive --genre electronic --bpm 115-135 --need 70 [--n 6]
      Searches Mixkit, Incompetech and Openverse (Jamendo), downloads the best N, measures each one
      (BPM, beat strength, loudness, intro length, dips, the biggest lift), ranks them, writes music/ranking.json.
  source.py sfx    --job JOB click typing notification whoosh [--n 2]
      Searches Mixkit and Openverse (Freesound, CC0/CC BY). Saves the N best per word, trimmed to the onset.
  source.py video  --job JOB "rocket launch" [--from stock,nasa,commons,archive] [--n 4] [--max-mb 250]
      Real footage. stock = Mixkit. nasa, commons and archive = historical, public domain or Creative Commons.
  source.py youtube --job JOB "apollo 11 launch" [--n 4]          CC BY videos only (search + download)
  source.py youtube --job JOB --url URL --section 61-69 --third-party "why this clip"
      A short excerpt (12 s max) of someone else's video. Use only when the brief asks for that clip or speech.
      It is logged as UNLICENSED and must be listed in the delivery note.
  source.py phrase --job JOB FILE "we choose to go to the moon" [--pad 0.15]
      Transcribes FILE with word times, finds the phrase and cuts that moment out (picture + sound).
  source.py credits --job JOB       Print the licence log and the credit lines that must be published.

Everything lands in work/JOB/assets/{music,sfx,video}/ and every download adds a row to work/JOB/assets/licences.json.
"""
import argparse, html, json, math, os, re, subprocess, sys, tempfile, time, urllib.error, urllib.parse, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BOT = "video-editor-asset-finder/1.0"      # Wikimedia asks automated clients to identify themselves and refuses fake browsers
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36"
MIXKIT = "Mixkit Free License (commercial use, no credit needed)"
CAP = 8          # downloads per call: Mixkit forbids bulk downloading, so stay at what one edit needs
WHISPER = [os.environ.get("VO_WHISPER_MODEL", ""), os.path.expanduser("~/.config/atticus/whisper/ggml-large-v3-turbo-q5_0.bin"),
           os.path.expanduser("~/.cache/openwhispr/whisper-models/ggml-small.bin"),
           os.path.join(os.path.dirname(os.path.abspath(__file__)), "voice/models/ggml-small.en.bin")]


# ---------------------------------------------------------------- plumbing
def opener(url, timeout):
    wiki = "wikimedia.org" in url
    for k in range(3):
        time.sleep(1.5 if wiki else 0.4)
        try: return urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": BOT if wiki else UA}), timeout=timeout)
        except urllib.error.HTTPError as e:
            if e.code != 429 or k == 2: raise
            time.sleep(min(30, int(e.headers.get("Retry-After") or 8)))


def get(url, binary=False, timeout=40):
    with opener(url, timeout) as r:
        d = r.read()
    return d if binary else d.decode("utf8", "replace")


def jget(url):
    return json.loads(get(url))


def warn(name, e):
    print(f"  ! {name}: {str(e)[:120]}", file=sys.stderr)


def adir(job, kind):
    d = os.path.join(ROOT, "work", job, "assets", kind); os.makedirs(d, exist_ok=True); return d


def slug(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")[:60] or "x"


def log(job, **row):
    p = os.path.join(ROOT, "work", job, "assets", "licences.json"); os.makedirs(os.path.dirname(p), exist_ok=True)
    rows = json.load(open(p)) if os.path.exists(p) else []
    rows = [r for r in rows if r["file"] != row["file"]] + [row]
    json.dump(rows, open(p, "w"), indent=1)


def fetch(url, path, max_mb=250):
    if os.path.exists(path) and os.path.getsize(path) > 10000: return True
    with opener(url, 60) as r:
        n = int(r.headers.get("Content-Length") or 0)
        if n > max_mb * 1e6: print(f"  skip {os.path.basename(path)}: {n/1e6:.0f} MB > {max_mb}"); return False
        ct = r.headers.get("Content-Type", "")
        if "html" in ct: print(f"  skip {url}: got a web page"); return False
        with open(path + ".part", "wb") as f:
            got = 0
            while True:
                b = r.read(1 << 18)
                if not b: break
                got += len(b)
                if got > max_mb * 1e6: f.close(); os.remove(path + ".part"); print("  skip: too big"); return False
                f.write(b)
    os.replace(path + ".part", path)
    if not probe(path): os.remove(path); return False      # must really be media
    return True


def probe(path):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration:stream=codec_type,width,height", "-of", "json", path],
                       capture_output=True, text=True)
    try: d = json.loads(r.stdout)
    except Exception: return None
    if not d.get("streams"): return None
    v = [s for s in d["streams"] if s["codec_type"] == "video"]
    return {"dur": float(d.get("format", {}).get("duration") or 0), "w": v[0].get("width") if v else 0, "h": v[0].get("height") if v else 0,
            "audio": any(s["codec_type"] == "audio" for s in d["streams"])}


# ---------------------------------------------------------------- measuring music
def pcm(path, sr=22050):
    import numpy as np
    r = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", str(sr), "-f", "f32le", "-"], capture_output=True)
    return np.frombuffer(r.stdout, dtype=np.float32), sr


def analyse(path):
    import numpy as np
    x, sr = pcm(path)
    if len(x) < sr * 5: return None
    hop, win = 512, 2048
    n = 1 + (len(x) - win) // hop
    idx = np.arange(win)[None, :] + hop * np.arange(n)[:, None]
    mag = np.empty((n, win // 2 + 1), np.float32); w = np.hanning(win).astype(np.float32)
    for a in range(0, n, 2000): mag[a:a + 2000] = np.abs(np.fft.rfft(x[idx[a:a + 2000]] * w, axis=1))
    lm = np.log1p(10 * mag); fl = np.maximum(0, np.diff(lm, axis=0)).mean(1); fl = np.concatenate([[0], fl])
    fps = sr / hop
    loc = np.convolve(fl, np.ones(int(fps)) / int(fps), "same"); on = np.maximum(0, fl - loc)
    best = []
    for bpm in np.arange(70, 180.01, 0.25):
        s = 0
        for k, g in ((1, 1.0), (2, .5), (4, .5)):
            lag = k * 60 / bpm * fps; f = int(lag); fr = lag - f
            if f + 1 >= len(on): continue
            s += g * float((on[:-f - 1] * ((1 - fr) * on[f:-1] + fr * on[f + 1:])).mean())
        best.append((s * math.exp(-0.5 * (math.log2(bpm / 122) / 0.7) ** 2), bpm))
    s, bpm = max(best); strength = s / (2 * float((on ** 2).mean()) + 1e-12)
    # one-second level curve, low end share
    k = int(sr); sec = len(x) // k
    rms = np.array([20 * np.log10(np.sqrt((x[i * k:(i + 1) * k] ** 2).mean()) + 1e-6) for i in range(sec)])
    lo = mag[:, :int(150 * win / sr)].sum(1) / (mag.sum(1) + 1e-9)
    lift = (0, 0.0)
    for i in range(3, sec - 4):
        d = rms[i:i + 4].mean() - rms[max(0, i - 3):i].mean()
        if d > lift[1]: lift = (i, float(d))
    loud = np.percentile(rms, 90); intro = int(next((i for i in range(sec) if rms[i] > loud - 4), 0))
    r = subprocess.run(["ffmpeg", "-nostats", "-i", path, "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
    I = re.findall(r"I:\s+(-?[\d.]+) LUFS", r)
    # first beat phase: the grid offset with the most onset energy
    per = 60 / bpm * fps; ph = max(np.arange(0, per, 1), key=lambda p: on[np.clip((p + per * np.arange(int(len(on) / per) - 1)).astype(int), 0, len(on) - 1)].sum())
    ev = float((np.diff(np.sign(on - on.mean() * 2.5)) > 0).sum() / (len(x) / sr) * 60)
    return {"dur": round(len(x) / sr, 1), "bpm": round(float(bpm), 2), "beat_strength": round(float(strength), 2), "lufs": float(I[-1]) if I else None,
            "first_beat": round(float(ph / fps), 3), "intro_s": intro, "lift_at": lift[0], "lift_db": round(lift[1], 1),
            "dips": [int(i) for i in range(2, sec - 2) if rms[i] < np.median(rms) - 6][:12], "bass_share": round(float(lo.mean()), 3),
            "events_per_min": round(ev), "range_db": round(float(np.percentile(rms, 95) - np.percentile(rms, 10)), 1),
            "curve": " ".join(str(int(round(v))) for v in rms[:180])}


def score(a, lo, hi, need):
    s = 0.0; b = a["bpm"]
    near = min(abs(b * m - min(max(b * m, lo), hi)) / 10 for m in (0.5, 1, 2))
    s -= 1.6 * min(near, 2)
    s += 2.0 * min(a["beat_strength"], 1.0)                       # a clear pulse to cut on
    s += 0.14 * min(a["lift_db"], 12)                             # something to turn on
    s += 1.0 if a["bass_share"] > 0.16 else 0
    s += min(a["events_per_min"], 220) / 220
    s += 0.5 if a["range_db"] >= 4 else -0.3                      # some shape, not a flat loop
    s -= 1.5 if a["dur"] < need else 0
    s -= 0.05 * max(0, a["intro_s"] - 12)
    return round(s, 2)


# ---------------------------------------------------------------- Mixkit
def mixkit_audio(kind, paths, limit=40):
    out = []
    for p in paths:
        try: s = get(f"https://mixkit.co/{kind}/{p}")
        except Exception as e: warn("mixkit " + p, e); continue
        for card in s.split('data-test-id="audio-player"')[1:limit + 1]:
            u = re.search(r'preview-url-value="([^"]+)"', card); t = re.search(r'card__title">\s*(.*?)\s*<', card, re.S)
            d = re.search(r'data-test-id="duration">\s*(\d+):(\d+)', card); by = re.search(r"by ([^<\n]+)", card)
            if not u or not t: continue
            tags = re.findall(r'meta-links__link"[^>]*>([^<]+)<', card)
            out.append({"url": html.unescape(u[1]), "title": html.unescape(t[1]), "dur": int(d[1]) * 60 + int(d[2]) if d else 0, "by": (by[1].strip() if by else "Mixkit"),
                        "tags": tags, "source": "Mixkit", "licence": MIXKIT, "page": "https://mixkit.co/" + kind + "/" + p})
    seen, u = set(), []
    for c in out:
        if c["url"] not in seen: seen.add(c["url"]); u.append(c)
    return u


def incompetech(moods, lo, hi, need):
    """Kevin MacLeod, CC BY 4.0: needs a credit line."""
    try: data = jget("https://incompetech.com/music/royalty-free/pieces.json")
    except Exception as e: warn("incompetech", e); return []
    out = []
    for p in data:
        try: bpm = float(p["bpm"])
        except Exception: continue
        h, m, s = (p["length"] or "0:0:0").split(":"); dur = int(h) * 3600 + int(m) * 60 + int(s)
        feel = ((p.get("feel") or "") + " " + (p.get("description") or "") + " " + (p.get("instruments") or "")).lower()
        hit = sum(w in feel for w in moods)
        if not (lo <= bpm <= hi) or dur < need or not hit: continue
        out.append({"url": "https://incompetech.com/music/royalty-free/mp3-royaltyfree/" + urllib.parse.quote(p["filename"]), "title": p["title"], "dur": dur, "by": "Kevin MacLeod",
                    "tags": [p.get("feel") or ""], "source": "Incompetech", "licence": "CC BY 4.0", "hit": hit, "page": "https://incompetech.com",
                    "credit": f'"{p["title"]}" Kevin MacLeod (incompetech.com), licensed under CC BY 4.0'})
    return sorted(out, key=lambda c: -c["hit"])


def openverse(q, category, need=0, licence="cc0,by"):
    u = "https://api.openverse.org/v1/audio/?" + urllib.parse.urlencode({"q": q, "license": licence, "category": category, "page_size": 20})
    try: r = jget(u)["results"]
    except Exception as e: warn("openverse", e); return []
    out = []
    for p in r:
        d = (p.get("duration") or 0) / 1000
        if need and d < need: continue
        lic = p["license"].upper(); lic = "CC0" if lic == "CC0" else f"CC {lic} {p.get('license_version') or ''}".strip()
        out.append({"url": p["url"], "title": p["title"], "dur": d, "by": p.get("creator") or "", "tags": [t["name"] for t in p.get("tags") or []][:8],
                    "source": p.get("provider"), "licence": lic, "page": p.get("foreign_landing_url"),
                    "credit": None if lic == "CC0" else f'"{p["title"]}" {p.get("creator")}, {lic}'})
    return out


# ---------------------------------------------------------------- commands
def cmd_music(a):
    lo, hi = [float(v) for v in a.bpm.split("-")]
    moods = [m.strip().lower() for m in a.mood.split(",") if m.strip()]; genres = [g.strip().lower() for g in a.genre.split(",") if g.strip()]
    cands = mixkit_audio("free-stock-music", [f"mood/{slug(m)}/" for m in moods] + [f"{slug(g)}/" for g in genres] + [f"tag/{slug(t)}/" for t in a.tag.split(",") if t])
    want = set(moods) | set(genres)
    for c in cands: c["hit"] = len(want & {t.lower() for t in c["tags"]}) * 2 + (1 if c["dur"] >= a.need else -2)
    cands = [c for c in cands if not ({t.lower() for t in c["tags"]} & {v.strip().lower() for v in a.avoid.split(",") if v})]
    inc = incompetech(moods, lo, hi, a.need)[:4]
    ov = openverse(" ".join((moods[:1] + genres[:1])), "music", a.need)[:4]
    pool = sorted(cands, key=lambda c: -c["hit"])[:max(2, a.n - 3)] + inc[:2] + ov[:2]
    d = adir(a.job, "music"); out = []
    for c in pool[:min(max(a.n, 3), CAP)]:
        f = os.path.join(d, slug(c["source"] + "-" + c["title"]) + ".mp3")
        try:
            if not fetch(c["url"], f, 40): continue
        except Exception as e: warn(c["title"], e); continue
        m = analyse(f)
        if not m: continue
        m.update(title=c["title"], by=c["by"], source=c["source"], licence=c["licence"], credit=c.get("credit"), tags=c["tags"][:8], file=os.path.relpath(f, ROOT))
        m["score"] = score(m, lo, hi, a.need); out.append(m)
        log(a.job, file=m["file"], kind="music", title=c["title"], by=c["by"], source=c["source"], licence=c["licence"], credit=c.get("credit"), page=c.get("page"))
        print(f'  {m["score"]:5.2f}  {m["bpm"]:6.1f} bpm  pulse {m["beat_strength"]:.2f}  lift +{m["lift_db"]} dB @ {m["lift_at"]}s  intro {m["intro_s"]}s  {m["dur"]}s  {c["title"]} ({c["source"]}, {c["licence"]})')
    out.sort(key=lambda m: -m["score"]); json.dump(out, open(os.path.join(d, "ranking.json"), "w"), indent=1)
    if out: print("PICK:", out[0]["file"])
    else: sys.exit("no usable track: widen --mood/--genre/--bpm")


def onset(path):
    import numpy as np
    x, sr = pcm(path, 16000)
    if not len(x): return 0.0, 0.0
    e = np.sqrt(np.convolve(x ** 2, np.ones(160) / 160, "same")); pk = e.max()
    i = int(np.argmax(e > pk * 0.12)); return max(0, i / sr - 0.004), float(np.argmax(e) / sr)


def cmd_sfx(a):
    d = adir(a.job, "sfx")
    for w in a.words[:15]:
        c = mixkit_audio("free-sound-effects", [slug(w) + "/"], 12) or mixkit_audio("free-sound-effects", [f"discover/{slug(w)}/"], 12)
        if a.long: c = sorted(c, key=lambda x: -x["dur"])
        c += openverse(w, "sound_effect", 0, "cc0")
        got = 0
        for x in c:
            if got >= a.n: break
            f = os.path.join(d, slug(w) + f"-{got+1}-" + slug(x["title"])[:30] + ".mp3")
            try:
                if not fetch(x["url"], f, 12): continue
            except Exception as e: warn(x["title"], e); continue
            s, pk = onset(f); got += 1; inf = probe(f)
            log(a.job, file=os.path.relpath(f, ROOT), kind="sfx", title=x["title"], by=x["by"], source=x["source"], licence=x["licence"], credit=x.get("credit"), onset=round(s, 3), peak=round(pk, 3))
            print(f'  {w:14s} {os.path.basename(f)}  {inf["dur"]:.2f}s  onset {s:.3f}  peak {pk:.3f}  ({x["source"]}, {x["licence"]})')
        if not got: print(f"  {w}: nothing found, try a synonym")


def save_video(a, name, url, meta):
    ext = os.path.splitext(urllib.parse.urlparse(url).path)[1] or ".mp4"
    f = os.path.join(adir(a.job, "video"), slug(name) + ext)
    try:
        if not fetch(url, f, a.max_mb): return False
    except Exception as e: warn(name, e); return False
    i = probe(f); rel = os.path.relpath(f, ROOT); log(a.job, file=rel, kind="video", **meta)
    sheet = f + ".jpg"; step = max(i["dur"] / 24, 0.2)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f, "-vf", f"fps=1/{step:.3f},scale=320:-2,tile=6x4", "-frames:v", "1", sheet])
    print(f'  {rel}  {i["w"]}x{i["h"]}  {i["dur"]:.1f}s  {"sound" if i["audio"] else "silent"}  {meta["licence"]}  sheet: {os.path.basename(sheet)}')
    return True


def cmd_video(a):
    srcs = a.src.split(","); left = min(a.n, CAP)
    per = max(1, math.ceil(left / len(srcs)))
    for src in srcs:
        got = 0
        try:
            if src == "stock":
                s = ""
                for p in (slug(a.q) + "/", "discover/" + slug(a.q) + "/"):
                    try: s = get("https://mixkit.co/free-stock-video/" + p); break
                    except Exception as e: warn("mixkit " + p, e)
                ids = []
                for m in re.finditer(r"assets\.mixkit\.co/videos/(\d+)/", s):
                    if m[1] not in ids: ids.append(m[1])
                names = dict((m[2], m[1]) for m in re.finditer(r'/free-stock-video/([a-z0-9-]+)-(\d+)/', s))
                for i in ids:
                    if got >= per: break
                    for q in ("1080", "720"):
                        if save_video(a, f"stock-{names.get(i, a.q)}-{i}", f"https://assets.mixkit.co/videos/{i}/{i}-{q}.mp4",
                                      dict(title=names.get(i, a.q), by="Mixkit", source="Mixkit", licence=MIXKIT, credit=None, page=f"https://mixkit.co/free-stock-video/{names.get(i,'')}-{i}/")):
                            got += 1; break
            elif src == "nasa":
                r = jget("https://images-api.nasa.gov/search?" + urllib.parse.urlencode({"q": a.q, "media_type": "video", "page_size": 12}))["collection"]["items"]
                for it in r:
                    if got >= per: break
                    files = json.loads(get(it["href"].replace("http://", "https://").replace(" ", "%20")))
                    mp4 = [f for f in files if f.endswith(".mp4")]
                    pick = next((f for k in ("~large", "~medium", "~orig") for f in mp4 if k in f), mp4[0] if mp4 else None)
                    if pick and save_video(a, "nasa-" + it["data"][0]["title"], pick.replace("http://", "https://").replace(" ", "%20"),
                                           dict(title=it["data"][0]["title"], by="NASA", source="NASA", licence="Public domain (NASA media guidelines: no logo or astronaut endorsement)", credit="Footage: NASA", page=it["href"])): got += 1
            elif src == "commons":
                u = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode({"action": "query", "generator": "search", "gsrsearch": "filetype:video " + a.q, "gsrnamespace": 6, "gsrlimit": 15,
                     "prop": "videoinfo", "viprop": "url|extmetadata|size|derivatives", "format": "json"})
                pages = sorted(jget(u).get("query", {}).get("pages", {}).values(), key=lambda p: p["index"])
                for p in pages:
                    if got >= per: break
                    vi = (p.get("videoinfo") or [{}])[0]; em = vi.get("extmetadata", {}); lic = em.get("LicenseShortName", {}).get("value", "?")
                    if not re.search(r"public domain|^PD|CC0|CC BY(?! ?-?NC)", lic, re.I) or re.search(r"\bSA\b|NC|ND", lic): continue   # share-alike would bind the whole edit
                    der = [x for x in vi.get("derivatives", []) if "webm" in x.get("type", "") and (x.get("height") or 0) <= 1080]
                    url = max(der, key=lambda x: x.get("height") or 0)["src"] if der else vi["url"]
                    by = re.sub("<[^>]+>", "", em.get("Artist", {}).get("value", ""))[:80]
                    if save_video(a, "commons-" + p["title"][5:], url, dict(title=p["title"], by=by, source="Wikimedia Commons", licence=lic, credit=None if re.search("domain|CC0|PD", lic, re.I) else f"{by}, {lic}, via Wikimedia Commons", page=vi.get("descriptionurl"))): got += 1
            elif src == "archive":
                q = f'({a.q}) AND mediatype:movies AND (collection:prelinger OR licenseurl:*publicdomain* OR collection:usgovfilms OR collection:newsandpublicaffairs AND licenseurl:*publicdomain*)'
                u = "https://archive.org/advancedsearch.php?" + urllib.parse.urlencode({"q": q, "fl[]": "identifier", "rows": 10, "output": "json", "sort[]": "downloads desc"})
                for doc in jget(u)["response"]["docs"]:
                    if got >= per: break
                    m = jget("https://archive.org/metadata/" + doc["identifier"]); md = m["metadata"]
                    fs = sorted([f for f in m["files"] if f["name"].endswith(".mp4") and float(f.get("size", 0)) < a.max_mb * 1e6], key=lambda f: -float(f.get("size", 0)))
                    if not fs: continue
                    lic = md.get("licenseurl") or "Prelinger / public domain collection (check the item page)"
                    if save_video(a, "archive-" + doc["identifier"], f'https://archive.org/download/{doc["identifier"]}/' + urllib.parse.quote(fs[0]["name"]),
                                  dict(title=md.get("title"), by=str(md.get("creator", "")), source="Internet Archive", licence=lic, credit=None, page="https://archive.org/details/" + doc["identifier"])): got += 1
        except Exception as e: warn(src, e)
        if not got: print(f"  {src}: nothing usable for '{a.q}'")


def cmd_youtube(a):
    d = adir(a.job, "video"); base = ["yt-dlp", "--no-playlist", "--no-warnings", "-f", "bv*[height<=1080]+ba/b[height<=1080]", "--merge-output-format", "mp4"]
    if a.url:
        if not a.third_party or not a.section: sys.exit("--url needs --section A-B (12 s max) and --third-party 'reason'")
        s, e = [float(v) for v in a.section.split("-")]
        if e - s > 12: sys.exit("excerpt longer than 12 s")
        inf = json.loads(subprocess.run(["yt-dlp", "--no-warnings", "-J", a.url], capture_output=True, text=True).stdout)
        f = os.path.join(d, slug("yt-" + inf["title"]) + f"-{int(s)}.mp4"); cc = "creative commons" in (inf.get("license") or "").lower()
        subprocess.run(base + ["--download-sections", f"*{s}-{e}", "--force-keyframes-at-cuts", "-o", f, a.url], check=True)
        log(a.job, file=os.path.relpath(f, ROOT), kind="video", title=inf["title"], by=inf.get("uploader"), source="YouTube", page=a.url,
            licence="CC BY" if cc else "UNLICENSED excerpt of a third-party video (" + a.third_party + ")", credit=f'{inf["title"]}, {inf.get("uploader")}' if cc else None)
        print("  saved", os.path.relpath(f, ROOT), "CC BY" if cc else "UNLICENSED: list it in the delivery note"); return
    u = "https://www.youtube.com/results?" + urllib.parse.urlencode({"search_query": a.q, "sp": "EgIwAQ=="})      # YouTube's Creative Commons filter
    r = subprocess.run(["yt-dlp", "--flat-playlist", "--no-warnings", "-J", "--playlist-end", "12", u], capture_output=True, text=True)
    n = 0
    for e in (json.loads(r.stdout or "{}").get("entries") or []):
        if n >= min(a.n, CAP) or (e.get("duration") or 0) > 1800: continue
        inf = json.loads(subprocess.run(["yt-dlp", "--no-warnings", "-J", e["url"]], capture_output=True, text=True).stdout or "{}")
        if "creative commons" not in (inf.get("license") or "").lower(): continue
        f = os.path.join(d, slug("yt-" + inf["title"]) + ".mp4"); subprocess.run(base + ["--max-filesize", f"{a.max_mb}M", "-o", f, e["url"]])
        if os.path.exists(f):
            n += 1; log(a.job, file=os.path.relpath(f, ROOT), kind="video", title=inf["title"], by=inf.get("uploader"), source="YouTube", licence="CC BY 3.0 (as marked by the uploader)", credit=f'{inf["title"]}, {inf.get("uploader")}, CC BY', page=e["url"])
            print("  saved", os.path.relpath(f, ROOT), inf.get("uploader"))
    if not n: print("  no CC BY result. Try nasa, commons or archive.")


def words(path):
    m = next((w for w in WHISPER if w and os.path.exists(w)), None)
    if not m: sys.exit("no whisper model")
    with tempfile.TemporaryDirectory() as td:
        w = os.path.join(td, "a.wav"); subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", path, "-ar", "16000", "-ac", "1", w], check=True)
        subprocess.run(["whisper-cli", "-m", m, "-f", w, "-oj", "-of", os.path.join(td, "t"), "-np", "-l", "en", "-ml", "1", "-sow"], capture_output=True)
        seg = json.load(open(os.path.join(td, "t.json")))["transcription"]
    return [(s["offsets"]["from"] / 1000, s["offsets"]["to"] / 1000, s["text"].strip()) for s in seg if s["text"].strip()]


def cmd_phrase(a):
    norm = lambda s: re.sub(r"[^a-z0-9']", "", s.lower())
    ws = words(a.file); want = [norm(w) for w in a.text.split()]; toks = [norm(w[2]) for w in ws]; best = (0, 0)
    for i in range(len(toks) - len(want) + 1):
        m = sum(x == y for x, y in zip(toks[i:i + len(want)], want)) / len(want)
        if m > best[0]: best = (m, i)
    if best[0] < 0.6: sys.exit(f"not found (best match {best[0]:.0%}). Heard: " + " ".join(w[2] for w in ws)[:1500])
    sel = ws[best[1]:best[1] + len(want)]; s = max(0, sel[0][0] - a.pad); e = sel[-1][1] + a.pad
    out = os.path.join(adir(a.job, "video"), "phrase-" + slug(a.text)[:40] + ".mp4")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{s:.3f}", "-to", f"{e:.3f}", "-i", a.file, "-c:v", "libx264", "-crf", "14", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "256k", out], check=True)
    json.dump({"src": a.file, "in": s, "out": e, "words": [[round(w[0] - s, 3), round(w[1] - s, 3), w[2]] for w in sel]}, open(out + ".words.json", "w"), indent=1)
    p = os.path.join(ROOT, "work", a.job, "assets", "licences.json")
    for r in (json.load(open(p)) if os.path.exists(p) else []):
        if os.path.abspath(os.path.join(ROOT, r["file"])) == os.path.abspath(a.file): log(a.job, **{**r, "file": os.path.relpath(out, ROOT)}); break
    print(f"  {os.path.relpath(out, ROOT)}  {e-s:.2f}s  match {best[0]:.0%}  word times in .words.json")

