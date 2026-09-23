import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY } from "../styles/theme";
import { AgentFabricMark } from "./marks";
import { AGENT_FABRIC_POS, T } from "./timeline";

/** The layer that emerges from SIREC rather than sitting beside it — built
 * container-first like the core, but narrower and toned in blue instead of
 * turquoise so it reads as a distinct stratum above SIREC. */
export const AgentFabricLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const container = spring({ frame: frame - T.agentFabric.container, fps, config: { damping: 15, mass: 1, stiffness: 95 } });
  const title = spring({ frame: frame - T.agentFabric.title, fps, config: { damping: 16, mass: 0.8, stiffness: 120 } });
  const subtitle = spring({ frame: frame - T.agentFabric.subtitle, fps, config: { damping: 17, mass: 0.8, stiffness: 120 } });

  if (container <= 0.001) return null;

  const breathe = 1 + Math.sin((frame - T.agentFabric.container) / 44) * 0.02 * Math.min(1, container);

  // A gentle, perpetual pulse once "SIREC Agent Fabric" has settled in —
  // it never stops moving, unlike every other static label, since this is
  // the one line that should read as live and active.
  const pulse = (Math.sin((frame - T.agentFabric.subtitle) / 20) * 0.5 + 0.5) * Math.min(1, subtitle);

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
          width: 440,
          height: 440,
          borderRadius: "50%",
          left: "50%",
          top: 40,
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, ${COLORS.blue}2E, transparent 68%)`,
          filter: "blur(24px)",
        }}
      />

      <div
        style={{
          position: "relative",
          width: 148,
          height: 148,
          borderRadius: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(155deg, ${COLORS.blue}, ${COLORS.navy})`,
          border: `1.5px solid ${COLORS.blue}55`,
          boxShadow: `0 24px 60px -14px ${COLORS.navyShadow}, 0 0 60px -16px ${COLORS.blue}66`,
        }}
      >
        <AgentFabricMark size={62} color={COLORS.white} />
      </div>

      <div
        style={{
          background: COLORS.white,
          borderRadius: 16,
          padding: "18px 32px",
          boxShadow: `0 14px 30px -12px ${COLORS.navyShadow}, 0 0 0 1.5px ${COLORS.blue}3D`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          opacity: interpolate(title, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(title, [0, 1], [12, 0])}px)`,
        }}
      >
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: 700,
            fontSize: 18,
            color: COLORS.navy,
            opacity: 0.55,
            letterSpacing: 2.5,
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          Agentes IA
        </span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 2,
            opacity: interpolate(subtitle, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(subtitle, [0, 1], [8, 0])}px) scale(${1 + pulse * 0.045})`,
          }}
        >
          <div
            style={{
              width: 13,
              height: 13,
              borderRadius: "50%",
              background: COLORS.turquoise,
              boxShadow: `0 0 ${8 + pulse * 16}px ${COLORS.turquoise}`,
              transform: `scale(${1 + pulse * 0.45})`,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontWeight: 900,
              fontSize: 46,
              color: COLORS.blue,
              letterSpacing: -0.5,
              whiteSpace: "nowrap",
              textShadow: `0 0 ${8 + pulse * 22}px ${COLORS.blue}70`,
            }}
          >
            SIREC Agent Fabric
          </span>
        </div>
      </div>
    </div>
  );
};
