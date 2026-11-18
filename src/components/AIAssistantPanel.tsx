"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Send,
  Zap,
  Clock,
  CheckCircle2,
  Lightbulb,
  Bot,
  RefreshCw,
  Globe,
  Mic,
  Music,
  Sliders,
  Flame,
} from "lucide-react";
import { VideoProject, AspectRatio } from "@/remotion/types";

interface AIAssistantPanelProps {
  project: VideoProject;
  onProjectUpdate: (updated: VideoProject) => void;
  onRatioChange: (ratio: AspectRatio) => void;
}

const PRESET_TOPICS = [
  {
    icon: "☕",
    label: "Kopi & Kuliner",
    prompt: "Bikin video aesthetic tentang secangkir kopi pagi dan ketenangan hari",
    dur: 15,
  },
  {
    icon: "🏔️",
    label: "Wisata Alam",
    prompt: "Buat video pemandangan alam pegunungan dan pantai sinematik",
    dur: 15,
  },
  {
    icon: "👟",
    label: "Promo Diskon",
    prompt: "Buat video promo diskon 50% produk fashion sneaker trendi",
    dur: 15,
  },
  {
    icon: "💻",
    label: "Tips Coding AI",
    prompt: "Bikin video edukasi 3 rahasia coding cepat menggunakan AI untuk pemula",
    dur: 15,
  },
  {
    icon: "🔥",
    label: "Motivasi Sukses",
    prompt: "Buat video motivasi harian tentang konsistensi dan pantang menyerah",
    dur: 15,
  },
];

