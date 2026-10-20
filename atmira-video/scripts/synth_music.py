#!/usr/bin/env python3
"""
Banda sonora original (sintetizada, sin muestras ni licencias de terceros) + efectos, derivada del montaje:

  - lee src/data/timeline.json y src/data/audio.json (tiempos reales de la locución)
  - cama armónica por escena (pad + púas + bajo), energía distinta por bloque
  - ducking automático bajo la voz (la voz siempre en primer plano)
  - whooshes por tipo de transición, carillón en el logotipo, golpes en cada cifra
  - cierre: riser → impacto sincronizado con "es tuya" → resolución luminosa en el logotipo → cola
  - escribe public/audio/music.mp3

Uso:  python3 scripts/synth_music.py
"""
import json
import subprocess
import sys
import wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
SR = 44100
TL = json.load(open(ROOT / "src/data/timeline.json"))
AU = json.load(open(ROOT / "src/data/audio.json"))
FPS = TL["fps"]
TOTAL = TL["total"] / FPS + 1.2
N = int(TOTAL * SR)
rng = np.random.default_rng(20261020)  # determinista

L = np.zeros(N, np.float32)
R = np.zeros(N, np.float32)
MUS_L = np.zeros(N, np.float32)
MUS_R = np.zeros(N, np.float32)
SFX_L = np.zeros(N, np.float32)
SFX_R = np.zeros(N, np.float32)


def mid(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def add(buf_l, buf_r, t0, sig, pan=0.0, gain=1.0):
    """suma una señal mono en estéreo con panorámica (-1..1) a partir de t0 (s)."""
    i0 = int(t0 * SR)
    if i0 >= N or i0 + len(sig) <= 0:
        return
    a = max(0, -i0)
    b = min(len(sig), N - i0)
    s = sig[a:b] * gain
    gl = np.cos((pan + 1) * np.pi / 4)
    gr = np.sin((pan + 1) * np.pi / 4)
    buf_l[i0 + a : i0 + b] += s * gl
    buf_r[i0 + a : i0 + b] += s * gr


def env_ar(n, a, r, curve=2.0):
    t = np.arange(n) / SR
    e = np.ones(n)
    if a > 0:
        e = np.minimum(e, (t / a) ** curve)
    e = np.minimum(e, np.clip((t[-1] - t) / r, 0, 1) ** curve) if r > 0 else e
    return e


def lowpass(x, fc):
    """filtro de un polo (suficiente para suavizar)."""
    a = np.exp(-2 * np.pi * fc / SR)
    y = np.empty_like(x)
    acc = 0.0
    # vectorizado por bloques con lfilter manual
    from scipy.signal import lfilter

    return lfilter([1 - a], [1, -a], x).astype(np.float32)


def bandpass_noise(n, f0, f1, q=1.0):
    """ruido filtrado cuyo centro barre de f0 a f1 (en bloques)."""
    from scipy.signal import butter, sosfilt

    out = np.zeros(n, np.float32)
    blocks = 24
    bl = n // blocks + 1
    for k in range(blocks):
        fc = f0 * (f1 / f0) ** (k / max(1, blocks - 1))
        lo = max(40.0, fc / (1 + 0.5 / q))
        hi = min(SR / 2 - 100, fc * (1 + 0.5 / q))
        sos = butter(2, [lo, hi], btype="band", fs=SR, output="sos")
        seg = rng.standard_normal(min(bl, n - k * bl)).astype(np.float32)
        if len(seg) == 0:
            break
        out[k * bl : k * bl + len(seg)] = sosfilt(sos, seg)
    return out / (np.abs(out).max() + 1e-6)


# ───────────────────────── instrumentos ─────────────────────────
def pad(freq, dur, amp=0.1, bright=0.6):
    n = int((dur + 1.8) * SR)
    t = np.arange(n) / SR
    x = np.zeros(n)
    for det in (-0.006, 0.0, 0.006):
        for h in range(1, 9):
            x += np.sin(2 * np.pi * freq * (1 + det) * h * t + h) * (bright ** h) / h
    e = env_ar(n, 1.3, 1.6)
    # respiración lenta
    x *= e * (0.85 + 0.15 * np.sin(2 * np.pi * 0.11 * t + freq))
    return (x * amp).astype(np.float32)


def pluck(freq, dur=0.7, amp=0.1):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * freq * t) + 0.45 * np.sin(2 * np.pi * freq * 2 * t) * np.exp(-t * 9) + 0.2 * np.sin(2 * np.pi * freq * 3 * t) * np.exp(-t * 14)
    x *= np.exp(-t * 5.5) * np.minimum(1, t / 0.004)
    return (x * amp).astype(np.float32)


