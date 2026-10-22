import React from "react";
import { theme } from "../theme";
import { useGT, useExit } from "./Scene";
import { lerp, prog, spr } from "../lib/anim";

export type Tok = { t: string; at: number; serif?: boolean; color?: string; br?: boolean };

const Word: React.FC<{ tok: Tok; size: number; weight: number; color: string; accent: string; exit: number; idx: number }> = ({ tok, size, weight, color, accent, exit, idx }) => {
  const gt = useGT();
  const p = spr(gt, tok.at, theme.spring.snappy, 2);
  const ex = exit;
  const y = lerp(p, 38, 0) - ex * 30;
  const blur = lerp(p, 14, 0) + ex * 8;
  return (
    <span
      style={{
        display: "inline-block",
        opacity: Math.min(1, p * 1.4) * (1 - ex),
        transform: `translateY(${y}px) scale(${lerp(p, 0.94, 1)})`,
        filter: `blur(${blur}px)`,
        fontFamily: tok.serif ? theme.fonts.serif : theme.fonts.sans,
        fontStyle: tok.serif ? "italic" : "normal",
        fontWeight: tok.serif ? 400 : weight,
        fontSize: tok.serif ? size * 1.1 : size,
        color: tok.color ?? (tok.serif ? accent : color),
        letterSpacing: tok.serif ? "-0.01em" : "-0.035em",
        lineHeight: 1.02,
        marginRight: size * 0.24,
        transitionDelay: `${idx}ms`,
      }}
    >
      {tok.t}
    </span>
  );
};

/** Headline whose words land exactly on their spoken cue. Bold sans + one italic-serif accent word (reference style). */
export const CueText: React.FC<{
  tokens: Tok[]; size: number; weight?: number; color?: string; accent?: string;
  style?: React.CSSProperties; exitDur?: number; exitAt?: number;
}> = ({ tokens, size, weight = 700, color = theme.colors.white, accent = theme.colors.turq, style, exitDur = 0.28, exitAt }) => {
  const sceneExit = useExit(exitDur);
  const gt = useGT();
  const exit = exitAt === undefined ? sceneExit : Math.max(sceneExit, prog(gt, exitAt, 0.22, theme.ease.in));
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", ...style }}>
      {tokens.map((tok, i) => (
        <React.Fragment key={i}>
          <Word tok={tok} size={size} weight={weight} color={color} accent={accent} exit={exit} idx={i} />
          {tok.br ? <div style={{ flexBasis: "100%", height: 0 }} /> : null}
        </React.Fragment>
      ))}
    </div>
  );
};

/** Mono eyebrow label with a line that draws in. */
export const Eyebrow: React.FC<{ text: string; at: number; color?: string; lineColor?: string; style?: React.CSSProperties }> = ({ text, at, color = theme.colors.turq, lineColor, style }) => {
  const gt = useGT();
  const ex = useExit(0.2);
  const p = spr(gt, at, theme.spring.smooth, 0);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: p * (1 - ex), transform: `translateX(${lerp(p, -24, 0)}px)`, ...style }}>
      <div style={{ width: 54 * p, height: 2, background: lineColor ?? color }} />
      <span style={{ fontFamily: theme.fonts.mono, fontWeight: 600, fontSize: 24, letterSpacing: "0.28em", color, textTransform: "uppercase" }}>{text}</span>
    </div>
  );
};
