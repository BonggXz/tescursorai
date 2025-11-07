import "server-only";

import { PublishStatus, type Prisma, type Product } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { jsonToStringArray } from "@/lib/json";
import type { StoreQueryInput } from "@/lib/validation/store";

export type ProductSummary = {
  id: string;
  slug: string;
  title: string;
  description: string;
  priceCents: number;
  images: string[];
  categories: string[];
  tags: string[];
  createdAt: Date;
};

export type ProductDetail = ProductSummary & {
  robloxAssetId?: string | null;
  status: PublishStatus;
  updatedAt: Date;
};

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  pageCount: number;
};

export type ProductFilters = {
  categories: string[];
  tags: string[];
};

const PRODUCTS_PER_PAGE = 12;

function toProductSummary(record: Product): ProductSummary {
  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    description: record.description,
    priceCents: record.priceCents,
    images: jsonToStringArray(record.images),
    categories: jsonToStringArray(record.categories),
    tags: jsonToStringArray(record.tags),
    createdAt: record.createdAt,
  };
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductDetail | null> {
  const record = await prisma.product.findFirst({
    where: { slug, status: PublishStatus.PUBLISHED },
  });

  if (!record) return null;

  return {
    ...toProductSummary(record),
    robloxAssetId: record.robloxAssetId,
    status: record.status,
    updatedAt: record.updatedAt,
  };
}

export async function getPagedProducts(
  input: StoreQueryInput,
): Promise<PaginatedResult<ProductSummary>> {
  const page = input.page ?? 1;
  const perPage = PRODUCTS_PER_PAGE;
  const skip = (page - 1) * perPage;

  const where: Prisma.ProductWhereInput = {
    status: PublishStatus.PUBLISHED,
  };

  const orderBy: Prisma.ProductOrderByWithRelationInput[] = [];

  switch (input.sort) {
    case "price-asc":
      orderBy.push({ priceCents: "asc" });
      break;
    case "price-desc":
      orderBy.push({ priceCents: "desc" });
      break;
    case "popular":
      orderBy.push({ createdAt: "desc" });
      break;
    case "newest":
    default:
      orderBy.push({ createdAt: "desc" });
      break;
  }

  const records = await prisma.product.findMany({
    where,
    orderBy,
  });

  const searchTerm = input.q?.toLowerCase();

  const filtered = records.filter((record) => {
    const categories = jsonToStringArray(record.categories);
    const tags = jsonToStringArray(record.tags);

    if (input.category && !categories.includes(input.category)) {
      return false;
    }

    if (input.tag && !tags.includes(input.tag)) {
      return false;
    }

    if (searchTerm) {
      const matches =
        record.title.toLowerCase().includes(searchTerm) ||
        record.description.toLowerCase().includes(searchTerm) ||
        tags.some((tag) => tag.toLowerCase().includes(searchTerm)) ||
        categories.some((category) =>
          category.toLowerCase().includes(searchTerm),
        );
      if (!matches) {
        return false;
      }
    }

    return true;
  });

  const total = filtered.length;
  const paginated = filtered.slice(skip, skip + perPage);

  return {
    items: paginated.map(toProductSummary),
    total,
    page,
    perPage,
    pageCount: Math.max(1, Math.ceil(total / perPage)),
  };
}

export async function getProductFilters(): Promise<ProductFilters> {
  const products = await prisma.product.findMany({
    where: { status: PublishStatus.PUBLISHED },
    select: {
      categories: true,
      tags: true,
    },
  });

  const categorySet = new Set<string>();
  const tagSet = new Set<string>();

  for (const product of products) {
    jsonToStringArray(product.categories).forEach((category) =>
      categorySet.add(category),
    );
    jsonToStringArray(product.tags).forEach((tag) => tagSet.add(tag));
  }

  return {
    categories: Array.from(categorySet).sort(),
    tags: Array.from(tagSet).sort(),
  };
}

export async function getFeaturedProducts(ids: string[]): Promise<ProductSummary[]> {
  if (!ids.length) return [];

  const records = await prisma.product.findMany({
    where: {
      id: { in: ids },
      status: PublishStatus.PUBLISHED,
    },
  });

  const recordMap = new Map(records.map((item) => [item.id, toProductSummary(item)]));

  return ids
    .map((id) => recordMap.get(id))
    .filter((item): item is ProductSummary => Boolean(item));
}

export async function getRelatedProducts(
  product: ProductDetail,
  limit = 4,
): Promise<ProductSummary[]> {
  const candidates = await prisma.product.findMany({
    where: {
      status: PublishStatus.PUBLISHED,
      id: { not: product.id },
    },
    orderBy: { createdAt: "desc" },
  });

  const targetTags = new Set(product.tags.map((tag) => tag.toLowerCase()));

  const related = candidates.filter((candidate) => {
    const candidateTags = jsonToStringArray(candidate.tags).map((tag) =>
      tag.toLowerCase(),
    );
    return candidateTags.some((tag) => targetTags.has(tag));
  });

  const result =
    related.length >= limit
      ? related.slice(0, limit)
      : [...related, ...candidates.filter((item) => !related.includes(item))].slice(
          0,
          limit,
        );

  return result.map(toProductSummary);
}

export async function getLatestProducts(limit = 6): Promise<ProductSummary[]> {
  const records = await prisma.product.findMany({
    where: { status: PublishStatus.PUBLISHED },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return records.map(toProductSummary);
}
