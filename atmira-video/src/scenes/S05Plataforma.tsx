import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, Finish } from "../components/Stage";
import { SilkField } from "../components/SilkField";
import { Chrome } from "../components/Chrome";
import { SyncWords } from "../components/Sync";
import { Eyebrow, font } from "../components/Type";
import { C, EASE, FONT } from "../theme";
import { clamp, ramp } from "../lib/anim";
import { cue } from "../lib/tl";
import { PLATAFORMA } from "../data/content";
import { Img, staticFile } from "remotion";

const ID = "plataforma";

export const S05Plataforma: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const cSys = cue(ID, "tus sistemas");
  const cObj = cue(ID, "arquitectura objetivo");
  const cHub = cue(ID, "ModernIzA");
  const cL = [cue(ID, "Aceleración"), cue(ID, "Especialización"), cue(ID, "gobierno")];
  const cSirec = cue(ID, "SIREC");
  const hot = (i: number) => {
    const s = cL[i];
    const e = i < 2 ? cL[i + 1] : cue(ID, "Además");
    return ramp(frame, s - 4, 12) * (1 - ramp(frame, e - 4, 12));
  };

  const sysP = ramp(frame, cSys - 6, 28, EASE.out);
  const tgtP = ramp(frame, cObj - 8, 28, EASE.out);
  const hubP = ramp(frame, cHub - 10, 26, EASE.out);
  void hubP;

  const LX = 120;
  const CX = 610;
  const RX = 1400;

  return (
    <AbsoluteFill>
      <Backdrop tone="light" />
      {/* un hilo de seda atraviesa de izquierda (enmarañado) a derecha (ordenado) por detrás de la plataforma */}
      <SilkField
        time={t}
        order={ramp(frame, cSys, 420, EASE.inOut)}
        lines={80}
        seed={13}
        fills={5}
        blurNear={0}
        draw={ramp(frame, cSys - 10, 150, EASE.soft)}
        length={26}
        spread={2.2}
        pinch={0.6}
        cam={{ pos: [0, 0.2, -15], target: [0, -0.6, 0], fov: 32, roll: 0 }}
        alpha={0.5}
        style={{ opacity: 0.9, top: -250, WebkitMaskImage: "linear-gradient(90deg, transparent 38%, #000 68%, #000 94%, transparent 100%)", maskImage: "linear-gradient(90deg, transparent 38%, #000 68%, #000 94%, transparent 100%)" }}
      />
      <Chrome chapter="04 · Plataforma" start={2} />

      <div style={{ position: "absolute", left: 120, top: 104, width: 1600, ...font(56, 600, { letterSpacing: "-0.04em", lineHeight: 1.08 }) }}>
        <SyncWords scene={ID} text="Ofrecemos un enfoque de plataforma:" from="Lo hacemos" lead={2} style={{ display: "none" }} />
        <div style={{ opacity: ramp(frame, 8, 22, EASE.out), transform: `translateY(${(1 - ramp(frame, 8, 22, EASE.out)) * 22}px)` }}>{PLATAFORMA.title[0]}</div>
        <div style={{ color: C.magenta, opacity: ramp(frame, 14, 22, EASE.out), transform: `translateY(${(1 - ramp(frame, 14, 22, EASE.out)) * 22}px)` }}>
          {PLATAFORMA.title[1]} {PLATAFORMA.title[2]}
        </div>
      </div>

      {/* Tus sistemas: líneas abiertas con filete, sin cajas */}
      <div style={{ position: "absolute", left: LX, top: 352 }}>
        <Eyebrow start={cSys - 8} color={C.ink}>
          {PLATAFORMA.systemsLabel}
        </Eyebrow>
      </div>
      {PLATAFORMA.systems.map((s, i) => {
        const p = ramp(frame, cSys - 4 + i * 5, 22, EASE.out);
        return (
          <div
            key={s}
            style={{
              position: "absolute",
              left: LX,
              top: 402 + i * 62,
              width: 430,
              height: 62,
              display: "flex",
              alignItems: "center",
              ...font(27, 400, { color: C.ink2, letterSpacing: "-0.01em" }),
              opacity: clamp(p * 1.5),
              transform: `translateX(${(1 - p) * -40}px)`,
            }}
          >
            {s}
            <span style={{ position: "absolute", left: 0, bottom: 0, height: 1.5, width: `${p * 100}%`, background: C.line }} />
          </div>
        );
      })}

      {/* ModernIzA: tres capas en columna, la activa se enciende */}
      <div style={{ position: "absolute", left: CX, top: 340, opacity: hubP }}>
        <span style={{ ...font(64, 800, { letterSpacing: "-0.045em" }) }}>
          Modern<span style={{ color: C.magenta }}>Iz</span>A
        </span>
      </div>
      <div style={{ position: "absolute", left: CX - 34, top: 436, width: 3, height: 486 * hubP, background: C.magenta, opacity: 0.9 }} />
      {PLATAFORMA.layers.map((l, i) => {
        const p = ramp(frame, cL[i] - 8, 24, EASE.out);
        const h = hot(i);
        const done = frame > cL[2] + 150 ? 1 : 0;
        const act = Math.max(h, done * 0.6);
        return (
          <div key={l.t} style={{ position: "absolute", left: CX, top: 436 + i * 166, width: 700, opacity: clamp(p * 1.5), transform: `translateY(${(1 - p) * 26}px)` }}>
            <div style={{ position: "absolute", left: -34, top: 4, width: 3, height: 140 * h, background: C.ink }} />
            <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
              <span style={{ ...font(50, h > 0.5 ? 700 : 500, { color: act > 0.4 ? C.ink : "#B9B8BF", letterSpacing: "-0.04em" }) }}>{l.t}</span>
              <span style={{ ...font(22, 600, { color: C.magenta, letterSpacing: "0.02em", opacity: 0.4 + 0.6 * act }) }}>{l.s}</span>
            </div>
            <div style={{ marginTop: 8, opacity: 0.3 + 0.7 * act, ...font(23, 400, { color: C.ink2, letterSpacing: 0, lineHeight: 1.3 }) }}>{l.d}</div>
          </div>
        );
      })}

      {/* Arquitectura objetivo */}
      <div style={{ position: "absolute", left: RX, top: 352 }}>
        <Eyebrow start={cObj - 10}>{PLATAFORMA.targetLabel}</Eyebrow>
      </div>
      {PLATAFORMA.target.map((s, i) => {
        const p = ramp(frame, cObj - 6 + i * 5, 22, EASE.out);
        return (
          <div
            key={s}
            style={{
              position: "absolute",
              left: RX,
              top: 402 + i * 62,
              width: 420,
              height: 62,
              display: "flex",
              alignItems: "center",
              gap: 16,
              ...font(27, 600, { color: C.ink, letterSpacing: "-0.015em" }),
              opacity: clamp(p * 1.5),
              transform: `translateX(${(1 - p) * 40}px)`,
            }}
          >
            <span style={{ width: 10, height: 10, borderRadius: 5, background: C.magenta, flex: "none" }} />
            {s}
            <span style={{ position: "absolute", left: 0, bottom: 0, height: 1.5, width: `${p * 100}%`, background: C.line }} />
          </div>
        );
      })}

      {/* SIREC: logotipo y texto sobre un filete, sin caja */}
      {(() => {
        const p = ramp(frame, cSirec - 10, 26, EASE.out);
        return (
          <div style={{ position: "absolute", left: 120, top: 932, width: 1680, opacity: clamp(p * 1.5), transform: `translateY(${(1 - p) * 30}px)` }}>
            <div style={{ position: "absolute", left: 0, top: 0, height: 2, width: `${p * 100}%`, background: C.ink }} />
            <div style={{ display: "flex", alignItems: "center", gap: 36, paddingTop: 18 }}>
              <Img src={staticFile("brand/sirec.png")} style={{ height: 70, width: "auto", mixBlendMode: "multiply" }} />
              <div style={{ flex: 1 }}>
                <div style={{ ...font(32, 600, { letterSpacing: "-0.025em" }) }}>{PLATAFORMA.sirec.t}</div>
                <div style={{ marginTop: 4, ...font(22, 400, { color: C.ink2, letterSpacing: 0 }) }}>
                  {PLATAFORMA.sirec.d} {PLATAFORMA.sirec.n}
                </div>
              </div>
            </div>
          </div>
        );
      })()}
      <Finish tone="light" />
    </AbsoluteFill>
  );
};
