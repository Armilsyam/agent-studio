export interface StockMediaItem {
  id: string;
  type: "photo" | "video";
  title: string;
  url: string;
  thumbnailUrl: string;
  author: string;
  category: "Technology" | "Cyberpunk" | "Nature" | "Business" | "Culinary" | "Fitness" | "Education" | "Fashion" | "Abstract";
}

export interface StockAudioItem {
  id: string;
  title: string;
  genre: string;
  duration: number;
  url: string;
  author: string;
  license: string;
}

export const CURATED_STOCK_MEDIA: StockMediaItem[] = [
  // Technology & AI
  {
    id: "tech_ai_brain",
    type: "photo",
    title: "AI Neural Network",
    category: "Technology",
    author: "DeepMind / Unsplash",
    url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1080&auto=format&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=300&auto=format&fit=crop&q=60",
  },
  {
    id: "tech_cyber_city",
    type: "photo",
    title: "Cyberpunk Metropolis",
    category: "Cyberpunk",
    author: "Aleksandar Pasaric",
    url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1080&auto=format&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=300&auto=format&fit=crop&q=60",
  },
  {
    id: "tech_robot_assistant",
    type: "photo",
    title: "Futuristic Hologram AI",
    category: "Technology",
    author: "Milad Fakurian",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&auto=format&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=60",
  },
  {
    id: "tech_coding_matrix",
    type: "photo",
    title: "Programmer Code Screen",
    category: "Education",
    author: "Chris Ried",
    url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1080&auto=format&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&auto=format&fit=crop&q=60",
  },

  // Nature & Travel
  {
    id: "nature_mountain_mist",
    type: "photo",
    title: "Epic Misty Mountain",
    category: "Nature",
    author: "Kalen Emsley",
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1080&auto=format&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&auto=format&fit=crop&q=60",
  },
  {
    id: "nature_sunset_beach",
    type: "photo",
    title: "Golden Hour Ocean Waves",
    category: "Nature",
    author: "Matt Hardy",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1080&auto=format&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&auto=format&fit=crop&q=60",
  },
  {
    id: "nature_lush_forest",
    type: "photo",
    title: "Tropical Rainforest Sunbeam",
    category: "Nature",
    author: "Luca Bravo",
    url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1080&auto=format&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=300&auto=format&fit=crop&q=60",
  },

  // Culinary & Coffee
  {
    id: "food_coffee_pour",
    type: "photo",
    title: "Artisan Espresso Pour",
    category: "Culinary",
    author: "Nathan Dumlao",
    url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1080&auto=format&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&auto=format&fit=crop&q=60",
  },
  {
    id: "food_gourmet_dish",
    type: "photo",
    title: "Gourmet Delicious Culinary",
    category: "Culinary",
    author: "Chad Montano",
    url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1080&auto=format&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop&q=60",
  },

  // Business & Productivity
  {
    id: "biz_creative_team",
    type: "photo",
    title: "Modern Startup Collaboration",
    category: "Business",
    author: "Austin Distel",
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1080&auto=format&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&auto=format&fit=crop&q=60",
  },
  {
    id: "biz_minimal_desk",
    type: "photo",
    title: "Sleek Workspace Setup",
    category: "Business",
    author: "Howard Bouchevereau",
    url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1080&auto=format&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&auto=format&fit=crop&q=60",
  },

  // Fitness & Health
  {
    id: "fit_workout_gym",
    type: "photo",
    title: "Energetic Fitness Training",
    category: "Fitness",
    author: "Sven Mieke",
    url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1080&auto=format&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=300&auto=format&fit=crop&q=60",
  },

  // Fashion & Products
  {
    id: "fashion_sneaker_drop",
    type: "photo",
    title: "Streetwear Sneakers Promo",
    category: "Fashion",
    author: "Paul Volkmer",
    url: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1080&auto=format&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=300&auto=format&fit=crop&q=60",
  },

  // Abstract & Neon
  {
    id: "abstract_neon_rings",
    type: "photo",
    title: "Neon Light Tunnel Glow",
    category: "Abstract",
    author: "Sandro Katalina",
    url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1080&auto=format&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&auto=format&fit=crop&q=60",
  },

  // High Quality Free Video Loops
  {
    id: "video_sunset_plateau",
    type: "video",
    title: "Cosmic Aerial Golden Hour",
    category: "Nature",
    author: "Mixkit Free Assets",
    url: "https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-sky-in-a-sunset-26070-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&auto=format&fit=crop&q=60",
  },
  {
    id: "video_city_traffic",
    type: "video",
    title: "Futuristic Highway Timelapse",
    category: "Technology",
    author: "Mixkit Free Assets",
    url: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-42618-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=300&auto=format&fit=crop&q=60",
  },
];

