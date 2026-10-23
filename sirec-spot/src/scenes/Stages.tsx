import React from "react";
import { theme } from "../theme";
import { Scene, useGT, useExit } from "../components/Scene";
import { CueText, Tok } from "../components/CueText";
import { prog } from "../lib/anim";
import { alpha, mix } from "../lib/color";
import { gap, vw } from "../timing";

const c = theme.colors;
const SHADOW = "0 6px 50px rgba(6,14,28,0.6)";

const WARN: Tok[] = [
  { t: "Cuando", at: vw("cuando") },
  { t: "la", at: vw("la", 0) },
  { t: "corriente", at: vw("corriente", 0) },
  { t: "se", at: vw("se", 1) },
  { t: "complica,", at: vw("complica"), br: true },
  { t: "hace", at: vw("hace") },
  { t: "falta", at: vw("falta") },
  { t: "anticiparse.", at: vw("anticiparse"), serif: true },
];
const P1: Tok[] = [{ t: "Anticipar", at: vw("anticipar") }, { t: "el", at: vw("el", 1) }, { t: "riesgo.", at: vw("riesgo"), serif: true }];
const P2: Tok[] = [{ t: "Acompañar", at: vw("acompanar") }, { t: "cada", at: vw("cada") }, { t: "paso.", at: vw("paso"), serif: true }];
const P3: Tok[] = [{ t: "Recuperar", at: vw("recuperar") }, { t: "con", at: vw("con", 0) }, { t: "inteligencia.", at: vw("inteligencia", 0), serif: true }];

export const Warn: React.FC = () => (
  <Scene from={gap("volver")} to={gap("anticiparse")} name="Cuando la corriente se complica">
    <CueText family="serif" tokens={WARN} size={84} style={{ position: "absolute", left: 120, top: 600, width: 1300, textShadow: SHADOW }} />
  </Scene>
);

const STAGES = [
  { label: "Anticipación", at: vw("anticipar") },
  { label: "Seguimiento", at: vw("acompanar") },
  { label: "Recobro", at: vw("recuperar") },
];

const Rail: React.FC = () => {
  const gt = useGT();
  const ex = useExit(0.3);
  const a = prog(gt, STAGES[0].at - 0.3, 0.7, theme.ease.out);
  const f = (i: number) => prog(gt, STAGES[i].at, (STAGES[i + 1]?.at ?? gap("inteligencia")) - STAGES[i].at, theme.ease.soft);
  const fill = (f(0) + f(1) + f(2)) / 3;
  const W = 1680;
  return (
    <div style={{ position: "absolute", left: 120, top: 905, width: W, opacity: a * (1 - ex) }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
        {STAGES.map((s, i) => {
          const on = gt >= s.at - 0.05;
          const cur = on && (i === 2 || gt < STAGES[i + 1].at);
          return (
            <div key={i} style={{ width: W / 3, fontFamily: theme.fonts.sans, fontWeight: 600, fontSize: 38, letterSpacing: "-0.01em", color: cur ? c.turq : on ? "#fff" : alpha("#fff", 0.45), textShadow: SHADOW }}>
              {s.label}
            </div>
          );
        })}
      </div>
      <div style={{ position: "relative", height: 3, background: alpha("#fff", 0.28) }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${fill * 100}%`, background: mix("#ffffff", c.turq, 0.6) }} />
        <div style={{ position: "absolute", left: `${fill * 100}%`, top: -7, width: 17, height: 17, marginLeft: -8, borderRadius: 9, background: "#fff", boxShadow: `0 0 24px 4px ${alpha(c.turq, 0.8)}` }} />
      </div>
    </div>
  );
};

export const Stages: React.FC = () => (
  <Scene from={gap("anticiparse")} to={gap("inteligencia")} name="Anticipar, acompañar, recuperar">
    <CueText family="serif" tokens={P1} size={116} exitAt={gap("riesgo")} style={{ position: "absolute", left: 120, top: 330, width: 1500, textShadow: SHADOW }} />
    <CueText family="serif" tokens={P2} size={116} exitAt={gap("paso")} style={{ position: "absolute", left: 120, top: 330, width: 1500, textShadow: SHADOW }} />
    <CueText family="serif" tokens={P3} size={116} style={{ position: "absolute", left: 120, top: 330, width: 1500, textShadow: SHADOW }} />
    <Rail />
  </Scene>
);
