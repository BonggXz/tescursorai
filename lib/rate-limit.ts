import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 20; // 20 requests per minute

export function getRateLimitKey(req: NextRequest): string {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ||
             req.headers.get("x-real-ip") ||
             "unknown";
  return `rate-limit:${ip}`;
}

export function checkRateLimit(req: NextRequest): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
} {
  const key = getRateLimitKey(req);
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetAt) {
    const resetAt = now + RATE_LIMIT_WINDOW;
    rateLimitMap.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1, resetAt };
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count++;
  rateLimitMap.set(key, record);
  return {
    allowed: true,
    remaining: RATE_LIMIT_MAX - record.count,
    resetAt: record.resetAt,
  };
}

export function rateLimitResponse(resetAt: number): NextResponse {
  const resetIn = Math.ceil((resetAt - Date.now()) / 1000);
  return NextResponse.json(
    { error: "Too many requests" },
    {
      status: 429,
      headers: {
        "Retry-After": resetIn.toString(),
        "X-RateLimit-Reset": resetAt.toString(),
      },
    }
  );
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetAt) {
      rateLimitMap.delete(key);
    }
  }
}, RATE_LIMIT_WINDOW * 2);
