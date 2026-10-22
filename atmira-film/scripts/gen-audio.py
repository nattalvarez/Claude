#!/usr/bin/env python3
"""Atmira film audio generator (numpy + stdlib only; ffmpeg via subprocess).

Writes into public/audio/:  music.wav, sfx.wav, mix.wav, music.mp3
Reads: src/data/timing.json (cuts/sections/sfx/vo) and the VO mp3 named there (vo.file)
Run:   python3 -I scripts/gen-audio.py
"""
import json, math, os, re, subprocess, sys, time, wave

import numpy as np

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
AUD = os.path.join(ROOT, 'public', 'audio')
SCR = '/tmp/claude-0/-home-user-Claude/dc63f488-f345-5da7-9505-05cf39273789/scratchpad'
os.makedirs(SCR, exist_ok=True)

SR = 48000
DUR = 48
N = SR * DUR
STEP = SR // 8           # one 16th at 120 BPM = 6000 samples
rng = np.random.default_rng(20240607)
TIMING = json.load(open(os.path.join(ROOT, 'src', 'data', 'timing.json')))
T0 = time.time()

# --- timeline: every boundary below comes from timing.json (sections / cuts / vo / sfx) ---
SEC = TIMING['sections']
assert len(SEC) == 10, 'expected the 10-section energy arc'
T_B, T_C, T_D, T_E, T_F, T_G, T_H, T_I, T_J = [SEC[i]['from'] for i in range(1, 10)]
#  A 0..T_B tension | B sparse | C groove A | D groove A+clap | E half-energy | F groove B
#  G drop | H driving | I break | J bloom (impact at T_J)
VO_FILE = TIMING['vo']['file']
VO_START = TIMING['vo'].get('startsAt', TIMING['offset'])
VO_END = TIMING['vo']['endsAt']
FADE_START = 44.0         # music fades to true silence between FADE_START and 48.000


def log(*a):
    print('[%6.1fs]' % (time.time() - T0), *a, flush=True)


def t2i(t):
    return int(round(t * SR))


# --------------------------------------------------------------------------
# DSP primitives
# --------------------------------------------------------------------------
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
# One-shot templates (rendered once, placed many times)
# --------------------------------------------------------------------------
def hp1(x):  # crude first-difference highpass for clicks
    return np.concatenate([[0.0], np.diff(x)])


def end_fade(n, secs):
    return np.minimum(1.0, (n - np.arange(n)) / (secs * SR))


def make_kick(click=1.0, length=0.5, drive=1.8, f0=150.0, f1=45.0, tau_f=0.032, tau_a=0.17):
    n = int(length * SR)
    t = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-t / tau_f)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t / tau_a) * (1 - np.exp(-t / 0.0008))
    body = np.tanh(drive * body) / np.tanh(drive)
    clk = hp1(rng.standard_normal(n)) * np.exp(-t / 0.0018) * 0.22 * click
    clk += np.sin(2 * np.pi * 1900 * t) * np.exp(-t / 0.0025) * 0.18 * click
    k = (body + clk) * end_fade(n, 0.03)
    return k * 0.88 / max(1e-9, peak(k))


def make_snare():
    n = int(0.32 * SR)
    t = np.arange(n) / SR
    nz = svf(rng.standard_normal(n), 1800, 0.9, 'hp')
    nz = svf(nz, 9000, 0.7, 'lp')
    tone = np.sin(2 * np.pi * np.cumsum(175 + 90 * np.exp(-t / 0.02)) / SR) * np.exp(-t / 0.06)
    s = (nz * np.exp(-t / 0.085) * 0.9 + tone * 0.55) * end_fade(n, 0.03)
    return s * 0.7 / peak(s)


def make_clap():
    n = int(0.36 * SR)
    t = np.arange(n) / SR
    nz = rng.standard_normal(n)
    env = np.zeros(n)
    for off in (0.0, 0.011, 0.022):
        m = t >= off
        env[m] += np.exp(-(t[m] - off) / 0.004)
    env += np.exp(-t / 0.11) * 0.55 * (t > 0.02)
    c = svf(nz * env, 1400, 1.1, 'bp') + 0.35 * svf(nz * env, 3500, 0.8, 'hp')
    c *= end_fade(n, 0.03)
    return c * 0.6 / peak(c)


def make_hat(open_=False):
    n = int((0.55 if open_ else 0.13) * SR)
    t = np.arange(n) / SR
    nz = rng.standard_normal(n)
    met = sum(np.sign(np.sin(2 * np.pi * f * t)) for f in (3140, 4210, 5330, 6470, 7850, 9120)) / 6.0
    x = svf(nz * 0.8 + met * 0.4, 6200 if open_ else 7000, 0.8, 'hp')
    x *= np.exp(-t / (0.11 if open_ else 0.018)) * (1 - np.exp(-t / 0.0006)) * end_fade(n, 0.01)
    return x * 0.5 / peak(x)


def make_crash(length=3.4, tau=0.9, hp=3200.0):
    n = int(length * SR)
    t = np.arange(n) / SR
    x = svf(rng.standard_normal(n), hp, 0.8, 'hp')
    x *= np.exp(-t / tau) * (1 - np.exp(-t / 0.002)) * end_fade(n, 0.2)
    return x * 0.6 / peak(x)


