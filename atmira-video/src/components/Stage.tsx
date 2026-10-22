import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { C, H, W } from "../theme";

export type Tone = "light" | "mist" | "dark" | "plum";

const BASE: Record<Tone, string> = {
  light: `radial-gradient(1200px 800px at 82% 12%, rgba(120,124,140,0.05), transparent 70%), radial-gradient(900px 700px at 8% 100%, rgba(40,40,60,0.035), transparent 70%), ${C.paper}`,
  mist: `radial-gradient(1400px 900px at 100% 100%, rgba(120,124,140,0.12), transparent 62%), radial-gradient(900px 700px at 0% 0%, rgba(120,124,140,0.05), transparent 70%), ${C.paper}`,
  dark: `linear-gradient(160deg, #26262a 0%, ${C.charcoal} 55%, #121214 100%)`,
  plum: `radial-gradient(1300px 900px at 55% 55%, rgba(110,116,135,0.16), transparent 62%), linear-gradient(170deg, #1b1b20 0%, #141418 50%, #0d0d10 100%)`,
};

/** Capa 1: fondo (nunca un color plano). */
export const Backdrop: React.FC<{ tone?: Tone; style?: React.CSSProperties }> = ({ tone = "light", style }) => (
  <AbsoluteFill style={{ background: BASE[tone], ...style }} />
);

/** Capa 5: grano + viñeta suave (siempre arriba del todo). */
export const Finish: React.FC<{ tone?: Tone; grain?: number }> = ({ tone = "light", grain = 0.05 }) => {
  const frame = useCurrentFrame();
  const dark = tone === "dark" || tone === "plum";
  // el grano "tiembla" de forma determinista (película), no con Math.random
  const jx = (frame * 97) % 512;
  const jy = (frame * 53) % 512;
  return (
    <>
      <AbsoluteFill
        style={{
          backgroundImage: `url(${staticFile("brand/grain.png")})`,
          backgroundSize: "512px 512px",
          backgroundPosition: `${jx}px ${jy}px`,
          opacity: dark ? grain * 1.1 : grain,
          mixBlendMode: dark ? "screen" : "multiply",
          pointerEvents: "none",
        }}
      />
      <AbsoluteFill
        style={{
          background: dark
            ? "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.42) 100%)"
            : "radial-gradient(ellipse at center, transparent 62%, rgba(0,0,0,0.06) 100%)",
          pointerEvents: "none",
        }}
      />
    </>
  );
};

export const Frame: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <AbsoluteFill style={{ width: W, height: H, ...style }}>{children}</AbsoluteFill>
);
