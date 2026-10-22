import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, Finish } from "../components/Stage";
import { StockVideo } from "../components/Stock";
import { SilkField } from "../components/SilkField";
import { Logo, LOGO_RATIO } from "../components/Logo";
import { SyncWords } from "../components/Sync";
import { font } from "../components/Type";
import { C, EASE, H, W } from "../theme";
import { clamp, hash, ramp } from "../lib/anim";
import { cue, cueEnd } from "../lib/tl";
import { CIERRE } from "../data/content";

/**
 * CIERRE CINEMATOGRÁFICO
 * A  acumulación: planos y hilos de las escenas anteriores convergen en perspectiva.
 * B  mensaje: aparece, palabra a palabra, con la voz.
 * C  clímax: los hilos convergen en un haz de luz horizontal que se abre como una rendija y revela el magenta de marca;
 *    después un barrido diagonal de filo luminoso deja paso al blanco. Todo con bordes limpios (nada de manchas orgánicas).
 *    El logotipo se revela sobre el propio magenta (blanco sobre magenta → magenta sobre blanco).
 * D  firma: el logotipo oficial queda centrado, sin adornos.
 * E  pausa: el movimiento se calma y el mensaje permanece.
 */
const ID = "cierre";
const CX = 960;
const CY = 436;

const SK = 150; // inclinación (px) del filo del barrido

type PlaneSpec = {
  w: number;
  h: number;
  from: [number, number, number, number, number, number]; // x y z rotX rotY rotZ
  to: [number, number, number, number, number, number];
  delay: number;
  kind: "magenta" | "charcoal" | "glass" | "plum" | "silk" | "bar" | "ring";
};

const PLANES: PlaneSpec[] = [
  { w: 760, h: 440, from: [-2300, -900, -1700, 20, 78, -20], to: [-640, -345, -200, 3, 16, -2.5], delay: 0, kind: "magenta" },
  { w: 620, h: 420, from: [-2400, 1100, -1900, -26, 70, 18], to: [-640, 540, -320, -3, 14, 2], delay: 8, kind: "charcoal" },
  { w: 1200, h: 300, from: [0, 1500, -1500, 70, 0, 6], to: [0, 470, -560, 6, 0, 0], delay: 16, kind: "glass" },
  { w: 600, h: 380, from: [2000, 1200, -2000, 30, -60, 14], to: [560, 560, -640, 4, -12, -1.5], delay: 22, kind: "silk" },
  { w: 900, h: 560, from: [1700, -1500, -2200, -40, -50, -10], to: [660, -370, -820, -4, -10, 1.2], delay: 28, kind: "plum" },
  { w: 1500, h: 6, from: [0, -1600, -300, 0, 0, 0], to: [0, -262, 0, 0, 0, 0], delay: 34, kind: "bar" },
  { w: 230, h: 230, from: [-2400, 300, -600, 0, 90, 40], to: [-820, 400, 40, 0, 12, 8], delay: 40, kind: "ring" },
];

