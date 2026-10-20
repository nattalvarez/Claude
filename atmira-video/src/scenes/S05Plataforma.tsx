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

      <div style={{ position: "absolute", left: 120, top: 118, width: 1500, ...font(50, 400, { letterSpacing: "-0.03em", lineHeight: 1.06 }) }}>
        <SyncWords scene={ID} text="Ofrecemos un enfoque de plataforma:" from="Lo hacemos" lead={2} style={{ display: "none" }} />
        {PLATAFORMA.title.map((l, i) => (
          <div key={i} style={{ color: i === 0 ? C.ink : C.magenta, opacity: ramp(frame, 8 + i * 6, 22, EASE.out), transform: `translateY(${(1 - ramp(frame, 8 + i * 6, 22, EASE.out)) * 22}px)` }}>
            {l}
          </div>
        ))}
      </div>

      {/* Tus sistemas */}
      <div style={{ position: "absolute", left: LX, top: 392 }}>
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
              top: 442 + i * 66,
              width: 410,
              height: 52,
              borderRadius: 10,
              background: "#EFEEF1",
              display: "flex",
              alignItems: "center",
              paddingLeft: 22,
              ...font(23, 400, { color: C.ink2, letterSpacing: 0 }),
              opacity: clamp(p * 1.5),
              transform: `translateX(${(1 - p) * -40}px)`,
            }}
          >
            {s}
          </div>
        );
      })}

      {/* ModernIzA */}
      <div style={{ position: "absolute", left: CX, top: 388, opacity: hubP }}>
        <span style={{ ...font(30, 800, { letterSpacing: "-0.02em" }) }}>
          Modern<span style={{ color: C.magenta }}>Iz</span>A
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          left: CX - 14,
          top: 430,
          width: 746,
          height: 468,
          borderRadius: 22,
          border: `2px dashed ${C.magenta}`,
          opacity: hubP * 0.9,
          transform: `scale(${0.96 + hubP * 0.04})`,
        }}
      />
      {PLATAFORMA.layers.map((l, i) => {
        const p = ramp(frame, cL[i] - 8, 24, EASE.out);
        const h = hot(i);
        const bg = i === 1 ? C.magenta : i === 0 ? C.magentaSoft : "#EFEEF1";
        const fg = i === 1 ? "#fff" : C.ink;
        return (
          <div
            key={l.t}
            style={{
              position: "absolute",
              left: CX,
              top: 444 + i * 150,
              width: 718,
              height: 140,
              borderRadius: 14,
              background: bg,
              boxShadow: h > 0.01 ? `0 18px 40px rgba(225,3,122,${0.25 * h})` : "none",
              transform: `translateY(${(1 - p) * 26}px) scale(${1 + h * 0.012})`,
              opacity: clamp(p * 1.5) * (0.62 + 0.38 * Math.max(h, p > 0.99 && frame > cL[2] + 150 ? 1 : h)),
              display: "flex",
              alignItems: "center",
              padding: "0 26px",
              gap: 26,
            }}
          >
            <div style={{ width: 262, flex: "none" }}>
              <div style={{ ...font(34, 500, { color: fg, letterSpacing: "-0.03em" }) }}>{l.t}</div>
              <div style={{ marginTop: 8, ...font(21, 500, { color: i === 1 ? "rgba(255,255,255,0.85)" : C.magenta, letterSpacing: 0, lineHeight: 1.2 }) }}>{l.s}</div>
            </div>
            <div style={{ ...font(20, 400, { color: i === 1 ? "rgba(255,255,255,0.95)" : C.ink2, letterSpacing: 0, lineHeight: 1.3 }) }}>{l.d}</div>
          </div>
        );
      })}

      {/* Arquitectura objetivo */}
      <div style={{ position: "absolute", left: RX, top: 392 }}>
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
              top: 442 + i * 66,
              width: 400,
              height: 52,
              borderRadius: 10,
              border: `2px solid ${C.magenta}`,
              background: "#fff",
              display: "flex",
              alignItems: "center",
              paddingLeft: 22,
              ...font(23, 500, { color: C.ink, letterSpacing: 0 }),
              opacity: clamp(p * 1.5),
              transform: `translateX(${(1 - p) * 40}px)`,
            }}
          >
            {s}
          </div>
        );
      })}

      {/* SIREC */}
      {(() => {
        const p = ramp(frame, cSirec - 10, 26, EASE.out);
        return (
          <div
            style={{
              position: "absolute",
              left: 120,
              top: 922,
              width: 1680,
              height: 110,
              borderRadius: 16,
              border: "2px dashed #2AB5C8",
              background: "rgba(255,255,255,0.8)",
              display: "flex",
              alignItems: "center",
              gap: 30,
              padding: "0 30px",
              opacity: clamp(p * 1.5),
              transform: `translateY(${(1 - p) * 30}px)`,
            }}
          >
            <Img src={staticFile("brand/sirec.png")} style={{ height: 78, width: "auto", mixBlendMode: "multiply" }} />
            <div style={{ flex: 1 }}>
              <div style={{ ...font(16, 600, { color: C.mute, letterSpacing: "0.2em", textTransform: "uppercase" }) }}>{PLATAFORMA.sirec.label}</div>
              <div style={{ marginTop: 6, ...font(31, 500, { letterSpacing: "-0.02em" }) }}>{PLATAFORMA.sirec.t}</div>
              <div style={{ marginTop: 4, ...font(21, 400, { color: C.ink2, letterSpacing: 0 }) }}>
                {PLATAFORMA.sirec.d} {PLATAFORMA.sirec.n}
              </div>
            </div>
          </div>
        );
      })()}
      <Finish tone="light" />
    </AbsoluteFill>
  );
};
