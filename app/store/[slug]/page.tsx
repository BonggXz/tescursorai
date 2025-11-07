import { prisma } from "@/lib/prisma";
import { parseJson, formatPrice } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product || product.status !== "PUBLISHED") {
    notFound();
  }

  const images = parseJson<string[]>(product.images, []);
  const tags = parseJson<string[]>(product.tags, []);
  const categories = parseJson<string[]>(product.categories, []);

  // Get related products
  const relatedProducts = await prisma.product.findMany({
    where: {
      status: "PUBLISHED",
      id: { not: product.id },
      OR: [
        { categories: { contains: categories[0] || "" } },
        { tags: { contains: tags[0] || "" } },
      ],
    },
    take: 4,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Images */}
        <div className="space-y-4">
          {images.length > 0 ? (
            <div className="aspect-square bg-gray-100 relative rounded-lg overflow-hidden">
              <Image
                src={images[0]}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.slice(1, 5).map((img, idx) => (
                <div
                  key={idx}
                  className="aspect-square bg-gray-100 relative rounded overflow-hidden"
                >
                  <Image src={img} alt={`${product.title} ${idx + 2}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
          <p className="text-3xl font-bold text-primary mb-6">
            {formatPrice(product.priceCents)}
          </p>

          <div className="mb-6">
            <div className="flex gap-2 flex-wrap mb-4">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            {categories.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {categories.map((cat) => (
                  <Badge key={cat} variant="outline">
                    {cat}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="prose max-w-none mb-6">
            <p className="text-gray-700 whitespace-pre-wrap">
              {product.description}
            </p>
          </div>

          {product.robloxAssetId && (
            <p className="text-sm text-gray-600 mb-6">
              Roblox Asset ID: {product.robloxAssetId}
            </p>
          )}

          <Button size="lg" className="w-full mb-4">
            Buy Now
          </Button>
          <p className="text-sm text-gray-500 text-center">
            Checkout integration ready (Stripe behind feature flag)
          </p>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((related) => {
              const relatedImages = parseJson<string[]>(related.images, []);
              const relatedTags = parseJson<string[]>(related.tags, []);
              return (
                <Link key={related.id} href={`/store/${related.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="aspect-video bg-gray-100 relative">
                      {relatedImages[0] && (
                        <Image
                          src={relatedImages[0]}
                          alt={related.title}
                          fill
                          className="object-cover rounded-t-lg"
                        />
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{related.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold">
                          {formatPrice(related.priceCents)}
                        </span>
                        <div className="flex gap-1">
                          {relatedTags.slice(0, 1).map((tag) => (
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
        </div>
      )}
    </div>
  );
}
