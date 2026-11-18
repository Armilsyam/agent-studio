"use client";

import React from "react";
import { Composition } from "remotion";
import { MainComposition } from "./MainComposition";
import { DEFAULT_SAMPLE_PROJECT } from "../lib/videoProjectStore";
import { getTotalDurationInFrames } from "../lib/utils";

export const RemotionRoot: React.FC = () => {
  const durationInFrames = Math.max(
    30,
    getTotalDurationInFrames(DEFAULT_SAMPLE_PROJECT.clips)
  );

  return (
    <>
      <Composition
        id="MainVideo"
        component={MainComposition as any}
        durationInFrames={durationInFrames}
        fps={DEFAULT_SAMPLE_PROJECT.fps}
        width={DEFAULT_SAMPLE_PROJECT.width}
        height={DEFAULT_SAMPLE_PROJECT.height}
        defaultProps={{
          project: DEFAULT_SAMPLE_PROJECT,
        }}
      />
    </>
  );
};
