#!/usr/bin/env python3
"""SIREC spot audio generator: cinematic / emotional score + water ambience + watery SFX + VO mix.
numpy + stdlib only (ffmpeg via subprocess).

Writes into public/audio/:  music.wav, sfx.wav, mix.wav, music.mp3
Reads: src/data/timing.json (sections / cuts / sfx / vo) and the VO mp3 named there.
Run:   python3 -I scripts/gen-audio.py
"""
import json, math, os, re, subprocess, sys, time, wave

import numpy as np

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
AUD = os.path.join(ROOT, 'public', 'audio')
SCR = '/tmp/claude-0/-home-user-Claude/dc63f488-f345-5da7-9505-05cf39273789/scratchpad'
os.makedirs(SCR, exist_ok=True)
TIMING = json.load(open(os.path.join(ROOT, 'src', 'data', 'timing.json')))

SR = 48000
DUR = TIMING['duration']
N = int(round(DUR * SR))
rng = np.random.default_rng(20241023)
T0 = time.time()

BPM = 90.0                      # slow, warm; only used for groove loops (anchored at each section start)
BEAT = 60.0 / BPM
SEC = TIMING['sections']
assert len(SEC) == 8, 'expected the 8-section energy arc'
(S_B, S_C, S_D, S_E, S_F, S_G, S_H) = [SEC[i]['from'] for i in range(1, 8)]
#  A 0..S_B intimate | B sparse piano | C heartbeat build | D tension | E ostinato | F uplift | G full | H bloom + calm
VO_FILE = TIMING['vo']['file']
VO_START = TIMING['vo'].get('startsAt', TIMING['offset'])
VO_END = TIMING['vo']['endsAt']
FADE_START = DUR - 4.2          # music fades to true silence between FADE_START and DUR


def log(*a):
    print('[%6.1fs]' % (time.time() - T0), *a, flush=True)


def t2i(t):
    return int(round(t * SR))


def svf(x, fc, q=0.707, mode='lp'):
    """TPT state-variable filter (python loop). fc scalar or per-sample array."""
    x = np.asarray(x, dtype=np.float64)
    n = len(x)
    k = 1.0 / q
    xl = x.tolist()
    out = [0.0] * n
    s1 = s2 = 0.0
    if np.isscalar(fc):
        g = math.tan(math.pi * min(max(fc, 10.0), SR * 0.45) / SR)
        a1 = 1.0 / (1.0 + g * (g + k)); a2 = g * a1; a3 = g * a2
        for i in range(n):
            v3 = xl[i] - s2
            v1 = a1 * s1 + a2 * v3
            v2 = s2 + a2 * s1 + a3 * v3
            s1 = 2.0 * v1 - s1
            s2 = 2.0 * v2 - s2
            if mode == 'lp':
                out[i] = v2
            elif mode == 'bp':
                out[i] = v1
            else:
                out[i] = xl[i] - k * v1 - v2
    else:
        fcv = np.clip(np.asarray(fc, dtype=np.float64), 10.0, SR * 0.45)
        g = np.tan(np.pi * fcv / SR)
        a1 = 1.0 / (1.0 + g * (g + k)); a2 = g * a1; a3 = g * a2
        a1l, a2l, a3l = a1.tolist(), a2.tolist(), a3.tolist()
        for i in range(n):
            c1 = a1l[i]; c2 = a2l[i]; c3 = a3l[i]
            v3 = xl[i] - s2
            v1 = c1 * s1 + c2 * v3
            v2 = s2 + c2 * s1 + c3 * v3
            s1 = 2.0 * v1 - s1
            s2 = 2.0 * v2 - s2
            if mode == 'lp':
                out[i] = v2
            elif mode == 'bp':
                out[i] = v1
            else:
                out[i] = xl[i] - k * v1 - v2
    return np.array(out)


def fft_filter(x, lp=None, hp=None, order=2):
    """Zero-phase Butterworth-magnitude filter in the frequency domain (static)."""
    n = len(x)
    nfft = 1 << (n - 1).bit_length()
    X = np.fft.rfft(x, nfft)
    f = np.fft.rfftfreq(nfft, 1.0 / SR)
    m = np.ones_like(f)
    if lp:
        m *= 1.0 / np.sqrt(1.0 + (f / lp) ** (2 * order))
    if hp:
        with np.errstate(divide='ignore', invalid='ignore'):
            h = 1.0 / np.sqrt(1.0 + (hp / np.maximum(f, 1e-9)) ** (2 * order))
        m *= h
    return np.fft.irfft(X * m, nfft)[:n]


def _blep(t, dt):
    out = np.zeros_like(t)
    m = t < dt
    x = t[m] / dt[m]
    out[m] = x + x - x * x - 1.0
    m = t > 1.0 - dt
    x = (t[m] - 1.0) / dt[m]
    out[m] = x * x + x + x + 1.0
    return out


def saw(freq, n=None, phase=0.0):
    f = np.full(n, float(freq)) if np.isscalar(freq) else np.asarray(freq, float)
    dt = f / SR
    ph = (np.cumsum(dt) + phase) % 1.0
    return 2.0 * ph - 1.0 - _blep(ph, dt)


def square(freq, n=None, phase=0.0):
    f = np.full(n, float(freq)) if np.isscalar(freq) else np.asarray(freq, float)
    dt = f / SR
    ph = (np.cumsum(dt) + phase) % 1.0
    return np.where(ph < 0.5, 1.0, -1.0) + _blep(ph, dt) - _blep((ph + 0.5) % 1.0, dt)


def mtof(m):
    return 440.0 * 2.0 ** ((np.asarray(m, dtype=float) - 69.0) / 12.0)


def smooth(u):
    u = np.clip(u, 0.0, 1.0)
    return u * u * (3.0 - 2.0 * u)


def auto(points, log_interp=False):
    """Per-sample automation curve from [(t_sec, value), ...]."""
    ts = np.array([p[0] for p in points], dtype=float)
    vs = np.array([p[1] for p in points], dtype=float)
    tt = np.arange(N) / SR
    if log_interp:
        return np.exp(np.interp(tt, ts, np.log(vs)))
    return np.interp(tt, ts, vs)


def comb(x, D, g):
    y = x.copy()
    for s in range(D, len(y), D):
        e = min(s + D, len(y))
        y[s:e] += g * y[s - D:s - D + (e - s)]
    return y


def allpass(x, D, g):
    y = np.zeros_like(x)
    for s in range(0, len(x), D):
        e = min(s + D, len(x))
        xd = x[s - D:s - D + (e - s)] if s >= D else np.zeros(e - s)
        yd = y[s - D:s - D + (e - s)] if s >= D else np.zeros(e - s)
        y[s:e] = -g * x[s:e] + xd + g * yd
    return y