def bass(freq, dur=2.2, amp=0.2):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * freq * t) + 0.25 * np.sin(2 * np.pi * freq * 2 * t)
    return (x * env_ar(n, 0.06, 1.2) * amp).astype(np.float32)


def kick(amp=0.18):
    n = int(0.28 * SR)
    t = np.arange(n) / SR
    f = 46 + 90 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return (np.sin(ph) * np.exp(-t * 11) * amp).astype(np.float32)


def bell(freq, dur=3.5, amp=0.08):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = np.zeros(n)
    for k, (r, a) in enumerate([(1, 1.0), (2.0, 0.5), (2.76, 0.35), (4.07, 0.22), (5.4, 0.12)]):
        x += a * np.sin(2 * np.pi * freq * r * t) * np.exp(-t * (1.6 + k * 0.9))
    return (x * np.minimum(1, t / 0.003) * amp).astype(np.float32)


def whoosh(dur, f0, f1, amp=0.2, shape=0.5):
    n = int(dur * SR)
    x = bandpass_noise(n, f0, f1, q=0.9)
    t = np.linspace(0, 1, n)
    e = np.sin(np.pi * np.clip(t, 0, 1)) ** (1 + shape)
    return (x * e * amp).astype(np.float32)


def boom(dur=3.2, amp=0.5):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = 34 + 60 * np.exp(-t * 5)
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) * np.exp(-t * 1.25)
    x += 0.4 * lowpass(rng.standard_normal(n).astype(np.float32), 400) * np.exp(-t * 3.2)
    return (x * np.minimum(1, t / 0.004) * amp).astype(np.float32)


# ───────────────────────── plan armónico ─────────────────────────
CH = {
    "Fmaj9": [41, 53, 57, 60, 64, 67],
    "Am9": [45, 57, 60, 64, 67, 71],
    "Dm9": [38, 50, 53, 57, 60, 64],
    "Bbmaj9": [46, 58, 62, 65, 69, 72],
    "Gm9": [43, 55, 58, 62, 65, 69],
    "A7sus": [45, 52, 57, 62, 64, 67],
    "Cadd9": [36, 48, 52, 55, 62, 67],
}
LIGHT = ["Fmaj9", "Am9", "Dm9", "Bbmaj9"]
DARK = ["Dm9", "Bbmaj9", "Gm9", "A7sus"]
SCENE_LEVEL = {
    "apertura": 0.35, "modernizar": 0.5, "agentica": 0.55, "transformacion": 0.8, "plataforma": 0.5, "agentfactory": 0.6,
    "donde": 0.55, "como": 0.55, "quien": 0.5, "especializacion": 0.55, "porsector": 0.6, "banking": 0.45, "insurance": 0.45,
    "smart": 0.55, "casos": 0.55, "clientes": 0.5, "cifras": 0.7, "cierre": 0.0,
}
DARK_SCENES = {"banking", "insurance"}

BPM = 92.0
BEAT = 60.0 / BPM
BAR = BEAT * 4

scenes = TL["scenes"]
cierre = next(s for s in scenes if s["id"] == "cierre")
t_cierre = cierre["start"] / FPS

# tiempos del clímax (mismos que S18Cierre.tsx)
v17 = cierre["voice"][0]
w17 = AU["blocks"]["b17_cierre"]["words"]


