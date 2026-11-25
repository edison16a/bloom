import { defineScene, type SurfaceSource, type Vec3, type Scene } from "../core/types";
import { inflate, type ShapeInput } from "../geometry/shape";

/** Dot object. Any set of logos or icons, inflated into 3D and lit on a faint LED wall. */
export interface EmblemSpec { shape: ShapeInput; at: [number, number]; size?: number; color: [string, string]; spin?: number; depth?: number; bevel?: number; bevelWidth?: number }

const hex = (h: string): Vec3 => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as Vec3;
