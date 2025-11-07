import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

const ADMIN_ROUTE_REGEX = /^\/admin(?:\/|$)/;
const ADMIN_API_REGEX = /^\/api\/admin(?:\/|$)/;

function buildSecurityHeaders(request: NextRequest, response: NextResponse) {
  const headers = response.headers;

  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("X-XSS-Protection", "0");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");

  const cspDirectives = [
    "default-src 'self'",
    "img-src 'self' data: https:",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' data:",
    "connect-src 'self' https:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");

  headers.set("Content-Security-Policy", cspDirectives);

  if (request.nextUrl.protocol === "https:" || process.env.NODE_ENV === "production") {
    headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  }
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname + request.nextUrl.search);
  return NextResponse.redirect(loginUrl);
}

function unauthorizedApiResponse() {
  return NextResponse.json(
    { error: "Not authorized." },
    {
      status: 401,
    },
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = ADMIN_ROUTE_REGEX.test(pathname) || ADMIN_API_REGEX.test(pathname);

  if (isAdminRoute) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      if (pathname.startsWith("/api/")) {
        return unauthorizedApiResponse();
      }
      return redirectToLogin(request);
    }

    if (token.role !== "ADMIN") {
      if (pathname.startsWith("/api/")) {
        return unauthorizedApiResponse();
      }
      return redirectToLogin(request);
    }
  }

  const response = NextResponse.next();
  buildSecurityHeaders(request, response);

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};
