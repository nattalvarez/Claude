import React, { createContext, useContext } from "react";
import { Sequence, useCurrentFrame } from "remotion";
import { FPS } from "../timing";
import { prog } from "../lib/anim";
import { theme } from "../theme";

const Ctx = createContext({ start: 0, end: 1 });

/** A graphics window [from, to] in GLOBAL seconds: a Sequence + context so children read global time / exit progress. */
export const Scene: React.FC<{ from: number; to: number; tail?: number; name?: string; children: React.ReactNode }> = ({ from, to, tail = 0.4, name, children }) => (
  <Sequence from={Math.round(from * FPS)} durationInFrames={Math.max(1, Math.round((to - from + tail) * FPS))} name={name}>
    <Ctx.Provider value={{ start: from, end: to }}>{children}</Ctx.Provider>
  </Sequence>
);

/** Global time in seconds. */
export const useGT = () => {
  const { start } = useContext(Ctx);
  return start + useCurrentFrame() / FPS;
};
export const useSceneTimes = () => useContext(Ctx);

/** 0 → 1 over the last `dur` seconds before the window ends. */
export const useExit = (dur = 0.3) => {
  const { end } = useContext(Ctx);
  const gt = useGT();
  return prog(gt, end - dur, dur, theme.ease.in);
};
