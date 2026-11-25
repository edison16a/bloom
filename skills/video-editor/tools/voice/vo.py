#!/usr/bin/env python3
"""Local AI voiceover: free open-source engines (Qwen3-TTS via mlx-audio, Chatterbox) on this Mac.

  vo.py audition --text "One line" --voices voices.json --out work/<job>/vo/audition
      Render the same line in every voice of voices.json, so the user can pick by ear.
  vo.py gen --script script.txt --voice voices.json:<name> --takes 3 --out work/<job>/vo
      Render every script line N times, then QC each take (re-transcribe, word error, pace, loudness).
  vo.py assemble --dir work/<job>/vo [--pick picks.json] [--gap 0.28]
      Clean the chosen takes (trim, high-pass, de-ess, compress), join them, write vo.wav + words.json.

voices.json: {"name": {"engine": "qwen-design"|"qwen-clone"|"chatterbox", "instruct": "...",
  "ref_audio": "path", "ref_text": "...", "exaggeration": 0.5, "cfg": 0.5, "temperature": null, "speed": 1.0}}
Script: one VO line per non-empty line; lines starting with # are notes. Write it for the ear.
Pronunciation: "# say: Coere = Koh-eer" in the script (or --say "Coere=Koh-eer") respells a word for the engine only;
QC still compares against the real spelling and forgives that word, since whisper can't spell brand names.
"""
import argparse, json, os, re, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
PY = {"qwen": os.path.join(HERE, ".venv-qwen/bin/python"), "cb": os.path.join(HERE, ".venv-cb/bin/python")}
QWEN = {"qwen-design": "mlx-community/Qwen3-TTS-12Hz-1.7B-VoiceDesign-bf16",
        "qwen-clone": "mlx-community/Qwen3-TTS-12Hz-1.7B-Base-bf16"}
WHISPER_MODELS = [os.environ.get("VO_WHISPER_MODEL", ""),
                  os.path.expanduser("~/.config/atticus/whisper/ggml-large-v3-turbo-q5_0.bin"),
                  os.path.expanduser("~/.cache/openwhispr/whisper-models/ggml-small.bin"),
           os.path.join(HERE, "models/ggml-small.en.bin")]


def sh(cmd, **kw):
    return subprocess.run(cmd, capture_output=True, text=True, **kw)


def load_voice(spec):
    path, _, name = spec.partition(":")
    voices = json.load(open(path))
    if not name: name = next(iter(voices))
    v = dict(voices[name]); v["name"] = name
    for k in ("ref_audio",):
        if v.get(k): v[k] = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(path)), v[k]))
    return v

