import type { Metadata } from "next";
import { ProductFilters } from "@/components/store/product-filters";
import { ProductCard } from "@/components/store/product-card";
import { PaginationControls } from "@/components/common/pagination-controls";
import { parseStoreSearchParams } from "@/lib/validation/store-query";
import { getProducts, getProductFilters } from "@/lib/services/products";

export const metadata: Metadata = {
  title: "Store",
  description:
    "Discover premium Roblox Studio products: systems, UI kits, automation suites, and more.",
};

export default async function StorePage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const query = parseStoreSearchParams(searchParams);
  query.pageSize = 12;
  const [{ data, total, page, pageCount }, filters] = await Promise.all([
    getProducts(query),
    getProductFilters(),
  ]);

  return (
    <div className="bg-slate-50 py-12 md:py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 md:px-6">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Store
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">
            Build faster with premium drops
          </h1>
          <p className="text-sm text-muted-foreground">
            Curated systems, automation scripts, and UI kits designed for Roblox
            Studio creators. Search, filter, and sort to find exactly what you
            need.
          </p>
        </div>

        <ProductFilters
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
            {Math.min(page * 12, total)} of {total} products
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {!data.length && (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-300/70 bg-white p-10 text-center text-sm text-muted-foreground">
              No products found. Try adjusting your search or filters.
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
