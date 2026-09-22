import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { COLORS, EASE, SCENE_DURATIONS } from "../styles/theme";
import { Cube3D } from "../components/Cube3D";
import { FloatingPiece } from "../components/FloatingPiece";
import { Surface } from "../components/Surface";
import { TitleBlock } from "../components/TitleBlock";
import { SceneExit } from "../components/SceneExit";

const DURATION = SCENE_DURATIONS.inception;
const ICON = { x: 1430, y: 470 };
const ASSEMBLE_END = 78;
const DISMANTLE_START = DURATION - 44;

type PieceTravel = { start: { x: number; y: number }; end: { x: number; y: number }; exit: { x: number; y: number }; from: number };

const CUBE: PieceTravel = { start: { x: ICON.x - 20, y: -180 }, end: { x: ICON.x + 46, y: ICON.y - 10 }, exit: { x: ICON.x + 40, y: -220 }, from: 8 };
const CIRCLE: PieceTravel = { start: { x: 2160, y: ICON.y - 40 }, end: { x: ICON.x - 70, y: ICON.y - 60 }, exit: { x: 2200, y: ICON.y - 100 }, from: 22 };
const SQUARE: PieceTravel = { start: { x: ICON.x - 30, y: 1220 }, end: { x: ICON.x - 24, y: ICON.y + 96 }, exit: { x: ICON.x - 10, y: 1240 }, from: 36 };

const travel = (p: PieceTravel, frame: number) => {
  const arrive = interpolate(frame, [p.from, ASSEMBLE_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE.out),
  });
  const leave = interpolate(frame, [DISMANTLE_START, DURATION - 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE.in),
  });
  const base = arrive < 1 ? { x: p.start.x + (p.end.x - p.start.x) * arrive, y: p.start.y + (p.end.y - p.start.y) * arrive } : p.end;
  return {
    x: base.x + (p.exit.x - p.end.x) * leave,
    y: base.y + (p.exit.y - p.end.y) * leave,
    opacity: 1 - leave,
  };
};

/** Scene 02 — Inception. A bespoke three-piece mark assembles from three directions
 * (top, right, bottom) into a compact icon, then a raised white surface carries the
 * title and one line of description. Text left, object right — the piece's first
 * asymmetric composition. */
export const Scene02Inception: React.FC = () => {
  const frame = useCurrentFrame();

  const cube = travel(CUBE, frame);
  const circle = travel(CIRCLE, frame);
  const square = travel(SQUARE, frame);

  const idleRotate = Math.sin(frame / 130) * 3;

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${COLORS.white} 60%, ${COLORS.lightBlue}22)` }}>
      <SceneExit duration={DURATION} exitDuration={16}>
        <AbsoluteFill style={{ transform: `rotate(${idleRotate}deg)`, transformOrigin: `${ICON.x}px ${ICON.y}px` }}>
          <Cube3D x={cube.x} y={cube.y} size={92} color={COLORS.blue} from={0} rotateX={-18} rotateY={30} spinY={0.02} floatAmp={3} opacity={cube.opacity} />
          <div style={{ position: "absolute", left: circle.x - 34, top: circle.y - 34, opacity: circle.opacity }}>
            <FloatingPiece type="circle" size={68} color={COLORS.turquoise} />
          </div>
          <div style={{ position: "absolute", left: square.x - 27, top: square.y - 27, opacity: square.opacity }}>
            <FloatingPiece type="square" size={54} color={COLORS.navy} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <Surface x={150} y={430} width={560} from={ASSEMBLE_END - 4}>
            <TitleBlock
              title="INCEPTION"
              description="Consultoría y acompañamiento experto durante la definición de un proyecto."
              from={ASSEMBLE_END + 4}
              align="left"
              maxWidth={470}
              titleSize={58}
            />
          </Surface>
        </AbsoluteFill>
      </SceneExit>
    </AbsoluteFill>
  );
};
