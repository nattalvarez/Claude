import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { SceneFrame } from "../components/SceneFrame";
import { WordReveal, AnchoredLabel } from "../components/Typography";
import { CameraRig } from "../three/CameraRig";
import { LightingDark } from "../three/Lighting";
import { CamKeyframe, sampleCamera, projectToScreen } from "../three/camera";
import { Node, Ring, Prism } from "../three/Primitives";
import { COLORS, EASE, WIDTH, HEIGHT } from "../styles/theme";

const CAM: CamKeyframe[] = [
  { frame: 0, position: [0, 1.15, 5.2], lookAt: [0, 0.62, 0], fov: 32 },
  { frame: 50, position: [2.6, 1.55, 6.6], lookAt: [0, 0.65, 0], fov: 29.5 },
  { frame: 100, position: [-2.1, 1.95, 7.9], lookAt: [0, 0.7, 0], fov: 27 },
  { frame: 150, position: [0.5, 2.25, 9], lookAt: [0, 0.75, 0], fov: 25, easing: EASE.inOut },
  { frame: 166, position: [0.3, 2.3, 9.2], lookAt: [0, 0.78, 0], fov: 24.5 },
];

const CORE_AGENTS = Array.from({ length: 6 }).map((_, i) => {
  const a = (i * 60 - 90) * (Math.PI / 180);
  return [Math.cos(a) * 1.05, 0.65 + Math.sin(i) * 0.08, Math.sin(a) * 1.05] as [number, number, number];
});

const PILLARS = [
  { key: "identidad", name: "IDENTIDAD", sub: "Cada agente, verificado", pos: [3.1, 1.15, 0.4] as [number, number, number], appear: 20 },
  { key: "permisos", name: "PERMISOS", sub: "Límites definidos por acción", pos: [-1.1, 0.35, 3.2] as [number, number, number], appear: 44 },
  { key: "trazabilidad", name: "TRAZABILIDAD", sub: "Cada decisión, registrada", pos: [-2.9, 1.3, -1.5] as [number, number, number], appear: 68 },
  { key: "supervision", name: "SUPERVISIÓN", sub: "Una persona, siempre al mando", pos: [1.4, 0.5, -3.0] as [number, number, number], appear: 92 },
];

const Core: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 16, stiffness: 100, mass: 0.8 } });
  return (
    <group scale={p}>
      <Node position={[0, 0.65, 0]} radius={0.34} color={COLORS.navy} roughness={0.4} metalness={0.18} clearcoat={0.3} />
      {CORE_AGENTS.map((pos, i) => (
        <Node key={i} position={pos} radius={0.1} color={i % 2 === 0 ? COLORS.turquoise : COLORS.lightBlue} roughness={0.35} metalness={0.15} />
      ))}
      <Ring position={[0, 0.65, 0]} radius={1.3} tube={0.012} color={COLORS.blue} rotation={[Math.PI / 2, frame / 180, 0]} opacity={0.4} />
    </group>
  );
};

const PillarShape: React.FC<{ shapeKey: string; frame: number }> = ({ shapeKey, frame }) => {
  const spin = frame / 130;
  if (shapeKey === "identidad") {
    return <Ring position={[0, 0, 0]} radius={0.6} tube={0.05} color={COLORS.turquoise} rotation={[Math.PI / 2.1, spin, 0]} />;
  }
  if (shapeKey === "permisos") {
    return <Prism position={[0, 0, 0]} radius={0.46} height={0.14} sides={6} color={COLORS.blue} rotation={[0, spin, 0]} roughness={0.4} metalness={0.15} clearcoat={0.2} />;
  }
  if (shapeKey === "trazabilidad") {
    return (
      <group rotation={[0, spin * 0.6, 0]}>
        {[0, 1, 2].map((i) => (
          <Ring key={i} position={[(i - 1) * 0.42, 0, 0]} radius={0.24} tube={0.03} color={COLORS.lightBlue} rotation={[Math.PI / 2, i * 0.3, 0]} opacity={0.85} />
        ))}
      </group>
    );
  }
  return <Ring position={[0, 0, 0]} radius={1.05} tube={0.03} color={COLORS.turquoise} rotation={[Math.PI / 2.4, -spin * 0.5, Math.PI / 6]} opacity={0.7} />;
};

const Pillar: React.FC<{ p: (typeof PILLARS)[number] }> = ({ p }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const spr = spring({ frame: frame - p.appear, fps, config: { damping: 15, stiffness: 100, mass: 0.8 } });
  const float = Math.sin(frame / 50 + p.pos[0]) * 0.08;
  return (
    <group position={[p.pos[0], p.pos[1] + float, p.pos[2]]} scale={spr}>
      <PillarShape shapeKey={p.key} frame={frame} />
    </group>
  );
};

const Scene3D: React.FC = () => (
  <>
    <color attach="background" args={[COLORS.navy]} />
    <fog attach="fog" args={[COLORS.navy, 8, 18]} />
    <LightingDark />
    <CameraRig keyframes={CAM} />
    <Core />
    {PILLARS.map((p) => (
      <Pillar key={p.key} p={p} />
    ))}
  </>
);

/** 0:18–0:23 — Autonomía con control. The agent network pulls back inside a
 * larger governance system: identity, permissions, traceability, oversight. */
export const Scene05Governance: React.FC<{
  from: number;
  duration: number;
  nominalDuration: number;
  hasIncoming: boolean;
  hasOutgoing: boolean;
}> = ({ nominalDuration, hasIncoming, hasOutgoing }) => {
  const frame = useCurrentFrame();
  const camSample = sampleCamera(frame, CAM);
  const headlineP = interpolate(frame, [104, 124], [0, 1], { easing: EASE.out, extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <SceneFrame variant="dark" nominalDuration={nominalDuration} hasIncoming={hasIncoming} hasOutgoing={hasOutgoing}>
      <AbsoluteFill>
        <ThreeCanvas width={WIDTH} height={HEIGHT} linear gl={{ antialias: true }}>
          <Scene3D />
        </ThreeCanvas>
      </AbsoluteFill>

      {PILLARS.map((p) => {
        const proj = projectToScreen([p.pos[0], p.pos[1] + 0.75, p.pos[2]], camSample, WIDTH, HEIGHT);
        return (
          <AnchoredLabel
            key={p.key}
            x={proj.x}
            y={proj.y}
            scale={proj.scale}
            behind={proj.behind}
            from={p.appear + 6}
            text={p.name}
            sub={p.sub}
            color={COLORS.white}
          />
        );
      })}

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: 96 }}>
        <div style={{ opacity: headlineP, transform: `translateY(${interpolate(headlineP, [0, 1], [-14, 0])}px)`, width: 620 }}>
          <WordReveal
            parts={[{ text: "Autonomía con " }, { text: "control.", color: COLORS.turquoise }]}
            from={106}
            fontSize={44}
            weight={500}
            color={COLORS.white}
            align="center"
            maxWidth={620}
          />
        </div>
      </AbsoluteFill>
    </SceneFrame>
  );
};
