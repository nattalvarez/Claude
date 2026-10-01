import React from "react";
import { useCurrentFrame } from "remotion";
import { Dot3, Poly3, Solid3, boxFaces, octaFaces, ringPts, rectPts } from "../engine/primitives";
import { Vec3, clamp, lerp, ramp, rng, rotY } from "../engine/math";
import { C, ease, pinkA } from "../theme";

import { REL } from "./layout";
const POS = REL;

type EntityBase = { a?: number; pos?: Vec3; opacity?: number; ghost?: number; sync?: boolean };

// ───────────────────────── CLIENTE · a single dark point ─────────────────────────
export const Client: React.FC<EntityBase & { pulse?: number }> = ({ a = 1, pos = POS.client, opacity = 1, ghost = 0, pulse = 0, sync = false }) => {
  const frame = useCurrentFrame();
  const e = ease.out(clamp(a));
  if (e <= 0.002) return null;
  const y = 78 + Math.sin(sync ? frame / 30 : frame / 28) * 4 + (1 - e) * 60;
  const c: Vec3 = [pos[0], y, pos[2]];
  const r = 38 * e;
  return (
    <>
      <Poly3 pts={ringPts([pos[0], 0, pos[2]], 86 * e)} stroke={C.g400} sw={1} opacity={0.7 * e * opacity} />
      {pulse > 0.01 && <Poly3 pts={ringPts([pos[0], 0, pos[2]], 86 + pulse * 80)} stroke={C.pink} sw={1.2} opacity={(1 - pulse) * 0.8 * opacity} />}
      <Dot3 p={c} r={r} fill={C.ink} opacity={e * opacity * (1 - ghost * 0.85)} stroke={ghost > 0 ? C.ink : undefined} />
      <Dot3 p={[c[0] - r * 0.36, c[1] + r * 0.4, c[2] - r * 0.4]} r={r * 0.2} fill="#FFFFFF" opacity={0.22 * e * opacity} />
    </>
  );
};

// ───────────────────────── MEDIADOR · a faceted prism ─────────────────────────
export const Mediator: React.FC<EntityBase & { spin?: number; pulse?: number }> = ({ a = 1, pos = POS.mediator, opacity = 1, spin = 0, pulse = 0, sync = false }) => {
  const frame = useCurrentFrame();
  const e = ease.out(clamp(a));
  if (e <= 0.002) return null;
  const y = 140 + Math.sin(sync ? frame / 30 : frame / 34 + 1) * 5 + (1 - e) * 50;
  const yaw = frame * 0.011 + spin;
  const r = 76 * e;
  return (
    <>
      <Poly3 pts={rectPts([pos[0], 0, pos[2]], 150 * e, 150 * e, yaw + Math.PI / 4)} stroke={C.g400} sw={1} opacity={0.7 * e * opacity} />
      {pulse > 0.01 && <Poly3 pts={ringPts([pos[0], 0, pos[2]], 90 + pulse * 90)} stroke={C.pink} sw={1.2} opacity={(1 - pulse) * 0.8 * opacity} />}
      <Solid3 faces={octaFaces([pos[0], y, pos[2]], r, yaw)} lo="#9B9B98" hi="#FAFAF8" opacity={opacity} />
    </>
  );
};

