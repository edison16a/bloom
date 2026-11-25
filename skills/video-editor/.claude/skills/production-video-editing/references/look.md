# Look: person with overlays (horizontal and vertical)

## NEVER (no exceptions, and the gate checks what it can)
- **No AI look.** No boxed or coloured name card, accent bar, gradient blob, glow, purple and blue gradient, numbered circle, icon in a rounded square, emoji, tag, badge, pill with a coloured dot, progress bar, ticker, counter, checkmark list, bar chart that was not in the product, or stock "tech" background.
- **No middle dot, bullet dot, em dash, en dash, double dash or arrow character in any on-screen text**, caption, file title or script. Use a full stop, a comma, or a new line.
- **No web page rebuilt as motion graphics.** If the product has a UI, show the real UI. If it doesn't, show the real object or footage. Never draw a fake app.
- **No zooms, slow pushes, Ken Burns, shakes, punch ins, whip pans, flashes, light leaks or glitch** on people. The camera is still.
- **No full-screen replacement of the speaker** by a screen recording, code, diagram or slide.
- **No text that animates letter by letter, types itself, bounces, scales or spins.**
- **No text on top of a face,** and nothing that flickers on for under 1.5 s.
- **No sound on text or panels.** No whoosh, pop or riser in an update or interview.
- **Never generate music, sound or footage.** Find real ones (`sourcing.md`).

## Text
| Use | Style |
|---|---|
| Name | One line, 44 to 48 px semibold, white. Role below in 32 px regular. Bottom left on the safe margin. No box. In at 0.5 s over 8 frames, out at 4 to 5 s |
| Spoken phrase | 72 to 92 px medium white sans, two or three short lines on the empty side. Each word lands on the spoken word (opacity over 6 frames with a little blur). Exactly one word in an italic serif (Instrument Serif Italic), white or the brand colour. At most one phrase every 12 to 15 s |
| List | 38 to 44 px medium white. One line per spoken item, same left edge, each appearing as it is said. No numbers, bullets or icons |
| Caption | 34 px medium white, centred at the bottom, one or two lines, soft shadow, no background. Match the spoken words exactly. Hide it while a phrase or list shows the same words |
| End line | One sentence, or just the logo |

Fonts: the product's own typeface if it is installed, otherwise Inter. At most one serif italic accent. White on picture, near black on white. One family, two weights. All text must read at a glance on a phone: if it doesn't, make the words fewer, not the font fancier.

If the background is bright, darken and soften the room behind the person (`tools/matte/split.py --room 0.45 --near 0.88 --blur 10`), so plain white text just works. Keep the wall bright near the person (`--near`) and let it fall off: a flat grey room with a hard hair edge looks like a cut out.

## Panels beside the person
The plate is split into `room` and `person` (`tools/matte/split.py`). Put panels **between** them, so a panel can tuck behind a shoulder and the person looks like they are really in front of it.

| Part | Value at 1080p |
|---|---|
| Size | 34 to 40% of the frame width, 4:3 or the shape of the content |
| Position | The bigger empty side, vertically centred on the head, one fixed spot for the whole film |
| Frame | White tint 14 to 20%, white edge 1.5 px at 45 to 55%, radius 22 to 24, inset 10 to 12 px, inner radius 13 |
| In | Frame fades over 8 frames. Content follows 4 frames later over 10 frames, sharpening from a small blur |
| Change content | 5 frame dissolve inside the same frame. The frame does not move |
| Out | 6 frame fade |
| Motion | Only what happens inside: a cursor, a scroll, typing, a live feed |

Crop the capture tight to what is being said, so it reads at that size. Never zoom into it. Nothing else overlaps the content: no label is needed when the words already say it.

### Other overlays from the references
- **Message or notification:** real one, captured as an element (`capture.cjs element`) or shown as a screenshot. Frosted pill, 64 px tall, real app icon left, bold title, one line. Icon first, text 3 frames later. Stack one at a time, 12 px apart.
- **Phone:** the real recording in a rounded frame, beside the panel or over its corner, never across the face.
- **Asset pair:** two rounded rectangles either side of the head, when two things are named.
- **Photo, article or post:** the real capture, straight, with the same frame. No rotation, no tape, no shadow pile.
- **Drawn line or circle:** thin white 2 px, drawn on over 12 frames, only to point at something real in the picture.
- **Logo:** plain, on its own, no shine.

## Picture
- One constant framing per real angle. Scale only to fill the frame, and only once. Protect hair and chin.
- Neutral skin, a little contrast, matched cameras. Blur and darken the room gently if it is messy.
- Cut on breath. If a jump is visible, use a short optical flow blend, not a zoom.
- Leave the speaker alone on screen for the first line, any personal line, the turn and the last line.

## Gate questions (answer each with a frame, not a feeling)
1. Is the person on screen whenever they speak?
2. Does any panel or letter touch the face or hair?
3. Is the panel content readable at full size without a zoom?
4. Is there anything I could delete and lose no information? Delete it.
5. Put a frame next to the matching reference. Same family of film?
6. Is there a single thing a viewer would call a template, an app screenshot of AI, or a slide? Remove it.
