# P1 — Founder / CEO / creator talking-head edits (25 videos)

Category: professionally edited real-person videos where a founder, CEO or creator speaks to camera and the edit adds kinetic text, SFX, punch-ins, B-roll and images. Mix: 17 horizontal long-form (1.7–8.2 min), 6 vertical Shorts (25–90 s), 2 brand/founder films (a16z, Kimi). All measured with `tools/measure.py`; every folder has `metrics.json`, 3 sheets and `shots/`. Eight downloads first failed on YouTube subtitle 429s and were re-run sequentially until they succeeded.

## Measurement caveats (read before using the numbers)
- **Cut counts are undercounts for same-setup jump cuts.** `scdet` at threshold 12 misses cuts between near-identical frames (same speaker, same background). Example: #07 YC "50 founders" reads 2.8 cuts/min, but the overview sheet shows about 40 different founder pairs in 4 min, and the near-identical #08 reads 16.3. Treat talking-head cuts/min as a floor. Real jump-cut rates for #01, #02, #03, #07, #09, #11, #15, #18, #20, #25 are probably higher.
- **`hits_per_min` fires on speech consonants, not only on SFX.** #25 Dan Koe Short (plain voice, no visible SFX) scores 94.5 hits/min, the highest in the batch. In speech-led videos the hit count is mostly plosives. Use it as a ceiling, not as an SFX count.
- **Chance baselines.** At about 57 hits/min, a ±0.12 s window lands on a hit by chance about 23% of the time, so `cuts_with_hit_share` is meaningful only well above ~0.25. At 70–90 BPM, a ±0.06 s window around a beat is about 15–17% by chance, so `cuts_on_beat_share` is meaningful only well above ~0.2.
- **`speech_share` reads low** (0.10–0.51) even for wall-to-wall talking. It looks like a strict detector. Use it relatively (a16z montage at 0.10 vs Dan Koe at 0.51), not absolutely.
- **`subtitle_wpm_estimate` is broken** (values of 222–416 wpm; auto-subs repeat more than 2×). Ignored.
- #14 `biggest_lifts` of +101 dB at t=1 s is digital silence at the head, not a musical lift.
- Shorts were downloaded at 360×640, so the type on them is soft in the sheets.

## 1. Table

