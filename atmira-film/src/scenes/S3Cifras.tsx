import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";
import { Scene, useGT, useExit } from "../components/Scene";
import { SceneStack } from "../components/Layers";
import { Skyline } from "../components/Skyline";
import { CueText, Eyebrow, Tok } from "../components/CueText";
import { lerp, prog, spr } from "../lib/anim";
import { mix } from "../lib/color";
import { vo } from "../timing";

const c = theme.colors;

const TITLE: Tok[] = [
  { t: "Atmira", at: 10.14 },
  { t: "en", at: 10.26 },
  { t: "cifras", at: 10.34, serif: true },
];

type Stat = { prefix?: string; value: number; suffix?: string; label: string; at: number; dur: number; idx: string };
const STATS: Stat[] = [
  { value: 20, label: "Años", at: vo(8.9), dur: 0.85, idx: "01" },
  { value: 820, label: "Especialistas", at: vo(9.92), dur: 1.0, idx: "02" },
  { prefix: "+", value: 40, label: "Clientes activos", at: vo(12.04), dur: 0.75, idx: "03" },
  { value: 70, suffix: " M€", label: "Cifra de negocio", at: 14.28, dur: 0.7, idx: "04" },
];

const Col: React.FC<{ s: Stat; i: number }> = ({ s, i }) => {
  const gt = useGT();
  const ex = useExit(0.28);
  const p = spr(gt, s.at, theme.spring.smooth, 2);
  const count = prog(gt, s.at, s.dur, theme.ease.out);
  const hot = 1 - prog(gt, s.at + s.dur - 0.1, 0.55, theme.ease.soft);
  const val = Math.round(s.value * count);
  const line = prog(gt, s.at - 0.05, 0.7, theme.ease.out);
  return (
    <div style={{ position: "relative", width: 392, opacity: (1 - ex) * Math.min(1, p * 2), transform: `translateY(${lerp(p, 50, 0) - ex * 26}px)` }}>
      <div style={{ fontFamily: theme.fonts.mono, fontSize: 22, letterSpacing: "0.2em", color: mix(c.ice, c.turq, hot), opacity: 0.75, marginBottom: 20 }}>{s.idx}</div>
      <div style={{ height: 2, background: c.line, position: "relative", marginBottom: 34 }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${line * 100}%`, background: mix(c.ice, c.turq, hot) }} />
        <div style={{ position: "absolute", left: `${line * 100}%`, top: -5, width: 12, height: 12, borderRadius: 6, marginLeft: -6, background: mix(c.ice, c.turq, hot), boxShadow: `0 0 ${24 * hot}px ${c.turq}` }} />
      </div>
      <div style={{ fontFamily: theme.fonts.sans, fontWeight: 700, fontSize: 196, lineHeight: 0.95, letterSpacing: "-0.05em", fontVariantNumeric: "tabular-nums", color: mix(c.white, c.turq, hot), textShadow: hot > 0.05 ? `0 0 ${70 * hot}px ${c.turq}77` : "none", whiteSpace: "nowrap" }}>
        {s.prefix}
        {val}
        {s.suffix ? <span style={{ fontSize: 88, letterSpacing: "-0.02em", marginLeft: 6 }}>{s.suffix.trim()}</span> : null}
      </div>
      <div style={{ marginTop: 26, fontFamily: theme.fonts.sans, fontWeight: 500, fontSize: 40, color: c.dim, letterSpacing: "-0.01em" }}>{s.label}</div>
    </div>
  );
};

export const S3Cifras: React.FC = () => (
  <Scene id="s3">
    <SceneStack variant="dark" assets={<><Skyline seed={3} riseAt={null} blur={4} intensity={0.55} drift={10} zoom={0.1} dusk /><AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(18,28,50,0.78), rgba(18,28,50,0.55) 60%, rgba(18,28,50,0.8))" }} /></>}>
      <Eyebrow text="Experiencia que respalda" at={10.05} style={{ position: "absolute", left: 124, top: 130 }} />
      <CueText tokens={TITLE} size={104} style={{ position: "absolute", left: 120, top: 190 }} />
      <div style={{ position: "absolute", left: 120, right: 120, top: 520, display: "flex", justifyContent: "space-between" }}>
        {STATS.map((s, i) => (
          <Col key={i} s={s} i={i} />
        ))}
      </div>
    </SceneStack>
  </Scene>
);
