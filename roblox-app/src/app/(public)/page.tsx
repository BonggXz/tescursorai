import Link from "next/link";
import { ArrowRight, MessageCircle, Send, Youtube } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getSiteSettings } from "@/server/settings";
import {
  getFeaturedProducts,
  getLatestProducts,
} from "@/server/products";
import {
  getFeaturedAssets,
  getLatestAssets,
} from "@/server/assets";
import { ProductCard } from "@/components/store/product-card";
import { AssetCard } from "@/components/assets/asset-card";

export default async function LandingPage() {
  const settings = await getSiteSettings();

  const [featuredProducts, fallbackProducts, featuredAssets, fallbackAssets] =
    await Promise.all([
      getFeaturedProducts(settings.featuredProductIds),
      getLatestProducts(4),
      getFeaturedAssets(settings.featuredAssetIds),
      getLatestAssets(6),
    ]);

  const storeSelections = featuredProducts.length
    ? featuredProducts.slice(0, 3)
    : fallbackProducts.slice(0, 3);

  const assetSelections = featuredAssets.length
    ? featuredAssets.slice(0, 6)
    : fallbackAssets.slice(0, 6);

  const socialLinks = Object.entries(settings.socials).filter(
    ([, value]) => typeof value === "string" && value,
  ) as [string, string][];

  return (
    <div className="flex flex-col gap-20 pb-20">
      <section className="bg-gradient-to-b from-white via-white to-slate-100">
        <div className="container grid gap-10 py-24 lg:grid-cols-[1.15fr_1fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              Roblox Studio Community
            </div>
            <h1 className="text-4xl font-heading font-semibold tracking-tight text-slate-900 sm:text-5xl">
              {settings.heroTitle}
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              {settings.heroSubtitle}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/store"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-primary text-primary-foreground shadow-subtle hover:bg-primary-hover",
                )}
              >
                Visit Store
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/assets"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "border-primary/40 text-primary hover:bg-primary/10",
                )}
              >
                Browse Assets
              </Link>
            </div>
            {socialLinks.length ? (
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Connect
                </span>
                {socialLinks.map(([key, url]) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-white px-3 py-1 text-xs font-medium transition hover:border-primary hover:text-primary"
                  >
                    {key === "discord" ? (
                      <MessageCircle className="h-3.5 w-3.5" />
                    ) : key === "youtube" ? (
                      <Youtube className="h-3.5 w-3.5" />
                    ) : key === "whatsapp" ? (
                      <Send className="h-3.5 w-3.5" />
                    ) : (
                      <ArrowRight className="h-3.5 w-3.5" />
                    )}
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
          <div className="relative hidden min-h-[320px] lg:block">
            <div className="absolute inset-0 rounded-3xl bg-primary/10 blur-3xl" />
            <div className="relative flex h-full flex-col gap-5 rounded-3xl border border-border/70 bg-white p-10 shadow-lg">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">
                Featured drops
              </p>
              {storeSelections.slice(0, 2).map((product) => (
                <div
                  key={product.id}
                  className="rounded-2xl border border-border/60 bg-white/80 p-4 shadow-sm"
                >
                  <p className="text-sm font-medium text-muted-foreground">
                    {product.categories[0] ?? "Creator Kit"}
                  </p>
                  <p className="text-base font-semibold text-slate-900">
                    {product.title}
                  </p>
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                    {product.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container space-y-10">
        <div className="flex flex-col gap-3">
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            Why creators join
          </span>
          <h2 className="text-3xl font-heading font-semibold text-slate-900">
            Build faster with a focused toolkit.
          </h2>
          <p className="max-w-2xl text-base text-muted-foreground">
            From polished UI kits to production-ready scripts, everything is curated to
            keep your Roblox experiences shipping on time.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Creator-first store",
              description:
                "Premium frameworks, templates, and systems reviewed by senior Roblox engineers.",
            },
            {
              title: "Asset & script vault",
              description:
                "Downloadable Lua scripts, models, and tooling with semantic versioning and changelog tracking.",
            },
            {
              title: "Live community support",
              description:
                "Dedicated Discord with weekly office hours and peer code reviews.",
            },
            {
              title: "Admin-grade management",
              description:
                "Secure dashboard for launching new drops, managing assets, and tracking usage analytics.",
            },
            {
              title: "Production-ready workflows",
              description:
                "Validated pipelines, rate limiting, and audit logs built in for peace of mind.",
            },
            {
              title: "Motion that guides—not distracts",
              description:
                "Framer Motion micro-interactions keep focus on your work without heavy parallax.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="group rounded-3xl border border-border/70 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <h3 className="text-lg font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="container space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-heading font-semibold text-slate-900">
              Featured store releases
            </h2>
            <p className="text-sm text-muted-foreground">
              Premium systems curated for teams shipping in Roblox Studio.
            </p>
          </div>
          <Link
            href="/store"
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            View all products
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {storeSelections.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="container space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-heading font-semibold text-slate-900">
              Latest asset drops
            </h2>
            <p className="text-sm text-muted-foreground">
              Free scripts and models ready for integration into your worlds.
            </p>
          </div>
          <Link
            href="/assets"
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Browse all assets
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {assetSelections.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      </section>
    </div>
  );
}
