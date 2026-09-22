import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY } from "../styles/theme";
import { KineticText } from "./KineticText";

type Props = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  from: number;
  align?: "left" | "center";
  maxWidth?: number;
  titleSize?: number;
  accent?: string;
};

/** The standard title/subtitle/description stack used across every service scene —
 * eyebrow label snaps in first, then the title (big, navy), then the subtitle
 * (accent-colored, medium), then one short descriptive line. Kept inside the safe area
 * by the caller via x/y placement. */
export const TitleBlock: React.FC<Props> = ({
  eyebrow,
  title,
  subtitle,
  description,
  from,
  align = "left",
  maxWidth = 620,
  titleSize = 64,
  accent = COLORS.turquoise,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const eyebrowAppear = spring({ frame: frame - from, fps, config: { damping: 16, mass: 0.6, stiffness: 140 } });

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: align === "center" ? "center" : "flex-start", maxWidth }}>
      {eyebrow && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 18,
            opacity: eyebrowAppear,
            transform: `translateY(${interpolate(eyebrowAppear, [0, 1], [10, 0])}px)`,
          }}
        >
          <div style={{ width: 28, height: 2, background: accent }} />
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontWeight: 500,
              fontSize: 20,
              letterSpacing: 3,
              color: accent,
            }}
          >
            {eyebrow.toUpperCase()}
          </span>
        </div>
      )}

      {title && (
        <KineticText
          parts={[{ text: title }]}
          from={from + 6}
          fontSize={titleSize}
          fontWeight={700}
          color={COLORS.navy}
          align={align}
          letterSpacing={-1}
          lineHeight={1.05}
          maxWidth={maxWidth}
        />
      )}

      {subtitle && (
        <div style={{ marginTop: 14 }}>
          <KineticText
            parts={[{ text: subtitle }]}
            from={from + 16}
            fontSize={28}
            fontWeight={500}
            color={accent}
            align={align}
            maxWidth={maxWidth}
          />
        </div>
      )}

      {description && (
        <div style={{ marginTop: 20 }}>
          <KineticText
            parts={[{ text: description }]}
            from={from + 24}
            wordStagger={1}
            fontSize={24}
            fontWeight={400}
            color={COLORS.blue}
            align={align}
            lineHeight={1.4}
            maxWidth={maxWidth}
          />
        </div>
      )}
    </div>
  );
};
