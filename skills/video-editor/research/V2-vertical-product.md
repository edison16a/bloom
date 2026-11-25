# V2 — Vertical (9:16) product, app and launch Shorts

25 official brand Shorts (Notion, Canva, Figma, OpenAI/ChatGPT, Google Pixel, Gemini, Framer, Airbnb, Apple, The Browser Company/Arc, Grammarly, ElevenLabs, Runway, Samsung, Raycast). All are 2025–2026 uploads from official channels' `/shorts` tabs. All were measured with `tools/measure.py` at 360x640 (Arc Android was 292x640), and I looked at every overview sheet plus most transition sheets.

**Selection notes**
- Three first-pick videos ran longer than 90 s: Canva "Google Analytics in Canva websites" (136 s), Figma "Edit and generate vectors" (172 s) and Figma "Custom animation styles" (179 s). I replaced them with in-range videos. Their measurements are kept in `excluded-over-90s/` for reference only. All three are presenter-over-UI tutorials at 6–16 cuts/min and −24 to −17.5 LUFS. They are slower and quieter than the in-range set.
- #24 Runway iOS/Android runs 95 s, slightly over the limit. I kept it.
- #03 (Notion T-rex skit), #07 (Samsung Buds) and #18 (Airbnb POV) have no on-screen UI. They are kept as examples of brand-feature Shorts that sell a feature without UI, and are marked in the table.

