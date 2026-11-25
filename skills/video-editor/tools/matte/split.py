#!/usr/bin/env python3
"""Split a talking shot into room and person, graded, at one fixed framing.

  split.py PLATE MATTE OUTDIR [--size 1920x1080] [--anchor top|center] [--blur 9] [--room 0.62] [--wb 1,1,1] [--still T]
Writes room.mov (the room, softened and darkened, person removed from the blur so there is no halo) and
person.mov (ProRes 4444, alpha). Stack them in EffectCraft with panels and text in between.
--still T writes only a composite PNG at T seconds, for choosing values. --wb are r,g,b gains, found automatically when omitted.
--person 0.92,60,86 sets the person's one fixed size and place (scale of the plate, left, top). Only when the shoulders
do not touch the sides of the plate. It opens headroom and an empty side for panels. Never animate it.
"""
import argparse, subprocess, numpy as np, cv2, json, os
p = argparse.ArgumentParser(); p.add_argument("plate"); p.add_argument("matte"); p.add_argument("out"); p.add_argument("--size", default="1920x1080"); p.add_argument("--anchor", default="top")
p.add_argument("--blur", type=float, default=9); p.add_argument("--room", type=float, default=0.62); p.add_argument("--wb", default=""); p.add_argument("--sat", type=float, default=0.95); p.add_argument("--contrast", type=float, default=1.06); p.add_argument("--near", type=float, default=0.8, help="room brightness right around the person"); p.add_argument("--light", default="0.42,0.45", help="where the light sits, as a share of the frame"); p.add_argument("--hair", type=float, default=0.62, help="share of the height above which the edge follows hair"); p.add_argument("--lift", type=float, default=0.04); p.add_argument("--still", type=float); p.add_argument("--person", default="", help="scale,x,y of the person inside the frame, e.g. 0.92,60,86 (constant for the whole shot)")
a = p.parse_args(); W, H = map(int, a.size.split("x")); os.makedirs(a.out, exist_ok=True)
cap, mc = cv2.VideoCapture(a.plate), cv2.VideoCapture(a.matte); fps = cap.get(cv2.CAP_PROP_FPS); sw, sh = int(cap.get(3)), int(cap.get(4)); N = int(cap.get(7))
s = max(W / sw, H / sh); rw, rh = round(sw * s), round(sh * s); x0 = (rw - W) // 2; y0 = 0 if a.anchor == "top" else (rh - H) // 2
fit = lambda im: cv2.resize(im, (rw, rh), interpolation=cv2.INTER_CUBIC)[y0:y0 + H, x0:x0 + W]
def guided(I, q, r, eps):
    box = lambda z: cv2.boxFilter(z, -1, (2 * r + 1, 2 * r + 1)); mi, mq = box(I), box(q); A_ = (box(I * q) - mi * mq) / (box(I * I) - mi * mi + eps); return box(A_) * I + box(mq - A_ * mi)