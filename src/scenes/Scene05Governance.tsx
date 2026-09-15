import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Easing } from "remotion";
import { COLORS, WIDTH, HEIGHT, FONT_FAMILY, SCENES } from "../styles/theme";
import { KineticText } from "../components/KineticText";
import { ConnectionLine } from "../components/ConnectionLine";
import { ModuleCard } from "../components/ModuleCard";
import { RotatingHalo } from "../components/RotatingHalo";
import { SceneExit } from "../components/SceneExit";

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

  const diamondOpacity = interpolate(frame, [96, 116], [0, 0.28], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const DIAMOND = [
    [CONCEPTS[0], CONCEPTS[1]],
    [CONCEPTS[0], CONCEPTS[2]],
    [CONCEPTS[3], CONCEPTS[1]],
    [CONCEPTS[3], CONCEPTS[2]],
  ];

  return (
    <AbsoluteFill>
      <SceneExit duration={SCENES.s05.duration}>
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

          {/* diamond mesh — the four concepts also check against each other, not just the hub */}
          <g opacity={diamondOpacity}>
            {DIAMOND.map(([a, b], i) => (
              <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={COLORS.blue} strokeWidth={1} strokeDasharray="1 7" strokeLinecap="round" />
            ))}
          </g>

          {/* permission-check pulses travelling the spokes on a continuous loop */}
          {CONCEPTS.map((c, i) => {
            const loopStart = c.from + 26;
            if (frame < loopStart) return null;
            const t = ((frame - loopStart) / 58 + i * 0.16) % 1;
            const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
            const px = HUB.x + (c.x - HUB.x) * ease;
            const py = HUB.y + (c.y - HUB.y) * ease;
            const pulseFade = Math.sin(t * Math.PI);
            return <circle key={c.label} cx={px} cy={py} r={3} fill={COLORS.turquoise} opacity={pulseFade * 0.8} />;
          })}

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
      </SceneExit>
    </AbsoluteFill>
  );
};
