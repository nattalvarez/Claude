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
  const cRow = [cue(ID, "Activamos los seguros") + 40, cue(ID, "suscripción") - 20, cue(ID, "Con capas")];

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
        exitAt={cRow[0] - 26}
        style={{ position: "absolute", left: 124, top: 380, width: 1480, ...font(60, 500, { color: "#fff", letterSpacing: "-0.032em", lineHeight: 1.2 }) }}
        on="#fff"
        dim="rgba(255,255,255,0.28)"
        accent={[]}
      />

      {/* las tres capas, de una en una: numeral y nombre a la izquierda, epígrafes en rejilla a la derecha */}
      {b.cols.map((col, ri) => {
        const lv = ramp(frame, cRow[ri] - 10, 22, EASE.out) * (1 - (ri < 2 ? ramp(frame, cRow[ri + 1] - 14, 14, EASE.in) : 0));
        if (lv <= 0.002) return null;
        const st = cRow[ri] - 8;
        return (
          <div key={col.n} style={{ position: "absolute", left: 120, top: 330, width: 1680, opacity: clamp(lv * 1.6), transform: `translateY(${(1 - lv) * 30}px)` }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: 420 }}>
              <div style={{ ...font(190, 700, { color: C.magenta, letterSpacing: "-0.06em", lineHeight: 0.9 }) }}>{col.n}</div>
              <div style={{ marginTop: 24, ...font(48, 700, { color: "#fff", letterSpacing: "-0.04em", lineHeight: 1.05 }) }}>{col.t}</div>
              <div style={{ marginTop: 26, height: 3, width: 140 * ramp(frame, st + 4, 24, EASE.inOut), background: C.magenta }} />
            </div>
            <div style={{ position: "absolute", left: 520, top: 4, width: 1160, display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 64, rowGap: 38 }}>
              {col.items.map((it, k) => (
                <BrainItem key={it.h} h={it.h} d={it.d} dark start={st + 12 + k * 9} hSize={34} hWeight={600} dSize={22} />
              ))}
            </div>
          </div>
        );
      })}
      <Finish tone="plum" />
    </AbsoluteFill>
  );
};
