import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { SceneFrame } from "../components/SceneFrame";
import { WordReveal, AnchoredLabel } from "../components/Typography";
import { CameraRig } from "../three/CameraRig";
import { LightingLight } from "../three/Lighting";
import { CamKeyframe, sampleCamera, projectToScreen } from "../three/camera";
import { Node, Ring, Line3D, Prism } from "../three/Primitives";
import { COLORS, EASE, WIDTH, HEIGHT } from "../styles/theme";

// Camera stays BEHIND the station it is currently highlighting (camera.z is
// always > station.z until that station's moment is over) and always looks
// past it toward the next one — this is what keeps the dolly reading as a
// continuous forward travel instead of overshooting each station.
const CAM: CamKeyframe[] = [
  { frame: 0, position: [0, 0.4, 4], lookAt: [0, 0.3, -1], fov: 36 },
  { frame: 30, position: [0.3, 0.5, 1.8], lookAt: [0.15, 0.35, -3.4], fov: 35 },
  { frame: 58, position: [-0.3, 0.6, -2.6], lookAt: [-0.15, 0.42, -7.8], fov: 34 },
  { frame: 88, position: [0.25, 0.72, -7], lookAt: [0.1, 0.52, -12.2], fov: 32.5 },
  { frame: 120, position: [-0.2, 0.88, -11.4], lookAt: [0, 0.68, -16.6], fov: 30.5 },
  { frame: 150, position: [0.35, 1.0, -15.4], lookAt: [0, 0.92, -18.6], fov: 29, easing: EASE.inOut },
  { frame: 166, position: [0.4, 1.02, -15.7], lookAt: [0, 0.95, -18.9], fov: 28.5 },
];

const STATIONS = [
  { level: 1, z: 0, approach: 0, title: "01", sub: "AUTOMATIZACIÓN DE TAREAS" },
  { level: 2, z: -4.4, approach: 34, title: "02", sub: "ASISTENCIA INTELIGENTE" },
  { level: 3, z: -8.8, approach: 63, title: "03", sub: "AUTONOMÍA SUPERVISADA" },
  { level: 4, z: -13.2, approach: 95, title: "04", sub: "ALTA AUTONOMÍA" },
  { level: 5, z: -17.6, approach: 110, title: "05", sub: "RECOBRO AUTÓNOMO GOBERNADO" },
];

const Station: React.FC<{ level: number; z: number; appear: number }> = ({ level, z, appear }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - appear, fps, config: { damping: 16, stiffness: 100, mass: 0.8 } });
  if (p <= 0.01) return null;

  const ringRadius = 0.75 + level * 0.14;
  const nodeCount = level;
  const isHero = level === 5;
  const color = isHero ? COLORS.turquoise : level >= 4 ? COLORS.blue : COLORS.navy;

  const nodes = Array.from({ length: nodeCount }).map((_, i) => {
    const a = (i / nodeCount) * Math.PI * 2 + level * 0.4;
    const r = ringRadius * 0.62;
    const nx = Math.cos(a) * r;
    const ny = 0.35 + Math.sin(frame / 60 + i) * 0.05;
    const nz = z + Math.sin(a) * r * 0.4;
    return [nx, ny, nz] as [number, number, number];
  });

  return (
    <group scale={p} position={[0, 0, 0]}>
      <Ring position={[0, 0.15, z]} radius={ringRadius} tube={0.035} color={color} rotation={[Math.PI / 2, frame / 200, 0]} opacity={0.9} />
      {level >= 3 && (
        <Ring position={[0, 0.15, z]} radius={ringRadius * 1.4} tube={0.02} color={COLORS.lightBlue} rotation={[Math.PI / 2.15, -frame / 240, 0]} opacity={0.55} />
      )}
      {nodes.map((n, i) => (
        <React.Fragment key={i}>
          <Node position={n} radius={0.12} color={i % 2 === 0 ? COLORS.turquoise : COLORS.blue} roughness={0.4} metalness={0.15} />
          <Line3D from={[0, 0.15, z]} to={n} color={color} radius={0.008} opacity={0.4} />
        </React.Fragment>
      ))}
      {isHero && (
        <>
          <Prism position={[0, 0.15, z]} radius={0.22} height={0.5} sides={8} color={COLORS.turquoise} rotation={[0, frame / 90, 0]} roughness={0.35} metalness={0.2} clearcoat={0.4} />
          <Ring position={[0, 0.15, z]} radius={ringRadius * 1.85} tube={0.014} color={COLORS.blue} rotation={[Math.PI / 2.4, frame / 300, 0]} opacity={0.35} />
        </>
      )}
    </group>
  );
};

const Scene3D: React.FC = () => (
  <>
    <color attach="background" args={[COLORS.offWhite]} />
    <fog attach="fog" args={[COLORS.offWhite, 9, 24]} />
    <LightingLight keyIntensity={1.5} />
    <CameraRig keyframes={CAM} />
    {STATIONS.map((s) => (
      <Station key={s.level} level={s.level} z={s.z} appear={s.approach} />
    ))}
  </>
);

/** 0:08–0:13 — De la automatización al recobro autónomo. The camera travels
 * a path through five stations of rising structural complexity. */
export const Scene03Autonomy: React.FC<{
  from: number;
  duration: number;
  nominalDuration: number;
  hasIncoming: boolean;
  hasOutgoing: boolean;
}> = ({ nominalDuration, hasIncoming, hasOutgoing }) => {
  const frame = useCurrentFrame();
  const camSample = sampleCamera(frame, CAM);

  const headlineP = interpolate(frame, [130, 150], [0, 1], { easing: EASE.out, extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <SceneFrame variant="light" nominalDuration={nominalDuration} hasIncoming={hasIncoming} hasOutgoing={hasOutgoing}>
      <AbsoluteFill>
        <ThreeCanvas width={WIDTH} height={HEIGHT} linear gl={{ antialias: true }}>
          <Scene3D />
        </ThreeCanvas>
      </AbsoluteFill>

      {STATIONS.map((s) => {
        const proj = projectToScreen([0, 0.9 + s.level * 0.14, s.z], camSample, WIDTH, HEIGHT);
        return (
          <AnchoredLabel
            key={s.level}
            x={proj.x}
            y={proj.y}
            scale={proj.scale}
            behind={proj.behind}
            from={s.approach + 4}
            text={s.title}
            sub={s.sub}
            color={s.level === 5 ? COLORS.turquoise : COLORS.navy}
          />
        );
      })}

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 108 }}>
        <div style={{ opacity: headlineP, transform: `translateY(${interpolate(headlineP, [0, 1], [16, 0])}px)`, width: 760 }}>
          <WordReveal
            parts={[{ text: "De la automatización al " }, { text: "recobro autónomo.", color: COLORS.turquoise }]}
            from={132}
            fontSize={38}
            weight={500}
            color={COLORS.navy}
            align="center"
            maxWidth={760}
          />
        </div>
      </AbsoluteFill>
    </SceneFrame>
  );
};
