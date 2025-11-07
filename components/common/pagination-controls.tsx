"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationControlsProps {
  page: number;
  pageCount: number;
}

export function PaginationControls({
  page,
  pageCount,
}: PaginationControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (pageCount <= 1) {
    return null;
  }

  const setPage = (value: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", value.toString());
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const pagesToShow = Array.from({ length: pageCount }, (_, index) => index + 1)
    .filter((p) => p === 1 || p === pageCount || Math.abs(p - page) <= 1)
    .reduce<number[]>((acc, current) => {
      if (!acc.length || acc[acc.length - 1] !== current) {
        acc.push(current);
      }
      return acc;
    }, []);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(event) => {
              event.preventDefault();
              if (page > 1) setPage(page - 1);
            }}
          />
        </PaginationItem>
        {pagesToShow.map((p, index) => {
          const prev = pagesToShow[index - 1];
          const needsEllipsis = prev && p - prev > 1;
          return (
            <PaginationItem key={p}>
              {needsEllipsis ? <PaginationEllipsis /> : null}
              <PaginationLink
                href="#"
                isActive={p === page}
                onClick={(event) => {
                  event.preventDefault();
                  setPage(p);
                }}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(event) => {
              event.preventDefault();
              if (page < pageCount) setPage(page + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
