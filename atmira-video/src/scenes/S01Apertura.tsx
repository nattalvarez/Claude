import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, Finish } from "../components/Stage";
import { SilkField } from "../components/SilkField";
import { Logo, LOGO_RATIO } from "../components/Logo";
import { CharSettle, MaskLine, SpeedWord, Words, font } from "../components/Type";
import { C, EASE, FPS } from "../theme";
import { clamp, ramp } from "../lib/anim";
import { cue } from "../lib/tl";
import { OPENING } from "../data/content";

const ID = "apertura";

export const S01Apertura: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const cNo = cue(ID, "No hacemos todo");
  const cEsto = cue(ID, "Hacemos esto");
  const cModer = cue(ID, "Modernizamos");
  const cAcel = cue(ID, "aceleramos");
  const cServ = cue(ID, "los servicios");

  // 1) Los hilos barren el encuadre mientras se peinan (complejidad → orden)
  const draw = ramp(frame, 0, 58, EASE.soft);
  const order = ramp(frame, 6, 120, EASE.inOut);
  const dolly = ramp(frame, 0, 200, EASE.soft);
  const glide = ramp(frame, 62, 36, EASE.inOut); // el logo viaja a su sitio mientras suena «atmira»

  // 2) Revelado del logotipo siguiendo el frente de los hilos
  const reveal = ramp(frame, 26, 40, EASE.inOut);
  const logoBlur = (1 - ramp(frame, 26, 44, EASE.out)) * 16;
  const bigW = 820;
  const smallW = 236;
  const w = bigW + (smallW - bigW) * glide;
  const lx = 960 - bigW / 2 + (120 - (960 - bigW / 2)) * glide;
  const ly = 540 - bigW / LOGO_RATIO / 2 + (92 - (540 - bigW / LOGO_RATIO / 2)) * glide;

  // 3) la cámara se desplaza al fondo derecho cuando entra el texto
  const camX = interpolate(dolly, [0, 1], [7, 2.2]);
  const camZ = interpolate(dolly, [0, 1], [-26, -15.5]);

  return (
    <AbsoluteFill>
      <Backdrop tone="light" />
      <SilkField
        time={t + 4}
        order={order}
        draw={draw}
        lines={130}
        cam={{ pos: [camX, 1.6, camZ], target: [1.4, -0.7, 0], fov: 40, roll: 0.14 - 0.06 * dolly }}
        alpha={0.95}
        style={{
          opacity: 0.55 + 0.45 * glide,
          // tras presentar la marca, los hilos se retiran hacia la derecha y dejan limpio el texto
          WebkitMaskImage: `linear-gradient(90deg, transparent ${glide * 38}%, #000 ${glide * 38 + 26}%)`,
          maskImage: `linear-gradient(90deg, transparent ${glide * 38}%, #000 ${glide * 38 + 26}%)`,
        }}
      />

      {/* logotipo */}
      <div
        style={{
          position: "absolute",
          left: lx,
          top: ly,
          width: w,
          clipPath: `inset(-6% ${(1 - reveal) * 100}% -6% -2%)`,
          filter: `blur(${logoBlur * (1 - glide)}px)`,
          transform: `scale(${1 + (1 - reveal) * 0.04})`,
          transformOrigin: "left center",
        }}
      >
        <Logo width={w} />
      </div>

      {/* mensaje */}
      <div style={{ position: "absolute", left: 120, top: 318 }}>
        <MaskLine start={cNo} dur={24} style={font(40, 400, { color: C.ink2, letterSpacing: "-0.01em" })}>
          No hacemos todo.
        </MaskLine>
        <MaskLine start={cEsto} dur={24} style={font(40, 400, { color: C.ink2, letterSpacing: "-0.01em", marginTop: 8 })}>
          Hacemos <span style={{ color: C.magenta, fontWeight: 500 }}>esto.</span>
        </MaskLine>
      </div>

      <div style={{ position: "absolute", left: 120, top: 520, ...font(168, 400, { color: C.magenta, lineHeight: 1.02 }) }}>
        <div style={{ height: 176 }}>
          <CharSettle text="Modernizamos" start={cModer - 6} seed={11} />
        </div>
        <div style={{ height: 176 }}>
          <span style={{ opacity: clamp(ramp(frame, cModer + 6, 10) * 2), color: C.magenta }}>y </span>
          <SpeedWord text="aceleramos" start={cAcel - 4} dur={26} />
        </div>
        <div style={{ marginTop: 14 }}>
          <Words text="los servicios financieros" start={cServ - 2} stagger={4} dur={22} style={font(88, 400, { color: C.ink, letterSpacing: "-0.03em" })} />
        </div>
      </div>
      <Finish tone="light" />
    </AbsoluteFill>
  );
};
