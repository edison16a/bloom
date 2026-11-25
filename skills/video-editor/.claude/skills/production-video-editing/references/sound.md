# Sound

We cannot hear. Choose by measurement, and say so. Never call something "sounds great".

## Music: always real, always searched, never generated
`python3 -I tools/source.py music --job J --mood MOOD --genre GENRE --bpm LO-HI --need SECONDS --n 6`
The tool searches Mixkit, Incompetech and Jamendo through Openverse, downloads the best, measures each one (tempo, beat strength, loudness, intro length, dips, biggest lift) and ranks them. Read `ranking.json`. Use the pick unless the film needs something else, and write down why in the plan.

| Film | Brief for the search |
|---|---|
| Founder or update, voice led | calm, hopeful, 80 to 115 BPM, steady, no vocal, small lift near the end |
| Product reveal with energy | energetic, propulsive, electronica or techno, 112 to 135 BPM, a clear lift in the first third |
| Argument or history film | cinematic, tense, 60 to 90 BPM, big silence available, then a lift |
| Funny or retro fiction | one named period genre, short |
| Short vertical | 110 to 140 BPM, opens hard in the first second |

Energizing is a rhythm the pictures agree with, not loudness. Pick a track whose lift lands where the reveal is (`lift` column), whose beat strength is over 0.35, and cut pictures to its grid in Type 2 films. In a voice led film cut to the words and ignore the grid.

**Shape of every launch film:** strong opening, stop dead for 0.4 to 1.5 s right before the reveal, music back exactly on the product, one lift around the middle, clean ending on a hit. Cut the track to fit: start it at its intro, remove a bar or jump at a phrase boundary, and fade only the tail.

Rights: Mixkit needs no credit. Incompetech and Jamendo need a credit line. `source.py credits` prints it. Prefer no-credit tracks when both fit.

## Effects and background sound
`source.py sfx --job J click typing notification whoosh room tone` gives real recordings with onset and peak times. Place the **peak** on the frame, from `events.json` when it is a product capture.
- Product films: clicks, keys, a soft notification, one low hit on the reveal. 12 to 18 dB under the music or voice.
- Person films: silence except for something that really makes a sound inside a panel.
- Background: room tone under cuts, or the real sound of the archive clip.

## Voice
- A person is speaking: clean the voice (high pass 80 Hz, gentle denoise, de-ess, light compression), level about -16 LUFS, bed 17 to 20 dB under it, slow mild ducking. No pumping.
- No one is speaking: use the local model. `launch-video/references/voiceover.md` has the full workflow. Pick the default voice automatically, generate 3 takes a line, keep the best, time the cut to `words.json`, and tell the user the voice is AI. Only clone a voice they own.

## Master
Two pass loudnorm, -14 LUFS, true peak -1 dBTP or lower, 48 kHz, AAC 320k. Measure the final file.
