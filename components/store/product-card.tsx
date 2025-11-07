import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { ProductDto } from "@/lib/services/products";

interface ProductCardProps {
  product: ProductDto;
}

export function ProductCard({ product }: ProductCardProps) {
  const imageSrc = product.images[0] ?? "/file.svg";

  return (
    <Link href={`/store/${product.slug}`} className="group block">
      <Card className="card-hover h-full overflow-hidden transition">
        <div className="relative h-48 w-full overflow-hidden bg-slate-100">
          <Image
            src={imageSrc}
            alt={product.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(min-width: 1024px) 400px, 100vw"
          />
        </div>
        <CardHeader className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {product.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          <h3 className="text-lg font-semibold text-slate-900 group-hover:text-primary">
            {product.title}
          </h3>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {product.description}
          </p>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <span className="text-base font-semibold text-slate-900">
            {formatCurrency(product.priceCents)}
          </span>
          <span className="text-xs text-muted-foreground">
            Updated {product.updatedAt.toLocaleDateString()}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
