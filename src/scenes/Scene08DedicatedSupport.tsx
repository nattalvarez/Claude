import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { COLORS, WIDTH, HEIGHT, EASE, SCENE_DURATIONS, FONT_FAMILY } from "../styles/theme";
import { Node3D } from "../components/Node3D";
import { ConnectionLine } from "../components/ConnectionLine";
import { ParticleFlow } from "../components/ParticleFlow";
import { TitleBlock } from "../components/TitleBlock";
import { SceneExit } from "../components/SceneExit";

const DURATION = SCENE_DURATIONS.support;
const CLIENT = { x: 460, y: 460 };
const SPECIALIST = { x: 1460, y: 460 };
const LINE_FROM = 44;
const LINE_DUR = 40;

const Tag: React.FC<{ x: number; y: number; label: string; from: number }> = ({ x, y, label, from }) => {
  const frame = useCurrentFrame();
  const appear = interpolate(frame, [from, from + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE.out),
  });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) translateY(${interpolate(appear, [0, 1], [10, 0])}px) scale(${interpolate(appear, [0, 1], [0.85, 1])})`,
        opacity: appear,
        background: COLORS.white,
        border: `1px solid ${COLORS.turquoise}66`,
        borderRadius: 999,
        padding: "10px 22px",
        boxShadow: `0 16px 30px -16px ${COLORS.navy}44`,
        fontFamily: FONT_FAMILY,
        fontWeight: 500,
        fontSize: 18,
        letterSpacing: 2,
        color: COLORS.navy,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </div>
  );
};

/** Scene 08 — Dedicated Support. Two large nodes, CLIENTE and ESPECIALISTA SIREC, start
 * apart; a connection draws between them and solidifies with particle traffic; TEMPORAL /
 * PERMANENTE tags mark two points along the same line. Horizontal composition, camera
 * travels from client toward specialist. */
export const Scene08DedicatedSupport: React.FC = () => {
  const frame = useCurrentFrame();

  const cameraX = interpolate(frame, [0, DURATION], [-30, 50], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE.inOut),
  });

  const solidify = interpolate(frame, [LINE_FROM + LINE_DUR, LINE_FROM + LINE_DUR + 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const midX = (CLIENT.x + SPECIALIST.x) / 2;

  return (
    <AbsoluteFill>
      <SceneExit duration={DURATION} exitDuration={16}>
        <AbsoluteFill style={{ transform: `translateX(${cameraX}px)` }}>
          <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0 }}>
            <ConnectionLine x1={CLIENT.x} y1={CLIENT.y} x2={SPECIALIST.x} y2={SPECIALIST.y} from={LINE_FROM} duration={LINE_DUR} color={COLORS.blue} strokeWidth={1.5 + solidify * 1.5} opacity={0.4 + solidify * 0.4} />
            <ParticleFlow id="support-flow-a" x1={CLIENT.x} y1={CLIENT.y} x2={SPECIALIST.x} y2={SPECIALIST.y} from={LINE_FROM + LINE_DUR} count={8} color={COLORS.turquoise} />
            <ParticleFlow id="support-flow-b" x1={SPECIALIST.x} y1={SPECIALIST.y + 14} x2={CLIENT.x} y2={CLIENT.y + 14} from={LINE_FROM + LINE_DUR + 8} count={6} color={COLORS.blue} />
          </svg>

          <Node3D x={CLIENT.x} y={CLIENT.y} size={92} color={COLORS.blue} from={0} core label="Cliente" />
          <Node3D x={SPECIALIST.x} y={SPECIALIST.y} size={92} color={COLORS.turquoise} from={14} core label="Especialista SIREC" />

          <Tag x={midX - 130} y={CLIENT.y - 150} label="TEMPORAL" from={LINE_FROM + LINE_DUR + 20} />
          <Tag x={midX + 130} y={CLIENT.y - 150} label="PERMANENTE" from={LINE_FROM + LINE_DUR + 34} />
        </AbsoluteFill>

        <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 84 }}>
          <TitleBlock
            eyebrow="Servicio SIREC"
            title="DEDICATED SUPPORT"
            description="Asignación directa de especialistas de SIREC a un cliente, de manera temporal o permanente."
            from={20}
            align="center"
            maxWidth={980}
            titleSize={54}
          />
        </AbsoluteFill>
      </SceneExit>
    </AbsoluteFill>
  );
};