def sub_boom(length, f0, f1, decay, tau_f=0.12):
    n = int(length * SR)
    t = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-t / tau_f)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / decay) * (1 - np.exp(-t / 0.002))
    return x * end_fade(n, 0.05)


def noise_riser(length, f0, f1, curve=2.0, q=1.2, hp=250.0):
    n = int(length * SR)
    u = np.arange(n) / n
    fc = f0 * (f1 / f0) ** u
    x = np.stack([svf(rng.standard_normal(n), fc, q, 'lp') for _ in range(2)], axis=1)
    for c in range(2):
        x[:, c] = fft_filter(x[:, c], hp=hp, order=1)
    x *= (u ** curve)[:, None]
    x /= max(1e-9, peak(x))
    x *= end_fade(n, 0.004)[:, None]
    return x


# --------------------------------------------------------------------------
# Harmony / form
# --------------------------------------------------------------------------
CHORDS = {
    'Am':  dict(root=33, pad=[52, 57, 60, 64], arp=[57, 60, 64, 69, 72, 76, 81, 84]),
    'F':   dict(root=29, pad=[53, 57, 60, 65], arp=[57, 60, 65, 69, 72, 77, 81, 84]),
    'C':   dict(root=36, pad=[55, 60, 64, 67], arp=[55, 60, 64, 67, 72, 76, 79, 84]),
    'G':   dict(root=31, pad=[55, 59, 62, 67], arp=[55, 59, 62, 67, 71, 74, 79, 83]),
    'Cadd9': dict(root=36, pad=[48, 55, 60, 64, 67, 71, 74],
                  arp=[60, 62, 64, 67, 72, 74, 76, 79, 84, 86]),
    'Fmaj7': dict(root=29, pad=[48, 53, 57, 60, 64, 69, 72],
                  arp=[57, 60, 64, 65, 69, 72, 76, 77, 81, 84]),
}
NAMES4 = ['Am', 'F', 'C', 'G']


def _cycle(t0, t1, turnaround=False):
    """Am-F-C-G in 2 s bars from t0 to t1. Remainder rule: turnaround=True -> a short leftover becomes a G
    (dominant into the cut); otherwise a last chord shorter than 3 s simply holds until t1."""
    out = []; t = t0; k = 0
    while t < t1 - 1e-9:
        rem = t1 - t
        if turnaround:
            if rem < 2.0 - 1e-9:
                out.append((t, t1, 'G')); break
            end = t + 2.0
        else:
            end = t + 2.0 if rem >= 3.0 else t1
        out.append((t, end, NAMES4[k % 4])); t = end; k += 1
    return out


CH = _cycle(0.0, T_F, turnaround=True)                                      # bars from the top, G turnaround into groove B
CH += _cycle(T_F, T_G)                                     # groove B: Am F C G
CH += [(T_G, T_G + 1.0, 'Am'), (T_G + 1.0, T_G + 2.0, 'F'), (T_G + 2.0, T_H, 'G')]   # drop
CH += _cycle(T_H, T_J)                                     # driving: Am F C, G held until the bloom
CH += [(T_J, T_J + 2, 'Cadd9'), (T_J + 2, T_J + 4, 'Fmaj7'), (T_J + 4, T_J + 6, 'Cadd9'), (T_J + 6, 48.0, 'Fmaj7')]


def chord_at(t):
    for a, b, n in CH:
        if a <= t + 1e-9 < b:
            return n
    return CH[-1][2]


_L = 'ABCDEFGHIJ'
SECTIONS = []
for _i, _s in enumerate(SEC):
    if _L[_i] == 'F':       # last half-second of groove B = pre-drop roll 'P'
        SECTIONS += [('F', _s['from'], _s['to'] - 0.5), ('P', _s['to'] - 0.5, _s['to'])]
    else:
        SECTIONS.append((_L[_i], _s['from'], _s['to']))


def sec_at(t):
    for n, a, b in SECTIONS:
        if a - 1e-9 <= t < b - 1e-9:
            return n
    return 'J'


