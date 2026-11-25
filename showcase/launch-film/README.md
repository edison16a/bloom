# Bloom launch film

The source of the launch film on the Bloom site, made by following the `launch-video` skill in `skills/video-editor`: its film shapes, its motion values and its sound rules.

The skill builds films in EffectCraft. This one was made in a cloud container without EffectCraft, so the same plan was rendered from a web page instead: `index.html` lays out every shot, `src/film.ts` sets each element for a given time using the values in `motion.md`, and `capture.cjs` screenshots it frame by frame. The dot art in it is live, drawn by the dot-art engine at each frame's time.
