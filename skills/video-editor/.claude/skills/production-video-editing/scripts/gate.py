#!/usr/bin/env python3
"""Check an edit against the rules before it is delivered. Nothing here replaces looking at the frames.

Usage: python3 -I gate.py RENDER --script build.jsx [--srt file.srt] [--plate speaker.mov] [--end 70.9] [--type person|product]

1. On-screen text (build script, plan, srt, licences): no dash characters, middle dots, bullets, arrows, emoji or double hyphens.
2. Animation calls that the rules forbid for people (scale keys on the plate, typewriter, bounce).
3. Loudness near -14 LUFS, true peak at or under -1 dBTP, with audio present the whole way.
4. Video: no black frames except at the end, no frozen picture for over 4 s in a person film (a still speaker means the source is broken).
5. With --plate: hold_check.py (the speaker stays visible and is never zoomed).
"""
import argparse, re, subprocess, sys, pathlib, json
BAD = {'·': 'middle dot', '•': 'bullet', '—': 'em dash', '–': 'en dash', '→': 'arrow', '←': 'arrow', '⮕': 'arrow', '●': 'dot', '○': 'circle', '✓': 'check mark', '✔': 'check mark', '…': 'ellipsis character'}
EMOJI = re.compile('[\U0001F300-\U0001FAFF☀-➿]')
def check_text(name, s, out):
    for i, line in enumerate(s.splitlines(), 1):
        for ch, what in BAD.items():
            if ch in line: out.append(f'{name}:{i}: {what}: {line.strip()[:80]}')
        if EMOJI.search(line): out.append(f'{name}:{i}: emoji: {line.strip()[:80]}')
def strings(js):
    t = re.sub(r'//[^\n]*', '', js); t = re.sub(r'/\*.*?\*/', '', t, flags=re.S)
    return [m.group(2).encode().decode('unicode_escape', 'ignore') if '\\u' in m.group(2) else m.group(2) for m in re.finditer(r"(['\"])((?:\\.|(?!\1).)*)\1", t)]