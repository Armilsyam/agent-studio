"use client";

import React, { useState } from "react";
import {
  Share2,
  X,
  Youtube,
  Tv,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { VideoProject } from "@/remotion/types";
import {
  SocialPlatform,
  publishToYouTube,
  publishToTikTok,
  publishToFacebook,
} from "@/lib/socialAutomation";

interface SocialPublisherModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: VideoProject;
}

export const SocialPublisherModal: React.FC<SocialPublisherModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const [platform, setPlatform] = useState<SocialPlatform>("youtube");
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description);
  const [tags, setTags] = useState(project.tags.join(" "));
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<any | null>(null);

  if (!isOpen) return null;

  const handlePublish = async () => {
    setIsPublishing(true);
    setPublishResult(null);

    try {
      const tagList = tags.split(" ").filter((t) => t.trim().length > 0);
      let res;
      if (platform === "youtube") {
        res = await publishToYouTube({ title, description, tags: tagList });
      } else if (platform === "tiktok") {
        res = await publishToTikTok({ title, tags: tagList, videoUrl: project.clips[0]?.url });
      } else {
        res = await publishToFacebook({ title, description, tags: tagList });
      }

      setPublishResult(res);
    } catch (err: any) {
      alert(`Error publikasi: ${err.message}`);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-studio-panel border border-studio-border rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-slide-up flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-studio-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Otomasi Unggah Media Sosial
              </h3>
              <p className="text-xs text-slate-400">
                Otomatisasi posting langsung ke YouTube, TikTok &amp; Facebook
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Platform Selection */}
        <div className="p-4 border-b border-studio-border bg-studio-dark/50">
          <label className="text-xs font-bold text-slate-300 block mb-2">
            Target Platform:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              {
                id: "youtube",
                name: "YouTube Shorts",
                color: "text-rose-500 border-rose-500/30 bg-rose-500/10",
              },
              {
                id: "tiktok",
                name: "TikTok Video",
                color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
              },
              {
                id: "facebook",
                name: "Facebook Reels",
                color: "text-blue-400 border-blue-500/30 bg-blue-500/10",
              },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id as SocialPlatform)}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-xs font-bold transition ${
                  platform === p.id
                    ? `${p.color} ring-2 ring-indigo-500 shadow-md`
                    : "bg-studio-card border-studio-border text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Metadata Inputs */}
        <div className="p-4 space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Judul Video:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-studio-dark border border-studio-border rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Deskripsi:
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-studio-dark border border-studio-border rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Tag / Hashtag:
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="#AgentStudio #Shorts #Viral"
              className="w-full bg-studio-dark border border-studio-border rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Success Banner */}
          {publishResult && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl space-y-1.5 animate-fade-in">
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>{publishResult.message}</span>
              </div>
              {publishResult.postUrl && (
                <a
                  href={publishResult.postUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 font-mono"
                >
                  <span>Lihat Tautan: {publishResult.postUrl}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-studio-border flex justify-end gap-2 bg-studio-dark/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800 rounded-lg transition"
          >
            Tutup
          </button>
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 rounded-lg shadow-lg shadow-cyan-600/30 flex items-center gap-1.5 transition active:scale-95"
          >
            {isPublishing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Share2 className="w-3.5 h-3.5" />
            )}
            <span>{isPublishing ? "Memproses..." : "Eksekusi Otomasi Unggah"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
