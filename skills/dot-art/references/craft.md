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
