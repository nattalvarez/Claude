import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY } from "../styles/theme";

type Props = {
  x: number;
  y: number;
  from: number;
  label: string;
  icon: React.ReactNode;
  /** where it enters from, relative to its resting spot — sells "cada uno entra
   * desde una dirección ligeramente diferente" instead of a uniform pop-in */
  dx?: number;
  dy?: number;
  compact?: boolean;
};

/** A small provider chip — OpenAI / Anthropic / Gemini / Google Cloud — that
 * flies in from its own direction and settles with a light overshoot twist. */
export const ProviderNode: React.FC<Props> = ({ x, y, from, label, icon, dx = 0, dy = -50, compact = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - from, fps, config: { damping: 13, mass: 0.6, stiffness: 130 } });
  const breathe = 1 + Math.sin((frame - from) / 34) * 0.02 * Math.min(1, p);

  if (p <= 0.001) return null;

  const tx = interpolate(p, [0, 1], [dx, 0]);
  const ty = interpolate(p, [0, 1], [dy, 0]);
  const rot = interpolate(p, [0, 1], [dx >= 0 ? 10 : -10, 0]);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(${p * breathe})`,
        opacity: interpolate(p, [0, 1], [0, 1]),
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: COLORS.white,
        border: `1px solid ${COLORS.lightBlue}`,
        borderRadius: 999,
        padding: compact ? "10px 18px" : "12px 22px",
        boxShadow: "0 20px 46px -22px rgba(35,52,86,0.3)",
        whiteSpace: "nowrap",
      }}
    >
      {icon}
      <span style={{ fontFamily: FONT_FAMILY, fontWeight: 600, fontSize: compact ? 17 : 19, color: COLORS.navy }}>
        {label}
      </span>
    </div>
  );
};
