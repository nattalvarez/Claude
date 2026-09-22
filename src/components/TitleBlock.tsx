import React from "react";
import { COLORS } from "../styles/theme";
import { KineticText } from "./KineticText";

type Props = {
  title?: string;
  subtitle?: string;
  description?: string;
  from: number;
  align?: "left" | "center";
  maxWidth?: number;
  titleSize?: number;
  accent?: string;
};

/** The standard title/subtitle/description stack used across every service scene — the
 * title (big, navy) leads, then the subtitle (accent-colored, medium), then one short
 * descriptive line. No eyebrow/kicker row: that generic "— LABEL" convention reads as
 * templated stock-motion-graphics, so the title itself does the work of announcing the
 * scene. Kept inside the safe area by the caller via x/y placement. */
export const TitleBlock: React.FC<Props> = ({
  title,
  subtitle,
  description,
  from,
  align = "left",
  maxWidth = 620,
  titleSize = 64,
  accent = COLORS.turquoise,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: align === "center" ? "center" : "flex-start", maxWidth }}>
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
