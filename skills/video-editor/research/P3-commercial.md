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
