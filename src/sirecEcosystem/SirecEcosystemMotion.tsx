import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { SCENES } from "./timeline";
import { Scene01Intro } from "./scenes/Scene01Intro";
import { Scene02Inception } from "./scenes/Scene02Inception";
import { Scene03ChangeManagement } from "./scenes/Scene03ChangeManagement";
import { Scene04Sats } from "./scenes/Scene04Sats";
import { Scene05Cloud } from "./scenes/Scene05Cloud";
import { Scene06Uaas } from "./scenes/Scene06Uaas";
import { Scene07Taas } from "./scenes/Scene07Taas";
import { Scene08Support } from "./scenes/Scene08Support";
import { Scene09Catalog } from "./scenes/Scene09Catalog";
import { Scene10Closing } from "./scenes/Scene10Closing";

const COMPONENTS: Record<string, React.FC> = {
  intro: Scene01Intro,
  inception: Scene02Inception,
  changeManagement: Scene03ChangeManagement,
  sats: Scene04Sats,
  cloud: Scene05Cloud,
  uaas: Scene06Uaas,
  taas: Scene07Taas,
  support: Scene08Support,
  catalog: Scene09Catalog,
  closing: Scene10Closing,
};

/** SIREC — a premium, editorial motion-graphics piece for a corporate event:
 * ten scenes, each its own flat-geometric composition, handed off to the
 * next through a short overlap rather than a hard cut. */
export const SirecEcosystemMotion: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#FFFFFF" }}>
      {SCENES.map((s) => {
        const Comp = COMPONENTS[s.id];
        return (
          <Sequence key={s.id} from={s.from} durationInFrames={s.duration} name={s.id}>
            <Comp />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
