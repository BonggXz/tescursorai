import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/Badge";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { notFound } from "next/navigation";

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug, status: "PUBLISHED" },
  });

  if (!product) {
    return null;
  }

  // Get related products
  const categories = JSON.parse(product.categories || "[]");
  const related = await prisma.product.findMany({
    where: {
      status: "PUBLISHED",
      id: { not: product.id },
      categories: {
        contains: categories[0] || "",
      },
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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Link
          href="/store"
          className="inline-flex items-center space-x-2 text-neutral-600 hover:text-primary mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Store</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Images */}
          <div>
            {images.length > 0 ? (
              <div className="aspect-square bg-neutral-200 rounded-lg overflow-hidden">
                <img src={images[0]} alt={product.title} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="aspect-square bg-neutral-200 rounded-lg flex items-center justify-center">
                <span className="text-neutral-400">No image</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <h1 className="text-4xl font-bold mb-4 text-neutral-900">{product.title}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map((cat: string) => (
                <Badge key={cat} variant="default">
                  {cat}
                </Badge>
              ))}
              {tags.map((tag: string) => (
                <Badge key={tag} variant="primary">
                  {tag}
                </Badge>
              ))}
            </div>
            <p className="text-3xl font-bold text-primary mb-6">
              ${(product.priceCents / 100).toFixed(2)}
            </p>
            <div className="prose max-w-none mb-6">
              <p className="text-neutral-600 whitespace-pre-wrap">{product.description}</p>
            </div>
            {product.robloxAssetId && (
              <p className="text-sm text-neutral-500 mb-6">
                Roblox Asset ID: <code className="bg-neutral-100 px-2 py-1 rounded">{product.robloxAssetId}</code>
              </p>
            )}
            <button className="btn-primary inline-flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6 text-neutral-900">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((relatedProduct) => {
                const relatedImages = JSON.parse(relatedProduct.images || "[]");
                return (
                  <Link key={relatedProduct.id} href={`/store/${relatedProduct.slug}`}>
                    <div className="card h-full">
                      {relatedImages[0] && (
                        <div className="aspect-video bg-neutral-200 relative overflow-hidden">
                          <img
                            src={relatedImages[0]}
                            alt={relatedProduct.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold text-neutral-900 mb-2">{relatedProduct.title}</h3>
                        <p className="text-lg font-bold text-primary">
                          ${(relatedProduct.priceCents / 100).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
