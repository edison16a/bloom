# Video Editor

A Claude Code workspace that makes finished films. Put clips in `input/`, give a direction, a website and a repo, and the edit lands in `output/`.

Two kinds of film, each with its own skill:
- **A person with overlays** (`production-video-editing`). Founder updates, interviews, ads, Reels, TikToks, Shorts. The speaker stays on screen, the camera stays still, and the product, messages, images and phrases appear as quiet overlays beside them with plain white text.
- **A product film** (`launch-video`). Launches, demos, promos. Real product captures with smooth camera and UI motion, short plain lines, real archive footage, real music.

Everything is built in **EffectCraft**, driven by Claude through MCP. Product clips, music, sound effects, footage and the voice are found, captured or made automatically, with a licence log. Music is always real and searched online, never generated.

## What you need installed

| Requirement | Why | Check |
|---|---|---|
| **Claude Code** (CLI or the desktop app's Code tab) | Runs the skills | `claude --version` |
| **ArtCraft: EffectCraft** (FilmCraft and PhotoCraft optional) | The editor | `/Applications/EffectCraft.app` |
| **The ArtCraft MCP servers** | Let Claude drive the apps | `claude mcp list`, see `.mcp.json.example` |
| **ffmpeg**, **Python 3 with numpy and OpenCV** | Probing, plates, mastering, checks | `ffmpeg -version` |
| **Xcode command line tools** (macOS) | Person matte (Apple Vision) | `swiftc --version` |
| **Node.js and Google Chrome** | Recording your site and app | `node -v` |
| **yt-dlp** | Finding footage and phrases | `yt-dlp --version` |
| **whisper-cpp and uv** | Word timed transcripts, local voice | `whisper-cli --help` |

`./setup.sh` checks everything. Claude installs what is missing as it works.

### Connecting EffectCraft to Claude Code
1. Install ArtCraft and open EffectCraft once.
2. Add the MCP server. The ArtCraft launcher's "Connect to Claude" option does this, or copy the entries from `.mcp.json.example` into your Claude Code config with `claude mcp add …`. EffectCraft's bridge listens on port 9877.
3. Restart Claude Code in this folder and check with `claude mcp list`.

## How to use it
1. Open this folder in Claude Code.
2. Drop footage, screenshots or a logo into `input/`. Originals are never changed.
3. Ask in plain words:
   - "Edit `input/founder.mp4` into an update. Here is our site and repo."
   - "Make a 35 second launch film for our app. Here is the URL."
   - "Cut a vertical version."
   - "Use Vendo as the reference." The [reference films](.claude/skills/production-video-editing/references/references-studied.md) are linked. Claude works from its notes on them and only opens a film when you ask.
4. Claude shows a one page plan, keeps going, checks its own output and puts the film in `output/`, with a list of licences. Project files are in `work/<job>/`.

## What is in here
```
CLAUDE.md                        the workflow and the never list
setup.sh                         checks the requirements
.claude/skills/
  production-video-editing/      person with overlays: look, reference films, sound, sourcing, EffectCraft, vertical, VFX, gate
  launch-video/                  product films: shapes, motion, AI voice
tools/
  source.py                      finds and downloads music, effects, footage and spoken phrases, with licences
  capture/                       records a website or app at 2x, with click times
  matte/                         separates person and room so overlays sit between them
  voice/                         local AI voice (Qwen3-TTS, Chatterbox)
  fonts/                         Instrument Serif (OFL)
  measure.py                     cuts, tempo, loudness, contact sheets
input/  output/  work/           your files, finished films, per job projects (not committed)
research/                        old measurements, kept as history, not used by the skills
```

## Limits
- Claude cannot hear. Sound is chosen and checked by measurement.
- A webcam in a bedroom will not look like a film set. A window, a lamp or a second angle helps more than any effect.
- Clips from other people's videos are only used when you ask, and are listed as unlicensed.
