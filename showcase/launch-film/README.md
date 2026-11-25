# Bloom launch film

The source of the launch film on the Bloom site, made by following the `launch-video` skill in `skills/video-editor`: its film shapes, its motion values and its sound rules.

The skill builds films in EffectCraft. This one was made in a cloud container without EffectCraft, so the same plan was rendered from a web page instead: `index.html` lays out every shot, `src/film.ts` sets each element for a given time using the values in `motion.md`, and `capture.cjs` screenshots it frame by frame. The dot art in it is live, drawn by the dot-art engine at each frame's time.

## What is in it

- Shape B from `structure.md`: a sentence, the logo, then the product in use.
- Real pages only: a Vela landing page with live dot art, and the real options sheet and brand board from the Brand Creator run.
- Cuts land on the bar of a 110 bpm track. The window settles flat once, the camera rests at least 1.2 s between moves, and scene changes are vertical pushes with motion blur.
- Music: "Newer Wave" by Kevin MacLeod (incompetech.com), CC BY 4.0, found with `tools/source.py`. See `licences.json`.
- Mastered to -14.2 LUFS and -3.9 dBTP, checked with the skill's `gate.py`.
