import { NextResponse } from "next/server";
import { getSeoContent } from "@/lib/content";

export async function GET() {
  const seo = await getSeoContent();
  return NextResponse.json(seo);
}
