import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { SceneFrame } from "../components/SceneFrame";
import { Wordmark, WordReveal } from "../components/Typography";
import { CameraRig } from "../three/CameraRig";
import { LightingLight } from "../three/Lighting";
import { CamKeyframe } from "../three/camera";
import { Node, Ring, Line3D, seededRandom } from "../three/Primitives";
import { COLORS, WIDTH, HEIGHT } from "../styles/theme";

const CAM: CamKeyframe[] = [
  { frame: 0, position: [0, 0.6, 4.6], lookAt: [0, 0.4, 0], fov: 30 },
  { frame: 50, position: [0, 0.35, 6.4], lookAt: [0, 0.15, 0], fov: 27 },
  { frame: 90, position: [0, 0.3, 7.2], lookAt: [0, 0.1, 0], fov: 26 },
];

function buildFading() {
  const rand = seededRandom(77);
  return Array.from({ length: 10 }).map(() => ({
    pos: [(rand() - 0.5) * 4.5, (rand() - 0.5) * 2.4, (rand() - 0.5) * 2] as [number, number, number],
    scale: 0.08 + rand() * 0.1,
    seed: rand() * 100,
  }));
}
const FADING = buildFading();

const Scene3D: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 26], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <color attach="background" args={[COLORS.offWhite]} />
      <fog attach="fog" args={[COLORS.offWhite, 4, 10]} />
      <LightingLight keyIntensity={1.4} />
      <CameraRig keyframes={CAM} />
      {fade > 0.01 &&
        FADING.map((f, i) => (
          <React.Fragment key={i}>
            <Node position={f.pos} radius={f.scale * fade} color={i % 3 === 0 ? COLORS.turquoise : COLORS.blue} opacity={fade} roughness={0.5} metalness={0.1} />
            <Line3D from={f.pos} to={[0, 0.1, 0]} color={COLORS.lightBlue} radius={0.006} opacity={fade * 0.35} />
          </React.Fragment>
        ))}
      {fade > 0.01 && <Ring position={[0, 0.1, 0]} radius={1.4 * (0.4 + fade * 0.6)} tube={0.01} color={COLORS.turquoise} rotation={[Math.PI / 2, frame / 100, 0]} opacity={fade * 0.5} />}
    </>
  );
};

/** 0:27–0:30 — Cierre. Every structure resolves into clean white space
 * around the wordmark; the last two seconds hold, no motion, no noise. */
export const Scene07Outro: React.FC<{
  from: number;
  duration: number;
  nominalDuration: number;
  hasIncoming: boolean;
  hasOutgoing: boolean;
}> = ({ hasIncoming, hasOutgoing, nominalDuration }) => {
  const frame = useCurrentFrame();
  const wordmarkP = spring({ frame: frame - 30, fps: 30, config: { damping: 20, stiffness: 90, mass: 1 } });
  const subP = interpolate(frame, [46, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ctaP = interpolate(frame, [62, 76], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <SceneFrame variant="light" nominalDuration={nominalDuration} hasIncoming={hasIncoming} hasOutgoing={hasOutgoing}>
      <AbsoluteFill>
        <ThreeCanvas width={WIDTH} height={HEIGHT} linear gl={{ antialias: true }}>
          <Scene3D />
        </ThreeCanvas>
      </AbsoluteFill>

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ opacity: wordmarkP, transform: `translateY(${interpolate(wordmarkP, [0, 1], [14, 0])}px) scale(${interpolate(wordmarkP, [0, 1], [0.96, 1])})` }}>
          <Wordmark from={30} fontSize={118} color={COLORS.navy} ruleColor={COLORS.turquoise} />
        </div>

        <div style={{ marginTop: 26, width: 780, opacity: subP, transform: `translateY(${interpolate(subP, [0, 1], [10, 0])}px)` }}>
          <WordReveal
            parts={[{ text: "La plataforma agéntica para la gestión del riesgo de crédito." }]}
            from={48}
            fontSize={20}
            weight={500}
            color={COLORS.blue}
            align="center"
            maxWidth={780}
            style={{ whiteSpace: "nowrap", flexWrap: "nowrap" }}
          />
        </div>

        <div
          style={{
            marginTop: 44,
            opacity: ctaP,
            transform: `translateY(${interpolate(ctaP, [0, 1], [8, 0])}px)`,
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontFamily: "Roboto",
            fontSize: 17,
            fontWeight: 700,
            letterSpacing: 1.5,
            color: COLORS.navy,
            textTransform: "uppercase",
            padding: "16px 34px",
            border: `1.5px solid ${COLORS.navy}`,
            borderRadius: 2,
          }}
        >
          Conoce la plataforma
          <span style={{ color: COLORS.turquoise, fontSize: 20 }}>&rarr;</span>
        </div>
      </AbsoluteFill>
    </SceneFrame>
  );
};
