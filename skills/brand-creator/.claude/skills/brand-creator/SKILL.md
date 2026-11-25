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

### 2. Look at real references

Render two or three reference sheets that match the archetype and look at them (Read the PNG):

```bash
python3 -I scripts/examples.py --set word --craft 5 --case lower --track tight --n 30 --out brands/<slug>/ref-words.png
python3 -I scripts/examples.py --set mark --craft 5 --kind LI,G --simple 2 --n 40 --out brands/<slug>/ref-marks.png
python3 -I scripts/examples.py --brand stripe,linear,vercel,nvidia,spacex --out brands/<slug>/ref-named.png
```

If it says the cache is missing, run `python3 -I scripts/collect_logos.py --skip-wd` once (about a minute). Narrow filters often return fewer logos than `--n`; the script says so, and you can drop a filter (for example `--track`) to see more. `--brand` matches exact names first, so `--brand stripe` is Stripe and not every name containing it. Learn proportions, weight and restraint. Never copy a logo.

### 3. Wordmark candidates

Write `brands/<slug>/candidates.json` (format in `scripts/preview.py`) with 10 to 16 wordmarks: different fonts (`python3 -I scripts/build_brand.py --list-fonts`), cases, weights and tracking, all inside the research ranges. Two or three may carry one custom detail: `accent_chars` (indexes drawn in the accent color) or `custom_glyphs` (replace one character, by its index, with your own SVG drawn in a box 100 units tall; `{"3": {"svg": "...", "w": 72, "height": "cap"}}` where `w` is the box width in the same units (default 100) and `height` is `cap` or `x`; use `{I}` as the fill). `case` is `lower`, `upper`, `title` (every word capitalized) or `as-is` (exactly as typed, for names like "iRobot"). Render and look:

```bash
python3 -I scripts/preview.py --candidates brands/<slug>/candidates.json
```

Keep the best three. Judge spacing between letters (no letters touching, no holes), weight at small size, and whether it looks like the archetype's leaders.

### 4. Symbol candidates

Add 16 to 24 original symbols to `candidates.json` as SVG bodies with color tokens `{P}` primary, `{A}` accent, `{I}` ink. Draw in any coordinates; the builder scales each symbol to its visible ink. Rules:

- One to three shapes, flat fills, optional cut outs with a mask (`<mask id="m{U}">`, `{U}` becomes a unique id; inside a mask use literal `#fff` to keep and `#000` to cut, never a color token). No gradients, text, images, filters, scripts or style blocks (the builder rejects them).
- It must still read in one color: shapes painted `{P}`, `{A}` and `{I}` become the same color in the black, white and app icon versions, so separate parts with gaps or cut outs, never by color alone. The preview shows the one color version next to the color one; delete any symbol that collapses into a blob.
- It must read at 16 px (the preview shows 32 and 16 px).
- Vary the ideas: designed initial letterform, abstract geometry, a cut or fold, bars or rays, dots or grid, one simple object only if it says something true about the company.
- Do not draw the company name's literal meaning as a picture, and do not imitate a famous logo.

Render, look, then narrow to the best four. Add `lockups` pairs and render again to see the best three symbol and wordmark pairs together. A lockup pair may carry `cap_ratio` and `gap` to try sizes (see step 7).

### 5. Color

