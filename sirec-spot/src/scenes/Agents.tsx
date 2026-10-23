import React, { useMemo } from "react";
import { theme } from "../theme";
import { Scene, useGT, useExit } from "../components/Scene";
import { CueText, Tok } from "../components/CueText";
import { SirecLogo } from "../components/Brand";
import { Icon } from "../components/Icons";
import { clamp, prog, rng } from "../lib/anim";
import { alpha } from "../lib/color";
import { gap, vw, vwe } from "../timing";

const c = theme.colors;
const SHADOW = "0 6px 50px rgba(6,14,28,0.6)";

const A: Tok[] = [
  { t: "Agentes", at: vw("agentes") },
  { t: "de", at: vw("de", 0) },
  { t: "inteligencia", at: vw("inteligencia", 1) },
  { t: "artificial", at: vw("artificial"), serif: true },
];
const C: Tok[] = [
  { t: "En", at: vw("en", 0) },
  { t: "una", at: vw("una") },
  { t: "sola", at: vw("sola") },
  { t: "corriente.", at: vw("corriente", 1), serif: true },
];

const Chip: React.FC<{ label: string; at: number; color: string; icon?: boolean; size?: number; exitAt?: number }> = ({ label, at, color, icon, size = 38, exitAt }) => {
  const gt = useGT();
  const ex = useExit(0.3);
  const p = prog(gt, at - 0.06, 0.6, theme.ease.out);
  const o = exitAt ? prog(gt, exitAt, 0.25, theme.ease.in) : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, height: size + 36, padding: `0 ${size * 0.7}px 0 ${size * 0.45}px`, borderRadius: size, background: "rgba(10,22,44,0.5)", border: `1.5px solid ${alpha(color, 0.75)}`, backdropFilter: "blur(14px)", color: "#fff", fontFamily: theme.fonts.sans, fontWeight: 600, fontSize: size, letterSpacing: "-0.015em", opacity: Math.min(1, p * 2) * (1 - ex) * (1 - o), transform: `translateY(${(1 - p) * 26}px)` }}>
      {icon ? <Icon name="check" size={size * 0.85} stroke={2.6} color={color} /> : <span style={{ width: 14, height: 14, borderRadius: 7, background: color }} />}
      {label}
    </div>
  );
};

/** Several "agent" currents wander, then merge into one stream on "una sola corriente". */
const Streams: React.FC = () => {
  const gt = useGT();
  const ex = useExit(0.3);
  const lines = useMemo(() => {
    const r = rng(21);
    return Array.from({ length: 7 }, (_, i) => ({ own: i < 3, off: (i - 3) * 46 + (r() - 0.5) * 30, ph: r() * 6.28, amp: 26 + r() * 38, k: 0.0045 + r() * 0.002, sp: 0.5 + r() * 0.5 }));
  }, []);
  const appear = prog(gt, vw("agentes"), 0.9, theme.ease.out);
  const conv = prog(gt, vw("sola"), vwe("corriente", 1) - vw("sola") + 0.3, theme.ease.inOut);
  const draw = prog(gt, vw("agentes"), 1.4, theme.ease.inOut);
  const N = 90;
  const W = 1920;
  const y0 = 430;
  const y = (L: (typeof lines)[number], x: number) => {
    const wob = L.amp * (1 - conv) * Math.sin(x * L.k * 2 + L.ph + gt * L.sp * 2);
    const main = 34 * Math.sin(x * 0.0042 + gt * 1.1) + 12 * Math.sin(x * 0.011 - gt * 1.7);
    return y0 + L.off * (1 - conv) + wob + main;
  };
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: appear * (1 - ex) }}>
      <defs>
        <clipPath id="stream-clip"><rect x={0} y={0} width={W * draw} height={1080} /></clipPath>
      </defs>
      <g clipPath="url(#stream-clip)" style={{ mixBlendMode: "screen" }}>
        {lines.map((L, i) => {
          const d = Array.from({ length: N + 1 }, (_, k) => `${k ? "L" : "M"}${((k / N) * W).toFixed(1)} ${y(L, (k / N) * W).toFixed(1)}`).join(" ");
          const col = L.own ? c.turq : c.ice;
          return <path key={i} d={d} fill="none" stroke={col} strokeWidth={conv > 0.9 ? 3.5 : 2.2} strokeOpacity={0.55 + 0.4 * conv} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 8px ${alpha(col, 0.8)})` }} />;
        })}
      </g>
      {lines.map((L, i) =>
        [0, 1, 2].map((j) => {
          const x = (((gt * (140 + i * 18) + j * 640 + i * 90) % (W + 200)) - 100);
          return <circle key={`${i}-${j}`} cx={x} cy={y(L, x)} r={4.5} fill="#fff" opacity={0.85 * draw} />;
        }),
      )}
    </svg>
  );
};

export const Agents: React.FC = () => (
  <Scene from={gap("inteligencia")} to={gap("cumplimiento")} name="SIREC reúne a los agentes">
    <Streams />
    <LogoIn />
    <CueText family="serif" tokens={A} size={86} exitAt={vw("propios") - 0.15} style={{ position: "absolute", left: 120, top: 740, width: 1500, textShadow: SHADOW }} />
    <div style={{ position: "absolute", left: 120, top: 720, display: "flex", gap: 22 }}>
      <Chip label="Agentes propios" at={vw("propios")} color={c.turq} exitAt={vwe("terceros") + 0.12} />
      <Chip label="Agentes de terceros" at={vw("terceros")} color={c.ice} exitAt={vwe("terceros") + 0.12} />
    </div>
    <CueText family="serif" tokens={C} size={120} exitAt={gap("corriente", 1)} style={{ position: "absolute", left: 120, top: 700, width: 1500, textShadow: SHADOW }} />
    <div style={{ position: "absolute", left: 120, top: 800, display: "flex", gap: 26 }}>
      <Chip label="Orquestados" at={vw("orquestados")} color={c.turq} icon size={46} />
      <Chip label="Seguros" at={vw("seguros")} color={c.turq} icon size={46} />
      <Chip label="Con cumplimiento" at={vw("cumplimiento")} color={c.turq} icon size={46} />
    </div>
  </Scene>
);

const LogoIn: React.FC = () => {
  const gt = useGT();
  const ex = useExit(0.3);
  const p = prog(gt, vw("sirec", 0) - 0.1, 0.9, theme.ease.out);
  return (
    <div style={{ position: "absolute", left: 120, top: 92, opacity: p * (1 - ex), clipPath: `inset(0 ${(1 - p) * 100}% 0 0)` }}>
      <SirecLogo width={250} variant="white" />
    </div>
  );
};
