import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { COLORS, EASE, FONT_FAMILY, SCENE_DURATIONS } from "../styles/theme";
import { Cube3D } from "../components/Cube3D";
import { Node3D } from "../components/Node3D";
import { FloatingPiece, PieceType } from "../components/FloatingPiece";
import { TitleBlock } from "../components/TitleBlock";
import { SceneExit } from "../components/SceneExit";
import { seededRange } from "../lib/random";

const DURATION = SCENE_DURATIONS.intro;
const CENTER = { x: 960, y: 350 };
const EXIT_TARGET_X = 1360;
const CUBE_GROW_END = 88;
const EXIT_START = DURATION - 34;

type Ambient = { x: number; y: number; kind: "circle" | "square" | "point"; size: number; color: string; from: number; driftPhase: number };

const buildAmbient = (): Ambient[] =>
  Array.from({ length: 7 }).map((_, i) => {
    const angle = (i / 7) * Math.PI * 2;
    const radius = seededRange(`a-r-${i}`, 200, 360);
    return {
      x: CENTER.x + Math.cos(angle) * radius,
      y: CENTER.y + Math.sin(angle) * radius * 0.55,
      kind: (["circle", "square", "point"] as const)[i % 3],
      size: seededRange(`a-s-${i}`, 10, 24),
      color: i % 2 === 0 ? COLORS.blue : COLORS.turquoise,
      from: 12 + i * 6,
      driftPhase: seededRange(`a-p-${i}`, 0, Math.PI * 2),
    };
  });

/** Scene 01 — Introducción. A single elegant cube grows at the top of a clean white frame
 * while unconnected geometric shapes drift around it — never touching, never linked. Once
 * the cube settles, the title reveals in independent blocks well below it, with generous
 * room to read before the cube glides right to make way for Inception. */
export const Scene01Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const ambient = useMemo(buildAmbient, []);

  const cubeSize = interpolate(frame, [0, CUBE_GROW_END], [38, 148], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE.inOut),
  });

  const cameraZoom = interpolate(frame, [0, DURATION - 30], [1, 1.06], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE.inOut),
  });

  const exitProgress = interpolate(frame, [EXIT_START, DURATION - 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE.inOut),
  });
  const cubeX = CENTER.x + (EXIT_TARGET_X - CENTER.x) * exitProgress;
  const cameraPanX = interpolate(frame, [EXIT_START, DURATION - 4], [0, 70], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE.inOut),
  });

  const titleFade = interpolate(frame, [EXIT_START, EXIT_START + 20], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: COLORS.white }}>
      <SceneExit duration={DURATION} exitDuration={16}>
        <AbsoluteFill style={{ transform: `scale(${cameraZoom}) translateX(${cameraPanX}px)`, transformOrigin: `${CENTER.x}px ${CENTER.y}px` }}>
          {ambient.map((a, i) => {
            const drift = Math.sin(frame / 90 + a.driftPhase) * 12;
            if (a.kind === "point") {
              return <Node3D key={i} x={a.x + drift} y={a.y} size={a.size * 0.55} color={a.color} from={a.from} breathe />;
            }
            return (
              <div key={i} style={{ position: "absolute", left: a.x + drift - a.size / 2, top: a.y - a.size / 2 }}>
                <FloatingPiece type={a.kind as PieceType} size={a.size} color={a.color} />
              </div>
            );
          })}

          <Cube3D x={cubeX} y={CENTER.y} size={cubeSize} color={COLORS.blue} from={0} rotateX={-20} rotateY={26} spinY={0.05} floatAmp={4} />
        </AbsoluteFill>

        <AbsoluteFill style={{ alignItems: "center", paddingTop: 600, opacity: titleFade }}>
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontWeight: 800,
              fontSize: 104,
              letterSpacing: -2,
              color: COLORS.navy,
              opacity: interpolate(frame, [CUBE_GROW_END + 8, CUBE_GROW_END + 36], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              transform: `translateY(${interpolate(frame, [CUBE_GROW_END + 8, CUBE_GROW_END + 36], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
            }}
          >
            SIREC
          </div>
          <div style={{ marginTop: 18 }}>
            <TitleBlock subtitle="Un ecosistema de servicios alrededor de la plataforma" from={CUBE_GROW_END + 20} align="center" maxWidth={860} />
          </div>
          <div style={{ marginTop: 4 }}>
            <TitleBlock description="Soluciones especializadas para acompañar todo el ciclo de vida de SIREC" from={CUBE_GROW_END + 40} align="center" maxWidth={760} />
          </div>
        </AbsoluteFill>
      </SceneExit>
    </AbsoluteFill>
  );
};
