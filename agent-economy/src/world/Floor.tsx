import React from "react";
import { useCurrentFrame } from "remotion";
import { project, useCam } from "../engine/camera";
import { clamp, ramp, mixHex, lerp } from "../engine/math";
import { ease, C } from "../theme";
import { Layer } from "../engine/primitives";
import { W, H } from "../config";

/** A travelling disturbance in the floor: the space "reacts" to an event. */
export type Ripple = {
  x: number; z: number; f0: number;
  speed: number; // world units / frame
  width: number; amp: number; life: number;
  pink?: number; // 0..1 how much of the crest is lit in the accent
};

type FloorProps = {
  ripples?: Ripple[];
  opacity?: number;
  /** 0 = ink-grey dots, 1 = white dots (when the pink surface sits behind) */
  inverse?: number;
  appear?: { f0: number; dur: number; origin: [number, number]; reach: number };
  /** limit lattice extent (units) around an optional centre */
  extent?: { x0: number; x1: number; z0: number; z1: number };
  pinkBase?: number; // constant faint pink wash on dots (S12)
};

const SP = 120;
const XI = Array.from({ length: 59 }, (_, i) => i - 29);
const ZS = Array.from({ length: 34 }, (_, i) => -960 + i * SP);

/**
 * The stage: a sparse dot lattice that gives every camera move something to
 * parallax against. It is also the surface that reacts to events.
 */
export const Floor: React.FC<FloorProps> = ({ ripples = [], opacity = 1, inverse = 0, appear, extent, pinkBase = 0 }) => {
  const frame = useCurrentFrame();
  const cam = useCam();
  if (opacity <= 0.003) return null;
  const live = ripples.filter((r) => frame >= r.f0 && frame <= r.f0 + r.life);
  const out: React.ReactNode[] = [];
  const base = mixHex(C.g400, "#FFFFFF", inverse);
  const bx = Math.round(cam.x / SP) * SP;
  for (const xi of XI) {
    const x = bx + xi * SP;
    if (extent && (x < extent.x0 || x > extent.x1)) continue;
    for (const z of ZS) {
      if (extent && (z < extent.z0 || z > extent.z1)) continue;
      let y = 0, hit = 0, pk = 0;
      for (const r of live) {
        const age = frame - r.f0;
        const rad = age * r.speed;
        const dist = Math.hypot(x - r.x, z - r.z);
        const u = (dist - rad) / r.width;
        const shape = Math.exp(-u * u) * (1 - ramp(frame, r.f0 + r.life * 0.45, r.f0 + r.life, ease.inOut));
        y += r.amp * shape; hit = Math.max(hit, shape); pk = Math.max(pk, shape * (r.pink ?? 0));
      }
      const q = project([x, y, z], cam);
      if (!q.vis || q.x < -60 || q.x > W + 60 || q.y < -60 || q.y > H + 60) continue;
      let a = 1 - clamp((q.d - 1700) / 3600);
      a *= clamp((q.d - 120) / 400);
      if (appear) {
        const dist = Math.hypot(x - appear.origin[0], z - appear.origin[1]);
        const reach = ramp(frame, appear.f0, appear.f0 + appear.dur, ease.soft) * appear.reach;
        a *= clamp((reach - dist) / 260);
      }
      if (a <= 0.01) continue;
      const rr = clamp(1.55 * q.s, 0.8, 3.0) * (1 + hit * 1.1);
      const baseOp = lerp(0.62, 0.5, inverse) * a;
      out.push(
        <circle key={`${x}_${z}`} cx={q.x} cy={q.y} r={rr} fill={base} opacity={Math.min(1, baseOp + hit * 0.5 * a)} />,
      );
      const pa = Math.max(pk * pk, pinkBase * 0.5 * (1 - inverse));
      if (pa > 0.05) out.push(<circle key={`p${x}_${z}`} cx={q.x} cy={q.y} r={rr * 1.05} fill={C.pink} opacity={Math.min(0.85, pa) * a} />);
    }
  }
  return <Layer opacity={opacity}>{out}</Layer>;
};
