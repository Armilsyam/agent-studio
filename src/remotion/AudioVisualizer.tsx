"use client";

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { VisualizerConfig } from "./types";

interface AudioVisualizerProps {
  config?: VisualizerConfig;
  position?: "bottom" | "center";
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  config,
  position = "bottom",
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  if (!config || !config.enabled) return null;

  const barCount = config.barCount || 28;
  const color = config.color || "#06b6d4";

  // Generate responsive animated audio bars
  const bars = Array.from({ length: barCount }, (_, i) => {
    // Harmonic frequencies simulating real music spectrum
    const freq1 = Math.sin((frame * 0.15) + (i * 0.35));
    const freq2 = Math.cos((frame * 0.08) - (i * 0.2));
    const freq3 = Math.sin((frame * 0.22) + (i * 0.5));
    
    // Beat pulse every ~1 second (30 frames)
    const beatPulse = Math.pow(Math.sin((frame / 15) * Math.PI), 4) * 0.35;

    const rawHeight = Math.abs(freq1 * 0.4 + freq2 * 0.35 + freq3 * 0.25) + beatPulse;
    const barHeight = Math.max(12, Math.min(110, rawHeight * 95));

    return {
      id: i,
      height: barHeight,
    };
  });

  return (
    <div
      style={{
        position: "absolute",
        left: "5%",
        right: "5%",
        bottom: position === "bottom" ? "22%" : "45%",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        gap: `${Math.max(3, Math.round(width * 0.005))}px`,
        height: "120px",
        pointerEvents: "none",
        zIndex: 40,
      }}
    >
      {bars.map((bar) => (
        <div
          key={bar.id}
          style={{
            flex: 1,
            maxWidth: `${Math.round(width * 0.016)}px`,
            height: `${bar.height}px`,
            backgroundColor: color,
            borderRadius: "6px",
            boxShadow: `0 0 12px ${color}88, 0 0 4px #ffffff`,
            transition: "height 0.06s ease",
            transformOrigin: "bottom",
          }}
        />
      ))}
    </div>
  );
};
