import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { COLORS, WIDTH, HEIGHT, EASE, SCENE_DURATIONS } from "../styles/theme";
import { Cube3D } from "../components/Cube3D";
import { FloatingPiece, PieceType } from "../components/FloatingPiece";
import { Node3D } from "../components/Node3D";
import { ConnectionLine } from "../components/ConnectionLine";
import { TitleBlock } from "../components/TitleBlock";
import { SceneExit } from "../components/SceneExit";
import { seededRange } from "../lib/random";

const DURATION = SCENE_DURATIONS.inception;
const CENTER = { x: 1330, y: 540 };
const ORGANIZE_START = 26;
const ORGANIZE_END = 118;

type Piece = {
  id: string;
  kind: "cube" | PieceType;
  color: string;
  size: number;
  scattered: { x: number; y: number };
  ordered: { x: number; y: number };
  stagger: number;
};

const PIECE_KINDS: Array<"cube" | PieceType> = ["cube", "circle", "square", "cube", "circle", "square", "cube", "circle"];

const buildPieces = (): Piece[] =>
  PIECE_KINDS.map((kind, i) => {
    const angle = (i / PIECE_KINDS.length) * Math.PI * 2 - Math.PI / 2;
    const radius = 230 + (i % 3) * 34;
    return {
      id: `piece-${i}`,
      kind,
      color: i % 3 === 0 ? COLORS.turquoise : COLORS.blue,
      size: kind === "cube" ? seededRange(`p-cube-${i}`, 54, 70) : seededRange(`p-flat-${i}`, 38, 52),
      scattered: {
        x: seededRange(`p-sx-${i}`, 1080, 1860),
        y: seededRange(`p-sy-${i}`, 120, 980),
      },
      ordered: {
        x: CENTER.x + Math.cos(angle) * radius,
        y: CENTER.y + Math.sin(angle) * radius * 0.82,
      },
      stagger: Math.floor(seededRange(`p-st-${i}`, 0, 30)),
    };
  });

/** Scene 02 — Inception. Scattered 3D pieces (cubes, circles, squares, triangles) drift
 * into a clear, organized ring around a small plan-node — consultancy read as guided
 * structure, never as people. Right-object / left-text composition. */
export const Scene02Inception: React.FC = () => {
  const frame = useCurrentFrame();
  const pieces = useMemo(buildPieces, []);

  const position = (p: Piece) => {
    const t = interpolate(frame, [ORGANIZE_START + p.stagger, ORGANIZE_END + p.stagger], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(...EASE.standard),
    });
    // guided arc: pieces bow outward slightly along their travel path, echoing the
    // "trayectoria que guía las piezas" the brief asks for
    const bow = Math.sin(t * Math.PI) * 60;
    const x = p.scattered.x + (p.ordered.x - p.scattered.x) * t - bow * 0.3;
    const y = p.scattered.y + (p.ordered.y - p.scattered.y) * t - bow;
    return { x, y, t };
  };

  const settleFrame = (p: Piece) => ORGANIZE_END + p.stagger;

  const clusterRotate = Math.sin(frame / 210) * 4;

  const guidePath = interpolate(frame, [ORGANIZE_START, ORGANIZE_START + 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE.enter),
  });

  const coreAppear = interpolate(frame, [ORGANIZE_END + 10, ORGANIZE_END + 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // transition out — one connection stretches into a whip line that drags the cluster off
  const whip = interpolate(frame, [DURATION - 34, DURATION - 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.7, 0, 0.9, 0),
  });

  return (
    <AbsoluteFill>
      <SceneExit duration={DURATION} exitDuration={16}>
        <AbsoluteFill
          style={{
            transform: `perspective(1400px) rotateY(${clusterRotate}deg)`,
            transformOrigin: `${CENTER.x}px ${CENTER.y}px`,
          }}
        >
          <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0 }}>
            <path
              d={`M 1080 300 C 1220 180, 1520 180, 1660 340 S 1560 780, 1330 860 S 1080 620, 1150 460`}
              fill="none"
              stroke={COLORS.turquoise}
              strokeWidth={1.4}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - guidePath}
              opacity={0.4}
            />
            {pieces.map((p) => {
              const settle = settleFrame(p);
              const pos = position(p);
              const lineP = interpolate(frame, [settle, settle + 16], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(...EASE.enter),
              });
              if (lineP <= 0) return null;
              return (
                <line
                  key={`ln-${p.id}`}
                  x1={CENTER.x}
                  y1={CENTER.y}
                  x2={CENTER.x + (pos.x - CENTER.x) * lineP}
                  y2={CENTER.y + (pos.y - CENTER.y) * lineP}
                  stroke={COLORS.blue}
                  strokeWidth={1}
                  opacity={0.32}
                />
              );
            })}
          </svg>

          <Node3D x={CENTER.x} y={CENTER.y} size={30} color={COLORS.navy} from={ORGANIZE_END + 8} opacity={coreAppear} core={false} />

          {pieces.map((p) => {
            const pos = position(p);
            const whipX = whip * 700;
            const whipOpacity = 1 - whip * 0.9;
            if (p.kind === "cube") {
              return (
                <Cube3D
                  key={p.id}
                  x={pos.x + whipX}
                  y={pos.y}
                  size={p.size}
                  color={p.color}
                  from={Math.max(0, ORGANIZE_START - 10)}
                  rotateX={-16 + pos.t * 10}
                  rotateY={30 + pos.t * 40}
                  opacity={whipOpacity}
                />
              );
            }
            return (
              <div
                key={p.id}
                style={{ position: "absolute", left: pos.x + whipX - p.size / 2, top: pos.y - p.size / 2, opacity: interpolate(frame, [Math.max(0, ORGANIZE_START - 6), ORGANIZE_START + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * whipOpacity }}
              >
                <FloatingPiece type={p.kind as PieceType} size={p.size} color={p.color} />
              </div>
            );
          })}
        </AbsoluteFill>

        <AbsoluteFill style={{ justifyContent: "center", paddingLeft: 150, paddingRight: 980 }}>
          <TitleBlock
            title="INCEPTION"
            description="Consultoría y acompañamiento experto durante la definición de un proyecto."
            from={70}
            align="left"
            maxWidth={620}
          />
        </AbsoluteFill>
      </SceneExit>
    </AbsoluteFill>
  );
};
