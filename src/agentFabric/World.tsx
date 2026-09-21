import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY } from "../styles/theme";
import { PulseRings } from "../components/PulseRings";
import {
  cameraAt,
  worldTransform,
  WORLD_OFFSET,
  WORLD_SVG_SIZE,
  X_CENTER,
  X_LEFT,
  X_RIGHT,
  Y_SIREC,
  Y_FABRIC,
  Y_MCP,
  Y_AGENTS,
  T,
} from "./timeline";
import { ArchBlock } from "./ArchBlock";
import { FlowLine } from "./FlowLine";
import { ProviderNode } from "./ProviderNode";
import { ConceptPanel } from "./ConceptPanel";
import { TitleScene } from "./TitleScene";
import { AmbientField } from "./AmbientField";
import { StackMark, OrbitMark, CpuMark, McpMark, OpenAIMark, AnthropicMark, GeminiMark, GoogleCloudMark } from "./marks";

const O = WORLD_OFFSET;

const McpBadge: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - T.mcp.badge, fps, config: { damping: 14, mass: 0.6, stiffness: 140 } });
  const labelP = spring({ frame: frame - T.mcp.label, fps, config: { damping: 16, mass: 0.7, stiffness: 130 } });
  if (p <= 0.001) return null;
  const breathe = 1 + Math.sin((frame - T.mcp.badge) / 30) * 0.03 * Math.min(1, p);

  return (
    <div
      style={{
        position: "absolute",
        left: X_CENTER,
        top: Y_MCP,
        transform: `translate(-50%, -50%) scale(${p * breathe})`,
        opacity: interpolate(p, [0, 1], [0, 1]),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: COLORS.navy,
          borderRadius: 999,
          padding: "12px 24px",
          boxShadow: `0 0 50px -10px ${COLORS.glow}`,
        }}
      >
        <McpMark size={20} color={COLORS.turquoise} />
        <span style={{ fontFamily: FONT_FAMILY, fontWeight: 800, fontSize: 20, color: COLORS.white, letterSpacing: 1 }}>
          MCP
        </span>
      </div>
      <span
        style={{
          fontFamily: FONT_FAMILY,
          fontWeight: 500,
          fontSize: 16,
          color: COLORS.blue,
          opacity: interpolate(labelP, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(labelP, [0, 1], [8, 0])}px)`,
          whiteSpace: "nowrap",
        }}
      >
        Model Context Protocol
      </span>
    </div>
  );
};

/** All architecture content in one shared world space. Three depth groups —
 * background particles, the architecture itself, a couple of foreground
 * floaters — each read the same camera state but move at a different rate,
 * which is what actually sells the parallax the brief asks for. */
export const World: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = cameraAt(frame);

  const pills = [
    { x: X_CENTER - 270, y: Y_AGENTS - 80, label: "OpenAI", icon: <OpenAIMark size={19} color={COLORS.navy} /> },
    { x: X_CENTER, y: Y_AGENTS - 115, label: "Anthropic", icon: <AnthropicMark size={19} color={COLORS.navy} /> },
    { x: X_CENTER + 270, y: Y_AGENTS - 80, label: "Gemini", icon: <GeminiMark size={19} color={COLORS.navy} /> },
  ];

  return (
    <>
      {/* BACKGROUND — moves the least, reads as farthest away */}
      <div style={{ position: "absolute", inset: 0, transform: worldTransform(cam, 0.15), transformOrigin: "0 0" }}>
        <AmbientField />
      </div>

      {/* MID — the architecture itself, one-to-one with the camera */}
      <div style={{ position: "absolute", inset: 0, transform: worldTransform(cam, 1), transformOrigin: "0 0" }}>
        <TitleScene />

        {/* connectors, drawn under every card so cards read as the anchor points */}
        <svg
          width={WORLD_SVG_SIZE}
          height={WORLD_SVG_SIZE}
          style={{ position: "absolute", left: -O, top: -O }}
          viewBox={`0 0 ${WORLD_SVG_SIZE} ${WORLD_SVG_SIZE}`}
        >
          <PulseRings cx={X_CENTER + O} cy={Y_MCP + O} from={T.mcp.badge} interval={26} count={3} maxRadius={140} startRadius={12} color={COLORS.turquoise} maxOpacity={0.4} />

          <FlowLine x1={X_CENTER + O} y1={Y_SIREC + O} x2={X_CENTER + O} y2={Y_FABRIC + O} from={T.connSirecFabric.from} duration={T.connSirecFabric.duration} color={COLORS.blue} />
          <FlowLine x1={X_CENTER + O} y1={Y_FABRIC + O} x2={X_CENTER + O} y2={Y_MCP + O} from={T.connFabricMcp.from} duration={T.connFabricMcp.duration} color={COLORS.turquoise} />
          <FlowLine x1={X_CENTER + O} y1={Y_MCP + O} x2={X_CENTER + O} y2={Y_AGENTS + O} from={T.connMcpAgents.from} duration={T.connMcpAgents.duration} color={COLORS.turquoise} />

          {pills.map((pl, i) => (
            <FlowLine
              key={pl.label}
              x1={X_CENTER + O}
              y1={Y_AGENTS + O}
              x2={pl.x + O}
              y2={pl.y + O}
              from={T.pillConnectors[i]}
              duration={20}
              color={COLORS.blue}
              strokeWidth={1.4}
              opacity={0.4}
            />
          ))}

          {/* ecosystem — the wider world SIREC Agent Fabric plugs into */}
          <FlowLine x1={pills[1].x + O} y1={pills[1].y + O} x2={X_CENTER + O} y2={Y_FABRIC + O} from={T.ecosystem.aiConnFrom} duration={34} color={COLORS.navy} strokeWidth={1.4} opacity={0.3} flowSpeed={70} />
          <FlowLine x1={X_RIGHT + O} y1={Y_FABRIC + O} x2={X_CENTER + O} y2={Y_FABRIC + O} from={T.ecosystem.gc1ConnFrom} duration={22} color={COLORS.blue} strokeWidth={1.4} opacity={0.4} />
          <FlowLine x1={X_RIGHT + O} y1={Y_SIREC + O} x2={X_CENTER + O} y2={Y_SIREC + O} from={T.ecosystem.gc2ConnFrom} duration={22} color={COLORS.blue} strokeWidth={1.4} opacity={0.4} />
        </svg>

        <ArchBlock
          x={X_CENTER}
          y={Y_SIREC}
          width={700}
          from={T.sirec}
          icon={<StackMark size={26} color={COLORS.navy} />}
          title="SIREC"
          subtitle="Plataforma E2E · Orquestación"
          tag="KPIs de negocio"
          tagColor={COLORS.blue}
          variant="light"
        />

        <ArchBlock
          x={X_CENTER}
          y={Y_FABRIC}
          width={740}
          from={T.fabric}
          icon={<OrbitMark size={26} color={COLORS.white} />}
          title="SIREC Agent Fabric"
          subtitle="Agilidad · escalabilidad · seguridad · cumplimiento"
          tag="Orquestación segura de agentes"
          tagColor={COLORS.turquoise}
          variant="dark"
        />

        <McpBadge />

        <ArchBlock
          x={X_CENTER}
          y={Y_AGENTS}
          width={780}
          from={T.agents}
          icon={<CpuMark size={26} color={COLORS.navy} />}
          title="Agentes IA"
          subtitle="Automatización · eficiencia · inteligencia · flexibilidad"
          variant="light"
        />

        {pills.map((pl, i) => (
          <ProviderNode key={pl.label} x={pl.x} y={pl.y} from={T.pills[i].from} dx={T.pills[i].dx} dy={T.pills[i].dy} label={pl.label} icon={pl.icon} />
        ))}

        <ProviderNode x={X_RIGHT} y={Y_FABRIC} from={T.ecosystem.gc1NodeFrom} dx={190} dy={-24} label="Google Cloud" icon={<GoogleCloudMark size={20} color={COLORS.navy} />} />
        <ProviderNode x={X_RIGHT} y={Y_SIREC} from={T.ecosystem.gc2NodeFrom} dx={190} dy={24} label="Google Cloud" icon={<GoogleCloudMark size={20} color={COLORS.navy} />} />

        <ConceptPanel
          x={X_LEFT}
          y={Y_AGENTS}
          from={T.concepts.potencia}
          heading="POTENCIA"
          body="el negocio con agentes IA propios, de SIREC o de terceros."
          accent={COLORS.blue}
        />
        <ConceptPanel
          x={X_LEFT}
          y={Y_FABRIC}
          from={T.concepts.integra}
          heading="INTEGRA"
          body="agentes en el ciclo de recobro de forma ágil y con garantías."
          accent={COLORS.turquoise}
        />
        <ConceptPanel
          x={X_LEFT}
          y={Y_SIREC}
          from={T.concepts.orquesta}
          heading="ORQUESTA"
          body="el proceso alineando cada decisión con los objetivos de negocio."
          accent={COLORS.navy}
        />
      </div>

      {/* FOREGROUND — sparse, moves the most, reads as closest to the lens */}
      <div style={{ position: "absolute", inset: 0, transform: worldTransform(cam, 1.3), transformOrigin: "0 0" }}>
        <ForegroundFloaters />
      </div>
    </>
  );
};

const ForegroundFloaters: React.FC = () => {
  const frame = useCurrentFrame();
  const spots = [
    { x: -760, y: Y_SIREC + 260, size: 10 },
    { x: 720, y: Y_AGENTS - 340, size: 8 },
  ];
  return (
    <>
      {spots.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: s.x,
            top: s.y + Math.sin(frame / 70 + i) * 18,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: i === 0 ? COLORS.turquoise : COLORS.blue,
            opacity: 0.3,
            filter: "blur(1px)",
          }}
        />
      ))}
    </>
  );
};
