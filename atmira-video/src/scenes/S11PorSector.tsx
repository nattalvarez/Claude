import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Finish } from "../components/Stage";
import { FootageSeq, StockVideo } from "../components/Stock";
import { Chrome } from "../components/Chrome";
import { SyncWords } from "../components/Sync";
import { Rule, font } from "../components/Type";
import { C, EASE } from "../theme";
import { clamp, ramp } from "../lib/anim";
import { cue } from "../lib/tl";
import { POR_SECTOR } from "../data/content";

const ID = "porsector";

/** Tres cerebros, tres colores: carbón, magenta pleno en el centro y blanco. */
const TILE = [
  { bg: "#17171B", name: C.magenta, fg: "#FFFFFF", tag: "#FF4DA6", photo: "tile_banking" as const, wash: 0 },
  { bg: C.magenta, name: "#FFFFFF", fg: "#FFFFFF", tag: "#FFFFFF", photo: "tile_insurance" as const, wash: 0 },
  { bg: "#FFFFFF", name: C.magenta, fg: C.ink, tag: C.magenta, photo: "tile_smart" as const, wash: 0.25 },
];

export const S11PorSector: React.FC = () => {
  const frame = useCurrentFrame();

  const cThree = [cue(ID, "del sector"), cue(ID, "ámbitos de negocio"), cue(ID, "la tecnología")];
  const cMarco = cue(ID, "Un marco");
  const cT = [cue(ID, "Banking"), cue(ID, "Insurance"), cue(ID, "Smart")];

  const phase2 = ramp(frame, cMarco - 6, 26, EASE.inOut);
  const cTile = [cMarco + 6, cMarco + 20, cMarco + 34];

  return (
    <AbsoluteFill style={{ background: "#0b0a12" }}>
      <FootageSeq
        opacity={1 - phase2}
        shots={[
          { name: "sector", from: 0, rate: 0.6, panX: -80, drift: 1.16 },
          { name: "night2", from: cThree[1] - 10, rate: 0.7, panX: 70, panY: -30, drift: 1.16, brightness: 1.0 },
        ]}
        veil={0.3}
        vignette={0.5}
      />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(12,12,15,0.72) 0%, rgba(12,12,15,0.4) 100%)", opacity: 1 - phase2 }} />
      <Chrome chapter="10 · Un Digital Brain por sector" start={2} tone="dark" />

      <div style={{ opacity: 1 - phase2, transform: `translateY(${-phase2 * 40}px)` }}>
        <div style={{ position: "absolute", left: 120, top: 128, ...font(112, 700, { color: "#FFFFFF", letterSpacing: "-0.05em" }) }}>
          <SyncWords scene={ID} text="Un Digital Brain por sector" from="Un Digital Brain" accent={[3, 4]} lead={3} dur={16} />
        </div>
        {POR_SECTOR.threes.map((s, i) => {
          const st = cThree[i] - 8;
          const p = ramp(frame, st, 26, EASE.out);
          const next = i < 2 ? ramp(frame, cThree[i + 1] - 10, 18) : 0;
          const x = 120 + i * 580;
          return (
            <div key={s.n} style={{ position: "absolute", left: x, top: 540, width: 520, opacity: clamp(p * 1.5) * (1 - 0.4 * next), transform: `translateY(${(1 - p) * 40}px)` }}>
              <Rule start={st + 8} width={520} color={C.magenta} thickness={6} />
              <div style={{ marginTop: 30, ...font(72, 700, { color: "#FFFFFF", letterSpacing: "-0.04em", lineHeight: 1.06 }) }}>{s.t}</div>
              <div style={{ marginTop: 16, ...font(32, 400, { color: "#E3E2EA", letterSpacing: "-0.005em" }) }}>{s.d}</div>
            </div>
          );
        })}
      </div>

      {/* Un marco, diferentes cerebros: tres piezas, tres colores */}
      <div style={{ position: "absolute", left: 120, top: 80, zIndex: 5, opacity: phase2, transform: `translateY(${(1 - phase2) * 30}px)`, padding: "14px 28px", borderRadius: 40, background: "rgba(10,10,14,0.72)", ...font(26, 600, { color: "#FFFFFF", letterSpacing: "0.16em", textTransform: "uppercase" }) }}>
        {POR_SECTOR.frame}
      </div>
      {POR_SECTOR.brains.map((b, i) => {
        const tl = TILE[i];
        const p = ramp(frame, cTile[i], 30, EASE.out);
        const hot = ramp(frame, cT[i] - 4, 12) * (1 - (i < 2 ? ramp(frame, cT[i + 1] - 4, 12) : 0));
        return (
          <div key={b.a} style={{ position: "absolute", left: i * 640, top: 0, width: 640, height: 1080, overflow: "hidden", background: tl.bg, clipPath: `inset(${(1 - p) * 100}% 0 0 0)` }}>
            {/* foto del sector en la mitad superior, teñida con el color de la pieza */}
            <div style={{ position: "absolute", left: 0, top: 0, width: 640, height: 620, overflow: "hidden" }}>
              <div style={{ position: "absolute", left: -360, top: 0, width: 1920, height: 1080 }}>
                <StockVideo name={tl.photo} rate={0.8} brightness={0.9} veil={i === 0 ? 0.25 : 0} vignette={0} wash={tl.wash} drift={1.14} driftFrames={500} panX={i === 1 ? -50 : 50} />
              </div>
              {i === 1 && <div style={{ position: "absolute", inset: 0, background: C.magenta, mixBlendMode: "multiply" }} />}
              <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, transparent 45%, ${tl.bg} 100%)` }} />
            </div>
            <div style={{ position: "absolute", left: 84, right: 40, bottom: 92, transform: `translateY(${(1 - hot) * 0}px)` }}>
              <div style={{ ...font(92, 700, { color: tl.name, letterSpacing: "-0.05em", lineHeight: 1 }) }}>{b.a}</div>
              <div style={{ ...font(92, 700, { color: tl.fg, letterSpacing: "-0.05em", lineHeight: 1.02 }) }}>Digital Brain</div>
              <div style={{ marginTop: 22, width: 90 + 160 * hot, height: 6, background: tl.tag, borderRadius: 3 }} />
              <div style={{ marginTop: 22, ...font(30, 500, { color: tl.tag, letterSpacing: "-0.005em", lineHeight: 1.25 }) }}>{b.t}</div>
            </div>
          </div>
        );
      })}
      <Finish tone="dark" />
    </AbsoluteFill>
  );
};
