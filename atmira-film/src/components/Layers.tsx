import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../theme";

export type Variant = "dark" | "light" | "blue";
const c = theme.colors;

/** Layer 1 — animated gradient mesh (never a flat background). */
export const BgMesh: React.FC<{ variant: Variant }> = ({ variant }) => {
  const f = useCurrentFrame();
  const d1 = Math.sin(f / 55) * 60;
  const d2 = Math.cos(f / 70) * 50;
  const base =
    variant === "dark"
      ? `linear-gradient(162deg, ${c.navyDeep} 0%, ${c.navy} 58%, #1B2C4D 100%)`
      : variant === "blue"
        ? `linear-gradient(150deg, #3B70AE 0%, ${c.blue} 52%, #2B5489 100%)`
        : `linear-gradient(160deg, #FAFCFF 0%, ${c.paper} 45%, ${c.ice} 100%)`;
  const a = variant === "light" ? [`${c.turq}30`, `${c.blue}2e`] : variant === "blue" ? [`${c.turq}55`, `${c.navy}66`] : [`${c.blue}8c`, `${c.turq}30`];
  return (
    <AbsoluteFill style={{ background: base }}>
      <div
        style={{
          position: "absolute", width: 1300, height: 1300, borderRadius: "50%", top: -560, left: -380 + d1,
          filter: "blur(40px)", background: `radial-gradient(circle, ${a[0]}, transparent 64%)`,
        }}
      />
      <div
        style={{
          position: "absolute", width: 1100, height: 1100, borderRadius: "50%", bottom: -520, right: -300 - d2,
          filter: "blur(50px)", background: `radial-gradient(circle, ${a[1]}, transparent 66%)`,
        }}
      />
    </AbsoluteFill>
  );
};

/** Layer 4 — colour grade that unifies every asset into one brand look. */
export const Grade: React.FC<{ variant: Variant }> = ({ variant }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ backgroundColor: c.blue, mixBlendMode: "soft-light", opacity: variant === "light" ? 0.1 : 0.22 }} />
    <AbsoluteFill
      style={{
        background:
          variant === "light"
            ? "linear-gradient(180deg, rgba(35,52,86,0.04), transparent 30%, transparent 72%, rgba(35,52,86,0.07))"
            : "linear-gradient(180deg, rgba(10,16,30,0.18), transparent 30%, transparent 68%, rgba(10,16,30,0.28))",
      }}
    />
  </AbsoluteFill>
);

const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E")`;

/** Layer 5 — procedural film grain (flickers) + vignette. */
export const GrainVignette: React.FC<{ variant: Variant }> = ({ variant }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          backgroundImage: NOISE, backgroundSize: "220px",
          backgroundPosition: `${(f * 37) % 220}px ${(f * 91) % 220}px`,
          opacity: variant === "light" ? 0.05 : 0.07, mixBlendMode: variant === "light" ? "multiply" : "overlay",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            variant === "light"
              ? "radial-gradient(ellipse at center, transparent 58%, rgba(35,52,86,0.10) 100%)"
              : "radial-gradient(ellipse at center, transparent 52%, rgba(6,10,20,0.42) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

/** The 5-layer stack: mesh → assets → graphics → grade → grain+vignette. */
export const SceneStack: React.FC<{ variant: Variant; assets?: React.ReactNode; children?: React.ReactNode }> = ({ variant, assets, children }) => (
  <AbsoluteFill>
    <BgMesh variant={variant} />
    {assets}
    {children}
    <Grade variant={variant} />
    <GrainVignette variant={variant} />
  </AbsoluteFill>
);
