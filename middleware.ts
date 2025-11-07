import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";

export async function middleware(request: NextRequest) {
  const session = await auth();
  const path = request.nextUrl.pathname;

  // Security headers
  const response = NextResponse.next();
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "origin-when-cross-origin");

  // Protect admin routes
  if (path.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if ((session.user as any)?.role !== Role.ADMIN) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
