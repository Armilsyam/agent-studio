"use client";

import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { VideoProject } from "./types";
import { SceneRenderer } from "./SceneRenderer";
import { SubtitleRenderer } from "./SubtitleRenderer";
import { AudioTrack } from "./AudioTrack";
import { AudioVisualizer } from "./AudioVisualizer";
import { AnimatedStickers } from "./AnimatedStickers";
import { TemplateOverlay } from "./TemplateOverlay";
import { getTotalDurationInFrames } from "@/lib/utils";

export interface MainCompositionProps {
  project: VideoProject;
}

export const MainComposition: React.FC<MainCompositionProps> = ({ project }) => {
  const { clips, captions, audioLayers, watermark, template = "viral-tiktok", visualizer, stickers } = project;
  const totalFrames = getTotalDurationInFrames(clips);

  return (
    <AbsoluteFill style={{ backgroundColor: "#030712" }}>
      {/* Video / Photo Scene Series */}
      <Series>
        {clips.map((clip) => (
          <Series.Sequence
            key={clip.id}
            durationInFrames={clip.durationInFrames}
          >
            <SceneRenderer clip={clip} />
          </Series.Sequence>
        ))}
      </Series>

      {/* Audio Track Layers (BGM + Voiceover + SFX) */}
      <AudioTrack layers={audioLayers} />

      {/* Dynamic Animated Audio Waveform Visualizer */}
      <AudioVisualizer config={visualizer} />

      {/* Animated Stickers & Badges */}
      <AnimatedStickers stickers={stickers} />

      {/* Synchronized Captions / Subtitles */}
      <SubtitleRenderer config={captions} />

      {/* Template-Specific Overlays (Cinematic letterbox, TikTok progress, Promo button) */}
      <TemplateOverlay template={template} totalDurationFrames={totalFrames} />

      {/* Watermark / Brand Logo if configured */}
      {watermark?.text && (
        <div
          style={{
            position: "absolute",
            top: watermark.position.includes("top") ? "24px" : undefined,
            bottom: watermark.position.includes("bottom") ? "24px" : undefined,
            left: watermark.position.includes("left") ? "24px" : undefined,
            right: watermark.position.includes("right") ? "24px" : undefined,
            padding: "8px 14px",
            background: "rgba(0, 0, 0, 0.45)",
            backdropFilter: "blur(6px)",
            borderRadius: "8px",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            fontSize: "14px",
            fontWeight: 600,
            color: "rgba(255, 255, 255, 0.8)",
            letterSpacing: "0.5px",
            pointerEvents: "none",
            zIndex: 60,
          }}
        >
          {watermark.text}
        </div>
      )}
    </AbsoluteFill>
  );
};
