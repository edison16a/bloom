#!/usr/bin/env python3
"""Fail an edit that zooms the speaker or hides them behind full-screen inserts.

Usage: python3 -I hold_check.py RENDER --plate SPEAKER_CLIP [--end SECONDS] [--fps 4]
                                [--min-visible 0.90] [--max-scale-dev 0.01]

How it works: matches ORB features of the plate's static background (the area the
speaker does not cover stays the same) against sampled render frames and fits a
similarity transform.
  - no fit      -> the speaker shot is not on screen (full-screen insert or card)
  - fit         -> scale relative to the first visible frame; drift means a zoom
--end is where the end card starts. Single-camera plates only: for several real
angles, run it per angle and cut the render with --start/--end.
Caveat: a very plain background can fail to match. Look at the listed times first.
"""
import argparse, sys
import cv2, numpy as np

def grab(cap, t):
    cap.set(cv2.CAP_PROP_POS_MSEC, t * 1000); ok, f = cap.read()
    return cv2.cvtColor(f, cv2.COLOR_BGR2GRAY) if ok else None

def soft_scale(p, r, tol=4, need=.25):
    """Scale at which the room plate best explains the render, None if it explains too little.
    Same timing in plate and render is assumed (true when the plate sits at 0 in the comp)."""
    if p is None or r is None: return None
    p, r = (cv2.resize(x, (480, 270), interpolation=cv2.INTER_AREA).astype(np.float32) for x in (p, r))
    def fit(s):
        M = np.float32([[s, 0, 240 * (1 - s)], [0, s, 135 * (1 - s)]])
        return float((np.abs(cv2.warpAffine(p, M, (480, 270), borderMode=cv2.BORDER_REPLICATE) - r) < tol).mean())
    f = {s: fit(s) for s in np.round(np.arange(.94, 1.0601, .01), 2)}
    s = max(f, key=f.get)
    return float(s) if f[s] >= need else None
