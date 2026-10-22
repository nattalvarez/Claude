"""Synthesises the film's soundtrack (music bed + SFX) deterministically with numpy.

120 BPM, 30 fps -> 1 beat = 15 frames, 1 bar = 60 frames. Cuts are on bar lines.
Output: public/sfx/soundtrack.wav (stereo, 44.1 kHz).
"""
import numpy as np, wave, os, subprocess

SR = 44100
FPS = 30
BPM = 120
BEAT = 60 / BPM
BAR = BEAT * 4
BARS = 49
DUR = BARS * BAR + 1.5
N = int(DUR * SR)
rng = np.random.default_rng(7)

L = np.zeros(N, dtype=np.float64)
R = np.zeros(N, dtype=np.float64)
# separate buses so we can sidechain / reverb
bus = {k: [np.zeros(N), np.zeros(N)] for k in ("drums", "bass", "pad", "arp", "fx")}


def add(name, sig, t0, gain=1.0, pan=0.0):
    i = int(t0 * SR)
    if i >= N or i + len(sig) <= 0:
        return
    a = max(0, -i)
    b = min(len(sig), N - i)
    s = sig[a:b] * gain
    l = np.cos((pan + 1) * np.pi / 4)
    r = np.sin((pan + 1) * np.pi / 4)
    bus[name][0][i + a : i + b] += s * l
    bus[name][1][i + a : i + b] += s * r


def t_(d):
    return np.arange(int(d * SR)) / SR


def fft_filter(x, lo=None, hi=None):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    m = np.ones_like(f)
    if lo:
        m *= 1 / (1 + (lo / np.maximum(f, 1)) ** 4)
    if hi:
        m *= 1 / (1 + (f / hi) ** 4)
    return np.fft.irfft(X * m, len(x))


def noise(d):
    return rng.standard_normal(int(d * SR))


# ------------------------------------------------------------------ drums
def kick(d=0.45):
    t = t_(d)
    f = 48 + 110 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = np.sin(ph) * np.exp(-t * 7.5)
    s += 0.35 * fft_filter(noise(d), hi=4000) * np.exp(-t * 90)
    return np.tanh(s * 1.6) * 0.95


def clap(d=0.28):
    t = t_(d)
    n = fft_filter(noise(d), lo=900, hi=7500)
    env = np.exp(-t * 22)
    for k in (0.0, 0.012, 0.024):
        env += 0.9 * np.exp(-np.maximum(t - k, 0) * 60) * (t >= k)
    return n * env * 0.5


def hat(d=0.06, open_=False):
    d = 0.26 if open_ else d
    t = t_(d)
    n = fft_filter(noise(d), lo=6500)
    return n * np.exp(-t * (16 if open_ else 80)) * 0.32


def snare(d=0.2):
    t = t_(d)
    n = fft_filter(noise(d), lo=1500, hi=9000)
    tone = np.sin(2 * np.pi * 190 * t) * np.exp(-t * 30)
    return (n * np.exp(-t * 26) * 0.6 + tone * 0.4) * 0.8


# ------------------------------------------------------------------- tonal
def mtof(m):
    return 440 * 2 ** ((m - 69) / 12)


def pad_note(freq, d):
    t = t_(d)
    s = np.zeros_like(t)
    for det in (-0.07, 0.0, 0.07):
        f = freq * 2 ** (det / 12)
        for k in range(1, 9):
            s += np.sin(2 * np.pi * f * k * t + rng.random() * 6.28) / (k ** 1.7)
    a = np.minimum(t / 0.5, 1)
    r = np.minimum((d - t) / 0.7, 1)
    return s * a * np.clip(r, 0, 1) * 0.11


def bass_note(freq, d):
    t = t_(d)
    s = np.sin(2 * np.pi * freq * t) + 0.35 * np.sin(2 * np.pi * freq * 2 * t) + 0.12 * np.sin(2 * np.pi * freq * 3 * t)
    env = np.minimum(t / 0.01, 1) * np.minimum((d - t) / 0.05, 1)
    return np.tanh(s * 1.4) * env * 0.42


