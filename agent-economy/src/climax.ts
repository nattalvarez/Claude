import { ease } from "./theme";
import { ramp } from "./engine/math";

/** Timing of the pink surface (shared by Main, the floor and the climax scene). */
export const WALL = { rise: [1736, 1780] as const, hold: 1878, shrink: [1878, 1940] as const };

/** 0→1 as the pink surface rises, back to 0 as it contracts into the end-card panel. */
export const wallCover = (f: number) =>
  ramp(f, WALL.rise[0] + 6, WALL.rise[1], ease.inOut) * (1 - ramp(f, WALL.shrink[0], WALL.shrink[0] + 30, ease.inOut));

/** End-card panel rectangle (px). Left column stays free for the title. */
export const PANEL = { x: 1180, y: 150, w: 580, h: 780 };
