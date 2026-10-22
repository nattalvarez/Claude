import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme, W, H } from "../theme";

const clampOpts = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export type Mode = "dark" | "light" | "magenta";

/* ------------------------------------------------------------------ hooks */

export const useSpring = (
  delay = 0,
  cfg: Parameters<typeof spring>[0]["config"] = theme.spring.smooth,
) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: cfg });
};

export const ramp = (
  frame: number,
  from: number,
  to: number,
  a = 0,
  b = 1,
  easing: (t: number) => number = theme.ease.out,
) => interpolate(frame, [from, to], [a, b], { easing, ...clampOpts });

/** 1 → 0 across the last `len` frames of the current Sequence (faster than entrances). */
export const useExit = (len = 9) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return interpolate(frame, [durationInFrames - len, durationInFrames - 1], [1, 0], {
    easing: theme.ease.in,
    ...clampOpts,
  });
};

/* ------------------------------------------------------------- 5-layer BG */

const Orb: React.FC<{ size: number; x: number; y: number; color: string; opacity?: number }> = ({
  size,
  x,
  y,
  color,
  opacity = 1,
}) => (
  <div
    style={{
      position: "absolute",
      width: size,
      height: size,
      left: x - size / 2,
      top: y - size / 2,
      borderRadius: "50%",
      opacity,
      background: `radial-gradient(circle, ${color}, transparent 66%)`,
    }}
  />
);

export const Bg: React.FC<{ mode: Mode; seed?: number }> = ({ mode, seed = 0 }) => {
  const frame = useCurrentFrame();
  const d1 = Math.sin((frame + seed * 40) / 55) * 70;
  const d2 = Math.cos((frame + seed * 25) / 70) * 60;
  if (mode === "light") {
    return (
      <AbsoluteFill style={{ background: theme.colors.light }}>
        <Orb size={1300} x={W * 0.9 + d1} y={H * 0.95} color="rgba(230,0,126,0.16)" />
        <Orb size={900} x={W * 0.05 - d2} y={-60} color="rgba(230,0,126,0.07)" />
      </AbsoluteFill>
    );
  }
  if (mode === "magenta") {
    return (
      <AbsoluteFill
        style={{
          background: `linear-gradient(135deg, ${theme.colors.hero}, #B8005F 60%, ${theme.colors.heroDeep})`,
        }}
      >
        <Orb size={1500} x={W * 0.15 + d1} y={H * 0.1} color="rgba(255,255,255,0.22)" />
        <Orb size={1100} x={W * 0.9 - d2} y={H * 1.0} color="rgba(0,0,0,0.35)" />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: theme.colors.bg }}>
      <Orb size={1500} x={W * 0.1 + d1} y={-100} color="rgba(230,0,126,0.30)" />
      <Orb size={1200} x={W * 0.95 - d2} y={H * 1.05} color="rgba(122,0,69,0.55)" />
      <Orb size={800} x={W * 0.55 + d2} y={H * 0.45} color="rgba(255,255,255,0.035)" />
    </AbsoluteFill>
  );
};

const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;