def pluck(freq, d=0.42):
    t = t_(d)
    s = np.zeros_like(t)
    for k in range(1, 7):
        s += np.sin(2 * np.pi * freq * k * t) / (k ** 1.3) * np.exp(-t * (6 + k * 5))
    return s * 0.22


# ----------------------------------------------------------------- fx
def whoosh(d=0.55, up=True):
    n = noise(d)
    t = t_(d)
    bands = []
    out = np.zeros_like(n)
    for lo, hi in ((300, 1500), (1500, 5000), (5000, 12000)):
        out += fft_filter(n, lo=lo, hi=hi) * (0.5 if lo > 1000 else 1.0)
    env = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 2 if up else np.exp(-t * 7)
    return out * env * 0.55


def riser(d, level=1.0):
    n = noise(d)
    t = t_(d)
    p = (t / d) ** 2
    lo = fft_filter(n, lo=200, hi=2500)
    hi = fft_filter(n, lo=3500, hi=14000)
    tone = np.sin(2 * np.pi * np.cumsum(180 + 1900 * p**1.5) / SR) * 0.25
    return (lo * (0.4 + 0.6 * p) + hi * p * 1.2 + tone * p) * p * 0.5 * level


def reverse_cym(d):
    n = fft_filter(noise(d), lo=4000)
    t = t_(d)
    return n * (t / d) ** 3 * 0.55


def impact(d=1.4):
    t = t_(d)
    f = 36 + 90 * np.exp(-t * 14)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 3.2)
    crash = fft_filter(noise(d), lo=3000) * np.exp(-t * 4.5) * 0.35
    thud = fft_filter(noise(d), hi=500) * np.exp(-t * 9) * 0.5
    return np.tanh((boom * 1.2 + crash + thud) * 1.3) * 0.9


def tick(d=0.04):
    t = t_(d)
    return np.sin(2 * np.pi * 1800 * t) * np.exp(-t * 110) * 0.25


def shimmer(d=1.0):
    t = t_(d)
    s = np.zeros_like(t)
    for f in (1318, 1760, 2093, 2637, 3136):
        s += np.sin(2 * np.pi * f * t) * np.exp(-t * 4) / 4
    return s * 0.22


def sec(frame):
    return frame / FPS


# ---------------------------------------------------------------- arrangement
# energy per bar (0 = drone, 5 = peak)
energy = [0, 1, 2, 2, 2, 2]           # bars 0-5
energy += [3, 3, 4, 4, 4, 4]          # 6-11 modernizar
energy += [3, 3, 3, 3]                # 12-15 moves
energy += [3, 3, 4, 3]                # 16-19 platform
energy += [3, 3, 4, 4, 4, 4, 5, 4]    # 20-27 accel
energy += [3, 3, 4, 4, 4, 4, 4]       # 28-34 special
energy += [4, 4, 4, 5]                # 35-38 cases
energy += [3, 3, 3]                   # 39-41 clients
energy += [5, 5, 5]                   # 42-44 stats
energy += [2, 2, 2, 1]                # 45-48 finale
assert len(energy) == BARS

CH = [  # chord roots + triad (midi)
    (33, [57, 60, 64]),   # Am
    (29, [53, 57, 60]),   # F
    (36, [55, 60, 64]),   # C
    (31, [55, 59, 62]),   # G
]

