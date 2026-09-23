import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { COLORS, WIDTH, HEIGHT, EASE, SCENE_DURATIONS, SERVICES, FONT_FAMILY } from "../styles/theme";
import { Node3D } from "../components/Node3D";
import { ConnectionLine } from "../components/ConnectionLine";
import { ParticleFlow } from "../components/ParticleFlow";
import { TitleBlock } from "../components/TitleBlock";
import { SceneExit } from "../components/SceneExit";

const DURATION = SCENE_DURATIONS.schema;
const CORE = { x: WIDTH / 2, y: HEIGHT / 2 };
const RADIUS_X = 540;
const RADIUS_Y = 320;
const LABEL_MAX_WIDTH = 200;

const NODES = SERVICES.map((s, i) => {
  const angle = (i / SERVICES.length) * Math.PI * 2 - Math.PI / 2;
  const x = CORE.x + Math.cos(angle) * RADIUS_X;
  const y = CORE.y + Math.sin(angle) * RADIUS_Y;
  return {
    ...s,
    x,
    y,
    labelBelow: y >= CORE.y,
    delay: 44 + i * 13,
    size: 28 + (i % 3) * 5,
    color: i % 2 === 0 ? COLORS.blue : COLORS.turquoise,
  };
});

const TEXT_FROM = 210;
const TEXT_HOLD = 326;
const PULSE_FROM = DURATION - 34;

/** Scene 02 — Se forma el esquema. The camera pulls back from the intro's core to reveal
 * SIREC's model of nine risk-management stages, in a fixed order, orbiting and connecting
 * around it — seguimiento, prevención y anticipación first, then los canales de gestión,
 * cerrando con las vías de resolución. Every node pulses once before the final hold. */
export const Scene02Schema: React.FC = () => {
  const frame = useCurrentFrame();

  const cameraScale = interpolate(frame, [0, 170], [1.65, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE.inOut),
  });

  const nodesDim = interpolate(frame, [TEXT_FROM - 10, TEXT_FROM + 18, TEXT_HOLD, TEXT_HOLD + 22], [1, 0.32, 0.32, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textOpacity = interpolate(frame, [TEXT_FROM, TEXT_FROM + 26, TEXT_HOLD, TEXT_HOLD + 20], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textY = interpolate(frame, [TEXT_FROM, TEXT_FROM + 26], [16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const pulse = useMemo(
    () =>
      interpolate(frame, [PULSE_FROM, PULSE_FROM + 10, PULSE_FROM + 20], [1, 1.35, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(...EASE.standard),
      }),
    [frame]
  );

  const coreIlluminate = interpolate(frame, [PULSE_FROM + 6, DURATION], [1, 1.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <SceneExit duration={DURATION} exitDuration={20}>
        <AbsoluteFill style={{ transform: `scale(${cameraScale})`, transformOrigin: `${CORE.x}px ${CORE.y}px` }}>
          <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0 }}>
            <g opacity={nodesDim}>
              <polygon
                points={NODES.map((n) => `${n.x},${n.y}`).join(" ")}
                fill="none"
                stroke={COLORS.navy}
                strokeWidth={0.8}
                opacity={interpolate(frame, [150, 190], [0, 0.14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
              />
              {NODES.map((n, i) => (
                <ConnectionLine key={`ln-${i}`} x1={CORE.x} y1={CORE.y} x2={n.x} y2={n.y} from={n.delay + 8} duration={24} color={n.color} strokeWidth={1.3} opacity={0.5} />
              ))}
              {NODES.map((n, i) => (
                <ParticleFlow
                  key={`pf-${i}`}
                  id={`schema-pf-${i}`}
                  x1={CORE.x}
                  y1={CORE.y}
                  x2={n.x}
                  y2={n.y}
                  from={n.delay + 30}
                  count={3}
                  color={i % 3 === 0 ? COLORS.navy : n.color}
                />
              ))}
            </g>
          </svg>

          <AbsoluteFill style={{ opacity: nodesDim }}>
            {NODES.map((n, i) => (
              <Node3D
                key={i}
                x={n.x}
                y={n.y}
                size={n.size * (frame >= PULSE_FROM ? pulse : 1)}
                color={n.color}
                from={n.delay}
                label={n.label}
                labelBelow={n.labelBelow}
                labelMaxWidth={LABEL_MAX_WIDTH}
              />
            ))}
          </AbsoluteFill>

          <AbsoluteFill style={{ opacity: interpolate(nodesDim, [0.32, 1], [0.4, 1]) }}>
            <Node3D
              x={CORE.x}
              y={CORE.y}
              size={58 * (frame >= PULSE_FROM ? pulse : 1) * coreIlluminate}
              color={COLORS.blue}
              from={0}
              core
            />
          </AbsoluteFill>
        </AbsoluteFill>

        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: textOpacity }}>
          <div
            style={{
              position: "absolute",
              width: 820,
              height: 420,
              borderRadius: "50%",
              background: `radial-gradient(ellipse, ${COLORS.white}ee 0%, ${COLORS.white}b0 46%, transparent 72%)`,
              filter: "blur(6px)",
            }}
          />
          <div style={{ transform: `translateY(${textY}px)`, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div
              style={{
                fontFamily: FONT_FAMILY,
                fontWeight: 800,
                fontSize: 96,
                letterSpacing: -2,
                color: COLORS.navy,
                textShadow: `0 0 60px ${COLORS.white}, 0 0 30px ${COLORS.white}`,
              }}
            >
              SIREC
            </div>
            <TitleBlock subtitle="Un modelo integral de gestión del riesgo" description="Del seguimiento a la resolución, una misma estructura conectada" from={0} align="center" maxWidth={760} />
          </div>
        </AbsoluteFill>
      </SceneExit>
    </AbsoluteFill>
  );
};
