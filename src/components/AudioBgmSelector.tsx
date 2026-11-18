"use client";

import React, { useState } from "react";
import { AudioLayer, VoiceoverConfig } from "@/remotion/types";
import { CURATED_STOCK_AUDIO, StockAudioItem } from "@/lib/stockMediaService";
import {
  Music,
  Volume2,
  Play,
  Pause,
  Mic,
  Sparkles,
  Check,
  Globe,
  Radio,
  RefreshCw,
  Sliders,
} from "lucide-react";
import { generateId } from "@/lib/utils";

interface AudioBgmSelectorProps {
  audioLayers: AudioLayer[];
  onUpdateAudioLayers: (layers: AudioLayer[]) => void;
  voiceoverConfig?: VoiceoverConfig;
  onUpdateVoiceover?: (cfg: VoiceoverConfig) => void;
  totalDurationFrames: number;
}

export const AudioBgmSelector: React.FC<AudioBgmSelectorProps> = ({
  audioLayers,
  onUpdateAudioLayers,
  voiceoverConfig,
  onUpdateVoiceover,
  totalDurationFrames,
}) => {
  const currentBgm = audioLayers.find((a) => a.type === "bgm");
  const currentVoiceover = audioLayers.find((a) => a.type === "voiceover");

  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioEl, setAudioEl] = useState<HTMLAudioElement | null>(null);

  // Voiceover state
  const [selectedLang, setSelectedLang] = useState<"id-ID" | "en-US">(
    voiceoverConfig?.language || "id-ID"
  );
  const [ttsText, setTtsText] = useState(
    voiceoverConfig?.text ||
      "Selamat datang di video otomatis yang dibuat dengan AI Agent Studio!"
  );
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  const [voiceSuccess, setVoiceSuccess] = useState(false);

  const handleSelectBgm = (item: StockAudioItem) => {
    const updatedBgm: AudioLayer = {
      id: generateId("bgm"),
      type: "bgm",
      url: item.url,
      title: item.title,
      volume: currentBgm?.volume ?? 0.35,
      startFrame: 0,
      durationInFrames: totalDurationFrames,
      fadeInFrames: 30,
      fadeOutFrames: 30,
    };

    const others = audioLayers.filter((a) => a.type !== "bgm");
    onUpdateAudioLayers([updatedBgm, ...others]);
  };

  const handleBgmVolumeChange = (vol: number) => {
    if (!currentBgm) return;
    const updated = audioLayers.map((a) =>
      a.id === currentBgm.id ? { ...a, volume: vol } : a
    );
    onUpdateAudioLayers(updated);
  };

  const handleVoiceVolumeChange = (vol: number) => {
    if (!currentVoiceover) return;
    const updated = audioLayers.map((a) =>
      a.id === currentVoiceover.id ? { ...a, volume: vol } : a
    );
    onUpdateAudioLayers(updated);
  };

  const handleTogglePlayAudio = (item: StockAudioItem) => {
    if (playingId === item.id) {
      audioEl?.pause();
      setPlayingId(null);
    } else {
      audioEl?.pause();
      const el = new Audio(item.url);
      el.play();
      el.onended = () => setPlayingId(null);
      setAudioEl(el);
      setPlayingId(item.id);
    }
  };

  // Generate real audio file and add to Remotion project!
  const handleGenerateVoiceover = async () => {
    if (!ttsText.trim() || isGeneratingVoice) return;
    setIsGeneratingVoice(true);
    setVoiceSuccess(false);

    try {
      const res = await fetch("/api/ai/voiceover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: ttsText,
          language: selectedLang.startsWith("en") ? "en" : "id",
        }),
      });

      const data = await res.json();
      if (data.success && data.audioUrl) {
        // Add or update voiceover layer in timeline
        const newVoiceoverLayer: AudioLayer = {
          id: generateId("voiceover"),
          type: "voiceover",
          url: data.audioUrl,
          title: `Suara Narasi (${selectedLang === "id-ID" ? "Indonesia" : "English"})`,
          volume: 0.95,
          startFrame: 5,
          durationInFrames: Math.max(90, totalDurationFrames),
          fadeInFrames: 5,
          fadeOutFrames: 10,
        };

        const others = audioLayers.filter((a) => a.type !== "voiceover");
        onUpdateAudioLayers([...others, newVoiceoverLayer]);

        if (onUpdateVoiceover) {
          onUpdateVoiceover({
            enabled: true,
            language: selectedLang,
            text: ttsText,
            audioUrl: data.audioUrl,
            voiceGender: "female",
            speed: 1.0,
          });
        }

        // Play preview
        const preview = new Audio(data.audioUrl);
        preview.play();

        setVoiceSuccess(true);
        setTimeout(() => setVoiceSuccess(false), 3000);
      } else {
        throw new Error(data.error || "Gagal membuat audio voiceover");
      }
    } catch (err: any) {
      alert(`Error suara voiceover: ${err.message}`);
    } finally {
      setIsGeneratingVoice(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-studio-panel border-r border-studio-border w-80 text-slate-200 overflow-y-auto">
      {/* Header */}
      <div className="p-3.5 border-b border-studio-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Music className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold text-white">Audio &amp; Voiceover</h2>
        </div>
        <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          No Copyright (CC0)
        </span>
      </div>

      <div className="p-4 space-y-5">
        {/* Voiceover Section */}
        <div className="bg-gradient-to-br from-indigo-950/40 via-studio-card to-studio-card p-3.5 rounded-2xl border border-indigo-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Mic className="w-4 h-4 text-indigo-400" />
              Narasi Suara AI (Voiceover):
            </span>
            <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-semibold">
              Gratis &amp; Jernih
            </span>
          </div>

          {/* Language Selector */}
          <div>
            <label className="text-[11px] text-slate-300 font-semibold block mb-1.5 flex items-center gap-1">
              <Globe className="w-3 h-3 text-cyan-400" />
              Pilih Bahasa Suara:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSelectedLang("id-ID")}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition ${
                  selectedLang === "id-ID"
                    ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30"
                    : "bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white"
                }`}
              >
                <span>🇮🇩 Indonesia</span>
              </button>
              <button
                onClick={() => setSelectedLang("en-US")}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition ${
                  selectedLang === "en-US"
                    ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30"
                    : "bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white"
                }`}
              >
                <span>🇺🇸 English</span>
              </button>
            </div>
          </div>

          {/* Text Area */}
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">
              Teks Naskah yang Akan Diucapkan:
            </label>
            <textarea
              value={ttsText}
              onChange={(e) => setTtsText(e.target.value)}
              rows={3}
              placeholder="Ketik naskah di sini..."
              className="w-full bg-studio-dark border border-studio-border rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateVoiceover}
            disabled={!ttsText.trim() || isGeneratingVoice}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 disabled:opacity-40 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition active:scale-95"
          >
            {isGeneratingVoice ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Menghasilkan Audio Suara...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Buat Suara AI &amp; Masukkan ke Video</span>
              </>
            )}
          </button>

          {voiceSuccess && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-2 rounded-lg text-[11px] text-emerald-300 flex items-center gap-1.5 animate-fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>Suara narasi berhasil disinkronkan ke video!</span>
            </div>
          )}

          {/* Voiceover Volume Slider if attached */}
          {currentVoiceover && (
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-300">
              <span className="flex items-center gap-1">
                <Volume2 className="w-3 h-3 text-indigo-400" />
                Volume Suara AI:
              </span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={currentVoiceover.volume}
                onChange={(e) => handleVoiceVolumeChange(Number(e.target.value))}
                className="w-28 accent-indigo-500 cursor-pointer"
              />
              <span className="font-mono text-indigo-400 w-8 text-right">
                {Math.round(currentVoiceover.volume * 100)}%
              </span>
            </div>
          )}
        </div>

        {/* Music Volume Slider */}
        {currentBgm && (
          <div className="bg-studio-card p-3 rounded-xl border border-studio-border space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 truncate w-36">
                🎵 {currentBgm.title}
              </span>
              <span className="font-mono text-cyan-400">
                {Math.round(currentBgm.volume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={currentBgm.volume}
              onChange={(e) => handleBgmVolumeChange(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>
        )}

        {/* Free Copyright-Free Music Library */}
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-2 flex items-center justify-between">
            <span>Pilihan Musik Bebas Hak Cipta:</span>
            <span className="text-[10px] text-slate-500">6 Lagu CC0</span>
          </label>
          <div className="space-y-2">
            {CURATED_STOCK_AUDIO.map((track) => {
              const isSelected = currentBgm?.url === track.url;
              const isPreviewing = playingId === track.id;

              return (
                <div
                  key={track.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between transition ${
                    isSelected
                      ? "bg-cyan-500/10 border-cyan-500/50 shadow-sm"
                      : "bg-studio-card border-studio-border hover:border-slate-600"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <button
                      onClick={() => handleTogglePlayAudio(track)}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-cyan-400 shrink-0 transition"
                      title="Pratinjau Suara"
                    >
                      {isPreviewing ? (
                        <Pause className="w-3.5 h-3.5" />
                      ) : (
                        <Play className="w-3.5 h-3.5 ml-0.5" />
                      )}
                    </button>
                    <div className="truncate">
                      <div className="text-xs font-semibold text-slate-200 truncate">
                        {track.title}
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                        <span>{track.genre}</span>
                        <span>•</span>
                        <span className="text-emerald-400">{track.license}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectBgm(track)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition shrink-0 ml-2 ${
                      isSelected
                        ? "bg-cyan-500 text-black shadow"
                        : "bg-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {isSelected ? "Terpilih" : "Pakai"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
