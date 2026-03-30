import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const key = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "qr-speisekarte-dev-secret-change-in-production"
);

export async function proxy(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  try {
    await jwtVerify(token, key);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
}

export const proxyConfig = {
  matcher: ["/admin(.*)"],
};
