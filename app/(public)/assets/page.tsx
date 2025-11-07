import type { Metadata } from "next";
import { AssetFilters } from "@/components/assets/asset-filters";
import { AssetCard } from "@/components/assets/asset-card";
import { PaginationControls } from "@/components/common/pagination-controls";
import {
  getAssets,
  getAssetCategories,
  type AssetDto,
} from "@/lib/services/assets";
import { parseAssetSearchParams } from "@/lib/validation/assets-query";

export const metadata: Metadata = {
  title: "Assets & Scripts",
  description:
    "Download free Roblox Studio assets, Lua scripts, and community-powered kits.",
};

export default async function AssetsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const query = parseAssetSearchParams(searchParams);
  query.pageSize = 12;
  const [{ data, total, page, pageCount }, filters] = await Promise.all([
    getAssets(query),
    getAssetCategories(),
  ]);

  return (
    <div className="bg-slate-50 py-12 md:py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 md:px-6">
          <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Asset library
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">
            Community-crafted assets & scripts
          </h1>
          <p className="text-sm text-muted-foreground">
            Explore open-source kits, reusable UI, combat systems, utility
            scripts, and more—validated by our admin team.
          </p>
        </div>

        <AssetFilters
          categories={filters.categories}
          tags={filters.tags}
          sort={query.sort ?? "newest"}
          search={query.search ?? ""}
          category={query.category ?? ""}
          tag={query.tag ?? ""}
        />

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing {(page - 1) * 12 + 1} –{" "}
            {Math.min(page * 12, total)} of {total} assets
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.map((asset: AssetDto) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
          {!data.length && (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-300/70 bg-white p-10 text-center text-sm text-muted-foreground">
              No assets found. Try adjusting your search or filters.
            </div>
          )}
        </div>

        <div className="flex items-center justify-center">
          <PaginationControls page={page} pageCount={pageCount} />
        </div>
      </div>
    </div>
  );
}
