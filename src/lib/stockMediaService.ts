export interface StockMediaItem {
  id: string;
  type: "photo" | "video";
  title: string;
  url: string;
  thumbnailUrl: string;
  author: string;
  category: string;
}

export interface StockAudioItem {
  id: string;
  title: string;
  genre: string;
  duration: number; // in seconds
  url: string;
  author: string;
}

export const CURATED_STOCK_MEDIA: StockMediaItem[] = [
  {
    id: "stock_tech_1",
    type: "photo",
    title: "AI Neural Network",
    category: "Technology",
    author: "DeepMind / Unsplash",
    url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1080&auto=format&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=300&auto=format&fit=crop&q=60",
  },
  {
    id: "stock_tech_2",
    type: "photo",
    title: "Cyberpunk City Lights",
    category: "Cyberpunk",
    author: "Aleksandar Pasaric",
    url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1080&auto=format&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=300&auto=format&fit=crop&q=60",
  },
  {
    id: "stock_tech_3",
    type: "photo",
    title: "Futuristic Hologram",
    category: "Technology",
    author: "Milad Fakurian",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&auto=format&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=60",
  },
  {
    id: "stock_nature_1",
    type: "photo",
    title: "Cinematic Misty Mountain",
    category: "Nature",
    author: "Kalen Emsley",
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1080&auto=format&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&auto=format&fit=crop&q=60",
  },
  {
    id: "stock_nature_2",
    type: "photo",
    title: "Sunset Ocean Waves",
    category: "Nature",
    author: "Matt Hardy",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1080&auto=format&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&auto=format&fit=crop&q=60",
  },
  {
    id: "stock_biz_1",
    type: "photo",
    title: "Modern Creative Studio",
    category: "Business",
    author: "Austin Distel",
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1080&auto=format&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&auto=format&fit=crop&q=60",
  },
  {
    id: "stock_biz_2",
    type: "photo",
    title: "Minimalist Workspace Laptop",
    category: "Business",
    author: "Howard Bouchevereau",
    url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1080&auto=format&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&auto=format&fit=crop&q=60",
  },
  {
    id: "stock_video_1",
    type: "video",
    title: "Cosmic Particles Loop",
    category: "Abstract",
    author: "Mixkit Free Assets",
    url: "https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-sky-in-a-sunset-26070-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&auto=format&fit=crop&q=60",
  },
  {
    id: "stock_video_2",
    type: "video",
    title: "Urban Traffic Time-lapse",
    category: "City",
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
  },
  {
    id: "audio_cinematic_1",
    title: "Cinematic Epic Inspiration",
    genre: "Cinematic",
    duration: 90,
    url: "https://cdn.freesound.org/previews/469/469273_10207038-lq.mp3",
    author: "Royalty Free Audio",
  },
  {
    id: "audio_upbeat_1",
    title: "Upbeat Modern Vlog Energy",
    genre: "Upbeat",
    duration: 75,
    url: "https://cdn.freesound.org/previews/512/512471_11235122-lq.mp3",
    author: "Soundtrack Library",
  },
  {
    id: "audio_ambient_1",
    title: "Deep Tech Ambient Drone",
    genre: "Ambient",
    duration: 150,
    url: "https://cdn.freesound.org/previews/556/556942_11488319-lq.mp3",
    author: "Audio Lab",
  },
];

export async function searchStockMedia(query: string, type: "all" | "photo" | "video" = "all"): Promise<StockMediaItem[]> {
  const normalizedQuery = query.toLowerCase().trim();

  // Filter curated collection first
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
