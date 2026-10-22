import timing from "./data/timing.json";

export const FPS = timing.fps;
export const DURATION_S = timing.duration;
export const DURATION_FRAMES = Math.round(timing.duration * timing.fps);
export const OFFSET = timing.offset;
export const SCENES = timing.scenes;
export type SceneId = keyof typeof SCENES;
/** VO-relative time (as in the ElevenLabs transcript) -> global video seconds. */
export const vo = (t: number) => Math.round((t + OFFSET) * 100) / 100;
export const CUTS = timing.cuts;
