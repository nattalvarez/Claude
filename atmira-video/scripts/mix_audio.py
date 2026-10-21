#!/usr/bin/env python3
"""Mezcla de audio idéntica a la de la composición (música ×0.9 + un bloque de voz por escena en su frame exacto),
hecha con ffmpeg: evita renderizar todos los fotogramas solo para obtener el audio. Salida: out/seg/audio.wav (48 kHz)."""
import json, subprocess, os
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
tl = json.load(open(f"{R}/src/data/timeline.json"))
au = json.load(open(f"{R}/src/data/audio.json"))["blocks"]
FPS = 25
inputs = ["-i", f"{R}/public/audio/music.mp3"]
chains = ["[0:a]aresample=48000,aformat=channel_layouts=stereo,volume=0.9[m]"]
labels = ["[m]"]
k = 1
for sc in tl["scenes"]:
    for v in sc["voice"]:
        f = au[v["id"]]["file"]
        if not f:
            continue
        ms = round((sc["start"] + v["from"]) / FPS * 1000)
        inputs += ["-i", f"{R}/public/{f}"]
        chains.append(f"[{k}:a]aresample=48000,aformat=channel_layouts=stereo,adelay={ms}|{ms}[v{k}]")
        labels.append(f"[v{k}]")
        k += 1
total = tl["total"] / FPS
fc = ";".join(chains) + ";" + "".join(labels) + f"amix=inputs={len(labels)}:normalize=0:duration=longest,atrim=0:{total:.3f},volume=2.5dB,alimiter=limit=0.93:level=false[out]"
os.makedirs(f"{R}/out/seg", exist_ok=True)
subprocess.run(["ffmpeg", "-y", "-v", "error", *inputs, "-filter_complex", fc, "-map", "[out]", "-c:a", "pcm_s16le", "-ar", "48000", f"{R}/out/seg/audio.wav"], check=True)
print("OK", total, "s")
