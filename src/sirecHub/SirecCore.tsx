import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY } from "../styles/theme";
import { SirecMark } from "./marks";
import { CENTER, T } from "./timeline";

/** SIREC's own presence: a glowing layered node with real depth, not a card.
 * A halo breathes in first, then the ring emblem settles with a light
 * overshoot, then the wordmark locks in beneath it. */
export const SirecCore: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const core = spring({ frame: frame - T.sirec.core, fps, config: { damping: 16, mass: 1.1, stiffness: 90 } });
  const ring = spring({ frame: frame - T.sirec.ring, fps, config: { damping: 13, mass: 0.7, stiffness: 130 } });
  const label = spring({ frame: frame - T.sirec.label, fps, config: { damping: 16, mass: 0.8, stiffness: 120 } });

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
          width: 460,
          height: 460,
          borderRadius: "50%",
          left: "50%",
          top: 44,
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, ${COLORS.turquoise}33, ${COLORS.magenta}14 55%, transparent 72%)`,
          filter: "blur(30px)",
          opacity: interpolate(core, [0, 1], [0, 1]),
        }}
      />

      <div
        style={{
          position: "relative",
          width: 168,
          height: 168,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `radial-gradient(circle at 35% 30%, ${COLORS.blue}, ${COLORS.navyDeep} 72%)`,
          border: `1.5px solid rgba(255,255,255,0.22)`,
          boxShadow: `0 0 90px -10px ${COLORS.glow}, inset 0 0 40px rgba(255,255,255,0.06)`,
          transform: `scale(${interpolate(ring, [0, 1], [0.6, 1])}) rotate(${interpolate(ring, [0, 1], [-30, 0])}deg)`,
          opacity: interpolate(ring, [0, 1], [0, 1]),
        }}
      >
        <SirecMark size={78} color={COLORS.white} />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          opacity: interpolate(label, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(label, [0, 1], [14, 0])}px)`,
        }}
      >
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: 900,
            fontSize: 46,
            letterSpacing: -0.5,
            color: COLORS.white,
          }}
        >
          SIREC
        </span>
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: 500,
            fontSize: 18,
            color: COLORS.lightBlue,
            opacity: 0.85,
            whiteSpace: "nowrap",
          }}
        >
          Orquestación del ciclo de riesgo de crédito
        </span>
      </div>
    </div>
  );
};
