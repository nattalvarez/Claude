import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadRobotoLocally } from "../shared/loadRobotoLocally";
import { COLORS } from "../styles/theme";
import { Background } from "./Background";
import { World } from "./World";

loadRobotoLocally();

/** Above content, below grain: a whisper of grade for depth. */
const Grade: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `linear-gradient(180deg, ${COLORS.navy}14, transparent 26%, transparent 76%, ${COLORS.navy}1F)`,
    }}
  />
);

const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const noise =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        backgroundImage: noise,
        backgroundSize: "220px",
        backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`,
        opacity: 0.035,
        mixBlendMode: "overlay",
      }}
    />
  );
};

const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `radial-gradient(ellipse at center, transparent 60%, ${COLORS.navy}22 100%)`,
    }}
  />
);

/** SIREC — orchestration hub. One continuous camera move: title → SIREC
 * core → six management channels visited one at a time (push in, read,
 * return to SIREC) → SIREC Agent Fabric emerging above → the whole
 * ecosystem pulled back into view. Bright, corporate-technological, never
 * sci-fi. */
export const SirecHubMotion: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background />
      <World />
      <Grade />
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};
