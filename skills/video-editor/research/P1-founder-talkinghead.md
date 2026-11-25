# P1 — Founder / CEO / creator talking-head edits (25 videos)

Category: professionally edited real-person videos where a founder, CEO or creator speaks to camera and the edit adds kinetic text, SFX, punch-ins, B-roll and images. Mix: 17 horizontal long-form (1.7–8.2 min), 6 vertical Shorts (25–90 s), 2 brand/founder films (a16z, Kimi). All measured with `tools/measure.py`; every folder has `metrics.json`, 3 sheets and `shots/`. Eight downloads first failed on YouTube subtitle 429s and were re-run sequentially until they succeeded.

## Measurement caveats (read before using the numbers)
- **Cut counts are undercounts for same-setup jump cuts.** `scdet` at threshold 12 misses cuts between near-identical frames (same speaker, same background). Example: #07 YC "50 founders" reads 2.8 cuts/min, but the overview sheet shows about 40 different founder pairs in 4 min, and the near-identical #08 reads 16.3. Treat talking-head cuts/min as a floor. Real jump-cut rates for #01, #02, #03, #07, #09, #11, #15, #18, #20, #25 are probably higher.
- **`hits_per_min` fires on speech consonants, not only on SFX.** #25 Dan Koe Short (plain voice, no visible SFX) scores 94.5 hits/min, the highest in the batch. In speech-led videos the hit count is mostly plosives. Use it as a ceiling, not as an SFX count.
- **Chance baselines.** At about 57 hits/min, a ±0.12 s window lands on a hit by chance about 23% of the time, so `cuts_with_hit_share` is meaningful only well above ~0.25. At 70–90 BPM, a ±0.06 s window around a beat is about 15–17% by chance, so `cuts_on_beat_share` is meaningful only well above ~0.2.
- **`speech_share` reads low** (0.10–0.51) even for wall-to-wall talking. It looks like a strict detector. Use it relatively (a16z montage at 0.10 vs Dan Koe at 0.51), not absolutely.
- **`subtitle_wpm_estimate` is broken** (values of 222–416 wpm; auto-subs repeat more than 2×). Ignored.
- #14 `biggest_lifts` of +101 dB at t=1 s is digital silence at the head, not a musical lift.
- Shorts were downloaded at 360×640, so the type on them is soft in the sheets.

## 1. Table