def reverb(x, rt60=2.4, predelay=0.018, lp=5500.0, hp=180.0):
    """Schroeder/Moorer style stereo reverb (8 combs + 2 allpass per side), block-vectorised."""
    n = len(x)
    pd = int(predelay * SR)
    xin = np.concatenate([np.zeros(pd), x])[:n]
    outs = []
    for side, delays in enumerate(([1687, 1801, 2053, 2251, 2467, 2729, 2999, 3203],
                                   [1733, 1867, 2113, 2311, 2531, 2797, 3067, 3259])):
        acc = np.zeros(n)
        for D in delays:
            g = 10.0 ** (-3.0 * D / (SR * rt60))
            acc += comb(xin, D, g)
        acc /= len(delays)
        acc = allpass(acc, 556 + 23 * side, 0.5)
        acc = allpass(acc, 341 + 26 * side, 0.5)
        outs.append(fft_filter(acc, lp=lp, hp=hp))
    return np.stack(outs, axis=1)


def pan_gains(p):  # p in [-1,1]
    a = (p + 1.0) * math.pi / 4.0
    return math.cos(a), math.sin(a)


class Bus:
    """Stereo accumulation bus with mono reverb send."""

    def __init__(self):
        self.s = np.zeros((N, 2))
        self.rv = np.zeros(N)

    def add(self, buf, t, gain=1.0, pan=0.0, send=0.0, at_sample=None):
        i = at_sample if at_sample is not None else t2i(t)
        if i >= N or i + len(buf) <= 0:
            return
        a = max(0, -i)
        b = min(len(buf), N - i)
        seg = buf[a:b]
        i0 = i + a
        if seg.ndim == 1:
            gl, gr = pan_gains(pan)
            self.s[i0:i0 + len(seg), 0] += seg * gain * gl
            self.s[i0:i0 + len(seg), 1] += seg * gain * gr
            m = seg
        else:
            self.s[i0:i0 + len(seg)] += seg * gain
            m = seg.mean(axis=1)
        if send:
            self.rv[i0:i0 + len(seg)] += m * gain * send


def peak(x):
    return float(np.max(np.abs(x)))


def write_wav(path, st):
    q = np.clip(np.round(st * 32767.0), -32768, 32767).astype('<i2')
    with wave.open(path, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes(q.tobytes())


def read_wav_mono(path):
    with wave.open(path, 'rb') as w:
        assert w.getframerate() == SR
        nch = w.getnchannels()
        d = np.frombuffer(w.readframes(w.getnframes()), dtype='<i2').astype(np.float64) / 32768.0
    if nch > 1:
        d = d.reshape(-1, nch).mean(axis=1)
    return d


# --------------------------------------------------------------------------
# One-shot templates
# --------------------------------------------------------------------------
def hp1(x):
    return np.concatenate([[0.0], np.diff(x)])


def end_fade(n, secs):
    return np.minimum(1.0, (n - np.arange(n)) / (secs * SR))


def make_kick_soft(length=0.6, f0=112.0, f1=46.0, tau_f=0.05, tau_a=0.26, drive=1.15, click=0.12):
    n = int(length * SR); t = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-t / tau_f)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / tau_a) * (1 - np.exp(-t / 0.002))
    body = np.tanh(drive * body) / np.tanh(drive)
    body += hp1(rng.standard_normal(n)) * np.exp(-t / 0.003) * click * 0.5
    body *= end_fade(n, 0.05)
    return body * 0.8 / peak(body)


def make_thump(f0, f1, tau_a, length=0.4):      # heartbeat 'lub'/'dub'
    n = int(length * SR); t = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-t / 0.035)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / tau_a) * (1 - np.exp(-t / 0.004))
    x *= end_fade(n, 0.05)
    return x * 0.8 / peak(x)


def make_tom(length=1.0):
    n = int(length * SR); t = np.arange(n) / SR
    f = 58 + 52 * np.exp(-t / 0.07)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.33) * (1 - np.exp(-t / 0.003))
    th = svf(rng.standard_normal(n), 380, 0.8, 'lp') * np.exp(-t / 0.03) * 0.5
    x = (x + th) * end_fade(n, 0.1)
    return x * 0.85 / peak(x)


def make_snare_soft():
    n = int(0.3 * SR); t = np.arange(n) / SR
    nz = svf(rng.standard_normal(n), 2400, 0.7, 'bp') + 0.3 * svf(rng.standard_normal(n), 6000, 0.7, 'hp')
    tone = np.sin(2 * np.pi * np.cumsum(185 + 50 * np.exp(-t / 0.02)) / SR) * np.exp(-t / 0.07)
    x = (nz * np.exp(-t / 0.11) * (1 - np.exp(-t / 0.002)) + tone * 0.35) * end_fade(n, 0.05)
    return x * 0.5 / peak(x)


def make_shaker():
    n = int(0.14 * SR); t = np.arange(n) / SR
    x = svf(rng.standard_normal(n), 5200, 0.7, 'hp')
    x = svf(x, 11000, 0.7, 'lp') * (1 - np.exp(-t / 0.007)) * np.exp(-t / 0.032) * end_fade(n, 0.02)
    return x * 0.5 / peak(x)


def make_crash(length=3.4, tau=0.9, hp=3200.0):
    n = int(length * SR); t = np.arange(n) / SR
    x = svf(rng.standard_normal(n), hp, 0.8, 'hp')
    x *= np.exp(-t / tau) * (1 - np.exp(-t / 0.004)) * end_fade(n, 0.2)
    return x * 0.6 / peak(x)


def sub_boom(length, f0, f1, decay, tau_f=0.12):
    n = int(length * SR); t = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-t / tau_f)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / decay) * (1 - np.exp(-t / 0.004))
    return x * end_fade(n, 0.08)


def noise_riser(length, f0, f1, curve=2.0, q=1.0, hp=120.0):
    n = int(length * SR); u = np.arange(n) / n
    fc = f0 * (f1 / f0) ** u
    x = np.stack([svf(rng.standard_normal(n), fc, q, 'lp') for _ in range(2)], axis=1)
    for c in range(2):
        x[:, c] = fft_filter(x[:, c], hp=hp, order=1)
    x *= (u ** curve)[:, None]
    x /= max(1e-9, peak(x))
    return x * end_fade(n, 0.01)[:, None]


def bubble(f0, rise=5.0, tau=0.03, length=0.16):
    n = int(length * SR); t = np.arange(n) / SR
    f = f0 * (1 + rise * t / (1 + 4 * t))
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * (1 - np.exp(-t / 0.0015)) * np.exp(-t / tau)
    return x * end_fade(n, 0.01)


