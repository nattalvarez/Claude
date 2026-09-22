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
  /** bigger halo + double ring, used for the SIREC core */
  core?: boolean;
  label?: string;
  labelBelow?: boolean;
  breathe?: boolean;
  opacity?: number;
};

/** A softly-lit tech "sphere" — radial gradient fill, a specular highlight, a thin
 * orbiting ring, and a glow — the atomic unit of every node in the ecosystem. Built with
 * CSS (not SVG) so the highlight/gradient read as true light rather than a flat dot. */
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
  const breatheScale = breathe ? 1 + Math.sin(local / 24) * 0.035 * Math.min(1, appear) : 1;
  const ringRotation = local * 0.35;

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
      {core && (
        <div
          style={{
            position: "absolute",
            inset: -size * 0.9,
            borderRadius: "50%",
            border: `1px solid ${color}33`,
            transform: `rotate(${ringRotation}deg)`,
          }}
        />
      )}
      {core && (
        <div
          style={{
            position: "absolute",
            inset: -size * 1.5,
            borderRadius: "50%",
            border: `1px dashed ${color}22`,
            transform: `rotate(${-ringRotation * 0.6}deg)`,
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          inset: -size * (core ? 1.1 : 0.7),
          borderRadius: "50%",
          background: `radial-gradient(circle, ${color}${core ? "3d" : "26"}, transparent 70%)`,
          filter: `blur(${size * 0.35}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: `radial-gradient(circle at 34% 30%, #FFFFFF, ${color} 46%, ${COLORS.navy} 130%)`,
          boxShadow: `0 ${size * 0.18}px ${size * 0.5}px -${size * 0.12}px ${color}66, inset 0 -${size * 0.12}px ${size * 0.2}px rgba(0,0,0,0.18)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "22%",
          top: "18%",
          width: "30%",
          height: "22%",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.75)",
          filter: "blur(1.5px)",
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
