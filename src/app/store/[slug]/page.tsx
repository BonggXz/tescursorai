import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { ProductCard } from "@/components/cards/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MdxContent } from "@/components/mdx/mdx-content";
import { formatCurrency } from "@/lib/format";
import { getExcerpt } from "@/lib/markdown";
import { getProductBySlug, getProducts } from "@/server/queries/products";

type ProductPageProps = {
  params: { slug: string };
};

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const relatedCategory = product.categories[0];
  const relatedProducts = relatedCategory
    ? (await getProducts({ category: relatedCategory, perPage: 4 })).items.filter(
        (item) => item.id !== product.id,
      )
    : [];

  const heroImage = product.images[0];

  return (
    <div className="container space-y-12 py-12">
      <Link
        href="/store"
        className="inline-flex items-center text-sm font-medium text-slate-600 transition hover:text-slate-900"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to store
      </Link>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="space-y-4">
          <div className="relative aspect-video overflow-hidden rounded-2xl border border-slate-200">
            {heroImage ? (
              <Image
                src={heroImage}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 600px, 100vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-slate-100 text-slate-500">
                No preview available
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {product.images.slice(0, 4).map((image, index) => (
              <Image
                key={`${image}-${index}`}
                src={image}
                alt={product.title}
                width={96}
                height={96}
                className="h-20 w-20 rounded-lg border border-slate-200 object-cover"
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {product.categories.map((category) => (
                <Badge key={category} variant="secondary">
                  {category}
                </Badge>
              ))}
            </div>
            <h1 className="text-3xl font-semibold text-slate-900">{product.title}</h1>
            <p className="text-sm text-slate-600">{getExcerpt(product.description, 220)}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-wider text-slate-500">Tags</p>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <p className="text-sm uppercase tracking-wider text-slate-500">Price</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {formatCurrency(product.priceCents)}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              This is a mock checkout. Integrate payments with Stripe or the Roblox Marketplace when
              you&apos;re ready.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button size="lg" disabled>
                Checkout coming soon
              </Button>
              <Button variant="outline" asChild>
                <Link href="/contact">Request custom integration</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <section className="grid gap-10 md:grid-cols-[2fr_1fr]">
        <article className="space-y-6">
          <h2 className="text-2xl font-semibold text-slate-900">What&apos;s inside</h2>
          <MdxContent source={product.description} className="prose-lg" />
        </article>
        <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Need enterprise support?</h3>
          <p className="mt-2 text-sm text-slate-600">
            We partner with Roblox studios to build and maintain production systems, analytics
            pipelines, and monetization playbooks.
          </p>
          <Button asChild variant="outline" className="mt-4 w-full">
            <Link href="mailto:hello@robloxstudiohub.test">Book a discovery call</Link>
          </Button>
        </aside>
      </section>

      {relatedProducts.length > 0 ? (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-slate-900">More in {relatedCategory}</h2>
            <Link
              href={`/store?category=${encodeURIComponent(relatedCategory ?? "")}`}
              className="text-sm font-medium text-primary hover:text-primary/80"
            >
              View all
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {relatedProducts.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
