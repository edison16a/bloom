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
