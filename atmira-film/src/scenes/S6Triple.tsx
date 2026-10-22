import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";
import { Scene, useGT, useExit } from "../components/Scene";
import { SceneStack } from "../components/Layers";
import { Footage } from "../components/Footage";
import { prog } from "../lib/anim";
import { alpha } from "../lib/color";
import { SCENES, vw } from "../timing";

const c = theme.colors;
const F = theme.fonts;
const S = SCENES.s6.start;

const ROWS = [
  { n: "01", word: "Potencia", at: vw("potencia"), desc: "tu negocio con agentes IA, propios o de terceros" },
  { n: "02", word: "Integra", at: vw("integra", 1), desc: "agentes en el ciclo de recobro, con agilidad y garantías" },
  { n: "03", word: "Orquesta", at: vw("orquesta", 1), desc: "cada decisión alineada con los objetivos de negocio" },
];
const TOP = [168, 440, 712];

const Row: React.FC<{ r: (typeof ROWS)[number]; i: number }> = ({ r, i }) => {
  const gt = useGT();
  const ex = useExit(0.22);
  const p = prog(gt, r.at - 0.1, 0.5, theme.ease.out);
  const nextAt = ROWS[i + 1]?.at ?? 99;
  const dim = prog(gt, nextAt, 0.25, theme.ease.out) * 0.62; // earlier words recede
  const bar = prog(gt, r.at - 0.1, 0.45, theme.ease.out);
  const d = prog(gt, r.at + 0.1, 0.6, theme.ease.out);
  const ghost = prog(gt, S + i * 0.12, 0.5, theme.ease.out);
  const wordStyle: React.CSSProperties = { fontFamily: F.sans, fontWeight: 700, fontSize: 178, letterSpacing: "-0.045em", lineHeight: 1.05, whiteSpace: "nowrap" };
  return (
    <div style={{ position: "absolute", left: 120, right: 120, top: TOP[i], height: 240, opacity: (1 - dim) * (1 - ex), transform: `translateY(${-ex * 24}px)` }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 2, background: alpha(c.ice, 0.28) }}>
        <div style={{ height: "100%", width: `${bar * 100}%`, background: c.ice }} />
      </div>
      <div style={{ position: "absolute", left: 0, top: 30, fontFamily: F.mono, fontSize: 24, fontWeight: 600, letterSpacing: "0.2em", color: alpha(c.ice, 0.85), opacity: Math.min(1, p * 2) }}>{r.n}</div>
      {/* outline "ghost" of the word that is still to come */}
      <div style={{ position: "absolute", left: 0, top: 56, ...wordStyle, color: "transparent", WebkitTextStroke: `2px ${alpha(c.ice, 0.3)}`, opacity: (1 - Math.min(1, p * 4)) * ghost }}>{r.word}.</div>
      {/* the word itself: masked slide-up, sharp all the way */}
      <div style={{ position: "absolute", left: 0, top: 56, clipPath: "inset(-0.1em -0.1em -0.1em -0.1em)" }}>
        <div style={{ ...wordStyle, color: "#fff", transform: `translateY(${(1 - p) * 120}%)` }}>
          {r.word}
          <span style={{ color: c.turq }}>.</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 1030, top: 84, width: 700, fontFamily: F.sans, fontWeight: 500, fontSize: 42, lineHeight: 1.18, letterSpacing: "-0.015em", color: c.ice, opacity: d, transform: `translateX(${(1 - d) * 40}px)` }}>
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
    <SceneStack
      variant="blue"
      assets={
        <>
          <Footage src="s6_datacenter.mp4" tint={c.blue} tintOpacity={0.55} dark={0.4} darkColor={c.navy} sat={0.8} contrast={1.1} bright={0.9} zoom={[1.05, 1.14]} opacity={0.5} />
          <Beams />
        </>
      }
    >
      {ROWS.map((r, i) => (
        <Row key={i} r={r} i={i} />
      ))}
    </SceneStack>
  </Scene>
);
