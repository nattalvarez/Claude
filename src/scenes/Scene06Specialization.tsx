import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { SceneFrame } from "../components/SceneFrame";
import { WordReveal, AnchoredLabel } from "../components/Typography";
import { CameraRig } from "../three/CameraRig";
import { LightingLight } from "../three/Lighting";
import { CamKeyframe, sampleCamera, projectToScreen } from "../three/camera";
import { Node, Ring, Prism, Plate, Line3D } from "../three/Primitives";
import { COLORS, EASE, WIDTH, HEIGHT } from "../styles/theme";

const CAM: CamKeyframe[] = [
  { frame: 0, position: [-7.2, 1.55, 4.2], lookAt: [-5.5, 0.6, 1.5], fov: 34 },
  { frame: 32, position: [-4.1, 1.65, 2.3], lookAt: [-2.7, 0.8, 0.2], fov: 33 },
  { frame: 60, position: [-1, 1.45, 0.9], lookAt: [0, 0.5, -1.2], fov: 32 },
  { frame: 88, position: [1.9, 1.6, -0.5], lookAt: [2.7, 0.7, -2.6], fov: 31 },
  { frame: 112, position: [4.6, 1.55, -2.1], lookAt: [5.4, 0.6, -4], fov: 30 },
  { frame: 136, position: [3.6, 2.1, -1.6], lookAt: [1, 1.1, -2.3], fov: 27, easing: EASE.inOut },
];

const HUB: [number, number, number] = [1, 1.35, -2.1];

const MODULES = [
  { key: "anticipacion", name: "ANTICIPACIÓN Y SEGUIMIENTO", pos: [-5.5, 0.55, 1.5] as [number, number, number], appear: 0, color: COLORS.blue },
  { key: "alerta", name: "ALERTA TEMPRANA", pos: [-2.7, 0.85, 0.2] as [number, number, number], appear: 24, color: COLORS.turquoise },
  { key: "recobro", name: "RECOBRO AMISTOSO", pos: [0, 0.5, -1.2] as [number, number, number], appear: 46, color: COLORS.lightBlue },
  { key: "judicial", name: "VÍA JUDICIAL", pos: [2.7, 0.8, -2.6] as [number, number, number], appear: 68, color: COLORS.blue },
  { key: "reporting", name: "REPORTING Y CUMPLIMIENTO", pos: [5.4, 0.55, -4] as [number, number, number], appear: 90, color: COLORS.blue },
];

const ModuleShape: React.FC<{ shapeKey: string; color: string; frame: number }> = ({ shapeKey, color, frame }) => {
  const spin = frame / 120;
  if (shapeKey === "anticipacion") {
    return (
      <group rotation={[Math.PI / 2.3, spin, 0]}>
        {[0.3, 0.42, 0.54].map((r, i) => (
          <Ring key={i} position={[0, 0, 0]} radius={r} tube={0.014} color={color} opacity={0.9 - i * 0.18} />
        ))}
      </group>
    );
  }
  if (shapeKey === "alerta") {
    return (
      <group rotation={[spin * 0.6, spin, 0]}>
        <Node position={[0, 0, 0]} radius={0.34} faceted detail={0} color={color} roughness={0.35} metalness={0.15} clearcoat={0.3} />
      </group>
    );
  }
  if (shapeKey === "recobro") {
    return (
      <group rotation={[0, spin * 0.5, 0]}>
        <Node position={[0, 0, 0]} radius={0.3} color={color} roughness={0.55} metalness={0.08} />
        <Ring position={[0, 0, 0]} radius={0.48} tube={0.018} color={COLORS.turquoise} rotation={[Math.PI / 2.4, 0, 0]} opacity={0.6} />
      </group>
    );
  }
  if (shapeKey === "judicial") {
    return <Prism position={[0, 0, 0]} radius={0.32} height={0.66} sides={6} color={color} rotation={[0, spin * 0.4, 0]} roughness={0.4} metalness={0.18} clearcoat={0.25} />;
  }
  return (
    <group rotation={[0, spin * 0.3, 0]}>
      {[0.18, 0.34, 0.5, 0.62].map((h, i) => (
        <Plate key={i} position={[i * 0.26 - 0.4, h / 2, 0]} size={[0.18, h, 0.18]} color={i % 2 === 0 ? color : COLORS.turquoise} roughness={0.5} metalness={0.1} />
      ))}
    </group>
  );
};