export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        backgroundImage: noise,
        backgroundSize: "220px",
        backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`,
        opacity: 0.075,
        mixBlendMode: "overlay",
      }}
    />
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: "radial-gradient(ellipse at center, transparent 58%, rgba(0,0,0,0.32) 100%)",
    }}
  />
);

export const Grade: React.FC<{ mode: Mode }> = ({ mode }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.hero,
        mixBlendMode: "soft-light",
        opacity: mode === "light" ? 0.1 : 0.2,
      }}
    />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, rgba(0,0,0,0.10), transparent 26%, transparent 74%, rgba(0,0,0,0.18))",
      }}
    />
  </AbsoluteFill>
);

/** Bg → content (with punch-in entrance + soft exit) → grade. Grain + vignette live at root. */
export const SceneShell: React.FC<{
  mode: Mode;
  seed?: number;
  children: React.ReactNode;
  exit?: boolean;
}> = ({ mode, seed, children, exit = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exitP = useExit(8);
  const p = spring({ frame, fps, config: { damping: 22, stiffness: 170, mass: 0.8 } });
  const scale = interpolate(p, [0, 1], [1.045, 1]);
  return (
    <AbsoluteFill>
      <Bg mode={mode} seed={seed} />
      <AbsoluteFill
        style={{
          transform: `scale(${scale * (exit ? 1 + (1 - exitP) * 0.03 : 1)})`,
          opacity: exit ? 0.15 + exitP * 0.85 : 1,
        }}
      >
        {children}
      </AbsoluteFill>
      <Grade mode={mode} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------- typography */

export const colorsFor = (mode: Mode) => ({
  text: mode === "light" ? theme.colors.ink : theme.colors.text,
  dim: mode === "light" ? theme.colors.inkDim : theme.colors.textDim,
  line: mode === "light" ? theme.colors.inkLine : theme.colors.line,
  accent: mode === "magenta" ? "#FFFFFF" : theme.colors.hero,
});

/** Single line that rises from behind a mask. */
export const MaskLine: React.FC<{
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
  cfg?: Parameters<typeof spring>[0]["config"];
}> = ({ children, delay = 0, style, cfg = theme.spring.slam }) => {
  const p = useSpring(delay, cfg);
  return (
    <div style={{ overflow: "hidden", paddingBottom: "0.14em", marginBottom: "-0.14em", ...style }}>
      <div
        style={{
          transform: `translateY(${interpolate(p, [0, 1], [112, 0])}%)`,
          opacity: interpolate(p, [0, 0.25], [0, 1], clampOpts),
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
};

type Seg = { t: string; em: boolean };
const parse = (text: string): Seg[] =>
  text
    .split(/(\*[^*]+\*)/)
    .filter(Boolean)
    .map((s) => (s.startsWith("*") ? { t: s.slice(1, -1), em: true } : { t: s, em: false }));

/** Word-by-word kinetic text. `*word*` marks emphasis (serif italic hero colour). */
export const Words: React.FC<{
  text: string;
  size: number;
  mode?: Mode;
  delay?: number;
  per?: number;
  weight?: number;
  align?: "left" | "center";
  maxWidth?: number;
  lineHeight?: number;
  style?: React.CSSProperties;
  emColor?: string;
  emScale?: number;
}> = ({
  text,
  size,
  mode = "dark",
  delay = 0,
  per = 3,
  weight = 700,
  align = "left",
  maxWidth,
  lineHeight = 1.04,
  style,
  emColor,
  emScale = 1.12,
}) => {
  const c = colorsFor(mode);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  let idx = 0;
  const gap = Math.round(size * 0.24);
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        columnGap: gap,
        justifyContent: align === "center" ? "center" : "flex-start",
        maxWidth,
        fontFamily: theme.fonts.display,
        fontSize: size,
        fontWeight: weight,
        letterSpacing: "-0.035em",
        lineHeight,
        color: c.text,
        ...style,
      }}
    >
      {parse(text).flatMap((seg) =>
        seg.t
          .split(" ")
          .filter(Boolean)
          .map((w) => {
            const i = idx++;
            const p = spring({ frame: frame - delay - i * per, fps, config: theme.spring.slam });
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  overflow: "hidden",
                  paddingBottom: "0.16em",
                  marginBottom: "-0.16em",
                  paddingRight: seg.em ? "0.06em" : 0,
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    transform: `translateY(${interpolate(p, [0, 1], [108, 0])}%)`,
                    opacity: interpolate(p, [0, 0.3], [0, 1], clampOpts),
                    ...(seg.em
                      ? {
                          fontFamily: theme.fonts.serif,
                          fontStyle: "italic",
                          fontWeight: 400,
                          letterSpacing: "-0.01em",
                          fontSize: size * emScale,
                          lineHeight: 0.92,
                          color: emColor ?? c.accent,
                        }
                      : {}),
                  }}
                >
                  {w}
                </span>
              </span>
            );
          }),
      )}
    </div>
  );
};

export const Eyebrow: React.FC<{
  children: React.ReactNode;
  mode?: Mode;
  delay?: number;
  size?: number;
  style?: React.CSSProperties;
}> = ({ children, mode = "dark", delay = 0, size = 24, style }) => {
  const p = useSpring(delay, theme.spring.smooth);
  const c = colorsFor(mode);
  return (
    <div
      style={{
        fontFamily: theme.fonts.body,
        fontWeight: 600,
        fontSize: size,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: c.accent,
        opacity: p,
        transform: `translateX(${interpolate(p, [0, 1], [-24, 0])}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Body: React.FC<{
  children: React.ReactNode;
  mode?: Mode;
  delay?: number;
  size?: number;
  maxWidth?: number;
  style?: React.CSSProperties;
  dim?: boolean;
}> = ({ children, mode = "dark", delay = 0, size = 30, maxWidth, style, dim = true }) => {
  const p = useSpring(delay, theme.spring.smooth);
  const c = colorsFor(mode);
  return (
    <div
      style={{
        fontFamily: theme.fonts.body,
        fontWeight: 400,
        fontSize: size,
        lineHeight: 1.38,
        color: dim ? c.dim : c.text,
        maxWidth,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [24, 0])}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Rising pop used for chips / cards: opacity + rise + scale. */
export const Pop: React.FC<{
  delay?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  from?: "bottom" | "left" | "right" | "top";
  dist?: number;
  cfg?: Parameters<typeof spring>[0]["config"];
}> = ({ delay = 0, children, style, from = "bottom", dist = 36, cfg = theme.spring.snappy }) => {
  const p = useSpring(delay, cfg);
  const o = interpolate(p, [0, 1], [dist, 0]);
  const tx = from === "left" ? -o : from === "right" ? o : 0;
  const ty = from === "bottom" ? o : from === "top" ? -o : 0;
  return (
    <div
      style={{
        opacity: interpolate(p, [0, 0.4], [0, 1], clampOpts),
        transform: `translate(${tx}px, ${ty}px) scale(${interpolate(p, [0, 1], [0.92, 1])})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Counter: React.FC<{
  to: number;
  delay?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  style?: React.CSSProperties;
}> = ({ to, delay = 0, decimals = 0, prefix = "", suffix = "", style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 30, stiffness: 55, mass: 1 } });
  const v = interpolate(p, [0, 1], [0, to]);
  return (
    <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>
      {prefix}
      {v.toFixed(decimals)}
      {suffix}
    </span>
  );
};

export const Logo: React.FC<{ width: number; tint?: "magenta" | "white" | "black"; style?: React.CSSProperties }> = ({
  width,
  tint = "magenta",
  style,
}) => (
  <Img
    src={staticFile("brand/atmira.png")}
    style={{
      width,
      display: "block",
      filter:
        tint === "white" ? "brightness(0) invert(1)" : tint === "black" ? "brightness(0)" : undefined,
      ...style,
    }}
  />
);

/** Thin line that draws itself left → right. */
export const DrawLine: React.FC<{
  delay?: number;
  width: number;
  color: string;
  thickness?: number;
  style?: React.CSSProperties;
}> = ({ delay = 0, width, color, thickness = 2, style }) => {
  const frame = useCurrentFrame();
  const w = ramp(frame, delay, delay + 26, 0, width, theme.ease.inOut);
  return <div style={{ width: w, height: thickness, background: color, ...style }} />;
};

/** Deterministic pseudo-random in [0,1). */
export const rand = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
