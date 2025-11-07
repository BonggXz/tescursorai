import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Security headers
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    const session = await auth();

    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (session.user?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
