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
