import { interpolate } from "remotion";
import { EASE, WIDTH, HEIGHT } from "./theme";

// [frame, x, y, scale, rotateDeg?]
export type CamKF = [number, number, number, number, number?];

export type CamState = { x: number; y: number; scale: number; rotate: number };

export const cameraAt = (frame: number, kfs: CamKF[]): CamState => {
  const frames = kfs.map((k) => k[0]);
  const xs = kfs.map((k) => k[1]);
  const ys = kfs.map((k) => k[2]);
  const scales = kfs.map((k) => k[3]);
  const rots = kfs.map((k) => k[4] ?? 0);
  const opts = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const, easing: EASE.inOut };
  return {
    x: interpolate(frame, frames, xs, opts),
    y: interpolate(frame, frames, ys, opts),
    scale: interpolate(frame, frames, scales, opts),
    rotate: interpolate(frame, frames, rots, opts),
  };
};

// Simple pan/zoom for scenes whose content is ordinary flexbox layout
// (already centered) — transform-origin 50%/50% makes translate+scale read
// as a natural camera move over that content.
export const cameraTransform = (cam: CamState): string =>
  `translate(${cam.x}px, ${cam.y}px) scale(${cam.scale}) rotate(${cam.rotate}deg)`;

// For scenes whose children are positioned with raw world coordinates
// (left/top offsets from a (0,0) origin at screen center — see WorldPoint):
// bakes in the screen-center translation so `cam.x/cam.y` is the world
// point the camera looks at, exactly like translate(W/2,H/2) scale(zoom)
// translate(-cx,-cy).
export const worldCameraTransform = (cam: CamState): string =>
  `translate(${WIDTH / 2}px, ${HEIGHT / 2}px) rotate(${cam.rotate}deg) scale(${cam.scale}) translate(${-cam.x}px, ${-cam.y}px)`;
