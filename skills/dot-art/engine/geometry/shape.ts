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
