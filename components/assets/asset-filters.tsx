"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { AssetSort } from "@/lib/services/assets";
import { cn } from "@/lib/utils";

interface AssetFiltersProps {
  categories: string[];
  tags: string[];
  sort: AssetSort | undefined;
  search: string | undefined;
  category: string | undefined;
  tag: string | undefined;
}

const buildQueryString = (
  params: URLSearchParams,
  key: string,
  value?: string | null,
) => {
  const updated = new URLSearchParams(params.toString());
  if (value && value.length > 0) {
    updated.set(key, value);
  } else {
    updated.delete(key);
  }
  updated.delete("page");
  return updated.toString();
};

export function AssetFilters({
  categories,
  tags,
  sort,
  search,
  category,
  tag,
}: AssetFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(search ?? "");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const next = search ?? "";
    startTransition(() => {
      setQuery(next);
    });
  }, [search, startTransition]);

  const applySearch = useCallback(
    (term: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const qs = buildQueryString(params, "q", term || undefined);
      startTransition(() => {
        router.replace(`${pathname}?${qs}`, { scroll: false });
      });
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      if (query !== (search ?? "")) {
        applySearch(query);
      }
    }, 350);
    return () => clearTimeout(handler);
  }, [applySearch, query, search]);

  const handleSortChange = (value: AssetSort) => {
    const params = new URLSearchParams(searchParams.toString());
    const qs = buildQueryString(params, "sort", value);
    router.replace(`${pathname}?${qs}`, { scroll: false });
  };

  const applyFilter = (key: "category" | "tag", value?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const qs = buildQueryString(params, key, value);
    router.replace(`${pathname}?${qs}`, { scroll: false });
  };

  const activeCategory = category ?? "";
  const activeTag = tag ?? "";

  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.localeCompare(b)),
    [categories],
  );
  const sortedTags = useMemo(
    () => [...tags].sort((a, b) => a.localeCompare(b)),
    [tags],
  );

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
          <Search className="h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search assets..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="border-0 bg-transparent focus-visible:ring-0"
            disabled={isPending}
          />
        </div>
        <Select value={sort ?? "newest"} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full md:w-56">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="popular">Most downloaded</SelectItem>
            <SelectItem value="name">Name</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          <Filter className="h-4 w-4" />
          Filters
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            <Badge
              onClick={() => applyFilter("category")}
              variant={activeCategory ? "outline" : "default"}
              className={cn(
                "cursor-pointer px-3 py-1 text-xs",
                !activeCategory && "bg-primary text-white",
              )}
            >
              All categories
            </Badge>
            {sortedCategories.map((item) => (
              <Badge
                key={item}
                onClick={() => applyFilter("category", item)}
                variant={activeCategory === item ? "default" : "outline"}
                className={cn(
                  "cursor-pointer px-3 py-1 text-xs",
                  activeCategory === item &&
                    "bg-primary text-primary-foreground hover:bg-primary/90",
                )}
              >
                {item}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge
            onClick={() => applyFilter("tag")}
            variant={activeTag ? "outline" : "secondary"}
            className={cn(
              "cursor-pointer px-3 py-1 text-xs",
              !activeTag && "bg-primary/10 text-primary",
            )}
          >
            All tags
          </Badge>
          {sortedTags.map((item) => (
            <Badge
              key={item}
              onClick={() => applyFilter("tag", item)}
              variant={activeTag === item ? "default" : "outline"}
              className={cn(
                "cursor-pointer px-3 py-1 text-xs",
                activeTag === item &&
                  "bg-primary text-primary-foreground hover:bg-primary/90",
              )}
            >
              {item}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end">
        {(category || tag || search) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.delete("q");
              params.delete("category");
              params.delete("tag");
              params.delete("page");
              router.replace(`${pathname}?${params.toString()}`, {
                scroll: false,
              });
            }}
          >
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}
