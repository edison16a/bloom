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

def main():
    a = argparse.ArgumentParser(); a.add_argument('render'); a.add_argument('--plate', required=True)
    a.add_argument('--start', type=float, default=0); a.add_argument('--end', type=float)
    a.add_argument('--fps', type=float, default=4); a.add_argument('--min-visible', type=float, default=.90)
    a.add_argument('--max-scale-dev', type=float, default=.01); a = a.parse_args()
    P, R = cv2.VideoCapture(a.plate), cv2.VideoCapture(a.render)
    dur = R.get(cv2.CAP_PROP_FRAME_COUNT) / R.get(cv2.CAP_PROP_FPS); end = a.end or dur
    pd = P.get(cv2.CAP_PROP_FRAME_COUNT) / P.get(cv2.CAP_PROP_FPS)
    frames = [f for f in (grab(P, t) for t in np.linspace(pd * .05, pd * .9, 9)) if f is not None]
    if not frames: sys.exit('cannot read plate')
    stack = np.stack(frames).astype(np.float32)
    med = np.median(stack, 0).astype(np.uint8)            # static room
    moving = (stack.std(0) > 9).astype(np.uint8)          # speaker
    mask = 255 - cv2.dilate(moving, np.ones((25, 25))) * 255
    orb = cv2.ORB_create(6000, fastThreshold=4); clahe = cv2.createCLAHE(3, (8, 8))
    kp, dp = orb.detectAndCompute(clahe.apply(med), mask)
    if dp is None or len(kp) < 30: kp, dp = (), None
    bf = cv2.BFMatcher(cv2.NORM_HAMMING); rows = []
    for t in np.arange(a.start, end - .01, 1 / a.fps):
        f = grab(R, t)
        if f is None: continue
        kf, df = orb.detectAndCompute(clahe.apply(f), None); s = None
        if dp is not None and df is not None and len(kf) > 20:
            good = [m for m, n in (x for x in bf.knnMatch(dp, df, 2) if len(x) == 2) if m.distance < .8 * n.distance]
            if len(good) >= 12:
                src = np.float32([kp[m.queryIdx].pt for m in good]); dst = np.float32([kf[m.trainIdx].pt for m in good])
                M, inl = cv2.estimateAffinePartial2D(src, dst, ransacReprojThreshold=3)
                if M is not None and inl.sum() >= 12 and abs(np.arctan2(M[1, 0], M[0, 0])) < .05:
                    s = float(np.hypot(M[0, 0], M[1, 0]))
        rows.append((t, s))
    vis = [r for r in rows if r[1]]
    if len(vis) < .5 * len(rows) and pd >= end - .1:        # softened room: too plain for features
        print('room is too plain for features, comparing with the plate pixel by pixel')
        rows = [(t, soft_scale(grab(P, t), grab(R, t))) for t in np.arange(a.start, end - .01, 1 / a.fps)]
        vis = [r for r in rows if r[1]]
    if not vis: sys.exit('FAIL: speaker shot never found')
    share = len(vis) / len(rows); base = np.median([s for _, s in vis])
    dev = [(t, s / base - 1) for t, s in vis if abs(s / base - 1) > a.max_scale_dev]
    gone = [round(float(t), 2) for t, s in rows if not s]
    print(f'sampled {len(rows)} frames  speaker visible {share:.0%}  scale {min(s for _, s in vis):.3f}-{max(s for _, s in vis):.3f} (median {base:.3f})')
    if gone: print('not visible at:', gone[:40])
    if dev: print('zoomed at:', [(round(float(t), 2), f'{d:+.1%}') for t, d in dev[:40]])
    ok = share >= a.min_visible and not dev
    print('PASS' if ok else 'FAIL'); sys.exit(0 if ok else 1)
main()