const PlaneView: React.FC<{ s: PlaneSpec; i: number; leave: number; t: number }> = ({ s, i, leave, t }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, s.delay, 104, EASE.inOut);
  const lerp = (a: number, b: number) => a + (b - a) * p;
  const [x, y, z, rx, ry, rz] = s.from.map((v, k) => lerp(v, s.to[k]));
  // tras el clímax los planos se aproximan a cámara y se desvanecen
  const push = ramp(frame, 0, 1) * leave;
  const bg: Record<PlaneSpec["kind"], string> = {
    magenta: C.magenta,
    charcoal: `linear-gradient(150deg, #3b3b40 0%, ${C.charcoal} 70%)`,
    glass: "linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.04))",
    plum: `linear-gradient(150deg, #2c2c32 0%, #17171b 80%)`,
    silk: `linear-gradient(150deg, #34343a 0%, ${C.charcoal} 80%)`,
    bar: C.magenta,
    ring: "transparent",
  };
  const far = z < -450 ? 2.4 : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: CX - s.w / 2,
        top: CY - s.h / 2,
        width: s.w,
        height: s.h,
        transform: `translate3d(${x}px, ${y}px, ${z + push * 900}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`,
        borderRadius: s.kind === "bar" ? 3 : s.kind === "ring" ? 0 : 18,
        background: bg[s.kind],
        border: s.kind === "ring" ? `4px solid ${C.magenta}` : s.kind === "glass" ? "1px solid rgba(255,255,255,0.22)" : "none",
        boxShadow: s.kind === "bar" || s.kind === "glass" || s.kind === "ring" ? "none" : "0 60px 120px rgba(0,0,0,0.45)",
        opacity: clamp(p * 2.5) * (1 - leave),
        filter: far ? `blur(${far * (1 - 0.6 * p)}px)` : undefined,
        overflow: "hidden",
        backfaceVisibility: "hidden",
      }}
    >
      {s.kind === "silk" && (
        <SilkField
          width={s.w}
          height={s.h}
          time={t + i}
          order={0.3 + 0.7 * p}
          lines={80}
          seed={111}
          palette="dark"
          fills={4}
          blurNear={0}
          length={16}
          spread={3}
          cam={{ pos: [1, 0.5, -10], target: [0, -0.4, 0], fov: 40, roll: 0.15 }}
          alpha={0.75}
          style={{ position: "absolute", left: 0, top: 0 }}
        />
      )}
    </div>
  );
};