def piano(freq, vel, length=3.6):
    """Felt-piano: inharmonic decaying partials, soft hammer; long natural ring."""
    n = int(length * SR); t = np.arange(n) / SR
    tau0 = float(np.clip(2.6 * (220.0 / freq) ** 0.3, 1.2, 3.4))
    x = np.zeros(n)
    for k in range(1, 11):
        fk = freq * k * math.sqrt(1 + 0.00035 * k * k)
        if fk > 7500:
            break
        a = (1.0 / k ** 1.25) * (0.55 ** max(0, k - 3) if k > 3 else 1.0)
        tau = tau0 / (1 + 0.8 * (k - 1))
        x += a * np.sin(2 * np.pi * fk * t + 0.7 * k) * np.exp(-t / tau)
        if k <= 3:
            x += 0.45 * a * np.sin(2 * np.pi * fk * 1.0017 * t) * np.exp(-t / (tau * 0.85))
    x *= (1 - np.exp(-t / 0.004))
    th = svf(rng.standard_normal(int(0.05 * SR)), 900, 0.7, 'lp')
    x[:len(th)] += th * np.exp(-np.arange(len(th)) / SR / 0.01) * 0.12
    x *= end_fade(n, 0.2)
    return x * vel * 0.34 / peak(x)


def glass(freq, vel, tau=0.55):
    n = int(min(3.0, tau * 7) * SR); t = np.arange(n) / SR
    x = np.zeros(n)
    for r, a, d in ((1.0, 1.0, 1.0), (2.0, 0.22, 0.55), (3.01, 0.12, 0.35), (5.02, 0.05, 0.2)):
        x += a * np.sin(2 * np.pi * freq * r * t) * np.exp(-t / (tau * d))
    x *= (1 - np.exp(-t / 0.003)) * end_fade(n, 0.1)
    return x * vel * 0.26 / peak(x)


# --------------------------------------------------------------------------
# Harmony / form  (D major, hopeful)
# --------------------------------------------------------------------------
CHORDS = {
    'D':     dict(root=38, pad=[50, 57, 62, 66, 69], arp=[62, 66, 69, 74, 78, 81]),
    'A':     dict(root=33, pad=[52, 57, 61, 64, 69], arp=[57, 61, 64, 69, 73, 76]),
    'Bm':    dict(root=35, pad=[50, 54, 59, 62, 66], arp=[59, 62, 66, 71, 74, 78]),
    'G':     dict(root=31, pad=[50, 55, 59, 62, 67], arp=[55, 59, 62, 67, 71, 74]),
    'Em7':   dict(root=40, pad=[52, 55, 59, 62, 67], arp=[55, 59, 62, 64, 67, 71]),
    'Asus4': dict(root=33, pad=[52, 57, 62, 64, 69], arp=[57, 62, 64, 69, 74, 76]),
    'Dadd9': dict(root=38, pad=[50, 57, 62, 64, 66, 69], arp=[62, 64, 66, 69, 74, 76, 78, 81]),
    'Gmaj7': dict(root=43, pad=[50, 55, 59, 62, 66], arp=[59, 62, 66, 67, 71, 74, 78, 79]),
    'Bm7':   dict(root=35, pad=[50, 54, 57, 62, 66], arp=[57, 59, 62, 66, 69, 71, 74, 78]),
    'Dmaj9': dict(root=38, pad=[50, 54, 57, 61, 64, 69], arp=[61, 64, 66, 69, 73, 74, 76, 78, 81]),
}
LETTERS = 'ABCDEFGH'
SECTS = [(LETTERS[i], SEC[i]['from'], SEC[i]['to']) for i in range(8)]
PLAN = {   # chord names, chord length in beats
    'A': (['D'], 4), 'B': (['D', 'Bm', 'G', 'A'], 4), 'C': (['Bm', 'G', 'D', 'A'], 2),
    'D': (['Bm', 'G', 'Em7', 'Asus4'], 2), 'E': (['Bm', 'G', 'D', 'Bm', 'A'], 2),
    'F': (['D', 'A', 'Bm', 'G'], 4), 'G': (['G', 'D', 'Bm', 'A'], 2),
    'H': (['Dadd9', 'Gmaj7', 'Bm7', 'Dmaj9'], 4)}
CH = []   # (t0, t1, name, section letter, index within section)
for _l, _a, _b in SECTS:
    _names, _L = PLAN[_l]
    _Ls = _L * BEAT; _t = _a; _k = 0
    while _t < _b - 1e-6:
        _te = min(_t + _Ls, _b)
        if _b - _te < 0.5 * _Ls:
            _te = _b
        CH.append((_t, _te, _names[_k % len(_names)], _l, _k)); _t = _te; _k += 1


def chord_at(t):
    for a, b, n, l, k in CH:
        if a <= t + 1e-9 < b:
            return n
    return CH[-1][2]


def sec_at(t):
    for l, a, b in SECTS:
        if a - 1e-9 <= t < b - 1e-9:
            return l
    return 'H'


def sec_range(l):
    for ll, a, b in SECTS:
        if ll == l:
            return a, b


SFX = TIMING['sfx']
HITS = [e for e in SFX if e['type'] == 'hit']
BIG_T = max(e['t'] for e in HITS if e.get('big'))


# --------------------------------------------------------------------------
# Ambience: ocean wash with slow swells + distant bubbling
# --------------------------------------------------------------------------
def water_bed():
    t = np.arange(N) / SR
    out = np.zeros((N, 2))
    for ch in range(2):
        lo = fft_filter(rng.standard_normal(N), lp=420, hp=50, order=2)
        mid = fft_filter(rng.standard_normal(N), lp=2400, hp=260, order=2)
        hi = fft_filter(rng.standard_normal(N), lp=7500, hp=2600, order=1)
        l1 = (0.5 + 0.5 * np.sin(2 * np.pi * t / 9.3 + ch * 1.3)) ** 1.5
        l2 = (0.5 + 0.5 * np.sin(2 * np.pi * t / 6.1 + 0.7 + ch * 0.9)) ** 2
        l3 = (0.5 + 0.5 * np.sin(2 * np.pi * t / 7.7 + 2.1 + ch * 1.7)) ** 3
        out[:, ch] = (lo / lo.std()) * (0.45 + 0.55 * l1) + 0.55 * (mid / mid.std()) * (0.15 + 0.85 * l2) \
            + 0.2 * (hi / hi.std()) * l3
    out *= 0.05 / math.sqrt(np.mean(out ** 2))
    out *= auto([(0, 1.1), (S_B - 0.3, 1.0), (S_B + 0.9, 0.38), (VO_END - 0.4, 0.38), (VO_END + 1.6, 0.95),
                 (DUR - 5.0, 1.0), (DUR, 1.0)])[:, None]
    return out


def distant_bubbles(bus):
    t = 2.5
    while t < DUR - 4.0:
        for j in range(int(rng.integers(3, 7))):
            tt = t + j * rng.uniform(0.07, 0.2)
            f0 = rng.uniform(380, 900) * (1 + 0.12 * j)
            bus.add(bubble(f0, rise=rng.uniform(3, 7), tau=rng.uniform(0.02, 0.04)), tt, rng.uniform(0.04, 0.09),
                    pan=rng.uniform(-0.8, 0.8), send=0.7)
        t += rng.uniform(3.2, 7.5)


