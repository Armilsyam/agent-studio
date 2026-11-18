import { NextRequest, NextResponse } from "next/server";
import { searchStockMedia } from "@/lib/stockMediaService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const type = (searchParams.get("type") as "all" | "photo" | "video") || "all";

    const results = await searchStockMedia(query, type);

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Gagal mencari stok media" },
      { status: 500 }
    );
  }
}
