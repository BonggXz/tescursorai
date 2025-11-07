import { type Prisma, PublishStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { parseStringArray } from "@/lib/serialization";

const DEFAULT_PAGE_SIZE = 12;

export type ProductSort = "newest" | "price-asc" | "price-desc" | "popular";

export interface ProductFilters {
  search?: string;
  category?: string;
  tag?: string;
  sort?: ProductSort;
  page?: number;
  perPage?: number;
}

const orderByMap: Record<ProductSort, Prisma.ProductOrderByWithRelationInput> = {
  newest: { createdAt: "desc" },
  "price-asc": { priceCents: "asc" },
  "price-desc": { priceCents: "desc" },
  popular: { updatedAt: "desc" },
};

function buildProductWhere(filters: ProductFilters): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {
    status: PublishStatus.PUBLISHED,
  };

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search } },
      { description: { contains: filters.search } },
      { tags: { contains: filters.search } },
    ];
  }

  if (filters.category) {
    where.categories = {
      contains: `"${filters.category}"`,
    };
  }

  if (filters.tag) {
    where.tags = {
      contains: `"${filters.tag}"`,
    };
  }

  return where;
}

function mapProduct(product: Prisma.ProductGetPayload<{ select: typeof productSelect }>) {
  return {
    ...product,
    images: parseStringArray(product.images),
    categories: parseStringArray(product.categories),
    tags: parseStringArray(product.tags),
  };
}

const productSelect = {
  id: true,
  slug: true,
  title: true,
  description: true,
  priceCents: true,
  images: true,
  robloxAssetId: true,
  categories: true,
  tags: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ProductSelect;

export async function getProducts(filters: ProductFilters = {}) {
  const perPage = filters.perPage ?? DEFAULT_PAGE_SIZE;
  const page = filters.page && filters.page > 0 ? filters.page : 1;
  const skip = (page - 1) * perPage;

  const where = buildProductWhere(filters);
  const orderBy = orderByMap[filters.sort ?? "newest"];

  const [items, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: perPage,
      select: productSelect,
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return {
    items: items.map(mapProduct),
    total,
    page,
    perPage,
    totalPages,
  };
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug, status: PublishStatus.PUBLISHED },
    select: productSelect,
  });

  if (!product) {
    return null;
  }

  return mapProduct(product);
}

export async function getLatestProducts(limit = 6) {
  const products = await prisma.product.findMany({
    where: { status: PublishStatus.PUBLISHED },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: productSelect,
  });

  return products.map(mapProduct);
}

export async function getProductFilterOptions() {
  const rows = await prisma.product.findMany({
    where: { status: PublishStatus.PUBLISHED },
    select: {
      categories: true,
      tags: true,
    },
  });

  const categorySet = new Set<string>();
  const tagSet = new Set<string>();

  for (const row of rows) {
    parseStringArray(row.categories).forEach((category) => categorySet.add(category));
    parseStringArray(row.tags).forEach((tag) => tagSet.add(tag));
  }

  return {
    categories: Array.from(categorySet).sort(),
    tags: Array.from(tagSet).sort(),
  };
}
