"use client";

import React, { useRef, useMemo } from "react";
import { Player, PlayerRef } from "@remotion/player";
import { MainComposition } from "@/remotion/MainComposition";
import { VideoProject } from "@/remotion/types";
import { getTotalDurationInFrames, formatFramesToTime } from "@/lib/utils";
import { Play, Pause, RotateCcw, Maximize2 } from "lucide-react";

interface RemotionPlayerWrapperProps {
  project: VideoProject;
  onCurrentFrameChange?: (frame: number) => void;
}

export const RemotionPlayerWrapper: React.FC<RemotionPlayerWrapperProps> = ({
  project,
}) => {
  const playerRef = useRef<PlayerRef>(null);

  const totalFrames = useMemo(() => {
    return Math.max(30, getTotalDurationInFrames(project.clips));
  }, [project.clips]);

  // Determine aspect ratio dimensions for preview framing
  const containerStyle: React.CSSProperties = useMemo(() => {
    if (project.aspectRatio === "9:16") {
      return {
        aspectRatio: "9/16",
        maxHeight: "68vh",
        maxWidth: "400px",
      };
    } else if (project.aspectRatio === "1:1") {
      return {
        aspectRatio: "1/1",
        maxHeight: "65vh",
        maxWidth: "520px",
      };
    } else {
      return {
        aspectRatio: "16/9",
        maxHeight: "60vh",
        maxWidth: "780px",
        width: "100%",
      };
    }
  }, [project.aspectRatio]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 bg-studio-dark/95 overflow-hidden relative">
      {/* Aspect Ratio Badge & Resolution */}
      <div className="mb-2 flex items-center gap-3 text-xs text-slate-400">
        <span className="font-mono bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
          {project.width} × {project.height} px
        </span>
        <span className="font-mono bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
          {project.fps} FPS
        </span>
        <span className="font-mono bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
          Total: {formatFramesToTime(totalFrames, project.fps)}
        </span>
      </div>

      {/* Main Video Screen Container */}
      <div
        style={containerStyle}
        className="w-full relative rounded-2xl overflow-hidden shadow-2xl shadow-black/80 border-2 border-slate-800/80 bg-black flex items-center justify-center group"
      >
        {project.clips.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-6 text-slate-500">
            <p className="text-sm font-medium mb-1">Belum ada klip di timeline</p>
            <p className="text-xs text-slate-600">
              Gunakan AI Assistant atau upload foto & video untuk memulai
            </p>
          </div>
        ) : (
          <Player
            ref={playerRef}
            component={MainComposition}
            inputProps={{ project }}
            durationInFrames={totalFrames}
            fps={project.fps}
            compositionWidth={project.width}
            compositionHeight={project.height}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
            controls
            autoPlay={false}
            loop
          />
        )}
      </div>
    </div>
  );
};
