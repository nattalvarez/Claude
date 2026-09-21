import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY } from "../styles/theme";
import { KineticText } from "../components/KineticText";

type Props = {
  x: number;
  y: number;
  from: number;
  heading: string;
  body: string;
  accent?: string;
  width?: number;
};

/** One of the three closing statements — POTENCIA / INTEGRA / ORQUESTA — a
 * heading with a soft glow plus a short kinetic line, arriving as the camera
 * settles on its zone of the architecture. */
export const ConceptPanel: React.FC<Props> = ({ x, y, from, heading, body, accent = COLORS.magenta, width = 460 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const barP = spring({ frame: frame - from, fps, config: { damping: 15, mass: 0.6, stiffness: 140 } });
  const headP = spring({ frame: frame - from - 4, fps, config: { damping: 14, mass: 0.7, stiffness: 150 } });

  if (barP <= 0.001) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        transform: "translate(-100%, -50%)",
        display: "flex",
        alignItems: "flex-start",
        gap: 22,
        opacity: interpolate(barP, [0, 1], [0, 1]),
      }}
    >
      <div
        style={{
          width: 4,
          height: 108 * Math.min(1, barP * 1.3),
          borderRadius: 4,
          background: accent,
          boxShadow: `0 0 26px ${COLORS.magentaGlow}`,
          flexShrink: 0,
          marginTop: 6,
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: 900,
            fontSize: 46,
            letterSpacing: -0.5,
            color: accent,
            opacity: interpolate(headP, [0, 1], [0, 1]),
            transform: `translateX(${interpolate(headP, [0, 1], [-18, 0])}px)`,
          }}
        >
          {heading}
        </span>
        <KineticText
          parts={[{ text: body, color: COLORS.navy }]}
          from={from + 10}
          fontSize={24}
          fontWeight={500}
          align="left"
          maxWidth={width}
          wordStagger={1.4}
          lineHeight={1.3}
        />
      </div>
    </div>
  );
};
