import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";
import { Scene, useGT, useExit } from "../components/Scene";
import { SceneStack } from "../components/Layers";
import { CueText, Eyebrow, Tok } from "../components/CueText";
import { Icon } from "../components/Icons";
import { Grid } from "../components/Grid";
import { lerp, prog, spr } from "../lib/anim";
import { alpha, mix } from "../lib/color";
import { vo } from "../timing";

const c = theme.colors;
const F = theme.fonts;

const P1: Tok[] = [
  { t: "Servicios", at: vo(31.28) },
  { t: "de", at: vo(31.7) },
  { t: "consultoría", at: vo(31.8), serif: true },
];
const P2: Tok[] = [
  { t: "Del", at: vo(33.24) },
  { t: "proceso", at: vo(33.44) },
  { t: "a", at: vo(33.84) },
  { t: "la", at: vo(33.92) },
  { t: "plataforma", at: vo(34.02), serif: true },
];

type Item = { icon: Parameters<typeof Icon>[0]["name"]; title: string; sub: string; hot?: number };
const ITEMS: Item[] = [
  { icon: "compass", title: "Inception", sub: "Definición y acompañamiento" },
  { icon: "swap", title: "Change Management", sub: "Adopción y aprovechamiento", hot: vo(34.94) },
  { icon: "flask", title: "SATS", sub: "Pruebas automatizadas eficientes", hot: vo(35.98) },
  { icon: "cloud", title: "SIREC Cloud Services", sub: "Seguridad y escalabilidad" },
  { icon: "refresh", title: "UaaS", sub: "Actualización continua del software" },
  { icon: "cap", title: "TaaS", sub: "Capacitación continua planificada" },
  { icon: "headset", title: "Dedicated Support", sub: "Especialistas dedicados SIREC", hot: vo(37.28) },
  { icon: "spark", title: "AI Agents Set-up", sub: "Configuración IA con SIREC Agent Fabric" },
];
const COLW = 392, GAP = 30, X0 = 120, Y0 = [490, 752], CH = 236;

const Card: React.FC<{ it: Item; i: number }> = ({ it, i }) => {
  const gt = useGT();
  const ex = useExit(0.25);
  const at = 33.0 + i * 0.2;
  const p = spr(gt, at, theme.spring.smooth, 2);
  const hotP = it.hot ? prog(gt, it.hot - 0.06, 0.25, theme.ease.out) * (1 - prog(gt, it.hot + 1.0, 0.45, theme.ease.soft)) : 0;
  const float = Math.sin(gt * 1.4 + i) * 3;
  const col = i % 4, row = Math.floor(i / 4);
  return (
    <div
      style={{
        position: "absolute", left: X0 + col * (COLW + GAP), top: Y0[row], width: COLW, height: CH, boxSizing: "border-box", padding: "24px 28px", borderRadius: 26,
        background: `linear-gradient(150deg, ${alpha(c.ice, 0.1 + hotP * 0.06)}, ${alpha(c.ice, 0.04)})`,
        border: `1.5px solid ${mix("#4A5D80", c.turq, hotP)}`,
        boxShadow: hotP > 0.02 ? `0 0 ${70 * hotP}px ${alpha(c.turq, 0.38 * hotP)}, inset 0 0 40px ${alpha(c.turq, 0.14 * hotP)}` : "none",
        backdropFilter: "blur(10px)",
        opacity: Math.min(1, p * 1.6) * (1 - ex), transform: `translateY(${lerp(p, 56, 0) + float - hotP * 8 - ex * 20}px) scale(${lerp(p, 0.94, 1) + hotP * 0.025})`,
        filter: `blur(${lerp(Math.min(1, p), 10, 0)}px)`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ width: 66, height: 66, borderRadius: 20, display: "grid", placeItems: "center", background: mix("#3A5486", c.turq, hotP), color: mix(c.ice, c.navy, hotP) }}>
          <Icon name={it.icon} size={38} stroke={1.8} />
        </div>
        <div style={{ fontFamily: F.mono, fontSize: 21, letterSpacing: "0.18em", color: mix("#7F93B5", c.turq, hotP) }}>{String(i + 1).padStart(2, "0")}</div>
      </div>
      <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: it.title.length > 16 ? 34 : 40, letterSpacing: "-0.025em", color: "#fff", marginTop: 22, lineHeight: 1.05, whiteSpace: "nowrap" }}>{it.title}</div>
      <div style={{ fontFamily: F.sans, fontWeight: 400, fontSize: 25, color: c.dim, marginTop: 8, lineHeight: 1.2 }}>{it.sub}</div>
    </div>
  );
};

const Journey: React.FC = () => {
  const gt = useGT();
  const ex = useExit(0.25);
  const a = prog(gt, vo(33.0), 0.6, theme.ease.out);
  const t = prog(gt, vo(33.4), vo(38.2) - vo(33.4), theme.ease.inOut);
  return (
    <div style={{ position: "absolute", left: 120, right: 120, top: 412, opacity: a * (1 - ex) }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: F.mono, fontSize: 21, letterSpacing: "0.24em", fontWeight: 600, marginBottom: 14 }}>
        <span style={{ color: mix(c.ice, c.turq, 1 - t) }}>PROCESO</span>
        <span style={{ color: mix(c.ice, c.turq, t) }}>PLATAFORMA</span>
      </div>
      <div style={{ position: "relative", height: 3, background: alpha(c.ice, 0.2) }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${t * 100}%`, background: c.turq }} />
        <div style={{ position: "absolute", left: `${t * 100}%`, top: -7, width: 17, height: 17, marginLeft: -8, borderRadius: 9, background: "#fff", boxShadow: `0 0 26px 4px ${alpha(c.turq, 0.8)}` }} />
      </div>
    </div>
  );
};

export const S7Consultoria: React.FC = () => (
  <Scene id="s7">
    <SceneStack variant="dark" assets={<Grid opacity={0.9} />}>
      <Eyebrow text="Consultoría" at={32.2} style={{ position: "absolute", left: 124, top: 96 }} />
      <CueText tokens={P1} size={100} exitAt={vo(33.2)} style={{ position: "absolute", left: 120, top: 152, width: 1500 }} />
      <CueText tokens={P2} size={100} style={{ position: "absolute", left: 120, top: 152, width: 1500 }} />
      <Journey />
      {ITEMS.map((it, i) => (
        <Card key={i} it={it} i={i} />
      ))}
    </SceneStack>
  </Scene>
);
