#!/usr/bin/env node
/**
 * Calcula el montaje (inicio y duración de cada escena, inicio de cada bloque de voz) a partir de
 *   src/data/scenes.json  (parámetros de montaje)  +  src/data/audio.json  (duración real de la voz)
 * y escribe src/data/timeline.json. Es la ÚNICA fuente de tiempos: la leen Remotion y el sintetizador de música.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const scenes = JSON.parse(fs.readFileSync(path.join(ROOT, "src/data/scenes.json"), "utf8"));
const audioPath = path.join(ROOT, "src/data/audio.json");
const audio = fs.existsSync(audioPath) ? JSON.parse(fs.readFileSync(audioPath, "utf8")) : { blocks: {} };
const FPS = scenes.fps;
const GAP = 14; // frames entre bloques de voz dentro de una escena

let cursor = 0;
let prevOverlap = 0;
const out = [];
scenes.scenes.forEach((s, i) => {
  const start = cursor - prevOverlap; // inicio global de la escena (se solapa con la transición anterior)
  let t = s.lead;
  const voice = s.blocks.map((id, bi) => {
    const b = audio.blocks[id];
    const durSec = b ? b.dur : s.fallbackSec[bi];
    const frames = Math.ceil(durSec * FPS);
    const v = { id, from: t, frames, real: !!(b && b.file), estimated: b ? !!b.estimated : true };
    t += frames + GAP;
    return v;
  });
  const voiceEnd = voice.length ? voice[voice.length - 1].from + voice[voice.length - 1].frames : s.lead;
  const duration = Math.max(voiceEnd + s.tail, s.min || 0);
  const overlap = s.out ? s.out.frames : 0;
  out.push({ id: s.id, index: i, start, duration, voice, out: s.out, overlapOut: overlap });
  cursor = start + duration;
  prevOverlap = overlap;
});
const total = out[out.length - 1].start + out[out.length - 1].duration;
fs.writeFileSync(path.join(ROOT, "src/data/timeline.json"), JSON.stringify({ fps: FPS, total, scenes: out }, null, 1));
console.log(`timeline: ${out.length} escenas · ${total} frames · ${(total / FPS / 60).toFixed(2)} min`);
out.forEach((s) => console.log(`  ${String(s.index + 1).padStart(2)} ${s.id.padEnd(16)} ${(s.start / FPS).toFixed(1).padStart(6)}s  ${(s.duration / FPS).toFixed(1).padStart(5)}s  ${s.voice.every((v) => v.real) ? "" : "(voz estimada)"}`));
