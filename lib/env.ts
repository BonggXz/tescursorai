import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  NEXTAUTH_SECRET: z.string().min(1),
  NEXTAUTH_URL: z.string().url().optional(),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  FEATURE_FLAG_MOCK_CHECKOUT: z.coerce.boolean().optional(),
  RATE_LIMIT_LOGIN: z.coerce.number().optional(),
  RATE_LIMIT_DOWNLOAD: z.coerce.number().optional(),
});

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NODE_ENV: process.env.NODE_ENV ?? "development",
  FEATURE_FLAG_MOCK_CHECKOUT: process.env.FEATURE_FLAG_MOCK_CHECKOUT,
  RATE_LIMIT_LOGIN: process.env.RATE_LIMIT_LOGIN,
  RATE_LIMIT_DOWNLOAD: process.env.RATE_LIMIT_DOWNLOAD,
});

export type AppEnv = typeof env;
