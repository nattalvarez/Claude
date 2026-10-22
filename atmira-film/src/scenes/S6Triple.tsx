import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";
import { Scene, useGT, useExit } from "../components/Scene";
import { SceneStack } from "../components/Layers";
import { lerp, prog, spr } from "../lib/anim";
import { alpha } from "../lib/color";
import { vo } from "../timing";

const c = theme.colors;
const F = theme.fonts;

const ROWS = [
  { n: "01", word: "Potencia", at: vo(28.42), desc: "tu negocio con agentes IA, propios o de terceros" },
  { n: "02", word: "Integra", at: vo(29.38), desc: "agentes en el ciclo de recobro, con agilidad y garantías" },
  { n: "03", word: "Orquesta", at: vo(30.22), desc: "cada decisión alineada con los objetivos de negocio" },
];
const TOP = [168, 440, 712];

const Row: React.FC<{ r: (typeof ROWS)[number]; i: number }> = ({ r, i }) => {
  const gt = useGT();
  const ex = useExit(0.22);
  const p = spr(gt, r.at, theme.spring.slam, 2);
  const nextAt = ROWS[i + 1]?.at ?? 99;
  const dim = prog(gt, nextAt, 0.25, theme.ease.out) * 0.62; // earlier words recede
  const flash = Math.max(0, 1 - (gt - r.at) / 0.55);
  const bar = prog(gt, r.at - 0.05, 0.4, theme.ease.out);
  const d = spr(gt, r.at + 0.12, theme.spring.smooth, 0);
  const ghost = prog(gt, 29.5 + i * 0.12, 0.5, theme.ease.out);
  return (
    <div style={{ position: "absolute", left: 120, right: 120, top: TOP[i], height: 240, opacity: (1 - dim) * (1 - ex), transform: `translateY(${-ex * 24}px)` }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 2, background: alpha(c.ice, 0.28) }}>
        <div style={{ height: "100%", width: `${bar * 100}%`, background: c.ice, boxShadow: `0 0 ${24 * flash}px ${c.white}` }} />
      </div>
      <div style={{ position: "absolute", left: 0, top: 30, fontFamily: F.mono, fontSize: 24, fontWeight: 600, letterSpacing: "0.2em", color: alpha(c.ice, 0.85), opacity: Math.min(1, p * 2) }}>{r.n}</div>
      <div
        style={{
          position: "absolute", left: 0, top: 56, fontFamily: F.sans, fontWeight: 700, fontSize: 178, letterSpacing: "-0.045em", lineHeight: 1, whiteSpace: "nowrap",
          color: "transparent", WebkitTextStroke: `2px ${alpha(c.ice, 0.3)}`, opacity: (1 - Math.min(1, p * 3)) * ghost,
        }}
      >
        {r.word}.
      </div>
      <div
        style={{
          position: "absolute", left: 0, top: 56, fontFamily: F.sans, fontWeight: 700, fontSize: 178, letterSpacing: "-0.045em", lineHeight: 1, color: "#fff",
          opacity: Math.min(1, p * 1.8), transform: `translateX(${lerp(p, -260, 0)}px) scale(${lerp(p, 1.1, 1)})`, filter: `blur(${lerp(Math.min(1, p), 22, 0)}px)`,
          textShadow: `0 0 ${60 * flash}px ${alpha(c.white, 0.6)}`, whiteSpace: "nowrap",
        }}
      >
        {r.word}
        <span style={{ color: c.turq }}>.</span>
      </div>
      <div style={{ position: "absolute", left: 1030, top: 84, width: 700, fontFamily: F.sans, fontWeight: 500, fontSize: 42, lineHeight: 1.18, letterSpacing: "-0.015em", color: c.ice, opacity: d, transform: `translateX(${lerp(d, 50, 0)}px)` }}>
        {r.desc}
      </div>
    </div>
  );
};

const Beams: React.FC = () => {
  const gt = useGT();
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {[0, 1].map((k) => (
        <div key={k} style={{ position: "absolute", top: -200, bottom: -200, width: 420 - k * 150, left: ((gt * (90 + k * 70) + k * 700) % 2700) - 500, transform: "skewX(-18deg)", background: `linear-gradient(90deg, transparent, ${alpha("#fff", 0.07 - k * 0.025)}, transparent)` }} />
      ))}
      <div style={{ position: "absolute", right: -160, top: 60, width: 900, height: 900, borderRadius: "50%", border: `2px solid ${alpha(c.ice, 0.16)}` }} />
      <div style={{ position: "absolute", right: -60, top: 160, width: 700, height: 700, borderRadius: "50%", border: `2px solid ${alpha(c.ice, 0.12)}` }} />
    </AbsoluteFill>
  );
};

export const S6Triple: React.FC = () => (
  <Scene id="s6">
    <SceneStack variant="blue" assets={<Beams />}>
      {ROWS.map((r, i) => (
        <Row key={i} r={r} i={i} />
      ))}
    </SceneStack>
  </Scene>
);
