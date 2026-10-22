import React from "react";
import { theme } from "../theme";
import { Scene, useGT, useExit } from "../components/Scene";
import { SceneStack } from "../components/Layers";
import { Footage } from "../components/Footage";
import { CueText, Eyebrow, Tok } from "../components/CueText";
import { Icon } from "../components/Icons";
import { prog } from "../lib/anim";
import { alpha, mix } from "../lib/color";
import { SCENES, vw, vwe } from "../timing";

const c = theme.colors;
const F = theme.fonts;
const S = SCENES.s7.start;

const P1: Tok[] = [
  { t: "Servicios", at: vw("servicios", 1) },
  { t: "de", at: vw("servicios", 1, 1) },
  { t: "consultoría", at: vw("consultoria"), serif: true },
];
const P2: Tok[] = [
  { t: "Del", at: vw("proceso", 0, -1) },
  { t: "proceso", at: vw("proceso", 0) },
  { t: "a", at: vw("proceso", 0, 1) },
  { t: "la", at: vw("proceso", 0, 2) },
  { t: "plataforma", at: vw("plataforma", 1), serif: true },
];

type Item = { icon: Parameters<typeof Icon>[0]["name"]; title: string; sub: string; hot?: number };
const ITEMS: Item[] = [
  { icon: "compass", title: "Inception", sub: "Definición y acompañamiento" },
  { icon: "swap", title: "Change Management", sub: "Adopción y aprovechamiento", hot: vw("gestion") },
  { icon: "flask", title: "SATS", sub: "Pruebas automatizadas eficientes", hot: vw("pruebas") },
  { icon: "cloud", title: "SIREC Cloud Services", sub: "Seguridad y escalabilidad" },
  { icon: "refresh", title: "UaaS", sub: "Actualización continua del software" },
  { icon: "cap", title: "TaaS", sub: "Capacitación continua planificada" },
  { icon: "headset", title: "Dedicated Support", sub: "Especialistas dedicados SIREC", hot: vw("soporte") },
  { icon: "spark", title: "AI Agents Set-up", sub: "Configuración IA con SIREC Agent Fabric" },
];
const COLW = 392, GAP = 30, X0 = 120, Y0 = [490, 752], CH = 236;

const Card: React.FC<{ it: Item; i: number }> = ({ it, i }) => {
  const gt = useGT();
  const ex = useExit(0.25);
  const at = S + 0.9 + i * 0.2;
  const p = prog(gt, at - 0.06, 0.7, theme.ease.out);
  const hotP = it.hot ? prog(gt, it.hot - 0.06, 0.25, theme.ease.out) * (1 - prog(gt, it.hot + 1.0, 0.45, theme.ease.soft)) : 0;
  const col = i % 4, row = Math.floor(i / 4);
  return (
    <div
      style={{
        position: "absolute", left: X0 + col * (COLW + GAP), top: Y0[row], width: COLW, height: CH, boxSizing: "border-box", padding: "24px 28px", borderRadius: 26,
        background: `linear-gradient(150deg, ${alpha(c.navyDeep, 0.62 + hotP * 0.1)}, ${alpha(c.navy, 0.5)})`,
        border: `1.5px solid ${mix("#4A5D80", c.turq, hotP)}`,
        boxShadow: hotP > 0.02 ? `0 0 ${70 * hotP}px ${alpha(c.turq, 0.38 * hotP)}, inset 0 0 40px ${alpha(c.turq, 0.14 * hotP)}` : "none",
        backdropFilter: "blur(12px)",
        opacity: Math.min(1, p * 2) * (1 - ex), transform: `translateY(${(1 - p) * 48 - hotP * 8 - ex * 20}px)`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ width: 66, height: 66, borderRadius: 20, display: "grid", placeItems: "center", background: mix("#3A5486", c.turq, hotP), color: mix(c.ice, c.navy, hotP) }}>
          <Icon name={it.icon} size={38} stroke={1.8} />
        </div>
        <div style={{ fontFamily: F.mono, fontSize: 21, letterSpacing: "0.18em", color: mix("#7F93B5", c.turq, hotP) }}>{String(i + 1).padStart(2, "0")}</div>
      </div>
      <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: it.title.length > 16 ? 34 : 40, letterSpacing: "-0.025em", color: "#fff", marginTop: 22, lineHeight: 1.05, whiteSpace: "nowrap" }}>{it.title}</div>
      <div style={{ fontFamily: F.sans, fontWeight: 400, fontSize: 25, color: c.ice, opacity: 0.8, marginTop: 8, lineHeight: 1.2 }}>{it.sub}</div>
    </div>
  );
};

const Journey: React.FC = () => {
  const gt = useGT();
  const ex = useExit(0.25);
  const t0 = vw("proceso", 0, -1);
  const t1 = vwe("dedicado");
  const a = prog(gt, S + 0.8, 0.6, theme.ease.out);
  const t = prog(gt, t0, t1 - t0, theme.ease.inOut);
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
    <SceneStack variant="dark" assets={<Footage src="s7_window_team.mp4" tint={c.blue} tintOpacity={0.8} dark={0.68} scrimLeft={0.5} blur={2} sat={0.9} zoom={[1.0, 1.1]} />}>
      <Eyebrow text="Consultoría" at={S + 0.25} style={{ position: "absolute", left: 124, top: 96 }} />
      <CueText tokens={P1} size={100} exitAt={vw("proceso", 0, -1) - 0.3} style={{ position: "absolute", left: 120, top: 152, width: 1500 }} />
      <CueText tokens={P2} size={100} style={{ position: "absolute", left: 120, top: 152, width: 1500 }} />
      <Journey />
      {ITEMS.map((it, i) => (
        <Card key={i} it={it} i={i} />
      ))}
    </SceneStack>
  </Scene>
);
