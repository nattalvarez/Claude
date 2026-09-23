import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { COLORS, WIDTH, HEIGHT, EASE, SCENE_DURATIONS } from "../styles/theme";
import { Node3D } from "../components/Node3D";
import { Panel3D } from "../components/Panel3D";
import { ConnectionLine } from "../components/ConnectionLine";
import { TechIcon, IconType } from "../components/TechIcon";
import { TitleBlock } from "../components/TitleBlock";
import { SceneExit } from "../components/SceneExit";

const DURATION = SCENE_DURATIONS.taas;
const CORE = { x: 960, y: 370 };

const CARDS: Array<{ x: number; y: number; icon: IconType; from: number }> = [
  { x: 600, y: 230, icon: "play", from: 40 },
  { x: 1320, y: 230, icon: "doc", from: 56 },
  { x: 420, y: 470, icon: "screen", from: 72 },
  { x: 1500, y: 470, icon: "check", from: 88 },
  { x: 960, y: 160, icon: "node", from: 30 },
];

/** Scene 07 — TaaS. A knowledge tree: a central core with branches ending in floating
 * training-content cards. Central knowledge-structure composition — the piece's most
 * different silhouette, all activity above the title band. */
export const Scene07Taas: React.FC = () => {
  const frame = useCurrentFrame();

  const coreAppear = interpolate(frame, [0, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE.out),
  });

  const driftX = Math.sin(frame / 90) * 8;

  return (
    <AbsoluteFill>
      <SceneExit duration={DURATION} exitDuration={16}>
        <AbsoluteFill style={{ transform: `translateX(${driftX}px)` }}>
          <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0 }}>
            {CARDS.map((c, i) => (
              <ConnectionLine key={i} x1={CORE.x} y1={CORE.y} x2={c.x} y2={c.y} from={c.from - 14} duration={24} color={COLORS.turquoise} strokeWidth={1.2} opacity={0.4} />
            ))}
          </svg>

          <Node3D x={CORE.x} y={CORE.y} size={40} color={COLORS.navy} from={0} core opacity={coreAppear} />

          {CARDS.map((c, i) => {
            const floatY = Math.sin(frame / 55 + i) * 6;
            return (
              <Panel3D
                key={i}
                x={c.x}
                y={c.y + floatY}
                width={158}
                height={112}
                color={i % 2 === 0 ? COLORS.blue : COLORS.turquoise}
                from={c.from}
                rotateX={10}
                rotateY={i % 2 === 0 ? -16 : 16}
                floatAmp={0}
                filled
              >
                <TechIcon type={c.icon} color={i % 2 === 0 ? COLORS.blue : COLORS.turquoise} size={34} />
              </Panel3D>
            );
          })}
        </AbsoluteFill>

        <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 90 }}>
          <TitleBlock
            title="TaaS"
            subtitle="Training as a Service"
            description="Formación planificada con sesiones presenciales y acceso a contenido formativo."
            from={110}
            align="center"
            maxWidth={880}
          />
        </AbsoluteFill>
      </SceneExit>
    </AbsoluteFill>
  );
};
