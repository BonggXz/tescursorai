import { prisma } from "@/lib/prisma";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

async function getProducts(searchParams: { q?: string; tag?: string; category?: string; sort?: string; page?: string }) {
  const page = parseInt(searchParams.page || "1");
  const pageSize = 12;
  const skip = (page - 1) * pageSize;

  const where: any = { status: "PUBLISHED" };

  if (searchParams.q) {
    where.OR = [
      { title: { contains: searchParams.q } },
      { description: { contains: searchParams.q } },
    ];
  }

  if (searchParams.tag) {
    where.tags = { contains: searchParams.tag };
  }

  if (searchParams.category) {
    where.categories = { contains: searchParams.category };
  }

  const orderBy: any = { createdAt: "desc" };
  if (searchParams.sort === "price-asc") {
    orderBy.priceCents = "asc";
  } else if (searchParams.sort === "price-desc") {
    orderBy.priceCents = "desc";
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total, page, pageSize };
}

export default async function StorePage({
  searchParams,
}: {
  searchParams: { q?: string; tag?: string; category?: string; sort?: string; page?: string };
}) {
  const { products, total, page, pageSize } = await getProducts(searchParams);
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container px-4">
          <h1 className="mb-8 text-4xl font-bold">Store</h1>

          {/* Filters */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row">
            <Input
              placeholder="Search products..."
              defaultValue={searchParams.q}
              className="flex-1"
            />
            <select className="h-10 rounded-md border border-neutral-300 px-3">
              <option value="">All Categories</option>
              <option value="UI">UI</option>
              <option value="NPC">NPC</option>
              <option value="Building">Building</option>
              <option value="Combat">Combat</option>
            </select>
            <select className="h-10 rounded-md border border-neutral-300 px-3">
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {/* Products Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                    <div className="flex flex-wrap gap-2 mb-4">
                      {tags.slice(0, 3).map((tag: string) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button className="w-full" asChild>
                      <Link href={`/store/${product.slug}`}>View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={p === page ? "primary" : "outline"}
                  asChild
                >
                  <Link href={`/store?page=${p}`}>{p}</Link>
                </Button>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
