#!/usr/bin/env python3
"""Local AI voiceover: free open-source engines (Qwen3-TTS via mlx-audio, Chatterbox) on this Mac.

  vo.py audition --text "One line" --voices voices.json --out work/<job>/vo/audition
      Render the same line in every voice of voices.json, so the user can pick by ear.
  vo.py gen --script script.txt --voice voices.json:<name> --takes 3 --out work/<job>/vo
      Render every script line N times, then QC each take (re-transcribe, word error, pace, loudness).
  vo.py assemble --dir work/<job>/vo [--pick picks.json] [--gap 0.28]
      Clean the chosen takes (trim, high-pass, de-ess, compress), join them, write vo.wav + words.json.

voices.json: {"name": {"engine": "qwen-design"|"qwen-clone"|"chatterbox", "instruct": "...",
  "ref_audio": "path", "ref_text": "...", "exaggeration": 0.5, "cfg": 0.5, "temperature": null, "speed": 1.0}}
Script: one VO line per non-empty line; lines starting with # are notes. Write it for the ear.
Pronunciation: "# say: Coere = Koh-eer" in the script (or --say "Coere=Koh-eer") respells a word for the engine only;
QC still compares against the real spelling and forgives that word, since whisper can't spell brand names.
"""
import argparse, json, os, re, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
PY = {"qwen": os.path.join(HERE, ".venv-qwen/bin/python"), "cb": os.path.join(HERE, ".venv-cb/bin/python")}
QWEN = {"qwen-design": "mlx-community/Qwen3-TTS-12Hz-1.7B-VoiceDesign-bf16",
        "qwen-clone": "mlx-community/Qwen3-TTS-12Hz-1.7B-Base-bf16"}
WHISPER_MODELS = [os.environ.get("VO_WHISPER_MODEL", ""),
                  os.path.expanduser("~/.config/atticus/whisper/ggml-large-v3-turbo-q5_0.bin"),
                  os.path.expanduser("~/.cache/openwhispr/whisper-models/ggml-small.bin"),
           os.path.join(HERE, "models/ggml-small.en.bin")]


def sh(cmd, **kw):
    return subprocess.run(cmd, capture_output=True, text=True, **kw)


def load_voice(spec):
    path, _, name = spec.partition(":")
    voices = json.load(open(path))
    if not name: name = next(iter(voices))
    v = dict(voices[name]); v["name"] = name
    for k in ("ref_audio",):
        if v.get(k): v[k] = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(path)), v[k]))
    return v


def render(voice, lines):
    """lines: [{"text","out","seed"}] -> runs the engine worker once for the whole batch."""
    eng = voice["engine"]
    job = {"lines": lines, "speed": voice.get("speed", 1.0), "temperature": voice.get("temperature")}
    if eng.startswith("qwen"):
        job.update(model=QWEN[eng], instruct=voice.get("instruct"), ref_audio=voice.get("ref_audio"), ref_text=voice.get("ref_text"))
        if eng == "qwen-clone" and not (job["ref_audio"] and job["ref_text"]): sys.exit("qwen-clone needs ref_audio and ref_text")
        py, worker = PY["qwen"], "qwen_worker.py"
    elif eng == "chatterbox":
        job.update(ref_audio=voice.get("ref_audio"), exaggeration=voice.get("exaggeration", 0.5), cfg=voice.get("cfg", 0.5))
        py, worker = PY["cb"], "cb_worker.py"
    else:
        sys.exit("unknown engine " + eng)
    with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False) as f: json.dump(job, f)
    p = subprocess.run([py, os.path.join(HERE, worker), f.name], text=True, capture_output=True)
    if p.returncode: sys.exit(p.stderr[-3000:])


# ---------------- measuring (we can't listen, so every take is measured) ----------------
def whisper_model():
    for m in WHISPER_MODELS:
        if m and os.path.exists(m): return m
    return None


def transcribe(wav, words=False):
    """whisper.cpp; returns [(start_s, end_s, text)] (word level when words=True)."""
    m = whisper_model()
    if not m: return None
    with tempfile.TemporaryDirectory() as td:
        w16 = os.path.join(td, "a.wav")
        sh(["ffmpeg", "-v", "error", "-y", "-i", wav, "-ar", "16000", "-ac", "1", w16])
        cmd = ["whisper-cli", "-m", m, "-f", w16, "-oj", "-of", os.path.join(td, "t"), "-np", "-l", "en"]
        if words: cmd += ["-ml", "1", "-sow"]
        sh(cmd)
        try: segs = json.load(open(os.path.join(td, "t.json")))["transcription"]
        except Exception: return None
    return [(s["offsets"]["from"] / 1000, s["offsets"]["to"] / 1000, s["text"].strip()) for s in segs if s["text"].strip()]


