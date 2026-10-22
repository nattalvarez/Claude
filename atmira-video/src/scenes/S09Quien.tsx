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
const CW = 338;
const CX = (i: number) => 392 + i * (CW + 10);
const LANE_H = 190;

/** Un carril (negocio o tecnología) en su caja; los dos conviven en pantalla. */
const Lane: React.FC<{ lane: typeof QUIEN.business; tone: "biz" | "tech"; top: number; show: number }> = ({ lane, tone, top, show }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, show, 26, EASE.out);
  const bg = tone === "biz" ? "#FBE3EF" : "#E4E3E8";
  const dot = tone === "biz" ? C.magenta : C.ink;
  return (
    <div style={{ position: "absolute", left: 0, top, width: 1920, height: LANE_H, opacity: clamp(p * 1.4), transform: `translateX(${(tone === "biz" ? -1 : 1) * (1 - p) * 90}px)` }}>
      <div style={{ position: "absolute", left: 120, top: 0, width: 1680, height: LANE_H, borderRadius: 22, background: bg }} />
      <div style={{ position: "absolute", left: 152, top: 26, width: 210 }}>
        <div style={{ ...font(36, 700, { letterSpacing: "-0.035em", lineHeight: 1.08, color: tone === "biz" ? C.magenta : C.ink }) }}>{lane.t}</div>
      </div>
      {lane.cells.slice(0, 4).map(([h], idx) => {
        const row = Math.floor(idx / 4);
        const col = idx % 4;
        const k = ramp(frame, show + 8 + idx * 4, 22, EASE.out);
        return (
          <div
            key={h}
            style={{
              position: "absolute",
              left: CX(col),
              top: 30,
              width: CW,
              height: 130,
              borderRadius: 10,
              background: "#fff",
              boxShadow: "0 6px 16px rgba(40,20,40,0.07)",
              padding: "0 22px",
              display: "flex",
              alignItems: "center",
              opacity: clamp(k * 1.5),
              transform: `translateY(${(1 - k) * 20}px)`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ width: 10, height: 10, borderRadius: 5, background: dot, flex: "none" }} />
              <span style={{ ...font(32, 600, { letterSpacing: "-0.03em", lineHeight: 1.08 }) }}>{h}</span>
            </div>
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
  const cTec = cue(ID, "tecnología");
  const cProp = cue(ID, "Las personas deciden");

  return (
    <AbsoluteFill>
      <Backdrop tone="light" />
      <SilkField
        time={t + 11}
        order={1}
        lines={50}
        seed={23}
        fills={3}
        blurNear={0}
        cam={{ pos: [3, 3.8, -16], target: [2, 4.2, 0], fov: 36, roll: -0.04 }}
        alpha={0.3}
        style={{ top: 700 }}
      />
      <Chrome chapter="08 · Agent Factory · quién" start={2} />
      <div style={{ position: "absolute", left: 120, top: 84, width: 1500, ...font(64, 600, { letterSpacing: "-0.045em", lineHeight: 1.04 }) }}>
        <SyncWords scene={ID} text="Quién acelera: agentes expertos en cada fase" from="quién acelera" accent={[2, 3, 4, 5, 6]} lead={3} dur={16} />
      </div>

      {/* eje de fases */}
      <div style={{ position: "absolute", left: CX(0), top: 232, width: 4 * CW + 30, height: 3, background: C.magenta, transformOrigin: "left", transform: `scaleX(${ramp(frame, 20, 40, EASE.inOut)})` }} />
      {QUIEN.phases.map((ph, i) => {
        const p = ramp(frame, 26 + i * 5, 22, EASE.out);
        return (
          <div key={ph.t} style={{ position: "absolute", left: CX(i), top: 178, opacity: clamp(p * 1.5), transform: `translateY(${(1 - p) * 14}px)` }}>
            <div style={{ ...font(36, 600, { letterSpacing: "-0.03em" }) }}>{ph.t}</div>
            <div style={{ position: "absolute", left: -2, top: 44, width: 18, height: 18, borderRadius: 9, background: "#fff", border: `3px solid ${C.magenta}` }} />
          </div>
        );
      })}

      <Lane lane={QUIEN.business} tone="biz" top={330} show={cNeg - 6} />
      <Lane lane={QUIEN.tech} tone="tech" top={560} show={cTec - 4} />

      {(() => {
        const p = ramp(frame, cProp - 8, 26, EASE.out);
        return (
          <div style={{ position: "absolute", left: 120, top: 836, width: 1680, display: "flex", alignItems: "baseline", gap: 24, opacity: clamp(p * 1.5), transform: `translateY(${(1 - p) * 22}px)` }}>
            <span style={{ ...font(40, 700, { color: C.magenta, letterSpacing: "-0.03em", whiteSpace: "nowrap" }) }}>{QUIEN.hitl.l}</span>
            <span style={{ ...font(40, 400, { color: C.ink, letterSpacing: "-0.03em", lineHeight: 1.1 }) }}>las personas deciden en cada punto de aprobación.</span>
          </div>
        );
      })()}
      <Finish tone="light" />
    </AbsoluteFill>
  );
};
