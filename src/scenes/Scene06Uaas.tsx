import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { COLORS, EASE, FONT_FAMILY, SCENE_DURATIONS } from "../styles/theme";
import { Cube3D } from "../components/Cube3D";
import { Panel3D } from "../components/Panel3D";
import { TitleBlock } from "../components/TitleBlock";
import { SceneExit } from "../components/SceneExit";

const DURATION = SCENE_DURATIONS.uaas;
const CENTER = { x: 960, y: 500 };

const STAGES = [
  { color: COLORS.blue, from: 10, to: 88 },
  { color: COLORS.turquoise, from: 92, to: 160 },
  { color: COLORS.navy, from: 164, to: DURATION },
];

const Layer: React.FC<{ stageIndex: number; frame: number }> = ({ stageIndex, frame }) => {
  const stage = STAGES[stageIndex];
  const enter = interpolate(frame, [stage.from, stage.from + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE.out),
  });
  const leave = interpolate(frame, [stage.to - 14, stage.to + 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE.in),
  });
  const opacity = enter * (1 - leave);
  if (opacity <= 0.002) return null;
  const y = CENTER.y - 116 - interpolate(enter, [0, 1], [8, 0]) + leave * -60;

  return (
    <div style={{ position: "absolute", left: CENTER.x - 130, top: y, width: 260, height: 78, opacity, perspective: 700 }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          transform: `rotateX(72deg) scale(${interpolate(enter, [0, 1], [0.85, 1])})`,
          background: `radial-gradient(ellipse at 40% 30%, #FFFFFF, ${stage.color}55 60%, ${stage.color}22)`,
          border: `1.5px solid ${stage.color}88`,
          boxShadow: `0 18px 36px -14px ${stage.color}66`,
        }}
      />
    </div>
  );
};

/** Scene 06 — UaaS. A modular cube swaps two of its layers in sequence, ending in a more
 * refined final state; near the end it breaks into the small cards that Scene 07 opens
 * with. Object central, text framing it above and below. */
export const Scene06Uaas: React.FC = () => {
  const frame = useCurrentFrame();

  const cameraY = interpolate(frame, [0, DURATION], [30, -60], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE.inOut),
  });

  const wordPulse = 1 + Math.max(0, Math.sin(((frame - 140) / 18) * Math.PI)) * (frame > 140 && frame < 158 ? 0.08 : 0);

  const cardsFrom = DURATION - 46;
  const card1 = interpolate(frame, [cardsFrom, DURATION - 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(...EASE.out) });
  const card2 = interpolate(frame, [cardsFrom + 8, DURATION - 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(...EASE.out) });
  const cubeFade = interpolate(frame, [cardsFrom, DURATION - 4], [1, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: COLORS.white }}>
      <SceneExit duration={DURATION} exitDuration={16}>
        <AbsoluteFill style={{ transform: `translateY(${cameraY}px)` }}>
          <Cube3D x={CENTER.x} y={CENTER.y + 30} size={132} color={COLORS.navy} from={0} rotateX={-14} rotateY={24} spinY={0.04} floatAmp={5} opacity={cubeFade} />

          {STAGES.map((_, i) => (
            <Layer key={i} stageIndex={i} frame={frame} />
          ))}

          <div style={{ position: "absolute", left: CENTER.x - 90 - 60 * (1 - card1), top: CENTER.y - 60 - 40 * (1 - card1), opacity: card1 }}>
            <Panel3D x={0} y={0} width={140} height={98} color={COLORS.blue} from={0} rotateX={10} rotateY={-16} floatAmp={0} filled glow />
          </div>
          <div style={{ position: "absolute", left: CENTER.x + 70 + 60 * (1 - card2), top: CENTER.y - 30 - 30 * (1 - card2), opacity: card2 }}>
            <Panel3D x={0} y={0} width={130} height={92} color={COLORS.turquoise} from={0} rotateX={10} rotateY={-16} floatAmp={0} filled glow />
          </div>
        </AbsoluteFill>

        <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: 100 }}>
          <TitleBlock title="UaaS" subtitle="Upgrade as a Service" from={26} align="center" maxWidth={700} />
        </AbsoluteFill>

        <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 118 }}>
          <div
            style={{
              maxWidth: 760,
              textAlign: "center",
              fontFamily: FONT_FAMILY,
              fontWeight: 400,
              fontSize: 24,
              lineHeight: 1.4,
              color: COLORS.blue,
              opacity: interpolate(frame, [52, 76], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              transform: `translateY(${interpolate(frame, [52, 76], [14, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
            }}
          >
            <span style={{ display: "inline-block", fontWeight: 500, color: COLORS.navy, transform: `scale(${wordPulse})` }}>Actualizaciones</span>{" "}
            de software para aprovechar las ventajas de las versiones más recientes del producto.
          </div>
        </AbsoluteFill>
      </SceneExit>
    </AbsoluteFill>
  );
};
