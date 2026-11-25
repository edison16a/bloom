# P4 — After Effects text + SFX technique over real-person footage

Batch layout (per the prompt, which overrides the 25-measured default in BRIEF.md):
- **Half A — 15 finished showcase edits / editor reels**, measured with `tools/measure.py`. Folders `01-…` to `15-…`.
- **Half B — 11 technique breakdowns** (auto-subs in `subs/*.txt`), plus 3 web articles. No measuring.

Measurement caveats, read first:
- Three Half A downloads hit YouTube HTTP 429 on the *subtitle* step. They (02, 06, 08) and the replacement 14 were re-run with a scratch copy of measure.py that skips subtitle download only. Nothing else in the script changed.
- **01 rystal:** cut detection reads 4 cuts/min, but the piece is one continuous 3D camera move with no hard cuts. It's real, but it isn't comparable as "pacing".
- **15 AfterRender:** the client edit plays inside a static branded frame (picture-in-picture), so scdet found 0 cuts. Its pacing numbers are **broken**. Its audio numbers are usable.
- The original 14 (EyeFly talking-head sample, cRZACArJNEM) was a raw single take with punch-ins and no text. It was dropped and replaced by hasimsaifi.
- `biggest_lifts` of 170 dB (06 @53 s) and 71 dB (13 @1 s) are lifts out of digital silence, not real musical drops.
- BPM: several reads of 70–82 BPM with strong beat strength are probably half-time reads of ~140–165 BPM tracks (inference). The pictures cut at roughly 2× those rates.
- `cuts_on_beat_share` has no chance baseline in the output. With an 8th-note grid, ~25–35% would happen by chance (inference). So the measured median of 0.28 means **showreel cuts are not tightly beat-locked as a population**. The kinetic-type openers are the exception.

---

## 1. Table (Half A)

| # | Title / channel / URL | Len s | Cuts/min | Med shot s | BPM (str) | LUFS | Hits/min | Cuts on beat | Cuts w/ hit | Speech | Dominant flow | What's distinctive |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 01 | Video Editor Showreel 2025 / rystal / youtu.be/Y9LYuqb4uYA | 30 | 4.0* | 10.0* | 70 (2.38) | -14.3 | 55.8 | .50 | .50 | .10 | ↑ ← mixed | One continuous 3D camera through tilted UI cards; view-counter ticks up "989k→1M views" with motion blur |
| 02 | Video Editor Showreel 2024 / M Creation / youtu.be/6kYRUsXtS4s | 40 | 37.7 | 1.30 | 130 (3.40) | -7.2 | 15.1 | .52 | .16 | .13 | static/← → | Black/white-invert kinetic type, one word per beat (~0.46 s) |
| 03 | Video Editor Showreel / Ryan Ferguson / youtu.be/WUB2pSkwN2M | 38 | 33.5 | 1.13 | 76.8 (4.23) | -11.9 | 110.1 | .29 | .57 | 0 | mixed | Pink/blue checker word-flash "Stories/Promo/Branded…" every ~0.5 s with tracking blur |
| 04 | Demo Reel 2024 / Drew Jimenez / youtu.be/ART4ltmSY3Q | 83 | 43.6 | 0.79 | 120 (4.22) | -11.6 | 93.1 | .28 | .48 | .05 | → ← | 1–2-frame montage bursts; titles placed *behind* subjects ("TOKYO", "PROMOTION") |
| 05 | Video Editing Showreel / abdystudio / youtu.be/VfYkGzcFbHY | 40 | 33.3 | 1.00 | 131 (4.10) | -9.9 | 72.6 | .27 | .41 | .10 | → ← | YouTube-player frames sliding on white; giant BG word ("LOOKING") behind small foreground line |
| 06 | Video Editing ShowReel / FarmeR Editz / youtu.be/mDfpW_IgN6Y | 55 | 35.0 | 1.63 | 95 (5.12) | -8.8 | 51.4 | .16 | .16 | .15 | static | Condensed-yellow two-tier type ("For / EDITING"); text-behind-walker; footage-filled "TEXT" |
| 07 | Video Editor Showreel 2026 / RxVisuals / youtu.be/E1MjNwbkYmY | 18 | 90.4 | 0.20 | 76 (5.62) | -13.6 | 43.5 | .22 | .22 | .06 | ← → | 228 cuts/min opening, then a collage wall; editorial serif + italic mix |
| 08 | Video Editor Showreel 2026 / Kanda Speaks / youtu.be/cb3iDfvEPso | 39 | 15.5 | 2.42 | 81.8 (2.07) | -14.1 | 57.4 | .10 | .60 | .34 | static | **Closest to the target format**: talking head with word-synced AE text in negative space, name behind the head, cut-out person over a white band |
| 09 | Video Editor Showreel 2025 / Padmesh PM / youtu.be/F7OTH1OnaNo | 42 | 54.6 | 0.42 | 95 (6.56) | -9.5 | 112.0 | .29 | .45 | 0 | ← | Stair-stepped repeated text lines; logo pops with motion blur on stepped grey backgrounds |
| 10 | Video Editor Showreel 2025 / Paul / youtu.be/HzOaQhk131Y | 62 | 11.6 | 1.00 | 110 (4.75) | -12.7 | 57.8 | .08 | .08 | 0 | static | Trailer-style wide-tracked titles with letter scramble; light-leak flashes; push into an eye |
| 11 | VIDEO EDITOR REEL 2025 / Craig Parikh / youtu.be/9upN5Hc6PgM | 118 | 17.3 | 2.44 | 85 (4.15) | -7.6 | 60.4 | .15 | .15 | .03 | static/→ | 3D-tracked words pinned to buildings in a fly-through; footage-filled title |
| 12 | DUCKLIFE 2024 SHOWREEL / DUCKLIFE / youtu.be/UfN1aW3FOLE | 68 | 74.0 | 0.24 | 131 (5.23) | -9.2 | 75.8 | .42 | .31 | .10 | ← | "Previously on" 1-frame footage strobes behind a locked logo; agency pacing |
| 13 | You Can Make a Netflix Style Doco… / Paul E.T. / youtu.be/9BUrNe3Vhtk | 263 | 18.7 | 1.67 | 124 (1.85) | -17.5 | 52.8 | .34 | .26 | .20 | static | Doc-parody talking head; trim-path lines lead from word to word; text tracked onto a plate |
| 14 | Professional Video Editor Portfolio 2026 / hasimsaifi / youtu.be/du9dgqqcKSg | 46 | 7.9 | 3.25 | 74 (2.40) | -12.4 | 45.9 | .33 | .33 | .07 | ← | Soft-blue UI-card motion; exits with a horizontal blur whip, then a zoom-through-letter |
| 15 | Talking Head Edit (Iman/Ali style) / AfterRender / youtu.be/lpKpHIhXdy0 | 35 | 0* | — | 116 (7.22) | -11.9 | 75.2 | — | — | 0 | static | Framed client edit: stat badge "50%→39%→0.1%" beside the speaker; text expands from a box outline; scale-push titles |

