import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Roboto";
import { COLORS, FONT_FAMILY, SPRING } from "../styles/theme";

const { fontFamily } = loadFont("normal", { weights: ["400", "500", "700", "900"] });
export const ROBOTO = fontFamily || FONT_FAMILY;

type Part = { text: string; color?: string; weight?: number };

/** Word-by-word reveal, integrated into the composition (no subtitle bar).
 * Each word rises + fades on its own spring, staggered 3 frames apart. */
export const WordReveal: React.FC<{
  parts: Part[];
  from?: number;
  fontSize?: number;
  weight?: number;
  color?: string;
  align?: "left" | "center" | "right";
  letterSpacing?: number;
  lineHeight?: number;
  maxWidth?: number;
  style?: React.CSSProperties;
}> = ({
  parts,
  from = 0,
  fontSize = 46,
  weight = 500,
  color = COLORS.navy,
  align = "left",
  letterSpacing = -0.5,
  lineHeight = 1.18,
  maxWidth,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words: { text: string; color?: string; weight?: number }[] = [];
  parts.forEach((p) => {
    p.text.split(" ").forEach((w) => words.push({ text: w, color: p.color, weight: p.weight }));
  });

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
        gap: "0 0.28em",
        maxWidth,
        fontFamily: ROBOTO,
        fontSize,
        fontWeight: weight,
        lineHeight,
        letterSpacing,
        textAlign: align,
        ...style,
      }}
    >
      {words.map((w, i) => {
        const p = spring({ frame: frame - from - i * 3, fps, config: SPRING.snappy });
        const y = interpolate(p, [0, 1], [26, 0]);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: p,
              transform: `translateY(${y}px)`,
              color: w.color ?? color,
              fontWeight: w.weight ?? weight,
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

/** The SIREC wordmark — pure typography, no icon glyph. Tight tracking,
 * heavy weight, a thin rule that draws in underneath as an underline beat. */
export const Wordmark: React.FC<{
  from?: number;
  fontSize?: number;
  color?: string;
  ruleColor?: string;
}> = ({ from = 0, fontSize = 128, color = COLORS.navy, ruleColor = COLORS.turquoise }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - from, fps, config: SPRING.smooth });
  const rule = spring({ frame: frame - from - 10, fps, config: SPRING.smooth });
  const scale = interpolate(p, [0, 1], [0.9, 1]);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div
        style={{
          fontFamily: ROBOTO,
          fontWeight: 900,
          fontSize,
          letterSpacing: 6,
          color,
          opacity: p,
          transform: `scale(${scale})`,
        }}
      >
        SIREC
      </div>
      <div
        style={{
          marginTop: fontSize * 0.14,
          height: 3,
          width: interpolate(rule, [0, 1], [0, fontSize * 1.55], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          background: ruleColor,
          opacity: rule,
        }}
      />
    </div>
  );
};

/** Small eyebrow / kicker label — a stage number, a category tag. */
export const Kicker: React.FC<{
  text: string;
  from?: number;
  color?: string;
  fontSize?: number;
}> = ({ text, from = 0, color = COLORS.blue, fontSize = 16 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - from, fps, config: SPRING.snappy });
  return (
    <div
      style={{
        fontFamily: ROBOTO,
        fontWeight: 700,
        fontSize,
        letterSpacing: 3.5,
        textTransform: "uppercase",
        color,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [12, 0])}px)`,
      }}
    >
      {text}
    </div>
  );
};

/** A label anchored to a projected 3D point — for agent names, module
 * names, stage numbers. Depth-cued (fades/scales with camera distance). */
export const AnchoredLabel: React.FC<{
  x: number;
  y: number;
  scale: number;
  behind: boolean;
  from: number;
  text: string;
  sub?: string;
  color?: string;
  align?: "left" | "center";
}> = ({ x, y, scale, behind, from, text, sub, color = COLORS.navy, align = "center" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - from, fps, config: SPRING.snappy });
  if (behind || p <= 0.01) return null;
  const opacity = p * interpolate(scale, [0.4, 0.7], [0.35, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(${align === "center" ? "-50%" : "0"}, ${interpolate(p, [0, 1], [10, 0])}px) scale(${Math.min(1.05, scale)})`,
        opacity,
        textAlign: align,
        fontFamily: ROBOTO,
        pointerEvents: "none",
      }}
    >
      <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: 0.5, color }}>{text}</div>
      {sub && <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: 1, color, opacity: 0.65, marginTop: 2 }}>{sub}</div>}
    </div>
  );
};
