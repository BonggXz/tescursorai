import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { CheckCircle, ExternalLink, Shield } from "lucide-react";

import { getProductBySlug, getRelatedProducts } from "@/server/products";
import { ProductCard } from "@/components/store/product-card";
import { MdxContent } from "@/components/mdx/mdx-content";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/format";

type StoreDetailPageProps = {
  params: { slug: string };
};

export default async function StoreDetailPage({ params }: StoreDetailPageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const related = await getRelatedProducts(product, 3);
  const imageUrl = product.images.at(0) ?? "/seed/products/combat-kit-pro.svg";

  return (
    <div className="container flex flex-col gap-16 py-16">
      <section className="grid gap-10 lg:grid-cols-[minmax(0,3fr)_2fr]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border/70 bg-slate-100">
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            sizes="(min-width: 1280px) 720px, 100vw"
            className="object-cover"
            priority
          />
        </div>
        <aside className="flex flex-col justify-between rounded-3xl border border-border/70 bg-white p-8 shadow-lg">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              {product.categories.map((category) => (
                <Badge
                  key={category}
                  variant="secondary"
                  className="rounded-full px-3 py-1 text-xs"
                >
                  {category}
                </Badge>
              ))}
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-heading font-semibold text-slate-900">
                {product.title}
              </h1>
              <p className="text-sm text-muted-foreground">
                Updated {formatDate(product.updatedAt)}
              </p>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-slate-900">
                {formatCurrency(product.priceCents)}
              </span>
              <span className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
                USD
              </span>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                Optimized Lua scripts included
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Audit-ready changelog + versioning
              </li>
              {product.robloxAssetId ? (
                <li className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-primary" />
                  Roblox Asset ID: {product.robloxAssetId}
                </li>
              ) : null}
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <Button size="lg" className="rounded-full">
              Purchase (mock checkout)
            </Button>
            <p className="text-xs text-muted-foreground">
              Checkout is mocked for demonstration. Integrate Stripe or your preferred
              processor in production behind a feature flag.
            </p>
          </div>
        </aside>
      </section>

      <section className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_1fr]">
        <div className="space-y-8">
          <MdxContent code={product.description} />
        </div>
        <div className="flex flex-col gap-6 rounded-3xl border border-border/70 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Tags
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="rounded-full px-3 py-1 text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-xs text-muted-foreground">
            <p className="font-semibold text-primary">Licensing & usage</p>
            <p className="mt-2">
              Use in unlimited Roblox experiences. Redistribution of the raw package is
              prohibited. Contact the admin team for commercial bundling.
            </p>
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-heading font-semibold text-slate-900">
              Related products
            </h2>
            <Link
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
              href="/store"
            >
              Browse store
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
