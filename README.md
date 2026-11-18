# 🎬 AI Agent Studio Foto & Video

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Remotion](https://img.shields.io/badge/Video_Engine-Remotion_4.x-indigo.svg)](https://www.remotion.dev)
[![Next.js](https://img.shields.io/badge/Framework-Next.js_14-black.svg)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Styling-TailwindCSS-38bdf8.svg)](https://tailwindcss.com)

**AI Agent Studio** adalah platform pembuatan, pengeditan, dan pemotongan video otomatis dari foto & video berbasis kecerdasan buatan dan **Remotion**. Dilengkapi dengan dashboard visual modern, pemotong klip interaktif (trimmer & splitter), generator naskah & storyboard otomatis, subtitle animasi gaya TikTok (Alex Hormozi highlight), audio synthesizer (TTS), serta otomasi unggah ke YouTube, TikTok, dan Facebook.

Platform ini didesain agar dapat diakses **100% GRATIS** baik secara lokal maupun di GitHub, tanpa kewajiban biaya API eksternal!

---

## 🌟 Fitur Unggulan

### 1. 🤖 AI Agent Storyboard & Script Generator
- **Natural Language Command**: Cukup ketik perintah seperti *"Buat video edukasi kesehatan 15 detik rasio 9:16 untuk TikTok"* atau *"Ganti rasio ke 16:9 untuk YouTube"*.
- **Penyusunan Adegan Otomatis**: Menghasilkan naskah, visual query, teks narasi suara, transisi, filter warna, dan subtitle.
- **Dukungan Model Ganda**: Berjalan secara offline dengan mesin heuristik cerdas bawaan, atau dapat dihubungkan ke Google Gemini API secara opsional.

### 2. 🎞️ Remotion Video Engine
- **Pratinjau Real-Time**: Scrubbing frame demi frame, timecode akurat, play/pause, dan loop dengan `@remotion/player`.
- **Rasio Aspek Fleksibel**:
  - `9:16`: TikTok, Instagram Reels, YouTube Shorts (1080 × 1920)
  - `16:9`: YouTube Video, Facebook Watch, TV Landscape (1920 × 1080)
  - `1:1`: Instagram Feed / Square (1080 × 1080)
- **Efek Gerak Dinamis (Ken Burns)**: Menghidupkan foto statis menjadi video bergerak dengan pan, zoom in, zoom out, dan rotasi sinematik.
- **Filter Warna**: Cyberpunk Neon, Vintage Retro, Warm Cinematic, Cool Tone, dan Black & White.

### 3. ✂️ Pemotong & Pemisah Klip (Clip Trimmer & Splitter)
- **Interactive Trimming**: Potong durasi awal dan akhir klip sesuai keinginan.
- **Split Clip**: Pisahkan satu klip menjadi dua klip terpisah langsung di timeline.
- **Kecepatan Variabel**: Atur speed klip dari slow-motion (0.5x) hingga fast-motion (1.5x, 2x).

### 4. 💬 Subtitle Animasi TikTok / Alex Hormozi
- **Word-by-Word Highlight**: Setiap kata yang diucapkan mendapat highlight warna kuning/neon secara presisi saat video berjalan.
- **Preset Gaya**: TikTok Viral, Neon Glow, Dark Box Minimalis, dan Karaoke Reveal.
- **Kustomisasi Lengkap**: Ubah ukuran font, warna teks, posisi layar (bawah/tengah/atas), dan edit teks secara instan.

### 5. 🎵 Audio & AI Voiceover (Text-to-Speech)
- **Koleksi Musik Bebas Royalti**: Lo-Fi Beats, Epic Cinematic, Upbeat Vlog, dan Ambient Drone.
- **Voiceover TTS Bawaan**: Sintesis narasi suara Bahasa Indonesia & Inggris gratis via Web Speech API tanpa kuota berbayar.

### 6. 🚀 Ekspor Video Fleksibel (100% Gratis)
- **Instan di Browser**: Render langsung ke format `.webm` atau `.mp4` menggunakan HTML5 Canvas & MediaRecorder tanpa memerlukan server FFmpeg!
- **Remotion CLI**: Render lokal dengan akselerasi perangkat keras via `npm run remotion:render`.
- **GitHub Actions Cloud**: Workflow render cloud otomatis gratis memanfaatkan kuota runner GitHub dengan FFmpeg.

### 7. 📲 Otomasi Unggah Media Sosial
- **YouTube Shorts & Videos**: Integrasi YouTube Data API v3 untuk posting otomatis dan penjadwalan konten.
- **TikTok**: Dukungan webhook TikTok Content Posting API.
- **Facebook / Instagram**: Integrasi Meta Graph API untuk posting video Reels & Halaman.

---

## 📂 Struktur Repositori

```text
├── .gemini/
│   └── skills/
│       └── agent-studio/
│           └── SKILL.md              # Ekstensi Skill Antigravity Agent Studio
├── .github/
│   └── workflows/
│       ├── ci.yml                    # Validasi build otomatis
│       └── remotion-render.yml       # Cloud video render gratis di GitHub Actions
├── bin/
│   └── agent-studio-cli.js           # CLI untuk otomasi baris perintah
├── public/                           # Aset audio & media statis
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── ai/script/            # Endpoint pembuatan naskah AI
│   │   │   ├── media/search/         # Endpoint pencarian stok media
│   │   │   ├── publish/              # Endpoint otomasi YouTube, TikTok, Facebook
│   │   │   └── render/               # Endpoint persiapan render server
│   │   ├── globals.css               # Styling tema gelap & animasi
│   │   ├── layout.tsx                # Layout utama
│   │   └── page.tsx                  # Halaman dashboard studio
│   ├── components/
│   │   ├── AIAssistantPanel.tsx      # Panel asisten AI interaktif
│   │   ├── AudioBgmSelector.tsx      # Pemilih musik & voiceover
│   │   ├── ClipCutterModal.tsx       # Modal pemotong & pemisah klip
│   │   ├── ExportModal.tsx           # Modal render & unduh
│   │   ├── Header.tsx                # Navigasi & pengaturan rasio
│   │   ├── MediaLibraryPanel.tsx     # Library media & uploader
│   │   ├── RemotionPlayerWrapper.tsx # Pemutar video Remotion
│   │   ├── SocialPublisherModal.tsx  # Modal publikasi sosial
│   │   ├── SubtitleStyler.tsx        # Pengatur gaya subtitle
│   │   ├── StudioDashboard.tsx       # Layout kerja studio
│   │   └── TimelineEditor.tsx        # Timeline multi-track
│   ├── lib/
│   │   ├── aiEngine.ts               # Logika AI & pembuat storyboard
│   │   ├── canvasVideoExporter.ts    # Mesin ekspor video gratis di browser
│   │   ├── socialAutomation.ts       # Logika publikasi sosial media
│   │   ├── stockMediaService.ts      # Penyedia stok media bebas royalti
│   │   ├── utils.ts                  # Helper waktu & perhitungan frame
│   │   └── videoProjectStore.ts      # Template & state proyek
│   └── remotion/
│       ├── AudioTrack.tsx            # Komponen trek audio Remotion
│       ├── index.ts                  # Entry point registrasi Remotion
│       ├── MainComposition.tsx      # Komposisi utama video
│       ├── Root.tsx                  # Deklarasi composition Remotion
│       ├── SceneRenderer.tsx         # Renderer adegan & efek Ken Burns
│       ├── SubtitleRenderer.tsx      # Renderer subtitle kata per kata
│       └── types.ts                  # Tipe data & schema proyek
├── .env.example                      # Contoh konfigurasi environment
├── Dockerfile                        # Konfigurasi container Docker
├── docker-compose.yml                # Docker Compose untuk deployment lokal
├── next.config.mjs                   # Konfigurasi Next.js & Webpack
├── package.json                      # Dependensi proyek
├── tailwind.config.js                # Konfigurasi warna tema studio
└── tsconfig.json                     # Konfigurasi TypeScript
```

---

## ⚡ Panduan Instalasi & Menjalankan Lokal

### Prasyarat
- [Node.js](https://nodejs.org/) v18 atau v20+
- [Git](https://git-scm.com/)

### Langkah Menjalankan

1. **Clone Repositori**:
   ```bash
   git clone https://github.com/Armilsyam/agent-studio.git
   cd agent-studio
   ```

2. **Install Dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan Development Server**:
   ```bash
   npm run dev
   ```

4. **Buka di Browser**:
   Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## 🛠️ Perintah CLI

Agent Studio menyediakan CLI yang dapat dipanggil langsung dari terminal maupun oleh Agent Antigravity:

```bash
# Membuat proyek video otomatis dari ide prompt
node bin/agent-studio-cli.js create --prompt "Evolusi AI di Dunia Medis" --ratio 9:16

# Memotong video dari detik ke-5 hingga detik ke-20
node bin/agent-studio-cli.js trim --file video.mp4 --start 5 --end 20

# Menjadwalkan unggahan ke YouTube
node bin/agent-studio-cli.js publish --platform youtube --title "Tips Sehat 2026"

# Melihat status sistem
node bin/agent-studio-cli.js status
```

---

## 🎥 Perintah Remotion

```bash
# Membuka Remotion Studio di browser untuk inspeksi detail
npm run remotion:preview

# Merender video utuh ke format MP4 di out/video.mp4
npm run remotion:render
```

---

## ☁️ Cloud Rendering Gratis di GitHub Actions

1. Buka tab **Actions** di repositori GitHub Anda: `Armilsyam/agent-studio`.
2. Pilih workflow **Render Remotion Video in Cloud**.
3. Klik tombol **Run workflow**.
4. Tunggu beberapa saat hingga proses render selesai.
5. Unduh file video MP4 hasil render dari bagian **Artifacts** secara gratis!

---

## 🐳 Menjalankan dengan Docker

```bash
# Build dan jalankan container
docker compose up -d

# Akses aplikasi di http://localhost:3000
```

---

## 🔑 Pengaturan Kunci API (Opsional)

Aplikasi sudah dapat berjalan **100% GRATIS** tanpa kunci API eksternal. Namun jika ingin menghubungkan integrasi resmi:

Salin file `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```

Lalu isi sesuai kebutuhan:
- `GEMINI_API_KEY`: Untuk pembuatan naskah AI tingkat lanjut dari Google.
- `YOUTUBE_ACCESS_TOKEN`: Untuk unggah otomatis ke akun YouTube Anda.
- `TIKTOK_ACCESS_TOKEN`: Untuk unggah otomatis ke akun TikTok Anda.
- `FACEBOOK_ACCESS_TOKEN`: Untuk unggah otomatis ke Meta Facebook Page / Reels.

---

## 📄 Lisensi

Proyek ini berlisensi [MIT License](LICENSE). Bebas digunakan, dimodifikasi, dan didistribusikan untuk keperluan pribadi maupun komersial.
