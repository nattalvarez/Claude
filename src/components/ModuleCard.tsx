import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY } from "../styles/theme";

type Props = {
  x: number; // center x, px
  y: number; // center y, px
  label: string;
  from: number;
  accent?: string;
  width?: number;
  extraScale?: number;
  extraOpacity?: number;
};

/** A small geometric module card — used for the governance concepts and the
 * specialization pillars. A mark (not an icon library glyph) + a short label. */
export const ModuleCard: React.FC<Props> = ({
  x,
  y,
  label,
  from,
  accent = COLORS.turquoise,
  width = 250,
  extraScale = 1,
  extraOpacity = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const appear = spring({ frame: frame - from, fps, config: { damping: 17, mass: 0.7, stiffness: 130 } });
  const translateY = interpolate(appear, [0, 1], [14, 0]);
  const opacity = interpolate(appear, [0, 1], [0, 1]) * extraOpacity;
  const scale = interpolate(appear, [0, 1], [0.92, 1]) * extraScale;

  return (
    <div
      style={{
        position: "absolute",
        left: x - width / 2,
        top: y,
        width,
        transform: `translateY(${translateY}px) scale(${scale})`,
        opacity,
        display: "flex",
        alignItems: "center",
        gap: 14,
        background: COLORS.white,
        border: `1px solid ${COLORS.lightBlue}`,
        borderRadius: 14,
        padding: "16px 20px",
        boxShadow: "0 18px 40px -20px rgba(35,52,86,0.25)",
      }}
    >
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: 3,
          background: accent,
          flexShrink: 0,
          transform: "rotate(45deg)",
        }}
      />
      <span
        style={{
          fontFamily: FONT_FAMILY,
          fontWeight: 500,
          fontSize: 20,
          color: COLORS.navy,
          letterSpacing: 0.2,
        }}
      >
        {label}
      </span>
    </div>
  );
};
