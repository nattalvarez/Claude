import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT, ease, WEIGHT } from "../theme";
import { ramp } from "./math";
import { project, useCam } from "./camera";
import { Vec3 } from "./math";

export type Seg = {
  t: string;
  w?: number;
  color?: string;
  size?: number; // multiplier of the block size
  /** per-frame style override (e.g. a keyword that settles / dims). */
  dyn?: (frame: number) => React.CSSProperties;
};
export type Line = string | Seg[];

type BlockProps = {
  lines: Line[];
  size: number;
  start: number; // frame the first line begins rising
  exit?: number; // frame the exit begins
  weight?: number;
  color?: string;
  lead?: number; // line-height multiplier
  track?: number; // letter-spacing (em)
  stagger?: number;
  dur?: number;
  mode?: "rise" | "wipe";
  align?: "left" | "right";
  style?: React.CSSProperties;
  /** extra vertical offset per line, px (for editorial indents) */
  indent?: number[];
};

/**
 * Editorial text block. Lines rise out of a mask (or wipe in) with expo-out
 * easing, staggered; they leave faster than they arrive. Same mechanism
 * everywhere — hierarchy comes from scale, weight, position and colour.
 */
export const TextBlock: React.FC<BlockProps> = ({
  lines, size, start, exit, weight = WEIGHT.light, color = C.ink, lead = 1.08,
  track = -0.02, stagger = 8, dur = 30, mode = "rise", align = "left", style, indent,
}) => {
  const frame = useCurrentFrame();
  // legibility: hairline weights only at display scale; body-size type never goes below Regular
  if (size < 120 && weight < WEIGHT.regular) weight = WEIGHT.regular;
  if (frame < start - 1) return null;
  if (exit !== undefined && frame > exit + 40) return null;
  return (
    <div
      style={{
        fontFamily: FONT, fontSize: size, fontWeight: weight, color,
        lineHeight: lead, letterSpacing: `${track}em`,
        textAlign: align, whiteSpace: "pre", ...style,
      }}
    >
      {lines.map((ln, i) => {
        const s0 = start + i * stagger;
        const p = ramp(frame, s0, s0 + dur, ease.out);
        const q = exit === undefined ? 0 : ramp(frame, exit + i * 2, exit + i * 2 + 14, ease.in);
        const segs: Seg[] = typeof ln === "string" ? [{ t: ln }] : ln;
        const ty = (1 - p) * 108 - q * 46;
        const op = Math.min(1, p * 2.4) * (1 - q);
        const wipe = mode === "wipe";
        return (
          <div
            key={i}
            style={{
              overflow: wipe ? "visible" : "hidden",
              padding: "0.16em 0.06em 0.2em",
              margin: "-0.16em -0.06em -0.2em",
              marginLeft: indent ? `${(indent[i] ?? 0) - 0.06 * size}px` : undefined,
            }}
          >
            <div
              style={{
                transform: wipe ? `translateX(${(1 - p) * -36 - q * 20}px)` : `translateY(${ty}%)`,
                opacity: op,
                clipPath: wipe ? `inset(-10% ${(1 - p) * 100}% -10% -10%)` : undefined,
                willChange: "transform",
              }}
            >
              {segs.map((sg, j) => (
                <span
                  key={j}
                  style={{
                    fontWeight: sg.w ?? undefined,
                    color: sg.color ?? undefined,
                    fontSize: sg.size ? sg.size * size : undefined,
                    ...(sg.dyn ? sg.dyn(frame) : {}),
                  }}
                >
                  {sg.t}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** Screen-space frame for a TextBlock (respects safe areas by construction). */
export const Screen: React.FC<{ children: React.ReactNode; style: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ position: "absolute", ...style }}>{children}</div>
);

// ───────── text living inside the 3D world (planar homography → CSS matrix3d) ─────────
const homography = (q: { x: number; y: number }[], w: number, h: number) => {
  const [p0, p1, p2, p3] = q;
  const dx1 = p1.x - p2.x, dx2 = p3.x - p2.x, dx3 = p0.x - p1.x + p2.x - p3.x;
  const dy1 = p1.y - p2.y, dy2 = p3.y - p2.y, dy3 = p0.y - p1.y + p2.y - p3.y;
  let a: number, b: number, d: number, e: number, g: number, hh: number;
  if (Math.abs(dx3) < 1e-9 && Math.abs(dy3) < 1e-9) {
    a = p1.x - p0.x; b = p3.x - p0.x; d = p1.y - p0.y; e = p3.y - p0.y; g = 0; hh = 0;
  } else {
    const den = dx1 * dy2 - dy1 * dx2;
    g = (dx3 * dy2 - dy3 * dx2) / den;
    hh = (dx1 * dy3 - dy1 * dx3) / den;
    a = p1.x - p0.x + g * p1.x; b = p3.x - p0.x + hh * p3.x;
    d = p1.y - p0.y + g * p1.y; e = p3.y - p0.y + hh * p3.y;
  }
  return `matrix3d(${a / w},${d / w},0,${g / w},${b / h},${e / h},0,${hh / h},0,0,1,0,${p0.x},${p0.y},0,1)`;
};

/**
 * A text plane anchored in world space. `pos` is its top-left corner, w×h are
 * both CSS px of the content box and world units. Perspective, parallax and
 * scale come from the camera, so type is part of the space, not an overlay.
 */
export const PlaneText: React.FC<{
  pos: Vec3; w: number; h: number; yaw?: number; opacity?: number; children: React.ReactNode; blur?: number;
  /** true (default): plane stays perpendicular to the view axis → no keystone, legible; scale/parallax still come from depth. */
  facing?: boolean;
}> = ({ pos, w, h, yaw = 0, opacity = 1, children, blur = 0, facing = true }) => {
  const cam = useCam();
  const cs = Math.cos(yaw), sn = Math.sin(yaw);
  const ccy = Math.cos(cam.yaw), csy = Math.sin(cam.yaw), csp = Math.sin(cam.pitch), ccp = Math.cos(cam.pitch);
  const right: Vec3 = [ccy, 0, -csy];
  const upv: Vec3 = [csp * csy, ccp, csp * ccy];
  const corner = (u: number, v: number): Vec3 =>
    facing
      ? [pos[0] + right[0] * u - upv[0] * v, pos[1] + right[1] * u - upv[1] * v, pos[2] + right[2] * u - upv[2] * v]
      : [pos[0] + u * cs, pos[1] - v, pos[2] - u * sn];
  const pts = [corner(0, 0), corner(w, 0), corner(w, h), corner(0, h)].map((p) => project(p, cam));
  if (pts.some((p) => !p.vis) || opacity <= 0.003) return null;
  return (
    <div
      style={{
        position: "absolute", left: 0, top: 0, width: w, height: h,
        transformOrigin: "0 0", transform: homography(pts, w, h),
        opacity, filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
      }}
    >
      {children}
    </div>
  );
};
