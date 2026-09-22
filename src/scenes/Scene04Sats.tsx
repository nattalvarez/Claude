import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing, spring, useVideoConfig } from "remotion";
import { COLORS, WIDTH, HEIGHT, EASE, SCENE_DURATIONS } from "../styles/theme";
import { Cube3D } from "../components/Cube3D";
import { TechIcon } from "../components/TechIcon";
import { ParticleFlow } from "../components/ParticleFlow";
import { TitleBlock } from "../components/TitleBlock";
import { SceneExit } from "../components/SceneExit";
import { seededRange } from "../lib/random";

const DURATION = SCENE_DURATIONS.sats;

const CUBES = [
  { x: 360, y: 300, size: 92 },
  { x: 640, y: 230, size: 78 },
  { x: 260, y: 560, size: 84 },
  { x: 560, y: 540, size: 100 },
  { x: 800, y: 460, size: 76 },
  { x: 430, y: 800, size: 88 },
].map((c, i) => ({ ...c, id: `cube-${i}`, checkFrom: 34 + i * 16 }));

/** Scene 04 — SATS. A cluster of 3D test cubes, each with a check mark that lights up
 * in sequence, then a data line sweeps through and links them all. Diagonal travelling
 * camera. 3D structure left, text right. */
export const Scene04Sats: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cameraX = interpolate(frame, [0, DURATION], [-40, 60], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE.inOut),
  });
  const cameraY = interpolate(frame, [0, DURATION], [30, -40], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE.inOut),
  });

  const lastCheck = Math.max(...CUBES.map((c) => c.checkFrom));
  const linkFrom = lastCheck + 20;

  const linkPath = useMemo(() => {
    return CUBES.map((c) => `${c.x},${c.y}`).join(" L ");
  }, []);

  const linkProgress = interpolate(frame, [linkFrom, linkFrom + 46], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE.enter),
  });

  return (
    <AbsoluteFill>
      <SceneExit duration={DURATION} exitDuration={16}>
        <AbsoluteFill style={{ transform: `translate(${cameraX}px, ${cameraY}px)` }}>
          <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0 }}>
            <path
              d={`M ${linkPath}`}
              fill="none"
              stroke={COLORS.turquoise}
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - linkProgress}
              opacity={0.55}
            />
            {CUBES.slice(0, -1).map((c, i) => {
              const next = CUBES[i + 1];
              return (
                <ParticleFlow
                  key={`pf-${c.id}`}
                  id={`sats-flow-${i}`}
                  x1={c.x}
                  y1={c.y}
                  x2={next.x}
                  y2={next.y}
                  from={linkFrom + 30}
                  count={3}
                  color={COLORS.blue}
                  maxOpacity={0.7}
                />
              );
            })}
          </svg>

          {CUBES.map((c) => {
            const checkAppear = spring({ frame: frame - c.checkFrom, fps, config: { damping: 12, mass: 0.5, stiffness: 220 } });
            return (
              <React.Fragment key={c.id}>
                <Cube3D x={c.x} y={c.y} size={c.size} color={COLORS.blue} from={c.id === "cube-0" ? 0 : 10} rotateX={-18} rotateY={28} spinY={0.05} floatAmp={4} />
                <div
                  style={{
                    position: "absolute",
                    left: c.x - 20,
                    top: c.y - c.size * 0.72 - 30,
                    opacity: interpolate(checkAppear, [0, 1], [0, 1]),
                    transform: `scale(${interpolate(checkAppear, [0, 1], [0.4, 1])})`,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: COLORS.white,
                      boxShadow: `0 10px 24px -8px ${COLORS.turquoise}88`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <TechIcon type="check" color={COLORS.turquoise} size={26} />
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </AbsoluteFill>

        <AbsoluteFill style={{ justifyContent: "center", paddingRight: 150, paddingLeft: 980 }}>
          <TitleBlock
            eyebrow="Servicio SIREC"
            title="SATS"
            subtitle="SIREC Automated Testing Suite"
            description="Automatización de pruebas para SIREC que ayuda a reducir costes y mejorar el time to market."
            from={40}
            align="left"
            maxWidth={620}
          />
        </AbsoluteFill>
      </SceneExit>
    </AbsoluteFill>
  );
};
