"use client";

import React, { useState, useEffect } from "react";
import {
  Scissors,
  X,
  Play,
  Pause,
  Split,
  FastForward,
  Sparkles,
  Sliders,
  Volume2,
  Check,
} from "lucide-react";
import { MediaClip, TransitionType } from "@/remotion/types";
import { formatFramesToTime, generateId } from "@/lib/utils";

interface ClipCutterModalProps {
  isOpen: boolean;
  onClose: () => void;
  clips: MediaClip[];
  activeClipId?: string;
  onUpdateClip: (clip: MediaClip) => void;
  onSplitClip: (originalClipId: string, splitFrame: number) => void;
}

export const ClipCutterModal: React.FC<ClipCutterModalProps> = ({
  isOpen,
  onClose,
  clips,
  activeClipId,
  onUpdateClip,
  onSplitClip,
}) => {
  const [selectedId, setSelectedId] = useState<string>(
    activeClipId || clips[0]?.id || ""
  );

  useEffect(() => {
    if (activeClipId) {
      setSelectedId(activeClipId);
    } else if (clips.length > 0 && !selectedId) {
      setSelectedId(clips[0].id);
    }
  }, [activeClipId, clips, selectedId]);

  const selectedClip = clips.find((c) => c.id === selectedId) || clips[0];

  const [startFrame, setStartFrame] = useState(0);
  const [durationFrames, setDurationFrames] = useState(
    selectedClip?.durationInFrames || 90
  );
  const [speed, setSpeed] = useState<number>(selectedClip?.speed || 1);
  const [filter, setFilter] = useState(selectedClip?.filter || "none");
  const [transition, setTransition] = useState<TransitionType>(
    selectedClip?.transition || "fade"
  );
  const [splitPoint, setSplitPoint] = useState<number>(
    Math.round((selectedClip?.durationInFrames || 90) / 2)
  );

  useEffect(() => {
    if (selectedClip) {
      setDurationFrames(selectedClip.durationInFrames);
      setStartFrame(selectedClip.sourceStartFrame || 0);
      setSpeed(selectedClip.speed || 1);
      setFilter(selectedClip.filter || "none");
      setTransition(selectedClip.transition || "fade");
      setSplitPoint(Math.round(selectedClip.durationInFrames / 2));
    }
  }, [selectedClip]);

  if (!isOpen || !selectedClip) return null;

  const handleSaveTrim = () => {
    const updated: MediaClip = {
      ...selectedClip,
      sourceStartFrame: startFrame,
      durationInFrames: Math.max(15, durationFrames),
      speed,
      filter: filter as any,
      transition,
    };
    onUpdateClip(updated);
    onClose();
  };

  const handleExecuteSplit = () => {
    onSplitClip(selectedClip.id, splitPoint);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-studio-panel border border-studio-border rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-slide-up flex flex-col">
        {/* Modal Header */}
        <div className="p-4 border-b border-studio-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Pemotong &amp; Pengatur Klip Video
              </h3>
              <p className="text-xs text-slate-400">
                Potong, pisahkan (split), dan atur kecepatan klip secara presisi
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

        {/* Clip Picker if multiple clips */}
        {clips.length > 1 && (
          <div className="px-4 py-2 border-b border-studio-border bg-studio-dark/50 flex items-center gap-2 overflow-x-auto">
            <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap">
              Pilih Klip:
            </span>
            {clips.map((clip, idx) => (
              <button
                key={clip.id}
                onClick={() => setSelectedId(clip.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  selectedClip.id === clip.id
                    ? "bg-indigo-600 text-white shadow"
                    : "bg-studio-card text-slate-400 hover:text-slate-200"
                }`}
              >
                Klip #{idx + 1}: {clip.name}
              </button>
            ))}
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Clip Visual Preview */}
          <div className="relative rounded-xl overflow-hidden aspect-video bg-black border border-studio-border max-w-md mx-auto">
            {selectedClip.type === "photo" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={selectedClip.url}
                alt={selectedClip.name}
                className="w-full h-full object-cover"
                style={{
                  filter:
                    filter === "cyberpunk"
                      ? "hue-rotate(290deg) contrast(1.2)"
                      : filter === "vintage"
                      ? "sepia(0.4)"
                      : filter === "warm"
                      ? "sepia(0.2) saturate(1.2)"
                      : filter === "bw"
                      ? "grayscale(1)"
                      : "none",
                }}
              />
            ) : (
              <video
                src={selectedClip.url}
                controls
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute top-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[10px] font-mono text-cyan-300">
              Durasi: {formatFramesToTime(durationFrames, 30)} ({durationFrames} frames)
            </div>
          </div>

          {/* Trimmer Controls */}
          <div className="bg-studio-card p-4 rounded-xl border border-studio-border space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-indigo-400" />
                Durasi Klip (Potong / Trim):
              </span>
              <span className="text-xs font-mono text-indigo-400 font-semibold">
                {formatFramesToTime(durationFrames, 30)} ({Math.round(durationFrames / 30)} detik)
              </span>
            </div>

            {/* Slider */}
            <input
              type="range"
              min={15}
              max={300}
              step={5}
              value={durationFrames}
              onChange={(e) => setDurationFrames(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.5 detik</span>
              <span>3 detik</span>
              <span>5 detik</span>
              <span>10 detik</span>
            </div>
          </div>

          {/* Split Clip Feature */}
          <div className="bg-studio-card p-4 rounded-xl border border-studio-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Split className="w-4 h-4 text-amber-400" />
                Bagi Menjadi 2 Klip (Split Clip):
              </span>
              <span className="text-xs font-mono text-amber-400">
                Pisah di {formatFramesToTime(splitPoint, 30)}
              </span>
            </div>
            <input
              type="range"
              min={15}
              max={Math.max(20, durationFrames - 15)}
              step={5}
              value={splitPoint}
              onChange={(e) => setSplitPoint(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <button
              onClick={handleExecuteSplit}
              className="w-full py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center justify-center gap-2 transition"
            >
              <Split className="w-3.5 h-3.5" />
              <span>Bagi Klip Ini Sekarang</span>
            </button>
          </div>

          {/* Speed & Filter & Transition Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Speed */}
            <div className="bg-studio-card p-3 rounded-xl border border-studio-border">
              <label className="text-[11px] font-bold text-slate-300 block mb-2">
                Kecepatan:
              </label>
              <div className="grid grid-cols-4 gap-1">
                {[0.5, 1, 1.5, 2].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={`py-1 text-[11px] font-semibold rounded ${
                      speed === s
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            {/* Filter */}
            <div className="bg-studio-card p-3 rounded-xl border border-studio-border">
              <label className="text-[11px] font-bold text-slate-300 block mb-2">
                Filter Warna:
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as "none" | "vintage" | "cyberpunk" | "warm" | "cool" | "bw")}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="none">Normal / Asli</option>
                <option value="cyberpunk">Cyberpunk Neon</option>
                <option value="vintage">Vintage Retro</option>
                <option value="warm">Warm Cinematic</option>
                <option value="cool">Cool Blue</option>
                <option value="bw">Black &amp; White</option>
              </select>
            </div>

            {/* Transition */}
            <div className="bg-studio-card p-3 rounded-xl border border-studio-border">
              <label className="text-[11px] font-bold text-slate-300 block mb-2">
                Transisi Masuk:
              </label>
              <select
                value={transition}
                onChange={(e) => setTransition(e.target.value as TransitionType)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="fade">Fade In</option>
                <option value="slide-left">Slide Left</option>
                <option value="slide-right">Slide Right</option>
                <option value="zoom-in">Zoom In</option>
                <option value="zoom-out">Zoom Out</option>
                <option value="none">Tanpa Transisi</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-studio-border flex justify-end gap-2 bg-studio-dark/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800/80 rounded-lg transition"
          >
            Batal
          </button>
          <button
            onClick={handleSaveTrim}
            className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Simpan Perubahan Klip</span>
          </button>
        </div>
      </div>
    </div>
  );
};
