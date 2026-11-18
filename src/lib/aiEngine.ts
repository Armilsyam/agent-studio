import { MediaClip, SubtitleLine, VideoProject, ASPECT_RATIOS } from "../remotion/types";
import { generateId, secondsToFrames } from "./utils";
import { CURATED_STOCK_MEDIA, CURATED_STOCK_AUDIO } from "./stockMediaService";

export interface AIScriptResult {
  title: string;
  description: string;
  tags: string[];
  scenes: {
    visualDescription: string;
    keywords: string;
    caption: string;
    voiceover: string;
    durationSeconds: number;
    transition: "fade" | "slide-left" | "slide-right" | "zoom-in" | "zoom-out";
    filter: "none" | "vintage" | "cyberpunk" | "warm" | "cool" | "bw";
    titleOverlay?: string;
  }[];
  musicGenre: string;
}

export async function generateAIScript(prompt: string, targetDuration: number = 15): Promise<AIScriptResult> {
  // If GEMINI_API_KEY is available in process.env, we can make an external call, otherwise intelligent local AI engine
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (apiKey) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Kamu adalah sutradara video AI profesional. Buat storyboard video untuk prompt berikut: "${prompt}". Durasi target: ${targetDuration} detik. Output HANYA JSON murni dengan format:
{
  "title": "Judul video menarik",
  "description": "Deskripsi singkat video",
  "tags": ["#tag1", "#tag2"],
  "musicGenre": "Lo-Fi / Cinematic / Upbeat",
  "scenes": [
    {
      "visualDescription": "Deskripsi visual",
      "keywords": "kata kunci gambar atau video (english)",
      "caption": "Teks subtitle singkat kapital",
      "voiceover": "Naskah narasi suara",
      "durationSeconds": 3,
      "transition": "fade | slide-left | zoom-in",
      "filter": "cyberpunk | vintage | warm | none",
      "titleOverlay": "TEKS JUDUL SCENE"
    }
  ]
}`,
                },
              ],
            },
          ],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        const cleanedJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleanedJson);
        return parsed;
      }
    } catch (e) {
      console.warn("Gemini API call failed, falling back to local intelligent engine", e);
    }
  }

  // Local Intelligent AI Script Generator (100% Free & Instant Offline)
  return generateLocalScript(prompt, targetDuration);
}

function generateLocalScript(prompt: string, targetDuration: number): AIScriptResult {
  const p = prompt.toLowerCase();
  let topic = "Teknologi & Kreativitas Digital";
  let filter: "cyberpunk" | "vintage" | "warm" | "none" = "cyberpunk";

  if (p.includes("masak") || p.includes("kuliner") || p.includes("food")) {
    topic = "Kuliner Lezat & Resep Praktis";
    filter = "warm";
  } else if (p.includes("travel") || p.includes("wisata") || p.includes("alam")) {
    topic = "Eksplorasi Keindahan Alam";
    filter = "warm";
  } else if (p.includes("bisnis") || p.includes("uang") || p.includes("marketing")) {
    topic = "Strategi Pertumbuhan Bisnis Modern";
    filter = "none";
  } else if (p.includes("motivasi") || p.includes("hidup") || p.includes("tips")) {
    topic = "Inspirasi & Mindset Sukses Harian";
    filter = "vintage";
  }

  const numScenes = Math.max(3, Math.min(6, Math.round(targetDuration / 3.5)));
  const sceneDuration = Math.round(targetDuration / numScenes);

  const scenes = [];
  const promptsArray = [
    {
      visual: "Visual pembuka yang memukau dan menarik perhatian audiens dalam 3 detik pertama",
      keywords: "technology abstract neural network",
      caption: `RAHASIA UTAMA ${prompt.toUpperCase().slice(0, 30)}`,
      voiceover: `Pernahkah kamu membayangkan bagaimana ${prompt} bisa mengubah segalanya?`,
      titleOverlay: "TAHUKAH KAMU?",
      transition: "fade" as const,
    },
    {
      visual: "Visual fokus pada proses inovasi dan langkah-langkah konkret",
      keywords: "cyberpunk futuristic robot modern",
      caption: "SEMUA BISA DIKERJAKAN DENGAN OTOMATIS",
      voiceover: "Dengan bantuan teknologi dan AI, proses yang tadinya rumit kini selesai dalam hitungan detik.",
      titleOverlay: "LEBIH CEPAT",
      transition: "slide-left" as const,
    },
    {
      visual: "Visual hasil karya visual yang estetik dan memukau",
      keywords: "creative studio digital art design",
      caption: "HASIL MAKSIMAL TANPA REPOT EDITING",
      voiceover: "Kualitas gambar, klip yang rapi, dan musik yang pas membuat kontenmu terlihat sangat profesional.",
      titleOverlay: "KUALITAS TINGGI",
      transition: "zoom-in" as const,
    },
    {
      visual: "Visual penutup dengan ajakan aksi (Call to action)",
      keywords: "futuristic light portal success",
      caption: "COBA SEKARANG DAN BUKTIKAN SENDIRI",
      voiceover: "Yuk mulai sekarang juga dan bagikan videomu ke dunia!",
      titleOverlay: "MULAI SEKARANG",
      transition: "fade" as const,
    },
  ];

  for (let i = 0; i < numScenes; i++) {
    const template = promptsArray[i % promptsArray.length];
    scenes.push({
      visualDescription: template.visual,
      keywords: template.keywords,
      caption: template.caption,
      voiceover: template.voiceover,
      durationSeconds: sceneDuration,
      transition: template.transition,
      filter: filter,
      titleOverlay: template.titleOverlay,
    });
  }

  return {
    title: `${topic}: ${prompt.slice(0, 40)}`,
    description: `Video otomatis yang membahas ${prompt} dengan visual dinamis, transisi halus, dan narasi yang menarik.`,
    tags: ["#AgentStudio", "#AIVideo", "#Remotion", "#ContentCreator", "#ShortsViral"],
    musicGenre: "Lo-Fi",
    scenes,
  };
}

export function buildProjectFromAIScript(
  script: AIScriptResult,
  aspectRatio: "9:16" | "16:9" | "1:1" = "9:16"
): VideoProject {
  const fps = 30;
  const config = ASPECT_RATIOS[aspectRatio];

  let currentFrame = 0;
  const clips: MediaClip[] = [];
  const subtitleLines: SubtitleLine[] = [];

  script.scenes.forEach((scene, index) => {
    const durationFrames = secondsToFrames(scene.durationSeconds, fps);
    const stockAsset = CURATED_STOCK_MEDIA[index % CURATED_STOCK_MEDIA.length];

    clips.push({
      id: generateId("clip"),
      type: stockAsset.type,
      name: `Scene ${index + 1}: ${scene.titleOverlay || "Clip"}`,
      url: stockAsset.url,
      thumbnailUrl: stockAsset.thumbnailUrl,
      durationInFrames: durationFrames,
      transition: scene.transition,
      transitionDuration: 15,
      animationEffect: index % 2 === 0 ? "ken-burns" : "zoom-in",
      filter: scene.filter,
      titleOverlay: scene.titleOverlay,
      subtitleOverlay: scene.caption,
    });

    // Create synchronized captions
    const words = scene.caption.split(" ");
    const wordDuration = Math.floor((durationFrames - 10) / Math.max(1, words.length));

    const subtitleWords = words.map((w, wIdx) => {
      const wStart = currentFrame + 5 + wIdx * wordDuration;
      const wEnd = wStart + wordDuration - 2;
      return {
        text: w,
        startFrame: wStart,
        endFrame: wEnd,
      };
    });

    subtitleLines.push({
      id: generateId("sub"),
      startFrame: currentFrame + 5,
      endFrame: currentFrame + durationFrames - 5,
      text: scene.caption,
      words: subtitleWords,
    });

    currentFrame += durationFrames;
  });

  const selectedBgm = CURATED_STOCK_AUDIO[0];

  return {
    id: generateId("proj_ai"),
    title: script.title,
    description: script.description,
    tags: script.tags,
    aspectRatio,
    fps,
    width: config.width,
    height: config.height,
    clips,
    captions: {
      enabled: true,
      style: "tiktok",
      fontSize: aspectRatio === "9:16" ? 42 : 36,
      fontColor: "#ffffff",
      highlightColor: "#facc15",
      fontFamily: "Inter, sans-serif",
      position: "bottom",
      lines: subtitleLines,
    },
    audioLayers: [
      {
        id: generateId("bgm"),
        type: "bgm",
        url: selectedBgm.url,
        title: selectedBgm.title,
        volume: 0.35,
        startFrame: 0,
        durationInFrames: currentFrame,
        fadeInFrames: 30,
        fadeOutFrames: 30,
      },
    ],
    watermark: {
      text: "@Armilsyam • AI Agent Studio",
      position: "top-right",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
