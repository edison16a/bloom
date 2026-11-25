import type { Geometry } from "../core/types";

/** Anything that can become a silhouette. */
export type ShapeInput =
  | { path: string; viewBox?: [number, number, number, number]; stroke?: number; fillRule?: CanvasFillRule }
  | { paths: string[]; viewBox?: [number, number, number, number]; stroke?: number; fillRule?: CanvasFillRule }
  | { text: string; font?: string; weight?: number }
  | { draw: (ctx: CanvasRenderingContext2D, size: number) => void }
  | { image: CanvasImageSource; width: number; height: number; threshold?: number };

export interface InflateOptions {
  /** Points to scatter. 20–40k per emblem, 60k+ for a hero. */
  count?: number;
  /** Half-thickness of the flat slab, in shape units (shape spans about -1..1). */
  depth?: number;
  /** Height of the rounded cap on each face. */
  bevel?: number;
  /** How far in from the edge the cap keeps rising. Large = pillow, small = chamfer. */
  bevelWidth?: number;
  resolution?: number;
}

/** Rasterise a shape to an alpha mask, centred and fitted. */
export function rasterize(input: ShapeInput, size = 384): Float32Array {
  const c = document.createElement("canvas"); c.width = c.height = size;
  const x = c.getContext("2d", { willReadFrequently: true })!;
  x.fillStyle = x.strokeStyle = "#fff"; x.lineCap = x.lineJoin = "round";
  const pad = size * 0.06, inner = size - pad * 2;
  if ("draw" in input) input.draw(x, size);
  else if ("text" in input) {
    let px = size; x.textAlign = "center"; x.textBaseline = "middle";
    const set = () => (x.font = `${input.weight ?? 800} ${px}px ${input.font ?? "ui-sans-serif, system-ui, Helvetica, Arial, sans-serif"}`);
    set(); const w = x.measureText(input.text).width; px *= Math.min(1.1, inner / w); set();
    const m = x.measureText(input.text);
    x.fillText(input.text, size / 2, size / 2 + (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2);
  } else if ("image" in input) {
    const k = inner / Math.max(input.width, input.height);
    x.drawImage(input.image, (size - input.width * k) / 2, (size - input.height * k) / 2, input.width * k, input.height * k);
  } else {
    const vb = input.viewBox ?? [0, 0, 24, 24], k = inner / Math.max(vb[2], vb[3]);
    x.translate(size / 2, size / 2); x.scale(k, k); x.translate(-vb[0] - vb[2] / 2, -vb[1] - vb[3] / 2);
    for (const d of "paths" in input ? input.paths : [input.path]) {
      const p = new Path2D(d);
      if (input.stroke) { x.lineWidth = input.stroke; x.stroke(p); } else x.fill(p, input.fillRule ?? "nonzero");
    }
  }
  const d = x.getImageData(0, 0, size, size).data, out = new Float32Array(size * size);
  const th = "image" in input ? input.threshold : undefined;
  for (let i = 0; i < out.length; i++) {
    const a = d[i * 4 + 3] / 255;
    out[i] = th === undefined ? a : a * ((d[i * 4] * 0.21 + d[i * 4 + 1] * 0.72 + d[i * 4 + 2] * 0.07) / 255 > th ? 1 : 0);
  }
  return out;
}

/** Felzenszwalb exact distance transform: distance inside the mask to the nearest edge, in pixels. */
export function distanceField(mask: Float32Array, size: number): Float32Array {
  const INF = 1e12, g = new Float64Array(size * size);
  for (let i = 0; i < g.length; i++) g[i] = mask[i] > 0.5 ? INF : 0;
  const f = new Float64Array(size), d = new Float64Array(size), v = new Int32Array(size), z = new Float64Array(size + 1);
  const pass = () => {
    let k = 0; v[0] = 0; z[0] = -INF; z[1] = INF;
    for (let q = 1; q < size; q++) {
      let s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
      while (s <= z[k]) { k--; s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]); }
      k++; v[k] = q; z[k] = s; z[k + 1] = INF;
    }
    k = 0;
    for (let q = 0; q < size; q++) { while (z[k + 1] < q) k++; d[q] = (q - v[k]) ** 2 + f[v[k]]; }
  };
  for (let x = 0; x < size; x++) { for (let y = 0; y < size; y++) f[y] = g[y * size + x]; pass(); for (let y = 0; y < size; y++) g[y * size + x] = d[y]; }
  for (let y = 0; y < size; y++) { for (let x = 0; x < size; x++) f[x] = g[y * size + x]; pass(); for (let x = 0; x < size; x++) g[y * size + x] = d[x]; }
  const out = new Float32Array(size * size);
  for (let i = 0; i < out.length; i++) out[i] = Math.sqrt(Math.min(g[i], 1e8));
  return out;
}

