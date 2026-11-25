import type { Geometry } from "../core/types";

/** Centre and scale so the longest side spans -1..1. */
export function normalizeGeometry(g: Geometry): Geometry {
  const p = g.position, lo = [1e9, 1e9, 1e9], hi = [-1e9, -1e9, -1e9];
  for (let i = 0; i < p.length; i++) { const k = i % 3; lo[k] = Math.min(lo[k], p[i]); hi[k] = Math.max(hi[k], p[i]); }
  const s = 2 / Math.max(hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2]), out = new Float32Array(p.length);
  for (let i = 0; i < p.length; i++) { const k = i % 3; out[i] = (p[i] - (lo[k] + hi[k]) / 2) * s; }
  return { ...g, position: out };
}
