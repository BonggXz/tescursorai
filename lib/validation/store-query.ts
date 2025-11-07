import { z } from "zod";
import type { ProductQuery, ProductSort } from "@/lib/services/products";

const storeQuerySchema = z.object({
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
    .enum(["newest", "priceLowHigh", "priceHighLow"])
    .optional()
    .transform((value) => (value as ProductSort) ?? undefined),
  page: z
    .string()
    .optional()
    .transform((value) => {
      if (!value) return 1;
      const parsed = Number(value);
      return Number.isNaN(parsed) || parsed < 1 ? 1 : parsed;
    }),
});

export function parseStoreSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
): ProductQuery {
  const flattened: Record<string, string | undefined> = {};

  Object.entries(searchParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      flattened[key] = value[0];
    } else {
      flattened[key] = value;
    }
  });

  const parsed = storeQuerySchema.safeParse(flattened);

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
