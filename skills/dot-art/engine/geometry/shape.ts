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
