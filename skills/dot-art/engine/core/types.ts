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

export interface DitherStyle {
  type: "bayer" | "noise";
  /** Colour stops dark → bright. */
  stops: string[];
  /** Per transition: true = dithered, false = smooth. Length stops-1. Default all true. */
  bands?: boolean[];
  /** 0–1 random jitter mixed into the Bayer matrix. Default 0.18. */
  jitter?: number;
}

export interface Style {
  /** Cell size in CSS pixels. Number = square. */
  cell: number | Vec2;
  mark: Mark;
  /** Mark size at tone 0 and 1, as a fraction of the cell. Equal values = constant size. Above 1 lets tiles merge (halftone print). */
  size?: Vec2;
  /** Corner radius for square marks, 0–1. */
  round?: number;
  /** `stagger` offsets odd rows by half a cell. */
  grid?: "square" | "stagger";
  /** Screen angle in degrees. */
  angle?: number;
  /** Tone curve: out = pow(tone * gain + lift, gamma). */
  gamma?: number;
  gain?: number;
  lift?: number;
  /** Brightness of unlit cells. The faint LED grid that makes objects feel displayed. Default 0. */
  ghost?: number;
  ghostColor?: string;
  color?: ColorStyle;
  dither?: DitherStyle;
  glyph?: GlyphStyle;
}

export interface Fade {
  /** Fraction of the frame over which each edge fades out. */
  left?: number; right?: number; top?: number; bottom?: number;
  /** Quiet zone for a headline: centre x,y (0–1, y down), radii rx,ry. */
  hole?: [number, number, number, number];
  /** 0–1 how dark the hole gets. Default 0.8. */
  strength?: number;
}

export interface Bloom {
  strength: number;
  /** Radius multiplier. Default 1. */
  radius?: number;
  /** Only cells above this contribute. Default 0. */
  threshold?: number;
}

export interface Camera {
  eye: Vec3; target?: Vec3; fov?: number; near?: number; far?: number; roll?: number;
  /** Below this width/height the camera pulls back so the subject is never cropped at the sides. Set it on object scenes. */
  minAspect?: number;
}

export type UniformValue = number | number[] | boolean;
export type TextureInput =
  | { image: TexImageSource | (() => TexImageSource); dynamic?: boolean; linear?: boolean; flipY?: boolean }
  | { src: string; dynamic?: boolean; linear?: boolean; flipY?: boolean }
  | { data: Float32Array; width: number; height: number; linear?: boolean; dynamic?: boolean };

interface SourceBase {
  uniforms?: Record<string, UniformValue | ((t: number) => UniformValue)>;
  textures?: Record<string, TextureInput>;
  /** Extra GLSL functions shared by the hook. */
  common?: string;
}

/** Full-frame GLSL: `void scene(vec2 uv, vec2 p, inout Cell c)`. */
export interface ShaderSource extends SourceBase { type: "shader"; glsl: string; blend?: "over" | "add" }

export interface Geometry {
  position: Float32Array; normal?: Float32Array; color?: Float32Array;
  /** Four free floats per vertex, exposed as `p.extra`. */
  extra?: Float32Array;
  index?: Uint32Array;
}

/** Point or triangle surface: `void surface(int i, int n, vec4 rnd, inout Pt p)`. */
export interface SurfaceSource extends SourceBase {
  type: "surface";
  glsl: string;
  /** Number of procedural points, when there is no geometry. */
  count?: number;
  /** Geometry, or a function that builds it. A function runs on first render only, so importing the scene stays cheap and SSR-safe. */
  geometry?: Geometry | (() => Geometry);
  /** Draw the geometry as triangles instead of points. */
  triangles?: boolean;
  blend?: "opaque" | "add";
}

export type Source = ShaderSource | SurfaceSource;

/** A typed cell. `color` is 0-1 rgb, snapped to a 6-level cube. Default white. */
export interface OverlayCell { col: number; row: number; char: string; tone?: number; color?: Vec3 }
export interface GridInfo { cols: number; rows: number }

export interface Scene {
  id: string;
  title: string;
  /** Loop length in seconds. `u_phase` runs 0→1 over it, and every bundled scene loops exactly. */
  loop: number;
  background: string | "transparent";
  sources: Source[];
  style: Style;
  bloom?: Bloom;
  fade?: Fade;
  camera?: Camera | ((t: number, aspect: number) => Camera);
  /** Scene supersampling per cell. Default 2. */
  samples?: number;
  /** Typed characters written straight onto the grid (glyph mark only). Row 0 is the top. */
  overlay?: (t: number, grid: GridInfo) => OverlayCell[];
  /** Pointer response. */
  pointer?: { mode: "glow" | "lens" | "ripple"; radius?: number; strength?: number };
  /** Frame used for posters and reduced motion, in seconds. Default loop * 0.5. */
  poster?: number;
}

export function defineScene(s: Scene): Scene { return s; }

/** A scene that needs something fetched first, such as a 3D model. */
export interface LazyScene { id: string; title: string; background: string; load: () => Promise<Scene> }
