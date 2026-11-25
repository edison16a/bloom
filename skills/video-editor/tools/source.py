#!/usr/bin/env python3
"""Find, download, measure and pick real music, sound effects and footage for an edit. No account, no API key.

  source.py music  --job JOB --mood energetic,propulsive --genre electronic --bpm 115-135 --need 70 [--n 6]
      Searches Mixkit, Incompetech and Openverse (Jamendo), downloads the best N, measures each one
      (BPM, beat strength, loudness, intro length, dips, the biggest lift), ranks them, writes music/ranking.json.
  source.py sfx    --job JOB click typing notification whoosh [--n 2]
      Searches Mixkit and Openverse (Freesound, CC0/CC BY). Saves the N best per word, trimmed to the onset.
  source.py video  --job JOB "rocket launch" [--from stock,nasa,commons,archive] [--n 4] [--max-mb 250]
      Real footage. stock = Mixkit. nasa, commons and archive = historical, public domain or Creative Commons.
  source.py youtube --job JOB "apollo 11 launch" [--n 4]          CC BY videos only (search + download)
  source.py youtube --job JOB --url URL --section 61-69 --third-party "why this clip"
      A short excerpt (12 s max) of someone else's video. Use only when the brief asks for that clip or speech.
      It is logged as UNLICENSED and must be listed in the delivery note.
  source.py phrase --job JOB FILE "we choose to go to the moon" [--pad 0.15]
      Transcribes FILE with word times, finds the phrase and cuts that moment out (picture + sound).
  source.py credits --job JOB       Print the licence log and the credit lines that must be published.

Everything lands in work/JOB/assets/{music,sfx,video}/ and every download adds a row to work/JOB/assets/licences.json.
"""
import argparse, html, json, math, os, re, subprocess, sys, tempfile, time, urllib.error, urllib.parse, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BOT = "video-editor-asset-finder/1.0"      # Wikimedia asks automated clients to identify themselves and refuses fake browsers
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36"
MIXKIT = "Mixkit Free License (commercial use, no credit needed)"
CAP = 8          # downloads per call: Mixkit forbids bulk downloading, so stay at what one edit needs
WHISPER = [os.environ.get("VO_WHISPER_MODEL", ""), os.path.expanduser("~/.config/atticus/whisper/ggml-large-v3-turbo-q5_0.bin"),
           os.path.expanduser("~/.cache/openwhispr/whisper-models/ggml-small.bin"),
           os.path.join(os.path.dirname(os.path.abspath(__file__)), "voice/models/ggml-small.en.bin")]

