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
