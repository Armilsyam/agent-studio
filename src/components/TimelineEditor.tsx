"use client";

import React from "react";
import {
  Film,
  Type,
  Music,
  Scissors,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Volume2,
  Clock,
  Sparkles,
} from "lucide-react";
import { MediaClip, VideoProject, SubtitleLine } from "@/remotion/types";
import { formatFramesToTime } from "@/lib/utils";

interface TimelineEditorProps {
  project: VideoProject;
  onSelectClipToTrim: (clipId: string) => void;
  onDeleteClip: (clipId: string) => void;
  onMoveClip: (index: number, direction: "left" | "right") => void;
  onUpdateProject: (updated: VideoProject) => void;
  onOpenMediaLibrary: () => void;
}

export const TimelineEditor: React.FC<TimelineEditorProps> = ({
  project,
  onSelectClipToTrim,
  onDeleteClip,
  onMoveClip,
  onUpdateProject,
  onOpenMediaLibrary,
}) => {
  const { clips, captions, audioLayers } = project;

  return (
    <div className="h-64 border-t border-studio-border bg-studio-panel flex flex-col select-none">
      {/* Timeline Controls Header */}
      <div className="h-10 px-4 border-b border-studio-border flex items-center justify-between bg-studio-dark/70 text-xs">
        <div className="flex items-center gap-4 text-slate-300 font-semibold">
          <span className="flex items-center gap-1.5 text-indigo-400">
            <Film className="w-3.5 h-3.5" />
            <span>Klip Visual ({clips.length})</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="flex items-center gap-1.5 text-amber-400">
            <Type className="w-3.5 h-3.5" />
            <span>Subtitle ({captions.lines?.length || 0})</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="flex items-center gap-1.5 text-cyan-400">
            <Music className="w-3.5 h-3.5" />
            <span>Audio &amp; Musik ({audioLayers.length})</span>
          </span>
        </div>

        <button
          onClick={onOpenMediaLibrary}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition"
        >
          <Plus className="w-3 h-3" />
          <span>Tambah Klip</span>
        </button>
      </div>

      {/* Tracks Container */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-3 space-y-2">
        {/* Track 1: Video / Photo Clips */}
        <div className="flex items-center gap-2 min-w-max pb-1">
          <div className="w-20 text-[11px] font-bold text-slate-400 flex items-center gap-1 shrink-0">
            <Film className="w-3 h-3 text-indigo-400" />
            <span>Visual</span>
          </div>

          {clips.length === 0 ? (
            <div className="text-xs text-slate-500 italic py-2">
              Klip kosong. Klik &quot;Tambah Klip&quot; untuk memasukkan foto atau video.
            </div>
          ) : (
            clips.map((clip, index) => (
              <div
                key={clip.id}
                className="group relative rounded-xl border border-studio-border hover:border-indigo-500 bg-studio-card overflow-hidden transition shadow-sm flex flex-col shrink-0"
                style={{
                  width: `${Math.max(130, Math.min(260, clip.durationInFrames * 1.5))}px`,
                }}
              >
                {/* Visual Thumbnail & Duration */}
                <div className="h-16 relative bg-black flex items-center justify-center overflow-hidden">
                  {clip.thumbnailUrl || clip.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={clip.thumbnailUrl || clip.url}
                      alt={clip.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="text-[10px] text-slate-400 font-mono">
                      VIDEO
                    </div>
                  )}

                  <div className="absolute top-1 left-1 bg-black/75 px-1.5 py-0.5 rounded text-[9px] font-mono text-cyan-300">
                    {formatFramesToTime(clip.durationInFrames, 30)}
                  </div>

                  {clip.transition && clip.transition !== "none" && (
                    <div className="absolute bottom-1 right-1 bg-indigo-600/80 px-1 py-0.5 rounded text-[8px] uppercase font-bold text-white">
                      {clip.transition}
                    </div>
                  )}
                </div>

                {/* Clip Action Bar */}
                <div className="p-1.5 bg-studio-panel flex items-center justify-between text-xs">
                  <span className="text-[10px] font-semibold text-slate-200 truncate w-16">
                    {clip.name}
                  </span>

                  <div className="flex items-center gap-0.5">
                    {index > 0 && (
                      <button
                        onClick={() => onMoveClip(index, "left")}
                        title="Geser ke kiri"
                        className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                      >
                        <ChevronLeft className="w-3 h-3" />
                      </button>
                    )}
                    {index < clips.length - 1 && (
                      <button
                        onClick={() => onMoveClip(index, "right")}
                        title="Geser ke kanan"
                        className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                      >
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      onClick={() => onSelectClipToTrim(clip.id)}
                      title="Potong / Atur Klip"
                      className="p-1 rounded text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                    >
                      <Scissors className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onDeleteClip(clip.id)}
                      title="Hapus Klip"
                      className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Track 2: Subtitle / Captions Track */}
        <div className="flex items-center gap-2 min-w-max">
          <div className="w-20 text-[11px] font-bold text-slate-400 flex items-center gap-1 shrink-0">
            <Type className="w-3 h-3 text-amber-400" />
            <span>Subtitle</span>
          </div>

          {captions.lines?.length === 0 ? (
            <div className="text-xs text-slate-500 italic py-1">
              Belum ada baris subtitle.
            </div>
          ) : (
            captions.lines?.map((line, idx) => (
              <div
                key={line.id}
                className="bg-amber-500/10 border border-amber-500/30 text-amber-300 px-2.5 py-1 rounded-lg text-[10px] font-medium flex items-center gap-2 shrink-0 max-w-xs truncate"
              >
                <span className="font-mono text-[9px] text-amber-400/70">
                  #{idx + 1}
                </span>
                <span className="truncate">{line.text}</span>
              </div>
            ))
          )}
        </div>

        {/* Track 3: Audio / BGM Track */}
        <div className="flex items-center gap-2 min-w-max">
          <div className="w-20 text-[11px] font-bold text-slate-400 flex items-center gap-1 shrink-0">
            <Music className="w-3 h-3 text-cyan-400" />
            <span>Audio</span>
          </div>

          {audioLayers.length === 0 ? (
            <div className="text-xs text-slate-500 italic py-1">
              Tanpa musik latar.
            </div>
          ) : (
            audioLayers.map((audio) => (
              <div
                key={audio.id}
                className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 px-3 py-1 rounded-lg text-[10px] font-medium flex items-center gap-3 shrink-0"
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span>{audio.title}</span>
                </div>
                <div className="flex items-center gap-1 text-[9px] text-slate-400">
                  <Volume2 className="w-2.5 h-2.5" />
                  <span>{Math.round(audio.volume * 100)}%</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
