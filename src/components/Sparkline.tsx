import React, { useMemo } from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { COLORS } from "../styles/theme";
import { seededRange } from "../lib/random";

type Props = {
  x: number;
  y: number;
  width: number;
  height: number;
  from: number;
  duration?: number;
  seed?: string;
  points?: number;
  color?: string;
  fill?: boolean;
  trend?: "up" | "volatile";
};

/** A drawn-on trend line with a soft area fill and a leading dot — generic "there is
 * live data here" texture, deterministic per seed, no specific claim attached. */
export const Sparkline: React.FC<Props> = ({
  x,
  y,
  width,
  height,
  from,
  duration = 40,
  seed = "spark",
  points = 9,
  color = COLORS.turquoise,
  fill = true,
  trend = "up",
}) => {
  const frame = useCurrentFrame();

  const values = useMemo(() => {
    let acc = seededRange(`${seed}-start`, 0.3, 0.5);
    return Array.from({ length: points }).map((_, i) => {
      const drift = trend === "up" ? seededRange(`${seed}-d-${i}`, 0.01, 0.09) : seededRange(`${seed}-d-${i}`, -0.06, 0.06);
      acc = Math.min(0.96, Math.max(0.06, acc + drift));
      return acc;
    });
  }, [seed, points, trend]);

  const coords = values.map((v, i) => ({
    x: x + (width * i) / (points - 1),
    y: y + height * (1 - v),
  }));

  const linePath = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`).join(" ");
  const areaPath = `${linePath} L ${x + width} ${y + height} L ${x} ${y + height} Z`;

  const progress = interpolate(frame, [from, from + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  if (progress <= 0) return null;

  const tipIndex = Math.min(points - 1, Math.floor(progress * (points - 1)));
  const tip = coords[tipIndex];

  return (
    <g>
      {fill && (
        <path d={areaPath} fill={`url(#sparkline-fill-${seed})`} opacity={progress} clipPath={`inset(0 ${width * (1 - progress)}px 0 0)`} />
      )}
      <defs>
        <linearGradient id={`sparkline-fill-${seed}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.22} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - progress}
      />
      <circle cx={tip.x} cy={tip.y} r={3.2} fill={color} opacity={progress} />
    </g>
  );
};