Pick the primary from the brief: either black led (ink as the main color, the primary used as a small accent) or one saturated mid light color. A light primary (amber, yellow, lime) cannot carry a white symbol: the builder then puts the ink color on the app icon and the on brand tiles and warns if you forced white. Ink is a near black (for example #0E0E10, not pure #000), paper is white or a warm off white. Give the primary a name. Try two or three palettes on the best lockup by editing `colors` in `candidates.json` and rendering again. Check the primary against white for contrast if the word will be set in it.

### 6. Show the options and wait for a choice (do not skip)

Turn the best work from steps 3 to 5 into three to five finished directions, each a complete logo: one symbol, one wordmark setting and one palette. Make them really different (another symbol idea, another type feel, or another hue family), not small variations of one logo, and order them with your recommendation first. Write `brands/<slug>/options.json` (format in `scripts/preview.py`) and render it:

```bash
python3 -I scripts/preview.py --options brands/<slug>/options.json
```

This writes `options.png` and `options.html`. Read `options.png` and fix anything that fails the checks in step 8 before showing it. Then show the user the sheet (send `options.png`, or point to `brands/<slug>/options.html`) and, in plain sentences, give each option's number, name and one line idea, say which one you recommend and why, and ask them to pick a number. Tell them they can mix parts (the symbol of 2 with the type of 1) or ask for changes or a new round. **End your turn here.** Do not write `brand.json` or build anything until the user answers.

If the user asks for changes or new directions, update `options.json` (or go back to steps 3 to 5), render again and ask again. Keep at most five options on a sheet.

### 7. Build the chosen option

Only after the user has picked. Write `brands/<slug>/brand.json` with the chosen option as the main `symbol`, `wordmark` and `colors`, and the options they did not pick as `alternatives` in the order shown:

```json
{
  "name": "Acme",
  "tagline": "What it does in one line",
  "rationale": "Two sentences: why this logo fits the company and its category.",
  "colors": {"primary": "#FF5A1F", "accent": "#FFB800", "ink": "#0E0E10", "paper": "#FFFFFF",
             "idea": "Signal Orange: warm in a cold blue category."},
  "symbol": {"svg": "<path d='...' fill='{P}'/>", "idea": "What the mark is and why."},
  "wordmark": {"font": "inter-800", "case": "lower", "tracking": -0.04, "accent_chars": [], "custom_glyphs": {},
               "idea": "Why this type."},
  "lockup": {"cap_ratio": 0.66, "gap": 0.24},
  "app_icon": {"inset": 0.2, "symbol_color": "#FFFFFF"},
  "alternatives": [
    {"label": "Option 2: uppercase", "why": "...", "symbol": {"svg": "..."}, "wordmark": {"font": "...", "case": "upper", "tracking": 0.02}},
    {"label": "Option 3: black led", "why": "...", "colors": {"primary": "#0E0E10"}}
  ]
}
```

`lockup.cap_ratio` is the word's cap height as a share of the symbol height (default 0.66) and `gap` the space between them (default 0.24); `stack_cap_ratio` and `stack_gap` do the same for the stacked logo (defaults 0.36 and 0.24). Real lockups put the word's full ink at about 0.9 of the symbol height. Uppercase words and lowercase words with ascenders and descenders look right near the default; a lowercase word with few ascenders (like "nook" or "lumen") needs about 0.8.

The alternatives are the options the user did not pick (each label keeps its option number from the sheet so the user can still say "use option 3"). A color only alternative must differ clearly at thumbnail size (another hue family, or black led), not a nearby shade. Then:

```bash
python3 -I scripts/build_brand.py --brand brands/<slug>/brand.json
python3 -I scripts/preview.py --board brands/<slug>/brand-board.html
```

### 8. Review and fix (do not skip)

Read `brands/<slug>/board.png` (the whole board on a light theme; add `--theme dark` to see it dark) and the color PNGs in `brands/<slug>/assets/png/`. White and reverse PNGs are white on transparent and look blank in an image viewer, so check those on the board's dark tiles instead. Fix and rebuild until every answer is yes:

- Would this sit comfortably next to the reference sheet's best logos? If it looks amateur next to them, simplify.
- Is the symbol one to three shapes, flat, and does the black version read on its own? Does the 16 px favicon read?
- Are the word's letters evenly spaced, with nothing touching, and is the word about as tall as the symbol in the lockup?
- One custom detail at most, and only if it adds meaning.
- No gradient, shadow, outline or more than three colors anywhere.
- The build printed no contrast warning, and the on brand color tiles and app icon read clearly.
- It does not resemble a famous logo or a direct competitor's.

### 9. Deliver

Tell the user, in plain sentences:

- The logo they chose and the one line reason (symbol idea, type, color name and hex).
- Where everything is: `brands/<slug>/brand-board.html` (open it in a browser: every version, the color pickers, single file downloads, and Full kit zip), `brands/<slug>/<slug>-brand-kit.zip`, and the `assets/svg` and `assets/png` folders.
- What is in the kit: horizontal and stacked logo, symbol and wordmark, each in color, black, white and reverse, as SVG with the type converted to outlines and as transparent PNG at 1024 and 2048 px; app icons at 180, 512 and 1024 px; favicons at 16, 32, 48 and 192 px.
- The alternatives on the board, and that they can ask for any change.
- That a trademark search before using the name and logo is their job.

## Changes the user may ask for

Edit `brand.json` and rebuild; never hand edit the generated files.

| Request | What to do |
|---|---|
| "Make the color different", "more blue", "darker" | Change `colors` (keep saturation and lightness in the research range unless they insist), rebuild, show the new hero PNG. |
| "Option 2", "I like 3" (answering the options sheet) | Build that option (step 7). |
| "Symbol of 2 with the type of 1" | Combine those parts as the main logo, render the options sheet again with the mix as option 1 if it is not obvious it works, otherwise build. |
| "None of these", "show me more" | Back to steps 3 to 6 with new ideas; show a new options sheet. |
| "Use option 3" (after the kit is built) | Move that alternative into the main `symbol`, `wordmark` or `colors`, put the old main into the alternatives, rebuild. |
| "Give me the full assets", "black and white versions", "transparent PNG" | They already exist: point to the zip and the `assets` folders; rebuild first if anything changed. |
| "Bigger text", "closer", "more space" | Adjust `lockup.cap_ratio` or `lockup.gap`. |
| "Just a wordmark" | Keep the main symbol for the app icon only and recommend the wordmark file as the logo. |
| "Different style", "more playful", "more serious" | Go back to steps 3 to 6 with new candidates and show a new options sheet. |
