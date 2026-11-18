import { NextRequest, NextResponse } from "next/server";
import { generateAIScript, buildProjectFromAIScript } from "@/lib/aiEngine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, aspectRatio = "9:16", durationSeconds = 15 } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt wajib diisi" }, { status: 400 });
    }

    const script = await generateAIScript(prompt, Number(durationSeconds));
    const project = buildProjectFromAIScript(script, aspectRatio);

    return NextResponse.json({
      success: true,
      script,
      project,
    });
  } catch (error: any) {
    console.error("AI Script generation error:", error);
    return NextResponse.json(
      { error: error?.message || "Gagal membuat naskah video AI" },
      { status: 500 }
    );
  }
}
