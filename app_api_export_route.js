import { NextResponse } from "next/server";
import { getSiteContent } from "@/lib/content";

export async function GET() {
  const data = await getSiteContent();

  return new NextResponse(JSON.stringify(data, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": "attachment; filename=portfolio-content.json"
    }
  });
}
