import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS } from "../styles/theme";

type Props = {
  cx: number;
  cy: number;
  r?: number;
  color?: string;
  from?: number;
  filled?: boolean;
  pulse?: boolean;
  opacity?: number;
};

/** A single node: a dot/ring that springs in and gently breathes — represents an agent, a
 * data point, or a state in the system, per the brief's "geometry as narrative language". */
export const GeometricNode: React.FC<Props> = ({
  cx,
  cy,
  r = 4,
  color = COLORS.blue,
  from = 0,
  filled = true,
  pulse = true,
  opacity = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const appear = spring({
    frame: frame - from,
    fps,
    config: { damping: 14, mass: 0.6, stiffness: 120 },
  });

  const breathe = pulse
    ? 1 + Math.sin((frame - from) / 22) * 0.06 * Math.min(1, appear)
    : 1;

  const scale = appear * breathe;

  return (
    <circle
      cx={cx}
      cy={cy}
      r={r * scale}
      fill={filled ? color : "none"}
      stroke={filled ? "none" : color}
      strokeWidth={filled ? 0 : 1.4}
      opacity={opacity * interpolate(appear, [0, 1], [0, 1])}
    />
  );
};
