import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";
import { Scene, useGT, useExit } from "../components/Scene";
import { WorldMap, toScreen, EUROPE_AT, LATAM_AT } from "../components/WorldMap";
import { prog } from "../lib/anim";
import { gap, vw } from "../timing";
import map from "../data/worldDots.json";

const c = theme.colors;
const SHADOW = "0 6px 50px rgba(6,14,28,0.65)";

const Tag: React.FC<{ text: string; at: number; ax: number; ay: number; dx: number; dy: number; side: "l" | "r" }> = ({ text, at, ax, ay, dx, dy, side }) => {
  const gt = useGT();
  const ex = useExit(0.3);
  const p = prog(gt, at - 0.05, 0.6, theme.ease.out);
  const a = toScreen(gt, ax, ay);
  const lx = a.x + dx, ly = a.y + dy;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: Math.min(1, p * 2) * (1 - ex) }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <path d={`M${a.x} ${a.y} L${lx} ${ly} L${lx + (side === "r" ? 60 : -60)} ${ly}`} fill="none" stroke="#fff" strokeWidth={2} strokeOpacity={0.85} strokeDasharray={400} strokeDashoffset={400 * (1 - p)} />
      </svg>
      <div style={{ position: "absolute", left: side === "r" ? lx + 78 : undefined, right: side === "l" ? 1920 - lx + 78 : undefined, top: ly - 34, fontFamily: theme.fonts.serif, fontStyle: "italic", fontSize: 64, color: "#fff", textShadow: SHADOW, transform: `translateX(${(1 - p) * (side === "r" ? -20 : 20)}px)` }}>{text}</div>
    </div>
  );
};

const Count: React.FC = () => {
  const gt = useGT();
  const ex = useExit(0.3);
  const at = vw("quince");
  const p = prog(gt, at - 0.06, 0.8, theme.ease.out);
  const n = Math.round(15 * prog(gt, at, 0.7, theme.ease.out));
  const l = prog(gt, vw("clientes") - 0.05, 0.7, theme.ease.out);
  return (
    <div style={{ position: "absolute", left: 120, top: 70, opacity: 1 - ex }}>
      <div style={{ fontFamily: theme.fonts.sans, fontWeight: 700, fontSize: 250, lineHeight: 0.95, letterSpacing: "-0.05em", color: "#fff", fontVariantNumeric: "tabular-nums", textShadow: SHADOW, opacity: Math.min(1, p * 2), transform: `translateY(${(1 - p) * 40}px)` }}>+{n}</div>
      <div style={{ fontFamily: theme.fonts.sans, fontWeight: 500, fontSize: 52, lineHeight: 1.12, letterSpacing: "-0.02em", color: c.ice, textShadow: SHADOW, marginTop: 12, opacity: l, transform: `translateY(${(1 - l) * 22}px)` }}>clientes en Europa<br />y Latinoamérica</div>
    </div>
  );
};

const Scrim: React.FC = () => {
  const gt = useGT();
  const p = prog(gt, vw("quince") - 0.8, 0.6, theme.ease.out);
  return <AbsoluteFill style={{ background: `linear-gradient(100deg, rgba(10,22,44,${0.8 * p}) 0%, rgba(10,22,44,${0.4 * p}) 36%, transparent 60%)` }} />;
};

export const Reach: React.FC = () => (
  <Scene from={gap("cumplimiento")} to={gap("sirec", 1)} name="Europa y Latinoamérica">
    <WorldMap />
    <Scrim />
    <Count />
    <Tag text="Europa" at={EUROPE_AT} ax={map.anchors.europe[0]} ay={map.anchors.europe[1]} dx={110} dy={-96} side="r" />
    <Tag text="Latinoamérica" at={LATAM_AT} ax={map.anchors.latam[0]} ay={map.anchors.latam[1]} dx={-120} dy={110} side="l" />
  </Scene>
);