kick_times = []
for bar in range(BARS):
    e = energy[bar]
    b0 = bar * BAR
    root, tri = CH[bar % 4]
    # pad: one chord per bar, overlapping tail
    if e >= 1 or bar == 0:
        for m in tri + [tri[0] + 12]:
            add("pad", pad_note(mtof(m), BAR + 0.8), b0, 0.12 + 0.11 * e, pan=rng.uniform(-0.5, 0.5))
    if bar == 0:
        add("pad", pad_note(mtof(33), BAR * 2), 0, 0.22)
    # bass
    if e >= 2:
        for k in range(8):  # 8th-note pulse with octave jump
            f = mtof(root + (12 if k % 4 == 3 else 0))
            if e == 2 and k % 2 == 1:
                continue
            add("bass", bass_note(f, BEAT / 2 * 0.9), b0 + k * BEAT / 2, 1.0 if k % 2 == 0 else 0.7)
    # drums
    for beat in range(4):
        tb = b0 + beat * BEAT
        if e >= 2 or (e == 1 and beat == 0):
            add("drums", kick(), tb, 0.9 if e >= 2 else 0.6)
            kick_times.append(tb)
        if e >= 3 and beat in (1, 3):
            add("drums", clap(), tb, 0.8, pan=0.1)
        if e >= 2:
            add("drums", hat(open_=True), tb + BEAT / 2, 0.55, pan=0.3)
        if e >= 4:
            for s16 in (0.25, 0.75):
                add("drums", hat(), tb + BEAT * s16, 0.45 + 0.2 * (s16 == 0.75), pan=-0.3)
    # arp
    if e >= 3:
        notes = [tri[0] + 12, tri[1] + 12, tri[2] + 12, tri[1] + 24, tri[2] + 12, tri[1] + 12, tri[0] + 24, tri[2] + 12]
        step = BEAT / 2 if e == 3 else BEAT / 4
        n_steps = int(BAR / step)
        for k in range(n_steps):
            m = notes[k % len(notes)]
            add("arp", pluck(mtof(m)), b0 + k * step, 0.55 + 0.1 * (k % 4 == 0), pan=-0.4 if k % 2 else 0.4)

# pre-cut fills: snare rolls in the bar before the biggest cuts
for bar in (11, 19, 27, 34, 38, 44):
    for k in range(8):
        add("drums", snare(0.1), (bar + 1) * BAR - BEAT * 2 + k * BEAT / 4, 0.25 + 0.09 * k)

# ---- hook (bars 0-1.5): slams + riser + boom at the flash
for f in (6, 21, 36):
    add("fx", impact(0.9), sec(f), 0.55)
    add("fx", tick(), sec(f), 1.0)
add("fx", riser(1.0), sec(56), 0.9)
add("fx", reverse_cym(0.8), sec(66), 0.6)
add("fx", impact(), sec(90), 1.0)
add("fx", shimmer(1.6), sec(92), 0.8)

# ---- cuts: (frame, kind) mirrored from src/Film.tsx
CUTS = [
    (90, "flash"), (180, "slices"), (360, "wipe"), (480, "flash"), (540, "wipe"), (600, "flash"),
    (660, "wipe"), (720, "slices"), (960, "wipe"), (1200, "wipe"), (1320, "slices"), (1500, "wipe"),
    (1620, "flash"), (1680, "slices"), (1800, "wipe"), (1890, "slices"), (2100, "wipe"), (2340, "wipe"),
    (2520, "slices"), (2700, "wipe"),
]
for f, kind in CUTS:
    t = sec(f)
    if f == 90:
        continue
    if kind == "wipe":
        add("fx", whoosh(0.5), t - 0.3, 0.9, pan=-0.2)
    elif kind == "slices":
        for k in range(6):
            add("fx", tick(0.05), t - 0.3 + k * 0.03, 0.7, pan=-0.6 + k * 0.24)
        add("fx", whoosh(0.4), t - 0.25, 0.7, pan=0.2)
    else:
        add("fx", reverse_cym(0.5), t - 0.5, 0.7)
    add("fx", impact(1.2 if f >= 2500 else 0.9), t, 0.8 if kind != "flash" else 0.9)

# risers into the big section changes
for f in (360, 1200, 1680, 2520):
    add("fx", riser(2.0 - 0.01, 0.9), sec(f) - 2.0, 0.8)

