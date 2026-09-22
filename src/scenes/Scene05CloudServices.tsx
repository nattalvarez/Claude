import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { COLORS, WIDTH, HEIGHT, EASE, SCENE_DURATIONS } from "../styles/theme";
import { Cube3D } from "../components/Cube3D";
import { Node3D } from "../components/Node3D";
import { ConnectionLine } from "../components/ConnectionLine";
import { ParticleFlow } from "../components/ParticleFlow";
import { TechIcon } from "../components/TechIcon";
import { TitleBlock } from "../components/TitleBlock";
import { SceneExit } from "../components/SceneExit";

const DURATION = SCENE_DURATIONS.cloud;
const CENTER = { x: 960, y: 470 };

/** An irregular, gently-rounded hexagonal container — a deliberate alternative to the
 * classic scalloped "cloud" icon silhouette the brief explicitly forbids. Reads as an
 * abstract data-hub enclosure instead. */
const buildHexContainer = (cx: number, cy: number, rx: number, ry: number, corner = 0.32) => {
  const scales = [1, 0.86, 1.06, 0.94, 1.1, 0.9];
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

const BLOB = buildHexContainer(CENTER.x, CENTER.y, 470, 290);

const NODES = [
  { type: "cube" as const, x: 760, y: 420, size: 88, color: COLORS.blue, from: 40 },
  { type: "cube" as const, x: 1120, y: 400, size: 74, color: COLORS.turquoise, from: 56 },
  { type: "cube" as const, x: 960, y: 590, size: 96, color: COLORS.navy, from: 48 },
  { type: "node" as const, x: 640, y: 560, size: 26, color: COLORS.turquoise, from: 70 },
  { type: "node" as const, x: 1230, y: 560, size: 24, color: COLORS.blue, from: 78 },
  { type: "cube" as const, x: 900, y: 300, size: 52, color: COLORS.blue, from: 64 },
  { type: "node" as const, x: 1080, y: 660, size: 20, color: COLORS.turquoise, from: 86 },
];

const LINKS: [number, number][] = [
  [0, 2],
  [1, 2],
  [3, 0],
  [4, 1],
  [5, 0],
  [6, 2],
];

/** Scene 05 — SIREC Cloud Services. The most visually dense scene: an abstract, geometric
 * cloud container hosting connected cube-servers, nodes and blocks, camera pushing slowly
 * through. SEGURIDAD / ESCALABILIDAD labels sit at the cloud's edges. */
export const Scene05CloudServices: React.FC = () => {
  const frame = useCurrentFrame();

  const blobIn = interpolate(frame, [0, 46], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE.out),
  });

  const cameraScale = interpolate(frame, [0, DURATION], [1, 1.23], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE.inOut),
  });
  const cameraY = interpolate(frame, [0, DURATION], [15, -38], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE.inOut),
  });

  const labelFrom = 130;
  const labelAppear = (f: number) =>
    interpolate(frame, [f, f + 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(...EASE.out) });

  return (
    <AbsoluteFill>
      <SceneExit duration={DURATION} exitDuration={18}>
        <AbsoluteFill
          style={{
            transform: `scale(${cameraScale}) translateY(${cameraY}px)`,
            transformOrigin: `${CENTER.x}px ${CENTER.y}px`,
          }}
        >
          <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0 }}>
            <defs>
              <linearGradient id="cloud-fill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={COLORS.lightBlue} stopOpacity={0.7} />
                <stop offset="100%" stopColor={COLORS.white} stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <path d={BLOB} fill="url(#cloud-fill)" stroke={COLORS.blue} strokeWidth={1.4} opacity={blobIn * 0.9} />
            <path d={BLOB} fill="none" stroke={COLORS.turquoise} strokeWidth={0.8} strokeDasharray="1 10" opacity={blobIn * 0.5} pathLength={1} strokeDashoffset={1 - blobIn} />

            {LINKS.map(([a, b], i) => {
              const na = NODES[a];
              const nb = NODES[b];
              return (
                <ConnectionLine
                  key={`link-${i}`}
                  x1={na.x}
                  y1={na.y}
                  x2={nb.x}
                  y2={nb.y}
                  from={Math.max(na.from, nb.from) + 10}
                  duration={22}
                  color={i % 2 === 0 ? COLORS.blue : COLORS.turquoise}
                  strokeWidth={1.2}
                  opacity={0.45}
                />
              );
            })}
            {LINKS.map(([a, b], i) => {
              const na = NODES[a];
              const nb = NODES[b];
              return (
                <ParticleFlow
                  key={`pf-${i}`}
                  id={`cloud-pf-${i}`}
                  x1={na.x}
                  y1={na.y}
                  x2={nb.x}
                  y2={nb.y}
                  from={Math.max(na.from, nb.from) + 34}
                  count={4}
                  color={COLORS.turquoise}
                />
              );
            })}
          </svg>

          {NODES.map((n, i) =>
            n.type === "cube" ? (
              <Cube3D key={i} x={n.x} y={n.y} size={n.size} color={n.color} from={n.from} rotateX={-16} rotateY={26} spinY={0.04} floatAmp={5} />
            ) : (
              <Node3D key={i} x={n.x} y={n.y} size={n.size} color={n.color} from={n.from} />
            )
          )}
        </AbsoluteFill>

        {/* SEGURIDAD / ESCALABILIDAD — small labels anchored to the cloud's edges */}
        <div
          style={{
            position: "absolute",
            left: 320,
            top: 520,
            display: "flex",
            alignItems: "center",
            gap: 10,
            opacity: labelAppear(labelFrom),
            transform: `translateY(${interpolate(labelAppear(labelFrom), [0, 1], [10, 0])}px)`,
          }}
        >
          <TechIcon type="shield" color={COLORS.navy} size={26} />
          <span style={{ fontFamily: "Roboto", fontWeight: 500, fontSize: 22, letterSpacing: 2, color: COLORS.navy }}>SEGURIDAD</span>
        </div>
        <div
          style={{
            position: "absolute",
            right: 300,
            top: 620,
            display: "flex",
            alignItems: "center",
            gap: 10,
            opacity: labelAppear(labelFrom + 14),
            transform: `translateY(${interpolate(labelAppear(labelFrom + 14), [0, 1], [10, 0])}px)`,
          }}
        >
          <TechIcon type="layers" color={COLORS.navy} size={26} />
          <span style={{ fontFamily: "Roboto", fontWeight: 500, fontSize: 22, letterSpacing: 2, color: COLORS.navy }}>ESCALABILIDAD</span>
        </div>

        <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 78 }}>
          <TitleBlock
            title="SIREC CLOUD SERVICES"
            description="Cartera integral de servicios Cloud para operar SIREC con altos niveles de seguridad y escalabilidad."
            from={20}
            align="center"
            maxWidth={1000}
            titleSize={54}
          />
        </AbsoluteFill>
      </SceneExit>
    </AbsoluteFill>
  );
};
