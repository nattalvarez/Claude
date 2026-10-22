import React, { useMemo } from "react";
import { theme } from "../theme";
import { Scene, useGT, useExit } from "../components/Scene";
import { SceneStack } from "../components/Layers";
import { Footage } from "../components/Footage";
import { CueText, Tok } from "../components/CueText";
import { AtmiraLogo } from "../components/Brand";
import { Icon } from "../components/Icons";
import { prog, rng } from "../lib/anim";
import { vw } from "../timing";

const c = theme.colors;

const HEAD: Tok[] = [
  { t: "Modernizamos", at: vw("modernizamos", 0), br: true },
  { t: "y", at: vw("aceleramos", 0, -1) },
  { t: "aceleramos", at: vw("aceleramos", 0), serif: true },
];
const SUB: Tok[] = [
  { t: "Tecnología", at: vw("tecnologia") },
  { t: "que", at: vw("impulse") - 0.2 },
  { t: "impulsa", at: vw("impulse") },
  { t: "tu", at: vw("tu", 0) },
  { t: "negocio", at: vw("negocio", 0), serif: true },
];

const Pill: React.FC<{ icon: "bank" | "shield"; label: string; at: number }> = ({ icon, label, at }) => {
  const gt = useGT();
  const ex = useExit(0.25);
  const p = prog(gt, at - 0.08, 0.6, theme.ease.out);
  const glow = Math.max(0, 1 - (gt - at) / 0.9);
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 20, height: 92, padding: "0 40px 0 30px", borderRadius: 46,
        background: "rgba(18,28,50,0.55)", border: `1.5px solid rgba(221,231,244,${0.3 + glow * 0.55})`,
        backdropFilter: "blur(14px)", boxShadow: `0 0 ${60 * glow}px ${c.turq}${Math.round(glow * 90).toString(16).padStart(2, "0")}`,
        opacity: Math.min(1, p * 2) * (1 - ex), transform: `translateX(${(1 - p) * -44}px)`,
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
  const t0 = vw("tecnologia");
  const pts = useMemo(() => {
    const r = rng(7);
    return Array.from({ length: 16 }, (_, i) => [(i / 15) * 820, 120 - (i / 15) * 92 - Math.sin(i * 1.7) * 11 - r() * 9] as [number, number]);
  }, []);
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const p = prog(gt, t0, 1.6, theme.ease.inOut);
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

const LogoReveal: React.FC = () => {
  const gt = useGT();
  const ex = useExit(0.25);
  const p = prog(gt, vw("atmira", 0) - 0.25, 0.8, theme.ease.out);
  return (
    <div style={{ position: "absolute", left: 120, top: 84, opacity: 1 - ex, clipPath: `inset(0 ${(1 - p) * 100}% 0 0)` }}>
      <AtmiraLogo width={230} />
    </div>
  );
};

export const S2Atmira: React.FC = () => (
  <Scene id="s2">
    <SceneStack variant="dark" assets={<Footage src="s2_glass_towers.mp4" tint={c.blue} tintOpacity={0.85} dark={0.38} scrimLeft={0.75} bright={0.8} contrast={1.12} zoom={[1.0, 1.1]} />}>
      <LogoReveal />
      <CueText tokens={HEAD} size={134} style={{ position: "absolute", left: 120, top: 262, width: 1100 }} />
      <div style={{ position: "absolute", left: 120, top: 598, display: "flex", gap: 24 }}>
        <Pill icon="bank" label="Banca" at={vw("banca")} />
        <Pill icon="shield" label="Seguros" at={vw("seguros")} />
      </div>
      <CueText tokens={SUB} size={60} weight={500} color={c.ice} style={{ position: "absolute", left: 120, top: 776, width: 1000 }} />
      <GrowthLine />
    </SceneStack>
  </Scene>
);
