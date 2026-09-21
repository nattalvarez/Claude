import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { COLORS, FONT_FAMILY } from "../styles/theme";
import { KineticText } from "../components/KineticText";
import { FlowLine } from "../agentFabric/FlowLine";
import {
  cameraAt,
  worldTransform,
  WORLD_OFFSET,
  WORLD_SVG_SIZE,
  CENTER,
  SPOKES,
  AGENT_FABRIC_POS,
  AGENT_NODES,
  TITLE_POS,
  T,
} from "./timeline";
import { TitleScene } from "./TitleScene";
import { SirecCore } from "./SirecCore";
import { ChannelNode } from "./ChannelNode";
import { AgentFabricLayer } from "./AgentFabricLayer";
import { AgentNode } from "./AgentNode";
import {
  AmistosaMark,
  LitigiosaMark,
  CobranzaMark,
  DespachosMark,
  PresencialMark,
  SelfServiceMark,
} from "./marks";

const O = WORLD_OFFSET;

/** Sparse background particles drifting through the whole vertical span —
 * the piece's one ambient texture, kept deliberately quiet. */
const AmbientField: React.FC = () => {
  const frame = useCurrentFrame();
  const dots = [
    { x: -900, y: -1300, s: 5, c: COLORS.turquoise },
    { x: 950, y: -1100, s: 4, c: COLORS.magenta },
    { x: -1050, y: -200, s: 6, c: COLORS.blue },
    { x: 1100, y: 300, s: 4, c: COLORS.turquoise },
    { x: -700, y: 900, s: 5, c: COLORS.magenta },
    { x: 850, y: 1000, s: 4, c: COLORS.blue },
    { x: 100, y: -1650, s: 5, c: COLORS.turquoise },
  ];
  return (
    <>
      {dots.map((d, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: d.x,
            top: d.y + Math.sin(frame / 90 + i) * 22,
            width: d.s,
            height: d.s,
            borderRadius: "50%",
            background: d.c,
            opacity: 0.35,
            filter: "blur(0.5px)",
          }}
        />
      ))}
    </>
  );
};

