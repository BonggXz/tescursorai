import Image from "next/image";
import Link from "next/link";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";
import { getExcerpt } from "@/lib/markdown";
import { cn } from "@/lib/utils";

type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  priceCents: number;
  images: string[];
  categories: string[];
  tags: string[];
};

type ProductCardProps = {
  product: Product;
  className?: string;
};

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80";

export function ProductCard({ product, className }: ProductCardProps) {
  const image = product.images[0] ?? PLACEHOLDER_IMAGE;

  return (
    <Card
      className={cn(
        "group flex h-full flex-col overflow-hidden border border-slate-200",
        className,
      )}
    >
      <CardHeader className="relative h-52 overflow-hidden p-0">
        <Image
          src={image}
          alt={product.title}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(min-width: 1024px) 320px, 100vw"
          priority={false}
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {product.categories.slice(0, 2).map((category) => (
            <Badge key={category} className="bg-white/90 text-xs font-medium text-slate-700 shadow">
              {category}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 p-5">
        <Link
          href={`/store/${product.slug}`}
          className="text-lg font-semibold text-slate-900 hover:underline"
        >
          {product.title}
        </Link>
        <p className="line-clamp-3 text-sm text-slate-600">{getExcerpt(product.description)}</p>
        <div className="flex flex-wrap gap-2">
          {product.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-4">
        <span className="text-sm font-semibold text-primary">
          {formatCurrency(product.priceCents)}
        </span>
        <Link
          href={`/store/${product.slug}`}
          className="text-sm font-medium text-primary hover:text-primary/80"
        >
          View details →
        </Link>
      </CardFooter>
    </Card>
  );
}
