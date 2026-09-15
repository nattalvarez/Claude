import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { SceneFrame } from "../components/SceneFrame";
import { Wordmark, WordReveal } from "../components/Typography";
import { CameraRig } from "../three/CameraRig";
import { LightingLight } from "../three/Lighting";
import { CamKeyframe } from "../three/camera";
import { Plate, Ring, Cube } from "../three/Primitives";
import { COLORS, EASE, SPRING, WIDTH, HEIGHT } from "../styles/theme";

const CAM: CamKeyframe[] = [
  { frame: 0, position: [-6.4, 1.15, 6.6], lookAt: [0, 1.2, 0], fov: 32 },
  { frame: 78, position: [-1.2, 2.05, 7.9], lookAt: [0, 1.65, 0], fov: 29.5 },
  { frame: 136, position: [3.1, 1.55, 6.3], lookAt: [0, 1.35, 0], fov: 28.5, easing: EASE.inOut },
];

type Module = {
  pos: [number, number, number];
  size: [number, number, number];
  rot?: [number, number, number];
  color: string;
  delay: number;
  fromDir: [number, number, number];
};

const MODULES: Module[] = [
  { pos: [-1.8, 0.08, 0], size: [2.6, 0.16, 1.3], rot: [0, -0.08, 0], color: COLORS.blue, delay: 0, fromDir: [-2.4, 1.6, 0] },
  { pos: [0.1, 0.08, 0.2], size: [2.2, 0.16, 1.4], rot: [0, 0.06, 0], color: COLORS.lightBlue, delay: 3, fromDir: [1.6, 2.2, 0.6] },
  { pos: [1.9, 0.08, -0.3], size: [1.6, 0.16, 1.1], rot: [0, -0.11, 0], color: COLORS.white, delay: 6, fromDir: [2.6, 1.8, -0.4] },
  { pos: [-1.4, 0.55, 0.35], size: [1.9, 0.16, 1.0], rot: [0, 0.09, 0], color: COLORS.lightBlue, delay: 9, fromDir: [-2, -1.6, 1.2] },
  { pos: [0.3, 0.55, -0.2], size: [1.7, 0.16, 1.2], rot: [0, -0.07, 0], color: COLORS.white, delay: 12, fromDir: [0.4, -2.2, -1.4] },
  { pos: [-2.1, 1.0, 0.1], size: [1.2, 0.16, 0.9], rot: [0, 0.13, 0], color: COLORS.blue, delay: 16, fromDir: [-2.6, 1.4, 0.8] },
  { pos: [-0.5, 1.0, 0.4], size: [1.5, 0.16, 1.0], rot: [0, -0.05, 0], color: COLORS.navy, delay: 19, fromDir: [0.2, 2, 1.6] },
  { pos: [1.1, 1.0, -0.15], size: [1.3, 0.16, 0.95], rot: [0, 0.1, 0], color: COLORS.lightBlue, delay: 22, fromDir: [2.2, -1.4, -1], },
  { pos: [-1.1, 1.45, -0.1], size: [1.05, 0.16, 0.8], rot: [0, -0.12, 0], color: COLORS.white, delay: 26, fromDir: [-1.8, -1.8, -1.2] },
  { pos: [0.5, 1.45, 0.15], size: [1.15, 0.16, 0.85], rot: [0, 0.07, 0], color: COLORS.blue, delay: 29, fromDir: [1.4, 2, 1] },
  { pos: [-0.35, 1.9, 0.05], size: [0.9, 0.16, 0.7], rot: [0, -0.09, 0], color: COLORS.navy, delay: 33, fromDir: [-1, -2, 0.6] },
  { pos: [0.9, 1.9, -0.1], size: [0.75, 0.16, 0.6], rot: [0, 0.14, 0], color: COLORS.turquoise, delay: 36, fromDir: [2, 1.2, -1.6] },
  { pos: [0.1, 2.35, 0], size: [0.6, 0.16, 0.5], rot: [0, -0.06, 0], color: COLORS.turquoise, delay: 40, fromDir: [0.2, 2.4, 0.2] },
];

