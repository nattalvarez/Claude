import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile } from "remotion";
import { COLORS } from "../styles/theme";
import { CENTER, T } from "./timeline";

/** SIREC's own presence: a glowing layered node with real depth, not a card.
 * A halo breathes in first, then the badge — mark and wordmark together as
 * one logo asset — settles with a light overshoot. */
export const SirecCore: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const core = spring({ frame: frame - T.sirec.core, fps, config: { damping: 16, mass: 1.1, stiffness: 90 } });
  const ring = spring({ frame: frame - T.sirec.ring, fps, config: { damping: 13, mass: 0.7, stiffness: 130 } });

  if (core <= 0.001) return null;

  const breathe = 1 + Math.sin((frame - T.sirec.core) / 40) * 0.02 * Math.min(1, core);
  const drift = Math.sin(frame / 90) * 4;

  return (
    <div
      style={{
        position: "absolute",
        left: CENTER.x,
        top: CENTER.y,
        transform: `translate(-50%, -50%) scale(${core * breathe}) translateY(${drift}px)`,
        opacity: interpolate(core, [0, 1], [0, 1]),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 22,
      }}
    >
      {/* outer halo, well behind the emblem */}
      <div
        style={{
          position: "absolute",
          width: 520,
          height: 520,
          borderRadius: "50%",
          left: "50%",
          top: 50,
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, ${COLORS.turquoise}3D, ${COLORS.blue}16 55%, transparent 72%)`,
          filter: "blur(30px)",
          opacity: interpolate(core, [0, 1], [0, 1]),
        }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "30px 34px",
          borderRadius: 32,
          background: `radial-gradient(circle at 35% 30%, ${COLORS.blue}, ${COLORS.navy} 72%)`,
          border: `1.5px solid rgba(255,255,255,0.22)`,
          boxShadow: `0 24px 60px -14px ${COLORS.navyShadow}, 0 0 90px -18px ${COLORS.glow}, inset 0 0 44px rgba(255,255,255,0.08)`,
          transform: `scale(${interpolate(ring, [0, 1], [0.6, 1])}) rotate(${interpolate(ring, [0, 1], [-30, 0])}deg)`,
          opacity: interpolate(ring, [0, 1], [0, 1]),
        }}
      >
        <Img src={staticFile("sirecHub/sirec-logo-white.png")} style={{ width: 190, height: "auto" }} />
      </div>
    </div>
  );
};
