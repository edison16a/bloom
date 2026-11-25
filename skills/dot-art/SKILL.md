---
name: dot-art
description: Build animated dot art and text art for Next.js + TypeScript. Turns anything (an idea, a photo, a logo or SVG, a word, a .glb/.obj model) into a seamless, full-colour, looping asset drawn in hexagons, octagons, LED squares, halftone, ordered dither, or letters. Covers dot objects, dot images, dot backgrounds, text objects (3D things made of type, such as a flower of letters that blossoms), and text backgrounds (a phrase repeated into a surface). Also exports GIF, MP4, WebM and WebP. Use whenever the user asks for dot art, block/pixel/LED/halftone/dithered/ASCII/hexagon/honeycomb visuals, "made of dots", "made out of text", an animated hero background, a 3D logo in dots, or wants a photo or 3D model turned into dots, even if they do not name this skill.
---

# dot-art

A WebGL2 engine (no runtime dependencies) plus a way of working. You describe **what** is drawn with a little GLSL, a photo, a shape or a model. The engine renders it at low resolution into a grid, then draws each grid cell as a mark or a letter. Everything is deterministic and loops exactly.

```
source (3D points, raymarch, photo, model)  ->  grid of tone + colour  ->  marks or letters  ->  bloom
```

## Map

| Path | What |
|---|---|
| `engine/` | The engine. Copied into the user's project, then theirs. |
| `engine/scenes/` | 16 finished scenes in four families. **Read the closest one before writing your own.** |
| `engine/looks.ts` | Ready surface treatments: `led neon halftone hex octagon dither type words marks` |
| `scripts/` | `install` `new` `sheet` `render` (Node 20+, Chrome, ffmpeg) |
| `references/recipes.md` | Request to technique: which source, look and numbers to start from |
| `references/authoring.md` | GLSL hooks, every uniform and helper, loop rules, full style options |
| `references/craft.md` | What separates great from cheap, with numeric targets. Read before judging a render. |
| `references/next.md` | `<DotArt>` props, heroes, scroll scrubbing, mobile, performance |
| `examples/` | Photo scenes, four more finished scenes in `examples/scenes/`, prompts, and a Next.js gallery app |

First use: `cd <skill>/scripts && npm install` (esbuild and playwright-core).

## Workflow

Copy this list and tick it off.

```
[ ] 1 Decide: family, source, look, palette, motion story
[ ] 2 Install the engine into the project
[ ] 3 Start from the nearest scene (or scripts/new.mjs)
[ ] 4 sheet.mjs: look at one large frame, fix form first
[ ] 5 sheet.mjs --n 9: look at the whole loop, fix motion
[ ] 6 Score against references/craft.md; repeat 4-5 until every line passes
[ ] 7 Mount with <DotArt>, check in the real page, and at 390 px wide
[ ] 8 Export GIF/MP4 if asked
```

### 1. Decide

Pick one from each column, and say the choice in one line before building.

| Family | Source | Look |
|---|---|---|
| dot object | `surface` points, `logoScene`, `modelScene` | led, halftone, hex, octagon |
| dot image | `imageSource` | neon (contour glow), halftone (full colour), dither, type |
| dot background | `shader` | dither, halftone, led |
| text object | same as dot object | `type` |
| text background | `shader` | `words`, or glyph ramp |

Words people use, and what they mean here:

| They say | Use | Why |
|---|---|---|
| dots, hexagon, honeycomb | `hex` | Default "dot". Tiles nest, so depth and shading survive |
| octagon, mosaic, tile | `octagon` | Square grid, diamond gaps. Best for print-like fields |
| block, pixel, LED | `square` | Constant size, brightness carries light |
| dithered, retro, 8-bit | `pixel` + `dither` | Four inks, no greys |
| ASCII, text, made of words | `glyph` | Letters carry light and outline |

There is no circle mark, on purpose: circles leave gaps that break up the depth of a 3D form. If asked for round dots, use `hex` and say so: at 5-8 px it reads as a dot.

Then give it a **story**: what appears, what it does, how it leaves or returns. "Rotates" alone is a screensaver. Good ones: types itself, collapses to a seed, buds, opens, holds, blows away, leaves the core, dissolves back to the seed.

### 2. Install

```bash
node <skill>/scripts/install.mjs <project> --scenes bloom,knot   # omit --scenes for all 16
```

Lands in `components/dot-art` (or `src/components/dot-art`). Re-run with `--force` to update the engine; scene files already there are kept. `--reset` overwrites the shipped scenes too.

### 3. Write the scene

```bash
node <skill>/scripts/new.mjs aurora --kind background --import "@/components/dot-art" --out components/dot-art/scenes/aurora.ts
# kinds: object background text-object text-background image model logo
```

