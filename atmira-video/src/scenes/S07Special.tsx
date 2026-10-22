import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { BAR, BEAT, theme } from "../theme";
import { Body, Eyebrow, MaskLine, Pop, SceneShell, Words, ramp, rand, useSpring } from "../components/kit";

/* ----------------------------------------------------------- neural background */

const NeuralField: React.FC<{ n?: number; opacity?: number; hubs?: boolean }> = ({ n = 46, opacity = 1, hubs }) => {
  const frame = useCurrentFrame();
  const pts = Array.from({ length: n }).map((_, i) => ({
    x: 120 + rand(i + 2) * 1680 + Math.sin(frame / 40 + i * 1.7) * 24,
    y: 120 + rand(i + 90) * 840 + Math.cos(frame / 47 + i * 2.3) * 24,
  }));
  const edges: [number, number][] = [];
  pts.forEach((p, i) =>
    pts.forEach((q, j) => {
      if (j > i && Math.hypot(p.x - q.x, p.y - q.y) < 250) edges.push([i, j]);
    }),
  );
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity }}>
      {edges.map(([i, j], k) => (
        <line key={k} x1={pts[i].x} y1={pts[i].y} x2={pts[j].x} y2={pts[j].y} stroke="#fff" strokeOpacity={0.12} strokeWidth={1.5} />
      ))}
      {edges
        .filter((_, k) => k % 4 === 0)
        .map(([i, j], k) => {
          const t = (frame * 0.03 + k * 0.17) % 1;
          return <circle key={k} cx={pts[i].x + (pts[j].x - pts[i].x) * t} cy={pts[i].y + (pts[j].y - pts[i].y) * t} r={4} fill={theme.colors.hero} opacity={Math.sin(t * Math.PI)} />;
        })}
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={hubs && i % 9 === 0 ? 9 : 4.5} fill="#fff" fillOpacity={hubs && i % 9 === 0 ? 0.95 : 0.35} />
      ))}
    </svg>
  );
};

/* -------------------------------------------------------------------- A: title */

const TitleA: React.FC = () => {
  const frame = useCurrentFrame();
  const glow = 0.5 + Math.sin(frame / 12) * 0.2;
  return (
    <SceneShell mode="dark" seed={30}>
      <NeuralField opacity={0.85} hubs />
      <AbsoluteFill style={{ paddingLeft: 130, justifyContent: "center" }}>
        <Eyebrow delay={2} style={{ marginBottom: 20 }}>
          Capacidad 02
        </Eyebrow>
        <MaskLine delay={4} style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 218, letterSpacing: "-0.055em", color: "#fff", lineHeight: 1 }}>
          Especialización
        </MaskLine>
        <MaskLine delay={12} style={{ fontFamily: theme.fonts.display, fontWeight: 600, fontSize: 70, letterSpacing: "-0.03em", color: "#fff", marginTop: 8 }}>
          habilitada por el{" "}
          <span style={{ fontFamily: theme.fonts.serif, fontStyle: "italic", fontWeight: 400, fontSize: 84, color: theme.colors.hero, textShadow: `0 0 ${50 * glow}px ${theme.colors.hero}` }}>
            Digital Brain
          </span>
        </MaskLine>
        <div style={{ marginTop: 64, maxWidth: 1300 }}>
          <Words text="El conocimiento del negocio es lo que convierte la tecnología en *resultados.*" size={52} weight={600} per={2.5} delay={BEAT * 2.6} lineHeight={1.08} />
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

/* ------------------------------------------------------------------ B: the triad */

const TRIAD = [
  { n: "01", q: "A quién", t: "Segmentos de cliente" },
  { n: "02", q: "Qué", t: "Dominios de negocio" },
  { n: "03", q: "Cómo", t: "Tecnología y arquitectura" },
];

const Triad: React.FC = () => {
  const frame = useCurrentFrame();
  const active = Math.min(2, Math.floor(Math.max(0, frame - 26) / 20));
  return (
    <SceneShell mode="dark" seed={31}>
      <NeuralField n={40} opacity={0.6} />
      <div style={{ position: "absolute", left: 130, top: 84 }}>
        <Words text="Cada Digital Brain reúne *tres tipos* de conocimiento" size={74} per={2.5} maxWidth={1500} lineHeight={1.05} />
      </div>
      <div style={{ position: "absolute", left: 130, right: 130, top: 430, display: "flex", gap: 40 }}>
        {TRIAD.map((c, i) => {
          const on = active === i;
          return (
            <Pop key={i} delay={10 + i * 6} dist={60} style={{ flex: 1 }}>
              <div
                style={{
                  borderRadius: 28,
                  padding: "40px 44px",
                  height: 380,
                  boxSizing: "border-box",
                  background: on ? theme.colors.hero : "rgba(255,255,255,0.07)",
                  border: `2px solid ${on ? theme.colors.hero : theme.colors.line}`,
                  boxShadow: on ? `0 30px 80px -20px ${theme.colors.hero}` : "none",
                  backdropFilter: "blur(6px)",
                  transform: `translateY(${on ? -12 : 0}px)`,
                }}
              >
                <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: on ? "#fff" : theme.colors.hero, letterSpacing: "-0.03em" }}>{c.n}</div>
                <div style={{ fontFamily: theme.fonts.serif, fontStyle: "italic", fontSize: 112, lineHeight: 1, color: "#fff", margin: "30px 0 14px" }}>{c.q}</div>
                <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 44, letterSpacing: "-0.03em", color: "#fff", lineHeight: 1.05 }}>{c.t}</div>
              </div>
            </Pop>
          );
        })}
      </div>
      <Body delay={BEAT * 4} size={32} style={{ position: "absolute", left: 130, top: 880 }}>
        Crece con cada proyecto y es la base para acelerar con IA la modernización de cada dominio.
      </Body>
    </SceneShell>
  );
};

