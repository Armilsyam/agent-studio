"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Send,
  Zap,
  Clock,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Bot,
  RefreshCw,
} from "lucide-react";
import { VideoProject, AspectRatio } from "@/remotion/types";

interface AIAssistantPanelProps {
  project: VideoProject;
  onProjectUpdate: (updated: VideoProject) => void;
  onRatioChange: (ratio: AspectRatio) => void;
}

const PRESET_PROMPTS = [
  {
    title: "Reels AI & Teknologi",
    prompt: "Buat video Reels 15 detik tentang masa depan kecerdasan buatan dan bagaimana AI mengubah cara kita bekerja",
    duration: 15,
  },
  {
    title: "Tips Produktivitas",
    prompt: "Buat video TikTok 20 detik tentang 3 kebiasaan pagi orang sukses yang wajib ditiru",
    duration: 20,
  },
  {
    title: "Promo Produk Digital",
    prompt: "Buat video promo menarik tentang peluncuran platform video otomatis tanpa ribet",
    duration: 15,
  },
  {
    title: "Wisata & Estetik",
    prompt: "Buat video sinematik santai dengan visual alam pemandangan dan nuansa hangat",
    duration: 15,
  },
];

export const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({
  project,
  onProjectUpdate,
  onRatioChange,
}) => {
  const [prompt, setPrompt] = useState("");
  const [durationSeconds, setDurationSeconds] = useState(15);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [chatLog, setChatLog] = useState<
    { role: "agent" | "user"; text: string; time: string }[]
  >([
    {
      role: "agent",
      text: "Halo! Saya adalah AI Agent Studio. Katakan video apa yang ingin kamu buat, atau beri perintah untuk mengedit foto & video kamu secara otomatis.",
      time: "Baru saja",
    },
  ]);

  const handleGenerate = async (customPrompt?: string) => {
    const textToRun = (customPrompt || prompt).trim();
    if (!textToRun || isGenerating) return;

    // Check if it's a direct command
    const lower = textToRun.toLowerCase();

    // Command: Aspect Ratio
    if (lower.includes("16:9") || lower.includes("youtube")) {
      onRatioChange("16:9");
      addLog("user", textToRun);
      addLog("agent", "Aspek rasio telah diubah ke 16:9 (Format YouTube / Landscape)!");
      setPrompt("");
      return;
    }
    if (lower.includes("9:16") || lower.includes("tiktok") || lower.includes("reels") || lower.includes("shorts")) {
      onRatioChange("9:16");
      addLog("user", textToRun);
      addLog("agent", "Aspek rasio telah diubah ke 9:16 (Format TikTok & Reels)!");
      setPrompt("");
      return;
    }
    if (lower.includes("1:1") || lower.includes("square") || lower.includes("kotak")) {
      onRatioChange("1:1");
      addLog("user", textToRun);
      addLog("agent", "Aspek rasio telah diubah ke 1:1 (Format Square Feed)!");
      setPrompt("");
      return;
    }

    // Command: Subtitle Style
    if (lower.includes("subtitle") && (lower.includes("neon") || lower.includes("tiktok") || lower.includes("box"))) {
      let style: "tiktok" | "neon" | "box" = "tiktok";
      if (lower.includes("neon")) style = "neon";
      if (lower.includes("box")) style = "box";

      onProjectUpdate({
        ...project,
        captions: {
          ...project.captions,
          style,
        },
      });
      addLog("user", textToRun);
      addLog("agent", `Gaya subtitle telah diperbarui menjadi gaya ${style.toUpperCase()}!`);
      setPrompt("");
      return;
    }

    // Default: Generate Full Project via AI Engine
    addLog("user", textToRun);
    setIsGenerating(true);
    setCurrentStep("1. Menyusun naskah & storyboard visual...");

    try {
      const res = await fetch("/api/ai/script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: textToRun,
          aspectRatio: project.aspectRatio,
          durationSeconds,
        }),
      });

      setCurrentStep("2. Memilih visual & memotong klip sinematik...");
      const data = await res.json();

      if (data.success && data.project) {
        setCurrentStep("3. Menyinkronkan subtitle dan musik...");
        setTimeout(() => {
          onProjectUpdate(data.project);
          setIsGenerating(false);
          setCurrentStep(null);
          addLog(
            "agent",
            `Proyek video "${data.project.title}" berhasil dibuat dengan ${data.project.clips.length} adegan, transisi dinamis, efek Ken-Burns, dan subtitle Alex Hormozi style! Klik Play untuk melihat pratinjau.`
          );
        }, 600);
      } else {
        throw new Error(data.error || "Gagal membuat video");
      }
    } catch (err: any) {
      setIsGenerating(false);
      setCurrentStep(null);
      addLog("agent", `Gagal memproses: ${err.message || "Silakan coba lagi"}`);
    }

    setPrompt("");
  };

  const addLog = (role: "agent" | "user", text: string) => {
    setChatLog((prev) => [
      ...prev,
      {
        role,
        text,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-full bg-studio-panel border-r border-studio-border w-80 md:w-96 text-slate-200">
      {/* Panel Title */}
      <div className="p-3.5 border-b border-studio-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold text-white">AI Studio Agent</h2>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Online & Siap Perintah
        </span>
      </div>

      {/* Quick Presets */}
      <div className="p-3 border-b border-studio-border bg-studio-dark/50">
        <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 mb-2">
          <Lightbulb className="w-3 h-3 text-amber-400" />
          <span>Preset Instan:</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {PRESET_PROMPTS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleGenerate(preset.prompt)}
              disabled={isGenerating}
              className="text-left p-2 rounded-lg bg-studio-card/80 hover:bg-indigo-600/20 hover:border-indigo-500/50 border border-studio-border text-[11px] transition group"
            >
              <div className="font-semibold text-slate-200 group-hover:text-indigo-300 truncate">
                {preset.title}
              </div>
              <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                <Clock className="w-2.5 h-2.5" /> {preset.duration}s
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {chatLog.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${
              msg.role === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-[88%] text-xs p-3 rounded-xl leading-relaxed ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white rounded-br-none"
                  : "bg-studio-card border border-studio-border text-slate-200 rounded-bl-none shadow-sm"
              }`}
            >
              {msg.text}
            </div>
            <span className="text-[9px] text-slate-500 mt-1 px-1">
              {msg.time}
            </span>
          </div>
        ))}

        {isGenerating && (
          <div className="flex flex-col items-start animate-fade-in">
            <div className="bg-studio-card border border-indigo-500/40 text-xs p-3 rounded-xl rounded-bl-none shadow-sm flex items-center gap-2 text-indigo-300">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
              <span>{currentStep || "Agent sedang bekerja..."}</span>
            </div>
          </div>
        )}
      </div>

      {/* Target Duration Bar */}
      <div className="px-3 py-2 bg-studio-dark/40 border-t border-studio-border flex items-center justify-between text-xs text-slate-400">
        <span className="text-[11px]">Durasi Video:</span>
        <div className="flex items-center gap-1">
          {[10, 15, 20, 30].map((sec) => (
            <button
              key={sec}
              onClick={() => setDurationSeconds(sec)}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition ${
                durationSeconds === sec
                  ? "bg-indigo-600 text-white"
                  : "bg-studio-card text-slate-400 hover:text-slate-200"
              }`}
            >
              {sec}s
            </button>
          ))}
        </div>
      </div>

      {/* Input Prompt Box */}
      <div className="p-3 border-t border-studio-border bg-studio-panel">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleGenerate();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isGenerating}
            placeholder="Perintahkan AI atau ketik ide video..."
            className="w-full bg-studio-dark border border-studio-border rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          />
          <button
            type="submit"
            disabled={!prompt.trim() || isGenerating}
            className="absolute right-1.5 p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:hover:bg-indigo-600 text-white transition"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
        <p className="text-[9px] text-slate-500 mt-1.5 text-center">
          Contoh: &ldquo;Buat video edukasi kesehatan 15s&rdquo; atau &ldquo;Ganti ke 16:9&rdquo;
        </p>
      </div>
    </div>
  );
};
