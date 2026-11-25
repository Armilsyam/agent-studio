import { AIActorConfig } from "@/remotion/types";

export interface AIActorPreset {
  id: string;
  name: string;
  avatarUrl: string;
  role: string;
  gender: "female" | "male";
  voiceLang: "id" | "en";
}

export const PRESET_AI_ACTORS: AIActorPreset[] = [
  {
    id: "actor_sarah",
    name: "Sarah (Tech & News Host)",
    role: "AI Virtual Presenter",
    gender: "female",
    voiceLang: "id",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "actor_alex",
    name: "Alex (Business & Edu)",
    role: "Executive Presenter",
    gender: "male",
    voiceLang: "id",
    avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "actor_nova",
    name: "Nova (Cyber Android)",
    role: "Futuristic Avatar",
    gender: "female",
    voiceLang: "en",
    avatarUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "actor_maya",
    name: "Maya (Lifestyle & Travel)",
    role: "Creative Storyteller",
    gender: "female",
    voiceLang: "id",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "actor_david",
    name: "David (Documentary Narrator)",
    role: "Senior Narrator",
    gender: "male",
    voiceLang: "en",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
  },
];

/**
 * Generate Unlimited AI Images from Any Prompt On-The-Fly
 * Uses Pollinations.ai (FLUX / Stable Diffusion model) - 100% Free, No Auth, Unlimited!
 */
export function generateUnlimitedAIImageUrl(
  prompt: string,
  width: number = 1080,
  height: number = 1920,
  seed?: number
): string {
  const cleanPrompt = prompt.replace(/[^\w\s,.-]/gi, " ").trim();
  const enhancedPrompt = `${cleanPrompt}, masterpiece, highly detailed, photorealistic 8k, cinematic lighting, professional photography`;
  const encoded = encodeURIComponent(enhancedPrompt.slice(0, 300));
  const finalSeed = seed || Math.floor(Math.random() * 999999);

  return `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&seed=${finalSeed}&nologo=true&enhance=true&model=flux`;
}

/**
 * Creates visual scene prompt strictly tailored to the user's idea
 */
export function buildSceneVisualPrompt(
  themePrompt: string,
  sceneIndex: number,
  titleOverlay: string
): string {
  const base = themePrompt.trim();
  const enhancers = [
    "wide angle establishing cinematic shot, breathtaking view, vibrant atmosphere",
    "close up focal details, dramatic shadows, crisp lens focus",
    "dynamic perspective, active movement, beautiful natural color grading",
    "inspirational climax, atmospheric glow, iconic composition",
  ];

  const modifier = enhancers[sceneIndex % enhancers.length];
  return `${base}, ${titleOverlay}, ${modifier}`;
}
