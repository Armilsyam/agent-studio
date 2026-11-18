import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Agent Studio - Pembuat & Pengedit Video Otomatis",
  description: "Platform Studio Foto & Video Otomatis didukung Remotion, AI Storyboard, Pemotong Klip, dan Otomasi Unggah ke YouTube, TikTok & Facebook.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className="bg-[#0b0f17] text-slate-100 antialiased overflow-hidden">
        {children}
      </body>
    </html>
  );
}
