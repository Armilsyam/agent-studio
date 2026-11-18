---
name: agent-studio
description: AI Agent Studio Foto & Video - Programmatic video creation, trimming, Remotion rendering, and social media auto-publishing. Use whenever creating or editing videos, cutting clips, rendering Remotion projects, or automating social media uploads to YouTube, TikTok, and Facebook.
---

# Agent Studio: AI Video & Photo Studio

Agent Studio adalah platform lengkap pembuatan dan pengeditan video otomatis berbasis **Remotion**, AI Storyboard, Pemotong Klip Video, dan Otomasi Unggah ke Media Sosial.

## Fitur Utama

1. **Dashboard Visual Interaktif**:
   - Web studio di `http://localhost:3000` dengan Remotion Player terintegrasi.
   - Pilihan Rasio Aspek: 9:16 (TikTok, Reels, Shorts), 16:9 (YouTube), 1:1 (Instagram Feed).
2. **AI Agent Storyboard & Script Generator**:
   - Menerima prompt instruksi natural language (Bahasa Indonesia & English).
   - Menghasilkan judul, adegan visual, teks subtitle dengan sinkronisasi kata, dan audio latar.
3. **Pemotong & Pemisah Klip (Clip Trimmer & Splitter)**:
   - Potong klip in-point & out-point presisi.
   - Pisahkan klip menjadi dua bagian (Split clip).
   - Atur kecepatan (0.5x, 1x, 1.5x, 2x) dan filter warna (Cyberpunk, Vintage, Warm, Cool, B&W).
4. **Ekspor & Render**:
   - Ekspor instan di browser via Canvas/WebM tanpa ketergantungan binary sistem.
   - Remotion CLI render: `npm run remotion:render`.
   - GitHub Actions cloud render workflow gratis dengan FFmpeg.
5. **Otomasi Media Sosial**:
   - Integrasi langsung untuk unggah otomatis ke YouTube Data API, TikTok Content API, dan Facebook Graph API.

## Penggunaan CLI

```bash
# Membuat video baru dari prompt
node bin/agent-studio-cli.js create --prompt "Evolusi Robotika AI" --ratio 9:16

# Memotong klip video
node bin/agent-studio-cli.js trim --file input.mp4 --start 5 --end 15

# Menjadwalkan unggahan otomatis ke media sosial
node bin/agent-studio-cli.js publish --platform youtube --title "Video Keren AI"

# Menjalankan Remotion Render
npm run remotion:render
```
