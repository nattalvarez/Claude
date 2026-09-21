import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { COLORS } from "../styles/theme";

type Props = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  from: number;
  duration?: number;
  color?: string;
  strokeWidth?: number;
  opacity?: number;
  /** loop a small glowing dot along the line once it's drawn — "data flowing" */
  flow?: boolean;
  flowSpeed?: number;
};

/** A connector that draws itself, then carries a soft traveling pulse — the
 * "flujos de datos recorriendo las líneas" the brief asks for, never a static
 * diagram line. Coordinates are already in the shared world-SVG space. */
export const FlowLine: React.FC<Props> = ({
  x1,
  y1,
  x2,
  y2,
  from,
  duration = 26,
  color = COLORS.blue,
  strokeWidth = 1.8,
  opacity = 0.5,
  flow = true,
  flowSpeed = 90,
}) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [from, from + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  if (draw <= 0) return null;

  const localFlow = Math.max(0, frame - (from + duration));
  const t = flow ? (localFlow % flowSpeed) / flowSpeed : 0;
  const flowOpacity = flow
    ? interpolate(localFlow, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) *
      interpolate(t, [0, 0.08, 0.85, 1], [0, 1, 1, 0])
    : 0;

  const dx = x1 + (x2 - x1) * t;
  const dy = y1 + (y2 - y1) * t;

  return (
    <g>
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
        strokeDasharray={1}
        strokeDashoffset={1 - draw}
      />
      {flow && flowOpacity > 0.01 && (
        <>
          <circle cx={dx} cy={dy} r={strokeWidth * 2.6} fill={color} opacity={flowOpacity * 0.9} />
          <circle cx={dx} cy={dy} r={strokeWidth * 6} fill={color} opacity={flowOpacity * 0.16} />
        </>
      )}
    </g>
  );
};
