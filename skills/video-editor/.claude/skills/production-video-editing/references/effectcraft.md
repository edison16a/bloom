# EffectCraft: how to build and render

Everything below was verified on this Mac (EffectCraft 0.24.x). Start it with `open -a EffectCraft --args --control 9877` and wait for `nc -z 127.0.0.1 9877`. Save before quitting. Quit with `osascript -e 'quit app "EffectCraft"'`.

## The kit
Copy `assets/lib.jsx` (easing) and `assets/kit.jsx` (pieces) beside your build script, save the project into that folder first (`save_project`), then run `script.run {code: "$.evalFile('<abs>/build.jsx')"}`. The build deletes its comp and rebuilds it, so it is safe to run again.

| Call | What it makes |
|---|---|
| `kitStart({root, name, w, h, fps, dur, plateEnd})` | the comp |
| `plate('room.mov')` / `plate('person.mov')` | the room first, panels next, then the person on top |
| `panelRun(P, inT, outT, [{f, t, src}])` | one frosted frame whose content dissolves as the speaker moves on |
| `phone(file, x, y, w, h, inT, outT)` | a phone recording in a rounded frame |
| `nameText(name, role, x, y, inT, outT)` | plain white name and role |
| `phrase([[words, isItalic], ...], x, y, size, times, outT)` | spoken phrase with one italic word |
| `listText(rows, x, y, size, lead, times, outT)` | plain list, one line per spoken item |
| `captions(CAPS, cx, y, size, end, skipRanges)` | captions from `[[in, out, text], ...]` |
| `logoEnd(file, size, t)` | logo on black |

Product films also load `launch-video/assets/motion.jsx` (windows, camera moves, lines, pointer). See `launch-video/references/motion.md`.
