import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { loadFont } from "@remotion/google-fonts/Roboto";
import { buildTimeline } from "./timeline";
import { Scene01Risk } from "./scenes/Scene01Risk";
import { Scene02Sirec } from "./scenes/Scene02Sirec";
import { Scene03Autonomy } from "./scenes/Scene03Autonomy";
import { Scene04Agents } from "./scenes/Scene04Agents";
import { Scene05Governance } from "./scenes/Scene05Governance";
import { Scene06Specialization } from "./scenes/Scene06Specialization";
import { Scene07Outro } from "./scenes/Scene07Outro";

loadFont("normal", {
  weights: ["400", "500", "700", "900"],
  subsets: ["latin"],
});

const SCENE_COMPONENTS = [Scene01Risk, Scene02Sirec, Scene03Autonomy, Scene04Agents, Scene05Governance, Scene06Specialization, Scene07Outro];

export const SirecMotion: React.FC = () => {
  const { items } = buildTimeline();
  return (
    <AbsoluteFill style={{ backgroundColor: "#FFFFFF" }}>
      {items.map((item, i) => {
        const Comp = SCENE_COMPONENTS[i];
        return (
          <Sequence key={item.id} from={item.from} durationInFrames={item.duration} name={item.id}>
            <Comp
              from={item.from}
              duration={item.duration}
              nominalDuration={item.nominalDuration}
              hasIncoming={item.hasIncoming}
              hasOutgoing={item.hasOutgoing}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
