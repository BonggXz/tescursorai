import Link from "next/link";
import { ArrowRight, ShieldCheck, Users, Zap } from "lucide-react";

import { AssetCard } from "@/components/cards/asset-card";
import { ProductCard } from "@/components/cards/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getLatestAssets } from "@/server/queries/assets";
import { getLatestProducts } from "@/server/queries/products";
import { getSiteSettings } from "@/server/queries/site-settings";

const features = [
  {
    title: "Creator-first workflows",
    description: "Blueprints, checklists, and sandboxes designed around Roblox Studio pipelines.",
    icon: Users,
  },
  {
    title: "Production-ready systems",
    description: "Drop-in combat kits, UI frameworks, monetization flows, and analytics hooks.",
    icon: Zap,
  },
  {
    title: "Secure assets & licensing",
    description: "Clean licenses, versioned releases, and audit trails keep teams production safe.",
    icon: ShieldCheck,
  },
];

export default async function HomePage() {
  const [settings, latestProducts, latestAssets] = await Promise.all([
    getSiteSettings(),
    getLatestProducts(4),
    getLatestAssets(6),
  ]);

  const socials = (settings?.socials ?? {}) as Record<string, string>;

  return (
    <div className="space-y-16 pb-20">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
        <div className="container relative z-10 flex flex-col gap-8 py-20 text-white md:py-28">
          <Badge className="w-fit bg-white/15 px-4 py-1 text-xs uppercase tracking-wide">
            Roblox Studio Collective
          </Badge>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight md:text-5xl">
            Ship faster with a modern Roblox community storefront and open asset hub.
          </h1>
          <p className="max-w-2xl text-lg text-white/80">
            Discover premium creator systems, UI kits, and collaborative tooling crafted by our
            community. Browse featured drops or pull free scripts to power your next experience.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg">
              <Link href="/store">
                Visit the Store <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/10 text-white hover:bg-white/20"
            >
              <Link href="/assets">Browse Free Assets</Link>
            </Button>
            {socials.discord ? (
              <Button variant="ghost" asChild size="lg" className="text-white hover:bg-white/10">
                <Link href={socials.discord} target="_blank" rel="noopener noreferrer">
                  Join Discord
                </Link>
              </Button>
            ) : null}
          </div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.35),_transparent)]" />
      </section>

      <section className="container space-y-10">
        <div className="space-y-4 text-center md:mx-auto md:max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
            Why builders choose this hub
          </h2>
          <p className="text-slate-600">
            Handpicked tooling from production teams, security-forward distribution, and a community
            pace that keeps Roblox experiences shipping.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <feature.icon className="mb-4 h-10 w-10 text-primary" />
              <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container space-y-6">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Featured Store Drops</h2>
            <p className="text-sm text-slate-600">
              Premium systems you can plug into live Roblox experiences.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/store">
              View store <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {latestProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="container space-y-6">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Latest Assets & Scripts</h2>
            <p className="text-sm text-slate-600">
              Free downloads with version history, licensing, and transparent security checks.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/assets">
              Browse assets <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {latestAssets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      </section>

      {socials.discord || socials.youtube || socials.x ? (
        <section className="container rounded-3xl border border-slate-200 bg-slate-900 px-6 py-10 text-white md:px-12 md:py-14">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl space-y-3">
              <h2 className="text-2xl font-semibold">Stay in sync with the community</h2>
              <p className="text-sm text-white/70">
                Weekly office hours, release breakdowns, and collaborative reviews for Roblox Studio
                teams of any size.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {socials.discord ? (
                <Button
                  asChild
                  variant="default"
                  className="bg-primary text-white hover:bg-primary/90"
                >
                  <Link href={socials.discord} target="_blank" rel="noopener noreferrer">
                    Join Discord
                  </Link>
                </Button>
              ) : null}
              {socials.youtube ? (
                <Button asChild variant="secondary">
                  <Link href={socials.youtube} target="_blank" rel="noopener noreferrer">
                    Watch tutorials
                  </Link>
                </Button>
              ) : null}
              {socials.x ? (
                <Button
                  asChild
                  variant="outline"
                  className="border-white/40 text-white hover:bg-white/10"
                >
                  <Link href={socials.x} target="_blank" rel="noopener noreferrer">
                    Follow updates
                  </Link>
                </Button>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
