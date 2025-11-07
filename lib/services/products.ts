import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { parseStringArray } from "@/lib/serializers";
import type { Prisma, PublishStatus, Product } from "@prisma/client";

export type ProductSort = "newest" | "priceLowHigh" | "priceHighLow";

export interface ProductQuery {
  search?: string | null;
  category?: string | null;
  tag?: string | null;
  sort?: ProductSort | null;
  page?: number;
  pageSize?: number;
  status?: PublishStatus;
}

export interface ProductDto {
  id: string;
  slug: string;
  title: string;
  description: string;
  priceCents: number;
  images: string[];
  robloxAssetId?: string | null;
  categories: string[];
  tags: string[];
  status: PublishStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedProducts {
  data: ProductDto[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

const stringifyJsonIncludes = (value: string) => `\\"${value}\\"`;

const mapProduct = (product: Product): ProductDto => ({
  id: product.id,
  slug: product.slug,
  title: product.title,
  description: product.description,
  priceCents: product.priceCents,
  images: parseStringArray(product.images),
  robloxAssetId: product.robloxAssetId,
  categories: parseStringArray(product.categories),
  tags: parseStringArray(product.tags),
  status: product.status,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
});

const buildProductWhere = (params: ProductQuery): Prisma.ProductWhereInput => {
  const where: Prisma.ProductWhereInput = {
    status: params.status ?? "PUBLISHED",
  };

  if (params.search?.trim()) {
    const searchTerm = params.search.trim();
    where.OR = [
      { title: { contains: searchTerm } },
      { description: { contains: searchTerm } },
    ];
  }

  if (params.category?.trim()) {
    const token = stringifyJsonIncludes(params.category.trim());
    where.categories = { contains: token };
  }

  if (params.tag?.trim()) {
    const token = stringifyJsonIncludes(params.tag.trim());
    where.tags = { contains: token };
  }

  return where;
};

const buildProductOrderBy = (
  sort: ProductSort | null | undefined,
): Prisma.ProductOrderByWithRelationInput => {
  switch (sort) {
    case "priceLowHigh":
      return { priceCents: "asc" };
    case "priceHighLow":
      return { priceCents: "desc" };
    case "newest":
    default:
      return { createdAt: "desc" };
  }
};

export const getProducts = cache(
  async (params: ProductQuery = {}): Promise<PaginatedProducts> => {
    const page = Math.max(params.page ?? 1, 1);
    const pageSize = Math.min(Math.max(params.pageSize ?? 12, 1), 48);
    const where = buildProductWhere(params);
    const orderBy = buildProductOrderBy(params.sort);

    const [total, rows] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      data: rows.map(mapProduct),
      total,
      page,
      pageSize,
      pageCount: Math.max(Math.ceil(total / pageSize), 1),
    };
  },
);

export const getProductBySlug = cache(async (slug: string) => {
  const product = await prisma.product.findUnique({
    where: { slug },
  });

  return product ? mapProduct(product) : null;
});

export const getProductsByIds = cache(async (ids: string[]) => {
  if (!ids.length) return [];
  const products = await prisma.product.findMany({
    where: { id: { in: ids } },
  });

  const mapped = products.map(mapProduct);
  const byId = new Map(mapped.map((item) => [item.id, item]));

  return ids
    .map((id) => byId.get(id))
    .filter((product): product is ProductDto => Boolean(product));
});

export const getLatestProducts = cache(async (limit = 6) => {
  const products = await prisma.product.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return products.map(mapProduct);
});

export const getRelatedProducts = cache(
  async (productId: string, tags: string[], limit = 4) => {
    if (!tags.length) {
      return getLatestProducts(limit);
    }

    const tagTokens = tags.map((tag) => stringifyJsonIncludes(tag));

    const products = await prisma.product.findMany({
      where: {
        id: { not: productId },
        status: "PUBLISHED",
        OR: tagTokens.map((token) => ({
          tags: { contains: token },
        })),
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return products.map(mapProduct);
  },
);

export const getProductFilters = cache(async () => {
  const rows = await prisma.product.findMany({
    where: { status: "PUBLISHED" },
    select: { categories: true, tags: true },
  });

  const categories = new Set<string>();
  const tags = new Set<string>();

  rows.forEach((row) => {
    parseStringArray(row.categories).forEach((category) =>
      categories.add(category),
    );
    parseStringArray(row.tags).forEach((tag) => tags.add(tag));
  });

  return {
    categories: Array.from(categories).sort(),
    tags: Array.from(tags).sort(),
  };
});
