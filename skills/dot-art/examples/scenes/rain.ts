import { defineScene, type OverlayCell } from "dot-art";

/** Text background. One sentence fills a wet window; city lights glow behind it, and running drops bend the lines. */
const TEXT = "it rained all night and the city kept talking ";
const SHIFT = 17, CW = 5, CH = 9, LOOP = 12;

// Drops and lights are plain numbers shared by the shader (as a data texture) and the overlay (as JS), so both agree.
let seed = 11; const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
const DROPS = 34, LIGHTS = 24, W = 8;
const D = new Float32Array(DROPS * W), B = new Float32Array(LIGHTS * W);
for (let i = 0; i < DROPS; i++) {
  // x from the left edge, half width, phase, cycles per loop, trail length, wander seed, wander size
  const big = i % 3 === 0;
  D.set([((i * 0.618034) % 1) * 3.6 + (rnd() - 0.5) * 0.05, big ? 0.044 + 0.016 * rnd() : 0.016 + 0.008 * rnd(), rnd(), big ? 1 : rnd() < 0.5 ? 1 : 2, big ? 1.1 + 0.8 * rnd() : 0.5 + 0.5 * rnd(), rnd() * 40, 0.4 + rnd(), 0], i * W);
}
for (let i = 0; i < LIGHTS; i++) {
  const a = rnd(), near = i < 8, right = i % 4 !== 0;
  // x (-1..1 of the half width), y, radius, strength, hue, flicker, 0, 0
  B.set([right ? -0.15 + 1.1 * rnd() : -0.95 + 0.8 * rnd(), near ? -0.62 + 0.5 * rnd() : -0.30 + 0.75 * rnd() * rnd(), near ? 0.15 + 0.11 * a : 0.05 + 0.07 * a, (near ? 0.42 : 0.6) * (right ? 1 : 0.5), [0.05, 0.12, 0.2, 0.55, 0.9, 0.12][i % 6], 1 + Math.floor(rnd() * 3), 0, 0], i * W);
}
const TAU = Math.PI * 2, fract = (x: number) => x - Math.floor(x), ss = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const wanderX = (i: number, y: number, aspect: number) => -aspect + D[i * W] + 0.035 * D[i * W + 6] * (Math.sin(y * 3.1 + D[i * W + 5]) + 0.4 * Math.sin(y * 8.3 + D[i * W + 5] * 2));
const headY = (i: number, ph: number) => { const u = fract(ph * D[i * W + 3] + D[i * W + 2]); const s = u + 0.026 * Math.sin(TAU * u * 4) ; return 1.15 - (2.4 + D[i * W + 4]) * s; };
const lightAt = (x: number, y: number, aspect: number) => { let t = 0; for (let j = 0; j < LIGHTS; j++) { const o = j * W, d = Math.hypot(x - B[o] * aspect, y - B[o + 1]); t += B[o + 3] * (1 - ss(B[o + 2] * 0.8, B[o + 2] * 1.1, d)); } return t; };
