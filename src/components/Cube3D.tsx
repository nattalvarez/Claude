import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS } from "../styles/theme";

type Props = {
  x: number;
  y: number;
  size?: number;
  color?: string;
  from?: number;
  /** static base tilt, degrees */
  rotateX?: number;
  rotateY?: number;
  /** continuous drift speed, degrees/frame — kept tiny per the brief's "ligero" note */
  spinX?: number;
  spinY?: number;
  floatAmp?: number;
  opacity?: number;
  shadow?: boolean;
};

/** A true CSS 3D cube — six faces on a `preserve-3d` stage, each face a translucent glass
 * panel with its own shading, so it reads as a solid tech module rather than a flat square.
 * Faces darken front→back to fake a single consistent light source. */
export const Cube3D: React.FC<Props> = ({
  x,
  y,
  size = 70,
  color = COLORS.blue,
  from = 0,
  rotateX = -22,
  rotateY = 34,
  spinX = 0.06,
  spinY = 0.1,
  floatAmp = 6,
  opacity = 1,
  shadow = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - from;
  const appear = spring({ frame: local, fps, config: { damping: 15, mass: 0.8, stiffness: 110 } });

  const rx = rotateX + local * spinX;
  const ry = rotateY + local * spinY;
  const floatY = Math.sin(local / 40) * floatAmp;
  const half = size / 2;

  const faceBase: React.CSSProperties = {
    position: "absolute",
    width: size,
    height: size,
    border: `1px solid ${color}55`,
    boxSizing: "border-box",
  };

  const shade = (alphaHex: string, blendNavy = 0) => ({
    background:
      blendNavy > 0
        ? `linear-gradient(135deg, ${color}${alphaHex}, ${COLORS.navy}${alphaHex})`
        : `linear-gradient(135deg, #FFFFFFaa, ${color}${alphaHex})`,
  });

  return (
    <div
      style={{
        position: "absolute",
        left: x - half,
        top: y - half + floatY,
        width: size,
        height: size,
        opacity: interpolate(appear, [0, 1], [0, 1]) * opacity,
        transform: `scale(${appear})`,
        perspective: 1000,
      }}
    >
      {shadow && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: size * 1.05,
            width: size * 0.9,
            height: size * 0.22,
            transform: "translateX(-50%)",
            borderRadius: "50%",
            background: `radial-gradient(ellipse, ${COLORS.navy}22, transparent 70%)`,
            filter: "blur(4px)",
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          left: half,
          top: half,
          width: 0,
          height: 0,
          transformStyle: "preserve-3d",
          transform: `rotateX(${rx}deg) rotateY(${ry}deg)`,
        }}
      >
        {/* front */}
        <div style={{ ...faceBase, ...shade("2e"), transform: `translate(-50%,-50%) translateZ(${half}px)` }} />
        {/* back */}
        <div style={{ ...faceBase, ...shade("18", 1), transform: `translate(-50%,-50%) rotateY(180deg) translateZ(${half}px)` }} />
        {/* right */}
        <div style={{ ...faceBase, ...shade("22", 1), transform: `translate(-50%,-50%) rotateY(90deg) translateZ(${half}px)` }} />
        {/* left */}
        <div style={{ ...faceBase, ...shade("22", 1), transform: `translate(-50%,-50%) rotateY(-90deg) translateZ(${half}px)` }} />
        {/* top */}
        <div style={{ ...faceBase, ...shade("3d"), transform: `translate(-50%,-50%) rotateX(90deg) translateZ(${half}px)` }} />
        {/* bottom */}
        <div style={{ ...faceBase, ...shade("14", 1), transform: `translate(-50%,-50%) rotateX(-90deg) translateZ(${half}px)` }} />
      </div>
    </div>
  );
};
