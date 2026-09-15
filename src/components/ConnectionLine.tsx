import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { COLORS } from "../styles/theme";

type Props = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  /** frame at which the draw-on animation starts */
  from: number;
  /** frames the draw-on animation takes */
  duration?: number;
  color?: string;
  strokeWidth?: number;
  opacity?: number;
  dashed?: boolean;
};

/** A line that "draws itself" from x1,y1 to x2,y2 using the SVG pathLength trick. */
export const ConnectionLine: React.FC<Props> = ({
  x1,
  y1,
  x2,
  y2,
  from,
  duration = 24,
  color = COLORS.blue,
  strokeWidth = 1.5,
  opacity = 0.5,
  dashed = false,
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [from, from + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  if (progress <= 0) return null;

  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      opacity={opacity}
      pathLength={1}
      strokeDasharray={dashed ? "0.02 0.02" : 1}
      strokeDashoffset={1 - progress}
    />
  );
};
