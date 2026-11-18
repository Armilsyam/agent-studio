"use client";

import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AnimatedSticker } from "./types";

interface AnimatedStickersProps {
  stickers?: AnimatedSticker[];
}

export const AnimatedStickers: React.FC<AnimatedStickersProps> = ({ stickers }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  if (!stickers || stickers.length === 0) return null;

  return (
    <>
      {stickers.map((st) => {
        if (frame < st.startFrame || frame > st.endFrame) return null;

        const relFrame = frame - st.startFrame;

        // Entrance spring bounce
        const entrance = spring({
          frame: relFrame,
          fps,
          config: { damping: 12, stiffness: 200 },
        });

        // Loop animation
        let transformAnim = `scale(${entrance})`;
        if (st.animation === "pulse") {
          const pulse = 1 + Math.sin((frame / 12) * Math.PI) * 0.08;
          transformAnim = `scale(${entrance * pulse})`;
        } else if (st.animation === "bounce") {
          const bounce = Math.abs(Math.sin((frame / 10) * Math.PI)) * 10;
          transformAnim = `scale(${entrance}) translateY(-${bounce}px)`;
        }

        let posStyle: React.CSSProperties = {};
        switch (st.position) {
          case "top-left":
            posStyle = { top: "60px", left: "40px" };
            break;
          case "top-right":
            posStyle = { top: "60px", right: "40px" };
            break;
          case "bottom-left":
            posStyle = { bottom: "180px", left: "40px" };
            break;
          case "bottom-right":
            posStyle = { bottom: "180px", right: "40px" };
            break;
          case "center":
          default:
            posStyle = { top: "35%", left: "50%", transform: "translateX(-50%)" };
            break;
        }

        let bgGradient = "linear-gradient(135deg, #ef4444, #f97316)";
        let iconEmoji = "🔥";
        if (st.type === "sale") {
          bgGradient = "linear-gradient(135deg, #f59e0b, #eab308)";
          iconEmoji = "🏷️";
        } else if (st.type === "verified") {
          bgGradient = "linear-gradient(135deg, #3b82f6, #06b6d4)";
          iconEmoji = "✅";
        } else if (st.type === "star") {
          bgGradient = "linear-gradient(135deg, #8b5cf6, #ec4899)";
          iconEmoji = "⭐";
        }

        return (
          <div
            key={st.id}
            style={{
              position: "absolute",
              ...posStyle,
              zIndex: 55,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                transform: transformAnim,
                background: bgGradient,
                padding: "10px 18px",
                borderRadius: "30px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.5), 0 0 15px rgba(255,255,255,0.4)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#ffffff",
                fontWeight: 900,
                fontSize: `${Math.round(width * 0.03)}px`,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                border: "2px solid rgba(255,255,255,0.8)",
              }}
            >
              <span>{iconEmoji}</span>
              <span>{st.text}</span>
            </div>
          </div>
        );
      })}
    </>
  );
};