ONES = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split()
TENS = "_ _ twenty thirty forty fifty sixty seventy eighty ninety".split()


def int_words(n):
    if n < 20: return ONES[n]
    if n < 100: return TENS[n // 10] + ("" if n % 10 == 0 else " " + ONES[n % 10])
    if n < 1000: return ONES[n // 100] + " hundred" + ("" if n % 100 == 0 else " " + int_words(n % 100))
    for div, name in ((10**9, "billion"), (10**6, "million"), (1000, "thousand")):
        if n >= div: return int_words(n // div) + " " + name + ("" if n % div == 0 else " " + int_words(n % div))


def num_words(m):
    a, _, b = m.group(0).replace(",", "").partition(".")
    out = int_words(int(a)) if a else "zero"
    if b: out += " point " + " ".join(ONES[int(c)] for c in b)
    return " " + out + " "


def norm_words(s):
    s = s.lower().replace("&", " and ").replace("%", " percent ").replace("-", " ")
    s = re.sub(r"\d[\d,]*(?:\.\d+)?|\.\d+", num_words, s)
    return re.findall(r"[a-z']+", s)


def wer(ref, hyp):
    r, h = norm_words(ref), norm_words(hyp)
    d = list(range(len(h) + 1))
    for i in range(1, len(r) + 1):
        prev, d[0] = d[0], i
        for j in range(1, len(h) + 1):
            cur = min(d[j] + 1, d[j - 1] + 1, prev + (r[i - 1] != h[j - 1]))
            prev, d[j] = d[j], cur
    return d[len(h)] / max(1, len(r))


def stats(wav):
    o = sh(["ffmpeg", "-hide_banner", "-nostats", "-i", wav, "-af", "silencedetect=n=-45dB:d=0.25,ebur128=peak=true", "-f", "null", "-"]).stderr
    dur = float(sh(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", wav]).stdout.strip() or 0)
    lufs = re.findall(r"I:\s+(-?[\d.]+) LUFS", o); peak = re.findall(r"Peak:\s+(-?[\d.]+) dBFS", o)
    ss = [float(x) for x in re.findall(r"silence_start: (-?[\d.]+)", o)]; se = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", o)]
    lead = se[0] if ss and ss[0] <= 0.01 and se else 0.0
    tail = dur - ss[-1] if ss and (len(se) < len(ss)) else 0.0
    inner = [e - s for s, e in zip(ss, se) if s > 0.01]
    return {"dur": round(dur, 2), "speech": round(dur - lead - tail, 2), "lufs": float(lufs[-1]) if lufs else None,
            "peak": float(peak[-1]) if peak else None, "max_pause": round(max(inner), 2) if inner else 0.0}


def apply_say(text, say):
    for k, v in say.items(): text = re.sub(r"\b%s\b" % re.escape(k), v, text, flags=re.I)
    return text


def qc(text, wav, say=None):
    st = stats(wav)
    t = transcribe(wav)
    heard = " ".join(x[2] for x in t) if t else ""
    st["heard"] = heard
    if t is not None:
        n = len(norm_words(text)); errs = wer(text, heard) * n
        forgive = sum(len(re.findall(r"\b%s\b" % re.escape(k), text, flags=re.I)) for k in (say or {}))
        st["wer"] = round(max(0.0, errs - forgive) / max(1, n), 3)
    else:
        st["wer"] = None
    st["wpm"] = round(len(norm_words(text)) / max(0.1, st["speech"]) * 60)
    return st


# ---------------- commands ----------------
def read_script(p):
    lines, say = [], {}
    for l in open(p):
        l = l.strip()
        m = re.match(r"#\s*say:\s*(.+?)\s*=\s*(.+)$", l)
        if m: say[m.group(1)] = m.group(2)
        elif l and not l.startswith("#"): lines.append(l)
    return lines, say


def parse_say(items):
    return dict(x.split("=", 1) for x in (items or []))

