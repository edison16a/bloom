import type { GlyphStyle } from "./types";

export const DEFAULT_FONT = '"JetBrains Mono","Geist Mono","IBM Plex Mono",ui-monospace,"SF Mono",Menlo,Consolas,monospace';

export interface Atlas {
  canvas: HTMLCanvasElement; tileW: number; tileH: number; cols: number; rows: number;
  /** Tiles per weight. Weight w lives at index + w * stride. */
  stride: number;
  index: (ch: string) => number;
}

/** Characters whose shape should not depend on the font: drawn as geometry so every machine matches. */
const GEO: Record<string, (c: CanvasRenderingContext2D, w: number, h: number, k: number) => void> = {
  "·": (c, w, h) => disc(c, w, h, 0.1), "•": (c, w, h) => disc(c, w, h, 0.22), "●": (c, w, h) => disc(c, w, h, 0.42),
  "○": (c, w, h, k) => ring(c, w, h, 0.38, k), "◎": (c, w, h, k) => { ring(c, w, h, 0.4, k); disc(c, w, h, 0.14); },
  "■": (c, w, h) => box(c, w, h, 0.8), "▪": (c, w, h) => box(c, w, h, 0.42), "□": (c, w, h, k) => frame(c, w, h, 0.76, k),
  "◆": (c, w, h) => dia(c, w, h, 0.9), "◇": (c, w, h, k) => { c.lineWidth = k; diaPath(c, w, h, 0.84); c.stroke(); },
  "█": (c, w, h) => c.fillRect(0, 0, w, h),
  "░": (c, w, h) => hatch(c, w, h, 0.25), "▒": (c, w, h) => hatch(c, w, h, 0.5), "▓": (c, w, h) => hatch(c, w, h, 0.75),
};
function disc(c: CanvasRenderingContext2D, w: number, h: number, r: number) { c.beginPath(); c.arc(w / 2, h / 2, Math.min(w, h) * r, 0, 7); c.fill(); }
function ring(c: CanvasRenderingContext2D, w: number, h: number, r: number, k: number) { c.lineWidth = k; c.beginPath(); c.arc(w / 2, h / 2, Math.min(w, h) * r, 0, 7); c.stroke(); }
function box(c: CanvasRenderingContext2D, w: number, h: number, s: number) { const m = Math.min(w, h) * s; c.fillRect((w - m) / 2, (h - m) / 2, m, m); }
function frame(c: CanvasRenderingContext2D, w: number, h: number, s: number, k: number) { c.lineWidth = k; const m = Math.min(w, h) * s; c.strokeRect((w - m) / 2, (h - m) / 2, m, m); }
function diaPath(c: CanvasRenderingContext2D, w: number, h: number, s: number) { const m = (Math.min(w, h) * s) / 2; c.beginPath(); c.moveTo(w / 2, h / 2 - m); c.lineTo(w / 2 + m, h / 2); c.lineTo(w / 2, h / 2 + m); c.lineTo(w / 2 - m, h / 2); c.closePath(); }
function dia(c: CanvasRenderingContext2D, w: number, h: number, s: number) { diaPath(c, w, h, s); c.fill(); }
function hatch(c: CanvasRenderingContext2D, w: number, h: number, d: number) {
  const n = 4, s = w / n, M = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  for (let y = 0; y < Math.ceil(h / s); y++) for (let x = 0; x < n; x++) if (M[(y % 4) * 4 + x] / 16 < d) c.fillRect(x * s, y * s, s, s);
}

export function buildAtlas(tileW: number, tileH: number, g: GlyphStyle): Atlas {
  const chars: string[] = [];
  for (let i = 32; i < 127; i++) chars.push(String.fromCharCode(i));
  const add = (s?: string) => { if (s) for (const ch of s) if (!chars.includes(ch)) chars.push(ch); };
  add(g.ramp); add(g.message); add(g.glitchChars); add(g.looseChars);
  const weights = g.weights ?? [400, 500, 700];
  const stride = chars.length, total = stride * weights.length;
  const cols = Math.min(64, Math.max(16, Math.floor(4096 / tileW)));
  const rows = Math.ceil(total / cols);
  const canvas = document.createElement("canvas");
  canvas.width = cols * tileW; canvas.height = rows * tileH;
  const c = canvas.getContext("2d")!;
  c.fillStyle = c.strokeStyle = "#fff";
  c.textAlign = "center"; c.textBaseline = "alphabetic";
  const family = g.font ?? DEFAULT_FONT;
  weights.forEach((wt, wi) => {
    // Fit the em box to the tile: never let a wide mono glyph bleed into its neighbour.
    let px = tileH * (g.fontScale ?? 0.92);
    c.font = `${wt} ${px}px ${family}`;
    const m = c.measureText("M").width;
    if (m > tileW * 1.02) px *= (tileW * 1.02) / m;
    c.font = `${wt} ${px}px ${family}`;
    const mt = c.measureText("Hg");
    const asc = mt.fontBoundingBoxAscent ?? px * 0.8, desc = mt.fontBoundingBoxDescent ?? px * 0.2;
    const base = Math.round((tileH + asc - desc) / 2);
    chars.forEach((ch, i) => {
      const n = i + wi * stride, x = (n % cols) * tileW, y = Math.floor(n / cols) * tileH;
      c.save();
      c.beginPath(); c.rect(x, y, tileW, tileH); c.clip();
      c.translate(x, y);
      const geo = GEO[ch];
      if (geo) geo(c, tileW, tileH, Math.max(1, tileW * (0.1 + wi * 0.04)));
      else c.fillText(ch, tileW / 2, base);
      c.restore();
    });
  });
  const map = new Map(chars.map((ch, i) => [ch, i]));
  return { canvas, tileW, tileH, cols, rows, stride, index: (ch) => map.get(ch) ?? 0 };
}
