#!/usr/bin/env node
/**
 * Genera con la API de ElevenLabs los clips de locución que aún no existen en audio/raw/
 * (y su transcripción con tiempos por palabra con Scribe), a partir de audio/script.json.
 *
 *   ELEVENLABS_API_KEY=xxxxx node scripts/generate_voice.mjs [idClip ...]
 *
 * · La clave se lee SOLO de la variable de entorno (nunca se guarda en el repositorio).
 * · Es idempotente: salta los clips cuyo .mp3 ya existe. Para rehacer uno, bórralo de audio/raw/.
 * · Tras generar: npm run audio  (recorta por escena, normaliza, recalcula el montaje y la música).
 *
 * NOTA: este script está escrito siguiendo la API pública de ElevenLabs (text-to-speech y speech-to-text/Scribe)
 * pero NO se ha podido ejecutar en el entorno de producción del vídeo (ahí la locución se generó mediante el
 * conector de ElevenLabs de la sesión, sin clave API). Verifica los endpoints contra
 * https://elevenlabs.io/docs/api-reference antes del primer uso.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const A = path.join(ROOT, "audio");
const KEY = process.env.ELEVENLABS_API_KEY;
if (!KEY) {
  console.error("Falta ELEVENLABS_API_KEY en el entorno. Ej.:  ELEVENLABS_API_KEY=… node scripts/generate_voice.mjs");
  process.exit(1);
}
const script = JSON.parse(fs.readFileSync(path.join(A, "script.json"), "utf8"));
const only = new Set(process.argv.slice(2));
const API = "https://api.elevenlabs.io/v1";

for (const clip of script.clips) {
  if (only.size && !only.has(clip.id)) continue;
  const rawRel = clip.raw || `raw/${clip.id}.mp3`;
  const rawPath = path.join(A, rawRel);
  const trRel = clip.transcript || `transcripts/${clip.id}.json`;
  const trPath = path.join(A, trRel);
  if (fs.existsSync(rawPath) && fs.existsSync(trPath)) continue;

  if (!fs.existsSync(rawPath)) {
    const text = clip.blocks.map((b) => b.text).join(" ");
    console.log(`→ TTS ${clip.id} (${text.length} caracteres)`);
    const res = await fetch(`${API}/text-to-speech/${script.voice.voice_id}?output_format=mp3_44100_128`, {
      method: "POST",
      headers: { "xi-api-key": KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ text, model_id: script.voice.model }),
    });
    if (!res.ok) throw new Error(`TTS ${clip.id}: ${res.status} ${await res.text()}`);
    fs.mkdirSync(path.dirname(rawPath), { recursive: true });
    fs.writeFileSync(rawPath, Buffer.from(await res.arrayBuffer()));
  }
  if (!fs.existsSync(trPath)) {
    console.log(`→ Scribe ${clip.id}`);
    const form = new FormData();
    form.append("model_id", "scribe_v1");
    form.append("timestamps_granularity", "word");
    form.append("language_code", "spa");
    form.append("file", new Blob([fs.readFileSync(rawPath)], { type: "audio/mpeg" }), path.basename(rawPath));
    const res = await fetch(`${API}/speech-to-text`, { method: "POST", headers: { "xi-api-key": KEY }, body: form });
    if (!res.ok) throw new Error(`STT ${clip.id}: ${res.status} ${await res.text()}`);
    const j = await res.json();
    fs.mkdirSync(path.dirname(trPath), { recursive: true });
    fs.writeFileSync(trPath, JSON.stringify({ words: j.words }, null, 1));
  }
}
console.log("Hecho. Ejecuta ahora:  npm run audio");
