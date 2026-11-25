"use client";

import React from "react";
import { Img, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AIActorConfig } from "./types";

interface AIActorPresenterProps {
  actor?: AIActorConfig;
}

export const AIActorPresenter: React.FC<AIActorPresenterProps> = ({ actor }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  if (!actor || !actor.enabled) return null;

  // Entrance animation spring
  const entrance = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 180 },
  });

  // Talking / breathing rhythmic pulsation
  const talkPulse = Math.sin((frame / 8) * Math.PI) * 0.025;
  const currentScale = entrance * (1 + talkPulse);

  // Position style
  let posStyle: React.CSSProperties = {
    position: "absolute",
    zIndex: 62,
    pointerEvents: "none",
  };

  const isPortrait = height > width;
  const circleSize = isPortrait
    ? actor.size === "large"
      ? Math.round(width * 0.36)
      : actor.size === "small"
      ? Math.round(width * 0.22)
      : Math.round(width * 0.28)
    : actor.size === "large"
    ? Math.round(height * 0.36)
    : actor.size === "small"
    ? Math.round(height * 0.22)
    : Math.round(height * 0.28);

  switch (actor.position) {
    case "bottom-left":
      posStyle.bottom = "120px";
      posStyle.left = "40px";
      break;
    case "bottom-right":
      posStyle.bottom = "120px";
      posStyle.right = "40px";
      break;
    case "top-right":
      posStyle.top = "80px";
      posStyle.right = "40px";
      break;
    case "center":
      posStyle.top = "30%";
      posStyle.left = "50%";
      posStyle.transform = "translateX(-50%)";
      break;
    default:
      posStyle.bottom = "120px";
      posStyle.right = "40px";
      break;
  }

  // Neon glowing ring color
  const glowPulse = Math.abs(Math.sin((frame / 15) * Math.PI));
  const ringColor = `rgba(56, 189, 248, ${0.6 + glowPulse * 0.4})`;

  return (
    <div
      style={{
        ...posStyle,
        transform: `${posStyle.transform || ""} scale(${currentScale})`,
        transformOrigin: "bottom center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Avatar Container */}
      <div
        style={{
          width: `${circleSize}px`,
          height: `${circleSize}px`,
          borderRadius: actor.style === "card" ? "24px" : "50%",
          overflow: "hidden",
          border: `4px solid ${ringColor}`,
          boxShadow: `0 10px 30px rgba(0,0,0,0.7), 0 0 20px ${ringColor}`,
          position: "relative",
          backgroundColor: "#0b0f19",
        }}
      >
        <Img
          src={actor.avatarUrl}
          alt={actor.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Live Speaking Badge */}
        <div
          style={{
            position: "absolute",
            bottom: "8px",
            right: "8px",
            background: "rgba(16, 185, 129, 0.9)",
            borderRadius: "50%",
            width: "14px",
            height: "14px",
            border: "2px solid #ffffff",
            boxShadow: "0 0 8px #10b981",
          }}
        />
      </div>

      {/* Nameplate Card */}
      <div
        style={{
          marginTop: "8px",
          background: "rgba(15, 23, 42, 0.85)",
          backdropFilter: "blur(10px)",
          padding: "4px 14px",
          borderRadius: "20px",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          color: "#ffffff",
          fontSize: `${Math.round(width * 0.024)}px`,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          gap: "6px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.6)",
          letterSpacing: "0.5px",
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ color: "#38bdf8" }}>🎙️</span>
        <span>{actor.name}</span>
      </div>
    </div>
  );
};
