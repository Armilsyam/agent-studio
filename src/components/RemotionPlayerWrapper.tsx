"use client";

import React, { useRef, useMemo, useState } from "react";
import { Player, PlayerRef } from "@remotion/player";
import { MainComposition } from "@/remotion/MainComposition";
import { VideoProject } from "@/remotion/types";
import { getTotalDurationInFrames, formatFramesToTime } from "@/lib/utils";
import {
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Sparkles,
  Layers,
  Film,
  Volume2,
} from "lucide-react";

interface RemotionPlayerWrapperProps {
  project: VideoProject;
}

export const RemotionPlayerWrapper: React.FC<RemotionPlayerWrapperProps> = ({
  project,
}) => {
  const playerRef = useRef<PlayerRef>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const totalFrames = useMemo(() => {
    return Math.max(30, getTotalDurationInFrames(project.clips));
  }, [project.clips]);

  const containerStyle: React.CSSProperties = useMemo(() => {
    if (project.aspectRatio === "9:16") {
      return {
        aspectRatio: "9/16",
        maxHeight: "68vh",
        maxWidth: "390px",
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
        maxWidth: "760px",
        width: "100%",
      };
    }
  }, [project.aspectRatio]);

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (playerRef.current.isPlaying()) {
      playerRef.current.pause();
      setIsPlaying(false);
    } else {
      playerRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleRestart = () => {
    if (!playerRef.current) return;
    playerRef.current.seekTo(0);
    playerRef.current.play();
    setIsPlaying(true);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-studio-dark via-[#090d16] to-[#060910] overflow-hidden relative">
      {/* Background Ambient Glow */}
      <div className="absolute w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -top-20" />
      <div className="absolute w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -bottom-20" />

      {/* Top Status Bar */}
      <div className="mb-3 flex items-center gap-3 text-xs text-slate-400 z-10">
        <div className="flex items-center gap-1.5 font-mono bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full border border-slate-800 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-slate-200 font-bold">{project.template.toUpperCase()}</span>
        </div>
        <span className="font-mono bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-800 text-slate-300">
          {project.width} × {project.height} px
        </span>
        <span className="font-mono bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-800 text-cyan-300 font-bold">
          {formatFramesToTime(totalFrames, project.fps)}
        </span>
      </div>

      {/* Main Screen Bezel */}
      <div
        style={containerStyle}
        className="w-full relative rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.85)] border border-slate-700/80 bg-black flex items-center justify-center group z-10 transition-all duration-300 hover:border-cyan-500/50"
      >
        {project.clips.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-6 text-slate-500">
            <Film className="w-10 h-10 text-slate-600 mb-2 animate-bounce" />
            <p className="text-sm font-semibold text-slate-300 mb-1">
              Timeline Masih Kosong
            </p>
            <p className="text-xs text-slate-500 max-w-xs">
              Gunakan panel AI Director untuk membuat video otomatis dari ide apa saja!
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

      {/* Quick Player Bar */}
      {project.clips.length > 0 && (
        <div className="mt-3 flex items-center gap-2 z-10 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 shadow-lg">
          <button
            onClick={togglePlay}
            className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition active:scale-95 shadow"
            title="Play / Pause"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4 ml-0.5" />
            )}
          </button>
          <button
            onClick={handleRestart}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Putar Ulang dari Awal"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <span className="text-slate-600 text-xs">|</span>
          <span className="text-[11px] font-mono text-slate-300">
            {project.clips.length} Klip Visual
          </span>
          <span className="text-slate-600 text-xs">|</span>
          <span className="text-[11px] font-mono text-amber-400">
            {project.captions.lines.length} Baris Subtitle
          </span>
        </div>
      )}
    </div>
  );
};
