#!/usr/bin/env node
/**
 * Locución a dos voces (v7):
 *   audio/raw_v6/<seg>.mp3 (ElevenLabs, un clip por intervención de cada voz)
 *   + audio/transcripts_v6/all_words.json (Scribe sobre la concatenación de los 56 clips; offsets.json da el inicio de cada clip)
 *   → alinea las palabras de Scribe con las del guion (audio/script_v6.json)
 *   → normaliza cada clip (−18 LUFS, ambas voces igualadas), recorta el aire y los une por bloque con pausas
 *   → public/audio/voz/<bloque>.mp3 + src/data/audio.json (mismo esquema que en v5/v6).
 */
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const A = path.join(ROOT, "audio");
const OUT = path.join(ROOT, "public", "audio", "voz");
fs.mkdirSync(OUT, { recursive: true });
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), "atmira-voz-"));

const script = JSON.parse(fs.readFileSync(path.join(A, "script_v6.json"), "utf8"));
const scribe = JSON.parse(fs.readFileSync(path.join(A, "transcripts_v6", "all_words.json"), "utf8")).words.filter((w) => !w.type || w.type === "word");
const offs = JSON.parse(fs.readFileSync(path.join(A, "transcripts_v6", "offsets.json"), "utf8"));
const TARGET_LUFS = -18;
const HEAD = 0.14;
const TAIL = 0.32;
const PAD_IN = 0.07; // aire que se conserva antes de la primera palabra de cada intervención
const PAD_OUT = 0.14; // y después de la última

const run = (cmd, args) => execFileSync(cmd, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
const probeDur = (f) => parseFloat(run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");

// similitud simple entre dos palabras (distancia de edición normalizada)
const sim = (a, b) => {
  if (a === b) return 1;
  if (!a || !b) return 0;
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return 1 - d[a.length][b.length] / Math.max(a.length, b.length);
};

/** Needleman–Wunsch: devuelve, para cada token del guion, el índice de palabra de Scribe (o -1). */
function align(toks, ws) {
  const n = toks.length, m = ws.length;
  const sc = (i, j) => { const s = sim(norm(toks[i]), norm(ws[j].text)); return s === 1 ? 2 : s > 0.5 ? 1 : -1; };
  const G = -1;
  const D = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++) D[i][0] = i * G;
  for (let j = 1; j <= m; j++) D[0][j] = j * G;
  for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++) D[i][j] = Math.max(D[i - 1][j - 1] + sc(i - 1, j - 1), D[i - 1][j] + G, D[i][j - 1] + G);
  const map = Array(n).fill(-1);
  let i = n, j = m;
  while (i > 0 && j > 0) {
    if (D[i][j] === D[i - 1][j - 1] + sc(i - 1, j - 1)) { map[i - 1] = j - 1; i--; j--; }
    else if (D[i][j] === D[i - 1][j] + G) i--;
    else j--;
  }
  return map;
}

const segWords = {};
for (const sg of script.segments) {
  const [o, d] = offs[sg.id];
  const ws = scribe.filter((w) => w.start >= o - 0.4 && w.start < o + d + 0.1).map((w) => ({ text: w.text, s: w.start - o, e: w.end - o }));
  const toks = sg.text.split(/\s+/).filter(Boolean);
  const map = align(toks, ws);
  let words = toks.map((t, i) => (map[i] >= 0 ? { w: t, s: ws[map[i]].s, e: ws[map[i]].e, ok: true } : { w: t, s: NaN, e: NaN, ok: false }));
  // palabras sin pareja: se interpolan entre sus vecinas
  for (let i = 0; i < words.length; i++) {
    if (words[i].ok) continue;
    let a = i - 1; while (a >= 0 && !words[a].ok) a--;
    let b = i + 1; while (b < words.length && !words[b].ok) b++;
    const t0 = a >= 0 ? words[a].e : Math.max(0, (words[b]?.s ?? d) - 0.32 * (b - a - 1));
    const t1 = b < words.length ? words[b].s : d;
    const span = b - a;
    words[i].s = t0 + ((t1 - t0) * (i - a - 1)) / (span - 1 || 1);
    words[i].e = t0 + ((t1 - t0) * (i - a)) / (span - 1 || 1);
    console.warn(`· ${sg.id}: «${words[i].w}» sin pareja en Scribe (${ws.map((x) => x.text).join(" ")}) → interpolada`);
  }
  if (ws.length !== toks.length) console.warn(`· ${sg.id}: ${ws.length} palabras Scribe vs ${toks.length} del guion`);
  segWords[sg.id] = words;
}

