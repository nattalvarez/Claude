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
import { Scene09Ecosystem } from "./scenes/Scene09Ecosystem";
import { Scene10EndCard } from "./scenes/Scene10EndCard";

loadFont("normal", {
  weights: ["300", "400", "500", "700", "900"],
  subsets: ["latin", "latin-ext"],
  ignoreTooManyRequestsWarning: true,
});

/** SIREC — Un ecosistema que evoluciona contigo. Ten scenes assembled with `Series`,
 * each overlapping the next by OVERLAP frames so the outgoing scene's exit motif and the
 * incoming scene's entrance motif cross-dissolve instead of hard-cutting — every scene is
 * meant to feel "born" from the one before it. */
export const SirecMotion: React.FC = () => {
  return (
    <AbsoluteFill>
      <BgMesh />

      <Series>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.intro} name="01 — Núcleo">
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
        <Series.Sequence durationInFrames={SCENE_DURATIONS.ecosystem} offset={-OVERLAP} name="09 — Ecosystem">
          <Scene09Ecosystem />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.endCard} offset={-OVERLAP} name="10 — End Card">
          <Scene10EndCard />
        </Series.Sequence>
      </Series>

      <Grade />
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};
