import React from "react";
import { Composition } from "remotion";
import { SirecMotion } from "./SirecMotion";
import { DURATION_IN_FRAMES, FPS, HEIGHT, WIDTH } from "./styles/theme";

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
    </>
  );
};
