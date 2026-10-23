import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Finish } from "../components/Stage";
import { StockVideo } from "../components/Stock";
import { Logo, LOGO_RATIO } from "../components/Logo";
import { MaskLine, font } from "../components/Type";
import { C, EASE, FONT } from "../theme";
import { ramp } from "../lib/anim";
import { cue } from "../lib/tl";

const ID = "apertura";

const serif = (color: string): React.CSSProperties => ({ color, fontFamily: FONT.serif, fontStyle: "italic", fontWeight: 500, letterSpacing: "-0.01em" });

export const S01Apertura: React.FC = () => {
  const frame = useCurrentFrame();

  const cNo = cue(ID, "No hacemos todo");
  const cEsto = cue(ID, "Hacemos esto");
  const cModer = cue(ID, "Modernizamos");
  const cAcel = cue(ID, "aceleramos");
  const cServ = cue(ID, "los servicios");

  // 1) los hilos barren el encuadre mientras se peinan (complejidad → orden)
  const glide = ramp(frame, 62, 36, EASE.inOut); // el logo viaja a su sitio mientras suena «atmira»
  // 2) del plano nocturno al plano diurno de la torre cuando llega «Modernizamos»
  const xf = ramp(frame, cModer - 22, 30, EASE.inOut);
  const textA = 1 - xf;

  const reveal = ramp(frame, 26, 40, EASE.inOut);
  const logoBlur = (1 - ramp(frame, 26, 44, EASE.out)) * 16;
  const bigW = 820;
  const smallW = 236;
  const w = bigW + (smallW - bigW) * glide;
  const lx = 960 - bigW / 2 + (120 - (960 - bigW / 2)) * glide;
  const ly = 540 - bigW / LOGO_RATIO / 2 + (92 - (540 - bigW / LOGO_RATIO / 2)) * glide;


  return (
    <AbsoluteFill style={{ background: "#0b0a12" }}>
      <StockVideo name="apertura_a" rate={0.85} brightness={0.8} veil={0.3} vignette={0.55} drift={1.18} driftFrames={300} panX={-90} opacity={1 - xf} />
      <StockVideo name="apertura_b" rate={0.7} brightness={0.85} veil={0.32} vignette={0.5} drift={1.2} driftFrames={340} panY={-40} opacity={xf} />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(8,7,16,0.78) 0%, rgba(8,7,16,0.42) 55%, rgba(8,7,16,0.1) 100%)" }} />
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
        <Logo width={w} tone="white" />
      </div>

      {/* «No hacemos todo. Hacemos esto.» */}
      <div style={{ position: "absolute", left: 120, top: 330, opacity: textA }}>
        <MaskLine start={cNo} dur={26} style={font(44, 400, { color: "#E9E8EF", letterSpacing: "-0.01em" })}>
          No hacemos todo.
        </MaskLine>
        <MaskLine start={cEsto - 2} dur={28} style={font(170, 700, { color: "#FFFFFF", letterSpacing: "-0.05em", lineHeight: 1.04, marginTop: 6 })}>
          Hacemos <span style={serif(C.magenta)}>esto.</span>
        </MaskLine>
      </div>

      {/* «Modernizamos y aceleramos los servicios financieros» */}
      <div style={{ position: "absolute", left: 120, top: 330, opacity: xf }}>
        <MaskLine start={cModer - 6} dur={28} style={font(150, 700, { color: "#FFFFFF", letterSpacing: "-0.05em", lineHeight: 1.04 })}>
          Modernizamos
        </MaskLine>
        <MaskLine start={cAcel - 8} dur={28} style={font(150, 700, { color: "#FFFFFF", letterSpacing: "-0.05em", lineHeight: 1.04 })}>
          y <span style={{ ...serif(C.magenta), fontSize: 168 }}>aceleramos</span>
        </MaskLine>
        <MaskLine start={cServ - 4} dur={26} style={font(66, 500, { color: "#FFFFFF", letterSpacing: "-0.03em", marginTop: 22 })}>
          los servicios financieros
        </MaskLine>
      </div>
      <Finish tone="dark" />
    </AbsoluteFill>
  );
};
