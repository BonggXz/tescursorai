const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;

type RateLimitState = {
  expiresAt: number;
  count: number;
};

const rateLimitStore = new Map<string, RateLimitState>();

export type RateLimitOptions = {
  uniqueToken: string;
  limit?: number;
  windowMs?: number;
};

export type RateLimitResult = {
  success: boolean;
  remaining: number;
  resetAt: number;
};

export function rateLimit({
  uniqueToken,
  limit = MAX_REQUESTS,
  windowMs = WINDOW_MS,
}: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitStore.get(uniqueToken);

  if (!entry || entry.expiresAt <= now) {
    rateLimitStore.set(uniqueToken, {
      count: 1,
      expiresAt: now + windowMs,
    });
    return {
      success: true,
      remaining: limit - 1,
      resetAt: now + windowMs,
    };
  }

  if (entry.count >= limit) {
    return {
      success: false,
      remaining: 0,
      resetAt: entry.expiresAt,
    };
  }

  entry.count += 1;
  rateLimitStore.set(uniqueToken, entry);

  return {
    success: true,
    remaining: limit - entry.count,
    resetAt: entry.expiresAt,
  };
}

export function getRequestFingerprint(request: Request): string {
  const ip =
    (request.headers.get("x-forwarded-for") ?? "").split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const ua = request.headers.get("user-agent") ?? "unknown";
  return `${ip}:${ua}`;
}
