import { NextResponse } from "next/server";

export async function POST(req) {
  const { key } = await req.json();

  if (key !== process.env.ADMIN_KEY) {
    return NextResponse.json(
      { ok: false, message: "Invalid admin key" },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ ok: true });

  response.cookies.set("admin_auth", "true", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 24
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });

  response.cookies.set("admin_auth", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/"
  });

  return response;
}
