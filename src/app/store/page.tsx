import Link from "next/link";

import { ProductCard } from "@/components/cards/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getProductFilterOptions,
  getProducts,
  type ProductFilters,
} from "@/server/queries/products";

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Popular", value: "popular" },
];

type StorePageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

function toFilters(params: StorePageProps["searchParams"]): ProductFilters {
  return {
    search: typeof params.q === "string" ? params.q : undefined,
    category: typeof params.category === "string" ? params.category : undefined,
    tag: typeof params.tag === "string" ? params.tag : undefined,
    sort: typeof params.sort === "string" ? (params.sort as ProductFilters["sort"]) : undefined,
    page: params.page ? Number(params.page) : undefined,
  };
}

export default async function StorePage({ searchParams }: StorePageProps) {
  const filters = toFilters(searchParams);
  const [{ items, total, totalPages, page }, filterOptions] = await Promise.all([
    getProducts(filters),
    getProductFilterOptions(),
  ]);

  const buildQuery = (overrides: Record<string, string | undefined>) => {
    const query = new URLSearchParams();
    const params: Record<string, string | undefined> = {
      q: filters.search,
      category: filters.category,
      tag: filters.tag,
      sort: filters.sort,
      ...overrides,
    };

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        query.set(key, value);
      }
    });

    return query.toString();
  };

  const selectedCategory = filters.category ?? "";
  const selectedTag = filters.tag ?? "";

  return (
    <div className="container space-y-12 py-12">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-slate-900">Community Store</h1>
          <p className="max-w-2xl text-sm text-slate-600">
            Discover premium Roblox systems, UI kits, and production-ready tools curated by the
            community. Every item ships with clear licensing, version history, and creator support.
          </p>
        </div>
        <form method="get" className="flex w-full max-w-md items-center gap-2">
          <Input
            name="q"
            defaultValue={filters.search ?? ""}
            placeholder="Search premium systems, UI kits, monetization..."
          />
          <input type="hidden" name="category" value={filters.category ?? ""} />
          <input type="hidden" name="tag" value={filters.tag ?? ""} />
          <input type="hidden" name="sort" value={filters.sort ?? "newest"} />
          <Button type="submit">Search</Button>
        </form>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <form method="get" className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm font-medium text-slate-700">
            Sort by
          </label>
          <select
            id="sort"
            name="sort"
            defaultValue={filters.sort ?? "newest"}
            className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm"
            onChange={(event) => event.currentTarget.form?.submit()}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <input type="hidden" name="q" value={filters.search ?? ""} />
          <input type="hidden" name="category" value={filters.category ?? ""} />
          <input type="hidden" name="tag" value={filters.tag ?? ""} />
        </form>
        {(filters.category || filters.tag) && (
          <Link href="/store" className="text-sm font-medium text-primary hover:text-primary/80">
            Clear filters
          </Link>
        )}
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase text-slate-500">Browse by category</p>
        <div className="flex flex-wrap gap-2">
          {filterOptions.categories.map((category) => {
            const isActive = selectedCategory === category;
            const query = buildQuery({ category, page: undefined, tag: filters.tag });
            return (
              <Link key={category} href={`/store?${query}`}>
                <Badge
                  variant={isActive ? "default" : "outline"}
                  className={isActive ? "bg-primary text-white hover:bg-primary/90" : ""}
                >
                  {category}
                </Badge>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase text-slate-500">Popular tags</p>
        <div className="flex flex-wrap gap-2">
          {filterOptions.tags.map((tag) => {
            const isActive = selectedTag === tag;
            const query = buildQuery({ tag, page: undefined, category: filters.category });
            return (
              <Link key={tag} href={`/store?${query}`}>
                <Badge variant={isActive ? "default" : "secondary"}>{tag}</Badge>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="space-y-6">
        <p className="text-sm text-slate-600">
          Showing <span className="font-semibold text-slate-900">{items.length}</span> of{" "}
          <span className="font-semibold text-slate-900">{total}</span> products
        </p>
        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-12 text-center">
            <p className="text-sm font-medium text-slate-700">
              No products match those filters yet.
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Try adjusting your search or explore the latest releases on the landing page.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 ? (
        <div className="flex items-center justify-between border-t border-slate-200 pt-6">
          <Button variant="outline" disabled={page <= 1} asChild>
            <Link href={`/store?${buildQuery({ page: String(page - 1) })}`}>Previous</Link>
          </Button>
          <p className="text-sm text-slate-600">
            Page {page} of {totalPages}
          </p>
          <Button variant="outline" disabled={page >= totalPages} asChild>
            <Link href={`/store?${buildQuery({ page: String(page + 1) })}`}>Next</Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
}
