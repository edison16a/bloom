#!/usr/bin/env bash
# Sets up the local AI voice and the transcriber. Safe to run again. macOS on Apple silicon.
set -e
cd "$(dirname "$0")"
command -v uv >/dev/null || brew install uv
command -v whisper-cli >/dev/null || brew install whisper-cpp
[ -d .venv-qwen ] || { uv venv -p 3.12 .venv-qwen; uv pip install -p .venv-qwen/bin/python "mlx-audio==0.6.7" soundfile; }
[ -d .venv-cb ] || { uv venv -p 3.12 .venv-cb; uv pip install -p .venv-cb/bin/python "chatterbox-tts==0.1.7" "setuptools<80"; }
mkdir -p models
[ -f models/ggml-small.en.bin ] || curl -fL -o models/ggml-small.en.bin https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.en.bin
echo "voice ready (the Qwen model downloads the first time it speaks)"
