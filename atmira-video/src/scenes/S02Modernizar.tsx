import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Finish } from "../components/Stage";
import { FootageSeq } from "../components/Stock";
import { Chrome } from "../components/Chrome";
import { SyncWords } from "../components/Sync";
import { MaskLine, font } from "../components/Type";
import { C, EASE } from "../theme";
import { clamp, ramp } from "../lib/anim";
import { cue } from "../lib/tl";
import { MODERNIZAR } from "../data/content";

const ID = "modernizar";

/** Ideas del párrafo, una por tramo de voz. */
const IDEAS = [
  { t: "Es convertir la tecnología en valor de negocio cada día", from: "Es convertir" },
  { t: "Una transformación controlada, liderada por la arquitectura", from: "una transformación" },
  { t: "Preserva el conocimiento crítico del negocio y reduce la deuda técnica", from: "que preserva" },
];

export const S02Modernizar: React.FC = () => {
  const frame = useCurrentFrame();

  const cIdeas = IDEAS.map((i) => cue(ID, i.from));
  const cQue = cue(ID, "Qué gana el negocio");
  const cGain = [cue(ID, "Velocidad"), cue(ID, "Conocimiento que se queda"), cue(ID, "Cumplimiento como ventaja"), cue(ID, "datos listos para la IA")];
  const cInn = cue(ID, "Innovación continua");

  const phase2 = ramp(frame, cQue - 14, 24, EASE.inOut);
  const phase3 = ramp(frame, cInn - 12, 26, EASE.inOut);
  const out1 = ramp(frame, cQue - 18, 16, EASE.in);

  return (
    <AbsoluteFill style={{ background: "#0b0a12" }}>
      <FootageSeq
        shots={[
          { name: "eng", from: 0, rate: 0.9, panX: -60, drift: 1.14, brightness: 0.85 },
          { name: "meeting", from: cQue - 10, rate: 0.7, panX: 50, panY: -20, drift: 1.12, brightness: 0.8 },
          { name: "skyline", from: cInn - 14, rate: 0.6, panX: -40, drift: 1.16, brightness: 0.85 },
        ]}
        veil={0.34}
        vignette={0.55}
      />
      <AbsoluteFill style={{ background: `linear-gradient(90deg, rgba(8,7,16,${0.82 - 0.1 * phase2}) 0%, rgba(8,7,16,${0.5 + 0.1 * phase2}) 62%, rgba(8,7,16,0.2) 100%)` }} />
      <Chrome chapter="Modernizar" start={4} tone="dark" />

      {/* titular y las tres ideas que se van abriendo mientras suena el párrafo */}
      <div style={{ opacity: 1 - out1 }}>
        <div style={{ position: "absolute", left: 120, top: 150, width: 1500, ...font(104, 600, { color: "#FFFFFF", letterSpacing: "-0.045em", lineHeight: 1.04 }) }}>
          <SyncWords
            scene={ID}
            text="Modernizar es renovar lo que sostiene el negocio, dominio a dominio y de forma continua."
            from="Modernizar"
            accent={[8, 9, 10, 11, 12, 13, 14]}
            lead={4}
          />
        </div>
        {IDEAS.map((idea, i) => {
          const p = ramp(frame, cIdeas[i] - 6, 24, EASE.out);
          const lit = i === IDEAS.length - 1 ? 1 : 1 - 0.45 * ramp(frame, cIdeas[i + 1] - 6, 18);
          return (
            <div key={idea.t} style={{ position: "absolute", left: 120, top: 520 + i * 118, width: 1480, display: "flex", alignItems: "center", gap: 30, opacity: clamp(p * 1.5) * lit, transform: `translateX(${(1 - p) * -60}px)` }}>
              <span style={{ width: 8 * p + 4, height: 76, background: C.magenta, borderRadius: 3, flex: "none" }} />
              <span style={{ ...font(52, 500, { color: "#FFFFFF", letterSpacing: "-0.035em", lineHeight: 1.08 }) }}>{idea.t}</span>
            </div>
          );
        })}
      </div>

      {/* Qué gana el negocio: cuatro ideas gigantes con su explicación */}
      <AbsoluteFill style={{ opacity: phase2 * (1 - phase3) }}>
        <div style={{ position: "absolute", left: 120, top: 112, ...font(24, 600, { color: "rgba(255,255,255,0.8)", letterSpacing: "0.2em", textTransform: "uppercase" }) }}>{MODERNIZAR.gainsLabel}</div>
        {MODERNIZAR.gains.map((g, i) => {
          const s0 = cGain[i] - 8;
          const p = ramp(frame, s0, 24, EASE.out);
          const nextOn = i + 1 < cGain.length ? ramp(frame, cGain[i + 1] - 8, 20, EASE.out) : 0;
          return (
            <div key={i} style={{ position: "absolute", left: 120, top: 190 + i * 190, width: 1680, height: 170 }}>
              <div style={{ overflow: "hidden", paddingBottom: "0.12em", width: 1100 }}>
                <div style={{ transform: `translateY(${(1 - p) * 105}%)`, opacity: clamp(p * 2), ...font(92, 700, { color: "#fff", letterSpacing: "-0.045em", lineHeight: 1.04 }) }}>
                  <span style={{ color: `rgba(255,255,255,${1 - nextOn * 0.5})` }}>{g.t}</span>
                </div>
              </div>
              <div style={{ position: "absolute", left: 1170, top: 18, width: 520, opacity: clamp(p * 1.6) * (1 - nextOn * 0.45), transform: `translateY(${(1 - p) * 16}px)`, ...font(28, 400, { color: "rgba(255,255,255,0.92)", lineHeight: 1.36, letterSpacing: 0 }) }}>
                {g.d}
              </div>
              <div style={{ position: "absolute", left: 0, bottom: 0, width: 1680 * ramp(frame, s0 + 6, 30, EASE.inOut), height: 2, background: "rgba(255,255,255,0.35)" }} />
            </div>
          );
        })}
      </AbsoluteFill>

      {/* cita de cierre */}
      <div style={{ position: "absolute", left: 120, top: 300, width: 1620, opacity: phase3 }}>
        <div style={{ ...font(150, 700, { color: "#FFFFFF", letterSpacing: "-0.05em", lineHeight: 1.0 }) }}>
          <SyncWords scene={ID} text={MODERNIZAR.pull.t} from="Innovación continua" lead={3} accent={[1]} />
        </div>
        <MaskLine start={cue(ID, "la base para") - 4} dur={26} style={{ marginTop: 30, ...font(60, 500, { color: "#E9E8EF", letterSpacing: "-0.035em", lineHeight: 1.12, width: 1400 }) }}>
          {MODERNIZAR.pull.d}
        </MaskLine>
      </div>
      <Finish tone="dark" />
    </AbsoluteFill>
  );
};
