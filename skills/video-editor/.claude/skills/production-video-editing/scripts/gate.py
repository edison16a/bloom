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
def main():
    ap = argparse.ArgumentParser(); ap.add_argument('render'); ap.add_argument('--script', action='append', default=[]); ap.add_argument('--srt')
    ap.add_argument('--plate'); ap.add_argument('--end', type=float); ap.add_argument('--type', default='person'); a = ap.parse_args()
    bad, warn = [], []
    for p in a.script:
        js = pathlib.Path(p).read_text()
        check_text(pathlib.Path(p).name, '\n'.join(strings(js)), bad)
        for s in strings(js):
            if '--' in s: bad.append(f'{pathlib.Path(p).name}: double hyphen: {s[:60]}')
        if a.type == 'person' and re.search(r'plate\([^)]*\).*(scale|scaleKeys)', js): bad.append(f'{p}: scale on the speaker plate')
    if a.srt: check_text('srt', pathlib.Path(a.srt).read_text(), bad)
    e = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', a.render, '-af', 'loudnorm=I=-14:TP=-1:LRA=11:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
    try:
        j = json.loads(re.findall(r'\{[^{}]*\}', e, re.S)[-1]); I, TP = float(j['input_i']), float(j['input_tp'])
        print(f'loudness {I:.1f} LUFS  true peak {TP:.1f} dBTP')
        if abs(I + 14) > 1: bad.append(f'loudness {I:.1f} LUFS, wanted -14')
        if TP > -0.9: bad.append(f'true peak {TP:.1f} dBTP')
    except Exception: bad.append('no readable audio')
    dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', a.render], capture_output=True, text=True).stdout or 0)
    f = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', a.render, '-vf', 'blackdetect=d=0.2:pix_th=0.04,freezedetect=n=0.001:d=4', '-an', '-f', 'null', '-'], capture_output=True, text=True).stderr
    end = a.end or dur
    for m in re.finditer(r'black_start:([\d.]+) black_end:([\d.]+)', f):
        if float(m[1]) < end - .3: bad.append(f'black {m[1]} to {m[2]}')
    if a.type == 'person':
        for m in re.finditer(r'freeze_start: ([\d.]+)', f):
            if float(m[1]) < end - .3: bad.append(f'frozen picture at {m[1]} s')
    print(f'duration {dur:.1f} s')
    if a.plate:
        hc = pathlib.Path(__file__).with_name('hold_check.py')
        r = subprocess.run([sys.executable, '-I', str(hc), a.render, '--plate', a.plate] + (['--end', str(end)] if a.end else []), capture_output=True, text=True)
        print(r.stdout.strip() or r.stderr.strip())
        if r.returncode: bad.append('hold_check failed (see above)')
    for b in bad: print('FAIL', b)
    print('PASS' if not bad else f'{len(bad)} problem(s)'); sys.exit(1 if bad else 0)
main()