\* Measurement not comparable (see caveats).

---

## 2. Per-video notes

**01 rystal.** *Hook:* a glowing wordmark resolves out of blur (0–1.5 s), then the camera pushes into a 3D field of timeline clips. *Structure:* 0–4 s name; 4–9 s timeline flythrough; 9–15 s stat cards ("1M views", "10M+ views generated"); 15–23 s software badges, a curved line connecting skills (Cut → Motion Graphics → Audio Design → 3D Animation); 25–30 s URL end card. *Type:* rounded geometric sans, white with glow. Numbers count up as the camera drifts, with per-frame motion blur, and the card stays tilted about 10–15° in 3D. *SFX:* 55.8 hits/min over a soft 70 BPM bed. The hits are probably UI ticks per counter step (inference). *Flow:* all continuous camera moves (59% of frames moving). Direction changes through rotation, not cuts.

**02 M Creation.** *Hook:* a purple light leak, then "LOOKING" types in letter by letter on white. *Structure:* 0–8 s kinetic type ("Looking for a video editor? I got you. Let's create awesome videos"); 8–12 s "What can I do — let's see" over a timeline B-roll; 12–33 s skill-labelled clips; 33–40 s "Thanks for watching". *Type:* bold geometric sans mixed with outline versions of the same word. The background flips black/white on every word. Words rotate in about 30° and settle (GOT), or arrive as stacked outline/fill echoes (AWESOME ×3). Each word holds about 0.4–0.5 s, one beat at 130 BPM. *Music:* starts from silence with a +23 dB lift at 1 s. Hits/min is only 15: the energy comes from the music, not SFX. Cuts are 72/min in Q1, dropping to 18/min in Q4. *Transitions:* hard cut plus background invert, and whip blur.

**03 Ryan Ferguson.** *Hook:* a glitch/RGB-split title, "VIDEO EDITOR For Hire", with a strikethrough. *Structure:* 0–8 s glitch title and CRT/eye collage; 8–15 s commercial clips; 15–20 s word-flash wall (Stories / Promo / Branded / Editorial / Design / Motion / Production / Gaming); 20–30 s "Creative / Engaging / Inspired Video" title over footage; 30–38 s liquid-type end card. *Type:* each word holds about 5 frames at 10 fps (~0.5 s). It enters with tracking expanding and horizontal motion blur, and exits blurred. The background alternates pink/blue checker on each word. *SFX:* **110 hits/min, and 57% of cuts carry a transient.** Every word swap gets a click or whoosh (inference from hit density). *Flow:* mixed. Rhythm comes from the word swaps, not camera direction.