export const World: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = cameraAt(frame);

  return (
    <>
      {/* BACKGROUND — farthest layer, moves the least */}
      <div style={{ position: "absolute", inset: 0, transform: worldTransform(cam, 0.15), transformOrigin: "0 0" }}>
        <AmbientField />
      </div>

      {/* MID — the whole orchestration wheel, one-to-one with the camera */}
      <div style={{ position: "absolute", inset: 0, transform: worldTransform(cam, 1), transformOrigin: "0 0" }}>
        <TitleScene />

        <svg
          width={WORLD_SVG_SIZE}
          height={WORLD_SVG_SIZE}
          style={{ position: "absolute", left: -O, top: -O }}
          viewBox={`0 0 ${WORLD_SVG_SIZE} ${WORLD_SVG_SIZE}`}
        >
          <FlowLine x1={CENTER.x + O} y1={CENTER.y + O} x2={SPOKES.amistosa.x + O} y2={SPOKES.amistosa.y + O} from={T.amistosa.line} duration={T.amistosa.lineDuration} color={COLORS.turquoise} strokeWidth={1.8} opacity={0.55} />
          <FlowLine x1={CENTER.x + O} y1={CENTER.y + O} x2={SPOKES.litigiosa.x + O} y2={SPOKES.litigiosa.y + O} from={T.litigiosa.line} duration={T.litigiosa.lineDuration} color={COLORS.blue} strokeWidth={1.8} opacity={0.55} />
          <FlowLine x1={CENTER.x + O} y1={CENTER.y + O} x2={SPOKES.cobranza.x + O} y2={SPOKES.cobranza.y + O} from={T.cobranza.line} duration={T.cobranza.lineDuration} color={COLORS.turquoise} strokeWidth={1.8} opacity={0.55} />
          <FlowLine x1={CENTER.x + O} y1={CENTER.y + O} x2={SPOKES.despachos.x + O} y2={SPOKES.despachos.y + O} from={T.despachos.line} duration={T.despachos.lineDuration} color={COLORS.magenta} strokeWidth={1.8} opacity={0.5} flowSpeed={60} />
          <FlowLine x1={CENTER.x + O} y1={CENTER.y + O} x2={SPOKES.presencial.x + O} y2={SPOKES.presencial.y + O} from={T.presencial.line} duration={T.presencial.lineDuration} color={COLORS.blue} strokeWidth={1.8} opacity={0.55} />
          <FlowLine x1={CENTER.x + O} y1={CENTER.y + O} x2={SPOKES.selfService.x + O} y2={SPOKES.selfService.y + O} from={T.selfService.line} duration={T.selfService.lineDuration} color={COLORS.turquoise} strokeWidth={1.8} opacity={0.55} />

          <FlowLine x1={CENTER.x + O} y1={CENTER.y + O} x2={AGENT_FABRIC_POS.x + O} y2={AGENT_FABRIC_POS.y + O} from={T.agentFabric.line} duration={T.agentFabric.lineDuration} color={COLORS.magenta} strokeWidth={2.2} opacity={0.6} flowSpeed={65} />

          {AGENT_NODES.map((n, i) => (
            <FlowLine
              key={i}
              x1={AGENT_FABRIC_POS.x + O}
              y1={AGENT_FABRIC_POS.y + O}
              x2={n.x + O}
              y2={n.y + O}
              from={T.agentNodes[i].connFrom}
              duration={18}
              color={COLORS.turquoise}
              strokeWidth={1.4}
              opacity={0.45}
            />
          ))}
        </svg>

        <SirecCore />

        <ChannelNode
          x={SPOKES.amistosa.x}
          y={SPOKES.amistosa.y}
          nodeFrom={T.amistosa.node}
          labelFrom={T.amistosa.label}
          label="Gestión interna amistosa"
          icon={<AmistosaMark size={30} color={COLORS.white} />}
          accent={COLORS.turquoise}
          variant="pop"
          labelSide="right"
        />

        <ChannelNode
          x={SPOKES.litigiosa.x}
          y={SPOKES.litigiosa.y}
          nodeFrom={T.litigiosa.node}
          labelFrom={T.litigiosa.label}
          label="Gestión interna litigiosa"
          icon={<LitigiosaMark size={28} color={COLORS.white} />}
          accent={COLORS.blue}
          variant="unfold"
          labelSide="left"
        />

        <ChannelNode
          x={SPOKES.cobranza.x}
          y={SPOKES.cobranza.y}
          nodeFrom={T.cobranza.node}
          labelFrom={T.cobranza.label}
          label="Agencias de cobranza"
          icon={<CobranzaMark size={28} color={COLORS.white} />}
          accent={COLORS.turquoise}
          variant="satellite"
          satellites={T.cobranza.satellites}
          labelSide="top"
        />

        <ChannelNode
          x={SPOKES.despachos.x}
          y={SPOKES.despachos.y}
          nodeFrom={T.despachos.node}
          labelFrom={T.despachos.label}
          label="Despachos de abogados"
          icon={<DespachosMark size={28} color={COLORS.white} />}
          accent={COLORS.magenta}
          variant="flow"
          labelSide="left"
        />

        <ChannelNode
          x={SPOKES.presencial.x}
          y={SPOKES.presencial.y}
          nodeFrom={T.presencial.node}
          labelFrom={T.presencial.label}
          label="Gestión presencial"
          icon={<PresencialMark size={28} color={COLORS.white} />}
          accent={COLORS.blue}
          variant="pop"
          labelSide="bottom"
        />

        <ChannelNode
          x={SPOKES.selfService.x}
          y={SPOKES.selfService.y}
          nodeFrom={T.selfService.node}
          labelFrom={T.selfService.label}
          label="Gestión self-service"
          icon={<SelfServiceMark size={30} color={COLORS.white} />}
          accent={COLORS.turquoise}
          variant="unfold"
          labelSide="left"
        />

        <AgentFabricLayer />

        {AGENT_NODES.map((n, i) => (
          <AgentNode key={i} x={n.x} y={n.y} from={T.agentNodes[i].from} />
        ))}

        <AgentsLabel />
        <FinalTagline />
      </div>

      {/* FOREGROUND — sparse, closest to the lens */}
      <div style={{ position: "absolute", inset: 0, transform: worldTransform(cam, 1.3), transformOrigin: "0 0" }}>
        <ForegroundFloaters />
      </div>
    </>
  );
};

const AgentsLabel: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [T.agentsLabel, T.agentsLabel + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (p <= 0.001) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: AGENT_NODES[1].x,
        top: AGENT_NODES[1].y - 90,
        transform: `translate(-50%, -50%) translateY(${interpolate(p, [0, 1], [12, 0])}px)`,
        opacity: p,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <span style={{ fontFamily: FONT_FAMILY, fontWeight: 800, fontSize: 32, color: COLORS.white, whiteSpace: "nowrap" }}>
        Agentes IA
      </span>
      <span style={{ fontFamily: FONT_FAMILY, fontWeight: 500, fontSize: 15, color: COLORS.turquoise, whiteSpace: "nowrap" }}>
        SIREC Agent Fabric
      </span>
    </div>
  );
};

const FinalTagline: React.FC = () => (
  <div style={{ position: "absolute", left: TITLE_POS.x, top: TITLE_POS.y, transform: "translate(-50%, -50%)" }}>
    <KineticText
      parts={[{ text: "Todos los datos en una única plataforma.", color: COLORS.turquoise }]}
      from={T.finalTagline}
      fontSize={30}
      fontWeight={700}
      align="center"
      wordStagger={2.4}
    />
  </div>
);

const ForegroundFloaters: React.FC = () => {
  const frame = useCurrentFrame();
  const spots = [
    { x: -1100, y: -600, size: 9, c: COLORS.turquoise },
    { x: 1050, y: 500, size: 8, c: COLORS.magenta },
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
            background: s.c,
            opacity: 0.3,
            filter: "blur(1px)",
          }}
        />
      ))}
    </>
  );
};
