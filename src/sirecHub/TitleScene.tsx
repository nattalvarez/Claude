import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig, Easing } from "remotion";
import { COLORS, FONT_FAMILY } from "../styles/theme";
import { KineticText } from "../components/KineticText";
import { TITLE_POS, T } from "./timeline";

/** The opening beat: SIREC's name locks in first with a blur+rise settle,
 * then the mission line, then the promise line — each its own reveal, never
 * a flat fade — before the whole group recedes as the camera arrives at the
 * core. */
export const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const glow = spring({ frame: frame - T.title.line1, fps, config: { damping: 22, mass: 1.2, stiffness: 70 } });
  const name = spring({ frame: frame - T.title.line1 - 6, fps, config: { damping: 17, mass: 0.9, stiffness: 100 } });

  const exit = interpolate(frame, [T.title.exit, T.title.exit + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.7, 0, 0.84, 0),
  });

  if (exit >= 1) return null;

  const blur = interpolate(name, [0, 1], [16, 0]);

  return (
    <div
      style={{
        position: "absolute",
        left: TITLE_POS.x,
        top: TITLE_POS.y,
        transform: `translate(-50%, -50%) translateY(${exit * -34}px) scale(${1 - exit * 0.04})`,
        opacity: 1 - exit,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 820,
          height: 820,
          borderRadius: "50%",
          left: "50%",
          top: "38%",
          transform: `translate(-50%, -50%) scale(${interpolate(glow, [0, 1], [0.6, 1])})`,
          opacity: interpolate(glow, [0, 1], [0, 0.6]),
          background: `radial-gradient(circle, ${COLORS.turquoise}2E, ${COLORS.blue}12 55%, transparent 72%)`,
          filter: "blur(20px)",
        }}
      />

      <span
        style={{
          position: "relative",
          fontFamily: FONT_FAMILY,
          fontWeight: 900,
          fontSize: 118,
          letterSpacing: -1.5,
          color: COLORS.navy,
          opacity: interpolate(name, [0, 1], [0, 1]),
          filter: `blur(${Math.max(0, blur)}px)`,
          transform: `translateY(${interpolate(name, [0, 1], [46, 0])}px) scale(${interpolate(name, [0, 1], [1.1, 1])})`,
        }}
      >
        SIREC
      </span>

      <KineticText
        parts={[{ text: "Plataforma de orquestación del ciclo de riesgo de crédito", color: COLORS.blue }]}
        from={T.title.line2}
        fontSize={36}
        fontWeight={500}
        align="center"
        maxWidth={1100}
        wordStagger={2}
      />

      <KineticText
        parts={[{ text: "Todos los datos en una única plataforma.", color: COLORS.turquoise }]}
        from={T.title.line3}
        fontSize={30}
        fontWeight={700}
        align="center"
        wordStagger={2.4}
        style={{ marginTop: 6 }}
      />
    </div>
  );
};
