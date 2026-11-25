# V2 — Vertical (9:16) product, app and launch Shorts

25 official brand Shorts (Notion, Canva, Figma, OpenAI/ChatGPT, Google Pixel, Gemini, Framer, Airbnb, Apple, The Browser Company/Arc, Grammarly, ElevenLabs, Runway, Samsung, Raycast). All are 2025–2026 uploads from official channels' `/shorts` tabs. All were measured with `tools/measure.py` at 360x640 (Arc Android was 292x640), and I looked at every overview sheet plus most transition sheets.

**Selection notes**
- Three first-pick videos ran longer than 90 s: Canva "Google Analytics in Canva websites" (136 s), Figma "Edit and generate vectors" (172 s) and Figma "Custom animation styles" (179 s). I replaced them with in-range videos. Their measurements are kept in `excluded-over-90s/` for reference only. All three are presenter-over-UI tutorials at 6–16 cuts/min and −24 to −17.5 LUFS. They are slower and quieter than the in-range set.
- #24 Runway iOS/Android runs 95 s, slightly over the limit. I kept it.
- #03 (Notion T-rex skit), #07 (Samsung Buds) and #18 (Airbnb POV) have no on-screen UI. They are kept as examples of brand-feature Shorts that sell a feature without UI, and are marked in the table.

**Measurement caveats (read before using the numbers)**
1. **Cut counts are too low on motion-design pieces.** In #02 Notion "What is", #08 Figma gallery, #13 Circle to Search and #20 Arc Voice, scenes change through continuous animated transitions (scale, morph, scroll) rather than hard cuts, and the detector misses them. #02 reports 0.7 cuts/min and a 43 s median shot, but the sheet shows a new layout roughly every 1.5–3 s. For these four, read "visual beats" from the sheets, not from `cuts_per_min`.
2. **`hits_per_min` is mostly music, not SFX.** In #08, #11, #13, #15, #20 and #21 the hit timestamps are evenly spaced at the beat or half-beat period (for example #08 every 0.33 s, #21 every ~0.48 s, #20 every ~0.46 s). These are hi-hats and kicks. Real UI SFX can only be inferred where hits fall off the grid at visual events.
3. **Some BPM readings are octave or 2/3 errors.** #21 reads 83 BPM, but its hit spacing of 0.48 s gives about 125 BPM. #05 reads 75 BPM with strength 8.2, which is probably 150 BPM. #13 reads 83 BPM; its 0.36 s hit spacing suggests 166 double-time. Elsewhere the BPM agrees with hit spacing.
4. **#12 Pixel Tag has a silent audio track as uploaded.** LUFS reads −70, and the YouTube opus stream is only 4 kb/s, 23 KB. Its audio fields are N/A and it is excluded from the audio statistics.
5. **Speech share is low even on talking-head pieces** (#01 0.19, #14 0.19). The syllable-rate detector seems to under-read speech under music. Treat it as relative, not absolute.
