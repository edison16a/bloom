import type { ShaderSource, TextureInput } from "../core/types";

export interface ImageSourceOptions {
  /** URL, or a live element (image, canvas, video; pass `dynamic` for the last two). */
  src?: string;
  element?: TexImageSource | (() => TexImageSource);
  dynamic?: boolean;
  fit?: "cover" | "contain";
  /** Crop centre 0–1 (y down) and zoom. */
  focus?: [number, number];
  zoom?: number;
  /** Input levels: luma at which tone hits 0 and 1. */
  black?: number; white?: number;
  gamma?: number;
  /** Unsharp at a wide radius. The single biggest quality lever: separates subject from ground at low resolution. */
  local?: number;
  /** Glow along contours, so flat bright areas become lit outlines. */
  edge?: number;
  /** How much flat luma survives when edge is high. 1 = all, 0 = line art. */
  fill?: number;
  /** Measure contours on log luma, so dark-on-dark detail (a mast at dusk) glows as hard as a bright edge. Use it for night and low-key photos. */
  relative?: boolean;
  /** Extra glow on thin bars and lines: lattice, hair, wires. 0-1. */
  ridge?: number;
  invert?: boolean;
  /** Boost saturation when colour comes from the photo. */
  saturation?: number;
  /** Background colour key: pixels within `keyRange` of this colour drop out. */
  key?: [number, number, number]; keyRange?: number;
  /** drift = slow Ken Burns, sweep = a light band crosses, breathe = depth-of-tone parallax, none. */
  motion?: "none" | "drift" | "sweep" | "breathe" | "drift+sweep" | "reveal";
  /** Oval falloff: centre x,y and radii (0–1, y down). */
  oval?: [number, number, number, number];
}
