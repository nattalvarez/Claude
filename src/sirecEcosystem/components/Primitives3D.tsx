import React from "react";
import { shade } from "../theme";

type FaceDef = { key: string; transform: string; w: number; h: number; tint: number; front?: boolean };

const faceList = (w: number, h: number, d: number): FaceDef[] => [
  { key: "front", transform: `rotateY(0deg) translateZ(${d / 2}px)`, w, h, tint: 0.16, front: true },
  { key: "back", transform: `rotateY(180deg) translateZ(${d / 2}px)`, w, h, tint: -0.24 },
  { key: "right", transform: `rotateY(90deg) translateZ(${w / 2}px)`, w: d, h, tint: -0.1 },
  { key: "left", transform: `rotateY(-90deg) translateZ(${w / 2}px)`, w: d, h, tint: -0.18 },
  { key: "top", transform: `rotateX(90deg) translateZ(${h / 2}px)`, w, h: d, tint: 0.32 },
  { key: "bottom", transform: `rotateX(-90deg) translateZ(${h / 2}px)`, w, h: d, tint: -0.34 },
];

export type Solid3DProps = {
  /** face width */
  w: number;
  /** face height, defaults to w (a cube face) */
  h?: number;
  /** extrusion depth — small (e.g. 14-28) reads as a thin plate/card */
  d?: number;
  color: string;
  radius?: number;
  rx?: number;
  ry?: number;
  rz?: number;
  opacity?: number;
  /** extra glow behind the front face, in the same color */
  glow?: number;
  style?: React.CSSProperties;
};

/** A single extruded, six-face solid — the one building block behind every
 * icon and hero object in this piece. A small `d` reads as a plate or card;
 * `d === w` reads as a cube. Faces are tinted, not textured, to fake soft
 * studio lighting from the top-left without ever looking like a game asset. */
export const Solid3D: React.FC<Solid3DProps> = ({
  w,
  h = w,
  d = w,
  color,
  radius = 0,
  rx = 0,
  ry = 0,
  rz = 0,
  opacity = 1,
  glow = 0,
  style,
}) => {
  const faces = faceList(w, h, d);
  return (
    <div
      style={{
        position: "relative",
        width: w,
        height: h,
        transformStyle: "preserve-3d",
        transform: `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`,
        opacity,
        ...style,
      }}
    >
      {glow > 0 && (
        <div
          style={{
            position: "absolute",
            inset: -w * 0.3,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${color}${Math.round(glow * 60)
              .toString(16)
              .padStart(2, "0")}, transparent 68%)`,
            filter: "blur(18px)",
            transform: "translateZ(-1px)",
          }}
        />
      )}
      {faces.map((f) => (
        <div
          key={f.key}
          style={{
            position: "absolute",
            left: (w - f.w) / 2,
            top: (h - f.h) / 2,
            width: f.w,
            height: f.h,
            background: shade(color, f.tint),
            transform: f.transform,
            backfaceVisibility: "hidden",
            borderRadius: f.front ? radius : radius > 0 ? Math.min(radius, 4) : 0,
            boxShadow: f.front ? "inset 0 1px 0 rgba(255,255,255,0.30)" : undefined,
          }}
        />
      ))}
    </div>
  );
};

/** Soft, elliptical contact shadow — grounds a floating 3D piece without a
 * hard drop shadow. */
export const GroundShadow: React.FC<{ w: number; h?: number; opacity?: number; style?: React.CSSProperties }> = ({
  w,
  h = w * 0.32,
  opacity = 0.16,
  style,
}) => (
  <div
    style={{
      position: "absolute",
      width: w,
      height: h,
      left: "50%",
      borderRadius: "50%",
      transform: "translateX(-50%)",
      background: "radial-gradient(ellipse, rgba(35,52,86,0.9), transparent 72%)",
      opacity,
      filter: "blur(6px)",
      ...style,
    }}
  />
);

/** A perspective stage — wrap any 3D composition in this so child `Solid3D`
 * pieces render with real depth instead of flattening. */
export const Stage3D: React.FC<{ perspective?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({
  perspective = 1400,
  style,
  children,
}) => (
  <div style={{ position: "relative", perspective, transformStyle: "preserve-3d", ...style }}>{children}</div>
);
