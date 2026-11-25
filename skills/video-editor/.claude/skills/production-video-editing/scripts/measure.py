#!/usr/bin/env python3
"""Measure one video for edit research: pacing, sound, motion/flow, plus contact sheets.

Usage:  python3 -I measure.py <url-or-file> <out_dir> [--keep]
Writes <out_dir>/metrics.json, sheet_1fps.png (overview), sheet_open.png (first 6 s dense),
shots/ (one frame per shot, up to 40). Deletes the downloaded video unless --keep.

Numbers are measurements, not listening: tempo/energy/transients are computed from the waveform.
"""
import json, os, re, shutil, subprocess, sys, tempfile
import numpy as np

def run(cmd, **kw):
    return subprocess.run(cmd, capture_output=True, text=kw.pop('text', True), **kw)

def fetch(src, tmp):
    if os.path.exists(src):
        return src, {}
    tpl = os.path.join(tmp, 'v.%(ext)s')
    r = run(['yt-dlp', '-q', '--no-playlist', '--no-warnings', '-f',
             'bv*[height<=720][ext=mp4]+ba[ext=m4a]/b[height<=720]/b', '--merge-output-format', 'mp4',
             '--write-auto-subs', '--sub-langs', 'en.*', '--sub-format', 'vtt',
             '--print-json', '--no-simulate', '-o', tpl, src])
    meta = {}
    try:
        j = json.loads(r.stdout.strip().splitlines()[-1])
        meta = {k: j.get(k) for k in ('title', 'uploader', 'upload_date', 'view_count', 'duration', 'webpage_url')}
    except Exception:
        pass
    vids = [f for f in os.listdir(tmp) if f.startswith('v.') and f.endswith(('.mp4', '.mkv', '.webm'))]
    if not vids:  # subtitle step often 429s on YouTube: retry without subtitles
        r = run(['yt-dlp', '-q', '--no-playlist', '--no-warnings', '-f',
                 'bv*[height<=720][ext=mp4]+ba[ext=m4a]/b[height<=720]/b', '--merge-output-format', 'mp4',
                 '--print-json', '--no-simulate', '-o', tpl, src])
        try:
            j = json.loads(r.stdout.strip().splitlines()[-1])
            meta = {k: j.get(k) for k in ('title', 'uploader', 'upload_date', 'view_count', 'duration', 'webpage_url')}
        except Exception:
            pass
        vids = [f for f in os.listdir(tmp) if f.startswith('v.') and f.endswith(('.mp4', '.mkv', '.webm'))]
    if not vids:
        raise SystemExit('download failed: ' + (r.stderr or '')[-400:])
    return os.path.join(tmp, vids[0]), meta

def probe(p):
    j = json.loads(run(['ffprobe', '-v', 'error', '-show_entries', 'stream=codec_type,width,height,r_frame_rate:format=duration',
                        '-of', 'json', p]).stdout)
    v = [s for s in j['streams'] if s['codec_type'] == 'video'][0]
    n, d = v['r_frame_rate'].split('/')
    return float(j['format']['duration']), int(v['width']), int(v['height']), float(n) / float(d), any(s['codec_type'] == 'audio' for s in j['streams'])

def cuts(p, dur=None):
    def at(th):
        r = run(['ffmpeg', '-hide_banner', '-nostats', '-i', p, '-vf', f'scale=320:-2,scdet=threshold={th}:sc_pass=0', '-an', '-f', 'null', '-'])
        return [float(m) for m in re.findall(r'lavfi\.scd\.time:\s*([0-9.]+)', r.stderr)]
    c = at(12)
    # Dark / low-contrast UI films: scdet at 12 misses soft cuts. Retry more sensitively, drop cuts <0.2 s apart.
    if dur and len(c) / dur * 60 < 6:
        c2 = at(5)
        merged = []
        for t in c2:
            if not merged or t - merged[-1] > 0.2: merged.append(t)
        if len(merged) > len(c): c = merged
    return c

def gray_frames(p, fps=10, w=96, h=54):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-vf', f'fps={fps},scale={w}:{h},format=gray', '-f', 'rawvideo', '-'],
                         capture_output=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(-1, h, w).astype(np.float32)

