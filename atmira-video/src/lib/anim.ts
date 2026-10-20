import { interpolate } from "remotion";
import { EASE } from "../theme";

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Progreso 0→1 entre `start` y `start+dur` con curva de aceleración (nunca lineal). */
export const ramp = (
  frame: number,
  start: number,
  dur: number,
  easing: (t: number) => number = EASE.out,
) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

/** Progreso 1→0 (salidas; deben ser más rápidas que las entradas). */
export const rampOut = (
  frame: number,
  start: number,
  dur: number,
  easing: (t: number) => number = EASE.in,
) => 1 - ramp(frame, start, dur, easing);

/** Ventana de visibilidad: entra en [a, a+inDur] y sale en [b, b+outDur]. */
export const window = (frame: number, a: number, b: number, inDur = 14, outDur = 9) =>
  Math.min(ramp(frame, a, inDur), rampOut(frame, b, outDur));

/** Respiración: micro-movimiento senoidal determinista. */
export const breathe = (frame: number, fps: number, period = 4, amp = 1, phase = 0) =>
  Math.sin(((frame / fps) / period) * Math.PI * 2 + phase) * amp;

/** RNG determinista (mulberry32). Nunca Math.random: el render debe ser reproducible. */
export const rng = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};
