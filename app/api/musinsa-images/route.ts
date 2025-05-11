import { NextRequest, NextResponse } from "next/server";
import { getMusinsaImages } from "@/lib/musinsa";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("keyword") || "반팔티";
  const images = await getMusinsaImages(keyword);
  return NextResponse.json({ images });
}