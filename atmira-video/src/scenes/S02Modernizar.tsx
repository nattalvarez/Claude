import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, Finish } from "../components/Stage";
import { SilkField } from "../components/SilkField";
import { Chrome } from "../components/Chrome";
import { Karaoke, SyncWords } from "../components/Sync";
import { font } from "../components/Type";
import { Flood } from "../components/Kinetic";
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
  const statY = interpolate(compress, [0, 1], [236, 128]);
  const statScale = interpolate(compress, [0, 1], [1, 0.5]);
  const statExit = ramp(frame, cQue - 16, 14, EASE.in);

  return (
    <AbsoluteFill>
      <Backdrop tone="mist" />
      <SilkField
        time={t + 9}
        order={order}
        seed={4}
        lines={124}
        spread={3.1}
        twist={0.7 + phase3 * 0.5}
        cam={{
          pos: [interpolate(frame, [0, 900], [-3, 4]), 2.2 - phase3 * 0.8, -15 + phase4 * 2],
          target: [1.5, 2.2 + phase3 * 1.6, 0],
          fov: 38,
          roll: -0.1,
        }}
        alpha={0.92 - phase3 * 0.2}
        style={{
          opacity: 1 - phase4 * 0.15,
          // los hilos nacen del borde inferior: nunca cruzan el texto
          WebkitMaskImage: `linear-gradient(0deg, #000 ${interpolate(phase3, [0, 1], [34, 12])}%, transparent ${interpolate(phase3, [0, 1], [64, 30])}%)`,
          maskImage: `linear-gradient(0deg, #000 ${interpolate(phase3, [0, 1], [34, 12])}%, transparent ${interpolate(phase3, [0, 1], [64, 30])}%)`,
        }}
      />
      <Chrome chapter="01 · Modernizar" start={4} />

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
          ...font(104, 600, { letterSpacing: "-0.04em", lineHeight: 1.04 }),
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

      {/* Párrafo con resaltado sincronizado */}
      <Karaoke
        scene={ID}
        text={MODERNIZAR.body}
        from="Es convertir"
        appear={cPara - 6}
        exitAt={cQue - 16}
        style={{ position: "absolute", left: 120, top: 330, width: 1380, ...font(46, 400, { letterSpacing: "-0.018em", lineHeight: 1.28 }) }}
        accent={[]}
      />

      {/* Qué gana el negocio: el lienzo se vuelve magenta y las cuatro ideas entran como palabras gigantes */}
      <Flood start={cQue - 16} end={cInn - 22} from={[1500, 760]} to={[400, 200]} inDur={34} outDur={28}>
        <div style={{ position: "absolute", left: 120, top: 112, ...font(22, 600, { color: "rgba(255,255,255,0.78)", letterSpacing: "0.2em", textTransform: "uppercase" }) }}>
          {MODERNIZAR.gainsLabel}
        </div>
        {MODERNIZAR.gains.map((g, i) => {
          const s0 = cGain[i] - 8;
          const p = ramp(frame, s0, 24, EASE.out);
          const nextOn = i + 1 < cGain.length ? ramp(frame, cGain[i + 1] - 8, 20, EASE.out) : 0;
          return (
            <div key={i} style={{ position: "absolute", left: 120, top: 200 + i * 190, width: 1680, height: 170 }}>
              <div style={{ overflow: "hidden", paddingBottom: "0.12em", width: 1250 }}>
                <div style={{ transform: `translateY(${(1 - p) * 105}%)`, opacity: clamp(p * 2), ...font(96, 700, { color: "#fff", letterSpacing: "-0.045em", lineHeight: 1.04 }) , filter: "none" }}>
                  <span style={{ color: `rgba(255,255,255,${1 - nextOn * 0.5})` }}>{g.t}</span>
                </div>
              </div>
              <div style={{ position: "absolute", left: 1270, top: 14, width: 440, opacity: clamp(p * 1.6) * (1 - nextOn * 0.45), transform: `translateY(${(1 - p) * 16}px)`, ...font(25, 400, { color: "rgba(255,255,255,0.9)", lineHeight: 1.36, letterSpacing: 0 }) }}>
                {g.d}
              </div>
              <div style={{ position: "absolute", left: 0, bottom: 0, width: 1680 * ramp(frame, s0 + 6, 30, EASE.inOut), height: 2, background: "rgba(255,255,255,0.35)" }} />
            </div>
          );
        })}
      </Flood>

      {/* Cita de cierre */}
      <div style={{ position: "absolute", left: 120, top: 250, width: 1620, opacity: phase4 }}>
        <div style={{ ...font(148, 700, { color: C.magenta, letterSpacing: "-0.05em", lineHeight: 1.0 }) }}>
          <SyncWords scene={ID} text={MODERNIZAR.pull.t} from="Innovación continua" lead={3} />
        </div>
        <div style={{ marginTop: 26, ...font(70, 500, { letterSpacing: "-0.035em", lineHeight: 1.1 }) }}>
          <SyncWords scene={ID} text={MODERNIZAR.pull.d} from="la base para crecer" lead={3} />
        </div>
      </div>
      <Finish tone="mist" />
    </AbsoluteFill>
  );
};
