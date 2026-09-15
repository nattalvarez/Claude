import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { EASE } from "../styles/theme";

type Props = {
  /** total local duration of the scene, in frames (from SCENES.sXX.duration) */
  duration: number;
  /** how many frames the exit takes — faster than any entrance in the scene */
  exitDuration?: number;
  children: React.ReactNode;
};

/** Wraps a scene's content so it exits — fade + rise + settle — rather than hard-cutting
 * when the next Sequence takes over. Exits are always faster than entrances. */
export const SceneExit: React.FC<Props> = ({ duration, exitDuration = 12, children }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [duration - exitDuration, duration - 2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE.in),
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        opacity: 1 - p,
        transform: `translateY(${p * -24}px) scale(${1 - p * 0.03})`,
      }}
    >
      {children}
    </div>
  );
};
