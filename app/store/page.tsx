import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Search } from "lucide-react";

interface SearchParams {
  q?: string;
  category?: string;
  tag?: string;
  sort?: string;
  page?: string;
}

async function getProducts(searchParams: SearchParams) {
  const page = parseInt(searchParams.page || "1");
  const pageSize = 12;
  const skip = (page - 1) * pageSize;

  const where: any = {
    status: "PUBLISHED",
  };

  if (searchParams.q) {
    where.OR = [
      { title: { contains: searchParams.q } },
      { description: { contains: searchParams.q } },
    ];
  }

  if (searchParams.category) {
    where.categories = { contains: searchParams.category };
  }

  if (searchParams.tag) {
    where.tags = { contains: searchParams.tag };
  }

  const orderBy: any = { createdAt: "desc" };
  if (searchParams.sort === "price-asc") {
    orderBy.priceCents = "asc";
  } else if (searchParams.sort === "price-desc") {
    orderBy.priceCents = "desc";
  } else if (searchParams.sort === "popular") {
    // Note: Add a popularity field if needed
    orderBy.createdAt = "desc";
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
  searchParams: SearchParams;
}) {
  const { products, total, page, pageSize } = await getProducts(searchParams);
  const totalPages = Math.ceil(total / pageSize);

  // Get all unique categories and tags for filters
  const allProducts = await prisma.product.findMany({
    where: { status: "PUBLISHED" },
    select: { categories: true, tags: true },
  });

  const categories = new Set<string>();
  const tags = new Set<string>();
  allProducts.forEach((p) => {
    JSON.parse(p.categories || "[]").forEach((c: string) => categories.add(c));
    JSON.parse(p.tags || "[]").forEach((t: string) => tags.add(t));
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-neutral-900">Store</h1>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <form method="get" className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                name="q"
                placeholder="Search products..."
                defaultValue={searchParams.q}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <select
              name="category"
              defaultValue={searchParams.category}
              className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary"
            >
              <option value="">All Categories</option>
              {Array.from(categories).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <select
              name="sort"
              defaultValue={searchParams.sort || "newest"}
              className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary"
            >
              <option value="newest">Newest</option>
              <option value="popular">Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <button type="submit" className="btn-primary">
              Filter
            </button>
          </form>

          {/* Tag Pills */}
          {searchParams.tag && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-600">Active filter:</span>
              <Badge variant="primary">
                {searchParams.tag}
                <Link
                  href={`/store?${new URLSearchParams({
                    ...searchParams,
                    tag: "",
                  }).toString()}`}
                  className="ml-2"
                >
                  ×
                </Link>
              </Badge>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-600">No products found.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {products.map((product) => {
                const images = JSON.parse(product.images || "[]");
                const productTags = JSON.parse(product.tags || "[]");
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
                          {productTags.slice(0, 2).map((tag: string) => (
                            <Link
                              key={tag}
                              href={`/store?tag=${encodeURIComponent(tag)}`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Badge variant="default">{tag}</Badge>
                            </Link>
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                {page > 1 && (
                  <Link
                    href={`/store?${new URLSearchParams({
                      ...searchParams,
                      page: String(page - 1),
                    }).toString()}`}
                    className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50"
                  >
                    Previous
                  </Link>
                )}
                <span className="px-4 py-2 text-neutral-600">
                  Page {page} of {totalPages}
                </span>
                {page < totalPages && (
                  <Link
                    href={`/store?${new URLSearchParams({
                      ...searchParams,
                      page: String(page + 1),
                    }).toString()}`}
                    className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
