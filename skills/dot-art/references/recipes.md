# Recipes: request to starting point

Find the nearest row, open that scene, copy it, change the subject.

| They ask for | Start from | Keys |
|---|---|---|
| Flower / thing made of letters that opens and blows away | `scenes/bloom.ts` | surface points, petals as bent strips, beats in `u_time`, `glitch` while opening |
| Flower with pointed petals, rings, heart | `examples/scenes/lotus.ts` | marched petals, per-ring lean, seed pod |
| Bird, animal, creature with a spine | `examples/scenes/hummingbird.ts` | spine and radius tables, motion-blurred wings |
| Aurora, curtains, volumetric light | `examples/scenes/aurora.ts` | marched sheet, treeline, hole for headline |
| Glass, rain, refraction in text | `examples/scenes/rain.ts` | overlay shifts letters, bokeh behind |
| Plant, tree, coral growing | `scenes/tree.ts` | lazy geometry with birth time in `extra`, clouds of puffs |
| Helix, rope, cable, molecule | `scenes/helix.ts` | tube around a curve, depth fade on the far side |
| Planet, globe, ball | `scenes/saturn.ts` | analytic sphere in a shader, message wraps it |
| Product icons or logos floating in 3D | `scenes/emblems.ts`, `emblemScene` | inflate + LED + ghost wall |
| One logo or word as a hero | `logoScene` | `motion: "sway"`, look led or hex |
| 3D model into dots or text | `modelScene` | `assemble` for an entrance, `rotate` to stand it up |
| Abstract hero object | `scenes/knot.ts` | iridescent tube, additive rim |
| Creature with soft parts | `scenes/jelly.ts`, `scenes/morpho.ts` | parametric body, phase-lagged limbs |
| Photo as neon LED wall | `examples/photos.ts` pagoda | `invert`, `edge`, `looks.neon` |
| Night photo as neon LED wall | `examples/photos.ts` launchpad | `relative`, `ridge`, `looks.neon` |
| Photo as colour halftone | `examples/photos.ts` dahlia | `local` 1.3, `looks.halftone()` |
| Photo set in words | `examples/photos.ts` rocket | glyph hybrid, `detail` .9 |
| Flowing ribbons, retro dither | `scenes/ribbons.ts` | domain-warped bands, hard leading edge, 4 inks |
| Landscape, horizon | `scenes/dunes.ts`, `scenes/tide.ts` | heightfield raymarch |
| Light streaks, speed, data flow | `scenes/funnel.ts` | additive strands with head and tail |
| Space, sun, eclipse | `scenes/eclipse.ts` | polar rays, staggered octagons |
| Tilted field of tiles or keys in ASCII | `scenes/keys.ts` | raymarched bevels, `boxAbove`, iridescence |
| One phrase filling the page | `scenes/liquid.ts` | `fill: "message"`, light folds |
| Tunnel, corridor, city | `scenes/tunnel.ts` | analytic planes, hashed panels |
| "Same thing but in hexagons / octagons / text" | `withLook(scene, looks.hex())` | one line |
