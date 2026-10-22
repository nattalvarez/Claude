import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Finish } from "../components/Stage";
import { StockVideo } from "../components/Stock";
import { Chrome } from "../components/Chrome";
import { Karaoke, SyncWords } from "../components/Sync";
import { font } from "../components/Type";
import { C, EASE, FONT } from "../theme";
import { clamp, ramp, rampOut } from "../lib/anim";
import { cue, cueEnd, voiceEnd, voiceStart } from "../lib/tl";
import { MODERNIZAR } from "../data/content";

const ID = "modernizar";

export const S02Modernizar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const v0 = voiceStart(ID);
  const cStatEnd = cueEnd(ID, "continua");
  const cPara = cue(ID, "Es convertir");
  const cParaEnd = cueEnd(ID, "técnica");
  const cQue = cue(ID, "Qué gana el negocio");
  const cGain = [cue(ID, "Velocidad"), cue(ID, "Conocimiento que se queda"), cue(ID, "Cumplimiento como ventaja"), cue(ID, "datos listos para la IA")];
  const cInn = cue(ID, "Innovación continua");

  // complejidad → orden a lo largo de la explicación
  const order = ramp(frame, 0, cParaEnd, EASE.inOut) * 0.95 + 0.05;
  const phase3 = ramp(frame, cQue - 14, 24, EASE.inOut);
  const phase4 = ramp(frame, cInn - 12, 26, EASE.inOut);

  // el titular pasa a cabecera cuando entra el párrafo
  const compress = ramp(frame, cPara - 10, 30, EASE.inOut);
  const statY = 330;
  const statScale = 1;
  const statExit = ramp(frame, cQue - 16, 14, EASE.in);

  return (
    <AbsoluteFill>
      <StockVideo name="modernizar" rate={0.75} brightness={0.9} veil={0.42 + 0.25 * phase3 + 0.1 * phase4} vignette={0.55} drift={1.1} driftFrames={900} />
      <AbsoluteFill style={{ background: `linear-gradient(90deg, rgba(8,7,16,${0.8 - 0.2 * phase3}) 0%, rgba(8,7,16,0.55) 60%, rgba(8,7,16,0.2) 100%)` }} />
      <Chrome chapter="01 · Modernizar" start={4} tone="dark" />

      {/* Titular → cabecera */}
      <div
        style={{
          position: "absolute",
          left: 120,
          top: statY,
          width: 1560,
          transformOrigin: "left top",
          transform: `scale(${statScale})`,
          opacity: 1 - statExit,
          ...font(120, 600, { color: "#FFFFFF", letterSpacing: "-0.045em", lineHeight: 1.04 }),
        }}
      >
        <SyncWords
          scene={ID}
          text="Modernizar es renovar lo que sostiene el negocio, dominio a dominio y de forma continua."
          from="Modernizar"
          accent={[8, 9, 10, 11, 12, 13, 14]}
          lead={4}
        />
      </div>

      {/* Qué gana el negocio: el lienzo se vuelve magenta y las cuatro ideas entran como palabras gigantes */}
      <AbsoluteFill style={{ opacity: phase3 * (1 - phase4) }}>
        <div style={{ position: "absolute", left: 120, top: 112, ...font(22, 600, { color: "rgba(255,255,255,0.78)", letterSpacing: "0.2em", textTransform: "uppercase" }) }}>
          {MODERNIZAR.gainsLabel}
        </div>
        {MODERNIZAR.gains.map((g, i) => {
          const s0 = cGain[i] - 8;
          const p = ramp(frame, s0, 24, EASE.out);
          const nextOn = i + 1 < cGain.length ? ramp(frame, cGain[i + 1] - 8, 20, EASE.out) : 0;
          return (
            <div key={i} style={{ position: "absolute", left: 120, top: 200 + i * 190, width: 1680, height: 170 }}>
              <div style={{ overflow: "hidden", paddingBottom: "0.12em", width: 1680 }}>
                <div style={{ transform: `translateY(${(1 - p) * 105}%)`, opacity: clamp(p * 2), ...font(132, 700, { color: "#fff", letterSpacing: "-0.045em", lineHeight: 1.04 }) , filter: "none" }}>
                  <span style={{ color: `rgba(255,255,255,${1 - nextOn * 0.5})` }}>{g.t}</span>
                </div>
              </div>
              <div style={{ position: "absolute", left: 0, bottom: 0, width: 1680 * ramp(frame, s0 + 6, 30, EASE.inOut), height: 2, background: "rgba(255,255,255,0.35)" }} />
            </div>
          );
        })}
            </AbsoluteFill>

      {/* Cita de cierre */}
      <div style={{ position: "absolute", left: 120, top: 250, width: 1620, opacity: phase4 }}>
        <div style={{ ...font(148, 700, { color: "#FFFFFF", letterSpacing: "-0.05em", lineHeight: 1.0 }) }}>
          <SyncWords scene={ID} text={MODERNIZAR.pull.t} from="Innovación continua" lead={3} accent={[1]} />
        </div>
      </div>
      <Finish tone="dark" />
    </AbsoluteFill>
  );
};
