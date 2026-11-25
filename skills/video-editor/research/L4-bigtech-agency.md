# L4: Big-tech feature films + motion-agency reels/client launches

Batch of 25. Videos 01–15 are big-tech software and feature films: Apple, Google, Microsoft, Stripe, Shopify, Spotify and Duolingo. Airbnb is covered through BUCK's client spots (16, 17). Videos 16–25 are agency work by BUCK, Superside, Ordinary Folk, Motion The Agency and ManvsMachine.

**Sourcing gaps:** I could not find official YouTube uploads for Wednesday, Alive Studios (SaaS), Lemon Collective or Holographik. Searches returned unrelated channels: a "Holographik Space" DJ venue, a cartoon studio also called "Alive Studios", and lemon products. I replaced them with extra BUCK, Ordinary Folk and Motion The Agency pieces. The Airbnb Summer Release keynotes run 46–52 min, so I used BUCK's Airbnb spots instead.

**Re-upload notice:** #09 (Copilot Super Bowl, "SuperBowl" channel), #24 (iMac Pro × ManvsMachine, "VintageMacZone") and #25 (Air Max Day '17, "Flight Products"/"NA") are not on the brand's own channel. The work itself is official.

**Measurement caveats:**
- **Cut detection on UI films is unstable.** #04 Gemini Canvas measured 0 cuts in a first run that was later lost, and 10 cuts/min on the re-run. Many UI films use in-frame animated transitions (morphs, push-ins, word swaps) that the cut detector does not count. Low cuts/min here does not mean a static film. Read `motion_share` and the sheets alongside it.
- **#06 Gemini 2.0:** "cuts" in the transitions sheet are page loads inside sped-up screen recordings.
- **#11 Stripe recap:** biggest lift of 168 dB at t=1 s is an artifact of rising from digital silence. Ignore it.
- **#25 Air Max:** 156 cuts/min and a 0.2 s median shot look real; the sheet shows a new restyled title every 4–6 frames. Some of the shortest "shots" may be in-shot strobe changes.
- **BPM octave errors are likely:** #13 at 179 BPM may be a double-time reading of about 90; #20 at 70 and #10 at 72 may be half-time readings of about 140–144. These are inferences.

## 1. Table

