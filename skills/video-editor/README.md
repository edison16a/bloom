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
