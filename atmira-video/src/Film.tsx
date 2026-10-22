import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { SCENES } from "./theme";
import timeline from "./timeline.json";
import { Grain, Vignette } from "./components/kit";
import { Cuts, CutDef } from "./components/Cuts";
import { Hook } from "./scenes/S01Hook";
import { Title } from "./scenes/S02Title";
import { Modernizar } from "./scenes/S03Modernizar";
import { Moves } from "./scenes/S04Moves";
import { Platform } from "./scenes/S05Platform";
import { Accel } from "./scenes/S06Accel";
import { Special } from "./scenes/S07Special";
import { Cases } from "./scenes/S08Cases";
import { Clients } from "./scenes/S09Clients";
import { Close } from "./scenes/S10Close";

const S = SCENES;

export const CUTS = timeline.cuts as CutDef[];

// Voice-over windows (frames) — the music bed ducks while the narrator speaks.
const VO = timeline.vo;
const MUSIC = 0.62;
const DUCKED = 0.3;
const musicVolume = (f: number) => {
  let d = 0;
  for (const v of VO) {
    d = Math.max(d, Math.min(1, Math.max(0, Math.min((f - (v.at - 8)) / 10, (v.at + v.dur + 12 - f) / 14))));
  }
  return MUSIC + (DUCKED - MUSIC) * d;
};

export const Film: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Sequence from={S.hook.from} durationInFrames={S.hook.dur}><Hook /></Sequence>
    <Sequence from={S.title.from} durationInFrames={S.title.dur}><Title /></Sequence>
    <Sequence from={S.modernizar.from} durationInFrames={S.modernizar.dur}><Modernizar /></Sequence>
    <Sequence from={S.moves.from} durationInFrames={S.moves.dur}><Moves /></Sequence>
    <Sequence from={S.platform.from} durationInFrames={S.platform.dur}><Platform /></Sequence>
    <Sequence from={S.accel.from} durationInFrames={S.accel.dur}><Accel /></Sequence>
    <Sequence from={S.special.from} durationInFrames={S.special.dur}><Special /></Sequence>
    <Sequence from={S.cases.from} durationInFrames={S.cases.dur}><Cases /></Sequence>
    <Sequence from={S.clients.from} durationInFrames={S.clients.dur}><Clients /></Sequence>
    <Sequence from={S.close.from} durationInFrames={S.close.dur}><Close /></Sequence>
    <Audio src={staticFile("sfx/music.mp3")} volume={musicVolume} />
    <Audio src={staticFile("sfx/fx.mp3")} volume={0.55} />
    {VO.map((v) => (
      <Sequence key={v.src} from={v.at} durationInFrames={v.dur}>
        <Audio src={staticFile(v.src)} volume={1} />
      </Sequence>
    ))}
    <Cuts cuts={CUTS} />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
