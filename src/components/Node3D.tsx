import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY } from "../styles/theme";

type Props = {
  /** center position, px, relative to an absolutely-positioned parent */
  x: number;
  y: number;
  size?: number;
  color?: string;
  from?: number;
  /** stronger glow + slightly crisper edge, used for the SIREC core */
  core?: boolean;
  label?: string;
  labelBelow?: boolean;
  breathe?: boolean;
  opacity?: number;
};

/** A flat, brand-colored mark with a soft directional shadow and a faint glow behind it —
 * the atomic unit of every node in the ecosystem. Deliberately NOT a glossy chrome orb
 * with an orbiting ring (that reads as generic stock "AI" motion graphics); this stays
 * close to a solid color chip with just enough shading to sit in 3D space. */
export const Node3D: React.FC<Props> = ({
  x,
  y,
  size = 22,
  color = COLORS.blue,
  from = 0,
  core = false,
  label,
  labelBelow = true,
  breathe = true,
  opacity = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - from;

  const appear = spring({ frame: local, fps, config: { damping: 15, mass: 0.7, stiffness: 130 } });
  const breatheScale = breathe ? 1 + Math.sin(local / 24) * 0.03 * Math.min(1, appear) : 1;

  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        opacity: interpolate(appear, [0, 1], [0, 1]) * opacity,
        transform: `scale(${appear * breatheScale})`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: -size * (core ? 0.85 : 0.55),
          borderRadius: "50%",
          background: `radial-gradient(circle, ${color}${core ? "30" : "1c"}, transparent 68%)`,
          filter: `blur(${size * 0.3}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: `linear-gradient(140deg, ${color}, ${COLORS.navy})`,
          boxShadow: `0 ${size * 0.16}px ${size * 0.4}px -${size * 0.14}px ${color}77`,
        }}
      />
      {label && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: labelBelow ? size + 18 : -18 - 22,
            transform: "translateX(-50%)",
            whiteSpace: "nowrap",
            fontFamily: FONT_FAMILY,
            fontWeight: 500,
            fontSize: 18,
            letterSpacing: 1.4,
            color: COLORS.navy,
          }}
        >
          {label.toUpperCase()}
        </div>
      )}
    </div>
  );
};
