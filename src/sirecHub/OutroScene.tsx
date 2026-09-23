import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile } from "remotion";
import { COLORS } from "../styles/theme";
import { KineticText } from "../components/KineticText";
import { TITLE_POS, T } from "./timeline";

/** The closing beat: the whole schema has receded and the camera has
 * returned to the exact spot the opening title used. Same logo, same
 * blur+rise settle, same two-line reveal — a deliberate bookend so the
 * piece reads as one complete thought, not a diagram that just stops. */
export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const glow = spring({ frame: frame - T.outro.line1, fps, config: { damping: 22, mass: 1.2, stiffness: 70 } });
  const name = spring({ frame: frame - T.outro.line1 - 6, fps, config: { damping: 17, mass: 0.9, stiffness: 100 } });

  if (glow <= 0.001) return null;

  const blur = interpolate(name, [0, 1], [16, 0]);

  return (
    <div
      style={{
        position: "absolute",
        left: TITLE_POS.x,
        top: TITLE_POS.y,
        transform: "translate(-50%, -50%)",
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

      <Img
        src={staticFile("sirecHub/sirec-logo-color.webp")}
        style={{
          position: "relative",
          width: 460,
          height: "auto",
          opacity: interpolate(name, [0, 1], [0, 1]),
          filter: `blur(${Math.max(0, blur)}px)`,
          transform: `translateY(${interpolate(name, [0, 1], [46, 0])}px) scale(${interpolate(name, [0, 1], [1.1, 1])})`,
        }}
      />

      <KineticText
        parts={[{ text: "Toda la gestión del riesgo de crédito, orquestada en un mismo ecosistema.", color: COLORS.blue }]}
        from={T.outro.line2}
        fontSize={36}
        fontWeight={500}
        align="center"
        maxWidth={1100}
        wordStagger={2}
      />

      <KineticText
        parts={[{ text: "Un solo SIREC. Todos los canales conectados.", color: COLORS.turquoise }]}
        from={T.outro.line3}
        fontSize={30}
        fontWeight={700}
        align="center"
        wordStagger={2.4}
        style={{ marginTop: 6 }}
      />
    </div>
  );
};
