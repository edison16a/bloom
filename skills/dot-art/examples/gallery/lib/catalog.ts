import { scenes, logoScene, looks, withLook, type LazyScene, type Scene } from "dot-art";
import { dahlia, launchpad, pagoda, rocket } from "./photos";
import { aurora } from "./scenes/aurora";
import { hummingbird } from "./scenes/hummingbird";
import { lotus } from "./scenes/lotus";
import { rain } from "./scenes/rain";

export interface Entry { scene: Scene | LazyScene; prompt: string }
const word = logoScene({ id: "word", title: "Word, inflated", shape: { text: "dot" }, colors: ["#0d2b8f", "#19c3ff", "#eaffff"] });
const morphoHex = withLook(scenes.morpho, looks.hex({ cell: 8 }), { id: "morphoHex", title: "Morpho, in hexagons" });
