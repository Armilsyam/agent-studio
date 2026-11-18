"use client";

import React, { useState } from "react";
import { AudioLayer } from "@/remotion/types";
import { CURATED_STOCK_AUDIO, StockAudioItem } from "@/lib/stockMediaService";
import { Music, Volume2, Play, Pause, Mic, Sparkles, Check } from "lucide-react";
import { generateId } from "@/lib/utils";

interface AudioBgmSelectorProps {
  audioLayers: AudioLayer[];
  onUpdateAudioLayers: (layers: AudioLayer[]) => void;
  totalDurationFrames: number;
}

export const AudioBgmSelector: React.FC<AudioBgmSelectorProps> = ({
  audioLayers,
  onUpdateAudioLayers,
  totalDurationFrames,
}) => {
  const currentBgm = audioLayers.find((a) => a.type === "bgm");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioEl, setAudioEl] = useState<HTMLAudioElement | null>(null);
  const [ttsText, setTtsText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

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

  const handleVolumeChange = (vol: number) => {
    if (!currentBgm) return;
    const updated = audioLayers.map((a) =>
      a.id === currentBgm.id ? { ...a, volume: vol } : a
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

  // Browser TTS Voiceover Generator
  const handleTestTTS = () => {
    if (!ttsText.trim() || typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(ttsText);
    utterance.lang = "id-ID";
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col h-full bg-studio-panel border-r border-studio-border w-80 text-slate-200 overflow-y-auto">
      {/* Header */}
      <div className="p-3.5 border-b border-studio-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Music className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold text-white">Audio &amp; Musik Latar</h2>
        </div>
        <span className="text-[10px] text-cyan-400 font-mono bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
          Royalty Free
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Active BGM Volume */}
        {currentBgm && (
          <div className="bg-studio-card p-3 rounded-xl border border-studio-border space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 truncate w-40">
                {currentBgm.title}
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
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>
        )}

        {/* BGM Track List */}
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-2">
            Pilihan Musik Latar:
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
                      <div className="text-[10px] text-slate-500">
                        {track.genre} • {track.duration}s
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

        {/* AI Voiceover Generator (TTS) */}
        <div className="pt-3 border-t border-studio-border">
          <div className="flex items-center gap-1.5 mb-2">
            <Mic className="w-4 h-4 text-indigo-400" />
            <label className="text-xs font-bold text-slate-200">
              AI Voiceover Gratis (TTS)
            </label>
          </div>
          <p className="text-[10px] text-slate-400 mb-2">
            Ucapkan narasi naskah langsung menggunakan AI Speech Synthesizer bawaan (Bahasa Indonesia).
          </p>
          <textarea
            value={ttsText}
            onChange={(e) => setTtsText(e.target.value)}
            placeholder="Tulis naskah narasi suara yang ingin diucapkan..."
            rows={3}
            className="w-full bg-studio-dark border border-studio-border rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 resize-none mb-2"
          />
          <button
            onClick={handleTestTTS}
            disabled={!ttsText.trim() || isSpeaking}
            className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow transition"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>{isSpeaking ? "Sedang Bicara..." : "Dengarkan Voiceover AI"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
