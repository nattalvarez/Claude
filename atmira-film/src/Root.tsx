import React from "react";
import { Composition } from "remotion";
import "./fonts";
import { AtmiraFilm } from "./AtmiraFilm";
import { DURATION_FRAMES, FPS } from "./timing";

export const Root: React.FC = () => (
  <Composition id="AtmiraFilm" component={AtmiraFilm} durationInFrames={DURATION_FRAMES} fps={FPS} width={1920} height={1080} />
);