| # | Title / channel / URL | Len (s) | Cuts/min | Med shot (s) | BPM (strength) | LUFS | Hits/min | % cuts on beat | % cuts w/ hit | Speech | Dominant flow | Distinctive |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 01 | iOS 26: Introducing Liquid Glass / Apple / youtu.be/jGztGfRujSE | 274 | 13.8 | 3.04 | 118 (2.51) | -19.2 | 57 | 24 | 10 | 0.19 | static then ← → | Presenter host is broken up by macro "material" B-roll of the glass UI. |
| 02 | WWDC 2025: Watch the Highlights / Apple / youtu.be/Qz8u00pX738 | 133 | 17.1 | 1.63 | 127 (2.21) | -16.0 | 53 | 32 | 18 | 0.24 | ↑ and ← | Feature sizzle: phones stagger in from the right, then the camera pans the strip. |
| 03 | VoiceOver powered by Apple Intelligence / Apple / youtu.be/B3SmsSCvoss | 81 | 24.3 | 1.67 | 91 (3.48) | -16.0 | 72 | 12 | 27 | 0.09 | ← | Live-action, sound-design led; tactile close-ups (AirPods case, cane tip). |
| 04 | Introducing Canvas in Gemini / Google / youtu.be/4Leardp_AGc | 60 | 10.0* | 4.73 | 80 (5.35) | -8.6 | 91 | 30 | 80 | 0.02 | ← → | Kinetic type on black, one accent-coloured word per line, UI glows. |
| 05 | Introducing Google Vids / Google Workspace / youtu.be/4SCjXcBeW1E | 87 | 14.5 | 2.70 | 90 (4.48) | -18.0 | 94 | 24 | 19 | 0.14 | ← → Z+ | Word-swap hook; cursor-driven push-ins; record button match-cut. |
| 06 | Introducing Gemini 2.0 / Google / youtu.be/Fs0t6SdODd8 | 172 | 8.7 | 1.79 | 77 (1.55) | -14.2 | 58 | 16 | 16 | 0.17 | static, ← → | Particle-line "chapter cards" between product demos (Astra, Mariner). |
| 07 | Switch like Sol / Made by Google / youtu.be/aFQvG0WQkpU | 60 | 11.0 | 3.32 | 74 (2.03) | -15.2 | 41 | 0 | 9 | 0.23 | static | Comedy celebrity spot; ends on a clean product endcard. |
| 08 | Microsoft 365 Copilot / Microsoft Copilot / youtu.be/B4mJO6F5kok | 60 | 19.0 | 2.03 | 137 (5.32) | -16.0 | 104 | 42 | 58 | 0.00 | ← dominant | 3D glass/ribbon world; floating UI cards; cut rate doubles in Q4. |
| 09 | Copilot Super Bowl 2024 / SuperBowl (re-up) / youtu.be/Rs38KlNdC_Q | 61 | 29.7 | 1.58 | 80 (4.57) | -16.5 | 19 | 20 | 0 | 0.02 | static | Lyric-style lower text over faces; music only, no SFX on cuts. |
| 10 | Stripe Sessions 2024 / Stripe / youtu.be/KH0_HM6e66w | 109 | 45.7 | 0.98 | 72? (1.76) | -14.0 | 46 | 12 | 16 | 0.18 | ← ↓ | Event recap: logo flurry at 0.2–0.3 s per logo, pink/purple grade. |
| 11 | Stripe Sessions 2024 recap of 50+ updates / Stripe / youtu.be/TPCh7oxG1f4 | 111 | 21.1 | 2.02 | 160 (2.12) | -14.3 | 70 | 26 | 33 | 0.25 | static | Two-host talking head with UI-card inserts and big type cards ("A/B test"). |
| 12 | Shopify Editions Summer '25 Trailer / Shopify / youtu.be/CZqaS7PcjdI | 35 | 8.5 | 3.78 | 110 (6.82) | -15.1 | 103 | 60 | 80 | 0.00 | ↑ | Condensed caps titles; accelerating push into laptop; "150+ UPDATES" climax. |
| 13 | Shopify Editions Winter '26 Trailer / Shopify / youtu.be/kDpckwYZgZI | 35 | 6.8 | 5.30 | 179? (2.63) | -17.3 | 26 | 25 | 0 | 0.03 | ← | Renaissance-painting world; counter roll-up "55+ → 150+ updates". |
| 14 | Your Favourite Artists reveal Wrapped 2025 / Spotify / youtu.be/YlxlsQVLw3E | 166 | 22.0 | 2.20 | 72 (1.76) | -17.4 | 37 | 8 | 15 | 0.08 | → ← mixed | Comedy vignettes; on-screen stream-count "stamps" as typographic beats. |
| 15 | Practice Speaking with Video Call / Duolingo / youtu.be/vBjfn2Pb6DI | 34 | 12.5 | 3.38 | 95 (2.40) | -20.4 | 52 | 14 | 14 | 0.15 | static | Split screen of user and animated Lily; bouncy logo letters. |
| 16 | Airbnb "Get an Airbnb" (Bedtime) / BUCK / youtu.be/6NuXWM-EaoY | 30 | 12.0 | 4.03 | 106 (3.12) | -17.0 | 40 | 17 | 0 | 0.20 | static | 3D isometric cutaway dollhouse; gag-driven comedy timing. |
| 17 | Airbnb Services: Stay Grounded / BUCK / youtu.be/7ObkcN2C6lc | 30 | 6.0 | 5.46 | 92 (3.08) | -17.1 | 54 | 67 | 0 | 0.10 | ↓ | Motion-blur whip-down transitions between diorama worlds, then the app. |
| 18 | BUCK Sydney Turns Ten / BUCK / youtu.be/SxYzrzRjfsI | 60 | 73.4 | 0.72 | 160 (8.90) | -12.9 | 100 | 27 | 42 | 0.00 | all directions | Studio reel: 160 BPM, very strong beat, Q3 at 133 cuts/min. |
| 19 | Superside Motion Graphics Showreel / Superside / youtu.be/9TpzSjuesww | 85 | 18.4 | 2.52 | 98 (3.62) | -19.6 | 90 | 15 | 27 | 0.00 | ← → | Agency client-ad sampler; kinetic type re-colour flicker and 3D type fly-through. |
| 20 | Ordinary Folk: Reel II / Ordinary Folk / youtu.be/SJ4u5pPMtKs | 92 | 43.1 | 0.88 | 70? (5.40) | -13.8 | 25 | 41 | 36 | 0.01 | → ← | Abstract 2D/3D reel; continuous shape morphs; slows at the end. |
| 21 | Webflow: Welcome to the Age of No-code / Ordinary Folk / youtu.be/_qCBg_Wsr8M | 90 | 8.0 | 4.38 | 72 (3.14) | -17.0 | 55 | 42 | 33 | 0.10 | → ↓ | SaaS conference opener; abstract wireframes → spheres → worlds, VO-led. |
| 22 | Leave Dates explainer / Motion The Agency / youtu.be/3lq2egaRVPs | 101 | 15.4 | 2.32 | 127 (2.76) | -16.3 | 69 | 19 | 27 | 0.22 | static, ↑ | Paper-collage cutouts mixed with flat UI cards; VO explainer. |
| 23 | Sharpish explainer / Motion The Agency / youtu.be/9TJa3BTODZo | 132 | 8.6 | 3.40 | 89 (2.07) | -15.8 | 58 | 11 | 26 | 0.41 | ← | Founder talking head intercut with 3D UI, stat cards and timeline. |
| 24 | iMac Pro × ManvsMachine artist film / re-up / youtu.be/suFbHIg-3K0 | 63 | 6.6 | 6.74 | 85 (6.53) | -16.1 | 9 | 14 | 29 | 0.13 | static, → | Word-by-word black title card; long continuous procedural-architecture shots. |
| 25 | Air Max Day '17 / ManvsMachine (re-up) / youtu.be/UZYp5XFm1Mk | 30 | 156.2 | 0.20 | 176 (4.01) | -6.6 | 93 | 35 | 47 | 0.10 | ← | Strobe montage of one title ("KISS MY AIRS") in many materials. |

