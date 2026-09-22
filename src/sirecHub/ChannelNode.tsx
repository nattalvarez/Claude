import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY } from "../styles/theme";

type Variant = "pop" | "unfold" | "satellite" | "flow";

type Props = {
  x: number;
  y: number;
  nodeFrom: number;
  labelFrom: number;
  label: string;
  icon: React.ReactNode;
  accent?: string;
  variant?: Variant;
  /** satellite variant only — extra small dots orbiting the node, each its own frame */
  satellites?: readonly number[];
  /** label placement relative to the node, so it reads toward SIREC or away from it */
  labelSide?: "right" | "left" | "top" | "bottom";
  /** external visibility multiplier (0-1), 1 by default — every channel stays
   * on screen once it appears; this only exists for the rare moment a beat
   * needs to fade something deliberately. */
  fade?: number;
};

const ICON_SIZE = 110;

/** One management channel, arriving at the end of its own connection. Four
 * variants keep the six channels from feeling like one animation repeated:
 * a snappy pop, a text that unfolds open, a node ringed by small satellites,
 * and a node that lands with an impact bounce as if just delivered by the
 * line's flow. Every one is the same size and gets the same solid label
 * card, so no channel reads as more important than another and no
 * connector line ever shows through the text. */
export const ChannelNode: React.FC<Props> = ({
  x,
  y,
  nodeFrom,
  labelFrom,
  label,
  icon,
  accent = COLORS.turquoise,
  variant = "pop",
  satellites = [],
  labelSide = "right",
  fade = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const nodeSpring =
    variant === "flow"
      ? spring({ frame: frame - nodeFrom, fps, config: { damping: 9, mass: 0.7, stiffness: 190 } }) // impact bounce
      : spring({ frame: frame - nodeFrom, fps, config: { damping: 14, mass: 0.7, stiffness: 140 } });

  const labelSpring = spring({ frame: frame - labelFrom, fps, config: { damping: 16, mass: 0.7, stiffness: 130 } });

  if (nodeSpring <= 0.001 || fade <= 0.001) return null;

  const breathe = 1 + Math.sin((frame - nodeFrom) / 34) * 0.025 * Math.min(1, nodeSpring);
  const rotateIn = variant === "pop" ? interpolate(nodeSpring, [0, 1], [-16, 0]) : 0;

  const isVertical = labelSide === "top" || labelSide === "bottom";
  const flexDirection: React.CSSProperties["flexDirection"] =
    labelSide === "left" ? "row-reverse" : labelSide === "top" ? "column-reverse" : labelSide === "bottom" ? "column" : "row";

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        display: "flex",
        flexDirection,
        alignItems: "center",
        gap: isVertical ? 18 : 22,
        opacity: fade,
      }}
    >
      <div
        style={{
          position: "relative",
          width: ICON_SIZE,
          height: ICON_SIZE,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          background: COLORS.white,
          border: `1.5px solid ${accent}77`,
          boxShadow: `0 16px 34px -12px ${COLORS.navyShadow}, 0 0 26px -8px ${accent}66`,
          opacity: interpolate(nodeSpring, [0, 1], [0, 1]),
          transform: `scale(${interpolate(nodeSpring, [0, 1], [0.5, 1]) * breathe}) rotate(${rotateIn}deg)`,
        }}
      >
        {icon}

        {variant === "satellite" &&
          satellites.map((satFrom, i) => {
            const satP = spring({ frame: frame - satFrom, fps, config: { damping: 14, mass: 0.5, stiffness: 150 } });
            const angle = -90 + i * 100;
            const r = 82;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: COLORS.navy,
                  border: `1px solid ${accent}88`,
                  opacity: interpolate(satP, [0, 1], [0, 1]),
                  transform: `translate(-50%, -50%) translate(${Math.cos((angle * Math.PI) / 180) * r}px, ${
                    Math.sin((angle * Math.PI) / 180) * r
                  }px) scale(${interpolate(satP, [0, 1], [0.3, 1])})`,
                }}
              />
            );
          })}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          overflow: variant === "unfold" ? "hidden" : "visible",
          maxWidth: variant === "unfold" ? interpolate(labelSpring, [0, 1], [0, 230]) : undefined,
          opacity: variant === "unfold" ? 1 : interpolate(labelSpring, [0, 1], [0, 1]),
          transform:
            variant === "unfold"
              ? undefined
              : `translate(${labelSide === "left" ? interpolate(labelSpring, [0, 1], [14, 0]) : labelSide === "right" ? interpolate(labelSpring, [0, 1], [-14, 0]) : 0}px, ${
                  labelSide === "top" ? interpolate(labelSpring, [0, 1], [10, 0]) : labelSide === "bottom" ? interpolate(labelSpring, [0, 1], [-10, 0]) : 0
                }px)`,
        }}
      >
        {/* A solid card behind every label — nothing behind it (a connector
         * line, another node's halo) can ever show through the text. Every
         * card wraps to two lines at the same narrow width, whichever side
         * it sits on: two adjacent hexagon vertices only 60° apart need
         * narrow cards, not wide single-line ones, to clear each other, and
         * it keeps all six channels reading as the same size and weight. */}
        <div
          style={{
            background: COLORS.white,
            borderRadius: 14,
            padding: "10px 18px",
            boxShadow: `0 14px 30px -12px ${COLORS.navyShadow}, 0 0 0 1.5px ${accent}3D`,
            whiteSpace: "normal",
            maxWidth: 220,
          }}
        >
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontWeight: 700,
              fontSize: 27,
              color: COLORS.navy,
              textAlign: "center",
              display: "block",
              whiteSpace: "normal",
            }}
          >
            {label}
          </span>
        </div>
      </div>
    </div>
  );
};
