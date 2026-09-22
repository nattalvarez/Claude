import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { COLORS, EASE, SCENE_DURATIONS } from "../styles/theme";
import { Panel3D } from "../components/Panel3D";
import { TitleBlock } from "../components/TitleBlock";
import { SceneExit } from "../components/SceneExit";
import { seededRange } from "../lib/random";

const DURATION = SCENE_DURATIONS.changeManagement;
const COLS = 3;
const ROWS = 3;
const CELL = 158;
const GRID = { x: 560, y: 520 };
const ORGANIZE_START = 16;
const ORGANIZE_END = 118;

type Module = { id: string; ordered: { x: number; y: number }; scattered: { x: number; y: number }; stagger: number; color: string; spin: number };

const buildModules = (): Module[] => {
  const modules: Module[] = [];
  let i = 0;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const ordered = { x: GRID.x + (c - 1) * CELL, y: GRID.y + (r - 1) * CELL };
      modules.push({
        id: `m-${i}`,
        ordered,
        scattered: {
          x: seededRange(`cm-x-${i}`, 120, 900),
          y: seededRange(`cm-y-${i}`, 100, 940),
        },
        stagger: Math.floor(seededRange(`cm-st-${i}`, 0, 48)),
        color: i % 3 === 0 ? COLORS.turquoise : i % 3 === 1 ? COLORS.blue : COLORS.navy,
        spin: seededRange(`cm-spin-${i}`, -50, 50),
      });
      i++;
    }
  }
  return modules;
};

/** Scene 03 — Change Management. Small geometric modules drift in scattered, then settle
 * into a solid, balanced grid — pure reorganization, no arrows or connectors. Composition
 * flips from Scene 02: a large object on the LEFT, text on the RIGHT. */
export const Scene03ChangeManagement: React.FC = () => {
  const frame = useCurrentFrame();
  const modules = useMemo(buildModules, []);

  const settleRotate = interpolate(frame, [DURATION - 56, DURATION - 6], [0, 10], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE.inOut),
  });

  const position = (m: Module) => {
    const t = interpolate(frame, [ORGANIZE_START + m.stagger, ORGANIZE_END + m.stagger], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(...EASE.standard),
    });
    return {
      x: m.scattered.x + (m.ordered.x - m.scattered.x) * t,
      y: m.scattered.y + (m.ordered.y - m.scattered.y) * t,
      settle: t,
    };
  };

  return (
    <AbsoluteFill style={{ background: COLORS.white }}>
      <SceneExit duration={DURATION} exitDuration={16}>
        <AbsoluteFill
          style={{
            transform: `perspective(1600px) rotateY(${settleRotate}deg)`,
            transformOrigin: `${GRID.x}px ${GRID.y}px`,
          }}
        >
          {modules.map((m) => {
            const pos = position(m);
            const spin = m.spin * (1 - pos.settle);
            return (
              <Panel3D
                key={m.id}
                x={pos.x}
                y={pos.y}
                width={CELL - 30}
                height={CELL - 30}
                color={m.color}
                from={0}
                rotateX={8 + spin * 0.3}
                rotateY={-14 + spin}
                floatAmp={2}
                filled={m.color === COLORS.turquoise}
              />
            );
          })}
        </AbsoluteFill>

        <AbsoluteFill style={{ justifyContent: "center", paddingLeft: 1080, paddingRight: 130 }}>
          <TitleBlock
            title="CHANGE MANAGEMENT"
            subtitle="Impulsa la adopción y el máximo aprovechamiento de SIREC."
            description="Modelo de gestión especializado para las organizaciones."
            from={ORGANIZE_END + 20}
            align="left"
            maxWidth={640}
            titleSize={52}
          />
        </AbsoluteFill>
      </SceneExit>
    </AbsoluteFill>
  );
};
