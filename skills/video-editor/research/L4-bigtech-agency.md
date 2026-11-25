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
