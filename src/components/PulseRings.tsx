import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../styles/theme";

type Props = {
  cx: number;
  cy: number;
  from: number;
  interval?: number;
  count?: number;
  maxRadius?: number;
  startRadius?: number;
  color?: string;
  strokeWidth?: number;
  maxOpacity?: number;
};

/** Concentric rings that emit outward from a point at a steady interval — a radar/pulse
 * read. Tune interval+maxRadius+maxOpacity to make it read as an urgent scan or a calm
 * heartbeat; never the same rhythm twice. */
export const PulseRings: React.FC<Props> = ({
  cx,
  cy,
  from,
  interval = 34,
  count = 5,
  maxRadius = 420,
  startRadius = 20,
  color = COLORS.turquoise,
  strokeWidth = 1.2,
  maxOpacity = 0.28,
}) => {
  const frame = useCurrentFrame();

  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const ringFrom = from + i * interval;
        const local = frame - ringFrom;
        if (local < 0) return null;
        const life = interval * 2.2;
        const progress = interpolate(local, [0, life], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const r = startRadius + (maxRadius - startRadius) * progress;
        const opacity = interpolate(progress, [0, 0.15, 1], [0, maxOpacity, 0]);
        if (opacity <= 0.002) return null;
        return <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={strokeWidth} opacity={opacity} />;
      })}
    </>
  );
};
