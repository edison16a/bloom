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
def clean(m, f):
    """Soft measured edge, solid inside, and the edge follows real hair in the picture."""
    m = m[:, :, 1]; b = (m > 110).astype(np.uint8); b = cv2.morphologyEx(b, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (41, 41)))
    cs, _ = cv2.findContours(b, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE); u = np.zeros_like(b)
    if cs: cv2.drawContours(u, [max(cs, key=cv2.contourArea)], -1, 1, -1)
    soft = np.maximum(cv2.GaussianBlur(m, (0, 0), 1.5).astype(np.float32) / 255 * cv2.dilate(u, np.ones((15, 15))), 0)
    core = cv2.erode(u, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (19, 19))).astype(np.float32)
    g = guided(cv2.cvtColor(f, cv2.COLOR_BGR2GRAY).astype(np.float32) / 255, np.maximum(soft, core), 9, 6e-4)
    k = np.clip((np.linspace(0, 1, m.shape[0], dtype=np.float32) - a.hair) / -.08 , 0, 1)[:, None]      # hair follows the picture, clothes keep the measured edge
    plain = np.clip((cv2.erode(soft, np.ones((5, 5))) - .15) / .75, 0, 1); g = np.clip((g - .12) / .80, 0, 1) * k + plain * (1 - k)
    out = cv2.GaussianBlur(np.maximum(g, cv2.GaussianBlur(core, (0, 0), 3)), (0, 0), .7)
    return np.clip(out, 0, 1) * cv2.GaussianBlur(cv2.dilate(u, np.ones((11, 11))).astype(np.float32), (0, 0), 2)
PAD = 48
def crown(F, m):
    """Hair that leaves the top of the plate would end in a straight line. Round it off with a few mirrored rows on the head's own curve."""
    h, w = m.shape; feather = np.clip(np.arange(h, dtype=np.float32) / 9, 0, 1)[:, None]; m = m.copy(); near = np.clip((30 - np.arange(h, dtype=np.float32)) / 10, 0, 1)[:, None]; m *= 1 - near * np.clip((cv2.GaussianBlur(F.astype(np.float32).mean(2), (0, 0), 2) - 85) / 35, 0, 1); t = ((m[2:7].mean(0) > .5) & (F[2:7].mean((0, 2)) < 95)).astype(np.uint8); n, lab, st, _ = cv2.connectedComponentsWithStats(t[None].copy(), connectivity=8)
    F = cv2.copyMakeBorder(F.astype(np.float32), PAD, 0, 0, 0, cv2.BORDER_REFLECT_101); M = cv2.copyMakeBorder(m * feather, PAD, 0, 0, 0, cv2.BORDER_CONSTANT, value=0)
    if n < 2: return F, M
    k = 1 + int(np.argmax(st[1:, 4])); l, c = int(st[k, 0]), int(st[k, 2]); r = l + c - 1
    if c < 8: return F, M
    R = max(float((m[int(h * .12)] > .5).sum()) * .62, c * .55); hw = c / 2; x = np.arange(w, dtype=np.float32) - (l + r) / 2
    rise = np.where(np.abs(x) < hw, np.sqrt(np.maximum(R * R - x * x, 0)) - np.sqrt(R * R - hw * hw), -3.0); rise = np.minimum(rise, PAD - 6)
    up = np.arange(PAD, 0, -1, dtype=np.float32)[:, None]; a_ = np.clip((rise[None] - up) / 6 + .5, 0, 1)
    on = cv2.GaussianBlur((np.abs(x) < hw).astype(np.float32)[None], (0, 0), 2)
    M[:PAD] = a_; M[PAD:] = m * (feather * (1 - on) + on); M[PAD - 6:PAD + 12] = M[PAD - 6:PAD + 12] * .5 + cv2.GaussianBlur(M, (0, 0), 1.5)[PAD - 6:PAD + 12] * .5
    return F, M
if a.wb: wb = np.array([float(v) for v in a.wb.split(",")])
else:                                                    # neutralise the room's cast halfway, keep some warmth
    cap.set(cv2.CAP_PROP_POS_FRAMES, N // 2); mc.set(cv2.CAP_PROP_POS_FRAMES, N // 2); f, m = cap.read()[1], mc.read()[1]
    px = f[(m[:, :, 1] < 20) & (f.mean(2) > 90) & (f.mean(2) < 245)].astype(np.float32).mean(0)[::-1]; wb = (px.mean() / px) ** 0.42; wb /= wb.mean()
cap.set(cv2.CAP_PROP_POS_FRAMES, 0); mc.set(cv2.CAP_PROP_POS_FRAMES, 0)   # back to the first frame after sampling
print("white balance gains r,g,b", np.round(wb, 3))
gain = wb[::-1].astype(np.float32)
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32); cx, cy = [float(v) for v in a.light.split(",")]
d_ = np.sqrt(((xx / W - cx) * 1.25) ** 2 + ((yy / H - cy) * 1.0) ** 2); d_ = np.clip((d_ - .16) / .5, 0, 1); d_ = d_ * d_ * (3 - 2 * d_)
light = (a.near * (1 - d_) + a.room * d_)[..., None].astype(np.float32)          # light falls off around the person, so text at the sides is readable
def grade(f, k=1.0):
    f = f.astype(np.float32) / 255 * gain * k; g = f.mean(2, keepdims=True); f = g + (f - g) * a.sat
    f = np.clip(f, 0, 1.3); f = f + a.lift * np.sin(np.clip(f, 0, 1) * np.pi); f = f + (a.contrast - 1) * np.sin((np.clip(f, 0, 1) - .5) * np.pi) * .5 * 0.9
    return np.clip(np.where(f > .86, .86 + (1 - np.exp(-(f - .86) / .14)) * .14, f), 0, 1)
