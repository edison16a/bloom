# P3 — Commercials & brand films (real people + on-screen type/graphics)

25 videos, measured with `tools/measure.py`, plus overview and transitions sheets read for every one (and open sheets for 21 and 23).
All numbers come from metrics.json. Anything marked *(inf.)* is my inference from the sheets and numbers. Nothing was listened to.

**Measurement caveats (read first)**
- **Cut-detector undercounts** on dark, low-contrast or graphic-morph footage. For example, 01 iPhone "Scratch" shows about 12 shots in the overview, but 2 cuts were detected. 12 Squarespace (B&W, dark) is also undercounted. 14 Slack and 11 Airbnb are continuous motion-graphic or 3D morphs, so "cuts" barely applies there. Treat their cuts/min as lower bounds.
- **BPM octave ambiguity.** 13 of 25 read 71–79 BPM, including the fastest-cut edits (21 Mavs: 91 cuts/min at "71.5 BPM"; 23 PL: 108 cuts/min at "88.5"). These are very likely half-time reads of ~140–160 BPM tracks *(inf.)*. Read the BPM column as "x or 2x".
- **hits_per_min counts music transients too.** In 14 Slack, hits land every ~0.46 s, which is exactly the 129 BPM beat. A high hits figure plus very high beat_strength (13 Notion 7.7, 14 Slack 7.5) means a punchy kick/percussion bed, not necessarily SFX.
- **speech_share looks low** for spots that clearly carry VO or dialogue (09, 17). Treat it as relative only.
- 11 Airbnb is CG animation, not live action, and 24 Galaxy is mostly CG product render. Both are kept for their type and transition craft and flagged as off-category. 13 Notion (2022) and 20 Gymshark (2018) are older than the 2023–26 target.
- Some sibling batches measured overlapping videos (e.g. Pixel "Switch like Sol" is also in L4).

## 1. Table

