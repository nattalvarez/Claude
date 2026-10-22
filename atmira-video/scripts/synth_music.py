#!/usr/bin/env python3
"""
Banda sonora original (sintetizada, sin muestras ni licencias de terceros) + efectos, derivada del montaje:

  - lee src/data/timeline.json y src/data/audio.json (tiempos reales de la locución)
  - base rítmica electrónica a 124 bpm (referida al vídeo original, ≈124 bpm): bombo a negro, palmas, hats, bajo a contratiempo
    con sidechain, stabs y arpegio con eco; la rejilla se reinicia en cada escena para que el corte caiga en el tiempo 1
  - energía distinta por escena, redobles + riser antes de cada corte e impacto al entrar
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
MUS_L = np.zeros(N, np.float32)  # armonía/bajo/arpegio (sidechain)
MUS_R = np.zeros(N, np.float32)
DRM_L = np.zeros(N, np.float32)  # percusión
DRM_R = np.zeros(N, np.float32)
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



# ───────────────────────── percusión y sintes (v8) ─────────────────────────
def noise(n):
    return rng.standard_normal(n).astype(np.float32)


def hp(x, fc):
    from scipy.signal import butter, sosfilt

    return sosfilt(butter(2, fc, btype="high", fs=SR, output="sos"), x).astype(np.float32)


def bp(x, f0, f1):
    from scipy.signal import butter, sosfilt

    return sosfilt(butter(2, [f0, f1], btype="band", fs=SR, output="sos"), x).astype(np.float32)


def kick2(amp=0.9):
    n = int(0.46 * SR)
    t = np.arange(n) / SR
    f = 52 + 120 * np.exp(-t * 34)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body_ = np.sin(ph) * np.exp(-t * 8.5)
    click = hp(noise(n), 2500) * np.exp(-t * 400) * 0.35
    return (np.tanh(1.7 * (body_ + click)) * amp).astype(np.float32)


def clap(amp=0.5):
    n = int(0.3 * SR)
    t = np.arange(n) / SR
    x = bp(noise(n), 900, 3200)
    e = np.zeros(n)
    for k, d in enumerate((0.0, 0.011, 0.022)):
        m = t >= d
        e[m] += np.exp(-(t[m] - d) * 120) * (0.6 if k < 2 else 1.0)
    e += np.exp(-t * 20) * 0.35
    return (x * e * amp * 1.6).astype(np.float32)


def hat(dur=0.05, amp=0.2):
    n = int(max(dur * 6, 0.06) * SR)
    t = np.arange(n) / SR
    x = hp(noise(n), 7000)
    return (x * np.exp(-t / dur * 3.2) * amp).astype(np.float32)


def snare_hit(amp=0.3, tone=190):
    n = int(0.2 * SR)
    t = np.arange(n) / SR
    x = hp(noise(n), 1500) * np.exp(-t * 26) + np.sin(2 * np.pi * tone * t) * np.exp(-t * 30) * 0.6
    return (x * amp).astype(np.float32)


def sub(freq, dur, amp=0.3):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * freq * t) + 0.45 * np.sin(2 * np.pi * freq * 2 * t) + 0.22 * np.sin(2 * np.pi * freq * 3 * t) * np.exp(-t * 8)
    e = np.minimum(1, t / 0.006) * np.exp(-t * 2.2) * np.clip((dur - t) / 0.03, 0, 1)
    return (np.tanh(1.5 * x * e) * amp).astype(np.float32)


def stab(freqs, dur=0.3, amp=0.07):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = np.zeros(n)
    for f in freqs:
        for det in (-0.004, 0.0, 0.004):
            for h in range(1, 9):
                x += np.sin(2 * np.pi * f * (1 + det) * h * t + h * 0.7) / h * np.exp(-t * (h - 1) * 1.7)
    return (x * np.exp(-t * 7) * np.minimum(1, t / 0.003) * np.clip((dur - t) / 0.02, 0, 1) * amp).astype(np.float32)


def lead(freq, dur=0.5, amp=0.06):
    n = int(dur * SR)
    t = np.arange(n) / SR
    vib = 1 + 0.004 * np.sin(2 * np.pi * 5.2 * t) * np.minimum(1, t / 0.3)
    ph = 2 * np.pi * freq * np.cumsum(vib) / SR
    x = sum(np.sin(h * ph) / h for h in range(1, 10)) + 0.6 * sum(np.sin(h * ph * 1.006) / h for h in range(1, 7))
    e = np.minimum(1, t / 0.012) * np.exp(-t * 1.3) * np.clip((dur - t) / 0.06, 0, 1)
    return (np.tanh(0.9 * x) * e * amp).astype(np.float32)


# ───────────────────────── plan armónico ─────────────────────────
MUSIC_GAIN = 0.42  # música ≈ 7–9 dB por debajo de la voz mientras habla
BPM = 124.0  # tempo medido en el vídeo original (≈ 124 bpm)
BEAT = 60.0 / BPM
BAR = BEAT * 4
S16 = BEAT / 4

# (raíz del bajo, tríada/novena en octavas medias)
LIGHT = [(33, [57, 60, 64, 67]), (29, [53, 57, 60, 64]), (36, [55, 60, 64, 67]), (31, [55, 59, 62, 66])]  # Am9 · Fmaj9 · Cadd9 · G6
DARK = [(26, [50, 53, 57, 60]), (34, [53, 58, 62, 65]), (29, [53, 57, 60, 64]), (36, [55, 60, 64, 67])]  # Dm7 · Bbmaj7 · Fmaj9 · C
SCENE_LEVEL = {
    "apertura": 0.3, "modernizar": 0.62, "agentica": 0.66, "transformacion": 0.9, "plataforma": 0.7, "agentfactory": 0.74,
    "donde": 0.68, "como": 0.7, "quien": 0.66, "especializacion": 0.72, "porsector": 0.76, "banking": 0.62, "insurance": 0.62,
    "smart": 0.7, "casos": 0.68, "clientes": 0.7, "cifras": 0.92, "cierre": 0.8,
}
DARK_SCENES = {"banking", "insurance"}

# Evolución: la pieza cambia de armonía, patrón y capas de forma continua y a destiempo (cada eje con su propio
# periodo), de modo que nunca hay un «cambio de sección» audible: siempre se mueve algo mientras el resto sigue.
PROGS = {
    "A": LIGHT,
    "B": [(29, [53, 57, 60, 64]), (36, [55, 60, 64, 67]), (26, [50, 53, 57, 60]), (31, [55, 59, 62, 66])],  # Fmaj9 · Cadd9 · Dm7 · G6
    "C": DARK,
    "D": [(28, [52, 55, 59, 62]), (36, [55, 60, 64, 67]), (31, [55, 59, 62, 66]), (26, [50, 54, 57, 62])],  # Em7 · Cadd9 · G6 · D6
    "E": [(33, [57, 60, 64, 67]), (36, [55, 60, 64, 67]), (29, [53, 57, 60, 64]), (31, [55, 59, 62, 66])],  # Am · C · F · G
}
SEQ_LIGHT = ["A", "B", "A", "E", "D", "E", "B", "A"]
SEQ_DARK = ["C", "D", "C", "B"]
ARP_PATS = [
    [0, 2, 1, 3, 2, 4, 3, 1, 0, 2, 1, 3, 4, 3, 2, 1],
    [0, 1, 2, 3, 4, 3, 2, 1, 0, 1, 2, 3, 4, 2, 3, 1],
    [4, 2, 3, 1, 2, 0, 1, 3, 4, 3, 2, 4, 3, 1, 2, 0],
]
STAB_SETS = [(3, 6, 11), (2, 7, 10), (4, 8, 13)]
LEAD_SETS = [((0, 2, 5), (6, 3, 3), (10, 1, 6)), ((2, 3, 4), (8, 1, 4), (12, 2, 3)), ((0, 1, 7), (8, 3, 5), (13, 0, 3))]


def wob(t, period, phase=0.0):
    return 0.5 + 0.5 * np.sin(2 * np.pi * t / period + phase)


def gate(x, lo, hi):
    y = min(1.0, max(0.0, (x - lo) / (hi - lo)))
    return y * y * (3 - 2 * y)

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
W1S = (t_cierre * FPS + c_tu - 26) / FPS  # inicio del haz de luz / apertura
W2S = (t_cierre * FPS + c_tu + 14) / FPS
LOGO = (t_cierre * FPS + c_at - 12) / FPS
END = TL["total"] / FPS

KICKS = []  # instantes de bombo (para el sidechain)


def put_kick(t, amp=0.9):
    add(DRM_L, DRM_R, t, kick2(amp), 0.0)
    KICKS.append(t)


# ───────────────────────── base rítmica por escena (rejilla propia, bar 1 = corte) ─────────────────────────
# el corte musical cae en mitad del solape de la transición visual; cada escena = nº entero de compases
cuts = [0.0] + [((scenes[i + 1]["start"]) + (scenes[i]["start"] + scenes[i]["duration"])) / 2 / FPS for i in range(len(scenes) - 1)] + [END]
gbar = 0  # contador global de compases: la progresión armónica continúa a través de los cortes
for si, sc in enumerate(scenes):
    sid = sc["id"]
    s0 = cuts[si]
    s1 = cuts[si + 1]
    if sid == "cierre":
        s1 = W1S
        beat_s = BEAT  # el cierre conserva 124 bpm: el clímax está compuesto a mano
    else:
        n_bars = max(2, round((s1 - s0) * BPM / 240.0))
        beat_s = (s1 - s0) / (4 * n_bars)
        while 60.0 / beat_s > 136:
            n_bars -= 1
            beat_s = (s1 - s0) / (4 * n_bars)
        while 60.0 / beat_s < 112:
            n_bars += 1
            beat_s = (s1 - s0) / (4 * n_bars)
    bar_s = beat_s * 4
    s16_s = beat_s / 4
    lvl = SCENE_LEVEL.get(sid, 0.6)
    seq = SEQ_DARK if sid in DARK_SCENES else SEQ_LIGHT
    t = s0
        # platillo suave en el corte (el ritmo no se interrumpe: el compás sigue sin saltos)
    if si > 0:
        add(DRM_L, DRM_R, s0, hat(0.5, 0.12), 0.0)
    while t < s1 - 0.08:
        bar = gbar
        root, chord = PROGS[seq[(bar // 8) % len(seq)]][bar % 4]
        end_bar = min(t + bar_s, s1)
        # capas que entran y salen despacio (periodos distintos: 83, 67, 111, 59 y 97 s)
        g_arp = 0.18 + 0.82 * gate(wob(t, 83, 0.0), 0.2, 0.8)
        g_stab = gate(wob(t, 67, 2.0), 0.3, 0.75)
        g_lead = gate(wob(t, 111, 4.0), 0.5, 0.85)
        g_h16 = gate(wob(t, 59, 1.0), 0.35, 0.7)
        g_pad = 1.0 + 0.7 * (1 - g_arp)
        bass_pat = (bar // 16) % 3
        arp_pat = ARP_PATS[(bar // 8) % 3]
        stab_set = STAB_SETS[(bar // 12) % 3]
        lead_set = LEAD_SETS[(bar // 10) % 3]
        tone = 0.5 + 0.5 * wob(t, 140, 1.5)  # brillo del arpegio, ligado a un ciclo lento
        intro = sid == "apertura" and t < 3.2
        # ── percusión
        if not intro:
            for b in range(4):
                tb = t + b * beat_s
                if tb >= s1 - 0.05:
                    break
                if lvl >= 0.5 or b % 2 == 0:
                    put_kick(tb, 0.8 if lvl >= 0.5 else 0.5)
                if lvl >= 0.5 and b % 2 == 1:
                    add(DRM_L, DRM_R, tb, clap(0.62 + 0.14 * lvl), 0.05)
                # hats: contratiempo (+ semicorcheas a partir de energía alta)
                th = tb + beat_s / 2
                if th < s1 - 0.05:
                    add(DRM_L, DRM_R, th, hat(0.16 if lvl >= 0.6 else 0.06, 0.26 if lvl >= 0.6 else 0.18), 0.25)
                if lvl >= 0.72 and g_h16 > 0.1:
                    for q in (1, 3):
                        tq = tb + q * s16_s
                        if tq < s1 - 0.05:
                            add(DRM_L, DRM_R, tq, hat(0.035, (0.08 + 0.03 * (q == 3)) * (0.4 + 0.6 * g_h16)), -0.2)
        # ── bajo a contratiempo (sidechain lo hace «respirar»)
        if lvl >= 0.4 and not intro:
            if bass_pat == 0:
                spots = [(k + 0.5, 12 + (12 if (k == 3 and lvl >= 0.75) else 0)) for k in range(4)]
            elif bass_pat == 1:
                spots = [(0.5, 12), (1.5, 12), (2.5, 12), (3.0, 24), (3.5, 19)]
            else:
                spots = [(0.5, 12), (1.0, 24), (1.5, 12), (2.5, 12), (3.25, 24), (3.5, 12)]
            for kk, off in spots:
                tn = t + kk * beat_s
                if tn < s1 - 0.12:
                    add(MUS_L, MUS_R, tn, sub(mid(root + off), beat_s * 0.42, 0.34 * (0.7 + 0.3 * lvl)), 0.0)
        # ── stabs sincopados
        if lvl >= 0.5 and not intro and g_stab > 0.08:
            for st_ in stab_set:
                ts = t + st_ * s16_s
                if ts < s1 - 0.1:
                    fr = [mid(m) for m in chord]
                    add(MUS_L, MUS_R, ts, stab(fr, 0.34, 0.085 * (0.6 + 0.5 * lvl) * g_stab), pan=-0.3 if st_ % 2 == 0 else 0.3)
        # ── arpegio (con eco)
        if lvl >= 0.55 and not intro:
            up = [m + 12 for m in chord] + [chord[0] + 24]
            pat = arp_pat
            step = 1 if lvl >= 0.72 else 2
            for k in range(0, 16, step):
                ta = t + k * s16_s
                if ta < s1 - 0.1:
                    nt = mid(up[pat[k] % len(up)])
                    amp_a = 0.075 * (0.55 + 0.6 * lvl) * (1.25 if k % 4 == 0 else 0.8) * g_arp
                    if tone > 0.72 and k % 4 == 0:
                        add(MUS_L, MUS_R, ta, bell(nt, 1.2, amp_a * 0.7), pan=-0.65 + 1.3 * ((k // step) % 5) / 4)
                    else:
                        add(MUS_L, MUS_R, ta, pluck(nt, 0.5, amp_a), pan=-0.65 + 1.3 * ((k // step) % 5) / 4)
        # ── melodía (frases de 4 compases: compases 3-4)
        if lvl >= 0.7 and bar % 4 in (2, 3) and not intro and g_lead > 0.08:
            hi = [m + 24 for m in chord]
            for st_, ni, dd in lead_set:
                tl_ = t + st_ * s16_s
                if tl_ < s1 - 0.15:
                    add(MUS_L, MUS_R, tl_, lead(mid(hi[ni % 4]), dd * s16_s, 0.075 * g_lead), pan=0.15)
        # ── pad de fondo (más presente cuando hay menos ritmo)
        dur_p = end_bar - t
        for i, m in enumerate(chord):
            add(MUS_L, MUS_R, t, pad(mid(m - 12), dur_p, (0.05 if lvl >= 0.5 else 0.085) * (0.8 + 0.4 * lvl) * g_pad), pan=-0.5 + 0.3 * i)
        t += bar_s
        gbar += 1
    # relleno suave: el último pulso de la escena (semicorcheas con crescendo) y un soplo de ruido
    if sc["out"] and sid != "cierre":
        for k in range(4):
            tk = s1 - beat_s + k * s16_s
            add(DRM_L, DRM_R, tk, snare_hit(0.07 + 0.05 * k, 190 + 40 * k), 0.0)
        add(SFX_L, SFX_R, s1 - bar_s, whoosh(bar_s, 400, 7000, 0.06, 1.6), 0.0)

# ───────────────────────── cierre cinematográfico ─────────────────────────
tc0 = t_cierre
span = W1S - tc0
# riser + redoble acelerado hacia el haz de luz
add(SFX_L, SFX_R, tc0 + 0.2, whoosh(span - 0.1, 160, 9000, 0.34, 1.6), -0.2)
add(SFX_L, SFX_R, tc0 + 0.2, whoosh(span - 0.1, 220, 7000, 0.22, 1.2), 0.3)
nglide = int((span + 0.4) * SR)
tg = np.arange(nglide) / SR
fg = 110 * 2 ** (2.2 * (tg / (span + 0.4)) ** 1.6)
gl = np.sin(2 * np.pi * np.cumsum(fg) / SR) * (tg / (span + 0.4)) ** 2 * 0.08
add(MUS_L, MUS_R, tc0, gl.astype(np.float32), 0.0)
tt = W1S - 3.2
while tt < W1S - 0.04:
    f = (tt - (W1S - 3.2)) / 3.2
    add(DRM_L, DRM_R, tt, snare_hit(0.1 + 0.28 * f, 200 + 140 * f), 0.0)
    tt += BEAT / 2 * (1.0 - 0.7 * f) + 0.025
# impacto: golpe grave + bombo + palma en el inicio del haz de luz
add(SFX_L, SFX_R, W1S - 0.02, boom(3.6, 0.62), 0.0)
add(SFX_L, SFX_R, W1S - 0.02, whoosh(1.4, 6000, 300, 0.38, 0.6), 0.0)
put_kick(W1S, 1.0)
add(DRM_L, DRM_R, W1S, clap(0.7), 0.0)
# dos compases de ritmo pleno mientras se abre la rendija y avanza el barrido
for b in range(1, 8):
    tb = W1S + b * BEAT
    put_kick(tb, 0.9 - 0.06 * b)
    if b % 2 == 1:
        add(DRM_L, DRM_R, tb, clap(0.5 - 0.04 * b), 0.05)
    add(DRM_L, DRM_R, tb + BEAT / 2, hat(0.12, 0.18), 0.25)
# armonía luminosa que resuelve: F6/9 hasta el final
res = [41, 53, 57, 60, 64, 67, 72]
for i, m in enumerate(res):
    add(MUS_L, MUS_R, W1S, pad(mid(m), END - W1S - 0.4, 0.1 if i else 0.14, 0.7), pan=-0.4 + 0.13 * i)
add(MUS_L, MUS_R, W1S, bass(mid(29), END - W1S - 0.8, 0.26), 0.0)
# arpegio brillante en la expansión
for k in range(16):
    m = [72, 76, 79, 84, 81, 76, 79][k % 7]
    add(MUS_L, MUS_R, W1S + 0.3 + k * BEAT / 2, pluck(mid(m), 1.0, 0.065 * (1 - k / 26)), pan=-0.7 + 1.4 * (k % 5) / 4)
# carillón en la aparición del logotipo
for i, m in enumerate([84, 88, 91, 96]):
    add(SFX_L, SFX_R, LOGO + i * 0.09, bell(mid(m), 5.0, 0.085), pan=-0.5 + 0.33 * i)
add(SFX_L, SFX_R, W2S, whoosh(1.8, 400, 5200, 0.2, 0.9), 0.0)

# ───────────────────────── logo de apertura ─────────────────────────
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

# golpes en cada cifra
cf = next(s for s in scenes if s["id"] == "cifras")
bw = AU["blocks"]["b16_cifras"]["words"]
for needle in ("veinte", "ochocientos", "setenta", "cuarenta", "dos", "siete"):
    w = word_t(bw, needle)
    if w is None:
        continue
    tt = (cf["start"] + cf["voice"][0]["from"]) / FPS + w - 0.1
    add(SFX_L, SFX_R, tt, boom(1.2, 0.22), 0.0)
    add(SFX_L, SFX_R, tt, bell(mid(84), 1.4, 0.04), 0.0)

# ───────────────────────── sidechain (bombo) y ducking bajo la voz ─────────────────────────
t_ax = np.arange(N) / SR
dip = np.zeros(N, np.float32)
dl = int(0.3 * SR)
env_dip = (np.exp(-np.arange(dl) / SR / 0.11) * np.minimum(1, np.arange(dl) / (0.004 * SR))).astype(np.float32)
for kt in KICKS:
    i0 = int(kt * SR)
    if i0 >= N:
        continue
    m = min(dl, N - i0)
    dip[i0 : i0 + m] = np.maximum(dip[i0 : i0 + m], env_dip[:m])
sc_gain = 1 - 0.55 * dip  # armonía/bajo se hunden bajo cada bombo

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
sm = np.zeros(nh, np.float32)
acc = 0.0
for i in range(nh):
    tgt = voice[i]
    acc += (tgt - acc) * (0.35 if tgt > acc else 0.03)
    sm[i] = acc
idx = np.minimum((np.arange(N) / SR / HOP).astype(int), nh - 1)
g_h = 10 ** (-(9.0 * sm[idx]) / 20)  # armonía: −9 dB con voz
g_d = 10 ** (-(5.0 * sm[idx]) / 20)  # percusión: −5 dB con voz (el ritmo sigue vivo)
cl = (np.arange(N) / SR) >= W1S - 0.3
g_h = np.where(cl, 1 - (1 - g_h) * 0.45, g_h)
g_d = np.where(cl, 1 - (1 - g_d) * 0.45, g_d)

# eco en el arpegio (corchea con puntillo) sobre el bus de armonía
dly = int(BEAT * 0.75 * SR)
for rep, gn in ((1, 0.42), (2, 0.18)):
    o = dly * rep
    MUS_L[o:] += MUS_L[:-o] * gn * 0.5
    MUS_R[o:] += MUS_R[:-o] * gn * 0.5

L = MUS_L * g_h * sc_gain + DRM_L * g_d + SFX_L
R = MUS_R * g_h * sc_gain + DRM_R * g_d + SFX_R

# ───────────────────────── final: cola natural, sin cortes ─────────────────────────
fade = np.ones(N, np.float32)
tail0 = END - 0.2
i0 = int(tail0 * SR)
fade[i0:] = np.clip(1 - (np.arange(N - i0) / SR) / (TOTAL - tail0), 0, 1) ** 2
L *= fade
R *= fade


def reverb(x, wet=0.16, dur=2.0):
    from scipy.signal import fftconvolve

    n = int(dur * SR)
    tt = np.arange(n) / SR
    ir = rng.standard_normal(n) * np.exp(-tt * 3.2)
    ir = lowpass(ir.astype(np.float32), 5000)
    ir /= np.sqrt((ir ** 2).sum()) + 1e-9
    return x + wet * fftconvolve(x, ir)[: len(x)].astype(np.float32)


L = reverb(L)
R = reverb(R, 0.16, 2.2)

# nivel de referencia: la música sola ≈ −13 LUFS (con la voz encima, el vídeo queda ≈ −16 LUFS como el original)
peak = max(np.abs(L).max(), np.abs(R).max(), 1e-6)
g = 0.95 / peak
L *= g
R *= g
L = np.tanh(L * 1.15) / np.tanh(1.15) * MUSIC_GAIN
R = np.tanh(R * 1.15) / np.tanh(1.15) * MUSIC_GAIN

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
print(f"música → {out}  ({TOTAL:.1f}s)  {BPM:.0f} bpm · clímax {W1S:.2f}s · logotipo {LOGO:.2f}s")
