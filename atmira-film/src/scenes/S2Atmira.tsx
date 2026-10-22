import React, { useMemo } from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";
import { Scene, useGT, useExit } from "../components/Scene";
import { SceneStack } from "../components/Layers";
import { GlassLattice } from "../components/GlassLattice";
import { CueText, Tok } from "../components/CueText";
import { AtmiraLogo } from "../components/Brand";
import { Icon } from "../components/Icons";
import { lerp, prog, spr, rng } from "../lib/anim";
import { vo } from "../timing";

const c = theme.colors;

const HEAD: Tok[] = [
  { t: "Modernizamos", at: vo(3.3), br: true },
  { t: "y", at: vo(4.08) },
  { t: "aceleramos", at: vo(4.14), serif: true },
];
const SUB: Tok[] = [
  { t: "Tecnología", at: vo(6.52) },
  { t: "que", at: vo(7.1) },
  { t: "impulsa", at: vo(7.32) },
  { t: "tu", at: vo(7.82) },
  { t: "negocio", at: vo(7.94), serif: true },
];

const Pill: React.FC<{ icon: "bank" | "shield"; label: string; at: number }> = ({ icon, label, at }) => {
  const gt = useGT();
  const ex = useExit(0.25);
  const p = spr(gt, at, theme.spring.bouncy, 2);
  const glow = Math.max(0, 1 - (gt - at) / 0.9);
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 20, height: 92, padding: "0 40px 0 30px", borderRadius: 46,
        background: "rgba(221,231,244,0.09)", border: `1.5px solid rgba(221,231,244,${0.28 + glow * 0.6})`,
        backdropFilter: "blur(12px)", boxShadow: `0 0 ${60 * glow}px ${c.turq}${Math.round(glow * 90).toString(16).padStart(2, "0")}`,
        opacity: Math.min(1, p * 1.5) * (1 - ex), transform: `translateX(${lerp(p, -50, 0)}px) scale(${lerp(p, 0.86, 1)})`,
      }}
    >
      <div style={{ width: 58, height: 58, borderRadius: 29, background: c.turq, display: "grid", placeItems: "center", color: c.navy }}>
        <Icon name={icon} size={34} stroke={2} />
      </div>
      <span style={{ fontFamily: theme.fonts.sans, fontWeight: 600, fontSize: 44, letterSpacing: "-0.02em", color: c.white }}>{label}</span>
    </div>
  );
};

const GrowthLine: React.FC = () => {
  const gt = useGT();
  const ex = useExit(0.25);
  const pts = useMemo(() => {
    const r = rng(7);
    return Array.from({ length: 16 }, (_, i) => [i / 15 * 820, 120 - (i / 15) * 92 - Math.sin(i * 1.7) * 11 - r() * 9] as [number, number]);
  }, []);
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const p = prog(gt, vo(6.5), 1.5, theme.ease.inOut);
  const end = pts[Math.min(15, Math.floor(p * 15))];
  return (
    <svg width={860} height={140} viewBox="-10 -10 860 150" style={{ position: "absolute", left: 120, top: 905, opacity: (1 - ex) * Math.min(1, p * 6), overflow: "visible" }}>
      <defs>
        <linearGradient id="gl" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={c.turq} stopOpacity={0.3} />
          <stop offset="1" stopColor={c.turq} stopOpacity={0} />
        </linearGradient>
        <clipPath id="gc"><rect x={-10} y={-20} width={880 * p} height={200} /></clipPath>
      </defs>
      <path d={`${d} L820 140 L0 140 Z`} fill="url(#gl)" clipPath="url(#gc)" />
      <path d={d} fill="none" stroke={c.turq} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      {p > 0.02 ? <circle cx={end[0]} cy={end[1]} r={9} fill={c.white} style={{ filter: `drop-shadow(0 0 10px ${c.turq})` }} /> : null}
    </svg>
  );
};

const Reveal: React.FC = () => {
  const gt = useGT();
  const ex = useExit(0.25);
  const p = prog(gt, vo(2.7), 0.8, theme.ease.out);
  return (
    <div style={{ position: "absolute", left: 120, top: 84, opacity: 1 - ex, clipPath: `inset(0 ${(1 - p) * 100}% 0 0)` }}>
      <AtmiraLogo width={230} />
    </div>
  );
};

const Grid: React.FC = () => {
  const gt = useGT();
  return (
    <AbsoluteFill style={{ opacity: 0.5 }}>
      <svg width={1920} height={1080}>
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={i} x1={i * 180 + 90 - (gt * 6) % 180} y1={0} x2={i * 180 + 90 - (gt * 6) % 180} y2={1080} stroke={c.ice} strokeOpacity={0.05} />
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={i} x1={0} y1={i * 180} x2={1920} y2={i * 180} stroke={c.ice} strokeOpacity={0.05} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

export const S2Atmira: React.FC = () => (
  <Scene id="s2">
    <SceneStack
      variant="dark"
      assets={
        <>
          <Grid />
          <GlassLattice x={1010} y={470} w={300} h={640} at={3.8} seed={2} dim={0.5} />
          <GlassLattice x={1250} y={190} w={520} h={900} at={3.62} seed={1} />
        </>
      }
    >
      <Reveal />
      <CueText tokens={HEAD} size={134} style={{ position: "absolute", left: 120, top: 262, width: 1100 }} />
      <div style={{ position: "absolute", left: 120, top: 598, display: "flex", gap: 24 }}>
        <Pill icon="bank" label="Banca" at={vo(4.86)} />
        <Pill icon="shield" label="Seguros" at={vo(5.4)} />
      </div>
      <CueText tokens={SUB} size={60} weight={500} color={c.ice} style={{ position: "absolute", left: 120, top: 776, width: 1000 }} />
      <GrowthLine />
    </SceneStack>
  </Scene>
);
