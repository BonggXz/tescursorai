import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const productSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(200)
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().min(1, 'Description is required'),
  priceCents: z.number().int().min(0, 'Price must be positive'),
  robloxAssetId: z.string().optional(),
  images: z.array(z.string()).default([]),
  categories: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
})

export const assetSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(200)
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().min(1, 'Description is required'),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, 'Version must be in semver format (e.g., 1.0.0)'),
  categories: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  license: z.string().default('MIT'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
})

export const siteSettingsSchema = z.object({
  siteName: z.string().min(1, 'Site name is required'),
  logoUrl: z.string().optional(),
  heroTitle: z.string().min(1, 'Hero title is required'),
  heroSubtitle: z.string().min(1, 'Hero subtitle is required'),
  featuredProductIds: z.array(z.string()).default([]),
  featuredAssetIds: z.array(z.string()).default([]),
  socials: z.record(z.string()).default({}),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color'),
})

export const fileUploadSchema = z.object({
  name: z.string(),
  size: z.number().max(25 * 1024 * 1024, 'File must be less than 25MB'),
  type: z.string().refine(
    (type) => {
      const allowed = [
        'text/plain',
        'application/octet-stream',
        'image/jpeg',
        'image/png',
        'image/webp',
      ]
      return allowed.some((t) => type.includes(t))
    },
    { message: 'Invalid file type' }
  ),
})

export type LoginInput = z.infer<typeof loginSchema>
export type ProductInput = z.infer<typeof productSchema>
export type AssetInput = z.infer<typeof assetSchema>
export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>
