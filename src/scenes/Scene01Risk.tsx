import React, { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { SceneFrame } from "../components/SceneFrame";
import { WordReveal } from "../components/Typography";
import { CameraRig } from "../three/CameraRig";
import { LightingLight } from "../three/Lighting";
import { CamKeyframe, sampleCamera } from "../three/camera";
import { Line3D, ParticleField, ParticleSpec, seededRandom } from "../three/Primitives";
import { COLORS, EASE, WIDTH, HEIGHT } from "../styles/theme";

const CAM: CamKeyframe[] = [
  { frame: 0, position: [0.6, 0.5, 10.5], lookAt: [-0.2, 0, 0], fov: 36 },
  { frame: 70, position: [0.1, 0.15, 5.2], lookAt: [-0.1, 0, -2.2], fov: 35 },
  { frame: 136, position: [-0.15, -0.05, 0.9], lookAt: [-0.1, -0.05, -3], fov: 33, easing: EASE.inOut },
];

function buildParticles(): ParticleSpec[] {
  const rand = seededRandom(1337);
  const kinds: ParticleSpec["kind"][] = ["cube", "sphere", "tetra", "disc"];
  const colors = [COLORS.navy, COLORS.blue, COLORS.turquoise, COLORS.lightBlue];
  const out: ParticleSpec[] = [];
  for (let i = 0; i < 40; i++) {
    let x = (rand() - 0.5) * 9.5;
    let y = (rand() - 0.5) * 5.2;
    const z = -8 + rand() * 9;
    // Keep a wide corridor around the camera's whole travel path clear so
    // nothing balloons into an unreadable close-up smear during the dolly.
    const distFromAxis = Math.hypot(x, y);
    const minDist = 3.1;
    if (distFromAxis < minDist) {
      const push = minDist / Math.max(0.4, distFromAxis);
      x *= push;
      y *= push;
    }
    const gx = Math.round(x / 1.3) * 1.3;
    const gy = Math.round(y / 1.15) * 1.15 * 0.6;
    const gz = z;
    out.push({
      position: [x, y, z],
      gridTarget: [gx, gy, gz],
      scale: 0.09 + rand() * 0.16,
      kind: kinds[Math.floor(rand() * kinds.length)],
      color: colors[Math.floor(rand() * colors.length)],
      seed: rand() * 1000,
    });
  }
  return out;
}

const PARTICLES = buildParticles();

// A handful of particle-pairs that draw a connecting line once things settle.
const LINK_PAIRS: [number, number][] = [
  [2, 7], [7, 14], [3, 11], [11, 19], [5, 22], [22, 27], [9, 16], [16, 24], [1, 30], [30, 34],
];

const Scene3D: React.FC<{ settle: number }> = ({ settle }) => {
  const frame = useCurrentFrame();
  return (
    <>
      <color attach="background" args={[COLORS.offWhite]} />
      <fog attach="fog" args={[COLORS.offWhite, 4, 15]} />
      <LightingLight keyIntensity={1.5} />
      <CameraRig keyframes={CAM} />
      <ParticleField particles={PARTICLES} frame={frame} settle={settle} />
      {LINK_PAIRS.map(([a, b], i) => {
        const pa = PARTICLES[a];
        const pb = PARTICLES[b];
        const posA = pa.gridTarget
          ? ([
              pa.position[0] + (pa.gridTarget[0] - pa.position[0]) * settle,
              pa.position[1] + (pa.gridTarget[1] - pa.position[1]) * settle,
              pa.position[2],
            ] as [number, number, number])
          : pa.position;
        const posB = pb.gridTarget
          ? ([
              pb.position[0] + (pb.gridTarget[0] - pb.position[0]) * settle,
              pb.position[1] + (pb.gridTarget[1] - pb.position[1]) * settle,
              pb.position[2],
            ] as [number, number, number])
          : pb.position;
        return (
          <Line3D
            key={i}
            from={posA}
            to={posB}
            color={COLORS.turquoise}
            radius={0.008}
            opacity={Math.max(0, settle - 0.2) * 0.55}
          />
        );
      })}
    </>
  );
};

/** 0:00–0:04 — El riesgo. A dispersed field of geometric data slowly
 * organizes as the camera dollies forward into it. */
export const Scene01Risk: React.FC<{
  from: number;
  duration: number;
  nominalDuration: number;
  hasIncoming: boolean;
  hasOutgoing: boolean;
}> = ({ duration, nominalDuration, hasIncoming, hasOutgoing }) => {
  const frame = useCurrentFrame();
  const settle = interpolate(frame, [20, nominalDuration], [0, 1], {
    easing: Easing.bezier(0.45, 0, 0.2, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const line1Opacity = interpolate(frame, [58, 66, 92, 100], [1, 1, 0, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const line2Opacity = interpolate(frame, [96, 106], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <SceneFrame variant="light" nominalDuration={nominalDuration} hasIncoming={hasIncoming} hasOutgoing={hasOutgoing}>
      <AbsoluteFill>
        <ThreeCanvas width={WIDTH} height={HEIGHT} linear gl={{ antialias: true }}>
          <Scene3D settle={settle} />
        </ThreeCanvas>
      </AbsoluteFill>

      <AbsoluteFill style={{ alignItems: "flex-end", justifyContent: "flex-end", padding: "0 140px 128px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 22, maxWidth: 900 }}>
          <div style={{ width: 3, height: 64, background: COLORS.turquoise, marginTop: 6, flexShrink: 0 }} />
          <div style={{ position: "relative", width: 860, height: 96 }}>
            <div style={{ opacity: line1Opacity, position: "absolute", left: 0, top: 0, width: 860 }}>
              <WordReveal
                parts={[{ text: "El riesgo de crédito exige decisiones cada vez más rápidas." }]}
                from={16}
                fontSize={44}
                weight={500}
                color={COLORS.navy}
                maxWidth={860}
              />
            </div>
            <div style={{ opacity: line2Opacity, position: "absolute", left: 0, top: 0, width: 860 }}>
              <WordReveal
                parts={[{ text: "¿Y si pudieran ejecutarse de forma " }, { text: "autónoma?", color: COLORS.turquoise }]}
                from={100}
                fontSize={44}
                weight={500}
                color={COLORS.navy}
                maxWidth={860}
              />
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </SceneFrame>
  );
};
