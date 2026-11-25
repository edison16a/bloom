# P2: High-craft edited YouTube (real people + heavy motion graphics)

25 videos measured with `tools/measure.py`. The video list is in `.list.txt`. Every folder was checked after the shared-temp-dir incident: each has `metrics.json` and all three sheets. Folder 15 was fully re-measured. Downloads ran without subtitles (YouTube returned 429 on subtitle requests), so `subtitle_wpm_estimate` is null everywhere.

The brief asks for 2023–2026 videos. Five picks are older, but they are kept as style references because the channel's house style is unchanged today: 03 Vox (2021), 05 HAI (2021), 09 Johnny Harris (2019), 17 MrBeast (2020) and 21 PolyMatter (2017). Two Wendover picks from 2016–17 were dropped and replaced with 2026 uploads (06, 07).

## Measurement caveats (read before using the numbers)
- **Cut detection misses graphics-driven edits.** `scdet` at threshold 12 does not see slide-pushes, map moves, zooms or pop-ons inside one continuous graphic. HAI (04: 1.5 cpm), Kurzgesagt (20: 2.8) and PolyMatter (21: 1.7) look far busier on the sheets than these numbers say. Read their cpm as "hard cuts between different pictures", not "visual changes".
- **Video 17 (MrBeast 2020) cut metrics are broken.** The median shot is 0.03 s, which means consecutive-frame detections. This is 60 fps footage with a huge on-screen countdown timer that changes every second, plus constant whip pans. The cpm of 81.8 is not real and is excluded from the stats.
- **Video 04 (HAI)** has false cuts from flying-money particle overlays in its densest window. Its transition sheet shows overlay animation, not cuts.
- **`hits_per_min` is saturated by narration.** Most videos land at 50–79 hits/min whatever their style. The stored hit list is capped at 200, so any first-3-minute figure ≥ 66.7 means "capped". The detector picks up consonant transients in a voice-over, so it is **not** a usable SFX-density measure for VO-led content. It only differs for low-VO vlogs (16 MrBeast: 23/min, 23 Nick Shirley: 35/min).
- **`cuts_with_hit_share` sits at or below chance in every video.** Chance = 1 − exp(−hpm/60 × 0.24 s) ≈ 0.09–0.27; the measured share is 0.00–0.19. Inference: either the cut-synced whooshes are mixed under the VO, or the detector can't separate them from speech. These numbers cannot show "every cut has a whoosh". The sheets show the visual events; the SFX claims below are inferred from them.
- **`speech_share` (0.18–0.49) is far too low** for videos that are narrated almost wall to wall. The detector undercounts when music sits under the VO. Use it for relative comparison only.
- **`beat_strength` is ≤ 1.76 everywhere** and above 1.6 in only 4 videos. The music is a bed under the VO, not a beat to cut to (see below).
- **Several `biggest_lifts` values of 150–173 dB** (09, 10, 11, 23) are artifacts from digital silence (log of ~0). Ignore them.
- **HAI and Wendover measure −23.5 to −24.7 LUFS with true peak −5 to −10 dBTP.** Every other channel measures −12 to −22. This may be how those channels master, or it may be the specific audio format served. Treat it as unverified.

## 1. Table

