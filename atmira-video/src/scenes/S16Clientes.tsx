import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, Finish } from "../components/Stage";
import { SilkField } from "../components/SilkField";
import { Chrome } from "../components/Chrome";
import { MaskLine, font } from "../components/Type";
import { C, EASE } from "../theme";
import { clamp, ramp } from "../lib/anim";
import { cue, voiceEnd } from "../lib/tl";
import { CLIENTES, CLIENT_NAMES } from "../data/content";
import manifest from "../../public/clients/manifest.json";

const ID = "clientes";

/** Seis secuencias de logotipos (nunca el mosaico completo a la vez). Los índices son public/clients/cNN.png. */
const GROUPS: number[][] = [
  [10, 16, 64, 63, 9, 57, 37, 73, 18, 4, 7, 8, 5],
  [13, 14, 15, 17, 21, 23, 30, 31, 46, 51, 65, 71, 75, 48],
  [1, 6, 20, 34, 36, 45, 50, 53, 56, 58, 66, 70, 76, 78],
  [11, 12, 22, 32, 26, 39, 47, 49, 52, 61, 67, 68, 72],
  [2, 3, 19, 33, 38, 40, 41, 42, 69, 74, 27, 28, 43],
  [24, 25, 29, 35, 44, 54, 55, 59, 60, 62, 77],
];
const GLEN = 78; // frames por secuencia
const COLS = 5;
const CELLW = 330;
const CELLH = 180;
const BOXW = 262;
const BOXH = 96;
const SCALE = 1.45;

export const S16Clientes: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const end = voiceEnd(ID);
  const t0 = Math.max(end - 24, 64);

  return (
    <AbsoluteFill>
      <Backdrop tone="light" />
      <SilkField
        time={t + 21}
        order={1}
        lines={60}
        seed={91}
        fills={4}
        blurNear={0}
        cam={{ pos: [0, 4.6, -16], target: [0, 5, 0], fov: 36 }}
        alpha={0.3}
        style={{ top: 560 }}
      />
      <Chrome chapter="15 · Clientes" start={2} />
      <div style={{ position: "absolute", left: 120, top: 112, ...font(76, 600, { letterSpacing: "-0.042em" }) }}>
        <MaskLine start={cue(ID, "Relaciones") - 6} dur={28}>
          {CLIENTES.title[0]} <span style={{ color: C.magenta }}>{CLIENTES.title[1]}</span>
        </MaskLine>
      </div>

      {GROUPS.map((g, gi) => {
        const s = t0 + gi * GLEN;
        const out = s + GLEN - 20;
        if (frame < s - 4 || frame > s + GLEN + 40) return null;
        const rows = Math.ceil(g.length / COLS);
        return (
          <div key={gi} style={{ position: "absolute", left: 120, top: 300, width: COLS * CELLW, height: rows * CELLH }}>
            {g.map((n, k) => {
              const e = (manifest as { file: string; w: number; h: number }[])[n - 1];
              const col = k % COLS;
              const row = Math.floor(k / COLS);
              const inP = ramp(frame, s + k * 2.2, 22, EASE.out);
              const outP = ramp(frame, out + k * 1.2, 12, EASE.in);
              const sc = Math.min(BOXW / (e.w * SCALE), BOXH / (e.h * SCALE), 1);
              const w = e.w * SCALE * sc;
              const h = e.h * SCALE * sc;
              return (
                <div
                  key={n}
                  style={{
                    position: "absolute",
                    left: col * CELLW + (CELLW - BOXW) / 2,
                    top: row * CELLH + (CELLH - BOXH) / 2,
                    width: BOXW,
                    height: BOXH,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: clamp(inP * 1.5) * (1 - outP),
                    transform: `translateY(${(1 - inP) * 22 - outP * 16}px) scale(${0.94 + 0.06 * inP})`,
                    filter: `blur(${(1 - inP) * 5}px)`,
                  }}
                >
                  <Img src={staticFile(`clients/${e.file}`)} alt={CLIENT_NAMES[n]} style={{ width: w, height: h }} />
                </div>
              );
            })}
          </div>
        );
      })}

      {/* indicador de secuencia */}
      <div style={{ position: "absolute", left: 120, top: 936, display: "flex", gap: 10 }}>
        {GROUPS.map((_, gi) => {
          const s = t0 + gi * GLEN;
          const a = ramp(frame, s, 14) * (1 - 0.65 * ramp(frame, s + GLEN, 14));
          return <div key={gi} style={{ width: 58, height: 4, borderRadius: 2, background: C.line, overflow: "hidden" }}><div style={{ width: `${ramp(frame, s, GLEN, (x) => x) * 100}%`, height: "100%", background: C.magenta, opacity: 0.4 + 0.6 * a }} /></div>;
        })}
      </div>
      <Finish tone="light" />
    </AbsoluteFill>
  );
};