**Measurement caveats (read before using the numbers)**
1. **Cut counts are too low on motion-design pieces.** In #02 Notion "What is", #08 Figma gallery, #13 Circle to Search and #20 Arc Voice, scenes change through continuous animated transitions (scale, morph, scroll) rather than hard cuts, and the detector misses them. #02 reports 0.7 cuts/min and a 43 s median shot, but the sheet shows a new layout roughly every 1.5–3 s. For these four, read "visual beats" from the sheets, not from `cuts_per_min`.
2. **`hits_per_min` is mostly music, not SFX.** In #08, #11, #13, #15, #20 and #21 the hit timestamps are evenly spaced at the beat or half-beat period (for example #08 every 0.33 s, #21 every ~0.48 s, #20 every ~0.46 s). These are hi-hats and kicks. Real UI SFX can only be inferred where hits fall off the grid at visual events.
3. **Some BPM readings are octave or 2/3 errors.** #21 reads 83 BPM, but its hit spacing of 0.48 s gives about 125 BPM. #05 reads 75 BPM with strength 8.2, which is probably 150 BPM. #13 reads 83 BPM; its 0.36 s hit spacing suggests 166 double-time. Elsewhere the BPM agrees with hit spacing.
4. **#12 Pixel Tag has a silent audio track as uploaded.** LUFS reads −70, and the YouTube opus stream is only 4 kb/s, 23 KB. Its audio fields are N/A and it is excluded from the audio statistics.
5. **Speech share is low even on talking-head pieces** (#01 0.19, #14 0.19). The syllable-rate detector seems to under-read speech under music. Treat it as relative, not absolute.

## 1. Table

| # | Title / channel / URL | Len s | Cuts/min | Med shot s | BPM (str) | LUFS | Hits/min | % cuts on beat | % cuts w/ hit | Speech | Dominant flow | Distinctive |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 01 | 5 tips for Custom Agents / Notion / https://www.youtube.com/watch?v=MbWtqeqzMHM | 67.0 | 12.5 | 4.21 | 80.8 (2.05) | −17.6 | 72.5 | 43% | 14% | 0.19 | mixed ←→, static during talk | Presenter with a pinned paper "chapter card" per tip; UI cut-ins are tightly cropped to one panel |
| 02 | What Is Notion? / Notion / https://www.youtube.com/watch?v=ayes8sKbgA4 | 86.9 | 0.7* | 43.5* | 77.0 (2.58) | −14.3 | 45.6 | 0%* | 100%* | 0.20 | ←→ slides, Z+ | Pure white-canvas motion design; typewriter "Notion is…" bookends; UI as floating cropped cards |
| 03 | You are what you use… / Notion / https://www.youtube.com/watch?v=-jPiUEo_MWg | 13.4 | 27.0 | 1.43 | 150.3 (6.62) | −12.4 | 40.4 | 17% | 17% | 0.08 | static, then → | No UI. Skit (T-rex in office), cuts every ~1.4 s, one persistent caption |
| 04 | Change video aspect ratios with Runway / Runway / https://www.youtube.com/watch?v=zVX4yGsSUfQ | 54.6 | 30.8 | 1.50 | 130.0 (2.05) | −15.0 | 68.2 | 43% | 46% | 0.28 | mixed | One word at a time, centred caption; letterboxed widescreen clips stacked in 9:16 |
| 05 | Die-cut stickers in Canva / Canva / https://www.youtube.com/watch?v=sr8wE8D-qew | 11.9 | 40.5 | 1.00 | 75 (8.16)† | −18.6 | 65.7 | 0% | 25% | 0.00 | Z+ then mixed | Top-down desk; iPad UI shot in camera (no screen capture); no voice |
| 06 | Turn one product photo into UGC ads / ElevenLabs / https://www.youtube.com/watch?v=_Ti9MWwU8qE | 30.7 | 23.4 | 1.54 | 124.0 (4.23) | −14.1 | 78.1 | 25% | 25% | 0.17 | static | Bottom-third presenter cutout plus top-two-thirds UI card on white; 3D carousel of outputs |
| 07 | Voice Command, Galaxy Buds On / Samsung / https://www.youtube.com/watch?v=DG0DiDeYPr0 | 22.3 | 18.8 | 2.02 | 130.0 (4.87) | −16.2 | 61.8 | 14% | 14% | 0.05 | handheld drift | No UI. BTS "REC" frame opener, then product packshots on grey, then a black logo card |
| 08 | Figma agent: animate gallery / Figma / https://www.youtube.com/watch?v=1eo35oxx3Vg | 42.1 | 2.8* | 13.9* | 90.0 (9.03) | −20.2 | 76.9 | 0% | 0% | 0.05 | ↑↓ (scrolls) | Single take; virtual camera zooms between prompt panel, timeline and phone frame |
| 09 | 6 Underrated Ways to Use ChatGPT / OpenAI / https://www.youtube.com/watch?v=ErOVIC-MGVA | 61.8 | 15.5 | 2.67 | 119.0 (2.19) | −9.7 | 67.0 | 31% | 38% | 0.16 | static | Street vox-pop; big white headline for the count, emoji sticker plus label per use case |
| 10 | Messi asks ChatGPT to reimagine his room / OpenAI / https://www.youtube.com/watch?v=6IttBmI4P9M | 17.1 | 24.6 | 1.92 | 78.0 (8.8) | −24.9 | 77.3 | 0% | 0% | 0.12 | mixed | Celebrity; real phone held to camera as the "UI mockup"; quiet mix |
| 11 | Ask Photos with Google / Made by Google / https://www.youtube.com/watch?v=-SUAhXnsCSc | 21.6 | 11.1 | 4.83 | 88.0 (8.2) | −11.2 | 86.1 | 25% | 25% | 0.38 | ←→ small | Phone mockup on a lilac field becomes a full-bleed photo; "Processing/Erasing" pill as the hero beat |
| 12 | Pixel Tag, Nov '26 Pixel Drop / Made by Google / https://www.youtube.com/watch?v=RUHvOb9ruBc | 51.7 | 8.1 | 7.03 | N/A | N/A (silent) | N/A | – | – | – | ↑, Z± | Word-by-word kinetic type on warm white; mascot blob travels between scenes; 3D product |
| 13 | Circle to search, A'ja Wilson / Made by Google / https://www.youtube.com/watch?v=LTNfuA13iqY | 19.8 | 6.1* | 5.63* | 83 (6.24)† | −17.0 | 82.0 | 50% | 0% | 0.21 | ↑ (feed scroll), Z+ | Top-down phone on wood, push-in until UI is full frame; counter typography at the end |
| 14 | Gemini 4 Argon, models / Google Gemini / https://www.youtube.com/watch?v=Stk7FUDoiOo | 78.2 | 19.2 | 2.60 | 90.0 (3.13) | −25.3 | 70.6 | 28% | 32% | 0.19 | static | Talking head; UI panel overlays the top half over her; "4" built from image mosaic |
| 15 | Create and share your avatar in Gemini / Google Gemini / https://www.youtube.com/watch?v=j9kw6WEE_S4 | 31.2 | 21.1 | 1.42 | 90.0 (8.75) | −15.0 | 94.2 | 36% | 64% | 0.13 | ←→ | Navy gradient plus cropped phone UI and centred white captions; fast full-bleed result montage |
| 16 | Framer F1 starts shipping today / Framer / https://www.youtube.com/watch?v=0PgvHAmnBaU | 25.5 | 14.1 | 3.03 | 80.0 (3.6) | −10.4 | 33.0 | 33% | 33% | 0.00 | Z+, ← | Hardware hype: dark studio, macro, cuts every 3.03 s exactly; glitch-flash frames |
| 17 | Build a portfolio with Wireframer / Framer / https://www.youtube.com/watch?v=GMudsuUVb6U | 39.6 | 7.6 | 1.15 | 83.8 (2.25) | −25.3 | 65.1 | 0% | 40% | 0.72 | static | Creator-style split: UI top half, presenter bottom half; one-word captions on the seam |
| 18 | Laundry service on Airbnb / Airbnb / https://www.youtube.com/watch?v=d8TEyfe5HUI | 12.8 | 23.5 | 2.00 | 70.8 (4.88) | −17.9 | 51.7 | 20% | 0% | 0.00 | Z+, ← | No UI. POV handheld UGC; TikTok-native small centred caption; logo on last frame |
| 19 | Desk View tip / Apple / https://www.youtube.com/watch?v=BTyWlJJUX2I | 18.9 | 19.1 | 2.40 | 116.0 (3.76) | −16.3 | 54.1 | 33% | 17% | 0.33 | static | Opens on a stitched TikTok-style "prompt" clip; Apple Store employee; UI screen-captured at full bleed |
| 20 | Voice Search in Arc Search / The Browser Company / https://www.youtube.com/watch?v=-PgJFpLu7-w | 24.2 | 5.0* | 2.25* | 130.8 (3.77) | −12.7 | 49.5 | 50% | 50% | 0.12 | Z+, ↑ (phone enters) | One continuous handheld shot; phone rises into frame; text lands on the sky; tilt up to sky for the CTA |
| 21 | Arc Search now on Android / The Browser Company / https://www.youtube.com/watch?v=xNj7MZe9X28 | 44.7 | 34.9 | 1.00 | 83 (4.34)† | −17.8 | 75.2 | 15% | 38% | 0.07 | ↑ dominant | Gradient brand cards with bold italic display type; UI crops; UGC reaction collage; speeds up to 59 cuts/min in the last quarter |
| 22 | AI Rewriter helps you find your voice / Grammarly / https://www.youtube.com/watch?v=tFUg1L1dWmQ | 57.8 | 22.9 | 1.40 | 76.3 (2.25) | −11.4 | 57.1 | 18% | 14% | 0.26 | static | Campus street interview; yellow/teal word-pop captions; UI section full-screen with green arrow pointers |
| 23 | ElevenLabs is more than voice / ElevenLabs / https://www.youtube.com/watch?v=xhcJ3ttKFUo | 38.3 | 25.1 | 1.96 | 127.3 (2.81) | −13.9 | 61.1 | 25% | 38% | 0.18 | static | White canvas; floating UI card top, presenter cutout bottom-left; blur-zoom "punch" between UI states |
| 24 | Create with Runway on iOS and Android / Runway / https://www.youtube.com/watch?v=s-bqCjPJnGc | 95.1 | 25.2 | 1.50 | 92.0 (3.89) | −17.2 | 55.5 | 20% | 33% | 0.37 | ←→ handheld | Phone-shot NYC street footage with AI effects; prompt pill overlay only; black end card |
| 25 | When Raycast on iOS? / Raycast / https://www.youtube.com/watch?v=UFPVuQlSfvw | 31.4 | 9.5 | 5.40 | 76.0 (2.73) | −17.9 | 51.6 | 40% | 40% | 0.23 | Z+ | Opens on a quoted user DM card; founders on camera; small desktop UI window over a blurred brand gradient |

\* Cut detector misses animated transitions (see caveat 1). † Likely BPM octave or 2/3 error (see caveat 3).

## 2. Per-video notes

**01 Notion — 5 tips for Custom Agents (67 s)**
- Hook (0–3 s): a real Notion sidebar fills the frame, and a small rounded presenter PiP sits bottom-right. A black pill caption reads "Custom Agents just dropped on Notion." At 2–3 s a giant black "Five Tips" headline appears on cream.
- Structure: each tip follows the same pattern. Presenter A-roll, then a paper card pinned to the wall with a hand-lettered serif title ("Find the busywork", "Be a boss", "Set up triggers", "Limit access", "Do a test run"), then 2–4 UI cut-ins, then back to the presenter. The tip cards land at about 5, 15, 30, 42 and 55 s. Logo end card on cream at 66 s.
- Text: two layers. Persistent captions are white text on a black rounded pill in the lower third, one phrase per pill. Chapter titles use a serif on the physical card, and the card's text appears over about 3 frames after an empty card first (seen in the overview sheet). "Tip 1" / "Tip 5" are huge white sans over the presenter.
- UI framing: the UI is never shown as a whole window. Each cut-in is a single panel ("Add trigger" list, day picker, chat input) cropped and scaled so text is roughly caption-sized, on a flat colour field (cream, light blue, charcoal). The cursor stays in frame.
- SFX and music: soft beat at 81 BPM, strength 2.05. Biggest energy lifts at 36 s (+15 dB) and 56 s (+11 dB) both sit at tip transitions. Inference: a music swell or whoosh marks each chapter. 43% of cuts land on the beat.
- Flow: mostly static; small ← → slides when UI panels swap.

**02 Notion — What Is Notion? (87 s)**
- Hook: a blinking text cursor on pure white for about 0.3 s. A huge "N No" snaps in, then collapses to a small "Notion|" typed letter by letter (about 2–3 frames per character in the 10 fps sheet), ending "Notion is…". Then three black pills morph into "Notion is not an [AI chatbot ⌄]", "…a [✕ Task tracker]", "…a [~~Note-taking app~~]".
- Structure: definition by negation (0–10 s), logo (10 s), then a long chain of floating UI vignettes: AI chat, project plan, meeting notes, Kanban, roadmap, customer logos. The ending mirrors the opening with the typewriter "Notion does [Busywork]", checklist items striking through, and the cursor clicking "To-do" into the Notion logo.
- Text: tiny centred black sans (Inter-like), typewriter-revealed with a cursor. Product nouns sit inside UI chips (pill with icon) instead of plain text.
- UI framing: white canvas the whole way. UI shows as floating cropped cards with soft shadows, and a hand-drawn face avatar (the Notion AI mascot) acts as the "cursor/character" that moves between cards.
- Audio: 77 BPM (strength 2.58), −14.3 LUFS. Energy jumps +26 dB at 1 s, which is the music start on the first word. Hits are irregular (not on a grid), so they are inferred to be UI SFX: clicks and pops at 2.8, 3.2, 3.5, 4.2, 5.5 s… matching the chip pops.
- Flow: lots of lateral ← → slides and Z+ scale-ins. Every scene change is a moving transform, never a hard cut.

**03 Notion — You are what you use (13 s)**
- Hook: a person in an inflatable T-rex costume at an office desk, with a static caption "You are what you use." that stays all the way through.
- Structure: six T-rex gags, cut every 1.37–1.44 s (very regular, tied to the 150 BPM track: 1.4 s ≈ 3.5 beats). Ends on a slow → pan across an atrium.
- Text: one small white sans caption at mid-frame, never animated.
- Audio: loud (−12.4 LUFS), very clear beat (6.62). Music stops at 10 s (−23 → −35 dB) for a quiet ending.
- Lesson: a meme-format brand Short with zero UI. The cadence is metronomic rather than beat-locked (17% on beat).

**04 Runway — Change video aspect ratios (55 s)**
- Hook: a widescreen clip of a fuzzy mascot letterboxed in black, with a single centred white word ("make", "2026") at about 1 word per 0.3–0.5 s. Then "you've had this **problem**", where the key word is scaled about 2x.
- Structure: problem (widescreen vs social), then mascots on set, then the UI demo (menu, prompt, 9:16 select, generate) at 30–40 s, then results reformatted to 9:16 at full bleed, then end.
- Text: karaoke-style one word at a time, centred, white sans. Emphasis words are bigger. This is the "one-word caption" convention at its most extreme.
- UI framing: the dark UI panel is cropped to the dropdown or prompt box and centred on black, with the word caption over it.
- Pacing: 30.8 cuts/min, median 1.5 s, starts at 39.6 cuts/min. 130 BPM, 43% of cuts on beat, 46% of cuts with a hit. Black letterbox bars give way to full-bleed frames on the payoff: the format change itself is the reveal.

**05 Canva — Die-cut stickers (12 s)**
- Hook: top-down desk with a script/serif title "create your own DIE-CUT STICKERS in Canva" overlaid in pink; the title fades out by about 0.8 s.
- Structure: hands spread stickers, then iPad Canva designs (3 designs in 1.5 s), then the export panel, then printing, then stickers placed on a red card. No voiceover.
- UI framing: the UI is shot on a real iPad in camera, top-down, then an in-camera push-in (Z+) to a tight crop of the design. No screen recording.
- Pacing: 40.5 cuts/min, median 1.0 s; the middle quarter hits 81 cuts/min (3 design swaps). The music beat is strong (8.16) but cuts are not on it (0%). It is cut to hand action instead.
- Lesson: ASMR-like tactile craft plus music; the UI is a prop.

**06 ElevenLabs — Product photo to UGC ads (31 s)**
- Hook: a white canvas with "What would you like to create?" and a prompt, the presenter cutout in the bottom third, and a small grey caption pill ("bathroom selfie").
- Structure: prompt, generated selfie image (full-bleed 3 s), product image, UGC video full-screen (talking skincare guy, 4 s), then 3 variations in a fanned stack, then a 3D ring carousel of outputs, then "different voices / different languages" swipes, then the presenter full-frame CTA "try it".
- UI framing: UI cards are cropped to the prompt box, centred upper half, with the presenter cutout overlapping the bottom edge. This is a layered "presenter in front of UI" layout.
- Pacing: 23.4 cuts/min, median 1.54 s, 124 BPM. The 3D carousel is the visual peak around 20–24 s.

**07 Samsung — Galaxy Buds On, Voice Command (22 s)**
- Hook: a camcorder REC frame (red dot, timecode) over a woman in a studio, and a slate clap at 1 s. "Behind the scenes" framing.
- Structure: slate, macro of the buds, actor on a ladder says "Play music 🎵" (caption with emoji), music kicks in, he dances with the ladder, "Easy. Said and done.", then 3 packshots on grey gradient, then a SAMSUNG logo on black.
- Text: small white sans, centred lower-middle; the product name in bold.
- Audio: 130 BPM, strength 4.87; the voice command triggers the music, so the drop is the story beat.
- Flow: handheld; motion share 0.5, the highest in the batch.

**08 Figma — Agent animates a gallery (42 s)**
- Hook: zoomed out on the whole Figma canvas (tiny), then a fast push-in to the agent panel. Prompt text types into the input box.
- Structure: prompt typed (0–9 s), agent thinking/steps (9–14 s), result phone frame animating cards in (17–24 s), timeline view (24–28 s), playback loops (28–42 s).
- UI framing: one continuous screen recording with virtual camera moves. Zoom from full canvas to the panel (Z+), pan ↑↓ along the scrolling result. The phone frame is shown at about 70% of frame height on light grey.
- Audio: a near-constant music bed, 90 BPM, strength 9.03, −20.2 LUFS. Hits every 0.33 s are hi-hats, so no SFX can be inferred. No speech.
- Lesson: a single take plus camera moves can carry 42 s without hard cuts, but it only reads as fast if the virtual camera keeps moving (motion share 0.27).

**09 OpenAI — 6 Underrated Ways to Use ChatGPT (62 s)**
- Hook: a woman with a mic, and a big white bold headline "6 people. 6 underrated ways to use ChatGPT" building line by line in the top left over her (0–2 s).
- Structure: six vox-pops of about 9 s each. Each has a name lower-third, then an emoji sticker plus label ("Fit check", "Ratings finder", "Hair scheduling", "Fiscal awareness", "Thought organizing", "Helpful agents") at mid-left, then a cut-in to a phone or UI, then end on the question "What's your most underrated use?" built word by word.
- Text: large bold sans, left-aligned, word-by-word build (about 2 words per 0.5 s). Small captions at the bottom.
- Audio: loudest in the batch (−9.7 LUFS). 119 BPM, 31% of cuts on beat, 38% of cuts with a hit. The first quarter runs 23 cuts/min and the last 19.

**10 OpenAI — Messi asks ChatGPT (17 s)**
- Hook: Messi raises a phone in an empty glass room. A small white subtitle shows his question.
- Structure: voice prompt, a hand holding the phone toward camera showing the ChatGPT voice UI, then the generated image of the room on the phone, Messi smiling, a follow-up voice prompt, and a wide of the room.
- UI framing: the phone mockup is a real phone, shot shallow focus at about 40% of frame height. No screen inserts.
- Audio: quiet (−24.9 LUFS), clear soft beat. Cuts are not beat-synced (0%). Celebrity and dialogue lead.

**11 Google — Ask Photos (Pixel 11) (22 s)**
- Hook: a phone mockup centred on a flat lilac field with a music credit pill. The phone drops slightly (↓), then a title card "Friendsgiving can get messy, but your pics don't have to be".
- Structure: mockup, then the photo fills the frame (the mockup is removed and the UI chrome stays). A prompt pill "Remove the red stain on purple shirt" types in, macro push-in on the stain, "Processing…" then "Erasing" pills over a blurred zoom, the clean photo returns, and the end card "Time to hit send ✨".
- Text: small dark sans, centred, on lilac; the end card types on with a sparkle emoji.
- Audio: −11.2 LUFS, 88 BPM, strength 8.2. Big lifts at 2 s (+8.7) and 5 s (+11.8): the beat drops exactly when the photo goes full bleed at 5.2 s.
- Flow: a push-in (Z+) into the problem area, then a pull back for the reveal.

**12 Google — Pixel Tag, Pixel Drop (52 s; audio N/A)**
- Hook: huge black "Pixel Drop" with the "o" replaced by the product (a tag), then the G logo pops, then a lime-green card "Pixel Tag" with a blue jelly blob mascot.
- Structure: question "How does 'I lost it' quickly become 'I found it'?", then the Find Hub app icon, then a 3D aerial city zooming to a pin, then a living room, then the phone UI "My Wallet — Located!", then the wallet under a couch, "Tag, you found it!", "Two clicks on your tag", "makes your phone ring", product hero end.
- Text: the best example of word-by-word kinetic type. Each word fades and slides up into place, grey turning black when "active" (for example "Tag," then "Tag, you", then "Tag, you found it!" over about 1.5 s at 10 fps, so roughly 4–6 frames per word). Large black sans on warm white.
- UI framing: UI appears as a rounded white phone-screen card floating over 3D imagery, not inside a device frame.
- Continuity: the blue blob mascot travels across cuts and carries attention from scene to scene.

**13 Google — Circle to Search, A'ja Wilson (20 s)**
- Hook: top-down phone lying on a dark wood desk, showing a social post. The feed scrolls ↑.
- Structure: long-press, then a Gemini glow sweeps the screen edges, then a circle is drawn around the player (glowing stroke animates over about 1 s). The camera pushes in until the phone UI fills the frame (5.7 s), then the search "is she the goat" types in, then the AI overview, then the screen dims and the bold stat "5 WNBA MVP awards" counts up.
- Audio: −17 LUFS; energy jumps +12.6 dB at 8 s when the AI answer appears.
- Flow: a continuous push-in (Z+) from desk to UI. No hard cut until 5.7 s.
- Lesson: the vertical problem (a whole phone is small in 9:16) is solved by starting wide on the device, then pushing in until the UI is full-bleed.

**14 Gemini — Meet the models, Gemini 4 Argon (78 s)**
- Hook: presenter talking head with "Meet the Models" in white at the top. At 2 s a hand-drawn yellow arc text "MEGAN FROM GEMINI TEAM" appears.
- Structure: the model picker UI floats over the top half of the frame (dark card), above her head. She explains each model (Flash-Lite, Flash, Pro, Argon), each with an emoji (⚡, 🧠). There are full-screen UI inserts (doc, app mock) and a giant "4" built from an image mosaic as a set-piece around 45 s. Ends on side-by-side model names.
- UI framing: a cropped dark UI card overlaps her face area (she sits low in frame). In the transitions sheet the card pops in with a 1-frame scale overshoot and pops out with no fade.
- Audio: quiet mix (−25.3 LUFS); music ducked under speech.

**15 Gemini — Create and share your avatar (31 s)**
- Hook: stacked avatar portrait cards on black-navy, then a white rounded card "Create and share your avatar in Gemini" scales in with sparkles.
- Structure: phone UI (avatar entry), "Scan yourself and record your voice" (front-camera card with a progress ring), "Then share it out" (share sheet), "Create images and videos of you and your friends" (prompt card with @mentions), then a full-bleed result montage (Victorian, dolls, skydiving, news set, tattoo, snowmen) at 0.5–0.7 s per shot, "Remove anyone's access", and an end card with the URL.
- UI framing: the phone UI is cropped (top bezel visible, bottom cut off by the frame edge) and slides in from the side. The caption is always centred below the UI in white on a navy gradient.
- Pacing: the 3rd quarter peaks at 53.8 cuts/min (the result montage), against 7.7–15 elsewhere. 64% of cuts land with a hit, the highest in the batch.
- Transitions: white flash-frames between montage shots (visible in the transitions sheet).

**16 Framer — F1 starts shipping (25 s)**
- Hook: a black frame, then a keyboard lit in a dark studio (Z+).
- Structure: cuts at exactly 3.03, 6.07, 9.10 and 12.13 s (every 3.03 s, which is 4 beats at 80 BPM), then a wide and an "F1" logo glitch, "Shipping Today", and Framer × Work Louder.
- Audio: the loudest track in the batch (−10.4 LUFS). Energy lifts of +19.5 dB at 3 s and +19.7 dB at 20 s are drops landing on the first cut and on the logo. The silent pause at 18–19 s (−24 dB) comes before the logo drop.
- Transitions: 1–2 frame white-noise or glitch flash frames at the cut (transitions sheet).
- Lesson: hardware "hype" uses few, long-ish shots at a fixed bar length with big drops; no captions until the end.

**17 Framer — Portfolio with Wireframer (40 s)**
- Hook: fast cuts (30 cuts/min in the first quarter) of portfolio examples, each with a one-word caption ("creating", "website", "easier", "wireframer"), then the presenter.
- Structure: a creator-style split from 4 s to the end. Screen recording in the top half, presenter on a purple/pink gradient with the Framer logo in the bottom half, and a one-word caption at the seam.
- UI framing: the desktop browser is cropped to the relevant region at about 1:1 aspect. The cursor stays visible. A slow push-in (Z+) on generation.
- Audio: speech-led (0.72 speech share, the highest in the batch), quiet (−25.3 LUFS), low beat.
- Lesson: the split layout gives the UI about 50% of the frame, which still reads small; the cut rate collapses to 0 after 10 s (single continuous split).

**18 Airbnb — Laundry service (13 s)**
- Hook: POV hands lift a laundry bag; caption "UNREAL: All my clothes got taken from my Airbnb" (TikTok "storytime" format, white, centred, small).
- Structure: bag at the door, door opens to reveal folded laundry, "and returned clean and neatly folded", folded clothes close-up, "Laundry service is now on Airbnb", Airbnb logo drawn on.
- Audio: −17.9 LUFS, 70.8 BPM, no speech.
- Lesson: a native-UGC disguise for a feature launch; 23.5 cuts/min; flow follows the POV walk (Z+ forward, ← turn).

**19 Apple — Desk View tip (19 s)**
- Hook: a stitched/duet-style clip of a student asking "I just got a MacBook for college..drop all the tips and tricks" (TikTok caption style), then a cut to the Apple Store employee answering.
- Structure: employee at a desk with a MacBook (2.4 s median), screen-captured FaceTime Control Center, the "Desk View" option circled in red, then the overhead desk view of handwriting.
- UI framing: the screen capture is full-bleed vertical, cropped to the left part of the macOS screen (the FaceTime window plus menu), so the UI is large.
- Audio: 116 BPM, −16.3 LUFS, speech 0.33.
- Flow: static camera; all motion comes from cuts.

**20 Arc — Voice Search (24 s)**
- Hook: an empty waterfront with the NYC skyline. The phone rises into frame from the bottom (↑ over about 1 s) in a hand.
- Structure: one continuous handheld shot (no hard cuts until 22 s). The voice-search smiley appears, the answer page, the phone lowers, the camera tilts up to the sky, and white bold text swaps "The fastest way to get an answer", "Now, even faster", "Voice Search", "Now available in Arc Search on iOS", then a black logo card.
- Text: bold white sans, centred, lands on the sky as negative space.
- Audio: 130.8 BPM; lift +8 dB at 13 s when the answer appears. Regular hits every 0.46 s from 13 s on, so the beat enters at the payoff.
- Flow: ↑ in (phone up), then ↑ tilt to the sky (camera up). The upward direction is consistent and carries into the logo.

**21 Arc — Now on Android (45 s)**
- Hook: a saturated cobalt card "Dear Android friends," in white heavy italic, then the logo pop, then "Welcome to the *fastest way* to search" on a pink-blue gradient (bold sans with an italic emphasis word).
- Structure: features ("who is caitlin clark", browse-for-me, "the *cleanest* way to browse", blocking toggles), then "Loved around the *world*" with tilted UGC creator clips in rounded cards plus country flags, 14.7K reviews, "Arc Search is now on Android", fast feature reprise, "Download today [Google Play]", and the URL.
- UI framing: UI is cropped hard to one element at a time (search field, toggle, result card) and scaled to about full width. The keyboard typing "warehous" is shown big.
- Pacing: 34.9 cuts/min, median 1.0 s, rising to 59 cuts/min in the last quarter (fast reprise before the CTA). Hits on a ~0.48 s grid suggest about 125 BPM (the detector says 83).
- Flow: ↑ dominant (scrolls, cards entering from below).

**22 Grammarly — AI Rewriter (58 s)**
- Hook: a street-interview host walks up: "what's your biggest college fail?" in yellow/white bold captions.
- Structure: 3 interviewees (0–25 s), "use Grammarly", a full-screen UI section (25–37 s) with big green arrow pointers and a highlighted text phrase plus teal caption pills, back to the interviews, then the Grammarly logo, then the end card "Download for free" on white with floating icon particles.
- Text: word-pop captions of 1–3 words, yellow with a teal alternate colour, bold rounded sans, centred mid-frame, each swapping on its word.
- Audio: −11.4 LUFS, speech 0.26, cuts every ~1.4 s.
- UI framing: the doc UI fills the frame width, cropped to a single paragraph and suggestion popover. The green arrow is animated, bouncing toward the element.

**23 ElevenLabs — More than voice (38 s)**
- Hook: the presenter's face fills the frame next to a tweet screenshot ("I didn't realize you could make videos with ElevenLabs…").
- Structure: a tour of tools, each as a floating white UI card in the top half: Image & Video, Text to Speech, Music, Sound Effects, Dubbing, Studio, Flows, All tools, then the presenter full-frame "Try ElevenCreative today."
- Transitions: between cards, a 1–2 frame blur plus scale-up "punch" of the outgoing card into the next (transitions sheet), and a 1-frame blur on the presenter cutout.
- Audio: 127 BPM; lifts at 15 s (+9.6) and 37 s (+8.7) align with the Sound Effects demo and the end CTA.
- Captions: small grey pill, centred low.

**24 Runway — Create on iOS and Android (95 s)**
- Hook: an NYC rooftop skyline, then a giant elephant leg (AI-generated) under a bridge in the first second; handwritten "New York Imag…" text.
- Structure: a phone-shot street tour of AI effects (elephants on the Brooklyn Bridge, pink hippo balloon, flooded Flatiron, Statue of Liberty torch, flocks of birds). Real people react (an elderly woman's "whoa" face is reused). Prompt pill overlays ("Add a character balloon between the buildings"). Black end card "Download Runway for".
- Pacing: 42.9 cuts/min in the first quarter, slowing to 15 in the last; median 1.5 s.
- Flow: handheld ← → whip-style; reaction close-ups are used as punctuation between effects.

**25 Raycast — When Raycast on iOS? (31 s)**
- Hook: a quoted user message card over a dark purple glow: "I'd be willing to pay for an iOS version of Raycast. Is this something you guys have thought about".
- Structure: founder 1 answers, founder 2 answers, a desktop UI demo (window over a blurred brand light-streak background), founder 2 again.
- UI framing: the landscape desktop window is placed small (about 95% width × 25% height) in the middle band, with an animated brand background filling the rest, then a slow push-in (Z+). This is the weakest UI legibility in the batch.
- Audio: −17.9 LUFS, 76 BPM; 40% of cuts on beat.

## 3. Batch synthesis

### Typical ranges (25 videos; audio n = 24, #12 excluded)
| Metric | Median | IQR |
|---|---|---|
| Duration | 31.4 s | 21.6–54.6 s |
| Cuts/min | 19.1 | 9.5–24.6 (undercounted on 4 motion-design pieces) |
| Median shot | 2.0 s | 1.5–4.2 s |
| BPM | 89 | 79.5–120 (several octave errors; true tempos cluster at about 120–130 or about 80–90 half-time) |
| Beat strength | 3.8 | 2.7–6.3 (nearly all have a clear beat) |
| LUFS | −16.3 | −17.9 to −13.6 (range −25.3 to −9.7) |
| Hits/min | 65 | 54–76 (mostly music percussion) |
| Cuts on beat | 25% | 15–34% |
| Cuts with a hit | 25% | 14–38% |
| Speech share | 0.18 | 0.08–0.24 (detector likely low) |

Compared with the three excluded long tutorials (6–16 cuts/min, −25 to −17.5 LUFS), the in-range Shorts cut about 1.5–3x faster and sit 5–8 dB louder.

### How pacing changes across the video
- Median cuts/min by quarter: 18.8, 18.9, 18.8, 14.3. The rate holds and drops in Q4 because the final 2–4 s is a held logo or CTA card.
- Excluding the end card, there are two patterns. (a) **Front-loaded:** a fast sizzle or hook, then the explanation (Runway iOS Q1 42.9 then 15; Runway aspect 39.6 then 26; ElevenLabs UGC 39 then 23; Framer Wireframer 30 then 0; Messi 42 then 14). (b) **Payoff montage in Q3:** a feature explanation, then a burst of results at 0.5–0.7 s per shot, then the CTA (Gemini avatar Q3 53.8 against 7.7–15; Arc Android Q4 59). Pattern (b) is the stronger product-launch shape.
- Shots shorter than 1 s are reserved for montages of outputs and examples. Explanatory UI shots hold 2–5 s.

### How cuts relate to the beat
- Strict beat-locking is rare: a median of 25% of cuts on beat. Hardware or brand-mood pieces lock to **bar lengths** instead (Framer F1 cuts every 3.03 s = 4 beats at 80 BPM; Notion T-rex every 1.4 s).
- Big moments land on **music drops, not cuts**. The energy lift lines up with the reveal: Ask Photos +11.8 dB at 5 s when the photo goes full-bleed; Circle to Search +12.6 dB at 8 s when the AI answer appears; Arc Voice +8 dB at 13 s on the answer; Framer +19.5 dB on the first cut and +19.7 dB on the logo after a 2 s near-silence.
- Speech-led pieces cut on phrases, with the music ducked (LUFS −25 to −17).

### SFX density and placement (inferred)
- Hit grids are mostly percussion. Clear off-grid transient clusters appear only in motion-design pieces (Notion "What is": irregular hits at 2.8, 3.2, 3.5, 4.2 s matching chip and pill pops). Inference: UI SFX in this category are **sparse and soft**: pops on chip appearance, a tick per typed word or pill, a shimmer on AI "processing". There is no whoosh on every cut.
- Cuts with a hit: 25% median. The higher ones are montage-heavy (Gemini avatar 64%; Runway aspect 46%) where each result gets a hit or flash.
- Voice-to-music cues are used as SFX: the Samsung "Play music" voice command starts the track; the Arc beat enters when the answer appears.

### Text conventions in 9:16
- **Three-tier hierarchy:** (1) a hero headline (bold sans, 2–4 words per line, about 8–12% of frame height, centred or top-left, built word by word); (2) a feature label (emoji or sticker plus 1–2 words, or a UI chip); (3) captions (small, 1–6 words, in a pill or as plain white with shadow, lower-middle third).
- **Word-by-word build** is the default animation. Each word fades and slides up about 10–20 px over roughly 4–6 frames, often starting grey and turning black or white when active (Pixel Tag "Tag, you found it!"; ChatGPT "6 people. 6 underrated ways…"; Runway one-word karaoke).
- The **typewriter with a blinking cursor** is used as a "product voice" device (Notion), at about 2–3 frames per character.
- **Emphasis by style switch inside a line:** an italic word in a bold line (Arc "the *fastest way*"), or a 2x size word (Runway "problem").
- Captions sit clear of the bottom 15–20% (platform UI) and the top 10%. Hero text sits mid-frame or on negative space such as sky or a flat field.
- Exits are mostly cuts (text disappears with the shot). Fades out are rare.

### UI framing in 9:16 (the core category question)
1. **Crop to the element, never the whole screen.** Desktop UI is shown one panel at a time, scaled so its text is about caption-sized (Notion, Arc, Grammarly, ElevenLabs). Showing a whole landscape window (Raycast) reads tiny.
2. **Floating card on a flat or gradient field**, with a rounded mask and soft shadow (Notion, ElevenLabs, Gemini, Pixel Tag). The background colour is the brand palette: cream, lilac, navy, warm white or a pink-blue gradient.
3. **Phone UI:** either a device mockup centred at about 60–75% of frame height (Pixel Ask Photos, Figma phone frame) or the bezel cropped off by the frame edge so the UI is larger (Gemini avatar). Mockups hand off to full-bleed when the content becomes the hero.
4. **Push from device to full-bleed:** start on a real phone (desk top-down, in hand) and Z+ until the screen fills the frame (Circle to Search, Ask Photos).
5. **Presenter plus UI stacks:** UI card in the top 55–65%, presenter cutout in the bottom 35–45% (ElevenLabs, Gemini Argon, Figma tutorials), or a 50/50 split (Framer Wireframer). Captions go on the seam.
6. **In-camera UI** (iPad top-down, phone held to camera) for lifestyle or celebrity pieces (Canva stickers, Messi, Arc Voice).

### Flow and direction rules
- **Vertical (↑) motion dominates UI pieces:** scrolls, cards entering from below, phones rising into frame (Arc Android ↑ dominant; Arc Voice phone ↑ then tilt ↑; Circle to Search scroll ↑). This fits 9:16 and thumb-scroll habit.
- **Z+ (push-in) is the main "focus" move:** into the stain, into the phone, into the generated result. It is paired with a pull-back only at the reveal.
- Lateral (← →) slides are used for **swapping between peers** (tips, models, tools).
- Motion continuity across cuts comes from a **travelling element** (Pixel Tag blob, Notion AI face, cursor) rather than whip pans.
- Static camera plus moving UI is the norm (motion share median 0.21). Handheld is reserved for UGC or POV pieces.

### CTA endings
- About 1.5–3 s. Usually: logo on a flat colour (black, cream, white or brand gradient), plus at most one line ("Shipping Today", "Now available in Arc Search on iOS", "Download for free"), plus a URL or store badge.
- There are three shapes. (a) A **typed or built line that echoes the hook** (Notion "Notion does…", Pixel "Time to hit send ✨"). (b) The **presenter direct-to-camera "Try X today"** (ElevenLabs, Grammarly). (c) The **music cut-out to silence on the logo** (Notion T-rex −35 dB, Gemini −30 dB, Framer −32 dB in the final second). In every case audio falls 10–20 dB in the last 1 s.

### 10 reusable moves (recipes; frame counts at 30 fps; frames read from 10 fps sheets are ±2 f)
1. **Word-build headline.** Each word enters with opacity 0→1 plus y +16 px→0 over 5 f, ease-out (cubic), starting 3–6 f after the previous word. Optional colour from 40% grey to full ink as each word becomes active. Hold the full line 20–30 f, then hard cut. SFX: none, or a very soft tick per word at −28 dB. (Pixel Tag, ChatGPT.)
2. **Typewriter with cursor.** 2–3 f per character, cursor blinking on a 15 f cycle while idle. On completion, morph the last noun into a UI chip (pill scale 0.8→1.0 over 6 f, overshoot 1.05). SFX: soft key ticks, and a "pop" on the chip. (Notion.)
3. **Device-to-full-bleed push.** Start with the phone at about 45% of frame height on texture (wood, desk, lilac). Push Z+ 1.0→2.3x over 30–45 f, ease-in-out, until the UI fills the frame, then hard cut to the clean screen capture at the same scale. SFX: rising whoosh (riser) under the push, beat drop on the hard cut. (Circle to Search, Ask Photos.)
4. **Floating-card swap with blur punch.** The outgoing UI card scales 1.0→1.15 with gaussian blur 0→20 px over 2 f, cut, and the incoming card starts at 1.1 plus 20 px blur and settles to 1.0, 0 px over 4 f (ease-out). SFX: short airy swish (−20 dB) on the cut, landed on the beat. (ElevenLabs.)
5. **Element crop for desktop UI.** Never place a 16:9 window whole. Crop to one panel, scale until the UI body text is about 3.5% of frame height (about the caption size), and centre it in the upper 60%. Add a slow Z+ drift (1.0→1.06 over the shot) so the static UI breathes. Keep the cursor visible and enlarge it if needed. (Notion, Arc, Grammarly.)
6. **AI "processing" beat.** Push into the problem area (Z+ 1→1.6x, 20 f), blur the frame (15–25 px), overlay a dark pill "Processing…" then "Erasing" with a spinner (pill fades in 4 f), hold 1–1.5 s, then hard-cut to the clean full-bleed result with the music drop. SFX: shimmer or sparkle on the result. (Ask Photos.)
7. **Results montage.** After the feature explanation, cut 6–10 full-bleed outputs at 15–20 f each (on beats or half-beats), with 1 white flash frame or a 2 f scale-pop between them. This lifts the Q3 cut rate to 50+ per minute. SFX: one hit or pop per shot. (Gemini avatar, Arc Android reprise.)
8. **Chapter card on a physical or brand object.** For list formats (tips, models), insert a 1–1.5 s card per chapter: a serif title on a pinned paper card, or a giant numeral on the A-roll. Pair it with a music swell or whoosh (+10 dB lift). (Notion 5 tips.)
9. **Bar-locked hardware cuts with a pre-logo silence.** Cut every 4 beats (3.0 s at 80 BPM) on macro product shots with 1–2 f glitch or noise flash frames at each cut. Drop the music to near-silence for 1–2 s, then slam the logo on a +20 dB drop. (Framer F1.)
10. **Rise-and-tilt CTA.** The phone rises into frame from the bottom (↑, 25–30 f, ease-out). After the demo, lower the phone and tilt up to clean sky or a flat field, and land 2–4 swapping white bold lines there (each in 4 f, hold 20–30 f), ending on the logo on black. The beat enters at the payoff moment. (Arc Voice Search.)
