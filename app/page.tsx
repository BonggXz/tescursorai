import { prisma } from "@/lib/prisma";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";

async function getFeaturedContent() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  
  const featuredProductIds = settings?.featuredProductIds 
    ? JSON.parse(settings.featuredProductIds) 
    : [];
  const featuredAssetIds = settings?.featuredAssetIds 
    ? JSON.parse(settings.featuredAssetIds) 
    : [];

  const products = await prisma.product.findMany({
    where: { slug: { in: featuredProductIds }, status: "PUBLISHED" },
    take: 8,
    orderBy: { createdAt: "desc" },
  });

  const assets = await prisma.asset.findMany({
    where: { slug: { in: featuredAssetIds }, status: "PUBLISHED" },
    take: 6,
    orderBy: { createdAt: "desc" },
  });

  return { products, assets, settings };
}

export default async function HomePage() {
  const { products, assets, settings } = await getFeaturedContent();
  const socials = settings?.socials ? JSON.parse(settings.socials) : {};

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-neutral-200 bg-gradient-to-b from-neutral-50 to-white py-20">
          <div className="container px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 text-5xl font-bold tracking-tight text-neutral-900">
                {settings?.heroTitle || "Build together. Share faster."}
              </h1>
              <p className="mb-8 text-xl text-neutral-600">
                {settings?.heroSubtitle || "A modern hub for Roblox Studio creators."}
              </p>
              <div className="flex justify-center gap-4">
                <Button size="lg" asChild>
                  <Link href="/store">Visit Store</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/assets">Browse Assets</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">Why Choose Us</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { title: "Quality Assets", desc: "Curated collection of high-quality scripts and assets" },
                { title: "Active Community", desc: "Join thousands of developers sharing knowledge" },
                { title: "Regular Updates", desc: "New content added weekly from the community" },
              ].map((feature) => (
                <Card key={feature.title}>
                  <CardHeader>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.desc}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        {products.length > 0 && (
          <section className="border-t border-neutral-200 bg-neutral-50 py-16">
            <div className="container px-4">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-3xl font-bold">Featured Products</h2>
                <Link href="/store" className="text-primary hover:underline">
                  View all →
                </Link>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {products.map((product) => {
                  const images = JSON.parse(product.images || "[]");
                  const tags = JSON.parse(product.tags || "[]");
                  return (
                    <Card key={product.id} className="overflow-hidden">
                      <div className="aspect-video bg-neutral-200" />
                      <CardHeader>
                        <CardTitle className="text-lg">{product.title}</CardTitle>
                        <CardDescription>${(product.priceCents / 100).toFixed(2)}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {tags.slice(0, 2).map((tag: string) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <Button className="mt-4 w-full" asChild>
                          <Link href={`/store/${product.slug}`}>View Details</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Latest Assets */}
        {assets.length > 0 && (
          <section className="border-t border-neutral-200 py-16">
            <div className="container px-4">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-3xl font-bold">Latest Assets</h2>
                <Link href="/assets" className="text-primary hover:underline">
                  View all →
                </Link>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {assets.map((asset) => {
                  const tags = JSON.parse(asset.tags || "[]");
                  return (
                    <Card key={asset.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{asset.title}</CardTitle>
                        <CardDescription>v{asset.version} • {asset.downloadCount} downloads</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {tags.slice(0, 3).map((tag: string) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <Button className="mt-4 w-full" variant="outline" asChild>
                          <Link href={`/assets/${asset.slug}`}>Download</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
