# P3 — Commercials & brand films (real people + on-screen type/graphics)

25 videos, measured with `tools/measure.py`, plus overview and transitions sheets read for every one (and open sheets for 21 and 23).
All numbers come from metrics.json. Anything marked *(inf.)* is my inference from the sheets and numbers. Nothing was listened to.

**Measurement caveats (read first)**
- **Cut-detector undercounts** on dark, low-contrast or graphic-morph footage. For example, 01 iPhone "Scratch" shows about 12 shots in the overview, but 2 cuts were detected. 12 Squarespace (B&W, dark) is also undercounted. 14 Slack and 11 Airbnb are continuous motion-graphic or 3D morphs, so "cuts" barely applies there. Treat their cuts/min as lower bounds.
- **BPM octave ambiguity.** 13 of 25 read 71–79 BPM, including the fastest-cut edits (21 Mavs: 91 cuts/min at "71.5 BPM"; 23 PL: 108 cuts/min at "88.5"). These are very likely half-time reads of ~140–160 BPM tracks *(inf.)*. Read the BPM column as "x or 2x".
- **hits_per_min counts music transients too.** In 14 Slack, hits land every ~0.46 s, which is exactly the 129 BPM beat. A high hits figure plus very high beat_strength (13 Notion 7.7, 14 Slack 7.5) means a punchy kick/percussion bed, not necessarily SFX.
- **speech_share looks low** for spots that clearly carry VO or dialogue (09, 17). Treat it as relative only.
- 11 Airbnb is CG animation, not live action, and 24 Galaxy is mostly CG product render. Both are kept for their type and transition craft and flagged as off-category. 13 Notion (2022) and 20 Gymshark (2018) are older than the 2023–26 target.
- Some sibling batches measured overlapping videos (e.g. Pixel "Switch like Sol" is also in L4).

## 1. Table

