import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, alpha } from "../theme";
import { WIDTH, HEIGHT } from "../theme";

type Shape = { x: number; y: number; size: number; kind: "circle" | "square" | "tri" | "dot"; color: string; speed: number; rot: number };

// Hand-placed, not random — deterministic across renders, and kept out of
// the center safe zone so nothing ever competes with type or hero objects.
const SHAPES: Shape[] = [
  { x: 120, y: 160, size: 46, kind: "circle", color: COLORS.blue, speed: 70, rot: 0 },
  { x: 230, y: 560, size: 22, kind: "square", color: COLORS.turquoise, speed: 95, rot: 18 },
  { x: 90, y: 860, size: 34, kind: "tri", color: COLORS.blue, speed: 60, rot: -12 },
  { x: 330, y: 940, size: 10, kind: "dot", color: COLORS.turquoise, speed: 40, rot: 0 },
  { x: 1790, y: 190, size: 30, kind: "square", color: COLORS.turquoise, speed: 80, rot: 30 },
  { x: 1840, y: 480, size: 54, kind: "circle", color: COLORS.blue, speed: 110, rot: 0 },
  { x: 1720, y: 830, size: 24, kind: "tri", color: COLORS.turquoise, speed: 65, rot: 8 },
  { x: 1860, y: 960, size: 12, kind: "dot", color: COLORS.blue, speed: 50, rot: 0 },
  { x: 560, y: 90, size: 14, kind: "dot", color: COLORS.blue, speed: 55, rot: 0 },
  { x: 1340, y: 1010, size: 18, kind: "dot", color: COLORS.turquoise, speed: 45, rot: 0 },
];

const ShapeGlyph: React.FC<{ s: Shape; rot: number }> = ({ s, rot }) => {
  const common: React.CSSProperties = { position: "absolute", width: s.size, height: s.size };
  if (s.kind === "dot") {
    return <div style={{ ...common, borderRadius: "50%", background: alpha(s.color, 0.28) }} />;
  }
  if (s.kind === "circle") {
    return (
      <div style={{ ...common, borderRadius: "50%", border: `2px solid ${alpha(s.color, 0.22)}`, transform: `rotate(${rot}deg)` }} />
    );
  }
  if (s.kind === "square") {
    return (
      <div
        style={{ ...common, borderRadius: 6, border: `2px solid ${alpha(s.color, 0.24)}`, transform: `rotate(${rot}deg)` }}
      />
    );
  }
  return (
    <svg width={s.size} height={s.size} style={{ ...common, transform: `rotate(${rot}deg)` }}>
      <polygon
        points={`${s.size / 2},2 ${s.size - 2},${s.size - 2} 2,${s.size - 2}`}
        fill="none"
        stroke={alpha(s.color, 0.24)}
        strokeWidth={2}
      />
    </svg>
  );
};

/** Unconnected geometric shapes drifting far from center — texture, not a
 * diagram. Nothing here ever links to another element. */
export const AmbientField: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {SHAPES.map((s, i) => {
        const drift = Math.sin(frame / s.speed + i) * 16;
        const driftX = Math.cos(frame / (s.speed * 1.3) + i) * 10;
        const rot = s.rot + frame * (0.08 + (i % 3) * 0.03);
        return (
          <div key={i} style={{ position: "absolute", left: s.x + driftX, top: s.y + drift, opacity }}>
            <ShapeGlyph s={s} rot={rot} />
          </div>
        );
      })}
    </>
  );
};

/** Two extremely soft tinted blooms — keeps the background from ever being
 * a flat, dead white while staying a bright editorial white overall. */
export const BgWash: React.FC = () => {
  const frame = useCurrentFrame();
  const d1 = Math.sin(frame / 180) * 40;
  const d2 = Math.cos(frame / 210) * 34;
  return (
    <AbsoluteFill style={{ background: COLORS.white }}>
      <div
        style={{
          position: "absolute",
          width: 1500,
          height: 1500,
          borderRadius: "50%",
          left: -500 + d1,
          top: -560,
          background: `radial-gradient(circle, ${alpha(COLORS.lightBlue, 0.9)}, transparent 62%)`,
          filter: "blur(40px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1300,
          height: 1300,
          borderRadius: "50%",
          right: -460 - d2,
          bottom: -520,
          background: `radial-gradient(circle, ${alpha(COLORS.lightBlue, 0.85)}, transparent 65%)`,
          filter: "blur(46px)",
        }}
      />
    </AbsoluteFill>
  );
};

/** Barely-there procedural grain — premium texture, never visible as noise
 * at normal viewing distance. */
export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        backgroundImage: noise,
        backgroundSize: "220px",
        backgroundPosition: `${(frame * 6) % 220}px ${(frame * 11) % 220}px`,
        opacity: 0.025,
        mixBlendMode: "multiply",
      }}
    />
  );
};

/** Extremely soft edge shading — depth without darkening the light theme. */
export const EdgeShade: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: "radial-gradient(ellipse at center, transparent 62%, rgba(35,52,86,0.055) 100%)",
    }}
  />
);

/** The full background stack every scene mounts once, bottom to top:
 * wash → ambient shapes → (scene content goes here) → grain → edge shade. */
export const SceneBackdrop: React.FC<{ ambientOpacity?: number }> = ({ ambientOpacity = 1 }) => (
  <AbsoluteFill>
    <BgWash />
    <AmbientField opacity={ambientOpacity} />
  </AbsoluteFill>
);

export const SceneOverlay: React.FC = () => (
  <>
    <Grain />
    <EdgeShade />
  </>
);

export const useIdleBreathe = (fromFrame = 0) => {
  const frame = useCurrentFrame();
  const t = frame - fromFrame;
  return { scale: 1 + Math.sin(t / 26) * 0.014, y: Math.sin(t / 34) * 4 };
};

export const useFps = () => useVideoConfig().fps;

export const FRAME = { WIDTH, HEIGHT };
