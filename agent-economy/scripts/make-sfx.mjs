// Deterministic sound kit — synthesised, no downloads, no licences.
// Run:  npm run sfx   →  public/sfx/*.wav  (44.1 kHz, 16-bit, mono)
import fs from "node:fs";
import path from "node:path";

const SR = 44100;
const OUT = path.resolve("public/sfx");
fs.mkdirSync(OUT, { recursive: true });

let seed = 1234567;
const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
const buf = (sec) => new Float32Array(Math.floor(sec * SR));
const TAU = Math.PI * 2;

function write(name, data, peak = 0.9) {
  let m = 0;
  for (const v of data) m = Math.max(m, Math.abs(v));
  const g = m > 0 ? peak / m : 1;
  const b = Buffer.alloc(44 + data.length * 2);
  b.write("RIFF", 0); b.writeUInt32LE(36 + data.length * 2, 4); b.write("WAVEfmt ", 8);
  b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22);
  b.writeUInt32LE(SR, 24); b.writeUInt32LE(SR * 2, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34);
  b.write("data", 36); b.writeUInt32LE(data.length * 2, 40);
  for (let i = 0; i < data.length; i++) b.writeInt16LE(Math.round(Math.max(-1, Math.min(1, data[i] * g)) * 32767), 44 + i * 2);
  fs.writeFileSync(path.join(OUT, name + ".wav"), b);
}

/** simple feedback-delay "room" so nothing sounds dry */
function room(x, mix = 0.28) {
  const taps = [[0.043, 0.5], [0.071, 0.4], [0.113, 0.3], [0.171, 0.22]];
  const y = new Float32Array(x.length + Math.floor(0.5 * SR));
  for (let i = 0; i < x.length; i++) y[i] += x[i];
  for (const [d, g] of taps) {
    const o = Math.floor(d * SR);
    for (let i = 0; i < x.length; i++) y[i + o] += x[i] * g * mix * 2;
  }
  return y;
}

const lp = (x, a) => { let s = 0; for (let i = 0; i < x.length; i++) { s += a * (x[i] - s); x[i] = s; } return x; };

function tone(freq, dur, { attack = 0.004, decay = 6, harm = [[2, 0.25]], vib = 0 } = {}) {
  const x = buf(dur);
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    const e = Math.min(1, t / attack) * Math.exp(-decay * t);
    let v = Math.sin(TAU * freq * t + vib * Math.sin(TAU * 5 * t));
    for (const [h, a] of harm) v += a * Math.sin(TAU * freq * h * t) * Math.exp(-decay * 0.5 * t);
    x[i] = v * e;
  }
  return x;
}

function noiseSweep(dur, f0, f1, { shape = "bell", q = 0.15 } = {}) {
  const x = buf(dur);
  let s1 = 0, s2 = 0;
  for (let i = 0; i < x.length; i++) {
    const t = i / x.length;
    const f = f0 * Math.pow(f1 / f0, t);
    const a = Math.min(0.9, (TAU * f) / SR);
    const n = rnd() * 2 - 1;
    s1 += a * (n - s1); s2 += a * (s1 - s2);
    const hp = s1 - s2; // band-ish
    const env = shape === "bell" ? Math.sin(Math.PI * t) ** 2 : shape === "rise" ? t ** 2.2 * (1 - Math.max(0, (t - 0.96) / 0.04)) : (1 - t) ** 2;
    x[i] = (hp * 3 + s2 * 0.6) * env;
  }
  return x;
}

function thump(dur = 1.2, f0 = 120, f1 = 42) {
  const x = buf(dur);
  let ph = 0;
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    const f = f1 + (f0 - f1) * Math.exp(-t * 14);
    ph += (TAU * f) / SR;
    x[i] = Math.sin(ph) * Math.exp(-t * 4.2) * Math.min(1, t / 0.003);
  }
  return x;
}

function swell(dur, freqs, { atk = 0.4, rel = 0.45 } = {}) {
  const x = buf(dur);
  for (let i = 0; i < x.length; i++) {
    const t = i / SR, u = t / dur;
    const e = Math.min(1, u / atk) * Math.min(1, (1 - u) / rel);
    let v = 0;
    freqs.forEach((f, k) => { v += Math.sin(TAU * f * t + k) + 0.5 * Math.sin(TAU * f * 1.004 * t + k * 2); });
    x[i] = (v / freqs.length) * e * e;
  }
  return x;
}

