import { scenes, logoScene, looks, withLook, type LazyScene, type Scene } from "dot-art";
import { dahlia, launchpad, pagoda, rocket } from "./photos";
import { aurora } from "./scenes/aurora";
import { hummingbird } from "./scenes/hummingbird";
import { lotus } from "./scenes/lotus";
import { rain } from "./scenes/rain";

export interface Entry { scene: Scene | LazyScene; prompt: string }
const word = logoScene({ id: "word", title: "Word, inflated", shape: { text: "dot" }, colors: ["#0d2b8f", "#19c3ff", "#eaffff"] });
const morphoHex = withLook(scenes.morpho, looks.hex({ cell: 8 }), { id: "morphoHex", title: "Morpho, in hexagons" });

export const catalog: { name: string; note: string; items: Entry[] }[] = [
  { name: "Dot objects", note: "Three-dimensional things, lit and drawn with marks.", items: [
    { scene: scenes.emblems, prompt: "Our nine product icons as floating 3D shapes on a dark LED wall" },
    { scene: scenes.knot, prompt: "An iridescent torus knot in hexagons, turning slowly" },
    { scene: scenes.jelly, prompt: "A glowing jellyfish made of octagons, drifting upward" },
    { scene: scenes.morpho, prompt: "A blue morpho butterfly flapping, in LED squares" },
  ] },
  { name: "Dot backgrounds", note: "Full-bleed motion that leaves room for a headline.", items: [
    { scene: scenes.ribbons, prompt: "Dithered ribbons of blue light on near-black, four colours only" },
    { scene: scenes.dunes, prompt: "Desert dunes at golden hour as a newspaper print, merging octagons" },
    { scene: scenes.funnel, prompt: "Streams of light squeezing through a narrow waist, LED pixels" },
    { scene: scenes.eclipse, prompt: "A total eclipse with a breathing corona, in octagons" },
  ] },
  { name: "Text objects", note: "Objects typeset in their own words.", items: [
    { scene: scenes.bloom, prompt: "A pink flower made of letters that blossoms, then blows away" },
    { scene: scenes.tree, prompt: "A cherry bonsai under a low moon, spelling hanami" },
    { scene: scenes.helix, prompt: "A DNA double helix typed in GATTACA" },
    { scene: scenes.saturn, prompt: "Saturn in ASCII with rings of drifting characters" },
  ] },
  { name: "Text backgrounds", note: "Words repeated until they become a surface.", items: [
    { scene: scenes.keys, prompt: "Tilted field of bevelled keys in ASCII with iridescent edges" },
    { scene: scenes.liquid, prompt: "One sentence repeated edge to edge, moving like silk" },
    { scene: scenes.tide, prompt: "An ocean swell at night made of the word tide" },
    { scene: scenes.tunnel, prompt: "Rushing down a corridor of typed panels" },
  ] },
  { name: "Blind tests", note: "Made by a fresh agent that had only the skill and the prompt.", items: [
    { scene: lotus, prompt: "A blue lotus made of letters that opens, then the wind strips it to its golden core" },
    { scene: hummingbird, prompt: "A hummingbird in hexagons, magenta throat that flashes as it turns" },
    { scene: aurora, prompt: "Aurora over a black treeline in octagons, room for a headline at left" },
    { scene: rain, prompt: "Rain on a window at night, built from one sentence" },
  ] },
  { name: "From pictures, words and shapes", note: "Bring your own source.", items: [
    { scene: pagoda, prompt: "Turn this photo into a neon LED wall, teal to magenta" },
    { scene: dahlia, prompt: "Turn this photo into a colour halftone of hexagons" },
    { scene: launchpad, prompt: "Turn this night photo into a neon LED wall, contours brighter than surfaces" },
    { scene: rocket, prompt: "Set this photo in a countdown" },
    { scene: word, prompt: "Inflate the word dot into a 3D LED object" },
    { scene: scenes.bloomOctagon, prompt: "The same flower, in octagon tiles" },
    { scene: scenes.bloomHex, prompt: "The same flower, in hexagons" },
    { scene: morphoHex, prompt: "The butterfly again, as a honeycomb" },
  ] },
];
export const byId = (id: string) => catalog.flatMap((g) => g.items).find((e) => e.scene.id === id);
