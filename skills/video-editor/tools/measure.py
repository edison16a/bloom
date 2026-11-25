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
