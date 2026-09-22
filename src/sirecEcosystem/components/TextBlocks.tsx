import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, FONT, SPRING, EASE } from "../theme";

/** Word-by-word kinetic reveal for big titles — never a flat fade. */
export const KineticTitle: React.FC<{
  text: string;
  from: number;
  fontSize?: number;
  color?: string;
  weight?: number;
  align?: "left" | "center";
  letterSpacing?: number;
  per?: number;
  style?: React.CSSProperties;
}> = ({ text, from, fontSize = 72, color = COLORS.navy, weight = 900, align = "left", letterSpacing = -1.5, per = 3, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: align === "center" ? "center" : "flex-start",
        gap: `0px ${Math.round(fontSize * 0.22)}px`,
        ...style,
      }}
    >
      {words.map((w, i) => {
        const p = spring({ frame: frame - from - i * per, fps, config: SPRING.snappy });
        const blur = interpolate(p, [0, 1], [10, 0]);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              fontFamily: FONT,
              fontWeight: weight,
              fontSize,
              lineHeight: 1.04,
              letterSpacing,
              color,
              opacity: p,
              filter: `blur(${Math.max(0, blur)}px)`,
              transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px)`,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

/** A single block of body copy that rises + fades in as one unit — used for
 * descriptions, which read better as a phrase than word-by-word. */
export const TextBlock: React.FC<{
  text: string;
  from: number;
  fontSize?: number;
  color?: string;
  weight?: number;
  lineHeight?: number;
  maxWidth?: number;
  align?: "left" | "center";
  style?: React.CSSProperties;
}> = ({ text, from, fontSize = 26, color = COLORS.navySoft, weight = 500, lineHeight = 1.35, maxWidth, align = "left", style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - from, fps, config: SPRING.smooth });
  return (
    <div
      style={{
        fontFamily: FONT,
        fontWeight: weight,
        fontSize,
        lineHeight,
        color,
        maxWidth,
        textAlign: align,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [18, 0])}px)`,
        ...style,
      }}
    >
      {text}
    </div>
  );
};

/** Small uppercase eyebrow label with a lit accent dot — used above kickers
 * (e.g. "SIREC Automated Testing Suite"). */
export const Eyebrow: React.FC<{ text: string; from: number; color?: string; align?: "left" | "center"; style?: React.CSSProperties }> = ({
  text,
  from,
  color = COLORS.blue,
  align = "left",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - from, fps, config: SPRING.snappy });
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: align === "center" ? "center" : "flex-start",
        gap: 10,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [10, 0])}px)`,
        ...style,
      }}
    >
      <div style={{ width: 7, height: 7, borderRadius: "50%", background: color, flexShrink: 0 }} />
      <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 20, letterSpacing: 2, textTransform: "uppercase", color }}>
        {text}
      </span>
    </div>
  );
};

/** Elevated white surface — the one card treatment used everywhere text
 * needs a clean plane to sit on. Rises in on its own `from`, slightly ahead
 * of the copy it holds, instead of appearing as a dead static box. */
export const Card: React.FC<{ from: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ from, style, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - from, fps, config: SPRING.smooth });
  if (p <= 0.001) return null;
  return (
    <div
      style={{
        background: COLORS.white,
        borderRadius: 24,
        boxShadow: `0 30px 70px -24px ${COLORS.shadow}, 0 0 0 1px ${COLORS.navyHair}`,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [20, 0])}px) scale(${interpolate(p, [0, 1], [0.96, 1])})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Pill: React.FC<{ text: string; from: number; color?: string; bg?: string; style?: React.CSSProperties }> = ({
  text,
  from,
  color = COLORS.navy,
  bg = COLORS.lightBlue,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - from, fps, config: SPRING.bouncy });
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "10px 22px",
        borderRadius: 999,
        background: bg,
        opacity: p,
        transform: `scale(${interpolate(p, [0, 1], [0.7, 1])}) translateY(${interpolate(p, [0, 1], [10, 0])}px)`,
        ...style,
      }}
    >
      <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 17, letterSpacing: 1.2, textTransform: "uppercase", color }}>
        {text}
      </span>
    </div>
  );
};

/** Positions a child at a raw world coordinate (0,0 = screen center) — the
 * companion to `worldCameraTransform`. Every scene 09/10 element mounts
 * through this so camera look-at targets and content positions agree. */
export const WorldPoint: React.FC<{ x: number; y: number; style?: React.CSSProperties; children: React.ReactNode }> = ({
  x,
  y,
  style,
  children,
}) => (
  <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)", ...style }}>{children}</div>
);

/** Wraps a whole scene so it fades/rises in on entry and fades/lifts out on
 * exit — the crossfade half of the overlap-driven scene transitions. */
export const SceneFade: React.FC<{
  duration: number;
  inFrames?: number;
  outFrames?: number;
  children: React.ReactNode;
}> = ({ duration, inFrames = 18, outFrames = 16, children }) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, inFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.out });
  const exit = interpolate(frame, [duration - outFrames, duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.in,
  });
  const o = Math.min(enter, exit);
  const risingIn = interpolate(enter, [0, 1], [16, 0]);
  const risingOut = interpolate(exit, [0, 1], [-14, 0]);
  return <div style={{ opacity: o, transform: `translateY(${risingIn + risingOut}px)`, width: "100%", height: "100%" }}>{children}</div>;
};
