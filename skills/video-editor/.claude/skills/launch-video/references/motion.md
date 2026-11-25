# Motion and text for product films

Times come from frame sheets at half second steps, so they are good to about a quarter second. Use `assets/motion.jsx` (load `lib.jsx`, `kit.jsx`, then `motion.jsx`). Every helper below was rendered and looked at in EffectCraft.

## The feeling
Buttery means three things: nothing starts or stops suddenly, only one thing moves at a time, and everything rests long enough to be read. If two things must move, they move together as one object (parent them to the camera).

## The window
| Moment | Values | Helper |
|---|---|---|
| Real states stacked | still before, still after, 0.15 s dissolve on the click | `uiWindow`, `placeWindow` |
| First arrival | leans back 26 degrees, lies flat in 1.4 s, fades in 0.3 s. Once per film | `settleFlat` |
| Rest | at least 1.2 s before anything else happens | |
| Move to the click | 1.0 to 1.4 s, scale 1 to about 1.35, slow in and slow out, then rest | `camera`, `cameraMoves` |
| Come back | 1.0 s, same curve | `cameraMoves` |
| Panel arriving | 46 to 60 px of travel, 0.7 s, no overshoot | `arrive` |
| Rows | same move, 0.07 s apart | `fan` |
| Change of scene | one vertical push with motion blur, 0.5 s. Once or twice in a film | `pushUp` |
| Going away | 0.25 s fade with a small blur | `leave` |
| Pointer | moves 0.8 to 1.0 s, arrives 0.1 s early, presses to 88%, lifts | `pointer` |

Window: real capture at 2x, corner 14 to 18 px, soft shadow (34%, 22 px down, 90 px soft). Nothing drawn on top of it. No arrows, no callout boxes, no glowing edges.

The window fills 60 to 80% of the frame. If the thing being shown is small, crop the capture tighter instead of zooming further. Never go past 1.6.

## Backgrounds
One per film: the product's own soft brand colour, plain black, plain white, or real texture (stone, cloud, wheat, wall) blurred a little, as Hue does. `field('#e9e6df', '#c9d3dc', 0, dur)` or `backdrop('stone.jpg', 8, 0, dur)`. Never purple to blue, never floating blobs, never a grid.

## Text
| Use | Values |
|---|---|
| Single line on a plain frame | 72 to 96 px, medium, centred, words rise 0.1 s apart, whole line leaves together |
| Line above or under the window | 48 to 60 px, 60 px clear of the window |
| Word sized up | one word at 1.8 times the size next to small ones (Ghostship). Once |
| Two lines at the left of archive footage | 44 to 52 px, regular, lines 0.4 s apart |
| Caption over a demo | 34 px, bottom |

3 to 7 words. On screen 1.4 to 2.5 s. Then nothing for at least 0.5 s. Sentence case, full stop allowed. `line(...)` makes it.

## Rhythm
- A 35 s film has 9 to 14 picture events. Not more. Moves that help the story are events, decoration is not.
- With music: start each move so it **lands** on the beat. Cut the sentence film (0.email) on every beat or second beat. Cut the window film on the bar.
- The turn: 0.4 to 1.5 s of black or white with no sound, then the product with the music.
- Never hold a moving camera under a line that has to be read.

## Endings (seen in all of them)
1. The last picture fades or becomes the field, 0.3 s.
2. Logo alone, centred, 0.4 s fade. No shine or bounce. A line drawn logo (Ghost) is allowed if it is the real mark.
3. One line or the URL under it 0.8 s later. Hold 1.5 to 2.5 s.

## From the references, but leave out
These work in those films and look generated when copied: 0.email's purple glow, spinning ring and wall of repeated words; Emergent's glowing teal words; floating clouds of app icons; Donna's hour counter with stacked panels; white shine on a logo.
