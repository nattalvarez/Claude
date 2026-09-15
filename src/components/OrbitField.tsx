import React, { useMemo } from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../styles/theme";
import { seededRange } from "../lib/random";

type Props = {
  cx: number;
  cy: number;
  from: number;
  count?: number;
  minRadius?: number;
  maxRadius?: number;
  color?: string;
};

/** Small dots drifting in slow independent orbits around a centre — a sense of a living
 * system at rest, well outside the foreground content. Used once, in Scene04. */
export const OrbitField: React.FC<Props> = ({ cx, cy, from, count = 16, minRadius = 440, maxRadius = 620, color = COLORS.blue }) => {
  const frame = useCurrentFrame();
  const dots = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        radius: seededRange(`orbit-r-${i}`, minRadius, maxRadius),
        speed: seededRange(`orbit-s-${i}`, 0.0026, 0.006) * (i % 2 === 0 ? 1 : -1),
        phase: seededRange(`orbit-p-${i}`, 0, Math.PI * 2),
        size: seededRange(`orbit-sz-${i}`, 1.6, 3.4),
      })),
    [count, minRadius, maxRadius]
  );

  const globalOpacity = interpolate(frame - from, [0, 40], [0, 0.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <g opacity={globalOpacity}>
      {dots.map((d) => {
        const angle = d.phase + frame * d.speed;
        const x = cx + Math.cos(angle) * d.radius;
        const y = cy + Math.sin(angle) * d.radius * 0.52;
        return <circle key={d.id} cx={x} cy={y} r={d.size} fill={color} />;
      })}
    </g>
  );
};
