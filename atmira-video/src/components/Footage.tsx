import React from "react";
import { AbsoluteFill, Loop, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import clips from "../footage.json";

type Clip = keyof typeof clips;
export type Tone = "dark" | "magenta" | "light";

/**
 * Real stock footage (Mixkit, free licence) as the asset layer.
 * Every clip is graded into the Atmira look: dark + magenta cast, or a magenta duotone.
 */
export const Footage: React.FC<{
  id: Clip | `${Clip}`;
  tone?: Tone;
  opacity?: number;
  startFrom?: number;
  zoom?: number;
  scrim?: "left" | "full" | "bottom" | "none";
  style?: React.CSSProperties;
}> = ({ id, tone = "dark", opacity = 1, startFrom = 0, zoom = 1.08, scrim = "full", style }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const clipFrames = (clips as Record<string, { frames: number }>)[id].frames;
  const t = interpolate(frame, [0, durationInFrames], [0, 1], { easing: theme.ease.inOut });
  const scale = 1 + (zoom - 1) * t;
  const usable = clipFrames - startFrom;

  const video = (
    <OffthreadVideo
      src={staticFile(`footage/${id}.mp4`)}
      muted
      startFrom={startFrom}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        filter:
          tone === "dark"
            ? "saturate(1.0) contrast(1.06) brightness(0.95)"
            : tone === "magenta"
              ? "grayscale(1) contrast(1.2) brightness(0.95)"
              : "grayscale(0.2) contrast(1.05) brightness(1.05)",
        mixBlendMode: tone === "magenta" ? "multiply" : tone === "light" ? "multiply" : "normal",
      }}
    />
  );

  return (
    <AbsoluteFill
      style={{
        opacity,
        background: tone === "magenta" ? theme.colors.hero : "transparent",
        overflow: "hidden",
        ...style,
      }}
    >
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        {durationInFrames > usable ? <Loop durationInFrames={usable}>{video}</Loop> : video}
      </AbsoluteFill>
      {tone === "dark" && (
        <>
          <AbsoluteFill style={{ background: theme.colors.hero, mixBlendMode: "soft-light", opacity: 0.16 }} />
        </>
      )}
      {tone === "magenta" && (
        <AbsoluteFill style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.0), rgba(60,0,35,0.55))" }} />
      )}
      {scrim === "left" && (
        <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(11,7,9,0.86) 0%, rgba(11,7,9,0.66) 45%, rgba(11,7,9,0) 92%)" }} />
      )}
      {scrim === "full" && <AbsoluteFill style={{ background: "rgba(11,7,9,0.28)" }} />}
      {scrim === "bottom" && (
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(11,7,9,0.2) 0%, rgba(11,7,9,0.1) 40%, rgba(11,7,9,0.85) 100%)" }} />
      )}
    </AbsoluteFill>
  );
};
