import React from "react";
import { W, H } from "../config";
import { project, useCam, Cam } from "./camera";
import { Vec3, rotY, add3, dot3, sub3, mixHex, clamp } from "./math";

/** Full-frame SVG layer. Scenes compose several (far / mid / near) so HTML text can sit between. */
export const Layer: React.FC<{ children: React.ReactNode; blur?: number; opacity?: number }> = ({
  children, blur = 0, opacity = 1,
}) => (
  <svg
    width={W} height={H} viewBox={`0 0 ${W} ${H}`}
    style={{ position: "absolute", inset: 0, overflow: "visible", opacity, filter: blur > 0.05 ? `blur(${blur}px)` : undefined }}
  >
    {children}
  </svg>
);

type DotProps = {
  p: Vec3; r: number; fill: string; opacity?: number;
  stroke?: string; sw?: number; minR?: number; blur?: number;
};
/** A sphere-ish point: radius given in world units, scaled by perspective. */
export const Dot3: React.FC<DotProps> = ({ p, r, fill, opacity = 1, stroke, sw = 1, minR = 0.6, blur }) => {
  const cam = useCam();
  const q = project(p, cam);
  if (!q.vis || opacity <= 0.003) return null;
  const rr = Math.max(minR, r * q.s);
  return (
    <circle
      cx={q.x} cy={q.y} r={rr} fill={fill} opacity={opacity}
      stroke={stroke} strokeWidth={sw}
      style={blur ? { filter: `blur(${blur}px)` } : undefined}
    />
  );
};

type PolyProps = {
  pts: Vec3[]; stroke?: string; sw?: number; fill?: string; opacity?: number;
  closed?: boolean; dash?: string; cap?: "round" | "butt"; worldSw?: boolean;
};
/** Projected polyline/polygon. Stroke is constant in px unless worldSw. */
export const Poly3: React.FC<PolyProps> = ({
  pts, stroke, sw = 1, fill = "none", opacity = 1, closed, dash, cap = "round", worldSw,
}) => {
  const cam = useCam();
  if (opacity <= 0.003 || pts.length < 2) return null;
  const qs = pts.map((p) => project(p, cam));
  if (qs.every((q) => !q.vis)) return null;
  const d = qs.filter((q) => q.vis).map((q, i) => `${i ? "L" : "M"}${q.x.toFixed(1)} ${q.y.toFixed(1)}`).join("") + (closed ? "Z" : "");
  const w = worldSw ? sw * (qs.reduce((a, q) => a + q.s, 0) / qs.length) : sw;
  return (
    <path d={d} fill={fill} stroke={stroke} strokeWidth={w} opacity={opacity}
      strokeDasharray={dash} strokeLinecap={cap} strokeLinejoin="round" />
  );
};

/** Ring lying on a horizontal plane (footprints, thresholds). */
export const ringPts = (c: Vec3, r: number, n = 40): Vec3[] =>
  Array.from({ length: n + 1 }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return [c[0] + Math.cos(a) * r, c[1], c[2] + Math.sin(a) * r] as Vec3;
  });

export const rectPts = (c: Vec3, w: number, d: number, yaw = 0): Vec3[] => {
  const pts: Vec3[] = [[-w / 2, 0, -d / 2], [w / 2, 0, -d / 2], [w / 2, 0, d / 2], [-w / 2, 0, d / 2], [-w / 2, 0, -d / 2]];
  return pts.map((p) => add3(rotY(p, yaw), c));
};

// ───────────── flat-shaded solids (paper-model look: no gradients) ─────────────
export type Face = { pts: Vec3[]; n: Vec3 };
const LIGHT: Vec3 = (() => { const v: Vec3 = [-0.45, 0.8, -0.4]; const m = Math.hypot(...v); return [v[0] / m, v[1] / m, v[2] / m]; })();