| # | Title / channel / URL | Len s | Cuts/min | Med shot s | BPM (beat str.) | LUFS | Hits/min | % cuts on beat | % cuts w/ hit | Speech | Dominant flow | Distinctive |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 01 | iPhone 17: 3x More Scratch Resistant / Apple / youtu.be/PBrYMBacnyM | 35 | 3.4* | 5.13* | 122.8 (4.55) | -16.0 | 13.7 | 0 | 0 | .03 | ← / static (51%) | Deadpan boardroom comedy; one product line over shallow-DOF product shot at end |
| 02 | iPhone 17 Pro: Smart Group Selfies / Apple / youtu.be/er7MJvQCdsM | 35 | 54.8 | 0.77 | 135.0 (4.09) | -15.6 | 94.1 | 44 | 47 | 0 | ← / Z± | Photo "slam" on white, a new photo every ~0.5 s on the beat; highest on-beat share |
| 03 | MacBook Pro with M5 Pro and M5 Max / Apple / youtu.be/GriXfu4tL30 | 100 | 31.2 | 1.54 | 75.0 (3.10) | -16.4 | 18.6 | 19 | 6 | .01 | ← → | Scattered word-by-word kinetic type; letters drop in like keystrokes |
| 04 | Mac Students: journey to great ideas / Apple / youtu.be/77uoRieSk8s | 93 | 41.7 | 0.75 | 160.3 (3.06) | -16.0 | 33.4 | 31 | 18 | .01 | ← → ↑ ↓ mixed | Graphic match-cut: file icon and cursor locked in place while the desktop changes every ~3 frames |
| 05 | Winning Isn't For Everyone – Am I a Bad Person? / SportsOnScreen (Nike) / youtu.be/wFKHMeJadH8 | 120 | 34.5 | 0.88 | 86.3 (1.59) | -14.0 | 32.0 | 10 | 10 | .23 | → (only 6% static) | VO-driven athlete face montage; cut rate rises every quarter (16→24→42→56) |
| 06 | Greatness. It Only Takes Everything – Nadal / Nike / youtu.be/X0xbNUMZCvk | 60 | 41.0 | 1.10 | 74.8 (1.97) | -10.7 | 17.0 | 7 | 7 | .07 | ↓ | B&W 4:3 pillarbox, archive+new; crescendo to Q3 then a quiet fog end card |
| 07 | Winning Isn't For Everyone – Again – LeBron / Nike / youtu.be/_Ra6wkIoJp0 | 30 | 23.9 | 2.04 | 75.5 (2.85) | -24.1 | 55.8 | 17 | 33 | .07 | → | Hazy-arena single location; red condensed slam type end card |
| 08 | Dream Job – Pixel SB 2025 / Made by Google / youtu.be/-7e6g11BJc0 | 125 | 23.5 | 2.13 | 79.0 (2.29) | -13.5 | 43.6 | 27 | 14 | .21 | → | Life montage; face-position match cuts (baby → grad); +42.7 dB lift at 108 s |
| 09 | Switch like Sol – Pixel 9 / Made by Google / youtu.be/aFQvG0WQkpU | 60 | 11.0 | 3.32 | 74.3 (2.03) | -15.2 | 41.0 | 0 | 9 | .23 | ← | Comedy walk-and-talk to camera; clean white product end card |
| 10 | Your Favourite Artists reveal Spotify 2025 Wrapped / Spotify / youtu.be/YlxlsQVLw3E | 166 | 22.0 | 2.20 | 72.5 (1.76) | -17.4 | 37.1 | 8 | 15 | .08 | → | Sketch vignettes; diegetic stat cards (clapperboard, street sign, CRT TVs) |
| 11 | Bedtime / Airbnb / youtu.be/GFM_3D8GdXs | 30 | 6.0* | 4.40 | 106.3 (3.27) | -17.0 | 41.9 | 33 | 0 | .20 | ← static 73% | **CG.** Cutaway dollhouse room; camera pulls out, room swaps for the bigger home |
| 12 | Unavailable (Extended) – Squarespace 2026 / Squarespace / youtu.be/2cLNMXUNzxY | 97 | 7.4* | 1.75 | 73.8 (1.89) | -17.1 | 19.1 | 8 | 0 | .01 | ↓ / static 55% | B&W silent-film melodrama; huge serif UI type inserts; rounded film-gate frame |
| 13 | The Search – Notion / Notion / youtu.be/vO9YGI5Gf4s | 30 | 21.9 | 2.52 | 106.0 (7.70) | -13.3 | 89.7 | 0 | 36 | .03 | Z+ pushes | UI comment cards pop over live action and type themselves out |
| 14 | The ultimate work OS / Slack / youtu.be/zYotA_PNwbw | 30 | 8.0* | 3.50* | 129.0 (7.50) | -14.0 | 75.8 | 0 | 0 | 0 | ← (90% moving) | Pure kinetic type with inline logo pills; footage inside pill masks; continuous pan |
| 15 | Wix Harmony – Big Game 2026 / Wix / youtu.be/rRo5spaBfbo | 30 | 29.9 | 1.47 | 71.3 (2.76) | -14.1 | 33.9 | 13 | 0 | .07 | ← | Glass prompt box types over live action; giant editorial serif from the generated site |
| 16 | You Got This / adidas / youtu.be/FzaS0V_FCrI | 88 | 53.2 | 0.68 | 77.5 (1.95) | -13.7 | 28.6 | 13 | 13 | .10 | → | B&W 4:3 → full-colour 16:9 switch; spin match-cut chains; spaced-letter end type |
| 17 | F50 Made Me Do It – The Monologue / adidas Football / youtu.be/jY5TLIYXpZg | 116 | 23.3 | 2.08 | 133.3 (1.89) | -14.3 | 59.7 | 27 | 29 | .16 | ← | Mockumentary groundskeeper interview; binocular-vignette POV; serif subtitles |
| 18 | Powerbeats Pro 2 ft. LeBron, Messi, Ohtani / Beats / youtu.be/zR63m0JN5WY | 123 | 31.7 | 0.90 | 97.3 (1.61) | **-9.8** | 51.7 | 12 | 14 | .07 | → (6% static) | Cut-to-black beats; floodlight flare whites; "LISTEN TO YOUR HEART" slab type |
| 19 | FOREVER. FASTER. See the Game Like We Do / PUMA / youtu.be/LRJP140fv3E | 87 | 36.4 | 1.06 | 100.8 (3.03) | -14.2 | **96.0** | 13 | **42** | .16 | ← | Surreal athlete vignettes; heaviest SFX-on-cut; motion-blur streak logo reveal |
| 20 | Build Your Legacy / Gymshark / youtu.be/Wt5SlONIRZ0 | 95 | 11.3 | 3.29 | 75.3 (1.92) | -20.8 | 21.4 | 22 | 11 | .09 | ← | (2018) Statues ↔ lifter intercut, dark grade, slow pacing that winds down |
| 21 | The Blueprint – 2025-26 Season Hype / Dallas Mavericks / youtu.be/mZwuphEg5KU | 48 | **90.8** | **0.42** | 71.5 (2.18) | **-8.9** | 42.3 | 14 | 18 | .02 | ← | B&W hype; caption-style VO lines bottom-centre; fastest open (144 cuts/min Q1) |
| 22 | You're In It Now / Premier League USA / youtu.be/XDS8EdW_vVo | 106 | 56.0 | 0.58 | 73.8 (2.35) | -15.0 | 58.3 | 14 | 30 | .21 | → | Diner dialogue with match-footage bursts; jersey-crest match-cut run |
| 23 | IT'S TIME! 2023/24 season / Premier League / youtu.be/YT7ERC4km5g | 51 | **108.2** | **0.36** | 88.5 (2.15) | -23.3 | 43.5 | 15 | 18 | .08 | → | Collage maximalism: gradient frames, clone trails, torn-paper wipes, colour-flash type |
| 24 | Galaxy S25 Edge: Beyond slim / Samsung / youtu.be/FCMFh07nX4Y | 35 | 18.8 | 2.26 | 85.3 (4.18) | -11.1 | 32.5 | 18 | 27 | 0 | ← | **Mostly CG.** Line split by the phone itself ("Designed to ▌ fit your style") |
| 25 | Indiana Pacers 2025 Playoffs Hype / Indiana Pacers / youtu.be/HrjMZSR7eDI | 30 | 81.7 | 0.53 | 126.5 (2.44) | -15.6 | 31.9 | 20 | 15 | .33 | ← | Newspaper-clipping collage open; 2–4-frame bursts; fan-reaction punch-ins |

