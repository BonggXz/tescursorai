'use client';

import { useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SortOption = {
  value: string;
  label: string;
};

type SortSelectProps = {
  currentSort: string;
  searchParams: Record<string, string>;
  options: SortOption[];
  path?: string;
};

export function SortSelect({
  currentSort,
  searchParams,
  options,
  path,
}: SortSelectProps) {
  const router = useRouter();
  const pathnameFromHook = usePathname();
  const pathname = path ?? pathnameFromHook;
  const [isPending, startTransition] = useTransition();

  return (
    <Select
      defaultValue={currentSort}
      onValueChange={(value) => {
        startTransition(() => {
          const params = new URLSearchParams(searchParams);
          params.set("sort", value);
          params.delete("page");
          const query = params.toString();
          router.push(query ? `${pathname}?${query}` : pathname);
        });
      }}
      disabled={isPending}
    >
      <SelectTrigger className="w-[220px] rounded-full border border-border/70 bg-white text-sm shadow-sm">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
