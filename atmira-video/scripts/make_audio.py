"""Synthesises the film's music bed and SFX (two stems) deterministically with numpy.

120 BPM, 30 fps -> 1 beat = 15 frames, 1 bar = 60 frames. Cuts are on bar lines.
Output: public/sfx/music.mp3 + public/sfx/fx.mp3. Timing comes from src/timeline.json.
"""
import numpy as np, wave, os, subprocess

SR = 44100
FPS = 30
BPM = 120
BEAT = 60 / BPM
BAR = BEAT * 4
import json
TL = json.load(open(os.path.join(os.path.dirname(__file__), "..", "src", "timeline.json")))
TOTAL_S = TL["total"] / FPS
BARS = int(np.ceil(TOTAL_S / BAR))
DUR = TOTAL_S + 1.0
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
SC = {k: (v["from"] / FPS, (v["from"] + v["dur"]) / FPS) for k, v in TL["scenes"].items()}


def energy_at(t):
    """0 = drone … 5 = peak, from the scene the bar starts in."""
    def rel(name):
        return t - SC[name][0]
    if t < SC["title"][0]:
        return 0 if t < 1.5 else 1
    for name, (a, b) in SC.items():
        if a <= t < b:
            r = t - a
            return {
                "title": 2,
                "modernizar": 3 if r < 6 else 4,
                "moves": 3,
                "platform": 3,
                "accel": 3 if r < 5.5 else (4 if r < 12 else 5),
                "special": 3 if r < 6 else 4,
                "cases": 4,
                "clients": 3,
                "close": 5 if r < 4 else 2,
            }.get(name, 3)
    return 1


energy = [energy_at(bar * BAR) for bar in range(BARS)]

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
    if e >= 1 or bar == 0:
        for m in tri + [tri[0] + 12]:
            add("pad", pad_note(mtof(m), BAR + 0.8), b0, 0.12 + 0.11 * e, pan=rng.uniform(-0.5, 0.5))
    if bar == 0:
        add("pad", pad_note(mtof(33), BAR * 2), 0, 0.22)
    if e >= 2:
        for k in range(8):
            f = mtof(root + (12 if k % 4 == 3 else 0))
            if e == 2 and k % 2 == 1:
                continue
            add("bass", bass_note(f, BEAT / 2 * 0.9), b0 + k * BEAT / 2, 1.0 if k % 2 == 0 else 0.7)
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
    if e >= 3:
        notes = [tri[0] + 12, tri[1] + 12, tri[2] + 12, tri[1] + 24, tri[2] + 12, tri[1] + 12, tri[0] + 24, tri[2] + 12]
        step = BEAT / 2 if e == 3 else BEAT / 4
        for k in range(int(BAR / step)):
            add("arp", pluck(mtof(notes[k % len(notes)])), b0 + k * step, 0.55 + 0.1 * (k % 4 == 0), pan=-0.4 if k % 2 else 0.4)

# snare rolls into the biggest section changes
for name in ("modernizar", "accel", "special", "cases", "close"):
    t0 = SC[name][0]
    for k in range(8):
        add("drums", snare(0.1), t0 - BEAT * 2 + k * BEAT / 4, 0.25 + 0.09 * k)

# ---- hook: three slams, riser, boom on the flash
for f in (2, 9, 19):
    add("fx", impact(0.9), f / FPS, 0.5)
    add("fx", tick(), f / FPS, 1.0)
add("fx", riser(1.3), 0.12, 0.8)
add("fx", reverse_cym(0.6), 0.9, 0.6)

# ---- cuts
for c in TL["cuts"]:
    f, kind = c["at"], c["kind"]
    t = f / FPS
    if kind.startswith("wipe"):
        add("fx", whoosh(0.5), t - 0.3, 0.9, pan=-0.2)
    elif kind.startswith("slices"):
        for k in range(6):
            add("fx", tick(0.05), t - 0.3 + k * 0.03, 0.7, pan=-0.6 + k * 0.24)
        add("fx", whoosh(0.4), t - 0.25, 0.7, pan=0.2)
    else:
        add("fx", reverse_cym(0.5), t - 0.5, 0.7)
    add("fx", impact(1.2 if f >= 2500 else 0.9), t, 0.9 if kind == "flash" else 0.8)
    if f == 45:
        add("fx", shimmer(1.6), t + 0.05, 0.8)

for name in ("modernizar", "accel", "special", "close"):
    add("fx", riser(2.0, 0.9), SC[name][0] - 2.0, 0.8)

# counters: stats scene, +40 clients, SIREC +15
for i in range(6):
    start = SC["close"][0] + (4 + i * 5) / FPS
    for k in range(14):
        add("fx", tick(), start + k * 0.045, 0.5, pan=-0.5 + i * 0.2)
for k in range(12):
    add("fx", tick(), SC["clients"][0] + 50 / FPS + k * 0.05, 0.4)
for k in range(8):
    add("fx", tick(), SC["accel"][0] / 1 + (360 + 56) / FPS + k * 0.05, 0.4)

add("fx", shimmer(1.4), SC["clients"][0] + 2.5, 0.7)
add("fx", shimmer(2.5), SC["close"][0] + 120 / FPS + 1.0, 0.9)
add("fx", shimmer(3.0), SC["close"][0] + 120 / FPS + 4.0, 0.8)

# ---- ending: sustained Am chord
for m in (45, 57, 60, 64, 69):
    add("pad", pad_note(mtof(m), 5.5), TOTAL_S - 5.5, 0.9)

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


pad = reverb(sidechain(bus["pad"], 0.5), wet=0.12)
arp = reverb(sidechain(bus["arp"], 0.35), wet=0.18)
bass = sidechain(bus["bass"], 0.7, 0.2)
fx = reverb(bus["fx"], wet=0.1)
drums = bus["drums"]

t = np.arange(N) / SR
fade = np.clip(t / 0.4, 0, 1) * np.clip((TOTAL_S - t) / 3.0, 0, 1)

out = os.path.join(os.path.dirname(__file__), "..", "public", "sfx")
os.makedirs(out, exist_ok=True)


def export(name, l, r, peak):
    mix = np.stack([l * fade, r * fade], axis=1)
    mix = np.tanh(mix * 0.9) / 0.9
    mix = mix / np.max(np.abs(mix)) * peak
    wav = os.path.join(out, name + ".wav")
    with wave.open(wav, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((mix * 32767).astype("<i2").tobytes())
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", wav, "-af", "alimiter=limit=0.9", "-c:a", "libmp3lame", "-b:a", "224k", os.path.join(out, name + ".mp3")], check=True)
    os.remove(wav)


export(
    "music",
    pad[0] * 0.9 + arp[0] * 0.75 + bass[0] * 0.95 + drums[0] * 0.85,
    pad[1] * 0.9 + arp[1] * 0.75 + bass[1] * 0.95 + drums[1] * 0.85,
    0.89,
)
export("fx", fx[0], fx[1], 0.89)
print("ok", DUR, BARS, energy)