export const CURATED_STOCK_AUDIO: StockAudioItem[] = [
  {
    id: "audio_lofi_1",
    title: "Chillhop Lo-Fi Study Beats",
    genre: "Lo-Fi",
    duration: 120,
    url: "https://cdn.freesound.org/previews/665/665181_11861866-lq.mp3",
    author: "Freesound Community",
    license: "CC0 (No Copyright)",
  },
  {
    id: "audio_cinematic_1",
    title: "Cinematic Epic Inspiration",
    genre: "Cinematic",
    duration: 90,
    url: "https://cdn.freesound.org/previews/469/469273_10207038-lq.mp3",
    author: "Royalty Free Audio",
    license: "CC0 (No Copyright)",
  },
  {
    id: "audio_upbeat_1",
    title: "Upbeat Modern Vlog Energy",
    genre: "Upbeat",
    duration: 75,
    url: "https://cdn.freesound.org/previews/512/512471_11235122-lq.mp3",
    author: "Soundtrack Library",
    license: "CC0 (No Copyright)",
  },
  {
    id: "audio_ambient_1",
    title: "Deep Tech Ambient Drone",
    genre: "Ambient",
    duration: 150,
    url: "https://cdn.freesound.org/previews/556/556942_11488319-lq.mp3",
    author: "Audio Lab",
    license: "CC0 (No Copyright)",
  },
  {
    id: "audio_synthwave_1",
    title: "Retro 80s Synthwave Drive",
    genre: "Synthwave",
    duration: 110,
    url: "https://cdn.freesound.org/previews/608/608645_11861866-lq.mp3",
    author: "Retro Wave Studio",
    license: "CC0 (No Copyright)",
  },
  {
    id: "audio_trap_1",
    title: "Modern Bass Trap Beat",
    genre: "Hip-Hop / Trap",
    duration: 80,
    url: "https://cdn.freesound.org/previews/568/568434_12496836-lq.mp3",
    author: "Beat Crafter",
    license: "CC0 (No Copyright)",
  },
];

export function getAssetsForTheme(theme: string): StockMediaItem[] {
  const t = theme.toLowerCase();
  let matched = CURATED_STOCK_MEDIA.filter((item) => {
    if (t.includes("ai") || t.includes("tech") || t.includes("robot") || t.includes("coding")) {
      return item.category === "Technology" || item.category === "Cyberpunk" || item.category === "Education";
    }
    if (t.includes("kopi") || t.includes("coffee") || t.includes("makan") || t.includes("kuliner") || t.includes("food")) {
      return item.category === "Culinary";
    }
    if (t.includes("alam") || t.includes("travel") || t.includes("gunung") || t.includes("pantai") || t.includes("wisata")) {
      return item.category === "Nature";
    }
    if (t.includes("bisnis") || t.includes("kantor") || t.includes("kerja") || t.includes("uang") || t.includes("marketing")) {
      return item.category === "Business";
    }
    if (t.includes("olahraga") || t.includes("fitness") || t.includes("sehat") || t.includes("gym")) {
      return item.category === "Fitness";
    }
    if (t.includes("promo") || t.includes("diskon") || t.includes("fashion") || t.includes("sepatu") || t.includes("baju")) {
      return item.category === "Fashion" || item.category === "Business";
    }
    return true;
  });

  return matched.length > 0 ? matched : CURATED_STOCK_MEDIA;
}

export async function searchStockMedia(query: string, type: "all" | "photo" | "video" = "all"): Promise<StockMediaItem[]> {
  const normalizedQuery = query.toLowerCase().trim();

  const localResults = CURATED_STOCK_MEDIA.filter((item) => {
    const matchesType = type === "all" || item.type === type;
    const matchesQuery =
      !normalizedQuery ||
      item.title.toLowerCase().includes(normalizedQuery) ||
      item.category.toLowerCase().includes(normalizedQuery);
    return matchesType && matchesQuery;
  });

  return localResults.length > 0 ? localResults : CURATED_STOCK_MEDIA;
}
