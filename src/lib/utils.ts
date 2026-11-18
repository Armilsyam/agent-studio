import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(prefix: string = "id"): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;
}

export function framesToSeconds(frames: number, fps: number = 30): number {
  return frames / fps;
}

export function secondsToFrames(seconds: number, fps: number = 30): number {
  return Math.round(seconds * fps);
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 10);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${ms}`;
}

export function formatFramesToTime(frames: number, fps: number = 30): string {
  return formatTime(frames / fps);
}

export function getTotalDurationInFrames(clips: { durationInFrames: number }[]): number {
  return clips.reduce((acc, clip) => acc + (clip.durationInFrames || 0), 0);
}
