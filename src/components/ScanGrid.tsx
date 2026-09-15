import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { COLORS, WIDTH, HEIGHT } from "../styles/theme";

type Props = {
  from: number;
  sweepDuration?: number;
  gridSpacing?: number;
  color?: string;
  gridOpacity?: number;
};

/** A faint vertical grid with a horizontal scan line sweeping down through it, repeating —
 * reads as data being analysed. Used once, in Scene03. */
export const ScanGrid: React.FC<Props> = ({ from, sweepDuration = 130, gridSpacing = 96, color = COLORS.blue, gridOpacity = 0.05 }) => {
  const frame = useCurrentFrame();
  const local = Math.max(0, frame - from);
  const fieldOpacity = interpolate(frame - from, [0, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // keep the sweep well clear of the headline band at the top of the scene
  const sweepTop = 300;
  const sweepT = (local % sweepDuration) / sweepDuration;
  const eased = Easing.bezier(0.45, 0, 0.55, 1)(sweepT);
  const y = sweepTop + eased * (HEIGHT - sweepTop);
  const sweepOpacity = interpolate(sweepT, [0, 0.06, 0.9, 1], [0, 0.16, 0.16, 0]);

  const columns = Math.ceil(WIDTH / gridSpacing);

  return (
    <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0 }}>
      <g opacity={fieldOpacity * gridOpacity}>
        {Array.from({ length: columns }).map((_, i) => (
          <line key={i} x1={i * gridSpacing} y1={sweepTop} x2={i * gridSpacing} y2={HEIGHT} stroke={color} strokeWidth={1} />
        ))}
      </g>
      <defs>
        <linearGradient id="scan-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0} />
          <stop offset="50%" stopColor={color} stopOpacity={sweepOpacity * fieldOpacity} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect x={0} y={y - 26} width={WIDTH} height={52} fill="url(#scan-gradient)" />
      <line x1={0} y1={y} x2={WIDTH} y2={y} stroke={color} strokeWidth={1} opacity={sweepOpacity * fieldOpacity * 0.8} />
    </svg>
  );
};
