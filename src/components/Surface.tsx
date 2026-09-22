import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS } from "../styles/theme";

type Props = {
  x: number;
  y: number;
  width: number;
  from: number;
  align?: "left" | "center";
  children: React.ReactNode;
};

/** A softly-elevated white surface that gives a text block a sense of sitting slightly
 * above the page — a thin rounded rect with a very soft shadow, never a heavy "card UI"
 * look. Used where the brief explicitly calls for a raised surface behind text
 * (Inception, SATS, TaaS); every other scene sets type straight on the page. */
export const Surface: React.FC<Props> = ({ x, y, width, from, align = "left", children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const appear = spring({ frame: frame - from, fps, config: { damping: 18, mass: 0.8, stiffness: 120 } });

  return (
    <div
      style={{
        position: "absolute",
        left: align === "center" ? x - width / 2 : x,
        top: y,
        width,
        opacity: interpolate(appear, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(appear, [0, 1], [22, 0])}px)`,
        background: COLORS.white,
        borderRadius: 20,
        padding: "44px 48px",
        boxSizing: "border-box",
        boxShadow: `0 40px 80px -46px ${COLORS.navy}55, 0 2px 0 rgba(255,255,255,0.9)`,
      }}
    >
      {children}
    </div>
  );
};