\* = cut detector undercounts (see caveats).

## 2. Per-video notes

**01 iPhone 17 "Scratch" (Apple)**
- Hook: mid-meeting, a hand slides an orange iPhone across a mahogany table. Deadpan reaction close-ups.
- Structure: 0–23 s held looks between executives (~1.5–3 s shots by eye). At 23 s, +20.3 dB lift as the phone is shoved hard across the table → 25 s product hero "3x more scratch resistant" → "Relax, it's iPhone 17" → Apple logo.
- Text: one small white sans line, centred above the product, fading in and out. No motion on the type, plus a tiny legal footnote bottom-right.
- SFX *(inf.)*: few hits (13.7/min). Silence and room tone carry the joke, and the one big lift is the phone-slide sound plus a music sting.
- Flow: mostly static; the slide moves ← across frame.

**02 iPhone 17 Pro "Group Selfies" (Apple)**
- Hook: low-angle group selfie in the street, then hand-held phone POVs.
- Structure: 0–13 s live-action phone POV. 13 s white card "Fit everyone in / …automatically". Then a photo-slam section: each finished photo appears centred on pure white, a new one every ~0.45–0.5 s (≈ one beat at 135 BPM), with 1–2 white frames between. Ends on "Group selfies on iPhone 17 Pro" → logo.
- Text: small centred sans on white, the second phrase extending the first in place.
- SFX: 94 hits/min, cuts on beat 44%, with hit 47% *(inf.: shutter clicks plus percussion on each slam)*.
- Transitions: hard cuts and white-flash slams; photos alternate portrait and landscape to give rhythm.

**03 MacBook Pro M5 (Apple)**
- Hook: white frame → extreme CU of a face → keyboard macro.
- Structure: a "day in the life" across library, workshop, lab, film set and coder. Spec lines appear every ~6–8 s. Energy lifts of +34.9 dB at 63 s and +33.3 dB at 92 s are music re-entries after near-silence (Q1 and Q4 energy ≈ -34 dB, so very dynamic).
- Text: words placed separately around the frame, mixed roman and *italic* (e.g. "Up to … 2x *faster* SSD"). Letters drop vertically into place one at a time, keystroke-paced at ~1 letter per frame at 10 fps sampling. The type sits on the live plate, often wrapping around hands.
- SFX *(inf.)*: keyboard clicks synced to the letter drops; low hit density (18.6/min).
- Transitions: hard cuts with macro → wide alternation; an eye-reflection insert of the screen.

