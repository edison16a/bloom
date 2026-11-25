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

### Recipes (helpers in `lib.jsx`)
- **Cubic-bezier to AE ease:**
  - For a segment with average speed `v`, curve (x1,y1,x2,y2):
    - out-ease at key A: `KeyframeEase(v*y1/x1, x1*100)`
    - in-ease at key B: `KeyframeEase(v*(1-y2)/(1-x2), (1-x2)*100)`
  - Spatial props (Position) take one ease, with `v` = path length per second (use the min dimension count: values can come back with 3 dimensions). Non-spatial props take one ease per dimension, with signed speed.
  - Curves: OUT (0.23,1,0.32,1), INOUT (0.77,0,0.175,1), EXPO (0.16,1,0.3,1).
- **Camera rig:**
  - Null with anchor `[0,0]`. UI image layers parent to it at position `[0,0]`. Screen = P + S * local.
  - Solve P for a camera move: `P = focusScreen - S * focusLocal`.
  - Keep the cursor **unparented**, compute its screen targets from the rig state, and hold the rig still while the cursor glides.
- **Word blur-up:**
  - Animator props: opacity 0, blur 14, position y +0.2 * size.
  - Selector: basedOn words, smoothness 100. Animate `ADBE Text Percent Start` 0 to 100 over 0.42 + 0.09 * words seconds (OUT).
  - Exit: layer opacity, Gaussian blur 0 to 16 and y -0.16 * size over about 0.36 s (INOUT).
  - Add exits **after** any other position keys on the layer.
- **Typing:** `Source Text` hold keys, one per character, about 0.06 s apart. Hold the caret's position at `sourceRectAtTime(t).left + width`, then blink it every 0.45 s.
- **Real UI state changes:** stack the captured states (idle, hover, after-click) as layers and crossfade over 0.12, 0.3 s at the click. For a container morph into a new state, scale the old one to 0.97 and fade it out, and scale the new one from 1.04 to 1 (EXPO).
- **Panels:** rounded mask via an 8-vertex Shape with 0.5523 * r tangents, plus `ADBE Drop Shadow` (opacity 55, distance 24, softness 90). For a slide-push, move ±1420 px over 0.75 s (INOUT).
- **Ripple:** ellipse stroke, scale 30 to 240% and opacity 70 to 0 over 0.7 s, with 2, 3 rings staggered 0.08 s.
- **Motion blur:** `comp.motionBlur = true`, `shutterAngle` 120 for UI pushes (180 smears text), plus `layer.motionBlur` on everything that moves.
- **Grain:** grain PNG at 5% opacity with the expression `posterizeTime(24); [960+random(-90,90), 540+random(-50,50)]` at 112% scale.
- **Text over UI:** a black solid with a masked, feathered top band (to y≈175, feather 150) at about 94% opacity.
- **Audio:**
  - Music and SFX are layers. Set `L.startTime = t - trimIn`, `inPoint = t`, `outPoint = t + len`, and use audio levels in dB (keyed fade at the end).

### Check and render
- `render_frame {comp, time}` at every beat and on both sides of every transition.
- Render with `renderQueue.add {comp, format: "prores", proresProfile: "422hq", audio: "on", sampleRate: 48000, output}`, then `renderQueue.render {wait: false}`. Poll with `renderQueue.list` (about 2 minutes for 40 s at 1080p60).
- Finish in ffmpeg: H.264 plus loudnorm.

