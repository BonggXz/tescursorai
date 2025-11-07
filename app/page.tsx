import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, Code, Store, Package, Zap, Users, Shield } from "lucide-react";

async function getFeaturedContent() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "singleton" },
  });

  const featuredProductIds = settings?.featuredProductIds
    ? JSON.parse(settings.featuredProductIds)
    : [];
  const featuredAssetIds = settings?.featuredAssetIds
    ? JSON.parse(settings.featuredAssetIds)
    : [];

  const [products, assets] = await Promise.all([
    prisma.product.findMany({
      where: {
        status: "PUBLISHED",
        ...(featuredProductIds.length > 0 && { id: { in: featuredProductIds } }),
      },
      take: featuredProductIds.length > 0 ? featuredProductIds.length : 8,
      orderBy: { createdAt: "desc" },
    }),
    prisma.asset.findMany({
      where: {
        status: "PUBLISHED",
        ...(featuredAssetIds.length > 0 && { id: { in: featuredAssetIds } }),
      },
      take: featuredAssetIds.length > 0 ? featuredAssetIds.length : 6,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return { products, assets, settings };
}

export default async function HomePage() {
  const { products, assets, settings } = await getFeaturedContent();
  const socials = settings?.socials ? JSON.parse(settings.socials) : {};

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 to-neutral-50 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-6 text-balance">
                {settings?.heroTitle || "Build together. Share faster."}
              </h1>
              <p className="text-xl text-neutral-600 mb-8 text-balance">
                {settings?.heroSubtitle || "A modern hub for Roblox Studio creators."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/store" className="btn-primary inline-flex items-center justify-center space-x-2">
                  <Store className="h-5 w-5" />
                  <span>Visit Store</span>
                </Link>
                <Link href="/assets" className="btn-secondary inline-flex items-center justify-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>Browse Assets</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-neutral-900">
              Why Choose Our Community?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Code className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Quality Scripts</h3>
                <p className="text-neutral-600">
                  Curated collection of production-ready Lua scripts and Roblox assets.
                </p>
              </Card>
              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Fast Downloads</h3>
                <p className="text-neutral-600">
                  Instant access to free assets. No waiting, no hassle.
                </p>
              </Card>
              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Active Community</h3>
                <p className="text-neutral-600">
                  Join thousands of developers sharing and learning together.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        {products.length > 0 && (
          <section className="py-20 bg-neutral-50">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-neutral-900">Featured Products</h2>
                <Link
                  href="/store"
                  className="text-primary hover:text-primary-hover inline-flex items-center space-x-1"
                >
                  <span>View All</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => {
                  const images = JSON.parse(product.images || "[]");
                  const tags = JSON.parse(product.tags || "[]");
                  return (
                    <Link key={product.id} href={`/store/${product.slug}`}>
                      <Card className="h-full">
                        {images[0] && (
                          <div className="aspect-video bg-neutral-200 relative overflow-hidden">
                            <img
                              src={images[0]}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <h3 className="font-semibold text-neutral-900 mb-2">{product.title}</h3>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {tags.slice(0, 2).map((tag: string) => (
                              <Badge key={tag} variant="default">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-lg font-bold text-primary">
                            ${(product.priceCents / 100).toFixed(2)}
                          </p>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Featured Assets */}
        {assets.length > 0 && (
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-neutral-900">Latest Assets</h2>
                <Link
                  href="/assets"
                  className="text-primary hover:text-primary-hover inline-flex items-center space-x-1"
                >
                  <span>View All</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {assets.map((asset) => {
                  const tags = JSON.parse(asset.tags || "[]");
                  return (
                    <Link key={asset.id} href={`/assets/${asset.slug}`}>
                      <Card className="h-full">
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-semibold text-neutral-900 text-lg">{asset.title}</h3>
                            <Badge variant="success">Free</Badge>
                          </div>
                          <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                            {asset.description.substring(0, 100)}...
                          </p>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {tags.slice(0, 3).map((tag: string) => (
                              <Badge key={tag} variant="default">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center justify-between mt-4 text-sm text-neutral-500">
                            <span>v{asset.version}</span>
                            <span>{asset.downloadCount} downloads</span>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Social Links */}
        {Object.keys(socials).length > 0 && (
          <section className="py-12 bg-neutral-900 text-neutral-50">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-2xl font-bold mb-6">Join Our Community</h2>
              <div className="flex flex-wrap justify-center gap-4">
                {socials.discord && (
                  <a
                    href={socials.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    Discord
                  </a>
                )}
                {socials.whatsapp && (
                  <a
                    href={socials.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    WhatsApp
                  </a>
                )}
                {socials.youtube && (
                  <a
                    href={socials.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    YouTube
                  </a>
                )}
                {socials.x && (
                  <a
                    href={socials.x}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    X (Twitter)
                  </a>
                )}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