const RINGS: { pos: [number, number, number]; radius: number; delay: number }[] = [
  { pos: [-2.5, 1.8, -0.5], radius: 0.55, delay: 46 },
  { pos: [2.4, 0.9, 0.6], radius: 0.4, delay: 50 },
];

const Scene3D: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <>
      <color attach="background" args={[COLORS.offWhite]} />
      <fog attach="fog" args={[COLORS.offWhite, 6, 20]} />
      <LightingLight keyIntensity={1.5} />
      <CameraRig keyframes={CAM} />
      <group position={[0, -0.25, 0]}>
        {MODULES.map((m, i) => {
          const p = spring({ frame: frame - m.delay, fps, config: SPRING.smooth });
          const x = m.pos[0] + m.fromDir[0] * (1 - p);
          const y = m.pos[1] + m.fromDir[1] * (1 - p);
          const z = m.pos[2] + m.fromDir[2] * (1 - p);
          const breathe = frame > m.delay + 40 ? Math.sin(frame / 45 + i) * 0.01 : 0;
          return (
            <Plate
              key={i}
              position={[x, y + breathe, z]}
              size={m.size}
              color={m.color}
              rotation={m.rot}
              opacity={interpolate(p, [0, 1], [0, 1])}
              roughness={0.5}
              metalness={0.12}
            />
          );
        })}
        {RINGS.map((r, i) => {
          const p = spring({ frame: frame - r.delay, fps, config: SPRING.bouncy });
          const spin = frame / 140 + i;
          return (
            <Ring
              key={i}
              position={r.pos}
              radius={r.radius * p}
              tube={0.028}
              color={COLORS.turquoise}
              rotation={[Math.PI / 2.3, spin, 0]}
              opacity={p}
            />
          );
        })}
        <Cube position={[-2.7, 0.3, 1.1]} size={0.18} color={COLORS.turquoise} opacity={spring({ frame: frame - 44, fps, config: SPRING.snappy })} />
        <Cube position={[2.7, 1.6, -0.8]} size={0.14} color={COLORS.blue} opacity={spring({ frame: frame - 48, fps, config: SPRING.snappy })} />
      </group>
    </>
  );
};

/** 0:04–0:08 — SIREC. A modular structure assembles as the camera arcs
 * laterally around it; the wordmark settles once the architecture is whole. */
export const Scene02Sirec: React.FC<{
  from: number;
  duration: number;
  nominalDuration: number;
  hasIncoming: boolean;
  hasOutgoing: boolean;
}> = ({ nominalDuration, hasIncoming, hasOutgoing }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const wordmarkP = spring({ frame: frame - 80, fps, config: SPRING.smooth });

  return (
    <SceneFrame variant="light" nominalDuration={nominalDuration} hasIncoming={hasIncoming} hasOutgoing={hasOutgoing}>
      <AbsoluteFill>
        <ThreeCanvas width={WIDTH} height={HEIGHT} linear gl={{ antialias: true }}>
          <Scene3D />
        </ThreeCanvas>
      </AbsoluteFill>

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 92 }}>
        <AbsoluteFill
          style={{
            opacity: wordmarkP,
            background: `linear-gradient(180deg, transparent, ${COLORS.offWhite}00 42%, ${COLORS.offWhite}f2 58%, ${COLORS.offWhite} 100%)`,
          }}
        />
        <div style={{ opacity: wordmarkP, transform: `translateY(${interpolate(wordmarkP, [0, 1], [22, 0])}px)` }}>
          <Wordmark from={80} fontSize={104} color={COLORS.navy} ruleColor={COLORS.turquoise} />
        </div>
        <div style={{ marginTop: 22, width: 720 }}>
          <WordReveal
            parts={[{ text: "La plataforma " }, { text: "agéntica", color: COLORS.turquoise }, { text: " para la gestión del riesgo de crédito." }]}
            from={98}
            fontSize={26}
            weight={500}
            color={COLORS.blue}
            align="center"
            maxWidth={720}
            letterSpacing={0.1}
          />
        </div>
      </AbsoluteFill>
    </SceneFrame>
  );
};