| # | Title / channel / URL | Len | Cuts/min | Med shot s | BPM (strength) | LUFS | Hits/min | % cuts on beat | % cuts w/ hit | Speech | Dominant flow | Distinctive |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 01 | How to Create Your Ideal Life in 7 Minutes / Ali Abdaal / youtu.be/iuHuxX22OOQ | 7:39 | 4.6* | 9.32 | 77 (1.28 weak) | -19.7 | 59.4 | n/a | 14% | .37 | static 87% | screenshot inserts with highlighter boxes, pill call-outs, mono pronunciation text |
| 02 | The Fastest Way To Change Your Life / Dan Koe / youtu.be/CzSmZvTYvME | 6:11 | 5.3* | 7.17 | 99 (1.41) | -18.5 | 69.2 | 15% | 3% | .44 | static 79% | essay cards: small white sans on pure black, B&W stock B-roll |
| 03 | How To Get Ahead Of 99% Of People / Dan Koe / youtu.be/d5RKW3WSEb0 | 8:11 | 2.7* | 4.80 | 90 (1.33) | -21.1 | 60.9 | 27% | 14% | .51 | static 93% | near-unedited A-cam, rare cinematic B-roll |
| 04 | How I Built My Dream Life (in 5 min) / Leila Hormozi / youtu.be/qE6f9mvLwk4 | 4:57 | 24.5 | 1.65 | 70.5 (1.53) | -23.1 | 68.2 | 10% | 19% | .22 | static 51%, ←→ 28% | B-roll in rounded-corner card on black; teal light-leak flash; kinetic word maps |
| 05 | How to Grow an Audience if You Have 0 Followers / Alex Hormozi / youtu.be/7ITff1fIbSc | 6:53 | 11.5 | 3.90 | 75 (1.55) | -21.9 | 43.9 | 11% | 10% | .34 | static 70%, Z± 10% | yellow/white italic word-pop captions, infinite-grid zoom-out, radial blur exits |
| 06 | I can't hide this anymore. / Alex Hormozi / youtu.be/Z5rKn1ZIp3A | 1:53 | 45.9 | 1.00 | 88 (1.68) | -28.3 | 49.1 | 16% | 26% | .26 | →28% ←20% | show trailer: brush-script name, arrow call-outs, chrome 3D title, big $ numbers |
| 07 | 50 Founders Share How They Got Their First Customers / Y Combinator / youtu.be/NZp5j5hvn9I | 3:59 | 2.8 (broken, see caveats) | 8.11 | 70 (2.18) | -19.6 | 52.9 | 0% | 18% | .26 | static 71% | orange seamless, word-by-word question type-on, company label bottom-right |
| 08 | 60 Startup Founders Share How They Met Their Co-Founder / Y Combinator / youtu.be/IyhLAbqDw0k | 3:53 | 16.3 | 2.13 | 116 (1.55) | -18.3 | 55.7 | 22% | 22% | .30 | static 68% | big counter numbers over tinted frame, orange panel wipe-up, slate bloopers |
| 09 | Applying to YC? 3 tips / Garry Tan / youtu.be/4wbCVN1yLyA | 7:39 | 2.4* | 4.00 | 80 (2.15) | -15.8 | 55.9 | 17% | 6% | .23 | static 93% | persistent lower-left chapter text ("Tip #1 — …"), 2019 vlog style |
| 10 | It's Time To Build / a16z / youtu.be/M9VKnPMs6Rw | 1:46 | 58.5 | 0.75 | 70 (1.81) | -18.5 | 27.3 | 14% | 14% | .10 | ←29% →20% | VO manifesto: CG push-through-page opener, 2–3-frame patent strobe, rolling counters |
| 11 | From ZERO to $200 BILLION (Rizzle) / Lenny's Clips / youtu.be/uiPARHxIQsM | 3:18 | 4.9* | 9.83 | 71.5 (1.58) | -15.4 | 50.7 | 25% | 0% | .33 | static 90% | podcast in rounded frame on light bg; diagonal-stripe wipe (lower craft, third-party) |
| 12 | Introducing Hack Pack / Mark Rober (CrunchLabs) / youtu.be/TtdOdUi9b_s | 4:33 | 44.2 | 1.04 | 96 (1.90) | -11.8 | 62.6 | 20% | 17% | .37 | →26% ←20% | founder product launch: grid-mat hero shots, page-flip montage, UI overlay, QR CTA |
| 13 | A 5 Minute Plea To Do / GaryVee / youtu.be/OIO0nMY4X3U | 4:52 | 33.3 | 0.92 | 130 (2.23) | -16.5 | 36.8 | 51% | 10% | .18 | →28% ←25% | selfie VO over vlog B-roll; Q3 montage at 79.7 cuts/min on beat; black end cards |
| 14 | Codie Sanchez – Origin Story / Codie Sanchez / youtu.be/2_8oqoirNHM | 3:05 | 15.9 | 3.15 | 120 (2.94) | -16.5 | 56.7 | 45% | 24% | .17 | static 62% | 2016 speaker sizzle: letterbox, serif quote cards, cutting speeds up Q1→Q4 |
| 15 | The EASIEST Way To Become A Millionaire / Iced Coffee Hour clips (Codie) / youtu.be/cBLZ8keH_I8 | 4:34 | 6.1* | 4.64 | 82.75 (1.54) | -16.2 | 71.0 | 18% | 18% | .34 | static 86% | 3-cam podcast clip; Q4 jumps to 16.7 cuts/min on the sponsor read |
| 16 | Here's a short video from our founder / Kimi AI / youtu.be/5rithrDqeN8 | 3:41 | 11.1 | 3.16 | 113 (2.43) | -24.7 | 60.3 | 20% | 10% | .33 | static 44%, ↑16% ←15% | CEO launch: studio A-cam ↔ floating UI cards, caption strip, "Introducing" title |
| 17 | I Dared A Shy Guy To Start His Business / Simon Squibb / youtu.be/rln4i46Q-Bc | 6:27 | 21.1 | 2.13 | 80 (1.38) | -14.9 | 44.7 | 18% | 10% | .39 | ←20% →20% | paper-texture freeze-frame intro card with handwriting, countdown-timer overlays |
| 18 | 3 Minutes That Can Change Your Life / Valuetainment / youtu.be/gDIAw78xWJg | 3:39 | 2.7* | 4.60 | 72 (1.51) | -18.9 | 37.6 | 20% | 0% | .34 | static 86% | low-craft control: selfie monologue, red brand sting, list card |
| 19 | "If you went broke today…" / MoreMozi / youtu.be/kefMtQqgQBc | 4:05 | 11.0 | 3.29 | 72 (1.56) | -15.6 | 53.4 | 11% | 11% | .37 | ←15% →14% | live-workshop Q&A, 2-cam (speaker ↔ questioner), handheld drift |
| 20 | Charge more, attract better people… / Alex Hormozi (Short) / youtube.com/shorts/CEIXJWt1X-Q | 0:32 | 5.5* | 8.76 | 83.5 (2.43) | -24.8 | 49.9 | 0% | 33% | .22 | static 81% | 2026 Hormozi: small white 2–3-word captions, keyword bold, no SFX look |
| 21 | Dear younger me: / Alex Hormozi (Short) / youtube.com/shorts/D1mj63Owb7w | 0:29 | 8.4 | 3.20 | 76.75 (2.63) | -14.1 | 73.3 | 0% | 75% | .39 | static 100% | red banner hook title, yellow/white italic captions, keyword bold white |
| 22 | What I got wrong about freedom in my 20s / Ali Abdaal (Short) / youtube.com/shorts/iACc_7N7QnU | 1:30 | 22.7 | 1.00 | 90 (2.55) | -23.8 | 59.4 | 26% | 26% | .37 | ←25% →19% | handwritten type-on, cut-out head sticker, karaoke pill captions, whip pan; pace builds |
| 23 | How to Hook People Into Watching Anything / Colin and Samir (Short) / youtube.com/shorts/FliP14zJKbY | 0:53 | 16.0 | 2.00 | 88 (2.18) | -13.1 | 68.4 | 21% | 36% | .25 | static 73% | yellow highlighter title box, metaphor B-roll (clay macro), corner wordmark |
| 24 | The 3-2-1 Speaking Trick / Codie Sanchez (Short) / youtube.com/shorts/lEuBOkpBy7A | 0:46 | 14.3 | 3.23 | 84.75 (2.26) | -13.9 | 70.3 | 27% | 73% | .28 | static 50%, ←26% | white-box captions; key phrases swap to large glowing serif; 2-cam wide/close |
| 25 | All it takes is 6 months / Dan Koe (Short) / youtube.com/shorts/Wf0V7Zd2t_w | 0:25 | 4.7* | 9.15 | 74 (2.82) | -14.6 | 94.5 (speech) | 0% | 50% | .40 | static 80% | 3 s black screen with caption only, then hard cut to face |