// ───────────────────────── ASEGURADORA · a layered slab ─────────────────────────
export const Insurer: React.FC<EntityBase & { gap?: number; seal?: number; plates?: number; scale?: number; yaw?: number; pulse?: number }> = ({
  a = 1, pos = POS.insurer, opacity = 1, gap = 14, seal = 0, plates = 4, scale = 1, yaw = 0, pulse = 0,
}) => {
  const frame = useCurrentFrame();
  const W_ = 300 * scale, D_ = 190 * scale, T = 22 * scale;
  const items: React.ReactNode[] = [];
  const fp = ramp(a, 0, 0.5, ease.out);
  for (let i = 0; i < plates; i++) {
    const pi = ease.out(clamp(a * 1.6 - i * 0.18));
    if (pi <= 0.002) continue;
    const gy = gap * scale;
    const y = T / 2 + i * (T + gy) + (1 - pi) * -50 + Math.sin(frame / 40 + i) * (gy > 4 ? 1.2 : 0);
    const c: Vec3 = [pos[0], y, pos[2]];
    items.push(
      <Solid3 key={i} faces={boxFaces(c, W_ * (0.9 + 0.1 * pi), T, D_ * (0.9 + 0.1 * pi), yaw)} lo="#A2A29F" hi="#FFFFFF" opacity={opacity * pi} />,
    );
  }
  const topY = T / 2 + (plates - 1) * (T + gap * scale) + T / 2;
  return (
    <>
      <Poly3 pts={rectPts([pos[0], 0, pos[2]], (W_ + 70) * fp, (D_ + 60) * fp, yaw)} stroke={C.g400} sw={1} opacity={0.7 * fp * opacity} />
      {pulse > 0.01 && <Poly3 pts={rectPts([pos[0], 0, pos[2]], (W_ + 70) + pulse * 120, (D_ + 60) + pulse * 120, yaw)} stroke={C.pink} sw={1.2} opacity={(1 - pulse) * 0.8 * opacity} />}
      {items}
      {seal > 0.01 && (
        <Poly3 pts={rectPts([pos[0], topY + 0.5, pos[2]], W_, D_, yaw)} stroke={C.pink} sw={2} opacity={seal * opacity} />
      )}
    </>
  );
};

// ───────────────────────── AGENTE · a distributed entity ─────────────────────────
/**
 * Not a body: a flock of points that behaves as one. Fibonacci shell that
 * breathes and slowly turns; `assemble` gathers the points from far away.
 */
export const AgentSwarm: React.FC<{
  center: Vec3; R?: number; assemble?: number; count?: number; color?: string;
  opacity?: number; size?: number; seed?: number; lean?: Vec3; spread?: number;
}> = ({ center, R = 104, assemble = 1, count = 30, color = C.pink, opacity = 1, size = 6.4, seed = 7, lean, spread = 1 }) => {
  const frame = useCurrentFrame();
  const rand = rng(seed);
  const dots: React.ReactNode[] = [];
  for (let i = 0; i < count; i++) {
    const yy = 1 - (2 * (i + 0.5)) / count;
    const rr = Math.sqrt(1 - yy * yy);
    const phi = i * 2.399963;
    const breathe = 0.8 + 0.2 * Math.sin(i * 1.7 + frame / 34);
    let p: Vec3 = [Math.cos(phi) * rr, yy, Math.sin(phi) * rr];
    p = rotY(p, frame * 0.012);
    const home: Vec3 = [center[0] + p[0] * R * breathe * spread, center[1] + p[1] * R * breathe * spread * 0.9, center[2] + p[2] * R * breathe * spread];
    const far: Vec3 = [center[0] + (rand() - 0.5) * 2800, center[1] + (rand() - 0.2) * 900, center[2] + (rand() - 0.3) * 1600];
    const t = ease.soft(clamp(assemble * 1.6 - (i / count) * 0.6));
    const lw = lean ? clamp((i % 7) / 7) * 0.5 : 0;
    const pos: Vec3 = [
      lerp(far[0], home[0], t) + (lean ? lean[0] * lw : 0),
      lerp(far[1], home[1], t) + (lean ? lean[1] * lw : 0),
      lerp(far[2], home[2], t) + (lean ? lean[2] * lw : 0),
    ];
    const depthShade = 0.65 + 0.35 * ((p[2] + 1) / 2);
    dots.push(<Dot3 key={i} p={pos} r={size * (0.75 + 0.5 * (1 - (p[2] + 1) / 2))} fill={color} opacity={opacity * depthShade * Math.min(1, t * 3 + 0.0)} />);
  }
  return <>{dots}</>;
};
