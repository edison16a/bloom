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

## Scripting
`command_run {id: "script.run", params: {code}}` runs After Effects-style JavaScript, returning `{ok, result, output, error}`. Verified on EffectCraft 0.24.1:
- **Available:**
  - `app.project.items.addComp(name, w, h, par, dur, fps)`
  - `importFile(new ImportOptions(new File(p)))`
  - `comp.layers.add/addText/addShape/addSolid/addNull`
  - `layer.parent`, `threeDLayer`, `motionBlur`, `inPoint/outPoint/startTime`, `moveAfter`, `sourceRectAtTime`
  - `setValueAtTime`, `setTemporalEaseAtKey` with `KeyframeEase`, `setInterpolationTypeAtKey(HOLD)`, `setSpatialTangentsAtKey`
  - expressions
  - effects by matchName (`ADBE Gaussian Blur 2`, `ADBE Ramp`, `ADBE Drop Shadow`, `ADBE Linear Wipe`)
  - masks via `new Shape()`
  - shape contents (`ADBE Vector Group`, `… Shape - Rect/Ellipse/Group`, Fill, Stroke, `ADBE Vector Filter - Trim`)
  - text animators: `ADBE Text Animator`, with properties Opacity, Blur and Position 3D
  - `TextDocument` with `font` ('Inter'), `fontStyle` ('SemiBold'), `fontSize`, `fillColor`, `tracking`, `justification`
  - audio layers with `ADBE Audio Group` › `ADBE Audio Levels` (dB)
- **Not available:** `app.fonts` (use `command_run text.fonts {query}` instead) and `SolidSource`.
- **Brand fonts:** check with `text.fonts {query}`. Inter and Instrument Serif (in `tools/fonts`, copy to `~/Library/Fonts`, then `rescan: true`) are installed. If the brand font is free, download and install it automatically and log it. Otherwise use the closest installed one.
- **Text animator selector quirk:** the Advanced group's matchName is `advanced`. Its children are `basedOn` (1 chars, 3 words), `shape`, `smoothness`, `easeHigh` and `easeLow`.
- **Layer order:** new layers go on top, so build from the bottom up.
- **File access:** `$.evalFile()` and `File.read` only work inside the **saved project's folder**. Save the `.ecproj` into the job's `ec/` folder first, then keep `build.jsx` and `lib.jsx` there and run `script.run {code: "$.evalFile('<abs>/ec/build.jsx')"}`. The build script deletes the comp and rebuilds it, so it can be re-run safely.
- **Vector logos and icons:** use `command_run edit.pasteSvg {comp, svg, name}`, which gives a crisp shape layer. Centre the anchor afterwards with `sourceRectAtTime`. Don't import SVGs as footage, because they rasterise at their small native size.
