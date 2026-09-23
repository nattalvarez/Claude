import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY } from "../styles/theme";

export type ChannelVariant = "pop" | "unfold" | "flow";
export type LabelSide = "right" | "left" | "top" | "bottom";

type Props = {
  x: number;
  y: number;
  nodeFrom: number;
  labelFrom: number;
  label: string;
  icon: React.ReactNode;
  accent?: string;
  variant?: ChannelVariant;
  /** which side the card leans toward as it settles in — a small entrance
   * direction only, not a layout split; the card itself always sits
   * centered on the node's point. */
  labelSide?: LabelSide;
  /** external visibility multiplier (0-1), 1 by default — every channel stays
   * on screen once it appears; this only exists for the rare moment a beat
   * needs to fade something deliberately. */
  fade?: number;
};

// One fixed, well-defined size for every channel card — same icon badge,
// same padding, same text size — so all six read as equally important and
// nothing has to be eyeballed per-channel.
const BADGE_SIZE = 40;
const CARD_MAX_WIDTH = 210;
const CARD_FONT_SIZE = 23;

/** One management channel, arriving at the end of its own connection. Icon
 * and label live inside the same solid card — a small accent-tinted badge
 * beside the text — so nothing ever floats separately and no connector
 * line can show through it. Three variants keep the six channels from
 * feeling like one animation repeated: a snappy pop, a card that unfolds
 * open, and a card that lands with an impact bounce as if just delivered
 * by the line's flow. */
export const ChannelNode: React.FC<Props> = ({
  x,
  y,
  nodeFrom,
  labelFrom,
  label,
  icon,
  accent = COLORS.turquoise,
  variant = "pop",
  labelSide = "right",
  fade = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const nodeSpring =
    variant === "flow"
      ? spring({ frame: frame - nodeFrom, fps, config: { damping: 9, mass: 0.7, stiffness: 190 } }) // impact bounce
      : spring({ frame: frame - nodeFrom, fps, config: { damping: 14, mass: 0.7, stiffness: 140 } });

  const textSpring = spring({ frame: frame - labelFrom, fps, config: { damping: 16, mass: 0.7, stiffness: 130 } });

  if (nodeSpring <= 0.001 || fade <= 0.001) return null;

  const breathe = 1 + Math.sin((frame - nodeFrom) / 34) * 0.025 * Math.min(1, nodeSpring);
  const rotateIn = variant === "pop" ? interpolate(nodeSpring, [0, 1], [-10, 0]) : 0;

  const enterX = labelSide === "left" ? interpolate(nodeSpring, [0, 1], [18, 0]) : labelSide === "right" ? interpolate(nodeSpring, [0, 1], [-18, 0]) : 0;
  const enterY = labelSide === "top" ? interpolate(nodeSpring, [0, 1], [14, 0]) : labelSide === "bottom" ? interpolate(nodeSpring, [0, 1], [-14, 0]) : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) translate(${enterX}px, ${enterY}px) scale(${interpolate(nodeSpring, [0, 1], [0.6, 1]) * breathe}) rotate(${rotateIn}deg)`,
        opacity: interpolate(nodeSpring, [0, 1], [0, 1]) * fade,
      }}
    >
      {/* A single solid card holding both icon and label — nothing behind
       * it (a connector line, another node's halo) can ever show through,
       * and every card wraps to the same narrow width so two adjacent
       * hexagon vertices only 60° apart still clear each other. */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: COLORS.white,
          borderRadius: 14,
          padding: "9px 16px 9px 9px",
          boxShadow: `0 14px 30px -12px ${COLORS.navyShadow}, 0 0 0 1.5px ${accent}3D`,
          maxWidth: variant === "unfold" ? interpolate(nodeSpring, [0, 1], [BADGE_SIZE + 18, CARD_MAX_WIDTH]) : CARD_MAX_WIDTH,
          overflow: variant === "unfold" ? "hidden" : "visible",
        }}
      >
        <div
          style={{
            width: BADGE_SIZE,
            height: BADGE_SIZE,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            background: `${accent}1F`,
            border: `1.5px solid ${accent}77`,
          }}
        >
          {icon}
        </div>

        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: 700,
            fontSize: CARD_FONT_SIZE,
            color: COLORS.navy,
            textAlign: "left",
            display: "block",
            whiteSpace: "normal",
            opacity: interpolate(textSpring, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(textSpring, [0, 1], [8, 0])}px)`,
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
};