\* = same-setup jump cuts likely missed; the real rate is higher.

## 2. Per-video notes

**01 Ali Abdaal – Ideal Life (horizontal, 7:39).**
- Hook: cold open on the A-cam, no text in the first 6 s; framing alternates between two scales about every 1–2.5 s (open sheet), so punch-ins replace text in the hook.
- Structure: 0:00 premise → 0:20–1:30 guest clip shown as a YouTube-page screen recording (name highlighted, the page scrolls up) → 2:00–3:30 handwritten-notes screenshot with a small PiP of Ali bottom-right → talk-to-camera → end card listing blog posts beside a PiP.
- Text: mono/typewriter pronunciation gag ("MI-CHAE KARN-JA-NA-PR…") typed on letter by letter; blue rounded "pill" call-outs (voicepal.me, ali@aliabdaal.com) pop in near the hands; the guest clip carries burned-in white subtitles. Fonts: clean sans and mono.
- SFX: not identifiable. hit-on-cut 14% (≈ chance) suggests cuts are unaccented.
- Music: weak beat (1.28), quiet bed under voice. LRA 3.6 (compressed).
- Flow: static 87%; motion comes from vertical scrolls of screenshots.

**02 Dan Koe – Fastest Way (horizontal, 6:11).**
- Hook: opens on pure black with tiny centered white text ("you lost the battle.") synced to VO.
- Structure: alternates essay cards with the A-cam (black backdrop, two vertical light tubes framing him) about every 20–40 s; B&W stock (crowds, produce, mountains, nebula) as metaphors; Obsidian screen inserts near the end.
- Text: small regular-weight sans (Poppins-like) in lowercase, centered, appearing in full per sentence; bold caps used only as a section header ("BECOME BRUTALLY AWARE OF 2 THINGS:" left-aligned).
- SFX: essentially none (hit-on-cut 3%).
- Music: low ambient bed, 99 BPM detected but weak (1.41).
- Pacing: slows from 8.4 to 3.2 cuts/min Q1→Q4; front-loads the visual inserts.

