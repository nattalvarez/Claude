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
  icon: React.ReactNode;
  accent?: string;
  width?: number;
};

/** One of the three closing statements — POTENCIA / INTEGRA / ORQUESTA — an
 * icon badge (same language as the architecture boxes) plus a heading and a
 * short kinetic line, arriving as the camera settles on its zone. */
export const ConceptPanel: React.FC<Props> = ({ x, y, from, heading, body, icon, accent = COLORS.blue, width = 500 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const badgeP = spring({ frame: frame - from, fps, config: { damping: 15, mass: 0.7, stiffness: 130 } });
  const headP = spring({ frame: frame - from - 4, fps, config: { damping: 14, mass: 0.7, stiffness: 150 } });

  if (badgeP <= 0.001) return null;

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
        opacity: interpolate(badgeP, [0, 1], [0, 1]),
      }}
    >
      <div
        style={{
          width: 62,
          height: 62,
          borderRadius: 17,
          background: `${accent}1A`,
          border: `1px solid ${accent}40`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transform: `scale(${interpolate(badgeP, [0, 1], [0.75, 1])}) rotate(${interpolate(badgeP, [0, 1], [-8, 0])}deg)`,
        }}
      >
        {icon}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 4 }}>
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: 900,
            fontSize: 52,
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
          fontSize={26}
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
