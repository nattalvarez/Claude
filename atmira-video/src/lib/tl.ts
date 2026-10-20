import timeline from "../data/timeline.json";
import audio from "../data/audio.json";
import { FPS } from "../theme";

export type SceneId = (typeof timeline.scenes)[number]["id"];
export type Word = { w: string; s: number; e: number };

type AudioBlock = { file: string | null; dur: number; words: Word[]; estimated?: boolean; pending?: boolean };
const blocks = (audio as unknown as { blocks: Record<string, AudioBlock> }).blocks;

export const TOTAL_FRAMES: number = timeline.total;
export const scenes = timeline.scenes;
export const sceneById = (id: string) => {
  const s = scenes.find((x) => x.id === id);
  if (!s) throw new Error(`escena desconocida: ${id}`);
  return s;
};

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9ñ]/g, "");

/**
 * Frame (local a la escena) en que empieza la palabra o la secuencia `needle` dentro del bloque de voz.
 * `nth` selecciona la aparición (0 = la primera). Si el bloque aún no tiene audio real, devuelve una
 * estimación proporcional para poder maquetar.
 */
export const cue = (sceneId: string, needle: string, nth = 0, blockIndex = 0): number => {
  const sc = sceneById(sceneId);
  const v = sc.voice[blockIndex];
  const b = blocks[v.id];
  const sec = findSec(b, needle, nth, v.id);
  return Math.round(v.from + sec * FPS);
};

/** Frame local en que TERMINA la palabra/secuencia. */
export const cueEnd = (sceneId: string, needle: string, nth = 0, blockIndex = 0): number => {
  const sc = sceneById(sceneId);
  const v = sc.voice[blockIndex];
  const b = blocks[v.id];
  const sec = findSec(b, needle, nth, v.id, true);
  return Math.round(v.from + sec * FPS);
};

/** Frame local de inicio / fin de un bloque de voz. */
export const voiceStart = (sceneId: string, blockIndex = 0) => sceneById(sceneId).voice[blockIndex].from;
export const voiceEnd = (sceneId: string, blockIndex = 0) => {
  const v = sceneById(sceneId).voice[blockIndex];
  return v.from + v.frames;
};

const findSec = (b: AudioBlock | undefined, needle: string, nth: number, id: string, end = false): number => {
  if (!b) return 0;
  const target = needle.split(/\s+/).map(norm).filter(Boolean);
  const toks = b.words.map((w) => norm(w.w));
  let seen = 0;
  for (let i = 0; i + target.length <= toks.length; i++) {
    let ok = true;
    for (let k = 0; k < target.length; k++) {
      if (toks[i + k] !== target[k]) {
        ok = false;
        break;
      }
    }
    if (ok) {
      if (seen === nth) return end ? b.words[i + target.length - 1].e : b.words[i].s;
      seen++;
    }
  }
  // eslint-disable-next-line no-console
  console.warn(`cue no encontrada: «${needle}» (${nth}) en ${id}`);
  return 0;
};

export const audioFile = (blockId: string) => blocks[blockId]?.file ?? undefined;
export const hasAudio = (blockId: string) => !!blocks[blockId]?.file;

export type Aligned = { tok: string; s: number; e: number; matched: boolean };

/**
 * Alinea las palabras de un texto en pantalla con las de la locución (tiempos reales por palabra).
 * `fromNeedle` es la primera palabra (o secuencia) a partir de la cual empieza a coincidir el texto.
 * Devuelve, por cada token, el frame local en que se pronuncia (s) y en que termina (e).
 * Si una palabra no coincide, se interpola respecto a la anterior (nunca se rompe el montaje).
 */
export const alignTokens = (
  sceneId: string,
  text: string,
  fromNeedle: string,
  blockIndex = 0,
  nth = 0,
): Aligned[] => {
  const sc = sceneById(sceneId);
  const v = sc.voice[blockIndex];
  const b = blocks[v.id];
  const toks = text.split(/\s+/).filter(Boolean);
  const out: Aligned[] = [];
  const aw = (b?.words ?? []).filter((w) => norm(w.w).length > 0);
  const an = aw.map((w) => norm(w.w));
  // índice inicial
  const first = fromNeedle.split(/\s+/).map(norm).filter(Boolean);
  let i0 = -1;
  let seen = 0;
  for (let i = 0; i + first.length <= an.length; i++) {
    if (first.every((f, k) => an[i + k] === f)) {
      if (seen === nth) {
        i0 = i;
        break;
      }
      seen++;
    }
  }
  if (i0 < 0) {
    // eslint-disable-next-line no-console
    console.warn(`alignTokens: no encuentro «${fromNeedle}» en ${v.id}`);
    i0 = 0;
  }
  let ai = i0;
  let lastE = v.from + Math.round((aw[i0]?.s ?? 0) * FPS);
  for (const tok of toks) {
    const nt = norm(tok);
    if (!nt) {
      out.push({ tok, s: lastE, e: lastE, matched: false });
      continue;
    }
    let hit = -1;
    for (let k = 0; k < 3 && ai + k < an.length; k++) {
      if (an[ai + k] === nt) {
        hit = ai + k;
        break;
      }
    }
    if (hit >= 0) {
      const s = v.from + Math.round(aw[hit].s * FPS);
      const e = v.from + Math.round(aw[hit].e * FPS);
      out.push({ tok, s, e, matched: true });
      ai = hit + 1;
      lastE = e;
    } else {
      out.push({ tok, s: lastE + 2, e: lastE + 6, matched: false });
      lastE = lastE + 6;
    }
  }
  return out;
};
