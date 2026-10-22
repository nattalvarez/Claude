import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";
import { Scene, useGT } from "../components/Scene";
import { SceneStack } from "../components/Layers";
import { Skyline } from "../components/Skyline";
import { CueText, Eyebrow, Tok } from "../components/CueText";
import { lerp, prog } from "../lib/anim";
import { vo } from "../timing";

const c = theme.colors;
const HIT = 1.2;

const TOKENS: Tok[] = [
  { t: "Los", at: vo(0.1) },
  { t: "servicios", at: vo(0.24), br: true },
  { t: "financieros", at: vo(0.7), br: true },
  { t: "no", at: vo(1.5), serif: true },
  { t: "esperan.", at: vo(1.66), serif: true },
];

const Inner: React.FC = () => {
  const gt = useGT();
  // light-bar scan sweeps left → right, resolving into the first word
  const sweep = prog(gt, 0.1, 1.05, theme.ease.inOut);
  const sx = lerp(sweep, -8, 108);
  const fade = 1 - prog(gt, 1.0, 0.35, theme.ease.out);
  const bloom = gt >= HIT ? Math.exp(-(gt - HIT) * 6) : 0;
  const punch = 1 + 0.03 * bloom;
  return (
    <AbsoluteFill style={{ transform: `scale(${punch})` }}>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${sx}%`, width: 3, background: c.turq, opacity: fade, boxShadow: `0 0 40px 10px ${c.turq}88, -160px 0 120px 20px ${c.turq}22` }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 30% 35%, ${c.ice}${Math.round(bloom * 70).toString(16).padStart(2, "0")}, transparent 55%)` }} />
      <Eyebrow text="Servicios financieros" at={0.45} style={{ position: "absolute", left: 124, top: 120 }} />
      <CueText tokens={TOKENS} size={168} style={{ position: "absolute", left: 120, top: 196, width: 1500, textShadow: "0 8px 50px rgba(8,14,28,0.55)" }} />
    </AbsoluteFill>
  );
};

export const S1Hook: React.FC = () => (
  <Scene id="s1">
    <SceneStack variant="dark" assets={<Skyline seed={0} riseAt={0.0} riseDur={1.0} drift={34} zoom={0.08} dusk />}>
      <Inner />
    </SceneStack>
  </Scene>
);
