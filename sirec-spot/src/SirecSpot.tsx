import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { ShotTrack } from "./components/ShotTrack";
import { Grade, GrainVignette } from "./components/Layers";
import { Intro1, Intro2 } from "./scenes/Intro";
import { Cycle } from "./scenes/Cycle";
import { Warn, Stages } from "./scenes/Stages";
import { Agents } from "./scenes/Agents";
import { Reach } from "./scenes/Reach";
import { Finale } from "./scenes/Finale";
import { DURATION_S, FPS } from "./timing";
import { prog } from "./lib/anim";
import { theme } from "./theme";

const Fades: React.FC = () => {
  const gt = useCurrentFrame() / FPS;
  const inn = 1 - prog(gt, 0, 1.4, theme.ease.soft);
  const out = prog(gt, DURATION_S - 0.5, 0.5, theme.ease.soft);
  return <AbsoluteFill style={{ background: theme.colors.navyDeep, opacity: Math.max(inn, out), pointerEvents: "none" }} />;
};

export const SirecSpot: React.FC<{ withAudio?: boolean }> = ({ withAudio = true }) => (
  <AbsoluteFill style={{ background: theme.colors.navyDeep }}>
    <ShotTrack />
    <Intro1 />
    <Intro2 />
    <Cycle />
    <Warn />
    <Stages />
    <Agents />
    <Reach />
    <Finale />
    <Grade variant="dark" />
    <GrainVignette variant="dark" />
    <Fades />
    {withAudio ? <Audio src={staticFile("audio/mix.wav")} /> : null}
  </AbsoluteFill>
);
