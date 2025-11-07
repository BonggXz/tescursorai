import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

async function getProducts() {
  return await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export default async function AdminProductsPage() {
  await requireAdmin();
  const products = await getProducts();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container px-4">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-4xl font-bold">Products</h1>
            <Button asChild>
              <Link href="/admin/products/new">Add Product</Link>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Title</th>
                      <th className="text-left p-2">Price</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b">
                        <td className="p-2">{product.title}</td>
                        <td className="p-2">${(product.priceCents / 100).toFixed(2)}</td>
                        <td className="p-2">
                          <Badge variant={product.status === "PUBLISHED" ? "default" : "secondary"}>
                            {product.status}
                          </Badge>
                        </td>
                        <td className="p-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/products/${product.id}`}>Edit</Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
