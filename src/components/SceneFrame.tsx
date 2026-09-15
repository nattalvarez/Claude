import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS, EASE, TRANSITION_FRAMES } from "../styles/theme";
import { Grade, Grain, Vignette } from "./Overlays";

type Variant = "light" | "dark";

/** Every scene's outer shell: background fill, the branded iris-wipe that
 * masks each cut, and the uniform grade/grain/vignette top layers. Scenes
 * only need to build their own assets + type layers as children. */
export const SceneFrame: React.FC<{
  variant: Variant;
  nominalDuration: number;
  hasIncoming: boolean;
  hasOutgoing: boolean;
  background?: string;
  children: React.ReactNode;
}> = ({ variant, nominalDuration, hasIncoming, background, children }) => {
  const frame = useCurrentFrame();
  const bg = background ?? (variant === "light" ? COLORS.offWhite : COLORS.navy);

  // Incoming iris: fully covers at local frame 0, opens over TRANSITION_FRAMES.
  const irisRadius = hasIncoming
    ? interpolate(frame, [0, TRANSITION_FRAMES], [0, 145], {
        easing: EASE.out,
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 145;
  const irisOpacity = hasIncoming
    ? interpolate(frame, [0, TRANSITION_FRAMES * 0.7], [1, 0], {
        easing: EASE.out,
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: bg, overflow: "hidden" }}>
      {children}
      <Grade variant={variant} />
      <Grain />
      <Vignette strength={variant === "light" ? 0.14 : 0.3} />
      {hasIncoming && irisOpacity > 0.002 && (
        <AbsoluteFill
          style={{
            pointerEvents: "none",
            background: `radial-gradient(circle at 50% 50%, ${COLORS.white} 0%, ${COLORS.lightBlue} 38%, ${COLORS.turquoise} 62%, ${bg} 100%)`,
            clipPath: `circle(${irisRadius}% at 50% 50%)`,
            opacity: irisOpacity,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
