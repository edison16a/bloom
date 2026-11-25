<p align="center">
  <img src="assets/brand/bloom.svg" alt="Bloom logo" width="72">
</p>

<h1 align="center">Bloom</h1>

<p align="center">
  Three agent skills that make the art for your site, your launch film and your logo, plus the site that shows them off.
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-FF3D9A" alt="MIT license"></a>
  <img src="https://img.shields.io/badge/node-20%2B-FF3D9A" alt="Node 20 or newer">
  <img src="https://img.shields.io/badge/platform-macOS%20%7C%20Linux-FF3D9A" alt="macOS and Linux">
</p>

## Screenshots

<p align="center">
  <img src="assets/screenshots/home.webp" alt="The Bloom home page: the headline Bloom your idea into success next to a pink flower made of letters" width="100%">
</p>

<table>
  <tr>
    <td width="50%"><img src="assets/screenshots/art.webp" alt="The art section: a live jellyfish made of octagons beside the Dot Art description"></td>
    <td width="50%"><img src="assets/screenshots/launch.webp" alt="The launch section: the Bloom launch film playing over live streams of light"></td>
  </tr>
  <tr>
    <td width="50%"><img src="assets/screenshots/logo.webp" alt="The logo section: the Vela logo, its sail symbol on orange and its app icon"></td>
    <td width="50%"><img src="assets/screenshots/surfaces.webp" alt="The surface switcher: the same flower redrawn in hexagons"></td>
  </tr>
</table>

## What it is

Bloom is a monorepo of three skills for Claude Code and Codex. You bring the idea. The skills cover how the site looks, the launch video and the brand.

| | Skill | What it does | Folder |
|---|---|---|---|
| 1 | Dot Art | Animated art made of hexagons, LED pixels, dither or letters, dropped into your project as a React component | `skills/dot-art` |
| 2 | Launch Video | A launch film from a direction and a link: product capture, real music, short lines, cut to the beat in EffectCraft | `skills/video-editor` |
| 3 | Brand Creator | A logo, wordmark and full brand kit from a company name, based on research on 8,332 real tech logos | `skills/brand-creator` |

The site in `site/` shows each skill with real work it made: every dot art scene running live, a launch film, and five brands built with the brand builder (Vela, Bloom, Kite, Halo and Tessel). Bloom's own logo came out of Brand Creator.

## Set up a skill

The quickest way is the site: every skill has a **Copy setup prompt** button. Paste the prompt into Claude Code or Codex and the agent clones only that skill's folder from this repo, installs it in the right skills folder for itself, checks what it needs and tells you what is missing. The prompts are built in `site/lib/prompts.ts`.

To do it by hand, for example for Dot Art in Claude Code:

```bash
git clone --depth 1 --filter=blob:none --sparse https://github.com/edison16a/bloom.git /tmp/bloom
```

```bash
git -C /tmp/bloom sparse-checkout set skills/dot-art
```

```bash
cp -R /tmp/bloom/skills/dot-art ~/.claude/skills/dot-art && cd ~/.claude/skills/dot-art/scripts && npm install
```

For Codex, use `~/.codex/skills` instead. Launch Video and Brand Creator are workspaces with their own scripts, so copy them to a folder such as `~/bloom` and link the skill inside (`.claude/skills/<name>`) into your skills folder. Each one's README lists what it needs.
