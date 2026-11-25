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
