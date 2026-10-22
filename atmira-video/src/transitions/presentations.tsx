import React from "react";
import { AbsoluteFill } from "remotion";
import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";
import { C, EASE, H, W } from "../theme";
import { clamp } from "../lib/anim";

/**
 * Presentaciones de transición propias. Cada una responde a una idea distinta y comparte el lenguaje de
 * marca (cinta magenta, planos, fundido a oscuro). Se dibuja SIEMPRE el plano saliente debajo y el entrante
 * encima, con la máscara/velo animados por `presentationProgress`.
 */

type P = Record<string, unknown>;
type Props = TransitionPresentationComponentProps<P>;

const e = (t: number, f = EASE.inOut) => f(clamp(t));

/** Cinta magenta que barre la pantalla; en el punto medio se intercambian las escenas. */
const SilkSweep: React.FC<Props> = ({ children, presentationDirection, presentationProgress, passedProps }) => {
  const dir = (passedProps.dir as number) ?? 1;
  const p = e(presentationProgress, EASE.inOut);
  const entering = presentationDirection === "entering";
  // el entrante se revela por detrás del frente de la cinta
  const front = (dir > 0 ? p * 1.35 - 0.2 : 1.15 - p * 1.35) * 100;
  const clip = entering
    ? dir > 0
      ? `polygon(0 0, ${front}% 0, ${front - 16}% 100%, 0 100%)`
      : `polygon(${front}% 0, 100% 0, 100% 100%, ${front + 16}% 100%)`
    : undefined;
  return (
    <AbsoluteFill style={{ clipPath: clip }}>
      {children}
      {entering && (
        <>
          <AbsoluteFill
            style={{
              background: `linear-gradient(${dir > 0 ? 100 : 80}deg, transparent ${front - 22}%, rgba(225,3,122,0.9) ${front - 2}%, rgba(143,1,82,0.95) ${front}%, transparent ${front + 0.1}%)`,
              opacity: 1 - Math.abs(p - 0.5) * 0.4,
              mixBlendMode: "multiply",
              pointerEvents: "none",
            }}
          />
        </>
      )}
    </AbsoluteFill>
  );
};

/** Avance en perspectiva: el saliente se aleja y se desenfoca, el entrante llega desde cerca. */
const ZoomThrough: React.FC<Props> = ({ children, presentationDirection, presentationProgress }) => {
  const p = e(presentationProgress, EASE.soft);
  const entering = presentationDirection === "entering";
  const s = entering ? 0.9 + 0.1 * p : 1 + 0.12 * p;
  const op = entering ? clamp(p * 2.2) : 1 - clamp((p - 0.35) * 2.2);
  const blur = entering ? (1 - p) * 14 : p * 12;
  return (
    <AbsoluteFill style={{ opacity: op, transform: `scale(${s})`, filter: `blur(${blur}px)` }}>{children}</AbsoluteFill>
  );
};