// ganancia por clip: medición de loudness; los clips cortos (<2.5 s) usan la mediana de su voz
const measure = (file) => {
  const r = spawnSync("ffmpeg", ["-hide_banner", "-nostats", "-i", file, "-af", "loudnorm=I=-18:TP=-2:LRA=9:print_format=json", "-f", "null", "-"], { encoding: "utf8" });
  const mm = (String(r.stderr) + String(r.stdout)).match(/"input_i"\s*:\s*"(-?[\d.]+)"/);
  return mm ? parseFloat(mm[1]) : null;
};
const lufs = {};
for (const sg of script.segments) lufs[sg.id] = measure(path.join(A, "raw_v6", `${sg.id}.mp3`));
const median = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
const byVoice = {};
for (const v of ["M", "F"]) byVoice[v] = median(script.segments.filter((s) => s.voice === v && offs[s.id][1] > 2.5 && lufs[s.id] != null).map((s) => lufs[s.id]));
console.log("loudness mediana por voz:", byVoice);
const gainOf = (sg) => {
  const L = offs[sg.id][1] > 2.5 && lufs[sg.id] != null && isFinite(lufs[sg.id]) ? lufs[sg.id] : byVoice[sg.voice];
  return Math.max(-12, Math.min(12, TARGET_LUFS - L));
};

const manifest = { voice: script.voices, target_lufs: TARGET_LUFS, blocks: {} };
const silence = (dur, name) => {
  const f = path.join(TMP, name);
  run("ffmpeg", ["-v", "error", "-y", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono", "-t", dur.toFixed(3), "-c:a", "pcm_s16le", f]);
  return f;
};

for (const b of script.blocks) {
  const files = [];
  const words = [];
  let t = 0;
  b.segs.forEach((id, k) => {
    const sg = script.segments.find((s) => s.id === id);
    const w = segWords[id];
    const first = k === 0, last = k === b.segs.length - 1;
    const t0 = Math.max(0, w[0].s - (first ? HEAD : PAD_IN));
    const t1 = Math.min(offs[id][1], w[w.length - 1].e + (last ? TAIL : PAD_OUT));
    const wav = path.join(TMP, `${id}.wav`);
    run("ffmpeg", ["-v", "error", "-y", "-ss", t0.toFixed(3), "-to", t1.toFixed(3), "-i", path.join(A, "raw_v6", `${id}.mp3`), "-af", `volume=${gainOf(sg).toFixed(2)}dB,alimiter=limit=0.89:level=false`, "-ac", "1", "-ar", "44100", wav]);
    if (k > 0) {
      const prev = script.segments.find((s) => s.id === b.segs[k - 1]);
      const endsSentence = /[.?!:]$/.test(prev.text.trim());
      const gap = (endsSentence ? 0.34 : 0.2) + (prev.voice !== sg.voice ? 0.05 : 0.1);
      files.push(silence(gap, `gap_${id}.wav`));
      t += gap;
    }
    files.push(wav);
    for (const x of w) words.push({ w: x.w, s: +(t + x.s - t0).toFixed(3), e: +(t + x.e - t0).toFixed(3) });
    t += probeDur(wav);
  });
  const list = path.join(TMP, `${b.id}.txt`);
  fs.writeFileSync(list, files.map((f) => `file '${f}'\n`).join(""));
  const outFile = path.join(OUT, `${b.id}.mp3`);
  run("ffmpeg", ["-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", list, "-c:a", "libmp3lame", "-q:a", "2", outFile]);
  manifest.blocks[b.id] = { file: `audio/voz/${b.id}.mp3`, dur: +probeDur(outFile).toFixed(3), gainDb: 0, estimated: false, words };
  console.log(`✓ ${b.id}  ${manifest.blocks[b.id].dur}s  (${b.segs.length} intervenciones)`);
}

fs.writeFileSync(path.join(ROOT, "src", "data", "audio.json"), JSON.stringify(manifest, null, 1));
fs.rmSync(TMP, { recursive: true, force: true });
console.log(`→ src/data/audio.json (${Object.keys(manifest.blocks).length} bloques)`);