def motion(fr):
    """Global translation per frame step via phase correlation (+x = content moves right, +y = down) and a zoom proxy."""
    out = []
    win = np.outer(np.hanning(fr.shape[1]), np.hanning(fr.shape[2]))
    for a, b in zip(fr[:-1], fr[1:]):
        A = np.fft.fft2((a - a.mean()) * win); Bf = np.fft.fft2((b - b.mean()) * win)
        R = A.conj() * Bf; R /= np.abs(R) + 1e-6
        c = np.fft.ifft2(R).real
        y, x = np.unravel_index(np.argmax(c), c.shape)
        if y > c.shape[0] // 2: y -= c.shape[0]
        if x > c.shape[1] // 2: x -= c.shape[1]
        # zoom proxy: change in edge energy spread from centre
        ga = np.abs(np.diff(a, axis=1)).mean(); gb = np.abs(np.diff(b, axis=1)).mean()
        out.append((x, y, float(np.abs(b - a).mean()), float(np.log((gb + 1e-3) / (ga + 1e-3)))))
    return np.array(out) if out else np.zeros((0, 4))

def audio(p, dur):
    SR = 22050
    x = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'],
                                     capture_output=True).stdout, np.float32)
    if len(x) < SR:
        return {}
    eb = run(['ffmpeg', '-hide_banner', '-nostats', '-i', p, '-af', 'ebur128=peak=true', '-f', 'null', '-']).stderr
    g = lambda k: (re.findall(k + r':\s*(-?[0-9.]+)', eb) or [None])[-1]
    n, h = 1024, 256
    k = (len(x) - n) // h
    F = np.abs(np.fft.rfft(x[np.arange(n)[None, :] + h * np.arange(k)[:, None]] * np.hanning(n), axis=1))
    f = np.fft.rfftfreq(n, 1 / SR); fr = SR / h
    low = np.maximum(np.diff(np.log1p(F[:, f < 150]), axis=0), 0).sum(1)
    full = np.maximum(np.diff(np.log1p(F), axis=0), 0).sum(1)
    hi = np.maximum(np.diff(np.log1p(F[:, f > 3000]), axis=0), 0).sum(1)
    # tempo by comb search on low+full flux
    o = low / (low.std() + 1e-9) + full / (full.std() + 1e-9)
    o = np.maximum(o - np.convolve(o, np.ones(32) / 32, 'same'), 0)
    best = (0, 0, 0)
    for bpm in np.arange(70, 180, 0.25):
        per = 60 / bpm * fr; m = int(len(o) / per) - 1
        if m < 8: continue
        for ph in np.arange(0, per, 2):
            s = o[(ph + per * np.arange(m)).astype(int)].mean()
            if s > best[0]: best = (s, bpm, ph / fr)
    bpm, phase = best[1], best[2]
    strength = best[0] / (o.mean() + 1e-9)  # >1.6 ≈ clear beat
    # transient hits (SFX / impacts): peaks of hi+full flux well above local median
    t = full + hi
    loc = np.convolve(t, np.ones(int(fr)) / int(fr), 'same')
    pk = np.where((t[1:-1] > 3 * loc[1:-1]) & (t[1:-1] > np.percentile(t, 97)) & (t[1:-1] >= t[:-2]) & (t[1:-1] >= t[2:]))[0] / fr
    hits = []
    for v in pk:
        if not hits or v - hits[-1] > 0.25: hits.append(float(v))
    # energy per second (dB) and biggest jumps (drops/lifts)
    sec = [float(20 * np.log10(np.sqrt(np.mean(x[i:i + SR] ** 2)) + 1e-9)) for i in range(0, len(x) - SR + 1, SR)]
    e = np.array(sec)
    jumps = sorted([(float(e[i + 1] - e[i]), i + 1) for i in range(len(e) - 1)], reverse=True)[:4]
    # speech share: fraction of seconds with strong 300-3000 Hz modulation at syllable rate (~4 Hz)
    band = F[:, (f > 300) & (f < 3000)].sum(1)
    sp = 0; tot = 0
    for i in range(0, len(band) - int(fr), int(fr)):
        seg = band[i:i + int(fr)]; seg = seg - seg.mean()
        S = np.abs(np.fft.rfft(seg)); fq = np.fft.rfftfreq(len(seg), 1 / fr)
        r4 = S[(fq > 2.5) & (fq < 7)].sum() / (S[(fq > 0.5)].sum() + 1e-9)
        sp += r4 > 0.35; tot += 1
    return dict(lufs=g(r'\bI'), lra=g('LRA'), true_peak=g('Peak'), bpm=round(bpm, 2), beat_phase=round(phase, 3),
                beat_strength=round(float(strength), 2), hits_per_min=round(len(hits) / dur * 60, 1),
                hits=[round(v, 2) for v in hits[:200]], energy_db_per_s=[round(v, 1) for v in sec],
                biggest_lifts=[{'t': i, 'db': round(d, 1)} for d, i in jumps], speech_share=round(sp / max(tot, 1), 2))
