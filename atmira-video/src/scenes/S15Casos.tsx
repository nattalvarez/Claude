import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, Finish } from "../components/Stage";
import { SilkField } from "../components/SilkField";
import { Chrome } from "../components/Chrome";
import { MaskLine, font } from "../components/Type";
import { C, EASE } from "../theme";
import { clamp, ramp } from "../lib/anim";
import { cue, voiceEnd } from "../lib/tl";
import { CASOS } from "../data/content";
import dims from "../../public/cases/manifest.json";

const ID = "casos";
const NAMES = ["Asisa", "MoraBanc", "Mutua Madrileña", "BBVA", "AXA", "Sabadell", "CaixaBank", "Mapfre", "Aegon"];
const LOGO_SCALE = 1.75;

const PANEL = [
  { bg: `linear-gradient(160deg, #2c2c32 0%, #1b1b20 60%, #121215 100%)`, pal: "dark" as const },
  { bg: `linear-gradient(160deg, #3a3a3f 0%, ${C.charcoal} 60%, #121214 100%)`, pal: "dark" as const },
  { bg: `linear-gradient(160deg, #2a2a30 0%, #1a1a1e 60%, #101013 100%)`, pal: "dark" as const },
];

export const S15Casos: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const cT = cue(ID, "proyectos reales");
  const cN = NAMES.map((n) => cue(ID, n));
  const end = voiceEnd(ID);
  // ventana de cada caso
  const win = (i: number) => {
    const a = cN[i] - 12;
    const b = i < 8 ? cN[i + 1] - 12 : end + 40;
    return { a, b };
  };
  const cur = CASOS.items.length ? NAMES.findIndex((_, i) => frame >= win(i).a && frame < win(i).b) : 0;
  const group = Math.floor(Math.max(cur, 0) / 3);

  const panelIn = ramp(frame, cT - 6, 36, EASE.out);

  return (
    <AbsoluteFill>
      <Backdrop tone="mist" />
      <Chrome chapter="14 · Experiencia en servicios financieros" start={2} hideLogo />

      {/* título de sección */}
      <div style={{ position: "absolute", left: 120, top: 120, ...font(78, 600, { letterSpacing: "-0.045em", lineHeight: 1.02 }) }}>
        <MaskLine start={4} dur={26}>{CASOS.title[0]}</MaskLine>
        <MaskLine start={10} dur={26} style={{ color: C.magenta }}>{CASOS.title[1]}</MaskLine>
      </div>

      {/* panel índice con los nueve proyectos */}
      <div
        style={{
          position: "absolute",
          left: 1230,
          top: 0,
          width: 690,
          height: 1080,
          overflow: "hidden",
          background: PANEL[group].bg,
          clipPath: `inset(0 0 ${(1 - panelIn) * 100}% 0)`,
        }}
      >
        <SilkField
          width={690}
          height={1080}
          time={t + group * 4}
          order={0.5 + 0.5 * ramp(frame, 0, 200)}
          lines={100}
          seed={81 + group}
          palette="dark"
          fills={6}
          blurNear={0}
          length={22}
          spread={3.2}
          cam={{ pos: [group - 1, 1, -11], target: [0, -0.4, 0], fov: 40, roll: 0.2 + group * 0.2 }}
          alpha={0.5}
          style={{ position: "absolute", left: 0, top: 0, WebkitMaskImage: "linear-gradient(180deg, #000 0%, transparent 24%, transparent 78%, #000 100%)", maskImage: "linear-gradient(180deg, #000 0%, transparent 24%, transparent 78%, #000 100%)" }}
        />
        <div style={{ position: "absolute", left: 64, top: 70, ...font(18, 600, { color: "rgba(255,255,255,0.75)", letterSpacing: "0.2em", textTransform: "uppercase" }) }}>{CASOS.eyebrow}</div>
        {[0, 1, 2].map((g) => (
          <div key={g} style={{ position: "absolute", left: 64, top: 160 + g * 280, width: 570, opacity: g === group ? 1 : 0.4 }}>
            <div style={{ ...font(24, 500, { color: "#fff", letterSpacing: 0, marginBottom: 14, borderBottom: "1.5px solid rgba(255,255,255,0.45)", paddingBottom: 12 }) }}>
              {String(g + 1).padStart(2, "0")} · {CASOS.cols[g]}
            </div>
            {[0, 1, 2].map((k) => {
              const i = g * 3 + k;
              const on = i === cur;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "9px 0", ...font(on ? 34 : 30, on ? 500 : 400, { color: on ? "#fff" : "rgba(255,255,255,0.62)", letterSpacing: "-0.02em" }) }}>
                  <span style={{ width: on ? 26 : 10, height: 3, background: on ? "#fff" : "rgba(255,255,255,0.5)", display: "block" }} />
                  {NAMES[i]}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* caso activo */}
      {CASOS.items.map((it, idx) => {
        const order = NAMES.findIndex((n) => n.toLowerCase().replace(/ñ/g, "n") === (it.id === "mutua-madrilena" ? "mutua madrilena" : it.id));
        void order;
        const i = CASO_ORDER.indexOf(it.id);
        const { a, b } = win(i);
        const p = ramp(frame, a, 26, EASE.out);
        const q = ramp(frame, b - 6, 14, EASE.in);
        if (frame < a - 2 || frame > b + 14) return null;
        const d = (dims as unknown as Record<string, [number, number]>)[it.id];
        const lw = d[0] * LOGO_SCALE;
        const lh = d[1] * LOGO_SCALE;
        return (
          <div key={it.id} style={{ position: "absolute", left: 120, top: 346, width: 960, opacity: clamp(p * 1.6) * (1 - q), transform: `translateY(${(1 - p) * 40 - q * 50}px)` }}>
            <div style={{ marginTop: 28, height: 128, display: "flex", alignItems: "center", filter: `blur(${(1 - p) * 8}px)` }}>
              <Img src={staticFile(`cases/${it.id}.png`)} style={{ width: lw, height: lh }} />
            </div>
            <div style={{ marginTop: 28, ...font(64, 600, { letterSpacing: "-0.04em", lineHeight: 1.08, width: 960 }) }}>{it.h}</div>
          </div>
        );
      })}
      <Finish tone="mist" />
    </AbsoluteFill>
  );
};

const CASO_ORDER = ["asisa", "morabanc", "mutua-madrilena", "bbva", "axa", "sabadell", "caixabank", "mapfre", "aegon"];