\* #04: cut count is unstable, see caveats. "?" marks a possible BPM octave error.

## 2. Per-video notes

**01 Apple iOS 26 Liquid Glass (274 s)**
- **Hook:** aerial of Apple Park → macro of the glass ring → host. Starts slow and premium; the first cut lands at 3.4 s.
- **Structure:**
  - 0–13 s: host intro.
  - 13–60 s: material macros of the clock and dock icons.
  - 60–240 s: feature-by-feature, alternating host and UI.
  - 240 s: physical glass "hello" letters.
  - End: Apple logo.
- **Pacing:** even across quarters (14/15/11/15 cuts per min).
- **Type:** almost none. The only big type is the "Liquid Glass" wordmark embossed into a white surface (a material treatment, not text animation).
- **SFX:** about 57 transients per min, but only 10% of cuts carry a hit. Inferred: soft UI ticks under the interactions, not cut impacts.
- **Music and flow:**
  - Music is a 118 BPM bed under VO, at -19.2 LUFS (quietest of the big-tech group). The biggest lift (+18 dB at 113 s) lands on a music swell between sections.
  - Transitions sheet: macro pills (News tabs → camera mode switcher → slide-to-answer) cut together because the same rounded glass capsule sits in the same frame position. Graphic match cuts on the UI component.

**02 Apple WWDC25 Highlights (133 s)**
- **Hook:** colourful 3D Photos petals, a macro dock, and the camera mode pill, all within 3 s.
- **Structure:** each OS feature gets a 1–4 s vignette on pastel gradient backdrops (Messages, Phone, Photos, Live Translate, Files, Mac, CarPlay, visionOS), ending on the logo.
- **Pacing:** 1.63 s median shot. U-shaped curve: 21.6 cuts/min, dipping to 10.8, rising to 23.5. Fast open, fast close.
- **Signature move:** phones slide in from screen-right one at a time, staggered by about 3 frames, into a fanned strip. The camera then drifts. The "↑" flow (21 s of it) comes from vertical drifts through UI lists.
- **Text:** mainly UI text. The "Spam" tag zooms in big as a feature title.
- **Music:** 127 BPM with weak-to-moderate beat strength (2.2); 32% of cuts on the beat.

**03 Apple VoiceOver × Apple Intelligence (81 s)**
- **Hook:** a gas flame igniting, then a kettle pour. Sound-led cold open; lifts of +12 dB at 2 s and +23 dB at 9 s.
- **Structure:** morning routine at home → walking with a cane → subway. Super "VoiceOver on iPhone" → black endcard "Personal. Private. Powered by Apple Intelligence."
- **Pacing:** cut rate climbs to 38 per min in Q3 (subway montage) and drops to 6 in Q4 (endcard hold).
- **SFX:** 72 hits per min, the highest of the Apple films. Inferred: foley-driven (case snap, cane taps, train).
- **Type:** tiny white sans supers over picture, centred. They fade in, hold about 2 s and fade out.
- **Flow:** "←" dominates, matching walking direction screen-right to left.

