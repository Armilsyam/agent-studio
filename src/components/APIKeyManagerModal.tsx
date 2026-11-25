"use client";

import React, { useState, useEffect } from "react";
import {
  Key,
  X,
  ShieldCheck,
  Check,
  Cpu,
  Sparkles,
  Bot,
  ExternalLink,
  Eye,
  EyeOff,
  Flame,
} from "lucide-react";

interface APIKeyManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const APIKeyManagerModal: React.FC<APIKeyManagerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [anthropicKey, setAnthropicKey] = useState("");
  const [openaiKey, setOpenaiKey] = useState("");
  const [geminiKey, setGeminiKey] = useState("");
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAnthropicKey(localStorage.getItem("anthropic_api_key") || "");
      setOpenaiKey(localStorage.getItem("openai_api_key") || "");
      setGeminiKey(localStorage.getItem("gemini_api_key") || "");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveAll = () => {
    if (typeof window !== "undefined") {
      if (anthropicKey.trim()) localStorage.setItem("anthropic_api_key", anthropicKey.trim());
      else localStorage.removeItem("anthropic_api_key");

      if (openaiKey.trim()) localStorage.setItem("openai_api_key", openaiKey.trim());
      else localStorage.removeItem("openai_api_key");

      if (geminiKey.trim()) localStorage.setItem("gemini_api_key", geminiKey.trim());
      else localStorage.removeItem("gemini_api_key");
    }

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const toggleShow = (keyName: string) => {
    setShowKeys((prev) => ({ ...prev, [keyName]: !prev[keyName] }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-studio-panel border border-studio-border rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-slide-up flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-studio-border flex items-center justify-between bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-studio-panel">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Kelola API Key AI (Prompt Tanpa Batas)
              </h3>
              <p className="text-xs text-slate-400">
                Hubungkan model AI Anda untuk hasil narasi, aktor, dan gambar tanpa batasan kuota
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

        {/* Security Notice */}
        <div className="p-3 bg-emerald-500/10 border-b border-emerald-500/20 px-4 flex items-center gap-2 text-xs text-emerald-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Privasi 100% Aman:</strong> API Key disimpan secara lokal di browser Anda (Local Storage) dan langsung dikirim ke provider resmi.
          </span>
        </div>

        {/* Form Inputs */}
        <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto">
          {/* Anthropic Claude */}
          <div className="bg-studio-card p-3.5 rounded-xl border border-studio-border space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-200 flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-purple-400" />
                <span>Anthropic Claude API Key (Claude 3.5 Sonnet):</span>
              </label>
              <a
                href="https://console.anthropic.com/settings/keys"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-purple-400 hover:underline flex items-center gap-0.5"
              >
                <span>Dapatkan Kunci</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <div className="relative flex items-center">
              <input
                type={showKeys["anthropic"] ? "text" : "password"}
                value={anthropicKey}
                onChange={(e) => setAnthropicKey(e.target.value)}
                placeholder="sk-ant-api03-..."
                className="w-full bg-studio-dark border border-studio-border rounded-lg pl-3 pr-10 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
              />
              <button
                type="button"
                onClick={() => toggleShow("anthropic")}
                className="absolute right-2.5 text-slate-500 hover:text-slate-300"
              >
                {showKeys["anthropic"] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* OpenAI Key */}
          <div className="bg-studio-card p-3.5 rounded-xl border border-studio-border space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>OpenAI API Key (GPT-4o &amp; DALL-E 3):</span>
              </label>
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-emerald-400 hover:underline flex items-center gap-0.5"
              >
                <span>Dapatkan Kunci</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <div className="relative flex items-center">
              <input
                type={showKeys["openai"] ? "text" : "password"}
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder="sk-proj-..."
                className="w-full bg-studio-dark border border-studio-border rounded-lg pl-3 pr-10 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
              />
              <button
                type="button"
                onClick={() => toggleShow("openai")}
                className="absolute right-2.5 text-slate-500 hover:text-slate-300"
              >
                {showKeys["openai"] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Google Gemini */}
          <div className="bg-studio-card p-3.5 rounded-xl border border-studio-border space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-200 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Google Gemini API Key (Gemini 1.5 Flash):</span>
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-cyan-400 hover:underline flex items-center gap-0.5"
              >
                <span>Dapatkan Kunci</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <div className="relative flex items-center">
              <input
                type={showKeys["gemini"] ? "text" : "password"}
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-studio-dark border border-studio-border rounded-lg pl-3 pr-10 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              />
              <button
                type="button"
                onClick={() => toggleShow("gemini")}
                className="absolute right-2.5 text-slate-500 hover:text-slate-300"
              >
                {showKeys["gemini"] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Free Engine Banner */}
          <div className="bg-gradient-to-r from-cyan-950/40 to-indigo-950/40 border border-cyan-500/30 p-3.5 rounded-xl text-xs space-y-1">
            <div className="font-bold text-cyan-300 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Mesin Unlimited Tanpa Kunci API (Bawaan)</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Jika Anda tidak mengisi API Key, sistem tetap otomatis berjalan membuat gambar AI, narasi suara, latar belakang, dan video Remotion tanpa batas memanfaatkan mesin FLUX &amp; Web Engine bawaan secara gratis!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-studio-border flex items-center justify-between bg-studio-dark/50">
          {savedSuccess ? (
            <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
              <Check className="w-4 h-4" /> Kunci API Berhasil Disimpan!
            </span>
          ) : (
            <span className="text-[11px] text-slate-500">
              Kunci langsung aktif untuk generasi berikutnya.
            </span>
          )}

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800 rounded-lg transition"
            >
              Batal
            </button>
            <button
              onClick={handleSaveAll}
              className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-lg shadow-lg shadow-purple-600/30 transition flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Pengaturan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
