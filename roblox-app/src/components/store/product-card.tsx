import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Tag } from "lucide-react";

import { ProductSummary } from "@/server/products";
import { formatCurrency } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  product: ProductSummary;
};

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.images.at(0) ?? "/seed/products/combat-kit-pro.svg";

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-border/70 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/store/${product.slug}`} className="relative block aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <Image
          src={imageUrl}
          alt={product.title}
          fill
          sizes="(min-width: 1024px) 320px, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {product.categories.slice(0, 2).map((category) => (
              <Badge
                key={category}
                variant="outline"
                className="border-primary/30 bg-primary/5 text-primary"
              >
                {category}
              </Badge>
            ))}
          </div>
          <Link
            href={`/store/${product.slug}`}
            className="text-xl font-semibold leading-tight text-slate-900 transition hover:text-primary"
          >
            {product.title}
          </Link>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {product.description}
          </p>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-slate-900">
              {formatCurrency(product.priceCents)}
            </span>
            {product.tags.slice(0, 1).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-slate-50 px-2 py-1 text-xs text-muted-foreground"
              >
                <Tag className="h-3 w-3" aria-hidden />
                {tag}
              </span>
            ))}
          </div>
          <Link
            href={`/store/${product.slug}`}
            className={cn(
              buttonVariants({ size: "sm", variant: "ghost" }),
              "group/cta text-sm",
            )}
          >
            View
            <ArrowRight className="ml-1 h-4 w-4 transition group-hover/cta:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}
