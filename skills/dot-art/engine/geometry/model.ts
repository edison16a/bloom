import type { Geometry, LazyScene, Scene, Vec3 } from "../core/types";
import { looks, type Look } from "../looks";
import { loadModel } from "./mesh";
import { inflate, type InflateOptions, type ShapeInput } from "./shape";

const hex = (h: string): Vec3 => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as Vec3;
