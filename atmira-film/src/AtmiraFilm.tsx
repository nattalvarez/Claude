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
import { Wipe } from "./components/Wipes";
import { theme } from "./theme";

const MIX = "audio/mix.wav";

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
    <Wipe at={3.5} kind="bars" />
    <Wipe at={10.0} kind="slats" />
    <Wipe at={15.5} kind="iris" color={theme.colors.blue} />
    <Wipe at={21.0} kind="flash" dur={0.6} />
    <Wipe at={29.5} kind="bars" />
    <Wipe at={32.0} kind="iris" color={theme.colors.navy} />
    <Wipe at={39.5} kind="flash" dur={0.7} />
    {withAudio ? <Audio src={staticFile(MIX)} /> : null}
  </AbsoluteFill>
);
