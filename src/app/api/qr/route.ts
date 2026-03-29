import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  const label = request.nextUrl.searchParams.get("label");

  if (!slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
  const menuUrl = `${baseUrl}/m/${slug}`;

  const svg = await QRCode.toString(menuUrl, {
    type: "svg",
    margin: 2,
    width: 256,
    color: { dark: "#18181b", light: "#ffffff" },
  });

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Content-Disposition": `inline; filename="qr-${label || slug}.svg"`,
    },
  });
}
