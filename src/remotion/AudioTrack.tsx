"use client";

import React from "react";
import { Audio, interpolate, Sequence, useCurrentFrame } from "remotion";
import { AudioLayer } from "./types";

interface AudioTrackProps {
  layers: AudioLayer[];
}

export const AudioTrack: React.FC<AudioTrackProps> = ({ layers }) => {
  if (!layers || layers.length === 0) return null;

  return (
    <>
      {layers.map((layer) => {
        if (!layer.url) return null;

        return (
          <Sequence
            key={layer.id}
            from={layer.startFrame}
            durationInFrames={layer.durationInFrames}
          >
            <AudioItem layer={layer} />
          </Sequence>
        );
      })}
    </>
  );
};

const AudioItem: React.FC<{ layer: AudioLayer }> = ({ layer }) => {
  const frame = useCurrentFrame();
  const fadeIn = layer.fadeInFrames ?? 15;
  const fadeOut = layer.fadeOutFrames ?? 15;
  const duration = layer.durationInFrames;
  const baseVolume = layer.volume ?? 0.8;

  let currentVolume = baseVolume;

  if (fadeIn > 0 && frame < fadeIn) {
    currentVolume = interpolate(frame, [0, fadeIn], [0, baseVolume], {
      extrapolateRight: "clamp",
    });
  } else if (fadeOut > 0 && frame > duration - fadeOut) {
    currentVolume = interpolate(frame, [duration - fadeOut, duration], [baseVolume, 0], {
      extrapolateRight: "clamp",
    });
  }

  return <Audio src={layer.url} volume={currentVolume} />;
};