# --------------------------------------------------------------------------
# MUSIC
# --------------------------------------------------------------------------
def render_music():
    log('music: templates')
    K = make_kick_soft(); K_big = make_kick_soft(1.2, 120, 38, 0.07, 0.55, 1.3, 0.05)
    HB1 = make_thump(88, 44, 0.13); HB2 = make_thump(100, 52, 0.09)
    TOM = make_tom(); SNR = make_snare_soft(); SHK = make_shaker()
    CR_BIG = make_crash(6.0, 1.8, 2800.0); CR_REV = make_crash(2.4, 0.5, 3000.0)[::-1].copy()

    drums = Bus(); fx = Bus(); inst = Bus()

    # ----- drums / pulses -----
    log('music: drums')
    def grid(a, b, step_beats, off=0.0):
        t = a + off * BEAT; out = []
        while t < b - 1e-6:
            out.append(t); t += step_beats * BEAT
        return out

    # heartbeat build (C): lub-dub every beat, growing
    a, b = sec_range('C')
    for t in grid(a, b, 1.0):
        u = (t - a) / (b - a)
        drums.add(HB1, t, 0.35 + 0.5 * u); drums.add(HB2, t + 0.21, 0.2 + 0.35 * u)
    # tension (D): heartbeat quickens
    a, b = sec_range('D'); t = a; iv = BEAT
    while t < b - 0.1:
        u = (t - a) / (b - a)
        drums.add(HB1, t, 0.8 + 0.2 * u); drums.add(HB2, t + 0.19, 0.5 + 0.3 * u)
        iv = BEAT * (1.0 - 0.38 * u); t += iv
    # ostinato (E): soft pulse on the beat
    a, b = sec_range('E')
    for t in grid(a, b, 1.0):
        drums.add(HB1, t, 0.42, send=0.1)
    # uplift (F): warm groove entering softly
    a, b = sec_range('F')
    for i, t in enumerate(grid(a, b, 1.0)):
        u = min(1.0, (t - a) / BAR_ if False else (t - a) / (4 * BEAT))
        beat = i % 4
        if beat in (0, 2) or (beat == 3 and i % 8 == 7):
            drums.add(K, t, (0.5 + 0.45 * u) * (0.85 if beat == 3 else 1.0))
        if beat in (1, 3):
            drums.add(SNR, t, 0.35 + 0.35 * u, send=0.25)
    for i, t in enumerate(grid(a, b, 0.5)):
        u = min(1.0, (t - a) / (8 * BEAT))
        drums.add(SHK, t, (0.28 if i % 2 == 0 else 0.45) * (0.4 + 0.6 * u), pan=0.35 if i % 4 < 2 else -0.35)
    # full energy (G): four on the floor, warm
    a, b = sec_range('G')
    for i, t in enumerate(grid(a, b, 1.0)):
        drums.add(K, t, 0.95)
        if i % 4 in (1, 3):
            drums.add(SNR, t, 0.7, send=0.3)
        if i % 4 == 3:
            drums.add(SNR, t + 0.5 * BEAT, 0.3, send=0.3)
    for i, t in enumerate(grid(a, b, 0.5)):
        drums.add(SHK, t, 0.3 if i % 2 == 0 else 0.5, pan=0.35 if i % 4 < 2 else -0.35)
    # bloom + calm (H): a few warm kicks, shaker tapering, no drums after ~44 s
    a, b = sec_range('H')
    drums.add(K_big, a, 1.0)
    for j, v in enumerate([0.55, 0.4, 0.3]):
        drums.add(K, a + 2 * BEAT * (j + 1), v)
    for i, t in enumerate(grid(a + 0.5 * BEAT, a + 9 * BEAT, 0.5)):
        drums.add(SHK, t, (0.3 if i % 2 == 0 else 0.4) * (1 - i / 20.0), pan=0.3 if i % 4 < 2 else -0.3)
    # accents on the narration hits (music follows the cues, not the grid)
    for e in HITS:
        t = e['t']
        if e.get('big'):
            continue
        drums.add(TOM, t, 0.8, send=0.3)
    # impacts / swells
    fx.add(CR_BIG, BIG_T, 0.55, send=0.35)
    fx.add(sub_boom(4.5, 70, 33, 1.8), BIG_T, 0.7)
    a_, _ = sec_range('F')
    fx.add(CR_REV * np.linspace(0.1, 1, len(CR_REV)) ** 1.5, a_ - 2.4, 0.38, send=0.3)
    fx.add(sub_boom(2.0, 62, 36, 0.8), a_, 0.55)
    # risers: tension (D) and pre-bloom (G)
    a, b = sec_range('D')
    fx.add(noise_riser(b - a, 150, 5000, 2.2), a, 0.3, send=0.2)
    a, b = sec_range('G')
    fx.add(noise_riser(2.6, 300, 8000, 2.3), b - 2.6, 0.38, send=0.25)
    # low rumble in the tension section
    a, b = sec_range('D')
    rum = fft_filter(rng.standard_normal(N), lp=120, hp=28, order=2)
    rum *= auto([(a, 0.0), (a + 0.6, 0.6), (b - 0.3, 1.0), (b, 0.0)]) * (0.7 + 0.3 * np.sin(2 * np.pi * np.arange(N) / SR * 0.35))
    rum *= 0.11 / math.sqrt(np.mean(rum[t2i(a):t2i(b)] ** 2))

    # ----- piano / glass events -----
    log('music: piano + glass')
    pev = []; gev = []
    pev.append((0.62, 62, 0.5))
    for (a, b, name, l, k) in CH:
        tn = CHORDS[name]['arp']; pad = CHORDS[name]['pad']; B_ = b - a
        if l == 'B':
            for off, idx, v in ((0, 2, .6), (1.5, 3, .5), (2.5, 2, .42)):
                if a + off * BEAT < b - 0.15:
                    pev.append((a + off * BEAT, tn[idx], v))
        elif l == 'C':
            u = (a - S_C) / (S_D - S_C)
            for off, idx, v in ((0, 1, .75), (.5, 2, .45), (1, 3, .55), (1.5, 2, .45)):
                if a + off * BEAT < b - 0.1:
                    pev.append((a + off * BEAT, tn[idx], v * (0.55 + 0.6 * u)))
        elif l == 'D':
            pev.append((a, tn[0] - 12, .55)); pev.append((a, tn[1] - 12, .4))
            if B_ > 1.0:
                pev.append((a + BEAT, tn[4], .22))
        elif l == 'E':
            u = (a - S_E) / (S_F - S_E); base = min(2, k // 2)
            for off, idx, v in ((0, 0, .8), (.5, 1, .45), (1, 2, .55), (1.5, 1, .45)):
                if a + off * BEAT < b - 0.1:
                    pev.append((a + off * BEAT, tn[base + idx], v * (0.8 + 0.4 * u)))
        elif l == 'F':
            pev.append((a, tn[1], .55)); pev.append((a, tn[3], .4)); pev.append((a + 2.5 * BEAT, tn[2], .35))
            for i, (idx) in enumerate([0, 2, 4, 2, 5, 4, 2, 3]):
                tt = a + i * 0.5 * BEAT
                if tt < b - 0.1:
                    gev.append((tt, tn[idx] + 12, (0.5 if i % 2 == 0 else 0.32) * min(1.0, 0.5 + (a - S_F) / 3.0)))
        elif l == 'G':
            for off, idx, v in ((0, 2, .5), (.5, 3, .3), (1, 4, .4), (1.5, 3, .3)):
                if a + off * BEAT < b - 0.1:
                    pev.append((a + off * BEAT, tn[idx], v))
            for off, idx in ((0.25, 3), (0.75, 4), (1.25, 5), (1.75, 4)):
                if a + off * BEAT < b - 0.1:
                    gev.append((a + off * BEAT, tn[idx] + 12, .4))
        elif l == 'H':
            u = (a - S_H) / (DUR - S_H)
            for j, m in enumerate(pad):       # rolled chord
                pev.append((a + 0.07 * j, m + 12 if j >= 2 else m, (0.75 if k == 0 else 0.45) * (1 - 0.5 * u)))
            for off, idx, v in ((1.5, 4, .35), (2.5, 5, .3)):
                if a + off * BEAT < b - 0.1:
                    pev.append((a + off * BEAT, tn[idx], v * (1 - 0.6 * u)))
    for e in HITS:
        if e.get('big'):
            continue
        for j, m in enumerate(CHORDS[chord_at(e['t'])]['pad'][:3]):
            pev.append((e['t'] + 0.025 * j, m - 12, .65))
    # 'light on water' chimes in the calm tail
    t = S_H + 2.4; j = 0
    pool = [78, 81, 83, 86, 90, 93, 95]
    while t < DUR - 3.0:
        gev.append((t, pool[int(rng.integers(len(pool)))], 0.55 * (1 - 0.7 * (t - S_H) / (DUR - S_H))))
        t += 0.55 + 0.35 * j + rng.uniform(0, 0.4); j += 1
    for (t, m, v) in pev:
        inst.add(piano(float(mtof(m)), v), t, 1.0, pan=float(np.clip((m - 62) / 40.0, -0.5, 0.5)), send=0.55)
    for (t, m, v) in gev:
        inst.add(glass(float(mtof(m)), v), t, 1.0, pan=float(rng.uniform(-0.7, 0.7)), send=0.6)

    # ----- sub -----
    log('music: sub')
    sub = np.zeros(N)
    SUBL = {'A': .3, 'B': .55, 'C': .65, 'D': .8, 'E': .8, 'F': .9, 'G': 1.0, 'H': .8}
    for (a, b, name, l, k) in CH:
        f = float(mtof(CHORDS[name]['root']))
        d = b - a; n = int((d + 0.5) * SR); i = t2i(a); e = min(N, i + n); n = e - i
        tt = np.arange(n) / SR
        env = smooth(tt / 0.1) * np.where(tt < d, 1.0, np.exp(-(tt - d) / 0.15))
        x = np.sin(2 * np.pi * f * tt) + 0.25 * np.sin(4 * np.pi * f * tt) + 0.08 * np.sin(6 * np.pi * f * tt)
        sub[i:e] += x * env * SUBL[l] * (0.7 if l == 'H' and a > S_H + 4 else 1.0)
    sub *= 0.12 / np.sqrt(np.mean(sub ** 2) + 1e-12)

    # ----- strings pad -----
    log('music: strings')
    padL = np.zeros(N); padR = np.zeros(N)
    ATK = {'A': 1.1, 'B': .9, 'C': .7, 'D': .8, 'E': .5, 'F': .4, 'G': .35, 'H': .3}
    for (a, b, name, l, k) in CH:
        rel = 1.0
        i = t2i(a); n = int((b - a + rel) * SR); e = min(N, i + n); n = e - i
        tt = np.arange(n) / SR
        env = smooth(tt / ATK[l]) * np.where(tt < (b - a), 1.0, smooth(1 - (tt - (b - a)) / rel))
        for m in CHORDS[name]['pad']:
            f = float(mtof(m))
            for (dc, side) in ((-10, 0), (3, 0), (10, 1), (-3, 1)):
                vib = 1 + 0.0013 * np.sin(2 * np.pi * rng.uniform(0.25, 0.55) * tt + rng.uniform(0, 6.28))
                v = saw(f * 2 ** (dc / 1200.0) * vib, n, phase=rng.random()) * env
                (padL if side == 0 else padR)[i:e] += v
    pad_fc = auto([(0, 300), (S_B, 1100), (S_C, 1400), (S_D - .01, 2300), (S_D, 900), (S_D + 3.0, 1500),
                   (S_E, 1800), (S_F - .01, 3000), (S_F, 3300), (S_G, 3900), (S_H - .01, 5200), (S_H, 5600),
                   (S_H + 5, 3600), (DUR, 2500)], True)
    padL = svf(padL, pad_fc, 0.8, 'lp'); padR = svf(padR, pad_fc, 0.8, 'lp')
    pad_lvl = auto([(0, .05), (S_B, .6), (S_C, .6), (S_C + .01, .7), (S_D - .01, .95), (S_D, .72), (S_E - .01, .8),
                    (S_E, .85), (S_F - .01, 1.1), (S_F, 1.0), (S_G - .01, 1.05), (S_G, 1.15), (S_H - .01, 1.2),
                    (S_H, 1.4), (S_H + 4.5, 1.05), (DUR, .8)])
    pn = 0.13 / np.sqrt(0.5 * (np.mean(padL ** 2) + np.mean(padR ** 2)) + 1e-12)
    padL *= pn * pad_lvl; padR *= pn * pad_lvl
    pad_mono = 0.5 * (padL + padR)

    # ----- tonal string risers (D tension, G pre-bloom) -----
    def string_riser(t0, t1, midis, semis=7.0, level=0.5):
        n = int((t1 - t0) * SR); u = np.arange(n) / n
        gl = 2 ** (semis * u / 12.0)
        accL = np.zeros(n); accR = np.zeros(n)
        for m in midis:
            f = float(mtof(m))
            for (dc, side) in ((-9, 0), (9, 1)):
                v = saw(f * 2 ** (dc / 1200.0) * gl, n, phase=rng.random())
                (accL if side == 0 else accR)[:] += v
        fc = 400 * (6000 / 400) ** u
        accL = svf(accL, fc, 0.8, 'lp'); accR = svf(accR, fc, 0.8, 'lp')
        env = (u ** 2.0) * end_fade(n, 0.05)
        sc = 0.08 / math.sqrt(np.mean(accL ** 2) + 1e-12)
        return np.stack([accL * env, accR * env], axis=1) * sc * level / 0.08 * 0.12

    a, b = sec_range('D')
    fx.add(string_riser(a + 0.3, b, [47, 54, 59, 62]), a + 0.3, 1.0, send=0.25)
    a, b = sec_range('G')
    fx.add(string_riser(b - 2.8, b, [50, 57, 62, 66]), b - 2.8, 1.0, send=0.3)

    # ----- string lead melody (F, G, H first bars) -----
    log('music: lead')
    lead = np.zeros(N)
    def lnote(t, dur, m, v):
        i = t2i(t); n = int((dur + 0.5) * SR); e = min(N, i + n); n = e - i
        if n <= 0:
            return
        tt = np.arange(n) / SR
        f = float(mtof(m)) * (1 + 0.004 * smooth((tt - 0.25) / 0.4) * np.sin(2 * np.pi * 5.3 * tt))
        env = smooth(tt / 0.16) * np.where(tt < dur, 1.0, np.exp(-(tt - dur) / 0.2))
        x = saw(f * 2 ** (-6 / 1200), n) + saw(f * 2 ** (6 / 1200), n, 0.3) + 0.5 * np.sin(2 * np.pi * np.cumsum(f) / SR)
        lead[i:e] += x * env * v
    for (a, b, name, l, k) in CH:
        tn = CHORDS[name]['arp']
        if l == 'F':
            pat = [(0, 2, 4), (2, 1, 3), (3, 1, 5)] if k % 2 == 0 else [(0, 1, 3), (1, 1, 4), (2, 2, 5)]
            for off, d, idx in pat:
                lnote(a + off * BEAT, d * BEAT * 0.97, tn[idx], 0.8)
        elif l == 'G':
            lnote(a, 1.5 * BEAT, tn[5], 0.9); lnote(a + 1.5 * BEAT, 0.5 * BEAT, tn[4], 0.7)
        elif l == 'H' and k <= 1:
            lnote(a, 2 * BEAT, tn[6], 0.8 - 0.2 * k); lnote(a + 2 * BEAT, 2 * BEAT * 0.97, tn[5], 0.7 - 0.2 * k)
    lead = svf(lead, 2500, 0.7, 'lp')
    lead *= 0.11 / np.sqrt(np.mean(lead[t2i(S_F):t2i(S_H)] ** 2) + 1e-12)
    lead *= auto([(0, 0), (S_F - .01, 0), (S_F, 1.0), (S_G, 1.2), (S_H, 1.1), (S_H + 6, .6), (DUR, .3)])
    d_ = int(0.014 * SR)
    leadL = lead; leadR = np.concatenate([np.zeros(d_), lead[:-d_]])

    # ----- ambience -----
    log('music: water bed')
    bed = water_bed()
    amb = Bus(); distant_bubbles(amb)

    # ----- assemble -----
    log('music: mix + reverb')
    L = padL + sub + leadL * 0.9 + drums.s[:, 0] + fx.s[:, 0] + inst.s[:, 0] + rum
    R = padR + sub + leadR * 0.9 + drums.s[:, 1] + fx.s[:, 1] + inst.s[:, 1] + rum
    send = pad_mono * 0.4 + lead * 0.3 + drums.rv * 0.5 + fx.rv * 0.8 + inst.rv + amb.rv
    if os.environ.get('SIREC_STEMS'):
        np.savez(os.path.join(SCR, 'stems.npz'), pad=padL, sub=sub, lead=leadL, drums=drums.s[:, 0], fx=fx.s[:, 0],
                 inst=inst.s[:, 0], bed=bed[:, 0], amb=amb.s[:, 0])
    wet = reverb(send, rt60=3.6, lp=6000, hp=160)
    wet *= auto([(0, 1.0), (S_F, 1.0), (S_H, 1.4), (S_H + 4.5, 1.7), (DUR, 1.7)])[:, None]
    L += wet[:, 0] * 0.55; R += wet[:, 1] * 0.55
    st = np.stack([L, R], axis=1)
    macro = auto([(0, .6), (S_B - .01, .7), (S_B, .72), (S_C, .85), (S_D - .01, .95), (S_D, .85), (S_E, .95),
                  (S_F - .01, 1.0), (S_F, 1.05), (S_G, 1.15), (S_H - .01, 1.2), (S_H, 1.35), (S_H + 4.5, 1.1), (DUR, 1.0)])
    st *= macro[:, None]
    st += bed + amb.s
    for c in range(2):
        st[:, c] = fft_filter(st[:, c], hp=26, order=2)
    pk = peak(st)
    st = np.tanh(st / pk * 1.2) / np.tanh(1.2)
    tt = np.arange(N) / SR
    fade = np.ones(N)
    m = tt >= FADE_START
    fade[m] = np.cos(0.5 * np.pi * (tt[m] - FADE_START) / (DUR - FADE_START)) ** 2
    fi = int(0.02 * SR)
    fade[:fi] *= np.linspace(0, 1, fi)
    fade[-1] = 0.0
    st *= fade[:, None]
    st *= 10 ** (-3.0 / 20) / peak(st)
    st[-1, :] = 0.0
    return st


# --------------------------------------------------------------------------
# SFX (watery)
# --------------------------------------------------------------------------
def render_sfx():
    S = Bus()
    log('sfx: rendering', len(SFX), 'cues')

    def bubbles():
        out = np.zeros((int(1.9 * SR), 2)); t = 0.0; j = 0
        while t < 1.45:
            f0 = 420 * (1 + 0.09 * j) * rng.uniform(0.85, 1.25)
            b = bubble(f0, rise=rng.uniform(4, 8), tau=rng.uniform(0.022, 0.05), length=0.2) * rng.uniform(0.07, 0.16)
            gl, gr = pan_gains(rng.uniform(-0.6, 0.6)); i = int(t * SR)
            out[i:i + len(b), 0] += b * gl; out[i:i + len(b), 1] += b * gr
            t += rng.uniform(0.035, 0.11) * (1.15 - 0.4 * t / 1.45); j += 1
        return out

    def drop(k):
        n = int(0.55 * SR); t = np.arange(n) / SR
        sc = [1.0, 0.86, 1.13][k % 3]
        f = (330 + 900 * np.exp(-t / 0.045)) * sc
        x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.11) * (1 - np.exp(-t / 0.0012))
        x += 0.25 * np.sin(4 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.05)
        x += hp1(rng.standard_normal(n)) * np.exp(-t / 0.004) * 0.08
        x *= end_fade(n, 0.05)
        return x * 0.22 / peak(x)

    def swell(length):
        n = int(length * SR); u = np.arange(n) / n; t = u * length
        fc = 220 * (4200 / 220) ** (u ** 1.3)
        chans = []
        for c in range(2):
            nz = rng.standard_normal(n)
            x = svf(nz, fc, 0.9, 'lp')
            am = 0.75 + 0.25 * np.sin(2 * np.pi * (5 + 4 * u) * t + c * 1.7)   # soft gurgle
            chans.append(x * am)
        x = np.stack(chans, axis=1)
        x /= peak(x)
        x *= (u ** 2.2)[:, None] * end_fade(n, 0.004)[:, None]
        return x * 0.26

    def hit(big):
        L_ = 4.5 if big else 1.6
        x = sub_boom(L_, 72 if not big else 66, 34, 1.5 if big else 0.55)
        n = len(x); t = np.arange(n) / SR
        tom = np.sin(2 * np.pi * np.cumsum(55 + 40 * np.exp(-t / 0.06)) / SR) * np.exp(-t / (0.5 if big else 0.28))
        th = svf(rng.standard_normal(int(0.4 * SR)), 300, 0.8, 'lp') * np.exp(-np.arange(int(0.4 * SR)) / SR / 0.04)
        x += 0.7 * tom
        x[:len(th)] += th * 0.5
        air = svf(rng.standard_normal(int((2.5 if big else 0.8) * SR)), 1800, 0.7, 'lp') * \
            np.exp(-np.arange(int((2.5 if big else 0.8) * SR)) / SR / (0.9 if big else 0.2))
        x[:len(air)] += air * (0.25 if big else 0.1)
        x *= end_fade(n, 0.1)
        return x * (0.85 if big else 0.55) / peak(x)

    def ping(k):
        f = [1175, 1480, 1760, 1319][k % 4]
        n = int(1.6 * SR); t = np.arange(n) / SR
        x = np.zeros(n)
        for r, a, d in ((1.0, 1.0, 1.0), (2.0, 0.25, 0.5), (3.0, 0.1, 0.3)):
            x += a * np.sin(2 * np.pi * f * r * t) * np.exp(-t / (0.4 * d))
        x *= (1 - np.exp(-t / 0.004)) * end_fade(n, 0.1)
        x = x * 0.16 / peak(x)
        st = np.stack([x, x * 0.75], axis=1)
        d = int(0.27 * SR)
        st[d:, 1] += x[:n - d] * 0.3
        return st

    def tick(k):
        n = int(0.012 * SR); t = np.arange(n) / SR
        x = np.sin(2 * np.pi * (2300 + 300 * (k % 3)) * t) * np.exp(-t / 0.0025) * end_fade(n, 0.003)
        return x * 0.04 / peak(x)

    def shimmer(big):
        Ls = 3.6 if big else 2.2
        n = int(Ls * SR); t = np.arange(n) / SR
        pool = [74, 78, 81, 83, 86, 90, 93, 95, 98]
        cnt = 22 if big else 14
        st = np.zeros((n, 2))
        for j in range(cnt):
            m = pool[min(len(pool) - 1, int(j * len(pool) / cnt + rng.random() * 1.5))]
            i = int(((j / cnt) ** 1.1 * Ls * 0.7 + rng.random() * 0.05) * SR)
            tt = np.arange(n - i) / SR
            x = np.sin(2 * np.pi * float(mtof(m)) * tt) * smooth(tt / 0.05) * np.exp(-tt / (0.6 if big else 0.35))
            gl, gr = pan_gains(rng.uniform(-0.8, 0.8))
            st[i:, 0] += x * gl; st[i:, 1] += x * gr
        nz = np.stack([svf(rng.standard_normal(n), 5600, 0.8, 'hp') for _ in range(2)], axis=1)
        u = t / Ls
        env = (np.sin(np.pi * np.clip(u / 0.85, 0, 1)) ** 2) * np.where(u < 0.85, 1.0, np.exp(-(u - 0.85) * 6))
        st += nz * (env * 0.15)[:, None]
        st /= peak(st)
        st *= end_fade(n, 0.15)[:, None]
        return st * (0.28 if big else 0.2)

    def sparkle():
        n = int(2.0 * SR); t = np.arange(n) / SR
        st = np.zeros((n, 2))
        for j, m in enumerate([90, 93, 98, 102]):
            i = int(j * 0.06 * SR); tt = t[:n - i]; f = float(mtof(m)); x = np.zeros(n - i)
            for r, a, d in ((1.0, 1.0, 0.9), (2.76, 0.22, 0.4), (5.4, 0.08, 0.2)):
                x += a * np.sin(2 * np.pi * f * r * tt) * np.exp(-tt / d)
            x *= (1 - np.exp(-tt / 0.003))
            gl, gr = pan_gains([-0.5, 0.1, 0.6, -0.2][j])
            st[i:, 0] += x * gl; st[i:, 1] += x * gr
        st /= peak(st); st *= end_fade(n, 0.2)[:, None]
        return st * 0.2

    def ripple(big):
        Ls = 6.0 if big else 3.0
        n = int(Ls * SR); t = np.arange(n) / SR
        st = np.zeros((n, 2))
        pool = [74, 78, 81, 83, 86, 90, 93, 78, 74]
        tt_ = 0.0; j = 0
        while tt_ < Ls - 1.0:       # expanding rings: onsets spread out, pitch falls, level decays
            m = pool[j % len(pool)] + (12 if j < 3 else 0) - (0 if j < 6 else 12)
            i = int(tt_ * SR); tt = np.arange(n - i) / SR; f = float(mtof(m))
            wob = 1 + 0.002 * np.sin(2 * np.pi * 6 * tt) * np.exp(-tt / 0.3)
            x = np.sin(2 * np.pi * np.cumsum(f * wob) / SR) * (1 - np.exp(-tt / 0.004)) * np.exp(-tt / 0.9)
            x += 0.2 * np.sin(2 * np.pi * f * 2.76 * tt) * np.exp(-tt / 0.35)
            gl, gr = pan_gains(rng.uniform(-0.9, 0.9))
            a = 0.9 * math.exp(-tt_ / 2.4)
            st[i:, 0] += x * gl * a; st[i:, 1] += x * gr * a
            tt_ += 0.09 + 0.07 * j ** 1.3 * 0.55; j += 1
        # splash burst + tremolo glass bed
        sp = svf(rng.standard_normal(int(0.9 * SR)), 3500, 0.8, 'bp') * np.exp(-np.arange(int(0.9 * SR)) / SR / 0.18)
        st[:len(sp), 0] += sp * 0.4; st[:len(sp), 1] += rng.permutation(sp) * 0.0 + sp * 0.35
        trem = 0.5 + 0.5 * np.sin(2 * np.pi * np.cumsum(9.0 * np.exp(-t / 1.8) + 1.2) / SR)
        for m in (86, 90, 93):
            g = np.sin(2 * np.pi * float(mtof(m)) * t) * trem * np.exp(-t / 1.5) * smooth(t / 0.3)
            st[:, 0] += g * 0.12; st[:, 1] += g * 0.12
        st /= peak(st); st *= end_fade(n, 0.3)[:, None]
        return st * (0.34 if big else 0.22)

    cnt = {'drop': 0, 'ping': 0}
    for ev in SFX:
        ty = ev['type']
        if ty == 'bubbles':
            S.add(bubbles(), ev['t'], 1.0, send=0.5)
        elif ty == 'drop':
            k = cnt['drop']; cnt['drop'] += 1
            S.add(drop(k), ev['t'], 1.0, pan=[-0.2, 0.25, 0.0][k % 3], send=0.55)
        elif ty == 'whoosh_in':
            w = swell(ev['len']); S.add(w, 0, 1.0, at_sample=t2i(ev['t']) - len(w), send=0.15)
        elif ty == 'hit':
            big = bool(ev.get('big')); S.add(hit(big), ev['t'], 1.0, send=0.6 if big else 0.25)
        elif ty == 'ping':
            k = cnt['ping']; cnt['ping'] += 1; S.add(ping(k), ev['t'], 1.0, send=0.4)
        elif ty == 'tick_run':
            k = 0
            while ev['from'] + k / ev['rate'] <= ev['to'] + 1e-9:
                S.add(tick(k), 0, 1.0, pan=0.2 * ((k % 3) - 1), at_sample=t2i(ev['from'] + k / ev['rate']))
                k += 1
        elif ty == 'shimmer':
            big = bool(ev.get('big')); S.add(shimmer(big), ev['t'], 1.0, send=0.5 if big else 0.35)
        elif ty == 'sparkle':
            S.add(sparkle(), ev['t'], 1.0, send=0.5)
        elif ty == 'ripple':
            big = bool(ev.get('big')); S.add(ripple(big), ev['t'], 1.0, send=0.7 if big else 0.4)
        else:
            raise ValueError(ty)
    log('sfx: reverb')
    wet = reverb(S.rv, rt60=3.0, lp=7000, hp=200)
    st = S.s + wet * 0.5
    st[-1, :] = 0.0
    return st


