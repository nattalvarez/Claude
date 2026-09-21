import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig, Easing } from "remotion";
import { COLORS, FONT_FAMILY } from "../styles/theme";
import { KineticText } from "../components/KineticText";

type Variant = "light" | "dark";

type Props = {
  x: number;
  y: number;
  width?: number;
  from: { container: number; icon: number; title: number; subtitle: number; tag?: number };
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  tag?: string;
  tagColor?: string;
  variant?: Variant;
};

/** One architecture layer — SIREC / SIREC Agent Fabric / Agentes IA. Builds
 * container → icon → title → subtitle → tag, each its own spring, never
 * simultaneous. Lives in world space; the camera does all the "zooming". */
export const ArchBlock: React.FC<Props> = ({
  x,
  y,
  width = 680,
  from,
  icon,
  title,
  subtitle,
  tag,
  tagColor = COLORS.turquoise,
  variant = "light",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const container = spring({ frame: frame - from.container, fps, config: { damping: 20, mass: 1, stiffness: 90 } });
  const iconP = spring({ frame: frame - from.icon, fps, config: { damping: 14, mass: 0.6, stiffness: 150 } });
  const breathe = 1 + Math.sin((frame - from.container) / 50) * 0.008 * Math.min(1, container);

  const dark = variant === "dark";
  const bg = dark ? COLORS.navy : COLORS.white;
  const titleColor = dark ? COLORS.white : COLORS.navy;
  const subColor = dark ? COLORS.lightBlue : COLORS.blue;
  const border = dark ? `1.5px dashed rgba(255,255,255,0.4)` : `1px solid ${COLORS.lightBlue}`;

  if (container <= 0.001) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        transform: `translate(-50%, -50%) translateY(${interpolate(container, [0, 1], [46, 0])}px) scale(${interpolate(container, [0, 1], [0.9, 1]) * breathe})`,
        opacity: interpolate(container, [0, 1], [0, 1]),
      }}
    >
      <div
        style={{
          background: bg,
          border,
          borderRadius: 28,
          padding: "38px 46px",
          boxShadow: dark
            ? `0 50px 100px -30px rgba(35,52,86,0.55), 0 0 90px -20px ${COLORS.glow}`
            : "0 40px 90px -30px rgba(35,52,86,0.22)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            opacity: interpolate(iconP, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(iconP, [0, 1], [10, 0])}px) scale(${interpolate(iconP, [0, 1], [0.7, 1])})`,
          }}
        >
          <div
            style={{
              width: 62,
              height: 62,
              borderRadius: 17,
              background: dark ? "rgba(255,255,255,0.12)" : COLORS.lightBlue,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontWeight: 700,
              fontSize: 47,
              letterSpacing: -0.8,
              color: titleColor,
            }}
          >
            {title}
          </span>
        </div>

        <KineticText
          parts={[{ text: subtitle, color: subColor }]}
          from={from.subtitle}
          fontSize={24}
          fontWeight={500}
          align="left"
          wordStagger={1.5}
        />

        {tag && from.tag !== undefined && (
          <TagLine from={from.tag} text={tag} color={tagColor} />
        )}
      </div>
    </div>
  );
};

const TagLine: React.FC<{ from: number; text: string; color: string }> = ({ from, text, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - from, fps, config: { damping: 16, mass: 0.7, stiffness: 130 } });
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginTop: 4,
        opacity: interpolate(p, [0, 1], [0, 1]),
        transform: `translateX(${interpolate(p, [0, 1], [-14, 0])}px)`,
      }}
    >
      <div style={{ width: 9, height: 9, borderRadius: 2, background: color, transform: "rotate(45deg)" }} />
      <span style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 22, color, letterSpacing: 0.2 }}>{text}</span>
    </div>
  );
};

/** Fast, easing-driven fade — used for the frame's very last exit, if ever needed. */
export const easedFade = (frame: number, from: number, dur = 16) =>
  interpolate(frame, [from, from + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
