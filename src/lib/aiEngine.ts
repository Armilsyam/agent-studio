import { MediaClip, SubtitleLine, VideoProject, ASPECT_RATIOS, VideoTemplate, AIActorConfig } from "../remotion/types";
import { generateId, secondsToFrames } from "./utils";
import { CURATED_STOCK_MEDIA, CURATED_STOCK_AUDIO, getAssetsForTheme } from "./stockMediaService";
import { generateUnlimitedAIImageUrl, PRESET_AI_ACTORS, buildSceneVisualPrompt } from "./unlimitedMediaEngine";

export interface AIScriptResult {
  title: string;
  description: string;
  tags: string[];
  theme: string;
  suggestedTemplate: VideoTemplate;
  suggestedRatio: "9:16" | "16:9" | "1:1";
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
  stickerText?: string;
}

export async function generateAIScript(prompt: string, targetDuration: number = 15): Promise<AIScriptResult> {
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
                  text: `Kamu adalah sutradara video AI profesional. Buat naskah video lengkap untuk prompt: "${prompt}". Durasi target: ${targetDuration} detik. Output HANYA JSON:
{
  "title": "Judul video memikat",
  "description": "Deskripsi singkat video",
  "tags": ["#tag1", "#tag2", "#tag3"],
  "theme": "tech | culinary | travel | promo | motivation",
  "suggestedTemplate": "viral-tiktok | cinematic-docu | podcast-waveform | product-promo",
  "suggestedRatio": "9:16 | 16:9 | 1:1",
  "musicGenre": "Lo-Fi | Cinematic | Upbeat | Synthwave",
  "stickerText": "BADGE TEKS KAPITAL",
  "scenes": [
    {
      "visualDescription": "Deskripsi visual adegan",
      "keywords": "kata kunci pencarian visual",
      "caption": "Teks subtitle kapital sinkron",
      "voiceover": "Naskah narasi suara yang diucapkan",
      "durationSeconds": 3,
      "transition": "fade | slide-left | zoom-in",
      "filter": "cyberpunk | vintage | warm | none",
      "titleOverlay": "TEKS JUDUL ADEGAN"
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
        return JSON.parse(cleanedJson);
      }
    } catch (e) {
      console.warn("Gemini API call failed, falling back to local engine", e);
    }
  }

  // Local Flexible AI Script Generator
  return generateFlexibleLocalScript(prompt, targetDuration);
}

function generateFlexibleLocalScript(prompt: string, targetDuration: number): AIScriptResult {
  const p = prompt.toLowerCase();

  let theme = "tech";
  let template: VideoTemplate = "viral-tiktok";
  let ratio: "9:16" | "16:9" | "1:1" = "9:16";
  let filter: "cyberpunk" | "vintage" | "warm" | "none" = "cyberpunk";
  let musicGenre = "Lo-Fi";
  let sticker = "VIRAL REELS";

  if (p.includes("kopi") || p.includes("coffee") || p.includes("kuliner") || p.includes("makan") || p.includes("food")) {
    theme = "culinary";
    template = "viral-tiktok";
    ratio = "9:16";
    filter = "warm";
    musicGenre = "Lo-Fi";
    sticker = "COFFEE TIME";
  } else if (p.includes("travel") || p.includes("wisata") || p.includes("alam") || p.includes("gunung") || p.includes("pantai")) {
    theme = "travel";
    template = "cinematic-docu";
    ratio = "16:9";
    filter = "warm";
    musicGenre = "Cinematic";
    sticker = "WANDERLUST";
  } else if (p.includes("promo") || p.includes("diskon") || p.includes("jual") || p.includes("olshop") || p.includes("produk") || p.includes("sepatu")) {
    theme = "promo";
    template = "product-promo";
    ratio = "1:1";
    filter = "none";
    musicGenre = "Upbeat";
    sticker = "DISKON 50%";
  } else if (p.includes("podcast") || p.includes("motivasi") || p.includes("quotes") || p.includes("mindset") || p.includes("tips")) {
    theme = "motivation";
    template = "podcast-waveform";
    ratio = "9:16";
    filter = "vintage";
    musicGenre = "Ambient";
    sticker = "TIPS SUKSES";
  } else if (p.includes("coding") || p.includes("programming") || p.includes("developer")) {
    theme = "tech";
    template = "viral-tiktok";
    ratio = "9:16";
    filter = "cyberpunk";
    musicGenre = "Synthwave";
    sticker = "CODING HACKS";
  }

  const numScenes = Math.max(3, Math.min(5, Math.round(targetDuration / 3.5)));
  const sceneDuration = Math.round(targetDuration / numScenes);

  const scenes = [];
  const promptsByTheme: Record<string, any[]> = {
    culinary: [
      { visual: "Penuangan kopi espresso artisan", cap: "KENIKMATAN KOPI TERBAIK", vo: "Secangkir kopi hangat selalu punya cerita dan ketenangan tersendiri.", title: "AROMA PAGI", trans: "fade" },
      { visual: "Sajian hidangan kuliner lezat", cap: "DIBUAT DARI BAHAN PILIHAN", vo: "Setiap tetes dan racikannya diracik dengan penuh ketulusan rasa.", title: "RASA OTENTIK", trans: "slide-left" },
      { visual: "Suasana kafe hangat", cap: "SAATNYA NGOPI SEKARANG", vo: "Yuk luangkan waktumu dan nikmati hari dengan secangkir kopi favoritmu!", title: "ENJOY TODAY", trans: "zoom-in" },
    ],
    travel: [
      { visual: "Pemandangan gunung berkabut megah", cap: "KEINDAHAN ALAM YANG MEMUKAU", vo: "Dunia ini terlalu indah untuk hanya dilewati di dalam ruangan.", title: "EKSPLORASI", trans: "fade" },
      { visual: "Deburan ombak pantai saat sunset", cap: "TEMUKAN KEDAMAIAN JIWA", vo: "Suara ombak dan hembusan angin membawa ketenangan yang tak ternilai.", title: "HORIZON INDAH", trans: "slide-left" },
      { visual: "Hutan tropis disinari cahaya matahari", cap: "JELAJAHI DESTINASI IMPIAN", vo: "Mari kemas tasmu dan mulai petualangan barumu hari ini!", title: "LETS TRAVEL", trans: "zoom-in" },
    ],
    promo: [
      { visual: "Produk fashion sepatu sneaker trendi", cap: "PROMO SPESIAL TERBATAS", vo: "Kabar gembira untukmu! Koleksi terbaru kini hadir dengan diskon spesial.", title: "SPECIAL DROP", trans: "zoom-in" },
      { visual: "Detail kualitas produk premium", cap: "KUALITAS TERBAIK TAHAN LAMA", vo: "Desain stylish dan bahan premium yang nyaman digunakan setiap hari.", title: "PREMIUM GRADE", trans: "slide-right" },
      { visual: "Ajakan order sekarang", cap: "KLAIM DISKONMU SEKARANG", vo: "Jangan sampai kehabisan! Klik link dan dapatkan penawaran terbaik hari ini.", title: "ORDER NOW", trans: "fade" },
    ],
    tech: [
      { visual: "Visual jaringan saraf AI futuristik", cap: "REVOLUSI KECERDASAN BUATAN", vo: "AI kini mengubah cara kita berpikir, bekerja, dan berkreasi.", title: "FUTURE AI", trans: "fade" },
      { visual: "Robot AI dan hologram canggih", cap: "KERJAKAN SEMUA OTOMATIS", vo: "Dari ide mentah, langsung diproses menjadi karya nyata dalam hitungan detik.", title: "OTOMATISASI", trans: "slide-left" },
      { visual: "Koneksi portal teknologi modern", cap: "MASA DEPAN ADA DI TANGANMU", vo: "Siapkan dirimu dan jadilah bagian dari generasi masa depan!", title: "START NOW", trans: "zoom-in" },
    ],
    motivation: [
      { visual: "Workspace laptop minimalis", cap: "FOKUS PADA PROSESMU", vo: "Sukses bukan tentang seberapa cepat kamu tiba, tapi konsistensi melangkah.", title: "MINDSET", trans: "fade" },
      { visual: "Aktivitas produktif dan semangat", cap: "JANGAN PERNAH MENYERAH", vo: "Setiap usaha kecil yang kamu lakukan hari ini akan berbuah manis esok hari.", title: "KONSISTENSI", trans: "slide-left" },
      { visual: "Cahaya kemenangan dan inspirasi", cap: "KAMU PASTI BISA MERAIHNYA", vo: "Percayalah pada potensimu dan buktikan pada dunia!", title: "VICTORY", trans: "zoom-in" },
    ],
  };

  const pool = promptsByTheme[theme] || promptsByTheme.tech;

  for (let i = 0; i < numScenes; i++) {
    const item = pool[i % pool.length];
    scenes.push({
      visualDescription: item.visual,
      keywords: item.title,
      caption: item.cap,
      voiceover: item.vo,
      durationSeconds: sceneDuration,
      transition: item.trans,
      filter: filter,
      titleOverlay: item.title,
    });
  }

  return {
    title: `${prompt.toUpperCase().slice(0, 35)}`,
    description: `Video otomatis tentang ${prompt} yang dibuat menggunakan AI Agent Studio.`,
    tags: ["#AgentStudio", `#${theme.toUpperCase()}`, "#AIVideo", "#Remotion", "#ViralReels"],
    theme,
    suggestedTemplate: template,
    suggestedRatio: ratio,
    musicGenre,
    stickerText: sticker,
    scenes,
  };
}

