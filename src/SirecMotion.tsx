import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { loadFont } from "@remotion/google-fonts/Roboto";
import { SCENES } from "./styles/theme";
import { BgMesh, Grade, Grain, Vignette } from "./components/CinematicLayers";
import { Scene01Complexity } from "./scenes/Scene01Complexity";
import { Scene02Sirec } from "./scenes/Scene02Sirec";
import { Scene03Autonomy } from "./scenes/Scene03Autonomy";
import { Scene04Agents } from "./scenes/Scene04Agents";
import { Scene05Governance } from "./scenes/Scene05Governance";
import { Scene06Specialization } from "./scenes/Scene06Specialization";
import { Scene07Outro } from "./scenes/Scene07Outro";

loadFont("normal", {
  weights: ["300", "400", "500", "700", "900"],
  subsets: ["latin", "latin-ext"],
  ignoreTooManyRequestsWarning: true,
});

export const SirecMotion: React.FC = () => {
  return (
    <AbsoluteFill>
      <BgMesh />

      <Sequence from={SCENES.s01.from} durationInFrames={SCENES.s01.duration} name="01 — Complejidad">
        <Scene01Complexity />
      </Sequence>
      <Sequence from={SCENES.s02.from} durationInFrames={SCENES.s02.duration} name="02 — SIREC">
        <Scene02Sirec />
      </Sequence>
      <Sequence from={SCENES.s03.from} durationInFrames={SCENES.s03.duration} name="03 — Autonomía">
        <Scene03Autonomy />
      </Sequence>
      <Sequence from={SCENES.s04.from} durationInFrames={SCENES.s04.duration} name="04 — Agentes">
        <Scene04Agents />
      </Sequence>
      <Sequence from={SCENES.s05.from} durationInFrames={SCENES.s05.duration} name="05 — Gobernanza">
        <Scene05Governance />
      </Sequence>
      <Sequence from={SCENES.s06.from} durationInFrames={SCENES.s06.duration} name="06 — Especialización">
        <Scene06Specialization />
      </Sequence>
      <Sequence from={SCENES.s07.from} durationInFrames={SCENES.s07.duration} name="07 — Cierre">
        <Scene07Outro />
      </Sequence>

      <Grade />
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};
