# L1-devtools: launch films from premium dev-tool and productivity SaaS companies

25 official brand-channel launch films (2023–2026). All were measured with `tools/measure.py` (the version that retries scdet at threshold 5 when cuts/min < 6). The overview sheet was read for every video, and the transitions and open sheets for most.

## Measurement caveats (read first)
- **The cut counter is the weakest metric in this category.** Many of these films have no hard cuts at all. Scenes change through continuous camera moves, morphs (a headline turns into an input bar, which turns into an app window), cross-dissolves on near-black, and blur-ins. Even at threshold 5, scdet found 0–2 cuts in 01, 02, 03, 05, 12, 24 and 25.
- So the table has two columns: **cuts/min (scdet)** and **scene changes/min (visual)**. The visual column is my count of distinct compositions or title cards on the overview sheet. It is an estimate (±20%), filled in only where scdet clearly undercounts (marked `v`). Elsewhere it equals the scdet value.
- **Some BPM values are probably half or double-time errors.** For example, 03 reads 72 BPM, but its transients repeat every ~0.28 s, which suggests ~107 BPM 8ths. 24 reads 76 BPM with hits every ~0.39 s (~153/77). I flag these where the hit spacing disagrees with the BPM.
- `cuts_on_beat_share` and `cuts_with_hit_share` are meaningless when there are ~0 cuts. Those cells are null or 0 for that reason, not because the cuts miss the beat.
- Nobody listened to anything. Every statement about SFX or music is inferred from waveform numbers plus what the frames show.

## 1. Table

