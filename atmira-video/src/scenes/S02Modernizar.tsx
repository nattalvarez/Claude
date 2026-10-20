import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, Finish } from "../components/Stage";
import { SilkField } from "../components/SilkField";
import { Chrome } from "../components/Chrome";
import { Karaoke, SyncWords } from "../components/Sync";
import { Eyebrow, Rule, font } from "../components/Type";
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
          ...font(104, 400, { letterSpacing: "-0.035em", lineHeight: 1.04 }),
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

      {/* Qué gana el negocio */}
      <div style={{ position: "absolute", left: 120, top: 262, opacity: phase3 * (1 - phase4 * 0.7) }}>
        <Eyebrow start={cQue - 6}>{MODERNIZAR.gainsLabel}</Eyebrow>
      </div>
      {MODERNIZAR.gains.map((g, i) => {
        const x = 120 + i * 430;
        const s = cGain[i] - 8;
        const p = ramp(frame, s, 24, EASE.out);
        const dim = phase4 * 0.62;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: 330 - phase4 * 30, width: 390, opacity: clamp(p * 1.5) * (1 - dim) }}>
            <Rule start={s} width={390} color={C.magenta} thickness={3} dur={22} />
            <div style={{ transform: `translateY(${(1 - p) * 26}px)`, filter: `blur(${(1 - p) * 5}px)` }}>
              <div style={{ marginTop: 22, ...font(20, 600, { color: C.magenta, letterSpacing: "0.16em" }) }}>{String(i + 1).padStart(2, "0")}</div>
              <div style={{ marginTop: 10, ...font(44, 500, { letterSpacing: "-0.028em", lineHeight: 1.08 }) }}>{g.t}</div>
              <div style={{ marginTop: 18, ...font(25, 400, { color: C.ink2, lineHeight: 1.38, letterSpacing: "0" }) }}>{g.d}</div>
            </div>
          </div>
        );
      })}

      {/* Cita de cierre */}
      <div style={{ position: "absolute", left: 120, top: 690, width: 1560, opacity: phase4 }}>
        <div style={{ ...font(58, 600, { color: C.magenta, letterSpacing: "-0.03em" }) }}>
          <SyncWords scene={ID} text={MODERNIZAR.pull.t} from="Innovación continua" lead={3} />
        </div>
        <div style={{ marginTop: 12, ...font(50, 400, { letterSpacing: "-0.028em", lineHeight: 1.12 }) }}>
          <SyncWords scene={ID} text={MODERNIZAR.pull.d} from="la base para crecer" lead={3} />
        </div>
      </div>
      <Finish tone="mist" />
    </AbsoluteFill>
  );
};
