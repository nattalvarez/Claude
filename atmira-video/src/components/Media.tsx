import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

/** Slow push + drift on a still. Every image in the film goes through this. */
export const KenBurns: React.FC<{
  src: string;
  style?: React.CSSProperties;
  zoomTo?: number;
  from?: number;
  panX?: number;
  panY?: number;
  origin?: string;
}> = ({ src, style, zoomTo = 1.1, from = 1, panX = -30, panY = 0, origin = "50% 50%" }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = interpolate(frame, [0, durationInFrames], [0, 1], { easing: theme.ease.inOut });
  const scale = from + (zoomTo - from) * t;
  return (
    <Img
      src={staticFile(src)}
      style={{
        transform: `scale(${scale}) translate(${panX * t}px, ${panY * t}px)`,
        transformOrigin: origin,
        ...style,
      }}
    />
  );
};