| # | Title / channel / URL | Len s | Cuts/min | Med shot s | BPM (beat str.) | LUFS | Hits/min | % cuts on beat | % cuts w/ hit | Speech | Dominant flow | Distinctive |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 01 | iPhone 17: 3x More Scratch Resistant / Apple / youtu.be/PBrYMBacnyM | 35 | 3.4* | 5.13* | 122.8 (4.55) | -16.0 | 13.7 | 0 | 0 | .03 | ← / static (51%) | Deadpan boardroom comedy; one product line over shallow-DOF product shot at end |
| 02 | iPhone 17 Pro: Smart Group Selfies / Apple / youtu.be/er7MJvQCdsM | 35 | 54.8 | 0.77 | 135.0 (4.09) | -15.6 | 94.1 | 44 | 47 | 0 | ← / Z± | Photo "slam" on white, a new photo every ~0.5 s on the beat; highest on-beat share |
| 03 | MacBook Pro with M5 Pro and M5 Max / Apple / youtu.be/GriXfu4tL30 | 100 | 31.2 | 1.54 | 75.0 (3.10) | -16.4 | 18.6 | 19 | 6 | .01 | ← → | Scattered word-by-word kinetic type; letters drop in like keystrokes |
| 04 | Mac Students: journey to great ideas / Apple / youtu.be/77uoRieSk8s | 93 | 41.7 | 0.75 | 160.3 (3.06) | -16.0 | 33.4 | 31 | 18 | .01 | ← → ↑ ↓ mixed | Graphic match-cut: file icon and cursor locked in place while the desktop changes every ~3 frames |
| 05 | Winning Isn't For Everyone – Am I a Bad Person? / SportsOnScreen (Nike) / youtu.be/wFKHMeJadH8 | 120 | 34.5 | 0.88 | 86.3 (1.59) | -14.0 | 32.0 | 10 | 10 | .23 | → (only 6% static) | VO-driven athlete face montage; cut rate rises every quarter (16→24→42→56) |
| 06 | Greatness. It Only Takes Everything – Nadal / Nike / youtu.be/X0xbNUMZCvk | 60 | 41.0 | 1.10 | 74.8 (1.97) | -10.7 | 17.0 | 7 | 7 | .07 | ↓ | B&W 4:3 pillarbox, archive+new; crescendo to Q3 then a quiet fog end card |
| 07 | Winning Isn't For Everyone – Again – LeBron / Nike / youtu.be/_Ra6wkIoJp0 | 30 | 23.9 | 2.04 | 75.5 (2.85) | -24.1 | 55.8 | 17 | 33 | .07 | → | Hazy-arena single location; red condensed slam type end card |
| 08 | Dream Job – Pixel SB 2025 / Made by Google / youtu.be/-7e6g11BJc0 | 125 | 23.5 | 2.13 | 79.0 (2.29) | -13.5 | 43.6 | 27 | 14 | .21 | → | Life montage; face-position match cuts (baby → grad); +42.7 dB lift at 108 s |
| 09 | Switch like Sol – Pixel 9 / Made by Google / youtu.be/aFQvG0WQkpU | 60 | 11.0 | 3.32 | 74.3 (2.03) | -15.2 | 41.0 | 0 | 9 | .23 | ← | Comedy walk-and-talk to camera; clean white product end card |
| 10 | Your Favourite Artists reveal Spotify 2025 Wrapped / Spotify / youtu.be/YlxlsQVLw3E | 166 | 22.0 | 2.20 | 72.5 (1.76) | -17.4 | 37.1 | 8 | 15 | .08 | → | Sketch vignettes; diegetic stat cards (clapperboard, street sign, CRT TVs) |
| 11 | Bedtime / Airbnb / youtu.be/GFM_3D8GdXs | 30 | 6.0* | 4.40 | 106.3 (3.27) | -17.0 | 41.9 | 33 | 0 | .20 | ← static 73% | **CG.** Cutaway dollhouse room; camera pulls out, room swaps for the bigger home |
| 12 | Unavailable (Extended) – Squarespace 2026 / Squarespace / youtu.be/2cLNMXUNzxY | 97 | 7.4* | 1.75 | 73.8 (1.89) | -17.1 | 19.1 | 8 | 0 | .01 | ↓ / static 55% | B&W silent-film melodrama; huge serif UI type inserts; rounded film-gate frame |
| 13 | The Search – Notion / Notion / youtu.be/vO9YGI5Gf4s | 30 | 21.9 | 2.52 | 106.0 (7.70) | -13.3 | 89.7 | 0 | 36 | .03 | Z+ pushes | UI comment cards pop over live action and type themselves out |
| 14 | The ultimate work OS / Slack / youtu.be/zYotA_PNwbw | 30 | 8.0* | 3.50* | 129.0 (7.50) | -14.0 | 75.8 | 0 | 0 | 0 | ← (90% moving) | Pure kinetic type with inline logo pills; footage inside pill masks; continuous pan |
| 15 | Wix Harmony – Big Game 2026 / Wix / youtu.be/rRo5spaBfbo | 30 | 29.9 | 1.47 | 71.3 (2.76) | -14.1 | 33.9 | 13 | 0 | .07 | ← | Glass prompt box types over live action; giant editorial serif from the generated site |
| 16 | You Got This / adidas / youtu.be/FzaS0V_FCrI | 88 | 53.2 | 0.68 | 77.5 (1.95) | -13.7 | 28.6 | 13 | 13 | .10 | → | B&W 4:3 → full-colour 16:9 switch; spin match-cut chains; spaced-letter end type |
| 17 | F50 Made Me Do It – The Monologue / adidas Football / youtu.be/jY5TLIYXpZg | 116 | 23.3 | 2.08 | 133.3 (1.89) | -14.3 | 59.7 | 27 | 29 | .16 | ← | Mockumentary groundskeeper interview; binocular-vignette POV; serif subtitles |
| 18 | Powerbeats Pro 2 ft. LeBron, Messi, Ohtani / Beats / youtu.be/zR63m0JN5WY | 123 | 31.7 | 0.90 | 97.3 (1.61) | **-9.8** | 51.7 | 12 | 14 | .07 | → (6% static) | Cut-to-black beats; floodlight flare whites; "LISTEN TO YOUR HEART" slab type |
| 19 | FOREVER. FASTER. See the Game Like We Do / PUMA / youtu.be/LRJP140fv3E | 87 | 36.4 | 1.06 | 100.8 (3.03) | -14.2 | **96.0** | 13 | **42** | .16 | ← | Surreal athlete vignettes; heaviest SFX-on-cut; motion-blur streak logo reveal |
| 20 | Build Your Legacy / Gymshark / youtu.be/Wt5SlONIRZ0 | 95 | 11.3 | 3.29 | 75.3 (1.92) | -20.8 | 21.4 | 22 | 11 | .09 | ← | (2018) Statues ↔ lifter intercut, dark grade, slow pacing that winds down |
| 21 | The Blueprint – 2025-26 Season Hype / Dallas Mavericks / youtu.be/mZwuphEg5KU | 48 | **90.8** | **0.42** | 71.5 (2.18) | **-8.9** | 42.3 | 14 | 18 | .02 | ← | B&W hype; caption-style VO lines bottom-centre; fastest open (144 cuts/min Q1) |
| 22 | You're In It Now / Premier League USA / youtu.be/XDS8EdW_vVo | 106 | 56.0 | 0.58 | 73.8 (2.35) | -15.0 | 58.3 | 14 | 30 | .21 | → | Diner dialogue with match-footage bursts; jersey-crest match-cut run |
| 23 | IT'S TIME! 2023/24 season / Premier League / youtu.be/YT7ERC4km5g | 51 | **108.2** | **0.36** | 88.5 (2.15) | -23.3 | 43.5 | 15 | 18 | .08 | → | Collage maximalism: gradient frames, clone trails, torn-paper wipes, colour-flash type |
| 24 | Galaxy S25 Edge: Beyond slim / Samsung / youtu.be/FCMFh07nX4Y | 35 | 18.8 | 2.26 | 85.3 (4.18) | -11.1 | 32.5 | 18 | 27 | 0 | ← | **Mostly CG.** Line split by the phone itself ("Designed to ▌ fit your style") |
| 25 | Indiana Pacers 2025 Playoffs Hype / Indiana Pacers / youtu.be/HrjMZSR7eDI | 30 | 81.7 | 0.53 | 126.5 (2.44) | -15.6 | 31.9 | 20 | 15 | .33 | ← | Newspaper-clipping collage open; 2–4-frame bursts; fan-reaction punch-ins |

\* = cut detector undercounts (see caveats).
