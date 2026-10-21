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
  // La voz va así: «…del core a la suscripción, los siniestros y la distribución, en vida, generales y salud.
  // Con capas normativas y de país… sobre el core asegurador.» La pantalla sigue ese mismo orden.
  const cCore = cue(ID, "del core");
  const cDom = [cue(ID, "suscripción"), cue(ID, "siniestros"), cue(ID, "distribución"), cue(ID, "Con capas")];
  const cSeg = [cue(ID, "vida"), cue(ID, "generales"), cue(ID, "salud")];
  const cTech = cue(ID, "sobre el core");
  const domCol = b.cols[1];
  const segCol = b.cols[0];
  const techCol = b.cols[2];
  const vMain = ramp(frame, cCore - 12, 22, EASE.out) * (1 - ramp(frame, cTech - 10, 18, EASE.in));
  const vTech = ramp(frame, cTech - 4, 24, EASE.out);
  const lit = (i: number, cues: number[]) => ramp(frame, cues[i] - 6, 12) * (1 - (i + 1 < cues.length ? ramp(frame, cues[i + 1] - 6, 12) : 0));

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
        exitAt={cCore - 30}
        style={{ position: "absolute", left: 124, top: 380, width: 1480, ...font(60, 500, { color: "#fff", letterSpacing: "-0.032em", lineHeight: 1.2 }) }}
        on="#FFFFFF"
        dim="#6A4B5E"
        accent={[]}
      />

      {/* 02 · Dominios de negocio, en el orden en que la voz los nombra */}
      {vMain > 0.002 && (
        <div style={{ position: "absolute", left: 120, top: 300, width: 1680, opacity: clamp(vMain * 1.6), transform: `translateY(${(1 - vMain) * 26}px)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, ...font(20, 700, { color: C.magenta, letterSpacing: "0.18em", textTransform: "uppercase" }) }}>
            <span>02</span>
            <span style={{ color: "#fff" }}>{domCol.t}</span>
            <span style={{ height: 2, width: 420, background: "rgba(255,255,255,0.25)" }} />
          </div>
          <div style={{ position: "relative", marginTop: 26, display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 80, rowGap: 34 }}>
            {domCol.items.map((it, k) => {
              const p = ramp(frame, cDom[k] - 10, 24, EASE.out);
              const l = lit(k, cDom);
              return (
                <div key={it.h} style={{ position: "relative", paddingLeft: 26, opacity: clamp(p * 1.5) * (0.62 + 0.38 * Math.max(l, k === 3 ? 1 : 0)), transform: `translateX(${(1 - p) * -30}px)` }}>
                  <div style={{ position: "absolute", left: 0, top: 4, width: 4, height: 168 * p, background: C.magenta, opacity: 0.35 + 0.65 * l }} />
                  <div style={{ ...font(38, 600, { color: "#FF4DA6", letterSpacing: "-0.03em", lineHeight: 1.12 }) }}>{it.h}</div>
                  <div style={{ marginTop: 8, ...font(22, 400, { color: "rgba(255,255,255,0.9)", letterSpacing: 0, lineHeight: 1.34 }) }}>{it.d}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 01 · Segmento de negocio: aparece cuando la voz dice «en vida, generales y salud» */}
      {vMain > 0.002 && (
        <div style={{ position: "absolute", left: 120, top: 806, width: 1680, opacity: clamp(vMain * 1.6) }}>
          <div style={{ position: "absolute", left: 0, top: 0, height: 2, width: 1680 * ramp(frame, cSeg[0] - 20, 40, EASE.inOut), background: "rgba(255,255,255,0.25)" }} />
          <div style={{ position: "absolute", left: 0, top: 22, width: 260, ...font(20, 700, { color: C.magenta, letterSpacing: "0.18em", textTransform: "uppercase", opacity: ramp(frame, cSeg[0] - 18, 20) }) }}>
            01 <span style={{ color: "#fff" }}>{segCol.t}</span>
          </div>
          <div style={{ position: "absolute", left: 280, top: 18, display: "flex", gap: 40 }}>
            {segCol.items.map((it, k) => {
              const p = ramp(frame, cSeg[k] - 10, 22, EASE.out);
              const l = lit(k, [...cSeg, cDom[3]]);
              return (
                <div key={it.h} style={{ width: 420, opacity: clamp(p * 1.5) * (0.62 + 0.38 * l), transform: `translateY(${(1 - p) * 16}px)` }}>
                  <div style={{ ...font(30, 600, { color: "#FF4DA6", letterSpacing: "-0.025em", lineHeight: 1.1 }) }}>{it.h}</div>
                  <div style={{ marginTop: 6, ...font(18, 400, { color: "rgba(255,255,255,0.86)", letterSpacing: 0, lineHeight: 1.3 }) }}>{it.d}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 03 · Tecnología y arquitectura: «…sobre el core asegurador» */}
      {vTech > 0.002 && (
        <div style={{ position: "absolute", left: 120, top: 330, width: 1680, opacity: clamp(vTech * 1.6), transform: `translateY(${(1 - vTech) * 30}px)` }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 420 }}>
            <div style={{ ...font(190, 700, { color: C.magenta, letterSpacing: "-0.06em", lineHeight: 0.9 }) }}>{techCol.n}</div>
            <div style={{ marginTop: 24, ...font(48, 700, { color: "#fff", letterSpacing: "-0.04em", lineHeight: 1.05 }) }}>{techCol.t}</div>
            <div style={{ marginTop: 26, height: 3, width: 140 * ramp(frame, cTech, 24, EASE.inOut), background: C.magenta }} />
          </div>
          <div style={{ position: "absolute", left: 520, top: 4, width: 1160, display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 64, rowGap: 38 }}>
            {techCol.items.map((it, k) => (
              <BrainItem key={it.h} h={it.h} d={it.d} dark start={cTech + 6 + k * 9} hSize={34} hWeight={600} dSize={22} />
            ))}
          </div>
        </div>
      )}
      <Finish tone="plum" />
    </AbsoluteFill>
  );
};
