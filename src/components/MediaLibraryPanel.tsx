"use client";

import React, { useState, useEffect } from "react";
import {
  UploadCloud,
  Image as ImageIcon,
  Video as VideoIcon,
  Search,
  Plus,
  Trash2,
  Film,
} from "lucide-react";
import { MediaClip } from "@/remotion/types";
import { generateId, secondsToFrames } from "@/lib/utils";
import { CURATED_STOCK_MEDIA, StockMediaItem } from "@/lib/stockMediaService";

interface MediaLibraryPanelProps {
  onAddClip: (clip: MediaClip) => void;
}

export const MediaLibraryPanel: React.FC<MediaLibraryPanelProps> = ({
  onAddClip,
}) => {
  const [activeTab, setActiveTab] = useState<"stock" | "uploads">("stock");
  const [searchQuery, setSearchQuery] = useState("");
  const [stockItems, setStockItems] = useState<StockMediaItem[]>(CURATED_STOCK_MEDIA);
  const [uploadedItems, setUploadedItems] = useState<MediaClip[]>([]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setStockItems(CURATED_STOCK_MEDIA);
      return;
    }
    const q = searchQuery.toLowerCase();
    const filtered = CURATED_STOCK_MEDIA.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q)
    );
    setStockItems(filtered.length > 0 ? filtered : CURATED_STOCK_MEDIA);
  }, [searchQuery]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isVideo = file.type.startsWith("video");
      const url = URL.createObjectURL(file);

      const newClip: MediaClip = {
        id: generateId("upload"),
        type: isVideo ? "video" : "photo",
        name: file.name.slice(0, 20),
        url,
        thumbnailUrl: isVideo ? undefined : url,
        durationInFrames: 90, // default 3 seconds
        transition: "fade",
        transitionDuration: 15,
        animationEffect: isVideo ? "none" : "ken-burns",
        filter: "none",
        volume: 1,
      };

      setUploadedItems((prev) => [newClip, ...prev]);
      onAddClip(newClip);
    }
  };

  const handleAddStock = (item: StockMediaItem) => {
    const newClip: MediaClip = {
      id: generateId("clip"),
      type: item.type,
      name: item.title,
      url: item.url,
      thumbnailUrl: item.thumbnailUrl,
      durationInFrames: 90,
      transition: "fade",
      transitionDuration: 15,
      animationEffect: item.type === "photo" ? "ken-burns" : "none",
      filter: "none",
      titleOverlay: item.title.toUpperCase(),
    };
    onAddClip(newClip);
  };

  return (
    <div className="flex flex-col h-full bg-studio-panel border-r border-studio-border w-72 md:w-80 text-slate-200">
      {/* Header Tabs */}
      <div className="p-3 border-b border-studio-border flex items-center justify-between">
        <div className="flex items-center gap-1 bg-studio-dark p-1 rounded-lg border border-studio-border w-full">
          <button
            onClick={() => setActiveTab("stock")}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${
              activeTab === "stock"
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Stok Media Gratis
          </button>
          <button
            onClick={() => setActiveTab("uploads")}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${
              activeTab === "uploads"
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Upload ({uploadedItems.length})
          </button>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="p-3 border-b border-studio-border">
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-studio-border hover:border-indigo-500/70 rounded-xl p-3 cursor-pointer bg-studio-dark/40 hover:bg-studio-dark/70 transition group text-center">
          <UploadCloud className="w-6 h-6 text-indigo-400 group-hover:scale-110 transition-transform mb-1" />
          <span className="text-xs font-semibold text-slate-300">
            Upload Foto / Video
          </span>
          <span className="text-[10px] text-slate-500">
            JPG, PNG, MP4, WebM (Otomatis masuk timeline)
          </span>
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Stock Search Box */}
      {activeTab === "stock" && (
        <div className="p-3 border-b border-studio-border">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari foto atau video..."
              className="w-full bg-studio-dark border border-studio-border rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      )}

      {/* Media Grid */}
      <div className="flex-1 overflow-y-auto p-3">
        {activeTab === "stock" ? (
          <div className="grid grid-cols-2 gap-2">
            {stockItems.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-lg overflow-hidden border border-studio-border bg-black aspect-video cursor-pointer hover:border-indigo-500 transition"
                onClick={() => handleAddStock(item)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.thumbnailUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-1.5">
                  <span className="text-[10px] font-medium text-white truncate">
                    {item.title}
                  </span>
                  <span className="text-[9px] text-slate-400 capitalize">
                    {item.type} • {item.category}
                  </span>
                </div>
                <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 shadow transition">
                  <Plus className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            {uploadedItems.length === 0 ? (
              <div className="text-center p-6 text-slate-500 text-xs">
                Belum ada foto atau video yang diunggah. Tarik file ke sini.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {uploadedItems.map((clip) => (
                  <div
                    key={clip.id}
                    className="group relative rounded-lg overflow-hidden border border-studio-border bg-black aspect-video cursor-pointer"
                    onClick={() => onAddClip(clip)}
                  >
                    {clip.type === "photo" ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={clip.url}
                        alt={clip.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-400">
                        <Film className="w-6 h-6 text-indigo-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddClip(clip);
                        }}
                        className="p-1 rounded bg-indigo-600 text-white"
                        title="Tambahkan lagi"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
