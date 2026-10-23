import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";
import { Scene, useGT } from "../components/Scene";
import { CueText, Tok } from "../components/CueText";
import { SirecLogo } from "../components/Brand";
import { prog } from "../lib/anim";
import { DURATION_S, gap, vw } from "../timing";

const c = theme.colors;
const AT = vw("sirec", 2) - 0.1;
const SHADOW = "0 6px 50px rgba(6,14,28,0.55)";

const TAG: Tok[] = [
  { t: "Deja", at: vw("deja") },
  { t: "que", at: vw("que") },
  { t: "el", at: vw("el", 2) },
  { t: "recobro", at: vw("recobro") },
  { t: "fluya.", at: vw("fluya"), serif: true },
];

/** Concentric ripples spreading from the logo, like a drop touching the water. */
const Ripples: React.FC = () => {
  const gt = useGT();
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      {[0, 1, 2, 3].map((i) => {
        const p = prog(gt, AT + i * 0.55, 3.2, theme.ease.out);
        return <ellipse key={i} cx={700} cy={400} rx={60 + p * 1100} ry={(60 + p * 1100) * 0.38} fill="none" stroke="#fff" strokeOpacity={(1 - p) * 0.5} strokeWidth={2.5 - p * 1.5} transform="translate(0 150)" />;
      })}
    </svg>
  );
};

const Logo: React.FC = () => {
  const gt = useGT();
  const reveal = prog(gt, AT, 1.1, theme.ease.inOut);
  const settle = prog(gt, AT, 1.8, theme.ease.out);
  const breathe = 1 + Math.sin(gt * 1.0) * 0.004;
  const R = reveal * 700;
  return (
    <div style={{ position: "absolute", left: 700 - 310, top: 120, width: 620, clipPath: `circle(${R}px at 50% 46%)`, transform: `scale(${(1.04 - 0.04 * settle) * breathe})`, filter: "drop-shadow(0 10px 50px rgba(6,14,28,0.5))" }}>
      <SirecLogo width={620} variant="white" />
    </div>
  );
};

export const Finale: React.FC = () => {
  return (
    <Scene from={gap("sirec", 1)} to={DURATION_S} tail={0} name="Logo SIREC">
      <FadeOut>
        <AbsoluteFill style={{ background: `linear-gradient(180deg, ${c.navyDeep}73 0%, ${c.navyDeep}26 48%, transparent 70%)` }} />
        <Ripples />
        <Logo />
        <CueText family="serif" tokens={TAG} size={78} exitDur={0.01} style={{ position: "absolute", left: 200, top: 760, width: 1000, justifyContent: "center", textShadow: SHADOW }} />
      </FadeOut>
    </Scene>
  );
};

const FadeOut: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const gt = useGT();
  const o = 1 - prog(gt, DURATION_S - 0.9, 0.9, theme.ease.in);
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};
