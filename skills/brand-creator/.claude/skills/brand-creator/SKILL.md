---
name: brand-creator
description: Create a professional logo, wordmark and full brand kit from a company or startup name, using research on 8,332 real tech logos from 6,259 brands. Shows three to five finished directions for the user to choose from, then delivers the chosen logo in brand color, black, white and reverse, a wordmark, lockups, app icon, favicons, palette and an offline brand board, with every file as SVG and transparent PNG. Use when asked to create a logo, a wordmark, a brand, a brand kit or brand identity, to change a logo's colors, or to export the full logo assets.
---

# Brand creator

Turn a company name into one finished, professional brand. First show the user three to five finished directions side by side and let them pick one; then build every file a startup needs for that choice only. The design is made fresh for each request, from the rules the research found in real logos. There are no templates.

Paths below are relative to the repo root (the folder that holds `scripts/build_brand.py`). Run Python as `python3 -I scripts/<name>.py`. Building needs `pip install "fonttools[woff]"` and Google Chrome or Chromium (set `CHROME=/path` if it is not found).

## What the research says (read this, it drives every choice)

From `research/patterns.md` (8,332 labeled logos) and `research/case_studies.md` (50 iconic tech brands). Craft 4+ means the labelers rated the logo as professional, world class work.

1. **Simple wins by a wide margin.** Symbols a child could draw from memory are rated craft 4+ 42% of the time; intricate ones 8%. Half of all craft 4+ symbols are the simplest level. Aim for 1 to 3 shapes.
2. **Flat or cut out, never detailed.** Flat and cut out styles: 41% craft 4+. Detailed, shaded or gradient: 21%. Outlines (line style) are more common among weak logos than strong ones.
3. **The strongest single symbol idea is a drawn letterform of the initial** (46% craft 4+, 30% of strong symbols), then abstract geometry (37%). Pictorial objects (28%) and characters or mascots (25%) underperform. Make the letterform a designed object (cut, folded, built from parts), not a letter typed in a font.
4. **No container by default** (62% of strong symbols). A rounded square belongs on the app icon, not in the logo.
5. **One or two colors.** 74% of strong full color logos use one or two colors. When a brand color is used it is saturated and mid light (median saturation 0.91, lightness 0.50), not pastel and not muddy. Black led brands are the largest group among strong logos (20%) and among the 50 case studies (13 of 41).
6. **Wordmarks: tight tracking, real weight.** Tight letter spacing appears in 42% of strong wordmarks against 14% of weak ones, and 62% of tight wordmarks are rated strong (wide: 29%). Light weights are never strong (0 of 23). Use medium to black weight with tracking around -0.02 to -0.05 em.
7. **Case follows the category.** Lowercase and sentence case dominate software and AI (Stripe, Linear, Vercel, OpenAI). All capitals is mostly hardware, defense, space and deep tech (NVIDIA, SpaceX, Tesla, Anduril, Anthropic, Etched).
8. **The word usually leads.** 65% of strong full logos put the symbol left of the word; 29% are word only. Leaders own one custom detail at most (Stripe's slanted dot, SpaceX's swoop, the Anthropic slash), and most strong wordmarks (77%) have none at all.
9. **Lockup proportions** (measured on 992 real lockups): gap about 0.20 of the symbol height, word ink about 0.9 of the symbol height, centers aligned. The builder already does this.
10. **Own one named color.** Strong brands name their color and use it everywhere (NVIDIA Green #76B900, Stripe Blurple #635BFF). Warm colors (orange, red, yellow) set AI companies apart from the blue field.

These are associations in a sample, not laws. Break one only with a reason you can state.

## Workflow

Work in `brands/<slug>/` (create it). Before the options, ask the user nothing beyond the name, unless they have not said what the company does; then ask that one question. Use any color or style preference they gave. Steps 1 to 6 explore and end with an options sheet; stop there and wait for the user's choice. Steps 7 to 9 build the full kit for that choice only. If the user says up front to skip the choice ("just build it", "surprise me"), build your top option and keep the others as alternatives.

### 1. Brief

Write `brands/<slug>/brief.md` in five lines: what the company does and for whom, its category archetype (pick one from `.claude/skills/brand-creator/references/archetypes.md`), three adjectives, the color strategy (black led, or one named saturated color, and why), and what the closest competitors' logos look like so you can stand apart.
