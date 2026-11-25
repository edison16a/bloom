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

