import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { COLORS, WIDTH, HEIGHT, EASE, SCENE_DURATIONS } from "../styles/theme";
import { Panel3D } from "../components/Panel3D";
import { ParticleFlow } from "../components/ParticleFlow";
import { TitleBlock } from "../components/TitleBlock";
import { SceneExit } from "../components/SceneExit";
import { seededRange } from "../lib/random";

const DURATION = SCENE_DURATIONS.changeManagement;
const COLS = 4;
const ROWS = 3;
const CELL_W = 168;
const CELL_H = 118;
const GRID_X = WIDTH / 2 - ((COLS - 1) * CELL_W) / 2;
const GRID_Y = 560;
const ORGANIZE_START = 22;
const ORGANIZE_END = 128;

type Approach = "up" | "down" | "left" | "right";

type Module = {
  id: string;
  approach: Approach;
  ordered: { x: number; y: number };
  scattered: { x: number; y: number };
  stagger: number;
  color: string;
};

const buildModules = (): Module[] => {
  const modules: Module[] = [];
  let i = 0;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const ordered = { x: GRID_X + c * CELL_W, y: GRID_Y + r * CELL_H };
      const approach: Approach = (["up", "down", "left", "right"] as const)[i % 4];
      const scattered =
        approach === "up"
          ? { x: ordered.x + seededRange(`cm-jx-${i}`, -80, 80), y: HEIGHT + 140 }
          : approach === "down"
          ? { x: ordered.x + seededRange(`cm-jx-${i}`, -80, 80), y: -160 }
          : approach === "left"
          ? { x: -200, y: ordered.y + seededRange(`cm-jy-${i}`, -60, 60) }
          : { x: WIDTH + 200, y: ordered.y + seededRange(`cm-jy-${i}`, -60, 60) };
      modules.push({
        id: `m-${i}`,
        approach,
        ordered,
        scattered,
        stagger: Math.floor(seededRange(`cm-st-${i}`, 0, 46)),
        color: i % 3 === 0 ? COLORS.turquoise : COLORS.blue,
      });
      i++;
    }
  }
  return modules;
};

/** Scene 03 — Change Management. Square modules fly in from every direction (never
 * people) and lock into an organized grid while the camera pans laterally; blue
 * particles trace each module's path in. Central structure with floating text. */
export const Scene03ChangeManagement: React.FC = () => {
  const frame = useCurrentFrame();
  const modules = useMemo(buildModules, []);

  const cameraX = interpolate(frame, [0, DURATION], [-70, 70], {
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
      t,
    };
  };

  const titleFloat = Math.sin(frame / 50) * 6;

  const gridGlowIn = interpolate(frame, [ORGANIZE_END, ORGANIZE_END + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <SceneExit duration={DURATION} exitDuration={16}>
        <AbsoluteFill style={{ transform: `translateX(${cameraX}px)` }}>
          <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0 }}>
            {modules.map((m) => (
              <ParticleFlow
                key={`flow-${m.id}`}
                id={`flow-${m.id}`}
                x1={m.scattered.x}
                y1={m.scattered.y}
                x2={m.ordered.x}
                y2={m.ordered.y}
                from={ORGANIZE_START + m.stagger}
                count={4}
                color={COLORS.blue}
                size={2}
                maxOpacity={0.6}
              />
            ))}
            <rect
              x={GRID_X - CELL_W / 2 - 14}
              y={GRID_Y - CELL_H / 2 - 14}
              width={(COLS - 1) * CELL_W + CELL_W + 28}
              height={(ROWS - 1) * CELL_H + CELL_H + 28}
              rx={26}
              fill="none"
              stroke={COLORS.turquoise}
              strokeWidth={1}
              strokeDasharray="2 10"
              opacity={gridGlowIn * 0.35}
            />
          </svg>

          {modules.map((m) => {
            const pos = position(m);
            return (
              <Panel3D
                key={m.id}
                x={pos.x}
                y={pos.y}
                width={CELL_W - 26}
                height={CELL_H - 22}
                color={m.color}
                from={0}
                rotateX={6 + (1 - pos.t) * 14}
                rotateY={-10 + (1 - pos.t) * 18}
                floatAmp={3}
                filled={m.color === COLORS.turquoise}
              >
                <div style={{ width: 16, height: 16, borderRadius: 4, background: m.color, transform: "rotate(45deg)" }} />
              </Panel3D>
            );
          })}
        </AbsoluteFill>

        <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: 100 }}>
          <div style={{ transform: `translateY(${titleFloat}px)` }}>
            <TitleBlock
              eyebrow="Servicio SIREC"
              title="CHANGE MANAGEMENT"
              description="Modelo de gestión especializado para impulsar la adopción y el máximo aprovechamiento de SIREC."
              from={140}
              align="center"
              maxWidth={980}
              titleSize={58}
            />
          </div>
        </AbsoluteFill>
      </SceneExit>
    </AbsoluteFill>
  );
};