**04 Mac Students (Apple)**
- Hook: dark dorm room wide → macOS notification "Screenwriting Final Due".
- Structure: an all-nighter montage across 5 students. Q2 spikes to 82 cuts/min (the "panic" section). Q3 slows (18), then the submit moment ("SUBMIT" button + green check) → "Great ideas start here" → Mac.
- Text: mostly diegetic UI (file names "final_v2.key / final_final.key / almost_final_fi…" as a giant UI CU). End line small centred sans.
- Signature: graphic match-cut chain. A file icon plus cursor stays in the same screen position while the desktop/wallpaper changes every 2–3 frames (F3D → AI → folder → FDX).
- SFX *(inf.)*: UI clicks and FaceTime ring; hits 33/min.

**05 Nike "Winning Isn't For Everyone – Am I a Bad Person?"**
- Hook: extreme CU of a child's glare → athlete eyes. VO from frame 1.
- Structure: a 120 s face/eye montage under monologue VO. Cuts per quarter rise steadily: 16 → 24 → 42 → 56 /min. The end card "WINNING ISN'T FOR" → "EVERYONE" sits in the last ~5 s, then a short coda shot.
- Text: Nike red condensed sans (Futura-Condensed class), flush-left, building word by word on black.
- Music: lifts at 2 s and 29 s. Low beat strength (1.59), so it is VO-led with cuts on VO phrases, not beats (10% on beat).
- Flow: almost never static (6%). Dominant →, with action shots alternating direction; a dunk is shown twice (CU then wide) as a re-angle.

**06 Nike "Greatness – Nadal"**
- Hook: B&W profile CU of Nadal, pillarboxed 4:3.
- Structure: new B&W footage intercut with archive match footage and clay-court textures (court sweeper, net macro). Q3 peaks at 64 cuts/min, then drops to fog/silhouette for "Greatness. / It only takes everything." → swoosh.
- Text: tiny serif in the centre of a foggy wide, fading in. Extremely understated.
- Audio: loud (-10.7 LUFS) with low hit density (17/min). *(inf.)* A continuous score rather than SFX punctuation.
- Transitions: hard cuts and dips to black; serve-motion re-angles.

**07 Nike "Again – LeBron"**
- Hook: silhouetted torso against a hazy arena backlight.
- Structure: 30 s in one location; Q3 has the fastest cutting (48/min) in the dunk sequence; Q4 has a slow back shot → red "WINNING / ISN'T FOR / EVERYONE." built line by line (one word, then the full stack) → swoosh.
- Audio: quiet (-24.1 LUFS) but 33% of cuts land with a hit *(inf.: ball bounces and sneaker squeaks as rhythm)*. A +27.7 dB lift at 1 s.
- Flow: → push continuity through the dribble shots.

**08 Pixel "Dream Job" (Google, Super Bowl 2025)**
- Hook: fridge photo-booth strip → dad practising for an interview with Gemini Live.
- Structure: a present-day frame story intercut with memory flashes. An aging match-cut run of the daughter (baby → toddler → child → teen → grad) holds the face at the same screen position for ~0.3–0.5 s per age. The climax is a +42.7 dB lift at 108 s (music swell on the hug), then "Google Pixel 9 with Gemini Live" over the product → G logo.
- Text: small white sans over product, then white end card.
- Transitions: face-position match cuts; a frame-in-frame aspect change for home-video inserts (4:3 inside 16:9).

**09 Pixel "Switch like Sol"**
- Hook: celebrity talking to camera in his kitchen.
- Structure: a walk-and-talk through the house. The comedy beat is a white sweater → red sweater swap (Arsenal → rival joke). Cut every ~3–5 s; the end has phone UI → "Now we're talking." on black → product slide-in → "Google / Pixel 9" → "with Gemini" → G.
- Text: end card type slides in with the product, then crossfades word groups.
- SFX *(inf.)*: comedic stings (41 hits/min, but only 9% on cuts).

