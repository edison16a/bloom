# Edit research brief (shared by all batches)

**Goal:** learn how professional editors actually cut. That means looks, plus **pacing, sound, animation and flow direction**. The findings feed two Claude skills:
- **launch-video:** 2D product launch films that move through real app UI.
- **production-video-editing:** professionally edited real-person videos (talking-head or founder footage with After Effects-style text, SFX and images on screen), plus vertical edits.

The user's main complaint about the last test was that it was "way too slow-paced" and the music "isn't energetic at all". Pay the most attention to energy, rhythm and sound.

## Your batch
- Each batch is **25 real, professionally edited videos** from the category in your prompt.
- Prefer well-known, high-craft examples: official brand channels, top agencies, top creators. Prefer recent ones (2023–2026).
- Skip tutorials, screen recordings without editing, reaction videos, low-effort uploads, and anything over 12 minutes. For long talking-head videos, a 3–6 minute professionally edited one is fine.
- Find videos with `yt-dlp "ytsearch10:<query>" --flat-playlist --print "%(id)s|%(title)s|%(duration)s|%(channel)s"` (or a known URL). Check the title, channel and duration before measuring. Never measure a search result blind.

## Measuring (required for every video)
```
cd "<research dir>"
python3 -I tools/measure.py "https://www.youtube.com/watch?v=<id>" <batch>/<nn>-<slug>
```
- This downloads ≤720p to a temp folder, deletes it afterwards, and writes `metrics.json` plus contact sheets:
  - `sheet_overview.png` (the whole video)
  - `sheet_open.png` (the first 6 s at 5 fps)
  - `sheet_transitions.png` (the densest 3 s of cuts at 10 fps)
  - `shots/` (one frame per shot)
- The numbers are waveform and pixel measurements, not listening. Nobody can hear the audio, so reason from the numbers:
  - `bpm` and `beat_strength` (above about 1.6 is a clear beat)
  - `lufs`
  - `energy_db_per_s` and `biggest_lifts` (drops and lifts)
  - `hits_per_min` (transients: SFX, impacts, whooshes)
  - `cuts_on_beat_share`, `cuts_with_hit_share` and `speech_share`
- Pacing: `cuts_per_min`, `shot_len_median` and `cuts_per_min_by_quarter` (does it speed up?).
- Flow: `flow_per_second`, one character per second (→ ← ↑ ↓ are global pans or pushes, Z+ and Z- are zoom proxies, `.` is static). It's noisy, so confirm it against the sheets.
- **Look at the sheets** with the Read tool on the PNGs, at least the overview and transitions sheets for every video. Judge the type style, text animation, transitions, colour and layout, and how motion carries from one shot to the next (direction continuity, match cuts, whip directions).
- Run the measurements in parallel with `&`, 3–4 at a time, to save time. If a download fails, pick another video.

## Write `<batch>/NOTES.md`
1. **Table, one row per video:** #, title / channel / URL, length, cuts/min, median shot, BPM (beat strength), LUFS, hits/min, % cuts on beat, % cuts with a hit, speech share, dominant flow, and one line on what's distinctive.
2. **Per-video notes,** 3–6 lines each:
   - opening hook (first 3 s)
   - structure with timestamps
   - text animation style: entry and exit, timing in frames if visible, font class and placement
   - SFX usage: what kinds and where (inferred from the hits plus the visuals)
   - music: energy shape, where drops land relative to visual moments
   - transition types
   - flow direction logic
3. **Batch synthesis:**
   - typical ranges (median and IQR) for cuts/min, shot length, BPM, LUFS and hits/min
   - how pacing changes across the video
   - how cuts relate to the beat
   - SFX density and placement rules
   - text animation conventions
   - flow and direction rules
   - the 10 most reusable concrete moves, each as a recipe with frames, easing and SFX
   - amateur tells that the pros avoid
4. Keep it factual. Mark inferences as inferences. Don't invent numbers. If a measurement looks broken, say so.