# --------------------------------------------------------------------------
# MUSIC
# --------------------------------------------------------------------------
def render_music():
    log('music: templates')
    K_hard = make_kick(1.0)
    K_soft = make_kick(0.35, length=0.4, drive=1.2, f0=120, tau_a=0.13)
    K_heavy = make_kick(1.3, length=0.7, drive=2.6, f0=170, f1=42, tau_a=0.26)
    SN = make_snare(); CL = make_clap()
    HC = make_hat(False); HO = make_hat(True)
    CR = make_crash(3.4, 0.9); CR_BIG = make_crash(6.0, 1.7, 2500.0); CR_S = make_crash(1.6, 0.35)

    drums = Bus()
    fx = Bus()
    kick_ev = []   # (t, depth) sidechain events
    sec_kick_depth = {'B': .35, 'C': .62, 'D': .62, 'E': .3, 'F': .68, 'G': .6, 'H': .66, 'J': .5}

    def kick(t, vel, kind='hard', sc=True):
        buf = {'hard': K_hard, 'soft': K_soft, 'heavy': K_heavy}[kind]
        drums.add(buf, t, vel)
        if sc:
            kick_ev.append((t, sec_kick_depth.get(sec_at(t), .5) * min(1.0, 0.4 + vel)))

    log('music: sequencing drums')
    acc16 = [1.0, 0.5, 0.75, 0.5]
    for beat in range(96):
        t = beat * 0.5
        s = sec_at(t)
        if s == 'B':
            if t >= T_B + 0.5 and beat % 2 == 0:
                kick(t, 0.6, 'soft')
        elif s in ('C', 'D', 'F', 'H'):
            kick(t, 1.0)
            if s == 'H' and t < T_I - 0.5 and (beat % 4 == 3):
                kick(t + 0.25, 0.6)
        elif s == 'E':
            kick(t, 0.45, 'soft')
        elif s == 'G':
            kick(t, 1.15, 'heavy')
            if beat % 2 == 1:
                kick(t + 0.375, 0.7)
        elif s == 'J':
            vel = {0.0: 1.3, 0.5: .65, 1.0: .5, 1.5: .4, 2.0: .3}.get(round(t - T_J, 3))
            if vel:
                kick(t, vel, 'heavy' if t == T_J else 'hard')
    for s16 in range(384):
        t = s16 * 0.125
        sec = sec_at(t)
        b = s16 % 16
        if b in (4, 12):   # claps on 2 & 4
            if sec in ('D', 'F', 'H'):
                drums.add(CL, t, 0.85, 0.0, send=0.25)
            elif sec == 'G':
                drums.add(CL, t, 1.0, 0.0, send=0.3)
                drums.add(SN, t, 0.35, 0.0, send=0.2)
            elif sec == 'J' and round(t - T_J, 3) in (1.5, 2.5):
                drums.add(CL, t, 0.4 if round(t - T_J, 3) == 1.5 else 0.25, 0.0, send=0.35)
        hv = None; op = False
        if sec == 'C':
            hv = 0.55 if b % 4 == 2 else None
        elif sec == 'D':
            hv = 0.6 if b % 4 == 2 else (0.18 if b % 2 == 1 else None)
        elif sec == 'E':
            hv = 0.33 if b in (6, 14) else None
        elif sec in ('F', 'H'):
            hv = [0.28, 0.42, 0.62, 0.42][b % 4]
            if b == 14 or (sec == 'H' and b == 6):
                op = True; hv = 0.55
        elif sec == 'G':
            if b % 4 == 2:
                hv = 0.6; op = True
        elif sec == 'J' and t < T_J + 2.5:
            hv = 0.3 * (1.0 - (t - T_J) / 3.0) if b % 4 == 2 else None
        if hv:
            drums.add(HO if op else HC, t, hv * 0.5, 0.25 if (s16 % 2) else -0.25, send=0.06)

    def roll(t0, n, dt, v0, v1):
        for i in range(n):
            v = v0 + (v1 - v0) * (i / max(1, n - 1)) ** 1.4
            drums.add(SN, t0 + i * dt, v, 0.0, send=0.25)
    roll(T_D - 0.5, 4, 0.125, 0.35, 0.75)
    roll(T_F - 0.5, 8, 0.0625, 0.3, 0.9)
    roll(T_G - 0.5, 8, 0.0625, 0.3, 1.0)
    roll(T_I - 0.5, 8, 0.0625, 0.3, 0.9)
    # crashes / impacts
    fx.add(CR_S, T_D, 0.5, 0.2, send=0.2)
    fx.add(CR, T_F, 0.75, -0.1, send=0.25)
    fx.add(CR, T_G, 0.85, 0.0, send=0.3)
    fx.add(CR_S, T_H, 0.6, 0.0, send=0.25)
    fx.add(CR_BIG, T_J, 0.7, 0.0, send=0.35)
    fx.add(sub_boom(1.0, 80, 34, 0.45), T_B, 0.5)
    fx.add(sub_boom(1.6, 80, 33, 0.7), T_F, 0.55)
    fx.add(sub_boom(2.0, 80, 31, 0.9), T_G, 0.7)
    fx.add(sub_boom(4.0, 90, 32.7, 1.6), T_J, 0.65)
    kick(T_B, 0.7, 'soft', sc=False)
    kick(T_F, 1.0)
    kick(T_G, 1.3, 'heavy')      # drop pickup (off-beat 8th), then heavy kicks on the beats
    log('music: risers')
    fx.add(noise_riser(T_B, 300, 8000, 2.2), 0.0, 0.35, send=0.1)
    fx.add(noise_riser(2.0, 400, 9000, 2.0), T_F - 2.0, 0.45, send=0.12)
    fx.add(noise_riser(0.5, 500, 8000, 1.8), T_G - 0.5, 0.4, send=0.1)
    fx.add(noise_riser(1.5, 400, 10000, 2.2), T_I - 1.5, 0.5, send=0.12)
    rv = make_crash(1.0, 0.25, 3500.0)[::-1].copy()
    fx.add(rv * np.linspace(0.2, 1.0, len(rv)) ** 2, T_J - 1.0, 0.7, send=0.3)
    fx.add(rv, T_D - 1.0, 0.35, send=0.2)
    fx.add(rv, T_E - 1.0, 0.25, send=0.2)

    log('music: sidechain curves')
    duck = np.ones(N)
    W = int(0.6 * SR)
    tw = np.arange(W) / SR
    for t, depth in kick_ev:
        i = t2i(t)
        e = min(N, i + W)
        c = 1.0 - depth * (1 - np.exp(-tw / 0.003)) * np.exp(-tw / 0.16)
        duck[i:e] *= c[:e - i]

    log('music: bass')
    pat_A = {0: (1, 0), 3: (.8, 0), 6: (.9, 12), 8: (1, 0), 11: (.8, 0), 14: (.9, 12)}
    pat_B = {0: (1, 0), 2: (.6, 0), 3: (.8, 12), 6: (.9, 0), 8: (1, 0), 10: (.6, 12), 11: (.8, 0), 14: (.9, 12)}
    notes = []  # (t, dur_s, midi, vel, sine_only)
    for s16 in range(384):
        t = s16 * 0.125
        sec = sec_at(t); b = s16 % 16
        ch = CHORDS[chord_at(t)]['root']
        if sec == 'B':
            if b % 4 == 0 and t >= T_B:
                notes.append((t, 0.2, ch, 0.7, True))
        elif sec in ('C', 'D') and b in pat_A:
            v, o = pat_A[b]; notes.append((t, 0.2, ch + o, v, False))
        elif sec == 'F' and b in pat_B:
            v, o = pat_B[b]; notes.append((t, 0.19, ch + o, v, False))
        elif sec == 'G' and b % 2 == 0:
            notes.append((t, 0.2, ch + (12 if b in (6, 14) else 0), 1.0 if b % 4 == 0 else .75, False))
        elif sec == 'H' and b % 2 == 0:
            notes.append((t, 0.2, ch + (12 if b in (6, 14) else 0), 1.0 if b % 4 == 0 else .7, False))
    t = T_E
    while t < T_F - 0.1:       # half-energy: sustained sub, one note per second
        notes.append((t, min(0.93, T_F - t - 0.03), CHORDS[chord_at(t)]['root'], 0.5, True)); t += 1.0
    for a, b_, n_ in CH:
        if a >= T_J:
            notes.append((a, min(b_ - a, 2.0) * 0.98, CHORDS[n_]['root'], 0.9 if a < T_J + 3.5 else 0.7, True))
    sub = np.zeros(N); sawr = np.zeros(N); cutoff = np.full(N, 300.0)
    for (t, d, m, v, so) in notes:
        i = t2i(t); n = int((d + 0.06) * SR)
        e = min(N, i + n); n = e - i
        if n <= 0:
            continue
        tt = np.arange(n) / SR
        f = float(mtof(m))
        env = (1 - np.exp(-tt / 0.003)) * np.exp(-tt / 0.9)
        env *= np.where(tt < d, 1.0, np.exp(-(tt - d) / 0.025))
        sub[i:e] += np.sin(2 * np.pi * f * tt) * env * v
        if not so:
            sawr[i:e] += saw(f, n) * env * v
            cutoff[i:e] = 260 + 1500 * np.exp(-tt / 0.09)
    sawr = svf(sawr, cutoff, 0.9, 'lp')
    bass = np.tanh((sub + sawr * 0.38) * 1.3)
    bass *= 0.17 / np.sqrt(np.mean(bass ** 2) + 1e-12)
    bass *= duck ** 1.25

    log('music: pad')
    padL = np.zeros(N); padR = np.zeros(N)
    for (a, b_, name) in CH:
        atk = 1.0 if a == 0.0 else (0.5 if T_E <= a < T_F else (0.06 if (a >= T_J or a == T_G) else 0.14))
        rel = 1.3 if a >= T_J else 0.7
        i = t2i(a); n = int((b_ - a + rel) * SR); e = min(N, i + n); n = e - i
        tt = np.arange(n) / SR
        env = smooth(tt / atk) * np.where(tt < (b_ - a), 1.0, smooth(1 - (tt - (b_ - a)) / rel))
        wide = 1.6 if T_E <= a < T_F else 1.0
        for m in CHORDS[name]['pad']:
            f = float(mtof(m))
            for (dc, side) in ((-9 * wide, 0), (3 * wide, 0), (9 * wide, 1), (-3 * wide, 1)):
                v = saw(f * 2 ** (dc / 1200.0), n, phase=rng.random()) * env
                tgt = padL if side == 0 else padR
                tgt[i:e] += v
    pad_fc = auto([(0, 250), (T_B - .05, 1700), (T_B + .05, 1100), (T_C, 1400), (T_D, 1900), (T_E - .1, 1800),
                   (T_E + .1, 2600), (T_F - 2, 2600), (T_F, 3600), (T_G - .5, 3200), (T_G - .01, 700), (T_G, 3800),
                   (T_H, 3000), (T_H + .01, 2400), (T_I - 1.5, 5000), (T_I, 6000), (T_J - .01, 500), (T_J, 5200),
                   (T_J + 4.5, 4500), (48, 3200)], True)
    padL = svf(padL, pad_fc, 0.8, 'lp'); padR = svf(padR, pad_fc, 0.8, 'lp')
    pad_lvl = auto([(0, .2), (T_B - .01, .6), (T_B, .62), (T_C, .62), (T_D, .62), (T_E - .1, .62), (T_E, .52),
                    (T_F - 2, .6), (T_F - .01, .6), (T_F, .85), (T_G - .6, .85), (T_G - .5, .55), (T_G - .01, .5),
                    (T_G, 1.1), (T_H - .1, 1.0), (T_H, .75), (T_I - .1, .75), (T_I, .4), (T_J - .01, .35),
                    (T_J, .85), (T_J + 4.5, .7), (48, .6)])
    pad_norm = 0.16 / np.sqrt(0.5 * (np.mean(padL ** 2) + np.mean(padR ** 2)) + 1e-12)
    padL *= pad_norm * pad_lvl * duck ** 0.9
    padR *= pad_norm * pad_lvl * duck ** 0.9
    pad_mono = 0.5 * (padL + padR)

    log('music: arp')
    P1 = [0, 2, 4, 2, 5, 4, 2, 4, 0, 2, 4, 2, 6, 5, 4, 2]
    P2 = [0, 3, 5, 3, 7, 5, 3, 5, 1, 3, 5, 3, 6, 5, 3, 2]
    P3 = [4, 5, 7, 5, 6, 4, 5, 7, 4, 5, 6, 7, 5, 6, 4, 5]
    PD = [0, 2, 4, 5, 4, 2, 4, 6, 0, 2, 4, 5, 7, 6, 5, 4]
    PJ = [0, 2, 4, 6, 7, 6, 4, 2, 1, 3, 5, 7, 8, 7, 5, 3]
    arp_notes = []  # (t, midi, vel, c0, amt, tau, sq)
    pent_up = [57, 60, 62, 64, 67, 69, 72, 74, 76, 79, 81]
    for s16 in range(384):
        t = s16 * 0.125; sec = sec_at(t); b = s16 % 16
        tones = CHORDS[chord_at(t)]['arp']
        av = acc16[b % 4]
        if sec == 'A':
            u = t / T_B
            arp_notes.append((t, pent_up[s16 % len(pent_up)] + 12, 0.10 + 0.8 * u ** 1.5,
                              500 + 5500 * u ** 2, 2500, 0.12, 0.2))
        elif sec == 'B':
            if b in (0, 6, 10):
                arp_notes.append((t, tones[P1[b]] + 12, {0: .6, 6: .45, 10: .5}[b] * .75, 1000, 3500, .10, .2))
        elif sec == 'C':
            arp_notes.append((t, tones[P1[b]] + 12, av * .8, 1400, 4500, .085, .3))
        elif sec == 'D':
            arp_notes.append((t, tones[P2[b]] + 12, av * 1.1, 2200, 6000, .075, .4))
        elif sec == 'E' and b in (0, 3, 6, 8, 11, 14):
            arp_notes.append((t, tones[P3[b]] + 12, {0: .7, 3: .5, 6: .6, 8: .7, 11: .5, 14: .6}[b] * .65,
                              3500, 4000, .18, .15))
        elif sec == 'F':
            arp_notes.append((t, tones[P2[b]] + 12, av * 1.5, 3000, 7000, .08, .5))
        elif sec == 'H':
            u = (t - T_H) / (T_I - T_H)
            arp_notes.append((t, tones[PD[b]] + 12, av * 1.2 * (0.75 + 0.3 * u), 2000 + 4500 * u, 6000, .08, .45))
        elif sec == 'J' and b % 2 == 0:
            fade = 1.0 - 0.55 * min(1.0, (t - T_J) / 5.0)
            arp_notes.append((t, tones[PJ[b]], {0: .8, 2: .5, 4: .7, 6: .5, 8: .8, 10: .5, 12: .7, 14: .5}[b] * fade * 1.2,
                              4000, 6000, .15, .2))
    for i in range(8):   # pre-drop and pre-bloom rising 32nd-note runs
        u = (i + 1) / 8.0
        arp_notes.append((T_G - 0.5 + i * 0.0625, [67, 71, 74, 79, 83, 86, 91, 95][i], .3 + .7 * u, 2500 + 5000 * u, 3000, .08, .3))
        arp_notes.append((T_I + i * 0.0625, [64, 67, 69, 72, 74, 76, 79, 81][i] + 12, .25 + .7 * u, 2000 + 6000 * u, 3000, .07, .3))
    arp_notes.sort()
    raw = np.zeros(N); cut = np.full(N, 800.0)
    for k, (t, m, v, c0, amt, tau, sq) in enumerate(arp_notes):
        i = t2i(t)
        nxt = t2i(arp_notes[k + 1][0]) if k + 1 < len(arp_notes) else i + SR // 2
        n = int(min(0.35, tau * 6) * SR); e = min(N, i + n); n = e - i
        if n <= 0:
            continue
        tt = np.arange(n) / SR
        f = float(mtof(m))
        osc = (1 - sq) * saw(f, n) + sq * square(f * 1.003, n)
        env = (1 - np.exp(-tt / 0.002)) * np.exp(-tt / tau) * end_fade(n, 0.01)
        raw[i:e] += osc * env * v
        e2 = min(N, max(nxt, i + 1)); nn = e2 - i
        cut[i:e2] = c0 + amt * np.exp(-(np.arange(nn) / SR) / 0.07)
    arp = svf(raw, cut, 0.9, 'lp')
    arp *= 0.10 / np.sqrt(np.mean(arp ** 2) + 1e-12)
    arp *= duck ** 0.5
    D = int(0.375 * SR)       # ping-pong dotted-eighth echo
    echo = np.zeros((N, 2))
    for k in range(1, 7):
        sh = k * D
        if sh >= N:
            break
        echo[sh:, (k + 1) % 2] += arp[:N - sh] * (0.42 ** k) * 1.6
    for c in range(2):
        echo[:, c] = fft_filter(echo[:, c], lp=5200, hp=300, order=1)
    echo_amt = auto([(0, .5), (T_E - .1, .5), (T_E, 1.3), (T_F - .1, 1.3), (T_F, .6), (T_J - .1, .6), (T_J, 1.1), (48, 1.1)])
    echo *= echo_amt[:, None]

    log('music: mix + reverb')
    L = padL + bass + arp * 0.8 + echo[:, 0] + drums.s[:, 0] + fx.s[:, 0]
    R = padR + bass + arp * 0.8 + echo[:, 1] + drums.s[:, 1] + fx.s[:, 1]
    send = pad_mono * 0.55 + arp * 0.35 + (echo[:, 0] + echo[:, 1]) * 0.15 + drums.rv * 0.6 + fx.rv * 0.8
    wet = reverb(send, rt60=2.6)
    wet *= auto([(0, 1.0), (T_E, 1.0), (T_E + .1, 1.4), (T_F, 1.0), (T_J, 1.3), (T_J + 4.5, 1.5), (48, 1.5)])[:, None]
    L += wet[:, 0]; R += wet[:, 1]
    if os.environ.get('ATMIRA_STEMS'):
        np.savez(os.path.join(SCR, 'stems.npz'), pad=padL, bass=bass, arp=arp, echo=echo[:, 0], drums=drums.s[:, 0],
                 fx=fx.s[:, 0], wet=wet[:, 0])
    st = np.stack([L, R], axis=1)
    # section-level energy macro (contrast between sections), applied before the soft clipper
    macro = auto([(0, 1.0), (T_C - .01, 1.0), (T_C, .9), (T_D - .01, .9), (T_D, .95), (T_E - .01, .95), (T_E, .78),
                  (T_F - .01, .78), (T_F, 1.1), (T_G - .01, 1.1), (T_G, 1.2), (T_H - .01, 1.2), (T_H, 1.0),
                  (T_I - .01, 1.0), (T_I, .85), (T_J - .01, .85), (T_J, 1.3), (T_J + 2.5, 1.25), (T_J + 4.5, 1.1),
                  (48, 1.0)])
    st *= macro[:, None]
    for c in range(2):
        st[:, c] = fft_filter(st[:, c], hp=28, order=2)
    pk = peak(st)
    st = np.tanh(st / pk * 1.25) / np.tanh(1.25)
    tt = np.arange(N) / SR
    fade = np.ones(N)
    m = tt >= FADE_START
    fade[m] = np.cos(0.5 * np.pi * (tt[m] - FADE_START) / (48.0 - FADE_START)) ** 2
    fi = int(0.01 * SR)
    fade[:fi] *= np.linspace(0, 1, fi)
    fade[-1] = 0.0
    st *= fade[:, None]
    st *= 10 ** (-3.0 / 20) / peak(st)
    st[-1, :] = 0.0
    return st


