# Brand Creator: standing orders

This repo turns a company name into a professional logo, wordmark and full brand kit. The design rules come from research on 8,332 real tech logos from 6,259 brands, which lives in `research/`. The skill is `.claude/skills/brand-creator/SKILL.md`.

## When the user asks for a logo, wordmark, brand or brand kit

Invoke the `brand-creator` skill and follow it from step 1. It ends the first turn with an options sheet of three to five finished directions; build the full kit only after the user picks one. If the user only gives a name and has not said what the company does, ask that one question first. Everything for a brand goes in `brands/<slug>/` (git ignored).

When the user asks for a change ("make it more blue", "use option 3", "give me the full assets"), edit `brands/<slug>/brand.json` and rebuild. Never hand edit generated SVG, PNG or `brand-board.html` files.

## Setup

- Python 3.9 or newer and `pip install -r requirements.txt` (fontTools with woff2 support).
- Google Chrome or Chromium for measuring symbols and rendering PNGs. Set `CHROME=/path/to/chrome` if it is not found.
- `research/cache/` (the reference logo files) is not in git. `python3 -I scripts/collect_logos.py --skip-wd` downloads it again in about a minute; only `scripts/examples.py` needs it.
