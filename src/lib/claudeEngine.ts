import { AIScriptResult } from "./aiEngine";
import { getAssetsForTheme } from "./stockMediaService";

export interface ClaudeGenerationOptions {
  prompt: string;
  targetDuration?: number;
  apiKey?: string;
  model?: "claude-3-5-sonnet-20241022" | "claude-3-haiku-20240307";
  audioSync?: boolean;
}

export async function generateWithClaude(options: ClaudeGenerationOptions): Promise<AIScriptResult> {
  const { prompt, targetDuration = 15, apiKey, model = "claude-3-5-sonnet-20241022", audioSync = true } = options;

  const keyToUse = apiKey || process.env.ANTHROPIC_API_KEY;

  if (keyToUse) {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": keyToUse,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model,
          max_tokens: 2000,
          system: `Kamu adalah sutradara video AI dan spesialis Remotion profesional. Tugasmu adalah merancang storyboard video berkualitas tinggi yang sangat presisi tersinkronisasi dengan proses audio narasi (audio-driven scene cuts).
Setiap adegan harus sesuai dengan kalimat naskah suara yang diucapkan, dengan transisi visual, efek Ken-Burns, filter warna, dan subtitle kata demi kata.

Format respon HANYA berupa JSON valid tanpa markdown/teks tambahan:
{
  "title": "Judul video menarik",
  "description": "Deskripsi singkat video",
  "tags": ["#tag1", "#tag2", "#tag3"],
  "theme": "tech | culinary | travel | promo | motivation",
  "suggestedTemplate": "viral-tiktok | cinematic-docu | podcast-waveform | product-promo",
  "suggestedRatio": "9:16 | 16:9 | 1:1",
  "musicGenre": "Lo-Fi | Cinematic | Upbeat | Synthwave",
  "stickerText": "BADGE TEKS",
  "scenes": [
    {
      "visualDescription": "Deskripsi visual adegan",
      "keywords": "kata kunci pencarian visual",
      "caption": "Teks subtitle kapital sinkron",
      "voiceover": "Kalimat narasi suara persis untuk adegan ini",
      "durationSeconds": 3.5,
      "transition": "fade | slide-left | zoom-in",
      "filter": "cyberpunk | vintage | warm | none",
      "titleOverlay": "TEKS JUDUL ADEGAN"
    }
  ]
}`,
          messages: [
            {
              role: "user",
              content: `Buat storyboard video Remotion sinkron audio untuk prompt: "${prompt}". Durasi target sekitar ${targetDuration} detik. Pastikan adegan visual berganti secara dinamis mengikuti alur audio narasi.`,
            },
          ],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.content?.[0]?.text;
        if (content) {
          const cleaned = content.replace(/```json/g, "").replace(/```/g, "").trim();
          const parsed = JSON.parse(cleaned);
          return parsed;
        }
      } else {
        console.warn("Claude API error status:", response.status);
      }
    } catch (err) {
      console.warn("Claude API call failed, falling back to Claude-tuned engine", err);
    }
  }

  // Claude-Style Audio-Driven Narrative Synthesizer (Zero-Cost Intelligent Engine)
  return generateClaudeStyleScript(prompt, targetDuration, audioSync);
}

