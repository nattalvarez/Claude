import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, WIDTH, HEIGHT, FONT_FAMILY, SCENES } from "../styles/theme";
import { KineticText } from "../components/KineticText";
import { ConnectionLine } from "../components/ConnectionLine";
import { AgentNode, AgentGlyph } from "../components/AgentNode";
import { OrbitField } from "../components/OrbitField";
import { SceneExit } from "../components/SceneExit";
import { AnimatedCounter } from "../components/AnimatedCounter";
import { spring, useVideoConfig, interpolate } from "remotion";

const AGENTS: { label: string; glyph: AgentGlyph }[] = [
  { label: "Estratega", glyph: "strategy" },
  { label: "Negociador", glyph: "negotiate" },
  { label: "Analista", glyph: "analyze" },
  { label: "Documental", glyph: "document" },
  { label: "Judicial", glyph: "judicial" },
  { label: "Supervisor", glyph: "supervise" },
];

const CENTRE = { x: WIDTH / 2, y: HEIGHT / 2 + 60 };
const RADIUS = 360;
const START = 28;
const STAGGER = 14;

/** 0:13–0:18 — Una fuerza de trabajo agéntica. Six agent nodes take their place around
 * a central hub, each connection arriving in its own beat. */
export const Scene04Agents: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const hubAppear = spring({ frame, fps, config: { damping: 15, mass: 0.7, stiffness: 120 } });

  return (
    <AbsoluteFill>
      <SceneExit duration={SCENES.s04.duration}>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 96 }}>
        <KineticText
          parts={[{ text: "Una fuerza de trabajo " }, { text: "agéntica.", color: COLORS.turquoise }]}
          from={6}
          fontSize={50}
          fontWeight={500}
          color={COLORS.navy}
          align="center"
        />
      </AbsoluteFill>

      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0 }}>
        <OrbitField cx={CENTRE.x} cy={CENTRE.y} from={0} count={26} />
        {AGENTS.map((a, i) => {
          const angle = (Math.PI / 180) * (i * 60 - 90);
          const x = CENTRE.x + Math.cos(angle) * RADIUS;
          const y = CENTRE.y + Math.sin(angle) * RADIUS;
          return (
            <ConnectionLine
              key={a.label}
              x1={CENTRE.x}
              y1={CENTRE.y}
              x2={x}
              y2={y}
              from={START + i * STAGGER}
              duration={20}
              color={COLORS.blue}
              strokeWidth={1.6}
              opacity={0.4}
            />
          );
        })}

        {/* perimeter mesh — connects each agent to its neighbours once the spokes land,
            reading as coordination between agents, not just dependence on the hub */}
        {AGENTS.map((a, i) => {
          const next = AGENTS[(i + 1) % AGENTS.length];
          const angleA = (Math.PI / 180) * (i * 60 - 90);
          const angleB = (Math.PI / 180) * (((i + 1) % AGENTS.length) * 60 - 90);
          const ax = CENTRE.x + Math.cos(angleA) * RADIUS;
          const ay = CENTRE.y + Math.sin(angleA) * RADIUS;
          const bx = CENTRE.x + Math.cos(angleB) * RADIUS;
          const by = CENTRE.y + Math.sin(angleB) * RADIUS;
          return (
            <ConnectionLine
              key={`${a.label}-${next.label}`}
              x1={ax}
              y1={ay}
              x2={bx}
              y2={by}
              from={START + 3 * STAGGER + i * 5}
              duration={18}
              color={COLORS.turquoise}
              strokeWidth={1}
              opacity={0.22}
            />
          );
        })}

        {/* hub */}
        <g
          transform={`translate(${CENTRE.x} ${CENTRE.y}) scale(${hubAppear})`}
          opacity={interpolate(hubAppear, [0, 1], [0, 1])}
        >
          <circle r={78} fill={COLORS.navy} />
          <text
            y={7}
            textAnchor="middle"
            fill={COLORS.white}
            fontFamily={FONT_FAMILY}
            fontWeight={700}
            fontSize={26}
            letterSpacing={0.5}
          >
            SIREC
          </text>
        </g>

        {AGENTS.map((a, i) => {
          const angle = (Math.PI / 180) * (i * 60 - 90);
          const x = CENTRE.x + Math.cos(angle) * RADIUS;
          const y = CENTRE.y + Math.sin(angle) * RADIUS;
          return (
            <AgentNode key={a.label} cx={x} cy={y} glyph={a.glyph} label={a.label} from={START + i * STAGGER + 8} color={COLORS.navy} />
          );
        })}
      </svg>

      <div
        style={{
          position: "absolute",
          left: CENTRE.x,
          top: CENTRE.y + 78 + 34,
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <AnimatedCounter target={6} from={50} fontSize={34} fontWeight={700} color={COLORS.navy} />
        <span style={{ fontFamily: FONT_FAMILY, fontSize: 14, fontWeight: 500, letterSpacing: 2, color: COLORS.blue }}>
          AGENTES ACTIVOS
        </span>
      </div>
      </SceneExit>
    </AbsoluteFill>
  );
};
