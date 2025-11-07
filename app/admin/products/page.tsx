import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { parseJson, formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default async function AdminProductsPage() {
  await requireAdmin();

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link href="/admin/products/new">
          <Button>New Product</Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            No products yet. Create your first product!
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {products.map((product) => {
            const images = parseJson<string[]>(product.images, []);
            const tags = parseJson<string[]>(product.tags, []);
            return (
              <Card key={product.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{product.title}</CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatPrice(product.priceCents)} • Slug: {product.slug}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge
                        variant={
                          product.status === "PUBLISHED"
                            ? "default"
                            : product.status === "DRAFT"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {product.status}
                      </Badge>
                      <Link href={`/admin/products/${product.id}`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {product.description}
                  </p>
                  {tags.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {tags.slice(0, 5).map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
