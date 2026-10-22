import { Footage } from "../components/Footage";
import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import { BEAT, theme } from "../theme";
import { Eyebrow, Pop, SceneShell, Words } from "../components/kit";

const HEADERS = ["Segmento de cliente", "Dominios de negocio", "Tecnología y arquitectura"];
type Case = { logo: string; title: string };
const COLS: Case[][] = [
  [
    { logo: "asisa", title: "Distribución aseguradora multicompañía" },
    { logo: "moraBanc", title: "Crédito lombardo digital en banca privada" },
    { logo: "mutua", title: "Asesoramiento digital con cumplimiento" },
  ],
  [
    { logo: "bbva", title: "Lending corporativo global, modernizado con IA agéntica" },
    { logo: "axa", title: "Suscripción multirramo al ritmo del producto" },
    { logo: "sabadell", title: "Recobro conversacional con agentes humanizados" },
  ],
  [
    { logo: "caixabank", title: "APIs gobernadas, base para evolucionar" },
    { logo: "mapfre", title: "Microservicios industrializados con IA y SDD" },
    { logo: "egon", title: "Capa agéntica sobre el core legacy" },
  ],
];

const CW = 540;
const CG = 35;
const X0 = 130;
const Y0 = 292;
const CH = 206;
const RG = 22;

export const Cases: React.FC = () => {
  const frame = useCurrentFrame();
  const sweep = frame < BEAT * 6 ? -1 : Math.floor((frame - BEAT * 6) / 9) % 9;
  return (
    <SceneShell mode="dark" seed={40} footage={<Footage id="4809" tone="dark" scrim="full" opacity={0.6} />}>
      <div style={{ position: "absolute", left: 130, top: 60 }}>
        <Words text="Proyectos reales, *sin experimentos.*" size={80} per={3} />
      </div>
      <Eyebrow delay={14} size={22} style={{ position: "absolute", left: 134, top: 152 }}>
        Experiencia en servicios financieros
      </Eyebrow>
      {HEADERS.map((h, i) => (
        <Pop key={h} delay={8 + i * 4} style={{ position: "absolute", left: X0 + i * (CW + CG), top: 214, width: CW }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, borderBottom: `2px solid ${theme.colors.line}`, paddingBottom: 12 }}>
            <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: theme.colors.hero }}>0{i + 1}</span>
            <span style={{ fontFamily: theme.fonts.display, fontWeight: 600, fontSize: 34, letterSpacing: "-0.02em", color: "#fff" }}>{h}</span>
          </div>
        </Pop>
      ))}
      {COLS.map((col, ci) =>
        col.map((c, ri) => {
          const idx = ri * 3 + ci;
          const on = sweep === idx;
          return (
            <Pop key={c.logo} delay={20 + ri * 9 + ci * 3} dist={44} style={{ position: "absolute", left: X0 + ci * (CW + CG), top: Y0 + ri * (CH + RG), width: CW }}>
              <div
                style={{
                  height: CH,
                  boxSizing: "border-box",
                  borderRadius: 22,
                  padding: "26px 30px",
                  background: on ? "rgba(230,0,126,0.22)" : "rgba(255,255,255,0.07)",
                  border: `2px solid ${on ? theme.colors.hero : theme.colors.line}`,
                  boxShadow: on ? `0 0 44px -8px ${theme.colors.hero}` : "none",
                  transform: `scale(${on ? 1.025 : 1})`,
                }}
              >
                <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "#fff", borderRadius: 12, height: 62, padding: "0 22px", marginBottom: 20 }}>
                  <Img src={staticFile(`logos/case_${c.logo}.png`)} style={{ height: 34, maxWidth: 170, objectFit: "contain" }} />
                </div>
                <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 31, letterSpacing: "-0.025em", lineHeight: 1.12, color: "#fff" }}>{c.title}</div>
              </div>
            </Pop>
          );
        }),
      )}
    </SceneShell>
  );
};
