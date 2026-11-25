# P2: High-craft edited YouTube (real people + heavy motion graphics)

25 videos measured with `tools/measure.py`. The video list is in `.list.txt`. Every folder was checked after the shared-temp-dir incident: each has `metrics.json` and all three sheets. Folder 15 was fully re-measured. Downloads ran without subtitles (YouTube returned 429 on subtitle requests), so `subtitle_wpm_estimate` is null everywhere.

The brief asks for 2023–2026 videos. Five picks are older, but they are kept as style references because the channel's house style is unchanged today: 03 Vox (2021), 05 HAI (2021), 09 Johnny Harris (2019), 17 MrBeast (2020) and 21 PolyMatter (2017). Two Wendover picks from 2016–17 were dropped and replaced with 2026 uploads (06, 07).

## Measurement caveats (read before using the numbers)
- **Cut detection misses graphics-driven edits.** `scdet` at threshold 12 does not see slide-pushes, map moves, zooms or pop-ons inside one continuous graphic. HAI (04: 1.5 cpm), Kurzgesagt (20: 2.8) and PolyMatter (21: 1.7) look far busier on the sheets than these numbers say. Read their cpm as "hard cuts between different pictures", not "visual changes".
- **Video 17 (MrBeast 2020) cut metrics are broken.** The median shot is 0.03 s, which means consecutive-frame detections. This is 60 fps footage with a huge on-screen countdown timer that changes every second, plus constant whip pans. The cpm of 81.8 is not real and is excluded from the stats.
- **Video 04 (HAI)** has false cuts from flying-money particle overlays in its densest window. Its transition sheet shows overlay animation, not cuts.
- **`hits_per_min` is saturated by narration.** Most videos land at 50–79 hits/min whatever their style. The stored hit list is capped at 200, so any first-3-minute figure ≥ 66.7 means "capped". The detector picks up consonant transients in a voice-over, so it is **not** a usable SFX-density measure for VO-led content. It only differs for low-VO vlogs (16 MrBeast: 23/min, 23 Nick Shirley: 35/min).
- **`cuts_with_hit_share` sits at or below chance in every video.** Chance = 1 − exp(−hpm/60 × 0.24 s) ≈ 0.09–0.27; the measured share is 0.00–0.19. Inference: either the cut-synced whooshes are mixed under the VO, or the detector can't separate them from speech. These numbers cannot show "every cut has a whoosh". The sheets show the visual events; the SFX claims below are inferred from them.
- **`speech_share` (0.18–0.49) is far too low** for videos that are narrated almost wall to wall. The detector undercounts when music sits under the VO. Use it for relative comparison only.
- **`beat_strength` is ≤ 1.76 everywhere** and above 1.6 in only 4 videos. The music is a bed under the VO, not a beat to cut to (see below).
- **Several `biggest_lifts` values of 150–173 dB** (09, 10, 11, 23) are artifacts from digital silence (log of ~0). Ignore them.
- **HAI and Wendover measure −23.5 to −24.7 LUFS with true peak −5 to −10 dBTP.** Every other channel measures −12 to −22. This may be how those channels master, or it may be the specific audio format served. Treat it as unverified.