**10 Spotify Wrapped 2025 artist reveals**
- Hook: a group crammed into a corner shop, handheld.
- Structure: 8–10 artist sketches, each a mini-scene ending in a "stream count" reveal, separated by a cut to black or colour.
- Text: diegetic stat callouts, e.g. "CAN'T RUSH GREATNESS 785M+ STREAMS" written on a clapperboard, a street sign "FAMILY MATTERS 28M+ STREAMS", CRT monitors showing "1B+ STREAMS". Also pixel-mono green overlay type "SAMMY VIRJI +191,000,000 STREAMS" on a green-grade sequence.
- Pacing: steady 22 cuts/min throughout; energy flat (-17 dB every quarter). Dialogue-comedy driven.

**11 Airbnb "Bedtime" (CG, off-category)**
- Hook: a door-hanger "Somewhere in a Hotel" in close-up.
- Structure: pull back to an isometric cutaway hotel room, where a family of 4 is cramped (onesie gag). The room collapses and folds into a larger cutaway home under a starfield with fireworks → "Some trips are better in an Airbnb." → logo.
- Text: small centred sans on black. Transition: the 3D set "unfolds" instead of a cut.

**12 Squarespace "Unavailable" (Emma Stone, 2026)**
- Hook: "Squarespace Presents" in tiny italic serif, split left/right around an island castle in a storm (silent-film title card).
- Structure: an operatic melodrama. Typing "emmastone.com" → "emmastone.com is unavailable" → wailing → set destruction (fire, smashing laptops) → bookend storm island "Get your domain before you lose it" → logo.
- Text: UI as type. Huge editorial serif "Find your domain name" and a bold sans "is unavailable" filling the frame at a slight angle, with the cursor typing ~1 char/frame (typewriter pacing at 10 fps).
- Look: B&W, rounded-corner film gate, heavy contrast. Audio dynamic (-17 LUFS), low hits. *(inf.)* Orchestral score; the big lift at 46 s is the destruction sequence.

**13 Notion "The Search"**
- Hook: a UI workspace switcher with cursor on off-white ("Camilla's Home → Startup OS"), then cut to live action.
- Structure: a hiring story in 6 locations. Notion UI cards float top-left or right over live action. The lift at 8 s is the music drop when the first card appears. Ends on white "Tasks. Notes. Wikis." → "…Calendar." → "For your life's work." + logo.
- Text animation (measured from the transitions sheet at 10 fps): a grey bar appears (frame 1) → a ghost card at 50% (frame 2) → the solid white card with avatar (frame 3). The text then types at ~2–3 chars/frame, and the card holds ~3–4 s. White card, soft shadow, small sans.
- Music: beat strength 7.7 (very clear) and 89.7 hits/min *(inf.: a click-heavy percussion bed)*. 36% of cuts land with a hit, 0% exactly on the detected beat.

**14 Slack "The ultimate work OS"**
- Hook: the Slack logo on white → a purple field with a search bar that types "How is Slack changing the way businesses do business?". The camera tracks ← to keep the cursor in frame.
- Structure: 30 s of continuous kinetic type. Single words as giant type ("Just", "And") with live action masked inside rounded pills or circles, customer quotes on flat colour fields (pink, green, blue), "All your [people/apps/agents & AI]" pill carousel, UI collage → "All in one work OS" → "How business works" → logo.
- Text: bold rounded geometric sans; inline logo chips replace words or sit between them ("Slack [#] has"). Words wipe or push off ←. The new background colour wipes in behind the type.
- Music: 129 BPM, beat strength 7.5, hits every beat (75.8/min). Each type change lands on a beat *(inf. from hit spacing ≈ 0.46 s)*. Cut detector sees only 4 "cuts" because everything is pushes and morphs.