**03 Dan Koe – Ahead of 99% (horizontal, 8:11, 2022).**
- Plain A-cam with handheld-looking float, about 6 B-roll inserts in the whole video (crowd silhouettes, pen on notebook).
- No kinetic text.
- Slowest in the batch: 2.7 cuts/min floor, Q4 at 1.0.
- A control for "minimal edit".

**04 Leila Hormozi – Dream Life (horizontal, 4:57).**
- Hook: interview A-cam; a lower-third logo mark wipes in L→R over about 4 frames, then the name; at 0:02 a **teal light-leak flash** (≈2 frames) cuts to a childhood photo with a slow push. Story B-roll opens inside a **rounded-corner card on black** (about 94% scale), a "scrapbook" device.
- Structure: childhood → college (drone, B&W, place-name label) → gym → "18 MONTHS LATER" black card → word map (MARKETING / SALES / OPERATIONS / FINANCE / HR in small purple caps scattered on white, one circled with a hand-drawn ellipse) → "IT'S THE . . ." on a black tunnel → "10 SENTENCES THAT CHANGED MY LIFE" end card.
- Pacing: front-loaded, 35.6 cuts/min in Q1 dropping to about 20. The transitions sheet shows 0.5–1 s B-roll runs (treadmill → stair running) matched on motion, with feet moving the same way.
- Text: white bold geometric caps for time jumps; purple accent tied to the brand.
- Music: quiet (-23.1 LUFS), beat 1.53.
- Flow: ←/→ split evenly (14%/14%); no consistent screen direction.

**05 Alex Hormozi – Grow Audience (horizontal, 6:53, 2022).** The archetype of "Hormozi captions".
- Hook: a 1-frame radial/motion-blur whip into the first shot, a purple "COMING UP" pill bottom-left, then the cold-open teaser.
- Text: heavy **italic extra-bold sans (Montserrat Black Italic-like), yellow and white alternating by phrase**, centered at chest height. Words appear one at a time on speech, each hard-on in one frame with no fade. The key line scales up about 10% over 3–4 frames when it lands ("IN THE BEGINNING").
- Signature transition (transitions sheet): the frame shrinks into an **infinite tiled grid of itself** (droste zoom-out, about 1.5 s) while the caption holds, then a **radial zoom-blur** on the text (2 frames) snaps back to a tighter A-cam.
- Graphics: emoji/3D icons (money bag, check mark) pop beside the head; line graphs draw on over the speaker; bar-chart icons; a Simpsons meme on purple; stock (waterfall, money rain); podcast-chart screenshots.
- Pacing: Q1 16.8 cuts/min → Q4 5.8.
- Audio: LRA 10.6, the highest of the creator videos; biggest lift +29.9 dB at 251 s (likely a meme/SFX insert).

