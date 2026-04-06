import { NextResponse } from "next/server";
import { readBin, updateBin } from "@/lib/jsonbin";
import { isAdminAuthenticated } from "@/lib/auth";

export async function POST(req) {
  try {
    const body = await req.json();
    const messagesBinId = process.env.JSONBIN_MESSAGES_BIN_ID;

    if (!messagesBinId) {
      return NextResponse.json(
        { message: "JSONBIN_MESSAGES_BIN_ID is missing in .env.local" },
        { status: 400 }
      );
    }

    const message = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      read: false,
      archived: false,
      ...body
    };

    const existing = await readBin(messagesBinId);
    const list = Array.isArray(existing) ? existing : [];
    const next = [...list, message];

    await updateBin(messagesBinId, next);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET() {
  const authed = await isAdminAuthenticated();

  if (!authed) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const messagesBinId = process.env.JSONBIN_MESSAGES_BIN_ID;

    if (!messagesBinId) {
      return NextResponse.json([]);
    }

    const data = await readBin(messagesBinId);
    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch {
    return NextResponse.json([]);
  }
}

export async function PUT(req) {
  const authed = await isAdminAuthenticated();

  if (!authed) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, action } = await req.json();
    const messagesBinId = process.env.JSONBIN_MESSAGES_BIN_ID;

    if (!messagesBinId) {
      return NextResponse.json(
        { message: "JSONBIN_MESSAGES_BIN_ID is missing in .env.local" },
        { status: 400 }
      );
    }

    const data = await readBin(messagesBinId);
    const list = Array.isArray(data) ? data : [];

    const updated = list.map((msg) => {
      if (msg.id !== id) return msg;
      if (action === "archive") return { ...msg, archived: true };
      if (action === "unarchive") return { ...msg, archived: false };
      if (action === "read") return { ...msg, read: true };
      if (action === "unread") return { ...msg, read: false };
      return msg;
    });

    await updateBin(messagesBinId, updated);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  const authed = await isAdminAuthenticated();

  if (!authed) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await req.json();
    const messagesBinId = process.env.JSONBIN_MESSAGES_BIN_ID;

    if (!messagesBinId) {
      return NextResponse.json(
        { message: "JSONBIN_MESSAGES_BIN_ID is missing in .env.local" },
        { status: 400 }
      );
    }

    const data = await readBin(messagesBinId);
    const list = Array.isArray(data) ? data : [];
    const updated = list.filter((msg) => msg.id !== id);

    await updateBin(messagesBinId, updated);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