# --------------------------------------------------------------------------
# SFX
# --------------------------------------------------------------------------
def render_sfx():
    S = Bus()
    sfx = TIMING['sfx']
    log('sfx: rendering', len(sfx), 'cues')

    def whoosh(length):
        n = int(length * SR)
        u = np.arange(n) / n
        fc = 350 * (9500 / 350) ** (u ** 1.4)
        x = np.stack([svf(rng.standard_normal(n), fc, 1.4, 'bp') for _ in range(2)], axis=1)
        x /= peak(x)
        x *= (u ** 2.4)[:, None]
        x[:, 0] *= 0.75 + 0.25 * u; x[:, 1] *= 1.0 - 0.25 * u
        x *= end_fade(n, 0.0015)[:, None]
        return x * (0.30 + 0.12 * min(length, 1.0))

    def hit(big):
        x = sub_boom(2.4 if big else 1.0, 95, 38, 1.0 if big else 0.32)
        n = len(x)
        th = svf(rng.standard_normal(int(0.3 * SR)), 260, 0.8, 'lp')
        th = th * np.exp(-np.arange(len(th)) / SR / 0.05)
        x[:len(th)] += th * 0.9
        air = svf(rng.standard_normal(int((1.6 if big else 0.5) * SR)), 3000, 0.8, 'hp')
        air *= np.exp(-np.arange(len(air)) / SR / (0.5 if big else 0.12))
        x[:len(air)] += air * (0.28 if big else 0.14)
        x *= end_fade(n, 0.05)
        return x * (0.82 if big else 0.62) / peak(x)

    stab_cache = {}

    def stab(name):
        if name in stab_cache:
            return stab_cache[name]
        notes = {'Am': [45, 52, 57, 60, 64], 'F': [41, 48, 53, 57, 60], 'G': [43, 50, 55, 59, 62]}[name]
        n = int(0.7 * SR); t = np.arange(n) / SR
        chans = []
        for dets in ((-8, 4), (8, -4)):
            acc = np.zeros(n)
            for m in notes:
                for dc in dets:
                    acc += saw(float(mtof(m)) * 2 ** (dc / 1200), n, phase=rng.random())
            acc *= (1 - np.exp(-t / 0.002)) * np.exp(-t / 0.16)
            chans.append(svf(acc, 350 + 7000 * np.exp(-t / 0.07), 1.0, 'lp'))
        x = np.stack(chans, axis=1)
        x /= peak(x)
        subw = np.sin(2 * np.pi * np.cumsum(float(mtof(notes[0] - 12)) * (1 + 0.5 * np.exp(-t / 0.03))) / SR) * np.exp(-t / 0.25)
        x += subw[:, None] * 0.6
        x += (hp1(rng.standard_normal(n)) * np.exp(-t / 0.01) * 0.25)[:, None]
        x *= end_fade(n, 0.06)[:, None]
        stab_cache[name] = x * 0.58 / peak(x)
        return stab_cache[name]

    def tick(k):
        n = int(0.014 * SR); t = np.arange(n) / SR
        f = 2800 + 700 * ((k * 7) % 5) / 4.0
        x = np.sin(2 * np.pi * f * t) * np.exp(-t / 0.0022) + hp1(rng.standard_normal(n)) * np.exp(-t / 0.0012) * 0.35
        x *= end_fade(n, 0.003)
        return x * 0.045 / peak(x)

    def pop(k):
        n = int(0.16 * SR); t = np.arange(n) / SR
        sc = [1.0, 1.12, 0.94, 1.2, 1.06][k % 5]
        f = (380 + 800 * np.exp(-t / 0.011)) * sc
        x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.035) * (1 - np.exp(-t / 0.0007))
        x += hp1(rng.standard_normal(n)) * np.exp(-t / 0.0015) * 0.1
        x *= end_fade(n, 0.02)
        return x * 0.12 / peak(x)

    def ping(k):
        f = [1175, 1319, 1568, 1760][k % 4]
        n = int(0.9 * SR); t = np.arange(n) / SR
        x = (np.sin(2 * np.pi * f * t) + 0.28 * np.sin(2 * np.pi * 2 * f * t) + 0.08 * np.sin(2 * np.pi * 3 * f * t))
        x *= (1 - np.exp(-t / 0.004)) * np.exp(-t / 0.17) * end_fade(n, 0.05)
        x = x * 0.2 / peak(x)
        st = np.zeros((n, 2)); st[:, 0] = x; st[:, 1] = x * 0.7
        d = int(0.19 * SR)
        st[d:, 1] += x[:n - d] * 0.35
        st[2 * d:, 0] += x[:n - 2 * d] * 0.15
        return st

    def shimmer(big):
        Ls = 3.8 if big else 1.8
        n = int(Ls * SR); t = np.arange(n) / SR
        pool = [72, 74, 76, 79, 81, 84, 86, 88, 91, 93, 96, 98, 100]
        cnt = 22 if big else 13
        st = np.zeros((n, 2))
        for j in range(cnt):
            m = pool[min(len(pool) - 1, int(j * len(pool) / cnt + rng.random() * 1.5))]
            t0 = (j / cnt) ** 1.1 * Ls * (0.65 if big else 0.7) + rng.random() * 0.05
            i = int(t0 * SR)
            tt = np.arange(n - i) / SR
            f = float(mtof(m)) * (1 + 0.004 * np.exp(-tt / 0.2))
            x = np.sin(2 * np.pi * np.cumsum(f) / SR) * smooth(tt / 0.04) * np.exp(-tt / (0.55 if big else 0.28))
            gl, gr = pan_gains(rng.uniform(-0.8, 0.8))
            st[i:, 0] += x * gl; st[i:, 1] += x * gr
        nz = np.stack([svf(rng.standard_normal(n), 5200, 0.8, 'hp') for _ in range(2)], axis=1)
        u = t / Ls
        env = (np.sin(np.pi * np.clip(u / 0.85, 0, 1)) ** 2) * np.where(u < 0.85, 1.0, np.exp(-(u - 0.85) * 6))
        st += nz * (env * (0.24 if big else 0.2))[:, None]
        st /= peak(st)
        st *= end_fade(n, 0.1)[:, None]
        return st * (0.3 if big else 0.2)

    def sparkle():
        n = int(1.4 * SR); t = np.arange(n) / SR
        st = np.zeros((n, 2))
        for j, m in enumerate([91, 96, 100]):
            i = int(j * 0.045 * SR)
            tt = t[:n - i]
            f = float(mtof(m))
            x = np.zeros(n - i)
            for r, a, d in ((1.0, 1.0, 0.7), (2.76, 0.25, 0.3), (5.4, 0.1, 0.15)):
                x += a * np.sin(2 * np.pi * f * r * tt) * np.exp(-tt / d)
            x *= (1 - np.exp(-tt / 0.002))
            gl, gr = pan_gains([-0.4, 0.1, 0.5][j])
            st[i:, 0] += x * gl; st[i:, 1] += x * gr
        st /= peak(st)
        st *= end_fade(n, 0.1)[:, None]
        return st * 0.2

    cnt = {'pop': 0, 'ping': 0}
    slam_chords = ['Am', 'F', 'G']; slam_i = 0
    for ev in sfx:
        ty = ev['type']
        if ty == 'whoosh_in':
            w = whoosh(ev['len'])
            S.add(w, 0, 1.0, at_sample=t2i(ev['t']) - len(w))   # ends exactly at t
        elif ty == 'hit':
            big = bool(ev.get('big'))
            S.add(hit(big), ev['t'], 1.0, 0.0, send=0.5 if big else 0.14)
        elif ty == 'slam':
            S.add(stab(slam_chords[slam_i % 3]), ev['t'], 1.0, send=0.15); slam_i += 1
        elif ty == 'tick_run':
            k = 0
            while ev['from'] + k / ev['rate'] <= ev['to'] + 1e-9:
                S.add(tick(k), 0, 1.0, pan=0.15 * ((k % 3) - 1), at_sample=t2i(ev['from'] + k / ev['rate']))
                k += 1
        elif ty == 'pop':
            k = cnt['pop']; cnt['pop'] += 1
            S.add(pop(k), ev['t'], 1.0, pan=[-0.3, 0.2, -0.1, 0.35, 0.0][k % 5], send=0.08)
        elif ty == 'ping':
            k = cnt['ping']; cnt['ping'] += 1
            S.add(ping(k), ev['t'], 1.0, send=0.18)
        elif ty == 'shimmer':
            big = bool(ev.get('big'))
            S.add(shimmer(big), ev['t'], 1.0, send=0.5 if big else 0.3)
        elif ty == 'sparkle':
            S.add(sparkle(), ev['t'], 1.0, send=0.4)
        else:
            raise ValueError(ty)
    log('sfx: reverb')
    wet = reverb(S.rv, rt60=2.0, lp=7000, hp=250)
    st = S.s + wet * 0.45
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
    vo_wav = os.path.join(SCR, os.path.splitext(os.path.basename(VO_FILE))[0] + '_48k.wav')
    ffmpeg('-i', os.path.join(ROOT, VO_FILE), '-ac', '1', '-ar', str(SR), '-c:a', 'pcm_s16le', vo_wav)
    vo = fft_filter(read_wav_mono(vo_wav), hp=70, order=2)
    off = t2i(VO_START)
    VO = np.zeros(N)
    n = min(len(vo), N - off)
    VO[off:off + n] = vo[:n]
    VO[N - 1] = 0.0
    # VO envelope (20 ms frames) -> presence -> attack 80 ms / release 350 ms -> duck dB
    FR = int(0.02 * SR)
    nf = N // FR
    fdb = 10 * np.log10(np.mean(VO[:nf * FR].reshape(nf, FR) ** 2, axis=1) + 1e-12)
    pres = np.clip((fdb - (-46.0)) / 8.0, 0.0, 1.0)
    a_att = math.exp(-0.02 / 0.08); a_rel = math.exp(-0.02 / 0.35)
    ps = np.zeros(nf); cur = 0.0
    for i in range(nf):
        a = a_att if pres[i] > cur else a_rel
        cur = a * cur + (1 - a) * pres[i]
        ps[i] = cur
    tf = (np.arange(nf) + 0.5) * 0.02
    depth = np.interp(tf, [0, T_G - .3, T_G, T_H - .2, T_H + .2, 48], [7.5, 7.5, 5.0, 5.0, 7.5, 7.5])
    duck_s = 10 ** (np.interp(np.arange(N) / SR, tf, -depth * ps) / 20.0)
    smask = np.repeat(fdb > -40.0, FR)
    smask = np.concatenate([smask, np.zeros(N - len(smask), bool)])
    vo_rms = math.sqrt(np.mean(VO[smask] ** 2))
    # logo-tail 'shine': music lifts a further 5 dB once the VO has finished
    shine = 10 ** (np.interp(np.arange(N) / SR, [0, VO_END, VO_END + 0.6, 48], [0, 0, 5.0, 5.0]) / 20.0)
    md = music * (duck_s * shine)[:, None]
    g_mus = (vo_rms * 10 ** (-15.0 / 20)) / math.sqrt(np.mean(md[smask] ** 2))
    act = np.abs(sfx).max(axis=1) > 1e-4
    g_sfx = (vo_rms * 10 ** (-18.0 / 20)) / math.sqrt(np.mean(sfx[act] ** 2))
    log('mix: vo_rms %.1f dB, g_music %.2f dB, g_sfx %.2f dB' % (
        20 * math.log10(vo_rms), 20 * math.log10(g_mus), 20 * math.log10(g_sfx)))
    mix = md * g_mus + sfx * g_sfx + VO[:, None]
    mix[-1, :] = 0.0
    # speech vs gap statistics for the ducked music
    gap = ~smask; gap[:t2i(VO_START)] = False; gap[t2i(VO_END):] = False
    for nm, msk in (('speech', smask), ('gaps in VO span', gap)):
        log('mix: music in %s: ducked %.1f dB rms, un-ducked %.1f dB rms, mean duck %.1f dB' % (
            nm, 10 * np.log10(np.mean((md[msk] * g_mus) ** 2)), 10 * np.log10(np.mean((music[msk] * g_mus) ** 2)),
            20 * np.log10(np.mean(duck_s[msk]))))
    raw = os.path.join(SCR, 'mix_pre.f32')
    mix.astype('<f4').tofile(raw)
    lim = os.path.join(SCR, 'mix_lim.wav')       # transparent peak limiter so loudnorm can stay linear
    ffmpeg('-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', raw, '-af',
           'alimiter=limit=0.78:attack=5:release=80:level=disabled', '-c:a', 'pcm_f32le', lim)
    inp = ['-i', lim]
    tgt = 'I=-16:TP=-1.5:LRA=11'
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
