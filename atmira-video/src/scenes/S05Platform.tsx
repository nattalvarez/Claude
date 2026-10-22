import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BEAT, theme } from "../theme";
import { Body, Eyebrow, Pop, SceneShell, Words, ramp, useSpring } from "../components/kit";

const LEFT = ["Core bancario y asegurador", "Monolitos", "Canales y escritorio", "Integración: ESB, SOAP, batch", "Datos y reporting"];
const RIGHT = ["Arquitectura agéntica", "Aplicaciones modernizadas", "APIs gobernadas", "Microservicios cloud-native", "Core componible", "Dato preparado para IA"];

const LX = 110;
const LW = 400;
const CX = 610;
const CW = 700;
const RX = 1410;
const RW = 400;
const TOP = 372;

const leftY = (i: number) => TOP + i * 94;
const rightY = (i: number) => TOP - 6 + i * 79;

const Flow: React.FC = () => {
  const frame = useCurrentFrame();
  const o = ramp(frame, 80, 100, 0, 1);
  const dot = (x1: number, y: number, x2: number, k: number, speed: number, hero: boolean) => {
    const t = (frame * speed + k * 0.37) % 1;
    return <circle key={`${x1}-${k}`} cx={x1 + (x2 - x1) * t} cy={y} r={hero ? 7 : 5} fill={hero ? theme.colors.hero : theme.colors.ink} opacity={Math.sin(t * Math.PI)} />;
  };
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o }}>
      {LEFT.map((_, i) => (
        <g key={i}>
          <line x1={LX + LW} x2={CX} y1={leftY(i) + 36} y2={leftY(i) + 36} stroke={theme.colors.inkLine} strokeWidth={2} />
          {dot(LX + LW, leftY(i) + 36, CX, i, 0.018, false)}
        </g>
      ))}
      {RIGHT.map((_, i) => (
        <g key={i}>
          <line x1={CX + CW} x2={RX} y1={rightY(i) + 31} y2={rightY(i) + 31} stroke={theme.colors.inkLine} strokeWidth={2} />
          {dot(CX + CW, rightY(i) + 31, RX, i + 0.3, 0.022, true)}
        </g>
      ))}
    </svg>
  );
};

const Row: React.FC<{
  y: number;
  h: number;
  delay: number;
  label: string;
  sub: string;
  text: string;
  variant: "white" | "hero" | "grey";
  glowAt: number;
}> = ({ y, h, delay, label, sub, text, variant, glowAt }) => {
  const frame = useCurrentFrame();
  const glow = interpolate(frame, [glowAt, glowAt + 8, glowAt + 30], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bg = variant === "hero" ? theme.colors.hero : variant === "grey" ? "#EDE9EC" : "#fff";
  const fg = variant === "hero" ? "#fff" : theme.colors.ink;
  const dim = variant === "hero" ? "rgba(255,255,255,0.85)" : theme.colors.inkDim;
  return (
    <Pop delay={delay} style={{ position: "absolute", left: CX + 24, top: y, width: CW - 48, height: h }} dist={50}>
      <div
        style={{
          width: "100%",
          height: "100%",
          background: bg,
          borderRadius: 18,
          padding: "0 34px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          boxShadow: `0 ${10 + glow * 20}px ${40 + glow * 40}px -14px rgba(230,0,126,${0.2 + glow * 0.5})`,
          border: variant === "white" ? `2px solid rgba(230,0,126,${0.15 + glow * 0.7})` : "none",
        }}
      >
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 44, letterSpacing: "-0.035em", color: fg, lineHeight: 1 }}>{label}</div>
        <div style={{ fontFamily: theme.fonts.serif, fontStyle: "italic", fontSize: 32, color: variant === "hero" ? "#fff" : theme.colors.hero, margin: "4px 0 6px" }}>{sub}</div>
        <div style={{ fontFamily: theme.fonts.body, fontSize: 21, lineHeight: 1.3, color: dim }}>{text}</div>
      </div>
    </Pop>
  );
};

