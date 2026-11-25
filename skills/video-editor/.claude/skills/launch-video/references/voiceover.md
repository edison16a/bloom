# AI voice (free, local, open source)

Use it when a film needs narration and nobody recorded it. Everything runs on this Mac: no keys, no cost, no uploads. It is automatic. Do not wait for the user to pick a voice.

## Engines (`tools/voice/`)
| Engine | Licence | Use it for |
|---|---|---|
| **Qwen3-TTS VoiceDesign** (`qwen-design`) | Apache 2.0 | A new voice from a written description. **The default** |
| **Qwen3-TTS Base** (`qwen-clone`) | Apache 2.0 | Cloning a 5 to 15 s clean clip with its exact transcript |
| **Chatterbox** (`chatterbox`) | MIT | A second option. `exaggeration` 0.5 to 0.8 adds energy, `cfg` 0.3 to 0.4 slows it |

If `.venv-qwen` or `.venv-cb` is missing, run `tools/voice/setup.sh` without asking. Never use XTTS-v2 or F5-TTS, their weights forbid commercial use.

## Consent
- Clone only a voice the user owns, or a teammate who said yes.
- If the user likes a voice in someone else's film, describe it (age, pitch, pace, accent, how sentences end) and design a new one.
- Say the voice is AI in the delivery note. Offer a small "Voice: AI" line for the post.

## Steps
1. **Script for the ear** in `work/JOB/vo/script.txt`, one line per beat, 6 to 14 words. Say the outcome, do not narrate what is visible. Spell it as it is said ("97.7%" is "ninety seven point seven percent"). Pace: 150 to 170 words a minute for a launch, 130 to 145 for a calm film.
2. **Choose** by the film: calm film, `keynote-m`; energetic launch, `founder-m` or `founder-f` from `voices.json`. Render one line in three voices with `vo.py audition`, keep the one with the best word accuracy and the pace nearest the target. Put the other two in the delivery note so the user can swap.
   `python3 tools/voice/vo.py audition --text "LINE" --voices tools/voice/voices.json --out work/JOB/vo/audition`
3. **Takes:** `python3 tools/voice/vo.py gen --script work/JOB/vo/script.txt --voice work/JOB/vo/voices.json:NAME --takes 3 --out work/JOB/vo`. Each take is transcribed and scored for word errors, pace and odd pauses, and the best is kept. A line marked `CHECK` gets reworded or more takes.
4. **Assemble:** `python3 tools/voice/vo.py assemble --dir work/JOB/vo --gap 0.28`. Gives `vo.wav` at -16 LUFS and `words.json` with every word's time.
5. **Cut to the words.** Each beat starts on the word that names it. Music hits go in the gaps between lines.
6. **Mix** as in `../production-video-editing/references/sound.md`.