# counters tick (stats scene + clients +40 + SIREC +15)
for i in range(6):
    start = sec(2520 + 4 + i * 5)
    for k in range(14):
        add("fx", tick(), start + k * 0.045, 0.5, pan=-0.5 + i * 0.2)
for k in range(12):
    add("fx", tick(), sec(2340 + 14) + k * 0.05, 0.4)
for k in range(8):
    add("fx", tick(), sec(1620 + 26) + k * 0.05, 0.4)

# logo wall shimmer + finale resolve
add("fx", shimmer(1.4), sec(2340 + 75), 0.7)
add("fx", shimmer(2.5), sec(2700 + 30), 0.9)
add("fx", shimmer(3.0), sec(2700 + 120), 0.8)

# ---- ending: sustained Am chord, fade
for m in (45, 57, 60, 64, 69):
    add("pad", pad_note(mtof(m), 5.5), 48 * BAR - 0.5, 0.9)

# ------------------------------------------------------------------- mixing
def sidechain(sig_pair, strength=0.55, rel=0.22):
    env = np.ones(N)
    for kt in kick_times:
        i = int(kt * SR)
        n = int(rel * SR)
        if i + n > N:
            n = N - i
        curve = 1 - strength * np.exp(-np.arange(n) / (rel * SR / 3))
        env[i : i + n] = np.minimum(env[i : i + n], curve)
    return [sig_pair[0] * env, sig_pair[1] * env]


def reverb(sig, wet=0.3, length=2.2):
    t = t_(length)
    ir = rng.standard_normal(len(t)) * np.exp(-t * 2.6)
    ir = fft_filter(ir, hi=6000)
    ir /= np.abs(ir).sum() ** 0.5 * 12
    outs = []
    for ch in range(2):
        ir_c = ir if ch == 0 else np.roll(ir, 211)
        M = len(sig[ch]) + len(ir_c) - 1
        nfft = 1 << (M - 1).bit_length()
        y = np.fft.irfft(np.fft.rfft(sig[ch], nfft) * np.fft.rfft(ir_c, nfft), nfft)[: len(sig[ch])]
        outs.append(sig[ch] + y * wet * 8)
    return outs


pad = sidechain(bus["pad"], 0.5)
arp = reverb(sidechain(bus["arp"], 0.35), wet=0.18)
pad = reverb(pad, wet=0.12)
bass = sidechain(bus["bass"], 0.7, 0.2)
fx = reverb(bus["fx"], wet=0.1)
drums = bus["drums"]

mix_l = pad[0] * 0.9 + arp[0] * 0.75 + bass[0] * 0.95 + drums[0] * 0.85 + fx[0] * 0.8
mix_r = pad[1] * 0.9 + arp[1] * 0.75 + bass[1] * 0.95 + drums[1] * 0.85 + fx[1] * 0.8

# global dynamics: gentle intro swell + ending fade
t = np.arange(N) / SR
g = np.ones(N)
g *= np.clip(t / 0.4, 0, 1)
end = BARS * BAR - 1.5
g *= np.clip((end + 1.5 - t) / 2.5, 0, 1)
mix = np.stack([mix_l * g, mix_r * g], axis=1)
mix = np.tanh(mix * 0.9) / 0.9
mix = mix / np.max(np.abs(mix)) * 0.89
pcm = (mix * 32767).astype("<i2")

out = os.path.join(os.path.dirname(__file__), "..", "public", "sfx")
os.makedirs(out, exist_ok=True)
wav = os.path.join(out, "soundtrack.wav")
with wave.open(wav, "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
subprocess.run(
    ["ffmpeg", "-y", "-loglevel", "error", "-i", wav, "-af", "alimiter=limit=0.9", "-c:a", "libmp3lame", "-b:a", "256k", os.path.join(out, "soundtrack.mp3")],
    check=True,
)
os.remove(wav)
print("ok", DUR)
