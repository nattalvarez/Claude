import React from "react";
import { Composition } from "remotion";
import { SirecMotion } from "./SirecMotion";
import { DURATION_IN_FRAMES, FPS, HEIGHT, WIDTH } from "./styles/theme";
import { AgentFabricMotion } from "./agentFabric/AgentFabricMotion";
import { DURATION_IN_FRAMES as AF_DURATION } from "./agentFabric/timeline";
import { SirecHubMotion } from "./sirecHub/SirecHubMotion";
import { DURATION_IN_FRAMES as HUB_DURATION } from "./sirecHub/timeline";

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="SirecMotion"
        component={SirecMotion}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{}}
      />
      <Composition
        id="SirecAgentFabric"
        component={AgentFabricMotion}
        durationInFrames={AF_DURATION}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{}}
      />
      <Composition
        id="SirecHub"
        component={SirecHubMotion}
        durationInFrames={HUB_DURATION}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{}}
      />
    </>
  );
};