**15 Wix Harmony (Big Game 2026)**
- Hook: "WIX" logo over a warm silhouette face, then an iris/vignette reveal of a laptop.
- Structure: a furniture maker's story. A frosted-glass prompt bar floats over live action and types her request (typewriter, cursor) across 3 shots, so the type persists through cuts. The generated site plays as full-screen UI with giant serif headlines ("rubi / manowe", "Soulful Design", "this is my way of creating") whose letters animate in → "WIX Harmony / The new way to create".
- Text: thin sans in the prompt box; big editorial serif (Didone class) for the site.
- Audio: a +23.9 dB lift at 1 s (music hits on the logo). 0% of cuts with a hit, so the score is smooth, not punctuated.

**16 adidas "You Got This"**
- Hook: B&W 4:3 pillarbox of a nervous kid and coaches with the adidas logo → B&W everyday-athlete moments.
- Structure: the first ~25 s is B&W 4:3 nerves (pressure). Then a switch to full-colour 16:9 elite athletes (relief and joy). Cut rate 19 → 55 → 87 /min in Q3, which is a spin/flip match-cut chain (breakdancer → gymnast → BMX → skier → BMX), each 3–6 frames matched on rotation direction. End: "Y O U / G O T / T H I S" in widely tracked thin sans as a 3×3 letter grid on black → logo.
- Flow: the rotation direction continues across the cuts (all spinning the same way). This is a motion match, not a graphic match.
- Music: lift at 62 s at the start of the stunt chain *(inf.)*.

**17 adidas "F50 Made Me Do It – The Monologue"**
- Hook: players run past a team bench → a lawn mower on the pitch.
- Structure: a mockumentary interview with a groundskeeper (seated, ear defenders) intercut with B-roll gags: binocular-vignette POV of a player, a "PLEASE KEEP OFF THE GRASS" sign blown away by a sprint, phone footage he watches.
- Text: small white serif subtitles bottom-centre (documentary convention).
- Audio: 133 BPM (beat 1.89), 59.7 hits/min, 29% of cuts with a hit *(inf.: whoosh plus impact on each speed gag)*.
- Transition: a gag reveal by speed. The sign is static for 2 s, then gone with a dust puff in 1 frame.

**18 Powerbeats Pro 2 (LeBron, Messi, Ohtani)**
- Hook: dark stadium silhouettes → a kick under floodlights.
- Structure: a three-athlete intercut "listen to your heart" narrative (RZA as "The Heart"). Mid-film, a 92:56 scoreboard CU marks the climax. End: "POWERBEATS PRO 2" → colourway product line-up.
- Text: a red condensed slab "LISTEN TO YOUR HEART" title card on a blurred plate; tiny credits "feat. RZA as 'The Heart'".
- Audio: loudest in the batch (-9.8 LUFS), flat-high energy every quarter (≈ -8 dB). *(inf.)* A heartbeat kick motif drives the cutting, and 51.7 hits/min.
- Transitions: cut to full black for ~3–4 frames between beats; floodlight flare/whiteout into a Messi profile.

**19 PUMA "FOREVER. FASTER."**
- Hook: low-key portrait faces emerging from black.
- Structure: surreal sports vignettes (high-jumper floating over a black void, a pole-vaulter against the sky, a bicycle kick over a sea of clouds, a footballer on a vertical pitch) → fans exploding in bars → goal → end: "SEE" smear-in → "SEE THE GAME LIKE WE DO" → "FOREVER. FASTER." logo.
- Text: condensed bold sans with horizontal motion-blur streaks. The letters slide in fast from the left with a long smear tail (a whip-type reveal).
- SFX: 96 hits/min (highest) and 42% of cuts with a hit. The hit cluster starts at 21.5 s, every ~0.3–0.6 s *(inf.: whooshes, crowd roars and impacts sound-design each vignette)*.
- Flow: dominant ←, with vertical moves on the jump shots.

**20 Gymshark "Build Your Legacy" (2018)**
- Hook: classical statues in a dark hall plus a tiny white "VOICE OF DORIAN YATES" caption.
- Structure: a young lifter intercut with marble bodybuilder statues; the statues are the payoff. Pacing slows (22.7 → 15.1 → 7.6 → 0 cuts/min); Q4 energy falls to -39.9 dB (fade-out ending).
- Text: tiny spaced caps sans, centred ("BUILD YOUR LEGACY"), fading.
- *(inf.)* A slow-burn VO piece; an example of pacing that winds down rather than building.

