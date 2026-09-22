import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { COLORS, EASE, SCENE_DURATIONS, WIDTH, HEIGHT } from "../styles/theme";
import { Cube3D } from "../components/Cube3D";
import { Panel3D } from "../components/Panel3D";
import { TitleBlock } from "../components/TitleBlock";
import { SceneExit } from "../components/SceneExit";

const DURATION = SCENE_DURATIONS.cloud;
const CENTER = { x: 1290, y: 500 };

/** An irregular, gently-rounded polygon container — a deliberate alternative to a literal
 * cartoon cloud silhouette. Reads as an abstract technological enclosure. */
const buildContainer = (cx: number, cy: number, rx: number, ry: number, corner = 0.34) => {
  const scales = [1, 0.85, 1.05, 0.92, 1.08, 0.9];
  const points = scales.map((s, i) => {
    const angle = (i / 6) * Math.PI * 2;
    return { x: cx + Math.cos(angle) * rx * s, y: cy + Math.sin(angle) * ry * s };
  });
  const n = points.length;
  let d = "";
  for (let i = 0; i < n; i++) {
    const prev = points[(i - 1 + n) % n];
    const curr = points[i];
    const next = points[(i + 1) % n];
    const a = { x: curr.x + (prev.x - curr.x) * corner, y: curr.y + (prev.y - curr.y) * corner };
    const b = { x: curr.x + (next.x - curr.x) * corner, y: curr.y + (next.y - curr.y) * corner };
    d += i === 0 ? `M ${a.x},${a.y} ` : `L ${a.x},${a.y} `;
    d += `Q ${curr.x},${curr.y} ${b.x},${b.y} `;
  }
  return d + "Z";
};

const CONTAINER = buildContainer(CENTER.x, CENTER.y, 430, 280);

const PIECES = [
  { kind: "cube" as const, dx: -110, dy: -30, size: 96, color: COLORS.blue, from: 30, drift: 16, driftSpeed: 70 },
  { kind: "cube" as const, dx: 150, dy: -60, size: 70, color: COLORS.turquoise, from: 46, drift: 20, driftSpeed: 60 },
  { kind: "cube" as const, dx: 20, dy: 90, size: 84, color: COLORS.navy, from: 38, drift: 14, driftSpeed: 80 },
  { kind: "panel" as const, dx: -170, dy: 130, size: 0, color: COLORS.blue, from: 58, drift: 12, driftSpeed: 90 },
  { kind: "panel" as const, dx: 190, dy: 110, size: 0, color: COLORS.turquoise, from: 66, drift: 18, driftSpeed: 65 },
];

/** Scene 05 — SIREC Cloud Services. The largest, most visual object in the piece: an
 * abstract enclosure holding cubes and plates that drift up and down independently — no
 * lines between them. The camera drifts slowly around the object like a slow orbit. */
export const Scene05CloudServices: React.FC = () => {
  const frame = useCurrentFrame();

  const containerIn = interpolate(frame, [0, 44], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE.out),
  });

  const orbitX = interpolate(frame, [0, DURATION], [-24, 18], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE.inOut),
  });
  const orbitScale = 1 + Math.sin((frame / DURATION) * Math.PI) * 0.05;

  const secondLineFrom = 150;

  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, ${COLORS.white} 55%, ${COLORS.lightBlue}33)` }}>
      <SceneExit duration={DURATION} exitDuration={18}>
        <AbsoluteFill
          style={{
            transform: `translateX(${orbitX}px) scale(${orbitScale})`,
            transformOrigin: `${CENTER.x}px ${CENTER.y}px`,
          }}
        >
          <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0 }}>
            <defs>
              <linearGradient id="container-fill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={COLORS.lightBlue} stopOpacity={0.6} />
                <stop offset="100%" stopColor={COLORS.white} stopOpacity={0.15} />
              </linearGradient>
            </defs>
            <path d={CONTAINER} fill="url(#container-fill)" stroke={COLORS.blue} strokeWidth={1.4} opacity={containerIn * 0.85} />
          </svg>

          {PIECES.map((p, i) => {
            const drift = Math.sin(frame / p.driftSpeed + i) * p.drift;
            const x = CENTER.x + p.dx;
            const y = CENTER.y + p.dy + drift;
            return p.kind === "cube" ? (
              <Cube3D key={i} x={x} y={y} size={p.size} color={p.color} from={p.from} rotateX={-16} rotateY={26} spinY={0.03} floatAmp={0} />
            ) : (
              <Panel3D key={i} x={x} y={y} width={118} height={78} color={p.color} from={p.from} rotateX={12} rotateY={-10} floatAmp={0} filled />
            );
          })}
        </AbsoluteFill>

        <AbsoluteFill style={{ justifyContent: "center", paddingLeft: 130, paddingRight: 1080 }}>
          <TitleBlock title="SIREC CLOUD SERVICES" subtitle="Cartera integral de servicios Cloud para operar SIREC." from={20} align="left" maxWidth={620} titleSize={50} />
          <div style={{ marginTop: 26 }}>
            <TitleBlock description="Altos niveles de seguridad y escalabilidad." from={secondLineFrom} align="left" maxWidth={560} />
          </div>
        </AbsoluteFill>
      </SceneExit>
    </AbsoluteFill>
  );
};
