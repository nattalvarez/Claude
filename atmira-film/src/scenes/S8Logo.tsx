import React, { useMemo } from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";
import { Scene, useGT } from "../components/Scene";
import { SceneStack } from "../components/Layers";
import { Skyline } from "../components/Skyline";
import { CueText, Tok } from "../components/CueText";
import { AtmiraLogo, ATMIRA_RATIO } from "../components/Brand";
import { lerp, prog, rng } from "../lib/anim";
import { alpha } from "../lib/color";
import { staticFile } from "remotion";
import { vo } from "../timing";

const c = theme.colors;
const LOGO_AT = 39.86;
const LW = 1020;

const TAG: Tok[] = [
  { t: "Modernizamos", at: vo(39.44) },
  { t: "y", at: vo(40.22) },
  { t: "aceleramos", at: vo(40.3), serif: true },
  { t: "los", at: vo(40.9) },
  { t: "servicios", at: vo(41.04) },
  { t: "financieros.", at: vo(41.5) },
];

const Particles: React.FC = () => {
  const gt = useGT();
  const ps = useMemo(() => {
    const r = rng(77);
    return Array.from({ length: 46 }, () => ({ x: 120 + r() * 1680, y0: 300 + r() * 700, sp: 14 + r() * 38, s: 1.5 + r() * 3, ph: r() * 6.28, hot: r() < 0.25 }));
  }, []);
  const a = prog(gt, LOGO_AT, 1.2, theme.ease.out);
  return (
    <AbsoluteFill style={{ opacity: a }}>
      {ps.map((p, i) => {
        const y = p.y0 - ((gt - LOGO_AT) * p.sp) % 800;
        return <div key={i} style={{ position: "absolute", left: p.x + Math.sin(gt + p.ph) * 14, top: ((y % 800) + 800) % 800 + 220, width: p.s, height: p.s, borderRadius: "50%", background: p.hot ? c.turq : c.ice, opacity: 0.2 + 0.5 * (0.5 + 0.5 * Math.sin(gt * 2 + p.ph)) }} />;
      })}
    </AbsoluteFill>
  );
};

const LogoLockup: React.FC = () => {
  const gt = useGT();
  const wipe = prog(gt, LOGO_AT, 1.0, theme.ease.inOut);
  const settle = prog(gt, LOGO_AT, 1.4, theme.ease.out);
  const glow = prog(gt, LOGO_AT, 1.6, theme.ease.out);
  const sweep = prog(gt, LOGO_AT + 0.7, 1.1, theme.ease.inOut);
  const breathe = 1 + Math.sin(gt * 1.1) * 0.006;
  const rule = prog(gt, vo(41.6), 1.0, theme.ease.out);
  const fadeOut = 1 - prog(gt, 47.35, 0.65, theme.ease.in);
  const top = 250;
  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 55% 38% at 50% ${((top + 140) / 1080) * 100}%, ${alpha(c.blue, 0.55 * glow)}, ${alpha(c.turq, 0.12 * glow)} 55%, transparent 75%)` }} />
      <div style={{ position: "absolute", left: (1920 - LW) / 2, top, transform: `scale(${lerp(settle, 1.07, 1) * breathe})`, transformOrigin: "50% 50%", opacity: Math.min(1, wipe * 3), filter: `blur(${lerp(settle, 16, 0)}px)`, clipPath: `inset(-20% ${(1 - wipe) * 105}% -20% -5%)` }}>
        <AtmiraLogo width={LW} />
        <div
          style={{
            position: "absolute", inset: 0, WebkitMaskImage: `url(${staticFile("logos/atmira-white.webp")})`, WebkitMaskSize: "100% 100%",
            background: `linear-gradient(100deg, transparent ${sweep * 140 - 50}%, ${alpha(c.turq, 0.95)} ${sweep * 140 - 30}%, transparent ${sweep * 140 - 10}%)`,
            mixBlendMode: "screen",
          }}
        />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: top + LW * ATMIRA_RATIO + 84, display: "flex", justifyContent: "center" }}>
        <CueText tokens={TAG} size={58} weight={500} color={c.ice} exitDur={0.01} style={{ justifyContent: "center", width: 1500, textShadow: "0 6px 40px rgba(8,14,28,0.6)" }} />
      </div>
      <div style={{ position: "absolute", left: 960 - 120 * rule, width: 240 * rule, top: top + LW * ATMIRA_RATIO + 190, height: 3, background: c.turq, boxShadow: `0 0 24px ${c.turq}`, borderRadius: 2 }} />
    </AbsoluteFill>
  );
};

export const S8Logo: React.FC = () => (
  <Scene id="s8" tail={0}>
    <SceneStack variant="dark" assets={<Skyline seed={5} riseAt={null} dusk intensity={0.95} drift={9} zoom={0.04} ground={1090} hs={0.42} blur={1.2} />}>
      <Particles />
      <LogoLockup />
    </SceneStack>
  </Scene>
);
