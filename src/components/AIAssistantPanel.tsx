"use client";

import React, { useState, useEffect } from "react";
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
  Cpu,
  Key,
  ShieldCheck,
  Headphones,
} from "lucide-react";
import { VideoProject, AspectRatio } from "@/remotion/types";

interface AIAssistantPanelProps {
  project: VideoProject;
  onProjectUpdate: (updated: VideoProject) => void;
  onRatioChange: (ratio: AspectRatio) => void;
}

type AIModelEngine = "claude-3-5-sonnet" | "claude-3-haiku" | "gemini-flash" | "local-ai";

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
  const [selectedEngine, setSelectedEngine] = useState<AIModelEngine>("claude-3-5-sonnet");
  const [audioSync, setAudioSync] = useState(true);
  const [voiceLang, setVoiceLang] = useState<"id" | "en">("id");
  const [autoVoiceover, setAutoVoiceover] = useState(true);
  const [claudeApiKey, setClaudeApiKey] = useState("");
  const [showKeyModal, setShowKeyModal] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState<string | null>(null);

  // Load saved Claude API key if exists
  useEffect(() => {
    const saved = localStorage.getItem("anthropic_api_key");
    if (saved) setClaudeApiKey(saved);
  }, []);

  const handleSaveApiKey = (key: string) => {
    setClaudeApiKey(key);
    localStorage.setItem("anthropic_api_key", key);
    setShowKeyModal(false);
  };

  const [chatLog, setChatLog] = useState<
    { role: "agent" | "user"; text: string; time: string }[]
  >([
    {
      role: "agent",
      text: "Halo! Saya adalah Claude & Remotion AI Director. Saya dapat menyusun video otomatis di mana adegan visual, transisi, dan subtitle sinkron presisi mengikuti alur narasi audio yang diucapkan. Silakan ketik perintah atau ide videomu!",
      time: "Claude Ready",
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

    const isClaude = selectedEngine.startsWith("claude");
    setCurrentStep(
      isClaude
        ? "1. Claude 3.5 menganalisis naskah & menghitung sinkronisasi audio..."
        : "1. Menyusun konsep naskah & storyboard visual..."
    );

    try {
      const endpoint = isClaude ? "/api/ai/claude" : "/api/ai/script";
      const modelPayload =
        selectedEngine === "claude-3-haiku"
          ? "claude-3-haiku-20240307"
          : "claude-3-5-sonnet-20241022";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: textToRun,
          targetDuration: durationSeconds,
          aspectRatio: project.aspectRatio,
          model: modelPayload,
          apiKey: claudeApiKey || undefined,
          audioSync,
        }),
      });

      setCurrentStep("2. Memotong adegan mengikuti ritme audio & Ken-Burns...");
      const data = await res.json();

      if (data.success && data.project) {
        let finalProject = data.project;

        // Auto-generate audio voiceover
        if (autoVoiceover && finalProject.voiceover?.text) {
          setCurrentStep("3. Mensintesis rekaman suara narasi AI...");
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
                    title: `Suara Narasi Claude (${voiceLang === "id" ? "Indonesia" : "English"})`,
                    volume: 0.95,
                    startFrame: 5,
                    durationInFrames: finalProject.clips.reduce(
                      (a: number, c: any) => a + c.durationInFrames,
                      0
                    ),
                  },
                ],
              };
            }
          } catch (e) {
            console.warn("Auto voiceover error", e);
          }
        }

        setCurrentStep("4. Menyinkronkan subtitle Alex Hormozi kata per kata...");
        setTimeout(() => {
          onProjectUpdate(finalProject);
          setIsGenerating(false);
          setCurrentStep(null);
          addLog(
            "agent",
            `✨ Berhasil! Video "${finalProject.title}" telah diproduksi dengan ${
              isClaude ? "Claude AI Engine" : "AI Studio"
            }. Setiap adegan visual berganti tepat saat jeda narasi suara (${voiceLang.toUpperCase()}), musik latar bebas hak cipta, dan subtitle animasi TikTok. Klik Play di player untuk menikmati hasilnya!`
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
      {/* Panel Header */}
      <div className="p-3.5 border-b border-studio-border flex items-center justify-between bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-studio-panel">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 border border-purple-400/40 flex items-center justify-center text-white shadow-md">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold text-white tracking-wide">
                Claude &amp; Remotion AI
              </h2>
            </div>
            <p className="text-[10px] text-slate-400">
              Audio-Driven Video Generator
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowKeyModal(true)}
          className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition ${
            claudeApiKey
              ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
              : "bg-studio-card border-studio-border text-slate-400 hover:text-white"
          }`}
          title="Pengaturan Kunci API Claude (Opsional)"
        >
          <Key className="w-3.5 h-3.5" />
          <span className="text-[10px]">
            {claudeApiKey ? "API Aktif" : "API Key"}
          </span>
        </button>
      </div>

      {/* Model Engine Selector */}
      <div className="p-2.5 border-b border-studio-border bg-studio-dark/50 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
          <span className="flex items-center gap-1">
            <Bot className="w-3.5 h-3.5 text-purple-400" />
            Mesin AI:
          </span>
          <span className="text-[9px] text-cyan-400 font-mono">
            {selectedEngine.includes("claude") ? "Anthropic Claude" : "Fast Engine"}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => setSelectedEngine("claude-3-5-sonnet")}
            className={`p-1.5 rounded-lg text-left text-[11px] font-semibold border transition ${
              selectedEngine === "claude-3-5-sonnet"
                ? "bg-purple-600/30 border-purple-500 text-white shadow"
                : "bg-studio-card border-studio-border text-slate-400 hover:text-slate-200"
            }`}
          >
            <div className="flex items-center gap-1 font-bold text-purple-300">
              <Sparkles className="w-3 h-3 text-purple-400" />
              Claude 3.5 Sonnet
            </div>
            <div className="text-[9px] text-slate-400">Narasi Audio Presisi</div>
          </button>

          <button
            onClick={() => setSelectedEngine("claude-3-haiku")}
            className={`p-1.5 rounded-lg text-left text-[11px] font-semibold border transition ${
              selectedEngine === "claude-3-haiku"
                ? "bg-purple-600/30 border-purple-500 text-white shadow"
                : "bg-studio-card border-studio-border text-slate-400 hover:text-slate-200"
            }`}
          >
            <div className="flex items-center gap-1 font-bold text-purple-300">
              <Zap className="w-3 h-3 text-amber-400" />
              Claude 3 Haiku
            </div>
            <div className="text-[9px] text-slate-400">Generasi Cepat</div>
          </button>
        </div>
      </div>

      {/* Audio-Driven Scene Sync Toggle */}
      <div className="px-3 py-2 border-b border-studio-border bg-studio-dark/30 flex items-center justify-between text-xs">
        <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-semibold text-slate-300">
          <Headphones className="w-3.5 h-3.5 text-cyan-400" />
          <span>Sinkronisasi Potongan Audio (Audio-Sync)</span>
        </label>
        <button
          onClick={() => setAudioSync(!audioSync)}
          className={`w-9 h-5 rounded-full transition-colors relative flex items-center px-0.5 ${
            audioSync ? "bg-cyan-500" : "bg-slate-700"
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${
              audioSync ? "translate-x-4" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Voice Language & Duration */}
      <div className="px-3 py-2 border-b border-studio-border bg-studio-dark/60 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-1.5">
          <Mic className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-[11px] text-slate-400 font-semibold">Suara:</span>
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
                  ? "bg-purple-600 text-white"
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
                  ? "bg-purple-600 text-white rounded-br-none shadow-md"
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
            <div className="bg-gradient-to-r from-purple-950/70 to-studio-card border border-purple-500/50 text-xs p-3.5 rounded-xl rounded-bl-none shadow-lg flex items-center gap-2.5 text-purple-300">
              <RefreshCw className="w-4 h-4 animate-spin text-purple-400" />
              <div className="flex flex-col">
                <span className="font-bold text-white text-[11px]">
                  Claude Sedang Menyusun Video
                </span>
                <span className="text-[10px] text-cyan-300">{currentStep}</span>
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
            placeholder="Perintahkan Claude (contoh: Video kopi pagi 15s)..."
            className="w-full bg-studio-dark border border-studio-border rounded-xl pl-3.5 pr-10 py-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition shadow-inner"
          />
          <button
            type="submit"
            disabled={!prompt.trim() || isGenerating}
            className="absolute right-1.5 p-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-30 text-white shadow-md transition active:scale-95"
            title="Generate dengan Claude"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
        <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500">
          <span>🎧 Sinkronisasi adegan &amp; narasi suara</span>
          <span className="font-mono text-purple-400">Claude + Remotion</span>
        </div>
      </div>

      {/* Claude API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-studio-panel border border-studio-border rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl animate-slide-up">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Key className="w-4 h-4 text-purple-400" />
              <span>Pengaturan Kunci API Anthropic Claude</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Kunci API bersifat <strong>OPSIONAL</strong>. Jika tidak diisi, studio akan tetap berjalan otomatis menggunakan mesin Claude-Tuned Engine bawaan secara 100% gratis!
            </p>
            <input
              type="password"
              placeholder="sk-ant-api03-..."
              defaultValue={claudeApiKey}
              id="claude_api_input"
              className="w-full bg-studio-dark border border-studio-border rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowKeyModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white bg-slate-800"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  const val = (
                    document.getElementById("claude_api_input") as HTMLInputElement
                  )?.value;
                  handleSaveApiKey(val || "");
                }}
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition"
              >
                Simpan Kunci
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
