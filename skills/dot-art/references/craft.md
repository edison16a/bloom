# Craft: what makes it look expensive

Score a render against this before showing it. Every line should pass.

## Form

| Check | Target |
|---|---|
| Readable when squinting | Named in one second, at thumbnail size too |
| Cells across the subject | Hex, octagon, LED: 60+. Letters: 90+ columns and 45+ rows. Photos: 140+ |
| Subject size | 60-80% of frame height for an object. Nothing important cropped |
| Light | One key from upper left, one cooler rim from behind. Never front-lit |
| Overlap | Parts that overlap differ in tone by 0.2 or more. Darken the part behind (`tone*=mix(.15,1.,smoothstep(z))`) |
| Thin parts | No thinner than 2 cells, or they flicker |

## Tone

- Terminator is soft (`wrapDiff`), core shadow falls to 0.05-0.1, not to grey.
- Square the diffuse (`d*d`) for solid objects. Linear diffuse looks flat after quantising.
- Less than 8% of cells at pure white. If highlights merge into a slab, use `1.-exp(-x*k)` instead of clipping.
- Dark ground is tinted (#04050c, #09090f, #1a0818), never #000 unless the piece is pure light.

## Colour

- Pick shadow, body and highlight as a ramp in one direction (indigo to cyan to white; wine to hot pink to blush). Add at most one accent far away on the wheel, in under 5% of cells (gold stamens in a pink flower).
- Space gradients need four stops and `highlight` around .75 so bright cells still reach white.
- LED looks: constant size, brightness follows tone (`size: [.74,.74]`, `shade: 1`) plus a faint `ghost` grid. Print looks: size follows tone (`size: [.18, 1.04]`, `shade` under .3), no ghost. For solid objects in hex or octagon, keep size near-constant (`[.85,.95]`) and let `shade: .85` carry depth.

## Texture

- Sizes: hex 6.5-9 px, octagon 7-8 at `size` .88+ (smaller reads as round), LED squares 4-5, dither 4, letters 4x7 to 6x11.
- Letters: ramp runs from sparse to dense with two leading spaces, so near-black is empty. Message only in lit areas (`messageAbove` .55-.75) on objects; everywhere (`fill: "message"`) on backgrounds.
- Cap weights at 700 for cells under 5 px. 800 closes up the counters.
- `edges: 1` on solid objects with clear overlaps. 0 on fur, foliage, glass.
- `rowShift` coprime with the message length so the phrase steps diagonally, never in stripes.

## Motion

- Loop 6-12 s for objects, 20-40 s for backgrounds described as slow. Full rotations are 8 s or longer.
- Layer three rates: slow drift (1 cycle), medium (2-3), sparkle (4+). All integers.
- Objects never only spin. Add breathing, a light sweep, particles leaving, or a story.
- Anticipate and overshoot: `eback` for arrivals, `ein` for departures, `eio` for morphs.
- Stagger with a per-point or per-part delay. Nothing large starts on one frame.
- Particles leave along one wind direction plus curl. Keep few (`alpha` falls fast) so the shape they left stays legible.

## Backgrounds

- 70% of the frame is quiet. One bright idea, off centre.
- Composed for type on top: `fade.hole`, or keep the copy side dark.
- No detail frequency near the headline's stroke width.

## Photo to dots

1. Crop tight. One subject, plain ground. Low resolution cannot carry a busy scene.
2. `local` .7-1.3 first: the biggest gain. It separates subject from ground.
3. Then `black` and `white` until the ground drops out.
4. `edge` .5-.9 with `fill` .4-.6 for the contour-glow look. `edge` 0 and `fill` 1 for photographic.
5. Night or low-key photo: `relative: true`, `ridge` .5-.8, `edge` 1+, `fill` .35.
6. Bright sky behind a dark subject: `invert: true`, `gamma` 2+.
7. Faces: `halftone`, 140+ columns, `edge` under .3.
