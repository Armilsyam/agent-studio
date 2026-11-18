export type AspectRatio = "9:16" | "16:9" | "1:1";

export type TransitionType = "fade" | "slide-left" | "slide-right" | "zoom-in" | "zoom-out" | "none";

export type AnimationEffect = "ken-burns" | "pan-left" | "pan-right" | "zoom-in" | "pulse" | "none";

export type CaptionStyle = "tiktok" | "karaoke" | "neon" | "minimal" | "box";

export interface SubtitleWord {
  text: string;
  startFrame: number;
  endFrame: number;
}

export interface SubtitleLine {
  id: string;
  startFrame: number;
  endFrame: number;
  text: string;
  words?: SubtitleWord[];
}

export interface MediaClip {
  id: string;
  type: "photo" | "video";
  url: string;
  thumbnailUrl?: string;
  name: string;
  durationInFrames: number;
  sourceStartFrame?: number; // for trimmed video clips
  sourceEndFrame?: number;   // for trimmed video clips
  transition?: TransitionType;
  transitionDuration?: number; // frames, e.g. 15
  animationEffect?: AnimationEffect;
  filter?: "none" | "vintage" | "cyberpunk" | "warm" | "cool" | "bw";
  volume?: number; // 0 to 1
  speed?: number; // 0.5, 1, 1.5, 2
  titleOverlay?: string;
  subtitleOverlay?: string;
}

export interface AudioLayer {
  id: string;
  type: "bgm" | "voiceover" | "sfx";
  url: string;
  title: string;
  volume: number; // 0 to 1
  startFrame: number;
  durationInFrames: number;
  fadeInFrames?: number;
  fadeOutFrames?: number;
}

export interface CaptionConfig {
  enabled: boolean;
  style: CaptionStyle;
  fontSize: number;
  fontColor: string;
  highlightColor: string;
  fontFamily: string;
  position: "bottom" | "center" | "top";
  lines: SubtitleLine[];
}

export interface VideoProject {
  id: string;
  title: string;
  description: string;
  tags: string[];
  aspectRatio: AspectRatio;
  fps: number;
  width: number;
  height: number;
  clips: MediaClip[];
  captions: CaptionConfig;
  audioLayers: AudioLayer[];
  watermark?: {
    text?: string;
    imageUrl?: string;
    position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  };
  createdAt: string;
  updatedAt: string;
}

export const ASPECT_RATIOS: Record<AspectRatio, { width: number; height: number; label: string; icon: string }> = {
  "9:16": { width: 1080, height: 1920, label: "TikTok / Reels / Shorts (9:16)", icon: "Smartphone" },
  "16:9": { width: 1920, height: 1080, label: "YouTube / Facebook (16:9)", icon: "Tv" },
  "1:1": { width: 1080, height: 1080, label: "Instagram Feed (1:1)", icon: "Square" },
};
