import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, FONT, SPRING } from "../theme";
import { MiniIcon } from "./Icons";

export type CardVariant = "slideL" | "slideR" | "slideUp" | "slideDown" | "pop" | "mask";

export const ServiceCard: React.FC<{
  id: string;
  title: string;
  kicker?: string;
  desc: string;
  x: number;
  y: number;
  w?: number;
  revealFrame: number;
  variant?: CardVariant;
  big?: boolean;
}> = ({ id, title, kicker, desc, x, y, w = 620, revealFrame, variant = "pop", big = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - revealFrame, fps, config: SPRING.smooth });
  if (p <= 0.001) return null;

  let tx = 0;
  let ty = 0;
  let scale = interpolate(p, [0, 1], [0.9, 1]);
  let clip = "inset(0% 0% 0% 0%)";

  if (variant === "slideL") tx = interpolate(p, [0, 1], [-70, 0]);
  if (variant === "slideR") tx = interpolate(p, [0, 1], [70, 0]);
  if (variant === "slideUp") ty = interpolate(p, [0, 1], [50, 0]);
  if (variant === "slideDown") ty = interpolate(p, [0, 1], [-50, 0]);
  if (variant === "pop") scale = interpolate(p, [0, 1], [0.72, 1]);
  if (variant === "mask") clip = `inset(0% ${interpolate(p, [0, 1], [100, 0])}% 0% 0%)`;

  const breathe = 1 + Math.sin((frame - revealFrame) / 50) * 0.008;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        transform: `translate(-50%, -50%) translate(${tx}px, ${ty}px) scale(${scale * breathe})`,
        opacity: p,
      }}
    >
      <div
        style={{
          background: COLORS.white,
          borderRadius: 22,
          boxShadow: `0 26px 60px -22px ${COLORS.shadow}, 0 0 0 1px ${COLORS.navyHair}`,
          padding: big ? "26px 34px" : "20px 28px",
          display: "flex",
          alignItems: "center",
          gap: 22,
          clipPath: clip,
        }}
      >
        <div style={{ flexShrink: 0, width: 84, height: 84, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <MiniIcon id={id} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: big ? 26 : 23, color: COLORS.navy, letterSpacing: -0.3, whiteSpace: "nowrap" }}>
              {title}
            </span>
            {kicker && (
              <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 14, color: COLORS.blue, whiteSpace: "nowrap" }}>{kicker}</span>
            )}
          </div>
          <span style={{ fontFamily: FONT, fontWeight: 400, fontSize: 16, color: COLORS.navySoft, lineHeight: 1.35 }}>{desc}</span>
        </div>
      </div>
    </div>
  );
};
