import React from "react";
import { AbsoluteFill, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { BAR, BEAT, theme } from "../theme";
import { Body, Counter, Eyebrow, MaskLine, Pop, SceneShell, Words, ramp, useSpring } from "../components/kit";

/* ---------------------------------------------------------------- A: title */

const TitleA: React.FC = () => {
  const frame = useCurrentFrame();
  const glow = 0.5 + Math.sin(frame / 12) * 0.2;
  return (
    <SceneShell mode="dark" seed={20}>
      <AbsoluteFill style={{ paddingLeft: 130, justifyContent: "center" }}>
        <Eyebrow delay={2} style={{ marginBottom: 20 }}>
          Capacidad 01
        </Eyebrow>
        <MaskLine delay={4} style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 236, letterSpacing: "-0.055em", color: "#fff", lineHeight: 1 }}>
          Aceleración
        </MaskLine>
        <MaskLine delay={12} style={{ fontFamily: theme.fonts.display, fontWeight: 600, fontSize: 70, letterSpacing: "-0.03em", color: "#fff", marginTop: 8 }}>
          habilitada por la{" "}
          <span style={{ fontFamily: theme.fonts.serif, fontStyle: "italic", fontWeight: 400, fontSize: 84, color: theme.colors.hero, textShadow: `0 0 ${50 * glow}px ${theme.colors.hero}` }}>
            Agent Factory
          </span>
        </MaskLine>
        <div style={{ marginTop: 70 }}>
          <Words text="No convertimos código." size={58} weight={500} per={3} delay={BEAT * 2.4} style={{ color: theme.colors.textDim }} />
          <Words text="Transformamos *cómo se construye* software." size={58} weight={700} per={3} delay={BEAT * 3.2} emScale={1.14} style={{ marginTop: 6 }} />
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

/* --------------------------------------------------------------- B: pipeline */

const PHASES = [
  { name: "Analiza", items: ["Conocimiento técnico", "Conocimiento de dominio", "Impacto en negocio"], gate: "Validar negocio" },
  { name: "Decide", items: ["Arquitectura", "Complejidad y riesgo", "Cumplimiento"], gate: "Revisión de arquitectura" },
  { name: "Construye", items: ["Spec y codificación", "Pruebas", "Documentación"], gate: "Code & test review" },
  { name: "Opera", items: ["Despliegue", "Observabilidad", "Evidencia y memoria"], gate: "Go / no-go" },
];
const COL_W = 390;
const GAP = 40;
const X0 = 130;
const colX = (i: number) => X0 + i * (COL_W + GAP);

const Pipeline: React.FC = () => {
  const frame = useCurrentFrame();
  const packetT = ramp(frame, 40, 150, 0, 1, theme.ease.inOut);
  const packetX = X0 + packetT * (4 * COL_W + 3 * GAP);
  const LINE_Y = 718;
  return (
    <SceneShell mode="dark" seed={21}>
      <div style={{ position: "absolute", left: 130, top: 66 }}>
        <Words text="Cómo aceleramos: *cada cambio, trazado*" size={70} per={2.5} />
      </div>
      <Pop delay={20} from="left" style={{ position: "absolute", left: 130, top: 150 }}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 22, letterSpacing: "0.16em", textTransform: "uppercase", padding: "9px 24px", borderRadius: 100, border: `2px solid ${theme.colors.hero}`, color: "#fff", background: "rgba(230,0,126,0.16)" }}>
          Spec-Driven Development
        </div>
      </Pop>

      {/* guardrails ribbon */}
      <Pop delay={14} style={{ position: "absolute", left: X0, top: 236, width: 4 * COL_W + 3 * GAP }}>
        <div style={{ height: 54, borderRadius: 12, border: `1.5px solid ${theme.colors.line}`, display: "flex", alignItems: "center", padding: "0 24px", gap: 20, fontFamily: theme.fonts.body, fontSize: 21, color: theme.colors.textDim }}>
          <b style={{ color: "#fff", letterSpacing: "0.18em" }}>GUARDRAILS</b>
          identidad · sandboxing · control de salidas · pasarela MCP · secretos · model proxy · kill switch
        </div>
      </Pop>

      {PHASES.map((ph, i) => {
        const lit = interpolate(packetX, [colX(i) - 80, colX(i) + 60, colX(i) + COL_W + 40, colX(i) + COL_W + 200], [0, 1, 1, 0.55], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <Pop key={i} delay={22 + i * 5} style={{ position: "absolute", left: colX(i), top: 312, width: COL_W }}>
            <div
              style={{
                height: 330,
                borderRadius: 22,
                padding: "30px 32px",
                boxSizing: "border-box",
                background: `rgba(255,255,255,${0.05 + lit * 0.06})`,
                border: `2px solid rgba(230,0,126,${0.15 + lit * 0.75})`,
                boxShadow: lit > 0.9 ? `0 0 50px -10px ${theme.colors.hero}` : "none",
              }}
            >
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 56, letterSpacing: "-0.04em", color: "#fff", marginBottom: 20 }}>{ph.name}</div>
              {ph.items.map((it, k) => (
                <div key={k} style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: theme.fonts.body, fontWeight: 500, fontSize: 26, color: "#fff", opacity: 0.55 + lit * 0.45, padding: "9px 0", borderTop: k ? `1px solid ${theme.colors.line}` : "none" }}>
                  <span style={{ width: 9, height: 9, borderRadius: 9, background: theme.colors.hero }} />
                  {it}
                </div>
              ))}
            </div>
          </Pop>
        );
      })}

      {/* approval line */}
      <div style={{ position: "absolute", left: X0, top: LINE_Y, width: 4 * COL_W + 3 * GAP, height: 3, background: theme.colors.line }} />
      <div style={{ position: "absolute", left: X0, top: LINE_Y, width: packetX - X0, height: 3, background: theme.colors.hero, boxShadow: `0 0 16px ${theme.colors.hero}` }} />
      {PHASES.map((ph, i) => {
        const gx = colX(i) + COL_W / 2;
        const passed = packetX > gx;
        const flash = interpolate(packetX, [gx - 30, gx, gx + 70], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <Pop key={i} delay={34 + i * 5} style={{ position: "absolute", left: gx - 120, top: LINE_Y - 22, width: 240 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: 40, height: 40, transform: `rotate(45deg) scale(${1 + flash * 0.35})`, background: passed ? theme.colors.hero : theme.colors.bg, border: `3px solid ${passed ? theme.colors.hero : "#fff"}`, boxShadow: flash > 0.2 ? `0 0 ${34 * flash}px ${theme.colors.hero}` : "none" }} />
              <div style={{ marginTop: 22, fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 21, color: "#fff", opacity: passed ? 1 : 0.55, textAlign: "center" }}>{ph.gate}</div>
            </div>
          </Pop>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: packetX - 14,
          top: LINE_Y - 12,
          width: 28,
          height: 28,
          borderRadius: 28,
          background: "#fff",
          boxShadow: `0 0 30px 8px ${theme.colors.hero}`,
          opacity: ramp(frame, 38, 46, 0, 1) * (1 - ramp(frame, 150, 158, 0, 1)),
        }}
      />

      {/* digital brain ribbon */}
      <Pop delay={44} style={{ position: "absolute", left: X0, top: 872, width: 4 * COL_W + 3 * GAP }}>
        <div style={{ height: 76, borderRadius: 14, background: theme.colors.hero, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 34px", fontFamily: theme.fonts.body, color: "#fff" }}>
          <span><b style={{ letterSpacing: "0.18em", fontSize: 24 }}>DIGITAL BRAIN</b> <span style={{ fontSize: 22, opacity: 0.9, marginLeft: 16 }}>ontología del dominio · memoria compartida · estándares del cliente</span></span>
          <span style={{ fontFamily: theme.fonts.serif, fontStyle: "italic", fontSize: 32 }}>aporta contexto · consolida lo aprendido</span>
        </div>
      </Pop>
      <Body delay={BEAT * 8} size={26} style={{ position: "absolute", left: X0, top: 972, color: "#fff" }} dim={false}>
        <span style={{ color: theme.colors.textDim }}>Los agentes generan y prueban. </span>Las personas aprueban en cada gate.
      </Body>
    </SceneShell>
  );
};

/* ------------------------------------------------------------------ C: agents */

const BIZ = [
  ["Conocimiento de dominio", "Impacto en negocio"],
  ["Spec de negocio", "Cumplimiento"],
  ["Pruebas de negocio", "Documentación funcional"],
  ["Evidencia", "Memoria"],
];
const TECH = [
  ["Conocimiento técnico", "Complejidad y riesgo"],
  ["Arquitectura", "Spec técnica"],
  ["Codificación", "Pruebas unitarias y PR"],
  ["Despliegue", "Observabilidad"],
];
const PX0 = 470;
const PW = 322;
const PG = 18;

const Agents: React.FC = () => {
  const frame = useCurrentFrame();
  const scan = ramp(frame, 26, 96, 0, 1, theme.ease.inOut);
  const rows: [string, string, string[][], number][] = [
    ["Agentes de negocio", "Saben del dominio", BIZ, 296],
    ["Agentes de tecnología", "Saben de la tecnología", TECH, 598],
  ];
  return (
    <SceneShell mode="dark" seed={22}>
      <div style={{ position: "absolute", left: 130, top: 66 }}>
        <Words text="Quién acelera: *agentes expertos* en cada fase" size={68} per={2.5} />
      </div>
      {["Analiza", "Decide", "Construye", "Opera"].map((p, i) => (
        <Pop key={p} delay={10 + i * 3} style={{ position: "absolute", left: PX0 + i * (PW + PG), top: 232, width: PW }}>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 36, letterSpacing: "-0.03em", color: "#fff", borderBottom: `3px solid ${theme.colors.hero}`, paddingBottom: 10 }}>{p}</div>
        </Pop>
      ))}
      {rows.map(([title, sub, data, y], ri) => (
        <React.Fragment key={title}>
          <Pop delay={14 + ri * 8} from="left" style={{ position: "absolute", left: 130, top: y, width: 310 }}>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, letterSpacing: "-0.03em", color: "#fff", lineHeight: 1.05 }}>{title}</div>
            <div style={{ fontFamily: theme.fonts.serif, fontStyle: "italic", fontSize: 32, color: theme.colors.hero, marginTop: 8 }}>{sub}</div>
          </Pop>
          {data.map((col, ci) =>
            col.map((name, k) => {
              const delay = 18 + ri * 10 + ci * 4 + k * 2;
              const cellX = PX0 + ci * (PW + PG);
              const hit = interpolate(scan * (PX0 + 4 * (PW + PG)) + 0, [cellX - 40, cellX + 60, cellX + PW + 60], [0, 1, 0.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              return (
                <Pop key={name} delay={delay} dist={28} style={{ position: "absolute", left: cellX, top: y + k * 100, width: PW }}>
                  <div
                    style={{
                      height: 84,
                      borderRadius: 16,
                      display: "flex",
                      alignItems: "center",
                      padding: "0 22px",
                      background: `rgba(255,255,255,${0.06 + hit * 0.08})`,
                      border: `2px solid rgba(230,0,126,${0.2 + hit * 0.8})`,
                      boxShadow: hit > 0.8 ? `0 0 30px -6px ${theme.colors.hero}` : "none",
                      fontFamily: theme.fonts.body,
                      fontWeight: 600,
                      fontSize: 24,
                      lineHeight: 1.15,
                      color: "#fff",
                    }}
                  >
                    {name}
                  </div>
                </Pop>
              );
            }),
          )}
        </React.Fragment>
      ))}
      <Pop delay={BEAT * 5} style={{ position: "absolute", left: 130, right: 130, top: 880 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 28, borderTop: `1px solid ${theme.colors.line}`, paddingTop: 30 }}>
          <span style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 22, letterSpacing: "0.2em", color: theme.colors.hero }}>HUMAN-IN-THE-LOOP</span>
          <span style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 46, letterSpacing: "-0.03em", color: "#fff" }}>
            Los agentes proponen.{" "}
            <span style={{ fontFamily: theme.fonts.serif, fontStyle: "italic", fontWeight: 400, fontSize: 54, color: theme.colors.hero }}>Las personas deciden.</span>
          </span>
        </div>
      </Pop>
    </SceneShell>
  );
};