export const boxFaces = (c: Vec3, w: number, h: number, d: number, yaw = 0): Face[] => {
  const hw = w / 2, hh = h / 2, hd = d / 2;
  const v = (x: number, y: number, z: number): Vec3 => add3(rotY([x, y, z], yaw), c);
  const nrm = (n: Vec3): Vec3 => rotY(n, yaw);
  return [
    { pts: [v(-hw, hh, -hd), v(hw, hh, -hd), v(hw, hh, hd), v(-hw, hh, hd)], n: nrm([0, 1, 0]) },
    { pts: [v(-hw, -hh, -hd), v(-hw, -hh, hd), v(hw, -hh, hd), v(hw, -hh, -hd)], n: nrm([0, -1, 0]) },
    { pts: [v(-hw, -hh, -hd), v(hw, -hh, -hd), v(hw, hh, -hd), v(-hw, hh, -hd)], n: nrm([0, 0, -1]) },
    { pts: [v(-hw, -hh, hd), v(-hw, hh, hd), v(hw, hh, hd), v(hw, -hh, hd)], n: nrm([0, 0, 1]) },
    { pts: [v(-hw, -hh, -hd), v(-hw, hh, -hd), v(-hw, hh, hd), v(-hw, -hh, hd)], n: nrm([-1, 0, 0]) },
    { pts: [v(hw, -hh, -hd), v(hw, -hh, hd), v(hw, hh, hd), v(hw, hh, -hd)], n: nrm([1, 0, 0]) },
  ];
};

export const octaFaces = (c: Vec3, r: number, yaw = 0, sy = 1.25): Face[] => {
  const T: Vec3 = [0, r * sy, 0], B: Vec3 = [0, -r * sy, 0];
  const ring: Vec3[] = [[r, 0, 0], [0, 0, r], [-r, 0, 0], [0, 0, -r]];
  const w = (p: Vec3) => add3(rotY(p, yaw), c);
  const faces: Face[] = [];
  for (let i = 0; i < 4; i++) {
    const a = ring[i], b = ring[(i + 1) % 4];
    for (const apex of [T, B]) {
      const pts = apex === T ? [apex, b, a] : [apex, a, b];
      const e1 = sub3(pts[1], pts[0]), e2 = sub3(pts[2], pts[0]);
      const n: Vec3 = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
      const m = Math.hypot(...n) || 1;
      faces.push({ pts: pts.map(w), n: rotY([n[0] / m, n[1] / m, n[2] / m], yaw) });
    }
  }
  return faces;
};

type SolidProps = {
  faces: Face[]; lo?: string; hi?: string; opacity?: number;
  edge?: string; edgeW?: number; tint?: { color: string; amt: number };
};
export const Solid3: React.FC<SolidProps> = ({
  faces, lo = "#CFCFCC", hi = "#FFFFFF", opacity = 1, edge = "#FFFFFF", edgeW = 1, tint,
}) => {
  const cam = useCam();
  if (opacity <= 0.003) return null;
  const cp: Vec3 = [cam.x, cam.y, cam.z];
  const vis = faces
    .map((f) => {
      const cen: Vec3 = [
        f.pts.reduce((a, p) => a + p[0], 0) / f.pts.length,
        f.pts.reduce((a, p) => a + p[1], 0) / f.pts.length,
        f.pts.reduce((a, p) => a + p[2], 0) / f.pts.length,
      ];
      return { f, cen, facing: dot3(f.n, sub3(cp, cen)) > 0 };
    })
    .filter((x) => x.facing);
  vis.sort((a, b) => project(b.cen, cam).d - project(a.cen, cam).d);
  return (
    <g opacity={opacity}>
      {vis.map(({ f }, i) => {
        const qs = f.pts.map((p) => project(p, cam));
        if (qs.some((q) => !q.vis)) return null;
        const b = clamp(0.35 + 0.65 * Math.max(0, dot3(f.n, LIGHT)));
        let col = mixHex(lo, hi, b);
        return (
          <polygon key={i}
            points={qs.map((q) => `${q.x.toFixed(1)},${q.y.toFixed(1)}`).join(" ")}
            fill={col} stroke={edge} strokeWidth={edgeW} strokeLinejoin="round" />
        );
      })}
    </g>
  );
};

/** Depth-sort helper: render children back-to-front by projected depth of `at`. */
export const sortByDepth = (cam: Cam, items: { at: Vec3; node: React.ReactNode; key: string }[]) =>
  [...items]
    .sort((a, b) => project(b.at, cam).d - project(a.at, cam).d)
    .map((it) => <React.Fragment key={it.key}>{it.node}</React.Fragment>);
