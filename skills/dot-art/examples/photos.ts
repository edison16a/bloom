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
