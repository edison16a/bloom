import type { Scene, Style, Bloom } from "./core/types";

/** A look is a Style plus bloom: the surface treatment, independent of what is being drawn. */
export interface Look { style: Style; bloom?: Bloom }

const DUO = ["#05060f", "#2a35d8", "#5468ff", "#ffffff"];

/** Ready-made surface treatments. Spread one over any scene with `withLook(scene, looks.led())`. */
export const looks = {
  /** LED wall: constant squares whose brightness follows light. The 3D-logo look. */
  led: (o: Partial<Style> = {}): Look => ({ bloom: { strength: 0.6 }, style: { cell: 4, mark: "square", size: [0.74, 0.74], ghost: 0.16, ghostColor: "#101a3c", gamma: 0.95, color: { by: "source", shade: 1 }, ...o } }),
  /** LED wall recoloured left to right. The neon photo look. */
  neon: (stops = ["#12d6c5", "#2f7bff", "#7a4dff", "#ff3fb4"], o: Partial<Style> = {}): Look => ({ bloom: { strength: 0.55 }, style: { cell: 5, mark: "square", size: [0.5, 0.78], round: 0.12, ghost: 0.05, ghostColor: "#1c2350", gamma: 1.1, color: { by: "space", angle: 0, stops, highlight: 0.75, shade: 1 }, ...o } }),
  /** Print halftone: hexagons grow with light until they merge into solid colour. */
  halftone: (stops?: string[], o: Partial<Style> = {}): Look => ({ bloom: { strength: 0.3 }, style: { cell: 7, mark: "hex", size: [0.18, 1.04], gamma: 0.95, color: stops ? { by: "tone", stops, shade: 0.1 } : { by: "source", shade: 0.28 }, ...o } }),
  /** Honeycomb: hexagonal tiles that nest edge to edge. Light changes brightness, and size if you widen `size`. */
  hex: (o: Partial<Style> = {}): Look => ({ bloom: { strength: 0.45 }, style: { cell: 9, mark: "hex", size: [0.9, 0.9], ghost: 0.05, ghostColor: "#1b2146", gamma: 0.95, color: { by: "source", shade: 0.95 }, ...o } }),
  /** Octagons on a square grid, with diamond gaps. Reads as mosaic tile. */
  octagon: (o: Partial<Style> = {}): Look => ({ bloom: { strength: 0.45 }, style: { cell: 8, mark: "octagon", size: [0.94, 0.94], ghost: 0.05, ghostColor: "#1b2146", gamma: 0.95, color: { by: "source", shade: 0.95 }, ...o } }),
  /** Ordered dither: hard pixels, four inks. */
  dither: (stops: string[] = DUO, o: Partial<Style> = {}): Look => ({ bloom: { strength: 0.12 }, style: { cell: 4, mark: "pixel", gamma: 1, dither: { type: "bayer", stops }, ...o } }),
  /** Type: density ramp in the shadows, a phrase set into the light. */
  type: (message: string, o: Partial<Style> = {}): Look => ({ bloom: { strength: 0.45 }, style: { cell: [4, 7], mark: "glyph", gamma: 0.95, color: { by: "source", shade: 0.55 }, glyph: { ramp: "  ..··::;~+ivxsn*%", message: message.endsWith(" ") ? message : message + " ", fill: "hybrid", detail: 0.8, under: 0.18, messageAbove: 0.6, rowShift: 5, edges: 1, weights: [400, 500, 700] }, ...o } }),
  /** Wall of words: every cell is a letter, light only changes weight and brightness. */
  words: (message: string, o: Partial<Style> = {}): Look => ({ bloom: { strength: 0.4 }, style: { cell: [5, 9], mark: "glyph", gamma: 1.05, color: { by: "source", shade: 0.85 }, glyph: { message: message.endsWith(" ") ? message : message + " ", fill: "message", detail: 0.8, under: 0.2, rowShift: 11, weights: [400, 500, 700] }, ...o } }),
  /** Symbols: one mark per cell, plus signs, crosses or diamonds instead of letters. */
  marks: (mark: "plus" | "cross" | "diamond" | "line" = "plus", o: Partial<Style> = {}): Look => ({ bloom: { strength: 0.4 }, style: { cell: 8, mark, size: [0.2, 0.95], gamma: 0.95, color: { by: "source", shade: 0.5 }, ...o } }),
};

/** The same scene, different surface. Overlays only make sense on glyph looks, so they are dropped elsewhere. */
export function withLook(scene: Scene, look: Look, over: Partial<Scene> = {}): Scene {
  return { ...scene, style: look.style, bloom: look.bloom ?? scene.bloom, overlay: look.style.mark === "glyph" ? scene.overlay : undefined, ...over };
}
