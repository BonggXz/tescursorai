import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Search, Download } from "lucide-react";

interface SearchParams {
  q?: string;
  category?: string;
  tag?: string;
  page?: string;
}

async function getAssets(searchParams: SearchParams) {
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

  const [assets, total] = await Promise.all([
    prisma.asset.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.asset.count({ where }),
  ]);

  return { assets, total, page, pageSize };
}

export default async function AssetsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { assets, total, page, pageSize } = await getAssets(searchParams);
  const totalPages = Math.ceil(total / pageSize);

  // Get all unique categories and tags for filters
  const allAssets = await prisma.asset.findMany({
    where: { status: "PUBLISHED" },
    select: { categories: true, tags: true },
  });

  const categories = new Set<string>();
  const tags = new Set<string>();
  allAssets.forEach((a) => {
    JSON.parse(a.categories || "[]").forEach((c: string) => categories.add(c));
    JSON.parse(a.tags || "[]").forEach((t: string) => tags.add(t));
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-neutral-900">Assets & Scripts</h1>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <form method="get" className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                name="q"
                placeholder="Search assets..."
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
                  href={`/assets?${new URLSearchParams({
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

        {/* Assets Grid */}
        {assets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-600">No assets found.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
                            <Link
                              key={tag}
                              href={`/assets?tag=${encodeURIComponent(tag)}`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Badge variant="default">{tag}</Badge>
                            </Link>
                          ))}
                        </div>
                        <div className="flex items-center justify-between mt-4 text-sm text-neutral-500">
                          <span>v{asset.version}</span>
                          <span className="flex items-center space-x-1">
                            <Download className="h-4 w-4" />
                            <span>{asset.downloadCount}</span>
                          </span>
                        </div>
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
                    href={`/assets?${new URLSearchParams({
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
                    href={`/assets?${new URLSearchParams({
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