**04 Drew Jimenez.** *Hook:* a "VIDEO EDITING DEMO REEL" condensed title over a sunset, then "2024" tracked onto a Brooklyn street. *Structure:* section cards (VFX, TRANSITIONS, PROMOTION, MOTION GRAPHICS, SOUND, COLOR GRADING, CINEMATICS), each followed by 3–10 s of work. Mid-piece has a **1–2-frame montage** (shot_len_p10 = 0.08 s). *Type:* condensed display sans in team colours, placed **behind** dancers and walkers (rotoscoped), echo-stacked outline repeats ("TOWN" ×5), and handwritten scribbles. *Music:* 120 BPM, strong beat (4.22). Biggest lifts cluster at 42–48 s, where the montage peaks. Cuts per quarter run 73 → 35 → 15 → 52: fast open, slow narrative middle (essay section), fast close. *Flow:* lateral → ← dominate. Montage shots are chosen with alternating direction.

**05 abdystudio.** *Hook:* "Abdy Studio" in small caps on black, 0–3 s. Then a giant faded background word "LOOKING" with a small foreground "LOOKING FOR A", followed by "Professional EDITOR". *Structure:* intro type (0–7 s); YouTube-player-framed samples sliding on white (7–25 s); mock Google search "Need Pro Video Editing Services?" and floating review cards (25–33 s); value props, one word per card ("200+", "Fast", "24/7 Online"). *Type:* oversized background word at about 20% opacity behind a small sharp line. That's a two-layer depth trick. *SFX:* 72.6 hits/min; Q2 is densest (60 cuts/min). *Transitions:* players slide in and off laterally (→), with drop shadows on white. They read as clean push transitions.

**06 FarmeR Editz.** *Hook:* "Hello" on black, then "My Name Is / Madan Mavi" in two-tier type (small white over large yellow). *Structure:* 0–10 s intro type; 10–45 s skill demos labelled in condensed yellow (Motion Tracking, Sky Replacement, Color Grading, Text in Background, Croma Key, Slow Motion, Reverse, Character Introduction, Masking, Sound Design); 45–55 s CTA. *Type:* the classic YouTube "two-tier" lockup, a small regular word above a large condensed bold keyword in yellow. "Text in Background" shows the walker occluding "Background". "Masking" reveals the word as the person walks past (a moving matte). *SFX:* 51 hits/min, low cut-hit share (.16): music-led. *Flow:* mostly static frames (static share 19/55 s).

**07 RxVisuals.** *Hook:* a **228 cuts/min burst in the first 4.5 s**: B&W sports and graphics, 1–3 frames each, framed in rounded cards. *Structure:* burst; collage wall of photos and phone screens building outward (5–9 s); 16:9 and 9:16 sample triptychs labelled LONG FORM / SHORT FORM / MOTION GRAPHICS. *Type:* editorial serif mixed with an italic script ("AI videos *are everywhere*", "faster / better / cheaper" under three portrait cards). *Music:* 76 BPM read (likely half-time), beat strength 5.62, LRA only 2.4: a compressed, driving bed. *Transitions:* cards scale in from centre, and the collage accumulates without cutting away.

