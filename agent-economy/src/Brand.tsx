import React from "react";
import { staticFile, useCurrentFrame } from "remotion";
import { LOGO } from "./config";
import { clamp, ramp } from "./engine/math";
import { ease } from "./theme";
import { pinkRect } from "./climax";

export const LOGO_BOX = { x: 80, y: 62, h: 50 };

/**
 * The mark lives on screen for the whole piece, aligned to the safe margin. Original colours on the
 * light stage; the same file turned white (brightness 0 → invert) whenever the pink surface is behind it.
 * Proportions are never touched: only height is set, width follows the file's aspect.
 */
export const Brand: React.FC = () => {
  const f = useCurrentFrame();
  if (!LOGO) return null;
  const w = LOGO_BOX.h * LOGO.aspect;
  const r = pinkRect(f);
  let white = 0;
  if (r) {
    const cx = LOGO_BOX.x + w / 2, cy = LOGO_BOX.y + LOGO_BOX.h / 2;
    const inX = cx >= r.x0 && cx <= r.x1 ? 1 : 0;
    white = inX * clamp((cy - r.y0) / 36) * clamp((r.y1 - cy) / 36);
  }
  const a = ramp(f, 6, 34, ease.out);
  const common: React.CSSProperties = {
    position: "absolute", left: LOGO_BOX.x, top: LOGO_BOX.y + (1 - a) * 10, height: LOGO_BOX.h, width: w,
  };
  const src = staticFile(LOGO.file);
  return (
    <>
      <img src={src} style={{ ...common, opacity: a * (1 - white) }} />
      {white > 0.01 && <img src={src} style={{ ...common, opacity: a * white, filter: "brightness(0) invert(1)" }} />}
    </>
  );
};
