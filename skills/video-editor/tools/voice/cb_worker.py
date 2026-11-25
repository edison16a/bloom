# Chatterbox worker (runs inside .venv-cb). Called by vo.py with a JSON job file.
# job = {"ref_audio": path|None, "exaggeration": float, "cfg": float, "temperature": float|None,
#        "lines": [{"text", "out", "seed"}]}
import json, sys, warnings
warnings.filterwarnings("ignore")
import torch, torchaudio
from chatterbox.tts import ChatterboxTTS

job = json.load(open(sys.argv[1]))
dev = "mps" if torch.backends.mps.is_available() else "cpu"
model = ChatterboxTTS.from_pretrained(device=dev)
for ln in job["lines"]:
    torch.manual_seed(int(ln["seed"]))
    kw = dict(exaggeration=job.get("exaggeration", 0.5), cfg_weight=job.get("cfg", 0.5))
    if job.get("ref_audio"): kw["audio_prompt_path"] = job["ref_audio"]
    if job.get("temperature") is not None: kw["temperature"] = job["temperature"]
    wav = model.generate(ln["text"], **kw)
    torchaudio.save(ln["out"], wav.cpu(), model.sr)
    print("ok", ln["out"], flush=True)