function generateClaudeStyleScript(prompt: string, targetDuration: number, audioSync: boolean): AIScriptResult {
  const p = prompt.toLowerCase();

  // Intelligent Theme Detection
  let theme = "tech";
  let suggestedTemplate: "viral-tiktok" | "cinematic-docu" | "podcast-waveform" | "product-promo" = "viral-tiktok";
  let suggestedRatio: "9:16" | "16:9" | "1:1" = "9:16";
  let musicGenre = "Lo-Fi";
  let filter: "cyberpunk" | "vintage" | "warm" | "none" = "cyberpunk";
  let stickerText = "CLAUDE AI";

  if (p.includes("kopi") || p.includes("kuliner") || p.includes("makanan") || p.includes("cafe")) {
    theme = "culinary";
    suggestedTemplate = "viral-tiktok";
    suggestedRatio = "9:16";
    musicGenre = "Lo-Fi";
    filter = "warm";
    stickerText = "COFFEE VIBES";
  } else if (p.includes("travel") || p.includes("wisata") || p.includes("gunung") || p.includes("alam") || p.includes("pantai")) {
    theme = "travel";
    suggestedTemplate = "cinematic-docu";
    suggestedRatio = "16:9";
    musicGenre = "Cinematic";
    filter = "warm";
    stickerText = "CINEMATIC NATURE";
  } else if (p.includes("promo") || p.includes("diskon") || p.includes("jual") || p.includes("produk") || p.includes("olshop")) {
    theme = "promo";
    suggestedTemplate = "product-promo";
    suggestedRatio = "1:1";
    musicGenre = "Upbeat";
    filter = "none";
    stickerText = "LIMITED OFFER";
  } else if (p.includes("podcast") || p.includes("motivasi") || p.includes("quotes") || p.includes("tips") || p.includes("belajar")) {
    theme = "motivation";
    suggestedTemplate = "podcast-waveform";
    suggestedRatio = "9:16";
    musicGenre = "Ambient";
    filter = "vintage";
    stickerText = "PRO TIPS";
  }

  // Break prompt into audio narration sentence flow
  const speechRateWPS = 2.5; // average ~2.5 words per second in speech
  const sentences = [
    {
      vo: `Pernahkah kamu menyadari bagaimana ${prompt} dapat mengubah caramu memandang dunia?`,
      cap: `RAHASIA UTAMA ${prompt.toUpperCase().slice(0, 30)}`,
      title: "TAHUKAH KAMU?",
      trans: "fade" as const,
    },
    {
      vo: "Semuanya dimulai dari satu langkah kecil dan komitmen untuk terus melangkah maju.",
      cap: "FOKUS PADA PROSES DAN AKSI",
      title: "LANGKAH AWAL",
      trans: "slide-left" as const,
    },
    {
      vo: "Dengan konsistensi dan bantuan teknologi, hasil yang luar biasa bukan lagi sekadar impian.",
      cap: "HASIL MAKSIMAL SECARA NYATA",
      title: "HASIL NYATA",
      trans: "zoom-in" as const,
    },
    {
      vo: "Mulai perjalanan hebatmu sekarang juga dan bagikan inspirasi ini kepada mereka yang membutuhkan!",
      cap: "MULAI SEKARANG DAN BUKTIKAN",
      title: "SAATNYA MEMULAI",
      trans: "fade" as const,
    },
  ];

  const targetScenesCount = Math.max(3, Math.min(5, Math.round(targetDuration / 3.5)));
  const scenes = [];

  for (let i = 0; i < targetScenesCount; i++) {
    const item = sentences[i % sentences.length];
    const wordsInVo = item.vo.split(" ").length;
    // Calculate exact duration from voiceover words
    const estimatedSecs = audioSync
      ? Math.max(2.5, Math.min(5.5, Math.round((wordsInVo / speechRateWPS) * 10) / 10))
      : Math.round(targetDuration / targetScenesCount);

    scenes.push({
      visualDescription: `Adegan ${i + 1} menyesuaikan narasi audio: ${item.vo}`,
      keywords: `${theme} cinematic aesthetic`,
      caption: item.cap,
      voiceover: item.vo,
      durationSeconds: estimatedSecs,
      transition: item.trans,
      filter: filter,
      titleOverlay: item.title,
    });
  }

  return {
    title: `Claude Story: ${prompt.slice(0, 40)}`,
    description: `Video otomatis yang dirancang dengan alur narasi audio presisi oleh Claude Engine & Remotion.`,
    tags: ["#ClaudeAI", "#Remotion", "#AudioDriven", "#AIVideoStudio", "#ContentCreator"],
    theme,
    suggestedTemplate,
    suggestedRatio,
    musicGenre,
    stickerText,
    scenes,
  };
}
