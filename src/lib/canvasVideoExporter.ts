import { VideoProject } from "../remotion/types";

export interface ExportProgress {
  progress: number;
  currentFrame: number;
  totalFrames: number;
  statusText: string;
}

export async function exportProjectToWebM(
  project: VideoProject,
  onProgress?: (p: ExportProgress) => void
): Promise<Blob> {
  const { width, height, fps, clips, captions, audioLayers = [] } = project;
  const totalFrames = clips.reduce((acc, c) => acc + c.durationInFrames, 0);

  if (totalFrames <= 0) {
    throw new Error("Proyek tidak memiliki klip untuk diekspor.");
  }

  // Create off-screen canvas
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Gagal menginisialisasi context canvas 2D");
  }

  // Preload visual images
  onProgress?.({
    progress: 5,
    currentFrame: 0,
    totalFrames,
    statusText: "Memuat aset visual & audio...",
  });

  const loadedImages: Record<string, HTMLImageElement> = {};
  for (const clip of clips) {
    if (clip.type === "photo" && !loadedImages[clip.url]) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = clip.url;
      await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = () => resolve(null);
      });
      loadedImages[clip.url] = img;
    }
  }

  // Setup Web Audio API to mix audio layers (BGM + Voiceover) into the recorded video stream
  let audioTracks: MediaStreamTrack[] = [];
  let audioCtx: AudioContext | null = null;
  const activeAudioElements: HTMLAudioElement[] = [];

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
      const dest = audioCtx.createMediaStreamDestination();

      for (const layer of audioLayers) {
        if (layer.url) {
          const audio = new Audio(layer.url);
          audio.crossOrigin = "anonymous";
          audio.volume = layer.volume ?? 0.8;
          activeAudioElements.push(audio);

          try {
            const source = audioCtx.createMediaElementSource(audio);
            source.connect(dest);
            source.connect(audioCtx.destination);
          } catch (e) {
            // cross-origin audio source fallback
          }
        }
      }
      audioTracks = dest.stream.getAudioTracks();
    }
  } catch (err) {
    console.warn("Web Audio mixing fallback to silent video", err);
  }

  // Combine video and audio tracks
  const canvasStream = canvas.captureStream(fps);
  const combinedStream = new MediaStream([
    ...canvasStream.getVideoTracks(),
    ...audioTracks,
  ]);

  const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
    ? "video/webm;codecs=vp9,opus"
    : MediaRecorder.isTypeSupported("video/webm;codecs=vp8,opus")
    ? "video/webm;codecs=vp8,opus"
    : "video/webm";

  const recorder = new MediaRecorder(combinedStream, {
    mimeType,
    videoBitsPerSecond: 8000000,
  });

  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) {
      chunks.push(e.data);
    }
  };

  recorder.start();

  // Start playing audio elements
  activeAudioElements.forEach((a) => {
    try {
      a.currentTime = 0;
      a.play().catch(() => {});
    } catch (e) {}
  });

  // Draw frame by frame
  let currentGlobalFrame = 0;

  for (let clipIdx = 0; clipIdx < clips.length; clipIdx++) {
    const clip = clips[clipIdx];
    const clipFrames = clip.durationInFrames;

    for (let f = 0; f < clipFrames; f++) {
      currentGlobalFrame++;
      const progressPercent = Math.min(
        95,
        Math.round((currentGlobalFrame / totalFrames) * 90) + 5
      );

      onProgress?.({
        progress: progressPercent,
        currentFrame: currentGlobalFrame,
        totalFrames,
        statusText: `Merender frame ${currentGlobalFrame}/${totalFrames} (${progressPercent}%)...`,
      });

      // Background
      ctx.fillStyle = "#030712";
      ctx.fillRect(0, 0, width, height);

      // Photo with Ken-Burns pan/zoom
      if (clip.type === "photo") {
        const img = loadedImages[clip.url];
        if (img && img.naturalWidth) {
          ctx.save();

          let scale = 1.0;
          let translateY = 0;
          let translateX = 0;

          if (clip.animationEffect === "ken-burns" || clip.animationEffect === "zoom-in") {
            scale = 1.0 + (f / clipFrames) * 0.15;
            translateY = -(f / clipFrames) * 20;
          } else if (clip.animationEffect === "pan-left") {
            scale = 1.1;
            translateX = 20 - (f / clipFrames) * 40;
          } else if (clip.animationEffect === "pan-right") {
            scale = 1.1;
            translateX = -20 + (f / clipFrames) * 40;
          }

          if (clip.filter === "vintage") {
            ctx.filter = "sepia(0.4) contrast(1.15)";
          } else if (clip.filter === "cyberpunk") {
            ctx.filter = "hue-rotate(290deg) contrast(1.25) saturate(1.4)";
          } else if (clip.filter === "warm") {
            ctx.filter = "sepia(0.2) saturate(1.2)";
          } else if (clip.filter === "bw") {
            ctx.filter = "grayscale(1) contrast(1.2)";
          }

          ctx.translate(width / 2 + translateX, height / 2 + translateY);
          ctx.scale(scale, scale);

          const imgAspect = img.naturalWidth / img.naturalHeight;
          const canvasAspect = width / height;
          let renderW = width;
          let renderH = height;

          if (imgAspect > canvasAspect) {
            renderH = height;
            renderW = height * imgAspect;
          } else {
            renderW = width;
            renderH = width / imgAspect;
          }

          ctx.drawImage(img, -renderW / 2, -renderH / 2, renderW, renderH);
          ctx.restore();
        }
      }

      // Vignette
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        height * 0.2,
        width / 2,
        height / 2,
        height * 0.7
      );
      gradient.addColorStop(0, "rgba(0,0,0,0)");
      gradient.addColorStop(1, "rgba(0,0,0,0.5)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Top TikTok Progress Bar
      ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
      ctx.fillRect(0, 0, width, 8);
      ctx.fillStyle = "#facc15";
      ctx.fillRect(0, 0, (currentGlobalFrame / totalFrames) * width, 8);

      // Audio waveform animation simulation on canvas
      if (project.visualizer?.enabled) {
        ctx.save();
        const barW = Math.round(width * 0.015);
        const barGap = Math.round(width * 0.005);
        const totalBars = project.visualizer.barCount || 24;
        const startX = (width - (totalBars * (barW + barGap))) / 2;
        const baseY = height * 0.76;

        ctx.fillStyle = project.visualizer.color || "#06b6d4";
        for (let b = 0; b < totalBars; b++) {
          const freq = Math.sin((currentGlobalFrame * 0.2) + (b * 0.4)) * 0.5 + 0.5;
          const barH = 10 + freq * 60;
          ctx.fillRect(startX + b * (barW + barGap), baseY - barH, barW, barH);
        }
        ctx.restore();
      }

      // Title Overlay
      if (clip.titleOverlay) {
        ctx.save();
        ctx.font = `bold ${Math.round(width * 0.05)}px sans-serif`;
        ctx.textAlign = "center";
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "rgba(0,0,0,0.8)";
        ctx.shadowBlur = 10;
        ctx.fillText(clip.titleOverlay, width / 2, height * 0.65);
        ctx.restore();
      }

      // Captions
      if (captions.enabled && captions.lines) {
        const activeLine = captions.lines.find(
          (l) => currentGlobalFrame >= l.startFrame && currentGlobalFrame <= l.endFrame
        );

        if (activeLine) {
          ctx.save();
          const capFontSize = Math.round(width * 0.045);
          ctx.font = `bold ${capFontSize}px sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          const capY = captions.position === "top" ? height * 0.15 : captions.position === "center" ? height * 0.5 : height * 0.85;

          ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
          const textWidth = ctx.measureText(activeLine.text).width;
          const padX = 24;
          const padY = 14;
          ctx.fillRect(
            width / 2 - textWidth / 2 - padX,
            capY - capFontSize / 2 - padY,
            textWidth + padX * 2,
            capFontSize + padY * 2
          );

          ctx.fillStyle = captions.highlightColor || "#facc15";
          ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
          ctx.shadowBlur = 8;
          ctx.fillText(activeLine.text, width / 2, capY);
          ctx.restore();
        }
      }

      // Watermark
      if (project.watermark?.text) {
        ctx.save();
        ctx.font = `600 ${Math.round(width * 0.02)}px sans-serif`;
        ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
        ctx.textAlign = "right";
        ctx.fillText(project.watermark.text, width - 24, 40);
        ctx.restore();
      }

      await new Promise((r) => setTimeout(r, 1000 / (fps * 2)));
    }
  }

  // Stop audio elements
  activeAudioElements.forEach((a) => {
    try {
      a.pause();
    } catch (e) {}
  });

  onProgress?.({
    progress: 98,
    currentFrame: totalFrames,
    totalFrames,
    statusText: "Menyelesaikan encoding video & audio...",
  });

  return new Promise((resolve) => {
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      onProgress?.({
        progress: 100,
        currentFrame: totalFrames,
        totalFrames,
        statusText: "Video siap diunduh!",
      });
      resolve(blob);
    };
    recorder.stop();
  });
}
