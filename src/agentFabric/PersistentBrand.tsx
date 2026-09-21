import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY } from "../styles/theme";
import { OrbitMark } from "./marks";
import { T } from "./timeline";

const IN_FROM = T.titleExit - 6; // crossfades in as the big hero title fades out

/** A small, fixed screen-space lockup — "SIREC Agent Fabric" never leaves the
 * frame after the opening beat, even while the camera travels through the
 * rest of the architecture. Lives outside the world/camera transform. */
export const PersistentBrand: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - IN_FROM, fps, config: { damping: 20, mass: 0.9, stiffness: 100 } });
  const breathe = 1 + Math.sin(frame / 70) * 0.015 * Math.min(1, p);

  if (p <= 0.001) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: 56,
        top: 48,
        display: "flex",
        alignItems: "center",
        gap: 14,
        opacity: interpolate(p, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(p, [0, 1], [-14, 0])}px) scale(${breathe})`,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 13,
          background: COLORS.navy,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 12px 28px -10px ${COLORS.glow}`,
        }}
      >
        <OrbitMark size={22} color={COLORS.turquoise} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.05 }}>
        <span style={{ fontFamily: FONT_FAMILY, fontWeight: 800, fontSize: 22, color: COLORS.navy, letterSpacing: -0.3 }}>
          SIREC <span style={{ color: COLORS.turquoise }}>Agent Fabric</span>
        </span>
      </div>
    </div>
  );
};
