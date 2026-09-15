import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { SceneFrame } from "../components/SceneFrame";
import { WordReveal, AnchoredLabel } from "../components/Typography";
import { CameraRig } from "../three/CameraRig";
import { LightingDark } from "../three/Lighting";
import { CamKeyframe, sampleCamera, projectToScreen } from "../three/camera";
import { Node, Ring, Plate, Prism, Line3D, PulseSignal } from "../three/Primitives";
import { COLORS, EASE, WIDTH, HEIGHT } from "../styles/theme";

function orbitCam(frames: number[], angles: number[], radius: number, heights: number[], fovs: number[]): CamKeyframe[] {
  return frames.map((f, i) => {
    const a = (angles[i] * Math.PI) / 180;
    return {
      frame: f,
      position: [Math.sin(a) * radius, heights[i], Math.cos(a) * radius] as [number, number, number],
      lookAt: [0, 0.55, 0] as [number, number, number],
      fov: fovs[i],
      easing: EASE.inOut,
    };
  });
}

const CAM = orbitCam(
  [0, 40, 80, 120, 150, 166],
  [-62, -30, 2, 34, 55, 63],
  6.4,
  [2.35, 1.95, 1.6, 1.4, 1.3, 1.28],
  [33, 31.5, 30, 29, 28.5, 28.5]
);

type Agent = {
  name: string;
  role: string;
  pos: [number, number, number];
  color: string;
  appear: number;
  render: (color: string, spin: number) => React.ReactNode;
};

const RADIUS = 2.55;
const hexPos = (i: number, y: number): [number, number, number] => {
  const a = (i * 60 - 90) * (Math.PI / 180);
  return [Math.cos(a) * RADIUS, y, Math.sin(a) * RADIUS];
};

const AGENTS: Agent[] = [
  {
    name: "ESTRATEGA",
    role: "Prioriza la cartera",
    pos: hexPos(0, 0.95),
    color: COLORS.turquoise,
    appear: 10,
    render: (c, spin) => <Node position={[0, 0, 0]} radius={0.32} faceted detail={0} color={c} rotation={[spin, spin * 0.7, 0]} roughness={0.35} metalness={0.15} clearcoat={0.3} />,
  },
  {
    name: "NEGOCIADOR",
    role: "Acuerda soluciones",
    pos: hexPos(1, 0.5),
    color: COLORS.lightBlue,
    appear: 24,
    render: (c, spin) => (
      <group rotation={[0, spin * 0.4, 0]}>
        <Ring position={[0, 0, 0]} radius={0.34} tube={0.045} color={c} rotation={[Math.PI / 2, 0.5, 0]} />
        <Ring position={[0, 0, 0]} radius={0.34} tube={0.045} color={COLORS.turquoise} rotation={[Math.PI / 2.6, -0.6, 0]} />
      </group>
    ),
  },
  {
    name: "ANALISTA",
    role: "Modela el riesgo",
    pos: hexPos(2, 0.78),
    color: COLORS.turquoise,
    appear: 38,
    render: (c, spin) => (
      <group rotation={[0, spin * 0.5, 0]}>
        {[-0.16, 0, 0.16].map((y, i) => (
          <Prism key={i} position={[0, y, 0]} radius={0.32 - i * 0.03} height={0.05} sides={28} color={c} roughness={0.4} metalness={0.1} />
        ))}
      </group>
    ),
  },
  {
    name: "DOCUMENTAL",
    role: "Ordena evidencias",
    pos: hexPos(3, 0.42),
    color: COLORS.lightBlue,
    appear: 52,
    render: (c, spin) => (
      <group rotation={[0.1, spin * 0.3, 0]}>
        {[0, 1, 2].map((i) => (
          <Plate key={i} position={[i * 0.05, i * 0.09, -i * 0.05]} size={[0.5, 0.035, 0.36]} color={i === 1 ? COLORS.turquoise : c} roughness={0.5} metalness={0.1} />
        ))}
      </group>
    ),
  },
  {
    name: "JUDICIAL",
    role: "Ejecuta la vía legal",
    pos: hexPos(4, 0.9),
    color: COLORS.navy,
    appear: 66,
    render: (c, spin) => <Prism position={[0, 0, 0]} radius={0.3} height={0.42} sides={6} color={c} rotation={[0, spin * 0.6, 0]} roughness={0.4} metalness={0.18} clearcoat={0.25} />,
  },
  {
    name: "SUPERVISOR",
    role: "Certifica el proceso",
    pos: hexPos(5, 0.58),
    color: COLORS.turquoise,
    appear: 80,
    render: (c, spin) => (
      <group rotation={[0.3, spin * 0.4, 0]}>
        <Node position={[0, 0, 0]} radius={0.24} color={c} roughness={0.35} metalness={0.15} />
        <Ring position={[0, 0, 0]} radius={0.4} tube={0.02} color={COLORS.lightBlue} rotation={[Math.PI / 2.2, 0, 0]} />
      </group>
    ),
  },
];

