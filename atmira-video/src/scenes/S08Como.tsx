import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, Finish } from "../components/Stage";
import { Chrome } from "../components/Chrome";
import { Rule, font } from "../components/Type";
import { C, EASE, FONT } from "../theme";
import { clamp, ramp } from "../lib/anim";
import { cue } from "../lib/tl";
import { COMO } from "../data/content";

const ID = "como";
const approval: Record<string, string[]> = {
  Analiza: ["Conocimiento de dominio"],
  Decide: ["Arquitectura", "Complejidad y riesgo"],
  Construye: ["Spec y codificación", "Pruebas"],
  Opera: ["Despliegue"],
};

const Diamond: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = C.magenta }) => (
  <span style={{ display: "inline-block", width: size, height: size, background: color, transform: "rotate(45deg)", borderRadius: 2, flex: "none" }} />
);

export const S08Como: React.FC = () => {
  const frame = useCurrentFrame();
  useVideoConfig();
  const cSpec = cue(ID, "Spec-Driven");
  const cPh = [cue(ID, "Analiza"), cue(ID, "Decide"), cue(ID, "Construye"), cue(ID, "Opera")];
  const cArn = cue(ID, "arnés");
  const cBrain = cue(ID, "Digital Brain");
  const cGuard = cue(ID, "Guardrails");
  // mientras se explica el método (antes de «Analiza») el contenedor muestra la idea: especificaciones versionadas → repositorio y CI/CD → aprobación humana
  const cVer = cue(ID, "versionadas");
  const cRepo = cue(ID, "repositorios");
  const cCI = cRepo + 30;
  const cApr = cue(ID, "aprobación");
  const specOut = 1 - ramp(frame, cPh[0] - 34, 22, EASE.in);

  const base = ramp(frame, 18, 30, EASE.out);
  const COLW = 380;
  const colX = (i: number) => 168 + i * (COLW + 24);

  return (
    <AbsoluteFill>
      <Backdrop tone="light" />
      <Chrome chapter="07 · Agent Factory · cómo" start={2} />

      <div style={{ position: "absolute", left: 120, top: 96, ...font(84, 500, { letterSpacing: "-0.045em" }), opacity: clamp(ramp(frame, 4, 24) * 1.4), transform: `translateY(${(1 - ramp(frame, 4, 24)) * 20}px)` }}>
        {COMO.title[0]} <span style={{ color: C.magenta }}>{COMO.title[1]}</span>
      </div>
      {/* contenedor Agent Factory */}
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 272,
          width: 1680,
          height: 566,
          borderRadius: 26,
          background: C.paper2,
          opacity: base,
          transform: `scale(${0.985 + base * 0.015})`,
        }}
      />
      <div style={{ position: "absolute", left: 156, top: 292, opacity: base, ...font(36, 400, { letterSpacing: "-0.03em" }) }}>{COMO.factory}</div>

      {/* método: especificación versionada → repositorio y CI/CD → aprobación humana */}
      {specOut > 0.001 && (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: specOut * base }}>
          {[0, 1, 2].map((k) => {
            const t0 = k === 0 ? cSpec - 6 : cVer - 8 + (k - 1) * 14;
            const p = ramp(frame, t0, 26, EASE.out);
            const bob = Math.sin((frame + k * 17) / 26) * 3;
            const x = 232 + k * 40;
            const y = 392 + k * 66 + bob;
            const ver = ["v1", "v2", "v3"][k];
            return (
              <div
                key={k}
                style={{
                  position: "absolute",
                  left: x,
                  top: y,
                  width: 400,
                  height: 236,
                  borderRadius: 14,
                  background: "#fff",
                  boxShadow: "0 14px 36px rgba(80,20,50,0.10)",
                  padding: "24px 28px",
                  opacity: clamp(p * 1.6),
                  transform: `translateY(${(1 - p) * 40}px)`,
                  zIndex: k,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", ...font(20, 600, { letterSpacing: "0.12em", color: C.mute }) }}>
                  <span style={{ textTransform: "uppercase" }}>Especificación</span>
                  <span style={{ background: C.magenta, color: "#fff", borderRadius: 999, padding: "3px 14px", letterSpacing: "0.04em" }}>{ver}</span>
                </div>
                {[0.92, 0.7, 0.84, 0.5, 0.76].map((w, i) => {
                  const q = ramp(frame, t0 + 8 + i * 4, 18, EASE.out);
                  return <div key={i} style={{ marginTop: 18, height: 9, borderRadius: 5, background: i === 0 ? C.magenta : C.line, width: `${w * 100 * q}%`, opacity: i === 0 ? 0.9 : 1 }} />;
                })}
              </div>
            );
          })}
          {/* trazado hacia repositorios y CI/CD */}
          {(() => {
            const lp = ramp(frame, cRepo - 20, 70, EASE.inOut);
            const y = 560;
            return (
              <>
                <div style={{ position: "absolute", left: 760, top: y, width: 880 * lp, height: 3, background: C.magenta, borderRadius: 2 }} />
                {[
                  { x: 800, l: "Repositorios", t: cRepo },
                  { x: 1120, l: "CI/CD", t: cCI },
                ].map((c) => {
                  const a = ramp(frame, c.t - 8, 22, EASE.out);
                  return (
                    <div
                      key={c.l}
                      style={{
                        position: "absolute",
                        left: c.x,
                        top: y - 36,
                        height: 72,
                        padding: "0 34px",
                        display: "flex",
                        alignItems: "center",
                        borderRadius: 36,
                        background: "#fff",
                        border: `3px solid ${C.magenta}`,
                        boxShadow: "0 10px 26px rgba(80,20,50,0.10)",
                        opacity: clamp(a * 1.6),
                        transform: `scale(${0.8 + 0.2 * a})`,
                        ...font(30, 500, { letterSpacing: "-0.02em" }),
                      }}
                    >
                      {c.l}
                    </div>
                  );
                })}
                {(() => {
                  const a = ramp(frame, cApr - 8, 24, EASE.out);
                  return (
                    <div style={{ position: "absolute", left: 1560, top: y - 62, width: 190, textAlign: "center", opacity: clamp(a * 1.6), transform: `scale(${0.6 + 0.4 * a})` }}>
                      <div style={{ display: "flex", justifyContent: "center", paddingTop: 22 }}>
                        <Diamond size={54} />
                      </div>
                      <div style={{ marginTop: 40, ...font(21, 500, { color: C.magenta, letterSpacing: 0, lineHeight: 1.2 }) }}>aprobación humana antes de cada fase</div>
                    </div>
                  );
                })()}
              </>
            );
          })()}
        </div>
      )}
      {COMO.phases.map((ph, i) => {
        const p = ramp(frame, cPh[i] - 6, 24, EASE.out);
        return (
          <div key={ph.t} style={{ position: "absolute", left: colX(i), top: 400, width: COLW, opacity: clamp(p * 1.5) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, transform: `translateY(${(1 - p) * 20}px)` }}>
              <span style={{ width: 14, height: 14, borderRadius: 7, background: C.magenta }} />
              <span style={{ ...font(60, 600, { letterSpacing: "-0.04em" }) }}>{ph.t}</span>
            </div>
          </div>
        );
      })}

      {/* línea de gates */}
      {(() => {
        const y = 600;
        const lp = ramp(frame, cPh[3] + 6, 50, EASE.inOut);
        return (
          <>
            <div style={{ position: "absolute", left: 168, top: y, width: 1560 * lp, height: 3, background: C.magenta, borderRadius: 2 }} />
            {COMO.phases.map((ph, i) => {
              const x0 = colX(i) + 6;
              const gx = colX(i) + 230;
              const a = ramp(frame, cPh[3] + 6 + i * 11, 18, EASE.out);
              return (
                <React.Fragment key={ph.t}>
                  <div style={{ position: "absolute", left: x0 - 12, top: y - 11, width: 26, height: 26, borderRadius: 13, background: "#fff", border: `3px solid ${C.magenta}`, opacity: a, transform: `scale(${0.4 + 0.6 * a})` }} />
                  <div style={{ position: "absolute", left: gx - 12, top: y - 10, opacity: a, transform: `scale(${0.4 + 0.6 * a})` }}>
                    <Diamond size={22} />
                  </div>
                  <div style={{ position: "absolute", left: gx - 118, top: y + 34, width: 260, textAlign: "center", opacity: a, ...font(30, 600, { color: C.magenta, letterSpacing: "-0.01em", lineHeight: 1.2 }) }}>{ph.gate}</div>
                </React.Fragment>
              );
            })}
          </>
        );
      })()}

      {/* Digital Brain */}
      {(() => {
        const p = ramp(frame, cBrain - 10, 26, EASE.out);
        return (
          <>
            <div
              style={{
                position: "absolute",
                left: 400,
                top: 740,
                width: 1120,
                height: 96,
                borderRadius: 8,
                background: C.magenta,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                padding: "0 30px",
                gap: 18,
                opacity: clamp(p * 1.5),
                transform: `translateY(${(1 - p) * 24}px)`,
                ...font(20, 400, { color: "#fff", letterSpacing: 0, lineHeight: 1.3 }),
              }}
            >
              <b style={{ fontSize: 36, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>{COMO.brain.l}</b>
            </div>
          </>
        );
      })()}
      {(() => {
        const p = ramp(frame, cGuard - 8, 24, EASE.out);
        return (
          <div style={{ position: "absolute", left: 400, top: 868, width: 1120, opacity: clamp(p * 1.5), transform: `translateY(${(1 - p) * 14}px)`, ...font(36, 400, { color: C.ink2, letterSpacing: 0 }) }}>
            <b style={{ color: C.magenta, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>{COMO.guardrails.l}</b>
          </div>
        );
      })()}
      <Finish tone="light" />
    </AbsoluteFill>
  );
};
