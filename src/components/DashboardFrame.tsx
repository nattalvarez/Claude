import React from "react";
import { Img, useCurrentFrame, interpolate, Easing } from "remotion";
import { COLORS } from "../styles/theme";

type Props = {
  src: string | null;
  x: number;
  y: number;
  width: number;
  height: number;
  from: number;
  duration?: number;
};

/** Abstract skeleton stand-in for a real product screenshot — used only until the actual
 * asset is supplied. Deliberately non-representational: no invented labels, numbers, or UI
 * chrome, just the brand's geometric language holding the frame's shape. */
const AbstractPlaceholder: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const rows = [0.16, 0.3, 0.44, 0.58, 0.74];
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <rect x={0} y={0} width={width} height={height} rx={18} fill={COLORS.white} stroke={COLORS.lightBlue} strokeWidth={1.5} />
      <rect x={0} y={0} width={width * 0.22} height={height} rx={18} fill={COLORS.navy} opacity={0.94} />
      {[0.14, 0.28, 0.42, 0.56, 0.7].map((f, i) => (
        <rect key={i} x={width * 0.06} y={height * f} width={width * 0.1} height={6} rx={3} fill={COLORS.turquoise} opacity={i === 0 ? 0.9 : 0.35} />
      ))}
      {rows.map((f, i) => (
        <rect
          key={i}
          x={width * 0.3}
          y={height * f}
          width={width * (0.55 - (i % 2) * 0.12)}
          height={10}
          rx={5}
          fill={COLORS.lightBlue}
        />
      ))}
      <rect x={width * 0.3} y={height * 0.06} width={width * 0.16} height={height * 0.16} rx={10} fill={COLORS.lightBlue} />
      <rect x={width * 0.49} y={height * 0.06} width={width * 0.16} height={height * 0.16} rx={10} fill={COLORS.lightBlue} />
      <rect x={width * 0.68} y={height * 0.06} width={width * 0.16} height={height * 0.16} rx={10} fill={COLORS.turquoise} opacity={0.25} />
    </svg>
  );
};

export const DashboardFrame: React.FC<Props> = ({ src, x, y, width, height, from, duration = 32 }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [from, from + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const scale = interpolate(progress, [0, 1], [0.96, 1]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const clipInset = interpolate(progress, [0, 1], [6, 0]);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        opacity,
        transform: `scale(${scale})`,
        borderRadius: 20,
        overflow: "hidden",
        clipPath: `inset(${clipInset}% round 20px)`,
        boxShadow: "0 60px 120px -40px rgba(35,52,86,0.35)",
        border: `1px solid ${COLORS.lightBlue}`,
      }}
    >
      {src ? (
        <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      ) : (
        <AbstractPlaceholder width={width} height={height} />
      )}
    </div>
  );
};