export const Platform: React.FC = () => {
  const frame = useCurrentFrame();
  const boxP = useSpring(34, theme.spring.smooth);
  const cap = ramp(frame, BEAT * 10 + 4, BEAT * 10 + 18, 0, 1);
  return (
    <SceneShell mode="light" seed={11}>
      <div style={{ position: "absolute", left: 110, top: 70 }}>
        <Words text="Una plataforma. Dos *capacidades.*" size={84} mode="light" per={3} lineHeight={1.0} />
      </div>
      <div style={{ position: "absolute", left: 110, top: 190 }}>
        <Body mode="light" delay={22} size={30}>
          Servicios y soluciones que conectan tus sistemas con tu arquitectura objetivo.
        </Body>
      </div>

      <Eyebrow mode="light" delay={20} size={20} style={{ position: "absolute", left: LX, top: TOP - 52, color: theme.colors.inkDim }}>
        Tus sistemas
      </Eyebrow>
      {LEFT.map((t, i) => (
        <Pop key={t} delay={22 + i * 4} from="left" dist={60} style={{ position: "absolute", left: LX, top: leftY(i), width: LW }}>
          <div style={{ height: 72, display: "flex", alignItems: "center", padding: "0 26px", borderRadius: 14, background: "#F3EFF2", border: `1.5px solid ${theme.colors.inkLine}`, fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 25, color: theme.colors.ink }}>
            {t}
          </div>
        </Pop>
      ))}

      <Eyebrow mode="light" delay={34} size={20} style={{ position: "absolute", left: CX + 24, top: TOP - 52 }}>
        Plataforma de soluciones y servicios
      </Eyebrow>
      <div
        style={{
          position: "absolute",
          left: CX,
          top: TOP - 12,
          width: CW,
          height: 3 * 150 + 2 * 14 + 48 + 12,
          border: `3px dashed ${theme.colors.hero}`,
          borderRadius: 30,
          opacity: boxP,
          transform: `scale(${interpolate(boxP, [0, 1], [0.94, 1])})`,
          background: "rgba(230,0,126,0.04)",
        }}
      />
      <Row y={TOP + 12} h={150} delay={40} label="Aceleración" sub="Agent Factory" text="Agentes que analizan, deciden, construyen y operan, con una persona que aprueba en cada fase." variant="white" glowAt={BEAT * 8} />
      <Row y={TOP + 12 + 164} h={150} delay={48} label="Especialización" sub="Digital Brain" text="El conocimiento del negocio de cada sector, preservado y ampliado con cada proyecto." variant="hero" glowAt={BEAT * 9} />
      <Row y={TOP + 12 + 328} h={150} delay={56} label="Gobierno" sub="AI Steering · Guardrails" text="Dirección, límites y puntos de control sobre lo que hacen los agentes." variant="grey" glowAt={BEAT * 10} />

      <Eyebrow mode="light" delay={64} size={20} style={{ position: "absolute", left: RX, top: TOP - 52, color: theme.colors.inkDim }}>
        Arquitectura objetivo
      </Eyebrow>
      {RIGHT.map((t, i) => (
        <Pop key={t} delay={66 + i * 4} from="right" dist={60} style={{ position: "absolute", left: RX, top: rightY(i), width: RW }}>
          <div style={{ height: 62, display: "flex", alignItems: "center", padding: "0 24px", borderRadius: 12, border: `2.5px solid ${theme.colors.hero}`, background: "#fff", fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 24, color: theme.colors.hero }}>
            {t}
          </div>
        </Pop>
      ))}

      <Flow />

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 62, textAlign: "center", opacity: cap, transform: `translateY(${(1 - cap) * 20}px)` }}>
        <span style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 40, letterSpacing: "-0.03em", color: theme.colors.ink }}>
          La aceleración marca la velocidad.{" "}
          <span style={{ fontFamily: theme.fonts.serif, fontStyle: "italic", fontWeight: 400, fontSize: 46, color: theme.colors.hero }}>La especialización, la dirección.</span>
        </span>
      </div>
    </SceneShell>
  );
};
