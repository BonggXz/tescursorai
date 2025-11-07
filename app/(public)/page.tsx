import type { Metadata } from "next";
import Link from "next/link";
import {
  Cpu,
  Rocket,
  ShieldCheck,
  Sparkles,
  Gauge,
  UsersRound,
} from "lucide-react";
import { HeroSection } from "@/components/marketing/hero-section";
import { FeatureGrid, type FeatureItem } from "@/components/marketing/feature-grid";
import { ProductCard } from "@/components/store/product-card";
import { AssetCard } from "@/components/assets/asset-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getSiteSettings } from "@/lib/services/site";
import {
  getProductsByIds,
  getLatestProducts,
  type ProductDto,
} from "@/lib/services/products";
import {
  getAssetsByIds,
  getLatestAssets,
  getSiteDownloadStats,
  type AssetDto,
} from "@/lib/services/assets";

function dedupeById<T extends { id: string }>(items: T[]): T[] {
  const map = new Map<string, T>();
  items.forEach((item) => {
    if (!map.has(item.id)) {
      map.set(item.id, item);
    }
  });
  return Array.from(map.values());
}

export const metadata: Metadata = {
  title: "Roblox Studio Community Hub",
  description:
    "Discover premium Roblox Studio products, free assets, and automation scripts curated by the community.",
};

export default async function LandingPage() {
  const settings = await getSiteSettings();

  const [
    featuredProducts,
    latestProducts,
    featuredAssets,
    latestAssets,
    stats,
  ] = await Promise.all([
    getProductsByIds(settings.featuredProductIds),
    getLatestProducts(8),
    getAssetsByIds(settings.featuredAssetIds),
    getLatestAssets(12),
    getSiteDownloadStats(),
  ]);

  const products: ProductDto[] = dedupeById([
    ...featuredProducts,
    ...latestProducts,
  ]).slice(0, 4);

  const assets: AssetDto[] = dedupeById([
    ...featuredAssets,
    ...latestAssets,
  ]).slice(0, 6);

  const features: FeatureItem[] = [
    {
      title: "Creator-first tooling",
      description:
        "Templates, blueprints, and automation scripts tailored for rapid Roblox Studio production.",
      icon: Rocket,
    },
    {
      title: "Production-ready scripts",
      description:
        "Battle-tested Lua modules with rigorous validation and versioned changelogs.",
      icon: Cpu,
    },
    {
      title: "Secure admin workflows",
      description:
        "Role-based access, audit logs, and encrypted credential flows keep your community protected.",
      icon: ShieldCheck,
    },
    {
      title: "Active community",
      description:
        "Collaborate with builders, scripters, and designers across Discord, WhatsApp, and YouTube.",
      icon: UsersRound,
    },
    {
      title: "Performance dashboards",
      description:
        "Review downloads, storefront traction, and creator engagement with real-time metrics.",
      icon: Gauge,
    },
    {
      title: "Always up to date",
      description:
        "Fresh drops every week—UI kits, combat packs, automation, and more curated by the admin team.",
      icon: Sparkles,
    },
  ];

  const socialEntries = Object.entries(settings.socials).filter(
    ([, value]) => Boolean(value),
  );

  return (
    <>
      <HeroSection title={settings.heroTitle} subtitle={settings.heroSubtitle} />
      <section className="bg-white py-12">
        <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 md:grid-cols-3 md:px-6">
          <div className="rounded-2xl border border-primary/20 bg-primary/10 p-6 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-primary">
              Community impact
            </p>
            <p className="mt-3 text-3xl font-semibold text-primary">
              {stats.totalDownloads.toLocaleString()}
            </p>
            <p className="text-sm text-primary/80">
              total downloads powered by our creators
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Growth
            </p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">
              {stats.downloadsLast7Days.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              downloads in the last 7 days
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Join the conversation
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {socialEntries.map(([key]) => (
                <Badge key={key} variant="secondary">
                  {key}
                </Badge>
              ))}
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Connect across your favorite platforms.
            </p>
          </div>
        </div>
      </section>

      <FeatureGrid features={features} />

      <section className="bg-slate-50 py-16 md:py-24">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 md:px-6">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                Store spotlight
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900 md:text-3xl">
                Latest premium drops
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Curated packs and systems ready for deployment.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/store">View all products</Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 md:px-6">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                Asset vault
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900 md:text-3xl">
                Open-source assets & scripts
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Free downloads, generously shared by the community.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/assets">Browse all assets</Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {assets.map((asset) => (
              <AssetCard key={asset.id} asset={asset} />
            ))}
          </div>
        </div>
      </section>

      {socialEntries.length ? (
        <section className="bg-slate-900 py-16 md:py-24">
          <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-4 text-center text-white md:px-6">
            <p className="text-xs uppercase tracking-[0.35em] text-primary/60">
              Stay connected
            </p>
            <h2 className="text-3xl font-semibold md:text-4xl">
              Join {settings.siteName} across the web
            </h2>
            <p className="max-w-2xl text-sm text-slate-300">
              Live streams, office hours, and weekly drops—follow us where you
              collaborate most.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {socialEntries.map(([key, value]) => (
                <Button
                  key={key}
                  asChild
                  variant="secondary"
                  className="min-w-[140px] bg-white/10 text-white hover:bg-white/20"
                >
                  <a href={value} target="_blank" rel="noreferrer">
                    {key.toUpperCase()}
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
