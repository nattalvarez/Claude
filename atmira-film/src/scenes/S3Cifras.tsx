import React from "react";
import { theme } from "../theme";
import { Scene, useGT, useExit } from "../components/Scene";
import { SceneStack } from "../components/Layers";
import { Footage } from "../components/Footage";
import { CueText, Tok } from "../components/CueText";
import { prog } from "../lib/anim";
import { mix } from "../lib/color";
import { SCENES, vw } from "../timing";

const c = theme.colors;
const S = SCENES.s3.start;

const TITLE: Tok[] = [
  { t: "Atmira", at: S + 0.2 },
  { t: "en", at: S + 0.32 },
  { t: "cifras", at: S + 0.4, serif: true },
];

type Stat = { prefix?: string; value: number; suffix?: string; label: string; at: number; dur: number; idx: string };
const STATS: Stat[] = [
  { value: 20, label: "Años", at: vw("veinte"), dur: 0.85, idx: "01" },
  { value: 820, label: "Especialistas", at: vw("ochocientos"), dur: 1.0, idx: "02" },
  { prefix: "+", value: 40, label: "Clientes activos", at: vw("mas", 0), dur: 0.75, idx: "03" },
  { value: 70, suffix: " M€", label: "Cifra de negocio", at: vw("activos") + 0.1, dur: 0.7, idx: "04" },
];

const Col: React.FC<{ s: Stat }> = ({ s }) => {
  const gt = useGT();
  const ex = useExit(0.26);
  const p = prog(gt, s.at - 0.06, 0.7, theme.ease.out);
  const count = prog(gt, s.at, s.dur, theme.ease.out);
  const hot = 1 - prog(gt, s.at + s.dur - 0.1, 0.55, theme.ease.soft);
  const val = Math.round(s.value * count);
  const line = prog(gt, s.at - 0.05, 0.7, theme.ease.out);
  return (
    <div style={{ position: "relative", width: 392, opacity: (1 - ex) * Math.min(1, p * 2), transform: `translateY(${(1 - p) * 40 - ex * 22}px)` }}>
      <div style={{ height: 2, background: c.line, position: "relative", marginBottom: 34 }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${line * 100}%`, background: mix(c.ice, c.turq, hot) }} />
        <div style={{ position: "absolute", left: `${line * 100}%`, top: -5, width: 12, height: 12, borderRadius: 6, marginLeft: -6, background: mix(c.ice, c.turq, hot) }} />
      </div>
      <div style={{ fontFamily: theme.fonts.sans, fontWeight: 700, fontSize: 196, lineHeight: 0.95, letterSpacing: "-0.05em", fontVariantNumeric: "tabular-nums", color: mix(c.white, c.turq, hot), whiteSpace: "nowrap", textShadow: "0 6px 40px rgba(8,14,28,0.5)" }}>
        {s.prefix}
        {val}
        {s.suffix ? <span style={{ fontSize: 88, letterSpacing: "-0.02em", marginLeft: 6 }}>{s.suffix.trim()}</span> : null}
      </div>
      <div style={{ marginTop: 26, fontFamily: theme.fonts.sans, fontWeight: 500, fontSize: 40, color: c.ice, letterSpacing: "-0.01em", textShadow: "0 3px 20px rgba(8,14,28,0.6)" }}>{s.label}</div>
    </div>
  );
};

export const S3Cifras: React.FC = () => (
  <Scene id="s3">
    <SceneStack variant="dark" assets={<Footage src="s3_aerial_lights.mp4" tint={c.blue} tintOpacity={0.85} dark={0.5} blur={1.5} zoom={[1.0, 1.12]} sat={0.9} />}>
      <CueText tokens={TITLE} size={104} style={{ position: "absolute", left: 120, top: 150 }} />
      <div style={{ position: "absolute", left: 120, right: 120, top: 520, display: "flex", justifyContent: "space-between" }}>
        {STATS.map((s, i) => (
          <Col key={i} s={s} />
        ))}
      </div>
    </SceneStack>
  </Scene>
);
