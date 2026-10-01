import { ease } from "./theme";
import { ramp, lerp } from "./engine/math";
import { W, H } from "./config";

/** Timing of the pink surface (shared by Main, the floor and the climax scene). */
export const WALL = { rise: [1736, 1780] as const, hold: 1878, shrink: [1878, 1940] as const };

/** 0→1 as the pink surface rises, back to 0 as it contracts into the end-card panel. */
export const wallCover = (f: number) =>
  ramp(f, WALL.rise[0] + 6, WALL.rise[1], ease.inOut) * (1 - ramp(f, WALL.shrink[0], WALL.shrink[0] + 30, ease.inOut));

/** End-card panel rectangle (px). Left column stays free for the title. */
export const PANEL = { x: 80, y: 640, w: 920, h: 360 };

/** The pink surface as a screen rectangle (null before it exists). Shared by the surface and the logo. */
export const pinkRect = (f: number) => {
  if (f < WALL.rise[0]) return null;
  const rise = ease.inOut(ramp(f, WALL.rise[0], WALL.rise[1]));
  const sh = ease.inOut(ramp(f, WALL.shrink[0], WALL.shrink[1]));
  const top = lerp(H + 40, 0, rise);
  return {
    x0: lerp(0, PANEL.x, sh), x1: lerp(W, PANEL.x + PANEL.w, sh),
    y0: lerp(top, PANEL.y, sh), y1: lerp(H, PANEL.y + PANEL.h, sh),
  };
};