export const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({
  project,
  onProjectUpdate,
  onRatioChange,
}) => {
  const [prompt, setPrompt] = useState("");
  const [durationSeconds, setDurationSeconds] = useState(15);
  const [voiceLang, setVoiceLang] = useState<"id" | "en">("id");
  const [autoVoiceover, setAutoVoiceover] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState<string | null>(null);

  const [chatLog, setChatLog] = useState<
    { role: "agent" | "user"; text: string; time: string }[]
  >([
    {
      role: "agent",
      text: "Halo! Saya AI Director Studio. Ketikkan ide video apa saja, dan saya akan otomatis merangkai storyboard, klip foto/video, musik bebas hak cipta, subtitle animasi TikTok, serta suara narasi AI untukmu!",
      time: "Siap Perintah",
    },
  ]);

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

  const handleGenerate = async (customPrompt?: string) => {
    const textToRun = (customPrompt || prompt).trim();
    if (!textToRun || isGenerating) return;

    const lower = textToRun.toLowerCase();

    // Natural commands
    if (lower.includes("16:9") || lower.includes("youtube") || lower.includes("landscape")) {
      onRatioChange("16:9");
      addLog("user", textToRun);
      addLog("agent", "Format diubah ke 16:9 (YouTube Landscape)!");
      setPrompt("");
      return;
    }
    if (lower.includes("9:16") || lower.includes("tiktok") || lower.includes("reels") || lower.includes("shorts")) {
      onRatioChange("9:16");
      addLog("user", textToRun);
      addLog("agent", "Format diubah ke 9:16 (TikTok & Reels Vertikal)!");
      setPrompt("");
      return;
    }
    if (lower.includes("1:1") || lower.includes("square") || lower.includes("feed")) {
      onRatioChange("1:1");
      addLog("user", textToRun);
      addLog("agent", "Format diubah ke 1:1 (Instagram Square)!");
      setPrompt("");
      return;
    }

    addLog("user", textToRun);
    setIsGenerating(true);
    setCurrentStep("1. Menulis konsep naskah & storyboard...");

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

      setCurrentStep("2. Memilih visual, efek gerak Ken-Burns & musik...");
      const data = await res.json();

      if (data.success && data.project) {
        let finalProject = data.project;

        // Auto-generate real voiceover if enabled
        if (autoVoiceover && finalProject.voiceover?.text) {
          setCurrentStep("3. Mensintesis suara narasi AI...");
          try {
            const voRes = await fetch("/api/ai/voiceover", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                text: finalProject.voiceover.text,
                language: voiceLang,
              }),
            });
            const voData = await voRes.json();
            if (voData.success && voData.audioUrl) {
              finalProject = {
                ...finalProject,
                audioLayers: [
                  ...finalProject.audioLayers,
                  {
                    id: `vo_${Date.now()}`,
                    type: "voiceover",
                    url: voData.audioUrl,
                    title: `Suara Narasi (${voiceLang === "id" ? "Indonesia" : "English"})`,
                    volume: 0.95,
                    startFrame: 5,
                    durationInFrames: finalProject.clips.reduce((a: number, c: any) => a + c.durationInFrames, 0),
                  },
                ],
              };
            }
          } catch (e) {
            console.warn("Auto voiceover error", e);
          }
        }

        setCurrentStep("4. Menyinkronkan subtitle kata per kata...");
        setTimeout(() => {
          onProjectUpdate(finalProject);
          setIsGenerating(false);
          setCurrentStep(null);
          addLog(
            "agent",
            `Selesai! Video "${finalProject.title}" berhasil dibuat dengan ${finalProject.clips.length} adegan, narasi suara AI (${voiceLang.toUpperCase()}), musik latar bebas royalti, dan subtitle Alex Hormozi! Tekan tombol Play di player untuk melihatnya.`
          );
        }, 500);
      } else {
        throw new Error(data.error || "Gagal membuat video");
      }
    } catch (err: any) {
      setIsGenerating(false);
      setCurrentStep(null);
      addLog("agent", `Gagal: ${err.message || "Silakan coba lagi"}`);
    }

    setPrompt("");
  };

  return (
    <div className="flex flex-col h-full bg-studio-panel border-r border-studio-border w-80 md:w-96 text-slate-200">
      {/* Panel Title */}
      <div className="p-3.5 border-b border-studio-border flex items-center justify-between bg-gradient-to-r from-indigo-950/40 to-studio-panel">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-cyan-400">
            <Bot className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">
              AI Video Director
            </h2>
            <p className="text-[10px] text-slate-400">
              Prompt ke Video Otomatis
            </p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] font-semibold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/30">
          <Sparkles className="w-3 h-3 text-cyan-400 animate-spin" />
          Aktif
        </span>
      </div>

      {/* Quick Topic Chips */}
      <div className="p-3 border-b border-studio-border bg-studio-dark/40">
        <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 mb-2">
          <Flame className="w-3 h-3 text-amber-400" />
          <span>Topik Populer Cepat:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_TOPICS.map((topic, idx) => (
            <button
              key={idx}
              onClick={() => handleGenerate(topic.prompt)}
              disabled={isGenerating}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-studio-card hover:bg-indigo-600/25 hover:border-indigo-500/50 border border-studio-border text-[11px] font-semibold text-slate-300 hover:text-white transition group"
            >
              <span>{topic.icon}</span>
              <span>{topic.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Voice & Duration Settings Bar */}
      <div className="px-3 py-2 border-b border-studio-border bg-studio-dark/70 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
            <Mic className="w-3 h-3 text-cyan-400" />
            Suara:
          </span>
          <button
            onClick={() => setVoiceLang("id")}
            className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
              voiceLang === "id"
                ? "bg-indigo-600 text-white"
                : "bg-studio-card text-slate-400 hover:text-slate-200"
            }`}
          >
            🇮🇩 ID
          </button>
          <button
            onClick={() => setVoiceLang("en")}
            className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
              voiceLang === "en"
                ? "bg-indigo-600 text-white"
                : "bg-studio-card text-slate-400 hover:text-slate-200"
            }`}
          >
            🇺🇸 EN
          </button>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-[10px] text-slate-400 font-mono">Durasi:</span>
          {[10, 15, 20].map((s) => (
            <button
              key={s}
              onClick={() => setDurationSeconds(s)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition ${
                durationSeconds === s
                  ? "bg-cyan-600 text-white"
                  : "bg-studio-card text-slate-400 hover:text-slate-200"
              }`}
            >
              {s}s
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
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
                  ? "bg-indigo-600 text-white rounded-br-none shadow-md"
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
            <div className="bg-gradient-to-r from-indigo-950/70 to-studio-card border border-indigo-500/50 text-xs p-3.5 rounded-xl rounded-bl-none shadow-lg flex items-center gap-2.5 text-indigo-300">
              <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
              <div className="flex flex-col">
                <span className="font-bold text-white text-[11px]">
                  Agent Sedang Memproduksi Video
                </span>
                <span className="text-[10px] text-cyan-300">
                  {currentStep}
                </span>
              </div>
            </div>
          </div>
        )}
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
            placeholder="Ketik ide video apa saja (contoh: Kopi senja 15s)..."
            className="w-full bg-studio-dark border border-studio-border rounded-xl pl-3.5 pr-10 py-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition shadow-inner"
          />
          <button
            type="submit"
            disabled={!prompt.trim() || isGenerating}
            className="absolute right-1.5 p-2 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 disabled:opacity-30 text-white shadow-md transition active:scale-95"
            title="Generate Video Sekarang"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
        <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500">
          <span>⚡ Otomatis storyboard, musik &amp; subtitle</span>
          <span className="font-mono text-cyan-400">100% Free Engine</span>
        </div>
      </div>
    </div>
  );
};
