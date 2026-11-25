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