const Module: React.FC<{ m: (typeof MODULES)[number] }> = ({ m }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - m.appear, fps, config: { damping: 15, stiffness: 105, mass: 0.75 } });
  const float = Math.sin(frame / 48 + m.pos[0]) * 0.07;
  const convergeOpacity = interpolate(frame, [100, 130], [0, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <group position={[m.pos[0], m.pos[1] + float, m.pos[2]]} scale={p}>
        <ModuleShape shapeKey={m.key} color={m.color} frame={frame} />
      </group>
      {convergeOpacity > 0.01 && <Line3D from={m.pos} to={HUB} color={COLORS.turquoise} radius={0.008} opacity={convergeOpacity} />}
    </>
  );
};

const ConvergeHub: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - 104, fps, config: { damping: 16, stiffness: 110, mass: 0.7 } });
  if (p <= 0.01) return null;
  return (
    <group position={HUB} scale={p}>
      <Node position={[0, 0, 0]} radius={0.22} color={COLORS.navy} roughness={0.4} metalness={0.2} clearcoat={0.35} />
      <Ring position={[0, 0, 0]} radius={0.36} tube={0.012} color={COLORS.turquoise} rotation={[Math.PI / 2, frame / 90, 0]} />
    </group>
  );
};

const Scene3D: React.FC = () => (
  <>
    <color attach="background" args={[COLORS.offWhite]} />
    <fog attach="fog" args={[COLORS.offWhite, 8, 20]} />
    <LightingLight keyIntensity={1.5} />
    <CameraRig keyframes={CAM} />
    {MODULES.map((m) => (
      <Module key={m.key} m={m} />
    ))}
    <ConvergeHub />
  </>
);

/** 0:23–0:27 — Especializado en riesgo de crédito. Five specialized modules
 * pass by on a diagonal travel and converge into one system at the close. */
export const Scene06Specialization: React.FC<{
  from: number;
  duration: number;
  nominalDuration: number;
  hasIncoming: boolean;
  hasOutgoing: boolean;
}> = ({ nominalDuration, hasIncoming, hasOutgoing }) => {
  const frame = useCurrentFrame();
  const camSample = sampleCamera(frame, CAM);
  const headlineP = interpolate(frame, [104, 122], [0, 1], { easing: EASE.out, extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <SceneFrame variant="light" nominalDuration={nominalDuration} hasIncoming={hasIncoming} hasOutgoing={hasOutgoing}>
      <AbsoluteFill>
        <ThreeCanvas width={WIDTH} height={HEIGHT} linear gl={{ antialias: true }}>
          <Scene3D />
        </ThreeCanvas>
      </AbsoluteFill>

      {MODULES.map((m) => {
        const proj = projectToScreen([m.pos[0], m.pos[1] + 0.55, m.pos[2]], camSample, WIDTH, HEIGHT);
        return (
          <AnchoredLabel
            key={m.key}
            x={proj.x}
            y={proj.y}
            scale={proj.scale}
            behind={proj.behind}
            from={m.appear + 6}
            text={m.name}
            color={COLORS.navy}
          />
        );
      })}

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 104 }}>
        <div style={{ opacity: headlineP, transform: `translateY(${interpolate(headlineP, [0, 1], [16, 0])}px)`, width: 640 }}>
          <WordReveal
            parts={[{ text: "Especializado en " }, { text: "riesgo de crédito.", color: COLORS.turquoise }]}
            from={106}
            fontSize={38}
            weight={500}
            color={COLORS.navy}
            align="center"
            maxWidth={640}
          />
        </div>
      </AbsoluteFill>
    </SceneFrame>
  );
};
