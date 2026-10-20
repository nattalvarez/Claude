#!/usr/bin/env node
/**
 * Pipeline de locución:
 *   audio/raw/*.mp3 (ElevenLabs) + audio/transcripts/*.json (tiempos por palabra, ElevenLabs Scribe)
 *   → recorta cada clip en bloques por escena (por el silencio entre palabras)
 *   → normaliza el nivel (LUFS) y codifica public/audio/voz/<bloque>.mp3
 *   → escribe src/data/audio.json con duración y tiempos por palabra de cada bloque.
 *
 * Si falta una transcripción, estima los tiempos (marcado como estimated:true) para poder maquetar.
 * No hay credenciales aquí: el audio se genera con ElevenLabs (ver README, sección Locución).
 */
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const A = path.join(ROOT, "audio");
const OUT = path.join(ROOT, "public", "audio", "voz");
fs.mkdirSync(OUT, { recursive: true });

const script = JSON.parse(fs.readFileSync(path.join(A, "script.json"), "utf8"));
const TARGET_LUFS = -18;
const HEAD = 0.14; // aire antes de la primera palabra
const TAIL = 0.32; // aire tras la última

const run = (cmd, args) => execFileSync(cmd, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
const probeDur = (f) => parseFloat(run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]));

const loadWords = (file, text, dur) => {
  const p = path.join(A, file);
  if (fs.existsSync(p)) {
    const j = JSON.parse(fs.readFileSync(p, "utf8"));
    const arr = Array.isArray(j) ? j : j.words || j.transcripts?.[0]?.words || [];
    return {
      estimated: false,
      words: arr.filter((w) => !w.type || w.type === "word").map((w) => ({ w: w.text ?? w.word, s: +w.start, e: +w.end })),
    };
  }
  // estimación: reparto proporcional a la longitud de cada palabra
  const toks = text.split(/\s+/).filter(Boolean);
  const weights = toks.map((t) => (t === "…" ? 3 : Math.max(2, t.replace(/[^\p{L}\p{N}]/gu, "").length) + (/[.:?!]$/.test(t) ? 3 : 0)));
  const total = weights.reduce((a, b) => a + b, 0);
  let acc = 0;
  const words = toks.map((t, i) => {
    const s = (acc / total) * dur;
    acc += weights[i];
    return { w: t, s, e: Math.max(s + 0.05, (acc / total) * dur - (/[.:?!]$/.test(t) ? 0.18 : 0.02)) };
  });
  return { estimated: true, words };
};

const manifest = { voice: script.voice, target_lufs: TARGET_LUFS, blocks: {} };

for (const clip of script.clips) {
  const raw = clip.raw ? path.join(A, clip.raw) : null;
  if (!raw || !fs.existsSync(raw)) {
    // sin audio todavía: se estiman los tiempos para poder maquetar y se marca como pendiente
    for (const b of clip.blocks) {
      const toks = b.text.split(/\s+/).filter(Boolean);
      let t = 0;
      const words = toks.map((w) => {
        const letters = w.replace(/[^\p{L}\p{N}]/gu, "").length;
        const s0 = t;
        t += letters * 0.058 + 0.11;
        const e0 = t;
        t += /[.:?!]$/.test(w) ? 0.34 : /[,;]$/.test(w) ? 0.16 : w === "…" ? 0.3 : 0;
        return { w, s: +s0.toFixed(3), e: +e0.toFixed(3) };
      });
      manifest.blocks[b.id] = { file: null, dur: +(t + 0.3).toFixed(3), gainDb: 0, estimated: true, pending: true, words };
      console.warn(`· ${b.id}: SIN AUDIO (pendiente de ElevenLabs) — duración estimada ${t.toFixed(1)} s`);
    }
    continue;
  }
  const dur = probeDur(raw);
  const joined = clip.blocks.map((b) => b.text).join(" ");
  const { estimated, words } = loadWords(clip.transcript, joined, dur);

  // reparte las palabras de la transcripción entre los bloques por nº de tokens, ajustando al mayor silencio cercano
  const counts = clip.blocks.map((b) => b.text.split(/\s+/).filter(Boolean).length);
  const totalTok = counts.reduce((a, b) => a + b, 0);
  if (!estimated && Math.abs(words.length - totalTok) > 0) {
    console.warn(`· ${clip.id}: ${words.length} palabras en transcripción vs ${totalTok} en guion (se ajusta por silencios)`);
  }
  let cuts = [0];
  let acc = 0;
  for (let i = 0; i < counts.length - 1; i++) {
    acc += counts[i];
    let best = Math.min(words.length - 1, Math.round((acc / totalTok) * words.length));
    let bestGap = -1;
    for (let k = Math.max(1, best - 4); k <= Math.min(words.length - 1, best + 4); k++) {
      const gap = words[k].s - words[k - 1].e;
      if (gap > bestGap) {
        bestGap = gap;
        best = k;
      }
    }
    cuts.push(best);
  }
  cuts.push(words.length);

  clip.blocks.forEach((b, bi) => {
    const ws = words.slice(cuts[bi], cuts[bi + 1]);
    if (!ws.length) return;
    const t0 = Math.max(0, ws[0].s - HEAD);
    const t1 = Math.min(dur, ws[ws.length - 1].e + TAIL);
    const outFile = path.join(OUT, `${b.id}.mp3`);
    const tmp = path.join(A, `.tmp_${b.id}.wav`);
    run("ffmpeg", ["-v", "error", "-y", "-ss", t0.toFixed(3), "-to", t1.toFixed(3), "-i", raw, "-ac", "1", "-ar", "44100", tmp]);
    // medición de loudness → ganancia lineal (sin compresión dinámica que "bombee")
    let gain = 0;
    const meas = execFileSyncCapture("ffmpeg", ["-hide_banner", "-nostats", "-i", tmp, "-af", `loudnorm=I=${TARGET_LUFS}:TP=-2:LRA=9:print_format=json`, "-f", "null", "-"]);
    const mm = meas.match(/"input_i"\s*:\s*"(-?[\d.]+)"/);
    if (mm) gain = Math.max(-12, Math.min(12, TARGET_LUFS - parseFloat(mm[1])));
    run("ffmpeg", ["-v", "error", "-y", "-i", tmp, "-af", `volume=${gain.toFixed(2)}dB,alimiter=limit=0.89:level=false`, "-c:a", "libmp3lame", "-q:a", "2", outFile]);
    fs.unlinkSync(tmp);
    manifest.blocks[b.id] = {
      file: `audio/voz/${b.id}.mp3`,
      dur: +probeDur(outFile).toFixed(3),
      gainDb: +gain.toFixed(2),
      estimated,
      words: ws.map((w) => ({ w: w.w, s: +(w.s - t0).toFixed(3), e: +(w.e - t0).toFixed(3) })),
    };
    console.log(`✓ ${b.id}  ${manifest.blocks[b.id].dur}s  gain ${gain.toFixed(1)} dB  ${estimated ? "(tiempos estimados)" : ""}`);
  });
}

function execFileSyncCapture(cmd, args) {
  const r = spawnSync(cmd, args, { encoding: "utf8" });
  return String(r.stderr || "") + String(r.stdout || "");
}

fs.mkdirSync(path.join(ROOT, "src", "data"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "src", "data", "audio.json"), JSON.stringify(manifest, null, 1));
console.log(`→ src/data/audio.json (${Object.keys(manifest.blocks).length} bloques)`);