Scenes are plain objects. Two shortcuts cover a lot:

```ts
import { logoScene, modelScene, imageSource, looks, withLook, defineScene } from "@/components/dot-art";
export const mark  = logoScene({ id: "mark", shape: { path: "M12 1...Z", viewBox: [0,0,24,24] }, look: looks.led() });
export const jet   = modelScene({ id: "jet", url: "/jet.glb", motion: "assemble", look: looks.type("cleared for takeoff") });
export const photo = defineScene({ id: "photo", title: "", loop: 8, background: "#04050c", samples: 3,
  sources: [imageSource({ src: "/office.jpg", local: 0.9, edge: 0.8, fill: 0.45 })], ...looks.neon() });
export const same  = withLook(flower, looks.hex(), { id: "flowerHex" });   // any scene, any surface
```

For an original object, write a `surface` hook (see `scenes/knot.ts` for a compact one, `scenes/bloom.ts` for a full story). For a background, write a `scene` hook (`ribbons.ts`, `dunes.ts`, `tide.ts`). Hook signatures and helpers: `references/authoring.md`.

Three loop rules that cannot be broken:
1. Drive motion with `u_phase` (0 to 1) as whole cycles: `sin(TAU*u_phase*k)`, k an integer.
2. Noise over time is `lnoise(p, u_phase, r)`, never `snoise(vec3(p, u_time))`.
3. A story scene may use `u_time`, if the first and last frames match.

### 4-6. Look, judge, repeat

```bash
node <skill>/scripts/sheet.mjs components/dot-art/scenes/aurora.ts --n 1 --size 1200x750 --dpr 2 --out /tmp/a.png
node <skill>/scripts/sheet.mjs components/dot-art/scenes/aurora.ts --n 9 --out /tmp/a9.png
```

Flags: `--at 3.2` picks the moment, `--from 2 --to 4` zooms into a beat, `--tile 800` enlarges sheet tiles, `--id x` picks a scene in a file with several, `--assets public` says where `/photo.jpg` lives. Judge at the size and dpr it will ship at: a smaller frame has fewer cells.

**Open the PNG and look at it every time.** Compiling is not done. Expect four to eight rounds. Judge in this order, since each hides the next:

1. **Form.** Squint. Can you name it in one second? If not: fewer, larger features; more contrast between lit and shadow side; smaller cells; subject bigger (60-80% of frame height).
2. **Tone.** The whole range gets used: true black, a few pure highlights, most of it between. Mush means `gamma` up or `shade` up. Washed out means less ambient.
3. **Colour.** Two or three related hues plus white. Highlights go to near-white, shadows keep hue.
4. **Texture.** Marks crisp, no moire, letters readable at 100%.
5. **Motion.** Step the 9-up. Something changes between every frame, nothing pops, last flows into first.

With a reference, put it side by side with your frame and list the differences in words before editing. Pass bar: shown both, a designer would not say which is the copy.

**Text objects need resolution.** Default to `cell: [4, 7]`, `samples: 4`, `detail: 0.8`, `under: 0.2`. `detail` clips letters to the real silhouette at 4x the letter grid, and `under` puts a dim render behind them, so the shape reads instantly. This is the most common failure: letters too large for the shape.

### 7. Mount

```tsx
"use client";
import { DotArt } from "@/components/dot-art/react";
import { aurora } from "@/components/dot-art/scenes/aurora";

<section style={{ position: "relative", height: "80vh" }}>
  <div style={{ position: "absolute", inset: 0 }}><DotArt scene={aurora} /></div>
  <h1 style={{ position: "relative" }}>Headline</h1>
</section>
```

Import the scene file directly so only that scene ships. Scenes hold functions, so a server component cannot pass one as a prop: import it inside a client component. Behind a headline, set `fade.hole` so the copy sits in a calm area. Give object scenes `camera.minAspect` so phones do not crop them.

### 8. Export

```bash
node <skill>/scripts/render.mjs aurora.ts --out aurora.mp4 --size 1920x1080          # 60 fps, dpr 2
node <skill>/scripts/render.mjs aurora.ts --out aurora.gif --size 720x450 --max-mb 6
```

For type in a GIF use `--size 800x500 --dpr 1.5`: at dpr 1 small letters turn to noise.

## Do not

- Ship a first render. Nothing here was good on the first render.
- Recreate a third party's logo or artwork unless the user supplies it or owns it.
- Set `hex` or `octagon` cells under 5 px, or glyph cells under 4x7: they stop being marks.
- Use rainbow palettes, or bloom above 0.7. Both read as cheap.
- Put motion behind text without a hole or fade.
