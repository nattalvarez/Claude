import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Roboto";
import { COLORS } from "../styles/theme";
import { Background } from "./Background";
import { World } from "./World";

loadFont("normal", {
  weights: ["300", "400", "500", "700", "800", "900"],
  subsets: ["latin", "latin-ext"],
  ignoreTooManyRequestsWarning: true,
});

/** Above content, below grain: a whisper of grade for depth. */
const Grade: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: "linear-gradient(180deg, rgba(0,0,0,0.18), transparent 26%, transparent 76%, rgba(0,0,0,0.28))",
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
      background: `radial-gradient(ellipse at center, transparent 55%, ${COLORS.navyDeep}CC 100%)`,
    }}
  />
);

/** SIREC — orchestration hub. 30s, one continuous camera move: title →
 * SIREC core → six management channels built one at a time → SIREC Agent
 * Fabric emerging above → Agentes IA → the whole ecosystem pulled back into
 * view. Dark, corporate-technological, never sci-fi. */
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
