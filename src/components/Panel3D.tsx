import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS } from "../styles/theme";

type Props = {
  x: number;
  y: number;
  width?: number;
  height?: number;
  color?: string;
  from?: number;
  rotateX?: number;
  rotateY?: number;
  floatAmp?: number;
  opacity?: number;
  children?: React.ReactNode;
  filled?: boolean;
  glow?: boolean;
};

/** A floating rounded "module" card, gently tilted in 3D space with a soft shadow — the
 * general-purpose building block for cloud blocks, change-management modules and TaaS
 * content cards. Distinct from ModuleCard (which is a flat inline label row). */
export const Panel3D: React.FC<Props> = ({
  x,
  y,
  width = 160,
  height = 110,
  color = COLORS.blue,
  from = 0,
  rotateX = 8,
  rotateY = -14,
  floatAmp = 5,
  opacity = 1,
  children,
  filled = false,
  glow = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - from;
  const appear = spring({ frame: local, fps, config: { damping: 16, mass: 0.8, stiffness: 120 } });
  const floatY = Math.sin(local / 46) * floatAmp;
  const tiltDrift = Math.sin(local / 70) * 2;

  return (
    <div
      style={{
        position: "absolute",
        left: x - width / 2,
        top: y - height / 2 + floatY,
        width,
        height,
        opacity: interpolate(appear, [0, 1], [0, 1]) * opacity,
        transform: `scale(${interpolate(appear, [0, 1], [0.85, 1])}) perspective(900px) rotateX(${rotateX + tiltDrift}deg) rotateY(${rotateY}deg)`,
        borderRadius: Math.min(18, width * 0.16, height * 0.16),
        background: filled ? `linear-gradient(155deg, ${COLORS.white}, ${COLORS.lightBlue})` : `${COLORS.white}f2`,
        border: `1px solid ${color}3d`,
        boxShadow: glow
          ? `0 30px 60px -24px ${color}55, 0 0 0 1px ${color}22, inset 0 1px 0 rgba(255,255,255,0.6)`
          : `0 26px 50px -26px ${COLORS.navy}44, inset 0 1px 0 rgba(255,255,255,0.6)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 14,
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  );
};