**04 Google: Canvas in Gemini (60 s)**
- **Hook:** "✦ Gemini" wordmark on black with a blue glow, then the UI window tilts in 3D.
- **Structure:** a type-led manifesto ("Your AI assistant from Google / Reimagined for better / collaboration / Introducing Canvas in Gemini"), then demo beats. A one-word label floats over each sample app ("docs / timelines / data / games / apps"), each held about 0.5–1 s. The endcard repeats the opening window.
- **Type:**
  - Medium-weight sans, centred, white, with the key word in Gemini blue.
  - Words build one at a time, and letters scatter for "colla-bora-tion".
  - Some words are typed with a code-style cursor ("into cod3`)").
- **Audio:** loud (-8.6 LUFS), strong beat (5.35), 91 hits per min, 80% of cuts on a hit. Every cut and label change is struck. This is the clearest "hit every change" example in the batch.

**05 Google Vids (87 s)**
- **Hook:** "Meet your [+New] designer / writer / producer / editor / storyteller". The last word swaps about every 0.4 s in blue while the "+New" chip stays fixed.
- **Structure:**
  - Click "New" → menu → Vids.
  - Play-triangle wipe.
  - Typed prompt "create a sal…" → "Creating…" pill.
  - Storyboard → style → script → voice → stock media → record → final playback.
  - Ends with use-case words ("event recaps / design reviews") and the Workspace logo.
- **Pacing:** cut rate builds through the film: 5.5, 13.8, 13.8, 24.9 cuts per min.
- **Moves:**
  - Cursor-led push-ins to the clicked control.
  - The record icon match-cuts into a black, full-screen record button.
  - The countdown "3" flies in large and settles into a circle with overshoot (about 6 frames).
- **SFX:** 94 hits per min. Inferred: UI clicks and whooshes on every push.
- **Type:** Google Sans; typewriter with a visible caret, cut mid-word to keep things moving.

**06 Google: Introducing Gemini 2.0 (172 s)**
- **Hook:** a left-aligned title card, "Gemini 2.0 / Enabling the agentic era", over a dark particle backdrop.
- **Structure:** 3–4 word chapter cards ("think / action / multimodal memory / multilingual / applied agents / physical") ride on drifting light-lines between demo blocks (Astra street footage, Mariner screen capture, games, robotics).
- **Speech:** 162 WPM VO and subtitles.
- **Pacing:** Q1 and Q4 have no detected cuts (opening card and endcard holds).
- **Lifts:** big lifts (about +21 to +26 dB) at 18 s and 125–141 s line up with section changes after near-silent card holds. Inferred: music drops out under the cards, then returns.
- **Flow:** the line-particles travel ← → and serve as the transition carrier between sections.

**07 Pixel 9: Switch like Sol (60 s)**
- **Hook:** the celebrity (Sol Campbell) in a white jumper in the kitchen, looking to camera.
- **Structure:** the comedy is a jumper-colour switch (white → red) as he "switches". He moves room to room, demos Gemini Live on the sofa, then a black card "Now we're talking." and a product endcard ("Google Pixel 9 / with ✦ Gemini Live").
- **Cut rate:** 24 per min in Q2 at the switch montage, 4 per min at the end.
- **Edit style:** 0% of cuts on the beat. Cut to dialogue timing, not to music.
- **Endcard:** cream background, product photo, small sans type, and the Gemini wordmark with an animated waveform.

**08 Microsoft 365 Copilot (60 s)**
- **Hook:** "Hey Cop" builds word by word in a translucent chat pill on a soft 3D tabletop scene.
- **Structure:**
  - Conversational prompts in pills ("what have you been up to…").
  - Stat cards ("2x faster responses", "3x higher response satisfaction", "Used by nearly 70% of the Fortune 500").
  - App demos (Outlook, PowerPoint, Teams) in floating windows; a stack of glass app icons.
  - Endcard: Copilot logo → Microsoft.
- **Pacing:** the fastest finish in the batch. Q4 runs 36 cuts per min, three times Q1.
- **Audio:** 137 BPM, strong beat (5.32), 104 hits per min (highest of the batch), 42% of cuts on the beat, 58% with a hit. No speech. Music and SFX carry everything.
- **Flow:** "←" dominates. Glass ribbons and camera move screen-left almost the whole way through, giving a constant forward drift.

**09 Copilot Super Bowl 2024 (61 s)**
- **Hook:** a man driving at night with "they say I will never open my own business" in small lower text.
- **Structure:** a montage of "they say…" doubts (one face per line) → "but I say / watch me" → the phone reveals Copilot → rapid prompt and result shots → black endcard "Copilot / Your everyday AI companion / Anyone. Anywhere. Any device."
- **Cut rate:** steady and fast (24–40 per min).
- **Audio:** only 19 hits per min and 0% of cuts with a hit. A music-only build (80 BPM, beat strength 4.6) with no impact SFX. The energy comes from the cut rate and the swell of the score.
- **Type:** small centred sans lyric-lines that fade word-group by word-group, timed to the music.