function blur(src: Float32Array, n: number, r: number): Float32Array {
  const t = new Float32Array(src.length), o = new Float32Array(src.length);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { let s = 0, w = 0; for (let k = -r; k <= r; k++) { const X = x + k; if (X < 0 || X >= n) continue; s += src[y * n + X]; w++; } t[y * n + x] = s / w; }
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { let s = 0, w = 0; for (let k = -r; k <= r; k++) { const Y = y + k; if (Y < 0 || Y >= n) continue; s += t[Y * n + x]; w++; } o[y * n + x] = s / w; }
  return o;
}

/**
 * Turn any logo, SVG path, word or silhouette into a solid, evenly covered 3D point surface.
 * `extra` = (distance to edge 0..1, wall 0/1, u, v).
 */
export function inflate(input: ShapeInput, o: InflateOptions = {}): Geometry {
  const n = o.resolution ?? 384, count = o.count ?? 30000;
  const depth = o.depth ?? 0.1, bevel = o.bevel ?? 0.16, width = o.bevelWidth ?? 0.22;
  const mask = rasterize(input, n), raw = distanceField(mask, n), df = blur(raw, n, 2);
  const inside: number[] = [], edge: number[] = [];
  for (let i = 0; i < mask.length; i++) if (mask[i] > 0.5) { inside.push(i); if (raw[i] < 1.6) edge.push(i); }
  if (!inside.length) throw new Error("dot-art: inflate() got an empty shape. Check the path, viewBox or font.");
  const s = 2 / n, bw = (width * n) / 2;
  const pos = new Float32Array(count * 3), nrm = new Float32Array(count * 3), ext = new Float32Array(count * 4);
  const faceArea = inside.length * 2, wallArea = edge.length * ((depth * 2) / s);
  const walls = depth > 0 ? Math.floor((count * wallArea) / (faceArea + wallArea)) : 0;
  const at = (x: number, y: number) => df[Math.min(n - 1, Math.max(0, y)) * n + Math.min(n - 1, Math.max(0, x))];
  let seed = 7; const rnd = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  for (let i = 0; i < count; i++) {
    const wall = i < walls, list = wall ? edge : inside;
    const px = list[Math.floor(((i * 0.7548776662466927 + 0.5) % 1) * list.length)];
    const X = px % n, Y = Math.floor(px / n), jx = rnd() - 0.5, jy = rnd() - 0.5;
    let gx = at(X + 2, Y) - at(X - 2, Y), gy = at(X, Y + 2) - at(X, Y - 2);
    const gl = Math.hypot(gx, gy) || 1;
    const t = Math.min(1, df[px] / bw), side = i & 1 ? 1 : -1;
    const cap = bevel * Math.sqrt(Math.max(0, 1 - (1 - t) * (1 - t)));
    pos[i * 3] = (X + 0.5 + jx) * s - 1; pos[i * 3 + 1] = 1 - (Y + 0.5 + jy) * s;
    if (wall) {
      pos[i * 3 + 2] = (rnd() * 2 - 1) * depth;
      nrm.set([-gx / gl, gy / gl, 0], i * 3);
    } else {
      pos[i * 3 + 2] = side * (depth + cap);
      const slope = (bevel * (1 - t)) / Math.max(0.12, Math.sqrt(Math.max(0, 1 - (1 - t) * (1 - t)))) / width;
      const k = Math.min(2.4, slope) * Math.min(1, gl / 2);
      const nx = (-gx / gl) * k, ny = (gy / gl) * k, l = Math.hypot(nx, ny, 1);
      nrm.set([nx / l, ny / l, side / l], i * 3);
    }
    ext.set([t, wall ? 1 : 0, (X + 0.5) / n, 1 - (Y + 0.5) / n], i * 4);
  }
  return { position: pos, normal: nrm, extra: ext };
}

/** Pack two same-length shapes for morphing: the second shape's position goes in `color`. */
export function morphPair(a: Geometry, b: Geometry): Geometry {
  if (a.position.length !== b.position.length) throw new Error("dot-art: morphPair needs equal point counts");
  return { position: a.position, normal: a.normal, color: b.position, extra: a.extra };
}
