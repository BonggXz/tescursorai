import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getPagedProducts,
  getProductFilters,
} from "@/server/products";
import { storeQuerySchema } from "@/lib/validation/store";
import { ProductCard } from "@/components/store/product-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { SortSelect } from "@/components/store/sort-select";
import { cn } from "@/lib/utils";

type StorePageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

type StoreQueryResolved = {
  q?: string;
  category?: string;
  tag?: string;
  sort: "newest" | "price-asc" | "price-desc" | "popular";
  page: number;
};

function readParam(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) {
    return value[value.length - 1];
  }
  return value;
}

function buildQueryString(
  current: Record<string, string>,
  updates: Record<string, string | undefined | null>,
) {
  const params = new URLSearchParams(current);
  for (const [key, value] of Object.entries(updates)) {
    if (value === undefined || value === null || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  }
  return params.toString();
}

function toStringRecord(
  input: {
    q?: string;
    category?: string;
    tag?: string;
    sort?: string;
    page?: number;
  },
) {
  const record: Record<string, string> = {};
  if (input.q) record.q = input.q;
  if (input.category) record.category = input.category;
  if (input.tag) record.tag = input.tag;
  if (input.sort) record.sort = input.sort;
  if (input.page && input.page > 1) record.page = String(input.page);
  return record;
}

export default async function StorePage({ searchParams }: StorePageProps) {
  const parsed = storeQuerySchema.safeParse({
    q: readParam(searchParams.q),
    category: readParam(searchParams.category),
    tag: readParam(searchParams.tag),
    sort: readParam(searchParams.sort),
    page: readParam(searchParams.page),
  });

  const query: StoreQueryResolved = {
    q: parsed.success ? parsed.data.q : undefined,
    category: parsed.success ? parsed.data.category : undefined,
    tag: parsed.success ? parsed.data.tag : undefined,
    sort: (parsed.success ? parsed.data.sort : undefined) ?? "newest",
    page: parsed.success ? parsed.data.page ?? 1 : 1,
  };

  const [products, filters] = await Promise.all([
    getPagedProducts({
      q: query.q,
      category: query.category,
      tag: query.tag,
      sort: query.sort,
      page: query.page,
    }),
    getProductFilters(),
  ]);

  if (products.page > products.pageCount && products.pageCount > 0) {
    notFound();
  }

  const activeSort = query.sort;
  const baseParams = toStringRecord({
    q: query.q,
    category: query.category,
    tag: query.tag,
    sort: activeSort,
    page: query.page,
  });

  const showClearFilters = Boolean(query.category || query.tag || query.q);

  return (
    <div className="container flex flex-col gap-12 py-16">
      <header className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
              Store
            </p>
            <h1 className="text-3xl font-heading font-semibold text-slate-900">
              Premium kits, systems, and tools for Roblox Studio teams.
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Filter by categories or tags to pinpoint the exact systems and kits you
              need. All products are reviewed for quality and production readiness.
            </p>
          </div>
          <SortSelect
            currentSort={activeSort}
            searchParams={baseParams}
            path="/store"
            options={[
              { value: "newest", label: "Newest" },
              { value: "popular", label: "Popular" },
              { value: "price-asc", label: "Price: Low to High" },
              { value: "price-desc", label: "Price: High to Low" },
            ]}
          />
        </div>
        <form className="flex flex-wrap items-center gap-3" method="get">
          <Input
            name="q"
            placeholder="Search products..."
            defaultValue={query.q ?? ""}
            className="w-full min-w-[280px] flex-1 rounded-full border border-border/80 bg-white px-4 py-6 text-sm shadow-sm focus-visible:ring-primary md:max-w-lg"
          />
          {query.category ? (
            <input type="hidden" name="category" value={query.category} />
          ) : null}
          {query.tag ? <input type="hidden" name="tag" value={query.tag} /> : null}
          {query.sort ? <input type="hidden" name="sort" value={query.sort} /> : null}
          <Button type="submit" size="lg" className="rounded-full px-6">
            Search
          </Button>
          {showClearFilters ? (
            <Button type="button" variant="ghost" asChild className="rounded-full px-4">
              <Link href="/store">Clear filters</Link>
            </Button>
          ) : null}
        </form>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Categories
            </span>
            {filters.categories.map((category) => {
              const isActive = query.category === category;
              const href = `/store?${buildQueryString(baseParams, {
                category: isActive ? undefined : category,
                page: undefined,
              })}`;
              return (
                <Link key={category} href={href} className="inline-flex">
                  <Badge
                    variant={isActive ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer rounded-full px-3 py-1 text-xs",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "border-border/60 text-muted-foreground hover:bg-primary/10",
                    )}
                  >
                    {category}
                  </Badge>
                </Link>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Tags
            </span>
            {filters.tags.map((tag) => {
              const isActive = query.tag === tag;
              const href = `/store?${buildQueryString(baseParams, {
                tag: isActive ? undefined : tag,
                page: undefined,
              })}`;
              return (
                <Link key={tag} href={href} className="inline-flex">
                  <Badge
                    variant={isActive ? "default" : "secondary"}
                    className={cn(
                      "cursor-pointer rounded-full px-3 py-1 text-xs",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-primary/10",
                    )}
                  >
                    {tag}
                  </Badge>
                </Link>
              );
            })}
          </div>
        </div>
      </header>
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        {products.items.length === 0 ? (
          <div className="col-span-full flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border/70 bg-slate-50 px-8 py-16 text-center text-muted-foreground">
            <h2 className="text-lg font-semibold text-slate-900">
              No products match your filters
            </h2>
            <p className="text-sm">
              Adjust your search terms or clear filters to explore the full catalog.
            </p>
            <Button variant="outline" asChild className="rounded-full">
              <Link href="/store">Reset filters</Link>
            </Button>
          </div>
        ) : null}
      </section>
      {products.pageCount > 1 ? (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={
                  products.page > 1
                    ? `/store?${buildQueryString(baseParams, {
                        page: String(products.page - 1),
                      })}`
                    : undefined
                }
              />
            </PaginationItem>
            <PaginationItem>
              <span className="text-sm text-muted-foreground">
                Page {products.page} of {products.pageCount}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href={
                  products.page < products.pageCount
                    ? `/store?${buildQueryString(baseParams, {
                        page: String(products.page + 1),
                      })}`
                    : undefined
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ) : null}
    </div>
  );
}
