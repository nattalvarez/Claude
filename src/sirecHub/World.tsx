import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../styles/theme";
import { FlowLine } from "../agentFabric/FlowLine";
import {
  cameraAt,
  worldTransform,
  WORLD_OFFSET,
  WORLD_SVG_SIZE,
  CENTER,
  SPOKES,
  AGENT_FABRIC_POS,
  SCHEMA_FADE,
  ChannelKey,
  T,
} from "./timeline";
import { TitleScene } from "./TitleScene";
import { OutroScene } from "./OutroScene";
import { SirecCore } from "./SirecCore";
import { ChannelNode, ChannelVariant, LabelSide } from "./ChannelNode";
import { AgentFabricLayer } from "./AgentFabricLayer";
import {
  AmistosaMark,
  LitigiosaMark,
  CobranzaMark,
  DespachosMark,
  PresencialMark,
  SelfServiceMark,
  SeguimientoMark,
  PrevencionMark,
  AnticipacionMark,
} from "./marks";

const O = WORLD_OFFSET;

type MarkComponent = React.FC<{ size?: number; color?: string }>;

// The whole ring, data-driven: names for the six pre-existing channels are
// untouched, and the three new ones slot in ahead of them in the exact
// order requested — seguimiento, prevención, anticipación, self-service,
// presencial, agencias, amistosa interna, litigiosa interna, despachos.
const CHANNELS: {
  key: ChannelKey;
  label: string;
  Icon: MarkComponent;
  accent: string;
  variant: ChannelVariant;
  labelSide: LabelSide;
}[] = [
  { key: "seguimiento", label: "Seguimiento del riesgo", Icon: SeguimientoMark, accent: COLORS.turquoise, variant: "pop", labelSide: "top" },
  { key: "prevencion", label: "Gestión preventiva", Icon: PrevencionMark, accent: COLORS.blue, variant: "unfold", labelSide: "top" },
  { key: "anticipacion", label: "Gestión anticipativa", Icon: AnticipacionMark, accent: COLORS.turquoise, variant: "flow", labelSide: "right" },
  { key: "selfService", label: "Gestión self-service", Icon: SelfServiceMark, accent: COLORS.blue, variant: "pop", labelSide: "bottom" },
  { key: "presencial", label: "Gestión presencial", Icon: PresencialMark, accent: COLORS.turquoise, variant: "unfold", labelSide: "bottom" },
  { key: "cobranza", label: "Agencias de cobranza", Icon: CobranzaMark, accent: COLORS.blue, variant: "flow", labelSide: "bottom" },
  { key: "amistosa", label: "Gestión interna amistosa", Icon: AmistosaMark, accent: COLORS.turquoise, variant: "pop", labelSide: "left" },
  { key: "litigiosa", label: "Gestión interna litigiosa", Icon: LitigiosaMark, accent: COLORS.blue, variant: "unfold", labelSide: "top" },
  { key: "despachos", label: "Despachos de abogados", Icon: DespachosMark, accent: COLORS.turquoise, variant: "flow", labelSide: "top" },
];

/** Sparse background particles drifting through the whole vertical span —
 * the piece's one ambient texture, kept deliberately quiet. */
const AmbientField: React.FC = () => {
  const frame = useCurrentFrame();
  const dots = [
    { x: -900, y: -1300, s: 5, c: COLORS.turquoise },
    { x: 950, y: -1100, s: 4, c: COLORS.blue },
    { x: -1050, y: -200, s: 6, c: COLORS.blue },
    { x: 1100, y: 300, s: 4, c: COLORS.turquoise },
    { x: -700, y: 900, s: 5, c: COLORS.blue },
    { x: 850, y: 1000, s: 4, c: COLORS.turquoise },
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
            opacity: 0.4,
            filter: "blur(0.5px)",
          }}
        />
      ))}
    </>
  );
};

/** The whole schema at equal weight: SIREC at the hub, nine channels the
 * same size around it with a solid label card each, none of them ever
 * hidden once they appear — until the outro, when the whole schema recedes
 * together to make room for the closing phrase. */
export const World: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = cameraAt(frame);

  const schemaOpacity = interpolate(frame, [SCHEMA_FADE.start, SCHEMA_FADE.start + SCHEMA_FADE.duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <>
      {/* BACKGROUND — farthest layer, moves the least */}
      <div style={{ position: "absolute", inset: 0, transform: worldTransform(cam, 0.15), transformOrigin: "0 0" }}>
        <AmbientField />
      </div>

      {/* MID — the whole orchestration wheel, one-to-one with the camera */}
      <div style={{ position: "absolute", inset: 0, transform: worldTransform(cam, 1), transformOrigin: "0 0" }}>
        <TitleScene />

        <div style={{ opacity: schemaOpacity }}>
          <svg
            width={WORLD_SVG_SIZE}
            height={WORLD_SVG_SIZE}
            style={{ position: "absolute", left: -O, top: -O }}
            viewBox={`0 0 ${WORLD_SVG_SIZE} ${WORLD_SVG_SIZE}`}
          >
            {CHANNELS.map((c, i) => (
              <FlowLine
                key={c.key}
                x1={CENTER.x + O}
                y1={CENTER.y + O}
                x2={SPOKES[c.key].x + O}
                y2={SPOKES[c.key].y + O}
                from={T[c.key].line}
                duration={T[c.key].lineDuration}
                color={c.accent}
                strokeWidth={1.8}
                opacity={0.55}
                flowSpeed={i % 3 === 0 ? 60 : 90}
              />
            ))}

            <FlowLine x1={CENTER.x + O} y1={CENTER.y + O} x2={AGENT_FABRIC_POS.x + O} y2={AGENT_FABRIC_POS.y + O} from={T.agentFabric.line} duration={T.agentFabric.lineDuration} color={COLORS.blue} strokeWidth={2.2} opacity={0.6} flowSpeed={65} />
          </svg>

          <SirecCore />

          {CHANNELS.map((c) => (
            <ChannelNode
              key={c.key}
              x={SPOKES[c.key].x}
              y={SPOKES[c.key].y}
              nodeFrom={T[c.key].node}
              labelFrom={T[c.key].label}
              label={c.label}
              icon={<c.Icon size={22} color={COLORS.navy} />}
              accent={c.accent}
              variant={c.variant}
              labelSide={c.labelSide}
            />
          ))}

          <AgentFabricLayer />
        </div>

        <OutroScene />
      </div>

      {/* FOREGROUND — sparse, closest to the lens */}
      <div style={{ position: "absolute", inset: 0, transform: worldTransform(cam, 1.3), transformOrigin: "0 0" }}>
        <ForegroundFloaters />
      </div>
    </>
  );
};

const ForegroundFloaters: React.FC = () => {
  const frame = useCurrentFrame();
  const spots = [
    { x: -1100, y: -600, size: 9, c: COLORS.turquoise },
    { x: 1050, y: 500, size: 8, c: COLORS.blue },
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
