import { AuthError } from "@/lib/auth";

export class InvalidOriginError extends Error {
  constructor(origin: string | null) {
    super(`Invalid request origin: ${origin ?? "unknown"}`);
    this.name = "InvalidOriginError";
  }
}

function normalizeOrigins(origins: Array<string | undefined>) {
  return origins
    .filter((origin): origin is string => Boolean(origin))
    .map((origin) => {
      try {
        return new URL(origin).origin;
      } catch {
        return origin;
      }
    });
}

export function isAllowedOrigin(request: Request, extraOrigins: string[] = []) {
  const originHeader = request.headers.get("origin");
  if (!originHeader) {
    return true;
  }

  const requestUrl = new URL(request.url);
  const allowedOrigins = new Set(
    normalizeOrigins([
      requestUrl.origin,
      process.env.NEXTAUTH_URL,
      process.env.NEXT_PUBLIC_APP_URL,
      ...extraOrigins,
    ]),
  );

  return allowedOrigins.has(originHeader);
}

export function assertAllowedOrigin(request: Request, extraOrigins?: string[]) {
  if (!isAllowedOrigin(request, extraOrigins ?? [])) {
    throw new InvalidOriginError(request.headers.get("origin"));
  }
}

export function assertAdminRole(role: "USER" | "ADMIN") {
  if (role !== "ADMIN") {
    throw new AuthError("Admin access required.", "FORBIDDEN");
  }
}