**10 Stripe Sessions 2024 (109 s)**
- **Hook:** a dark arena, then the stage lights up; a "stripe SESSIONS" lockup card by 2 s.
- **Structure:** keynote moments → expo floor → product demos on stage → partner logo flurry (Klarna, Xero, Adobe, Thoughtworks, Zip, AWS, Pilot; about 0.2–0.3 s each) → fireside chats (Jensen Huang) → lockup.
- **Pacing:** the fastest big-tech edit at 45.7 cuts per min and a 0.98 s median shot, peaking at 57 per min in Q3.
- **Lower thirds:** name and title, thin vertical rule, white sans, bottom-left.
- **Sound:** speech grabs ride over the music bed (207 WPM subtitle estimate). Only 12% of cuts on the beat, because cuts follow the soundbites. The biggest lift (+13 dB at 88 s) comes into the closing.
- **Grade:** unified magenta and violet across every shot.

**11 Stripe Sessions recap: 50+ updates (111 s)**
- **Hook:** "50+ product updates:" types on as a scrolling list (Usage-based billing, Vault…), left-aligned, with the purple gradient orb behind.
- **Structure:**
  - Two hosts (Will Gaybrick, Tanya Khakbaz) in a studio, with name lower thirds.
  - A white icon-grid pops in beside the host one tile at a time.
  - Full-screen type cards ("A/B test", "Payment", "Stripe Billing") and UI cards on dark purple (usage meter dial counting up to 30,000).
- **Ending:** a blooper and high-five tail.
- **Audio:** 160 BPM reading, 70 hits per min, 33% of cuts with a hit.

**12 Shopify Editions Summer '25 Trailer (35 s)**
- **Hook:** the Shopify bag glows on black. "SHOPIFY EDITIONS" condensed caps stretch and squash in, then "SUMMER '25" materialises in violet. The script "Horizons" draws on and shatters into chrome liquid.
- **Structure:**
  - "NEW ERA IN STORE DESIGN" over storefront UI.
  - "SMARTER AI. SMARTER BUSINESS." → laptop push-in → isolated prompt box on black typing "How can I improve".
  - "NEXT-GEN DEV PLATFORM" over 3D code panels.
  - "70 UPDATES → 150+ UPDATES" over a mosaic of UI tiles → lockup.
- **Audio:** the strongest beat in the big-tech group (6.82) at 110 BPM, 103 hits per min, 60% of cuts on the beat, 80% with a hit. Textbook trailer cutting.
- **Push-in:** the laptop push accelerates (ease-in) over about 1.5 s, then hard-cuts to the isolated prompt.

**13 Shopify Editions Winter '26 Trailer (35 s)**
- **Hook:** the Shopify bag in a dusky Renaissance garden. Painted figures on a skateboard reveal the title "Shopify Editions Winter '26".
- **Structure:**
  - Counter roll-up "55+ → 150+ updates" over a growing lily. The number eases out over about 1.5 s; the type scales up and sharpens.
  - UI cards tile in diagonally from top-left as a wipe.
  - Feature cards (Sidekick Pulse, A/B test with Rollouts, conversion rate 1.48% → 2.17%).
  - "The Renaissance Edition" → "The commerce Renaissance is here".
- **Audio:** 0% of cuts with a hit. Most changes are in-frame animation, not cuts.
- **Type:** clean white grotesk; numbers count rather than cut.
- **BPM:** 179 is probably a double-time reading of about 90.

**14 Spotify Wrapped 2025: artists reveal (166 s)**
- **Hook:** a crowd of school kids bursting into a corner shop, shot handheld and wide.
- **Structure:** a chain of comedic vignettes, each starring an artist delivering "your Wrapped". Each has a typographic stamp: a clapperboard "CAN'T RUSH GREATNESS 785M+ STREAMS", "1B+ STREAMS" on CRT TVs, a street sign "FAMILY MATTERS 28M+ STREAMS". Ends on the Spotify logo and "#SpotifyWrapped".
- **Text as props:** the stream counts appear on objects in the scene (signs, screens, clapperboards), not as overlays.
- **Edit:** cuts are comedic and dialogue-timed (8% on the beat); beat strength is weak (1.76).

