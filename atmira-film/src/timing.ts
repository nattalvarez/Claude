import timing from "./data/timing.json";
import rawWords from "./data/words.json";

export const FPS = timing.fps;
export const DURATION_S = timing.duration;
export const DURATION_FRAMES = Math.round(timing.duration * timing.fps);
export const OFFSET = timing.offset;
export const SCENES = timing.scenes;
export type SceneId = keyof typeof SCENES;
export const CUTS = timing.cuts;

type W = { text: string; start: number; end: number };
const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9+]/g, "");
const words = (rawWords as W[]).map((w) => ({ ...w, n: norm(w.text) }));

/** Index of the nth occurrence of a spoken word in the (ElevenLabs Scribe) transcript. */
const find = (text: string, nth: number) => {
  const n = norm(text);
  let seen = 0;
  for (let i = 0; i < words.length; i++) {
    if (words[i].n === n && seen++ === nth) return i;
  }
  throw new Error(`word not found: ${text}#${nth}`);
};

/** Global start time (s) of a spoken word. `rel` shifts by whole words (e.g. -1 = previous word). */
export const vw = (text: string, nth = 0, rel = 0) => words[find(text, nth) + rel].start + OFFSET;
/** Global end time (s) of a spoken word. */
export const vwe = (text: string, nth = 0, rel = 0) => words[find(text, nth) + rel].end + OFFSET;
export const VO_END = words[words.length - 1].end + OFFSET;
