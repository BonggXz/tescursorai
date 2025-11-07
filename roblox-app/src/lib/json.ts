import type { Prisma } from "@prisma/client";

export function jsonToStringArray(
  value: Prisma.JsonValue | null | undefined,
): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

export function jsonToRecord(
  value: Prisma.JsonValue | null | undefined,
): Record<string, string | null> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }
  return Object.fromEntries(
    Object.entries(value).map(([key, val]) => [
      key,
      typeof val === "string" ? val : null,
    ]),
  );
}
