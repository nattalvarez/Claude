import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, Finish } from "../components/Stage";
import { SilkField } from "../components/SilkField";
import { Chrome } from "../components/Chrome";
import { SyncWords } from "../components/Sync";
import { font } from "../components/Type";
import { C, EASE } from "../theme";
import { clamp, ramp } from "../lib/anim";
import { cue } from "../lib/tl";
import { QUIEN } from "../data/content";

const ID = "quien";
const CW = 322;
const CX = (i: number) => 480 + i * (CW + 14);

const Lane: React.FC<{ lane: typeof QUIEN.business; tone: "biz" | "tech"; show: number; hide: number }> = ({ lane, tone, show, hide }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, show, 26, EASE.out);
  const q = ramp(frame, hide, 18, EASE.in);
  const bg = tone === "biz" ? "#FBE3EF" : "#E4E3E8";
  const dot = tone === "biz" ? C.magenta : C.ink;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: clamp(p * 1.4) * (1 - q), transform: `translateX(${(1 - p) * 80 - q * 90}px)` }}>
      <div style={{ position: "absolute", left: 120, top: 396, width: 1680, height: 452, borderRadius: 24, background: bg }} />
      <div style={{ position: "absolute", left: 156, top: 430, width: 280 }}>
        <div style={{ ...font(40, 400, { letterSpacing: "-0.03em", lineHeight: 1.1 }) }}>{lane.t}</div>
        <div style={{ marginTop: 18, ...font(22, 400, { color: C.ink2, letterSpacing: 0, lineHeight: 1.36 }) }}>{lane.d}</div>
      </div>
      {lane.cells.map(([h, d], idx) => {
        const row = Math.floor(idx / 4);
        const col = idx % 4;
        const k = ramp(frame, show + 8 + idx * 4, 22, EASE.out);
        return (
          <div
            key={h}
            style={{
              position: "absolute",
              left: CX(col),
              top: 420 + row * 204,
              width: CW,
              height: 190,
              borderRadius: 12,
              background: "#fff",
              boxShadow: "0 8px 22px rgba(40,20,40,0.07)",
              padding: "20px 22px",
              opacity: clamp(k * 1.5),
              transform: `translateY(${(1 - k) * 22}px)`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 12, height: 12, borderRadius: 6, background: dot, flex: "none" }} />
              <span style={{ ...font(24, 500, { letterSpacing: "-0.02em", lineHeight: 1.1 }) }}>{h}</span>
            </div>
            <div style={{ marginTop: 12, ...font(20, 400, { color: C.ink2, letterSpacing: 0, lineHeight: 1.32 }) }}>{d}</div>
          </div>
        );
      })}
    </div>
  );
};

export const S09Quien: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const cNeg = cue(ID, "familias");
  const cTec = cue(ID, "Los agentes proponen");
  const cProp = cue(ID, "Las personas deciden");
  const cPh = [cue(ID, "Analiza"), cue(ID, "Decide"), cue(ID, "Construye"), cue(ID, "Opera")];

  return (
    <AbsoluteFill>
      <Backdrop tone="light" />
      <SilkField
        time={t + 11}
        order={1}
        lines={56}
        seed={23}
        fills={4}
        blurNear={0}
        cam={{ pos: [3, 3.8, -16], target: [2, 4.2, 0], fov: 36, roll: -0.04 }}
        alpha={0.36}
        style={{ top: 600 }}
      />
      <Chrome chapter="08 · Agent Factory · quién" start={2} />
      <div style={{ position: "absolute", left: 120, top: 96, width: 1500, ...font(62, 400, { letterSpacing: "-0.04em", lineHeight: 1.04 }) }}>
        <SyncWords scene={ID} text="Quién acelera: agentes expertos en cada fase" from="quién acelera" accent={[2, 3, 4, 5, 6]} lead={3} dur={16} />
      </div>
      <div style={{ position: "absolute", left: 120, top: 186, width: 1500, opacity: ramp(frame, 20, 24), ...font(25, 400, { color: C.ink2, letterSpacing: 0, lineHeight: 1.36 }) }}>
        {QUIEN.lead}
      </div>

      {/* eje de fases */}
      <div style={{ position: "absolute", left: 480, top: 325, width: 1330, height: 3, background: C.magenta, transformOrigin: "left", transform: `scaleX(${ramp(frame, 20, 40, EASE.inOut)})` }} />
      {QUIEN.phases.map((ph, i) => {
        const p = ramp(frame, 26 + i * 5, 22, EASE.out);
        return (
          <div key={ph.t} style={{ position: "absolute", left: CX(i), top: 250, opacity: clamp(p * 1.5), transform: `translateY(${(1 - p) * 14}px)` }}>
            <div style={{ ...font(32, 500, { letterSpacing: "-0.025em" }) }}>{ph.t}</div>
            <div style={{ position: "absolute", left: -2, top: 66, width: 20, height: 20, borderRadius: 10, background: "#fff", border: `3px solid ${C.magenta}` }} />
            <div style={{ position: "absolute", left: 30, top: 92, whiteSpace: "nowrap", ...font(19, 500, { color: C.magenta, letterSpacing: 0 }) }}>{ph.d}</div>
          </div>
        );
      })}

      <Lane lane={QUIEN.business} tone="biz" show={cNeg - 6} hide={cTec - 4} />
      <Lane lane={QUIEN.tech} tone="tech" show={cTec - 2} hide={9999} />

      {(() => {
        const p = ramp(frame, cProp - 8, 26, EASE.out);
        return (
          <div style={{ position: "absolute", left: 120, top: 902, width: 1680, display: "flex", alignItems: "baseline", gap: 26, opacity: clamp(p * 1.5), transform: `translateY(${(1 - p) * 22}px)` }}>
            <span style={{ ...font(32, 600, { color: C.magenta, letterSpacing: "-0.02em", whiteSpace: "nowrap" }) }}>{QUIEN.hitl.l}</span>
            <span style={{ ...font(27, 400, { color: C.ink, letterSpacing: "-0.01em", lineHeight: 1.28 }) }}>{QUIEN.hitl.d}</span>
          </div>
        );
      })()}
      <Finish tone="light" />
    </AbsoluteFill>
  );
};
