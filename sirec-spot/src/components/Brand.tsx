import React from "react";
import { Img, staticFile } from "remotion";

export const ATMIRA_RATIO = 562 / 2000;
export const SIREC_RATIO = 1528 / 2000;

/** White Atmira wordmark (provided asset). `tint` recolours it via CSS mask (for light scenes). */
export const AtmiraLogo: React.FC<{ width: number; tint?: string; style?: React.CSSProperties }> = ({ width, tint, style }) =>
  tint ? (
    <div
      style={{
        width, height: width * ATMIRA_RATIO, backgroundColor: tint,
        WebkitMaskImage: `url(${staticFile("logos/atmira-white.webp")})`, WebkitMaskSize: "100% 100%", WebkitMaskRepeat: "no-repeat",
        ...style,
      }}
    />
  ) : (
    <Img src={staticFile("logos/atmira-white.webp")} style={{ width, height: width * ATMIRA_RATIO, display: "block", ...style }} />
  );

export const SirecLogo: React.FC<{ width: number; variant?: "blue" | "white"; style?: React.CSSProperties }> = ({ width, variant = "blue", style }) => (
  <Img
    src={staticFile(variant === "blue" ? "logos/sirec-blue.webp" : "logos/sirec-white.png")}
    style={{ width, height: variant === "blue" ? width * SIREC_RATIO : width * (418 / 519), display: "block", ...style }}
  />
);

/** Axolotl head only (crop of the blue SIREC logo) — used as a faint watermark, like the SIREC videos. */
export const SirecMark: React.FC<{ width: number; style?: React.CSSProperties }> = ({ width, style }) => (
  <div style={{ width, height: width * 0.475, overflow: "hidden", ...style }}>
    <Img src={staticFile("logos/sirec-blue.webp")} style={{ width, display: "block" }} />
  </div>
);
