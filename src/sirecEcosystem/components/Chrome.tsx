import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, alpha } from "../theme";
import { WIDTH, HEIGHT } from "../theme";

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
 * wash → (scene content goes here) → grain → edge shade. No decorative
 * shapes — the only geometry on screen is the content itself. */
export const SceneBackdrop: React.FC = () => (
  <AbsoluteFill>
    <BgWash />
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
