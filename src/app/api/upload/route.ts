import { put } from "@vercel/blob";
import { verifySessionFromRequest } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const isAuth = await verifySessionFromRequest(request);
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { error: "Nur JPEG, PNG, WebP oder AVIF erlaubt." },
      { status: 400 },
    );
  }

  // Max 4MB
  if (file.size > 4 * 1024 * 1024) {
    return NextResponse.json(
      { error: "Maximale Dateigröße: 4 MB" },
      { status: 400 },
    );
  }

  const blob = await put(`dishes/${Date.now()}-${file.name}`, file, {
    access: "public",
  });

  return NextResponse.json({ url: blob.url });
}