| # | Title / channel / URL | Len | Cuts/min (first 3 min) | Median shot s | BPM (strength) | LUFS | Hits/min | % cuts on beat | % cuts w/ hit | Speech | Dominant flow | Distinctive |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 01 | 2025, in 8 minutes / Vox / [3tEn0hfVkeA](https://www.youtube.com/watch?v=3tEn0hfVkeA) | 8:35 | 41.0 (51.0) | 1.13 | 81.5 (1.27) | −14.2 | 55.4 | n/a (weak beat) | 13 | 0.23 | ←→ pans, 36% static | Archival news montage with no host; a search bar types "What happened in 2025?" over a 0.4 s-shot montage |
| 02 | Why the era of cheap streaming is over / Vox / [ObL2xm5NrCk](https://www.youtube.com/watch?v=ObL2xm5NrCk) | 6:40 | 14.5 (18.0) | 3.38 | 108 (1.41) | −15.5 | 55.0 | 18 | 10 | 0.30 | static 61% | Host on couch + flat 2D icon diagrams + highlighted article cards + logo stings |
| 03 | Why the US government is always shutting down / Vox / [Kdv07eIC8Wg](https://www.youtube.com/watch?v=Kdv07eIC8Wg) | 8:02 | 8.3 (12.0) | 4.42 | 107 (1.36) | −17.9 | 53.2 | 16 | 13 | 0.41 | static 74% | Zoom-call interviews in coloured frames; a yellow year tag rolls odometer-style over news clips |
| 04 | The Loophole That Makes Kalshi Legal / Half as Interesting / [lixwB5gYDbA](https://www.youtube.com/watch?v=lixwB5gYDbA) | 8:15 | 1.5* (2.0*) | 8.03* | 102 (1.64) | −23.7 | 73.2 | 42 | 17 | 0.37 | ← and ↑ slides | Continuous meme-collage: masked host cut-out over B-roll, yellow arrows, rack-focus pops (*cuts undercounted) |
| 05 | Why Sweden Is Moving Its Northernmost Town / HAI / [osB4AtMDLR0](https://www.youtube.com/watch?v=osB4AtMDLR0) | 5:49 | 9.0 (5.7*) | 1.90 | 125 (1.73) | −24.3 | 77.1 | 21 | 13 | 0.27 | ↑ and → | Satellite map + reaction-meme inserts + big yellow word cards ("KIRUNA", "WET") |
| 06 | Why American Houses Are So Flimsy / Wendover / [VuliaG_-uao](https://www.youtube.com/watch?v=VuliaG_-uao) | 14:07 | 11.9 (11.0) | 2.60 | 70 (1.34) | −24.7 | 70.3 | 15 | 4 | 0.34 | static 63%, → drifts | Navy blueprint panels build a 2D house layer by layer, intercut with construction B-roll |
| 07 | Why Fast Food Got So Expensive / Wendover / [hIOW2HKgzPk](https://www.youtube.com/watch?v=hIOW2HKgzPk) | 19:21 | 9.4 (9.7) | 3.22 | 81 (1.17) | −23.5 | 79.2 | n/a | 2 | 0.32 | Z+ push-ins, ↑ | Cross-dissolve into a satellite map push-in with logo pins; documents on a wooden desk |
| 08 | Why everyone's mad about China's new map / Johnny Harris / [WpQQOQ__1ok](https://www.youtube.com/watch?v=WpQQOQ__1ok) | 16:28 | 12.5 (31.0) | 1.58 | 75.5 (1.23) | −20.1 | 60.0 | n/a | 9 | 0.28 | static 70% | Red letter-by-letter date title on a tilted 3D screen with depth of field; textured paper maps with glowing borders |
| 09 | Why Britain is the Center of the World / Johnny Harris / [g52A2CPEi4A](https://www.youtube.com/watch?v=g52A2CPEi4A) | 15:10 | 9.6 (16.0) | 1.62 | 72 (1.46) | −20.0 | 59.5 | 16 | 16 | 0.33 | ←→ | Opens with 0.1–0.2 s old-map flicker montage with RGB split, then flashes to gray and jump-cuts to the host |
| 10 | Can My Dog Live 80 Years? / Cleo Abram / [fundOLJehWA](https://www.youtube.com/watch?v=fundOLJehWA) | 8:47 | 16.4 (17.0) | 2.42 | 90 (1.76) | −22.4 | 51.1 | 15 | 15 | 0.22 | ←→ | "HUGE*" kinetic-type sting; extruded callout tags ("THOR"); flat chart cards in brand lime/blue |
| 11 | The Two Opposite Futures of Self-Driving Cars / Cleo Abram / [Hr6GPYCHTfA](https://www.youtube.com/watch?v=Hr6GPYCHTfA) | 12:24 | 20.4 (26.0) | 1.79 | 105 (1.42) | −16.2 | 62.2 | 26 | 9 | 0.19 | ←→ 37% | Hands enter frame before the host; a gradient 0–5 "levels" timeline recurs as a navigation device |
| 12 | Sony WH-1000XM6 Review / MKBHD / [XbXXKhfvSF0](https://www.youtube.com/watch?v=XbXXKhfvSF0) | 9:17 | 7.5 (9.7) | 5.44 | 120 (1.30) | −16.4 | 52.6 | n/a | 14 | 0.40 | static 77% | 2 s logo sting (concentric rectangles collapse, then a diagonal slit-wipe into the A-roll); minimal white spec labels |
| 13 | AirPods Pro 3 Review / MKBHD / [GB0b6KFZVq0](https://www.youtube.com/watch?v=GB0b6KFZVq0) | 11:50 | 6.4 (8.0) | 5.67 | 79 (1.33) | −17.4 | 55.4 | 18 | 8 | 0.41 | static 76% | Same sting; macro product B-roll; "$249" large white numeral beside the head |
| 14 | iPhone 17 Pro vs S25 Ultra Camera / Mrwhosetheboss / [IYtDS27znnM](https://www.youtube.com/watch?v=IYtDS27znnM) | 11:28 | 6.8 (6.0) | 5.73 | 110.5 (1.27) | −14.7 | 74.6 | n/a | 5 | 0.32 | static 79% | Split-screen comparison template (orange vs blue frames, section tag top-centre) |
| 15 | Why is THIS the Best Selling Phone? / Mrwhosetheboss / [eVXfsNS-V_I](https://www.youtube.com/watch?v=eVXfsNS-V_I) | 14:12 | 13.5 (14.0) | 3.77 | 70 (1.22) | −13.2 | 75.9 | n/a | 5 | 0.36 | ←→ 29% | Huge 3D-bevel words placed behind or next to the host ("30 MILLION", "2 ways"); host cut-out on a planet |
| 16 | I Hunted 100 People! / MrBeast / [65fN_OUawjk](https://www.youtube.com/watch?v=65fN_OUawjk) | 12:02 | 35.3 (34.0) | 1.38 | 125 (1.20) | −12.2 | 23.0 | n/a | 10 | 0.27 | ← 30% → 25%, only 17% static | Location tag top-left on every shot; italic caption punchlines; drone fly-in plus time-lapse crowd fill |
| 17 | $1,000,000 But ONLY 1 Minute / MrBeast / [LeYsRMZFUq0](https://www.youtube.com/watch?v=LeYsRMZFUq0) | 14:18 | broken (see caveats) | broken | 135 (1.26) | −13.9 | 31.8 | n/a | 6 | 0.40 | ←→ 51% | Giant countdown timer bottom-left all the time; handheld whip-chases |
| 18 | My first World Cup game / ryan trahan / [kM2Ow8XEOjs](https://www.youtube.com/watch?v=kM2Ow8XEOjs) | 12:43 | 13.7 (21.0) | 3.24 | 117.5 (1.38) | −14.6 | 40.5 | 26 | 13 | 0.29 | → 18% | Vlog; flat flag-scoreboard cards (0 : 0), animated map route, black "GOAL" card, B&W freeze |
| 19 | The Rainiest Place On Earth / Veritasium / [lGJEihgN4OU](https://www.youtube.com/watch?v=lGJEihgN4OU) | 15:01 | 11.7 (17.7) | 2.86 | 83 (1.26) | −11.9 | 50.3 | n/a | 7 | 0.31 | ←→ 31% | Cinematic cold open in a rain chamber; thin centred measurement text ("15 mm – 300 mm/h") |
| 20 | This Is the Scariest Place in The Universe / Kurzgesagt / [yDAAlojz8NU](https://www.youtube.com/watch?v=yDAAlojz8NU) | 9:13 | 2.8* (2.3*) | 12.57* | 83 (1.25) | −15.2 | 72.7 | n/a | 4 | 0.30 | Z± 17% (continuous zooms) | Pure animation; one continuous scale-zoom camera; small boxed caps labels |
| 21 | The Grand Theory of Apple / PolyMatter / [zO0b-l-u7Yk](https://www.youtube.com/watch?v=zO0b-l-u7Yk) | 8:20 | 1.7* (1.7*) | 23.97* | 128 (1.65) | −18.6 | 59.2 | 29 | 0 | 0.49 | ↑ slides | Flat vector explainer; scene pushes up from below; text appears out of a smoke puff |
| 22 | We're saying goodbye to Seek Discomfort / Yes Theory / [BTH-ZUrj6gQ](https://www.youtube.com/watch?v=BTH-ZUrj6gQ) | 9:59 | 25.2 (43.7) | 1.13 | 85 (1.28) | −18.1 | 49.5 | n/a | 19 | 0.29 | ←→ | Two-shot sit-down intercut with 1–2-frame UGC photo-stack montages (tilted photos on black) |
| 23 | Inside Trump's White House in 2025 / Nick Shirley / [Q--Ysfhn4Lw](https://www.youtube.com/watch?v=Q--Ysfhn4Lw) | 22:37 | 8.0 (10.3) | 3.14 | 83 (1.16) | −19.5 | 34.9 | n/a | 4 | 0.34 | ←→ handheld | "Coming up..." teaser cold open; burned-in white captions with speaker labels; almost no graphics |
| 24 | How This Telescope Searches For Aliens / Cleo Abram / [ampB1laCWF4](https://www.youtube.com/watch?v=ampB1laCWF4) | 5:14 | 17.0 (18.3) | 2.77 | 90 (1.55) | −21.1 | 50.8 | 18 | 17 | 0.18 | static 59% | 3D-tilted sky-survey map; lime/coral pill labels ("Nitrogen 78%"); nature B-roll rapid list |
| 25 | INFLATION, Explained in 6 Minutes / Johnny Harris / [zIbNJCSCEjk](https://www.youtube.com/watch?v=zIbNJCSCEjk) | 8:44 | 16.6 (19.0) | 1.08 | 139 (1.55) | −16.5 | 54.9 | 17 | 17 | 0.39 | ←→ | 24 cuts in the first 4.25 s (4-frame cuts at 24 fps); red running timer HUD; paper-cutout collage graphics |

`*` = undercounted because the edit is graphic-driven (see caveats). Cuts on beat is "n/a" where beat_strength ≤ 1.3 (the tool doesn't compute it below that).

## 2. Per-video notes

**01 Vox, 2025 in 8 min.**
- Hook: a crowd aerial with a white search bar centred on screen, typing "What happened in 2025?" a few letters per shot. Cuts every 0.2–0.7 s underneath (11 cuts in the first 5.3 s).
- Structure: a 0–30 s sizzle montage (68 cpm), then month by month at about 40–47 cpm through Q1–Q2, slowing to 31 cpm in Q4, then an end-card at about 8:20.
- Text: the search-bar type-on is the only custom graphic. Otherwise the sources' own lower thirds, chyrons and news-article cards with highlighted phrases carry the info, plus a "WE ARE..." word split and an obituary card ("VAL KILMER 1959–2025", thin white serif on a dark portrait).
- Sound: the energy jumps +8 dB at 3 s (−14 → −6.6 dB RMS). Inference: a music hit lands with the montage start. The largest lift (+40 dB at 76 s) comes out of a near-silence beat, a "drop the music, then hit" move.
- Transitions: hard cuts only. Flow is mixed ←/→ (41% of seconds pan); source-camera motion is left as is, with no imposed direction logic.

**02 Vox, cheap streaming.**
- Hook: a macro of a phone on a wooden table in warm window light. The phone lights up, then a match cut to a laptop screen, then the "UPCOMING DISNEY+ PRICE CHANGE" email in close-up with a yellow underline drawn on the price.
- Structure: a host on the couch (talking head) alternates with 2D grey-icon diagrams (subscriber figures with $ badges, Netflix tree branching), a dark-mode bar chart (navy/yellow), Bloomberg/Verge screenshots with yellow highlighter, and a Gantt-style churn chart building row by row. The densest stretch is the streaming-logo stings (Disney+ → Max → Hulu → Peacock → Paramount+, 3–6 frames each at 10 fps, i.e. 0.3–0.6 s).
- Text: brand serif chapter titles ("Subscribers"). Chart labels type on. Highlights wipe left to right.
- Music: 108 BPM bed (strength 1.41). The largest lift is +17.7 dB at 178 s, entering a new chapter.
- Flow: 61% static. Movement comes from slow lateral slides of 2D layers.

**03 Vox, government shutdown.**
- Hook: a trash-can close-up with an overflowing recycle bin, then Zoom interviews framed in red/blue colour blocks with yellow name tags (black bold name + small grey role).
- Graphic system: off-white paper; ink-line Capitol drawings; red circles for agencies, sized by employees; dark bar charts in red; scanned documents with yellow highlighter.
- Year counter: news clips framed with a thin border on a dark background, with a big yellow-box year label ("2017"…"2020"). The year changes by a vertical odometer roll in 1 frame at 10 fps, i.e. ≤ 3 frames at 24 fps, timed on the clip change.
- Pacing: 14.9 cpm in Q1, then 5–7. The front-loading is clear. Lifts +21–25 dB at 98 s and 183 s mark chapter turns (inferred music re-entry after a silence).

**04 Half as Interesting, Kalshi.**
- Hook: a Kalshi subway ad on a saturated orange background.
- Style: a constant meme-collage over a single "plate". The host is a hoodie figure with a round "H" logo for a face, cut out and slid in from frame edges. Screenshots sit at a tilt. Yellow outlined arrows point at UI. Sitcom-reaction inserts ("We were on a break!").
- Transition sheet: the background rack-focuses (blurs) at the moment the H-host pops in from bottom right (about 3 frames at 10 fps). This is a "focus pull to the presenter" move.
- Sound: strongest beat of the batch along with 05 (1.64) and 42% of the few detected cuts land on beat. Inference: HAI cuts its picture changes to the music grid more than others do.
- Flow: ↑ dominant (graphic elements slide up). Few hard cuts, so the cpm is meaningless.

**05 Half as Interesting, Sweden town.**
- Hook: an aerial town shot with a numbered list overlay ("World's Kiruna-est Towns: 1. Kiruna, Sweden...") in white bold sans with a soft shadow.
- Style: satellite map with dashed boundary and pin labels (white boxes, black text); a yellow 3D word card ("KIRUNA", "WET") slammed onto footage; a game-show "HOW MANY WORDS WILL SAM MISPRONOUNCE?" card; pop-culture reaction stills.
- Music: 125 BPM, strength 1.73, the clearest beat in the batch.
- The densest-cuts window is the Curiosity Stream ad read (about 0.5–1 s shots of stock nature). Sponsor segments are cut faster than the content.

**06 Wendover, flimsy houses (2026).**
- Hook: a navy blueprint panel with a white 2D house, a thin border inset and a channel bug top-left. The house builds piece by piece.
- Structure: the blueprint panel recurs as a chapter "home base" (walls → roof truss → layers). Construction B-roll in 2–4 s shots sits between. Paper drawings lie on OSB board with a slow push, and a split-screen climate chart compares Seattle and London.
- Text: very little; thin white sans labels. The rhythm comes from B-roll, not type.
- Sound: low-level (−24.7 LUFS) with a 70 BPM low-strength bed. The dense window is the Jet Lag/Nebula ad.

**07 Wendover, fast food (2026).**
- Hook: a fade up from black on a storm sky with a Mobil price pylon. A 1-second cross-dissolve becomes a satellite map pushing in (Z+) onto a McDonald's lot.
- Recurring devices: satellite push-ins with white rounded pins holding brand logos; press releases and menus lying on a dark wooden desk with soft drop shadows (paper-on-desk parallax); kiosk mock-ups with price callouts ("$6.49"); icon trios on navy.
- Flow: the most Z+ (zoom-in) seconds of any live-action pick (50). The map language is "dive in". The sustained ↑ run at about 46–55 s is a tilt-up reveal.
- 2% of cuts carry a detected transient. This is consistent with music-bed-plus-VO mixing, not hit-per-cut.

**08 Johnny Harris, China map.**
- Hook: "AUGUST 28TH 2023" in red caps with glow, typed letter by letter over about 1.2 s (about 2 letters per 5 fps frame), on a tilted off-white screen with shallow depth of field. The camera drifts up into a Chinese government website, then the map is pulled out as a flat card.
- Structure: CCTV news clips, the host in a dark moody room (warm key, plants), then a sponsor in the first minute. 31 cpm in the first 3 min against 12.5 overall: clearly front-loaded.
- Map language: paper-textured maps; contested regions in saturated orange/yellow with a glowing edge; place-name tags in black boxes; a vignette and film grain throughout. The densest window is the behind-the-scenes After Effects segment: red flashes, glitch frames, 3D-tilted map layers, layer colours flipping (white → red → cyan) about every 2–3 frames.
- Sound: weak beat (1.23). Hits are mostly VO.

**09 Johnny Harris, Britain/time zones (2019).**
- Hook: 12 antique maps in about 1.2 s, each 1–3 frames at 10 fps, with RGB-split/chromatic offset and a pulsing vignette. Then a gray flash frame, then the host holding a red jacket (comic jump cut wide → close → wide).
- Sound: RMS jumps from −25 dB to −10 dB at 14 s and again at 26 s. Inference: music stabs on the title beats.
- Graphics: a vintage map with a big condensed white word ("LINES"); a longitude grid with orange/green degree labels that slides horizontally; GMT offset labels; big "4:00AM MAY 29" clock labels with neon-yellow date-line highlights.
- Pacing: 16.6 / 15.3 cpm in the first half, then 3.2 / 3.4 in the second half (long talk and sponsor).

**10 Cleo Abram, dog 80 years.**
- Hook: a handheld walk-up with her dog in a sunlit garden. A "THOR" name callout pops on: a lime tag with black text, a blue 3D extruded shadow and a pointer notch, appearing within 1 frame at 5 fps.
- The "HUGE*" title sting is the most energetic motion graphic in the batch. The word repeats 5× and grows, letters stretch into vertical stripes, it resolves to "HUGE*", then an asterisk pattern scatters on blue, then "*if true". That is roughly 2.5 s with a style change every 1–2 frames.
- Charts: flat lime/blue/maroon backgrounds; a line chart with a paw marker that rides the line; stopwatch icons per dog breed with hands spinning at different rates.
- Audio: −22.4 LUFS with a very wide LRA of 12.5. A quiet, intimate VO mix with music swells.

**11 Cleo Abram, self-driving.**
- Hook: two hands sweep in from the frame edges in a dark office (a "two futures" gesture), then she leans in, then a YouTube player window.
- Recurring navigation device: a red→blue gradient bar labelled 0–5 with a lime "You are here" arrow that steps along; a split "Manual vs. Automated" pill. Vision chapters use big lime outlined titles ("Vision 1: Autonomous trucks").
- B-roll: night car POV, a car-roof rig time-lapse cut every 0.3–0.5 s in the densest window (a city montage carried by camera motion).
- Pacing: 25.5 cpm in Q1 and about 18–19 after. Flow is 37% horizontal (car motion), and the direction is kept → for long driving runs.

**12 / 13 MKBHD.**
- Opening sting (identical in both): black, then a white diagonal slab, then concentric rectangles collapsing inward (about 6 frames at 10 fps), then a white flash with a red parallelogram outline snapping onto the black logo, holding about 1 s. A thin diagonal slit wipe (about 3 frames) then opens into the A-roll. The A-roll starts mid-sentence.
- Body: locked-off medium A-roll (77% static seconds) in 5–6 s median shots, intercut with macro product B-roll on a blue table and walking shots in the studio.
- Text: white bold condensed caps, top-left or top-right ("12 MICROPHONES / SONY QN3 CHIP", "WH1000XM5"), wiped on. The price "$449"/"$249" is a large bold white numeral beside his head.
- Sound: 52–55 hits/min (VO-dominated). The −7 dB RMS in the first 2 s is the sting's audio hit.

**14 Mrwhosetheboss, camera comparison.**
- Template: a split-screen of two rounded portrait frames with drop shadow on a dark texture split diagonally into orange (iPhone) and blue (Samsung). Italic bold device labels sit on a white bar under each frame, with a small white section tag top-centre ("FRONT CAMERA", "ZOOM", "NIGHT"). A speaker icon flags which side's audio is playing.
- Host bits: a full-frame studio piece with a big white italic caps label "S25 ULTRA🔊" top-left.
- Pacing is slow (6.8 cpm) because each comparison holds 5–6 s. Energy comes from the template switching sections. Flow is 79% static.

**15 Mrwhosetheboss, best-selling phone.**
- Kinetic type: huge 3D-bevelled metallic/white words placed in the room behind or beside the host, often partly occluded by him ("ACHIEVEMENT", "30 MILLION", "EVERY", "2 ways", "$$$", "5000 mAh" on a phone render).
- Composites: the host cut out over product renders and a circular planet frame; a Samsung brand-film insert with a "SOURCE:" tag top-left.
- Pacing: 13.5 cpm, steady across quarters. Flow is 52% static with handheld drift.
- Loud master (−13.2 LUFS).

**16 MrBeast, Hunted 100 People.**
- Hook: a drone flies down into a mall atrium onto an empty red stage. A time-lapse fills it with 100 people in blue tracksuits within about 2 s. Green "$10,000" in a fat italic with black outline sits top-left, then a whip into the next shot.
- Constant overlays: an icon plus italic caps location tag top-left on every shot ("LEGOLAND", "WATER PARK"); a top-right counter (×98, ×97) that drops each elimination; italic yellow/white captions with dark stroke for punchlines ("1 DOWN... 99 TO GO", "YA BOY'S EXHAUSTED"); a giant red-carpet "PEOPLE REMAINING 99" card.
- Pacing: 34–41 cpm in every quarter, with no sag. Flow is only 17% static: handheld and gimbal movement all the way through, with chase shots moving ← and →.
- Loudest live-action mix (−12.2 LUFS). Only 23 hits/min: speech is sparser and less transient than VO.

**17 MrBeast, $1M in 1 minute (2020).** A big white countdown sits bottom-left the whole time ("0:58" → "0:01"). The chases are handheld with whip pans and constant motion blur (51% of seconds are ←/→ pans). Captions are italic caps with heavy shadow. A receipt-style price list ("MASSAGE PAD – $100...") stacks line by line. Cut metrics unusable (see caveats).

**18 Ryan Trahan, World Cup.**
- Hook: a selfie talk in a classroom, then a 2.4 s cutaway of a stadium crowd erupting (whip-pan handheld with a broadcast score bug), then back to the talk.
- Graphics are sparse but punctuating: a two-colour scoreboard card (yellow with the Brazil flag / white with the Japan flag, giant "0 : 0" in a rounded mono face) used as a chapter beat; a map-route line drawing from city to stadium; a black "GOAL" card in white sans; a B&W freeze with "GOAL" typing in.
- Pacing: 20.4 cpm in Q1, then 9–13. Cuts on beat 26%, among the higher values.

**19 Veritasium, rainiest place.**
- Hook: a cinematic rain-chamber shot (spotlight cone, a figure in a raincoat walking into dense rain), cut to typhoon news footage, then measurement text centred in thin white sans ("3 m (10 ft)", "15 mm – 300 mm/h") over the rain.
- Body: the host on a pier at golden hour; a simple 2D drop animation (blue/red arrows on a droplet); an interview Zoom with a white name label; lab experiments with small source credits ("Credit | ...") top-left.
- Pacing: 17.7 cpm in the first 3 min, 11.7 overall. Loudest master of the batch (−11.9 LUFS, true peak +1.0).

**20 Kurzgesagt, scariest place (2026).** One continuous camera dives through the cosmic web (Z± is 17% of seconds, the highest in the batch). Labels are tiny spaced caps in thin rectangle boxes ("LOCAL GROUP", "VIRGO SUPERCLUSTER"), and the palette is monochrome teal-grey. Transitions are zoom-throughs, not cuts, so cpm is meaningless. It is included as the animation-only pole of the Kurzgesagt hybrid. The sponsor/merch section at the end switches to live-action hand B-roll.

**21 PolyMatter, Apple (2017).** A flat vector explainer at 60 fps. The transition sheet shows a scene sliding up from below with ease-out (about 6 frames), then a stage curtain, then "iPod / #1 Best Selling" materialising out of a smoke-puff particle with a magic wand. Labels are coloured pill tags (green/purple/pink) in white bold sans. The 128 BPM bed has strength 1.65. Included as a reference for 2D pacing, though it is older.

**22 Yes Theory, Seek Discomfort.**
- Hook: a plain two-shot of the founders talking to camera in a garden. The first cut comes at 37 s. The announcement format leans on sincerity, not motion.
- Then a heritage montage: archive photos and video at about 0.5 s; a "2018" big white bold number over footage; "500,000+ Orders"; a tattoo montage of about 30 fan photos at 1–2 frames each (0.1–0.2 s), each tilted at a random angle on black like a stack of polaroids. This drives the first-3-min average to 43.7 cpm despite the static opening.
- Pacing collapses later (41 → 9 cpm by Q4), back to the sit-down.

**23 Nick Shirley, White House.**
- Hook: a "Coming up..." teaser (small yellow text top-left) using the best Oval Office moments, with burned-in white bold subtitles and a dark shadow, including speaker labels ("Trump:", "CNN:"). Then a stand-up at the gate in a red tie.
- Mostly 3–4 s handheld shots with natural sound. Graphics are almost nil: an archival AP clip and an "Inside Edition" photo insert.
- Pacing: 16.8 cpm in Q1, then 8.8 → 3.7 → 2.5. Long uncut walk-and-talks later. Hits are only 34.9/min, which is the reference for non-music, low-SFX vlogging.

**24 Cleo Abram, telescope.**
- Hook: a JWST deep field, a CNN chyron, then a "picture-in-frame" card (photo on a coloured backdrop with offset lime/red squares) and data plots on navy.
- A 3D-tilted sky-survey map with points of light that the camera dollies across. The host sits at a desk in front of bookshelves, warm.
- Dense window: a rapid nature-B-roll list (jellyfish → grass → egret → squirrel → wolf → owl → Earth at night) at about 0.3–0.6 s each, under the VO line about life. Pill labels ("Nitrogen: 78%" lime, "Oxygen: 21%" coral).

**25 Johnny Harris, inflation.**
- Hook: 24 cuts in 4.25 s (0.13–0.17 s apart, i.e. 3–4 frames) of currency macro shots with a stock-ticker line overlay, a glitch/data-mosh frame, then Wall Street. A handwritten white title "Econ To the death" follows.
- HUD: a red digital running timer top-right ("00:00:00"), counting the promised 6 minutes. Graphics are paper-cutout collage (B&W cut-out people and objects on cream with orange accents, price tags, hanging labels on strings, a puppet-string Fed chair). The host sits in a dark room with a warm practical light.
- Music: 139 BPM at strength 1.55. It is the highest-tempo VO piece in the batch, and its first-3-min cpm (19) exceeds its overall cpm (16.6).

## 3. Batch synthesis

### Typical ranges (24 valid videos; 17 excluded from cut stats)
- **Cuts/min, whole video:** median 11.8, IQR about 8.0–16.6.
- **Cuts/min, first 3 min:** median 15.0, IQR 9.3–19.5.
- **Cuts/min, first 30 s:** median 16.
- **Median shot:** median 2.86 s, IQR 1.62–4.42 s.
  - MKBHD and Mrwhosetheboss sit at 5.4–5.7 s.
  - MrBeast, Vox montage, Yes Theory and Johnny Harris sit at 1.1–1.6 s.
- **BPM:** median 90, IQR 81.5–117.5. **Beat strength:** median 1.33, IQR 1.26–1.46. Only 4 of 25 are above 1.6, and those are HAI and the stylised explainers.
- **LUFS:** median −17.4, IQR −20.1 to −14.7.
  - Loudest: Veritasium −11.9, MrBeast −12.2, Mrwhosetheboss −13.2.
  - Quietest: HAI and Wendover at −23 to −25 (unverified, see caveats).
- **Hits/min:** median 55, IQR 51–70. Not meaningful as SFX density (VO-saturated). Only the MrBeast and Nick Shirley vlogs (23–35) differ.
