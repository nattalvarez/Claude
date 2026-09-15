import React, { useMemo } from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../styles/theme";
import { seededRange } from "../lib/random";

type Props = {
  y: number;
  x1: number;
  x2: number;
  from: number;
  count?: number;
  color?: string;
};

/** Small particles flowing steadily left to right along a line — a data-stream read for
 * the pipeline of specialised modules. Used once, in Scene06. */
export const FlowStream: React.FC<Props> = ({ y, x1, x2, from, count = 10, color = COLORS.turquoise }) => {
  const frame = useCurrentFrame();
  const particles = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        offset: seededRange(`flow-${i}`, 0, 1),
        speed: seededRange(`flow-speed-${i}`, 0.006, 0.011),
        yJitter: seededRange(`flow-y-${i}`, -10, 10),
        size: seededRange(`flow-sz-${i}`, 1.4, 2.6),
      })),
    [count]
  );

  const globalOpacity = interpolate(frame - from, [0, 24], [0, 0.55], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const local = Math.max(0, frame - from);

  return (
    <g opacity={globalOpacity}>
      {particles.map((p) => {
        const t = (p.offset + local * p.speed) % 1;
        const x = x1 + (x2 - x1) * t;
        const edgeFade = Math.min(t, 1 - t) * 6;
        return <circle key={p.id} cx={x} cy={y + p.yJitter} r={p.size} fill={color} opacity={Math.min(1, edgeFade)} />;
      })}
    </g>
  );
};