**08 Kanda Speaks (key reference for talking head plus AE text).** *Hook:* 0–1 s, "Hey!" pops at chest height. "I'm Vaibhav" builds behind the head in huge white bold sans, word by word (I'm → Vaibhav), and the head overlaps the letters (rotoscoped foreground). *Structure:* 0–2 s intro; 2–5 s cut-out speaker standing on a 3D-tilted timeline, "Professional / Video Editor" building above the head; 5–9 s B&W cut-out speaker sitting on a white horizontal band over a timeline, with copy built word by word in two columns either side ("50+ Creators & Brands" left, "in bringing their Ideas to life" right); 9–12 s a word stacked vertically inside a white person-silhouette ("ENGAGING"); 12–16 s handwritten "Any Platform" with trim-path lines to YouTube/Instagram/Facebook icons; 16–39 s talking head with left-third stacked copy ("I know / What hooks / Attention"), single-word captions at chest height, and screen-recording inserts. *Type:* heavy geometric sans (Poppins-like). Keywords are scaled up about 2× within the stack ("free **3**", "**Satisfaction**"). Each word appears as it's spoken, at about 0.2 s per word (one word per 5 fps frame on the open sheet), with a 2–3-frame opacity/blur-in and no position travel. *SFX:* 57 hits/min, and **60% of cuts carry a hit** while only 10% are on beat. SFX follow the edit, not the music. *Music:* low (-14.1 LUFS overall, speech 34%), a background bed. *Flow:* almost all static (21/39 s). The energy is in the type, not the camera.

**09 Padmesh PM.** *Hook:* "Looking" white on black, a 1-frame arrow glyph, then "Video Editor" with a stacked echo/ghost trail below. *Structure:* 0–10 s, 132 cuts/min burst (0.3 s shots: night sky, book, pigeons, sunset, flowers); 10–14 s Pr/Ae logo pops; 14–30 s labelled bracket titles ("[ TRAVEL ]", "VLOG'S" in a box, yellow highlight bar "ANYTHING YOU WANT"); 30–42 s talking head ("GREEN SCREEN REMOVAL") and contact card. *Type:* "I'VE GOT YOU COVERED" repeated in 4 stair-stepped lines that scroll diagonally. A yellow bar wipes left→right, then the text appears on it. *SFX:* **112 hits/min**, beat strength 6.56. *Transitions:* logo icons scale from about 30% to 100% over ~4 frames with heavy motion blur. The background steps black → grey → white on successive frames, a luma-ramp "flash".

**10 Paul.** *Hook:* chrome 3D letters "D I" flying in. "Need AN EDITOR?" in ultra-wide-tracked small caps over a purple glow. *Structure:* 0–15 s trailer titles ("for TALKING HEAD'S / DOCUMENTARYS / VLOGS / WANNA SEE WHAT I CAN DO?"); 15–28 s a numbered capability list with leader lines (1 Motion graphics, 2 Motion integration, 3 Color grading, 4 Sound design, 5 Transitions); 28–45 s stock montage joined by light-leak flashes and a matte-ink wipe; 45–62 s "ARE / YOU / INTERESTED?" glass cards and "CHECK THE DESCRIPTION". *Type:* tracking roughly 300–600 (Ben Marriott's "cinematic" tracking range). Letters scramble or decode in and out per character. *Music:* LRA 12.1, the most dynamic in the batch. Big lifts at 1 s and 7 s (+11 and +10 dB) land on the title reveals. *Transitions:* white flash/bokeh (1 frame white), then a push-in through the starfield into an eye (a scale match).

**11 Craig Parikh.** *Hook:* a drone-style fly-through of a CG city. The words "ARE / YOU / LOOKING / FOR A / VIDEO EDITOR" are **3D-pinned to building facades**, and the camera flies past each one. Each word is on screen about 1.2–1.4 s, enters from frame depth and exits past the lens. *Structure:* 0–8 s that sequence; 8–18 s "I HAVE GOT YOU" (footage-filled letters), "LET'S CREATE AWESOME — CONTENT TOGETHER" (kinetic, white/black invert); 18–80 s FX demos (rotoscoping, character intro card, colour before/after wipes, colour replacement, green screen, motion tracking); 80–118 s split-screen grid of formats ("VERSATILE CONTENT", "ALL SOCIAL MEDIA CONTENT"). *Type:* per-letter vertical jitter settles in about 2 frames ("CREATE"). A trim-path line draws, then text pushes out from it ("AWESOME — CONTENT"). *Music:* the loudest in the batch (-7.6 LUFS) with a dense steady pulse (hits every ~0.7 s in the first 11 s). *Flow:* forward camera motion (Z+) during the open, then static demos.

**12 DUCKLIFE.** *Hook:* "PREVIOUSLY ON / DUCKLIFE". The logo stays locked at centre while **1-frame footage strobes** flash behind it (6 frames of colour footage, then 2 s of black hold, then another burst). *Structure:* 0–10 s brand lines ("growth through *creativity*", "Branding", "Campaigns", "everything you need.", "READY?") with a pink liquid blob morphing behind the words; 10–60 s campaign montage, mostly 0.24 s shots (106 cuts/min Q1, 99 cuts/min Q3); 60–68 s logo outro. *Type:* bold italic grotesk mixed with a serif-italic accent word. A blob shape sits behind the word as a highlighter. *Music:* 131 BPM; cuts on beat .42, the highest real on-beat share in the batch. *Flow:* ← dominant (24 of 68 s). Montage pieces tend to wipe or slide leftward (inference from flow string plus sheet).

**13 Paul E.T. (doc-style talking head, 7.2 M views).** *Hook:* "SERIOUSLY." dots typing on (one dot per ~0.2 s), then "YOU CAN". A trim-path line draws under "YOU CAN", steps down, runs to "ALL YOU'LL NEED", then to a camera cut-out with "X2", and the frame scrolls down following the line. *Structure:* 0–60 s gear explainer with line-led diagrams (LENSES, LIGHT cone, MUSLIN ×3 stack, BOOM POLE, "REC◯RD IT"); 60–90 s "AND YOU'RE EDITING" with a paint splatter; then the parody doc: day/time cards ("MONDAY THE 23RD" in light sans with an orange accent), timestamps tracked onto objects ("11:22AM" sitting on toast), and an interview with costume changes; ends with a "THE BREAD LOSER" title tracked onto the plate and a Netflix-style "P / STREAMING NEVER" end card. *Type:* tall condensed (Bebas/Anton class) and wide black-letter display (Bungee-like) for the explainer; thin wide-tracked sans for doc cards. *Music:* -17.5 LUFS with speech share 20%; the bed sits low under VO. *Flow:* static interview shots, with the energy in cut rhythm (Q4 is 24 cuts/min) and line-led camera scrolls.

**14 hasimsaifi.** *Hook:* "Looking For" fades in, "Video Editor" in a blue pill expands (scale-x from the centre), then "VIDEO EDITOR" condensed slides off left. *Structure:* 0–10 s UI-card intro (About me / My Experience / 150+ projects chips orbiting a ring); 10–18 s a 3D-tilted AE timeline; 18–30 s 9:16 samples in rows; 30–45 s "AI VIDEO" and "DM FOR EDIT". *Transitions:* the exit on "See My Work" is a **horizontal directional blur whip** (2 frames), then **scale-through a giant letter "V"** into black, then the next scene. *SFX:* 46 hits/min, cut-hit .33. *Note:* very low views (189). It's included as a recent AE talking-head portfolio, so treat it as a lower-authority example.

**15 AfterRender (pacing broken).** The client sample plays inside a branded frame. *Observed text work:* blue stat badge left of the speaker's face ("50%" → "Crypto Taxes 39%" → "0.1%") as a number swap in place; glassmorphic cards with a bullet list built line by line; mock Google search typing; "$10K" in a dashed selection box, then the box scales up and "IN MY FIRST MONTH / HOME SERVICE BUSINESS" pushes through at full width with a scale overshoot; YouTube play/pause UI overlay. *Audio:* 116 BPM with beat strength 7.22: a hard four-on-the-floor bed under a pure-graphics stretch (speech share 0, so the measured portion may be music-only).

---

## 3. Half B: technique sources

| # | Source | Kind | Used for |
|---|---|---|---|
| B1 | Ben Marriott, "5 Essential Type Animations in After Effects" (youtu.be/jS1YMWkm4DQ) | auto-subs | position plus steep ease, colour fill flash, blur-in, text out of a line (trim path plus alpha matte), scale 104→100 "sink", tracking animator, stroke/fill gradient |
| B2 | Ben Marriott, "5 MORE Essential Type Techniques" (youtu.be/8EjtQPULbbE) | auto-subs | roughen boil (`time*4`), luma-matte texture, typewriter with irregular timing and hold keys, write-on, legibility over busy footage (shadow → vignette solid → frosted blur box), 3D camera-tracked text |
| B3 | Jake In Motion, "Text Animators are an After Effects superpower" (youtu.be/NclmWZa4c_8) | auto-subs | range selector internals: Ramp Up, Ease Low 100, offset −100→100 over 30 f, second "out" selector with Ramp Down, grouping alignment, based-on words |
| B4 | Ignace Aleya, "Simple but Professional Text Animation" (youtu.be/EglpVqoCSy4) | auto-subs | opacity plus blur(50) per character with Ramp Up; a separate tracking animator +5 over the whole duration |
| B5 | Andrew Kramer / Video Copilot, "Camera Shake with Wiggler" (youtu.be/gZ-UUtoHD3g) | auto-subs | impact shake: wiggler freq 15, mag 25, jagged, motion blur on, Motion Tile 125% with mirror edges, ease out the last key |
| B6 | rdylt09, "Text tracking to head" (youtu.be/ldhAwOgvCvw) | auto-subs | track the nose, apply to the text, offset Y below the face; one pre-comp per sentence |
| B7 | Smertimba Graphics, "Text Behind Moving Object – Roto Brush" (youtu.be/_c_xSyOevCI) | auto-subs | duplicate plate: roto'd copy on top, text between, original underneath |
| B8 | Camilo Castañeda, "My SECRET to Smooth Speed Ramps in AE" (youtu.be/MnjBH0wXkD8) | auto-subs | time remap key shapes, peak velocity at the entry, reverse-ramp exits for direction matching, pixel motion blur |
| B9 | tutvid, "J-Cut and L-Cut" (youtu.be/DVSZujJDYXg) | auto-subs | J: next audio leads by ~2 s; L: outgoing audio tails ~2 s; short constant-power crossfade |
| B10 | Premiere Gal, "The SECRET to Pro-Level Sound Design" (youtu.be/jkC_gwEZ6GQ) | auto-subs (Krotos sponsorship) | footsteps/whoosh performed to picture, distance processing for wide shots, fade-out on whoosh tails, colour-labelling SFX by type, layered ambience |
| B11 | Hayden Hillier-Smith, "3 Editing Secrets I Wish I Knew Earlier" (youtu.be/XIVSa3wo0JU) | auto-subs | restraint: cut before VFX, keep pauses/silence beats ("don't over-trim"), match-cut barrages for scale |
| W1 | Pixflow, "Cinematic whoosh sound effects" (pixflow.net/blog/cinematic-whoosh-sound-effects/) | article | whoosh lead 10–20 ms, peak at fastest motion, 400–500 ms for a 0.5 s transition, -18 to -12 dB vs dialogue, layer stack, EQ |
| W2 | FlexClip, "Transition sound effects" (flexclip.com/learn/transition-sound-effects.html) | article | impact 1–2 frames after the transition or text reveal starts; SFX under music and dialogue |
| W3 | Artlist, "Tips… sound design" (search snippet) | article | reverse an impact to make a riser; next shot's sound before its picture |

Not obtained: the School of Motion kinetic-type course, Talking-Head MG breakdown uW-8SKO8kYE (429 on subs), and a speed-graph numeric article. Easing numbers below marked *(inferred)* convert what the tutors did by hand into KeyframeEase values. They weren't read off a screen.

---

## 4. Recipes in AE-scripting form (EffectCraft runs the AE scripting API)

Conventions: `fps = comp.frameRate`, `f(n) = n/fps`. Ease objects are `new KeyframeEase(speed, influence)`. "Easy Ease" (F9) is `KeyframeEase(0, 33.33)` on both sides.
- **Expo-out** (Ben Marriott's "drag both handles left" speed graph, arriving into rest) *(inferred values)*: outgoing ease on key 1 is `KeyframeEase(0, 5–10)`, incoming ease on key 2 is `KeyframeEase(0, 85–95)`. Fast start, long settle.
- **Expo-in** for exits is the mirror: key 1 out `(0, 85–95)`, key 2 in `(0, 5–10)`.

### R1. Clean title entry (Ben Marriott B1): the "90% of client jobs" move
```
L = comp.layers.addText("TITLE");               // final position = rest pose
P = L.property("ADBE Transform Group").property("ADBE Position");
t0 = inPoint; t1 = t0 + f(12);                  // 10–15 f typical (inferred from tutorial pacing)
P.setValueAtTime(t1, rest); P.setValueAtTime(t0, rest + [0, 40]);   // "doesn't need to travel far": ~30–60 px at 1080p
O = L.property("ADBE Transform Group").property("ADBE Opacity"); O.setValueAtTime(t0,0); O.setValueAtTime(t1,100);
apply expo-out to both props (same ease on both)
// polish layers (each optional):
fx = L.Effects.addProperty("ADBE Fill"); color key t0 = [1,0,0] (red), t0+f(6) = white, easy-ease   // "barely visible → white"
gb = L.Effects.addProperty("ADBE Gaussian Blur 2"); blurriness t0=20 → t1=0, easy-ease
```
SFX: a soft whoosh peaking at t0+f(3). If it should land, add a tick or impact at t1−f(1).

### R2. "Sink-in" scale (B1)
`Scale 104% → 100%` over 8–12 f, value-graph ease with "the sharpest easing" (incoming influence ~95, outgoing ~5, *inferred*), plus Gaussian Blur 10→0. Use on punch words in talking heads: it reads as impact without travel.

### R3. Cinematic tracking spread (B1, B4; seen in 10 Paul)
```
anim = L.Text.Animators.addProperty("ADBE Text Animator");
anim.property("ADBE Text Animator Properties").addProperty("ADBE Text Tracking Amount");
tracking: key 0 at in → +30 at in+5s (linear or very gentle ease)   // base Character tracking ~600 for trailer look; +5 for subtle (Ignace)
```
Pair with R4 opacity/blur per character. Paul's reel uses this for every title card, with the hold card lasting 2–3 s.

### R4. Per-character fade + blur reveal (B3 Jake, B4 Ignace): the base reusable animator
```
A   = L.Text.Animators.addProperty("ADBE Text Animator"); A.name = "Reveal";
S_in= A.property("ADBE Text Selectors").addProperty("ADBE Text Selector");     // Range Selector "In"
props = A.property("ADBE Text Animator Properties");
props.addProperty("ADBE Text Opacity").setValue(0);
props.addProperty("ADBE Text Blur").setValue([50,50]);          // Ignace: blur 50
// optional: ADBE Text Scale 3D = [0,0,0] (Jake), ADBE Text Position 3D = [0,40,0]
adv = S_in.property("ADBE Text Range Advanced");
adv.property("ADBE Text Range Shape").setValue(2);              // 2 = Ramp Up
adv.property("ADBE Text Levels Min Ease").setValue(100);        // "Ease Low" 100 (Jake)
adv.property("ADBE Text Range Type2").setValue(1);              // 1 chars, 3 words
off = S_in.property("ADBE Text Percent Offset");
off.setValueAtTime(t0, -100); off.setValueAtTime(t0 + f(30), 100);   // Jake: 30 f; use 12–20 f for social pace
// out: duplicate selector → S_out, Shape = 3 (Ramp Down), offset keys shifted to the exit
// tighter cascade: End = 25–50 % (Jake: "25% … happens a lot more tightly")
// scale from centre: L.Text.property("ADBE Text More Options").property("ADBE Text Anchor Point Align") = [0, -capHeight/2]
```
For word-by-word captions, set `Range Type2 = 3` (words). For talking heads at roughly 150–180 wpm, synced builds need **~5–7 f per word at 30 fps** (08 Kanda measured ~0.2 s/word).

### R5. Typewriter with human timing, or word-by-word with hold keys (B2)
Typewriter preset = range selector `Start` keyed 0→100. Add mid keys with irregular spacing: bursts and pauses. For one word at a time, put keys at each word boundary and set them to hold: `P.setInterpolationTypeAtKey(i, KeyframeInterpolationType.HOLD)`.
- Centre-out typing: key the layer's Position so its left edge starts at comp centre and ends centred, with the same ease as the selector.
- SFX: one key-click per character, or one per word for the hold variant, at -20 dB under VO (inferred level).

### R6. Text pushed out of a drawn line (B1; seen in 11 Craig and 13 Paul E.T.)
```
line = comp.layers.addShape(); path = horizontal, stroke 2 px white;
trim = line.content.addProperty("ADBE Vector Filter - Trim");
trim Start: t0=50 → t1=0 ; End: t0=50 → t1=100   (draw from centre), easy-ease → expo-out
matte = solid/shape covering the area ABOVE the line (bottom edge = line y)
txt (rest above line) Position: t0+f(4) = rest+[0,+60] (below line) → t0+f(16) = rest
txt.setTrackMatte(matte, TrackMatteType.ALPHA)       // AE ≥2023; legacy: matte above txt, txt.trackMatteType = TrackMatteType.ALPHA
second line of copy below: duplicate txt+matte, TrackMatteType.ALPHA_INVERTED, travel upward
```
Start the text when enough of the line has drawn ("don't pop out too early"): roughly 30–40% into the trim.
- 13 Paul E.T. extends this: the line keeps drawing with right-angle steps to the next word, then the next object, and the comp camera (or a parent null) scrolls along the line. Each segment takes ~0.4–0.6 s, timed to VO words.
- SFX: a soft swish for the line, and a tick when each text block lands.

### R7. Text behind the person (B7; seen in 04, 06, 08, 13)
```
plate      = footage layer (bottom)
txt        = text layer (middle)
fg         = plate.duplicate() on top; Roto Brush / segmentation matte → person-only alpha
            (EffectCraft: use its segmentation/roto effect or a hand mask; refine edge, feather 1–2 px)
```
Placement observed in 08 and 04: the word is set **large (cap height ≈ 25–35% of frame), in the upper third**, so the head overlaps 1–3 letters and the word stays readable. The animation is a word-by-word opacity/blur reveal (R4) or a vertical slide-up through a matte.
- 06 "Masking" variant: the word fills in as the walker crosses it, using a matte keyed to the walker's x.
- SFX: a low "boom" or sub hit on the reveal. In 08 it's on the cut-in, with no whoosh.

### R8. Text tracked to the face or an object (B6; B2 3D tracker; seen in 11, 13)
2D (head):
```
tracker point on nose (high-contrast feature), track → apply to Null (not the text directly);
txt.parent = null; txt position offset so text sits BELOW chin (B6) or beside head in the open third.
one pre-comp/segment per sentence (B6) so each text has its own track range.
smooth jitter: null position expression  smooth(0.2, 5)  (inferred; not in source)
```
3D (environment): 3D Camera Tracker, then pick a solver point on the surface, then *Create Text and Camera* (B2). Scale up, push slightly in Z.
- 11 Craig: one word per facade, about 1.2–1.4 s of screen time each, with the camera moving past fast. That gives a word-per-beat cadence without any cuts.
- 13 Paul E.T.: timestamps and title cards sit on a table plate, tracked so they move with a slow push-in.

### R9. Kinetic-type opener: one word per beat, background invert (02, 03, 11, 09)
```
BPM = 120–131 → beat = 0.46–0.5 s = 14–15 f @30
for each word i: new text layer, in = i*beat, out = (i+1)*beat
  bg solid alternates black/white (02, 11) or colour A/B (03 pink/blue)
  entry (choose one per word, rotate through): R2 sink, rotate 30°→0 settle, tracking-blur slide (horizontal motion blur, 3 f),
     per-letter Y jitter settling in 2 f (11 "CREATE"), outline→fill swap (02)
  exit: hard cut on next beat (no exit anim) — or 2-frame directional blur
```
- Measured: 02 runs at 72 cuts/min in Q1 with cuts on beat .52. 03 has 110 hits/min with .57 of cuts carrying a hit.
- SFX: one tick, pop or whoosh per word on the beat. Alternate two samples so they don't machine-gun (inference).

### R10. Number counter, badge swap, and "stat card" (01, 15)
Source Text expression `Math.round(linear(time, t0, t1, a, b)) + "M views"` with expo-out on a slider. Drift the card in 3D: rotation Y about 10–15°, slow camera dolly. In 15 the badge beside the face swaps values in place (50% → 39% → 0.1%) on spoken numbers, with a scale pop of 100→108→100 over 6 f *(inferred amount)*.
- SFX: a short tick per digit change, or one "cash/ding" on the final value.

### R11. Impact camera shake (B5 Video Copilot)
```
P = position; key at impact frame tI and at tI + f(10..15) with SAME value
Wiggler panel ≈ expression: posterizeTime(0) not needed —
  expression on Position:  amp = 25*Math.max(0, 1-(time-tI)/0.5);  (time>=tI)? wiggle(15, amp) : value
  (Kramer: freq 15, mag 25, Jagged, all dims independent; delete jerky last keys, easy-ease into rest)
layer.motionBlur = true; comp.motionBlur = true
fx = plate.Effects.addProperty("ADBE Tile");  output width/height 125, mirror edges ON   // hides black borders
```
On talking heads, scale the magnitude down to 6–12 px at 1080p *(inferred; Kramer's 25 is for a baseball-bat "explosion" hit)* and decay over 8–12 f. SFX: impact or sub boom on frame tI, on the same frame or 1 frame after (W2).

### R12. Speed ramp (B8)
```
L.timeRemapEnabled = true; TR = L.property("ADBE Time Remapping");
keys: A (normal) → B (fast section start) → drag B's value later in source = speed-up; → C → D (speed out)
Speed graph: entering hot → peak velocity at the START of the segment then decelerate
             (out-influence on fast key small, in-influence on landing key large  ⇒ expo-out shape)
exiting:     gradual rise then disappear (mirror)
reverse/boomerang: key a few frames later with an EARLIER source time → plays backwards; use to make
             a clip's motion direction match the next clip (left→right into right→left)
add Pixel Motion Blur (preferred over CC Force Motion Blur per source)
```
Sync: keep the music layer in the comp with its waveform visible (B8: press L twice) and put the fast section on the downbeat. SFX: whoosh across the fast segment, peak at max velocity (W1).

### R13. Legibility over busy footage (B2), in escalation order
1. Drop shadow with high softness and higher opacity: "you can barely see that it's a drop shadow".
2. Black solid under the text at about 20% opacity.
3. Elliptical mask on that solid, large feather (vignette behind the text), then raise opacity carefully: "too far looks muddy".
4. Adjustment layer under the text with Gaussian Blur 40, repeat edge pixels, and a rectangular mask around the text. That gives a frosted panel; add a 1–2 px white shape stroke and Tint (amount low) so it reads as deliberate. This is the glass-card look in 14 and 15.

### R14. Whip/blur exit and zoom-through-letter transition (14; 10's eye push)
Horizontal: Directional Blur (or motion blur on a 1-frame position jump of ±40% width), 2 f. Then scale the last letter of the outgoing word from 100% to 2000% over 4–6 f with expo-in, centred on the letter's counter or stem, cutting to the next shot once the frame is filled.
- 10 Paul does the same with a starfield shot scaled into an eye close-up (a scale match).
- SFX: a whoosh starting 1–2 f before the blur (lead 10–20 ms), a riser under the zoom, and an impact or sub on the first frame of the new shot.

### R15. Strobe montage behind a locked title (12 DUCKLIFE; 07; 04)
Title layer static at centre. Beneath it, a sequence of 1-frame clips (6–8 different shots), then 1–2 s of black hold, then repeat. Elsewhere use bursts of 1–3-frame shots: 07 runs at 228 cuts/min for 4.5 s, 04 has shot_len_p10 of 0.08 s.
- SFX: either a single riser across the burst with an impact at its end, or a "film-flicker" texture (inference). Don't put one hit per frame.

### R16. J/L cuts (B9)
- **J:** the incoming shot's audio starts about 2 s before its picture. Overlap the audio and roll the video edit, with a short constant-power crossfade (a few frames) on the audio.
- **L:** the outgoing audio continues about 2 s under the next picture.
- In AE: offset the audio layer's inPoint versus the video layer's. Crossfade with `ADBE Audio Levels` going -48 → 0 dB over 4–8 f.
- For talking heads, use J-cuts into B-roll sections (ambience first), and L-cuts out of a punchline so the laugh or room tone carries over the next title.

### R17. SFX layering stack (W1, W2, W3, B10; densities from the measured reels)
| Event | Layers | Timing | Level *(W1 relative to dialogue normalised to -6 dB)* |
|---|---|---|---|
| Whip / transition | core whoosh, plus optional air layer (HF), plus sub rumble | starts 10–20 ms (≈0–1 f) **before** the motion; peak on the fastest frame; length ≈ transition length (0.5 s transition → 400–500 ms) | -18 to -12 dB |
| Text slam / reveal | impact transient (drum/metal), plus sub boom | 1–2 f **after** the reveal starts (W2) | under the VO; peak just below the music downbeat |
| Build into a drop or reveal | riser (or reversed impact, W3) | ends abruptly on the cut / first frame of the reveal | ramps up |
| Word pop / UI tick | click / pop / ui-tick | on the frame the word becomes ≥50% opaque | quiet; alternate two samples |
| Exit | whoosh with a fade-out on its tail (B10) | — | — |

EQ for whooshes (W1): HPF at 80–100 Hz, broad +1–3 kHz, gentle shelf above 10 kHz. Wide shots get distance processing, i.e. more reverb and less top (B10).

---

## 5. Batch synthesis
