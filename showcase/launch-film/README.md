# Bloom launch film

The source of the launch film on the Bloom site, made by following the `launch-video` skill in `skills/video-editor`: its film shapes, its motion values and its sound rules.

The skill builds films in EffectCraft. This one was made in a cloud container without EffectCraft, so the same plan was rendered from a web page instead: `index.html` lays out every shot, `src/film.ts` sets each element for a given time using the values in `motion.md`, and `capture.cjs` screenshots it frame by frame. The dot art in it is live, drawn by the dot-art engine at each frame's time.

## What is in it

- Shape B from `structure.md`: a sentence, the logo, then the product in use.
- Real pages only: a Vela landing page with live dot art, and the real options sheet and brand board from the Brand Creator run.
- Cuts land on the bar of a 110 bpm track. The window settles flat once, the camera rests at least 1.2 s between moves, and scene changes are vertical pushes with motion blur.
- Music: "Newer Wave" by Kevin MacLeod (incompetech.com), CC BY 4.0, found with `tools/source.py`. See `licences.json`.
- Mastered to -14.2 LUFS and -3.9 dBTP, checked with the skill's `gate.py`.

## Rebuild it

From the repo root, after `cd site && npm install && npm run sync`:

```bash
cd showcase/launch-film
../../skills/dot-art/scripts/node_modules/.bin/esbuild src/film.ts --bundle --format=esm --outfile=dist/film.js --alias:dot-art=../../site/components/dot-art/index.ts
```

```bash
python3 -m http.server 8077 --bind 127.0.0.1
```

Then, in a second terminal, render the frames:

```bash
node capture.cjs frames 30
```

The music was limited at 192 kHz to -14 LUFS with true peaks under -1 dBTP, saved as `a.wav`, then muxed:

```bash
ffmpeg -framerate 30 -i frames/f%05d.jpg -i a.wav -map 0:v -map 1:a -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac -b:a 256k -movflags +faststart -t 35.5 bloom-launch.mp4
```

The page loads its pictures from `assets/` and `images/`, which are copies of files elsewhere in the repo: the Vela and Bloom files from `site/public/media/brands`, Geist from `site/node_modules/geist`, and `rocket.jpg` from the dot-art examples.
