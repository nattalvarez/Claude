import React from "react";
import { Img, staticFile } from "remotion";

export type LogoTone = "magenta" | "white" | "black";

/** Logotipo atmira recuperado del vídeo original (proporción 847×257). */
export const LOGO_RATIO = 847 / 257;

export const Logo: React.FC<{
  width?: number;
  tone?: LogoTone;
  style?: React.CSSProperties;
}> = ({ width = 220, tone = "magenta", style }) => (
  <Img
    src={staticFile(`brand/atmira-${tone}.png`)}
    style={{ width, height: width / LOGO_RATIO, display: "block", ...style }}
  />
);
