"use client";

import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { TransitionType } from "../types";

interface TransitionWrapperProps {
  type?: TransitionType;
  durationInFrames: number;
  transitionFrames?: number;
  children: React.ReactNode;
}

export const TransitionWrapper: React.FC<TransitionWrapperProps> = ({
  type = "fade",
  durationInFrames,
  transitionFrames = 15,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  if (type === "none" || transitionFrames <= 0) {
    return <div style={{ width: "100%", height: "100%" }}>{children}</div>;
  }

  // In-transition
  const inProgress = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: transitionFrames,
  });

  // Out-transition
  const outStart = Math.max(0, durationInFrames - transitionFrames);
  const outProgress = frame >= outStart
    ? spring({
        frame: frame - outStart,
        fps,
        config: { damping: 200 },
        durationInFrames: transitionFrames,
      })
    : 0;

  let opacity = 1;
  let transform = "none";

  switch (type) {
    case "fade": {
      opacity = interpolate(inProgress, [0, 1], [0, 1]) * (1 - interpolate(outProgress, [0, 1], [0, 1]));
      break;
    }
    case "slide-left": {
      const xIn = interpolate(inProgress, [0, 1], [width * 0.4, 0]);
      const xOut = interpolate(outProgress, [0, 1], [0, -width * 0.4]);
      opacity = interpolate(inProgress, [0, 1], [0, 1]) * (1 - interpolate(outProgress, [0, 1], [0, 1]));
      transform = `translateX(${xIn + xOut}px)`;
      break;
    }
    case "slide-right": {
      const xIn = interpolate(inProgress, [0, 1], [-width * 0.4, 0]);
      const xOut = interpolate(outProgress, [0, 1], [0, width * 0.4]);
      opacity = interpolate(inProgress, [0, 1], [0, 1]) * (1 - interpolate(outProgress, [0, 1], [0, 1]));
      transform = `translateX(${xIn + xOut}px)`;
      break;
    }
    case "zoom-in": {
      const scaleIn = interpolate(inProgress, [0, 1], [0.85, 1]);
      const scaleOut = interpolate(outProgress, [0, 1], [1, 1.15]);
      opacity = interpolate(inProgress, [0, 1], [0, 1]) * (1 - interpolate(outProgress, [0, 1], [0, 1]));
      transform = `scale(${outProgress > 0 ? scaleOut : scaleIn})`;
      break;
    }
    case "zoom-out": {
      const scaleIn = interpolate(inProgress, [0, 1], [1.15, 1]);
      const scaleOut = interpolate(outProgress, [0, 1], [1, 0.85]);
      opacity = interpolate(inProgress, [0, 1], [0, 1]) * (1 - interpolate(outProgress, [0, 1], [0, 1]));
      transform = `scale(${outProgress > 0 ? scaleOut : scaleIn})`;
      break;
    }
    default:
      break;
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        opacity,
        transform,
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
};
