import React from "react";
import { theme } from "../theme";
import { useGT, useExit } from "./Scene";
import { prog } from "../lib/anim";

export type Tok = { t: string; at: number; serif?: boolean; color?: string; br?: boolean };

/**
 * One word = a masked slide-up (the clean, "editorial" reveal): the glyphs rise from below a clip edge,
 * no blur, no scale, no overshoot, so the text is always sharp and legible. The reveal lands on the spoken word.
 */
const Word: React.FC<{ tok: Tok; size: number; weight: number; color: string; accent: string; exit: number; family: "sans" | "serif" }> = ({ tok, size, weight, color, accent, exit, family }) => {
  const gt = useGT();
  const p = prog(gt, tok.at - 0.1, 0.55, theme.ease.out);
  const y = (1 - p) * 140 - exit * 140;
  return (
    <span style={{ display: "inline-block", clipPath: "inset(-0.3em -0.15em -0.24em -0.15em)", marginRight: size * 0.24 }}>
      <span
        style={{
          display: "inline-block",
          transform: `translateY(${y}%)`,
          fontFamily: tok.serif || family === "serif" ? theme.fonts.serif : theme.fonts.sans,
          fontStyle: tok.serif ? "italic" : "normal",
          fontWeight: tok.serif || family === "serif" ? 400 : weight,
          fontSize: family === "serif" ? size * 1.12 : tok.serif ? size * 1.1 : size,
          color: tok.color ?? (tok.serif ? accent : color),
          letterSpacing: family === "serif" ? "-0.012em" : tok.serif ? "-0.01em" : "-0.035em",
          lineHeight: 1.05,
          paddingRight: tok.serif ? "0.06em" : 0,
        }}
      >
        {tok.t}
      </span>
    </span>
  );
};

/** Headline: bold sans + one italic-serif accent word (reference style); words land exactly on their spoken cue. */
export const CueText: React.FC<{
  tokens: Tok[]; size: number; weight?: number; color?: string; accent?: string;
  style?: React.CSSProperties; exitDur?: number; exitAt?: number; family?: "sans" | "serif";
}> = ({ tokens, size, weight = 700, color = theme.colors.white, accent = theme.colors.turq, style, exitDur = 0.26, exitAt, family = "sans" }) => {
  const sceneExit = useExit(exitDur);
  const gt = useGT();
  const exit = exitAt === undefined ? sceneExit : Math.max(sceneExit, prog(gt, exitAt, 0.24, theme.ease.in));
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", ...style }}>
      {tokens.map((tok, i) => (
        <React.Fragment key={i}>
          <Word tok={tok} size={size} weight={weight} color={color} accent={accent} exit={exit} family={family} />
          {tok.br ? <div style={{ flexBasis: "100%", height: 0 }} /> : null}
        </React.Fragment>
      ))}
    </div>
  );
};
