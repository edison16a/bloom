/**
 * What the art pages show. Plain data, so server components can render the words.
 * Each id matches a scene in lib/scenes.ts, which only client components import.
 */
export interface ArtPiece {
  id: string;
  title: string;
  prompt: string;
  /** Seconds into the loop to start, for scenes that build up from nothing. */
  start?: number;
}

export interface ArtGroup {
  id: string;
  name: string;
  note: string;
  pieces: ArtPiece[];
}

export const artGroups: ArtGroup[] = [
  {
    id: "text-objects",
    name: "Things made of words",
    note: "Objects typeset in their own words, lit like real things.",
    pieces: [
      { id: "bloom", title: "Bloom", prompt: "A pink flower made of letters that types itself, blossoms, then blows away to its golden core", start: 4.6 },
      { id: "tree", title: "Hanami", prompt: "A cherry bonsai under a low moon, spelling hanami, with petals drifting off", start: 4.5 },
      { id: "saturn", title: "Saturn", prompt: "Saturn in ASCII, with rings of drifting characters" },
      { id: "helix", title: "Helix", prompt: "A DNA double helix typed in GATTACA" },
    ],
  },
  {
    id: "dot-objects",
    name: "Objects in dots",
    note: "Three dimensional things drawn with hexagons, octagons or LED squares.",
    pieces: [
      { id: "jelly", title: "Jellyfish", prompt: "A glowing jellyfish made of octagons, drifting upward" },
      { id: "knot", title: "Chrome knot", prompt: "An iridescent torus knot in hexagons, turning slowly" },
      { id: "morpho", title: "Morpho", prompt: "A blue morpho butterfly flapping, in LED squares" },
      { id: "emblems", title: "Emblems", prompt: "Our nine product icons as inflated 3D shapes floating on a dark LED wall" },
    ],
  },
  {
    id: "backgrounds",
    name: "Backgrounds",
    note: "Full bleed motion that leaves calm space for a headline.",
    pieces: [
      { id: "ribbons", title: "Ribbons", prompt: "Dithered ribbons of blue light on near black, four colours only" },
      { id: "funnel", title: "Funnel", prompt: "Streams of light squeezing through a narrow waist, LED pixels, calm centre for a headline" },
      { id: "eclipse", title: "Eclipse", prompt: "A total eclipse in octagons with a breathing corona" },
      { id: "dunes", title: "Dunes", prompt: "Desert dunes at golden hour as a newspaper print, merging octagons" },
    ],
  },
  {
    id: "text-backgrounds",
    name: "Surfaces of words",
    note: "One phrase repeated until it becomes a surface.",
    pieces: [
      { id: "liquid", title: "Silk", prompt: "One sentence repeated edge to edge, moving like silk" },
      { id: "tide", title: "Tide", prompt: "An ocean swell at night made of the word tide" },
      { id: "keys", title: "Keys", prompt: "A tilted field of bevelled keys in ASCII, iridescent edges, dark behind the headline" },
      { id: "tunnel", title: "Corridor", prompt: "Rushing down a corridor of typed panels" },
    ],
  },
  {
    id: "blind-tests",
    name: "Blind tests",
    note: "Each one came from a fresh run of the agent with nothing but the prompt.",
    pieces: [
      { id: "lotus", title: "Lotus", prompt: "A blue lotus made of letters. It opens from a bud, then wind strips it to its golden core", start: 3.5 },
      { id: "hummingbird", title: "Hummingbird", prompt: "A hummingbird hovering, made of hexagons, emerald back, magenta throat that flashes as it turns" },
      { id: "aurora", title: "Aurora", prompt: "Aurora over a black treeline, octagon tiles, green into violet, room for a headline at the left" },
      { id: "rain", title: "Rain", prompt: "Rain on a window at night built from one sentence. Soft city lights behind" },
    ],
  },
  {
    id: "photos",
    name: "From your photos",
    note: "Hand it a picture and it redraws it in marks.",
    pieces: [
      { id: "pagoda", title: "Pagoda", prompt: "Turn this photo into a neon LED wall, teal to magenta" },
      { id: "dahlia", title: "Dahlia", prompt: "Turn this photo into a colour halftone of hexagons" },
      { id: "rocket", title: "Countdown", prompt: "Set this photo in a countdown" },
    ],
  },
];

/** One scene drawn on different surfaces, for the surface switcher. */
export const surfaces = [
  { id: "bloom", label: "Letters" },
  { id: "bloomHex", label: "Hexagons" },
  { id: "bloomOctagon", label: "Octagons" },
  { id: "bloomLed", label: "LED" },
  { id: "bloomDither", label: "Dither" },
  { id: "bloomPlus", label: "Plus signs" },
] as const;

/** The pieces the home page shows, biggest first. */
export const homeArt = ["jelly", "knot", "morpho", "saturn", "hummingbird", "aurora"] as const;

export const allPieces = (): ArtPiece[] => artGroups.flatMap((g) => g.pieces);