**06 Alex Hormozi – "I can't hide this anymore" (horizontal trailer, 1:53, 2026).**
- Hook: slow-mo push on Alex looking up. A **brush-script name title** ("Alex Hormozi") blurs in over about 2 frames at 5 fps (≈0.3 s), a wider shot follows, and two **hand-drawn arrow call-outs** ("Entrepreneur", "Investor") type in staggered by about 0.4 s.
- Structure: identity → wealth ($250,000,000 big white numerals bottom-center over stage shots) → offer ($100,000 over a grid of contestant faces) → rapid black cards in silver-bevel caps ("1 YEAR OF GUIDANCE", "A WORLD CLASS TEAM", "60 MINUTES", "90 DAYS") → reaction montage → a 3D chrome extrusion fly-through revealing "SCALE OR FAIL" → "JUNE 26TH" date card fade-up.
- Pacing: 57.6 cuts/min in the first half, 34.1 in the second.
- Transitions: flash frames and colour-gel flares, plus 1-frame black between beats.
- Audio: LUFS -28.3, a trailer mix with lots of headroom; biggest lift +13.9 dB at 97 s (the title reveal). Treat as music-led (speech .26).

**07 YC – 50 Founders First Customers (horizontal, 3:59).**
- Hook: two founders on an orange seamless; the question "How did you find your first customer?" **types on word by word, each word rising from a slight baseline offset**, about 1 s in total, bottom-left, white sans.
- Structure: supercut of one-line answers, about 0.5–5 s each; the company name sits as a semi-transparent label bottom-right throughout; ends on a YC logo on solid orange with the cursor blink.
- Cuts: answer-to-answer hard cuts plus same-camera crops from two-shot to single (digital punch-in). The cut count is broken, as noted above.
- Music: clear beat (2.18) at 70 BPM under speech.

**08 YC – 60 Founders Co-founder (horizontal, 3:53).**
- Same system as #07, plus: a **huge condensed numeral counter** ("29") over an orange-tinted frame; a solid **orange panel that wipes up from the bottom** to carry the question card; slate/clapper blooper moments kept in for charm.
- Pacing: Q1 27.9 → Q4 6.2 cuts/min (front-loaded energy, longer answers later).
- BPM 116; on-beat 22% (≈ chance).

**09 Garry Tan – YC tips (horizontal, 7:39, 2019).**
- Vlog-style opener (VLOG002 + location in white sans bottom-left, walking handheld).
- Then a static interview with a persistent lower-left chapter line ("Tip #1 — Show, don't tell"); one top-left photo PiP; giveaway text card at the end.
- Minimal edit, 2.4 cuts/min floor.

**10 a16z – It's Time To Build (horizontal, 1:46, 2026).**
- Hook: CG book floating in a library, with a continuous push-in through the opening pages that becomes a patent drawing (**push-through match transition**, about 2 s).
- Structure: patents strobe at 2–3 frames each → archival founders (Jobs, Musk, Zuckerberg) → Airbnb UI → golden-hand/Atlas CG → space → AI hands touching (Creation of Adam) → modern founders → IPO bell-ringing → Starship → "A16Z" gold wordmark.
- Text: rolling white numerals (458 → 5441 → 45894 → 4561144) incrementing on each cut, plus small white "+" brackets that track.
- Pacing: 58.5 cuts/min, peaking at 81.8 in Q2. Speech .10, so this is VO plus music.
- Flow: ←29% →20% (active); the motion is mostly camera pushes.

**11 Lenny's Clips "Rizzle" (horizontal, 3:18).** Third-party, lower craft.
- Zoom call placed inside a rounded rectangle with a green outline on a light dotted background.
- Diagonal navy/blue stripe wipe (about 0.4 s) between segments.
- Title above the frame in black bold.
- Mostly static.
- Shows what weak "podcast clip packaging" looks like.

