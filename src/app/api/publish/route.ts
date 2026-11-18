import { NextRequest, NextResponse } from "next/server";
import { publishToYouTube, publishToTikTok, publishToFacebook, SocialPlatform } from "@/lib/socialAutomation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { platform, title, description, tags, videoUrl } = body;

    let result;
    switch (platform as SocialPlatform) {
      case "youtube":
        result = await publishToYouTube({ title, description, tags });
        break;
      case "tiktok":
        result = await publishToTikTok({ title, tags, videoUrl });
        break;
      case "facebook":
      case "instagram":
        result = await publishToFacebook({ title, description, tags });
        break;
      default:
        return NextResponse.json(
          { error: `Platform ${platform} tidak didukung` },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Gagal memproses unggahan media sosial" },
      { status: 500 }
    );
  }
}
