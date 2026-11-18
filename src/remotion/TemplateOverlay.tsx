"use client";

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { VideoTemplate } from "./types";

interface TemplateOverlayProps {
  template: VideoTemplate;
  totalDurationFrames: number;
}

export const TemplateOverlay: React.FC<TemplateOverlayProps> = ({
  template,
  totalDurationFrames,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Progress percentage (0 to 100)
  const progress = Math.min(100, (frame / Math.max(1, totalDurationFrames)) * 100);

  return (
    <>
      {/* TikTok Top Progress Bar */}
      {(template === "viral-tiktok" || template === "podcast-waveform") && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            zIndex: 70,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg, #38bdf8, #facc15)",
              boxShadow: "0 0 8px #facc15",
            }}
          />
        </div>
      )}

      {/* Cinematic Documentary Letterbox Bars */}
      {template === "cinematic-docu" && (
        <>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: `${Math.round(height * 0.08)}px`,
              backgroundColor: "#000000",
              zIndex: 65,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 40px",
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: "14px",
              fontWeight: 600,
              letterSpacing: "2px",
              fontFamily: "serif",
              pointerEvents: "none",
            }}
          >
            <span>DOCUMENTARY SERIES</span>
            <span>CHAPTER I</span>
          </div>

          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: `${Math.round(height * 0.08)}px`,
              backgroundColor: "#000000",
              zIndex: 65,
              pointerEvents: "none",
            }}
          />
        </>
      )}

      {/* Product Promo Animated Buy Button */}
      {template === "product-promo" && (
        <div
          style={{
            position: "absolute",
            bottom: "8%",
            left: "50%",
            transform: `translateX(-50%) scale(${1 + Math.sin((frame / 10) * Math.PI) * 0.04})`,
            zIndex: 60,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              background: "linear-gradient(90deg, #10b981, #059669)",
              padding: "14px 32px",
              borderRadius: "40px",
              color: "#ffffff",
              fontSize: `${Math.round(width * 0.032)}px`,
              fontWeight: 900,
              boxShadow: "0 10px 25px rgba(16, 185, 129, 0.5), 0 0 20px rgba(255,255,255,0.3)",
              border: "2px solid #ffffff",
              textTransform: "uppercase",
              letterSpacing: "1px",
              whiteSpace: "nowrap",
            }}
          >
            🛒 ORDER SEKARANG • DISKON 50%
          </div>
        </div>
      )}
    </>
  );
};
