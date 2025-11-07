import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const productSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().min(1, 'Slug is required').max(200),
  description: z.string().min(1, 'Description is required'),
  priceCents: z.number().int().min(0, 'Price must be positive'),
  robloxAssetId: z.string().optional(),
  categories: z.array(z.string()),
  tags: z.array(z.string()),
  images: z.array(z.string()),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
})

export const assetSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().min(1, 'Slug is required').max(200),
  description: z.string().min(1, 'Description is required'),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, 'Version must be semver (e.g., 1.0.0)'),
  categories: z.array(z.string()),
  tags: z.array(z.string()),
  license: z.string().min(1),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
})

export const siteSettingsSchema = z.object({
  siteName: z.string().min(1),
  logoUrl: z.string().optional(),
  heroTitle: z.string().min(1),
  heroSubtitle: z.string().min(1),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  socials: z.object({
    discord: z.string().url().optional().or(z.literal('')),
    whatsapp: z.string().url().optional().or(z.literal('')),
    youtube: z.string().url().optional().or(z.literal('')),
    x: z.string().url().optional().or(z.literal('')),
  }),
})

export const fileUploadSchema = z.object({
  file: z.instanceof(File),
  allowedExtensions: z.array(z.string()).default(['.lua', '.rbxm', '.rbxmx', '.png', '.jpg', '.jpeg', '.webp']),
  maxSize: z.number().default(25 * 1024 * 1024), // 25MB
})
