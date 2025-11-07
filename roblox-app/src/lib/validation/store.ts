import { z } from "zod";

export const storeQuerySchema = z.object({
  q: z.string().trim().min(1).max(120).optional(),
  category: z.string().trim().min(1).max(80).optional(),
  tag: z.string().trim().min(1).max(80).optional(),
  sort: z
    .enum(["newest", "price-asc", "price-desc", "popular"])
    .default("newest")
    .optional(),
  page: z
    .string()
    .regex(/^\d+$/)
    .transform((value) => Math.max(1, parseInt(value, 10)))
    .optional(),
});

export type StoreQueryInput = z.infer<typeof storeQuerySchema>;

export const assetsQuerySchema = z.object({
  q: z.string().trim().min(1).max(120).optional(),
  category: z.string().trim().min(1).max(80).optional(),
  tag: z.string().trim().min(1).max(80).optional(),
  sort: z.enum(["newest", "popular"]).default("newest").optional(),
  page: z
    .string()
    .regex(/^\d+$/)
    .transform((value) => Math.max(1, parseInt(value, 10)))
    .optional(),
});

export type AssetsQueryInput = z.infer<typeof assetsQuerySchema>;
