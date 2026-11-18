"use client";

import React, { useState } from "react";
import { CaptionConfig, CaptionStyle, SubtitleLine } from "@/remotion/types";
import { Type, Sparkles, Plus, Trash2, Sliders, Check } from "lucide-react";
import { generateId } from "@/lib/utils";

interface SubtitleStylerProps {
  config: CaptionConfig;
  onChange: (updated: CaptionConfig) => void;
  totalDurationFrames: number;
}

export const SubtitleStyler: React.FC<SubtitleStylerProps> = ({
  config,
  onChange,
  totalDurationFrames,
}) => {
  const [newLineText, setNewLineText] = useState("");

  const handleToggle = () => {
    onChange({ ...config, enabled: !config.enabled });
  };

  const handleStyleChange = (style: CaptionStyle) => {
    onChange({ ...config, style });
  };

  const handlePositionChange = (position: "bottom" | "center" | "top") => {
    onChange({ ...config, position });
  };

  const handleAddLine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLineText.trim()) return;

    const currentCount = config.lines.length;
    const lineDuration = 90; // 3s
    const startFrame = currentCount * lineDuration;
    const endFrame = startFrame + lineDuration - 5;

    const words = newLineText.split(" ");
    const wordDur = Math.floor(lineDuration / Math.max(1, words.length));
    const subtitleWords = words.map((w, idx) => ({
      text: w,
      startFrame: startFrame + idx * wordDur,
      endFrame: startFrame + (idx + 1) * wordDur - 2,
    }));

    const newLine: SubtitleLine = {
      id: generateId("line"),
      startFrame,
      endFrame,
      text: newLineText.toUpperCase(),
      words: subtitleWords,
    };

    onChange({
      ...config,
      lines: [...config.lines, newLine],
    });
    setNewLineText("");
  };

  const handleDeleteLine = (id: string) => {
    onChange({
      ...config,
      lines: config.lines.filter((l) => l.id !== id),
    });
  };

  return (
    <div className="flex flex-col h-full bg-studio-panel border-r border-studio-border w-80 text-slate-200 overflow-y-auto">
      {/* Header */}
      <div className="p-3.5 border-b border-studio-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold text-white">Subtitle &amp; Captions</h2>
        </div>
        <button
          onClick={handleToggle}
          className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
            config.enabled
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
              : "bg-slate-800 text-slate-500"
          }`}
        >
          {config.enabled ? "Aktif" : "Nonaktif"}
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Style Preset */}
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-2">
            Gaya Subtitle:
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: "tiktok", label: "TikTok Viral (Hormozi)" },
              { id: "neon", label: "Neon Cyber Glow" },
              { id: "box", label: "Dark Box Minimal" },
              { id: "karaoke", label: "Karaoke Reveal" },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => handleStyleChange(st.id as CaptionStyle)}
                className={`p-2 rounded-lg text-left text-xs font-semibold border transition ${
                  config.style === st.id
                    ? "bg-amber-500/20 border-amber-500/50 text-amber-300 shadow"
                    : "bg-studio-card border-studio-border text-slate-400 hover:text-slate-200"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Highlight Color */}
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-2">
            Warna Sorot Kata Aktif:
          </label>
          <div className="flex items-center gap-2">
            {[
              { color: "#facc15", name: "Yellow (TikTok)" },
              { color: "#38bdf8", name: "Cyan Light" },
              { color: "#ec4899", name: "Pink Neon" },
              { color: "#4ade80", name: "Green Lime" },
              { color: "#ffffff", name: "White Clean" },
            ].map((c) => (
              <button
                key={c.color}
                onClick={() => onChange({ ...config, highlightColor: c.color })}
                style={{ backgroundColor: c.color }}
                className={`w-7 h-7 rounded-full border-2 transition-transform ${
                  config.highlightColor === c.color
                    ? "scale-110 border-white shadow-lg"
                    : "border-transparent opacity-80 hover:opacity-100"
                }`}
                title={c.name}
              />
            ))}
          </div>
        </div>

        {/* Position */}
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-2">
            Posisi Layar:
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {(["bottom", "center", "top"] as const).map((pos) => (
              <button
                key={pos}
                onClick={() => handlePositionChange(pos)}
                className={`py-1.5 text-xs font-semibold rounded-lg capitalize border transition ${
                  config.position === pos
                    ? "bg-indigo-600 border-indigo-500 text-white"
                    : "bg-studio-card border-studio-border text-slate-400 hover:text-slate-200"
                }`}
              >
                {pos === "bottom" ? "Bawah" : pos === "center" ? "Tengah" : "Atas"}
              </button>
            ))}
          </div>
        </div>

        {/* Add Line Form */}
        <div className="pt-2 border-t border-studio-border">
          <label className="text-xs font-bold text-slate-300 block mb-1.5">
            Tambah Teks Subtitle Baru:
          </label>
          <form onSubmit={handleAddLine} className="flex gap-1.5">
            <input
              type="text"
              value={newLineText}
              onChange={(e) => setNewLineText(e.target.value)}
              placeholder="Tulis kalimat subtitle..."
              className="flex-1 bg-studio-dark border border-studio-border rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={!newLineText.trim()}
              className="p-2 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-30 text-black font-bold transition"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Lines List */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-slate-400 block">
            Daftar Baris Subtitle ({config.lines?.length || 0}):
          </span>
          {config.lines?.map((line, idx) => (
            <div
              key={line.id}
              className="p-2 rounded-lg bg-studio-card border border-studio-border flex items-center justify-between text-xs"
            >
              <div className="truncate flex-1 pr-2">
                <span className="text-amber-400 font-mono mr-1.5">#{idx + 1}</span>
                <span className="text-slate-200">{line.text}</span>
              </div>
              <button
                onClick={() => handleDeleteLine(line.id)}
                className="text-slate-500 hover:text-rose-400 p-1"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
