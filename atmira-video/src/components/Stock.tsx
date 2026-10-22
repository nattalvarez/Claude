import React from "react";
import { AbsoluteFill, Loop, OffthreadVideo, staticFile } from "remotion";

/**
 * Vídeo de stock libre de derechos (Mixkit · licencia de vídeo gratuita; ver docs/06-STOCK-LICENCIAS.md).
 * Los clips están ya recodificados a 1920×1080 · 25 fps en public/stock; `frames` es su duración original.
 * Se reproducen a cámara lenta y en bucle para cubrir escenas más largas que el clip, y se graduan a
 * monocromo neutro para que la única nota de color de la escena siga siendo el magenta de marca.
 */
export const STOCK = {
  apertura: 375,
  aceleracion: 375,
  especializacion: 258,
  sector: 275,
  cifras: 269,
  cierre: 500,
} as const;

export type StockName = keyof typeof STOCK;

export const StockVideo: React.FC<{
  name: StockName;
  rate?: number;
  gray?: number;
  brightness?: number;
  contrast?: number;
  opacity?: number;
  scale?: number;
  style?: React.CSSProperties;
}> = ({ name, rate = 0.75, gray = 1, brightness = 0.6, contrast = 1.1, opacity = 1, scale = 1, style }) => {
  const frames = Math.max(30, Math.round(STOCK[name] / rate));
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity, ...style }}>
      <AbsoluteFill style={{ filter: `grayscale(${gray}) contrast(${contrast}) brightness(${brightness})`, transform: `scale(${scale})` }}>
        <Loop durationInFrames={frames}>
          <OffthreadVideo src={staticFile(`stock/${name}.mp4`)} muted playbackRate={rate} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </Loop>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
