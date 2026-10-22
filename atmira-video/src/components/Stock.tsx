import React from "react";
import { AbsoluteFill, Loop, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";

/**
 * Vídeo de stock libre de derechos (Mixkit · licencia de vídeo gratuita; ver docs/06-STOCK-LICENCIAS.md).
 * Los clips están ya recodificados a 1920×1080 · 25 fps en public/stock; el valor es su duración original en fotogramas.
 * Se reproducen a cámara lenta y en bucle para cubrir escenas más largas que el clip.
 */
export const STOCK = {
  apertura_a: 281,
  apertura_b: 375,
  modernizar: 248,
  aceleracion: 386,
  donde: 425,
  especializacion: 298,
  sector: 275,
  clientes: 201,
  cifras: 150,
  cierre: 286,
  tile_banking: 420,
  tile_insurance: 410,
  tile_smart: 350,
} as const;

export type StockName = keyof typeof STOCK;

/**
 * Imagen real con el tratamiento de la película de marca: color conservado pero apagado, velo azul noche y
 * viñeta; un lento empuje de cámara (deriva) para que ningún plano quede estático.
 */
export const StockVideo: React.FC<{
  name: StockName;
  rate?: number;
  /** oscurece la imagen (1 = sin tocar) */
  brightness?: number;
  saturate?: number;
  contrast?: number;
  /** velo azul noche 0–1 sobre la imagen */
  veil?: number;
  vignette?: number;
  opacity?: number;
  /** empuje lento: escala final sobre la inicial (1 = sin movimiento) */
  drift?: number;
  driftFrames?: number;
  blur?: number;
  /** velo blanco (escenas claras): sustituye al velo oscuro y a la viñeta */
  wash?: number;
  style?: React.CSSProperties;
}> = ({ name, rate = 0.8, brightness = 0.75, saturate = 0.85, contrast = 1.08, veil = 0.35, vignette = 0.5, opacity = 1, drift = 1.08, driftFrames = 600, blur = 0, wash = 0, style }) => {
  const frame = useCurrentFrame();
  const frames = Math.max(30, Math.round(STOCK[name] / rate));
  const k = Math.min(1, frame / driftFrames);
  const s = 1.04 + (drift - 1) * k;
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity, ...style }}>
      <AbsoluteFill style={{ filter: `saturate(${saturate}) contrast(${contrast}) brightness(${brightness})${blur ? ` blur(${blur}px)` : ""}`, transform: `scale(${s})` }}>
        <Loop durationInFrames={frames}>
          <OffthreadVideo src={staticFile(`stock/${name}.mp4`)} muted playbackRate={rate} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </Loop>
      </AbsoluteFill>
      {wash > 0 ? (
        <AbsoluteFill style={{ background: `rgba(252,252,252,${wash})` }} />
      ) : (
        <>
          <AbsoluteFill style={{ background: `rgba(12,10,28,${veil})` }} />
          <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, transparent 38%, rgba(6,5,14,${vignette}) 100%)` }} />
        </>
      )}
    </AbsoluteFill>
  );
};
