import React from "react";
import { useCurrentFrame } from "remotion";
import { C, EASE, FONT } from "../theme";
import { clamp, ramp } from "../lib/anim";
import { Logo } from "./Logo";

/** Cabecera de marca: logotipo pequeño arriba a la derecha y etiqueta de capítulo arriba a la izquierda. */
export const Chrome: React.FC<{
  chapter?: string;
  tone?: "light" | "dark";
  start?: number;
  logoWidth?: number;
  hideLogo?: boolean;
  left?: number;
}> = ({ chapter, tone = "light", start = 6, logoWidth = 168, hideLogo = false, left = 120 }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, start, 22, EASE.out);
  const col = tone === "dark" ? "rgba(255,255,255,0.7)" : C.mute;
  return (
    <>
      {!hideLogo && (
        <div style={{ position: "absolute", right: 120, top: 48, opacity: clamp(p * 1.4), transform: `translateY(${(1 - p) * -10}px)` }}>
          <Logo width={logoWidth} tone={tone === "dark" ? "white" : "magenta"} />
        </div>
      )}
    </>
  );
};
