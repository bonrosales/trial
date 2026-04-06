import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { updateBin } from "@/lib/jsonbin";

export async function POST(req) {
  const authed = await isAdminAuthenticated();

  if (!authed) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const binId = process.env.JSONBIN_BIN_ID;

    if (!binId) {
      return NextResponse.json(
        { message: "JSONBIN_BIN_ID is missing in .env.local" },
        { status: 400 }
      );
    }

    const updated = await updateBin(binId, body);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
