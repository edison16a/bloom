import { looks, withLook, type Scene } from "dot-art";
import * as engine from "@/components/dot-art/scenes";
import { aurora } from "@/lib/dot-art-examples/scenes/aurora";
import { hummingbird } from "@/lib/dot-art-examples/scenes/hummingbird";
import { lotus } from "@/lib/dot-art-examples/scenes/lotus";
import { rain } from "@/lib/dot-art-examples/scenes/rain";
import { dahlia, pagoda, rocket } from "@/lib/dot-art-examples/photos";

/**
 * Every scene the site can draw, by id. Scenes hold GLSL and functions, so they live on the client
 * and pages pass ids. Variants are built once here at module scope, as the engine asks.
 */
const variants: Scene[] = [
  withLook(engine.bloom, looks.led({ cell: 5 }), { id: "bloomLed", title: "Bloom, LED" }),
  withLook(engine.bloom, looks.dither(["#07060a", "#7a1450", "#ff3d9a", "#ffe3f1"], { cell: 4 }), { id: "bloomDither", title: "Bloom, dither" }),
  withLook(engine.bloom, looks.marks("plus", { cell: 9 }), { id: "bloomPlus", title: "Bloom, plus signs" }),
];
