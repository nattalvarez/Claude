import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Finish } from "../components/Stage";
import { FootageSeq } from "../components/Stock";
import { Chrome } from "../components/Chrome";
import { MaskLine, font } from "../components/Type";
import { C, EASE } from "../theme";
import { clamp, ramp } from "../lib/anim";
import { cue } from "../lib/tl";
import { AGENT_FACTORY } from "../data/content";

const ID = "agentfactory";

/** Cuatro ideas de la explicación, una por tramo de voz. */
const POINTS = [
  { t: "Industrializa la modernización del software", from: "industrializa" },
  { t: "La arquitectura, como guía", from: "arquitectura" },
  { t: "Agentes que aceleran la ejecución", from: "agentes" },
  { t: "Personas que gobiernan las decisiones", from: "personas" },
];

export const S06AgentFactory: React.FC = () => {
  const frame = useCurrentFrame();
  const cNo = cue(ID, "No convertimos");
  const cLa = cue(ID, "La Agent Factory");
  const cUna = cue(ID, "Una capacidad");
  const cP = POINTS.map((p) => cue(ID, p.from));

  const l1Out = ramp(frame, cLa - 4, 16, EASE.in);
  const l1 = ramp(frame, cNo - 8, 26, EASE.out);

  return (
    <AbsoluteFill style={{ background: "#0b0a12" }}>
      <FootageSeq
        shots={[
          { name: "aceleracion", from: 0, rate: 0.8, panX: -70, drift: 1.16 },
          { name: "fiber", from: cP[0] - 6, rate: 0.7, panX: 60, panY: -30, drift: 1.14, brightness: 0.85 },
          { name: "hall2", from: cP[3] - 6, rate: 0.8, panX: -40, drift: 1.18 },
        ]}
        veil={0.34}
        vignette={0.55}
      />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(8,7,16,0.82) 0%, rgba(8,7,16,0.5) 55%, rgba(8,7,16,0.15) 100%)" }} />
      <Chrome chapter="05 · Aceleración" start={2} hideLogo={false} tone="dark" />

      <div style={{ position: "absolute", left: 120, top: 150, ...font(176, 700, { color: "#FFFFFF", letterSpacing: "-0.05em", lineHeight: 1 }) }}>
        <MaskLine start={cue(ID, "Aceleración") - 4} dur={30}>Aceleración</MaskLine>
      </div>
      <div style={{ position: "absolute", left: 124, top: 354, ...font(58, 600, { color: "#FF4DA6", letterSpacing: "-0.03em" }) }}>
        <MaskLine start={cue(ID, "habilitada") - 6} dur={26}>{AGENT_FACTORY.sub}</MaskLine>
      </div>

      {/* «No convertimos código…» */}
      <div style={{ position: "absolute", left: 124, top: 500, width: 1400, opacity: clamp(l1 * 1.5) * (1 - l1Out), transform: `translateY(${(1 - l1) * 26 - l1Out * 20}px)`, ...font(62, 500, { color: "#FFFFFF", letterSpacing: "-0.035em", lineHeight: 1.12 }) }}>
        {AGENT_FACTORY.l1}
      </div>

      {/* cómo lo hace: cuatro ideas que se abren según la voz */}
      <div style={{ position: "absolute", left: 124, top: 470, width: 1672, display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 36, rowGap: 28 }}>
        {POINTS.map((pt, i) => {
          const p = ramp(frame, cP[i] - 8, 24, EASE.out);
          const hot = 0.55 + 0.45 * (i === POINTS.length - 1 ? 1 : 1 - ramp(frame, cP[i + 1] - 8, 16));
          return (
            <div
              key={pt.t}
              style={{
                height: 150,
                borderRadius: 14,
                background: "rgba(255,255,255,0.09)",
                borderLeft: `8px solid ${C.magenta}`,
                backdropFilter: "blur(6px)",
                padding: "0 34px",
                display: "flex",
                alignItems: "center",
                opacity: clamp(p * 1.5) * hot,
                transform: `translateY(${(1 - p) * 36}px)`,
                ...font(44, 600, { color: "#FFFFFF", letterSpacing: "-0.03em", lineHeight: 1.1 }),
              }}
            >
              {pt.t}
            </div>
          );
        })}
      </div>

      <div style={{ position: "absolute", left: 124, top: 890, ...font(46, 500, { color: "#FF4DA6", letterSpacing: "-0.03em" }) }}>
        <MaskLine start={cUna - 6} dur={26}>{AGENT_FACTORY.l3}</MaskLine>
      </div>
      <Finish tone="dark" />
    </AbsoluteFill>
  );
};
