# Getting everything automatically

The user gives a direction, raw clips, a website and a repo. Everything else is found or captured without asking: installs, downloads, voice, music, effects, footage, product clips. Keep the licence log, and tell the user what was used at the end.

## Map of inputs
| Given | Do |
|---|---|
| Website | `tools/capture/capture.cjs survey` for brand, copy, colours, fonts, logo and a full page shot. `run` with a plan for clips. `element` for single pieces on transparent |
| Repo | Read the README, docs and recent commits for what is true. Start its dev server if it has one (read the scripts first) and capture localhost. Code can be shown as the real code view of a file that matters, 8 to 14 lines, readable. Never show emails, tokens, session links or other people's data: look at every captured frame |
| Raw clips | `ffprobe`, contact sheet, transcript, list of usable lines, a best take per line |
| Direction | Decide the type, length and the one sentence the film is about. Write the script if there is no voice |
| Nothing but a website | Make a Type 2 film with the local voice or text only |

## Product clips
Plan the moments from the spoken words or the script, then record each moment with `capture.cjs run` (2x, 30 fps). Put a still before and after every click, so a state change can be shown with a dissolve. Never log in with a real password, use a demo workspace or ask for a login only when nothing can be captured without it.

## Sourced material: `tools/source.py`
Music, effects, stock video, archive video, YouTube, a spoken phrase out of a clip. Every download is logged in `work/JOB/assets/licences.json`.
- `video --from stock,nasa,archive,commons` covers real footage. NASA and archive.org are the best for history. Commons often refuses downloads, use another source.
- `youtube` without options finds Creative Commons only.
- `phrase FILE "words"` finds the spoken phrase in a clip and cuts the moment out, with word times.
- `credits` prints what must be published.
- Third party clips (`youtube --url … --third-party "reason"`) only when the direction asks for that clip. 12 s at most, logged UNLICENSED, named in the delivery note, so the user can decide.

## Intros that are not the person
**Archive or speech opening (Hue, Artificial Societies, 0.email):**
1. One sentence that says what changed or what is wrong. From it, pick 3 to 5 real moments in history or culture that make the point.
2. Search each with `source.py video`, then pull the spoken line with `phrase`. Prefer public domain. Keep the real sound.
3. Show the clip full frame or as a 4:3 frame with soft edges. One grade for all (muted, or duotone).
4. White words follow the voice, appearing on the word. Or two short lines at the left that say what the clip means.
5. Hard stop and silence, then the one line that turns, then the product.

**Fiction opening (Cascade, Atlog):** needs real actors or footage the user supplies. Never fake it with generated people.

**Plain opening:** the person says the first line. The right choice for updates.

## Licences to write down
Per item: title, author, source, licence, link, credit line if required. The delivery note lists only what must be credited and anything unlicensed.
