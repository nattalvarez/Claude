import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../styles/theme";

/** Color-grade pass — unifies the WebGL layer and DOM type into one look.
 * Renders above all scene content, below grain/vignette. */
export const Grade: React.FC<{ variant: "light" | "dark" }> = ({ variant }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill
      style={{
        backgroundColor: variant === "light" ? COLORS.blue : COLORS.turquoise,
        mixBlendMode: "soft-light",
        opacity: variant === "light" ? 0.05 : 0.14,
      }}
    />
    <AbsoluteFill
      style={{
        background:
          variant === "light"
            ? "linear-gradient(180deg, rgba(35,52,86,0.05), transparent 26%, transparent 74%, rgba(35,52,86,0.08))"
            : "linear-gradient(180deg, rgba(0,0,0,0.22), transparent 26%, transparent 72%, rgba(0,0,0,0.32))",
      }}
    />
  </AbsoluteFill>
);

/** Procedural grain, zero asset files — subtle film flicker via SVG turbulence. */
export const Grain: React.FC<{ opacity?: number; mode?: "multiply" | "overlay" }> = ({
  opacity = 0.045,
  mode = "multiply",
}) => {
  const frame = useCurrentFrame();
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        backgroundImage: noise,
        backgroundSize: "220px",
        backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`,
        opacity,
        mixBlendMode: mode,
      }}
    />
  );
};

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.22 }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `radial-gradient(ellipse at center, transparent 54%, rgba(10,18,32,${strength}) 100%)`,
    }}
  />
);
