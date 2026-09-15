import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../styles/theme";

/**
 * The shared five-layer stack (bg mesh → scene content → grade → grain → vignette),
 * adapted from the motion-graphics skill's dark-theme defaults down to opacities that
 * work on SIREC's white/navy/turquoise palette — the brief calls for "mucho espacio
 * negativo" and a clean premium look, so every layer here stays close to invisible on
 * its own and only reads as texture in aggregate.
 */

/** Bottom layer: soft drifting color blobs behind every scene, instead of a flat white. */
export const BgMesh: React.FC = () => {
  const frame = useCurrentFrame();
  const d1 = Math.sin(frame / 620) * 90;
  const d2 = Math.cos(frame / 780) * 70;
  const d3 = Math.sin(frame / 900 + 1.4) * 60;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.offWhite }}>
      <div
        style={{
          position: "absolute",
          width: 1500,
          height: 1500,
          borderRadius: "50%",
          top: -560,
          left: -380 + d1,
          filter: "blur(120px)",
          background: `radial-gradient(circle, ${COLORS.blue}0A, transparent 62%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1300,
          height: 1300,
          borderRadius: "50%",
          bottom: -520,
          right: -320 - d2,
          filter: "blur(130px)",
          background: `radial-gradient(circle, ${COLORS.turquoise}08, transparent 65%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: "50%",
          top: "38%",
          left: "50%",
          transform: `translate(-50%, -50%) translateX(${d3}px)`,
          filter: "blur(150px)",
          background: `radial-gradient(circle, ${COLORS.navy}05, transparent 70%)`,
        }}
      />
    </AbsoluteFill>
  );
};

/** Above content: a whisper-soft grade — a touch of ink at the edges for depth,
 * nowhere near strong enough to affect text contrast. */
export const Grade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, rgba(35,52,86,0.035), transparent 22%, transparent 78%, rgba(35,52,86,0.05))",
      }}
    />
  </AbsoluteFill>
);

/** Procedural film grain, no asset file — multiply blend reads as fine texture on white. */
export const Grain: React.FC = () => {
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
        opacity: 0.025,
        mixBlendMode: "multiply",
      }}
    />
  );
};

/** Topmost layer: barely-there corner darkening, just enough to focus the eye. */
export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: "radial-gradient(ellipse at center, transparent 62%, rgba(35,52,86,0.07) 100%)",
    }}
  />
);
