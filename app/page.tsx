import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { parseJson, formatPrice } from "@/lib/utils";
import Image from "next/image";

export default async function HomePage() {
  const [products, assets, settings] = await Promise.all([
    prisma.product.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.asset.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.siteSettings.findUnique({
      where: { id: "singleton" },
    }),
  ]);

  const socials = settings
    ? parseJson<Record<string, string>>(settings.socials, {})
    : {};

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          {settings?.heroTitle || "Build together. Share faster."}
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          {settings?.heroSubtitle ||
            "A modern hub for Roblox Studio creators."}
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/store">
            <Button size="lg">Visit Store</Button>
          </Link>
          <Link href="/assets">
            <Button size="lg" variant="outline">Browse Assets</Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Quality Assets",
              description: "Curated scripts and models from experienced developers",
            },
            {
              title: "Fair Pricing",
              description: "Transparent pricing for premium Roblox Studio tools",
            },
            {
              title: "Active Community",
              description: "Join thousands of creators sharing and learning together",
            },
          ].map((feature, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Latest Products */}
      {products.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Latest Products</h2>
            <Link href="/store">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const images = parseJson<string[]>(product.images, []);
              const tags = parseJson<string[]>(product.tags, []);
              return (
                <Link key={product.id} href={`/store/${product.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="aspect-video bg-gray-100 relative">
                      {images[0] && (
                        <Image
                          src={images[0]}
                          alt={product.title}
                          fill
                          className="object-cover rounded-t-lg"
                        />
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{product.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {product.description.slice(0, 100)}...
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold">
                          {formatPrice(product.priceCents)}
                        </span>
                        <div className="flex gap-1 flex-wrap">
                          {tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Latest Assets */}
      {assets.length > 0 && (
        <section className="container mx-auto px-4 py-16 bg-gray-50">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Latest Assets</h2>
            <Link href="/assets">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.map((asset) => {
              const tags = parseJson<string[]>(asset.tags, []);
              return (
                <Link key={asset.id} href={`/assets/${asset.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="text-lg">{asset.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {asset.description.slice(0, 150)}...
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">v{asset.version}</Badge>
                        <div className="flex gap-1 flex-wrap">
                          {tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        {asset.downloadCount} downloads
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Social CTA */}
      {socials.discord && (
        <section className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-gray-600 mb-6">
            Connect with other creators, get support, and share your work
          </p>
          <a href={socials.discord} target="_blank" rel="noopener noreferrer">
            <Button size="lg">Join our Discord</Button>
          </a>
        </section>
      )}
    </div>
  );
}