const mix = (...parts) => {
  const n = Math.max(...parts.map((p) => p.x.length + Math.floor((p.at ?? 0) * SR)));
  const y = new Float32Array(n);
  for (const { x, at = 0, g = 1 } of parts) { const o = Math.floor(at * SR); for (let i = 0; i < x.length; i++) y[o + i] += x[i] * g; }
  return y;
};

// ── the kit ──────────────────────────────────────────────
write("tick", room(tone(1180, 0.35, { decay: 22, harm: [[2.01, 0.12]] }), 0.2), 0.8);
write("tock", room(tone(392, 0.5, { decay: 12, harm: [[2, 0.2], [3, 0.08]] }), 0.3), 0.85);
write("ping-a", room(tone(660, 1.4, { decay: 4.2, harm: [[2.76, 0.18], [5.4, 0.05]] }), 0.35), 0.8);
write("ping-b", room(tone(880, 1.4, { decay: 4.2, harm: [[2.76, 0.18], [5.4, 0.05]] }), 0.35), 0.8);
write("ping-c", room(tone(1175, 1.5, { decay: 4, harm: [[2.76, 0.18], [5.4, 0.05]] }), 0.35), 0.8);
write("chime", room(mix({ x: tone(784, 1.8, { decay: 3.2, harm: [[2.76, 0.2], [5.4, 0.06]] }) }, { x: tone(1175, 1.8, { decay: 3.6, harm: [[2.76, 0.15]] }), at: 0.07, g: 0.7 }), 0.4), 0.85);
write("whoosh", room(lp(noiseSweep(1.3, 300, 3800, { shape: "bell" }), 0.5), 0.3), 0.85);
write("whoosh-long", room(lp(noiseSweep(2.4, 200, 3000, { shape: "bell" }), 0.5), 0.35), 0.85);
write("riser", room(mix({ x: noiseSweep(2.2, 250, 5200, { shape: "rise" }) }, { x: swell(2.2, [196, 294], { atk: 0.9, rel: 0.1 }), g: 0.5 }), 0.3), 0.85);
write("scan", room(lp(noiseSweep(0.55, 700, 5200, { shape: "bell" }), 0.6), 0.25), 0.8);
write("thump", room(thump(1.2, 120, 44), 0.2), 0.95);
write("impact", room(mix({ x: thump(2.4, 130, 38) }, { x: lp(noiseSweep(1.2, 900, 120, { shape: "fall" }), 0.35), g: 0.35 }, { x: swell(2.6, [55, 82.4, 110], { atk: 0.05, rel: 0.9 }), g: 0.5 }), 0.35), 0.95);
write("swell", room(swell(4.5, [110, 164.8, 220, 329.6], { atk: 0.5, rel: 0.45 }), 0.4), 0.7);
write("seal", room(mix({ x: thump(1.4, 160, 60) }, { x: tone(1320, 1.2, { decay: 7, harm: [[2, 0.3]] }), at: 0.01, g: 0.35 }), 0.25), 0.9);

// a whisper-quiet bed: 70 s, builds toward the climax (59.9 s) and thins out for the close
{
  const dur = 70, x = buf(dur);
  const climax = 59.9;
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    const swellAmt = 0.25 + 0.75 * Math.exp(-(((t - climax) / 9) ** 2)) + 0.25 * Math.min(1, t / 6);
    const fade = Math.min(1, t / 3) * Math.min(1, (dur - t) / 3);
    const lfo = 0.85 + 0.15 * Math.sin(TAU * 0.07 * t);
    let v = Math.sin(TAU * 55 * t) * 0.6 + Math.sin(TAU * 82.41 * t + 1) * 0.35 + Math.sin(TAU * 110.4 * t + 2) * 0.22 + Math.sin(TAU * 164.9 * t) * 0.1 * (0.5 + 0.5 * Math.sin(TAU * 0.05 * t));
    x[i] = v * swellAmt * lfo * fade;
  }
  write("bed", x, 0.5);
}
console.log("sfx written to", OUT);
