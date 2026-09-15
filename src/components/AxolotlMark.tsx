import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { COLORS } from "../styles/theme";

type Props = {
  from: number;
  size?: number;
  color?: string;
  /** >1 draws the mark faster (e.g. 1.6 for a compact reveal); total draw time is ~46/speed frames */
  speed?: number;
};

const draw = (frame: number, from: number, duration: number, offset = 0) =>
  interpolate(frame, [from + offset, from + offset + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

/**
 * The SIREC brand mark — a line-drawn axolotl head, redrawn as a vector icon (the source
 * logo file wasn't available in this environment, so this is a faithful geometric
 * reconstruction: capsule head, two eyes, three frilled gills per side). It "draws itself"
 * on, stroke by stroke, rather than popping/fading like everything else in the piece.
 */
export const AxolotlMark: React.FC<Props> = ({ from, size = 140, color = COLORS.navy, speed = 1 }) => {
  const frame = useCurrentFrame();

  const headProgress = draw(frame, from, 20 / speed, 0);
  const eyesProgress = draw(frame, from, 10 / speed, 16 / speed);
  const gillStagger = 5 / speed;

  const gill = (side: 1 | -1, i: number) => {
    const p = draw(frame, from, 14 / speed, 22 / speed + i * gillStagger);
    if (p <= 0) return null;
    const baseX = side * 34;
    const baseY = -6 + i * 15;
    const tipX = side * (74 + i * 6);
    const tipY = baseY - 14 + i * 18;
    const midX = side * 56;
    const midY = baseY - 6 + i * 10;
    const path = `M ${baseX} ${baseY} Q ${midX} ${midY} ${tipX} ${tipY}`;
    return (
      <g key={`${side}-${i}`} opacity={p}>
        <path d={path} stroke={color} strokeWidth={2.4} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
        <circle cx={tipX} cy={tipY} r={3.2} fill={color} opacity={interpolate(p, [0.7, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
      </g>
    );
  };

  return (
    <svg width={size} height={size * 0.82} viewBox="-100 -70 200 140" style={{ overflow: "visible" }}>
      {[0, 1, 2].map((i) => gill(-1, i))}
      {[0, 1, 2].map((i) => gill(1, i))}

      {/* head capsule */}
      <rect
        x={-40}
        y={-26}
        width={80}
        height={52}
        rx={26}
        fill="none"
        stroke={color}
        strokeWidth={3}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - headProgress}
      />

      {/* eyes */}
      <ellipse cx={-15} cy={-2} rx={6} ry={11} fill={color} opacity={eyesProgress} />
      <ellipse cx={15} cy={-2} rx={6} ry={11} fill={color} opacity={eyesProgress} />
    </svg>
  );
};