**15 Duolingo Video Call (34 s)**
- **Hook:** the lowercase "duolingo" wordmark animates in letter by letter with a bounce over a blurred office.
- **Structure:** phone → call connects → split screen (user left, Lily on a black phone right) → close-ups → end summary screen → logo bounces back with Lily.
- **Sound:** quietest in the batch (-20.4 LUFS); VO and dialogue at 162 WPM.
- **Logo type:** letters arc and bounce in (about 8 frames each, staggered) and exit the same way.

**16 BUCK × Airbnb "Get an Airbnb" Bedtime (30 s)**
- **Hook:** a hand hangs a "Somewhere in a Hotel" door tag; it swings and settles over about 1.5 s.
- **Structure:** a 3D isometric hotel cutaway with a cramped family in matching onesies. Lights out, then the room unfolds into a large Airbnb house cutaway at night (fireworks), ending on "Some trips are better in an Airbnb." and the logo.
- **Pacing:** Q1 runs 24 cuts per min; Q2–Q4 run 8. One long isometric camera hold does the work.
- **Sound:** biggest lift +22 dB at 11 s, on the hotel-to-house reveal. 0% of cuts with a hit; gags are scored by music and dialogue.

**17 BUCK × Airbnb Services "Stay Grounded" (30 s)**
- **Hook:** a warm cabin kitchen diorama.
- **Structure:** a meadow cottage (chef service, flour puff) → **whip-down with motion blur** to a snowy chalet (massage) → whip to a cloud-island yurt (yoga) → white UI: Homes, Experiences and a "NEW" Services tab, then a phone → logo.
- **Beat use:** 67% of cuts on the beat (highest share), though only 6 cuts per min. The few real cuts are placed on downbeats.
- **Flow:** "↓" dominates. Every location change is a vertical whip-pan downward. A consistent single-direction transition grammar.

**18 BUCK Sydney Turns Ten (60 s)**
- **Hook:** a bold monoline "10 SYD BUCK 2015–2025" logo on black, then straight into a fireworks of work.
- **Structure:** about 70 clips from client work (Coca-Cola, Nike, Oreo, Australian Open/Kia, Amazon Halo) and back to the logo.
- **Pacing:** 73 cuts per min, 0.72 s median, Q3 at 133 cuts per min.
- **Audio:** strong 160 BPM beat (beat strength 8.9, the strongest in the batch), 100 hits per min, 42% of cuts with a hit. Multiple clips are joined by object continuation: the explosion cloud sheet goes rocket → cloud burst → aerial stadium → live-action tennis player with drawn smears.
- **Flow:** shifts direction almost every second. Reel logic is "keep moving", not "keep one direction".

**19 Superside Motion Graphics Showreel (85 s)**
- **Hook:** the Superside "S" logo draws on and resolves on navy, then a green colour-block wipe.
- **Structure:** a sampler of client social ads: Puma typographic stack, "A Calmer Dog / A Happier Dog!" product ad, isometric HVAC explainer, edtech laptop UI, fintech "5 STOCKS UNDER $49", gummy and jewellery ads. Ends on a green-to-navy colour-block wipe and the logo.
- **Pacing:** Q3 peak at 31 cuts per min.
- **Type moves:** text re-colour flicker (white ↔ red on alternate frames) and 3D type fly-through into the next card ("LEARN MORE" assembling from tumbling letters).
- **Mix:** quiet (-19.6 LUFS) but 90 hits per min. A whoosh on every card.

**20 Ordinary Folk: Reel II (92 s)**
- **Hook:** a wireframe polyhedron on black, which opens into a star-field iris.
- **Structure:** continuous abstract 2D and 3D pieces: kaleidoscope morph, skateboarder on floating blocks, gradient orbs, cube transforms, character spots. A slow final section (Q4 at 21 cuts per min, half the Q1 rate) of light-trails and clouds into a small "Ordinary Folk" mark.
- **Music:** 70 BPM is probably a half-time reading of a 140 track; beat strength 5.4; 41% of cuts on the beat.
- **Transitions:** shape morph. The kaleidoscope flower grows from a line drawing to a filled form over about 1 s, then hard-cuts.

**21 Ordinary Folk × Webflow "Age of No-code" (90 s)**
- **Hook:** dark code fragments resolve into a wireframe page.
- **Structure:** wireframe → website panels → glowing orb → paper-fold spiral tunnel → grid of spheres → pastel 3D world → planets → "No Code Conf" logo. VO-led (204 WPM subtitles).
- **Pacing:** slow cuts (8 per min) but continuous camera (motion share 0.49): ← → push-throughs and orbit moves carry the flow.
- **Cuts:** 42% on the beat. The sparse cuts are placed on bar lines.

