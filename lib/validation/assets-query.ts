import { z } from "zod";
import type { AssetQuery, AssetSort } from "@/lib/services/assets";

const assetQuerySchema = z.object({
  q: z.string().trim().optional().transform((value) => value || undefined),
  category: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || undefined),
  tag: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || undefined),
  sort: z
    .enum(["newest", "popular", "name"])
    .optional()
    .transform((value) => (value as AssetSort) ?? "newest"),
  page: z
    .string()
    .optional()
    .transform((value) => {
      if (!value) return 1;
      const parsed = Number(value);
      return Number.isNaN(parsed) || parsed < 1 ? 1 : parsed;
    }),
});

export function parseAssetSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
): AssetQuery {
  const flattened: Record<string, string | undefined> = {};
  Object.entries(searchParams).forEach(([key, value]) => {
    flattened[key] = Array.isArray(value) ? value[0] : value;
  });

  const parsed = assetQuerySchema.safeParse(flattened);

  if (!parsed.success) {
    return { page: 1 };
  }

  return {
    search: parsed.data.q,
    category: parsed.data.category,
    tag: parsed.data.tag,
    sort: parsed.data.sort,
    page: parsed.data.page,
  };
}
