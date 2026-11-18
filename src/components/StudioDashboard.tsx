"use client";

import React, { useState } from "react";
import { Header } from "./Header";
import { RemotionPlayerWrapper } from "./RemotionPlayerWrapper";
import { AIAssistantPanel } from "./AIAssistantPanel";
import { MediaLibraryPanel } from "./MediaLibraryPanel";
import { TimelineEditor } from "./TimelineEditor";
import { SubtitleStyler } from "./SubtitleStyler";
import { AudioBgmSelector } from "./AudioBgmSelector";
import { ClipCutterModal } from "./ClipCutterModal";
import { ExportModal } from "./ExportModal";
import { SocialPublisherModal } from "./SocialPublisherModal";
import {
  VideoProject,
  AspectRatio,
  ASPECT_RATIOS,
  MediaClip,
} from "@/remotion/types";
import { DEFAULT_SAMPLE_PROJECT } from "@/lib/videoProjectStore";
import { generateId, getTotalDurationInFrames } from "@/lib/utils";
import { Bot, Image as ImageIcon, Type, Music, Layers } from "lucide-react";

export const StudioDashboard: React.FC = () => {
  const [project, setProject] = useState<VideoProject>(DEFAULT_SAMPLE_PROJECT);
  const [activeSideTab, setActiveSideTab] = useState<"ai" | "media" | "subtitles" | "audio">("ai");

  // Modals state
  const [isClipCutterOpen, setIsClipCutterOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isPublisherOpen, setIsPublisherOpen] = useState(false);
  const [activeClipToCut, setActiveClipToCut] = useState<string | undefined>(undefined);

  // Aspect ratio change
  const handleRatioChange = (ratio: AspectRatio) => {
    const config = ASPECT_RATIOS[ratio];
    setProject((prev) => ({
      ...prev,
      aspectRatio: ratio,
      width: config.width,
      height: config.height,
      captions: {
        ...prev.captions,
        fontSize: ratio === "9:16" ? 42 : 36,
      },
    }));
  };

  // Add clip to timeline
  const handleAddClip = (clip: MediaClip) => {
    setProject((prev) => ({
      ...prev,
      clips: [...prev.clips, clip],
    }));
  };

  // Delete clip from timeline
  const handleDeleteClip = (clipId: string) => {
    setProject((prev) => ({
      ...prev,
      clips: prev.clips.filter((c) => c.id !== clipId),
    }));
  };

  // Move clip left/right in timeline
  const handleMoveClip = (index: number, direction: "left" | "right") => {
    const newClips = [...project.clips];
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newClips.length) return;

    const temp = newClips[index];
    newClips[index] = newClips[targetIndex];
    newClips[targetIndex] = temp;

    setProject((prev) => ({ ...prev, clips: newClips }));
  };

  // Update a single clip after trimming
  const handleUpdateClip = (updatedClip: MediaClip) => {
    setProject((prev) => ({
      ...prev,
      clips: prev.clips.map((c) => (c.id === updatedClip.id ? updatedClip : c)),
    }));
  };

  // Split clip into two separate clips
  const handleSplitClip = (originalClipId: string, splitFrame: number) => {
    const originalIndex = project.clips.findIndex((c) => c.id === originalClipId);
    if (originalIndex === -1) return;

    const original = project.clips[originalIndex];
    const duration1 = Math.max(15, splitFrame);
    const duration2 = Math.max(15, original.durationInFrames - splitFrame);

    const clip1: MediaClip = {
      ...original,
      durationInFrames: duration1,
      name: `${original.name} (Part 1)`,
    };

    const clip2: MediaClip = {
      ...original,
      id: generateId("clip_split"),
      durationInFrames: duration2,
      sourceStartFrame: (original.sourceStartFrame || 0) + duration1,
      name: `${original.name} (Part 2)`,
    };

    const newClips = [...project.clips];
    newClips.splice(originalIndex, 1, clip1, clip2);

    setProject((prev) => ({
      ...prev,
      clips: newClips,
    }));
  };

  const handleOpenTrimmer = (clipId?: string) => {
    setActiveClipToCut(clipId || project.clips[0]?.id);
    setIsClipCutterOpen(true);
  };

  const totalFrames = getTotalDurationInFrames(project.clips);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-studio-dark text-slate-100 font-sans">
      {/* Top Header */}
      <Header
        currentRatio={project.aspectRatio}
        onRatioChange={handleRatioChange}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenPublisher={() => setIsPublisherOpen(true)}
        onOpenClipCutter={() => handleOpenTrimmer()}
        activeClipCount={project.clips.length}
        projectTitle={project.title}
        onTitleChange={(title) => setProject((prev) => ({ ...prev, title }))}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Vertical Icon Rail */}
        <aside className="w-14 bg-studio-dark border-r border-studio-border flex flex-col items-center py-3 gap-2 shrink-0 z-20">
          <button
            onClick={() => setActiveSideTab("ai")}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${
              activeSideTab === "ai"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
            title="AI Studio Assistant"
          >
            <Bot className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveSideTab("media")}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${
              activeSideTab === "media"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
            title="Media & Upload"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveSideTab("subtitles")}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${
              activeSideTab === "subtitles"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
            title="Subtitle & Captions"
          >
            <Type className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveSideTab("audio")}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${
              activeSideTab === "audio"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
            title="Musik Latar & Audio"
          >
            <Music className="w-5 h-5" />
          </button>
        </aside>

        {/* Selected Side Panel */}
        {activeSideTab === "ai" && (
          <AIAssistantPanel
            project={project}
            onProjectUpdate={setProject}
            onRatioChange={handleRatioChange}
          />
        )}
        {activeSideTab === "media" && (
          <MediaLibraryPanel onAddClip={handleAddClip} />
        )}
        {activeSideTab === "subtitles" && (
          <SubtitleStyler
            config={project.captions}
            onChange={(captions) => setProject((prev) => ({ ...prev, captions }))}
            totalDurationFrames={totalFrames}
          />
        )}
        {activeSideTab === "audio" && (
          <AudioBgmSelector
            audioLayers={project.audioLayers}
            onUpdateAudioLayers={(audioLayers) =>
              setProject((prev) => ({ ...prev, audioLayers }))
            }
            totalDurationFrames={totalFrames}
          />
        )}

        {/* Center Live Remotion Video Player */}
        <RemotionPlayerWrapper project={project} />
      </div>

      {/* Bottom Timeline Editor */}
      <TimelineEditor
        project={project}
        onSelectClipToTrim={handleOpenTrimmer}
        onDeleteClip={handleDeleteClip}
        onMoveClip={handleMoveClip}
        onUpdateProject={setProject}
        onOpenMediaLibrary={() => setActiveSideTab("media")}
      />

      {/* Clip Cutter Modal */}
      <ClipCutterModal
        isOpen={isClipCutterOpen}
        onClose={() => setIsClipCutterOpen(false)}
        clips={project.clips}
        activeClipId={activeClipToCut}
        onUpdateClip={handleUpdateClip}
        onSplitClip={handleSplitClip}
      />

      {/* Export / Render Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        project={project}
      />

      {/* Social Media Publisher Modal */}
      <SocialPublisherModal
        isOpen={isPublisherOpen}
        onClose={() => setIsPublisherOpen(false)}
        project={project}
      />
    </div>
  );
};
