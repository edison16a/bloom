---
name: production-video-editing
description: Edit real people on camera into finished, production-quality video in EffectCraft, horizontal or vertical. Founder videos, updates, interviews, talking heads, ads, Reels, TikToks, Shorts, and VFX on real footage. The person stays on screen, the camera stays still, and the product, messages, images and phrases appear as quiet overlays beside them with plain white text. Takes a direction plus raw clips, a website and a repo, then captures product clips, finds real music, sounds and footage online, and cleans or makes the voice automatically. Use whenever the user points at footage of a person or asks to edit, caption, add B-roll, text, a name, overlays, music, sound or effects to it, or make a Short from it. For films where the product is the main picture, use launch-video.
---

# Person with overlays

The person is the picture. Everything else is a quiet guest beside them.

Paths that start with `tools/` are in the video-editor repository (`edison16a/video-editor`). Outside it, run them from a checkout of that repository.

## Read first
1. `references/look.md`: the NEVER list, text, panel and picture rules. It overrides everything else.
2. `references/references-studied.md`: the films the user chose. Pick the one closest to this job and name it in the plan. The notes are enough. Open its links only when the user asks you to.
3. Then as needed: `sound.md`, `sourcing.md`, `effectcraft.md`, `vertical.md` (for 9:16), `vfx.md` (only if the brief asks for an effect).

## What the user gives, what you do
They give a general direction, raw clips, a website and a repo. You do the rest without asking: the cut, the product clips, the script, the music, the sounds, the footage, the voice if one is missing, and the installs. Ask only when something truly cannot be decided or needs their login, and ask once.

## Steps
1. **Look at everything.** `ffprobe`, contact sheet, word-level transcript. Read the site (`capture.cjs survey`) and the repo. Write down what is true, so nothing on screen is invented.
2. **Cut the speech.** Keep the best take per line, remove dead air and mistakes, leave breaths. Make one plate with one framing.
3. **Plan on one page.** A table: time, spoken words, what is on screen beside the person, where it comes from. Say which reference film it follows, what music brief, and where there is nothing on screen but the person. Show it and keep going.
4. **Split the plate.** `swiftc -O tools/matte/matte.swift`, then `tools/matte/split.py PLATE MATTE media --person … --room 0.45 --near 0.88 --blur 10`. Choose values on `--still` frames first. The frame count must match the plate.
5. **Capture the product.** Record each moment, crop tight, look at every clip for emails, tokens or other people's data, and recapture if any show.
6. **Build in EffectCraft** with `assets/lib.jsx` and `assets/kit.jsx` (room, then panels, then person, then text). Check every beat with `render_frame`.
7. **Sound.** Clean the voice, pick real music with `source.py music`, mix per `sound.md`.
8. **Render, finish, gate.** ProRes from EffectCraft, then H.264 crf 16 and AAC 320k. Then:
   `python3 -I scripts/gate.py output/JOB.mp4 --script build.jsx --srt output/JOB.srt --plate media/room.mov --end SECONDS`
9. **Look at it.** Contact sheet, checked against the reference's notes, or beside its frames if the user asked you to open it. Answer the six gate questions in `look.md` with frames. Fix what fails, then render again.
10. **Deliver.** MP4, SRT, licence list. Say what you cannot hear, what is imperfect, and anything unlicensed. Save and close the apps.

## Layout in one line
Person slightly off centre, the empty side is for one panel, captions small at the bottom, name once at the start, at most one phrase every 12 to 15 s.

## When to leave the speaker alone
The first line, the last line, a personal line, the turn. Silence on screen is a choice.

## Not allowed, ever
Anything in the NEVER list: no AI look, no dashes or middle dots on screen, no name cards, no zooms, no full-screen inserts over a speaker, no generated music.

## Honest limits
We measure sound, we do not hear it. A webcam in a bedroom will not look like a film set. Tell the user that a window, a lamp or a second angle will help more than any effect, and never hide it behind graphics.
