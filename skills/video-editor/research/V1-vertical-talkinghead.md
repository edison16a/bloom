# V1 — Vertical talking-head Shorts (creators, founders, podcast clips)

25 YouTube Shorts, 9:16, measured with `tools/measure.py` (downloads came in at 360x640, so caption text in sheets is soft; layout and timing are still readable). All from official channels, posted 2025–2026. Durations 24–101 s. Two over-length picks (YC "Engineers Make Great Founders", 159 s; DOAC "Orange Juice", 114 s) were dropped and replaced with Starter Story Shorts. Three kept clips run a little over 90 s (#05 90 s, #06 99 s, #11 101 s).

## Measurement caveats (read first)
- **Cuts are undercounted for this format.** `scdet` (threshold 12) misses most same-angle jump cuts and digital punch-ins (100%→115% scale on the same take). It also misses B-roll that sits inside a fixed window (Dan Koe photo cards, Starter Story's 16:9 window). Hormozi #01 shows 1 cut, but the sheet shows at least 6 different framings. Read cuts/min as "angle or source changes", not "edits". The real visual-change rate (caption swap + punch + pop-in) is far higher. Caption swaps alone run about every 0.4–0.8 s (see synthesis).
- **The BPM, beat-strength and hits/min numbers are not reliable here.** Every clip is speech-dominant, and the detector picks up syllables and plosives as beats and transients. BPM sits at 71–105 and hugs the 70 floor of the search. Beat strength comes out at 1.8–3.3 even for clips that show no sign of music (Leila #16 scores 3.34). Hits/min reads 40–95 for every clip, including single-take clips with no graphics. Don't read these as music or SFX evidence. The one outlier is #10 (Codie GTA), at beat strength 7.19 and 105 BPM. That is very likely a real music bed or the trailer's music under the GTA clip (inference).
- `cuts_on_beat_share` is therefore meaningless for this batch, with a median of 0.12. `cuts_with_hit_share` is partly meaningful: when it's high (#02 0.67, #09 0.54, #12 0.60, #19 0.53), the cut lands on a transient. That's either a whoosh/hit SFX or a hard consonant (inference).
- Two digital-silence holes in #11 DOAC (−64.7 dB at 53 s, −81.9 dB at 83 s) produce the fake "+67 dB lift". These are most likely 1 s mutes: a censored word, or a deliberate dead-air beat before a reveal (inference).
- Flow strings are mostly `.`, which means static. The `←/→` runs are handheld drift, gestures or whip-pans, not designed camera moves, except in #05 (a whip-pan), #14/#15 (handheld product B-roll) and #19/#20 (moving B-roll clips).

## 1. Table

| # | Title / channel / URL | Len s | Cuts/min | Med shot s | BPM (str)* | LUFS | Hits/min* | % on beat* | % cut w/ hit | Speech | Dominant flow | Distinctive |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 01 | If you don't do anything… / Alex Hormozi / youtu.be/NBwqKG0odHM | 35.6 | 1.7 (under-count) | 17.8 | 75 (2.21) | −25.3 | 40.5 | – | 0.00 | 0.31 | static | Single take, punch-in jump cuts, small white 2–3-word captions mid-chest, italic for quoted speech |
| 02 | Bigger houses or a bigger team / Alex Hormozi / youtu.be/Ss78JQsu4p8 | 56.0 | 3.2 | 12.9 | 95 (2.43) | −14.5 | 63.2 | 0.67 | 0.67 | 0.25 | static | Q&A: audience question captioned in yellow italic, answer in white with bold keywords |
| 03 | How I'd Scale A Wedding Photography Business / Alex Hormozi / youtu.be/UPfV72GQvr0 | 38.5 | 1.6 | 19.2 | 96 (2.31) | −19.7 | 62.4 | 0.00 | 1.00 | 0.39 | static | DM-style question card ("Jules" + question) as hook for 2 s; "→" arrows inside captions |
| 04 | My top 5 productivity apps / Ali Abdaal / youtu.be/WXnioZZVXtA | 28.2 | 0 (single take) | 28.2 | 74 (2.30) | −19.7 | 49.0 | – | – | 0.43 | static | Top header: app icon + name typed on letter by letter, handwritten sub-label with curved arrow; karaoke pill captions |
| 05 | What I got wrong about freedom in my 20s / Ali Abdaal / youtu.be/iACc_7N7QnU | 89.9 | 22.7 | 1.0 | 90 (2.55) | −23.8 | 59.4 | 0.26 | 0.26 | 0.37 | ←/→ late | Illustrated essay: cut-out head stickers on paper texture, handwriting type-on, archival montage; cut rate 0→5→40→45/min by quarter |
| 06 | How I made £3,000 as a medical student / Ali Abdaal / youtu.be/nQVMKFkAzkk | 98.7 | 10.3 | 4.1 | 72 (1.77) | −17.1 | 79.0 | 0.12 | 0.29 | 0.30 | static/← | Title blob hook, chat-bubble and thought-bubble animations, rack-focus blur transitions, numbered takeaways |
| 07 | If you don't know what skill to learn… / Dan Koe / youtu.be/cS9g8Z7Z5oY | 55.9 | 1.1 (under-count) | 28.0 | 91 (2.01) | −23.0 | 63.3 | 0.00 | 0.00 | 0.31 | static | 3 s black-screen text-only cold open; stock-photo cards under the caption change every 1–2 s |
| 08 | All it takes is 6 months / Dan Koe / youtu.be/Wf0V7Zd2t_w | 25.4 | 2.4 | 12.7 | 74 (2.82) | −14.6 | 94.5 | 0.00 | 0.00 | 0.40 | static | 6 s black-screen VO text hook, then cut to face; minimal graphics |
| 09 | Finding a Dream Job in 2026 / Codie Sanchez / youtu.be/ENpW-gCD3H4 | 50.1 | 15.6 | 2.6 | 72 (2.17) | −21.0 | 59.9 | 0.15 | 0.54 | 0.56 | static | 2-cam alternation every 2–4 s; serif+sans two-line captions; "Boss:/Employee:" role-play labels |
| 10 | The Hidden GTA VI Cash Cow / Codie Sanchez / youtu.be/yb5MSmJ6WBM | 67.5 | 13.3 | 3.5 | 105 (7.19, real beat likely) | −24.0 | 48.9 | 0.20 | 0.27 | 0.28 | static | Selfie newsjack: stacked split-screen (B-roll top / face bottom), logo pop-ins, article highlights, subscribe-button CTA |
| 11 | $5 BILLION NVIDIA SPY OPERATION / The Diary Of A CEO / youtu.be/Cz-sbWva2fA | 101.0 | 14.3 | 1.0 | 71 (1.77) | −16.1 | 65.3 | 0.12 | 0.12 | 0.26 | static | Documentary graphics (dark globe, target rings, data cards); 1-word captions colour-coded per speaker |
| 12 | $14k MRR app (AI) / Starter Story / youtu.be/23s0ut1QBc4 | 38.9 | 15.4 | 4.0 | 100 (2.16) | −14.5 | 64.8 | 0.20 | 0.60 | 0.32 | static | 16:9 window on black, fixed 3-line headline on top, purple active-word captions below; yellow $ number stamps |
| 13 | HOW SPIES ARE TRAINED TO HONEYTRAP / The Diary Of A CEO / youtu.be/M-FACdo_bfY | 77.2 | 17.1 | 2.4 | 72 (1.98) | −16.1 | 75.4 | 0.18 | 0.41 | 0.27 | static | White-box title hook; red-tint flash frame with "Like" button pop; 3-person cutting with reaction shots |
| 14 | iPhone Duo is here / Marques Brownlee / youtu.be/R6yNUnRXZ64 | 69.9 | 8.6 | 5.7 | 83 (2.14) | −21.9 | 61.0 | 0.10 | 0.40 | 0.41 | → / ← handheld | Product-first hook; giant thin outlined "DUO" type behind the phone; numbered chapter tags "1. THE SHAPE"; no word captions |
| 15 | This can SEE Sound! / Marques Brownlee / youtu.be/ai1gIWacf0I | 90.4 | 8.6 | 6.6 | 74 (1.84) | −20.5 | 51.8 | 0.08 | 0.15 | 0.40 | → handheld | ALL-CAPS outlined captions; stacked reaction split in the hook; Amazon listing with highlighter; open-ended "So… what happened there" end |
| 16 | Successful people never chase money / Leila Hormozi / youtu.be/CkliNaBlgJc | 23.8 | 0 | 23.8 | 76 (3.34) | −14.5 | 73.3 | – | – | 0.22 | static | Control case: one locked podcast shot, white title box fades out at 2 s, small 2-line captions |
| 17 | Whether to quit your job / Leila Hormozi / youtu.be/ppcAwHfgOpg | 41.4 | 1.4 | 20.7 | 79 (2.24) | −14.3 | 63.8 | 0.00 | 0.00 | 0.39 | static | Question title card hook (1.2 s); single take with one punch; italic quotes |
| 18 | Being a better person > money / GaryVee / youtu.be/m34rQHDNhqQ | 32.6 | 3.7 | 8.9 | 98 (2.56) | **−10.8** | 58.9 | 0.00 | 0.00 | 0.16 | ← drift | Square rounded-corner window on black; 1-word captions; loudest clip in the batch |
| 19 | True Definition Of Safety / Chris Williamson / youtu.be/9-d61IIHtRU | 69.2 | 14.8 | 3.1 | 78 (2.06) | −14.8 | 72.0 | 0.12 | 0.53 | 0.30 | ← | Rounded-square window; film-clip B-roll; full-frame teal/white thesis cards; mixed serif-italic and sans words |
| 20 | Best Way To View Your Life / Chris Williamson / youtu.be/vZVn9DPomKI | 36.3 | **26.4** | 1.8 | 76 (2.20) | −14.9 | 67.7 | 0.06 | 0.38 | 0.42 | ←/→ | Fastest cutter: window resizes (square ↔ stacked 16:9 strips), white-flash cuts, giant ending caption "YOU ARE." |
| 21 | Night shifts → $1M with 8 apps / Starter Story / youtu.be/R7oRsGkI2nI | 34.8 | 13.8 | 4.0 | 72 (3.01) | −14.7 | 50.0 | 0.12 | 0.00 | 0.24 | static | Same template as #12; narrator VO over founder clips and X/tweet screenshots; cuts speed up (6.9→20.7/min) |
| 22 | LLMs That Write Well / Y Combinator / youtu.be/674Efd5Scfg | 33.5 | 10.8 | 5.3 | 81 (2.56) | −24.1 | 48.4 | 0.17 | 0.00 | 0.33 | static | Wide/close punch alternation every ~5 s; white lower-third name card with orange top rule; plain sentence captions |
| 23 | When to NOT trust your thoughts / Andrew Huberman / youtu.be/FNbTA_W9B5o | 40.9 | 5.9 | 4.0 | 100 (2.15) | −20.8 | 55.8 | 0.25 | 0.00 | 0.32 | static | Black title box with blue outline for 4 s; laugh-reaction cut to the guest; small caps captions |
| 24 | Addiction is a Control Problem / Andrew Huberman (Lembke) / youtu.be/9dWQNg68Ncw | 61.1 | 1.0 | 30.6 | 83 (1.96) | −21.7 | 59.9 | 0.00 | 1.00 | 0.39 | static | Same title-box template; a 61 s single angle, with punch-ins only |
| 25 | Most Unhinged Advice to a Graduate / Codie Sanchez / youtu.be/qeCw_JsYZCc | 31.4 | 21.0 | 2.6 | 75 (2.71) | −16.6 | 63.0 | 0.09 | 0.09 | 0.29 | static | Over-the-shoulder question hook; 3–4 angles; key lines switch to big serif with italic underline on a darkened frame |

\* = unreliable for speech-only content (see caveats).

## 2. Per-video notes

**01 Hormozi – "If you don't do anything"**
- Hook (0–3 s): straight to the claim on a medium close-up, with no title card. The caption appears in the first 0.4 s.
- Structure: single take, 35 s. The framing changes every 3–6 s between 3 scales: medium, tighter, and slightly re-centred (visible in the overview). These are digital punch-ins that scdet missed. The one detected cut, at 30 s, is a hard punch for the final line.
- Text: white sans, about 4% of frame height, 2–3 words per caption at about 60% of frame height (mid-chest, over the mic). The key word is bolder ("self-**help**", "**14**"), quoted inner speech is set in *italics* with quotes, and captions swap every 0.6–0.8 s. There's no visible entry animation at 5 fps (a hard swap).
- Sound: there's no music evidence. The −25 LUFS integrated loudness is quiet for Shorts. The 8 dB lift at 30 s matches the final punch-in.
- Transitions: hard punch-ins only.

**02 Hormozi – "Bigger houses or a bigger team"**
- Hook: the audience member's question plays first. It's captioned in yellow italic, so the viewer knows it isn't Alex speaking.
- Structure: question (0–11 s) → answer (11–56 s), shot on 2 angles (wide whiteboard and closer). Cuts at 11.3, 16.7 and 41.6 s.
- Text: white sans captions at about 50% of frame height. Payload words are bold white ("**deals**", "**bigger deals**", "**$10M houses**", "**zeros**"). Numbers are written as $400K, $10M.
- SFX/music: 2 of 3 cuts coincide with a transient (cuts_with_hit 0.67), which could be a soft hit on the angle change (inference).
- Loop: the last caption, "has to add **zeros**", is the title payoff.

**03 Hormozi – "Scale a wedding photography business"**
- Hook: a DM-style question card for 2 s (bold name "Jules" plus a 3-line question at upper-left, white on the image) while he eats a sandwich. It reads as a "reply to a fan" format. A hard cut at 2.0 s goes into the answer.
- Text: the same white sans with bold keywords. Process steps use ASCII arrows: "**outbound** →", "**wedding planner** →". "**100%**" is bolded.
- Structure: one locked take after the hook, with the jump cuts undetected.

**04 Ali Abdaal – "Top 5 productivity apps"**
- Hook: the header "TOP 5 PRODUCTIVITY APPS" in condensed yellow-orange display type, with 5 app icons popping in left to right at about 0.2 s intervals. A handwritten subline types on underneath ("that I'm using everyday").
- Structure: a list, with each item about 5 s. The header swaps to [app icon + name]. The name types on character by character (about 2–3 frames per letter: "Te" → "Telegram"). A handwritten description with a hand-drawn curved arrow writes on beneath it.
- Captions: a white rounded pill at about 75% of frame height (lower third), with 2–3 words. The active word is black bold and the rest grey (karaoke). The pill sits clear of the bottom 15% UI zone.
- Flow: one locked take. The `Z-` entries at 2 s and 16 s are likely small zoom resets.

**05 Ali Abdaal – "Freedom in my 20s"**
- Hook: a cut-out of Ali (smiling, holding a phone) on a painted autumn and sky background, with an "In my 20s" serif-italic header and handwritten body text typing on line by line.
- Structure: illustrated essay (0–42 s, almost no cuts: Q1 0/min, Q2 5.3/min), then a live-action montage (42–90 s, 40–45 cuts/min). That's the clearest acceleration in the batch. The essay section uses a cut-out head sticker plus "in my 20s / in my 30s" handwriting, with a hand-drawn line animating in from the left. The montage section uses archival phone clips and a 2×2 grid collage, then polaroid photos dropping in with "less freedom.. and much more **fulfilment**".
- Transitions: a whip-pan from Ali to his wife about 3 frames long, with heavy horizontal motion blur (transitions sheet). The flow string shows `←←←` and `→→` in the final third.
- End: handwritten yellow summary text typing on over a 2-shot ("So that's one thing that I've sort of changed…").

**06 Ali Abdaal – "£3,000 a month as a medical student"**
- Hook: he walks toward the camera in scrubs (a natural push-in), under a dark rounded "blob" title: "✨How I made✨ **£3,000** as a *medical student*" (£3,000 in a large teal-to-green gradient serif). The karaoke pill caption runs below.
- Structure: about 10 cuts/min, front-loaded (19.4/min in Q1, then 7.3, 4.9, 9.7). A dark blob label "21 year old full-time medical student" has a hand-drawn arrow pointing at him. An "18 Years old" purple tilted tag and a "−£1,000" red tag sit on an old photo. "Built **Websites**" and "medical school **BMAT exam**" are captioned inside a 2×2 split.
- Graphics: a chat-message sequence (bubbles pop in one at a time with sparkle stars), a thought bubble that types on with yellow keywords, and a numbered takeaway blob ("**1** You can **outsource** things…").
- Transitions: a rack-focus blur-in (frame fully defocused, then sharp over about 6 frames), visible at 3 s and 15 s.

**07 Dan Koe – "What skill to learn"**
- Hook: 0–3 s on pure black with a small white serif caption, "if you don't know / start writing" (a VO-only cold open). A hard cut at 2.9 s to his face.
- Structure: one locked medium close-up for 53 s. Below the caption, a stock-photo card (about 60% of frame width, with a soft dark edge) swaps every 1–2 s, literally illustrating the noun being said (classroom desks for "english class", The Thinker for "think", an empty auditorium for "audience"). scdet doesn't see these swaps because they occupy under 30% of the frame.
- Text: small white sans with a drop shadow, a full phrase on one line, at about 55% of frame height.
- Music: none audible from the metrics (inference). The energy is carried by the image swaps.

**08 Dan Koe – "6 months"**
- Hook: 6 s of black with a centred small caption carrying the VO ("all you have to do is commit for six months… that is not a lot… it's actually very little"), then a cut to his face at 5.8 s.
- After that: a single take with small white captions, 2–3 words each, at about 55% of frame height. Nothing else. LUFS is −14.6 (loud and clean).

**09 Codie Sanchez – "Dream job"**
- Hook: "There was / a guy yesterday" (a serif bold first line plus a light sans second line). At 0.87 s a cut to a still of the Wharton School sign with a black silhouette cut-out, slowly zooming in, with the caption "**MBA** / from Wharton", then "and he's / 54 years old".
- Structure: 2-cam alternation (frontal mid and 3/4 side) every 2–4 s, 15.6 cuts/min, evenly paced (19, 10, 14, 19 by quarter). The middle is a role-play dialogue with speaker labels ("**Boss:**" / "**Employee:**" in bold serif) above the line in light sans. The punchline is "**Boss:** LAYOFFS!".
- Text: a two-line build. Line 1 (serif bold) appears first and line 2 (sans light) appears on the next phrase, at about 55% of frame height.
- 54% of cuts have a transient (inference: soft whooshes or hard consonants at the cut).

**10 Codie Sanchez – "GTA VI cash cow"**
- Hook (0–1 s): selfie at arm's length, "This is wild." in a white highlight box. At 0.83 s a stacked split: the GTA VI logo fills the top half, her face is in the bottom half, and the caption "GTA six" sits on the seam.
- Structure: a newsjack built from stacked split-screens, full-frame B-roll (trailer clip with chromatic-aberration edges and "$1.65 BILLION" in serif fading up over about 4 frames), a highlighted article screenshot (yellow highlighter on key phrases plus a boxed caption word), and pop-in app icons (DoorDash, NBC, YouTube) sliding in at lower-left in sequence. Also a red "X" sticker over a merch photo, a burger cut-out, and a Rockstar logo with "make $$$".
- Captions: 1–2 words per card, black text on a white box, at about 50% of frame height (the box acts as the highlight).
- Transitions: a pixel-sort or glitch frame out of the trailer B-roll (1 frame).
- End CTA: a red YouTube "SUBSCRIBE" button with an animated cursor clicking it, plus "if you want more business ideas".
- Audio: beat strength 7.19 is the only clear beat in the batch, likely a music bed (inference). The loudest lift is +6.6 dB at 61 s (the CTA).

**11 DOAC – "NVIDIA spy operation"**
- Hook: the guest mid-sentence, with a white-box black bold ALL-CAPS title, "HOW A CHINESE SPY TRICKED NVIDIA'S CEO", in the lower third for about 3 s.
- Structure: interview cutting (guest MCU / guest CU punch / host reaction). The host and guest are also shown as a stacked split (host top, guest bottom) for exchanges. Documentary inserts: a dark navy globe with China outlined in red, a "HONEYPOT → TARGET" concentric-ring diagram, a timeline card with photo and "JUN 2024", and Singapore/Malaysia maps with condensed bold data cards ("MEGASPEED", "A STOREFRONT", "2 EMPLOYEES") plus "SOURCE: THE NEW YORK TIMES".
- Captions: 1–2 words, bold sans, colour-coded per speaker (guest green, host yellow), at about 55% of frame height.
- CTA: a "Like" thumbs-up button pops in at about 4 s with an animated tap. A label with a hand-drawn arrow reads "CIA Whistleblower".
- Audio: the two 1 s digital-silence holes (see caveats). There's an orange overexposed "flash" frame on one host shot (a light-leak transition).

**12 Starter Story – "$14k MRR"**
- Layout: a black 9:16 canvas, a 3-line bold white headline fixed at the top for the whole video, a 16:9 video window in the middle, and caption text below the window in white with the active word in purple (karaoke).
- Hook: the founder's own clip with a big yellow outlined "**$115K**" stamp. At 0.5 s "**KRIS**" pops in with a hand-drawn arrow pointing at his head.
- Structure: about 4 s per source. Sources are founder webcam, X post screenshot with yellow highlight, app-store listing, a slow push across a store UI, and "$14,000" yellow stamps over the app page. Red strike-through on "paid ads / influencers" means "didn't need". A "**SAUCE**" yellow sticker slaps onto his mouth area.
- End: a 4-up Zoom-style call grid ("Chris to come break this down").
- cuts_with_hit is 0.60: cuts sit on transients, plausibly whoosh/pop SFX on the stamps (inference).

**13 DOAC – "Honeytrap"**
- Hook: the host's question with a 3-line white-box ALL-CAPS title (censored "S*X"). At about 4 s the frame goes to a red monochrome tint with a "Like" button pop. That's a mid-hook CTA that also works as a colour flash.
- Structure: 3 people (host, guest, second guest) with reaction cuts. 17.1 cuts/min, with a spike in Q2 (28/min) during the guest's explanation. A label with an arrow reads "Russian Honeypot". A HUD-style "HABIT LOOP" diagram overlay (cue → routine → reward) sits on the guest shot.
- Captions: the same as #11, 1–2 words, guest white and host yellow.

**14 MKBHD – "iPhone Duo is here"**
- Hook (0–3 s): product only. A hand holds the phone on a pink backdrop and flips it. At 2.7 s, giant thin condensed white outline letters "DUO" fill the frame behind the phone (text-behind-object), then cut to Marques.
- Structure: numbered chapters, each introduced by a white-box tag in condensed bold, "1. THE SHAPE" / "2. THE CREASE" / "3. THE PRICE". The tag stays on the B-roll that follows. "**$2,000**" is a big boxed number over him. There are no word-by-word captions. The tags are the only text.
- B-roll: handheld macro product shots with rack focus, then screen demos. The flow shows `→ / ←` runs from the handheld moves.
- End: a short reaction beat on him. It's a loop candidate, because the last frame is similar to the first-shot framing (weak).

**15 MKBHD – "This can SEE sound"**
- Hook: the device screen (top half) stacked over Marques reacting (bottom half), "AND IT'S HONESTLY…", then a gesture ("OKAY.").
- Captions: ALL-CAPS white with a dark outline and shadow, 2–4 words, at about 75% of frame height (lower third, above the UI safe zone).
- Inserts: an Amazon listing screenshot with yellow highlight on the product name and price ("$799.00"). Over-the-shoulder demos of the device screen. Outdoor test on a Rivian.
- End: open loop, "SO… WHAT HAPPENED THERE." It ends on a question, which invites a rewatch or comments.

**16 Leila Hormozi – "Never chase money"** (low-edit control)
- Hook: a white rounded box, "Why people can't make money", in black bold sans at about 50% of frame height. It fades out over about 0.4 s at 2 s.
- After that: 22 s, one locked podcast angle, small 2-line white captions. There are no punch-ins, B-roll or SFX. Useful as a baseline for "what minimal looks like".

**17 Leila Hormozi – "Quit your job"**
- Hook: the question card "Should you quit your job?" (white box, black bold) for about 1.2 s while she gestures.
- Single take with one punch at 5.9 s. Small 2-line captions with italic quotes for inner-voice lines. The f-word is censored as "f*cking".

**18 GaryVee – "Better person > money"**
- Format: a rounded-corner square video window (about 1:1) centred on black. Single-word captions in white sans with a soft shadow, at the vertical centre of the window, changing on every word (about 0.25–0.35 s each).
- Structure: 2 detected cuts plus punch-ins. A slow lateral drift (`←←←` in flow) suggests a keyframed Ken Burns or handheld cam.
- Audio: −10.8 LUFS, the loudest in the batch, with a true peak of −0.5 dBTP. It's mastered hot.

**19 Chris Williamson – "Definition of safety"**
- Format: a rounded-square window on black (the same idea as #18). Captions inside the window are mixed: single sans words, with emphasised words swapped to large serif italic (*safety*, *unsafe*, *come*, *existing*, *to happen*). One giant word, "TO… Y?", is half hidden behind the subject.
- Hook: the host asks "favourite… safety is?", then the guest replies "what is it?". At about 3.7 s a full-frame teal card shows "YOU WILL BE OKAY NO MATTER WHAT HAPPENS." in white bold caps. The thesis is shown before it's argued.
- B-roll: film stills and clips (dark, cinematic) with a word on each, and vlog clips of the speaker.
- Full-frame flash cards (teal, or white with teal text: "outside", "no matter", "BUT YOU CAN HANDLE IT.") act as punctuation every 10–20 s.
- 53% of cuts have a transient (inference: whoosh or impact on the card cuts).

**20 Chris Williamson – "View your life"**
- The fastest cutter: 26.4 cuts/min, median shot 1.8 s, 33 → 40 → 13 → 20 cuts/min by quarter. That's dense in the middle and calmer for the argument at the end.
- The window changes shape: rounded square → a short 16:9 strip → two stacked 16:9 strips → back to square (transitions sheet). A 1-frame white flash goes into a cyan/blue-graded club clip.
- Captions: the same mixed sans/serif-italic system. Single emphasised caps words ("HONEST", "VIRTUOUS", "COURAGEOUS" in a pale tint). "fe…ng" is giant behind his head.
- End: "THAT YOUR" → "**YOU ARE.**" The last caption scales up to fill the window width. That's the button.

**21 Starter Story – "Night shifts → $1M"**
- Same template as #12: fixed 3-line headline, 16:9 window, purple active-word captions.
- Sources: founder clip with a "**$1M**" yellow stamp, an old photo in a white card ("Zero rupees."), a product-list page with "**$437,500**" then "**$1,000,000**" stamps, X posts, and a second founder (narrator/host) on a podcast mic.
- Cuts accelerate across the clip: 6.9 → 13.8 → 13.8 → 20.7 per minute by quarter.

**22 YC – "LLMs That Write Well"**
- Hook: a straight-to-camera claim, "As LLMs have gotten better at coding and math, they've actually gotten worse at writing." A white lower-third name card ("Jared Friedman / General Partner, Y Combinator") with an orange top rule slides in at 0.4 s and holds about 4 s.
- Structure: alternates a wide shot (desk visible) and a close shot (chest-up) every 5–6 s: cuts at 5.3, 11.6, 15.4, 20.7, 25.3 and 31.0 s. That's a classic 2-size punch cadence.
- Captions: a white sentence fragment at about 55% of frame height, swapping at phrase boundaries (1–1.5 s), with no highlight. Audio is quiet (−24.1 LUFS).

**23 Huberman – "When to not trust your thoughts"**
- Hook: a black box with a blue outline and white ALL-CAPS 3-line title for about 4 s, at about 50% of frame height.
- Cuts: 4.0 s to the host laughing, then back. 31 and 33 s are reaction cuts. Otherwise a single angle.
- Captions: small white bold sans, phrase-length, at about 55% of frame height.

**24 Huberman – "Addiction is about control"**
- The same blue-outline title box hook for about 2 s, then 61 s on one angle. The framing changes (scale and position) every few seconds, which are punch-ins not counted by scdet. Captions are as in #23.

**25 Codie Sanchez – "Unhinged advice to a graduate"**
- Hook: an over-the-shoulder 2-shot, with the interviewer's question as a 3-line caption in white boxes (black text). The answer starts at 3.7 s.
- Structure: 3–4 angles (wide, medium, close punch). 21 cuts/min, rising from 15.3 in Q1 to 22.9 in Q2–Q4.
- Text: normal lines are black on white highlight boxes. Key lines switch style: the frame darkens (a vignette or −30% exposure), and a large white serif caption builds in 2 lines with the second line in *underlined italic* ("You will have / so much more", "when you have more / ***resources to give***").
- The largest lift (+14.4 dB at 25 s) lands at the peak line (louder delivery, maybe plus music, inference).

## 3. Batch synthesis

### Typical ranges (n = 25; median [IQR])
- Length: 41 s [35–69].
- Cuts/min, as measured (angle or source changes only): **8.6 [1.7–14.8]**, range 0–26.4. Edit-dense creators (Williamson, Codie, DOAC, Starter Story, Ali's essay) sit at **13–26/min**. Founder or podcast single-takes (Hormozi, Leila, Koe, Huberman) sit at 0–4/min measured, but they still change the picture every 3–6 s with punch-ins that scdet can't see.
- Median shot: **5.3 s [3.1–17.8]**. For the edit-dense group it's **1.8–4.0 s**.
- Caption swap interval, read from the 5 fps open sheets (not a waveform metric): **0.25–0.35 s** for 1-word styles (GaryVee, DOAC, Williamson), **0.5–0.8 s** for 2–3-word chunks (Hormozi, Codie, Koe), and about **0.2 s per highlighted word** for karaoke styles (Ali, Starter Story). Even "static" videos change something on screen about 2× per second.
- LUFS: **−17.1 [−21.7 to −14.7]**. That splits into two clusters: the mastered group at **−14.3 to −16.6** (Hormozi Q&A, Koe #08, Codie #25, DOAC, Leila, Williamson, Starter Story) and the un-normalised group at −20 to −25 (Ali, MKBHD, YC, Huberman, Hormozi #01). GaryVee is hottest at −10.8. True peaks reach −0.0 to −1.0 dBTP in the mastered group.
- BPM / beat strength / hits/min: 78 [74–91] / 2.21 [2.06–2.56] / 62 [56–65]. **Unreliable here (speech artefacts).** Only #10 shows a clear musical beat (7.19). Visually, none of the 25 videos cut to a music grid: % cuts on beat is 0.12 [0.03–0.19], which is chance level.

### How pacing changes across the video
- Median cuts/min by quarter: 9.4 → 7.4 → 7.4 → 6.8. **Most are front-loaded.** The hook section is the busiest (title card + first B-roll + first angle change all inside 0–4 s), then the body settles.
- Exceptions that accelerate: Ali #05 (0 → 45/min, a calm essay into a fast montage), Starter Story #21 (6.9 → 20.7), Codie #25 (15 → 23), Williamson #19 (13.9 → 17.4 at the end). Only 7 of 25 clips have Q4 > Q1.
- The common "second wind" is a burst of 3–5 fast cuts or inserts around 55–70% of the runtime (DOAC #13 Q2 spike, Williamson #20 Q2, Ali #06 graphics block at 40–60%). It re-hooks the viewer before the payoff.

### How cuts relate to the beat
- They don't. In this genre the **speech is the metronome**. Cuts land on phrase boundaries, on the stressed word, or on a counted list. DOAC #12 (the dropped orange-juice clip) cut on every spoken number, "five / six / seven / eight", about 0.9 s apart, alternating hand insert and face. Music, when present, is a low bed under the voice: no drops, no lifts timed to visuals. The visual energy comes from caption cadence, punch-ins and inserts, not from the soundtrack.
- (Inference for the skill:) if music is added to a talking-head vertical, keep it low (−20 to −25 dB under the voice), and sync the *inserts* to stressed words rather than to bars.

### SFX density and placement
- The metrics can't separate SFX from speech. What the visuals imply (inference):
  - Pops or clicks on **sticker and icon pop-ins** (Codie app icons, DOAC "Like" button tap, Starter Story $ stamps and "SAUCE" slap, MKBHD chapter tags).
  - **Whoosh** on whip-pans (Ali #05) and on window-shape changes or white-flash cuts (Williamson #20).
  - **Mouse-click** on the subscribe-button CTA (Codie #10).
  - Clips with high cuts_with_hit (#02 0.67, #12 0.60, #09 0.54, #19 0.53) are the ones with the most graphic inserts. That's consistent with hits on inserts.
- What is *not* there: no SFX on every caption word. Captions swap silently. Sound effects are reserved for **objects entering** (stickers, icons, cards), about 3–8 per 30 s in the graphic-heavy edits and 0 in the founder single-takes.

### Text and caption conventions
- **Position:** captions sit in the **middle band, 50–60% of frame height** (over the chest or mic) in 18 of 25 clips. The rest sit in the lower third at about 75% (Ali pills, MKBHD caps), or below a 16:9 window (Starter Story). Nobody puts captions in the bottom 15% (Shorts UI) or the top 10%.
- **Size:** small by TikTok standards. Body captions are about 3.5–5% of frame height, 1–4 words wide, and never wider than about 80% of the frame. "Big" text is reserved for 1–3 moments per video: the title payoff, numbers, and the closing line ("YOU ARE.", "$2,000", "$1,000,000", "LAYOFFS!").
- **Highlighting:** three systems.
  1. Bold or colour keyword inside a white phrase (Hormozi: bold white; Codie: serif bold line 1).
  2. Karaoke active word: Ali (black on white pill, rest grey), Starter Story (purple on white).
  3. Speaker colour-coding: DOAC (guest green or white, host yellow) and Hormozi (questioner yellow italic).
- **Typography mixing:** a sans body, plus *serif italic* for emphasised or emotional words (Williamson, Codie #25, Ali #05/06), ALL-CAPS condensed for chapter or data labels (MKBHD, DOAC maps), and handwritten script for asides or annotations (Ali).
- **Animation:** most caption swaps are hard cuts. Animated entries are reserved for headers and labels: typewriter (Ali app names at about 2–3 frames per letter, Ali handwriting line by line), fade-up with a small drift over about 4 frames ("$1.65 BILLION"), pop or scale on stickers, and a 0.3–0.4 s fade-out on the hook title box (Leila).
- **Hook title box:** a white rounded box with black bold sans (Leila, DOAC, Codie), or a black box with a coloured outline (Huberman). It's 2–3 lines and holds **1.2–4 s**, then gets out of the way.

### Flow and direction rules
- The camera is mostly locked off. Motion comes from **scale changes** (punch-ins between 2–3 sizes), **window-shape changes** (Williamson), and **handheld B-roll** (MKBHD).
- Direction continuity shows up only in Ali's whip-pan (a left-to-right blur matched across the cut) and in MKBHD's product handling. It isn't a governing rule in this genre.
- Layout systems are kept fixed for the whole video so the eye stays put. Examples: Starter Story's top headline + window + caption stack, GaryVee and Williamson's centred window on black, and DOAC's fixed caption band. All movement happens *inside* a stable frame.

### Hooks (first 1–2 s)
Six hook types appear:
1. **Claim straight to camera** with the caption already on frame 1 (Hormozi #01, YC #22).
2. **Question card**: a DM screenshot, title box or interviewer question (Hormozi #03, Leila #16/#17, Codie #25, Huberman).
3. **Black-screen VO text** for 3–6 s (Dan Koe). This one is risky, but it's their signature.
4. **Product or visual first** with giant type (MKBHD "DUO").
5. **Newsjack split-screen** by 0.8 s (Codie GTA: "This is wild." then a logo on top).
6. **Big-number stamp** on the founder at 0 s ("$115K", "$1M", Starter Story).

Every hook puts readable text on screen at frame 0–12. None opens with a logo or a slow fade-in.

### Loop endings
- True seamless loops are rare (none confirmed). Common endings:
  - an **open question** (MKBHD "So… what happened there.")
  - a **scaled-up payoff caption** that mirrors the title (Williamson "YOU ARE.", Hormozi "has to add **zeros**")
  - a **CTA button** (Codie subscribe click, Starter Story "Chris to come break this down")
- Endings are abrupt: the last word lands and the video cuts out within about 0.3–0.5 s. There are no outros, end cards or fades.

### 10 most reusable moves (recipes)
1. **Hook title box (1.5–3 s).** A white rounded rectangle (radius about 12 px at 1080 w), black bold sans 2–3 lines, centred at 45–50% of frame height. It appears on frame 0 (no entry animation). Hold 1.5–3 s, then fade out over 8–12 frames with ease-out. The speaker is already talking under it. SFX: none, or a soft "pop" on frame 0. (Leila, DOAC, Huberman, Codie.)
2. **Punch-in jump cut ladder.** On a single-take talking head, cut between 100% and 112–120% scale (re-centred on the eyes) every 3–6 s at sentence boundaries. Make it a hard cut, no ease. For the last line, punch to about 130%. SFX: none. (Hormozi, YC, Huberman.)
3. **Mid-band chunk captions.** 2–3 words per caption, white sans at about 4.5% of frame height with a soft 30%-opacity shadow, centred at 55–60% of frame height. Hard swap every 0.5–0.8 s on word boundaries. Bold or colour only the payload noun or number. Set quoted inner speech in italics with quotes. (Hormozi, Koe, Codie.)
4. **Karaoke pill.** A white pill behind 2–3 words at about 75% of frame height. The active word is 100% black, the others 45% grey, and the highlight steps per word (about 6–8 frames at 30 fps). (Ali.) A variant: no pill, white text, with the active word in brand colour (Starter Story purple).
5. **Literal noun B-roll cards.** Below or over the caption, a photo card about 60–70% of frame width with soft dark edges. Swap it every 1–2 s to illustrate the noun being said. Hard cuts, no motion, or a 1.00 → 1.05 scale over the card's life. SFX: none. (Dan Koe.) This gets a "static" video to about 40 visual changes/min.
6. **Stacked split-screen insert.** The top half is the B-roll, logo or screenshot and the bottom half is the speaker, with the caption on the seam. Switch from full-frame face to split on the noun, and hold 1–2 s. (Codie GTA, DOAC host and guest, MKBHD #15.)
7. **Number stamp.** A big yellow (#FFD400-ish) heavy sans number with a black outline or shadow, e.g. "$14,000", over the relevant screen. Scale in 0 → 110 → 100% over about 6 frames (overshoot ease). Hold 1–1.5 s. SFX: cash or pop hit on the scale-in (inference). (Starter Story, Ali "£3,000", MKBHD "$2,000".)
8. **Thesis flash card.** A full-frame solid colour (teal #2CCFC4-ish, or white with teal text) with one short line in bold caps. Hard cut in and hold 0.6–1.5 s, then hard cut out. Use 2–4 per minute on the key line. SFX: a low impact or whoosh (inference). (Williamson.)
9. **Emphasis-line style switch.** For the 1–2 lines that carry the meaning: darken the frame about 30–40% (or add a vignette) for the length of the line, switch the caption to a large white serif (about 8% of frame height), and set the second line in italic + underline. Return to normal captions on the next phrase. (Codie #25, Williamson serif-italic words.)
10. **Object pop-ins with UI semantics.** App icons, a "Like" button with a tap, a subscribe button with a cursor click, chat bubbles one at a time, red X or strike-through over a rejected idea. Each enters with a 4–6 frame scale pop (0 → 105 → 100%) and gets a click or pop SFX (inference). Stagger them 0.2–0.4 s apart. (Codie, DOAC, Starter Story, Ali.)

Plus two transition moves worth stealing: the **1-frame white flash cut** into a colour-graded clip (Williamson #20), and the **3-frame whip-pan with horizontal motion blur** between two people (Ali #05).

### Amateur tells the pros avoid
- Captions in the bottom 15%, where the Shorts UI covers them. Also huge full-width captions on every word. The pros keep body text small and save scale for 1–3 payoff moments.
- A logo intro, slow fade-in or "Hey guys" before the claim. Every pro clip has text and the claim inside 0.5 s.
- An SFX on every caption swap. The pros keep caption swaps silent and give sound only to objects that enter.
- Music driving the cut. In this genre the cuts follow speech, and music (when used) stays a quiet bed.
- Mixed layout systems mid-video. The pros lock one frame system (window on black, fixed headline, fixed caption band) and vary only what's inside it.
- Outros and end cards. Pros end on the payoff word, an open question or a one-tap CTA, and cut out within about 0.5 s.
- Long static holds without *any* change. Even the "minimal" pros (Hormozi, Koe) change scale, image or caption every 0.5–6 s. Leila #16 (one locked shot for 24 s) is the closest to a static hold, and it is the plainest clip in the set.
- Inconsistent loudness. The polished clips are mastered at −14 to −16 LUFS with peaks near −1 dBTP. The ones at −20 to −25 LUFS (MKBHD, YC, Ali) play noticeably quieter in the feed.
