import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { COLORS, WIDTH, HEIGHT, EASE, SCENE_DURATIONS, FONT_FAMILY } from "../styles/theme";
import { Cube3D } from "../components/Cube3D";
import { ParticleFlow } from "../components/ParticleFlow";
import { TitleBlock } from "../components/TitleBlock";
import { SceneExit } from "../components/SceneExit";

const DURATION = SCENE_DURATIONS.uaas;
const CENTER = { x: 960, y: 540 };

const STAGES = [
  { label: "VERSIÓN ACTUAL", color: COLORS.blue, from: 12, to: 92 },
  { label: "ACTUALIZACIÓN", color: COLORS.turquoise, from: 96, to: 170 },
  { label: "NUEVA VERSIÓN", color: COLORS.navy, from: 174, to: DURATION },
];

/** A stacked "disc" plate viewed in perspective — one evolutionary layer of the product. */
const Layer: React.FC<{ stageIndex: number; frame: number }> = ({ stageIndex, frame }) => {
  const stage = STAGES[stageIndex];
  const enter = interpolate(frame, [stage.from, stage.from + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE.out),
  });
  const liftOff = interpolate(frame, [stage.to - 16, stage.to + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE.in),
  });
  const opacity = enter * (1 - liftOff);
  if (opacity <= 0.002) return null;
  const y = CENTER.y - 110 - interpolate(enter, [0, 1], [10, 0]) + liftOff * -70;
  const scale = interpolate(enter, [0, 1], [0.85, 1]);

  return (
    <div
      style={{
        position: "absolute",
        left: CENTER.x - 130,
        top: y,
        width: 260,
        height: 84,
        opacity,
        perspective: 700,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          transform: `rotateX(72deg) scale(${scale})`,
          background: `radial-gradient(ellipse at 40% 30%, #FFFFFF, ${stage.color}55 60%, ${stage.color}22)`,
          border: `1.5px solid ${stage.color}88`,
          boxShadow: `0 20px 40px -14px ${stage.color}66`,
        }}
      />
    </div>
  );
};

/** Scene 06 — UaaS. A central 3D module evolves through three stacked "version" layers —
 * one lifts away as the next settles in — while particles trace an ascending path and the
 * camera drifts slowly upward. Central object, ascending camera. */
export const Scene06Uaas: React.FC = () => {
  const frame = useCurrentFrame();

  const cameraY = interpolate(frame, [0, DURATION], [55, -135], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE.inOut),
  });

  return (
    <AbsoluteFill>
      <SceneExit duration={DURATION} exitDuration={16}>
        <AbsoluteFill style={{ transform: `translateY(${cameraY}px)` }}>
          <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0 }}>
            {[-220, 220].map((dx, i) => (
              <ParticleFlow
                key={i}
                id={`uaas-up-${i}`}
                x1={CENTER.x + dx}
                y1={HEIGHT - 60}
                x2={CENTER.x + dx * 0.55}
                y2={140}
                from={20}
                count={5}
                jitter={1.5}
                maxOpacity={0.5}
                color={i === 0 ? COLORS.turquoise : COLORS.blue}
                speed={0.0055 + i * 0.0012}
              />
            ))}
          </svg>

          <Cube3D x={CENTER.x} y={CENTER.y + 40} size={128} color={COLORS.navy} from={0} rotateX={-14} rotateY={24} spinY={0.045} floatAmp={6} />

          {STAGES.map((_, i) => (
            <Layer key={i} stageIndex={i} frame={frame} />
          ))}

          {STAGES.map((s, i) => {
            const visible = interpolate(frame, [s.from, s.from + 16, s.to - 10, s.to + 4], [0, 1, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            if (visible <= 0.002) return null;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: CENTER.x - 160,
                  top: CENTER.y + 260,
                  width: 320,
                  textAlign: "center",
                  opacity: visible,
                  fontFamily: FONT_FAMILY,
                  fontWeight: 500,
                  fontSize: 24,
                  letterSpacing: 2.5,
                  color: s.color,
                }}
              >
                {s.label}
              </div>
            );
          })}
        </AbsoluteFill>

        <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: 96 }}>
          <TitleBlock
            title="UaaS"
            subtitle="Upgrade as a Service"
            description="Actualizaciones de software para aprovechar las ventajas de las versiones más recientes del producto."
            from={30}
            align="center"
            maxWidth={900}
          />
        </AbsoluteFill>
      </SceneExit>
    </AbsoluteFill>
  );
};
