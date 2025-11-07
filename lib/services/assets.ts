import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { parseStringArray } from "@/lib/serializers";
import type { Prisma, PublishStatus } from "@prisma/client";

export type AssetSort = "newest" | "popular" | "name";

export interface AssetQuery {
  search?: string | null;
  category?: string | null;
  tag?: string | null;
  sort?: AssetSort | null;
  page?: number;
  pageSize?: number;
  status?: PublishStatus;
}

export interface FileRefDto {
  id: string;
  url: string;
  name: string;
  ext: string;
  size: number;
  sha256: string;
}

export interface AssetDto {
  id: string;
  slug: string;
  title: string;
  description: string;
  version: string;
  categories: string[];
  tags: string[];
  license: string;
  status: PublishStatus;
  downloadCount: number;
  files: FileRefDto[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedAssets {
  data: AssetDto[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

const stringifyJsonIncludes = (value: string) => `\\"${value}\\"`;

const mapAsset = (
  asset: Prisma.AssetGetPayload<{ include: { files: true } }>,
): AssetDto => ({
  id: asset.id,
  slug: asset.slug,
  title: asset.title,
  description: asset.description,
  version: asset.version,
  categories: parseStringArray(asset.categories),
  tags: parseStringArray(asset.tags),
  license: asset.license,
  status: asset.status,
  downloadCount: asset.downloadCount,
  files: asset.files.map((file) => ({
    id: file.id,
    url: file.url,
    name: file.name,
    ext: file.ext,
    size: file.size,
    sha256: file.sha256,
  })),
  createdAt: asset.createdAt,
  updatedAt: asset.updatedAt,
});

const buildAssetWhere = (params: AssetQuery): Prisma.AssetWhereInput => {
  const where: Prisma.AssetWhereInput = {
    status: params.status ?? "PUBLISHED",
  };

  if (params.search?.trim()) {
    const query = params.search.trim();
    where.OR = [
      { title: { contains: query } },
      { description: { contains: query } },
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

const buildAssetOrderBy = (
  sort: AssetSort | null | undefined,
): Prisma.AssetOrderByWithRelationInput => {
  switch (sort) {
    case "popular":
      return { downloadCount: "desc" };
    case "name":
      return { title: "asc" };
    case "newest":
    default:
      return { createdAt: "desc" };
  }
};

export const getAssets = cache(
  async (params: AssetQuery = {}): Promise<PaginatedAssets> => {
    const page = Math.max(params.page ?? 1, 1);
    const pageSize = Math.min(Math.max(params.pageSize ?? 12, 1), 48);
    const where = buildAssetWhere(params);
    const orderBy = buildAssetOrderBy(params.sort);

    const [total, rows] = await Promise.all([
      prisma.asset.count({ where }),
      prisma.asset.findMany({
        where,
        orderBy,
        include: { files: true },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      data: rows.map(mapAsset),
      total,
      page,
      pageSize,
      pageCount: Math.max(Math.ceil(total / pageSize), 1),
    };
  },
);

export const getAssetBySlug = cache(async (slug: string) => {
  const asset = await prisma.asset.findUnique({
    where: { slug },
    include: { files: true },
  });

  return asset ? mapAsset(asset) : null;
});

export const getAssetsByIds = cache(async (ids: string[]) => {
  if (!ids.length) {
    return [];
  }

  const assets = await prisma.asset.findMany({
    where: { id: { in: ids } },
    include: { files: true },
  });

  const mapped = assets.map(mapAsset);
  const byId = new Map(mapped.map((asset) => [asset.id, asset]));

  return ids
    .map((id) => byId.get(id))
    .filter((asset): asset is AssetDto => Boolean(asset));
});

export const getLatestAssets = cache(async (limit = 10) => {
  const assets = await prisma.asset.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    include: { files: true },
    take: limit,
  });

  return assets.map(mapAsset);
});

export const getAssetCategories = cache(async () => {
  const assets = await prisma.asset.findMany({
    where: { status: "PUBLISHED" },
    select: { categories: true, tags: true },
  });

  const categories = new Set<string>();
  const tags = new Set<string>();

  assets.forEach((asset) => {
    parseStringArray(asset.categories).forEach((category) =>
      categories.add(category),
    );
    parseStringArray(asset.tags).forEach((tag) => tags.add(tag));
  });

  return {
    categories: Array.from(categories).sort(),
    tags: Array.from(tags).sort(),
  };
});

export const getSiteDownloadStats = cache(async () => {
  const [totalDownloads, downloadsLast7Days] = await Promise.all([
    prisma.download.count(),
    prisma.download.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    }),
  ]);

  return {
    totalDownloads,
    downloadsLast7Days,
  };
});
