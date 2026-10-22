import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";
import { Scene, useGT, useExit } from "../components/Scene";
import { SceneStack } from "../components/Layers";
import { Footage } from "../components/Footage";
import { WorldMap, toScreen, EUROPE_AT, LATAM_AT, MAP_START } from "../components/WorldMap";
import { CueText, Eyebrow, Tok } from "../components/CueText";
import { prog } from "../lib/anim";
import { vw } from "../timing";
import map from "../data/worldDots.json";

const c = theme.colors;

const HEAD: Tok[] = [
  { t: "Estamos", at: vw("estamos") },
  { t: "donde", at: vw("donde"), br: true },
  { t: "tu", at: vw("tu", 1) },
  { t: "negocio", at: vw("negocio", 1), serif: true, br: true },
  { t: "nos", at: vw("nos") },
  { t: "necesita.", at: vw("necesita") },
];

/** Region tag anchored to the map via the same camera as the canvas. */
const Tag: React.FC<{ text: string; at: number; ax: number; ay: number; dx: number; dy: number; side: "l" | "r" }> = ({ text, at, ax, ay, dx, dy, side }) => {
  const gt = useGT();
  const ex = useExit(0.25);
  const p = prog(gt, at - 0.05, 0.6, theme.ease.out);
  const a = toScreen(gt, ax, ay);
  const lx = a.x + dx, ly = a.y + dy;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: Math.min(1, p * 2) * (1 - ex) }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <path d={`M${a.x} ${a.y} L${lx} ${ly} L${lx + (side === "r" ? 60 : -60)} ${ly}`} fill="none" stroke={c.white} strokeWidth={2} strokeOpacity={0.85} strokeDasharray={400} strokeDashoffset={400 * (1 - p)} />
      </svg>
      <div style={{ position: "absolute", left: side === "r" ? lx + 78 : undefined, right: side === "l" ? 1920 - lx + 78 : undefined, top: ly - 28, textAlign: side === "r" ? "left" : "right", transform: `translateX(${(1 - p) * (side === "r" ? -20 : 20)}px)` }}>
        <div style={{ fontFamily: theme.fonts.sans, fontWeight: 700, fontSize: 46, letterSpacing: "0.06em", color: c.white, textTransform: "uppercase", textShadow: "0 4px 24px rgba(8,14,28,0.7)" }}>{text}</div>
      </div>
    </div>
  );
};

const Stat: React.FC<{ value: number; prefix?: string; label: string; at: number }> = ({ value, prefix = "", label, at }) => {
  const gt = useGT();
  const ex = useExit(0.25);
  const p = prog(gt, at - 0.06, 0.7, theme.ease.out);
  const n = Math.round(value * prog(gt, at, 0.55, theme.ease.out));
  return (
    <div
      style={{
        width: 392, padding: "26px 32px 28px", borderRadius: 24, background: "rgba(18,28,50,0.66)", border: `1.5px solid ${c.line}`, backdropFilter: "blur(14px)",
        opacity: Math.min(1, p * 2) * (1 - ex), transform: `translateY(${(1 - p) * 40}px)`,
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
  const p = prog(gt, vw("estamos") - 0.6, 0.5, theme.ease.out);
  return <AbsoluteFill style={{ background: `linear-gradient(100deg, rgba(18,28,50,${0.85 * p}) 0%, rgba(18,28,50,${0.45 * p}) 38%, transparent 62%)` }} />;
};

export const S4Mapa: React.FC = () => (
  <Scene id="s4">
    <SceneStack
      variant="dark"
      assets={
        <>
          <Footage src="s4_earth_night.mp4" tint={c.blue} tintOpacity={0.7} dark={0.35} zoom={[1.05, 1.16]} opacity={0.75} />
          <WorldMap />
        </>
      }
    >
      <Scrim />
      <Eyebrow text="Presencia internacional" at={MAP_START + 0.25} style={{ position: "absolute", left: 124, top: 84 }} />
      <Tag text="Europa" at={EUROPE_AT} ax={map.anchors.europe[0]} ay={map.anchors.europe[1]} dx={110} dy={-96} side="r" />
      <Tag text="Latinoamérica" at={LATAM_AT} ax={map.anchors.latam[0]} ay={map.anchors.latam[1]} dx={-120} dy={110} side="l" />
      <CueText tokens={HEAD} size={92} style={{ position: "absolute", left: 120, top: 140, width: 760 }} />
      <div style={{ position: "absolute", right: 110, bottom: 96, display: "flex", gap: 26 }}>
        <Stat value={2} label="HQ · Europa y Latam" at={vw("sede") + 0.1} />
        <Stat value={7} prefix="+" label="Hubs" at={vw("siete")} />
      </div>
    </SceneStack>
  </Scene>
);
