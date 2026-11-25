<p align="center">
  <img src="docs/brand/symbol.svg" alt="Brand Creator logo" width="72">
</p>

<h1 align="center">Brand Creator</h1>

<p align="center">
  A Claude Code skill that turns a company name into a professional logo, wordmark and full brand kit, using research on 8,332 real tech logos.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/logos%20researched-8%2C332-F2541B" alt="Logos researched: 8,332">
  <img src="https://img.shields.io/badge/python-3.9%2B-F2541B" alt="Python 3.9 or newer">
  <img src="https://img.shields.io/badge/built%20for-Claude%20Code-F2541B" alt="Built for Claude Code">
</p>

## What it does

Tell Claude "create a brand for Acme, we make X". It first shows you three to five finished logo directions side by side and asks which one you want. Once you pick, it builds everything a startup needs for that choice: the logo in brand color, black, white and reverse, a wordmark, horizontal and stacked lockups, an app icon, favicons, a named palette and a brand board you can open in any browser. Every file comes as SVG with the type converted to outlines, and as transparent PNG.

Then keep talking to it. "Make the color more purple", "use option 3", "bigger text" or "give me the full assets" edit one spec file and rebuild the whole kit.

Nothing is a template. Every symbol is drawn fresh for the name, and the choices follow what the research found separates strong logos from weak ones: simple flat shapes, a designed initial or one geometric idea, one or two saturated colors, and a tight, heavy wordmark.

## Screenshots

![Brand board for a test brand, Nook](docs/screenshots/board.png)

| | |
|---|---|
| ![Nook](docs/screenshots/nook.png) | ![Tidepool](docs/screenshots/tidepool.png) |
| ![Lumen Labs](docs/screenshots/lumen-labs.png) | ![Ferrite](docs/screenshots/ferrite.png) |

These are made up companies from test runs: a savings app, a developer tool, an AI accounting company and a chip maker. Each was designed by an agent that only read the skill. This repo's own logo was made the same way.

## Technical details

**The research.** 8,332 logo files from 6,259 brands: every simple-icons brand with its official hex, gilbarbara/logos, svgl's modern tech and AI set, 1,703 YC companies that reached Series A or later or were acquired, and 246 Wikidata tech companies (Wikimedia rate limits stopped that download early). Every file was measured from pixels in headless Chrome (shape, color clusters, symmetry, lockup proportions) and labeled by eye from contact sheets (symbol kind, container, style, simplicity, craft, and for wordmarks the typeface class, case, weight, tracking and custom detail). Fifty iconic brands such as NVIDIA, SpaceX, Anthropic, OpenAI, Stripe and Linear have written case studies.

**What it found** (`research/patterns.md`):

| Finding | Number |
|---|---|
| Simplest symbols rated professional (craft 4+) | 42%, against 8% for intricate ones |
| Flat or cut out style rated professional | 41%, against 21% for detailed or shaded |
| Strong symbols with no container | 62% |
| Strong full color logos using one or two colors | 74% |
| Tight tracking in strong wordmarks | 42%, against 14% in weak ones |
| Light weight wordmarks rated strong | 0 of 23 |
| Gap between symbol and word in real lockups | about 0.20 of the symbol height |

**The builder** (`scripts/build_brand.py`) reads a `brand.json`, sets the wordmark from 43 bundled SIL Open Font License fonts with real GPOS kerning (fontTools), converts it to outlines, measures each symbol's ink in Chrome so every lockup is optically balanced, and writes 18 SVGs, 42 PNGs, an offline `brand-board.html` (color pickers, any export size, client side zip) and a `<name>-brand-kit.zip`.
