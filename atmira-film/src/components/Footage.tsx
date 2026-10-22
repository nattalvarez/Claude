import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { FPS } from "../timing";
import { useSceneTimes } from "./Scene";

const c = theme.colors;

/**
 * Real stock footage (Mixkit, free licence) graded into the brand look:
 * desaturate → tint with a brand colour via the `color` blend mode → darken with navy → optional left scrim for text.
 */
export const Footage: React.FC<{
  src: string; startFrom?: number; tint?: string; tintOpacity?: number; dark?: number; darkColor?: string;
  scrimLeft?: number; sat?: number; contrast?: number; bright?: number; blur?: number; zoom?: [number, number];
  opacity?: number; wash?: number; washColor?: string; origin?: string;
}> = ({ src, startFrom = 0, tint = c.blue, tintOpacity = 0.7, dark = 0.3, darkColor = c.navyDeep, scrimLeft = 0, sat = 0.85, contrast = 1.08, bright = 0.95, blur = 0, zoom = [1.0, 1.08], opacity = 1, wash = 0, washColor = c.paper, origin = "center center" }) => {
  const f = useCurrentFrame();
  const { start, end } = useSceneTimes();
  const n = (end - start + 0.4) * FPS;
  const z = interpolate(f, [0, n], zoom, { easing: theme.ease.soft, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity, overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile(`footage/${src}`)}
        startFrom={Math.round(startFrom * FPS)}
        muted
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})`, transformOrigin: origin, filter: `saturate(${sat}) contrast(${contrast}) brightness(${bright})${blur ? ` blur(${blur}px)` : ""}` }}
      />
      {tintOpacity > 0 ? <AbsoluteFill style={{ background: tint, mixBlendMode: "color", opacity: tintOpacity }} /> : null}
      {dark > 0 ? <AbsoluteFill style={{ background: darkColor, opacity: dark }} /> : null}
      {scrimLeft > 0 ? <AbsoluteFill style={{ background: `linear-gradient(95deg, ${c.navyDeep}${Math.round(scrimLeft * 255).toString(16).padStart(2, "0")} 0%, ${c.navyDeep}00 62%)` }} /> : null}
      {wash > 0 ? <AbsoluteFill style={{ background: washColor, opacity: wash }} /> : null}
    </AbsoluteFill>
  );
};