# --------------------------------------------------------------------------
# MIX
# --------------------------------------------------------------------------
def ffmpeg(*args):
    r = subprocess.run(['ffmpeg', '-hide_banner', '-nostdin', '-y'] + list(args), capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(r.stderr[-2000:])
    return r.stderr


def render_mix(music, sfx):
    vo_wav = os.path.join(SCR, 'sirec_' + os.path.splitext(os.path.basename(VO_FILE))[0] + '_48k.wav')
    ffmpeg('-i', os.path.join(ROOT, VO_FILE), '-ac', '1', '-ar', str(SR), '-c:a', 'pcm_s16le', vo_wav)
    vo = fft_filter(read_wav_mono(vo_wav), hp=70, order=2)
    off = t2i(VO_START)
    VO = np.zeros(N)
    n = min(len(vo), N - off)
    VO[off:off + n] = vo[:n]
    VO[N - 1] = 0.0
    FR = int(0.02 * SR)
    nf = N // FR
    fdb = 10 * np.log10(np.mean(VO[:nf * FR].reshape(nf, FR) ** 2, axis=1) + 1e-12)
    pres = np.clip((fdb - (-46.0)) / 8.0, 0.0, 1.0)
    a_att = math.exp(-0.02 / 0.08); a_rel = math.exp(-0.02 / 0.40)
    ps = np.zeros(nf); cur = 0.0
    for i in range(nf):
        a = a_att if pres[i] > cur else a_rel
        cur = a * cur + (1 - a) * pres[i]
        ps[i] = cur
    tf = (np.arange(nf) + 0.5) * 0.02
    depth = 6.5
    duck_s = 10 ** (np.interp(np.arange(N) / SR, tf, -depth * ps) / 20.0)
    shine = 10 ** (np.interp(np.arange(N) / SR, [0, VO_END, VO_END + 0.8, DUR], [0, 0, 4.5, 4.5]) / 20.0)
    smask = np.repeat(fdb > -40.0, FR)
    smask = np.concatenate([smask, np.zeros(N - len(smask), bool)])
    vo_rms = math.sqrt(np.mean(VO[smask] ** 2))
    md = music * (duck_s * shine)[:, None]
    g_mus = (vo_rms * 10 ** (-13.0 / 20)) / math.sqrt(np.mean(md[smask] ** 2))
    act = np.abs(sfx).max(axis=1) > 1e-4
    g_sfx = (vo_rms * 10 ** (-18.0 / 20)) / math.sqrt(np.mean(sfx[act] ** 2))
    log('mix: vo_rms %.1f dB, g_music %.2f dB, g_sfx %.2f dB' % (
        20 * math.log10(vo_rms), 20 * math.log10(g_mus), 20 * math.log10(g_sfx)))
    mix = md * g_mus + sfx * g_sfx + VO[:, None]
    mix[-1, :] = 0.0
    gap = ~smask; gap[:t2i(VO_START)] = False; gap[t2i(VO_END):] = False
    for nm, msk in (('speech', smask), ('gaps within VO span', gap)):
        log('mix: music in %s: ducked %.1f dB rms, un-ducked %.1f dB rms, mean duck %.1f dB' % (
            nm, 10 * np.log10(np.mean((md[msk] * g_mus) ** 2)),
            10 * np.log10(np.mean((music[msk] * g_mus) ** 2)), 20 * np.log10(np.mean(duck_s[msk]))))
    raw = os.path.join(SCR, 'sirec_mix_pre.f32')
    mix.astype('<f4').tofile(raw)
    lim = os.path.join(SCR, 'sirec_mix_lim.wav')
    ffmpeg('-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', raw, '-af',
           'alimiter=limit=0.72:attack=5:release=80:level=disabled', '-c:a', 'pcm_f32le', lim)
    inp = ['-i', lim]
    tgt = 'I=-16:TP=-1.8:LRA=11'
    err = ffmpeg(*inp, '-af', 'loudnorm=%s:print_format=json' % tgt, '-f', 'null', '-')
    js = json.loads(re.search(r'\{[^{}]*"input_i"[^{}]*\}', err, re.S).group(0))
    log('mix: loudnorm pass1 I=%s TP=%s' % (js['input_i'], js['input_tp']))
    af = ('loudnorm=%s:measured_I=%s:measured_TP=%s:measured_LRA=%s:measured_thresh=%s:offset=%s:linear=true,'
          'aresample=%d,apad=whole_len=%d,atrim=end_sample=%d') % (
        tgt, js['input_i'], js['input_tp'], js['input_lra'], js['input_thresh'], js['target_offset'], SR, N, N)
    ffmpeg(*inp, '-af', af, '-ar', str(SR), '-ac', '2', '-c:a', 'pcm_s16le', os.path.join(AUD, 'mix.wav'))


def main():
    music = render_music()
    write_wav(os.path.join(AUD, 'music.wav'), music)
    log('wrote music.wav peak %.2f dBFS' % (20 * math.log10(peak(music))))
    sfx = render_sfx()
    write_wav(os.path.join(AUD, 'sfx.wav'), sfx)
    log('wrote sfx.wav peak %.2f dBFS' % (20 * math.log10(peak(sfx))))
    render_mix(np.round(music * 32767) / 32767, np.round(sfx * 32767) / 32767)
    ffmpeg('-i', os.path.join(AUD, 'music.wav'), '-c:a', 'libmp3lame', '-b:a', '192k', os.path.join(AUD, 'music.mp3'))
    log('done')


if __name__ == '__main__':
    main()