/** Empuje vertical con paralaje: el saliente sube más despacio que el entrante. */
const PushUp: React.FC<Props> = ({ children, presentationDirection, presentationProgress, passedProps }) => {
  const dir = (passedProps.dir as number) ?? 1;
  const p = e(presentationProgress, EASE.soft);
  const entering = presentationDirection === "entering";
  const y = entering ? (1 - p) * H * dir : -p * H * 0.28 * dir;
  const dim = entering ? 0 : p * 0.18;
  return (
    <AbsoluteFill style={{ transform: `translateY(${y}px)` }}>
      {children}
      <AbsoluteFill style={{ background: `rgba(0,0,0,${dim})`, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

/** Deslizamiento lateral con desenfoque de movimiento. */
const SlideX: React.FC<Props> = ({ children, presentationDirection, presentationProgress, passedProps }) => {
  const dir = (passedProps.dir as number) ?? 1;
  const p = e(presentationProgress, EASE.snap);
  const entering = presentationDirection === "entering";
  const x = entering ? (1 - p) * W * dir : -p * W * 0.35 * dir;
  const blur = Math.sin(p * Math.PI) * 10;
  return (
    <AbsoluteFill style={{ transform: `translateX(${x}px)`, filter: `blur(${blur}px)` }}>
      {children}
    </AbsoluteFill>
  );
};

/** Dos puertas: la escena entrante aparece en el hueco que abren dos mitades. */
const Doors: React.FC<Props> = ({ children, presentationDirection, presentationProgress }) => {
  const p = e(presentationProgress, EASE.inOut);
  const entering = presentationDirection === "entering";
  if (entering) {
    const w = 50 * p;
    return <AbsoluteFill style={{ clipPath: `polygon(${50 - w}% 0, ${50 + w}% 0, ${50 + w}% 100%, ${50 - w}% 100%)` }}>{children}</AbsoluteFill>;
  }
  return (
    <AbsoluteFill>
      {children}
      <AbsoluteFill style={{ background: `linear-gradient(90deg, #17171b ${50 - 50 * p}%, transparent ${50 - 50 * p}%, transparent ${50 + 50 * p}%, #17171b ${50 + 50 * p}%)`, opacity: Math.sin(p * Math.PI) * 0.95 }} />
    </AbsoluteFill>
  );
};

/** Iris orgánico desde un punto: el entrante crece desde el centro con un borde irregular. */
const Iris: React.FC<Props> = ({ children, presentationDirection, presentationProgress, passedProps }) => {
  const cx = (passedProps.cx as number) ?? 50;
  const cy = (passedProps.cy as number) ?? 52;
  const p = e(presentationProgress, EASE.inOut);
  const entering = presentationDirection === "entering";
  if (!entering) return <AbsoluteFill>{children}</AbsoluteFill>;
  const R = p * 135;
  const pts: string[] = [];
  const N = 72;
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const wob = 1 + 0.12 * Math.sin(a * 5 + p * 6) + 0.07 * Math.sin(a * 9 - p * 4);
    pts.push(`${cx + Math.cos(a) * R * wob * (H / W) * 1.78}% ${cy + Math.sin(a) * R * wob}%`);
  }
  return (
    <AbsoluteFill style={{ clipPath: `polygon(${pts.join(",")})` }}>
      {children}
    </AbsoluteFill>
  );
};

/** Fundido a oscuro (por plum) y de vuelta: para entrar/salir de escenas oscuras. */
const Flood: React.FC<Props> = ({ children, presentationDirection, presentationProgress, passedProps }) => {
  const tone = (passedProps.tone as string) ?? "#0d0d10";
  const p = e(presentationProgress, EASE.inOut);
  const entering = presentationDirection === "entering";
  // saliente → color pleno en la primera mitad; entrante emerge del color en la segunda (sin tonos intermedios sucios)
  const op = entering ? clamp((p - 0.5) / 0.5) : 1;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>
      {!entering && <AbsoluteFill style={{ background: tone, opacity: clamp(p / 0.5) }} />}
    </AbsoluteFill>
  );
};

/** Fundido suave con ligero desplazamiento (para escenas de continuidad). */
const Mist: React.FC<Props> = ({ children, presentationDirection, presentationProgress }) => {
  const p = e(presentationProgress, EASE.soft);
  const entering = presentationDirection === "entering";
  return (
    <AbsoluteFill style={{ opacity: entering ? p : 1 - p * 0.9, transform: `translateY(${entering ? (1 - p) * 16 : -p * 10}px)` }}>
      {children}
    </AbsoluteFill>
  );
};

const make = (component: React.FC<Props>, props: P = {}): TransitionPresentation<P> => ({ component, props });

export const PRESENTATIONS: Record<string, () => TransitionPresentation<P>> = {
  silk: () => make(SilkSweep, { dir: 1 }),
  silkBack: () => make(SilkSweep, { dir: -1 }),
  zoom: () => make(ZoomThrough),
  push: () => make(PushUp, { dir: 1 }),
  slide: () => make(SlideX, { dir: 1 }),
  split: () => make(Doors),
  iris: () => make(Iris),
  dark: () => make(Flood, { tone: "#0d0d10" }),
  light: () => make(Flood, { tone: C.paper }),
  fade: () => make(Mist),
};
