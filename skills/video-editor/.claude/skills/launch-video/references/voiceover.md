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