const PULSE_PERIOD = 54;

const HubHalo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 16, stiffness: 90, mass: 0.9 } });
  const breathe = 1 + Math.sin(frame / 32) * 0.02;
  return (
    <group scale={p * breathe}>
      <Node position={[0, 0.68, 0]} radius={0.5} color={COLORS.navy} roughness={0.4} metalness={0.2} clearcoat={0.35} />
      <Ring position={[0, 0.68, 0]} radius={0.78} tube={0.025} color={COLORS.turquoise} rotation={[Math.PI / 2, frame / 160, 0]} opacity={0.85} />
      <Ring position={[0, 0.68, 0]} radius={0.95} tube={0.012} color={COLORS.lightBlue} rotation={[Math.PI / 2.3, -frame / 220, 0]} opacity={0.4} />
    </group>
  );
};

const AgentInstance: React.FC<{ agent: Agent }> = ({ agent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - agent.appear, fps, config: { damping: 14, stiffness: 110, mass: 0.7 } });
  const spin = frame / 100;
  const float = Math.sin(frame / 45 + agent.pos[0]) * 0.06;

  const t = frame >= agent.appear ? ((frame - agent.appear) % PULSE_PERIOD) / PULSE_PERIOD : -1;

  return (
    <>
      <Line3D from={[0, 0.68, 0]} to={agent.pos} color={agent.color} radius={0.01} opacity={Math.min(0.5, p * 0.5)} />
      {t >= 0 && <PulseSignal from={[0, 0.68, 0]} to={agent.pos} t={t} color={COLORS.turquoise} radius={0.045} />}
      <group position={[agent.pos[0], agent.pos[1] + float, agent.pos[2]]} scale={p}>
        {agent.render(agent.color, spin)}
      </group>
    </>
  );
};

const Scene3D: React.FC = () => (
  <>
    <color attach="background" args={[COLORS.navy]} />
    <fog attach="fog" args={[COLORS.navy, 7, 15]} />
    <LightingDark />
    <CameraRig keyframes={CAM} />
    <HubHalo />
    {AGENTS.map((a) => (
      <AgentInstance key={a.name} agent={a} />
    ))}
  </>
);

/** 0:13–0:18 — Una fuerza de trabajo agéntica. Six specialized agents take
 * their place around the SIREC core as the camera orbits the network. */
export const Scene04Agents: React.FC<{
  from: number;
  duration: number;
  nominalDuration: number;
  hasIncoming: boolean;
  hasOutgoing: boolean;
}> = ({ nominalDuration, hasIncoming, hasOutgoing }) => {
  const frame = useCurrentFrame();
  const camSample = sampleCamera(frame, CAM);
  const headlineP = interpolate(frame, [96, 116], [0, 1], { easing: EASE.out, extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <SceneFrame variant="dark" nominalDuration={nominalDuration} hasIncoming={hasIncoming} hasOutgoing={hasOutgoing}>
      <AbsoluteFill>
        <ThreeCanvas width={WIDTH} height={HEIGHT} linear gl={{ antialias: true }}>
          <Scene3D />
        </ThreeCanvas>
      </AbsoluteFill>

      {AGENTS.map((a) => {
        const proj = projectToScreen([a.pos[0], a.pos[1] + 0.42, a.pos[2]], camSample, WIDTH, HEIGHT);
        return (
          <AnchoredLabel
            key={a.name}
            x={proj.x}
            y={proj.y}
            scale={proj.scale}
            behind={proj.behind}
            from={a.appear + 6}
            text={a.name}
            sub={a.role}
            color={COLORS.white}
          />
        );
      })}

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 100 }}>
        <div style={{ opacity: headlineP, transform: `translateY(${interpolate(headlineP, [0, 1], [16, 0])}px)`, width: 640 }}>
          <WordReveal
            parts={[{ text: "Una fuerza de trabajo " }, { text: "agéntica.", color: COLORS.turquoise }]}
            from={98}
            fontSize={40}
            weight={500}
            color={COLORS.white}
            align="center"
            maxWidth={640}
          />
        </div>
      </AbsoluteFill>
    </SceneFrame>
  );
};
