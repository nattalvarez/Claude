import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";
import { Scene, useGT } from "../components/Scene";
import { SceneStack } from "../components/Layers";
import { Footage } from "../components/Footage";
import { CueText, Tok } from "../components/CueText";
import { lerp, prog } from "../lib/anim";
import { vw } from "../timing";

const c = theme.colors;
const HIT = vw("los");

const TOKENS: Tok[] = [
  { t: "Los", at: vw("los") },
  { t: "servicios", at: vw("servicios", 0), br: true },
  { t: "financieros", at: vw("financieros", 0), br: true },
  { t: "no", at: vw("no"), serif: true },
  { t: "esperan.", at: vw("esperan"), serif: true },
];

const Inner: React.FC = () => {
  const gt = useGT();
  // a light bar sweeps left → right and resolves into the first word
  const sweep = prog(gt, 0.1, 1.05, theme.ease.inOut);
  const sx = lerp(sweep, -8, 108);
  const fade = 1 - prog(gt, 1.0, 0.35, theme.ease.out);
  const bloom = gt >= HIT ? Math.exp(-(gt - HIT) * 6) : 0;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${sx}%`, width: 3, background: c.turq, opacity: fade, boxShadow: `0 0 40px 10px ${c.turq}88, -160px 0 120px 20px ${c.turq}22` }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 30% 35%, ${c.ice}${Math.round(bloom * 60).toString(16).padStart(2, "0")}, transparent 55%)` }} />
      <CueText tokens={TOKENS} size={168} style={{ position: "absolute", left: 120, top: 170, width: 1500, textShadow: "0 8px 50px rgba(8,14,28,0.5)" }} />
    </AbsoluteFill>
  );
};

export const S1Hook: React.FC = () => (
  <Scene id="s1">
    <SceneStack variant="dark" assets={<Footage src="s1_city_night.mp4" tint={c.blue} tintOpacity={0.8} dark={0.3} scrimLeft={0.55} zoom={[1.12, 1.0]} sat={0.9} />}>
      <Inner />
    </SceneStack>
  </Scene>
);
