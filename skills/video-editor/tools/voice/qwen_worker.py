# Qwen3-TTS worker (runs inside .venv-qwen). Called by vo.py with a JSON job file.
# job = {"model": repo, "instruct": str|None, "ref_audio": path|None, "ref_text": str|None,
#        "temperature": float|None, "speed": float, "lines": [{"text", "out", "seed"}]}
import json, sys
import mlx.core as mx
import numpy as np
from mlx_audio.audio_io import write as audio_write
from mlx_audio.utils import load_audio
from mlx_audio.tts.utils import load_model

job = json.load(open(sys.argv[1]))
model = load_model(model_path=job["model"])
ref = load_audio(job["ref_audio"], sample_rate=model.sample_rate) if job.get("ref_audio") else None
for ln in job["lines"]:
    mx.random.seed(int(ln["seed"]))
    kw = dict(text=ln["text"], speed=job.get("speed", 1.0), lang_code="en", verbose=False)
    if job.get("instruct"): kw["instruct"] = job["instruct"]
    if ref is not None: kw.update(ref_audio=ref, ref_text=job["ref_text"])
    if job.get("temperature") is not None: kw["temperature"] = job["temperature"]
    chunks = [np.array(r.audio) for r in model.generate(**kw) if r.audio.size]
    audio_write(ln["out"], np.concatenate(chunks), model.sample_rate, format="wav")
    print("ok", ln["out"], flush=True)