**12 Mark Rober – Hack Pack launch (horizontal, 4:33).** The best founder product launch in the batch.
- Hook: Mark selfie-wave to camera (0–1.6 s) → hard cut to hero products on a **blue cutting-mat grid floor** (stop-motion or tabletop), each item about 0.4 s → the box lands → a kid reacts.
- Structure: product montage → build process (page-flip instructions shot as a speed-ramped insert-cut series, 10–12 frames per page) → IDE screen overlay ("001 – IR TURRET" orange-on-dark UI with level tabs) → customer reactions → team → CTA with QR code and "CRUNCHLABS.COM" big white condensed caps.
- Pacing: 44.2 cuts/min and stays high (56→38).
- Loudest in the batch (-11.8 LUFS, LRA 3.1, peak +0.2 dBTP): a YouTube-hot mix.
- Flow: →26% ←20%, lots of camera and object motion; inserts match the direction of hands.

**13 GaryVee – 5 Minute Plea (horizontal, 4:52, 2016).**
- Selfie rant VO laid over 1-s vlog B-roll (NYC taxis, jets, helicopters, office).
- Q3 accelerates to 79.7 cuts/min with **51% of cuts on the 130-BPM beat**, a true music montage inside a talking-head piece.
- Ends with black cards in condensed bold white caps ("FUCK YOUR 'GONNA'", "GO DO."), then a green Subscribe battery graphic.

**14 Codie Sanchez – Origin Story (horizontal, 3:05, 2016).**
- 2.35:1 letterbox speaker reel.
- Text: serif small-caps quote overlays with letter-spaced attributions; newspaper-clipping inserts (yellow-highlighted Journal page, "A Generation Abandoned").
- Music-driven: 120 BPM with strength 2.94 (strongest), 45% of cuts on beat; pacing rises 11.7 → 22.0 cuts/min Q1→Q4 (a classic sizzle build).

**15 Codie on Iced Coffee Hour (horizontal clip, 4:34).**
- 3-camera podcast on a red curtain set (single, single, wide); cuts on speaker turns; hosts' reaction cut-aways.
- Q4 jumps to 16.7 cuts/min for the Shopify ad read: stock clips with a Shopify bug, a website screen, and "shopify.com/ich" in italic extra-bold white, switching to green.
- End card: "THE ICED COFFEE HOUR" logo + Watch Next.

**16 Kimi – founder video (horizontal, 3:41, 2026).**
- Hook: CEO at a desk in a branded office. At about 0.2 s, a right-aligned lower third ("Zhilin Yang / Founder and CEO, Kimi") fades in over about 2 frames; a sentence-case subtitle strip sits bottom-center for the whole video; cut to a tighter crop of the same take at 2.2 s (punch-in on "Six months ago").
- At 3.6 s the "Introducing Kimi K2" serif title cross-dissolves in with floating UI cards; then a fly-through over a grid of app cards; then a prompt-box UI.
- Structure: founder line → product UI demo (typewriter UI, games, benchmarks bar charts animate up, agent-swarm nodes) → back to the founder about every 20–30 s → "Kimi K2.5 Available Today" → logo.
- Music 113 BPM, clear beat (2.43), quiet master (-24.7 LUFS).

**17 Simon Squibb – Shy Guy (horizontal, 6:27, 2026).**
- Hook: street two-shot. At 0.8 s the background **tears away into beige paper texture**, the frame goes desaturated, and a handwritten serif label ("Name – Joe / Age – 28 / Aspiring barber shop owner") writes on with a hand-drawn arrow over about 1 s, holds about 2 s, then the paper tears back to live colour footage.
- Structure: challenge set-up → **countdown timer overlays** (bold white "52:08", "31:18", "16:43", "07:29", "04:13") at story beats → crowd-building → payoff → studio tour; lower third with a yellow bar for a featured person.
- Pacing: 21.1 cuts/min with a mid-video peak (29.1 in Q2).
- Flow: balanced ←/→ (handheld vérité).
- Loud mix (-14.9 LUFS).

