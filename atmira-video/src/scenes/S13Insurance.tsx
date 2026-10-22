import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, Finish } from "../components/Stage";
import { SilkField } from "../components/SilkField";
import { Logo } from "../components/Logo";
import { MaskLine, font } from "../components/Type";
import { BrainItem } from "../components/Brain";
import { Karaoke } from "../components/Sync";
import { C, EASE } from "../theme";
import { clamp, ramp } from "../lib/anim";
import { cue } from "../lib/tl";
import { INSURANCE } from "../data/content";

const ID = "insurance";

/** Insurance: misma voz tipográfica que Banking, distinta arquitectura: tres filas (procesos) sobre fondo ciruela. */
export const S13Insurance: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const b = INSURANCE;
  const cTag = cue(ID, "Insurance");
  // La voz va en este orden: presentación → «Primero, el sector: vida y pensiones, generales y salud» →
  // «Después, los ámbitos de negocio: suscripción, siniestros y distribución, con capas normativas…» →
  // «Y por último, tecnología y arquitectura: core asegurador, arquitectura de referencia, APIs y el dato».
  const cSecStart = cue(ID, "Parte del sector");
  const cSeg = [cue(ID, "vida"), cue(ID, "generales"), cue(ID, "salud")];
  const cAmbStart = cue(ID, "Sobre él");
  const cDom = [cue(ID, "suscripción"), cue(ID, "siniestros"), cue(ID, "distribución"), cue(ID, "capas normativas")];
  const cTech = cue(ID, "Y debajo");
  const cTechIt = [cue(ID, "core asegurador"), cue(ID, "arquitectura de referencia"), cue(ID, "APIs"), cue(ID, "dato")];
  const segCol = b.cols[0];
  const domCol = b.cols[1];
  const techCol = b.cols[2];
  const vMain = 1 - ramp(frame, cTech - 12, 20, EASE.in);
  const vTech = ramp(frame, cTech - 4, 24, EASE.out);
  const lit = (i: number, cues: number[], endAt: number) => ramp(frame, cues[i] - 6, 12) * (1 - ramp(frame, (i + 1 < cues.length ? cues[i + 1] : endAt) - 6, 12));

  return (
    <AbsoluteFill>
      <Backdrop tone="plum" />
      <SilkField
        time={t + 8}
        order={0.35 + 0.65 * ramp(frame, 0, 380, EASE.inOut)}
        lines={120}
        seed={61}
        palette="dark"
        fills={10}
        blurNear={2}
        length={24}
        spread={3.8}
        pinchAt={0.7}
        cam={{ pos: [4, 3.2, -14], target: [3.4, 3.6, 0], fov: 38, roll: 0.12 }}
        alpha={0.6}
        style={{ top: -330, WebkitMaskImage: "linear-gradient(180deg, #000 0%, #000 24%, transparent 34%)", maskImage: "linear-gradient(180deg, #000 0%, #000 24%, transparent 34%)" }}
      />

      <div style={{ position: "absolute", left: 120, top: 62 }}>
        <Logo width={168} tone="white" />
      </div>
      <div style={{ position: "absolute", left: 120, top: 128, display: "flex", gap: 30, alignItems: "baseline" }}>
        <MaskLine start={cTag - 10} dur={26} style={font(92, 700, { color: "#FF4DA6", letterSpacing: "-0.045em" })}>
          {b.accent}
        </MaskLine>
        <MaskLine start={cTag - 4} dur={26} style={font(92, 700, { color: "#fff", letterSpacing: "-0.045em" })}>
          {b.name}
        </MaskLine>
      </div>
      <div style={{ position: "absolute", left: 124, top: 236, ...font(30, 400, { color: "rgba(255,255,255,0.85)", letterSpacing: "-0.012em", opacity: ramp(frame, cTag + 6, 26) }) }}>{b.tagline}</div>

      <Karaoke
        scene={ID}
        text={b.intro ?? ""}
        from="Activamos"
        appear={cTag + 24}
        exitAt={cSecStart - 26}
        style={{ position: "absolute", left: 124, top: 380, width: 1480, ...font(60, 500, { color: "#fff", letterSpacing: "-0.032em", lineHeight: 1.2 }) }}
        on="#FFFFFF"
        dim="#6A4B5E"
        accent={[]}
      />

      {vMain > 0.002 && (
        <div style={{ position: "absolute", left: 120, top: 0, width: 1680, height: 1080, opacity: clamp(vMain * 1.6) }}>
          {/* 01 · Sector: lo primero que dice la voz */}
          <div style={{ position: "absolute", left: 0, top: 304, width: 1680, opacity: clamp(ramp(frame, cSecStart - 10, 20) * 1.5), transform: `translateY(${(1 - ramp(frame, cSecStart - 10, 24, EASE.out)) * 24}px)` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18, ...font(20, 700, { color: C.magenta, letterSpacing: "0.18em", textTransform: "uppercase" }) }}>
              <span>01</span>
              <span style={{ color: "#fff" }}>{segCol.t}</span>
              <span style={{ height: 2, width: 420 * ramp(frame, cSecStart, 30, EASE.inOut), background: "rgba(255,255,255,0.25)" }} />
            </div>
            <div style={{ marginTop: 18, display: "flex", gap: 40 }}>
              {segCol.items.map((it, k) => {
                const p = ramp(frame, cSeg[k] - 10, 22, EASE.out);
                const l = lit(k, cSeg, cAmbStart);
                return (
                  <div key={it.h} style={{ width: 520, position: "relative", paddingLeft: 24, opacity: clamp(p * 1.5) * (0.62 + 0.38 * Math.max(l, ramp(frame, cAmbStart - 6, 12) * 0.2)), transform: `translateY(${(1 - p) * 18}px)` }}>
                    <div style={{ position: "absolute", left: 0, top: 4, width: 4, height: 128 * p, background: C.magenta, opacity: 0.35 + 0.65 * l }} />
                    <div style={{ ...font(34, 600, { color: "#FF4DA6", letterSpacing: "-0.028em", lineHeight: 1.1 }) }}>{it.h}</div>
                    <div style={{ marginTop: 6, ...font(19, 400, { color: "rgba(255,255,255,0.88)", letterSpacing: 0, lineHeight: 1.32 }) }}>{it.d}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 02 · Ámbitos de negocio: después */}
          <div style={{ position: "absolute", left: 0, top: 600, width: 1680, opacity: clamp(ramp(frame, cAmbStart - 10, 20) * 1.5), transform: `translateY(${(1 - ramp(frame, cAmbStart - 10, 24, EASE.out)) * 24}px)` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18, ...font(20, 700, { color: C.magenta, letterSpacing: "0.18em", textTransform: "uppercase" }) }}>
              <span>02</span>
              <span style={{ color: "#fff" }}>{domCol.t}</span>
              <span style={{ height: 2, width: 420 * ramp(frame, cAmbStart, 30, EASE.inOut), background: "rgba(255,255,255,0.25)" }} />
            </div>
            <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 70, rowGap: 22 }}>
              {domCol.items.map((it, k) => {
                const p = ramp(frame, cDom[k] - 10, 22, EASE.out);
                const l = lit(k, cDom, cTech);
                return (
                  <div key={it.h} style={{ position: "relative", paddingLeft: 24, opacity: clamp(p * 1.5) * (0.62 + 0.38 * Math.max(l, k === 3 ? 1 : 0)), transform: `translateX(${(1 - p) * -24}px)` }}>
                    <div style={{ position: "absolute", left: 0, top: 4, width: 4, height: 96 * p, background: C.magenta, opacity: 0.35 + 0.65 * l }} />
                    <div style={{ ...font(32, 600, { color: "#FF4DA6", letterSpacing: "-0.028em", lineHeight: 1.1 }) }}>{it.h}</div>
                    <div style={{ marginTop: 5, ...font(19, 400, { color: "rgba(255,255,255,0.9)", letterSpacing: 0, lineHeight: 1.3 }) }}>{it.d}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 03 · Tecnología y arquitectura: por último */}
      {vTech > 0.002 && (
        <div style={{ position: "absolute", left: 120, top: 330, width: 1680, opacity: clamp(vTech * 1.6), transform: `translateY(${(1 - vTech) * 30}px)` }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 420 }}>
            <div style={{ ...font(190, 700, { color: C.magenta, letterSpacing: "-0.06em", lineHeight: 0.9 }) }}>{techCol.n}</div>
            <div style={{ marginTop: 24, ...font(48, 700, { color: "#fff", letterSpacing: "-0.04em", lineHeight: 1.05 }) }}>{techCol.t}</div>
            <div style={{ marginTop: 26, height: 3, width: 140 * ramp(frame, cTech, 24, EASE.inOut), background: C.magenta }} />
          </div>
          <div style={{ position: "absolute", left: 520, top: 4, width: 1160, display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 64, rowGap: 38 }}>
            {techCol.items.map((it, k) => (
              <BrainItem key={it.h} h={it.h} d={it.d} dark start={cTechIt[k] - 8} hSize={34} hWeight={600} dSize={22} />
            ))}
          </div>
        </div>
      )}
      <Finish tone="plum" />
    </AbsoluteFill>
  );
};