def room(f, m):
    w = 1 - cv2.dilate(m, np.ones((45, 45))); q = cv2.resize(f.astype(np.float32), None, fx=.25, fy=.25, interpolation=cv2.INTER_AREA); wq = cv2.resize(w, (q.shape[1], q.shape[0]), interpolation=cv2.INTER_AREA)
    out = None
    for sig in (a.blur / 4, 22, 70):                    # fill behind the person from further and further away
        n = cv2.GaussianBlur(q * wq[..., None], (0, 0), sig); d = cv2.GaussianBlur(wq, (0, 0), sig)[..., None]; e = n / np.maximum(d, 1e-4); c = np.clip((d - .02) / .2, 0, 1)
        out = (e, c) if out is None else (out[0] * out[1] + e * (1 - out[1]), np.maximum(out[1], c))
    fill = cv2.resize(out[0], (f.shape[1], f.shape[0]), interpolation=cv2.INTER_CUBIC); return cv2.GaussianBlur(fill, (0, 0), a.blur), fill
def unmix(f, fill, m):
    """Take the wall out of half transparent edge pixels, then hold the outer rim to the colour just inside it."""
    f = f.astype(np.float32); al = np.clip(m, .08, 1)[..., None]; F = np.clip((f - (1 - al) * fill) / al, 0, 255); band = ((m > .02) & (m < .98)).astype(np.float32); band = cv2.GaussianBlur(band, (0, 0), 1.5)[..., None]
    inner = cv2.erode((m > .9).astype(np.uint8), cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9))).astype(np.float32)
    n = cv2.GaussianBlur(f * inner[..., None], (0, 0), 6); d = cv2.GaussianBlur(inner, (0, 0), 6)[..., None]; e = n / np.maximum(d, 1e-3)
    F = np.where(d > .02, np.minimum(F, e * 1.12 + 6), F); return np.clip(f * (1 - band) + F * band, 0, 255)
def place(im, pad=0):
    if not a.person: return fit(im[pad:])
    k, px_, py_ = [float(v) for v in a.person.split(",")]
    return cv2.warpAffine(im, np.float32([[k, 0, px_], [0, k, py_ - k * pad]]), (W, H), flags=cv2.INTER_CUBIC if k > .98 else cv2.INTER_AREA)
rng = np.random.default_rng(1); noise = [rng.normal(0, 1.1, (H, W, 1)).astype(np.float32) / 255 for _ in range(5)]
def frame(f, mraw, i):
    ms = clean(mraw, f); rb, fill = room(f, (ms > .05).astype(np.float32)); r = np.clip(grade(fit(rb)) * light + noise[i % 5], 0, 1)
    F, M = crown(unmix(f, fill, ms), ms); return r, np.clip(place(grade(F), PAD), 0, 1), np.clip(place(M.astype(np.float32), PAD), 0, 1)
if a.still is not None:
    k = int(a.still * fps); cap.set(cv2.CAP_PROP_POS_FRAMES, k); mc.set(cv2.CAP_PROP_POS_FRAMES, k); r, q, m = frame(cap.read()[1], mc.read()[1], 0)
    cv2.imwrite(a.out + "/still.png", ((r * (1 - m[..., None]) + q * m[..., None]) * 255).astype(np.uint8)); raise SystemExit
pipe = lambda o, pf, args: subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", pf, "-s", f"{W}x{H}", "-r", f"{fps}", "-i", "-"] + args + ["-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709", o], stdin=subprocess.PIPE)
A = pipe(a.out + "/room.mov", "bgr24", ["-vf", "scale=out_color_matrix=bt709", "-c:v", "prores_ks", "-profile:v", "3", "-pix_fmt", "yuv422p10le"]); B = pipe(a.out + "/person.mov", "bgra", ["-vf", "scale=out_color_matrix=bt709", "-c:v", "prores_ks", "-profile:v", "4444", "-pix_fmt", "yuva444p10le"])
from concurrent.futures import ThreadPoolExecutor
from collections import deque
cv2.setNumThreads(1); ex = ThreadPoolExecutor(max_workers=max(2, (os.cpu_count() or 4) - 2)); q_ = deque(); pm = None; i = 0; done = False