import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY } from "../styles/theme";

type Props = {
  label: string;
  from: number;
};

export const PillButton: React.FC<Props> = ({ label, from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const appear = spring({ frame: frame - from, fps, config: { damping: 16, mass: 0.7, stiffness: 130 } });

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        background: COLORS.navy,
        color: COLORS.white,
        borderRadius: 999,
        padding: "18px 38px",
        fontFamily: FONT_FAMILY,
        fontWeight: 500,
        fontSize: 24,
        letterSpacing: 0.2,
        opacity: interpolate(appear, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(appear, [0, 1], [12, 0])}px) scale(${interpolate(appear, [0, 1], [0.94, 1])})`,
      }}
    >
      {label}
      <span style={{ fontSize: 20 }}>→</span>
    </div>
  );
};
