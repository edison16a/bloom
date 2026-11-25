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
