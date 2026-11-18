"use client";

import React, { useState } from "react";
import {
  Download,
  X,
  Sparkles,
  CheckCircle2,
  Film,
  Terminal,
  Cpu,
  RefreshCw,
} from "lucide-react";
import { VideoProject } from "@/remotion/types";
import { exportProjectToWebM, ExportProgress } from "@/lib/canvasVideoExporter";
import confetti from "canvas-confetti";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: VideoProject;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState<ExportProgress | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [exportType, setExportType] = useState<"client" | "cli" | "github">("client");

  if (!isOpen) return null;

  const handleStartClientExport = async () => {
    setIsExporting(true);
    setProgress({
      progress: 0,
      currentFrame: 0,
      totalFrames: 100,
      statusText: "Mempersiapkan canvas dan aset...",
    });

    try {
      const blob = await exportProjectToWebM(project, (p) => {
        setProgress(p);
      });

      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);

      // Trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = `${project.title.replace(/[^a-zA-Z0-9]/g, "_") || "video_agent_studio"}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }
    } catch (err: any) {
      alert(`Gagal mengekspor: ${err.message || "Terjadi kesalahan"}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-studio-panel border border-studio-border rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-slide-up flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-studio-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Render &amp; Unduh Video
              </h3>
              <p className="text-xs text-slate-400">
                Pilih metode ekspor video resolusi tinggi tanpa kendala
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

        {/* Tab Selection */}
        <div className="p-3 border-b border-studio-border bg-studio-dark/50 flex gap-2">
          <button
            onClick={() => setExportType("client")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
              exportType === "client"
                ? "bg-indigo-600 text-white shadow"
                : "bg-studio-card text-slate-400 hover:text-slate-200"
            }`}
          >
            Instan di Browser (Gratis)
          </button>
          <button
            onClick={() => setExportType("cli")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
              exportType === "cli"
                ? "bg-indigo-600 text-white shadow"
                : "bg-studio-card text-slate-400 hover:text-slate-200"
            }`}
          >
            Remotion CLI / Server
          </button>
          <button
            onClick={() => setExportType("github")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
              exportType === "github"
                ? "bg-indigo-600 text-white shadow"
                : "bg-studio-card text-slate-400 hover:text-slate-200"
            }`}
          >
            GitHub Actions Cloud
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4">
          {exportType === "client" && (
            <div className="space-y-4">
              <div className="bg-studio-card p-4 rounded-xl border border-studio-border">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-slate-200">
                    Format &amp; Resolusi:
                  </span>
                  <span className="font-mono text-cyan-400 font-bold">
                    {project.width} × {project.height} ({project.aspectRatio})
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Frame Rate:</span>
                  <span className="font-mono">{project.fps} FPS</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                  <span>Estimasi Durasi:</span>
                  <span className="font-mono">
                    {Math.round(
                      (project.clips.reduce((a, c) => a + c.durationInFrames, 0) /
                        project.fps) *
                        10
                    ) / 10} detik
                  </span>
                </div>
              </div>

              {/* Progress Bar when exporting */}
              {isExporting && progress && (
                <div className="bg-studio-card p-4 rounded-xl border border-indigo-500/40 space-y-2 animate-fade-in">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                    <span className="flex items-center gap-1.5 text-indigo-300">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      {progress.statusText}
                    </span>
                    <span className="font-mono text-indigo-400">
                      {progress.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full transition-all duration-150"
                      style={{ width: `${progress.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Download Ready Banner */}
              {downloadUrl && !isExporting && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Video Anda telah siap diunduh!</span>
                  </div>
                  <a
                    href={downloadUrl}
                    download="video_agent_studio.webm"
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
                  >
                    Unduh Lagi
                  </a>
                </div>
              )}

              <button
                onClick={handleStartClientExport}
                disabled={isExporting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>
                  {isExporting ? "Sedang Merender..." : "Mulai Render & Unduh Sekarang"}
                </span>
              </button>
            </div>
          )}

          {exportType === "cli" && (
            <div className="space-y-3 text-xs text-slate-300">
              <p>
                Anda dapat merender video menggunakan <strong>Remotion CLI</strong> dengan dukungan hardware acceleration penuh via FFmpeg di terminal:
              </p>
              <div className="bg-black/80 p-3 rounded-xl border border-studio-border font-mono text-[11px] text-cyan-300 space-y-2 select-all">
                <div># Buka pratinjau Remotion Studio di browser:</div>
                <div className="text-amber-300">npm run remotion:preview</div>
                <div className="mt-2"># Render video utuh ke file out/video.mp4:</div>
                <div className="text-amber-300">npm run remotion:render</div>
              </div>
            </div>
          )}

          {exportType === "github" && (
            <div className="space-y-3 text-xs text-slate-300">
              <p>
                Repository <strong>Armilsyam/agent-studio</strong> sudah dilengkapi GitHub Actions workflow (<code>.github/workflows/remotion-render.yml</code>).
              </p>
              <div className="bg-studio-card p-3 rounded-xl border border-studio-border space-y-2">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>Keuntungan Cloud Rendering GitHub:</span>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-slate-400 text-[11px]">
                  <li>100% GRATIS memanfaatkan kuota GitHub Actions (2.000 menit/bulan).</li>
                  <li>Otomatis merender video MP4 dengan FFmpeg resolusi 1080p.</li>
                  <li>File video siap diunduh langsung dari tab GitHub Actions &gt; Artifacts.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-studio-border flex justify-end bg-studio-dark/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-lg transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
