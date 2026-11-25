import type { Geometry } from "../core/types";

/** Centre and scale so the longest side spans -1..1. */
export function normalizeGeometry(g: Geometry): Geometry {
  const p = g.position, lo = [1e9, 1e9, 1e9], hi = [-1e9, -1e9, -1e9];
  for (let i = 0; i < p.length; i++) { const k = i % 3; lo[k] = Math.min(lo[k], p[i]); hi[k] = Math.max(hi[k], p[i]); }
  const s = 2 / Math.max(hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2]), out = new Float32Array(p.length);
  for (let i = 0; i < p.length; i++) { const k = i % 3; out[i] = (p[i] - (lo[k] + hi[k]) / 2) * s; }
  return { ...g, position: out };
}

/** Area-weighted scatter over a triangle mesh: even dots no matter how the mesh was tessellated. */
export function samplePoints(g: Geometry, count = 120000): Geometry {
  const { position: p, normal: nn, color: cc } = g;
  const idx = g.index ?? Uint32Array.from({ length: p.length / 3 }, (_, i) => i);
  const tris = idx.length / 3, cdf = new Float64Array(tris); let sum = 0;
  const V = (i: number) => [p[i * 3], p[i * 3 + 1], p[i * 3 + 2]];
  for (let t = 0; t < tris; t++) {
    const a = V(idx[t * 3]), b = V(idx[t * 3 + 1]), c = V(idx[t * 3 + 2]);
    const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
    sum += Math.hypot(u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]); cdf[t] = sum;
  }
  const pos = new Float32Array(count * 3), nrm = new Float32Array(count * 3), col = cc ? new Float32Array(count * 3) : undefined;
  let seed = 11; const rnd = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  for (let i = 0; i < count; i++) {
    const target = ((i + rnd()) / count) * sum; let lo = 0, hi = tris - 1;
    while (lo < hi) { const m = (lo + hi) >> 1; if (cdf[m] < target) lo = m + 1; else hi = m; }
    let u = rnd(), v = rnd(); if (u + v > 1) { u = 1 - u; v = 1 - v; }
    const w = 1 - u - v, I = [idx[lo * 3], idx[lo * 3 + 1], idx[lo * 3 + 2]], W = [w, u, v];
    for (let k = 0; k < 3; k++) {
      let P = 0, N = 0, C = 0;
      for (let j = 0; j < 3; j++) { P += p[I[j] * 3 + k] * W[j]; if (nn) N += nn[I[j] * 3 + k] * W[j]; if (cc) C += cc[I[j] * 3 + k] * W[j]; }
      pos[i * 3 + k] = P; nrm[i * 3 + k] = N; if (col) col[i * 3 + k] = C;
    }
    if (!nn) {
      const a = V(I[0]), b = V(I[1]), c = V(I[2]);
      const s = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], t = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
      nrm.set([s[1] * t[2] - s[2] * t[1], s[2] * t[0] - s[0] * t[2], s[0] * t[1] - s[1] * t[0]], i * 3);
    }
    const l = Math.hypot(nrm[i * 3], nrm[i * 3 + 1], nrm[i * 3 + 2]) || 1;
    nrm[i * 3] /= l; nrm[i * 3 + 1] /= l; nrm[i * 3 + 2] /= l;
  }
  return { position: pos, normal: nrm, color: col };
}
