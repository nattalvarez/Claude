import React from "react";
import { COLORS } from "../styles/theme";

export type PieceType = "circle" | "square" | "triangle" | "diamond";

type Props = {
  type: PieceType;
  size?: number;
  color?: string;
  rotateX?: number;
  rotateY?: number;
  opacity?: number;
};

const clipPaths: Partial<Record<PieceType, string>> = {
  triangle: "polygon(50% 6%, 94% 94%, 6% 94%)",
  diamond: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
};

/** A single flat-but-tilted geometric piece (circle/square/triangle/diamond) with a
 * gradient fill + soft shadow so it reads as a small tile floating in 3D space rather
 * than a flat sticker. Positioning/animation is the caller's responsibility — this is
 * pure presentation, meant to sit inside an absolutely-positioned wrapper. */
export const FloatingPiece: React.FC<Props> = ({ type, size = 46, color = COLORS.blue, rotateX = 18, rotateY = -22, opacity = 1 }) => {
  const shapeStyle: React.CSSProperties = {
    width: size,
    height: size,
    background: `linear-gradient(140deg, #FFFFFF, ${color}33 40%, ${color}55)`,
    border: `1.5px solid ${color}80`,
    borderRadius: type === "circle" ? "50%" : type === "square" ? size * 0.18 : 0,
    clipPath: clipPaths[type],
    boxShadow: `0 ${size * 0.3}px ${size * 0.6}px -${size * 0.2}px ${color}55, inset 0 1px 0 rgba(255,255,255,0.7)`,
  };

  return (
    <div style={{ perspective: 500, opacity }}>
      <div style={{ transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`, ...shapeStyle }} />
    </div>
  );
};
