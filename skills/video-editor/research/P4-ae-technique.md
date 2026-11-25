# P4 — After Effects text + SFX technique over real-person footage

Batch layout (per the prompt, which overrides the 25-measured default in BRIEF.md):
- **Half A — 15 finished showcase edits / editor reels**, measured with `tools/measure.py`. Folders `01-…` to `15-…`.
- **Half B — 11 technique breakdowns** (auto-subs in `subs/*.txt`), plus 3 web articles. No measuring.

Measurement caveats, read first:
- Three Half A downloads hit YouTube HTTP 429 on the *subtitle* step. They (02, 06, 08) and the replacement 14 were re-run with a scratch copy of measure.py that skips subtitle download only. Nothing else in the script changed.
- **01 rystal:** cut detection reads 4 cuts/min, but the piece is one continuous 3D camera move with no hard cuts. It's real, but it isn't comparable as "pacing".
- **15 AfterRender:** the client edit plays inside a static branded frame (picture-in-picture), so scdet found 0 cuts. Its pacing numbers are **broken**. Its audio numbers are usable.
- The original 14 (EyeFly talking-head sample, cRZACArJNEM) was a raw single take with punch-ins and no text. It was dropped and replaced by hasimsaifi.
- `biggest_lifts` of 170 dB (06 @53 s) and 71 dB (13 @1 s) are lifts out of digital silence, not real musical drops.
- BPM: several reads of 70–82 BPM with strong beat strength are probably half-time reads of ~140–165 BPM tracks (inference). The pictures cut at roughly 2× those rates.
- `cuts_on_beat_share` has no chance baseline in the output. With an 8th-note grid, ~25–35% would happen by chance (inference). So the measured median of 0.28 means **showreel cuts are not tightly beat-locked as a population**. The kinetic-type openers are the exception.

---

## 1. Table (Half A)

| # | Title / channel / URL | Len s | Cuts/min | Med shot s | BPM (str) | LUFS | Hits/min | Cuts on beat | Cuts w/ hit | Speech | Dominant flow | What's distinctive |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 01 | Video Editor Showreel 2025 / rystal / youtu.be/Y9LYuqb4uYA | 30 | 4.0* | 10.0* | 70 (2.38) | -14.3 | 55.8 | .50 | .50 | .10 | ↑ ← mixed | One continuous 3D camera through tilted UI cards; view-counter ticks up "989k→1M views" with motion blur |
| 02 | Video Editor Showreel 2024 / M Creation / youtu.be/6kYRUsXtS4s | 40 | 37.7 | 1.30 | 130 (3.40) | -7.2 | 15.1 | .52 | .16 | .13 | static/← → | Black/white-invert kinetic type, one word per beat (~0.46 s) |
| 03 | Video Editor Showreel / Ryan Ferguson / youtu.be/WUB2pSkwN2M | 38 | 33.5 | 1.13 | 76.8 (4.23) | -11.9 | 110.1 | .29 | .57 | 0 | mixed | Pink/blue checker word-flash "Stories/Promo/Branded…" every ~0.5 s with tracking blur |
| 04 | Demo Reel 2024 / Drew Jimenez / youtu.be/ART4ltmSY3Q | 83 | 43.6 | 0.79 | 120 (4.22) | -11.6 | 93.1 | .28 | .48 | .05 | → ← | 1–2-frame montage bursts; titles placed *behind* subjects ("TOKYO", "PROMOTION") |
| 05 | Video Editing Showreel / abdystudio / youtu.be/VfYkGzcFbHY | 40 | 33.3 | 1.00 | 131 (4.10) | -9.9 | 72.6 | .27 | .41 | .10 | → ← | YouTube-player frames sliding on white; giant BG word ("LOOKING") behind small foreground line |
| 06 | Video Editing ShowReel / FarmeR Editz / youtu.be/mDfpW_IgN6Y | 55 | 35.0 | 1.63 | 95 (5.12) | -8.8 | 51.4 | .16 | .16 | .15 | static | Condensed-yellow two-tier type ("For / EDITING"); text-behind-walker; footage-filled "TEXT" |
| 07 | Video Editor Showreel 2026 / RxVisuals / youtu.be/E1MjNwbkYmY | 18 | 90.4 | 0.20 | 76 (5.62) | -13.6 | 43.5 | .22 | .22 | .06 | ← → | 228 cuts/min opening, then a collage wall; editorial serif + italic mix |
| 08 | Video Editor Showreel 2026 / Kanda Speaks / youtu.be/cb3iDfvEPso | 39 | 15.5 | 2.42 | 81.8 (2.07) | -14.1 | 57.4 | .10 | .60 | .34 | static | **Closest to the target format**: talking head with word-synced AE text in negative space, name behind the head, cut-out person over a white band |
| 09 | Video Editor Showreel 2025 / Padmesh PM / youtu.be/F7OTH1OnaNo | 42 | 54.6 | 0.42 | 95 (6.56) | -9.5 | 112.0 | .29 | .45 | 0 | ← | Stair-stepped repeated text lines; logo pops with motion blur on stepped grey backgrounds |
| 10 | Video Editor Showreel 2025 / Paul / youtu.be/HzOaQhk131Y | 62 | 11.6 | 1.00 | 110 (4.75) | -12.7 | 57.8 | .08 | .08 | 0 | static | Trailer-style wide-tracked titles with letter scramble; light-leak flashes; push into an eye |
| 11 | VIDEO EDITOR REEL 2025 / Craig Parikh / youtu.be/9upN5Hc6PgM | 118 | 17.3 | 2.44 | 85 (4.15) | -7.6 | 60.4 | .15 | .15 | .03 | static/→ | 3D-tracked words pinned to buildings in a fly-through; footage-filled title |
| 12 | DUCKLIFE 2024 SHOWREEL / DUCKLIFE / youtu.be/UfN1aW3FOLE | 68 | 74.0 | 0.24 | 131 (5.23) | -9.2 | 75.8 | .42 | .31 | .10 | ← | "Previously on" 1-frame footage strobes behind a locked logo; agency pacing |
| 13 | You Can Make a Netflix Style Doco… / Paul E.T. / youtu.be/9BUrNe3Vhtk | 263 | 18.7 | 1.67 | 124 (1.85) | -17.5 | 52.8 | .34 | .26 | .20 | static | Doc-parody talking head; trim-path lines lead from word to word; text tracked onto a plate |
| 14 | Professional Video Editor Portfolio 2026 / hasimsaifi / youtu.be/du9dgqqcKSg | 46 | 7.9 | 3.25 | 74 (2.40) | -12.4 | 45.9 | .33 | .33 | .07 | ← | Soft-blue UI-card motion; exits with a horizontal blur whip, then a zoom-through-letter |
| 15 | Talking Head Edit (Iman/Ali style) / AfterRender / youtu.be/lpKpHIhXdy0 | 35 | 0* | — | 116 (7.22) | -11.9 | 75.2 | — | — | 0 | static | Framed client edit: stat badge "50%→39%→0.1%" beside the speaker; text expands from a box outline; scale-push titles |

\* Measurement not comparable (see caveats).

---
