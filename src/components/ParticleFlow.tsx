import React, { useMemo } from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../styles/theme";
import { seededRange } from "../lib/random";

type Props = {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  from: number;
  count?: number;
  color?: string;
  speed?: number;
  size?: number;
  jitter?: number;
  maxOpacity?: number;
};

/** Small particles travelling repeatedly along a straight segment — the "data flowing
 * through a connection" read used on every service link in the piece. Generalizes the
 * skill's single-axis flow pattern to an arbitrary diagonal. */
export const ParticleFlow: React.FC<Props> = ({
  id,
  x1,
  y1,
  x2,
  y2,
  from,
  count = 6,
  color = COLORS.turquoise,
  speed,
  size = 2.6,
  jitter = 4,
  maxOpacity = 0.85,
}) => {
  const frame = useCurrentFrame();
  const particles = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        offset: seededRange(`${id}-off-${i}`, 0, 1),
        s: speed ?? seededRange(`${id}-sp-${i}`, 0.007, 0.013),
        j: seededRange(`${id}-j-${i}`, -jitter, jitter),
        r: seededRange(`${id}-r-${i}`, size * 0.7, size * 1.3),
      })),
    [id, count, speed, jitter, size]
  );

  const globalOpacity = interpolate(frame - from, [0, 22], [0, maxOpacity], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (globalOpacity <= 0.003) return null;

  const local = Math.max(0, frame - from);
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;

  return (
    <>
      {particles.map((p, i) => {
        const t = (p.offset + local * p.s) % 1;
        const x = x1 + dx * t + nx * p.j;
        const y = y1 + dy * t + ny * p.j;
        const edgeFade = Math.min(t, 1 - t) * 8;
        return <circle key={i} cx={x} cy={y} r={p.r} fill={color} opacity={Math.min(1, edgeFade) * globalOpacity} />;
      })}
    </>
  );
};
