import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { S1Hook } from "./scenes/S1Hook";
import { S2Atmira } from "./scenes/S2Atmira";
import { S3Cifras } from "./scenes/S3Cifras";
import { S4Mapa } from "./scenes/S4Mapa";
import { S5Sirec } from "./scenes/S5Sirec";
import { S6Triple } from "./scenes/S6Triple";
import { S7Consultoria } from "./scenes/S7Consultoria";
import { S8Logo } from "./scenes/S8Logo";
import { Wipe, WipeKind } from "./components/Wipes";
import { theme } from "./theme";
import { CUTS } from "./timing";

const KINDS: { kind: WipeKind; color?: string }[] = [
  { kind: "bars" },
  { kind: "slats" },
  { kind: "iris", color: theme.colors.blue },
  { kind: "flash" },
  { kind: "bars" },
  { kind: "iris", color: theme.colors.navy },
  { kind: "flash" },
];

export const AtmiraFilm: React.FC<{ withAudio?: boolean }> = ({ withAudio = true }) => (
  <AbsoluteFill style={{ background: theme.colors.navyDeep }}>
    <S1Hook />
    <S2Atmira />
    <S3Cifras />
    <S4Mapa />
    <S5Sirec />
    <S6Triple />
    <S7Consultoria />
    <S8Logo />
    {CUTS.map((at, i) => (
      <Wipe key={i} at={at} kind={KINDS[i].kind} color={KINDS[i].color} dur={KINDS[i].kind === "flash" ? 0.5 : 0.42} />
    ))}
    {withAudio ? <Audio src={staticFile("audio/mix.wav")} /> : null}
  </AbsoluteFill>
);
