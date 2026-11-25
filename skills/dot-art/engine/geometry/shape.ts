import type { Geometry } from "../core/types";

/** Anything that can become a silhouette. */
export type ShapeInput =
  | { path: string; viewBox?: [number, number, number, number]; stroke?: number; fillRule?: CanvasFillRule }
  | { paths: string[]; viewBox?: [number, number, number, number]; stroke?: number; fillRule?: CanvasFillRule }
  | { text: string; font?: string; weight?: number }
  | { draw: (ctx: CanvasRenderingContext2D, size: number) => void }
  | { image: CanvasImageSource; width: number; height: number; threshold?: number };
