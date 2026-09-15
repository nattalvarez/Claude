import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY } from "../styles/theme";

type Props = {
  from: number;
  fontSize?: number;
  color?: string;
};

/** The SIREC wordmark — text-only, Roboto, no mark/icon (per the brand's absolute
 * no-character rule for this piece). */
export const Wordmark: React.FC<Props> = ({ from, fontSize = 88, color = COLORS.navy }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const appear = spring({ frame: frame - from, fps, config: { damping: 16, mass: 0.8, stiffness: 110 } });

  return (
    <div
      style={{
        fontFamily: FONT_FAMILY,
        fontWeight: 700,
        fontSize,
        color,
        letterSpacing: -1.5,
        opacity: interpolate(appear, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(appear, [0, 1], [16, 0])}px)`,
      }}
    >
      sirec
    </div>
  );
};
