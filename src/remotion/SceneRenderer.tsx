"use client";

import React from "react";
import { Img, interpolate, useCurrentFrame, Video } from "remotion";
import { MediaClip } from "./types";
import { TransitionWrapper } from "./transitions/TransitionWrapper";

interface SceneRendererProps {
  clip: MediaClip;
}

export const SceneRenderer: React.FC<SceneRendererProps> = ({ clip }) => {
  const frame = useCurrentFrame();
  const duration = clip.durationInFrames;

  // Ken-burns calculation for photos
  let scale = 1;
  let translateX = 0;
  let translateY = 0;

  if (clip.type === "photo") {
    switch (clip.animationEffect) {
      case "ken-burns":
      case "zoom-in": {
        scale = interpolate(frame, [0, duration], [1, 1.18], {
          extrapolateRight: "clamp",
        });
        translateY = interpolate(frame, [0, duration], [0, -15], {
          extrapolateRight: "clamp",
        });
        break;
      }
      case "pan-left": {
        scale = 1.12;
        translateX = interpolate(frame, [0, duration], [20, -20], {
          extrapolateRight: "clamp",
        });
        break;
      }
      case "pan-right": {
        scale = 1.12;
        translateX = interpolate(frame, [0, duration], [-20, 20], {
          extrapolateRight: "clamp",
        });
        break;
      }
      case "pulse": {
        const cycle = Math.sin((frame / 20) * Math.PI);
        scale = 1 + cycle * 0.05;
        break;
      }
      default:
        scale = 1;
        break;
    }
  }

  // Filter styles
  let filterStyle = "";
  switch (clip.filter) {
    case "vintage":
      filterStyle = "sepia(0.4) contrast(1.15) brightness(0.95)";
      break;
    case "cyberpunk":
      filterStyle = "hue-rotate(290deg) contrast(1.25) saturate(1.4)";
      break;
    case "warm":
      filterStyle = "sepia(0.2) saturate(1.2) brightness(1.05)";
      break;
    case "cool":
      filterStyle = "hue-rotate(180deg) saturate(1.1) brightness(1.02)";
      break;
    case "bw":
      filterStyle = "grayscale(1) contrast(1.2)";
      break;
    default:
      filterStyle = "none";
      break;
  }

  const mediaContent = (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundColor: "#050811",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {clip.type === "photo" ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
            filter: filterStyle,
            transition: "filter 0.3s ease",
            transformOrigin: "center center",
          }}
        >
          <Img
            src={clip.url}
            alt={clip.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            filter: filterStyle,
          }}
        >
          <Video
            src={clip.url}
            volume={clip.volume ?? 1}
            playbackRate={clip.speed ?? 1}
            startFrom={clip.sourceStartFrame ?? 0}
            endAt={clip.sourceEndFrame ? clip.sourceEndFrame : undefined}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      )}

      {/* Subtle vignette overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle, rgba(0,0,0,0) 60%, rgba(0,0,0,0.45) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Title & subtitle overlays on the clip if set */}
      {(clip.titleOverlay || clip.subtitleOverlay) && (
        <div
          style={{
            position: "absolute",
            bottom: "15%",
            left: "8%",
            right: "8%",
            textAlign: "center",
            padding: "16px 24px",
            background: "rgba(0, 0, 0, 0.65)",
            backdropFilter: "blur(12px)",
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            color: "#ffffff",
          }}
        >
          {clip.titleOverlay && (
            <h2
              style={{
                fontSize: "36px",
                fontWeight: 800,
                letterSpacing: "-0.5px",
                marginBottom: clip.subtitleOverlay ? "6px" : 0,
                textTransform: "uppercase",
                background: "linear-gradient(90deg, #60a5fa, #a855f7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {clip.titleOverlay}
            </h2>
          )}
          {clip.subtitleOverlay && (
            <p
              style={{
                fontSize: "20px",
                fontWeight: 500,
                color: "#e2e8f0",
                lineHeight: 1.4,
              }}
            >
              {clip.subtitleOverlay}
            </p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <TransitionWrapper
      type={clip.transition}
      durationInFrames={clip.durationInFrames}
      transitionFrames={clip.transitionDuration ?? 15}
    >
      {mediaContent}
    </TransitionWrapper>
  );
};
