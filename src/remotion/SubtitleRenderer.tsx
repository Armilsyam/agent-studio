"use client";

import React from "react";
import { useCurrentFrame } from "remotion";
import { CaptionConfig, SubtitleLine } from "./types";

interface SubtitleRendererProps {
  config: CaptionConfig;
}

export const SubtitleRenderer: React.FC<SubtitleRendererProps> = ({ config }) => {
  const frame = useCurrentFrame();

  if (!config.enabled || !config.lines || config.lines.length === 0) {
    return null;
  }

  // Find active line
  const activeLine = config.lines.find(
    (line: SubtitleLine) => frame >= line.startFrame && frame <= line.endFrame
  );

  if (!activeLine) {
    return null;
  }

  // Positioning
  let positionStyle: React.CSSProperties = {
    position: "absolute",
    left: "5%",
    right: "5%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    pointerEvents: "none",
    zIndex: 50,
  };

  switch (config.position) {
    case "top":
      positionStyle.top = "12%";
      break;
    case "center":
      positionStyle.top = "45%";
      break;
    case "bottom":
    default:
      positionStyle.bottom = "12%";
      break;
  }

  const { style, fontSize, fontColor, highlightColor, fontFamily } = config;

  // Render words if available for TikTok / karaoke highlight effect
  if (activeLine.words && activeLine.words.length > 0) {
    return (
      <div style={positionStyle}>
        <div
          style={{
            maxWidth: "90%",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "8px 12px",
            padding: "12px 20px",
            background:
              style === "box"
                ? "rgba(0, 0, 0, 0.75)"
                : style === "neon"
                ? "rgba(10, 15, 30, 0.6)"
                : "transparent",
            borderRadius: style === "box" ? "12px" : "0px",
            border:
              style === "neon"
                ? `1px solid ${highlightColor || "#38bdf8"}`
                : "none",
            boxShadow:
              style === "neon"
                ? `0 0 20px ${highlightColor || "#38bdf8"}44`
                : "none",
          }}
        >
          {activeLine.words.map((word, idx) => {
            const isWordActive = frame >= word.startFrame && frame <= word.endFrame;
            const isPast = frame > word.endFrame;

            let color = fontColor || "#ffffff";
            let wordTransform = "scale(1)";
            let textShadow = "2px 2px 8px rgba(0,0,0,0.9)";

            if (style === "tiktok" && isWordActive) {
              color = highlightColor || "#facc15"; // yellow TikTok highlight
              wordTransform = "scale(1.18)";
              textShadow = "0px 0px 14px rgba(250, 204, 21, 0.8), 2px 2px 4px #000";
            } else if (style === "karaoke" && (isWordActive || isPast)) {
              color = highlightColor || "#38bdf8";
            } else if (style === "neon" && isWordActive) {
              color = highlightColor || "#a855f7";
              textShadow = `0 0 10px ${highlightColor}, 0 0 20px ${highlightColor}`;
            }

            return (
              <span
                key={idx}
                style={{
                  fontFamily: fontFamily || "Inter, system-ui, sans-serif",
                  fontSize: `${fontSize || 38}px`,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  color,
                  transform: wordTransform,
                  transition: "transform 0.1s ease, color 0.1s ease",
                  textShadow,
                  letterSpacing: "-0.5px",
                  display: "inline-block",
                }}
              >
                {word.text}
              </span>
            );
          })}
        </div>
      </div>
    );
  }

  // Fallback for simple line text
  return (
    <div style={positionStyle}>
      <div
        style={{
          fontFamily: fontFamily || "Inter, system-ui, sans-serif",
          fontSize: `${fontSize || 36}px`,
          fontWeight: 800,
          textTransform: style === "tiktok" ? "uppercase" : "none",
          color: fontColor || "#ffffff",
          textAlign: "center",
          maxWidth: "85%",
          lineHeight: 1.35,
          padding: "10px 22px",
          backgroundColor:
            style === "box"
              ? "rgba(0, 0, 0, 0.8)"
              : style === "neon"
              ? "rgba(15, 23, 42, 0.75)"
              : "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(8px)",
          borderRadius: "14px",
          border:
            style === "neon"
              ? `2px solid ${highlightColor || "#ec4899"}`
              : "1px solid rgba(255, 255, 255, 0.15)",
          textShadow:
            style === "neon"
              ? `0 0 12px ${highlightColor || "#ec4899"}`
              : "2px 2px 6px rgba(0, 0, 0, 0.9)",
        }}
      >
        {activeLine.text}
      </div>
    </div>
  );
};
