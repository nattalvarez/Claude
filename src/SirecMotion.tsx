import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { loadFont } from "@remotion/google-fonts/Roboto";
import { OVERLAP, SCENE_DURATIONS } from "./styles/theme";
import { BgMesh, Grade, Grain, Vignette } from "./components/CinematicLayers";
import { Scene01Intro } from "./scenes/Scene01Intro";
import { Scene02Inception } from "./scenes/Scene02Inception";
import { Scene03ChangeManagement } from "./scenes/Scene03ChangeManagement";
import { Scene04Sats } from "./scenes/Scene04Sats";
import { Scene05CloudServices } from "./scenes/Scene05CloudServices";
import { Scene06Uaas } from "./scenes/Scene06Uaas";
import { Scene07Taas } from "./scenes/Scene07Taas";
import { Scene08DedicatedSupport } from "./scenes/Scene08DedicatedSupport";
import { Scene09Catalog } from "./scenes/Scene09Catalog";
import { Scene10Closing } from "./scenes/Scene10Closing";

loadFont("normal", {
  weights: ["300", "400", "500", "700", "900"],
  subsets: ["latin", "latin-ext"],
  ignoreTooManyRequestsWarning: true,
});

/** SIREC — pieza editorial de motion graphics. Ten scenes assembled with `Series`, each
 * overlapping the next by OVERLAP frames so the outgoing scene's exit motif and the
 * incoming scene's entrance motif cross-dissolve instead of hard-cutting. */
export const SirecMotion: React.FC = () => {
  return (
    <AbsoluteFill>
      <BgMesh />

      <Series>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.intro} name="01 — Introducción">
          <Scene01Intro />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.inception} offset={-OVERLAP} name="02 — Inception">
          <Scene02Inception />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.changeManagement} offset={-OVERLAP} name="03 — Change Management">
          <Scene03ChangeManagement />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.sats} offset={-OVERLAP} name="04 — SATS">
          <Scene04Sats />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.cloud} offset={-OVERLAP} name="05 — Cloud Services">
          <Scene05CloudServices />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.uaas} offset={-OVERLAP} name="06 — UaaS">
          <Scene06Uaas />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.taas} offset={-OVERLAP} name="07 — TaaS">
          <Scene07Taas />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.support} offset={-OVERLAP} name="08 — Dedicated Support">
          <Scene08DedicatedSupport />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.catalog} offset={-OVERLAP} name="09 — Catálogo">
          <Scene09Catalog />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.closing} offset={-OVERLAP} name="10 — Cierre">
          <Scene10Closing />
        </Series.Sequence>
      </Series>

      <Grade />
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};
