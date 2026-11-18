import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { project } = body;

    if (!project) {
      return NextResponse.json({ error: "Project data required" }, { status: 400 });
    }

    // Save project spec to a temporary render json file
    const renderDir = path.join(process.cwd(), "public", "renders");
    if (!fs.existsSync(renderDir)) {
      fs.mkdirSync(renderDir, { recursive: true });
    }

    const renderId = `render_${Date.now()}`;
    const projectFilePath = path.join(renderDir, `${renderId}.json`);
    fs.writeFileSync(projectFilePath, JSON.stringify(project, null, 2), "utf-8");

    return NextResponse.json({
      success: true,
      renderId,
      status: "ready",
      message: "Proyek disiapkan untuk rendering Remotion. Anda juga dapat menggunakan export instan client-side WebM/MP4 di browser atau GitHub Actions render workflow untuk cloud rendering.",
      config: {
        compositionId: "MainVideo",
        fps: project.fps,
        width: project.width,
        height: project.height,
        durationInFrames: project.clips?.reduce((a: number, c: any) => a + c.durationInFrames, 0) || 150,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Render failed to initialize" },
      { status: 500 }
    );
  }
}
