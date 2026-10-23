import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Finish } from "../components/Stage";
import { SilkField } from "../components/SilkField";
import { FootageSeq } from "../components/Stock";
import { Chrome } from "../components/Chrome";
import { SyncWords } from "../components/Sync";
import { Eyebrow, Lines, font } from "../components/Type";
import { C, EASE } from "../theme";
import { clamp, ramp } from "../lib/anim";
import { cue, voiceEnd } from "../lib/tl";
import { DONDE } from "../data/content";

const ID = "donde";

export const S07Donde: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const cLead = cue(ID, "Transformamos");
  // cada fila se enciende cuando la voz empieza a nombrar ese frente
  const cRows = [cue(ID, "el legacy", 0), cue(ID, "financiero"), cue(ID, "ciclo de riesgo"), cue(ID, "arquitecturas cloud"), cue(ID, "diseño por dominios"), cue(ID, "ingeniería")];
  const cSup = cue(ID, "Los agentes ejecutan");
  const end = voiceEnd(ID);

  // fila activa: la que se está explicando
  const active = (i: number) => {
    const a = cRows[i] - 8;
    const b = i < 5 ? cRows[i + 1] - 8 : cSup - 6;
    return ramp(frame, a, 12) * (1 - ramp(frame, b, 12));
  };
  const allOn = ramp(frame, cSup + 20, 30, EASE.inOut);

  return (
    <AbsoluteFill>
      <FootageSeq
        shots={[
          { name: "donde", from: 0, rate: 0.7, panX: -70, drift: 1.16 },
          { name: "market", from: cRows[0] - 10, rate: 0.7, panX: 50, panY: -30, drift: 1.14, brightness: 0.85 },
          { name: "circuit", from: cRows[3] - 8, rate: 0.6, panX: -50, drift: 1.18, brightness: 0.95 },
        ]}
        veil={0.4}
        vignette={0.55}
      />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(8,7,16,0.74) 0%, rgba(8,7,16,0.58) 45%, rgba(8,7,16,0.4) 100%)" }} />
      <Chrome chapter="06 · Dónde aceleramos" start={2} tone="dark" />

      <div style={{ position: "absolute", left: 120, top: 150, width: 600, ...font(66, 600, { color: "#FFFFFF", letterSpacing: "-0.04em", lineHeight: 1.03 }) }}>
        <SyncWords scene={ID} text="Dónde aceleramos, eficientamos e industrializamos" from="Dónde aceleramos" accent={[2, 3, 4]} lead={3} dur={16} />
      </div>
      <div style={{ position: "absolute", left: 120, top: 400, width: 600, ...font(34, 400, { color: "#F1F0F6", letterSpacing: "-0.015em", lineHeight: 1.3 }) }}>
        <SyncWords scene={ID} text="Transformamos los sistemas críticos en arquitecturas modernas, flexibles y escalables, sin interrumpir el negocio." from="Transformamos" accent={[11, 12, 13]} lead={3} />
      </div>
      <div style={{ position: "absolute", left: 120, top: 740, width: 600 }}>
        <Lines
          start={cSup - 6}
          stagger={8}
          lines={[
            <span key="a" style={{ ...font(28, 400, { color: "#D9D8E0", letterSpacing: 0, lineHeight: 1.32 }) }}>Combinamos arquitecturas cloud, evolución del core e ingeniería avanzada.</span>,
            <span key="b" style={{ ...font(28, 600, { color: "#FF4DA6", letterSpacing: 0 }) }}>Los agentes ejecutan; la arquitectura marca el camino.</span>,
          ]}
        />
      </div>

      {/* tabla "Esto incluye" */}
      <div style={{ position: "absolute", left: 790, top: 150 }}>
        <Eyebrow start={cLead - 2}>{DONDE.includes}</Eyebrow>
      </div>
      {DONDE.items.map((it, i) => {
        const p = ramp(frame, cRows[i] - 10, 24, EASE.out);
        const a = active(i);
        const lit = Math.max(a, allOn);
        const y = 214 + i * 128;
        return (
          <div key={it.n} style={{ position: "absolute", left: 790, top: y, width: 1010, height: 120, opacity: clamp(p * 1.5) }}>
            <div style={{ position: "absolute", inset: 0, borderLeft: `4px solid rgba(225,3,122,${a})` }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 2, background: "rgba(255,255,255,0.28)", transformOrigin: "left", transform: `scaleX(${ramp(frame, cRows[i] - 12, 26, EASE.inOut)})` }} />
            <div style={{ position: "absolute", left: 24, top: 26, transform: `translateY(${(1 - p) * 20}px)`, ...font(30, 500, { color: C.magenta, letterSpacing: "0.02em" }) }}>{it.n}</div>
            <div style={{ position: "absolute", left: 96, top: 16, width: 400, transform: `translateY(${(1 - p) * 20}px)`, opacity: 0.5 + 0.5 * lit, ...font(30, 600, { color: "#FFFFFF", letterSpacing: "-0.025em", lineHeight: 1.1 }) }}>{it.t}</div>
            <div style={{ position: "absolute", left: 510, top: 18, width: 480, transform: `translateY(${(1 - p) * 20}px)`, opacity: 0.55 + 0.45 * lit, ...font(22, 400, { color: "#D9D8E0", letterSpacing: 0, lineHeight: 1.34 }) }}>{it.d}</div>
          </div>
        );
      })}
      <Finish tone="dark" />
    </AbsoluteFill>
  );
};
