import { prisma } from "@/lib/prisma";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug, status: "PUBLISHED" },
  });

  if (!product) {
    return null;
  }

  // Get related products
  const tags = JSON.parse(product.tags || "[]");
  const related = await prisma.product.findMany({
    where: {
      id: { not: product.id },
      status: "PUBLISHED",
      tags: { contains: tags[0] || "" },
    },
    take: 4,
  });

  return { product, related };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const result = await getProduct(params.slug);

  if (!result) {
    notFound();
  }

  const { product, related } = result;
  const images = JSON.parse(product.images || "[]");
  const tags = JSON.parse(product.tags || "[]");
  const categories = JSON.parse(product.categories || "[]");

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container px-4">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <div className="aspect-square bg-neutral-200 rounded-lg mb-4" />
              <div className="flex gap-2">
                {images.map((img: string, i: number) => (
                  <div key={i} className="w-20 h-20 bg-neutral-200 rounded" />
                ))}
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
              <p className="text-3xl font-bold text-primary mb-6">
                ${(product.priceCents / 100).toFixed(2)}
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {tags.map((tag: string) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
              <div className="prose mb-6" dangerouslySetInnerHTML={{ __html: product.description }} />
              {product.robloxAssetId && (
                <p className="text-sm text-neutral-600 mb-6">
                  Roblox Asset ID: {product.robloxAssetId}
                </p>
              )}
              <Button size="lg" className="w-full">
                Buy Now
              </Button>
            </div>
          </div>

          {related.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-bold mb-6">Related Products</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {related.map((p) => {
                  const pTags = JSON.parse(p.tags || "[]");
                  return (
                    <Card key={p.id}>
                      <div className="aspect-video bg-neutral-200" />
                      <CardHeader>
                        <CardTitle className="text-lg">{p.title}</CardTitle>
                        <CardDescription>${(p.priceCents / 100).toFixed(2)}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {pTags.slice(0, 2).map((tag: string) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <Button className="w-full" variant="outline" asChild>
                          <a href={`/store/${p.slug}`}>View</a>
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
