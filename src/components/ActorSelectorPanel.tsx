"use client";

import React from "react";
import { AIActorConfig } from "@/remotion/types";
import { PRESET_AI_ACTORS, AIActorPreset } from "@/lib/unlimitedMediaEngine";
import { UserCheck, Radio, Sparkles, Layout, Eye, EyeOff } from "lucide-react";

interface ActorSelectorPanelProps {
  actor?: AIActorConfig;
  onChange: (actor: AIActorConfig) => void;
}

export const ActorSelectorPanel: React.FC<ActorSelectorPanelProps> = ({
  actor,
  onChange,
}) => {
  const isEnabled = actor?.enabled ?? true;

  const currentActorId = actor?.actorId || "actor_sarah";

  const handleToggle = () => {
    if (!actor) {
      const defaultActor = PRESET_AI_ACTORS[0];
      onChange({
        enabled: true,
        actorId: defaultActor.id,
        name: defaultActor.name.split(" ")[0],
        avatarUrl: defaultActor.avatarUrl,
        position: "bottom-right",
        size: "medium",
        style: "circle",
        titleLabel: "AI Host",
      });
    } else {
      onChange({ ...actor, enabled: !isEnabled });
    }
  };

  const handleSelectPreset = (preset: AIActorPreset) => {
    onChange({
      enabled: true,
      actorId: preset.id,
      name: preset.name.split(" ")[0],
      avatarUrl: preset.avatarUrl,
      position: actor?.position || "bottom-right",
      size: actor?.size || "medium",
      style: actor?.style || "circle",
      titleLabel: preset.role,
    });
  };

  const handlePositionChange = (position: "bottom-right" | "bottom-left" | "center" | "top-right") => {
    if (!actor) return;
    onChange({ ...actor, position });
  };

  const handleSizeChange = (size: "small" | "medium" | "large") => {
    if (!actor) return;
    onChange({ ...actor, size });
  };

  const handleStyleChange = (style: "circle" | "card") => {
    if (!actor) return;
    onChange({ ...actor, style });
  };

  return (
    <div className="flex flex-col h-full bg-studio-panel border-r border-studio-border w-80 text-slate-200 overflow-y-auto">
      {/* Header */}
      <div className="p-3.5 border-b border-studio-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold text-white">Aktor &amp; Host Presenter</h2>
        </div>
        <button
          onClick={handleToggle}
          className={`px-2 py-0.5 rounded text-[11px] font-bold transition flex items-center gap-1 ${
            isEnabled
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
              : "bg-slate-800 text-slate-500"
          }`}
        >
          {isEnabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          <span>{isEnabled ? "Aktif" : "Nonaktif"}</span>
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Preset Selection */}
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-2">
            Pilih Karakter Presenter AI:
          </label>
          <div className="space-y-2">
            {PRESET_AI_ACTORS.map((preset) => {
              const isSelected = isEnabled && currentActorId === preset.id;
              return (
                <div
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-2.5 rounded-xl border flex items-center gap-3 cursor-pointer transition ${
                    isSelected
                      ? "bg-cyan-500/10 border-cyan-500 text-white shadow-md shadow-cyan-500/20"
                      : "bg-studio-card border-studio-border hover:border-slate-600 text-slate-300"
                  }`}
                >
                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-cyan-400 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={preset.avatarUrl}
                      alt={preset.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 truncate">
                    <div className="text-xs font-bold truncate">{preset.name}</div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span className="capitalize">{preset.role}</span>
                      <span>•</span>
                      <span className="text-cyan-300">{preset.voiceLang.toUpperCase()}</span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-cyan-500 text-black flex items-center justify-center font-bold text-xs">
                      ✓
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Position Controls */}
        {isEnabled && (
          <>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2">
                Posisi Layar:
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: "bottom-right", label: "Kanan Bawah" },
                  { id: "bottom-left", label: "Kiri Bawah" },
                  { id: "top-right", label: "Kanan Atas" },
                  { id: "center", label: "Tengah Layar" },
                ].map((pos) => (
                  <button
                    key={pos.id}
                    onClick={() => handlePositionChange(pos.id as any)}
                    className={`py-1.5 text-xs font-semibold rounded-lg border transition ${
                      actor?.position === pos.id
                        ? "bg-indigo-600 border-indigo-500 text-white"
                        : "bg-studio-card border-studio-border text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Controls */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2">
                Ukuran Presenter:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: "small", label: "Kecil" },
                  { id: "medium", label: "Sedang" },
                  { id: "large", label: "Besar" },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSizeChange(s.id as any)}
                    className={`py-1.5 text-xs font-semibold rounded-lg border transition ${
                      actor?.size === s.id
                        ? "bg-indigo-600 border-indigo-500 text-white"
                        : "bg-studio-card border-studio-border text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Shape Style */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2">
                Bentuk Tampilan:
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: "circle", label: "Lingkaran (PiP)" },
                  { id: "card", label: "Kartu Kotak" },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => handleStyleChange(st.id as any)}
                    className={`py-1.5 text-xs font-semibold rounded-lg border transition ${
                      actor?.style === st.id
                        ? "bg-cyan-600 border-cyan-500 text-white"
                        : "bg-studio-card border-studio-border text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
