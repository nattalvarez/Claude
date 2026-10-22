import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";
import { Scene, useGT, useExit } from "../components/Scene";
import { SceneStack } from "../components/Layers";
import { WorldMap, toScreen, EUROPE_AT, LATAM_AT } from "../components/WorldMap";
import { CueText, Eyebrow, Tok } from "../components/CueText";
import { lerp, prog, spr } from "../lib/anim";
import { vo } from "../timing";
import map from "../data/worldDots.json";

const c = theme.colors;

const HEAD: Tok[] = [
  { t: "Estamos", at: vo(17.5) },
  { t: "donde", at: vo(17.92), br: true },
  { t: "tu", at: vo(18.16) },
  { t: "negocio", at: vo(18.28), serif: true, br: true },
  { t: "nos", at: vo(18.68) },
  { t: "necesita.", at: vo(18.86) },
];

/** Region tag anchored to the map via the same camera as the canvas. */
const Tag: React.FC<{ text: string; sub: string; at: number; ax: number; ay: number; dx: number; dy: number; side: "l" | "r" }> = ({ text, sub, at, ax, ay, dx, dy, side }) => {
  const gt = useGT();
  const ex = useExit(0.25);
  const p = spr(gt, at, theme.spring.smooth, 0);
  const a = toScreen(gt, ax, ay);
  const lx = a.x + dx, ly = a.y + dy;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: p * (1 - ex) }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <path d={`M${a.x} ${a.y} L${lx} ${ly} L${lx + (side === "r" ? 60 : -60)} ${ly}`} fill="none" stroke={c.white} strokeWidth={2} strokeOpacity={0.85} strokeDasharray={400} strokeDashoffset={400 * (1 - p)} />
      </svg>
      <div style={{ position: "absolute", left: side === "r" ? lx + 78 : undefined, right: side === "l" ? 1920 - lx + 78 : undefined, top: ly - 40, textAlign: side === "r" ? "left" : "right", transform: `translateX(${lerp(p, side === "r" ? -24 : 24, 0)}px)` }}>
        <div style={{ fontFamily: theme.fonts.sans, fontWeight: 700, fontSize: 46, letterSpacing: "0.06em", color: c.white, textTransform: "uppercase" }}>{text}</div>
        {sub ? <div style={{ fontFamily: theme.fonts.mono, fontSize: 21, letterSpacing: "0.22em", color: c.turq, marginTop: 6 }}>{sub}</div> : null}
      </div>
    </div>
  );
};

const Stat: React.FC<{ value: number; prefix?: string; label: string; at: number }> = ({ value, prefix = "", label, at }) => {
  const gt = useGT();
  const ex = useExit(0.25);
  const p = spr(gt, at, theme.spring.bouncy, 2);
  const n = Math.round(value * prog(gt, at, 0.55, theme.ease.out));
  return (
    <div
      style={{
        width: 392, padding: "26px 32px 28px", borderRadius: 24, background: "rgba(18,28,50,0.62)", border: `1.5px solid ${c.line}`, backdropFilter: "blur(14px)",
        opacity: Math.min(1, p * 1.6) * (1 - ex), transform: `translateY(${lerp(p, 50, 0)}px) scale(${lerp(p, 0.9, 1)})`,
      }}
    >
      <div style={{ fontFamily: theme.fonts.sans, fontWeight: 700, fontSize: 112, lineHeight: 1, letterSpacing: "-0.05em", color: c.white }}>
        {prefix}
        {n}
      </div>
      <div style={{ fontFamily: theme.fonts.sans, fontWeight: 500, fontSize: 30, color: c.dim, marginTop: 10 }}>{label}</div>
    </div>
  );
};

const Scrim: React.FC = () => {
  const gt = useGT();
  const p = prog(gt, vo(17.2), 0.5, theme.ease.out);
  return <AbsoluteFill style={{ background: `linear-gradient(100deg, rgba(18,28,50,${0.85 * p}) 0%, rgba(18,28,50,${0.45 * p}) 38%, transparent 62%)` }} />;
};

export const S4Mapa: React.FC = () => (
  <Scene id="s4">
    <SceneStack variant="dark" assets={<WorldMap />}>
      <Scrim />
      <Eyebrow text="Presencia internacional" at={15.75} style={{ position: "absolute", left: 124, top: 84 }} />
      <Tag text="Europa" sub="" at={EUROPE_AT} ax={map.anchors.europe[0]} ay={map.anchors.europe[1]} dx={110} dy={-96} side="r" />
      <Tag text="Latinoamérica" sub="" at={LATAM_AT} ax={map.anchors.latam[0]} ay={map.anchors.latam[1]} dx={-120} dy={110} side="l" />
      <CueText tokens={HEAD} size={92} style={{ position: "absolute", left: 120, top: 140, width: 760 }} />
      <div style={{ position: "absolute", right: 110, bottom: 96, display: "flex", gap: 26 }}>
        <Stat value={2} label="HQ · Europa y Latam" at={vo(16.9)} />
        <Stat value={7} prefix="+" label="Hubs" at={vo(16.58)} />
      </div>
    </SceneStack>
  </Scene>
);
