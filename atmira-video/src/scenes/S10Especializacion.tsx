import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Finish } from "../components/Stage";
import { FootageSeq } from "../components/Stock";
import { Chrome } from "../components/Chrome";
import { MaskLine, font } from "../components/Type";
import { C, EASE } from "../theme";
import { clamp, ramp } from "../lib/anim";
import { cue } from "../lib/tl";
import { ESPECIALIZACION } from "../data/content";

const ID = "especializacion";

/** Las tres ideas del Digital Brain, una por tramo de voz. */
const CHIPS = [
  { t: "Conocimiento de cada dominio de negocio", from: "dominio de negocio" },
  { t: "Conocimiento tecnológico aplicado", from: "tecnológico" },
  { t: "Modernizar dominio a dominio", from: "modernizar" },
];

export const S10Especializacion: React.FC = () => {
  const frame = useCurrentFrame();
  const cSub = cue(ID, "habilitada");
  const cA = cue(ID, "El conocimiento");
  const cB = cue(ID, "lo hace posible");
  const cC = CHIPS.map((c) => cue(ID, c.from));

  const aOut = ramp(frame, cB - 26, 14, EASE.in);
  const a = ramp(frame, cA - 8, 26, EASE.out);
  const b = ramp(frame, cB - 8, 24, EASE.out);

  return (
    <AbsoluteFill style={{ background: "#0b0a12" }}>
      <FootageSeq
        shots={[
          { name: "especializacion", from: 0, rate: 0.7, panX: -60, drift: 1.16 },
          { name: "circuit", from: cB - 8, rate: 0.6, panX: 70, panY: -20, drift: 1.18, brightness: 0.95 },
          { name: "eng", from: cC[0] - 8, rate: 0.85, panX: -50, drift: 1.14, brightness: 0.85 },
        ]}
        veil={0.34}
        vignette={0.55}
      />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(8,7,16,0.84) 0%, rgba(8,7,16,0.55) 60%, rgba(8,7,16,0.2) 100%)" }} />
      <Chrome chapter="09 · Especialización" start={2} tone="dark" />

      <div style={{ position: "absolute", left: 120, top: 150, ...font(150, 700, { color: "#FFFFFF", letterSpacing: "-0.05em", lineHeight: 1 }) }}>
        <MaskLine start={cue(ID, "Especialización") - 4} dur={30}>Especialización</MaskLine>
      </div>
      <div style={{ position: "absolute", left: 124, top: 330, ...font(58, 500, { color: "#FF4DA6", letterSpacing: "-0.03em" }) }}>
        <MaskLine start={cSub - 6} dur={26}>{ESPECIALIZACION.sub}</MaskLine>
      </div>

      <div style={{ position: "absolute", left: 124, top: 490, width: 1100, opacity: clamp(a * 1.5) * (1 - aOut), transform: `translateY(${(1 - a) * 26 - aOut * 20}px)`, ...font(60, 500, { color: "#FFFFFF", letterSpacing: "-0.035em", lineHeight: 1.12 }) }}>
        El conocimiento del negocio es lo que convierte la tecnología en resultados.
      </div>
      <div style={{ position: "absolute", left: 124, top: 490, width: 1100, opacity: clamp(b * 1.5), transform: `translateY(${(1 - b) * 26}px)`, ...font(60, 500, { color: "#FFFFFF", letterSpacing: "-0.035em", lineHeight: 1.12 }) }}>
        El <span style={{ color: "#FF4DA6" }}>Digital Brain</span> lo hace posible.
      </div>

      <div style={{ position: "absolute", left: 124, top: 690, width: 1500, display: "flex", flexDirection: "column", gap: 22 }}>
        {CHIPS.map((c, i) => {
          const p = ramp(frame, cC[i] - 8, 24, EASE.out);
          return (
            <div
              key={c.t}
              style={{
                width: "fit-content",
                borderRadius: 14,
                background: "rgba(255,255,255,0.1)",
                borderLeft: `8px solid ${C.magenta}`,
                backdropFilter: "blur(6px)",
                padding: "20px 38px",
                opacity: clamp(p * 1.5),
                transform: `translateX(${(1 - p) * -80}px)`,
                ...font(44, 600, { color: "#FFFFFF", letterSpacing: "-0.03em", lineHeight: 1.1 }),
              }}
            >
              {c.t}
            </div>
          );
        })}
      </div>
      <Finish tone="dark" />
    </AbsoluteFill>
  );
};