**18 Valuetainment – 3 Minutes (horizontal, 3:39, 2018).** Low-craft control.
- Phone selfie in a car.
- A red-gradient name card and lion-shield logo sting scale up about 15% over 0.5 s.
- A list card on white (numbered questions, last line in red) slides in from the left as a 40% panel.
- Otherwise uncut.

**19 MoreMozi – "If you went broke" (horizontal, 4:05, 2025).**
- Live workshop Q&A from 2 cameras: Alex at the flip chart (wide) and the audience member with a mic (medium); cuts follow speaker turns with occasional reaction shots of the crowd over the shoulder.
- No graphics in sampled frames.
- Pacing front-loaded (17.6 → 6.9).
- Loud, compressed (-15.6 LUFS, LRA 3.0).

**20 Hormozi Short – Charge more (vertical, 0:32, Nov 2026).**
- The current Hormozi house style is restrained: small white sans captions (2–3 words per chunk), the keyword in bold, centered at chest height over the mic; hard on/off with no animation.
- Jump cuts with slight framing changes (about 3–5% scale) every 5–9 s.
- No B-roll and no SFX visible.
- Quiet master (-24.8 LUFS).

**21 Hormozi Short – "Dear younger me" (vertical, 0:29).**
- Hook title in a **red rounded banner with white caps** ("WHY HIS CLOSE RATE WON'T BUDGE….") below the captions, on screen for the first about 3 s.
- Captions are italic yellow, with the keyword in bold white, 1–3 words per chunk.
- Cut points line up with hits 75% of the time (well above the ~23% chance). This is inference: cuts land on hard consonants or on a subtle whoosh; with this little visible SFX, more likely the former.

**22 Ali Abdaal Short – Freedom in my 20s (vertical, 1:30, Nov 2026).** The most "After Effects" of the creator shorts.
- Hook: cut-out Ali composited over a stylised landscape. "In my 20s" in a heavy serif italic types on word by word (2 words over about 0.4 s), then a **handwritten-font sentence writes on about 1 char per frame**.
- Captions: karaoke **white rounded pill** at the bottom third; the active word is black and upcoming words grey.
- Structure: illustrated explainer section (cut-out head sticker bobbing over a "in my 20s / in my 30s" list on a peach-to-navy gradient, a hand-drawn arrow swoops in) → vérité B-roll (hospital, family, 2×2 grid of travel clips) → a photo card tilted about 3° with the serif headline "less freedom.. and much more **fulfilment**" (scale-up on the last word) → podcast 2-shot with a **whip pan** (about 5 frames of horizontal motion blur, ←) → handwritten yellow outro text.
- Pacing builds hard: 0 → 5.3 → 40 → 45.4 cuts/min by quarter. It gets faster as the story resolves.

**23 Colin and Samir Short – Hook (vertical, 0:53, Nov 2026).**
- Hook: a **yellow highlighter box** title in black bold sans ("Corridor Crew's Storytelling Masterclass") holds about 1.5 s across the first cut, then fades over about 3 frames.
- Small white captions, 1–3 words, at mid-frame; a stacked "The Colin & Samir Show" wordmark sits top-left throughout.
- Metaphor B-roll: macro clay-sculpting shots on black at "a clay sculpture"; an "Uh oh" cut-in that dollies past a doorframe; a screen-recording B-roll of the guest at his desk.
- Pacing: Q1 31.9 cuts/min (hook), then about 9–14.
- Biggest lift +12.2 dB at 19 s, at the clay B-roll; inference: a music swell or SFX on the metaphor.

