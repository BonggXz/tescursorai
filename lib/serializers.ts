export function parseStringArray(value?: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed.filter((item) => typeof item === "string") as string[]) : [];
  } catch (error) {
    console.warn("Failed to parse string array:", error);
    return [];
  }
}

export function stringifyStringArray(values: string[]): string {
  return JSON.stringify(values);
}

export function parseJsonObject<T = Record<string, unknown>>(
  value?: string | null,
  fallback: T = {} as T,
): T {
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value);
    return typeof parsed === "object" && parsed !== null ? (parsed as T) : fallback;
  } catch (error) {
    console.warn("Failed to parse JSON object:", error);
    return fallback;
  }
}

export function stringifyJsonObject(value: unknown): string {
  return JSON.stringify(value ?? {});
}