/* -------------------------------------------------------------------- D: SIREC */

const Sirec: React.FC = () => {
  const frame = useCurrentFrame();
  const card = useSpring(0, theme.spring.bouncy);
  return (
    <SceneShell mode="light" seed={23}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 90, paddingBottom: 20 }}>
        <div
          style={{
            width: 430,
            height: 430,
            borderRadius: 44,
            background: "#fff",
            boxShadow: "0 50px 100px -30px rgba(230,0,126,0.55), 0 0 0 2px rgba(17,17,17,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${interpolate(card, [0, 1], [0.6, 1])}) rotate(${interpolate(card, [0, 1], [-8, 0])}deg)`,
            opacity: interpolate(card, [0, 0.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          <Img src={staticFile("brand/sirec.png")} style={{ width: 330, transform: `translateY(${Math.sin(frame / 14) * 5}px)` }} />
        </div>
        <div style={{ width: 880 }}>
          <Eyebrow mode="light" delay={6} style={{ marginBottom: 18 }}>
            Solución de la plataforma
          </Eyebrow>
          <Words text="Inteligencia aplicada al ciclo de *riesgo de crédito*" size={66} mode="light" per={2.5} delay={6} lineHeight={1.05} />
          <Body mode="light" delay={22} size={30} style={{ marginTop: 26 }}>
            Anticipación, seguimiento y recobro orquestados con agentes propios y de terceros.
          </Body>
          <Pop delay={26} from="left" style={{ marginTop: 30 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
              <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 118, letterSpacing: "-0.05em", color: theme.colors.hero, lineHeight: 1 }}>
                +<Counter to={15} delay={26} />
              </span>
              <span style={{ fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 28, color: theme.colors.ink }}>clientes en Europa y Latinoamérica</span>
            </div>
          </Pop>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

export const Accel: React.FC = () => (
  <>
    <Sequence from={0} durationInFrames={BAR * 2}>
      <TitleA />
    </Sequence>
    <Sequence from={BAR * 2} durationInFrames={BAR * 3}>
      <Pipeline />
    </Sequence>
    <Sequence from={BAR * 5} durationInFrames={BAR * 2}>
      <Agents />
    </Sequence>
    <Sequence from={BAR * 7} durationInFrames={BAR}>
      <Sirec />
    </Sequence>
  </>
);
