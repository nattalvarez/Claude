import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig, Easing } from "remotion";
import { COLORS, EASE, SCENE_DURATIONS } from "../styles/theme";
import { Cube3D } from "../components/Cube3D";
import { TechIcon } from "../components/TechIcon";
import { Surface } from "../components/Surface";
import { TitleBlock } from "../components/TitleBlock";
import { SceneExit } from "../components/SceneExit";

const DURATION = SCENE_DURATIONS.sats;
const CENTER = { x: 960, y: 380 };

const SCATTERED = [
  { dx: -300, dy: -170 },
  { dx: -60, dy: -210 },
  { dx: 220, dy: -150 },
  { dx: -260, dy: 70 },
  { dx: 30, dy: 5 },
  { dx: 280, dy: 90 },
  { dx: -110, dy: 140 },
  { dx: 170, dy: 145 },
];

const CUBES = SCATTERED.map((d, i) => ({
  id: `c-${i}`,
  scattered: { x: CENTER.x + d.dx * 1.15, y: CENTER.y + d.dy * 1.15 },
  settled: { x: CENTER.x + d.dx, y: CENTER.y + d.dy },
  size: 78 + (i % 3) * 8,
  enterFrom: 4 + i * 5,
  checkFrom: 40 + i * 13,
}));

/** Scene 04 — SATS. Eight small cubes arrive in quick, orderly succession — no scattered
 * chaos — each lighting up its own check mark in sequence, then the cluster tightens into
 * a final geometric composition. An abstract testing installation, never a software UI. */
export const Scene04Sats: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const settle = interpolate(frame, [150, 210], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE.inOut),
  });

  const cameraZoom = interpolate(frame, [0, DURATION], [1, 1.08], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE.inOut),
  });
  const cameraLift = interpolate(frame, [DURATION - 40, DURATION], [0, -30], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE.inOut),
  });

  return (
    <AbsoluteFill style={{ background: COLORS.white }}>
      <SceneExit duration={DURATION} exitDuration={16}>
        <AbsoluteFill
          style={{
            transform: `scale(${cameraZoom}) translateY(${cameraLift}px)`,
            transformOrigin: `${CENTER.x}px ${CENTER.y}px`,
          }}
        >
          {CUBES.map((c) => {
            const x = c.scattered.x + (c.settled.x - c.scattered.x) * settle;
            const y = c.scattered.y + (c.settled.y - c.scattered.y) * settle;
            const checkAppear = spring({ frame: frame - c.checkFrom, fps, config: { damping: 12, mass: 0.5, stiffness: 220 } });
            return (
              <React.Fragment key={c.id}>
                <Cube3D x={x} y={y} size={c.size} color={COLORS.blue} from={c.enterFrom} rotateX={-16} rotateY={28} spinY={0.025} floatAmp={3} />
                <div
                  style={{
                    position: "absolute",
                    left: x - c.size * 0.18,
                    top: y - c.size * 0.78,
                    opacity: interpolate(checkAppear, [0, 1], [0, 1]),
                    transform: `scale(${interpolate(checkAppear, [0, 1], [0.4, 1])})`,
                    width: c.size * 0.36,
                    height: c.size * 0.36,
                    borderRadius: "50%",
                    background: COLORS.white,
                    boxShadow: `0 10px 22px -8px ${COLORS.turquoise}88`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <TechIcon type="check" color={COLORS.turquoise} size={c.size * 0.24} />
                </div>
              </React.Fragment>
            );
          })}
        </AbsoluteFill>

        <AbsoluteFill>
          <Surface x={960} y={690} width={760} from={24} align="center">
            <TitleBlock
              title="SATS"
              subtitle="SIREC Automated Testing Suite"
              description="Automatización de pruebas para SIREC que ayuda a reducir costes y mejorar el time to market."
              from={30}
              align="center"
              maxWidth={660}
              titleSize={56}
            />
          </Surface>
        </AbsoluteFill>
      </SceneExit>
    </AbsoluteFill>
  );
};
