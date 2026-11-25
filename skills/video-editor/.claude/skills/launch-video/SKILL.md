---
name: launch-video
description: Make production-quality product launch films, demos, app promos, feature announcements and YC or Product Hunt launch videos where the product is the main picture, horizontal or vertical. Smooth buttery camera and UI motion over real product captures, plain short text, real archive footage, real music found online, and an optional local AI voice. Takes just a direction plus a website, repo or app and generates every product clip, the intro, the edit, the sound and the voice automatically. Also builds hybrids that open with a founder and go into the product. Use whenever the user wants a launch video, demo, product video, promo, teaser, animated walkthrough, or says "make a video for our launch" or gives a URL, screenshots or repo and asks for a video. For a person talking with overlays, use production-video-editing.
---

# Product film

A short film where the product is the picture: one idea, shown with real things, moving slowly and settling.

Paths that start with `tools/` are in the video-editor repository (`edison16a/video-editor`). Outside it, run them from a checkout of that repository.

## Read first
1. `references/structure.md`: the film shapes and how to choose.
2. `references/motion.md`: how the product and text move, with exact numbers.
3. `../production-video-editing/references/references-studied.md`: the films the user chose. Name the closest one in the plan. The notes are enough. Open its links only when the user asks you to.
4. `../production-video-editing/references/look.md`: the NEVER list also applies here.
5. As needed: `../production-video-editing/references/` `sound.md`, `sourcing.md`, `effectcraft.md`, `vertical.md`, and `references/voiceover.md` when nobody speaks.

## From a link to a film
| Given | You make |
|---|---|
| A website | Brand, colours, fonts, logo, product clips (`capture.cjs survey` and `run`), the copy that is true |
| A repo | What the product does, recent changes, a running local copy to record |
| A direction | The one sentence the film is about, the script, the type and length |
| Nothing spoken | A local AI voice, or text only. Pick the default voice, say it is AI |
| A founder clip | A hybrid: person first (production skill rules), one product block |

Everything is automatic: installs, downloads, capture, music, sounds, footage, voice. Keep the licence log and report it once at the end.

## Steps
1. **Find the sentence.** One true thing the product changes. Everything else supports it. Write it in the plan.
2. **Pick the shape** (`structure.md`), the closest reference, the length (20 to 75 s, default 35) and the music brief.
3. **Script.** 6 to 10 lines, 3 to 7 words each. Plain words, no marketing. The lines that are spoken or shown are the whole film.
4. **Record the product.** Real UI, real demo data, one click or state per moment, 2x, stills before and after every click. If the product cannot run, use what the site shows, never a fake UI.
5. **Find the intro.** Real footage for the argument (`sourcing.md`). If the film needs no intro, start on the product.
6. **Pick the music** with `source.py music`. Note its tempo, its lift and where the silence goes. Cut to its grid for silent films.
7. **Voice** if needed, then time to `words.json`.
8. **Build in EffectCraft** with `../production-video-editing/assets/lib.jsx` and `kit.jsx`, then `assets/motion.jsx` (copy all three beside `build.jsx`). Check every beat.
9. **Sound.** Music with the stop and lift, clicks and keys from `events.json`, master.
10. **Render, gate, look.** `../production-video-editing/scripts/gate.py output/JOB.mp4 --script build.jsx --type product`, then a contact sheet, checked against the reference's notes, or beside its frames if the user asked you to open it. Fix and render again.
11. **Deliver.** MP4, a vertical cut if asked, licences, honest notes. Save and close apps.

## Not allowed, ever
The whole NEVER list: no AI look, no middle dots or dashes on screen, no boxed name cards, no fake UI, no generated music, sound or footage.
