import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, language = "id" } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Teks wajib diisi" }, { status: 400 });
    }

    const langCode = language.startsWith("en") ? "en" : "id";
    const encodedText = encodeURIComponent(text.slice(0, 200));
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${langCode}&q=${encodedText}`;

    const ttsResponse = await fetch(ttsUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    });

    if (!ttsResponse.ok) {
      throw new Error(`TTS server responded with ${ttsResponse.status}`);
    }

    const audioBuffer = await ttsResponse.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString("base64");
    const dataUrl = `data:audio/mpeg;base64,${base64Audio}`;

    return NextResponse.json({
      success: true,
      audioUrl: dataUrl,
      language: langCode,
      message: "Suara voiceover berhasil digenerate!",
    });
  } catch (error: any) {
    console.error("Voiceover generation error:", error);
    return NextResponse.json(
      { error: error?.message || "Gagal membuat audio voiceover" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const text = searchParams.get("text") || "Halo dari AI Agent Studio";
    const language = searchParams.get("lang") || "id";

    const langCode = language.startsWith("en") ? "en" : "id";
    const encodedText = encodeURIComponent(text.slice(0, 200));
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${langCode}&q=${encodedText}`;

    const ttsResponse = await fetch(ttsUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    });

    if (!ttsResponse.ok) {
      return new Response("Failed to fetch audio", { status: 500 });
    }

    const audioBuffer = await ttsResponse.arrayBuffer();
    return new Response(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (e: any) {
    return new Response(e?.message || "Server error", { status: 500 });
  }
}