**24 Codie Sanchez Short – 3-2-1 trick (vertical, 0:46, Nov 2026).**
- Hook: a white-box title ("Communicate For Respect", black text on a white rectangle, native-TikTok look) plus a white-box caption below.
- Captions: black-on-white box, 1–3 words. **Key phrases swap to large light serif with a soft white glow** ("3-2-1 trick", "pause three seconds.", "two points."), placed mid-face or in the lower frame, about 1 s each.
- Two cameras (wide/close) alternate every 2–4 s; the wide → close cut acts as the punch-in.
- 73% of cuts with a hit (well above chance). Inference: a subtle whoosh or click on camera switches, or cuts placed on consonant onsets.
- Loud (-13.9 LUFS).

**25 Dan Koe Short – 6 months (vertical, 0:25, Oct 2026).**
- Hook: **3 s of pure black with only the small white caption** ("all you have to do / is commit for six months / that is not a lot") over his voice, then a hard cut to his face at a mid close-up.
- Small white lowercase sans captions, center frame; about 3 cuts in total.
- Hit count (94.5/min) reflects his clipped consonants plus a clear beat bed (2.82).

## 3. Batch synthesis

### Typical ranges (n=25; cut numbers are floors for jump-cut talking heads)
| Metric | Median | IQR | Range |
|---|---|---|---|
| Cuts/min | 11.1 | 4.9–21.1 | 2.4–58.5 |
| Median shot length (s) | 3.23 | 2.0–4.8 | 0.75–9.83 |
| BPM | 82.75 | 74–90 | 70–130 |
| Beat strength | ~1.9 | 1.53–2.43 | 1.28–2.94 |
| LUFS integrated | -18.3 | -21.1 to -15.4 | -28.3 to -11.8 |
| LRA (LU) | ~3.6 | 3.1–5.4 | 1.3–12.9 |
| Hits/min | 56.7 | 49.9–68.2 | 27.3–94.5 (speech-inflated) |
| Cuts on beat | 18% | 11–23% | 0–51% |
| Cuts with hit | 17% | 10–26% | 0–75% |

The batch splits into three pacing tiers:
- **A. Music-led founder or brand films** (a16z, Hormozi trailer, Mark Rober, GaryVee): 33–59 cuts/min, median shot 0.75–1.0 s, music in front, speech share .10–.37.
- **B. Edited creator explainers** (Leila, Hormozi 2022, YC supercuts, Simon Squibb, Ali Short, Kimi, Codie and Colin & Samir shorts): 11–25 cuts/min, median shot 1.0–3.3 s, a graphic or insert every 3–8 s.
- **C. Minimal talking heads** (Dan Koe long-form, Garry Tan, Valuetainment, Hormozi 2026 shorts): 2–6 cuts/min, and speech carries everything. Even these jump-cut and reframe every few seconds (more than scdet sees).

The user's "too slow" complaint maps onto tier C. A founder launch film should sit in tier A for its montage sections and tier B for the talking sections.

### Pacing across the video
- **Front-loaded is the norm.** 15 of 25 have Q1 as their fastest quarter (e.g. #04 35.6→20.2, #08 27.9→6.2, #23 31.9→9.1, #05 16.8→5.8). The hook runs at roughly 1.5–3× the body rate.
- **Exception: story or sizzle pieces build toward the end** (#14 11.7→22.0, #22 0→45.4, #01 3.7→6.3, #15 jumps in Q4 for the ad).
- Rule: either open hot and settle, or (for a launch or sizzle) build steadily into the reveal or CTA. Never start slow and stay flat.

### Cuts vs beat
- In speech-led pieces cuts follow **words, not the beat**: median on-beat 18%, which is at chance.
- Only the music-driven montages lock to the beat: GaryVee 51% at 130 BPM, Codie sizzle 45% at 120 BPM, both with beat strength >2.2.
- Rule: cut talking-head sections on phrase ends or breaths; inside B-roll or montage runs, snap cuts to the beat grid.
- Beds are mostly 70–100 BPM with clear pulses (strength ~1.5–2.9), sitting about 15–25 dB under the voice (inference from speech dominance and low LRA). The faster montage pieces use 113–130 BPM.