**21 Dallas Mavericks "The Blueprint" (2025-26 hype, Chime)**
- Hook: a shot clock counting down 24→21→18→15 in ~0.75 s steps, with a blue italic "BLUEPRINT" logo flickering on over B&W practice-gym plates.
- Structure: Q1 at 144 cuts/min is a manifesto VO with one caption line per shot ("Every story begins with a vision" / "a roadmap" / "guiding what's to come"). Eye-iris CU → macro texture transition → blueprint drawings → Dallas community → practice → game highlights → "Our story starts now" → sponsor lock-up. Cut rate decays 144 → 114 → 85 → 20 /min (fast open, slow ending).
- Text: VO-transcription captions, white sans, small, bottom-centre, holding across 2–5 shots. The phrase "are the building blocks." persists while the shots change every 3–5 frames.
- Audio: very loud (-8.9 LUFS) and flat (≈ -8 dB every quarter); 42 hits/min.
- Look: full B&W with the sponsor bug top-left.

**22 Premier League "You're In It Now" (USA)**
- Hook: an empty American diner → a TV showing the PL.
- Structure: a diner conversation (two fans) as the spine. Each line triggers a burst of match footage (fans, goals, celebrations). Cut rate 38 → 70 → 52 → 63 /min. A jersey-crest match-cut run has torso and crest locked mid-frame on a purple backdrop, club changing every 2–4 frames. A fantasy-app phone insert. End: "WHEREVER YOU ARE, HOWEVER YOU FAN. / JOIN US AT PREMIER LEAGUE IN USA" over a top-down diner table with PL ticker bars top and bottom → lion.
- Audio: big lifts at 88 s and 97 s (+25.9 and +23.6 dB) are the final crescendo. 30% of cuts with a hit.

**23 Premier League "IT'S TIME!" 2023/24**
- Hook: the PL lion scales up from a dot to full in ~3 frames (5 fps sheet ≈ 0.6 s) on an acid-green diagonal-stripe gradient, then a hard split-wipe to a stadium aerial.
- Structure: the fastest in the batch (108 cuts/min, median 0.36 s; Q2 hits 165 cuts/min). Collage maximalism throughout: video boxed inside a magenta/orange gradient frame, cut-out stickers (winged trophy, flip-calendar "FRI 11 AUG"), phone-UI transfer cards ("Mount is a red", "Havertz crosses London"), multiplied player clones trailing horizontally, torn-paper reveal "ONE SEASON WONDER". Ends on repeated outline "Showtime" type → club-crest grid around "It's Time / Opening Week" card.
- Text: giant bold rounded sans "It's" / "Time" that alternates white ↔ pink-orange gradient every 1–2 frames (a colour-flash beat). Big words fill ~60% of the frame width.
- Audio: quiet master (-23.3 LUFS, likely not normalised *(inf.)*); 43.5 hits/min.
- Flow: → dominant; the clone-trail moves are horizontal.

**24 Galaxy S25 Edge (mostly CG)**
- Hook: the phone edge-on as a thin line in black; "Introducing the new | Galaxy S25 Edge" sits either side of the phone.
- Structure: product orbit → curved LED-wall set → titanium "slices" macro → camera bump → lifestyle photos on curved glass → "Galaxy S25 Edge / Beyond slim" → SAMSUNG.
- Text: thin sans split left/right of the vertical phone, which acts as a divider ("Designed to ▌ fit your style", "The slimmest ▌ Galaxy S ever"). The words slide outward from behind the phone as it rotates into view.
- Audio: beat strength 4.18; energy rises Q1→Q4 (-14 → -9 dB).

**25 Indiana Pacers 2025 Playoffs Hype**
- Hook: a locker-room celebration → a newspaper headline "Was their run to the Eastern Conference finals a fluke?" → power-ranking clippings collaged on top (doubter montage).
- Structure: 30 s, 82 cuts/min, median 0.53 s. Q2 reaches 112 cuts/min. Hype bursts of huddles, player screams, fan reactions, a buzzer-beater → yellow "PLAYOFFS" sponsor card → logo + URL.
- Text: mostly diegetic (clippings, fan signs "ANNOYING LITTLE PIECE OF [HUSTLE]"); end card bold italic condensed on brand yellow.
- Transitions: speed-ramped punch-ins, 2–4-frame flash cuts, a radial-blur push into a screaming player.
- Audio: 126.5 BPM, speech share 0.33 (commentary/VO calls over music).

