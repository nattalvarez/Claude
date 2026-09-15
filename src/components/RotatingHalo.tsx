import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../styles/theme";

type Props = {
  cx: number;
  cy: number;
  radius: number;
  from: number;
  color?: string;
  speed?: number; // degrees per frame
  dashed?: boolean;
};

/** A slow, steady rotating ring around a centre — a governance/control loop read.
 * Used once, in Scene05. */
export const RotatingHalo: React.FC<Props> = ({ cx, cy, radius, from, color = COLORS.turquoise, speed = 0.22, dashed = true }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame - from, [0, 30], [0, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rotation = (frame - from) * speed;

  return (
    <g opacity={opacity} transform={`rotate(${rotation} ${cx} ${cy})`}>
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={1.4}
        strokeDasharray={dashed ? "3 14" : undefined}
        strokeLinecap="round"
      />
    </g>
  );
};
