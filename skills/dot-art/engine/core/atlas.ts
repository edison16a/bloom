import type { GlyphStyle } from "./types";

export const DEFAULT_FONT = '"JetBrains Mono","Geist Mono","IBM Plex Mono",ui-monospace,"SF Mono",Menlo,Consolas,monospace';

export interface Atlas {
  canvas: HTMLCanvasElement; tileW: number; tileH: number; cols: number; rows: number;
  /** Tiles per weight. Weight w lives at index + w * stride. */
  stride: number;
  index: (ch: string) => number;
}
