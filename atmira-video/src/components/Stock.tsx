import React from "react";
import { AbsoluteFill, Loop, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { ramp } from "../lib/anim";

/**
 * Vídeo de stock libre de derechos (Mixkit · licencia de vídeo gratuita; ver docs/06-STOCK-LICENCIAS.md).
 * Los clips están ya recodificados a 1920×1080 · 25 fps en public/stock; el valor es su duración original en fotogramas.
 * Se reproducen a cámara lenta y en bucle para cubrir escenas más largas que el clip.
 */
export const STOCK = {
  apertura_a: 281,
  apertura_b: 375,
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
  eng: 853,
  meeting: 450,
  fiber: 517,
  hall2: 358,
  market: 350,
  circuit: 258,
  night2: 350,
  skyline: 201,
} as const;

export type StockName = keyof typeof STOCK;

type LookProps = {
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
  /** desplazamiento lateral/vertical acumulado (px) durante driftFrames */
  panX?: number;
  panY?: number;
  blur?: number;
  /** velo blanco (escenas claras): sustituye al velo oscuro y a la viñeta */
  wash?: number;
  rate?: number;
  style?: React.CSSProperties;
};

/**
 * Imagen real con el tratamiento de la película de marca: color conservado pero apagado, velo azul noche y
 * viñeta; un lento empuje de cámara (deriva y paneo) para que ningún plano quede estático.
 */
export const StockVideo: React.FC<{ name: StockName } & LookProps> = ({
  name,
  rate = 0.8,
  brightness = 0.75,
  saturate = 0.85,
  contrast = 1.08,
  veil = 0.35,
  vignette = 0.5,
  opacity = 1,
  drift = 1.12,
  driftFrames = 400,
  panX = 0,
  panY = 0,
  blur = 0,
  wash = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const frames = Math.max(30, Math.round(STOCK[name] / rate));
  const k = Math.min(1, frame / driftFrames);
  const s = 1.06 + (drift - 1) * k;
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity, ...style }}>
      <AbsoluteFill
        style={{
          filter: `saturate(${saturate}) contrast(${contrast}) brightness(${brightness})${blur ? ` blur(${blur}px)` : ""}`,
          transform: `translate(${panX * k}px, ${panY * k}px) scale(${s})`,
        }}
      >
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

export type Shot = { name: StockName; from: number } & Pick<LookProps, "rate" | "drift" | "panX" | "panY" | "brightness" | "veil" | "saturate">;

/**
 * Secuencia de planos con fundido encadenado: cada plano arranca en su fotograma `from` (de la escena) y dura hasta
 * que entra el siguiente. Cada plano lleva su propio movimiento de cámara. Solo se monta el plano visible.
 */
export const FootageSeq: React.FC<{ shots: Shot[]; xf?: number } & Pick<LookProps, "veil" | "vignette" | "brightness" | "saturate" | "opacity">> = ({
  shots,
  xf = 22,
  opacity = 1,
  ...look
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity }}>
      {shots.map((sh, i) => {
        const start = i === 0 ? 0 : sh.from - xf;
        const end = i < shots.length - 1 ? shots[i + 1].from : Infinity;
        const fin = i === 0 ? 1 : ramp(frame, sh.from - xf, xf);
        const fout = i < shots.length - 1 ? 1 - ramp(frame, end, xf) : 1;
        const op = Math.min(fin, fout);
        if (op <= 0.001 || frame < start) return null;
        return (
          <Sequence key={i} from={Math.max(0, start)} layout="none">
            <AbsoluteFill style={{ opacity: op }}>
              <StockVideo {...look} {...sh} driftFrames={Math.max(300, (i < shots.length - 1 ? end - sh.from : 500) + xf)} />
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
