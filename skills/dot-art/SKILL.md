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
