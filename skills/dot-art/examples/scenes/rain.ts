import { defineScene, type OverlayCell } from "dot-art";

/** Text background. One sentence fills a wet window; city lights glow behind it, and running drops bend the lines. */
const TEXT = "it rained all night and the city kept talking ";
const SHIFT = 17, CW = 5, CH = 9, LOOP = 12;

// Drops and lights are plain numbers shared by the shader (as a data texture) and the overlay (as JS), so both agree.
let seed = 11; const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
const DROPS = 34, LIGHTS = 24, W = 8;