**22 Motion The Agency: Leave Dates (101 s)**
- **Hook:** a stressed worker on a desaturated yellow photo-collage. Notification cards pop in around her with overshoot, plus scribbled doodles.
- **Structure:** problem ("Difficult" crossed out on a sky collage) → logo → team calendar UI builds → mobile app → "TIME OFF" kinetic title (disco ball, flamingo float) → feature demos → testimonial star-cards → "TRY FOR FREE" → logo and tagline.
- **Type:** chunky white sans with bounce. Letters of "TIME OFF" bob individually, then sink under a wave wipe.
- **Accents:** small yellow "pop" accent marks appear when cards land. Inferred: each has a matching pop or tick SFX (69 hits per min).

**23 Motion The Agency: Sharpish (132 s)**
- **Hook:** a founder at a desk on a pink and teal gradient set; the logo pops on beside him.
- **Structure:**
  - Talking head (41% speech share).
  - 3D ball-pit "Revolution", "£100 Billion Annually" over white stairs.
  - The "Solution" word wobbles in 3D, then competitor logos flip in on cubes ("MONSTER / indeed / Totaljobs") and flip to "Not another job portal."
  - UI demos on teal, stats ("3.1 Million Employees"), a timeline ("Aug 2023 → Nov 2023 → America") and logo.
- **Cut rate:** low (8.6 per min). The energy comes from in-shot 3D animation.

**24 ManvsMachine × Apple iMac Pro artist film (63 s)**
- **Hook:** Apple logo → "The most powerful [Mac] ever." builds word by word on black, with the key word in peach. "Pushed to the limit / by" → hard cut to a full-frame peach card "ManvsMachine".
- **Structure:** long continuous procedural-architecture camera moves (brutalist facades → recursive tunnels → lattice → radial mandala) → the film shown on an iMac Pro → "iMac Pro" → logo.
- **Pacing:** median shot 6.7 s. Only 8.5 hits per min, but beat strength 6.5. Inferred: the music is a pulsing electronic bed with few separate hits.
- **Type rhythm:** each word or phrase is held about 0.6–1.0 s, a steady metronome.

**25 ManvsMachine × Nike Air Max Day '17 (30 s)**
- **Hook:** "KISS MY AIRS" in inflated 3D letters inside a red pegboard set.
- **Structure:** the same title restyled in about 10 materials and sets (chrome, red, leopard print, teal balloon), shown for 4–6 frames each, alternating with sneaker hero shots and texture close-ups → "AIR MAX DAY" → Nike swoosh on blue.
- **Numbers:** 156 cuts per min, 0.2 s median, 176 BPM, -6.6 LUFS (the loudest in the batch).
- **Grammar:** one idea, many skins. A rapid style montage holds together because the title stays locked in position while everything around it changes.

## 3. Batch synthesis

### Typical ranges (n=25; median, IQR)

| Metric | All | Big-tech (01–15) | Agency (16–25) |
|---|---|---|---|
| Cuts/min | 14.5 (8.7–22.0) | 14.5 (10.5–21.6) | 13.7 (8.2–36.9) |
| Median shot (s) | 2.5 (1.7–3.8) | 2.2 (1.7–3.4) | 3.0 (1.2–4.3) |
| BPM | 92 (80–127) | 91 (78–123) | 95 (86–122) |
| Beat strength | 3.1 (2.2–4.6) | 2.5 (2.1–4.5) | 3.4 (3.1–5.1) |
| LUFS | -16.0 (-17.1 to -14.3) | -16.0 (-17.4 to -14.7) | -16.2 (-17.0 to -14.3) |
| Hits/min | 57 (41–90) | 57 (43–81) | 56 (43–85) |
| % cuts on beat | 24 (14–32) | 24 (13–28) | 23 (16–39) |
| % cuts with hit | 26 (14–33) | 16 (12–30) | 28 (26–35) |
| Speech share | 0.10 (0.02–0.19) | — | — |

- **Two clear speeds:**
  - **Narrative and feature films** (Apple keynote film, Pixel, BUCK Airbnb, explainers): 6–15 cuts per min, 2.5–6 s shots.
  - **Sizzles and reels** (WWDC highlights, Stripe Sessions, Copilot Super Bowl, BUCK and Ordinary Folk reels, Air Max): 17–156 cuts per min, 0.2–1.7 s shots.
  - A launch trailer for an app sits at the high end only when it is a sizzle. The UI-led product films (Canvas, Vids, Shopify) keep 2.7–5 s "shots" but fill them with constant in-frame animation (motion share 0.35–0.42) and SFX (90–103 hits per min).
