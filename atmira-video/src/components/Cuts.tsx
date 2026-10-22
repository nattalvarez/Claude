import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../theme";

export type CutKind = "wipe" | "wipeDark" | "flash" | "slices" | "slicesDark";
export type CutDef = { at: number; kind: CutKind };

const clampOpts = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const e = theme.ease.inOut;
const prog = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { easing: e, ...clampOpts });

const SKEW = 16;

/** One slanted panel: covers left→right before `at`, uncovers left→right after. */
const Panel: React.FC<{ f: number; at: number; lead: number; color: string }> = ({ f, at, lead, color }) => {
  const cover = prog(f, at - 10 + lead, at - 2 + lead);
  const uncover = prog(f, at + lead, at + 8 + lead);
  if (f < at - 12 || f > at + 14) return null;
  const xr = -SKEW + cover * (100 + SKEW * 2);
  const xl = -SKEW + uncover * (100 + SKEW * 2);
  return (
    <AbsoluteFill
      style={{
        background: color,
        clipPath: `polygon(${xl}% 0, ${xr}% 0, ${xr - SKEW}% 100%, ${xl - SKEW}% 100%)`,
      }}
    />
  );
};

const Slices: React.FC<{ f: number; at: number; dark: boolean }> = ({ f, at, dark }) => {
  const n = 6;
  if (f < at - 12 || f > at + 14) return null;
  return (
    <AbsoluteFill>
      {Array.from({ length: n }).map((_, i) => {
        const dir = i % 2 === 0 ? 1 : -1;
        const cover = prog(f, at - 10 + i, at - 3 + i * 0.5);
        const uncover = prog(f, at + 1 + (n - i) * 0.6, at + 9 + (n - i) * 0.6);
        // cover from one side, leave through the other
        const x = dir === 1 ? -100 + cover * 100 + uncover * 100 : 100 - cover * 100 - uncover * 100;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: `${(100 / n) * i}%`,
              height: `${100 / n + 0.4}%`,
              background: i % 2 === 0 ? theme.colors.hero : dark ? theme.colors.bg : "#FFFFFF",
              transform: `translateX(${x}%)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const Cuts: React.FC<{ cuts: CutDef[] }> = ({ cuts }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {cuts.map((c) => {
        if (f < c.at - 14 || f > c.at + 16) return null;
        if (c.kind === "flash") {
          const o =
            interpolate(f, [c.at - 4, c.at], [0, 1], { easing: theme.ease.in, ...clampOpts }) *
            interpolate(f, [c.at, c.at + 7], [1, 0], { easing: theme.ease.out, ...clampOpts });
          return <AbsoluteFill key={c.at} style={{ background: "#fff", opacity: o }} />;
        }
        if (c.kind === "slices" || c.kind === "slicesDark")
          return <Slices key={c.at} f={f} at={c.at} dark={c.kind === "slicesDark"} />;
        const second = c.kind === "wipeDark" ? theme.colors.bg : "#FFFFFF";
        return (
          <React.Fragment key={c.at}>
            <Panel f={f} at={c.at} lead={2} color={second} />
            <Panel f={f} at={c.at} lead={0} color={theme.colors.hero} />
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
