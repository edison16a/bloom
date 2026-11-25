# L1-devtools: launch films from premium dev-tool and productivity SaaS companies

25 official brand-channel launch films (2023–2026). All were measured with `tools/measure.py` (the version that retries scdet at threshold 5 when cuts/min < 6). The overview sheet was read for every video, and the transitions and open sheets for most.

## Measurement caveats (read first)
- **The cut counter is the weakest metric in this category.** Many of these films have no hard cuts at all. Scenes change through continuous camera moves, morphs (a headline turns into an input bar, which turns into an app window), cross-dissolves on near-black, and blur-ins. Even at threshold 5, scdet found 0–2 cuts in 01, 02, 03, 05, 12, 24 and 25.
- So the table has two columns: **cuts/min (scdet)** and **scene changes/min (visual)**. The visual column is my count of distinct compositions or title cards on the overview sheet. It is an estimate (±20%), filled in only where scdet clearly undercounts (marked `v`). Elsewhere it equals the scdet value.
- **Some BPM values are probably half or double-time errors.** For example, 03 reads 72 BPM, but its transients repeat every ~0.28 s, which suggests ~107 BPM 8ths. 24 reads 76 BPM with hits every ~0.39 s (~153/77). I flag these where the hit spacing disagrees with the BPM.
- `cuts_on_beat_share` and `cuts_with_hit_share` are meaningless when there are ~0 cuts. Those cells are null or 0 for that reason, not because the cuts miss the beat.
- Nobody listened to anything. Every statement about SFX or music is inferred from waveform numbers plus what the frames show.
