"use client";

import React from "react";
import { AspectRatio, ASPECT_RATIOS, VideoTemplate } from "@/remotion/types";
import {
  Smartphone,
  Tv,
  Square,
  Sparkles,
  Download,
  Share2,
  Scissors,
  Layers,
  Wand2,
  Film,
  Radio,
  ShoppingBag,
  UserCheck,
  Key,
} from "lucide-react";

interface HeaderProps {
  currentRatio: AspectRatio;
  onRatioChange: (ratio: AspectRatio) => void;
  currentTemplate: VideoTemplate;
  onTemplateChange: (template: VideoTemplate) => void;
  onOpenExport: () => void;
  onOpenPublisher: () => void;
  onOpenClipCutter: () => void;
  onOpenKeyManager?: () => void;
  activeClipCount: number;
  projectTitle: string;
  onTitleChange: (title: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRatio,
  onRatioChange,
  currentTemplate,
  onTemplateChange,
  onOpenExport,
  onOpenPublisher,
  onOpenClipCutter,
  onOpenKeyManager,
  activeClipCount,
  projectTitle,
  onTitleChange,
}) => {
  return (
    <header className="h-16 border-b border-studio-border bg-studio-panel/90 backdrop-blur-md px-4 flex items-center justify-between z-40 sticky top-0">
      {/* Brand & Project Name */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Sparkles className="w-5 h-5 text-white animate-pulse-slow" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-tight text-white text-base bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              AGENT STUDIO
            </span>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Remotion 4.x
            </span>
          </div>
          <input
            type="text"
            value={projectTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            className="text-xs text-slate-400 hover:text-slate-200 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded px-1 -ml-1 w-52 md:w-60 truncate"
            title="Klik untuk mengubah nama proyek"
          />
        </div>
      </div>

      {/* Middle Bar: Template Switcher & Aspect Ratio */}
      <div className="hidden lg:flex items-center gap-2">
        {/* Template Selector */}
        <div className="flex items-center bg-studio-dark p-1 rounded-xl border border-studio-border">
          {[
            { id: "viral-tiktok", label: "TikTok Viral", icon: Sparkles },
            { id: "ai-presenter", label: "AI Presenter", icon: UserCheck },
            { id: "cinematic-docu", label: "Dokumenter", icon: Film },
            { id: "podcast-waveform", label: "Audiogram", icon: Radio },
            { id: "product-promo", label: "Promo Produk", icon: ShoppingBag },
          ].map((tmpl) => {
            const Icon = tmpl.icon;
            const isSelected = currentTemplate === tmpl.id;
            return (
              <button
                key={tmpl.id}
                onClick={() => onTemplateChange(tmpl.id as VideoTemplate)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  isSelected
                    ? "bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{tmpl.label}</span>
              </button>
            );
          })}
        </div>

        {/* Aspect Ratio Switcher */}
        <div className="flex items-center bg-studio-dark p-1 rounded-xl border border-studio-border">
          {(["9:16", "16:9", "1:1"] as AspectRatio[]).map((ratio) => {
            const config = ASPECT_RATIOS[ratio];
            const isSelected = currentRatio === ratio;
            const Icon =
              ratio === "9:16" ? Smartphone : ratio === "16:9" ? Tv : Square;

            return (
              <button
                key={ratio}
                onClick={() => onRatioChange(ratio)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
                title={config.label}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{ratio}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {/* API Key Manager Button */}
        {onOpenKeyManager && (
          <button
            onClick={onOpenKeyManager}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-purple-300 hover:text-white bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/40 rounded-lg transition shadow-sm"
            title="Kelola API Key AI (Claude, OpenAI, Gemini)"
          >
            <Key className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden xl:inline">API Key</span>
          </button>
        )}

        {/* Clip Cutter */}
        <button
          onClick={onOpenClipCutter}
          disabled={activeClipCount === 0}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition disabled:opacity-40 disabled:pointer-events-none"
          title="Potong atau trim video klip"
        >
          <Scissors className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Potong Klip</span>
        </button>

        {/* Auto Upload / Social Publisher */}
        <button
          onClick={onOpenPublisher}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition"
          title="Unggah otomatis ke YouTube, TikTok & Facebook"
        >
          <Share2 className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Otomasi Upload</span>
        </button>

        {/* Export Video */}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 rounded-lg shadow-lg shadow-indigo-500/25 transition active:scale-95"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Render &amp; Unduh</span>
        </button>
      </div>
    </header>
  );
};
