import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, Finish } from "../components/Stage";
import { SilkField } from "../components/SilkField";
import { Chrome } from "../components/Chrome";
import { SyncWords } from "../components/Sync";
import { Eyebrow, font } from "../components/Type";
import { C, EASE } from "../theme";
import { clamp, ramp } from "../lib/anim";
import { cue } from "../lib/tl";
import { PLATAFORMA } from "../data/content";

const ID = "plataforma";

// geometría del esquema
const LX = 120;
const LW = 400;
const HX = 650;
const HW = 640;
const RX = 1420;
const RW = 380;
const TOP = 410;
const ROW = 62;
const HUB_Y = 360;
const HUB_H = 520;
const COLLAPSED = 70;
const EXTRA = 128;

/** Punto de una curva cúbica (para los pulsos que viajan por los conductos). */
const bez = (p0: [number, number], p1: [number, number], p2: [number, number], p3: [number, number], t: number): [number, number] => {
  const u = 1 - t;
  return [
    u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
    u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
  ];
};

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
    return ramp(frame, s - 6, 16, EASE.inOut) * (1 - ramp(frame, e - 6, 16, EASE.inOut));
  };

  const hubP = ramp(frame, cHub - 14, 28, EASE.out);
  const hubCY = HUB_Y + 120;

  // paneles de capas (acordeón): la capa nombrada se abre, las demás se pliegan
  const layerY: number[] = [];
  let acc = HUB_Y + 128;
  const layerH = PLATAFORMA.layers.map((_, i) => {
    layerY.push(acc);
    const h = COLLAPSED + EXTRA * hot(i);
    acc += h + 12;
    return h;
  });

  const sysY = (i: number) => TOP + i * ROW + 26;
  const pulse = (i: number, speed: number, off: number) => (((frame * speed) / 100 + i * off) % 1 + 1) % 1;

  return (
    <AbsoluteFill>
      <Backdrop tone="light" />
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
        style={{ opacity: 0.8, top: -250, WebkitMaskImage: "linear-gradient(90deg, transparent 38%, #000 68%, #000 94%, transparent 100%)", maskImage: "linear-gradient(90deg, transparent 38%, #000 68%, #000 94%, transparent 100%)" }}
      />
      <Chrome chapter="04 · Plataforma" start={2} />

      <div style={{ position: "absolute", left: 120, top: 100, width: 1600, ...font(56, 600, { letterSpacing: "-0.04em", lineHeight: 1.08 }) }}>
        <SyncWords scene={ID} text="Ofrecemos un enfoque de plataforma:" from="Lo hacemos" lead={2} style={{ display: "none" }} />
        <div style={{ opacity: ramp(frame, 8, 22, EASE.out), transform: `translateY(${(1 - ramp(frame, 8, 22, EASE.out)) * 22}px)` }}>{PLATAFORMA.title[0]}</div>
        <div style={{ color: C.magenta, opacity: ramp(frame, 14, 22, EASE.out), transform: `translateY(${(1 - ramp(frame, 14, 22, EASE.out)) * 22}px)` }}>
          {PLATAFORMA.title[1]} {PLATAFORMA.title[2]}
        </div>
      </div>

      {/* conductos animados: sistemas → plataforma → arquitectura objetivo */}
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
        {PLATAFORMA.systems.map((_, i) => {
          const p0: [number, number] = [LX + LW + 6, sysY(i)];
          const p3: [number, number] = [HX - 4, hubCY];
          const p1: [number, number] = [p0[0] + 60, p0[1]];
          const p2: [number, number] = [p3[0] - 60, p3[1]];
          const d = `M${p0[0]},${p0[1]} C${p1[0]},${p1[1]} ${p2[0]},${p2[1]} ${p3[0]},${p3[1]}`;
          const draw = ramp(frame, cSys + 6 + i * 4, 30, EASE.inOut);
          const [x, y] = bez(p0, p1, p2, p3, pulse(i, 1.1, 0.19));
          const on = ramp(frame, cSys + 30 + i * 4, 14);
          return (
            <g key={`l${i}`}>
              <path d={d} fill="none" stroke={C.magenta} strokeOpacity={0.35} strokeWidth={1.6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
              <circle cx={x} cy={y} r={4.5} fill={C.magenta} opacity={on * (0.35 + 0.65 * hubP)} />
            </g>
          );
        })}
        {PLATAFORMA.target.map((_, i) => {
          const p0: [number, number] = [HX + HW + 4, hubCY];
          const p3: [number, number] = [RX - 6, sysY(i)];
          const p1: [number, number] = [p0[0] + 50, p0[1]];
          const p2: [number, number] = [p3[0] - 50, p3[1]];
          const d = `M${p0[0]},${p0[1]} C${p1[0]},${p1[1]} ${p2[0]},${p2[1]} ${p3[0]},${p3[1]}`;
          const draw = ramp(frame, cObj + 4 + i * 4, 30, EASE.inOut);
          const [x, y] = bez(p0, p1, p2, p3, pulse(i, 1.0, 0.17));
          const on = ramp(frame, cObj + 28 + i * 4, 14);
          return (
            <g key={`r${i}`}>
              <path d={d} fill="none" stroke={C.magenta} strokeOpacity={0.35} strokeWidth={1.6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
              <circle cx={x} cy={y} r={4.5} fill={C.magenta} opacity={on} />
            </g>
          );
        })}
      </svg>

      {/* Tus sistemas */}
      <div style={{ position: "absolute", left: LX, top: 360 }}>
        <Eyebrow start={cSys - 8} color={C.ink}>{PLATAFORMA.systemsLabel}</Eyebrow>
      </div>
      {PLATAFORMA.systems.map((s, i) => {
        const p = ramp(frame, cSys - 4 + i * 5, 22, EASE.out);
        return (
          <div
            key={s}
            style={{
              position: "absolute",
              left: LX,
              top: TOP + i * ROW,
              width: LW,
              height: 52,
              borderRadius: 10,
              background: "#EFEEF1",
              display: "flex",
              alignItems: "center",
              paddingLeft: 20,
              ...font(23, 500, { color: C.ink2, letterSpacing: 0 }),
              opacity: clamp(p * 1.5),
              transform: `translateX(${(1 - p) * -50}px)`,
            }}
          >
            {s}
          </div>
        );
      })}

      {/* Plataforma: caja discontinua con el logotipo y las tres capas */}
      <div
        style={{
          position: "absolute",
          left: HX,
          top: HUB_Y,
          width: HW,
          height: HUB_H,
          borderRadius: 24,
          border: `2px dashed ${C.magenta}`,
          background: "rgba(255,255,255,0.55)",
          opacity: hubP,
          transform: `scale(${0.95 + hubP * 0.05})`,
        }}
      />
      <div style={{ position: "absolute", left: HX + 30, top: HUB_Y + 30, opacity: hubP, transform: `translateY(${(1 - hubP) * 16}px)` }}>
        <Img src={staticFile("brand/moderniza.png")} style={{ height: 52, width: "auto", display: "block" }} />
      </div>
      {PLATAFORMA.layers.map((l, i) => {
        const p = ramp(frame, cHub + 6 + i * 9, 26, EASE.out);
        const h = hot(i);
        const bg = i === 1 ? C.magenta : i === 0 ? C.magentaSoft : "#EFEEF1";
        const fg = i === 1 ? "#fff" : C.ink;
        return (
          <div
            key={l.t}
            style={{
              position: "absolute",
              left: HX + 22,
              top: layerY[i],
              width: HW - 44,
              height: layerH[i],
              borderRadius: 14,
              background: bg,
              overflow: "hidden",
              boxShadow: h > 0.01 ? `0 16px 36px rgba(225,3,122,${0.26 * h})` : "none",
              opacity: clamp(p * 1.5),
              transform: `translateX(${(1 - p) * -80}px)`,
              padding: "0 26px",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 18, height: COLLAPSED, paddingTop: 16 }}>
              <span style={{ ...font(34, 600, { color: fg, letterSpacing: "-0.035em" }) }}>{l.t}</span>
              <span style={{ ...font(20, 600, { color: i === 1 ? "rgba(255,255,255,0.88)" : C.magenta, letterSpacing: 0 }) }}>{l.s}</span>
            </div>
            <div style={{ opacity: clamp(h * 1.4), transform: `translateY(${(1 - h) * 10}px)`, ...font(21, 400, { color: i === 1 ? "rgba(255,255,255,0.95)" : C.ink2, letterSpacing: 0, lineHeight: 1.3 }) }}>{l.d}</div>
          </div>
        );
      })}

      {/* Arquitectura objetivo */}
      <div style={{ position: "absolute", left: RX, top: 360 }}>
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
              top: TOP + i * ROW,
              width: RW,
              height: 52,
              borderRadius: 10,
              border: `2px solid ${C.magenta}`,
              background: "#fff",
              display: "flex",
              alignItems: "center",
              paddingLeft: 20,
              ...font(23, 600, { color: C.ink, letterSpacing: 0 }),
              opacity: clamp(p * 1.5),
              transform: `translateX(${(1 - p) * 60}px)`,
            }}
          >
            {s}
          </div>
        );
      })}

      {/* SIREC en su caja */}
      {(() => {
        const p = ramp(frame, cSirec - 10, 28, EASE.out);
        return (
          <div
            style={{
              position: "absolute",
              left: 120,
              top: 912,
              width: 1680,
              height: 118,
              borderRadius: 18,
              border: "2px dashed #2A5FA5",
              background: "rgba(255,255,255,0.82)",
              display: "flex",
              alignItems: "center",
              gap: 34,
              padding: "0 34px",
              opacity: clamp(p * 1.5),
              transform: `translateY(${(1 - p) * 40}px)`,
            }}
          >
            <Img src={staticFile("brand/sirec.png")} style={{ height: 84, width: "auto" }} />
            <div style={{ flex: 1 }}>
              <div style={{ ...font(16, 600, { color: C.mute, letterSpacing: "0.2em", textTransform: "uppercase" }) }}>{PLATAFORMA.sirec.label}</div>
              <div style={{ marginTop: 6, ...font(31, 600, { letterSpacing: "-0.025em" }) }}>{PLATAFORMA.sirec.t}</div>
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
