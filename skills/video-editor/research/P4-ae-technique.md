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
