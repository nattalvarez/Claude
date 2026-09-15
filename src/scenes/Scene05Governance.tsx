import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Easing } from "remotion";
import { COLORS, WIDTH, HEIGHT, FONT_FAMILY } from "../styles/theme";
import { KineticText } from "../components/KineticText";
import { ConnectionLine } from "../components/ConnectionLine";
import { ModuleCard } from "../components/ModuleCard";
import { RotatingHalo } from "../components/RotatingHalo";

const HUB = { x: WIDTH / 2, y: HEIGHT / 2 + 50 };
const CARD_W = 250;

const CONCEPTS = [
  { label: "Identidad", x: HUB.x, y: HUB.y - 260, from: 30 },
  { label: "Permisos", x: HUB.x - 520, y: HUB.y, from: 46 },
  { label: "Trazabilidad", x: HUB.x + 520, y: HUB.y, from: 62 },
  { label: "Supervisión", x: HUB.x, y: HUB.y + 260, from: 78 },
];

/** 0:18–0:23 — Autonomía gobernada. Four governance concepts anchor themselves around the
 * hub; once all four connect, the whole system settles — the scene's differentiator beat. */
export const Scene05Governance: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // the hub resolves rather than pops: an outer ring contracts down onto it while it fades in
  const resolve = interpolate(frame, [0, 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.32, 0, 0.2, 1),
  });
  const collapseRingRadius = interpolate(resolve, [0, 1], [190, 64]);
  const collapseRingOpacity = interpolate(resolve, [0, 0.85, 1], [0.55, 0.3, 0]);
  const hubOpacity = interpolate(frame, [16, 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // the "stabilize" settle — a very subtle collective scale breathing to rest
  const settle = spring({ frame: frame - 92, fps, config: { damping: 20, mass: 1, stiffness: 90 } });
  const settleScale = interpolate(settle, [0, 1], [1.015, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.white }}>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 96 }}>
        <KineticText
          parts={[{ text: "Autonomía " }, { text: "con control.", color: COLORS.turquoise }]}
          from={6}
          fontSize={50}
          fontWeight={500}
          color={COLORS.navy}
          align="center"
        />
      </AbsoluteFill>

      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${settleScale})`,
          transformOrigin: `${HUB.x}px ${HUB.y}px`,
        }}
      >
        <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0 }}>
          {CONCEPTS.map((c) => (
            <ConnectionLine key={c.label} x1={HUB.x} y1={HUB.y} x2={c.x} y2={c.y} from={c.from} duration={20} color={COLORS.turquoise} strokeWidth={1.6} opacity={0.5} />
          ))}
          <RotatingHalo cx={HUB.x} cy={HUB.y} radius={108} from={40} speed={0.16} />
          <circle cx={HUB.x} cy={HUB.y} r={collapseRingRadius} fill="none" stroke={COLORS.turquoise} strokeWidth={1.6} opacity={collapseRingOpacity} />
          <g transform={`translate(${HUB.x} ${HUB.y})`} opacity={hubOpacity}>
            <circle r={64} fill={COLORS.navy} />
            <text y={6} textAnchor="middle" fill={COLORS.white} fontFamily={FONT_FAMILY} fontWeight={700} fontSize={21} letterSpacing={0.5}>
              SIREC
            </text>
          </g>
        </svg>

        {CONCEPTS.map((c) => (
          <ModuleCard key={c.label} x={c.x} y={c.y - 32} label={c.label} from={c.from + 10} width={CARD_W} accent={COLORS.turquoise} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