| # | Video / channel / URL | Len s | Cuts/min scdet → visual | Median shot s | BPM (strength) | LUFS | Hits/min | % cuts on beat | % cuts with hit | Speech | Dominant flow | Distinctive |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 01 | Introducing Linear Agent / Linear / youtu.be/mRql2VJ99gM | 55 | 2.2 → ~10v | 9.8 | 74 (2.1) | -28.9 | 13 | 0 | 0 | 0.00 | Z+ / ↑ (slow 3D push) | One-take 3D-tilted camera gliding across dark UI; near-silent bed; logo + "At your command." |
| 02 | Introducing Linear Releases / Linear / youtu.be/6dIwFoQ0eVg | 30 | 2.0 → ~14v | 15.0 | 110 (3.6) | -24.7 | 10 | 0 | 0 | 0.03 | ← ↑ drift | Greyscale branching-graph abstraction; mono typewriter captions with a block cursor |
| 03 | Introducing Linear for Agents / Linear / youtu.be/sbwOQV5zY34 | 33 | 0 → ~25v | n/a | 72 (5.7) *likely ~107* | -17.4 | 73 | n/a | n/a | 0.00 | ↑ Z+ | Quiet 9 s intro → +9.6 dB lift at the first UI action → click every ~0.28 s |
| 04 | Vercel Ship 2024 / Vercel / youtu.be/PHvw0IP7dEU | 36 | 10 → ~16v | 2.6 | 115 (6.0) | -11.1 | 18 | 33 | 33 | 0.00 | Z+ / ← → | Macro-camera over printed-paper type, particle-dissolve wipes; +12.2 dB drop at 11 s |
| 05 | Introducing v0 / Vercel / youtu.be/By9wCB9IZp0 | 48 | 0 → ~11v | n/a | 100 (4.1) | -16.7 | 101 | n/a | n/a | 0.00 | Z+ then → | Single continuous morph: logo → headline → pill → prompt bar → app; 8th-note ticks at 0.30 s |
| 06 | New Raycast. Coming 2026 / Raycast / youtu.be/Mi173xGb0ZA | 39 | 7.8 → ~14v | 4.7 | 77 (2.7) | -13.2 | 23 | 20 | 0 | 0.03 | ↑ ← | Macro DOF close-ups of UI on a chrome wallpaper; ends with a rapid mono "NEW / X" list; +14.4 dB at 28 s |
| 07 | Raycast Focus: Enter Flow State / Raycast / youtu.be/ykaj0pS4A1A | 51 | 31.9 | 0.92 | 90 (2.3) | -14.6 | 46 | 7 | 26 | 0.04 | ← → alternating | Live-action anxiety montage (eyes, clock, notifications) accelerating to 61 cuts/min, then silence and calm |
| 08 | A New Start / Raycast for Windows / youtu.be/QTcUR5BjN2M | 53 | 32.9 | 1.29 | 81 (2.4) | -16.4 | 53 | 10 | 24 | 0.10 | ← → | Nostalgia archival montage (Win95, Solitaire, BSOD) in boxed frames on black → "Now on Windows" |
| 09 | Arc 1.0 – Everything or nothing / The Browser Company / youtu.be/n5Vwrj1gEWs | 34 | 31.5 | 1.43 | 93 (4.2) | -11.5 | 84 | 22 | 33 | 0.32 | mixed | Framed archival "v1.0" curiosities with serif word cards ("can mean" / "everything" / "or" / "nothing") |
| 10 | Arc on Windows. Download now. / The Browser Company / youtu.be/LJQsAOon6og | 37 | 54.0 | 0.83 | 125 (6.9) | -9.8 | 49 | 24 | 27 | 0.03 | ← ↓ | Macro CRT retro cuts → 3-2-1 → rolling counter on brand blue → fast UI tour; loudest in batch |
| 11 | Introducing Warp 2.0 / Warp / youtu.be/k9BRhSbVSpI | 147 | 13.5 | 0.46 | 115 (3.1) | -17.7 | 52 | 24 | 9 | 0.34 | . (static) | Founder keynote on a dark set + UI cards on gradients; 0.21–0.29 s tweet-wall burst at 125–130 s |
| 12 | Agents 3.0 – Full Terminal Use / Warp / youtu.be/gBdehHrtb94 | 122 | 0.5 → ~6v | n/a | 94 (2.5) | -18.2 | 58 | n/a | n/a | 0.47 | . | VO-led single screen recording with crop-zoom reframes; title chip "full terminal use" |
| 13 | Introducing Cursor 3 / Cursor / youtu.be/UxbULt_hCdA | 90 | 15.9 | 3.75 | 103 (3.5) | -27.3 | 49 | 21 | 33 | 0.36 | . | Two founders at a table (doc-style), cutaways to over-the-shoulder laptop and full-screen light UI |
| 14 | Introducing Cursor 2.0 / Cursor / youtu.be/An8IM-kPyms | 64 | 5.6 → ~12v | 2.2 | 113 (11.1) | -29.3 | 112 | 33 | 67 | 0.03 | → | Minimal white typewriter captions + bar chart + light UI over a wallpaper; metronomic quarter-note pulse |
| 15 | Zed is 1.0 / Zed Industries / youtu.be/c6Bns1T77HM | 132 | 9.1 | 2.59 | 118 (2.0) | -17.3 | 54 | 15 | 25 | 0.35 | ← ↑ | VO story: GitHub stats → tilted code panes → user testimonials → meetup photos → giant Z logo |
| 16 | Introducing the new Notion AI / Notion / youtu.be/S92KX8-Hmlc | 57 | 11.7 | 3.29 | 105 (5.2) | -22.4 | 100 | 27 | 36 | 0.00 | . ↑ | Off-white + Notion-blue cards; inline chip-swap headline "One AI tool to [chip]"; mascot face |
| 17 | Introducing Notion 3.0: Agents / Notion / youtu.be/R1cF4T4lgI4 | 90 | 14.7 | 2.0 | 120 (7.4) | -15.2 | 83 | 9 | 27 | 0.01 | ← Z+ | Push into the prompt box: giant type-on text with the camera tracking the caret; cowboy-hat mascot |
| 18 | Meet Notion Mail / Notion / youtu.be/54l-1NfXnX8 | 60 | 17.0 | 2.17 | 142 (2.2) | -22.1 | 41 | 59 | 6 | 0.18 | ← → | Paper-plane mascot flies through each title card as the transition; "It organizes itself / drafts…" |
| 19 | All the launches at Config 2025 / Figma / youtu.be/NHodnYFUT_I | 81 | 68.0 | 0.58 | 130 (8.1) | -15.7 | 99 | 27 | 46 | 0.00 | mixed | Maximalist colour-block montage, flat-out pace all four quarters; hits every 0.46 s (8ths) |
| 20 | Config 2026, refreshed / Figma / youtu.be/SROdrbZ8A8Q | 30 | 8.0 → ~18v | 5.1 | 152 (5.1) | -11.9 | 44 | 25 | 50 | 0.00 | ← ↑ | Glitchy stencil-type identity, spray-noise shapes on saturated flats; +7.4 dB drop at 12 s |
| 21 | Framer 3.0 / Framer / youtu.be/6aioEoCdBJw | 75 | 14.4 | 3.67 | 80 (3.6) | -13.8 | 0.8 | 22 | 0 | 0.00 | ← Z± | Neon-blue glow UI; no transients at all (pad score); light-streak title sequence at the end |
| 22 | Framer: All Design, No Code, Real Websites / Framer / youtu.be/6xJWQRVl9nw | 37 | 9.7 | 3.67 | 78 (4.0) | -15.7 | 83 | 0 | 50 | 0.08 | ← | Typed "Get started for free" button → layout skeleton → full site; build-up-from-wireframe |
| 23 | Introducing Superhuman / Superhuman HQ / youtu.be/4XKq7qGnJus | 60 | 4.0 → ~14v | 9.75 | 130 (3.7) | -11.6 | 76 | 25 | 50 | 0.07 | ↑ → | Iridescent gradient; app icons orbit a person, then collapse into the logo; per-product colour washes |
| 24 | Introducing Loom AI / Loom / youtu.be/apqd3aEMnuY | 47 | 0 → ~13v | n/a | 76 (6.9) *hits ~0.39 s* | -10.3 | 87 | n/a | n/a | 0.09 | ↑ | One continuous purple field with floating spheres; captions and UI cards slide in and out, no cuts |
| 25 | Build Anything, Govern Everything / Retool / youtu.be/FWNNP5rqbF4 | 55 | 2.2 → ~24v | 13.2 | 80 (6.8) *hits 0.375 s = 160 8ths* | -18.7 | 102 | 0 | 50 | 0.13 | ← Z± | Word-by-word blur-in manifesto on a dark gradient; logo glyph-scramble "Reto01" → "Retool" |
