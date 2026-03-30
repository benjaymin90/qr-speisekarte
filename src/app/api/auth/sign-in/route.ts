import { createSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin";

  if (!password || password !== adminPassword) {
    return NextResponse.json({ error: "Falsches Passwort" }, { status: 401 });
  }

  await createSession();
  return NextResponse.json({ ok: true });
}
