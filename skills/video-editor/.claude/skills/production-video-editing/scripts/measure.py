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