## 3. Batch synthesis

### Typical ranges (n = 25; median, IQR)
| Metric | Median | IQR | Min–max |
|---|---|---|---|
| Cuts/min | 29.9 | 18.8–41.7 | 3.4*–108.2 |
| Median shot (s) | 1.54 | 0.77–2.26 | 0.36–5.13 |
| BPM (as detected) | 85 | 75–106 | 71–160 (many likely half-time → ~140–160) |
| Beat strength | 2.35 | 1.95–3.10 | 1.59–7.70 |
| LUFS | -15.0 | -16.4 to -13.7 | -24.1 to -8.9 |
| Hits/min | 41 | 32–56 | 14–96 |
| % cuts on beat | 14% | 8–20% | 0–44% |
| % cuts with a hit | 14% | 7–27% | 0–47% |

Three tempo families appear in this batch:
- **Hype/sports edits** (16, 21, 22, 23, 25 plus 02 and 05 by the end): 50–110 cuts/min, median shot 0.36–0.7 s, loud (-9 to -15 LUFS).
- **Brand films/stories** (03, 04, 06, 08, 10, 17, 18, 19): 22–42 cuts/min, median shot 0.75–2.2 s.
- **Single-idea spots** (01, 09, 11, 12, 14, 15, 20, 24): ≤ 30 cuts/min with long holds. In 14 and 15 the motion lives inside the frame (kinetic type, UI) rather than in cuts.

### How pacing changes
- The most common shape is **build to Q3, release in Q4**: 06 (28→44→64→28), 07 (16→24→48→8), 08 (19→31→35→10), 16 (19→55→87→52), 24 (7→27→34→7). The fastest cutting sits just before the end card, and the end card itself is a 2–5 s hold.
- **Monotonic build:** 05 Nike (16→24→42→56). This works when VO intensity also rises.
- **Front-loaded hype:** 21 Mavs (144→114→85→20) and 23 PL (66→165→108→94). They grab attention fast, then let the last section breathe.
- Slow-burns that never speed up (20 Gymshark, 12 Squarespace) rely on star power or a single gag. These are not a model for "energetic".

### Cuts vs beat
- Only 14% of cuts land exactly on a detected beat (IQR 8–20%), and 14% coincide with a transient. Pros do **not** cut every shot on the grid. They put the *picture events* (type changes, photo slams, impacts, logo hits) on the beat and let the in-between cuts follow action and VO phrasing.
- Exceptions that are fully on-grid are graphic-driven pieces: 02 Apple photo slams (44% on beat / 47% with hit) and 14 Slack type changes (every 0.46 s = 1 beat at 129 BPM *(inf.)*). Rule: **the more graphic and less live-action the piece, the more strictly on-beat it is.**
- VO-led films (05, 06, 21) cut on VO phrase boundaries: 7–14% on beat even at 35–90 cuts/min.

### SFX density and placement
- Hits/min median 41 (IQR 32–56). The heavily sound-designed pieces are 19 PUMA (96/min, 42% of cuts with a hit), 02 Apple (94), 13 Notion (90), 14 Slack (76) and 17 adidas F50 (60). Part of that is percussion *(caveat)*.
- Placement patterns seen *(inf. from hits plus visuals)*:
  - impacts or whooshes on **reveal moments**, not on every cut (PUMA vignette entrances, adidas sign-blow gag);
  - UI clicks, keystrokes and shutter clicks synced to **on-screen UI events** (Apple MacBook letter drops, Apple photo slams, Notion card pops, Squarespace typing);
  - one **big lift** (+20 to +43 dB) at the emotional turn: 01 at 23 s, 08 at 108 s, 03 at 63 and 92 s, 22 at 88 s;
  - near-silence before the lift (03's Q1 and Q4 ≈ -34 dB). Contrast is what makes the lift feel loud.
- Loudness: brand films sit at -13 to -17 LUFS. Hype edits are mastered hot (21 Mavs -8.9, 18 Beats -9.8, 06 Nike -10.7).
