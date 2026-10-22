import { Footage } from "../components/Footage";
import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { BAR, BEAT, theme } from "../theme";
import { Body, Counter, DrawLine, Eyebrow, Logo, Pop, SceneShell, Words, ramp, useSpring } from "../components/kit";
import { KenBurns } from "../components/Media";

const STATS = [
  { prefix: "", to: 20, suffix: "", label: "Años" },
  { prefix: "", to: 820, suffix: "", label: "Especialistas" },
  { prefix: "", to: 70, suffix: " M€", label: "Cifra de negocio" },
  { prefix: "+", to: 40, suffix: "", label: "Clientes activos" },
  { prefix: "", to: 2, suffix: "", label: "HQ: Europa y Latam" },
  { prefix: "+", to: 7, suffix: "", label: "Hubs" },
];

const Stats: React.FC = () => (
  <SceneShell mode="dark" seed={60} footage={<Footage id="49846" tone="dark" scrim="full" opacity={0.9} startFrom={60} />}>
    <Eyebrow delay={2} style={{ position: "absolute", left: 130, top: 90 }}>
      Atmira en cifras
    </Eyebrow>
    <div style={{ position: "absolute", left: 130, right: 130, top: 190, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "repeat(2, 380px)", columnGap: 40 }}>
      {STATS.map((s, i) => (
        <Pop key={s.label} delay={4 + i * 5} dist={50}>
          <div style={{ borderTop: `3px solid ${i === 1 ? theme.colors.hero : theme.colors.line}`, paddingTop: 34, height: "100%" }}>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 168, letterSpacing: "-0.06em", lineHeight: 1, whiteSpace: "nowrap", color: i === 1 ? theme.colors.hero : "#fff" }}>
              <Counter to={s.to} prefix={s.prefix} suffix={s.suffix} delay={4 + i * 5} />
            </div>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 500, fontSize: 36, color: theme.colors.textDim, marginTop: 18 }}>{s.label}</div>
          </div>
        </Pop>
      ))}
    </div>
  </SceneShell>
);

const Finale: React.FC = () => {
  const frame = useCurrentFrame();
  const logoP = useSpring(0, theme.spring.smooth);
  const breathe = 1 + Math.sin(frame / 24) * 0.012;
  const contact = ramp(frame, 225, 241, 0, 1);
  return (
    <SceneShell mode="dark" seed={61} exit={false} footage={<Footage id="34980" tone="dark" scrim="left" zoom={1.1} />}>
      <div style={{ position: "absolute", left: 130, top: 90, opacity: logoP, transform: `translateY(${(1 - logoP) * -24}px) scale(${breathe})`, transformOrigin: "left top" }}>
        <Logo width={330} tint="white" />
      </div>
      <AbsoluteFill style={{ paddingLeft: 130, justifyContent: "center", paddingTop: 70 }}>
        <Words text="Modernizamos y aceleramos los servicios financieros." size={100} mode="dark" per={2.5} delay={0} maxWidth={1500} lineHeight={1.03} />
        <div style={{ height: 40 }} />
        <Words text="Y la capa agéntica que construimos contigo *es tuya.*" size={64} mode="dark" weight={600} per={6} delay={93} maxWidth={1300} lineHeight={1.08} emScale={1.2} />
        <DrawLine delay={200} width={420} color="#fff" thickness={3} style={{ marginTop: 54 }} />
        <div style={{ marginTop: 28, opacity: contact, transform: `translateY(${(1 - contact) * 14}px)`, fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 32, letterSpacing: "0.04em", color: "#fff" }}>
          atmira.com <span style={{ color: theme.colors.hero, margin: "0 14px" }}>·</span> Madrid <span style={{ color: theme.colors.hero, margin: "0 14px" }}>·</span> Barcelona
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

export const Close: React.FC = () => (
  <>
    <Sequence from={0} durationInFrames={120}>
      <Stats />
    </Sequence>
    <Sequence from={120} durationInFrames={315}>
      <Finale />
    </Sequence>
  </>
);
