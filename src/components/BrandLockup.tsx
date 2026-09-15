import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { AxolotlMark } from "./AxolotlMark";
import { Wordmark } from "./Wordmark";

type Props = {
  from: number;
  direction?: "stacked" | "inline";
  iconSize?: number;
  wordmarkSize?: number;
  /** >1 draws the mark faster for a more compact reveal window */
  speed?: number;
};

/** Full brand lockup — the axolotl mark plus the "sirec" wordmark. The mark draws itself
 * on; the wordmark springs in right after, once the mark has resolved. */
export const BrandLockup: React.FC<Props> = ({ from, direction = "stacked", iconSize = 130, wordmarkSize = 88, speed = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const wordmarkFrom = from + 34 / speed;

  const containerAppear = spring({ frame: frame - from, fps, config: { damping: 18, mass: 0.8, stiffness: 90 } });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: direction === "stacked" ? "column" : "row",
        alignItems: "center",
        gap: direction === "stacked" ? 4 : 22,
        opacity: interpolate(containerAppear, [0, 1], [0, 1]),
      }}
    >
      <AxolotlMark from={from} size={iconSize} speed={speed} />
      <Wordmark from={wordmarkFrom} fontSize={wordmarkSize} />
    </div>
  );
};
