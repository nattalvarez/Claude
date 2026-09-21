import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS } from "../styles/theme";
import { AgentMark } from "./marks";

type Props = { x: number; y: number; from: number };

/** A single abstract agent, blooming above SIREC Agent Fabric. */
export const AgentNode: React.FC<Props> = ({ x, y, from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - from, fps, config: { damping: 12, mass: 0.6, stiffness: 160 } });
  if (p <= 0.001) return null;
  const breathe = 1 + Math.sin((frame - from) / 26) * 0.04 * Math.min(1, p);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 58,
        height: 58,
        borderRadius: "50%",
        transform: `translate(-50%, -50%) scale(${p * breathe})`,
        opacity: interpolate(p, [0, 1], [0, 1]),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(255,255,255,0.06)",
        border: `1px solid ${COLORS.turquoise}66`,
        boxShadow: `0 0 30px -8px ${COLORS.glow}`,
      }}
    >
      <AgentMark size={22} color={COLORS.turquoise} />
    </div>
  );
};
