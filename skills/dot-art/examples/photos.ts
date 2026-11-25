import { defineScene, imageSource, looks } from "dot-art";

/** Photo -> LED wall. Subject relit by its own contours, recoloured by position. */
export const pagoda = defineScene({
  id: "pagoda", title: "Pagoda, LED wall", loop: 8, background: "#04050c", samples: 3,
  sources: [imageSource({ src: "/images/pagoda.jpg", focus: [0.34, 0.5], zoom: 1.0, invert: true, black: 0.12, white: 1.02, gamma: 2.4, local: 0.8, edge: 0.8, fill: 0.45 })],
  style: {
    cell: 5, mark: "square", size: [0.5, 0.78], round: 0.12, ghost: 0.05, ghostColor: "#1c2350", gamma: 1.1,
    color: { by: "space", angle: 0, stops: ["#12d6c5", "#2f7bff", "#7a4dff", "#ff3fb4"], highlight: 0.75, shade: 0.75 },
  },
  bloom: { strength: 0.55 }, pointer: { mode: "glow", radius: 160, strength: 0.7 },
});

/** Photo -> colour halftone. Hexagon size carries light, hexagon colour carries the picture. */
export const dahlia = defineScene({
  id: "dahlia", title: "Dahlia, hexagon halftone", loop: 8, background: "#030a0c", samples: 3,
  sources: [imageSource({ src: "/images/dahlia.jpg", focus: [0.46, 0.44], zoom: 1.12, black: 0.10, white: 0.82, gamma: 1.1, local: 1.3, saturation: 1.35, motion: "drift+sweep" })],
  style: { cell: 6.5, mark: "hex", size: [0.18, 1.04], gamma: 0.9, color: { by: "source", shade: 0.25 } },
  bloom: { strength: 0.35 }, pointer: { mode: "lens", radius: 150, strength: 0.6 },
});
