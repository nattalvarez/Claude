import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY } from "../styles/theme";
import { AgentFabricMark } from "./marks";
import { AGENT_FABRIC_POS, T } from "./timeline";

/** The layer that emerges from SIREC rather than sitting beside it — built
 * container-first like the core, but narrower and cooler-toned (magenta
 * instead of turquoise) so it reads as a distinct stratum above SIREC. */
export const AgentFabricLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const container = spring({ frame: frame - T.agentFabric.container, fps, config: { damping: 15, mass: 1, stiffness: 95 } });
  const title = spring({ frame: frame - T.agentFabric.title, fps, config: { damping: 16, mass: 0.8, stiffness: 120 } });
  const subtitle = spring({ frame: frame - T.agentFabric.subtitle, fps, config: { damping: 17, mass: 0.8, stiffness: 120 } });

  if (container <= 0.001) return null;

  const breathe = 1 + Math.sin((frame - T.agentFabric.container) / 44) * 0.02 * Math.min(1, container);

  return (
    <div
      style={{
        position: "absolute",
        left: AGENT_FABRIC_POS.x,
        top: AGENT_FABRIC_POS.y,
        transform: `translate(-50%, -50%) scale(${container * breathe})`,
        opacity: interpolate(container, [0, 1], [0, 1]),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 380,
          height: 380,
          borderRadius: "50%",
          left: "50%",
          top: 40,
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, ${COLORS.magenta}30, transparent 68%)`,
          filter: "blur(24px)",
        }}
      />

      <div
        style={{
          position: "relative",
          width: 128,
          height: 128,
          borderRadius: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(155deg, ${COLORS.navy}, ${COLORS.navyDeep})`,
          border: `1.5px solid ${COLORS.magenta}55`,
          boxShadow: `0 0 70px -14px ${COLORS.magentaGlow}`,
        }}
      >
        <AgentFabricMark size={54} color={COLORS.white} />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          opacity: interpolate(title, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(title, [0, 1], [12, 0])}px)`,
        }}
      >
        <span style={{ fontFamily: FONT_FAMILY, fontWeight: 800, fontSize: 30, color: COLORS.white, whiteSpace: "nowrap" }}>
          SIREC Agent Fabric
        </span>
      </div>

      <span
        style={{
          fontFamily: FONT_FAMILY,
          fontWeight: 500,
          fontSize: 17,
          color: COLORS.magenta,
          whiteSpace: "nowrap",
          opacity: interpolate(subtitle, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(subtitle, [0, 1], [8, 0])}px)`,
        }}
      >
        El primer servicio MCP de Collection
      </span>
    </div>
  );
};
