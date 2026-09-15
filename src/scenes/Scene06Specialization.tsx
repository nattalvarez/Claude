import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing, spring, useVideoConfig } from "remotion";
import { COLORS, WIDTH, HEIGHT, FONT_FAMILY } from "../styles/theme";
import { KineticText } from "../components/KineticText";
import { ConnectionLine } from "../components/ConnectionLine";
import { ModuleCard } from "../components/ModuleCard";

const Y = HEIGHT / 2 + 40;
const XS = [280, 660, 1040, 1420, 1720 - 20];
const CENTRE = { x: WIDTH / 2, y: Y };

const MODULES = [
  { label: "Anticipación y Seguimiento", from: 22 },
  { label: "Alerta Temprana", from: 34 },
  { label: "Recobro Amistoso", from: 46 },
  { label: "Vía Judicial", from: 58 },
  { label: "Reporting y Cumplimiento", from: 70 },
];

const CONVERGE_START = 82;
const CONVERGE_DURATION = 28;

/** 0:23–0:27 — Especialización en riesgo de crédito. Five specialised modules chain
 * together left to right, then converge into a single point — SIREC itself. */
export const Scene06Specialization: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const convergeProgress = interpolate(frame, [CONVERGE_START, CONVERGE_START + CONVERGE_DURATION], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  const pointAppear = spring({ frame: frame - CONVERGE_START - CONVERGE_DURATION + 6, fps, config: { damping: 14, mass: 0.6, stiffness: 140 } });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.white }}>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 96 }}>
        <KineticText
          parts={[{ text: "Especializado en " }, { text: "riesgo de crédito.", color: COLORS.turquoise }]}
          from={6}
          fontSize={50}
          fontWeight={500}
          color={COLORS.navy}
          align="center"
        />
      </AbsoluteFill>

      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0 }}>
        {MODULES.slice(0, -1).map((m, i) => {
          const x1 = interpolate(convergeProgress, [0, 1], [XS[i], CENTRE.x]);
          const x2 = interpolate(convergeProgress, [0, 1], [XS[i + 1], CENTRE.x]);
          const lineOpacity = 0.4 * (1 - convergeProgress * 0.7);
          return (
            <ConnectionLine
              key={m.label}
              x1={x1}
              y1={Y}
              x2={x2}
              y2={Y}
              from={MODULES[i + 1].from - 8}
              duration={16}
              color={COLORS.blue}
              strokeWidth={1.4}
              opacity={lineOpacity}
            />
          );
        })}

        {pointAppear > 0.01 && (
          <g opacity={interpolate(pointAppear, [0, 1], [0, 1])}>
            <circle cx={CENTRE.x} cy={CENTRE.y} r={10 * pointAppear} fill={COLORS.navy} />
            <circle cx={CENTRE.x} cy={CENTRE.y} r={30 * pointAppear} fill="none" stroke={COLORS.turquoise} strokeWidth={1.4} opacity={0.6} />
          </g>
        )}
      </svg>

      {MODULES.map((m, i) => {
        const x = interpolate(convergeProgress, [0, 1], [XS[i], CENTRE.x]);
        const extraScale = interpolate(convergeProgress, [0, 1], [1, 0.3]);
        const extraOpacity = interpolate(convergeProgress, [0, 1], [1, 0]);
        return (
          <ModuleCard
            key={m.label}
            x={x}
            y={Y - 32}
            label={m.label}
            from={m.from}
            width={300}
            accent={COLORS.blue}
            extraScale={extraScale}
            extraOpacity={extraOpacity}
          />
        );
      })}

      {pointAppear > 0.4 && (
        <div
          style={{
            position: "absolute",
            left: CENTRE.x - 100,
            top: Y + 34,
            width: 200,
            textAlign: "center",
            opacity: interpolate(pointAppear, [0.4, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            fontFamily: FONT_FAMILY,
            fontWeight: 700,
            fontSize: 22,
            letterSpacing: 1,
            color: COLORS.navy,
          }}
        >
          SIREC
        </div>
      )}
    </AbsoluteFill>
  );
};
