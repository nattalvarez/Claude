import React from "react";
import { theme } from "../theme";
import { Scene, useGT, useExit } from "../components/Scene";
import { CueText, Tok } from "../components/CueText";
import { clamp, lerp, prog } from "../lib/anim";
import { alpha } from "../lib/color";
import { gap, vw, vwe } from "../timing";

const c = theme.colors;
const SHADOW = "0 6px 50px rgba(6,14,28,0.55)";

const TXT: Tok[] = [
  { t: "Un", at: vw("un", 0) },
  { t: "crédito", at: vw("credito") },
  { t: "también", at: vw("tambien") },
  { t: "es", at: vw("es", 0) },
  { t: "un", at: vw("un", 1) },
  { t: "ciclo.", at: vw("ciclo"), serif: true },
];

const CX = 1400, CY = 540, R = 205;
const NODES = [
  { label: "Nace", at: vw("nace"), ang: -90, side: "top" },
  { label: "Fluye", at: vw("fluye"), ang: 30, side: "right" },
  { label: "Vuelve", at: vw("volver"), ang: 150, side: "left" },
] as const;

const pos = (ang: number, r = R) => ({ x: CX + r * Math.cos((ang * Math.PI) / 180), y: CY + r * Math.sin((ang * Math.PI) / 180) });

const Ring: React.FC = () => {
  const gt = useGT();
  const ex = useExit(0.3);
  const appear = prog(gt, gap("ciclo") - 0.2, 0.9, theme.ease.out);
  const t0 = NODES[0].at - 0.15;
  const t1 = vwe("volver") + 0.5;
  const p = prog(gt, t0, t1 - t0, theme.ease.inOut);
  const closed = prog(gt, t1, 0.8, theme.ease.out);
  const circ = 2 * Math.PI * R;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: (1 - ex) * appear }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="#fff" strokeOpacity={0.2} strokeWidth={2} />
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="#fff" strokeWidth={3.5} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - p)} transform={`rotate(-90 ${CX} ${CY})`} style={{ filter: `drop-shadow(0 0 14px ${alpha(c.turq, 0.9)})` }} />
        {closed > 0 ? <circle cx={CX} cy={CY} r={R + closed * 110} fill="none" stroke={c.turq} strokeOpacity={(1 - closed) * 0.7} strokeWidth={2} /> : null}
        {NODES.map((n, i) => {
          const q = prog(gt, n.at - 0.1, 0.5, theme.ease.out);
          const pt = pos(n.ang);
          const pulse = Math.max(0, 1 - (gt - n.at) / 1.1);
          return (
            <g key={i}>
              <circle cx={pt.x} cy={pt.y} r={(10 + 26 * pulse) * q} fill={c.turq} fillOpacity={0.25 * pulse} />
              <circle cx={pt.x} cy={pt.y} r={11 * q} fill="#fff" />
            </g>
          );
        })}
      </svg>
      {NODES.map((n, i) => {
        const q = prog(gt, n.at - 0.08, 0.7, theme.ease.out);
        const pt = pos(n.ang, R + 52);
        const style: React.CSSProperties =
          n.side === "top"
            ? { left: pt.x - 150, width: 300, textAlign: "center", top: pt.y - 44 }
            : n.side === "right"
              ? { left: pt.x - 10, top: pt.y - 36 }
              : { right: 1920 - pt.x - 10, top: pt.y - 36, textAlign: "right" };
        return (
          <div key={i} style={{ position: "absolute", fontFamily: theme.fonts.serif, fontStyle: "italic", fontSize: 66, color: "#fff", textShadow: SHADOW, opacity: q, transform: `translateY(${(1 - q) * 18}px)`, ...style }}>
            {n.label}
          </div>
        );
      })}
    </div>
  );
};

export const Cycle: React.FC = () => (
  <Scene from={gap("camino")} to={gap("volver")} name="Un crédito es un ciclo">
    <CueText family="serif" tokens={TXT} size={92} style={{ position: "absolute", left: 120, top: 400, width: 820, textShadow: SHADOW }} />
    <Ring />
  </Scene>
);
