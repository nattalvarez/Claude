import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY } from "../styles/theme";

type Props = {
  target: number;
  from: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  /** override the settle speed — use a snappier one when the window before a cut is tight */
  springConfig?: { damping: number; stiffness: number; mass?: number };
};

/** A ticking number — spring-driven, tabular-nums so digits don't jitter the layout
 * as they change. Reads as live telemetry without asserting any specific claim. */
export const AnimatedCounter: React.FC<Props> = ({
  target,
  from,
  decimals = 0,
  prefix = "",
  suffix = "",
  fontSize = 28,
  fontWeight = 700,
  color = COLORS.navy,
  springConfig = { damping: 30, stiffness: 60 },
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - from, fps, config: springConfig });
  const value = interpolate(p, [0, 1], [0, target]);

  return (
    <span
      style={{
        fontFamily: FONT_FAMILY,
        fontWeight,
        fontSize,
        color,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
};