def word_t(words, needle, nth=0):
    import unicodedata

    def nrm(s):
        s = unicodedata.normalize("NFD", s.lower())
        return "".join(c for c in s if c.isalnum())

    k = 0
    for w in words:
        if nrm(w["w"]) == needle:
            if k == nth:
                return w["s"]
            k += 1
    return None


tu = word_t(w17, "tuya") or (AU["blocks"]["b17_cierre"]["dur"] * 0.75)
at = word_t(w17, "atmira") or (AU["blocks"]["b17_cierre"]["dur"] - 0.6)
c_tu = round((v17["from"] + tu * FPS))
c_at = max(round(v17["from"] + at * FPS), c_tu + 14)
W1S = (t_cierre * FPS + c_tu - 26) / FPS  # inicio del frente magenta
W2S = (t_cierre * FPS + c_tu + 14) / FPS
LOGO = (t_cierre * FPS + c_at - 12) / FPS
END = TL["total"] / FPS

# ───────────────────────── cama musical por escena ─────────────────────────
bar_idx = 0
t = 0.0
while t < TOTAL:
    # escena activa
    sc = None
    for s in scenes:
        if s["start"] / FPS <= t < (s["start"] + s["duration"]) / FPS:
            sc = s
            break
    sid = sc["id"] if sc else "cierre"
    if sid == "cierre" and t >= W1S - 1.0:
        break  # el cierre lo compone el bloque especial
    lvl = SCENE_LEVEL.get(sid, 0.5)
    prog = DARK if sid in DARK_SCENES else LIGHT
    chord = CH[prog[(bar_idx // 2) % 4]]
    first_in_chord = bar_idx % 2 == 0
    if first_in_chord:
        dur = BAR * 2
        for i, m in enumerate(chord):
            amp = 0.075 if i else 0.11
            add(MUS_L, MUS_R, t, pad(mid(m), dur, amp * (0.8 + 0.4 * lvl)), pan=(-0.5 + 0.2 * i) % 1 - 0.3)
        add(MUS_L, MUS_R, t, bass(mid(chord[0] - 12 if chord[0] > 40 else chord[0]), BAR * 2 - 0.2, 0.17 * (0.5 + lvl)), 0.0)
    # púas
    if lvl > 0.3:
        up = [m + 12 for m in chord[2:]]
        pat = [0, 2, 1, 3, 2, 4, 3, 1] if lvl < 0.7 else [0, 1, 2, 3, 4, 3, 2, 1]
        for k in range(8):
            if lvl < 0.45 and k % 2:
                continue
            m = up[pat[k] % len(up)]
            add(MUS_L, MUS_R, t + k * BEAT / 2, pluck(mid(m), 0.8, 0.045 * (0.5 + lvl)), pan=-0.6 + 1.2 * ((k + bar_idx) % 4) / 3)
    # pulso suave
    if lvl >= 0.6:
        for b in (0, 2) if lvl < 0.75 else (0, 1, 2, 3):
            add(MUS_L, MUS_R, t + b * BEAT, kick(0.12 * lvl), 0.0)
    t += BAR
    bar_idx += 1

# ───────────────────────── cierre cinematográfico ─────────────────────────
tc0 = t_cierre
span = W1S - tc0
# riser: ruido ascendente + glissando de pad + pulso que se acelera
add(SFX_L, SFX_R, tc0 + 0.2, whoosh(span - 0.1, 160, 9000, 0.34, 1.6), -0.2)
add(SFX_L, SFX_R, tc0 + 0.2, whoosh(span - 0.1, 220, 7000, 0.22, 1.2), 0.3)
nglide = int((span + 0.4) * SR)
tg = np.arange(nglide) / SR
fg = 110 * 2 ** (2.2 * (tg / (span + 0.4)) ** 1.6)
gl = np.sin(2 * np.pi * np.cumsum(fg) / SR) * (tg / (span + 0.4)) ** 2 * 0.07
add(MUS_L, MUS_R, tc0, gl.astype(np.float32), 0.0)
# drone bajo creciente
add(MUS_L, MUS_R, tc0, bass(mid(38), span + 0.6, 0.22), 0.0)
add(MUS_L, MUS_R, tc0, pad(mid(50), span + 0.2, 0.09), -0.3)
add(MUS_L, MUS_R, tc0, pad(mid(57), span + 0.2, 0.07), 0.3)
# pulso creciente (corcheas → semicorcheas)
tt = tc0 + 0.3
step = BEAT
while tt < W1S - 0.05:
    f = (tt - tc0) / span
    add(MUS_L, MUS_R, tt, kick(0.10 + 0.14 * f), 0.0)
    m = [62, 65, 69, 72, 74][int(f * 9) % 5] + 12
    add(MUS_L, MUS_R, tt, pluck(mid(m), 0.6, 0.05 + 0.05 * f), -0.5 + 1.0 * (int(tt * 7) % 3) / 2)
    step = BEAT * (1.0 - 0.55 * f)
    tt += step
# impacto en el inicio del frente magenta
add(SFX_L, SFX_R, W1S - 0.02, boom(3.6, 0.62), 0.0)
add(SFX_L, SFX_R, W1S - 0.02, whoosh(1.4, 6000, 300, 0.38, 0.6), 0.0)
# armonía luminosa que resuelve: F6/9 hasta el final
res = [41, 53, 57, 60, 64, 67, 72]
for i, m in enumerate(res):
    add(MUS_L, MUS_R, W1S, pad(mid(m), END - W1S - 0.4, 0.1 if i else 0.14, 0.7), pan=-0.4 + 0.13 * i)
add(MUS_L, MUS_R, W1S, bass(mid(29), END - W1S - 0.8, 0.26), 0.0)
# arpegio brillante en la expansión
for k in range(14):
    m = [72, 76, 79, 84, 81, 76, 79][k % 7]
    add(MUS_L, MUS_R, W1S + 0.3 + k * BEAT / 2, pluck(mid(m), 1.0, 0.06 * (1 - k / 22)), pan=-0.7 + 1.4 * (k % 5) / 4)
# carillón en la aparición del logotipo
for i, m in enumerate([84, 88, 91, 96]):
    add(SFX_L, SFX_R, LOGO + i * 0.09, bell(mid(m), 5.0, 0.085), pan=-0.5 + 0.33 * i)
add(SFX_L, SFX_R, W2S, whoosh(1.8, 400, 5200, 0.2, 0.9), 0.0)

# ───────────────────────── logo de apertura ─────────────────────────
ap = next(s for s in scenes if s["id"] == "apertura")
add(SFX_L, SFX_R, 0.9, whoosh(1.7, 300, 6000, 0.22, 0.9), 0.0)
for i, m in enumerate([79, 84, 88]):
    add(SFX_L, SFX_R, 2.55 + i * 0.1, bell(mid(m), 4.0, 0.075), pan=-0.3 + 0.3 * i)

# ───────────────────────── transiciones ─────────────────────────
KIND = {
    "silk": (260, 7000, 0.26, 0.4),
    "zoom": (120, 3000, 0.2, 0.9),
    "push": (180, 2600, 0.2, 0.6),
    "slide": (900, 9000, 0.17, 0.3),
    "split": (240, 6000, 0.22, 0.2),
    "iris": (150, 4200, 0.2, 1.1),
    "dark": (90, 900, 0.24, 1.4),
    "light": (500, 8000, 0.16, 1.0),
    "fade": (300, 3000, 0.07, 1.0),
}
for s in scenes:
    o = s["out"]
    if not o:
        continue
    t0 = (s["start"] + s["duration"] - o["frames"]) / FPS
    f0, f1, a, sh = KIND[o["kind"]]
    d = o["frames"] / FPS + 0.35
    add(SFX_L, SFX_R, t0 - 0.12, whoosh(d, f0, f1, a, sh), pan=0.0 if o["kind"] != "slide" else 0.3)

# golpes suaves en cada cifra
cf = next(s for s in scenes if s["id"] == "cifras")
bw = AU["blocks"]["b16_cifras"]["words"]
for needle in ("veinte", "ochocientos", "setenta", "cuarenta", "dos", "siete"):
    w = word_t(bw, needle)
    if w is None:
        continue
    tt = (cf["start"] + cf["voice"][0]["from"]) / FPS + w - 0.1
    add(SFX_L, SFX_R, tt, kick(0.22), 0.0)
    add(SFX_L, SFX_R, tt, bell(mid(84), 1.4, 0.035), 0.0)

# ───────────────────────── ducking bajo la voz ─────────────────────────
HOP = 0.01
nh = int(TOTAL / HOP) + 2
voice = np.zeros(nh, np.float32)
for s in scenes:
    for v in s["voice"]:
        b = AU["blocks"].get(v["id"])
        if not b:
            continue
        t0 = (s["start"] + v["from"]) / FPS
        for w in b["words"]:
            a_ = int((t0 + w["s"] - 0.05) / HOP)
            e_ = int((t0 + w["e"] + 0.18) / HOP)
            voice[max(0, a_) : min(nh, e_)] = 1.0
# suavizado: ataque rápido, suelta lenta
sm = np.zeros(nh, np.float32)
acc = 0.0
for i in range(nh):
    tgt = voice[i]
    acc += (tgt - acc) * (0.35 if tgt > acc else 0.03)
    sm[i] = acc
duck_db = 8.0
gain_h = 10 ** (-(duck_db * sm) / 20)
idx = np.minimum((np.arange(N) / SR / HOP).astype(int), nh - 1)
gain = gain_h[idx]
# durante el cierre la ducción es menor (clímax)
cl = (np.arange(N) / SR) >= W1S - 0.3
gain = np.where(cl, 1 - (1 - gain) * 0.45, gain)

L = MUS_L * gain + SFX_L
R = MUS_R * gain + SFX_R

# ───────────────────────── final: cola natural, sin cortes ─────────────────────────
fade = np.ones(N, np.float32)
tail0 = END - 0.2
i0 = int(tail0 * SR)
fade[i0:] = np.clip(1 - (np.arange(N - i0) / SR) / (TOTAL - tail0), 0, 1) ** 2
L *= fade
R *= fade

# reverb sencillo (convolución con cola exponencial) para dar espacio
def reverb(x, wet=0.22, dur=2.4):
    from scipy.signal import fftconvolve

    n = int(dur * SR)
    tt = np.arange(n) / SR
    ir = rng.standard_normal(n) * np.exp(-tt * 2.6)
    ir = lowpass(ir.astype(np.float32), 5200)
    ir /= np.sqrt((ir ** 2).sum()) + 1e-9
    return x + wet * fftconvolve(x, ir)[: len(x)].astype(np.float32)


L = reverb(L)
R = reverb(R, 0.22, 2.7)

# normalización: pico por debajo de -2 dBFS y nivel de cama razonable
peak = max(np.abs(L).max(), np.abs(R).max(), 1e-6)
g = 0.78 / peak
L *= g
R *= g

st = np.stack([L, R], axis=1)
pcm = (np.clip(st, -1, 1) * 32767).astype(np.int16)
tmp = ROOT / "audio" / ".music.wav"
with wave.open(str(tmp), "wb") as wf:
    wf.setnchannels(2)
    wf.setsampwidth(2)
    wf.setframerate(SR)
    wf.writeframes(pcm.tobytes())
out = ROOT / "public" / "audio" / "music.mp3"
out.parent.mkdir(parents=True, exist_ok=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(tmp), "-c:a", "libmp3lame", "-q:a", "2", str(out)], check=True)
tmp.unlink()
print(f"música → {out}  ({TOTAL:.1f}s)  clímax {W1S:.2f}s · logotipo {LOGO:.2f}s")
