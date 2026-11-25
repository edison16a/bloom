/** Public types for the dot-art engine. Everything a scene can say lives here. */

export type Vec2 = [number, number];
export type Vec3 = [number, number, number];

/**
 * `hex` is a hexagon on a honeycomb lattice (set by itself: rows tighten and stagger so tiles nest).
 * `octagon` sits on a square lattice with diamond gaps. `square` is the LED tile.
 * Continuous SDF marks, plus `pixel` (full-bleed cell, for dithering) and `glyph` (atlas tile). */
export type Mark =
  | "square" | "hex" | "octagon" | "diamond" | "plus" | "cross" | "line" | "pixel" | "glyph";
