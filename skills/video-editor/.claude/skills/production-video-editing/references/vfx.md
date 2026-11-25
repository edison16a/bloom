# VFX on real footage (only when the brief asks for it)

Use it when the user names an effect (lightning when I snap, replace the sky, put our logo on the laptop). The result has to look like it was in the shot. If you can only fake it badly, say so.

- **Order:** track, rotoscope or matte, element, light on the person and room, grain and blur to match, edge check at 200%.
- **Real elements first:** sourced stock lightning, fire, smoke, dust or screens with the right blend mode. Not generated.
- **Person mattes:** `tools/matte/matte.swift` (Apple Vision) for anyone. `split.py` for room and person.
- **Text behind a person:** put it between room and person. Size it large and let only a third go behind.
- **Screen and sign replacement:** `Corner Pin` plus per frame tracked keys (see `effectcraft.md`). Match brightness, add reflections from the shot.
- **Hit frame:** a flash, light change and real sound on the same frame, 2 to 4 frames long, then settle.
- **Shake, flashes, ramps:** only for that effect, one time, and never in a spoken update.
- **Check:** render 10 frames on each side of the effect, look at 200%, and compare grain, sharpness, colour and shadow.
