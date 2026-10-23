import { interpolate, spring } from "remotion";
import { theme } from "../theme";
import { FPS } from "../timing";

type Ease = (t: number) => number;
/** 0..1 progress over [from, from+dur] seconds (global time). Always clamped, never linear by default. */
export const prog = (gt: number, from: number, dur: number, easing: Ease = theme.ease.out) =>
  interpolate(gt, [from, from + dur], [0, 1], { easing, extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/** Spring keyed to a global cue time; `lead` frames early so the visual lands ON the spoken word. */
export const spr = (
  gt: number,
  cue: number,
  config: Record<string, number> = theme.spring.snappy,
  lead = 2,
) => spring({ frame: (gt - cue) * FPS + lead, fps: FPS, config });

export const lerp = (p: number, a: number, b: number) => a + (b - a) * p;
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const rng = (seed: number) => {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