| # | Title / channel / URL | Len | Cuts/min | Med shot s | BPM (strength) | LUFS | Hits/min | % cuts on beat | % cuts w/ hit | Speech | Dominant flow | Distinctive |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 01 | How to Create Your Ideal Life in 7 Minutes / Ali Abdaal / youtu.be/iuHuxX22OOQ | 7:39 | 4.6* | 9.32 | 77 (1.28 weak) | -19.7 | 59.4 | n/a | 14% | .37 | static 87% | screenshot inserts with highlighter boxes, pill call-outs, mono pronunciation text |
| 02 | The Fastest Way To Change Your Life / Dan Koe / youtu.be/CzSmZvTYvME | 6:11 | 5.3* | 7.17 | 99 (1.41) | -18.5 | 69.2 | 15% | 3% | .44 | static 79% | essay cards: small white sans on pure black, B&W stock B-roll |
| 03 | How To Get Ahead Of 99% Of People / Dan Koe / youtu.be/d5RKW3WSEb0 | 8:11 | 2.7* | 4.80 | 90 (1.33) | -21.1 | 60.9 | 27% | 14% | .51 | static 93% | near-unedited A-cam, rare cinematic B-roll |
| 04 | How I Built My Dream Life (in 5 min) / Leila Hormozi / youtu.be/qE6f9mvLwk4 | 4:57 | 24.5 | 1.65 | 70.5 (1.53) | -23.1 | 68.2 | 10% | 19% | .22 | static 51%, ←→ 28% | B-roll in rounded-corner card on black; teal light-leak flash; kinetic word maps |
| 05 | How to Grow an Audience if You Have 0 Followers / Alex Hormozi / youtu.be/7ITff1fIbSc | 6:53 | 11.5 | 3.90 | 75 (1.55) | -21.9 | 43.9 | 11% | 10% | .34 | static 70%, Z± 10% | yellow/white italic word-pop captions, infinite-grid zoom-out, radial blur exits |
| 06 | I can't hide this anymore. / Alex Hormozi / youtu.be/Z5rKn1ZIp3A | 1:53 | 45.9 | 1.00 | 88 (1.68) | -28.3 | 49.1 | 16% | 26% | .26 | →28% ←20% | show trailer: brush-script name, arrow call-outs, chrome 3D title, big $ numbers |
| 07 | 50 Founders Share How They Got Their First Customers / Y Combinator / youtu.be/NZp5j5hvn9I | 3:59 | 2.8 (broken, see caveats) | 8.11 | 70 (2.18) | -19.6 | 52.9 | 0% | 18% | .26 | static 71% | orange seamless, word-by-word question type-on, company label bottom-right |
| 08 | 60 Startup Founders Share How They Met Their Co-Founder / Y Combinator / youtu.be/IyhLAbqDw0k | 3:53 | 16.3 | 2.13 | 116 (1.55) | -18.3 | 55.7 | 22% | 22% | .30 | static 68% | big counter numbers over tinted frame, orange panel wipe-up, slate bloopers |
| 09 | Applying to YC? 3 tips / Garry Tan / youtu.be/4wbCVN1yLyA | 7:39 | 2.4* | 4.00 | 80 (2.15) | -15.8 | 55.9 | 17% | 6% | .23 | static 93% | persistent lower-left chapter text ("Tip #1 — …"), 2019 vlog style |
| 10 | It's Time To Build / a16z / youtu.be/M9VKnPMs6Rw | 1:46 | 58.5 | 0.75 | 70 (1.81) | -18.5 | 27.3 | 14% | 14% | .10 | ←29% →20% | VO manifesto: CG push-through-page opener, 2–3-frame patent strobe, rolling counters |
| 11 | From ZERO to $200 BILLION (Rizzle) / Lenny's Clips / youtu.be/uiPARHxIQsM | 3:18 | 4.9* | 9.83 | 71.5 (1.58) | -15.4 | 50.7 | 25% | 0% | .33 | static 90% | podcast in rounded frame on light bg; diagonal-stripe wipe (lower craft, third-party) |
| 12 | Introducing Hack Pack / Mark Rober (CrunchLabs) / youtu.be/TtdOdUi9b_s | 4:33 | 44.2 | 1.04 | 96 (1.90) | -11.8 | 62.6 | 20% | 17% | .37 | →26% ←20% | founder product launch: grid-mat hero shots, page-flip montage, UI overlay, QR CTA |
| 13 | A 5 Minute Plea To Do / GaryVee / youtu.be/OIO0nMY4X3U | 4:52 | 33.3 | 0.92 | 130 (2.23) | -16.5 | 36.8 | 51% | 10% | .18 | →28% ←25% | selfie VO over vlog B-roll; Q3 montage at 79.7 cuts/min on beat; black end cards |
| 14 | Codie Sanchez – Origin Story / Codie Sanchez / youtu.be/2_8oqoirNHM | 3:05 | 15.9 | 3.15 | 120 (2.94) | -16.5 | 56.7 | 45% | 24% | .17 | static 62% | 2016 speaker sizzle: letterbox, serif quote cards, cutting speeds up Q1→Q4 |
| 15 | The EASIEST Way To Become A Millionaire / Iced Coffee Hour clips (Codie) / youtu.be/cBLZ8keH_I8 | 4:34 | 6.1* | 4.64 | 82.75 (1.54) | -16.2 | 71.0 | 18% | 18% | .34 | static 86% | 3-cam podcast clip; Q4 jumps to 16.7 cuts/min on the sponsor read |
| 16 | Here's a short video from our founder / Kimi AI / youtu.be/5rithrDqeN8 | 3:41 | 11.1 | 3.16 | 113 (2.43) | -24.7 | 60.3 | 20% | 10% | .33 | static 44%, ↑16% ←15% | CEO launch: studio A-cam ↔ floating UI cards, caption strip, "Introducing" title |
| 17 | I Dared A Shy Guy To Start His Business / Simon Squibb / youtu.be/rln4i46Q-Bc | 6:27 | 21.1 | 2.13 | 80 (1.38) | -14.9 | 44.7 | 18% | 10% | .39 | ←20% →20% | paper-texture freeze-frame intro card with handwriting, countdown-timer overlays |
| 18 | 3 Minutes That Can Change Your Life / Valuetainment / youtu.be/gDIAw78xWJg | 3:39 | 2.7* | 4.60 | 72 (1.51) | -18.9 | 37.6 | 20% | 0% | .34 | static 86% | low-craft control: selfie monologue, red brand sting, list card |
| 19 | "If you went broke today…" / MoreMozi / youtu.be/kefMtQqgQBc | 4:05 | 11.0 | 3.29 | 72 (1.56) | -15.6 | 53.4 | 11% | 11% | .37 | ←15% →14% | live-workshop Q&A, 2-cam (speaker ↔ questioner), handheld drift |
| 20 | Charge more, attract better people… / Alex Hormozi (Short) / youtube.com/shorts/CEIXJWt1X-Q | 0:32 | 5.5* | 8.76 | 83.5 (2.43) | -24.8 | 49.9 | 0% | 33% | .22 | static 81% | 2026 Hormozi: small white 2–3-word captions, keyword bold, no SFX look |
| 21 | Dear younger me: / Alex Hormozi (Short) / youtube.com/shorts/D1mj63Owb7w | 0:29 | 8.4 | 3.20 | 76.75 (2.63) | -14.1 | 73.3 | 0% | 75% | .39 | static 100% | red banner hook title, yellow/white italic captions, keyword bold white |
| 22 | What I got wrong about freedom in my 20s / Ali Abdaal (Short) / youtube.com/shorts/iACc_7N7QnU | 1:30 | 22.7 | 1.00 | 90 (2.55) | -23.8 | 59.4 | 26% | 26% | .37 | ←25% →19% | handwritten type-on, cut-out head sticker, karaoke pill captions, whip pan; pace builds |
| 23 | How to Hook People Into Watching Anything / Colin and Samir (Short) / youtube.com/shorts/FliP14zJKbY | 0:53 | 16.0 | 2.00 | 88 (2.18) | -13.1 | 68.4 | 21% | 36% | .25 | static 73% | yellow highlighter title box, metaphor B-roll (clay macro), corner wordmark |
| 24 | The 3-2-1 Speaking Trick / Codie Sanchez (Short) / youtube.com/shorts/lEuBOkpBy7A | 0:46 | 14.3 | 3.23 | 84.75 (2.26) | -13.9 | 70.3 | 27% | 73% | .28 | static 50%, ←26% | white-box captions; key phrases swap to large glowing serif; 2-cam wide/close |
| 25 | All it takes is 6 months / Dan Koe (Short) / youtube.com/shorts/Wf0V7Zd2t_w | 0:25 | 4.7* | 9.15 | 74 (2.82) | -14.6 | 94.5 (speech) | 0% | 50% | .40 | static 80% | 3 s black screen with caption only, then hard cut to face |

\* = same-setup jump cuts likely missed; the real rate is higher.