/* ------------------------------------------------------------------ C: brains */

const BRAINS = [
  {
    a: "Banking",
    tag: "El cerebro de la banca agéntica",
    items: ["Credit Risk & Collections", "Customer & Onboarding", "Corporate & Structured Lending", "Core & Payments"],
    dashed: false,
  },
  {
    a: "Insurance",
    tag: "El cerebro de los seguros inteligentes",
    items: ["Underwriting & Pricing", "Claims & Benefits", "Distribution & Customer", "Capas normativas y de país"],
    dashed: false,
  },
  {
    a: "Smart",
    tag: "Brains en construcción, multi industria",
    items: ["Retail & Servicios", "Industria, Energía y Utilities", "Turismo, Transporte & Educación"],
    dashed: true,
  },
];

const Brains: React.FC = () => {
  const frame = useCurrentFrame();
  const foot = ramp(frame, BEAT * 11, BEAT * 11 + 14, 0, 1);
  return (
    <SceneShell mode="dark" seed={32}>
      <div style={{ position: "absolute", left: 130, top: 70 }}>
        <Words text="Un marco, *diferentes cerebros.*" size={78} per={3} />
      </div>
      <div style={{ position: "absolute", left: 130, right: 130, top: 232, display: "flex", gap: 34 }}>
        {BRAINS.map((b, i) => (
          <Pop key={b.a} delay={10 + i * 7} dist={70} style={{ flex: 1 }}>
            <div
              style={{
                height: 600,
                borderRadius: 28,
                padding: "40px 40px",
                boxSizing: "border-box",
                background: "rgba(255,255,255,0.07)",
                border: b.dashed ? `2.5px dashed rgba(255,255,255,0.45)` : `2px solid ${theme.colors.line}`,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {!b.dashed && <div style={{ position: "absolute", left: 0, top: 0, right: 0, height: 8, background: theme.colors.hero }} />}
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 70, letterSpacing: "-0.045em", color: b.dashed ? "#fff" : theme.colors.hero, lineHeight: 1 }}>{b.a}</div>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 600, fontSize: 46, letterSpacing: "-0.03em", color: "#fff", lineHeight: 1.05 }}>Digital Brain{b.dashed ? "s" : ""}</div>
              <div style={{ fontFamily: theme.fonts.serif, fontStyle: "italic", fontSize: 34, color: theme.colors.textDim, margin: "16px 0 34px", lineHeight: 1.1 }}>{b.tag}</div>
              {b.items.map((it, k) => {
                const d = 44 + i * 6 + k * 7;
                const p = ramp(frame, d, d + 12, 0, 1);
                return (
                  <div
                    key={it}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      fontFamily: theme.fonts.body,
                      fontWeight: 600,
                      fontSize: 27,
                      color: "#fff",
                      padding: "17px 0",
                      borderTop: `1px solid ${theme.colors.line}`,
                      opacity: p,
                      transform: `translateX(${(1 - p) * 30}px)`,
                    }}
                  >
                    <span style={{ width: 10, height: 10, borderRadius: 10, background: theme.colors.hero, flexShrink: 0 }} />
                    {it}
                  </div>
                );
              })}
            </div>
          </Pop>
        ))}
      </div>
      <div style={{ position: "absolute", left: 130, right: 130, top: 912, opacity: foot, transform: `translateY(${(1 - foot) * 16}px)`, display: "flex", alignItems: "baseline", gap: 20 }}>
        <span style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 44, letterSpacing: "-0.03em", color: "#fff" }}>Con cada proyecto,</span>
        <span style={{ fontFamily: theme.fonts.serif, fontStyle: "italic", fontSize: 52, color: theme.colors.hero }}>el cerebro crece.</span>
      </div>
    </SceneShell>
  );
};

export const Special: React.FC = () => (
  <>
    <Sequence from={0} durationInFrames={BAR * 2}>
      <TitleA />
    </Sequence>
    <Sequence from={BAR * 2} durationInFrames={BAR * 1.5}>
      <Triad />
    </Sequence>
    <Sequence from={BAR * 3.5} durationInFrames={BAR * 3.5}>
      <Brains />
    </Sequence>
  </>
);
