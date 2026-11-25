import type { Geometry, LazyScene, Scene, Vec3 } from "../core/types";
import { looks, type Look } from "../looks";
import { loadModel } from "./mesh";
import { inflate, type InflateOptions, type ShapeInput } from "./shape";

const hex = (h: string): Vec3 => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as Vec3;

export interface ObjectOptions {
  id: string; title?: string; loop?: number; background?: string;
  /** Shadow, mid and light colour. Ignored when `useModelColor` is set. */
  colors?: [string, string, string];
  useModelColor?: boolean;
  /** spin = full turn per loop, sway = rock back and forth, assemble = fly together, turn, scatter. */
  motion?: "spin" | "sway" | "assemble";
  /** Degrees of downward tilt of the camera. */
  tilt?: number;
  /** Extra rotation applied first, in degrees, to stand a model upright. */
  rotate?: [number, number, number];
  scale?: number;
  look?: Look;
  /** Faint pool of dots under the object. Default true. */
  floor?: boolean;
}
