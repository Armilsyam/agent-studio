import { NextRequest, NextResponse } from "next/server";
import { generateWithClaude } from "@/lib/claudeEngine";
import { buildProjectFromAIScript } from "@/lib/aiEngine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      prompt,
      targetDuration = 15,
      model = "claude-3-5-sonnet-20241022",
      apiKey,
      audioSync = true,
      aspectRatio,
    } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt wajib diisi" }, { status: 400 });
    }

    const script = await generateWithClaude({
      prompt,
      targetDuration: Number(targetDuration),
      model,
      apiKey,
      audioSync,
    });

    const project = buildProjectFromAIScript(script, aspectRatio);

    return NextResponse.json({
      success: true,
      engine: "Claude AI",
      model,
      script,
      project,
    });
  } catch (error: any) {
    console.error("Claude Video generation error:", error);
    return NextResponse.json(
      { error: error?.message || "Gagal memproses video dengan Claude" },
      { status: 500 }
    );
  }
}
