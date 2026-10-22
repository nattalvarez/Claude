import React, { useMemo } from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { theme } from "../theme";
import { Scene, useGT } from "../components/Scene";
import { SceneStack } from "../components/Layers";
import { Footage } from "../components/Footage";
import { CueText, Tok } from "../components/CueText";
import { AtmiraLogo, ATMIRA_RATIO } from "../components/Brand";
import { lerp, prog, rng } from "../lib/anim";
import { alpha } from "../lib/color";
import { vw, vwe } from "../timing";

const c = theme.colors;
const LOGO_AT = vw("atmira", 1) - 0.05;
const LW = 1020;

const TAG: Tok[] = [
  { t: "Modernizamos", at: vw("modernizamos", 1) },
  { t: "y", at: vw("aceleramos", 1, -1) },
  { t: "aceleramos", at: vw("aceleramos", 1), serif: true },
  { t: "los", at: vw("aceleramos", 1, 1) },
  { t: "servicios", at: vw("servicios", 2) },
  { t: "financieros.", at: vw("financieros", 1) },
];

const Particles: React.FC = () => {
  const gt = useGT();
  const ps = useMemo(() => {
    const r = rng(77);
    return Array.from({ length: 34 }, () => ({ x: 120 + r() * 1680, y0: 300 + r() * 700, sp: 14 + r() * 38, s: 1.5 + r() * 3, ph: r() * 6.28, hot: r() < 0.25 }));
  }, []);
  const a = prog(gt, LOGO_AT, 1.2, theme.ease.out);
  return (
    <AbsoluteFill style={{ opacity: a }}>
      {ps.map((p, i) => {
        const y = p.y0 - ((gt - LOGO_AT) * p.sp) % 800;
        return <div key={i} style={{ position: "absolute", left: p.x + Math.sin(gt + p.ph) * 14, top: ((y % 800) + 800) % 800 + 220, width: p.s, height: p.s, borderRadius: "50%", background: p.hot ? c.turq : c.ice, opacity: 0.15 + 0.4 * (0.5 + 0.5 * Math.sin(gt * 2 + p.ph)) }} />;
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
  const breathe = 1 + Math.sin(gt * 1.1) * 0.005;
  const rule = prog(gt, vw("financieros", 1) - 0.4, 1.0, theme.ease.out);
  const fadeOut = 1 - prog(gt, 47.4, 0.6, theme.ease.in);
  const top = 250;
  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 55% 38% at 50% ${((top + 140) / 1080) * 100}%, ${alpha(c.navyDeep, 0.55 * glow)}, transparent 75%)` }} />
      <div style={{ position: "absolute", left: (1920 - LW) / 2, top, transform: `scale(${lerp(settle, 1.04, 1) * breathe})`, transformOrigin: "50% 50%", opacity: Math.min(1, wipe * 4), clipPath: `inset(-20% ${(1 - wipe) * 105}% -20% -5%)` }}>
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
        <CueText tokens={TAG} size={58} weight={500} color={c.ice} exitDur={0.01} style={{ justifyContent: "center", width: 1500, textShadow: "0 6px 40px rgba(8,14,28,0.7)" }} />
      </div>
      <div style={{ position: "absolute", left: 960 - 120 * rule, width: 240 * rule, top: top + LW * ATMIRA_RATIO + 190, height: 3, background: c.turq, boxShadow: `0 0 24px ${c.turq}`, borderRadius: 2 }} />
    </AbsoluteFill>
  );
};

export const S8Logo: React.FC = () => (
  <Scene id="s8" tail={0}>
    <SceneStack variant="dark" assets={<Footage src="s8_dusk_skyline.mp4" tint={c.blue} tintOpacity={0.6} dark={0.3} sat={0.9} zoom={[1.28, 1.36]} origin="0% 60%" />}>
      <Particles />
      <LogoLockup />
    </SceneStack>
  </Scene>
);
