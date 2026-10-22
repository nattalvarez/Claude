import React, { createContext, useContext } from "react";
import { Sequence, useCurrentFrame } from "remotion";
import { FPS, SCENES, SceneId } from "../timing";
import { prog } from "../lib/anim";
import { theme } from "../theme";

const Ctx = createContext({ start: 0, end: 1 });

/** Scene wrapper: a Sequence + context so children can read GLOBAL time / exit progress. */
export const Scene: React.FC<{ id: SceneId; tail?: number; children: React.ReactNode }> = ({ id, tail = 0.35, children }) => {
  const s = SCENES[id];
  return (
    <Sequence from={Math.round(s.start * FPS)} durationInFrames={Math.round((s.end - s.start + tail) * FPS)} name={`${id} · ${s.name}`}>
      <Ctx.Provider value={{ start: s.start, end: s.end }}>{children}</Ctx.Provider>
    </Sequence>
  );
};

/** Global time in seconds. */
export const useGT = () => {
  const { start } = useContext(Ctx);
  return start + useCurrentFrame() / FPS;
};
export const useSceneTimes = () => useContext(Ctx);

/** 0 -> 1 over the last `dur` seconds before the scene's cut (exits are faster than entrances). */
export const useExit = (dur = 0.3) => {
  const { end } = useContext(Ctx);
  const gt = useGT();
  return prog(gt, end - dur, dur, theme.ease.in);
};
