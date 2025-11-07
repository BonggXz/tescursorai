import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MDXContent } from "@/components/content/mdx-content";
import { ProductCard } from "@/components/store/product-card";
import { getProductBySlug, getRelatedProducts } from "@/lib/services/products";
import { env } from "@/lib/env";
import { formatCurrency } from "@/lib/utils";

interface ProductPageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    return {
      title: "Product not found",
    };
  }
  return {
    title: product.title,
    description: product.description.slice(0, 160),
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const related = await getRelatedProducts(product.id, product.tags, 4);
  const isMockCheckoutEnabled = env.FEATURE_FLAG_MOCK_CHECKOUT ?? true;

  return (
    <div className="bg-white py-12 md:py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr]">
          <div className="space-y-6">
            <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-slate-100">
              {product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  No preview available
                </div>
              )}
            </div>
            {product.images.length > 1 ? (
              <div className="grid grid-cols-4 gap-3">
                {product.images.slice(1).map((image, index) => (
                  <div
                    key={image}
                    className="relative aspect-[4/3] overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
                  >
                    <Image
                      src={image}
                      alt={`${product.title} preview ${index + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-6 rounded-3xl border border-slate-200/70 bg-slate-50 p-6 shadow-sm">
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold text-slate-900">
                {product.title}
              </h1>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <p className="text-lg font-semibold text-slate-900">
                {formatCurrency(product.priceCents)}
              </p>
              {product.robloxAssetId ? (
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Roblox Asset ID:{" "}
                  <span className="font-semibold text-slate-900">
                    {product.robloxAssetId}
                  </span>
                </p>
              ) : null}
            </div>

            <Separator />

            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                Categories:{" "}
                {product.categories.length
                  ? product.categories.join(", ")
                  : "General"}
              </p>
              <p>
                Updated on{" "}
                {product.updatedAt.toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>

            <Separator />

            <div className="flex flex-col gap-3">
              {isMockCheckoutEnabled ? (
                <Button size="lg" className="btn-primary">
                  Proceed to mock checkout
                </Button>
              ) : (
                <Button size="lg" className="btn-primary" disabled>
                  Checkout disabled
                </Button>
              )}
              <p className="text-xs text-muted-foreground">
                {isMockCheckoutEnabled
                  ? "This is a sandbox checkout flow. Integrate Stripe or your payment provider before going live."
                  : "Checkout is locked in this environment."}
              </p>
              <p className="text-xs text-muted-foreground">
                Need bulk licensing or studio support?{" "}
                <a
                  href="mailto:admin@site.test"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Email the admin team
                </a>
                .
              </p>
            </div>
          </div>
        </div>

        <div className="prose prose-slate max-w-none rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm md:p-10">
          <MDXContent source={product.description} />
        </div>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">
              You might also like
            </h2>
            <Button asChild variant="outline" size="sm">
              <Link href="/store">Browse store</Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {related
              .filter((item) => item.id !== product.id)
              .slice(0, 4)
              .map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}
