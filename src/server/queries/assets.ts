import { type Prisma, PublishStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { parseStringArray } from "@/lib/serialization";

const DEFAULT_PAGE_SIZE = 12;

export type AssetSort = "newest" | "popular";

export interface AssetFilters {
  search?: string;
  category?: string;
  tag?: string;
  sort?: AssetSort;
  page?: number;
  perPage?: number;
}

const orderByMap: Record<AssetSort, Prisma.AssetOrderByWithRelationInput> = {
  newest: { createdAt: "desc" },
  popular: { downloadCount: "desc" },
};

function buildAssetWhere(filters: AssetFilters): Prisma.AssetWhereInput {
  const where: Prisma.AssetWhereInput = {
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

const assetSelect = {
  id: true,
  slug: true,
  title: true,
  description: true,
  version: true,
  license: true,
  categories: true,
  tags: true,
  status: true,
  downloadCount: true,
  createdAt: true,
  updatedAt: true,
  files: {
    select: {
      id: true,
      url: true,
      name: true,
      ext: true,
      size: true,
      sha256: true,
    },
  },
} satisfies Prisma.AssetSelect;

function mapAsset(asset: Prisma.AssetGetPayload<{ select: typeof assetSelect }>) {
  return {
    ...asset,
    categories: parseStringArray(asset.categories),
    tags: parseStringArray(asset.tags),
  };
}

export async function getAssets(filters: AssetFilters = {}) {
  const perPage = filters.perPage ?? DEFAULT_PAGE_SIZE;
  const page = filters.page && filters.page > 0 ? filters.page : 1;
  const skip = (page - 1) * perPage;

  const where = buildAssetWhere(filters);
  const orderBy = orderByMap[filters.sort ?? "newest"];

  const [items, total] = await prisma.$transaction([
    prisma.asset.findMany({
      where,
      orderBy,
      skip,
      take: perPage,
      select: assetSelect,
    }),
    prisma.asset.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return {
    items: items.map(mapAsset),
    total,
    page,
    perPage,
    totalPages,
  };
}

export async function getAssetBySlug(slug: string) {
  const asset = await prisma.asset.findUnique({
    where: { slug, status: PublishStatus.PUBLISHED },
    select: assetSelect,
  });

  if (!asset) {
    return null;
  }

  return mapAsset(asset);
}

export async function getLatestAssets(limit = 6) {
  const assets = await prisma.asset.findMany({
    where: { status: PublishStatus.PUBLISHED },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: assetSelect,
  });

  return assets.map(mapAsset);
}

export async function incrementAssetDownload(
  assetId: string,
  meta: { ip?: string | null; ua?: string | null; userId?: string | null },
) {
  await prisma.$transaction([
    prisma.asset.update({
      where: { id: assetId },
      data: { downloadCount: { increment: 1 } },
    }),
    prisma.download.create({
      data: {
        assetId,
        ip: meta.ip,
        ua: meta.ua,
        userId: meta.userId ?? undefined,
      },
    }),
  ]);
}

export async function getAssetFilterOptions() {
  const rows = await prisma.asset.findMany({
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
