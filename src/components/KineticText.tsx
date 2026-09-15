import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig, Easing } from "remotion";
import { COLORS, FONT_FAMILY } from "../styles/theme";

export type TextPart = { text: string; color?: string };

type Props = {
  parts: TextPart[];
  from: number;
  exitAt?: number;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  align?: "center" | "left";
  letterSpacing?: number;
  lineHeight?: number;
  maxWidth?: number;
  style?: React.CSSProperties;
  /** frames between each word's entrance; lower = tighter/faster reveal */
  wordStagger?: number;
};

/** Word-level staggered text reveal: fade + rise + soft blur in, matching the brief's
 * "elegante y breve" direction — never a hard cut, never all words moving at once. */
export const KineticText: React.FC<Props> = ({
  parts,
  from,
  exitAt,
  fontSize = 56,
  fontWeight = 500,
  color = COLORS.navy,
  align = "center",
  letterSpacing = 0,
  lineHeight = 1.15,
  maxWidth,
  style,
  wordStagger = 2,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = parts.flatMap((p, pi) =>
    p.text
      .split(" ")
      .filter((w) => w.length > 0)
      .map((w, wi) => ({ word: w, color: p.color ?? color, key: `${pi}-${wi}` }))
  );

  const exitProgress = exitAt
    ? interpolate(frame, [exitAt, exitAt + 16], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.4, 0, 1, 1),
      })
    : 0;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: align === "center" ? "center" : "flex-start",
        textAlign: align,
        maxWidth,
        gap: `0 ${fontSize * 0.22}px`,
        opacity: 1 - exitProgress,
        transform: `translateY(${exitProgress * -14}px)`,
        ...style,
      }}
    >
      {words.map((w, i) => {
        const enter = spring({
          frame: frame - from - i * wordStagger,
          fps,
          config: { damping: 18, mass: 0.7, stiffness: 140 },
        });
        const translateY = interpolate(enter, [0, 1], [16, 0]);
        const blur = interpolate(enter, [0, 1], [6, 0]);
        return (
          <span
            key={w.key}
            style={{
              display: "inline-block",
              fontFamily: FONT_FAMILY,
              fontWeight,
              fontSize,
              lineHeight,
              letterSpacing,
              color: w.color,
              opacity: enter,
              filter: `blur(${Math.max(0, blur)}px)`,
              transform: `translateY(${translateY}px)`,
              whiteSpace: "pre",
            }}
          >
            {w.word}
          </span>
        );
      })}
    </div>
  );
};