- **BPM:** the most energetic UI trailers sit at 110–137 BPM with a strong beat: #08 Copilot 137 (5.3), #12 Shopify 110 (6.8), #22 Leave Dates 127. Reels go to 160–176. The 70–90 BPM entries are emotional or narrative films (Super Bowl, Pixel, VoiceOver, iMac Pro).
- **Loudness:** delivered around -16 LUFS (YouTube-normalised range). The punchy outliers are #04 Canvas (-8.6) and #25 Air Max (-6.6). Nothing quieter than -20.4.

### How pacing changes across the video
- The peak cut-rate quarter was Q3 in 11 of 25 videos and Q4 in 6. In 17 of 25 the fastest section falls in the second half: a build into a late-middle climax, then a settle for the endcard.
- **Four reusable curve shapes:**
  1. **Build to the end:** #05 Vids 5.5 → 24.9; #08 Copilot 12 → 36; #17 Airbnb Services 0 → 16.
  2. **Climax in Q3, then endcard hold:** #03 VoiceOver 26 → 38 → 6; #10 Stripe; #18 BUCK 60 → 133 → 60; #19 Superside.
  3. **U-shape** (fast open sizzle, calm middle feature, fast close recap): #02 WWDC 21.6 → 10.8 → 23.5; #11 Stripe recap.
  4. **Fast open then decelerate** (reels that end on a breath): #20 Ordinary Folk 55 → 21; #24 iMac Pro.
- **Endcards are always held.** Last 2–5 s: logo on a flat colour, with no cuts.

### Cuts versus the beat
- Measured on-beat share is modest (median 24%), even in the energetic pieces. Pros don't put every cut on the beat; they put the important cuts on it.
- The highest on-beat shares come from trailers and few-cut spots: #17 at 67% (only 3 cuts, all on downbeats), #12 at 60%, #08 at 42%, #21 at 42%, #20 at 41%.
- Dialogue-led films cut to speech instead: Pixel 0%, Spotify 8%, Stripe 12%.
- **Inference:** in UI trailers, in-frame animations (card lands, word swaps, number ticks) land on the beat. That is why hits per min (90–104) is far higher than cuts per min (8–19). The beat is "hit" by animation events, not only by cuts.

### SFX density and placement
- **Hits per min splits the films into two groups:**
  - About 90–104 hits per min in UI and product trailers (#04, #05, #08, #12, #18, #19). Every UI event gets a click, tick, whoosh or riser hit.
  - About 9–40 hits per min in emotional and live-action films (#09 Super Bowl 19, #24 iMac Pro 9, #07 Pixel 41, #16 Airbnb 40). There the score carries the energy and SFX are diegetic foley.
- **"Cut with hit":** 80% in #04 and #12, 58% in #08, but 0% in #09, #13, #16 and #17. The UI trailers stack an impact on the cut; story spots never do.
- **Inferred placement rules:**
  - Typed text gets per-keystroke ticks (#05, #12).
  - Card or notification pops get a soft pop (#22, #11 icon grid).
  - Push-ins get a whoosh that resolves on the cut (#12 laptop → prompt).
  - Counters roll with a riser (#13).
  - Logo resolve gets a single low hit or chime, then silence or tail.

### Text animation conventions
1. **Word-by-word reveals on black or a flat field.** Centred sans, white, with the key word in the brand accent (#04 Gemini blue, #24 peach, #12 violet). About 0.5–1.0 s per word or phrase.
2. **Word-swap slot.** A fixed phrase plus one rotating noun that changes every 10–12 frames ("Meet your [+New] designer / writer / producer…", #05). Change the word on the beat.
3. **Typewriter with caret inside a UI prompt box.** Cut away before the prompt finishes (#05, #12, #09). A typed prompt typically shows about 12–20 characters before the cut.
4. **Condensed caps trailer titles** (#12). Two-line headline, stretch-in or squash-in, about 1.5–2 s hold, then cut to proof footage.
5. **Counters and stats.** Numbers roll up with ease-out over about 1–1.5 s (#13 "55+ → 150+", #11 usage meter to 30,000, #08 "2x / 3x" cards held about 1 s each).
6. **Supers in live action.** Tiny, centred or lower, fade in and out (#03, #09). Never animated flashily.
7. **Lower thirds (event recaps).** Name, thin vertical rule, title; bottom-left; white thin sans (#10, #11).
8. **Bouncy brand type** (playful brands): per-letter overshoot and stagger (#15 Duolingo, #22 "TIME OFF").
