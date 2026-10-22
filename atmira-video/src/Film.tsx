import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { SCENES, BAR } from "./theme";
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

// Every cut is on a bar line (scene boundaries + in-scene beat changes).
export const CUTS: CutDef[] = [
  { at: S.hook.from + BAR * 1.5, kind: "flash" },
  { at: S.title.from, kind: "slices" },
  { at: S.modernizar.from, kind: "wipeDark" },
  // S3 intro → four gains (each one bar)
  { at: S.modernizar.from + BAR * 2, kind: "flash" },
  { at: S.modernizar.from + BAR * 3, kind: "wipeDark" },
  { at: S.modernizar.from + BAR * 4, kind: "flash" },
  { at: S.modernizar.from + BAR * 5, kind: "wipeDark" },
  { at: S.moves.from, kind: "slicesDark" },
  { at: S.platform.from, kind: "wipe" },
  { at: S.accel.from, kind: "wipeDark" },
  { at: S.accel.from + BAR * 2, kind: "slicesDark" },
  { at: S.accel.from + BAR * 5, kind: "wipeDark" },
  { at: S.accel.from + BAR * 7, kind: "flash" },
  { at: S.special.from, kind: "slicesDark" },
  { at: S.special.from + BAR * 2, kind: "wipeDark" },
  { at: S.special.from + BAR * 3.5, kind: "slicesDark" },
  { at: S.cases.from, kind: "wipeDark" },
  { at: S.clients.from, kind: "wipe" },
  { at: S.close.from, kind: "slicesDark" },
  { at: S.close.from + BAR * 3, kind: "wipe" },
];

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
    <Audio src={staticFile("sfx/soundtrack.mp3")} volume={0.7} />
    <Cuts cuts={CUTS} />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
