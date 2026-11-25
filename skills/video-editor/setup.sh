#!/usr/bin/env bash
# Checks what Professional Editor needs. Read-only: installs nothing.
ok(){ printf "  \033[32mok\033[0m   %s\n" "$1"; }
no(){ printf "  \033[31mmissing\033[0m %s  -> %s\n" "$1" "$2"; }
opt(){ printf "  \033[33moptional\033[0m %s  -> %s\n" "$1" "$2"; }
echo "Required:"
[ -d /Applications/EffectCraft.app ] && ok "EffectCraft" || no "EffectCraft" "install ArtCraft (EffectCraft)"
command -v claude >/dev/null && ok "Claude Code CLI" || opt "Claude Code CLI" "or use the Claude desktop app's Code tab"
command -v ffmpeg >/dev/null && ok "ffmpeg" || no "ffmpeg" "brew install ffmpeg"
python3 -c "import numpy" 2>/dev/null && ok "python3 + numpy" || no "python3 + numpy" "pip3 install numpy"
if command -v claude >/dev/null; then
  claude mcp list 2>/dev/null | grep -qi effectcraft && ok "effectcraft MCP server" || no "effectcraft MCP server" "see .mcp.json.example"
fi
echo "Used by the automatic pipeline (Claude installs these when needed):"
python3 -c "import cv2" 2>/dev/null && ok "python3 + opencv" || opt "opencv" "pip3 install opencv-python-headless"
command -v swiftc >/dev/null && ok "swiftc" || opt "swiftc" "xcode-select --install (person matte)"
command -v node >/dev/null && ok "node" || opt "node" "brew install node (product capture)"
[ -d tools/capture/node_modules ] && ok "capture tool" || opt "capture tool" "cd tools/capture && npm install"
[ -d "/Applications/Google Chrome.app" ] && ok "Google Chrome" || opt "Google Chrome" "needed for product capture"
command -v yt-dlp >/dev/null && ok "yt-dlp" || opt "yt-dlp" "brew install yt-dlp"
command -v whisper-cli >/dev/null && ok "whisper-cpp" || opt "whisper-cpp" "brew install whisper-cpp"
command -v uv >/dev/null && ok "uv" || opt "uv" "brew install uv (local voice environments)"
ls tools/voice/.venv-qwen >/dev/null 2>&1 && ok "Qwen voice" || opt "Qwen voice" "tools/voice/setup.sh"
ls ~/Library/Fonts/InstrumentSerif-* >/dev/null 2>&1 && ok "Instrument Serif" || opt "Instrument Serif" "cp tools/fonts/*.ttf ~/Library/Fonts/"
for a in FilmCraft PhotoCraft; do [ -d /Applications/$a.app ] && ok "$a" || opt "$a" "install from ArtCraft"; done
