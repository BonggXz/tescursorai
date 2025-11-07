import "server-only";

import { PublishStatus, type Prisma, type Asset, type FileRef } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { jsonToStringArray } from "@/lib/json";
import type { AssetsQueryInput } from "@/lib/validation/store";

export type AssetFile = {
  id: string;
  name: string;
  url: string;
  ext: string;
  size: number;
  sha256: string;
};

export type AssetSummary = {
  id: string;
  slug: string;
  title: string;
  description: string;
  categories: string[];
  tags: string[];
  status: PublishStatus;
  version: string;
  downloadCount: number;
  license: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AssetDetail = AssetSummary & {
  files: AssetFile[];
};

export type AssetFilters = {
  categories: string[];
  tags: string[];
};

const ASSETS_PER_PAGE = 12;

function toAssetSummary(record: Asset): AssetSummary {
  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    description: record.description,
    categories: jsonToStringArray(record.categories),
    tags: jsonToStringArray(record.tags),
    status: record.status,
    version: record.version,
    downloadCount: record.downloadCount,
    license: record.license,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

function toAssetDetail(record: Asset & { files: FileRef[] }): AssetDetail {
  return {
    ...toAssetSummary(record),
    files: record.files.map((file) => ({
      id: file.id,
      name: file.name,
      url: file.url,
      ext: file.ext,
      size: file.size,
      sha256: file.sha256,
    })),
  };
}

export async function getAssetBySlug(slug: string): Promise<AssetDetail | null> {
  const record = await prisma.asset.findFirst({
    where: { slug, status: PublishStatus.PUBLISHED },
    include: { files: true },
  });

  if (!record) return null;
  return toAssetDetail(record);
}

export async function getPagedAssets(input: AssetsQueryInput) {
  const page = input.page ?? 1;
  const perPage = ASSETS_PER_PAGE;
  const skip = (page - 1) * perPage;

  const where: Prisma.AssetWhereInput = {
    status: PublishStatus.PUBLISHED,
  };

  const orderBy: Prisma.AssetOrderByWithRelationInput[] = [];

  switch (input.sort) {
    case "popular":
      orderBy.push({ downloadCount: "desc" }, { createdAt: "desc" });
      break;
    case "newest":
    default:
      orderBy.push({ createdAt: "desc" });
      break;
  }

  const records = await prisma.asset.findMany({
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
    items: paginated.map(toAssetSummary),
    total,
    page,
    perPage,
    pageCount: Math.max(1, Math.ceil(total / perPage)),
  };
}

export async function getAssetFilters(): Promise<AssetFilters> {
  const assets = await prisma.asset.findMany({
    where: { status: PublishStatus.PUBLISHED },
    select: { categories: true, tags: true },
  });

  const categorySet = new Set<string>();
  const tagSet = new Set<string>();

  for (const asset of assets) {
    jsonToStringArray(asset.categories).forEach((category) =>
      categorySet.add(category),
    );
    jsonToStringArray(asset.tags).forEach((tag) => tagSet.add(tag));
  }

  return {
    categories: Array.from(categorySet).sort(),
    tags: Array.from(tagSet).sort(),
  };
}

export async function getFeaturedAssets(ids: string[]) {
  if (!ids.length) return [];

  const records = await prisma.asset.findMany({
    where: { id: { in: ids }, status: PublishStatus.PUBLISHED },
  });

  const recordMap = new Map(records.map((item) => [item.id, toAssetSummary(item)]));

  return ids
    .map((id) => recordMap.get(id))
    .filter((item): item is AssetSummary => Boolean(item));
}

export async function getRelatedAssets(
  asset: AssetDetail,
  limit = 4,
): Promise<AssetSummary[]> {
  const candidates = await prisma.asset.findMany({
    where: {
      status: PublishStatus.PUBLISHED,
      id: { not: asset.id },
    },
    orderBy: { createdAt: "desc" },
  });

  const targetTags = new Set(asset.tags.map((tag) => tag.toLowerCase()));

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

  return result.map(toAssetSummary);
}

export async function getLatestAssets(limit = 6): Promise<AssetSummary[]> {
  const records = await prisma.asset.findMany({
    where: { status: PublishStatus.PUBLISHED },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return records.map(toAssetSummary);
}
