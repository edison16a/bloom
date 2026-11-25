/** Public types for the dot-art engine. Everything a scene can say lives here. */

export type Vec2 = [number, number];
export type Vec3 = [number, number, number];

/**
 * `hex` is a hexagon on a honeycomb lattice (set by itself: rows tighten and stagger so tiles nest).
 * `octagon` sits on a square lattice with diamond gaps. `square` is the LED tile.
 * Continuous SDF marks, plus `pixel` (full-bleed cell, for dithering) and `glyph` (atlas tile). */
export type Mark =
  | "square" | "hex" | "octagon" | "diamond" | "plus" | "cross" | "line" | "pixel" | "glyph";

export interface GlyphStyle {
  /** Dark → bright. Include a leading space for "nothing here". Geometric characters such as · • ● ○ □ ■ ◆ ░▒▓█ are drawn procedurally. */
  ramp?: string;
  /** Phrase tiled across the grid. */
  message?: string;
  /** `ramp`: density ramp only. `hybrid`: ramp, with the message in cells brighter than `messageAbove`. `message`: every lit cell is a letter. */
  fill?: "ramp" | "hybrid" | "message";
  messageAbove?: number;
  /** Letters per second the message scrolls along each row (message / hybrid). */
  scroll?: number;
  /** Column offset added per row, so the phrase steps diagonally. Default 7. */
  rowShift?: number;
  /** Font weights for dark / mid / bright cells. */
  weights?: [number, number, number];
  font?: string;
  /** Glyph size as a fraction of cell height. Default 0.92. */
  fontScale?: number;
  /** 0–1. Clip and shade letters by the render underneath, so silhouettes are sharper than the letter grid. Default 0. */
  detail?: number;
  /** 0–0.5. Dim glow of the render behind the letters. Makes a form readable at any distance. Default 0. */
  under?: number;
  /** Draw / \ | - strokes on silhouettes and depth discontinuities. 0 disables. Default 0. */
  edges?: number;
  /** Cells brighter than this become a filled box with the glyph knocked out. >1 disables. */
  boxAbove?: number;
  /** Seconds a newly lit cell scrambles before settling. 0 disables. */
  glitch?: number;
  /** Scene time after which cells stop scrambling in. Default: never. */
  glitchUntil?: number;
  glitchChars?: string;
  /** Characters used for loose particles (flag > 0.5). */
  looseChars?: string;
}

export interface ColorStyle {
  /** `source`: colour from the scene. `tone`: gradient-map the tone. `space`: gradient across the frame. `mono`: first stop only. */
  by?: "source" | "tone" | "space" | "mono";
  stops?: string[];
  /** For `space`, direction in degrees (0 = left→right, 90 = top→bottom). */
  angle?: number;
  /** For `space`/`mono`, tone at which colour starts lifting towards white (0–1). 1 disables. */
  highlight?: number;
  /** Brightness also follows tone (LED look). 0 = flat colour, 1 = fully tone-driven. Default 1. */
  shade?: number;
  /** Fine per-pixel iridescent stripes, 0–1, applied to cells the scene flags as iridescent (flag 0.25–0.5) or all boxed cells. */
  iridescence?: number;
}