export function buildProjectFromAIScript(
  script: AIScriptResult,
  customAspectRatio?: "9:16" | "16:9" | "1:1"
): VideoProject {
  const fps = 30;
  const ratio = customAspectRatio || script.suggestedRatio || "9:16";
  const config = ASPECT_RATIOS[ratio];

  const matchedAssets = getAssetsForTheme(script.theme || "tech");

  let currentFrame = 0;
  const clips: MediaClip[] = [];
  const subtitleLines: SubtitleLine[] = [];
  let fullVoiceoverText = "";

  script.scenes.forEach((scene, index) => {
    const durationFrames = secondsToFrames(scene.durationSeconds, fps);
    
    // Generate bespoke unlimited AI visual matching the exact scene prompt!
    const scenePrompt = buildSceneVisualPrompt(script.title, index, scene.titleOverlay || scene.caption);
    const bespokeImageUrl = generateUnlimitedAIImageUrl(scenePrompt, config.width, config.height, index + 100);

    clips.push({
      id: generateId("clip"),
      type: "photo",
      name: `${scene.titleOverlay || "Scene"} #${index + 1}`,
      url: bespokeImageUrl,
      thumbnailUrl: bespokeImageUrl,
      durationInFrames: durationFrames,
      transition: scene.transition,
      transitionDuration: 15,
      animationEffect: index % 2 === 0 ? "ken-burns" : "zoom-in",
      filter: scene.filter,
      titleOverlay: scene.titleOverlay,
      subtitleOverlay: scene.caption,
      promptDescription: scenePrompt,
    });

    // Subtitle synchronization
    const words = scene.caption.split(" ");
    const wordDur = Math.floor((durationFrames - 10) / Math.max(1, words.length));

    const subtitleWords = words.map((w, wIdx) => ({
      text: w,
      startFrame: currentFrame + 5 + wIdx * wordDur,
      endFrame: currentFrame + 5 + (wIdx + 1) * wordDur - 2,
    }));

    subtitleLines.push({
      id: generateId("sub"),
      startFrame: currentFrame + 5,
      endFrame: currentFrame + durationFrames - 5,
      text: scene.caption,
      words: subtitleWords,
    });

    fullVoiceoverText += `${scene.voiceover} `;
    currentFrame += durationFrames;
  });

  const selectedBgm =
    CURATED_STOCK_AUDIO.find((a) => a.genre.toLowerCase().includes(script.musicGenre.toLowerCase())) ||
    CURATED_STOCK_AUDIO[0];

  return {
    id: generateId("proj_ai"),
    title: script.title,
    description: script.description,
    tags: script.tags,
    template: script.suggestedTemplate,
    aspectRatio: ratio,
    fps,
    width: config.width,
    height: config.height,
    clips,
    captions: {
      enabled: true,
      style: ratio === "9:16" ? "tiktok" : "box",
      fontSize: ratio === "9:16" ? 42 : 36,
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
        title: `${selectedBgm.title} (${selectedBgm.license})`,
        volume: 0.3,
        startFrame: 0,
        durationInFrames: currentFrame,
        fadeInFrames: 30,
        fadeOutFrames: 30,
      },
    ],
    voiceover: {
      enabled: true,
      language: "id-ID",
      text: fullVoiceoverText.trim(),
      voiceGender: "female",
      speed: 1.0,
    },
    actor: {
      enabled: script.suggestedTemplate !== "cinematic-docu",
      actorId: script.theme === "culinary" || script.theme === "travel" ? "actor_maya" : "actor_sarah",
      name: script.theme === "culinary" || script.theme === "travel" ? "Maya (Host)" : "Sarah (AI Host)",
      avatarUrl:
        script.theme === "culinary" || script.theme === "travel"
          ? PRESET_AI_ACTORS[3].avatarUrl
          : PRESET_AI_ACTORS[0].avatarUrl,
      position: "bottom-right",
      size: "medium",
      style: "circle",
      titleLabel: "AI Presenter",
    },
    visualizer: {
      enabled: script.suggestedTemplate === "podcast-waveform" || script.suggestedTemplate === "viral-tiktok",
      style: "bars",
      color: "#38bdf8",
      barCount: 26,
    },
    stickers: script.stickerText
      ? [
          {
            id: generateId("stk"),
            text: script.stickerText,
            type: script.suggestedTemplate === "product-promo" ? "sale" : "fire",
            position: "top-left",
            animation: "bounce",
            startFrame: 0,
            endFrame: currentFrame,
          },
        ]
      : [],
    watermark: {
      text: "@Armilsyam • AI Agent Studio",
      position: "top-right",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
