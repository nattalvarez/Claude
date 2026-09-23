import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { loadFont } from "@remotion/google-fonts/Roboto";
import { OVERLAP, SCENE_DURATIONS } from "./styles/theme";
import { BgMesh, Grade, Grain, Vignette } from "./components/CinematicLayers";
import { Scene01Intro } from "./scenes/Scene01Intro";
import { Scene02Schema } from "./scenes/Scene02Schema";
import { Scene03Closing } from "./scenes/Scene03Closing";

loadFont("normal", {
  weights: ["300", "400", "500", "700", "900"],
  subsets: ["latin", "latin-ext"],
  ignoreTooManyRequestsWarning: true,
});

/** SIREC — Un ecosistema que evoluciona contigo. Three scenes assembled with `Series`,
 * each overlapping the next by OVERLAP frames so the outgoing scene's exit motif and the
 * incoming scene's entrance motif cross-dissolve instead of hard-cutting: el núcleo se
 * forma, el esquema de nueve etapas se despliega a su alrededor, y el esquema se retira
 * para el cierre. */
export const SirecMotion: React.FC = () => {
  return (
    <AbsoluteFill>
      <BgMesh />

      <Series>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.intro} name="01 — Núcleo">
          <Scene01Intro />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.schema} offset={-OVERLAP} name="02 — Esquema">
          <Scene02Schema />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.closing} offset={-OVERLAP} name="03 — Cierre">
          <Scene03Closing />
        </Series.Sequence>
      </Series>

      <Grade />
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};
