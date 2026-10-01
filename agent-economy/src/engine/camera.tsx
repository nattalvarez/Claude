import React, { createContext, useContext } from "react";
import { W, H } from "../config";
import { ease } from "../theme";
import { Vec3 } from "./math";

/**
 * Virtual camera. World: x right, y up, z into the screen, ground at y = 0.
 * The camera sits at (x,y,z) and looks forward rotated by yaw (left/right) and
 * pitch (down). `f` is the focal length: an object at depth f renders at 1:1.
 * Push-in = z up · pull-out = z down · travelling = x · crane = y · pan = yaw.
 */
export type Cam = { x: number; y: number; z: number; yaw: number; pitch: number; f: number };

export type CamKey = Partial<Omit<Cam, "f">> & { f: number; ease?: (t: number) => number };
// (key.f is the FRAME here; `ease` shapes the move that ARRIVES at this key.)

export const FOCAL = 1400;

export type Projected = { x: number; y: number; s: number; d: number; vis: boolean };

export const project = (p: Vec3, c: Cam): Projected => {
  const dx = p[0] - c.x, dy = p[1] - c.y, dz = p[2] - c.z;
  const cy = Math.cos(c.yaw), sy = Math.sin(c.yaw);
  const x1 = dx * cy - dz * sy;
  const z1 = dx * sy + dz * cy;
  const cp = Math.cos(c.pitch), sp = Math.sin(c.pitch);
  const y1 = dy * cp + z1 * sp;
  const z2 = z1 * cp - dy * sp;
  const s = c.f / Math.max(z2, 1);
  return { x: W / 2 + x1 * s, y: H / 2 - y1 * s, s, d: z2, vis: z2 > 60 };
};

const CH = ["x", "y", "z", "yaw", "pitch"] as const;

/** Sample a keyframed camera path. Holds = two keys with identical values. */
export const sampleCamera = (keys: CamKey[], frame: number): Cam => {
  const k = keys;
  const out: Cam = { x: 0, y: 0, z: -FOCAL, yaw: 0, pitch: 0, f: FOCAL };
  // carry-forward values for channels a key omits
  const state = { x: 0, y: 0, z: -FOCAL, yaw: 0, pitch: 0 };
  const full = k.map((key) => {
    for (const c of CH) if (key[c] !== undefined) state[c] = key[c] as number;
    return { f: key.f, ease: key.ease, ...state };
  });
  if (frame <= full[0].f) {
    return { ...out, ...CH.reduce((a, c) => ({ ...a, [c]: full[0][c] }), {}) };
  }
  for (let i = 0; i < full.length - 1; i++) {
    const a = full[i], b = full[i + 1];
    if (frame >= a.f && frame <= b.f) {
      const t = (frame - a.f) / Math.max(1, b.f - a.f);
      const e = (b.ease ?? ease.cam)(t);
      const o = { ...out } as Cam;
      for (const c of CH) (o as any)[c] = a[c] + (b[c] - a[c]) * e;
      return o;
    }
  }
  const last = full[full.length - 1];
  return { ...out, ...CH.reduce((a, c) => ({ ...a, [c]: last[c] }), {}) };
};

const CamCtx = createContext<Cam>({ x: 0, y: 0, z: -FOCAL, yaw: 0, pitch: 0, f: FOCAL });
export const CameraProvider: React.FC<{ cam: Cam; children: React.ReactNode }> = ({ cam, children }) => (
  <CamCtx.Provider value={cam}>{children}</CamCtx.Provider>
);
export const useCam = () => useContext(CamCtx);

/** Inverse of `project`: the world point at view-depth `d` that lands on screen (sx, sy). */
export const unproject = (sx: number, sy: number, d: number, c: Cam): Vec3 => {
  const s = c.f / d;
  const x1 = (sx - W / 2) / s;
  const y1 = (H / 2 - sy) / s;
  const cp = Math.cos(c.pitch), sp = Math.sin(c.pitch);
  const cy = Math.cos(c.yaw), sy_ = Math.sin(c.yaw);
  const z1 = d * cp + y1 * sp;
  const dy = y1 * cp - d * sp;
  const dx = x1 * cy + z1 * sy_;
  const dz = -x1 * sy_ + z1 * cy;
  return [c.x + dx, c.y + dy, c.z + dz];
};