export const S18Cierre: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const cMod = cue(ID, "Modernizamos");
  const cYa = cue(ID, "Y la capa");
  const cTu = cue(ID, "tuya");
  const cAtm = Math.max(cue(ID, "atmira"), cTu + 14);

  // ── tiempos del clímax, derivados de la voz ──
  const w1s = cTu - 26;
  const w1 = ramp(frame, w1s, 58, EASE.inOut);
  const w2s = cTu + 14;
  const w2 = ramp(frame, w2s, Math.max(64, cAtm - w2s + 30), EASE.inOut);
  const beam = ramp(frame, w1s - 24, 24, EASE.out) * (1 - ramp(frame, w1s + 36, 14));
  const open1 = (1 - w1) * 50; // % que queda cerrado arriba y abajo
  const edge = -SK - 40 + w2 * (W + 2 * SK + 80); // posición x del filo del barrido
  const reveal = ramp(frame, cAtm - 12, 30, EASE.inOut);
  const leave = ramp(frame, w1s - 6, 26, EASE.in); // planos fuera
  const textOut = ramp(frame, w1s + 4, 16, EASE.in);
  const settle = ramp(frame, w2s + 50, 40, EASE.out);

  // cámara: empuje hasta el clímax y relajación
  const push = ramp(frame, 0, w1s + 20, EASE.soft);
  const camZ = interpolate(push, [0, 1], [-24, -9.5]);
  const order = 0.12 + 0.88 * ramp(frame, 20, w1s, EASE.inOut);
  const scale = 1 + 0.07 * ramp(frame, 0, w1s + 10, EASE.soft) - 0.07 * ramp(frame, w1s + 10, 60, EASE.out);

  const logoW = 760;
  const logoH = logoW / LOGO_RATIO;
  const logoStyle: React.CSSProperties = {
    position: "absolute",
    left: CX - logoW / 2,
    top: CY - logoH / 2 - 40,
    width: logoW,
    clipPath: `inset(-8% ${(1 - reveal) * 100}% -8% -3%)`,
    filter: `blur(${(1 - reveal) * 10}px)`,
  };

  // aparición final del mensaje y la web (tras el clímax)
  const fin = (d: number) => ramp(frame, w2s + 44 + d, 30, EASE.out);

  return (
    <AbsoluteFill>
      {/* fondo oscuro de acumulación */}
      <Backdrop tone="plum" />
      <StockVideo name="cierre" rate={0.7} brightness={0.7} veil={0.4} vignette={0.6} drift={1.12} driftFrames={600} opacity={1 - 0.5 * leave} />
      <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: `${CX}px ${CY}px` }}>
        <SilkField
          time={t + 30}
          order={order}
          lines={170}
          seed={121}
          palette="dark"
          fills={18}
          twist={1.5}
          amp={1.7}
          spread={4.6}
          pinchAt={0.5}
          blurNear={2.8}
          cam={{ pos: [interpolate(push, [0, 1], [5, 0.2]), 0.8, camZ], target: [0, 0.2, 0], fov: 42, roll: interpolate(push, [0, 1], [-0.28, 0]) }}
          alpha={0.95}
          style={{
            opacity: 1 - 0.25 * leave,
            WebkitMaskImage: "linear-gradient(180deg, #000 0%, rgba(0,0,0,0.28) 26%, rgba(0,0,0,0.28) 72%, #000 100%)",
            maskImage: "linear-gradient(180deg, #000 0%, rgba(0,0,0,0.28) 26%, rgba(0,0,0,0.28) 72%, #000 100%)",
          }}
        />
        <div style={{ position: "absolute", inset: 0, perspective: 1900, perspectiveOrigin: `${CX}px ${CY - 20}px` }}>
          {PLANES.map((s, i) => (
            <PlaneView key={i} s={s} i={i} leave={leave} t={t} />
          ))}
        </div>

        {/* velo de lectura tras el mensaje */}
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, opacity: 1 - textOut, background: "radial-gradient(1100px 380px at 50% 52%, rgba(8,8,10,0.62), transparent 70%)" }} />
        {/* mensaje */}
        <div style={{ position: "absolute", left: 0, top: 0, width: W, opacity: 1 - textOut, transform: `translateY(${-textOut * 30}px)`, filter: `blur(${textOut * 8}px)` }}>
          <div style={{ position: "absolute", left: 160, width: 1600, top: 330, textAlign: "center", ...font(104, 400, { color: "#fff", letterSpacing: "-0.045em", lineHeight: 1.04 }) }}>
            <SyncWords scene={ID} text="Modernizamos y aceleramos los servicios financieros." from="Modernizamos" accent={[0, 2]} accentColor="#FF4DA6" lead={4} dur={18} style={{ justifyContent: "center" }} />
          </div>
          <div style={{ position: "absolute", left: 160, width: 1600, top: 650, textAlign: "center", ...font(54, 400, { color: "#FFD1E8", letterSpacing: "-0.03em", lineHeight: 1.12 }) }}>
            <SyncWords scene={ID} text={CIERRE.l2} from="Y la capa" lead={4} dur={18} style={{ justifyContent: "center" }} />
          </div>
        </div>
      </AbsoluteFill>

      {/* C — frente magenta (con hilos blancos y logotipo blanco) */}
      {w1 > 0.001 && (
        <AbsoluteFill style={{ clipPath: `inset(${open1}% 0 ${open1}% 0)` }}>
          <StockVideo name="cierre" rate={0.7} brightness={1.0} veil={0.12} vignette={0.35} drift={1.12} driftFrames={600} />
          <AbsoluteFill style={{ background: "rgba(10,10,12,0.32)" }} />
          <SilkField
            time={t + 12}
            order={1}
            lines={120}
            seed={131}
            palette="dark"
            fills={10}
            blurNear={0}
            twist={0.8}
            amp={1.2}
            cam={{ pos: [1, 1, -13], target: [0, 0, 0], fov: 40, roll: 0.1 }}
            alpha={0.55}
          />
          <div style={logoStyle}>
            <Logo width={logoW} tone="white" />
          </div>
        </AbsoluteFill>
      )}
      {/* haz de luz: los hilos convergen en una línea que se abre como una rendija */}
      {beam > 0.002 && (
        <div style={{ position: "absolute", left: W / 2 - (beam * W) / 2, width: beam * W, top: H / 2 - 2, height: 4, background: "#fff", opacity: Math.min(1, beam * 1.6), boxShadow: "0 0 36px 8px rgba(255,255,255,0.8), 0 0 120px 30px rgba(255,255,255,0.35)" }} />
      )}
      {w1 > 0.001 && w1 < 0.999 && (
        <>
          <div style={{ position: "absolute", left: 0, width: W, top: H / 2 - (1 - open1 / 50) * (H / 2) - 2, height: 4, background: "#fff", boxShadow: "0 0 28px 6px rgba(255,255,255,0.75)" }} />
          <div style={{ position: "absolute", left: 0, width: W, top: H / 2 + (1 - open1 / 50) * (H / 2) - 2, height: 4, background: "#fff", boxShadow: "0 0 28px 6px rgba(255,255,255,0.75)" }} />
        </>
      )}
      {/* filo luminoso del barrido hacia el blanco */}
      {w2 > 0.001 && w2 < 0.999 && (
        <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
          <line x1={edge + SK} y1={0} x2={edge - SK} y2={H} stroke={C.magenta} strokeWidth={5} style={{ filter: "drop-shadow(0 0 14px rgba(240,39,143,0.9))" }} />
          <line x1={edge + SK + 14} y1={0} x2={edge - SK + 14} y2={H} stroke="#fff" strokeWidth={2} opacity={0.9} />
        </svg>
      )}

      {/* C→D — blanco de marca (con logotipo magenta, mensaje final y firma) */}
      {w2 > 0.001 && (
        <AbsoluteFill style={{ clipPath: `polygon(0px 0px, ${edge + SK}px 0px, ${edge - SK}px ${H}px, 0px ${H}px)` }}>
          <StockVideo name="cierre" rate={0.6} brightness={0.95} veil={0.28} vignette={0.55} drift={1.14} driftFrames={400} />
          <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(8,7,16,0.15) 0%, rgba(8,7,16,0.55) 100%)" }} />
          <SilkField
            time={t + 40}
            order={1}
            draw={ramp(frame, w2s + 30, 90, EASE.soft)}
            lines={90}
            palette="dark"
            seed={141}
            fills={8}
            blurNear={0}
            spread={2.8}
            amp={0.55}
            cam={{ pos: [-1.5, 2.6, -15], target: [1.4, 2.5, 0], fov: 38, roll: 0.05 }}
            alpha={0.9}
            style={{ top: 250, opacity: settle, WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 22%)", maskImage: "linear-gradient(180deg, transparent 0%, #000 22%)" }}
          />
          <div style={logoStyle}>
            <Logo width={logoW} tone="white" />
          </div>
          <div style={{ position: "absolute", left: 160, width: 1600, top: 660, textAlign: "center", ...font(46, 400, { color: "#FFFFFF", letterSpacing: "-0.03em", lineHeight: 1.2 }), opacity: fin(0), transform: `translateY(${(1 - fin(0)) * 20}px)` }}>
            Modernizamos y aceleramos los servicios financieros.
          </div>
          <div style={{ position: "absolute", left: 160, width: 1600, top: 724, textAlign: "center", ...font(46, 400, { color: "#FF4DA6", letterSpacing: "-0.03em", lineHeight: 1.2 }), opacity: fin(10), transform: `translateY(${(1 - fin(10)) * 20}px)` }}>
            {CIERRE.l2}
          </div>
          <div style={{ position: "absolute", left: 0, width: W, top: 830, textAlign: "center", ...font(26, 500, { color: "#E3E2EA", letterSpacing: "0.22em", textTransform: "uppercase" }), opacity: fin(26) }}>
            {CIERRE.web}
          </div>
        </AbsoluteFill>
      )}
      <Finish tone="plum" grain={0.045} />
    </AbsoluteFill>
  );
};
