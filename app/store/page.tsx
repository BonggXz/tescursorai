import { prisma } from "@/lib/prisma";
import { parseJson, formatPrice } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

interface SearchParams {
  q?: string;
  tag?: string;
  category?: string;
  sort?: string;
  page?: string;
}

export default async function StorePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const query = searchParams.q || "";
  const tag = searchParams.tag;
  const category = searchParams.category;
  const sort = searchParams.sort || "newest";
  const page = parseInt(searchParams.page || "1");
  const pageSize = 12;

  let where: any = { status: "PUBLISHED" };

  if (query) {
    where.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
    ];
  }

  if (tag) {
    where.tags = { contains: tag };
  }

  if (category) {
    where.categories = { contains: category };
  }

  let orderBy: any = {};
  if (sort === "price-asc") {
    orderBy = { priceCents: "asc" };
  } else if (sort === "price-desc") {
    orderBy = { priceCents: "desc" };
  } else if (sort === "popular") {
    // For now, use createdAt as popularity proxy
    orderBy = { createdAt: "desc" };
  } else {
    orderBy = { createdAt: "desc" };
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  // Get all unique tags and categories for filters
  const allProducts = await prisma.product.findMany({
    where: { status: "PUBLISHED" },
    select: { tags: true, categories: true },
  });

  const allTags = new Set<string>();
  const allCategories = new Set<string>();

  allProducts.forEach((p) => {
    parseJson<string[]>(p.tags, []).forEach((tag) => allTags.add(tag));
    parseJson<string[]>(p.categories, []).forEach((cat) => allCategories.add(cat));
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Store</h1>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex gap-4 flex-wrap">
          <Input
            placeholder="Search products..."
            defaultValue={query}
            className="max-w-xs"
          />
          <select
            defaultValue={sort}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="newest">Newest</option>
            <option value="popular">Popular</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        {Array.from(allTags).length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {Array.from(allTags).map((t) => (
              <Link key={t} href={`/store?tag=${encodeURIComponent(t)}`}>
                <Badge
                  variant={tag === t ? "default" : "outline"}
                  className="cursor-pointer"
                >
                  {t}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <p className="text-center text-gray-500 py-12">
          No products found. Try adjusting your filters.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {products.map((product) => {
              const images = parseJson<string[]>(product.images, []);
              const tags = parseJson<string[]>(product.tags, []);
              return (
                <Link key={product.id} href={`/store/${product.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              {page > 1 && (
                <Link href={`/store?page=${page - 1}`}>
                  <Button variant="outline">Previous</Button>
                </Link>
              )}
              <span className="px-4 py-2">
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <Link href={`/store?page=${page + 1}`}>
                  <Button variant="outline">Next</Button>
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
